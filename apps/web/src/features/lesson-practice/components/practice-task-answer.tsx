import type { ComponentProps } from "react";
import { CircleCheck } from "lucide-react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskContent } from "./practice-task-content";

type PracticeTaskAnswerProps = {
  task: PracticeTaskTypes.Task;
  inputId: string;
  alreadySolved: boolean;
  checking: boolean;
  answer: string;
  state: LessonPracticeTypes.State;
  onAnswerChange: (value: string) => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

export const PracticeTaskAnswer: React.FC<PracticeTaskAnswerProps> = (
  props,
) => (
  <form className={styles.practiceForm} onSubmit={props.onSubmit}>
    <PracticeTaskContent blocks={props.task.statement} context="statement" />
    <div className={styles.answerRow}>
      <div className={styles.answerField}>
        <Field
          className={props.alreadySolved ? styles.solvedAnswer : undefined}
          data-solved={props.alreadySolved || undefined}
          id={props.inputId}
          name="answer"
          label="Ответ"
          labelVisibility="sr-only"
          placeholder={
            props.alreadySolved
              ? "Этот ответ уже принят"
              : "Без единиц измерения"
          }
          error={answerError(props.state)}
          autoComplete="off"
          disabled={props.alreadySolved || props.checking}
          value={props.answer}
          onChange={(event) => props.onAnswerChange(event.currentTarget.value)}
        />
        {props.alreadySolved ? (
          <CircleCheck
            className={styles.answerAcceptedIcon}
            data-answer-accepted-icon
            aria-hidden="true"
            size={18}
            strokeWidth={1.8}
          />
        ) : null}
      </div>
      <Button
        type="submit"
        loading={props.checking}
        disabled={props.alreadySolved}
      >
        {props.checking ? "Проверяем" : "Проверить"}
      </Button>
    </div>
  </form>
);

function answerError(state: LessonPracticeTypes.State): string | undefined {
  if (state === "incorrect") {
    return "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.";
  }
  if (state === "error") {
    return "Не получилось проверить ответ. Проверьте соединение и попробуйте ещё раз.";
  }
  return undefined;
}
