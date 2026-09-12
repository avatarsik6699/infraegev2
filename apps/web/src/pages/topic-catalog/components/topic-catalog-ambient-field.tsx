import { SvgPattern } from "~/shared/components/svg-pattern";
import { topicCatalogPatterns } from "./topic-catalog-patterns";
import styles from "../topic-catalog-page.module.css";

export const TopicCatalogAmbientField: React.FC = () => (
  <div className={styles.ambientField} aria-hidden="true">
    {Object.entries(topicCatalogPatterns).map(([name, preset], index) => (
      <svg
        key={name}
        className={styles.ambientNotation}
        data-catalog-notation={name}
        viewBox="0 0 260 200"
        fill="none"
        focusable="false"
        style={
          {
            "--notation-index": index,
          } as React.CSSProperties
        }
      >
        <SvgPattern.Preset {...preset} name={`catalog-${name}`} />
      </svg>
    ))}
  </div>
);
