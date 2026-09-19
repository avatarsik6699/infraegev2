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
  layout?: "stacked" | "compact";
  focusOnMount?: boolean;
  active?: boolean;
  onRepeat?: () => void;
  answerInstruction?: string;
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
  const wasRepeating = useRef(false);
  const previousState = useRef(props.state);
  useEffect(
    function focusRepeatAnswerFx() {
      if (props.focusOnMount && !wasRepeating.current && props.active !== false)
        inputRef.current?.focus();
      wasRepeating.current = !!props.focusOnMount;
    },
    [props.focusOnMount, props.active],
  );
  useEffect(
    function focusInvalidAnswerFx() {
      if (
        props.state === "incorrect" &&
        previousState.current !== "incorrect" &&
        props.active !== false
      )
        inputRef.current?.focus();
      previousState.current = props.state;
    },
    [props.state, props.active],
  );

  const placeholder = props.answerInstruction
    ? "Введите ответ"
    : "Без единиц измерения";
  return (
    <form
      className={styles.practiceForm}
      data-layout={props.layout ?? "stacked"}
      onSubmit={props.onSubmit}
    >
      {props.layout !== "compact" && (
        <PracticeTaskContent
          blocks={props.task.statement}
          context="statement"
        />
      )}
      <div className={styles.answerPanel}>
        <div className={styles.answerRow}>
          <div className={styles.answerField}>
            <Field
              className={props.alreadySolved ? styles.solvedAnswer : undefined}
              data-solved={props.alreadySolved || undefined}
              ref={inputRef}
              id={props.inputId}
              name="answer"
              label={props.layout === "compact" ? "Ваш ответ" : "Ответ"}
              labelVisibility={
                props.layout !== "compact" && props.answerInstruction
                  ? "visible"
                  : "sr-only"
              }
              description={
                props.layout === "compact" ||
                props.answerInstruction?.trim() ===
                  "Запишите целое число в десятичной системе счисления."
                  ? undefined
                  : props.answerInstruction
              }
              maxLength={500}
              placeholder={
                props.alreadySolved ? "Этот ответ уже принят" : placeholder
              }
              error={answerError(props.state)}
              invalid={props.state === "incorrect"}
              aria-describedby={
                props.layout === "compact" && props.state === "error"
                  ? `${props.inputId}-feedback`
                  : undefined
              }
              autoComplete="off"
              disabled={
                !props.enhanced || props.alreadySolved || props.checking
              }
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
            {props.layout === "compact" && props.state === "error" && (
              <Typography.Text
                id={`${props.inputId}-feedback`}
                className={styles.answerError}
                role="alert"
              >
                Не удалось проверить ответ. Попробуйте ещё раз.
              </Typography.Text>
            )}
            {props.layout === "compact" && props.alreadySolved && (
              <span className={styles.visuallyHidden} role="status">
                Ответ принят
              </span>
            )}
          </div>
          {props.layout === "compact" &&
          props.alreadySolved &&
          props.onRepeat ? (
            <Button hierarchy="secondary" onClick={props.onRepeat}>
              Решить ещё раз
            </Button>
          ) : (
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
          )}
        </div>
        {props.state === "stale" || props.state === "unavailable" ? (
          <div role="alert">
            <Typography.Text tone="muted">
              {props.state === "stale"
                ? "Задача изменилась. Обновите условие и проверьте ответ заново. Введённый ответ сохранён."
                : "Задача больше недоступна. Обновите страницу или выберите другую задачу."}
            </Typography.Text>
            <Button onClick={props.onRefresh}>Обновить условие</Button>
          </div>
        ) : null}
        {props.state === "error" && props.layout !== "compact" ? (
          <Typography.Text role="alert" tone="muted">
            Не удалось проверить ответ. Попробуйте ещё раз.
          </Typography.Text>
        ) : null}
      </div>
    </form>
  );
};

function answerError(state: LessonPracticeTypes.State): string | undefined {
  if (state === "incorrect") {
    return "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.";
  }
  return undefined;
}
