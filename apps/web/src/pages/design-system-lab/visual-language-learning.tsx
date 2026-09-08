import { useRef } from "react";
import { CodeBlock } from "~/shared/components/code-block";
import { WorkedExample } from "~/shared/components/learning-content";
import {
  SurfaceMaterial,
  SurfaceGlint,
} from "~/shared/components/surface-decoration";
import { useElementActivity } from "~/shared/lib/element-activity";
import { VisualLanguageField } from "./visual-language-field";
import styles from "./visual-language-specimen.module.css";

export const VisualLanguageLearning: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useElementActivity(ref);
  return (
    <div ref={ref} className={styles.learning} data-visual-example="learning">
      <SurfaceMaterial>
        <VisualLanguageField />
      </SurfaceMaterial>
      <SurfaceGlint
        kind="soft"
        active={active}
        playback="loop"
        className={styles.learningGlint}
      />
      <div className={styles.reading}>
        <WorkedExample
          title="Как изменяется значение"
          prompt="Каждая новая строка использует значение, полученное на предыдущем шаге."
          steps={[
            "Сначала в переменной count хранится 3.",
            "Выражение count + 1 даёт 4. Это значение записывается обратно в count.",
          ]}
        />
        <CodeBlock
          code={"count = 3\ncount = count + 1\nprint(count)"}
          language="python"
          label="Изменение значения"
        />
      </div>
    </div>
  );
};
