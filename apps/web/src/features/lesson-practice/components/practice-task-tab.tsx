import { Check } from "lucide-react";
import {
  PracticeDifficultyGlyph,
  type PracticeTaskTypes,
} from "~/entities/practice-task";
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
      "data-difficulty": props.task.difficulty,
      "data-practice-task-tab": props.task.id,
      "data-solved": props.solved || undefined,
    }}
  >
    <PracticeDifficultyGlyph level={props.task.difficulty} />
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
