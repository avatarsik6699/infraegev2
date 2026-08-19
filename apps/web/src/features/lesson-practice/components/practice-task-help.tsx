import type { LessonTypes } from "~/entities/lesson";
import { Accordion } from "~/shared/components/accordion";
import styles from "../lesson-practice.module.css";
import { PracticeTaskSolution } from "./practice-task-solution";

type PracticeTaskHelpProps = {
  task: LessonTypes.PracticeTask;
};

export const PracticeTaskHelp: React.FC<PracticeTaskHelpProps> = (props) => (
  <Accordion
    className={styles.taskHelp}
    multiple
    items={[
      {
        id: `${props.task.id}-hint`,
        title: "Подсказка",
        content: <div className={styles.hintContent}>{props.task.hint}</div>,
      },
      {
        id: `${props.task.id}-solution`,
        title: "Решение",
        content: <PracticeTaskSolution blocks={props.task.solution} />,
      },
    ]}
  />
);
