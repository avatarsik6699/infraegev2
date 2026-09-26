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
  const error = answerError(props.state);
  const needsRefresh = props.state === "stale" || props.state === "unavailable";
  const accepted = props.alreadySolved || props.state === "correct";
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
        {props.layout !== "compact" &&
        props.answerInstruction &&
        props.answerInstruction.trim() !==
          "Запишите целое число в десятичной системе счисления." ? (
          <Typography.Text
            id={`${props.inputId}-instruction`}
            className={styles.catalogInstruction}
          >
            {props.answerInstruction}
          </Typography.Text>
        ) : null}
        <div className={styles.answerRow}>
          <div className={styles.answerField}>
            <Field
              className={accepted ? styles.solvedAnswer : undefined}
              data-solved={props.alreadySolved || undefined}
              ref={inputRef}
              id={props.inputId}
              name="answer"
              label={props.layout === "compact" ? "Ваш ответ" : "Ответ"}
              labelVisibility="sr-only"
              aria-describedby={
                props.layout !== "compact" &&
                props.answerInstruction &&
                props.answerInstruction.trim() !==
                  "Запишите целое число в десятичной системе счисления."
                  ? `${props.inputId}-instruction`
                  : undefined
              }
              maxLength={500}
              placeholder={accepted ? "Этот ответ уже принят" : placeholder}
              error={error}
              endAdornment={
                accepted ? (
                  <CircleCheck
                    className={styles.answerAcceptedIcon}
                    data-answer-accepted-icon
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.8}
                  />
                ) : undefined
              }
              invalid={Boolean(error)}
              autoComplete="off"
              disabled={!props.enhanced || accepted || props.checking}
              value={props.answer}
              onChange={(event) =>
                props.onAnswerChange(event.currentTarget.value)
              }
            />
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
              aria-label={props.checking ? "Проверяем" : undefined}
              disabled={
                !props.enhanced ||
                accepted ||
                props.state === "stale" ||
                props.state === "unavailable"
              }
            >
              Проверить
            </Button>
          )}
        </div>
        {needsRefresh ? (
          <Button
            className={styles.answerRefresh}
            hierarchy="quiet"
            onClick={props.onRefresh}
          >
            Обновить условие
          </Button>
        ) : null}
      </div>
    </form>
  );
};

function answerError(state: LessonPracticeTypes.State): string | undefined {
  if (state === "incorrect") {
    return "Ответ пока не подходит. Попробуйте ещё раз или откройте подсказку.";
  }
  if (state === "stale") {
    return "Задача изменилась. Обновите условие и проверьте ответ заново. Введённый ответ сохранён.";
  }
  if (state === "unavailable") {
    return "Задача больше недоступна. Обновите страницу или выберите другую задачу.";
  }
  if (state === "error")
    return "Не удалось проверить ответ. Попробуйте ещё раз.";
  return undefined;
}
