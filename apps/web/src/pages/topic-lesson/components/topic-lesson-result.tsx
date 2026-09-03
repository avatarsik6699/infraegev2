import type { LessonContent } from "~/entities/lesson";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-lesson-page.module.css";

type PublishedLesson = {
  id: string;
  routeSlug: string;
  taskNumber: number;
  title: string;
};

type Props = {
  lesson: LessonContent.Definition;
  previousLesson?: PublishedLesson;
  nextLesson?: PublishedLesson;
};

export const TopicLessonResult: React.FC<Props> = (props) => (
  <div className={styles.resultGrid}>
    <div className={styles.resultSummary}>
      <Typography.Title order={3}>Что получилось</Typography.Title>
      <Typography.Prose>{props.lesson.result}</Typography.Prose>
    </div>

    <nav className={styles.resultNavigation} aria-label="Другие уроки">
      <div className={styles.resultLinks}>
        {props.previousLesson ? (
          <ActionLink
            hierarchy="text"
            icon="back"
            to={`/ege/${props.previousLesson.routeSlug}`}
          >
            {`Предыдущий урок: ${props.previousLesson.title}`}
          </ActionLink>
        ) : null}
        {props.nextLesson ? (
          <ActionLink
            hierarchy="text"
            icon="forward"
            to={`/ege/${props.nextLesson.routeSlug}`}
          >
            {props.nextLesson.title}
          </ActionLink>
        ) : null}
      </div>
    </nav>
  </div>
);
