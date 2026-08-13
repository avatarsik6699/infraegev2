import { Button } from "@mantine/core";
import type { LessonTypes } from "~/entities/lesson";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

type PracticeTaskFeedbackProps = {
  state: LessonPracticeTypes.State;
  task: LessonTypes.PracticeTask;
  alreadySolved: boolean;
  nextTask?: LessonTypes.PracticeTask;
  onSelectNext: (taskId: string) => void;
};

export const PracticeTaskFeedback: React.FC<PracticeTaskFeedbackProps> = (
  props,
) => {
  const complete = props.state === "correct" || props.alreadySolved;

  return (
    <>
      <Typography.Text
        className={styles.feedback}
        data-state={props.state}
        role="status"
        aria-live="polite"
      >
        {feedbackMessage(props)}
      </Typography.Text>
      {complete ? (
        props.nextTask ? (
          <Button
            className={styles.nextTask}
            type="button"
            variant="outline"
            onClick={() => props.onSelectNext(props.nextTask?.id ?? "")}
          >
            {`Следующая задача: ${props.nextTask.title}`}
          </Button>
        ) : (
          <FragmentLink className={styles.resultLink} hash="result">
            Перейти к результату
          </FragmentLink>
        )
      ) : null}
    </>
  );
};

function feedbackMessage(props: PracticeTaskFeedbackProps): string {
  if (props.state === "correct") return `Верно. ${props.task.explanation}`;
  if (props.state === "incorrect") {
    return "Пока нет. Проверьте правило ещё раз или откройте подсказку.";
  }
  if (props.alreadySolved) return "Задача уже решена и учтена в прогрессе.";
  return "";
}
