import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ConfettiBurst } from "~/shared/components/confetti-burst";
import { Typography } from "~/shared/components/typography";
import { useMediaQuery } from "~/shared/lib/media-query";
import { useInViewport } from "~/shared/lib/use-in-viewport";
import patterns from "~/shared/styles/patterns.module.css";
import styles from "./foundation-try-demo.module.css";

/** One pass of the walkthrough: each step and its delay after the previous. */
const TIMELINE = [
  ["idle", 0],
  ["field", 400],
  ["type-1", 900],
  ["type-2", 260],
  ["button", 420],
  ["press", 700],
  ["done", 180],
] as const;

type Step = (typeof TIMELINE)[number][0];

/** What the field shows at each step. */
const TYPED: Record<Step, string> = {
  idle: "",
  field: "",
  "type-1": "3",
  "type-2": "32",
  button: "32",
  press: "32",
  done: "32",
};

/** Point inside `target`, relative to `root`, where the cursor aims. */
function aim(root: HTMLElement, target: HTMLElement, dx: number) {
  const box = root.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  return {
    x: rect.left - box.left + rect.width * dx,
    y: rect.top - box.top + rect.height * 0.6,
  };
}

/**
 * F13: the home "try it" card shows how a task is solved — the cursor goes
 * to the field, types the answer, presses «Проверить», the answer is
 * accepted: the field turns green with a check and confetti bursts from the
 * button. It plays each time the card comes into view;
 * under prefers-reduced-motion it shows the solved state at once. The mock
 * is hidden from assistive technology, which gets the same story as text.
 */
export const FoundationTryDemo: React.FC = () => {
  const card = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLSpanElement>(null);
  const visible = useInViewport(card, 0.6);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [played, setPlayed] = useState<Step>("idle");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(
    function playWalkthroughFx() {
      const root = card.current;
      if (!visible || reduced || !root) return;
      const timers: ReturnType<typeof setTimeout>[] = [];
      let at = 0;
      for (const [step, delay] of TIMELINE) {
        at += delay;
        timers.push(
          setTimeout(() => {
            if (step === "idle")
              setCursor({ x: root.clientWidth * 0.85, y: root.clientHeight });
            if (step === "field" && field.current)
              setCursor(aim(root, field.current, 0.3));
            if (step === "button" && button.current)
              setCursor(aim(root, button.current, 0.5));
            setPlayed(step);
          }, at),
        );
      }
      return () => timers.forEach(clearTimeout);
    },
    [visible, reduced],
  );

  const step: Step = reduced ? "done" : played;
  const done = step === "done";

  return (
    <div className={styles.root} ref={card} data-step={step}>
      <Typography.Text className={patterns.visuallyHidden}>
        Пример решения: в поле ответа вводят 32, нажимают «Проверить» — ответ
        засчитан.
      </Typography.Text>
      <div className={styles.task} aria-hidden="true">
        <Typography.Text component="span" className={styles.kicker}>
          Задание 16 · рекурсия
        </Typography.Text>
        <Typography.Text className={styles.statement}>
          <code>F(1) = 4</code>, <code>F(n) = F(n − 1) + 2n</code> при{" "}
          <code>n &gt; 1</code>. Найдите <code>F(5)</code>.
        </Typography.Text>
        <div className={styles.row}>
          <span
            className={styles.field}
            ref={field}
            data-active={step !== "idle" || undefined}
            data-correct={done || undefined}
          >
            {TYPED[step] || (
              <span className={styles.placeholder}>Ваш ответ</span>
            )}
            {done ? (
              <Check className={styles.check} size={18} strokeWidth={2.5} />
            ) : null}
          </span>
          <span
            className={styles.button}
            ref={button}
            data-pressed={step === "press" || undefined}
          >
            Проверить
          </span>
          <ConfettiBurst
            className={styles.confetti}
            active={done && !reduced}
          />
        </div>
        <svg
          className={styles.cursor}
          data-hidden={step === "idle" || done || undefined}
          style={{
            transform: `translate(${String(cursor.x)}px, ${String(cursor.y)}px)`,
          }}
          viewBox="0 0 24 24"
          width="22"
          height="22"
        >
          <path d="M4 2.5 19 13l-6.6 1.1 3.8 7-2.6 1.4-3.8-7L5 20Z" />
        </svg>
      </div>
    </div>
  );
};
