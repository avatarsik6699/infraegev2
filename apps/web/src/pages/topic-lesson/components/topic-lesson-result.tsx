import type { LessonContent } from "~/entities/lesson";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-lesson-page.module.css";
import { TopicLessonProgress } from "./topic-lesson-progress";

type PublishedLesson = {
  id: string;
  routeSlug: string;
  taskNumber: number;
  title: string;
};

type Props = {
  lesson: LessonContent.Definition;
  otherPublishedLessons: readonly PublishedLesson[];
  taskCount: number;
};

export const TopicLessonResult: React.FC<Props> = (props) => (
  <div className={styles.resultGrid}>
    <div className={styles.resultSummary}>
      <Typography.Title order={3}>Что получилось</Typography.Title>
      <Typography.Prose>{props.lesson.result}</Typography.Prose>
    </div>

    <section className={styles.resultSkills} aria-labelledby="result-skills">
      <Typography.Title order={3} id="result-skills">
        Теперь вы умеете
      </Typography.Title>
      <ul>
        {props.lesson.learningOutcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>
    </section>

    <TopicLessonProgress
      masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
      lessonId={props.lesson.id}
      taskCount={props.taskCount}
    />

    <nav
      className={styles.resultNavigation}
      aria-labelledby="result-navigation-title"
    >
      <Typography.Title order={3} id="result-navigation-title">
        Доступные материалы
      </Typography.Title>
      <Typography.Text tone="muted">
        Можно выбрать другой опубликованный урок или вернуться к списку тем.
      </Typography.Text>
      <div className={styles.resultLinks}>
        {props.otherPublishedLessons.map((lesson) => (
          <ActionLink
            hierarchy="quiet"
            key={lesson.id}
            to={`/ege/${lesson.routeSlug}`}
          >
            {`Задание ${String(lesson.taskNumber)} · ${lesson.title}`}
          </ActionLink>
        ))}
        <ActionLink hierarchy="secondary" to="/">
          Все темы
        </ActionLink>
      </div>
    </nav>
  </div>
);
