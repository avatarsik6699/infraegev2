import type { LessonTypes } from "~/entities/lesson";
import { Button } from "~/shared/components/button";
import { FragmentLink } from "~/shared/components/fragment-link";
import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

type PracticeTaskFeedbackProps = {
  state: LessonPracticeTypes.State;
  task: LessonTypes.PracticeTask;
  alreadySolved: boolean;
  feedback: string;
  nextTask?: LessonTypes.PracticeTask;
  onSelectNext: (taskId: string) => void;
};

export const PracticeTaskFeedback: React.FC<PracticeTaskFeedbackProps> = (
  props,
) => {
  const complete = props.state === "correct" || props.alreadySolved;
  const message = feedbackMessage(props);

  return (
    <>
      {message ? (
        <Typography.Text
          className={styles.feedback}
          data-state={props.state}
          role="status"
          aria-live="polite"
        >
          {message}
        </Typography.Text>
      ) : null}
      {complete ? (
        props.nextTask ? (
          <Button
            className={styles.nextTask}
            type="button"
            hierarchy="secondary"
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
  if (props.state === "checking") return "Проверяем ответ…";
  if (props.state === "correct") return `Верно. ${props.feedback}`;
  if (props.alreadySolved) return "Задача уже решена и учтена в прогрессе.";
  return "";
}
