import type { LessonTypes } from "~/entities/lesson";
import { PracticeTaskTab } from "./practice-task-tab";
import styles from "../lesson-practice.module.css";

type PracticeTaskTabsProps = {
  tasks: readonly LessonTypes.PracticeTask[];
  activeTaskId: string;
  enhanced: boolean;
  isSolved: (taskId: string) => boolean;
  onKeyDown: React.ComponentProps<typeof PracticeTaskTab>["onKeyDown"];
  onSelect: (taskId: string) => void;
  setRef: React.ComponentProps<typeof PracticeTaskTab>["setRef"];
};

export const PracticeTaskTabs: React.FC<PracticeTaskTabsProps> = (props) => (
  <div
    className={styles.practiceTabs}
    role="tablist"
    aria-label="Задачи по сложности"
    hidden={!props.enhanced}
    data-practice-tabs
  >
    {props.tasks.map((task, index) => (
      <PracticeTaskTab
        active={task.id === props.activeTaskId}
        index={index}
        key={task.id}
        onKeyDown={props.onKeyDown}
        onSelect={props.onSelect}
        setRef={props.setRef}
        solved={props.isSolved(task.id)}
        task={task}
        total={props.tasks.length}
      />
    ))}
  </div>
);
