import { Progress } from "~/shared/components/progress";
import { useAccountSession } from "~/features/account";
import { GuestProgressLoginLock } from "~/features/lesson-progress";
import { Typography } from "~/shared/components/typography";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";
import { courseOverviewModel } from "../model/course-overview-model";

type Props = {
  progress: CourseOverviewPageTypes.Progress;
  guestTotal?: number;
};

export const CourseOverviewProgress: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const isGuest = session.status === "ready" && !session.account;
  const memberProgress =
    props.progress.status === "ready" ? props.progress : undefined;
  const total = isGuest ? props.guestTotal : memberProgress?.total;
  const solved = isGuest ? 0 : (memberProgress?.solved ?? 0);
  const progressReady =
    (isGuest && total !== undefined) || props.progress.status === "ready";
  let progressNote = courseOverviewModel.progressNote(props.progress);
  if (!session.account) {
    if (isGuest) progressNote = "";
    else if (session.status === "loading") progressNote = "Проверяем вход";
    else progressNote = "Не удалось проверить вход";
  }
  return (
    <GuestProgressLoginLock
      enabled={isGuest && total !== undefined}
      total={total ?? 0}
    >
      <section
        className={styles.progress}
        aria-labelledby="course-progress"
        data-progress-ready={progressReady || undefined}
      >
        <Typography.Title
          order={2}
          id="course-progress"
          className={styles.smallHeading}
        >
          Ваш прогресс
        </Typography.Title>
        <div className={styles.progressRow}>
          <span>Практика</span>
          <span className={styles.progressCount}>
            {progressReady && total !== undefined
              ? `${String(solved)} из ${String(total)}`
              : "— из —"}
          </span>
          {progressReady && total && total > 0 ? (
            <Progress
              label="Решённые задачи курса"
              value={solved}
              max={total}
              valueText={`Решено ${String(solved)} из ${String(total)} задач`}
            />
          ) : (
            <span className={styles.progressPlaceholder} aria-hidden="true" />
          )}
        </div>
        {progressNote ? (
          <div className={styles.progressNote} role="status">
            {progressNote}
          </div>
        ) : null}
      </section>
    </GuestProgressLoginLock>
  );
};
