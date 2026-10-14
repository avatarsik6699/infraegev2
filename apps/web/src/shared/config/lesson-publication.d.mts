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
  summary: "Вычисление значений функции, заданной через саму себя: база и шаг, кеш, ветвление по чётности, деление аргумента, две функции, подсчёт аргументов и сокращение при больших n.";
  status: "published";
}>;

export const preobrazovanieZapiseyChiselLessonPublication: Readonly<{
  id: "preobrazovanie-zapisey-chisel";
  routeSlug: "5-preobrazovanie-zapisey-chisel";
  taskNumbers: readonly [5];
  title: "Преобразование записей чисел";
  summary: "Число и его запись: перевод делением, дописывание и замена цифр, сумма цифр, поиск входа или результата с обоснованными границами перебора.";
  status: "published";
}>;

export const spreadsheetsLessonPublication: Readonly<{
  id: "spreadsheets";
  routeSlug: "9-obrabotka-tablicy-chisel";
  taskNumbers: readonly [9];
  title: "Обработка таблицы чисел";
  summary: string;
  status: "published";
}>;

export const numberSequencesLessonPublication: Readonly<{
  id: "number-sequences";
  routeSlug: "17-chislovye-posledovatelnosti";
  taskNumbers: readonly [17];
  title: "Числовые последовательности";
  summary: "Файл как список чисел и условие как проверки: цифры и знак, соседние пары и тройки, порог по всей последовательности, величина проверки и величина ответа.";
  status: "published";
}>;

export const graphAnalysisLessonPublication: Readonly<{
  id: "graph-analysis";
  routeSlug: "23-analiz-grafov";
  taskNumbers: readonly [23];
  title: "Анализ графов";
  summary: "Граф из файла, кратчайший путь в ациклическом графе рекурсией с запоминанием, обязательные и запрещённые вершины.";
  status: "published";
}>;

export const stringProcessingLessonPublication: Readonly<{
  id: "string-processing";
  routeSlug: "24-obrabotka-simvolnyh-strok";
  taskNumbers: readonly [24];
  title: "Обработка символьных строк";
  summary: "Фрагменты строки: текущая длина цепочки, образцы и частоты, скользящее окно, позиции и границы, корректные выражения по шаблону.";
  status: "published";
}>;

export const divisorsAndMasksLessonPublication: Readonly<{
  id: "divisors-and-masks";
  routeSlug: "25-deliteli-i-maski";
  taskNumbers: readonly [25];
  title: "Делители и маски";
  summary: "Делители парами до корня, простые числа и разложение, маски числа и поиск подходящих чисел в диапазоне.";
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

export const dataAnalysisLessonPublication: Readonly<{
  id: "data-analysis";
  routeSlug: "27-analiz-dannyh-i-klasterizatsiya";
  taskNumbers: readonly [27];
  title: "Анализ данных: кластеризация";
  summary: string;
  status: "published";
}>;

export const spreadsheetOptimizationLessonPublication: Readonly<{
  id: "spreadsheet-optimization";
  routeSlug: "18-robot-sborshchik-monet";
  taskNumbers: readonly [18];
  title: "Робот-сборщик монет";
  summary: string;
  status: "published";
}>;

export const winningStrategyLessonPublication: Readonly<{
  id: "winning-strategy";
  routeSlug: "19-21-vyigryshnaya-strategiya";
  taskNumbers: readonly [19, 20, 21];
  title: "Выигрышная стратегия";
  summary: string;
  status: "published";
}>;

export const relationalDatabasesLessonPublication: Readonly<{
  id: "relational-databases";
  routeSlug: "3-svyazannye-tablicy";
  taskNumbers: readonly [3];
  title: "Связанные таблицы";
  summary: string;
  status: "published";
}>;

export const codingAndFanoLessonPublication: Readonly<{
  id: "coding-and-fano";
  routeSlug: "4-kodirovanie-i-uslovie-fano";
  taskNumbers: readonly [4];
  title: "Кодирование и условие Фано";
  summary: string;
  status: "published";
}>;

export const mediaCodingLessonPublication: Readonly<{
  id: "media-coding";
  routeSlug: "7-izobrazheniya-zvuk-tekst";
  taskNumbers: readonly [7];
  title: "Объём информации: изображения, звук, текст";
  summary: string;
  status: "published";
}>;

export const wordEnumerationLessonPublication: Readonly<{
  id: "word-enumeration";
  routeSlug: "8-perebor-slov";
  taskNumbers: readonly [8];
  title: "Перебор слов и системы счисления";
  summary: string;
  status: "published";
}>;

export const networksLessonPublication: Readonly<{
  id: "networks";
  routeSlug: "10-ip-adresa-i-maski";
  taskNumbers: readonly [10];
  title: "IP-адреса и маски";
  summary: string;
  status: "published";
}>;

export const informationAmountLessonPublication: Readonly<{
  id: "information-amount";
  routeSlug: "11-paroli-i-zapisi";
  taskNumbers: readonly [11];
  title: "Объём информации: пароли и записи";
  summary: string;
  status: "published";
}>;

export const numeralSystemsLessonPublication: Readonly<{
  id: "numeral-systems";
  routeSlug: "14-sistemy-schisleniya";
  taskNumbers: readonly [14];
  title: "Системы счисления: операции и неизвестные цифры";
  summary: string;
  status: "published";
}>;

export const lessonPublications: readonly LessonPublication[];
