import { PracticeTaskPanel } from "./components/practice-task-panel";
import { PracticeTaskTabs } from "./components/practice-task-tabs";
import type { LessonPracticeTypes } from "./lesson-practice.types";
import { useLessonPracticeModel } from "./model/use-lesson-practice-model";
import { TabsRoot } from "~/shared/components/tabs";
import styles from "./lesson-practice.module.css";

export const LessonPractice: React.FC<LessonPracticeTypes.Props> = (props) => {
  const model = useLessonPracticeModel(props);

  return (
    <div
      className={styles.practiceSet}
      data-enhanced={model.enhanced || undefined}
      data-practice-form
    >
      <TabsRoot value={model.activeTaskId} onValueChange={model.selectTask}>
        <PracticeTaskTabs
          enhanced={model.enhanced}
          isSolved={model.isSolved}
          tasks={props.tasks}
        />
        {props.tasks.map((task, index) => (
          <PracticeTaskPanel
            alreadySolved={model.isSolved(task.id)}
            answer={model.answerFor(task.id)}
            enhanced={model.enhanced}
            index={index}
            key={task.id}
            onSubmit={(event) => {
              void model.checkAnswer(task, event);
            }}
            onAnswerChange={(value) => model.updateAnswer(task.id, value)}
            state={model.stateFor(task.id)}
            feedback={model.feedbackFor(task.id)}
            task={task}
          />
        ))}
      </TabsRoot>
    </div>
  );
};
