import type { ComponentProps } from "react";
import {
  practiceTaskStatement,
  type PracticeTaskTypes,
} from "~/entities/practice-task";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskAnswer } from "./practice-task-answer";
import { PracticeTaskContent } from "./practice-task-content";
import { PracticeTaskFeedback } from "./practice-task-feedback";
import { PracticeTaskHelp } from "./practice-task-help";
import { PracticeTaskPartsAnswer } from "./practice-task-parts-answer";

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
  /** Change 191: drafts and results of a multi-part (19–21) task. */
  partAnswers?: Readonly<Record<string, string>>;
  partResults?: Readonly<Record<string, boolean>>;
  onPartAnswerChange?: (key: string, value: string) => void;
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
  const parts = props.task.answerParts;
  const custom =
    !parts?.length && instruction && instruction !== DEFAULT_INSTRUCTION;
  return (
    <>
      <PracticeTaskContent
        blocks={practiceTaskStatement.withoutTitle(
          props.task.statement,
          props.task.title,
        )}
        context="statement"
      />
      {custom ? (
        <Typography.Text
          id={`${inputId}-instruction`}
          className={styles.instruction}
        >
          {instruction}
        </Typography.Text>
      ) : null}
      <PracticeTaskHelp task={props.task} headingOrder={props.headingOrder}>
        {parts?.length ? (
          <PracticeTaskPartsAnswer
            inputId={inputId}
            parts={parts}
            alreadySolved={props.alreadySolved}
            checking={props.state === "checking"}
            enhanced={props.enhanced}
            answers={props.partAnswers ?? {}}
            results={props.partResults}
            state={props.state}
            onAnswerChange={(key, value) =>
              props.onPartAnswerChange?.(key, value)
            }
            onRefresh={props.onRefresh}
            onSubmit={props.onSubmit}
          />
        ) : (
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
        )}
      </PracticeTaskHelp>
      <PracticeTaskFeedback state={props.state} />
    </>
  );
};
