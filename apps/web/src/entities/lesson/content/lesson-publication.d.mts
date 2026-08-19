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

export const preobrazovanieZapiseyChiselLessonPublication: Readonly<{
  id: "preobrazovanie-zapisey-chisel";
  routeSlug: "5-preobrazovanie-zapisey-chisel";
  taskNumber: 5;
  title: "Преобразование записей чисел";
  summary: "Как перевести число в заданную систему, изменить запись по алгоритму и безопасно найти исходное число или результат.";
  status: "published";
}>;

export const lessonPublications: readonly LessonPublication[];
