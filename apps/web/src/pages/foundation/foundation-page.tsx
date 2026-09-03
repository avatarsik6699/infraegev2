import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { coursePublications } from "~/entities/course";
import { lessonPublications } from "~/entities/lesson";
import { Typography } from "~/shared/components/typography";
import { PageContainer } from "~/shared/components/page-container";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import styles from "./foundation-page.module.css";

const publishedLessons = lessonPublications.filter(
  (lesson) => lesson.status === "published",
);
const publishedCourses = coursePublications.filter(
  (course) => course.status === "published",
);

export const FoundationPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader home />
    <PageContainer
      component="main"
      className={styles.root}
      data-foundation-layout
    >
      <section className={styles.intro}>
        <Typography.Title order={1}>
          Подготовка к ЕГЭ по информатике
        </Typography.Title>
        <Typography.Text variant="lead" tone="muted">
          Понятная теория и практика — бесплатно.
        </Typography.Text>
      </section>

      <div className={styles.catalog}>
        {publishedCourses.length > 0 ? (
          <section
            id="courses"
            className={styles.materials}
            aria-labelledby="courses-title"
            data-course-list
          >
            <Typography.Title order={2} id="courses-title">
              Мини-курсы
            </Typography.Title>
            <ul className={styles.lessonList}>
              {publishedCourses.map((course) => (
                <li key={course.id}>
                  <Link
                    to="/courses/$courseSlug"
                    params={{ courseSlug: course.routeSlug }}
                  >
                    <span className={styles.lessonNumber}>Мини-курс</span>
                    <span className={styles.lessonTitle}>{course.title}</span>
                    <span className={styles.lessonSummary}>
                      {course.summary}
                    </span>
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
        ) : null}

        <section
          id="topics"
          className={styles.materials}
          aria-labelledby="materials-title"
          data-topic-list
        >
          <Typography.Title order={2} id="materials-title">
            Темы ЕГЭ
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
      </div>
    </PageContainer>
    <PublicFooter />
  </div>
);
