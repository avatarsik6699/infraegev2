import type { ComponentProps } from "react";
import type { LessonTypes } from "~/entities/lesson";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskAnswer } from "./practice-task-answer";
import { PracticeTaskFeedback } from "./practice-task-feedback";
import { PracticeTaskHeading } from "./practice-task-heading";

type PracticeTaskPanelProps = {
  task: LessonTypes.PracticeTask;
  index: number;
  state: LessonPracticeTypes.State;
  alreadySolved: boolean;
  active: boolean;
  enhanced: boolean;
  nextTask?: LessonTypes.PracticeTask;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
  onSelectNext: (taskId: string) => void;
  setHeadingRef: (taskId: string, element: HTMLHeadingElement | null) => void;
};

export const PracticeTaskPanel: React.FC<PracticeTaskPanelProps> = (props) => {
  const inputId = `answer-${props.task.id}`;
  const headingId = `practice-heading-${props.task.id}`;

  return (
    <section
      className={styles.practicePanel}
      id={`practice-panel-${props.task.id}`}
      role={props.enhanced ? "tabpanel" : undefined}
      aria-labelledby={
        props.enhanced ? `practice-tab-${props.task.id}` : headingId
      }
      tabIndex={props.enhanced ? 0 : undefined}
      hidden={props.enhanced && !props.active}
      data-practice-task={props.task.id}
      data-solved={props.alreadySolved || undefined}
    >
      <PracticeTaskHeading
        alreadySolved={props.alreadySolved}
        headingId={headingId}
        index={props.index}
        setHeadingRef={props.setHeadingRef}
        task={props.task}
      />
      <PracticeTaskAnswer
        alreadySolved={props.alreadySolved}
        inputId={inputId}
        onSubmit={props.onSubmit}
        task={props.task}
      />
      <PracticeTaskFeedback
        alreadySolved={props.alreadySolved}
        nextTask={props.nextTask}
        onSelectNext={props.onSelectNext}
        state={props.state}
        task={props.task}
      />
    </section>
  );
};
