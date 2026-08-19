import { Typography } from "~/shared/components/typography";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

type PracticeTaskFeedbackProps = {
  state: LessonPracticeTypes.State;
  feedback: string;
};

export const PracticeTaskFeedback: React.FC<PracticeTaskFeedbackProps> = (
  props,
) => {
  const message = feedbackMessage(props);

  return message ? (
    <Typography.Text
      className={styles.feedback}
      data-state={props.state}
      role="status"
      aria-live="polite"
    >
      {message}
    </Typography.Text>
  ) : null;
};

function feedbackMessage(props: PracticeTaskFeedbackProps): string {
  if (props.state === "checking") return "Проверяем ответ…";
  if (props.state === "correct") return `Верно. ${props.feedback}`;
  return "";
}
