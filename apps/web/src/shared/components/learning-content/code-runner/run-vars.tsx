import { useLayoutEffect, useRef, useState } from "react";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";
import styles from "./code-runner.module.css";

type RunVarsProps = {
  step: LessonMediaTypes.RunStep;
  /** The first step: nothing is «changed» yet. */
  first: boolean;
  hidden: boolean;
};

const objectKind = (value: string): string => {
  if (value.startsWith("[")) return "список";
  if (
    value === "set()" ||
    (value.startsWith("{") && value !== "{}" && !value.includes(":"))
  )
    return "множество";
  return "словарь";
};

const isFunction = (value: string) =>
  value === "функция" || value === "генератор";

/** Frames nested in the program frame: the deepest call is the active one. */
const Frames: React.FC<{
  frames: readonly LessonMediaTypes.RunFrame[];
  depth: number;
  first: boolean;
  titled: boolean;
}> = (props) => {
  const frame = props.frames[props.depth];
  if (!frame) return null;
  const isCall = props.depth > 0;
  const active = isCall && props.depth === props.frames.length - 1;
  return (
    <div
      className={styles.frame}
      data-call={isCall || undefined}
      data-active={active || undefined}
      // values of one frame start in one column, as on the stand
      style={
        {
          "--vn": `${String(Math.max(3, ...frame.names.map((name) => name.n.length)))}ch`,
        } as React.CSSProperties
      }
    >
      {isCall || props.titled ? (
        <span className={styles.frameTitle}>{frame.title}</span>
      ) : null}
      {frame.names.length === 0 && props.depth === props.frames.length - 1 ? (
        <span className={styles.empty}>пока нет</span>
      ) : null}
      {frame.names.map((name) => (
        <div
          key={name.n}
          className={styles.name}
          data-changed={(name.ch && !props.first) || undefined}
          data-function={isFunction(name.v) || undefined}
        >
          <span className={styles.nameLabel}>{name.n}</span>
          {name.ref === null ? (
            <span className={styles.value}>{name.v}</span>
          ) : (
            <span
              className={styles.ref}
              data-ref={name.ref}
              aria-label={`ссылка на объект ${name.v}`}
            />
          )}
        </div>
      ))}
      <Frames
        frames={props.frames}
        depth={props.depth + 1}
        first={props.first}
        titled={props.titled}
      />
    </div>
  );
};

type Link = { d: string; head: string; hot: boolean };

/**
 * Variables of one recorded step. Each object stands at the height of the
 * first name that leads to it, so the arrows run almost straight; the arrows
 * are measured after layout and redrawn when the panel resizes.
 */
export const RunVars: React.FC<RunVarsProps> = (props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const objectsRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const objectKeys = Object.keys(props.step.objs);
  const titled = props.step.frames.length > 1;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const objects = objectsRef.current;
    if (!root || !objects) return;
    const draw = () => {
      const top0 = objects.getBoundingClientRect().top;
      let bottom = 0;
      objects.querySelectorAll<HTMLElement>("[data-object]").forEach((box) => {
        const dot = root.querySelector(
          `[data-ref="${box.dataset.object ?? ""}"]`,
        );
        const want = dot ? dot.getBoundingClientRect().top - top0 - 6 : bottom;
        const y = Math.max(want, bottom);
        box.style.top = `${String(y)}px`;
        bottom = y + box.offsetHeight + 10;
      });
      objects.style.height = `${String(bottom)}px`;
      const base = root.getBoundingClientRect();
      const next: Link[] = [];
      root.querySelectorAll<HTMLElement>("[data-ref]").forEach((dot) => {
        const target = objects.querySelector(
          `[data-object="${dot.dataset.ref ?? ""}"]`,
        );
        if (!target) return;
        const a = dot.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        const x1 = a.left + a.width / 2 - base.left;
        const y1 = a.top + a.height / 2 - base.top;
        const x2 = b.left - base.left - 2;
        const y2 = b.top + Math.min(b.height / 2, 16) - base.top;
        const dx = Math.max(24, (x2 - x1) / 2);
        next.push({
          d: `M${String(x1)} ${String(y1)} C${String(x1 + dx)} ${String(y1)} ${String(x2 - dx)} ${String(y2)} ${String(x2 - 7)} ${String(y2)}`,
          head: `M${String(x2)} ${String(y2)} l-8 -4.5 v9 z`,
          hot: dot.closest("[data-changed]") !== null,
        });
      });
      setSize({ width: base.width, height: base.height });
      setLinks(next);
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(root);
    return () => observer.disconnect();
  }, [props.step]);

  return (
    <div
      ref={rootRef}
      className={`${styles.layer} ${styles.vars}`}
      data-current={!props.hidden || undefined}
      data-objects={objectKeys.length > 0 || undefined}
      aria-hidden={props.hidden || undefined}
    >
      <div className={styles.frames}>
        <Frames
          frames={props.step.frames}
          depth={0}
          first={props.first}
          titled={titled}
        />
      </div>
      {objectKeys.length > 0 ? (
        <div ref={objectsRef} className={styles.objects}>
          {objectKeys.map((key) => {
            const object = props.step.objs[key];
            if (!object) return null;
            return (
              <div
                key={key}
                className={styles.object}
                data-object={key}
                data-changed={(object.ch && !props.first) || undefined}
              >
                <span className={styles.objectKind}>
                  {objectKind(object.v)}
                </span>
                <code>{object.v}</code>
              </div>
            );
          })}
        </div>
      ) : null}
      {links.length > 0 ? (
        <svg
          className={styles.links}
          width={size.width}
          height={size.height}
          aria-hidden="true"
        >
          {links.map((link, k) => (
            <g key={k} data-hot={link.hot || undefined}>
              <path className={styles.link} d={link.d} />
              <path className={styles.linkHead} d={link.head} />
            </g>
          ))}
        </svg>
      ) : null}
    </div>
  );
};
