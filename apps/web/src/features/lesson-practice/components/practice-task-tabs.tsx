import type { PracticeTaskTypes } from "~/entities/practice-task";
import { TabsList } from "~/shared/components/tabs";
import { PracticeTaskTab } from "./practice-task-tab";
import styles from "../lesson-practice.module.css";

type PracticeTaskTabsProps = {
  tasks: readonly PracticeTaskTypes.Task[];
  enhanced: boolean;
  isSolved: (taskId: string) => boolean;
};

export const PracticeTaskTabs: React.FC<PracticeTaskTabsProps> = (props) => (
  <TabsList
    className={styles.practiceTabs}
    label="Задачи урока"
    hidden={!props.enhanced}
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
