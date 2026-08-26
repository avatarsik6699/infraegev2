import { useRef, useState } from "react";
import { LessonProgress, useLessonProgress } from "~/features/lesson-progress";
import { Button } from "~/shared/components/button";
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
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const cancelReset = () => {
    setConfirmingReset(false);
    resetButtonRef.current?.focus();
  };
  const confirmReset = () => {
    progress.clear();
    setConfirmingReset(false);
    resetButtonRef.current?.focus();
  };

  return (
    <div className={styles.resultProgress} data-result-progress>
      {enhanced ? (
        <>
          <LessonProgress
            headingId="result-progress-title"
            headingOrder={3}
            masteryThreshold={props.masteryThreshold}
            solved={progress.solvedTaskIds.length}
            total={props.taskCount}
          />
          <div className={styles.resetFlow}>
            <Button
              hierarchy="quiet"
              type="button"
              aria-expanded={confirmingReset}
              aria-controls="lesson-reset-confirmation"
              onClick={(event) => {
                resetButtonRef.current = event.currentTarget;
                setConfirmingReset(true);
              }}
            >
              Сбросить прогресс урока
            </Button>
            {confirmingReset ? (
              <div
                className={styles.resetConfirmation}
                id="lesson-reset-confirmation"
                role="group"
                aria-label="Подтверждение сброса прогресса"
              >
                <Typography.Text>
                  Будут удалены решённые задачи и принятые ответы только этого
                  урока.
                </Typography.Text>
                <div className={styles.resetActions}>
                  <Button
                    hierarchy="secondary"
                    type="button"
                    autoFocus
                    onClick={cancelReset}
                  >
                    Отмена
                  </Button>
                  <Button type="button" onClick={confirmReset}>
                    Сбросить
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Typography.Title order={3} id="result-progress-title">
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
