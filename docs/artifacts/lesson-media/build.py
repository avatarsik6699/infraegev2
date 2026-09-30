"""Сборка иллюстраций: сцены → WebM VP9 + MP4 H.264 + постер WebP (видео) или один WebP (статика).

    uv run --no-project --with pillow python docs/artifacts/lesson-media/build.py [--only NAME] [--list] [--out DIR]

Нужен ffmpeg с libvpx-vp9 и libx264 (для видео). Сцены находятся автоматически: модуль в этой
папке с `NAME` и `build()`. `LESSON` — папка урока в `apps/web/public/lesson-media/`, `LESSON = None` —
эталонные сцены, они собираются в `reference/` и в уроки не попадают. `KIND` — «video» (по умолчанию)
или «still». Итоги (размеры, длительность, предупреждения) пишутся в `manifest.json`.
"""

import argparse
import glob
import importlib
import json
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

FPS = 24
KEYFRAME_EVERY = 120  # ключевой кадр каждые 5 с: чаще файлы сильно тяжелее, реже перемотка запаздывает
MAX_WIDTH = 1200  # шире не нужно: в колонке чтения ролик занимает около 640 px (1280 на плотных экранах)
BUDGET_KB = 300  # ориентир, не запрет: важнее понятность
NOT_SCENES = {"handdrawn", "build"}
PUBLIC = os.path.join(HERE, "..", "..", "..", "apps", "web", "public", "lesson-media")
REFERENCE = os.path.join(HERE, "reference")
MANIFEST = os.path.join(HERE, "manifest.json")


def discover():
    """Модули-сцены: есть `NAME` и `build()`. Порядок стабильный (по имени файла)."""
    scenes = []
    for path in sorted(glob.glob(os.path.join(HERE, "*.py"))):
        name = os.path.splitext(os.path.basename(path))[0]
        if name in NOT_SCENES or name.startswith("_") or name.endswith("_test"):
            continue
        # Only Python files discovered in this repository-owned directory are imported.
        module = importlib.import_module(name)  # nosemgrep: python.lang.security.audit.non-literal-import.non-literal-import
        if hasattr(module, "NAME") and callable(getattr(module, "build", None)):
            scenes.append(module)
    return scenes


def out_dir_for(module, override):
    if getattr(module, "LESSON", None):
        return os.path.join(override or PUBLIC, module.LESSON)
    return override or REFERENCE


def encode(frames, out_dir, name):
    src = os.path.join(frames, "f%04d.png")
    base = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", src, "-an", "-pix_fmt", "yuv420p", "-vf", f"scale='min({MAX_WIDTH},iw)':-2:flags=lanczos"]
    gop = ["-g", str(KEYFRAME_EVERY)]
    subprocess.run(
        base + ["-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0", "-deadline", "good", "-cpu-used", "1", *gop]
        + [os.path.join(out_dir, f"{name}.webm")],
        check=True,
    )
    subprocess.run(
        base + ["-c:v", "libx264", "-crf", "30", "-preset", "slow", *gop, "-keyint_min", str(KEYFRAME_EVERY), "-sc_threshold", "0", "-movflags", "+faststart"]
        + [os.path.join(out_dir, f"{name}.mp4")],
        check=True,
    )


def build_video(module, scene, out_dir):
    frames = tempfile.mkdtemp(prefix=f"{module.NAME}-")
    try:
        held = None
        for i in range(int(FPS * scene.duration)):
            t = i / FPS
            settled = scene.settled_at <= t < scene.fade_start
            if settled and held is not None:
                frame = held
            else:
                frame = scene.render(t)
                if settled:
                    held = frame
            frame.save(os.path.join(frames, f"f{i:04d}.png"))
        scene.render_still().save(os.path.join(out_dir, f"{module.NAME}-poster.webp"), quality=84, method=6)
        encode(frames, out_dir, module.NAME)
    finally:
        shutil.rmtree(frames, ignore_errors=True)
    return {
        ext: os.path.getsize(os.path.join(out_dir, f"{module.NAME}.{ext}")) // 1024 for ext in ("webm", "mp4")
    } | {"poster": os.path.getsize(os.path.join(out_dir, f"{module.NAME}-poster.webp")) // 1024}


def build_still(module, scene, out_dir):
    image = scene.render_still()
    kind_ext = "png" if not getattr(module, "LESSON", None) else "webp"
    path = os.path.join(out_dir, f"{module.NAME}.{kind_ext}")
    if kind_ext == "png":
        image.save(path)
    else:
        image.save(path, quality=84, method=6)
    return {kind_ext: os.path.getsize(path) // 1024}


def build_scene(module, override):
    scene, meta = module.build()
    out_dir = out_dir_for(module, override)
    os.makedirs(out_dir, exist_ok=True)
    kind = getattr(module, "KIND", "video")
    sizes = (build_video if kind == "video" else build_still)(module, scene, out_dir)
    warnings = scene.warnings()
    if kind == "video":
        warnings += [f"{k} {v} КБ выше ориентира {BUDGET_KB} КБ" for k, v in sizes.items() if k != "poster" and v > BUDGET_KB]
    return {
        "name": module.NAME,
        "lesson": getattr(module, "LESSON", None),
        "kind": kind,
        "width": scene.width,
        "height": scene.height,
        "duration_s": round(scene.duration, 1) if kind == "video" else None,
        "size_kb": sizes,
        "warnings": warnings,
        **meta,
    }


def write_manifest(entries):
    known = {}
    if os.path.exists(MANIFEST):
        with open(MANIFEST, encoding="utf8") as handle:
            known = {item["name"]: item for item in json.load(handle)}
    known.update({item["name"]: item for item in entries})
    with open(MANIFEST, "w", encoding="utf8") as handle:
        json.dump([known[k] for k in sorted(known)], handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="собрать сцены по NAME (несколько через запятую)")
    parser.add_argument("--list", action="store_true", help="показать найденные сцены и выйти")
    parser.add_argument("--out", help="каталог вместо apps/web/public/lesson-media (или reference/)")
    args = parser.parse_args()
    scenes = discover()
    if args.list:
        for m in scenes:
            print(f"{m.NAME}\t{getattr(m, 'LESSON', None)}\t{getattr(m, 'KIND', 'video')}")
        return
    wanted = args.only.split(",") if args.only else None
    chosen = [m for m in scenes if wanted is None or m.NAME in wanted]
    if not chosen:
        sys.exit(f"нет сцены {args.only!r}; доступные: {', '.join(m.NAME for m in scenes)}")
    entries = [build_scene(m, args.out) for m in chosen]
    write_manifest(entries)
    for item in entries:
        for warning in item["warnings"]:
            print(f"note: {item['name']}: {warning}", file=sys.stderr)
    print(json.dumps(entries, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
