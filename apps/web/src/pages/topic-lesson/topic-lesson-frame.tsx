import { useEffect, useRef } from "react";
import {
  groupTasksBySubtopic,
  lessonPublications,
  lessonSubtopics,
  topicLessons,
} from "~/entities/lesson";
import { accessState } from "~/entities/access";
import { topicCatalog } from "~/entities/topic-catalog";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { Breadcrumbs } from "~/shared/components/breadcrumbs";
import { ScrollToTop } from "~/shared/components/scroll-to-top";
import { useMediaQuery } from "~/shared/lib/media-query";
import { scrollToTop } from "~/shared/lib/scroll-to-top";
import { PageOutline } from "~/widgets/lesson-outline";
import { LessonProgressPanel } from "~/widgets/lesson-progress-panel";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { SubtopicNavigation } from "~/widgets/subtopic-navigation";
import type { TopicLessonPageTypes } from "./topic-lesson-page.types";
import styles from "./topic-lesson.module.css";

export const TopicLessonFrame: React.FC<TopicLessonPageTypes.FrameProps> = (
  props,
) => {
  const articleRef = useRef<HTMLElement>(null);
  useEffect(
    function focusNewPageHeadingFx() {
      scrollToTop.focusHeadingAfterNavigation("lesson-title");
    },
    // Each subtopic page mounts afresh (the route keys it by slug).
    [],
  );
  const groups = groupTasksBySubtopic(props.lesson, props.tasks);
  const subtopics = lessonSubtopics(props.lesson).map((subtopic) => ({
    slug: subtopic.slug,
    title: subtopic.title,
    level: subtopic.level,
    taskIds: (groups.get(subtopic.slug) ?? []).map((task) => task.id),
    paid: Boolean(subtopic.paid),
  }));
  const topics = publishedTopics().map((lesson) =>
    lesson.id === props.lesson.id
      ? { ...topicFolder(lesson), subtopics }
      : topicFolder(lesson),
  );
  const currentTitle =
    subtopics.find((subtopic) => subtopic.slug === props.current)?.title ??
    "Практика и итог";
  // F38: progress sits under «На этой странице»; below 72rem that rail is
  // hidden, so it moves into the subtopic menu. One instance either way.
  const narrow = useMediaQuery("(max-width: 72rem)");
  const progress = props.practiceUnavailable ? null : (
    <LessonProgressPanel
      kind="topic_lesson"
      masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
      lessonId={props.lesson.id}
      tasks={props.tasks}
    />
  );

  return (
    <div className={styles.page} data-topic-lesson-page>
      <ScrollToTop headingId="lesson-title" />
      <ReadingPositionIndicator targetRef={articleRef} />
      <PublicHeader activeSection="topics" />

      <main id="main-content" className={styles.lesson} data-lesson-frame>
        <aside className={styles.rail} aria-label="Подтемы" data-outline-rail>
          <div className={styles.railContents}>
            <SubtopicNavigation
              topics={topics}
              lessonId={props.lesson.id}
              current={props.current}
              tasks={props.tasks}
              practiceUnavailable={props.practiceUnavailable}
              progress={narrow ? progress : null}
              locks={accessState.locks(props.access)}
            />
          </div>
        </aside>

        <article className={styles.article} data-article-frame ref={articleRef}>
          <Breadcrumbs
            className={styles.breadcrumbs}
            navProps={{ "data-topic-lesson-context": true }}
            items={[
              { label: "Темы ЕГЭ", to: "/ege" },
              {
                label: `${topicCatalog.formatTaskNumbers(props.lesson.taskNumbers)}. ${props.lesson.title}`,
                // F40: the topic address opens its first subtopic, so there
                // the topic is this page, not a way back.
                ...(props.current === subtopics[0]?.slug
                  ? {}
                  : {
                      to: "/ege/$slug",
                      params: { slug: props.lesson.routeSlug },
                    }),
              },
              { label: currentTitle },
            ]}
          />
          {props.children}
        </article>

        <aside
          className={styles.pageRail}
          aria-label="На этой странице"
          data-margin-rail
        >
          <div className={styles.pageRailContents}>
            <PageOutline items={props.outline} />
            {!narrow && progress ? (
              <div className={styles.pageProgress}>{progress}</div>
            ) : null}
          </div>
        </aside>
      </main>
      <div className={styles.footer} data-lesson-footer>
        <PublicFooter />
      </div>
    </div>
  );
};

type TopicLesson = (typeof topicLessons)[number];

/** Published topics in exam order (F37 tree). */
function publishedTopics(): TopicLesson[] {
  const published = new Set(
    lessonPublications
      .filter((publication) => publication.status === "published")
      .map((publication) => publication.id),
  );
  return topicLessons
    .filter((lesson) => published.has(lesson.id))
    .sort((a, b) => a.taskNumbers[0] - b.taskNumbers[0]);
}

function topicFolder(lesson: TopicLesson) {
  const numbers = lesson.taskNumbers;
  return {
    id: lesson.id,
    routeSlug: lesson.routeSlug,
    title: lesson.title,
    number:
      numbers.length === 1
        ? String(numbers[0]).padStart(2, "0")
        : `${String(numbers[0])}–${String(numbers.at(-1))}`,
    subtopics: lessonSubtopics(lesson).map((subtopic) => ({
      slug: subtopic.slug,
      title: subtopic.title,
      level: subtopic.level,
      taskIds: [],
      paid: Boolean(subtopic.paid),
    })),
    paidPractice: Boolean(lesson.paidPractice),
  };
}
