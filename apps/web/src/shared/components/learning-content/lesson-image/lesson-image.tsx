import { Image } from "~/shared/components/image";
import mediaStyles from "../lesson-media/lesson-media.module.css";
import styles from "./lesson-image.module.css";

type Props = {
  /** A WebP under /images/lessons/<lesson id>/, with its intrinsic size. */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** The one caption: what to look at on the screenshot. */
  caption: React.ReactNode;
};

/**
 * A screenshot of a program window in a course lesson (Change 197, the one
 * exception to code-built figures): reserved intrinsic size, lazy, alt and one
 * caption, on the same plate as a diagram. It shrinks with the column.
 */
export const LessonImage: React.FC<Props> = (props) => (
  <figure className={mediaStyles.figure} data-lesson-image>
    <div className={styles.plate}>
      <Image
        src={props.src}
        width={props.width}
        height={props.height}
        alt={props.alt}
        loading="lazy"
        className={styles.image}
      />
    </div>
    <figcaption className={mediaStyles.caption}>{props.caption}</figcaption>
  </figure>
);
