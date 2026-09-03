import { LessonProgress, useLessonProgress } from "~/features/lesson-progress";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "../topic-lesson-page.module.css";

type Props = {
  masteryThreshold: number;
  lessonId: string;
  taskCount: number;
};

export const TopicLessonProgress: React.FC<Props> = (props) => {
  const progress = useLessonProgress(props.lessonId);
  const enhanced = useIsEnhanced();
  return (
    <div className={styles.resultProgress} data-result-progress>
      {enhanced ? (
        <>
          <LessonProgress
            headingId="result-progress-title"
            headingOrder={2}
            masteryThreshold={props.masteryThreshold}
            solved={progress.solvedTaskIds.length}
            total={props.taskCount}
          />
          <ConfirmationDialog
            triggerLabel="Сбросить прогресс"
            triggerAriaLabel="Сбросить прогресс урока"
            title="Сбросить прогресс?"
            description="Будут удалены решённые задачи и принятые ответы только этого урока."
            confirmLabel="Сбросить"
            onConfirm={progress.clear}
          />
        </>
      ) : (
        <>
          <Typography.Title order={2} id="result-progress-title">
            Прогресс
          </Typography.Title>
          <Typography.Text tone="muted">
            Прогресс хранится только в этом браузере и появится после загрузки
            страницы.
          </Typography.Text>
        </>
      )}
    </div>
  );
};
