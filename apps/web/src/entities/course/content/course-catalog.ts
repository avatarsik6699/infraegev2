import type { CourseCatalogTypes } from "../course-catalog.types";
import {
  courseLessonPublications,
  coursePublications,
} from "./course-publication.mjs";

const definitions: readonly CourseCatalogTypes.Definition[] = [
  {
    id: "python",
    illustration: {
      src: "/images/courses/python-v2.webp",
      width: 640,
      height: 640,
    },
    level: "Начальный",
    outcome:
      "Научитесь писать простые программы, решать задачи и работать с файлами.",
    title: "Python с нуля для ЕГЭ",
    summary:
      "От первой программы — к задачам и алгоритмам, которые пригодятся на ЕГЭ.",
  },
  {
    id: "advanced-problems",
    illustration: {
      src: "/images/courses/advanced-problems-v2.webp",
      width: 640,
      height: 640,
    },
    title: "Решение задач повышенной сложности",
    summary:
      "Разбор нестандартных задач: от выбора идеи до проверки корректности и сложности решения.",
  },
  {
    id: "algorithms-data-structures",
    illustration: {
      src: "/images/courses/algorithms-data-structures-v2.webp",
      width: 640,
      height: 640,
    },
    title: "Алгоритмы и структуры данных",
    summary:
      "Базовые структуры данных и алгоритмы для более уверенного решения задач и написания программ.",
  },
  {
    id: "excel",
    illustration: {
      src: "/images/courses/excel-v2.webp",
      width: 640,
      height: 640,
    },
    title: "Excel с нуля",
    summary:
      "Формулы, ссылки, фильтрация и анализ данных в электронных таблицах.",
  },
];

const publicationById = new Map(
  coursePublications.map(
    (publication) => [publication.id, publication] as const,
  ),
);

const entries: readonly CourseCatalogTypes.Entry[] = definitions.map(
  (definition) => {
    const publication = publicationById.get(definition.id);
    if (publication?.status !== "published") {
      return { ...definition, status: "planned" };
    }

    const lessonById = new Map(
      courseLessonPublications.map((lesson) => [lesson.id, lesson] as const),
    );
    const progressLessons = publication.modules.flatMap((courseModule) =>
      courseModule.lessonPlan.flatMap((lessonPlanEntry) => {
        const lesson = lessonById.get(lessonPlanEntry.id);
        if (lesson?.status !== "published") return [];

        return [
          {
            id: lesson.id,
            masteryThreshold: lesson.masteryThreshold ?? 0.8,
          },
        ];
      }),
    );

    return {
      ...definition,
      title: publication.title,
      summary: publication.summary,
      status: "published",
      routeSlug: publication.routeSlug,
      lessonCount: progressLessons.length,
    };
  },
);

export const courseCatalog = {
  entries,
  availableCount: entries.filter((entry) => entry.status === "published")
    .length,
  plannedCount: entries.filter((entry) => entry.status === "planned").length,
} as const;
