import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { lessonPublications } from "~/entities/lesson";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./foundation-page.module.css";

const publishedLessons = lessonPublications.filter(
  (lesson) => lesson.status === "published",
);

export const FoundationPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader home seamless />
    <main className={styles.root} data-foundation-layout>
      <section className={styles.intro}>
        <Typography.Title order={1}>
          Подготовка к ЕГЭ по информатике
        </Typography.Title>
        <Typography.Text variant="lead" tone="muted">
          Понятная теория и практика — бесплатно.
        </Typography.Text>
      </section>

      <section
        className={styles.materials}
        aria-labelledby="materials-title"
        data-topic-list
      >
        <Typography.Title order={2} id="materials-title">
          Темы
        </Typography.Title>
        <ul className={styles.lessonList}>
          {publishedLessons.map((lesson) => (
            <li key={lesson.id}>
              <Link to="/ege/$slug" params={{ slug: lesson.routeSlug }}>
                <span className={styles.lessonNumber}>
                  {`Задание ${String(lesson.taskNumber)}`}
                </span>
                <span className={styles.lessonTitle}>{lesson.title}</span>
                <span className={styles.lessonSummary}>{lesson.summary}</span>
                <ArrowRight
                  className={styles.lessonArrow}
                  aria-hidden="true"
                  size={19}
                  strokeWidth={1.8}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
    <PublicFooter seamless />
  </div>
);
