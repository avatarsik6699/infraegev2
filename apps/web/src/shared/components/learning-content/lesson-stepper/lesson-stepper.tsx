import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/shared/components/button";
import { useMediaQuery } from "~/shared/lib/media-query";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { InlineSvg } from "../lesson-media/inline-svg";
import mediaStyles from "../lesson-media/lesson-media.module.css";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";
import styles from "./lesson-stepper.module.css";

type Props = Omit<LessonMediaTypes.Stepper, "kind"> & {
  /** Accessible name of the whole step-through figure. */
  label: string;
};

const STEP_MS = 1600;

/**
 * Step-through diagram over generated frames (SPEC §2.3): the learner moves
 * by hand; play only advances on request, never by itself, and is absent
 * under reduced motion. Controls match `LessonVideo`: quiet icon buttons and
 * a thin timeline. Without scripting the final frame and every step caption
 * stay readable.
 */
export const LessonStepper: React.FC<Props> = (props) => {
  const enhanced = useIsEnhanced();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = props.frames.length - 1;
  // Playback stops by itself on the last frame and never runs under reduced motion.
  const active = playing && !reducedMotion && index < last;

  useEffect(
    function advanceWhilePlayingFx() {
      if (!active) return;
      const timer = setTimeout(() => setIndex(index + 1), STEP_MS);
      return () => clearTimeout(timer);
    },
    [active, index],
  );

  if (!enhanced) {
    const final = props.frames[last] ?? props.frames[0];
    return (
      <figure
        className={mediaStyles.figure}
        aria-label={props.label}
        data-lesson-stepper
      >
        <div className={mediaStyles.plate} tabIndex={0}>
          <InlineSvg
            svg={final.svg}
            width={props.width}
            height={props.height}
            label={final.caption}
          />
        </div>
        <figcaption className={mediaStyles.caption}>
          <ol className={styles.steps} data-stepper-steps>
            {props.frames.map((frame) => (
              <li key={frame.caption}>{frame.caption}</li>
            ))}
          </ol>
        </figcaption>
      </figure>
    );
  }

  const current = props.frames[index] ?? props.frames[0];
  const go = (next: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(last, next)));
  };
  const progress = last === 0 ? 100 : (index / last) * 100;

  return (
    <figure
      className={mediaStyles.figure}
      aria-label={props.label}
      data-lesson-stepper
      data-enhanced
    >
      <div className={mediaStyles.plate} tabIndex={0}>
        {props.frames.map((frame, frameIndex) => (
          <InlineSvg
            key={frame.caption}
            svg={frame.svg}
            width={props.width}
            height={props.height}
            label={frame.caption}
            hidden={frameIndex !== index}
          />
        ))}
      </div>
      <div className={styles.controls}>
        <Button
          type="button"
          hierarchy="quiet"
          iconOnly
          iconStart={<ChevronLeft size={18} aria-hidden="true" />}
          aria-label="Предыдущий шаг"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        />
        {reducedMotion ? null : (
          <Button
            type="button"
            hierarchy="quiet"
            iconOnly
            iconStart={
              active ? (
                <Pause size={18} aria-hidden="true" />
              ) : (
                <Play size={18} aria-hidden="true" />
              )
            }
            aria-label={active ? "Пауза" : "Воспроизвести"}
            data-stepper-play
            onClick={() => {
              if (active) {
                setPlaying(false);
                return;
              }
              if (index === last) setIndex(0);
              setPlaying(true);
            }}
          />
        )}
        <Button
          type="button"
          hierarchy="quiet"
          iconOnly
          iconStart={<ChevronRight size={18} aria-hidden="true" />}
          aria-label="Следующий шаг"
          disabled={index === last}
          onClick={() => go(index + 1)}
        />
        <input
          type="range"
          className={styles.timeline}
          style={
            { "--progress": `${String(progress)}%` } as React.CSSProperties
          }
          min={0}
          max={last}
          step={1}
          value={index}
          aria-label={`Шаг схемы: ${props.label}`}
          aria-valuetext={`шаг ${String(index + 1)} из ${String(props.frames.length)}`}
          onChange={(event) => go(Number(event.target.value))}
          data-stepper-timeline
        />
        <span className={styles.count} data-stepper-count>
          {`${String(index + 1)} / ${String(props.frames.length)}`}
        </span>
      </div>
      <figcaption
        className={mediaStyles.caption}
        aria-live="polite"
        data-stepper-caption
      >
        {current.caption}
      </figcaption>
    </figure>
  );
};
