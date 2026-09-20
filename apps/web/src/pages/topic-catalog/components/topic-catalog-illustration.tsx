import { Image } from "~/shared/components/image";
import { BookOpen } from "lucide-react";
import styles from "../topic-catalog-page.module.css";

const illustrations: Readonly<Record<string, string>> = {
  "preobrazovanie-zapisey-chisel": "/images/topics/number-record.svg",
  rekursiya: "/images/topics/recursion.svg",
};

export const TopicCatalogIllustration: React.FC<{ topicId: string }> = (
  props,
) => (
  <div className={styles.illustration} aria-hidden="true">
    {illustrations[props.topicId] ? (
      <Image
        src={illustrations[props.topicId]}
        decorative
        layout="fill"
        fit="contain"
        loading="eager"
        width={144}
        height={88}
      />
    ) : (
      <BookOpen size={32} strokeWidth={1} className={styles.placeholder} />
    )}
  </div>
);
