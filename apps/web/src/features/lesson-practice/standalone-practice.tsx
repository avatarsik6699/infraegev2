import type { LessonPracticeTypes } from "./lesson-practice.types";
import { useLessonPracticeModel } from "./model/use-lesson-practice-model";
import { PracticeTaskSolver } from "./components/practice-task-solver";
import { Typography } from "~/shared/components/typography";
import styles from "./lesson-practice.module.css";

export const StandalonePractice: React.FC<
  LessonPracticeTypes.Props & {
    focusOnMount?: boolean;
    active?: boolean;
    helpHeadingOrder?: 2 | 3 | 4;
    onRepeat?: () => void;
  }
> = (props) => {
  const task = props.tasks[0];
  const model = useLessonPracticeModel(props);
  if (!task) return null;
  return (
    <div
      className={styles.practiceSet}
      data-standalone
      data-practice-form
      data-presentation="study"
      data-enhanced={model.enhanced || undefined}
    >
      <noscript>
        <Typography.Text tone="muted" variant="caption">
          Для проверки ответов нужен JavaScript. Условие, подсказка и решение
          доступны ниже.
        </Typography.Text>
      </noscript>
      <PracticeTaskSolver
        task={task}
        headingOrder={props.helpHeadingOrder}
        focusOnMount={props.focusOnMount}
        active={props.active}
        onRepeat={props.onRepeat}
        alreadySolved={model.isSolved(task.id)}
        enhanced={model.enhanced}
        answer={model.answerFor(task.id)}
        state={model.stateFor(task.id)}
        onAnswerChange={(value) => model.updateAnswer(task.id, value)}
        partAnswers={model.partAnswersFor(task)}
        partResults={model.partResultsFor(task.id)}
        onPartAnswerChange={(key, value) =>
          model.updateAnswer(`${task.id}:${key}`, value)
        }
        onRefresh={() => {
          void model.refresh();
        }}
        onSubmit={(event) => {
          void model.checkAnswer(task, event);
        }}
      />
    </div>
  );
};
