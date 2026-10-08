import type { LessonPracticeTypes } from "../lesson-practice.types";
import styles from "../lesson-practice.module.css";

/**
 * F30: a correct answer shows in the field itself (green with a check), so
 * the result is spoken, not printed; the solution stays behind «Решение».
 */
export const PracticeTaskFeedback: React.FC<{
  state: LessonPracticeTypes.State;
}> = (props) => {
  const message = feedbackMessage(props.state);
  return message ? (
    <span className={styles.visuallyHidden} role="status" aria-live="polite">
      {message}
    </span>
  ) : null;
};

function feedbackMessage(state: LessonPracticeTypes.State): string {
  if (state === "checking") return "Проверяем ответ…";
  if (state === "correct") return "Верно. Ответ принят.";
  return "";
}
