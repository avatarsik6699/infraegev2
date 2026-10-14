import styles from "./lesson-summary.module.css";

export type LessonSummaryItem = {
  /** What to recognise in a task: a term, a formula, an error. */
  key?: React.ReactNode;
  /** What to remember about it. */
  note: React.ReactNode;
};

/**
 * «Итого» of a subtopic (Change 184, variant C of the architect's review): the
 * subtopic's keys in a grid, each a key over a muted note, as the subtopic
 * blocks of the topic cheat sheet — without their frame. A list without keys
 * (sentences, as most topics still write it) reads in one column.
 */
export const LessonSummary: React.FC<{
  items: readonly LessonSummaryItem[];
}> = (props) => (
  <ul
    className={styles.root}
    data-lesson-summary
    data-learning-block
    data-plain={props.items.every((item) => !item.key) || undefined}
  >
    {props.items.map((item, index) => (
      <li key={index} className={styles.item}>
        {item.key ? <span className={styles.key}>{item.key}</span> : null}
        <span className={item.key ? styles.note : styles.plain}>
          {item.note}
        </span>
      </li>
    ))}
  </ul>
);
