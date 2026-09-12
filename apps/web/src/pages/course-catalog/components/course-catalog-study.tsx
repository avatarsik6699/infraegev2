import type { CourseCatalogTypes } from "~/entities/course";
import { Image, type ImageTypes } from "~/shared/components/image";
import styles from "../course-catalog-page.module.css";

type Props = {
  courseId: CourseCatalogTypes.Entry["id"];
  onStatusChange: (status: ImageTypes.Status) => void;
};

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
      srcSet={[480, 960, 1536]
        .map(
          (width) =>
            `/images/course-catalog/responsive/${courseArtwork[props.courseId]}-${String(width)}.webp ${String(width)}w`,
        )
        .join(", ")}
      sizes="(max-width: 44rem) 100vw, (max-width: 70rem) 90vw, 50vw"
      loading={props.courseId === "python" ? "eager" : "lazy"}
      fetchPriority={props.courseId === "python" ? "high" : "low"}
      onStatusChange={props.onStatusChange}
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
