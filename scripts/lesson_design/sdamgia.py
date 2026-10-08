"""Download and parse task collections of inf-ege.sdamgia.ru for frequency analysis.

Usage:
    python3 -I scripts/lesson_design/sdamgia.py catalog OUT_DIR
        save the task catalogue and print the categories of every exam task
        (category id, name, number of tasks)
    python3 -I scripts/lesson_design/sdamgia.py fetch OUT_DIR THEME_ID [THEME_ID ...]
        save the print version of each category and a parsed JSON next to it

OUT_DIR must be a scratch folder outside the repository: downloaded pages are
untrusted data and are never committed. The JSON holds, per task: id, source
label (exam wave, demo, StatGrad…) and the statement text, used only to tag the
task type. Statements are not copied into lessons (originality rule, SPEC §2.3).

The print version (``test?theme=ID&print=true``) is used because the ordinary
page embeds large images and is truncated by page-fetching tools.
"""

import html
import json
import re
import sys
import urllib.request
from pathlib import Path

BASE = "https://inf-ege.sdamgia.ru"
UA = {"User-Agent": "Mozilla/5.0"}


def get(url: str) -> str:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read().decode("utf-8", errors="replace")


def text_of(fragment: str) -> str:
    fragment = re.sub(r"<script.*?</script>", "", fragment, flags=re.S)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    fragment = html.unescape(fragment).replace("\xad", "")
    return re.sub(r"\s+", " ", fragment).strip()


def parse_collection(page: str) -> list[dict]:
    page = re.sub(r'data:image[^"]*', "", page)
    tasks = []
    for part in re.split(r'<div width=100% class="prob_maindiv"', page)[1:]:
        task_id = re.search(r"problem\?id=(\d+)", part)
        if not task_id:
            continue
        source = re.search(r"Источник:(.*?)</span>", part, re.S)
        body = re.search(
            r'class="pbody">(.*?)(?:<div[^>]*class="(?:solution|answer)|Ре­ше­ние|Решение)',
            part,
            re.S,
        )
        tasks.append(
            {
                "id": int(task_id.group(1)),
                "source": text_of(source.group(1)) if source else "",
                "text": text_of(body.group(1)) if body else text_of(part)[:1500],
            }
        )
    return tasks


def catalog(out: Path) -> None:
    page = get(f"{BASE}/prob_catalog")
    (out / "catalog.html").write_text(page, encoding="utf-8")
    page = page.replace("&shy;", "")
    for block in re.split(r'<span class="pcat_num">', page)[1:]:
        head = re.match(r"(\d+)</span>\.?\s*([^<]*)", block)
        if not head:
            continue
        print(f"Задание {head.group(1)}. {head.group(2).strip()}")
        for m in re.finditer(
            r'data-id="(\d+)".*?class="cat_name"[^>]*>(.*?)</a>'
            r'<div class="cat_count">(\d+)',
            block.split("cat_sum")[0],
        ):
            print(f"  theme {m.group(1)}: {text_of(m.group(2))} — {m.group(3)} задач")


def fetch(out: Path, themes: list[str]) -> None:
    for theme in themes:
        page = get(f"{BASE}/test?theme={theme}&print=true")
        (out / f"theme-{theme}.html").write_text(page, encoding="utf-8")
        tasks = parse_collection(page)
        (out / f"theme-{theme}.json").write_text(
            json.dumps(tasks, ensure_ascii=False, indent=1), encoding="utf-8"
        )
        print(f"theme {theme}: {len(tasks)} tasks -> {out / f'theme-{theme}.json'}")


if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] not in {"catalog", "fetch"}:
        raise SystemExit(__doc__)
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    if sys.argv[1] == "catalog":
        catalog(out_dir)
    else:
        fetch(out_dir, sys.argv[3:])
