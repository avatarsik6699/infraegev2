import { examPlan, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { Tooltip } from "~/shared/components/tooltip";
import patterns from "~/shared/styles/patterns.module.css";
import { topicCatalogModel } from "../model/topic-catalog-model";
import styles from "../topic-catalog-page.module.css";

type Props = {
  goal: TopicCatalogTypes.Goal;
  onGoalChange: (goal: TopicCatalogTypes.Goal) => void;
};

/**
 * Change 185 (F35–F44): the goal as a scale of three cumulative steps — База,
 * Стандарт, Хард. Native radios: arrows move along the scale; the chosen step
 * is thicker in its level's tone, the ones below it are lightly filled. Each
 * step explains itself in a tooltip on hover or focus; the same text is the
 * radio's description for screen readers.
 */
export const TopicCatalogGoal: React.FC<Props> = (props) => {
  const index = examPlan.goals.findIndex((goal) => goal.id === props.goal);
  return (
    <div className={styles.goal} data-topic-goal>
      <div
        className={styles.goalScale}
        role="radiogroup"
        aria-label="Цель по баллам"
        data-goal-index={index}
      >
        {examPlan.goals.map((goal) => {
          const help = `${goal.summary} ${topicCatalogModel.goalScope(goal.id)}.`;
          const helpId = `topic-goal-help-${goal.id}`;
          return (
            <Tooltip key={goal.id} content={help}>
              <label
                className={styles.goalStep}
                data-level={goal.levels.at(-1)}
              >
                <input
                  className={styles.stepInput}
                  type="radio"
                  name="topic-goal"
                  value={goal.id}
                  checked={goal.id === props.goal}
                  aria-describedby={helpId}
                  onChange={() => props.onGoalChange(goal.id)}
                />
                <span className={styles.goalName}>{goal.title}</span>
                <span className={styles.goalTarget}>
                  {`${String(goal.target)}+`}
                </span>
                <span id={helpId} className={patterns.visuallyHidden}>
                  {help}
                </span>
              </label>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
