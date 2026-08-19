import type { LessonContent } from "../lib/define-lesson.types";

export type LessonPublication = {
  id: string;
  routeSlug: string;
  taskNumber: number;
  title: string;
  summary: string;
  status: LessonContent.Status;
};

export const rekursiyaLessonPublication: Readonly<{
  id: "rekursiya";
  routeSlug: "16-rekursiya";
  taskNumber: 16;
  title: "Рекурсивные алгоритмы";
  summary: "Вычисление значений функции, заданной через саму себя: от одного базового случая до больших аргументов и алгебраических сокращений.";
  status: "published";
}>;

export const lessonPublications: readonly LessonPublication[];
