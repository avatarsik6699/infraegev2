import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import type { LessonTypes } from "~/entities/lesson";
import { Button } from "~/shared/components/button";
import { Field } from "~/shared/components/field";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

type PracticeTaskAnswerProps = {
  task: LessonTypes.PracticeTask;
  inputId: string;
  alreadySolved: boolean;
  checking: boolean;
  state: LessonPracticeTypes.State;
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
        id={props.inputId}
        name="answer"
        label="Ответ"
        labelVisibility="sr-only"
        placeholder="Без единиц измерения"
        error={answerError(props.state)}
        autoComplete="off"
        disabled={props.alreadySolved || props.checking}
      />
      <Button
        type="submit"
        loading={props.checking}
        disabled={props.alreadySolved}
      >
        {props.alreadySolved
          ? "Решено"
          : props.checking
            ? "Проверяем"
            : "Проверить"}
      </Button>
    </div>
    <details className={styles.hint}>
      <summary>
        <span>Подсказка</span>
        <ChevronDown aria-hidden="true" size={16} strokeWidth={1.75} />
      </summary>
      {props.task.hint}
    </details>
  </form>
);

function answerError(state: LessonPracticeTypes.State): string | undefined {
  if (state === "incorrect") {
    return "Пока нет. Проверьте правило ещё раз или откройте подсказку.";
  }
  if (state === "error") {
    return "Не удалось проверить ответ. Проверьте соединение и отправьте его ещё раз.";
  }
  return undefined;
}
