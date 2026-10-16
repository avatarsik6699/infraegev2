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
  title: "Рекуррентные выражения";
  summary: "Вычисление значений функции, заданной через саму себя: база и шаг, кеш, ветвление по чётности, деление аргумента, две функции, подсчёт аргументов и сокращение при больших n.";
  status: "published";
}>;

export const preobrazovanieZapiseyChiselLessonPublication: Readonly<{
  id: "preobrazovanie-zapisey-chisel";
  routeSlug: "5-preobrazovanie-zapisey-chisel";
  taskNumbers: readonly [5];
  title: "Формальное исполнение алгоритма";
  summary: "Число и его запись: перевод делением, дописывание и замена цифр, сумма цифр, поиск входа или результата с обоснованными границами перебора.";
  status: "published";
}>;

export const spreadsheetsLessonPublication: Readonly<{
  id: "spreadsheets";
  routeSlug: "9-obrabotka-tablicy-chisel";
  taskNumbers: readonly [9];
  title: "Электронные таблицы";
  summary: string;
  status: "published";
}>;

export const numberSequencesLessonPublication: Readonly<{
  id: "number-sequences";
  routeSlug: "17-chislovye-posledovatelnosti";
  taskNumbers: readonly [17];
  title: "Обработка числовой последовательности";
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
  title: "Обработка символьной информации";
  summary: "Фрагменты строки: текущая длина цепочки, образцы и частоты, скользящее окно, позиции и границы, корректные выражения по шаблону.";
  status: "published";
}>;

export const divisorsAndMasksLessonPublication: Readonly<{
  id: "divisors-and-masks";
  routeSlug: "25-deliteli-i-maski";
  taskNumbers: readonly [25];
  title: "Обработка целочисленной информации";
  summary: "Делители парами до корня, простые числа и разложение, маски числа и поиск подходящих чисел в диапазоне.";
  status: "published";
}>;

export const arrayProcessingLessonPublication: Readonly<{
  id: "array-processing";
  routeSlug: "26-sortirovka-i-otbor";
  taskNumbers: readonly [26];
  title: "Обработка данных с сортировкой";
  summary: string;
  status: "published";
}>;

export const dataAnalysisLessonPublication: Readonly<{
  id: "data-analysis";
  routeSlug: "27-analiz-dannyh-i-klasterizatsiya";
  taskNumbers: readonly [27];
  title: "Анализ данных";
  summary: string;
  status: "published";
}>;

export const spreadsheetOptimizationLessonPublication: Readonly<{
  id: "spreadsheet-optimization";
  routeSlug: "18-robot-sborshchik-monet";
  taskNumbers: readonly [18];
  title: "Электронные таблицы: целочисленные данные";
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
  title: "Реляционные базы данных";
  summary: string;
  status: "published";
}>;

export const codingAndFanoLessonPublication: Readonly<{
  id: "coding-and-fano";
  routeSlug: "4-kodirovanie-i-uslovie-fano";
  taskNumbers: readonly [4];
  title: "Кодирование и декодирование информации";
  summary: string;
  status: "published";
}>;

export const mediaCodingLessonPublication: Readonly<{
  id: "media-coding";
  routeSlug: "7-izobrazheniya-zvuk-tekst";
  taskNumbers: readonly [7];
  title: "Объём графической и звуковой информации";
  summary: string;
  status: "published";
}>;

export const wordEnumerationLessonPublication: Readonly<{
  id: "word-enumeration";
  routeSlug: "8-perebor-slov";
  taskNumbers: readonly [8];
  title: "Измерение количества информации";
  summary: string;
  status: "published";
}>;

export const networksLessonPublication: Readonly<{
  id: "networks";
  routeSlug: "10-ip-adresa-i-maski";
  taskNumbers: readonly [10];
  title: "Маска подсети";
  summary: string;
  status: "published";
}>;

export const informationAmountLessonPublication: Readonly<{
  id: "information-amount";
  routeSlug: "11-paroli-i-zapisi";
  taskNumbers: readonly [11];
  title: "Информационный объём сообщения";
  summary: string;
  status: "published";
}>;

export const numeralSystemsLessonPublication: Readonly<{
  id: "numeral-systems";
  routeSlug: "14-sistemy-schisleniya";
  taskNumbers: readonly [14];
  title: "Позиционные системы счисления";
  summary: string;
  status: "published";
}>;

export const informationModelsLessonPublication: Readonly<{
  id: "information-models";
  routeSlug: "1-analiz-informacionnyh-modelej";
  taskNumbers: readonly [1];
  title: "Анализ информационных моделей";
  summary: string;
  status: "published";
}>;

export const truthTablesLessonPublication: Readonly<{
  id: "truth-tables";
  routeSlug: "2-tablicy-istinnosti";
  taskNumbers: readonly [2];
  title: "Таблицы истинности";
  summary: string;
  status: "published";
}>;

export const simpleAlgorithmsLessonPublication: Readonly<{
  id: "simple-algorithms";
  routeSlug: "6-prostejshie-algoritmy-dlya-ispolnitelej";
  taskNumbers: readonly [6];
  title: "Простейшие алгоритмы для исполнителей";
  summary: string;
  status: "published";
}>;

export const executorsLessonPublication: Readonly<{
  id: "executors";
  routeSlug: "12-ispolnenie-algoritma-dlya-ispolnitelya";
  taskNumbers: readonly [12];
  title: "Исполнение алгоритма для исполнителя";
  summary: string;
  status: "published";
}>;

export const branchingAndEnumerationLessonPublication: Readonly<{
  id: "branching-and-enumeration";
  routeSlug: "13-analiz-hoda-ispolneniya-algoritma";
  taskNumbers: readonly [13];
  title: "Анализ хода исполнения алгоритма";
  summary: string;
  status: "published";
}>;

export const logicTransformationsLessonPublication: Readonly<{
  id: "logic-transformations";
  routeSlug: "15-zakony-matematicheskoj-logiki";
  taskNumbers: readonly [15];
  title: "Законы математической логики";
  summary: string;
  status: "published";
}>;

export const parallelComputingLessonPublication: Readonly<{
  id: "parallel-computing";
  routeSlug: "22-mnogoprocessornye-sistemy";
  taskNumbers: readonly [22];
  title: "Многопроцессорные системы";
  summary: string;
  status: "published";
}>;

export const lessonPublications: readonly LessonPublication[];
