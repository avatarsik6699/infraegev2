import { Button } from "@mantine/core";
import type { ComponentProps } from "react";
import type { LessonTypes } from "~/entities/lesson";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-practice.module.css";

type PracticeTaskAnswerProps = {
  task: LessonTypes.PracticeTask;
  inputId: string;
  alreadySolved: boolean;
  onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
};

export const PracticeTaskAnswer: React.FC<PracticeTaskAnswerProps> = (
  props,
) => (
  <form className={styles.practiceForm} onSubmit={props.onSubmit}>
    <Typography.Text className={styles.taskStatement}>
      {props.task.statement}
    </Typography.Text>
    <label htmlFor={props.inputId}>{`Ваш ответ — ${props.task.title}`}</label>
    <div className={styles.answerRow}>
      <input
        id={props.inputId}
        name="answer"
        autoComplete="off"
        disabled={props.alreadySolved}
        suppressHydrationWarning
      />
      <Button type="submit" disabled={props.alreadySolved}>
        {props.alreadySolved ? "Решено" : "Проверить"}
      </Button>
    </div>
    <details className={styles.hint}>
      <summary>Подсказка</summary>
      {props.task.hint}
    </details>
  </form>
);
