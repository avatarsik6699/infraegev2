import type { CourseCatalogTypes } from "~/entities/course";
import { Image } from "~/shared/components/image";
import styles from "../course-catalog-page.module.css";

type Props = { id: CourseCatalogTypes.Id };

const courseCatalogIllustration = {
  paths: {
    python: "/images/courses/python-v2.webp",
    excel: "/images/courses/excel-v2.webp",
    "algorithms-data-structures":
      "/images/courses/algorithms-data-structures-v2.webp",
    "advanced-problems": "/images/courses/advanced-problems-v2.webp",
  } satisfies Record<CourseCatalogTypes.Id, string>,
};

export const CourseCatalogIllustration: React.FC<Props> = (props) => (
  <div className={styles.illustration} aria-hidden="true">
    <Image
      src={courseCatalogIllustration.paths[props.id]}
      decorative
      layout="fill"
      fit="contain"
      loading="eager"
      width={640}
      height={640}
    />
  </div>
);
