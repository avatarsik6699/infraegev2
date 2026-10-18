import type { LessonContent } from "~/entities/lesson";
import { lessonSubtopics } from "~/entities/lesson";
import type { PaywallTypes } from "../paywall.types";

export const paywallUnlocks = {
  /** The paid subtopics of an EGE topic, its paid final page and their tasks. */
  topic(
    lesson: LessonContent.Definition,
    lockedTasks: number,
  ): PaywallTypes.Unlocks {
    const paid = lessonSubtopics(lesson).filter((subtopic) => subtopic.paid);
    return {
      lessons: paid.map((subtopic) => ({
        title: subtopic.title,
        lead: subtopic.lead,
      })),
      questions:
        paid.reduce(
          (sum, subtopic) => sum + (subtopic.paid?.selfCheck ?? 0),
          0,
        ) + (lesson.paidPractice?.checkpoint ?? 0),
      tasks: lockedTasks,
      practice: Boolean(lesson.paidPractice),
    };
  },

  /** The paid lessons of a course; their tasks are counted per lesson, not here. */
  course(
    lessons: readonly { title: string; paid?: { selfCheck: number } }[],
  ): PaywallTypes.Unlocks {
    const paid = lessons.filter((lesson) => lesson.paid);
    return {
      lessons: paid.map((lesson) => ({ title: lesson.title })),
      questions: paid.reduce(
        (sum, lesson) => sum + (lesson.paid?.selfCheck ?? 0),
        0,
      ),
      practice: false,
    };
  },
};

/** Paywall copy in the topic's or course's own terms (approved F1 wording). */
export const paywallCopy = {
  topic(taskNumbers: readonly number[]): { title: string; why: string } {
    const task =
      taskNumbers.length === 1
        ? `задания ${String(taskNumbers[0])}`
        : `заданий ${String(taskNumbers[0])}–${String(taskNumbers.at(-1))}`;
    return {
      title: "Откройте доступ к сложным задачам",
      why: `Базовые задачи — только половина успеха. Дальше — все алгоритмы и приёмы для сложных вариантов ${task}.`,
    };
  },
  course(courseTitle: string): { title: string; why: string } {
    return {
      title: "Откройте курс целиком",
      why: `Первые уроки курса «${courseTitle}» открыты всем. Дальше — уроки, которые доводят навык до заданий экзамена.`,
    };
  },
};
