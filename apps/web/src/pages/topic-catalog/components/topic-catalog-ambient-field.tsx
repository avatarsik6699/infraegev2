import { SvgPattern } from "~/shared/components/svg-pattern";
import { topicCatalogPatterns } from "./topic-catalog-patterns";
import styles from "../topic-catalog-page.module.css";

export const TopicCatalogAmbientField: React.FC = () => (
  <div className={styles.ambientField} aria-hidden="true">
    <svg className={styles.ambientScene} fill="none" focusable="false">
      <SvgPattern.Grid
        bounds={{ x: 0, y: 0, width: "100%", height: "100%" }}
        cell={{ width: 96, height: 64 }}
        transform="skewY(-12)"
        lineClassName={styles.ambientGridLine}
      />
    </svg>
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
            "--notation-top": `${String(3 + index * 12)}%`,
          } as React.CSSProperties
        }
      >
        <SvgPattern.Preset {...preset} name={`catalog-${name}`} />
      </svg>
    ))}
  </div>
);
