import type { ComponentProps } from "react";
import type { LessonTypes } from "~/entities/lesson";
import { TabsPanel } from "~/shared/components/tabs";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskAnswer } from "./practice-task-answer";
import { PracticeTaskFeedback } from "./practice-task-feedback";
import { PracticeTaskHelp } from "./practice-task-help";
import { PracticeTaskHeading } from "./practice-task-heading";

type PracticeTaskPanelProps = {
  task: LessonTypes.PracticeTask;
  index: number;
  state: LessonPracticeTypes.State;
  feedback: string;
  alreadySolved: boolean;
  enhanced: boolean;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

export const PracticeTaskPanel: React.FC<PracticeTaskPanelProps> = (props) => {
  const inputId = `answer-${props.task.id}`;
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
      <PracticeTaskAnswer
        alreadySolved={props.alreadySolved}
        answer={props.answer}
        checking={props.state === "checking"}
        inputId={inputId}
        onAnswerChange={props.onAnswerChange}
        onSubmit={props.onSubmit}
        state={props.state}
        task={props.task}
      />
      <PracticeTaskHelp task={props.task} />
      <PracticeTaskFeedback feedback={props.feedback} state={props.state} />
    </TabsPanel>
  );
};
