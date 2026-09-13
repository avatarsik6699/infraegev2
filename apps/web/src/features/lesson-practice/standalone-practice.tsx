import type { LessonPracticeTypes } from "./lesson-practice.types";
import { useLessonPracticeModel } from "./model/use-lesson-practice-model";
import { PracticeTaskAnswer } from "./components/practice-task-answer";
import { PracticeTaskHelp } from "./components/practice-task-help";
import { PracticeTaskFeedback } from "./components/practice-task-feedback";
import { Typography } from "~/shared/components/typography";
import styles from "./lesson-practice.module.css";

export const StandalonePractice: React.FC<
  LessonPracticeTypes.Props & { focusOnMount?: boolean }
> = (props) => {
  const model = useLessonPracticeModel(props);
  const task = props.tasks[0];
  if (!task) return null;
  return (
    <div
      className={styles.practiceSet}
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
      <PracticeTaskAnswer
        focusOnMount={props.focusOnMount}
        task={task}
        inputId={`answer-${task.id}`}
        alreadySolved={model.isSolved(task.id)}
        checking={model.stateFor(task.id) === "checking"}
        enhanced={model.enhanced}
        answer={model.answerFor(task.id)}
        state={model.stateFor(task.id)}
        onAnswerChange={(value) => model.updateAnswer(task.id, value)}
        onRefresh={() => {
          void model.refresh();
        }}
        onSubmit={(event) => {
          void model.checkAnswer(task, event);
        }}
      />
      <PracticeTaskFeedback
        feedback={model.feedbackFor(task.id)}
        state={model.stateFor(task.id)}
      />
      <PracticeTaskHelp task={task} />
    </div>
  );
};
