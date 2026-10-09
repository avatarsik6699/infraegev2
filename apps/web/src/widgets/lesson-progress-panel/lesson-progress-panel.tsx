import { masteryTasks, type PracticeTaskTypes } from "~/entities/practice-task";
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
  /** The progress context the reset clears. */
  kind: "topic_lesson" | "course_lesson";
  masteryThreshold: number;
  lessonId: string;
  tasks: readonly PracticeTaskTypes.Task[];
};

/**
 * Lesson progress with its reset, shared by EGE subtopic pages and course
 * lessons (F38): under «На этой странице», or in the menu on narrow screens.
 */
export const LessonProgressPanel: React.FC<Props> = (props) => {
  const headingId =
    props.kind === "topic_lesson"
      ? "result-progress-title"
      : "course-result-progress-title";
  // Advanced-subtopic tasks keep their solved state but stay outside mastery.
  const tasks = masteryTasks(props.tasks);
  const progress = useLessonProgress(props.lessonId, tasks);
  const enhanced = useIsEnhanced();
  const session = useAccountSession();
  const progressStatus = useLessonProgressStatus();
  const [resetError, setResetError] = useState(false);
  let content: React.ReactNode;
  if (session.status === "ready" && !session.account)
    content = (
      <GuestLessonProgress
        headingId={headingId}
        headingOrder={2}
        masteryThreshold={props.masteryThreshold}
        total={tasks.length}
      />
    );
  else if (!enhanced || progressStatus !== "ready")
    content = (
      <>
        <Typography.Title
          order={2}
          id={headingId}
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
          headingId={headingId}
          headingOrder={2}
          masteryThreshold={props.masteryThreshold}
          solved={progress.solvedTaskIds.length}
          total={tasks.length}
        />
        <ConfirmationDialog
          triggerLabel="Сбросить прогресс"
          triggerAppearance="subtle"
          triggerAriaLabel="Сбросить прогресс урока"
          title="Сбросить прогресс?"
          description="Будут удалены решённые задачи только этого урока."
          confirmLabel="Сбросить"
          actions="filled"
          triggerClassName={styles.progressReset}
          onConfirm={() => {
            void accountApi
              .resetLesson(props.kind, props.lessonId, session.csrfToken)
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
    <div
      className={styles.resultProgress}
      data-result-progress={props.kind === "topic_lesson" || undefined}
      data-course-result-progress={props.kind === "course_lesson" || undefined}
    >
      {content}
    </div>
  );
};
