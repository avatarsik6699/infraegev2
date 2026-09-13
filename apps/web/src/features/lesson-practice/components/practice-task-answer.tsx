import { useEffect, useRef, type ComponentProps } from "react";
import { CircleCheck } from "lucide-react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";
import { PracticeTaskContent } from "./practice-task-content";

type PracticeTaskAnswerProps = {
  task: PracticeTaskTypes.Task;
  inputId: string;
  alreadySolved: boolean;
  checking: boolean;
  enhanced: boolean;
  answer: string;
  state: LessonPracticeTypes.State;
  onAnswerChange: (value: string) => void;
  onRefresh: () => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

export const PracticeTaskAnswer: React.FC<PracticeTaskAnswerProps> = (
  props,
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(
    function focusInvalidAnswerFx() {
      if (props.state === "incorrect") inputRef.current?.focus();
    },
    [props.state],
  );

  return (
    <form className={styles.practiceForm} onSubmit={props.onSubmit}>
      <PracticeTaskContent blocks={props.task.statement} context="statement" />
      <div className={styles.answerRow}>
        <div className={styles.answerField}>
          <Field
            className={props.alreadySolved ? styles.solvedAnswer : undefined}
            data-solved={props.alreadySolved || undefined}
            ref={inputRef}
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
            disabled={!props.enhanced || props.alreadySolved || props.checking}
            value={props.answer}
            onChange={(event) =>
              props.onAnswerChange(event.currentTarget.value)
            }
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
          disabled={
            !props.enhanced ||
            props.alreadySolved ||
            props.state === "stale" ||
            props.state === "unavailable"
          }
        >
          {props.checking ? "Проверяем" : "Проверить"}
        </Button>
      </div>
      {props.state === "stale" || props.state === "unavailable" ? (
        <div role="alert">
          <Typography.Text tone="muted">
            {props.state === "stale"
              ? "Задача изменилась. Обновите условие и проверьте ответ заново. Введённый ответ сохранён."
              : "Задача больше недоступна. Обновите практику урока."}
          </Typography.Text>
          <Button onClick={props.onRefresh}>Обновить условие</Button>
        </div>
      ) : null}
      {props.state === "error" ? (
        <Typography.Text role="alert" tone="muted">
          Не удалось проверить ответ. Попробуйте ещё раз.
        </Typography.Text>
      ) : null}
    </form>
  );
};

function answerError(state: LessonPracticeTypes.State): string | undefined {
  if (state === "incorrect") {
    return "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.";
  }
  return undefined;
}
