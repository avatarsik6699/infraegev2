import { LessonProgress, useLessonProgress } from "~/features/lesson-progress";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "../course-lesson-page.module.css";

type Props = {
  masteryThreshold: number;
  lessonId: string;
  taskCount: number;
};

export const CourseLessonProgress: React.FC<Props> = (props) => {
  const progress = useLessonProgress(props.lessonId);
  const enhanced = useIsEnhanced();
  const solvedCount = progress.solvedTaskIds.length;

  return (
    <div className={styles.resultProgress} data-course-result-progress>
      <LessonProgress
        headingId="course-result-progress-title"
        masteryThreshold={props.masteryThreshold}
        solved={solvedCount}
        total={props.taskCount}
      />
      {enhanced ? (
        <ConfirmationDialog
          triggerLabel="Сбросить прогресс"
          triggerAriaLabel="Сбросить прогресс урока"
          title="Сбросить прогресс?"
          description="Будут удалены решённые задачи и принятые ответы только этого урока."
          confirmLabel="Сбросить"
          onConfirm={progress.clear}
        />
      ) : null}
    </div>
  );
};
