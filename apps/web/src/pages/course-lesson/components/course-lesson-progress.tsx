import type { PracticeTaskTypes } from "~/entities/practice-task";
import { LessonProgress, useLessonProgress } from "~/features/lesson-progress";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "~/shared/styles/lesson-layout.module.css";

type Props = {
  masteryThreshold: number;
  lessonId: string;
  tasks: readonly PracticeTaskTypes.Task[];
};

export const CourseLessonProgress: React.FC<Props> = (props) => {
  const progress = useLessonProgress(props.lessonId, props.tasks);
  const enhanced = useIsEnhanced();
  return (
    <div className={styles.resultProgress} data-course-result-progress>
      {enhanced ? (
        <>
          <LessonProgress
            hideEmptyStatus
            headingId="course-result-progress-title"
            headingOrder={2}
            masteryThreshold={props.masteryThreshold}
            solved={progress.solvedTaskIds.length}
            total={props.tasks.length}
          />
          <ConfirmationDialog
            triggerLabel="Сбросить прогресс"
            triggerAppearance="subtle"
            triggerAriaLabel="Сбросить прогресс урока"
            title="Сбросить прогресс?"
            description="Будут удалены решённые задачи и принятые ответы только этого урока."
            confirmLabel="Сбросить"
            onConfirm={progress.clear}
          />
        </>
      ) : (
        <>
          <Typography.Title
            order={2}
            id="course-result-progress-title"
            className={styles.progressHeading}
          >
            Прогресс
          </Typography.Title>
          <Typography.Text tone="muted" className={styles.progressStatus}>
            Прогресс хранится только в этом браузере и появится после загрузки
            страницы.
          </Typography.Text>
        </>
      )}
    </div>
  );
};
