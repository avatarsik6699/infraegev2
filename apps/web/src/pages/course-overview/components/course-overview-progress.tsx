import { useRouterState } from "@tanstack/react-router";
import { useAccountSession } from "~/features/account";
import { ActionLink } from "~/shared/components/action-link";
import { russianCount, russianForms } from "~/shared/lib/russian-count";
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

const taskForms = ["задача", "задачи", "задач"] as const;

type Stat = { value: string; label: string };

/**
 * Two head stats: mastered lessons and solved practice tasks. F7: a guest
 * sees the course size instead of zeros that read as their own progress,
 * with a plain sign-in link on the note line (its height is reserved).
 */
export const CourseOverviewProgress: React.FC<Props> = (props) => {
  const session = useAccountSession();
  const returnTo = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isGuest = session.status === "ready" && !session.account;
  const member = props.progress.status === "ready" ? props.progress : undefined;
  const guestReady = isGuest && props.guestTotal !== undefined;
  let note = courseOverviewModel.progressNote(props.progress);
  if (!session.account) {
    if (isGuest) note = "";
    else if (session.status === "loading") note = "Проверяем вход";
    else note = "Не удалось проверить вход";
  }
  const stats: readonly Stat[] = guestReady
    ? [
        {
          value: String(props.lessonCount),
          label: `${russianCount.noun(props.lessonCount, russianForms.lesson)} в курсе`,
        },
        {
          value: String(props.guestTotal),
          label: `${russianCount.noun(props.guestTotal ?? 0, taskForms)} с проверкой`,
        },
      ]
    : [
        {
          value: count(isGuest ? 0 : props.masteredLessons, props.lessonCount),
          label: "уроков освоено",
        },
        { value: count(member?.solved, member?.total), label: "задач решено" },
      ];
  return (
    <section
      className={styles.progress}
      aria-label={guestReady ? "Объём курса" : "Ваш прогресс"}
      data-progress-ready={guestReady || member !== undefined || undefined}
    >
      <dl className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <dt className={styles.statLabel}>{stat.label}</dt>
            <dd className={styles.statValue}>{stat.value}</dd>
          </div>
        ))}
      </dl>
      {guestReady ? (
        <div className={styles.progressNote}>
          <ActionLink
            hierarchy="text"
            icon="none"
            to="/sign-in"
            search={{ returnTo }}
            data-guest-progress-login
          >
            Войдите, чтобы сохранять прогресс
          </ActionLink>
        </div>
      ) : null}
      {!guestReady && note ? (
        <div className={styles.progressNote} role="status">
          {note}
        </div>
      ) : null}
    </section>
  );
};
