import { Check, PenLine } from "lucide-react";
import { useLessonProgress } from "~/features/lesson-progress";
import { advancedLevelLabel } from "~/entities/lesson";
import { masteryTasks } from "~/entities/practice-task";
import { LessonTree } from "~/shared/components/lesson-tree";
import type { SubtopicNavigationTypes } from "./subtopic-navigation.types";

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
  const topic = props.topics.find((item) => item.id === props.lessonId);
  const subtopics = topic?.subtopics ?? [];
  const currentIndex = subtopics.findIndex(
    (subtopic) => subtopic.slug === props.current,
  );
  const position =
    currentIndex >= 0
      ? `${String(currentIndex + 1)} из ${String(subtopics.length)}`
      : "практика и итог";

  return (
    <LessonTree
      ariaLabel="Подтемы урока"
      disclosureLabel={`Подтемы · ${position}`}
      rootLabel="Темы ЕГЭ"
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
                marker: done ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : (
                  index + 1
                ),
                label: subtopic.title,
                to: "/ege/$slug/$subtopic",
                params: { slug: item.routeSlug, subtopic: subtopic.slug },
                current: isCurrent && subtopic.slug === props.current,
                done,
              };
            }),
            {
              id: practiceCurrent,
              marker: <PenLine size={13} strokeWidth={2} />,
              label: "Практика и итог",
              count:
                isCurrent &&
                !props.practiceUnavailable &&
                masteryTasks(props.tasks).length > 0
                  ? ` · ${String(masteryTasks(props.tasks).length)}`
                  : undefined,
              to: "/ege/$slug/praktika",
              params: { slug: item.routeSlug },
              current: isCurrent && props.current === practiceCurrent,
            },
          ],
        };
      })}
    />
  );
};
