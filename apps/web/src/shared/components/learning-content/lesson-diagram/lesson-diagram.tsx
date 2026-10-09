import { InlineSvg } from "../lesson-media/inline-svg";
import mediaStyles from "../lesson-media/lesson-media.module.css";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";

type Props = Omit<LessonMediaTypes.Diagram, "kind"> & {
  /** The one caption: the idea and the numbers of the diagram. */
  caption: React.ReactNode;
};

/**
 * Exact diagram built by repository code (SPEC §2.3): inline SVG in the page
 * font, reserved intrinsic size, alt and one caption. On a phone it keeps a
 * readable scale and scrolls inside its own plate rather than shrinking.
 */
export const LessonDiagram: React.FC<Props> = (props) => (
  <figure className={mediaStyles.figure} data-lesson-diagram>
    {/* Focusable like a code block: on a phone the plate scrolls sideways. */}
    <div className={mediaStyles.plate} tabIndex={0}>
      <InlineSvg
        svg={props.svg}
        width={props.width}
        height={props.height}
        label={props.alt}
      />
    </div>
    <figcaption className={mediaStyles.caption}>{props.caption}</figcaption>
  </figure>
);
