import { PracticeTaskPanel } from "./components/practice-task-panel";
import { PracticeTaskTabs } from "./components/practice-task-tabs";
import type { LessonPracticeTypes } from "./lesson-practice.types";
import { useLessonPracticeModel } from "./model/use-lesson-practice-model";
import styles from "./lesson-practice.module.css";

export const LessonPractice: React.FC<LessonPracticeTypes.Props> = (props) => {
  const model = useLessonPracticeModel(props);

  return (
    <div className={styles.practiceSet} data-practice-form>
      <PracticeTaskTabs
        activeTaskId={model.activeTaskId}
        enhanced={model.enhanced}
        isSolved={model.isSolved}
        onKeyDown={model.handleTabKeyDown}
        onSelect={model.selectTask}
        setRef={model.setTabRef}
        tasks={props.tasks}
      />
      {props.tasks.map((task, index) => (
        <PracticeTaskPanel
          active={task.id === model.activeTaskId}
          alreadySolved={model.isSolved(task.id)}
          enhanced={model.enhanced}
          index={index}
          key={task.id}
          nextTask={props.tasks[index + 1]}
          onSelectNext={(taskId) => model.selectTask(taskId, true)}
          onSubmit={(event) => model.checkAnswer(task, event)}
          setHeadingRef={model.setHeadingRef}
          state={model.stateFor(task.id)}
          task={task}
        />
      ))}
    </div>
  );
};
