import { Image } from "~/shared/components/image";
import { cssUtils } from "~/shared/lib/css-utils";
import mediaStyles from "../lesson-media/lesson-media.module.css";
import type { LessonFigureTypes } from "./lesson-figure.types";

export const LessonFigure: React.FC<LessonFigureTypes.Props> = (props) => (
  <figure
    className={cssUtils.cx(mediaStyles.figure, props.className)}
    data-lesson-figure
  >
    <Image
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      loading="lazy"
      fit="contain"
    />
    <figcaption className={mediaStyles.caption}>{props.caption}</figcaption>
  </figure>
);
