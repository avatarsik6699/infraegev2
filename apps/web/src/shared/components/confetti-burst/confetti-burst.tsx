import { cssUtils } from "~/shared/lib/css-utils";
import type { ConfettiBurstTypes } from "./confetti-burst.types";
import styles from "./confetti-burst.module.css";

const COUNT = 28;
const TONES = ["orange", "sky", "sage", "lilac", "ink"] as const;

/** Pieces: flight (a fan upwards), turn, delay and tone. */
const PIECES = Array.from({ length: COUNT }, (_, i) => {
  const spread = (i / (COUNT - 1)) * 2 - 1;
  const angle = -Math.PI / 2 + spread * 1.35;
  const distance = 110 + ((i * 37) % 90);
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    turn: ((i * 97) % 360) - 180,
    delay: (i % 5) * 30,
    tone: TONES[i % TONES.length],
  };
});

/**
 * A short decorative burst for a solved task. It never clips: the origin is
 * a zero-size point in a positioned parent, and the parent must not hide
 * overflow. Off under prefers-reduced-motion (CSS); hidden from assistive
 * technology, which hears the result from the task's own status.
 */
export const ConfettiBurst: React.FC<ConfettiBurstTypes.Props> = (props) => (
  <span
    className={cssUtils.cx(styles.root, props.className)}
    data-burst={props.active || undefined}
    aria-hidden="true"
  >
    {PIECES.map((piece, i) => (
      <span
        key={i}
        data-tone={piece.tone}
        style={
          {
            "--x": `${String(piece.x)}px`,
            "--y": `${String(piece.y)}px`,
            "--turn": `${String(piece.turn)}deg`,
            "--delay": `${String(piece.delay)}ms`,
          } as React.CSSProperties
        }
      />
    ))}
  </span>
);
