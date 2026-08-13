import type { KeyboardEvent } from "react";
import { Check } from "lucide-react";
import type { LessonTypes } from "~/entities/lesson";
import styles from "../lesson-practice.module.css";

type PracticeTaskTabProps = {
  task: LessonTypes.PracticeTask;
  index: number;
  total: number;
  active: boolean;
  solved: boolean;
  onSelect: (taskId: string) => void;
  onKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => void;
  setRef: (taskId: string, element: HTMLButtonElement | null) => void;
};

export const PracticeTaskTab: React.FC<PracticeTaskTabProps> = (props) => (
  <button
    className={styles.practiceTab}
    type="button"
    role="tab"
    id={`practice-tab-${props.task.id}`}
    aria-controls={`practice-panel-${props.task.id}`}
    aria-selected={props.active}
    aria-label={`Задача ${String(props.index + 1)} из ${String(props.total)}, сложность ${String(props.index + 1)} из ${String(props.total)}: ${props.task.title}${props.solved ? ", решена" : ""}`}
    data-difficulty={props.index + 1}
    data-solved={props.solved || undefined}
    tabIndex={props.active ? 0 : -1}
    ref={(element) => props.setRef(props.task.id, element)}
    onClick={() => props.onSelect(props.task.id)}
    onKeyDown={(event) => props.onKeyDown(event, props.index)}
  >
    <span className={styles.tabIndex} aria-hidden="true">
      {String(props.index + 1).padStart(2, "0")}
    </span>
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
  </button>
);
