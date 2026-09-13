import { Button } from "~/shared/components/button";
import { PracticeTaskPanel } from "./components/practice-task-panel";
import { PracticeTaskTabs } from "./components/practice-task-tabs";
import type { LessonPracticeTypes } from "./lesson-practice.types";
import { useLessonPracticeModel } from "./model/use-lesson-practice-model";
import { TabsRoot } from "~/shared/components/tabs";
import { Typography } from "~/shared/components/typography";
import { EmptyState } from "~/shared/components/empty-state";
import styles from "./lesson-practice.module.css";

export const LessonPractice: React.FC<LessonPracticeTypes.Props> = (props) => {
  const model = useLessonPracticeModel(props);

  if (props.unavailable)
    return (
      <div role="status">
        <Typography.Text tone="muted">
          Практика временно недоступна. Можно продолжить читать теорию.
        </Typography.Text>
        <Button
          onClick={() => {
            void model.refresh();
          }}
        >
          Повторить загрузку
        </Button>
      </div>
    );

  if (props.tasks.length === 0) {
    return (
      <EmptyState
        title="В этом уроке нет практических заданий"
        description="Можно продолжить чтение урока."
      />
    );
  }

  return (
    <div
      className={styles.practiceSet}
      data-enhanced={model.enhanced || undefined}
      data-presentation="study"
      data-practice-form
    >
      {model.enhanced && props.outdatedTaskIds?.length ? (
        <Typography.Text role="status" tone="muted">
          Некоторые задачи изменились. Прежние решения сохранены; для зачёта
          новой версии решите их ещё раз.
        </Typography.Text>
      ) : null}
      {model.enhanced && props.tasks.length > 0 ? (
        <Typography.Text
          className={styles.taskPosition}
          aria-live="polite"
          data-task-position
        >
          Задание{" "}
          {props.tasks.findIndex((task) => task.id === model.activeTaskId) + 1}{" "}
          из {props.tasks.length}
        </Typography.Text>
      ) : null}
      {!model.enhanced ? (
        <Typography.Text variant="caption" tone="muted">
          Для проверки ответов нужен JavaScript. Условия, подсказки и решения
          доступны ниже.
        </Typography.Text>
      ) : null}
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
            onRefresh={() => {
              void model.refresh();
            }}
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
