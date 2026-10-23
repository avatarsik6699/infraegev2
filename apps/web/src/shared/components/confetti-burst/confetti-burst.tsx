import { useEffect, useState } from "react";
import { cssUtils } from "~/shared/lib/css-utils";
import type { ConfettiBurstTypes } from "./confetti-burst.types";
import styles from "./confetti-burst.module.css";

const COUNT = 28;
/** The longest flight (CSS: 1100 ms plus a 120 ms delay) and a little margin. */
const BURST_MS = 1300;
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
 *
 * It plays once when `active` turns true and then lets go of `data-burst`:
 * a CSS animation restarts whenever a hidden ancestor is shown again, so a
 * solved task in a switched-away tab or a collapsed row would replay it.
 */
export const ConfettiBurst: React.FC<ConfettiBurstTypes.Props> = (props) => {
  const [seen, setSeen] = useState(props.active);
  const [playing, setPlaying] = useState(false);
  if (props.active !== seen) {
    setSeen(props.active);
    setPlaying(props.active);
  }
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setPlaying(false), BURST_MS);
    return () => clearTimeout(timer);
  }, [playing]);
  return (
    <span
      className={cssUtils.cx(styles.root, props.className)}
      data-burst={playing || undefined}
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
};
