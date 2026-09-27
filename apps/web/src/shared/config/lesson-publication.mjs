export const rekursiyaLessonPublication = Object.freeze({
  id: "rekursiya",
  routeSlug: "16-rekursiya",
  taskNumbers: Object.freeze([16]),
  title: "Рекурсивные алгоритмы",
  summary:
    "Вычисление значений функции, заданной через саму себя: от одного базового случая до больших аргументов и алгебраических сокращений.",
  status: "published",
});

export const preobrazovanieZapiseyChiselLessonPublication = Object.freeze({
  id: "preobrazovanie-zapisey-chisel",
  routeSlug: "5-preobrazovanie-zapisey-chisel",
  taskNumbers: Object.freeze([5]),
  title: "Преобразование записей чисел",
  summary:
    "Как перевести число в заданную систему, изменить запись по алгоритму и безопасно найти исходное число или результат.",
  status: "published",
});

export const numberSequencesLessonPublication = Object.freeze({
  id: "number-sequences",
  routeSlug: "17-chislovye-posledovatelnosti",
  taskNumbers: Object.freeze([17]),
  title: "Числовые последовательности",
  summary:
    "Как читать числовые данные и находить отдельные элементы, соседние пары и тройки по условиям задания 17.",
  status: "published",
});

export const stringProcessingLessonPublication = Object.freeze({
  id: "string-processing",
  routeSlug: "24-obrabotka-simvolnyh-strok",
  taskNumbers: Object.freeze([24]),
  title: "Обработка символьных строк",
  summary:
    "Как находить подходящие непрерывные фрагменты строки и проверять, что запись арифметического выражения устроена правильно.",
  status: "published",
});

export const integerProcessingLessonPublication = Object.freeze({
  id: "integer-processing",
  routeSlug: "25-obrabotka-celyh-chisel",
  taskNumbers: Object.freeze([25]),
  title: "Обработка целых чисел",
  summary:
    "Как проверять цифры и делители числа, перебирать пары и находить подходящие значения в заданном диапазоне.",
  status: "published",
});

export const arrayProcessingLessonPublication = Object.freeze({
  id: "array-processing",
  routeSlug: "26-sortirovka-i-otbor",
  taskNumbers: Object.freeze([26]),
  title: "Обработка данных: сортировка и отбор",
  summary:
    "Как читать файлы, сортировать записи, отбирать данные при ограничении и обрабатывать события по порядку.",
  status: "published",
});

export const dataAnalysisLessonPublication = Object.freeze({
  id: "data-analysis",
  routeSlug: "27-analiz-dannyh-i-klasterizatsiya",
  taskNumbers: Object.freeze([27]),
  title: "Анализ данных: кластеризация",
  summary:
    "Как группировать записи по вычисленному признаку, находить центр группы и независимо проверять два результата.",
  status: "published",
});

export const lessonPublications = Object.freeze([
  rekursiyaLessonPublication,
  preobrazovanieZapiseyChiselLessonPublication,
  numberSequencesLessonPublication,
  stringProcessingLessonPublication,
  integerProcessingLessonPublication,
  arrayProcessingLessonPublication,
  dataAnalysisLessonPublication,
]);
