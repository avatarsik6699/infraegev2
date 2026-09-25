import type { PracticeTaskTypes } from "~/entities/practice-task";
import { useState } from "react";
import { accountApi, useAccountSession } from "~/features/account";
import {
  LessonProgress,
  GuestLessonProgress,
  useLessonProgress,
  useLessonProgressStatus,
} from "~/features/lesson-progress";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "~/shared/styles/lesson-layout.module.css";

type Props = {
  masteryThreshold: number;
  lessonId: string;
  tasks: readonly PracticeTaskTypes.Task[];
};

export const TopicLessonProgress: React.FC<Props> = (props) => {
  const progress = useLessonProgress(props.lessonId, props.tasks);
  const enhanced = useIsEnhanced();
  const session = useAccountSession();
  const progressStatus = useLessonProgressStatus();
  const [resetError, setResetError] = useState(false);
  let content: React.ReactNode;
  if (session.status === "ready" && !session.account)
    content = (
      <GuestLessonProgress
        headingId="result-progress-title"
        headingOrder={2}
        masteryThreshold={props.masteryThreshold}
        total={props.tasks.length}
      />
    );
  else if (!enhanced || progressStatus !== "ready")
    content = (
      <>
        <Typography.Title
          order={2}
          id="result-progress-title"
          className={styles.progressHeading}
        >
          Прогресс
        </Typography.Title>
        <Typography.Text tone="muted" className={styles.progressStatus}>
          {progressStatus === "error"
            ? "Прогресс временно недоступен."
            : "Прогресс появится после загрузки страницы."}
        </Typography.Text>
      </>
    );
  else
    content = (
      <>
        <LessonProgress
          hideEmptyStatus
          headingId="result-progress-title"
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
          description="Будут удалены решённые задачи только этого урока."
          confirmLabel="Сбросить"
          onConfirm={() => {
            void accountApi
              .resetLesson("topic_lesson", props.lessonId, session.csrfToken)
              .then(
                () => {
                  progress.clear();
                  setResetError(false);
                },
                () => setResetError(true),
              );
          }}
        />
        {resetError ? (
          <Typography.Text role="alert">
            Не удалось сбросить прогресс. Попробуйте ещё раз.
          </Typography.Text>
        ) : null}
      </>
    );
  return (
    <div className={styles.resultProgress} data-result-progress>
      {content}
    </div>
  );
};
