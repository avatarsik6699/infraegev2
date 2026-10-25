import { Code2, Mountain, Network, Sheet } from "lucide-react";
import { IllustrationPlaceholder } from "~/shared/components/illustration-placeholder";
import {
  hasCourseIllustration,
  ObjectIllustration,
} from "~/shared/components/object-illustration";
import { cssUtils } from "~/shared/lib/css-utils";
import type { CourseCatalogTypes } from "./course-catalog.types";
import styles from "./course-cover.module.css";

type Look = { icon: typeof Code2; pattern: string };

/** Change 185: each course's icon and the pattern behind its picture. */
const defaultLook: Look = { icon: Code2, pattern: "code" };
const courseLook: Readonly<Record<string, Look>> = {
  python: { icon: Code2, pattern: "code" },
  excel: { icon: Sheet, pattern: "cells" },
  "algorithms-data-structures": { icon: Network, pattern: "graph" },
  "advanced-problems": { icon: Mountain, pattern: "hatch" },
};

/**
 * A few pen marks over a published course's picture that only blink in
 * place (DESIGN.md › Motion: nothing moves in a picture area). Positions are
 * percentages of the plate, in the picture's empty corners.
 */
const sparkMarks: Readonly<
  Record<string, readonly (readonly [number, number])[]>
> = {
  python: [
    [31, 8],
    [55, 5],
    [97, 30],
    [4, 74],
  ],
  excel: [
    [4, 10],
    [96, 8],
    [70, 92],
  ],
};

const CourseSparks: React.FC<{ courseId: string }> = (props) => {
  const items = sparkMarks[props.courseId];
  if (!items) return null;
  return (
    <svg
      className={styles.sparks}
      viewBox="0 0 900 400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {items.map(([x, y], index) => (
        <g
          key={`${String(x)}-${String(y)}`}
          transform={`translate(${String(x * 9)} ${String(y * 4)})`}
          data-mark={index % 2 ? "ring" : "cross"}
          style={{ animationDelay: `${String(-index * 0.9)}s` }}
        >
          {index % 2 ? <circle r="4.5" /> : <path d="M-7 0h14M0-7v14" />}
        </g>
      ))}
    </svg>
  );
};

type CoverProps = {
  entry: CourseCatalogTypes.Entry;
  /** Image `sizes` of the picture as laid out by the page. */
  sizes: string;
  /** The page's largest paint: load at once, with high priority. */
  priority?: boolean;
  className?: string;
};

/**
 * Change 185 (F26): the course's picture whole on a near-white plate of its
 * tone with its faint pattern, the same on the home course card and the
 * `/courses` card. A published course's pen marks blink. The page lays the
 * plate out; the card around it carries `courseCover.tone`.
 */
export const CourseCover: React.FC<CoverProps> = (props) => {
  const look = courseLook[props.entry.id] ?? defaultLook;
  return (
    <div
      className={cssUtils.cx(styles.plate, props.className)}
      data-pattern={look.pattern}
    >
      {hasCourseIllustration(props.entry.id) ? (
        <ObjectIllustration
          course={props.entry.id}
          sizes={props.sizes}
          priority={props.priority}
          className={styles.picture}
        />
      ) : (
        <IllustrationPlaceholder className={styles.picture} />
      )}
      {props.entry.status === "published" ? (
        <CourseSparks courseId={props.entry.id} />
      ) : null}
    </div>
  );
};

/** The course's icon in a square of its strong tone. */
export const CourseChip: React.FC<{
  entry: { id: string };
  className?: string;
}> = (props) => {
  const Icon = (courseLook[props.entry.id] ?? defaultLook).icon;
  return (
    <span className={cssUtils.cx(styles.chip, props.className)}>
      <Icon aria-hidden="true" />
    </span>
  );
};

export const courseCover = {
  /**
   * Card class that sets `--course-tone`, `--course-strong` and
   * `--course-ink` from the card's `data-course-tone` (a published course's
   * id; without it the card is neutral) and draws the tone's faint ring.
   */
  tone: styles.tone,
};
