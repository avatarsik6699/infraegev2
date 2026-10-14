import type { PracticeTaskTypes } from "~/entities/practice-task";
import { TabsList } from "~/shared/components/tabs";
import { PracticeTaskTab } from "./practice-task-tab";
import styles from "../lesson-practice.module.css";

type PracticeTaskTabsProps = {
  tasks: readonly PracticeTaskTypes.Task[];
  enhanced: boolean;
  isSolved: (taskId: string) => boolean;
};

// Change 184: one task needs no tab strip; its own heading names it.
export const PracticeTaskTabs: React.FC<PracticeTaskTabsProps> = (props) => (
  <TabsList
    className={styles.practiceTabs}
    label="Задачи урока"
    hidden={!props.enhanced || props.tasks.length < 2}
  >
    {props.tasks.map((task, index) => (
      <PracticeTaskTab
        index={index}
        key={task.id}
        solved={props.isSolved(task.id)}
        task={task}
        total={props.tasks.length}
      />
    ))}
  </TabsList>
);
