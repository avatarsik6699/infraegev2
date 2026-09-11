import type { CourseCatalogTypes } from "~/entities/course";
import { Image } from "~/shared/components/image";
import styles from "../course-catalog-page.module.css";

type Props = { courseId: CourseCatalogTypes.Entry["id"] };

const courseArtwork = {
  python: "python",
  excel: "excel",
  "algorithms-data-structures": "algorithms",
  "advanced-problems": "advanced",
} as const;

export const CourseCatalogStudy: React.FC<Props> = (props) => (
  <div className={styles.study} data-course-study={props.courseId}>
    <Image
      src={`/images/course-catalog/${courseArtwork[props.courseId]}.webp`}
      width={1536}
      height={1024}
      decorative
      layout="fill"
      position={props.courseId === "excel" ? "top" : "center"}
      fit="cover"
      className={styles.studyImage}
    />
  </div>
);
