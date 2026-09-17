import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Accordion } from "~/shared/components/accordion";
import styles from "../lesson-practice.module.css";
import { PracticeTaskContent } from "./practice-task-content";

type PracticeTaskHelpProps = {
  task: PracticeTaskTypes.Task;
  solutionTitle?: string;
  revealSolution?: boolean;
};

export const PracticeTaskHelp: React.FC<PracticeTaskHelpProps> = (props) => (
  <Accordion
    className={styles.taskHelp}
    multiple
    defaultOpen={props.revealSolution ? [`${props.task.id}-solution`] : []}
    items={[
      {
        id: `${props.task.id}-hint`,
        title: "Подсказка",
        content: (
          <PracticeTaskContent blocks={props.task.hint} context="hint" />
        ),
      },
      {
        id: `${props.task.id}-solution`,
        title: props.solutionTitle ?? "Решение",
        content: (
          <PracticeTaskContent
            blocks={props.task.solution}
            context="solution"
          />
        ),
      },
    ]}
  />
);
