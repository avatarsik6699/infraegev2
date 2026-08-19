import type { LessonTypes } from "~/entities/lesson";
import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";

type PracticeTaskSolutionProps = {
  blocks: readonly LessonTypes.PracticeSolutionBlock[];
};

export const PracticeTaskSolution: React.FC<PracticeTaskSolutionProps> = (
  props,
) => (
  <div className={styles.solution}>
    {props.blocks.map((block, index) => {
      if (block.type === "text") {
        return (
          <Typography.Text key={index} className={styles.solutionText}>
            {block.text}
          </Typography.Text>
        );
      }
      if (block.type === "callout") {
        return (
          <Callout
            key={index}
            density="dense"
            tone={block.tone}
            title="Обратите внимание"
          >
            {block.text}
          </Callout>
        );
      }
      if (block.type === "steps") {
        return (
          <div key={index} className={styles.solutionSteps}>
            <Typography.Text>{block.prompt}</Typography.Text>
            <ol>
              {block.steps.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ol>
          </div>
        );
      }
      return (
        <div key={index} className={styles.solutionCode}>
          {block.caption ? (
            <Typography.Text>{block.caption}</Typography.Text>
          ) : null}
          <CodeBlock
            code={block.code}
            language={block.language}
            label={block.caption ?? "Фрагмент решения"}
          />
        </div>
      );
    })}
  </div>
);
