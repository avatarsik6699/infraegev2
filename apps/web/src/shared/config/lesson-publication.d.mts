export type LessonPublication = {
  id: string;
  routeSlug: string;
  taskNumbers: readonly [number, ...number[]];
  title: string;
  summary: string;
  status: "draft" | "published";
};

export const rekursiyaLessonPublication: Readonly<{
  id: "rekursiya";
  routeSlug: "16-rekursiya";
  taskNumbers: readonly [16];
  title: "Рекурсивные алгоритмы";
  summary: "Вычисление значений функции, заданной через саму себя: от одного базового случая до больших аргументов и алгебраических сокращений.";
  status: "published";
}>;

export const preobrazovanieZapiseyChiselLessonPublication: Readonly<{
  id: "preobrazovanie-zapisey-chisel";
  routeSlug: "5-preobrazovanie-zapisey-chisel";
  taskNumbers: readonly [5];
  title: "Преобразование записей чисел";
  summary: "Как перевести число в заданную систему, изменить запись по алгоритму и безопасно найти исходное число или результат.";
  status: "published";
}>;

export const numberSequencesLessonPublication: Readonly<{
  id: "number-sequences";
  routeSlug: "17-chislovye-posledovatelnosti";
  taskNumbers: readonly [17];
  title: "Числовые последовательности";
  summary: "Как читать числовые данные и находить отдельные элементы, соседние пары и тройки по условиям задания 17.";
  status: "published";
}>;

export const stringProcessingLessonPublication: Readonly<{
  id: "string-processing";
  routeSlug: "24-obrabotka-simvolnyh-strok";
  taskNumbers: readonly [24];
  title: "Обработка символьных строк";
  summary: "Как находить подходящие непрерывные фрагменты строки и проверять, что запись арифметического выражения устроена правильно.";
  status: "published";
}>;

export const integerProcessingLessonPublication: Readonly<{
  id: "integer-processing";
  routeSlug: "25-obrabotka-celyh-chisel";
  taskNumbers: readonly [25];
  title: "Обработка целых чисел";
  summary: "Как проверять цифры и делители числа, перебирать пары и находить подходящие значения в заданном диапазоне.";
  status: "published";
}>;

export const arrayProcessingLessonPublication: Readonly<{
  id: "array-processing";
  routeSlug: "26-sortirovka-i-otbor";
  taskNumbers: readonly [26];
  title: "Обработка данных: сортировка и отбор";
  summary: string;
  status: "published";
}>;

export const lessonPublications: readonly LessonPublication[];
