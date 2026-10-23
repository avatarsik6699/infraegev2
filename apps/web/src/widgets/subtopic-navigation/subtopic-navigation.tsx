import { PenLine } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLessonProgress } from "~/features/lesson-progress";
import { ExamMark } from "~/entities/topic-catalog";
import { advancedLevelLabel } from "~/entities/lesson";
import { masteryTasks } from "~/entities/practice-task";
import { LessonTree } from "~/shared/components/lesson-tree";
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
  const progress = useLessonProgress(props.lessonId, props.tasks);
  const solved = new Set(progress.solvedTaskIds);
  const practiceCount = props.practiceCount ?? masteryTasks(props.tasks).length;
  const topic = props.topics.find((item) => item.id === props.lessonId);
  const subtopics = topic?.subtopics ?? [];
  const currentIndex = subtopics.findIndex(
    (subtopic) => subtopic.slug === props.current,
  );
  const position =
    currentIndex >= 0
      ? `${String(currentIndex + 1)} из ${String(subtopics.length)}`
      : "практика и итог";
  // F42: the phone label names the task, as the course rail names the course.
  const task = topic ? `Задание ${topic.number.replace(/^0/u, "")}` : "Подтемы";

  return (
    <LessonTree
      ariaLabel="Подтемы урока"
      disclosureLabel={`${task} · ${position}`}
      rootLabel={
        <>
          <ExamMark />
          <Link
            className={styles.root}
            to="/ege"
            activeOptions={{ exact: true }}
          >
            Темы ЕГЭ
          </Link>
        </>
      }
      doneLabel="задачи решены"
      navProps={{ "data-subtopic-navigation": true }}
      progress={props.progress}
      folders={props.topics.map((item) => {
        const isCurrent = item.id === props.lessonId;
        return {
          id: item.id,
          marker: item.number,
          label: item.title,
          open: isCurrent,
          files: [
            ...item.subtopics.map((subtopic, index) => {
              const done =
                isCurrent &&
                subtopic.taskIds.length > 0 &&
                subtopic.taskIds.every((id) => solved.has(id));
              const advanced = subtopic.level === "advanced";
              const opensGroup =
                advanced && item.subtopics[index - 1]?.level !== "advanced";
              return {
                id: subtopic.slug,
                groupLabel: opensGroup
                  ? "Дополнительные уроки · для\u00a0продвинутых"
                  : undefined,
                note: advanced ? advancedLevelLabel : undefined,
                marker: index + 1,
                label: subtopic.title,
                to: "/ege/$slug/$subtopic",
                params: { slug: item.routeSlug, subtopic: subtopic.slug },
                current: isCurrent && subtopic.slug === props.current,
                done,
                locked: props.locks && subtopic.paid,
              };
            }),
            {
              id: practiceCurrent,
              marker: <PenLine size={13} strokeWidth={2} />,
              label: "Практика и итог",
              count:
                isCurrent && !props.practiceUnavailable && practiceCount > 0
                  ? ` · ${String(practiceCount)}`
                  : undefined,
              to: "/ege/$slug/praktika",
              params: { slug: item.routeSlug },
              current: isCurrent && props.current === practiceCurrent,
              locked: props.locks && item.paidPractice,
            },
          ],
        };
      })}
    />
  );
};
