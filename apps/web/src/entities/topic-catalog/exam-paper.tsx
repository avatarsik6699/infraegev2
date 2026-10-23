import { TopicHeadDrawing } from "~/shared/components/object-illustration";
import styles from "./exam-paper.module.css";

/**
 * Change 186 (F46): the squared-paper backdrop of the EGE page heads. A
 * topic's head (Change 197) adds its ink drawing over the paper: the topic's
 * catalog picture and its signs scattered round it, made by
 * scripts/mascot/topic_heads.mjs.
 */
export const ExamPaper: React.FC<{ task?: number }> = (props) => (
  <>
    <div className={styles.paper} aria-hidden="true" />
    {props.task === undefined ? null : (
      <TopicHeadDrawing topic={props.task} className={styles.drawing} />
    )}
  </>
);

/** Change 186 (F49): the EGE mark beside «Темы ЕГЭ» in the lesson rail. */
export const ExamMark: React.FC<{ className?: string }> = (props) => (
  <svg
    className={[styles.mark, props.className].filter(Boolean).join(" ")}
    viewBox="0 0 26 26"
    aria-hidden="true"
  >
    <rect width="26" height="26" rx="6" />
    <text x="13" y="16.2" fontSize="8.5" textAnchor="middle">
      ЕГЭ
    </text>
  </svg>
);
