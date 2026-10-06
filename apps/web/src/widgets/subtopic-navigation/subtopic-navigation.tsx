import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, PenLine } from "lucide-react";
import { useState } from "react";
import { useLessonProgress } from "~/features/lesson-progress";
import { ResponsiveDisclosure } from "~/shared/components/responsive-disclosure";
import { Typography } from "~/shared/components/typography";
import type { SubtopicNavigationTypes } from "./subtopic-navigation.types";
import styles from "./subtopic-navigation.module.css";

const practiceCurrent = "practice";

/**
 * F37: the EGE topics as a file tree — each published topic is a folder of
 * its subtopics and «Практика и итог»; the current topic is open.
 */
export const SubtopicNavigation: React.FC<SubtopicNavigationTypes.Props> = (
  props,
) => {
  const [expanded, setExpanded] = useState(false);
  const progress = useLessonProgress(props.lessonId, props.tasks);
  const solved = new Set(progress.solvedTaskIds);
  const topic = props.topics.find((item) => item.id === props.lessonId);
  const subtopics = topic?.subtopics ?? [];
  const currentIndex = subtopics.findIndex(
    (subtopic) => subtopic.slug === props.current,
  );
  const position =
    currentIndex >= 0
      ? `${String(currentIndex + 1)} из ${String(subtopics.length)}`
      : "практика и итог";
  const close = () => setExpanded(false);

  return (
    <nav
      className={styles.root}
      aria-label="Подтемы урока"
      data-subtopic-navigation
    >
      <ResponsiveDisclosure
        label={`Подтемы · ${position}`}
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <Typography.Text className={styles.treeRoot}>Темы ЕГЭ</Typography.Text>
        <ul className={styles.tree}>
          {props.topics.map((item) => {
            const isCurrent = item.id === props.lessonId;
            return (
              <li key={item.id}>
                <details open={isCurrent} data-topic-folder={item.id}>
                  <summary className={styles.folder}>
                    <ChevronRight className={styles.chevron} aria-hidden />
                    <span className={styles.marker} aria-hidden="true">
                      {item.number}
                    </span>
                    <span className={styles.label}>{item.title}</span>
                  </summary>
                  <ol className={styles.branch}>
                    {item.subtopics.map((subtopic, index) => {
                      const done =
                        isCurrent &&
                        subtopic.taskIds.length > 0 &&
                        subtopic.taskIds.every((id) => solved.has(id));
                      return (
                        <li key={subtopic.slug}>
                          <Link
                            className={styles.link}
                            to="/ege/$slug/$subtopic"
                            params={{
                              slug: item.routeSlug,
                              subtopic: subtopic.slug,
                            }}
                            aria-current={
                              isCurrent && subtopic.slug === props.current
                                ? "page"
                                : undefined
                            }
                            data-done={done || undefined}
                            onClick={close}
                          >
                            <span className={styles.marker} aria-hidden="true">
                              {done ? (
                                <Check size={14} strokeWidth={2.5} />
                              ) : (
                                index + 1
                              )}
                            </span>
                            <span className={styles.label}>
                              {subtopic.title}
                              {done ? (
                                <span className={styles.visuallyHidden}>
                                  {" "}
                                  (задачи решены)
                                </span>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        className={styles.link}
                        to="/ege/$slug/praktika"
                        params={{ slug: item.routeSlug }}
                        aria-current={
                          isCurrent && props.current === practiceCurrent
                            ? "page"
                            : undefined
                        }
                        onClick={close}
                      >
                        <span className={styles.marker} aria-hidden="true">
                          <PenLine size={13} strokeWidth={2} />
                        </span>
                        <span className={styles.label}>
                          Практика и итог
                          {isCurrent &&
                          !props.practiceUnavailable &&
                          props.tasks.length > 0 ? (
                            <span className={styles.count}>
                              {` · ${String(props.tasks.length)}`}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  </ol>
                </details>
              </li>
            );
          })}
        </ul>
        {props.progress ? (
          <div className={styles.progress}>{props.progress}</div>
        ) : null}
      </ResponsiveDisclosure>
    </nav>
  );
};
