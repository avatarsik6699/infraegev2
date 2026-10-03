import { useAccountSession } from "~/features/account";
import { GuestProgressLoginLock } from "~/features/lesson-progress";
import type { CourseOverviewPageTypes } from "../course-overview-page.types";
import styles from "../course-overview-page.module.css";
import { courseOverviewModel } from "../model/course-overview-model";

type Props = {
  progress: CourseOverviewPageTypes.Progress;
  lessonCount: number;
  masteredLessons?: number;
  guestTotal?: number;
};

const count = (value: number | undefined, total: number | undefined) =>
  value !== undefined && total !== undefined
    ? `${String(value)} из ${String(total)}`
    : "— из —";

/** Two head stats from the mockup: mastered lessons and solved practice tasks. */
export const CourseOverviewProgress: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const isGuest = session.status === "ready" && !session.account;
  const member = props.progress.status === "ready" ? props.progress : undefined;
  const total = isGuest ? props.guestTotal : member?.total;
  const solved = isGuest ? 0 : member?.solved;
  const mastered = isGuest ? 0 : props.masteredLessons;
  let note = courseOverviewModel.progressNote(props.progress);
  if (!session.account) {
    if (isGuest) note = "";
    else if (session.status === "loading") note = "Проверяем вход";
    else note = "Не удалось проверить вход";
  }
  return (
    <GuestProgressLoginLock
      enabled={isGuest && total !== undefined}
      total={total ?? 0}
    >
      <section
        className={styles.progress}
        aria-label="Ваш прогресс"
        data-progress-ready={
          (isGuest && total !== undefined) || member !== undefined || undefined
        }
      >
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>уроков освоено</dt>
            <dd className={styles.statValue}>
              {count(mastered, props.lessonCount)}
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>практика</dt>
            <dd className={styles.statValue}>{count(solved, total)}</dd>
          </div>
        </dl>
        {note ? (
          <div className={styles.progressNote} role="status">
            {note}
          </div>
        ) : null}
      </section>
    </GuestProgressLoginLock>
  );
};
