import { cssUtils } from "~/shared/lib/css-utils";
import type { ObjectIllustrationTypes } from "./object-illustration.types";
import styles from "./object-illustration.module.css";

type Size = { width: number; height: number };

/**
 * Size of each course scene at its larger width (Change 185): the
 * architect's coloured pictures, made by scripts/mascot/course_scenes.py.
 */
const courseScenes: Record<ObjectIllustrationTypes.Course, Size> = {
  python: { width: 1600, height: 636 },
  excel: { width: 1600, height: 793 },
  "algorithms-data-structures": { width: 1600, height: 664 },
  "advanced-problems": { width: 1600, height: 615 },
};
const sceneWidths = [960, 1600] as const;

/** Whether the course has a scene; others keep the placeholder. */
export const hasCourseIllustration = (
  id: string,
): id is ObjectIllustrationTypes.Course => Object.hasOwn(courseScenes, id);

function source(props: ObjectIllustrationTypes.Props) {
  if (props.course === undefined)
    return {
      name: `topic-${String(props.topic)}`,
      src: `/images/topics/topic-${String(props.topic)}.svg`,
      width: 180,
      height: 120,
    };
  const base = `/images/courses/course-${props.course}`;
  return {
    name: `course-${props.course}-scene`,
    src: `${base}-${String(sceneWidths[0])}.webp`,
    srcSet: sceneWidths
      .map((width) => `${base}-${String(width)}.webp ${String(width)}w`)
      .join(", "),
    sizes: props.sizes,
    ...courseScenes[props.course],
  };
}

/**
 * Decorative object illustration (DESIGN.md › Shapes): a separate file, lazy,
 * with any motion inside an SVG file.
 */
export const ObjectIllustration: React.FC<ObjectIllustrationTypes.Props> = (
  props,
) => {
  const picture = source(props);
  return (
    <img
      className={cssUtils.cx(styles.root, props.className)}
      data-object-illustration={picture.name}
      src={picture.src}
      srcSet={"srcSet" in picture ? picture.srcSet : undefined}
      sizes={"sizes" in picture ? picture.sizes : undefined}
      alt=""
      width={picture.width}
      height={picture.height}
      loading="lazy"
      decoding="async"
    />
  );
};

/**
 * Change 197: the ink drawing behind an EGE topic's head — its catalog
 * picture and its signs (scripts/mascot/topic_heads.mjs) — wide in a column
 * and a narrower band on a phone. Decorative; the slot class places it.
 */
export const TopicHeadDrawing: React.FC<{
  topic: number;
  className?: string;
}> = (props) => (
  <picture>
    <source
      media="(max-width: 44rem)"
      srcSet={`/images/topics/head-${String(props.topic)}-narrow.svg`}
      width={360}
      height={110}
    />
    <img
      className={cssUtils.cx(styles.root, props.className)}
      data-object-illustration={`topic-head-${String(props.topic)}`}
      src={`/images/topics/head-${String(props.topic)}.svg`}
      alt=""
      width={720}
      height={220}
      decoding="async"
    />
  </picture>
);
