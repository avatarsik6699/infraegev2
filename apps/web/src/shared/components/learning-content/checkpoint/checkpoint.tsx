import { useId } from "react";
import { Typography } from "~/shared/components/typography";
import styles from "./checkpoint.module.css";

type CheckpointItem = {
  id: string;
  prompt: React.ReactNode;
  reveal: React.ReactNode;
};

type Props = {
  items: readonly CheckpointItem[];
  /** The section heading's level: 2 on a subtopic page, 3 inside a section. */
  headingOrder?: 2 | 3 | 4;
  headingClassName?: string;
};

/**
 * «Проверьте себя» (Change 184, variant A of the architect's review): a section
 * of numbered questions, each with the practice task's soft «Ответ» button and
 * the answer under it, captioned «Ответ» as «Решение» is in a task. A native
 * `details`, so the answer stays closed and opens from the keyboard with or
 * without scripting; the question is text, so its terms and file links work.
 */
export const Checkpoint: React.FC<Props> = (props) => {
  const headingId = useId();
  return (
    <section
      className={styles.root}
      data-learning-block
      data-checkpoint
      aria-labelledby={headingId}
    >
      <Typography.Title
        order={props.headingOrder ?? 2}
        id={headingId}
        className={props.headingClassName}
      >
        Проверьте себя
      </Typography.Title>
      <Typography.Text className={styles.lead}>
        Ответь сначала сам, потом открой ответ.
      </Typography.Text>
      <ol className={styles.list}>
        {props.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.prompt}>{item.prompt}</div>
            <details className={styles.answer}>
              <summary className={styles.toggle}>
                <span className={styles.toggleLabel}>
                  <span className={styles.reserve} aria-hidden="true">
                    Скрыть ответ
                  </span>
                  <span className={styles.closed}>Ответ</span>
                  <span className={styles.open}>Скрыть ответ</span>
                </span>
              </summary>
              <div className={styles.panel}>
                <Typography.Text component="div" className={styles.caption}>
                  Ответ
                </Typography.Text>
                <div className={styles.reveal}>{item.reveal}</div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
};
