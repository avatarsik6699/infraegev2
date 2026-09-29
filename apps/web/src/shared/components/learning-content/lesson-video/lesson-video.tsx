import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/shared/components/button";
import { cssUtils } from "~/shared/lib/css-utils";
import { useInViewport } from "~/shared/lib/use-in-viewport";
import { useMediaQuery } from "~/shared/lib/media-query";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import type { LessonVideoTypes } from "./lesson-video.types";
import styles from "./lesson-video.module.css";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const SLIDER_STEPS = 1000;

function formatSeconds(value: number): string {
  return String(Math.round(value));
}

export const LessonVideo: React.FC<LessonVideoTypes.Props> = (props) => {
  const enhanced = useIsEnhanced();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const pausedByLearner = useRef(false);
  const visible = useInViewport(videoRef, 0.5);
  const [playing, setPlaying] = useState(false);

  function syncSlider() {
    const video = videoRef.current;
    const slider = sliderRef.current;
    if (!video || !slider || !Number.isFinite(video.duration)) return;
    const ratio = video.duration ? video.currentTime / video.duration : 0;
    slider.value = String(Math.round(ratio * SLIDER_STEPS));
    slider.style.setProperty("--progress", `${ratio * 100}%`);
    slider.setAttribute(
      "aria-valuetext",
      `${formatSeconds(video.currentTime)} из ${formatSeconds(video.duration)} с`,
    );
  }

  useEffect(
    function playWhileVisibleFx() {
      const video = videoRef.current;
      if (!video || !enhanced) return;
      if (!visible) {
        if (!video.paused) video.pause();
        return;
      }
      if (!reducedMotion && !pausedByLearner.current) {
        void video.play().catch(() => undefined);
      }
    },
    [enhanced, visible, reducedMotion],
  );

  useEffect(
    function followPlaybackFx() {
      if (!playing) return;
      let frame = requestAnimationFrame(function tick() {
        syncSlider();
        frame = requestAnimationFrame(tick);
      });
      return () => cancelAnimationFrame(frame);
    },
    [playing],
  );

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByLearner.current = false;
      void video.play().catch(() => undefined);
    } else {
      pausedByLearner.current = true;
      video.pause();
    }
  }

  function seek(event: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime =
      (Number(event.target.value) / SLIDER_STEPS) * video.duration;
    syncSlider();
  }

  const playLabel = `${playing ? "Пауза" : "Воспроизвести"}: ${props.alt}`;

  return (
    <figure
      className={cssUtils.cx(styles.root, props.className)}
      data-lesson-video-figure
    >
      <video
        ref={videoRef}
        className={styles.video}
        width={props.width}
        height={props.height}
        poster={props.poster}
        style={{ aspectRatio: `${props.width} / ${props.height}` }}
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onClick={enhanced ? togglePlayback : undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={syncSlider}
        onTimeUpdate={syncSlider}
      >
        <source src={`${props.src}.webm`} type="video/webm" />
        <source src={`${props.src}.mp4`} type="video/mp4" />
      </video>
      <div
        className={styles.controls}
        data-enhanced={enhanced}
        data-lesson-video-controls
      >
        <Button
          type="button"
          hierarchy="quiet"
          iconOnly
          disabled={!enhanced}
          aria-label={playLabel}
          iconStart={
            playing ? (
              <Pause size={18} aria-hidden="true" />
            ) : (
              <Play size={18} aria-hidden="true" />
            )
          }
          onClick={togglePlayback}
          data-lesson-video-toggle
        />
        <input
          ref={sliderRef}
          type="range"
          className={styles.slider}
          min={0}
          max={SLIDER_STEPS}
          step={1}
          defaultValue={0}
          disabled={!enhanced}
          aria-label={`Положение в ролике: ${props.alt}`}
          onChange={seek}
          data-lesson-video-timeline
        />
      </div>
      <figcaption className={styles.caption}>{props.caption}</figcaption>
    </figure>
  );
};
