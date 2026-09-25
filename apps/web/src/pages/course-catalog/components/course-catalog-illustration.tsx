import type { CourseCatalogTypes } from "~/entities/course";
import { Image } from "~/shared/components/image";
import styles from "../course-catalog-page.module.css";

type Props = { illustration: CourseCatalogTypes.Illustration };

export const CourseCatalogIllustration: React.FC<Props> = (props) => (
  <div className={styles.illustration} aria-hidden="true">
    <Image
      src={props.illustration.src}
      decorative
      layout="fill"
      fit="contain"
      loading="eager"
      width={props.illustration.width}
      height={props.illustration.height}
    />
  </div>
);
