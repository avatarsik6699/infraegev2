import { cssUtils } from "~/shared/lib/css-utils";
import type { ObjectIllustrationTypes } from "./object-illustration.types";
import styles from "./object-illustration.module.css";

type Size = { width: number; height: number };

/** viewBox of each course picture; every topic shares 180×120. */
const courseSizes: Record<
  ObjectIllustrationTypes.Course,
  { square: Size; wide: Size }
> = {
  python: {
    square: { width: 1536, height: 1024 },
    wide: { width: 2138, height: 634 },
  },
};

/** Whether the course has a picture; others keep the placeholder. */
export const hasCourseIllustration = (
  id: string,
): id is ObjectIllustrationTypes.Course => Object.hasOwn(courseSizes, id);

function source(props: ObjectIllustrationTypes.Props) {
  if (props.course === undefined)
    return {
      name: `topic-${String(props.topic)}`,
      src: `/images/topics/topic-${String(props.topic)}.svg`,
      width: 180,
      height: 120,
    };
  const name = `course-${props.course}${props.wide ? "-wide" : ""}`;
  return {
    name,
    src: `/images/courses/${name}.svg`,
    ...courseSizes[props.course][props.wide ? "wide" : "square"],
  };
}

/**
 * Decorative object illustration (DESIGN.md › Shapes): a separate SVG file,
 * lazy, with any motion inside the file.
 */
export const ObjectIllustration: React.FC<ObjectIllustrationTypes.Props> = (
  props,
) => {
  const { name, src, width, height } = source(props);
  return (
    <img
      className={cssUtils.cx(styles.root, props.className)}
      data-object-illustration={name}
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
};
