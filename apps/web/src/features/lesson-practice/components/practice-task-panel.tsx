import type { ComponentProps } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { TabsPanel } from "~/shared/components/tabs";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskHeading } from "./practice-task-heading";
import { PracticeTaskSolver } from "./practice-task-solver";

type PracticeTaskPanelProps = {
  task: PracticeTaskTypes.Task;
  index: number;
  state: LessonPracticeTypes.State;
  alreadySolved: boolean;
  enhanced: boolean;
  answer: string;
  onAnswerChange: (value: string) => void;
  onRefresh: () => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

export const PracticeTaskPanel: React.FC<PracticeTaskPanelProps> = (props) => {
  const headingId = `practice-heading-${props.task.id}`;

  return (
    <TabsPanel
      className={styles.practicePanel}
      value={props.task.id}
      focusable={props.enhanced}
      panelProps={{
        "data-practice-task": props.task.id,
        "data-solved": props.alreadySolved || undefined,
      }}
    >
      <PracticeTaskHeading headingId={headingId} task={props.task} />
      <PracticeTaskSolver
        task={props.task}
        alreadySolved={props.alreadySolved}
        answer={props.answer}
        enhanced={props.enhanced}
        state={props.state}
        onAnswerChange={props.onAnswerChange}
        onRefresh={props.onRefresh}
        onSubmit={props.onSubmit}
      />
    </TabsPanel>
  );
};
