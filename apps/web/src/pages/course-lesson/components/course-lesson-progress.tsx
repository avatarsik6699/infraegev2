import { useRef, useState } from "react";
import { LessonProgress, useLessonProgress } from "~/features/lesson-progress";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import styles from "../course-lesson-page.module.css";

type Props = {
  masteryThreshold: number;
  lessonId: string;
  taskCount: number;
};

export const CourseLessonProgress: React.FC<Props> = (props) => {
  const progress = useLessonProgress(props.lessonId);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const solvedCount = progress.solvedTaskIds.length;

  function beginReset(): void {
    setConfirmingReset(true);
    queueMicrotask(() => confirmButtonRef.current?.focus());
  }

  function cancelReset(): void {
    setConfirmingReset(false);
    queueMicrotask(() => resetButtonRef.current?.focus());
  }

  function confirmReset(): void {
    progress.clear();
    setConfirmingReset(false);
    queueMicrotask(() => resetButtonRef.current?.focus());
  }

  return (
    <div className={styles.resultProgress} data-course-result-progress>
      <LessonProgress
        headingId="course-result-progress-title"
        masteryThreshold={props.masteryThreshold}
        solved={solvedCount}
        total={props.taskCount}
      />
      <div className={styles.resetFlow}>
        <Button
          hierarchy="quiet"
          onClick={beginReset}
          ref={resetButtonRef}
          type="button"
        >
          Сбросить прогресс урока
        </Button>
        {confirmingReset ? (
          <div className={styles.resetConfirmation}>
            <Typography.Text>
              Удалить все принятые ответы в этом уроке?
            </Typography.Text>
            <div className={styles.resetActions}>
              <Button
                hierarchy="primary"
                onClick={confirmReset}
                ref={confirmButtonRef}
                type="button"
              >
                Удалить ответы
              </Button>
              <Button hierarchy="quiet" onClick={cancelReset} type="button">
                Отмена
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
