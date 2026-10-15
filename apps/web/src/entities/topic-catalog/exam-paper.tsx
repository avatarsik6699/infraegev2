import styles from "./exam-paper.module.css";

/** Change 186 (F46): the squared-paper backdrop of the EGE page heads. */
export const ExamPaper: React.FC = () => (
  <div className={styles.paper} aria-hidden="true" />
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
