import type { ComponentProps } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

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
    <Typography.Text className={styles.taskStatement}>
      {props.task.statement}
    </Typography.Text>
    <div className={styles.answerRow}>
      <Field
        className={props.alreadySolved ? styles.solvedAnswer : undefined}
        data-solved={props.alreadySolved || undefined}
        id={props.inputId}
        name="answer"
        label="Ответ"
        labelVisibility="sr-only"
        placeholder={
          props.alreadySolved ? "Этот ответ уже принят" : "Без единиц измерения"
        }
        error={answerError(props.state)}
        autoComplete="off"
        disabled={props.alreadySolved || props.checking}
        value={props.answer}
        onChange={(event) => props.onAnswerChange(event.currentTarget.value)}
      />
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
