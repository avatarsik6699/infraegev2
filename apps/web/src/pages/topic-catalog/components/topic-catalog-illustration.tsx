import { Image } from "~/shared/components/image";
import { BookOpen } from "lucide-react";
import type { TopicCatalogTypes } from "~/entities/topic-catalog";
import styles from "../topic-catalog-page.module.css";

export const TopicCatalogIllustration: React.FC<{
  illustration?: TopicCatalogTypes.Illustration;
}> = (props) => (
  <div className={styles.illustration} aria-hidden="true">
    {props.illustration ? (
      <Image
        src={props.illustration.src}
        decorative
        layout="fill"
        fit="contain"
        loading="eager"
        width={props.illustration.width}
        height={props.illustration.height}
      />
    ) : (
      <BookOpen size={32} strokeWidth={1} className={styles.placeholder} />
    )}
  </div>
);
