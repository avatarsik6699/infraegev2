import { Check } from "lucide-react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { TabsTab } from "~/shared/components/tabs";
import styles from "../lesson-practice.module.css";

type PracticeTaskTabProps = {
  task: PracticeTaskTypes.Task;
  index: number;
  total: number;
  solved: boolean;
};

export const PracticeTaskTab: React.FC<PracticeTaskTabProps> = (props) => (
  <TabsTab
    className={styles.practiceTab}
    value={props.task.id}
    ariaLabel={`${String(props.index + 1).padStart(2, "0")} · ${props.task.difficultyLabel}. Задача ${String(props.index + 1)} из ${String(props.total)}: ${props.task.title}${props.solved ? ", решена" : ""}`}
    tabProps={{
      "data-difficulty": props.index + 1,
      "data-practice-task-tab": props.task.id,
      "data-solved": props.solved || undefined,
    }}
  >
    <span className={styles.difficultyGlyph} aria-hidden="true">
      <svg viewBox="0 0 34 20" focusable="false">
        {[0, 1, 2, 3, 4].map((level) => (
          <rect
            x={level * 7}
            y={16 - level * 3}
            width="4"
            height={4 + level * 3}
            rx="1"
            data-filled={level <= props.index || undefined}
            key={level}
          />
        ))}
      </svg>
    </span>
    <span className={styles.tabLabel}>{props.task.difficultyLabel}</span>
    {props.solved ? (
      <Check
        className={styles.tabSolved}
        aria-hidden="true"
        size={12}
        strokeWidth={2}
      />
    ) : null}
  </TabsTab>
);
