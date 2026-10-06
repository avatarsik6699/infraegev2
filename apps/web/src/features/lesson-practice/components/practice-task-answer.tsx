import { useEffect, useRef, useState, type ComponentProps } from "react";
import { Button } from "~/shared/components/button";
import { ConfettiBurst } from "~/shared/components/confetti-burst";
import { Field } from "~/shared/components/field";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

type PracticeTaskAnswerProps = {
  focusOnMount?: boolean;
  active?: boolean;
  onRepeat?: () => void;
  /** Id of a visible instruction the field refers to. */
  describedBy?: string;
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
  const [emptyAttempt, setEmptyAttempt] = useState(false);
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
      const refocus = props.state === "incorrect" || props.state === "error";
      if (
        refocus &&
        previousState.current !== props.state &&
        props.active !== false
      )
        inputRef.current?.focus();
      previousState.current = props.state;
    },
    [props.state, props.active],
  );

  const error = emptyAttempt
    ? "Введите ответ, чтобы проверить."
    : answerError(props.state);
  const needsRefresh = props.state === "stale" || props.state === "unavailable";
  const accepted = props.alreadySolved || props.state === "correct";
  const placeholder = props.describedBy
    ? "Введите ответ"
    : "Без единиц измерения";
  return (
    <form
      className={styles.practiceForm}
      onSubmit={(event) => {
        // An empty answer is a local input problem, not a failed check.
        if (props.answer.trim() === "") {
          event.preventDefault();
          setEmptyAttempt(true);
          inputRef.current?.focus();
          return;
        }
        setEmptyAttempt(false);
        props.onSubmit(event);
      }}
    >
      <div className={styles.answerRow}>
        <div className={styles.answerField}>
          <Field
            data-solved={props.alreadySolved || undefined}
            ref={inputRef}
            id={props.inputId}
            name="answer"
            label="Ваш ответ"
            labelVisibility="sr-only"
            aria-describedby={props.describedBy}
            maxLength={500}
            placeholder={accepted ? "Ответ принят" : placeholder}
            error={error}
            success={accepted}
            invalid={Boolean(error)}
            autoComplete="off"
            disabled={!props.enhanced || accepted || props.checking}
            value={props.answer}
            onChange={(event) => {
              setEmptyAttempt(false);
              props.onAnswerChange(event.currentTarget.value);
            }}
          />
        </div>
        {/* F30: the burst comes from the button the student pressed. */}
        <span className={styles.answerAction}>
          {props.alreadySolved && props.onRepeat ? (
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
          <ConfettiBurst active={props.state === "correct"} />
        </span>
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
