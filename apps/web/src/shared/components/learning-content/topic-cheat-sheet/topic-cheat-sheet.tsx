import mediaStyles from "../lesson-media/lesson-media.module.css";
import type { TopicCheatSheetTypes } from "./topic-cheat-sheet.types";
import styles from "./topic-cheat-sheet.module.css";

/**
 * The whole topic on one sheet (Change 171): solving order, one block per
 * subtopic with its key code and optional topic-wide sections (for topic 25:
 * where candidates come from and the final checks). HTML rather than a picture, so it reflows to one column on a phone.
 */
export const TopicCheatSheet: React.FC<TopicCheatSheetTypes.Props> = (
  props,
) => (
  <figure
    className={mediaStyles.figure}
    aria-label={props.label}
    data-topic-cheat-sheet
  >
    <div className={styles.sheet}>
      <ol className={styles.flow}>
        {props.flow.map((step) => (
          <li key={step.name} className={styles.step}>
            <b className={styles.stepName}>{step.name}</b>
            <span className={styles.stepNote}>{step.note}</span>
          </li>
        ))}
      </ol>
      <div className={styles.grid}>
        {props.groups.map((group) => (
          <section key={group.number} className={styles.group}>
            <h3 className={styles.title}>
              <span className={styles.number}>{group.number}</span>
              {group.title}
              {group.level ? (
                <small className={styles.level}>{group.level}</small>
              ) : null}
            </h3>
            <Rows rows={group.rows} />
          </section>
        ))}
      </div>
      {props.sections?.length ? (
        <div className={styles.foot}>
          {props.sections.map((section) => (
            <section
              key={section.title}
              className={styles.group}
              data-wide={section.columns || undefined}
            >
              <h3 className={styles.title}>{section.title}</h3>
              {section.rows ? (
                <Rows rows={section.rows} columns={section.columns} />
              ) : null}
              {section.steps ? (
                <ol className={styles.checks}>
                  {section.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              ) : null}
              {section.note ? (
                <p className={styles.footNote}>{section.note}</p>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
    </div>
    <figcaption className={mediaStyles.caption}>{props.caption}</figcaption>
  </figure>
);

const Rows: React.FC<{
  rows: readonly TopicCheatSheetTypes.Row[];
  columns?: boolean;
}> = (props) => (
  <ul className={styles.rows} data-columns={props.columns || undefined}>
    {props.rows.map((row, index) => (
      <li key={index} className={styles.row}>
        <span className={styles.key}>{row.key}</span>
        <span className={styles.note}>{row.note}</span>
      </li>
    ))}
  </ul>
);
