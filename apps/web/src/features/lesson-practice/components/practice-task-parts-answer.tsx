import { useRef, useState, type ComponentProps } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { ConfettiBurst } from "~/shared/components/confetti-burst";
import { Field } from "~/shared/components/field";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

type Props = {
  inputId: string;
  parts: readonly PracticeTaskTypes.AnswerPart[];
  alreadySolved: boolean;
  checking: boolean;
  enhanced: boolean;
  answers: Readonly<Record<string, string>>;
  results?: Readonly<Record<string, boolean>>;
  state: LessonPracticeTypes.State;
  onAnswerChange: (key: string, value: string) => void;
  onRefresh: () => void;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

/**
 * Change 191 (F5): EGE 19–21 is one task with three questions — one labelled
 * field per question and one «Проверить». Each part shows its own result; the
 * task is accepted only when every part is correct.
 */
export const PracticeTaskPartsAnswer: React.FC<Props> = (props) => {
  const firstRef = useRef<HTMLInputElement>(null);
  const [emptyAttempt, setEmptyAttempt] = useState(false);
  const accepted = props.alreadySolved || props.state === "correct";
  const needsRefresh = props.state === "stale" || props.state === "unavailable";
  const answered = props.parts.filter(
    (part) => props.results?.[part.key] !== undefined,
  );
  const right = answered.filter((part) => props.results?.[part.key]).length;
  const summary = summaryText(props.state, emptyAttempt, right, props.parts);
  return (
    <form
      className={styles.practiceForm}
      onSubmit={(event) => {
        if (props.parts.every((part) => !props.answers[part.key]?.trim())) {
          event.preventDefault();
          setEmptyAttempt(true);
          firstRef.current?.focus();
          return;
        }
        setEmptyAttempt(false);
        props.onSubmit(event);
      }}
    >
      <div className={styles.answerParts}>
        {props.parts.map((part, index) => {
          const result = accepted ? true : props.results?.[part.key];
          return (
            <div key={part.key} className={styles.answerPart}>
              <Field
                ref={index === 0 ? firstRef : undefined}
                id={`${props.inputId}-${part.key}`}
                name={`answer-${part.key}`}
                label={part.label}
                description={part.answerInstruction}
                maxLength={500}
                autoComplete="off"
                placeholder={accepted ? "Ответ принят" : "Введите ответ"}
                success={result === true}
                invalid={result === false}
                error={result === false ? "Ответ пока не подходит." : undefined}
                disabled={!props.enhanced || accepted || props.checking}
                value={props.answers[part.key] ?? ""}
                onChange={(event) => {
                  setEmptyAttempt(false);
                  props.onAnswerChange(part.key, event.currentTarget.value);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.answerPartsActions}>
        <span className={styles.answerAction}>
          <Button
            type="submit"
            loading={props.checking}
            aria-label={props.checking ? "Проверяем" : undefined}
            disabled={!props.enhanced || accepted || needsRefresh}
          >
            Проверить
          </Button>
          <ConfettiBurst active={props.state === "correct"} />
        </span>
        {summary ? (
          <Typography.Text role="status" className={styles.instruction}>
            {summary}
          </Typography.Text>
        ) : null}
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

function summaryText(
  state: LessonPracticeTypes.State,
  emptyAttempt: boolean,
  right: number,
  parts: readonly PracticeTaskTypes.AnswerPart[],
): string | undefined {
  if (emptyAttempt) return "Введите хотя бы один ответ, чтобы проверить.";
  if (state === "incorrect")
    return `Верно ${String(right)} из ${String(parts.length)}. Задание засчитывается, когда верны все ответы.`;
  if (state === "stale")
    return "Задача изменилась. Обновите условие и проверьте ответы заново.";
  if (state === "unavailable")
    return "Задача больше недоступна. Обновите страницу или выберите другую задачу.";
  if (state === "error")
    return "Не удалось проверить ответы. Попробуйте ещё раз.";
  return undefined;
}
