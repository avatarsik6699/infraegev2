import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  Play,
  Tag,
  X,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "~/shared/components/button";
import {
  CodeBlock,
  CodeBlockLabel,
  CodeBlockOutput,
} from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";
import { RunVars } from "./run-vars";
import styles from "./code-runner.module.css";

export type CodeRunnerProps = Omit<LessonMediaTypes.Run, "kind"> & {
  kind?: "run";
  label: string;
};

/** Explanation of a step: `code` in backticks becomes inline code. */
export const richText = (text: string): React.ReactNode[] =>
  text
    .split(/(`[^`]+`)/u)
    .map((part, index) =>
      part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
        <Notation key={index}>{part.slice(1, -1)}</Notation>
      ) : (
        part
      ),
    );

const hasNames = (steps: readonly LessonMediaTypes.RunStep[]) =>
  steps.some((step) => step.frames.some((frame) => frame.names.length > 0));

/**
 * A runnable code block (Change 175): the program as an ordinary code block
 * with «Запуск» in its head. Running steps through a run recorded when the
 * lesson was exported — nothing executes in the browser: the line that just
 * ran, the variables (call frames, lists and dictionaries as objects with
 * arrows), a plain-language note and the output so far. Every step is laid
 * out in the same grid cell, so the block keeps the height of its tallest
 * step and nothing below it moves while stepping. Without JavaScript it is the
 * ordinary code block with its output.
 */
export const CodeRunner: React.FC<CodeRunnerProps> = (props) => {
  const enhanced = useIsEnhanced();
  const [running, setRunning] = useState(false);
  const last = props.steps.length - 1;
  const [index, setIndex] = useState(Math.min(1, last));
  const rootRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const step = props.steps[index] ?? props.steps[0];
  const withNames = hasNames(props.steps);
  const withObjects = props.steps.some(
    (each) => Object.keys(each.objs).length > 0,
  );
  const [side, setSide] = useState(false);

  // Beside the code when the code leaves the panel enough room (the stand's
  // rule): measured from the widest code line, again on every resize.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!running || !withNames || !root) return;
    const measure = () => {
      // the text of a line ends at its last chunk; the line itself fills the block
      const code = root.querySelector<HTMLElement>("[data-code-scroll] code");
      if (!code) return;
      const left = code.getBoundingClientRect().left;
      let widest = 0;
      code
        .querySelectorAll<HTMLElement>(":scope > span > span:last-child")
        .forEach((text) => {
          widest = Math.max(widest, text.getBoundingClientRect().right - left);
        });
      const room = root.clientWidth - widest - 40;
      setSide(room >= (withObjects ? 330 : 250));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [running, withNames, withObjects]);

  const open = () => {
    setIndex(Math.min(1, last));
    setRunning(true);
    requestAnimationFrame(() =>
      rootRef.current?.focus({ preventScroll: true }),
    );
  };
  const close = () => {
    setRunning(false);
    requestAnimationFrame(() => goRef.current?.focus());
  };
  const move = (delta: number) =>
    setIndex((current) => Math.max(0, Math.min(last, current + delta)));

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!running) return;
    if (event.key === "ArrowRight") move(1);
    else if (event.key === "ArrowLeft") move(-1);
    else if (event.key === "Escape") close();
    else return;
    event.preventDefault();
  };

  const controls = (
    <span className={styles.controls}>
      <Button
        className={styles.step}
        surface="code"
        density="compact"
        hierarchy="quiet"
        iconOnly
        iconStart={<ChevronLeft aria-hidden="true" size={16} />}
        aria-label="Предыдущий шаг"
        title="Предыдущий шаг"
        type="button"
        disabled={index === 0}
        onClick={() => move(-1)}
      >
        Предыдущий шаг
      </Button>
      <span className={styles.count} aria-live="polite">
        {`${String(index)} / ${String(last)}`}
      </span>
      <Button
        className={styles.step}
        surface="code"
        density="compact"
        hierarchy="quiet"
        iconOnly
        iconStart={<ChevronRight aria-hidden="true" size={16} />}
        aria-label="Следующий шаг"
        title="Следующий шаг"
        type="button"
        disabled={index === last}
        onClick={() => move(1)}
      >
        Следующий шаг
      </Button>
      <Button
        className={`${styles.step} ${styles.close}`}
        surface="code"
        density="compact"
        hierarchy="quiet"
        iconOnly
        iconStart={<X aria-hidden="true" size={16} />}
        aria-label="Закончить пошаговый запуск"
        title="Закончить пошаговый запуск"
        type="button"
        onClick={close}
      >
        Закончить пошаговый запуск
      </Button>
    </span>
  );
  const go = (
    <Button
      ref={goRef}
      className={styles.go}
      surface="code"
      density="compact"
      hierarchy="quiet"
      iconStart={<Play aria-hidden="true" size={15} />}
      aria-label="Выполнить программу по шагам"
      type="button"
      onClick={open}
    >
      Запуск
    </Button>
  );

  let actions: React.ReactNode = null;
  if (enhanced) actions = running ? controls : go;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      tabIndex={running ? -1 : undefined}
      onKeyDown={onKeyDown}
      data-code-runner
      data-running={running || undefined}
      data-side={(running && side) || undefined}
    >
      <CodeBlock
        code={props.code}
        language="python"
        label={props.label}
        fileName={props.fileName}
        output={props.output}
        error={props.error}
        headerActions={actions}
        collapsible={!running}
        activeLine={running && step.line ? step.line : undefined}
        activeLineTone={step.stop ? "error" : "current"}
        codeAside={
          running && withNames ? (
            <div className={styles.aside}>
              <p className={styles.heading}>
                <CodeBlockLabel icon={Tag}>Переменные:</CodeBlockLabel>
              </p>
              <div className={styles.stack}>
                {props.steps.map((each, k) => (
                  <RunVars
                    key={k}
                    step={each}
                    first={k === 0}
                    hidden={k !== index}
                  />
                ))}
              </div>
            </div>
          ) : undefined
        }
        footer={
          running ? (
            <div className={styles.footer}>
              <div className={styles.stack} aria-live="polite">
                {props.steps.map((each, k) => (
                  <p
                    key={k}
                    className={`${styles.layer} ${styles.note}`}
                    data-current={k === index || undefined}
                    aria-hidden={k !== index || undefined}
                  >
                    <span className={styles.noteLine}>
                      <CodeBlockLabel icon={MessageSquareText}>
                        {each.line ? `Строка ${String(each.line)}:` : "Начало:"}
                      </CodeBlockLabel>
                    </span>
                    <span className={styles.noteText}>
                      {richText(each.text)}
                    </span>
                  </p>
                ))}
              </div>
              <div className={styles.stack}>
                {props.steps.map((each, k) => (
                  <div
                    key={k}
                    className={styles.layer}
                    data-current={k === index || undefined}
                    aria-hidden={k !== index || undefined}
                  >
                    <CodeBlockOutput
                      text={each.out}
                      error={each.stop ? each.error : undefined}
                      collapsible={false}
                      emptyText="пока пусто"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : undefined
        }
      />
    </div>
  );
};
