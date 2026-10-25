import { BookOpen, Code2, ListChecks } from "lucide-react";
import { courseCatalog, type CourseCatalogTypes } from "~/entities/course";
import { topicCatalog } from "~/entities/topic-catalog";
import { ActionLink } from "~/shared/components/action-link";
import { ObjectIllustration } from "~/shared/components/object-illustration";
import { MascotScene } from "~/shared/components/mascot-scene";
import { PageContainer } from "~/shared/components/page-container";
import { PageHead } from "~/shared/components/page-head";
import { Typography } from "~/shared/components/typography";
import { russianCount, russianForms } from "~/shared/lib/russian-count";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { FoundationCourseCard } from "./foundation-course-card";
import { FoundationPlateMarks } from "./foundation-plate-marks";
import { FoundationTryDemo } from "./foundation-try-demo";
import styles from "./foundation-page.module.css";

const foundation = {
  publishedTopics: topicCatalog.entries.filter(
    (entry) => entry.status === "published",
  ),
  plannedTopicCount: topicCatalog.entries.length,
  course: courseCatalog.entries.find((entry) => entry.status === "published"),
  courses: courseCatalog.entries.filter(
    (entry): entry is CourseCatalogTypes.PublishedEntry =>
      entry.status === "published",
  ),
  featuredTopicCount: 4,
  moduleForms: ["модуль", "модуля", "модулей"],
} as const;

