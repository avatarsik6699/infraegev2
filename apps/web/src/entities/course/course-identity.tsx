import styles from "./course-identity.module.css";

const columns = "ABCDEFGHIJKL".split("");
const lines = Array.from({ length: 24 }, (_, index) => index + 1);

/**
 * Change 186 (F22): the backdrop of a course's page head — an editor for
 * Python, a sheet for Excel, nothing for other courses. Decorative only.
 */
export const CourseMotif: React.FC<{ courseId: string }> = (props) => {
  if (props.courseId === "python")
    return (
      <div className={styles.motif} data-motif="python" aria-hidden="true">
        <ol className={styles.ruler}>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </div>
    );
  if (props.courseId === "excel")
    return (
      <div className={styles.motif} data-motif="excel" aria-hidden="true">
        <ol className={styles.columns}>
          {columns.map((column) => (
            <li key={column}>{column}</li>
          ))}
        </ol>
        <ol className={styles.rows}>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </div>
    );
  return null;
};

export const courseIdentity = {
  /**
   * Sets `--course-tone`, `--course-strong`, `--course-ink` and
   * `--course-action` from the element's `data-course-tone` (a course id).
   */
  palette: styles.palette,
};
