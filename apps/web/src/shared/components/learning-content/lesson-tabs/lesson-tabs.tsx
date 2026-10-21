import { useState } from "react";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { ChoiceChips } from "../choice-chips";
import styles from "./lesson-tabs.module.css";

export type LessonTab = {
  label: string;
  /** Block content: steps, code, screenshots. */
  content: React.ReactNode;
};

type Props = {
  /** Accessible name of the choice, e.g. «Среда разработки». */
  label: string;
  tabs: readonly [LessonTab, ...LessonTab[]];
};

/**
 * Parallel ways to do the same thing (Change 197: IDLE, PyCharm, VS Code):
 * chips choose one, its steps sit in a hairline panel under them, as in
 * `VariantPicker` — but the panel holds whole blocks. Without scripting every
 * way is shown in turn under its own name, so nothing is hidden.
 */
export const LessonTabs: React.FC<Props> = (props) => {
  const enhanced = useIsEnhanced();
  const [index, setIndex] = useState(0);

  if (!enhanced) {
    return (
      <div className={styles.root} data-lesson-tabs>
        {props.tabs.map((tab) => (
          <section
            key={tab.label}
            className={styles.panel}
            aria-label={tab.label}
          >
            <span className={styles.caption}>{tab.label}</span>
            <div className={styles.content}>{tab.content}</div>
          </section>
        ))}
      </div>
    );
  }

  // every panel stays mounted and the others are hidden: a live sheet or a
  // stepper keeps its own state, and two tabs never share one instance
  return (
    <div className={styles.root} data-lesson-tabs data-enhanced>
      <ChoiceChips
        label={props.label}
        options={props.tabs.map((tab) => tab.label)}
        selected={index}
        onSelect={setIndex}
      />
      {props.tabs.map((tab, i) => (
        <section
          key={tab.label}
          className={styles.panel}
          aria-label={tab.label}
          aria-live="polite"
          hidden={i !== index}
        >
          <div className={styles.content}>{tab.content}</div>
        </section>
      ))}
    </div>
  );
};
