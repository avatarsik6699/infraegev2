import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { useLessonProgress } from "~/features/lesson-progress";
import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { ResponsiveDisclosure } from "~/shared/components/responsive-disclosure";
import { russianCount } from "~/shared/lib/russian-count";
import type { SubtopicNavigationTypes } from "./subtopic-navigation.types";
import styles from "./subtopic-navigation.module.css";

const practiceCurrent = "practice";

export const SubtopicNavigation: React.FC<SubtopicNavigationTypes.Props> = (
  props,
) => {
  const [expanded, setExpanded] = useState(false);
  const progress = useLessonProgress(props.lessonId, props.tasks);
  const solved = new Set(progress.solvedTaskIds);
  const currentIndex = props.subtopics.findIndex(
    (subtopic) => subtopic.slug === props.current,
  );
  const total = props.subtopics.length;
  const position =
    currentIndex >= 0
      ? `${String(currentIndex + 1)} из ${String(total)}`
      : "практика и итог";

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
        <div className={styles.head}>
          <ActionLink
            className={styles.back}
            presentation="action"
            hierarchy="text"
            icon="back"
            to="/ege/"
          >
            Все темы ЕГЭ
          </ActionLink>
          <Typography.Text className={styles.title}>
            {props.title}
          </Typography.Text>
          <Typography.Text className={styles.meta}>
            {`${props.taskLabel} · ${russianCount.subtopics(total)}`}
          </Typography.Text>
        </div>
        <ol className={styles.list}>
          {props.subtopics.map((subtopic, index) => {
            const done =
              subtopic.taskIds.length > 0 &&
              subtopic.taskIds.every((id) => solved.has(id));
            const current = subtopic.slug === props.current;
            return (
              <li key={subtopic.slug}>
                <Link
                  className={styles.link}
                  to="/ege/$slug/$subtopic"
                  params={{ slug: props.routeSlug, subtopic: subtopic.slug }}
                  aria-current={current ? "page" : undefined}
                  data-done={done || undefined}
                  onClick={() => setExpanded(false)}
                >
                  <span className={styles.marker} aria-hidden="true">
                    {done ? <Check size={14} strokeWidth={2.5} /> : index + 1}
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
        </ol>
        <div className={styles.practice}>
          <Link
            className={styles.link}
            to="/ege/$slug/praktika"
            params={{ slug: props.routeSlug }}
            aria-current={
              props.current === practiceCurrent ? "page" : undefined
            }
            onClick={() => setExpanded(false)}
          >
            <span className={styles.marker} aria-hidden="true">
              ▸
            </span>
            <span className={styles.label}>
              Практика и итог
              {props.practiceUnavailable || props.tasks.length === 0 ? null : (
                <span className={styles.count}>
                  {` · ${String(props.tasks.length)}`}
                </span>
              )}
            </span>
          </Link>
        </div>
        {props.progress ? (
          <div className={styles.progress}>{props.progress}</div>
        ) : null}
      </ResponsiveDisclosure>
    </nav>
  );
};
