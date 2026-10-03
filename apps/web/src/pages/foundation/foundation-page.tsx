import { BookOpen, Code2, ListChecks } from "lucide-react";
import { courseCatalog } from "~/entities/course";
import { topicCatalog } from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { IllustrationPlaceholder } from "~/shared/components/illustration-placeholder";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
import { Typography } from "~/shared/components/typography";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { FoundationTryTask } from "./foundation-try-task";
import type { FoundationPageTypes } from "./foundation-page.types";
import styles from "./foundation-page.module.css";

const foundation = {
  publishedTopics: topicCatalog.entries.filter(
    (entry) => entry.status === "published",
  ),
  plannedTopicCount: topicCatalog.entries.length,
  course: courseCatalog.entries.find((entry) => entry.status === "published"),
  heroNotes: ["F(5) = 31", "for i in range", "n % 10", "✓ верно"],
  featuredTopicCount: 4,
} as const;

export const FoundationPage: React.FC<FoundationPageTypes.Props> = (props) => (
  <div className={styles.page}>
    <PublicHeader home />
    <main id="main-content" className={styles.main} data-foundation-layout>
      <PageHead
        className={styles.hero}
        aside={
          <div className={styles.heroPlate} aria-hidden="true">
            {foundation.heroNotes.map((note) => (
              <span key={note} className={styles.heroNote}>
                {note}
              </span>
            ))}
          </div>
        }
      >
        <Typography.Title order={1} className={styles.heroTitle}>
          Понять, <span className={styles.highlight}>почему это работает</span>,
          и решить самому
        </Typography.Title>
        <Typography.Text variant="lead" className={styles.heroLead}>
          Понятная теория, разобранные примеры и задачи с проверкой. От первой
          программы до заданий ЕГЭ по информатике.
        </Typography.Text>
        <div className={styles.heroActions}>
          <ActionLink presentation="button" hierarchy="primary" to="/ege/">
            Выбрать тему
          </ActionLink>
          <ActionLink presentation="action" hierarchy="text" to="/practice">
            Решать задачи
          </ActionLink>
        </div>
        <ul className={styles.facts} aria-label="Что есть на сайте">
          <li>
            <b>{foundation.publishedTopics.length}</b> тем ЕГЭ
          </li>
          {foundation.course?.status === "published" ? (
            <li>
              <b>{foundation.course.lessonCount}</b> уроков Python
            </li>
          ) : null}
        </ul>
      </PageHead>

      <PageContainer component="div" className={styles.content}>
        <section className={styles.section} aria-labelledby="paths-title">
          <Typography.Title order={2} id="paths-title">
            Выберите путь
          </Typography.Title>
          <Typography.Text className={styles.sectionLead}>
            Теория по темам, курс с нуля или сразу задачи.
          </Typography.Text>
          <ul className={styles.paths}>
            <li className={styles.path} data-tone="sage">
              <BookOpen className={styles.pathIcon} aria-hidden="true" />
              <Typography.Title order={3} className={styles.pathTitle}>
                Темы ЕГЭ
              </Typography.Title>
              <Typography.Text className={styles.pathText}>
                Теория, разобранные примеры и задачи с проверкой по каждому
                заданию экзамена.
              </Typography.Text>
              <ActionLink
                className={styles.pathLink}
                hierarchy="text"
                to="/ege/"
              >
                Выбрать тему
              </ActionLink>
            </li>
            {foundation.course?.status === "published" ? (
              <li className={styles.path} data-tone="sky">
                <Code2 className={styles.pathIcon} aria-hidden="true" />
                <Typography.Title order={3} className={styles.pathTitle}>
                  {foundation.course.title}
                </Typography.Title>
                <Typography.Text className={styles.pathText}>
                  Можно начинать без опыта: в каждом уроке объяснение,
                  разобранный пример и практика.
                </Typography.Text>
                <ActionLink
                  className={styles.pathLink}
                  hierarchy="text"
                  to="/courses/$courseSlug"
                  params={{ courseSlug: foundation.course.routeSlug }}
                >
                  Начать курс
                </ActionLink>
              </li>
            ) : null}
            <li className={styles.path} data-tone="lilac">
              <ListChecks className={styles.pathIcon} aria-hidden="true" />
              <Typography.Title order={3} className={styles.pathTitle}>
                Банк задач
              </Typography.Title>
              <Typography.Text className={styles.pathText}>
                Фильтры по темам и сложности. Решайте прямо в списке и сразу
                проверяйте ответ.
              </Typography.Text>
              <ActionLink
                className={styles.pathLink}
                hierarchy="text"
                to="/practice"
              >
                Решать задачи
              </ActionLink>
            </li>
          </ul>
        </section>

        <section
          id="topics"
          className={styles.section}
          aria-labelledby="topics-title"
          data-topic-list
        >
          <Typography.Title order={2} id="topics-title">
            Темы ЕГЭ
          </Typography.Title>
          <Typography.Text className={styles.sectionLead}>
            {`Опубликовано ${String(foundation.publishedTopics.length)} из ${String(foundation.plannedTopicCount)} тем. Остальные появятся позже.`}
          </Typography.Text>
          <ul className={styles.topics}>
            {foundation.publishedTopics
              .slice(0, foundation.featuredTopicCount)
              .map((topic) => (
                <li key={topic.id} className={styles.topic}>
                  <IllustrationPlaceholder className={styles.topicPlate} />
                  <div className={styles.topicBody}>
                    <span className={styles.topicNumber}>
                      {topicCatalog.formatTaskNumbers(topic.taskNumbers)}
                    </span>
                    <Typography.Title order={3} className={styles.topicTitle}>
                      {topic.title}
                    </Typography.Title>
                    <Typography.Text className={styles.topicSummary}>
                      {topic.summary}
                    </Typography.Text>
                    <ActionLink
                      className={styles.topicLink}
                      ariaLabel={`Открыть тему: ${topic.title}`}
                      hierarchy="text"
                      to="/ege/$slug"
                      params={{ slug: topic.routeSlug }}
                    >
                      Открыть тему
                    </ActionLink>
                  </div>
                </li>
              ))}
          </ul>
          <ActionLink hierarchy="text" to="/ege/">
            Все темы
          </ActionLink>
        </section>

        <section className={styles.try} aria-labelledby="try-title">
          <div className={styles.tryCopy}>
            <Typography.Title order={2} id="try-title">
              Попробуйте прямо сейчас
            </Typography.Title>
            <Typography.Text>
              Одна задача без регистрации. Посчитайте значения по порядку и
              проверьте ответ: так устроено каждое задание в банке.
            </Typography.Text>
            <ActionLink hierarchy="text" to="/practice">
              Открыть банк задач
            </ActionLink>
          </div>
          <div className={styles.tryTask} data-featured-task>
            <FoundationTryTask featuredTask={props.featuredTask} />
          </div>
        </section>

        {foundation.course?.status === "published" ? (
          <section
            id="courses"
            className={styles.course}
            aria-labelledby="course-title"
            data-course-list
          >
            <div className={styles.courseCopy}>
              <span className={styles.courseKind}>Мини-курс</span>
              <Typography.Title order={2} id="course-title">
                {foundation.course.title}
              </Typography.Title>
              <Typography.Text>{foundation.course.summary}</Typography.Text>
              <ActionLink
                hierarchy="text"
                to="/courses/$courseSlug"
                params={{ courseSlug: foundation.course.routeSlug }}
              >
                Открыть курс
              </ActionLink>
            </div>
            <IllustrationPlaceholder className={styles.coursePlate} />
          </section>
        ) : null}
      </PageContainer>
    </main>
    <PublicFooter />
  </div>
);