export const FoundationPage: React.FC = () => (
  <div className={styles.page}>
    <PublicHeader home />
    <main id="main-content" className={styles.main} data-foundation-layout>
      <PageHead
        className={styles.hero}
        aside={<MascotScene scene="home-hero" className={styles.heroScene} />}
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
          <li>{foundation.publishedTopics.length} тем ЕГЭ</li>
          {foundation.course?.status === "published" ? (
            <li>{`${russianCount.of(courseCatalog.coreLessonCount(foundation.course), russianForms.lesson)} Python`}</li>
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
              <span className={styles.pathChip}>
                <BookOpen aria-hidden="true" />
              </span>
              <Typography.Title order={3} className={styles.pathTitle}>
                Темы ЕГЭ
              </Typography.Title>
              <Typography.Text className={styles.pathText}>
                Теория и практика по заданиям
              </Typography.Text>
              <Typography.Text className={styles.pathDescription}>
                Теория, разобранные примеры и задачи с проверкой по каждому
                заданию экзамена.
              </Typography.Text>
              <div className={styles.pathFoot}>
                <span className={styles.cardFacts}>
                  {`${String(foundation.publishedTopics.length)} тем из ${String(foundation.plannedTopicCount)}`}
                </span>
                <ActionLink
                  className={styles.stretchedLink}
                  hierarchy="text"
                  to="/ege/"
                >
                  Выбрать тему
                </ActionLink>
              </div>
              <BookOpen className={styles.pathMark} aria-hidden="true" />
            </li>
            {foundation.course?.status === "published" ? (
              <li className={styles.path} data-tone="sky">
                <span className={styles.pathChip}>
                  <Code2 aria-hidden="true" />
                </span>
                <Typography.Title order={3} className={styles.pathTitle}>
                  {foundation.course.title}
                </Typography.Title>
                <Typography.Text className={styles.pathText}>
                  Курс с нуля, опыт не нужен
                </Typography.Text>
                <Typography.Text className={styles.pathDescription}>
                  В каждом уроке объяснение, разобранный пример и практика.
                </Typography.Text>
                <div className={styles.pathFoot}>
                  <span className={styles.cardFacts}>
                    {`${russianCount.of(foundation.course.moduleCount, foundation.moduleForms)} · ${russianCount.of(courseCatalog.coreLessonCount(foundation.course), russianForms.lesson)}`}
                  </span>
                  <ActionLink
                    className={styles.stretchedLink}
                    hierarchy="text"
                    to="/courses/$courseSlug"
                    params={{ courseSlug: foundation.course.routeSlug }}
                  >
                    Начать курс
                  </ActionLink>
                </div>
                <Code2 className={styles.pathMark} aria-hidden="true" />
              </li>
            ) : null}
            <li className={styles.path} data-tone="lilac">
              <span className={styles.pathChip}>
                <ListChecks aria-hidden="true" />
              </span>
              <Typography.Title order={3} className={styles.pathTitle}>
                Банк задач
              </Typography.Title>
              <Typography.Text className={styles.pathText}>
                Задачи с проверкой ответа
              </Typography.Text>
              <Typography.Text className={styles.pathDescription}>
                Фильтры по темам и сложности. Решайте прямо в списке и сразу
                проверяйте ответ.
              </Typography.Text>
              <div className={styles.pathFoot}>
                <span className={styles.cardFacts}>3 уровня сложности</span>
                <ActionLink
                  className={styles.stretchedLink}
                  hierarchy="text"
                  to="/practice"
                >
                  Решать задачи
                </ActionLink>
              </div>
              <ListChecks className={styles.pathMark} aria-hidden="true" />
            </li>
          </ul>
        </section>

        <section
          id="topics"
          className={styles.topicsSection}
          aria-labelledby="topics-title"
          data-topic-list
        >
          <Typography.Title order={2} id="topics-title">
            Темы ЕГЭ
          </Typography.Title>
          <Typography.Text className={styles.sectionLead}>
            {`Опубликовано ${String(foundation.publishedTopics.length)} из ${String(foundation.plannedTopicCount)} тем и ${russianCount.of(foundation.courses.length, ["мини-курс", "мини-курса", "мини-курсов"])}. Остальные темы появятся позже.`}
          </Typography.Text>
          {/* F57 (Д2): seven narrow columns, rows of different step — a course
              on three, two topics on two each; the second row mirrored. */}
          <ul className={styles.topics}>
            {foundation.courses[0] ? (
              <FoundationCourseCard course={foundation.courses[0]} />
            ) : null}
            {foundation.publishedTopics
              .slice(0, foundation.featuredTopicCount)
              .map((topic) => (
                <li key={topic.id} className={styles.topic}>
                  <div className={styles.plate} data-pattern="number">
                    <FoundationPlateMarks className={styles.plateMarks} />
                    <span className={styles.plateNumber} aria-hidden="true">
                      {String(topic.taskNumbers[0]).padStart(2, "0")}
                    </span>
                    <ObjectIllustration
                      topic={topic.taskNumbers[0]}
                      className={styles.platePicture}
                    />
                  </div>
                  <div className={styles.cardMain}>
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
                    </div>
                    <div className={styles.cardFoot}>
                      <span className={styles.cardFacts}>
                        {russianCount.subtopics(topic.subtopicCount)}
                      </span>
                      <ActionLink
                        className={styles.stretchedLink}
                        ariaLabel={`Открыть тему: ${topic.title}`}
                        hierarchy="text"
                        to="/ege/$slug/$subtopic"
                        params={{
                          slug: topic.routeSlug,
                          subtopic: topic.firstSubtopic,
                        }}
                      >
                        Открыть тему
                      </ActionLink>
                    </div>
                  </div>
                </li>
              ))}
            {foundation.courses.slice(1, 2).map((course) => (
              <FoundationCourseCard key={course.id} course={course} />
            ))}
          </ul>
        </section>

        <section className={styles.try} aria-labelledby="try-title">
          <div className={styles.tryCopy}>
            <Typography.Title order={2} id="try-title">
              Попробуйте прямо сейчас
            </Typography.Title>
            <Typography.Text>
              Так решается каждое задание в банке: введите ответ, нажмите
              «Проверить» и сразу узнайте результат. Без регистрации.
            </Typography.Text>
            <ActionLink hierarchy="text" to="/practice">
              Решать задачи
            </ActionLink>
          </div>
          <div className={styles.tryTask} data-try-demo>
            <div className={styles.tryStrip}>
              <span>
                <span className={styles.tryStripTopic}>Задание 16</span> ·
                Рекуррентные выражения
              </span>
              <span>Лёгкая</span>
            </div>
            <div className={styles.tryBody}>
              <FoundationTryDemo />
            </div>
          </div>
        </section>
      </PageContainer>
    </main>
    <PublicFooter />
  </div>
);
