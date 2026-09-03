import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Accordion } from "~/shared/components/accordion";
import styles from "../lesson-practice.module.css";
import { PracticeTaskContent } from "./practice-task-content";

type PracticeTaskHelpProps = {
  task: PracticeTaskTypes.Task;
};

export const PracticeTaskHelp: React.FC<PracticeTaskHelpProps> = (props) => (
  <Accordion
    className={styles.taskHelp}
    multiple
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
        title: "Решение",
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
