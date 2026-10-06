import type { ComponentProps } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskAnswer } from "./practice-task-answer";
import { PracticeTaskContent } from "./practice-task-content";
import { PracticeTaskFeedback } from "./practice-task-feedback";
import { PracticeTaskHelp } from "./practice-task-help";

const DEFAULT_INSTRUCTION =
  "Запишите целое число в десятичной системе счисления.";

type Props = {
  task: PracticeTaskTypes.Task;
  headingOrder?: 2 | 3 | 4;
  alreadySolved: boolean;
  enhanced: boolean;
  answer: string;
  state: LessonPracticeTypes.State;
  focusOnMount?: boolean;
  active?: boolean;
  onRepeat?: () => void;
  onAnswerChange: (value: string) => void;
  onRefresh: () => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

/**
 * F30: the one task layout for the catalog, the task page and lessons —
 * statement, an optional instruction, then field, «Проверить», «Подсказка»
 * and «Решение» in one row with their panels below.
 */
export const PracticeTaskSolver: React.FC<Props> = (props) => {
  const inputId = `answer-${props.task.id}`;
  const instruction = props.task.answerInstruction?.trim();
  const custom = instruction && instruction !== DEFAULT_INSTRUCTION;
  return (
    <>
      <PracticeTaskContent blocks={props.task.statement} context="statement" />
      {custom ? (
        <Typography.Text
          id={`${inputId}-instruction`}
          className={styles.instruction}
        >
          {instruction}
        </Typography.Text>
      ) : null}
      <PracticeTaskHelp task={props.task} headingOrder={props.headingOrder}>
        <PracticeTaskAnswer
          inputId={inputId}
          describedBy={custom ? `${inputId}-instruction` : undefined}
          focusOnMount={props.focusOnMount}
          active={props.active}
          onRepeat={props.onRepeat}
          alreadySolved={props.alreadySolved}
          checking={props.state === "checking"}
          enhanced={props.enhanced}
          answer={props.answer}
          state={props.state}
          onAnswerChange={props.onAnswerChange}
          onRefresh={props.onRefresh}
          onSubmit={props.onSubmit}
        />
      </PracticeTaskHelp>
      <PracticeTaskFeedback state={props.state} />
    </>
  );
};
