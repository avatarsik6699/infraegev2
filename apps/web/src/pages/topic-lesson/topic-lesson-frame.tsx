import { useEffect, useRef } from "react";
import { groupTasksBySubtopic, lessonSubtopics } from "~/entities/lesson";
import { topicCatalog } from "~/entities/topic-catalog";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { ScrollToTop } from "~/shared/components/scroll-to-top";
import { scrollToTop } from "~/shared/lib/scroll-to-top";
import { PageOutline } from "~/widgets/lesson-outline";
import { PublicFooter } from "~/widgets/public-footer";
import { PublicHeader } from "~/widgets/public-header";
import { SubtopicNavigation } from "~/widgets/subtopic-navigation";
import { TopicLessonBreadcrumbs } from "./components/topic-lesson-breadcrumbs";
import { TopicLessonProgress } from "./components/topic-lesson-progress";
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
    taskIds: (groups.get(subtopic.slug) ?? []).map((task) => task.id),
  }));

  return (
    <div className={styles.page} data-topic-lesson-page>
      <ScrollToTop headingId="lesson-title" />
      <ReadingPositionIndicator targetRef={articleRef} />
      <PublicHeader activeSection="topics" />

      <main id="main-content" className={styles.lesson} data-lesson-frame>
        <aside className={styles.rail} aria-label="Подтемы" data-outline-rail>
          <div className={styles.railContents}>
            <SubtopicNavigation
              lessonId={props.lesson.id}
              routeSlug={props.lesson.routeSlug}
              title={props.lesson.title}
              taskLabel={topicCatalog.formatTaskNumbers(
                props.lesson.taskNumbers,
              )}
              subtopics={subtopics}
              current={props.current}
              tasks={props.tasks}
              practiceUnavailable={props.practiceUnavailable}
              progress={
                props.practiceUnavailable ? null : (
                  <TopicLessonProgress
                    masteryThreshold={props.lesson.masteryThreshold ?? 0.8}
                    lessonId={props.lesson.id}
                    tasks={props.tasks}
                  />
                )
              }
            />
          </div>
        </aside>

        <article className={styles.article} data-article-frame ref={articleRef}>
          <TopicLessonBreadcrumbs
            routeSlug={props.lesson.routeSlug}
            taskNumbers={props.lesson.taskNumbers}
            title={props.lesson.title}
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
          </div>
        </aside>
      </main>
      <div className={styles.footer} data-lesson-footer>
        <PublicFooter />
      </div>
    </div>
  );
};
