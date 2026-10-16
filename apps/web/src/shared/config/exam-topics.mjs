/**
 * Canonical EGE 2027 topics shared by the web catalog and practice taxonomy.
 * Lesson publication metadata may override the public lesson title/summary;
 * task numbers and stable topic identities do not depend on publication.
 *
 * @typedef {object} ExamTopicDefinition
 * @property {string} id
 * @property {readonly [number, ...number[]]} taskNumbers
 * @property {string} title
 * @property {string} summary
 */

/** @type {readonly ExamTopicDefinition[]} */
export const examTopicDefinitions = [
  {
    id: "information-models",
    taskNumbers: [1],
    title: "Анализ информационных моделей",
    summary:
      "Схемы, таблицы и графы как способы представить данные и связи между объектами.",
  },
  {
    id: "truth-tables",
    taskNumbers: [2],
    title: "Таблицы истинности",
    summary:
      "Логические операции, выражения и восстановление формулы по таблице истинности.",
  },
  {
    id: "relational-databases",
    taskNumbers: [3],
    title: "Реляционные базы данных",
    summary:
      "Поиск, сортировка, фильтрация и связи между таблицами в готовой базе данных.",
  },
  {
    id: "coding-and-fano",
    taskNumbers: [4],
    title: "Кодирование и условие Фано",
    summary:
      "Однозначное декодирование сообщений, неравномерные коды и кодовые деревья.",
  },
  {
    id: "preobrazovanie-zapisey-chisel",
    taskNumbers: [5],
    title: "Преобразование записей чисел",
    summary:
      "Исполнение алгоритма и поиск исходных данных, приводящих к заданному результату.",
  },
  {
    id: "simple-algorithms",
    taskNumbers: [6],
    title: "Анализ простейших алгоритмов",
    summary:
      "Определение результата программы или алгоритма для исполнителя по его шагам.",
  },
  {
    id: "media-coding",
    taskNumbers: [7],
    title: "Кодирование изображений и звука",
    summary:
      "Разрешение, глубина цвета, частота дискретизации и информационный объём данных.",
  },
  {
    id: "word-enumeration",
    taskNumbers: [8],
    title: "Перебор слов",
    summary:
      "Подсчёт слов в заданном алфавите с ограничениями на символы и их позиции.",
  },
  {
    id: "spreadsheets",
    taskNumbers: [9],
    title: "Электронные таблицы",
    summary:
      "Формулы, диапазоны и вычисление характеристик набора данных в таблице.",
  },
  {
    id: "networks",
    taskNumbers: [10],
    title: "Компьютерные сети и адресация",
    summary: "IP-адреса, маски подсетей и определение параметров сети.",
  },
  {
    id: "information-amount",
    taskNumbers: [11],
    title: "Количество информации",
    summary: "Алфавитный подход, единицы измерения и расчёт объёма сообщения.",
  },
  {
    id: "executors",
    taskNumbers: [12],
    title: "Машина Тьюринга",
    summary:
      "Выполнение программы машины Тьюринга и анализ её результата на ленте.",
  },
  {
    id: "branching-and-enumeration",
    taskNumbers: [13],
    title: "Подсчёт программ исполнителя",
    summary:
      "Подсчёт программ исполнителя с заданными командами и ограничениями на путь вычислений.",
  },
  {
    id: "numeral-systems",
    taskNumbers: [14],
    title: "Системы счисления",
    summary:
      "Позиционная запись, перевод чисел и арифметика в разных основаниях.",
  },
  {
    id: "logic-transformations",
    taskNumbers: [15],
    title: "Преобразование логических выражений",
    summary:
      "Предикаты, множества и эквивалентные преобразования логических условий.",
  },
  {
    id: "rekursiya",
    taskNumbers: [16],
    title: "Рекурсивные алгоритмы",
    summary:
      "Рекурсивные функции, базовые случаи и вычисление значений по определению.",
  },
  {
    id: "number-sequences",
    taskNumbers: [17],
    title: "Числовые последовательности",
    summary:
      "Поиск, подсчёт и вычисление характеристик элементов последовательности.",
  },
  {
    id: "spreadsheet-optimization",
    taskNumbers: [18],
    title: "Оптимизация в электронных таблицах",
    summary:
      "Исследование данных и поиск наилучшего результата с помощью таблицы.",
  },
  {
    id: "winning-strategy",
    taskNumbers: [19, 20, 21],
    title: "Выигрышная стратегия",
    summary:
      "Позиции в игре двух участников, дерево ходов и стратегия победы для трёх связанных заданий.",
  },
  {
    id: "parallel-computing",
    taskNumbers: [22],
    title: "Параллельные вычисления",
    summary:
      "Зависимости между процессами и минимальное время выполнения набора работ.",
  },
  {
    id: "graph-analysis",
    taskNumbers: [23],
    title: "Анализ графов",
    summary:
      "Граф из файла, кратчайший путь в ациклическом графе, обязательные и запрещённые вершины.",
  },
  {
    id: "string-processing",
    taskNumbers: [24],
    title: "Обработка символьных строк",
    summary:
      "Поиск самых длинных непрерывных фрагментов и проверка условий на соседние символы и выражения.",
  },
  {
    id: "divisors-and-masks",
    taskNumbers: [25],
    title: "Делители и маски",
    summary:
      "Делители парами, простые числа и разложение, маски числа и поиск в диапазоне.",
  },
  {
    id: "array-processing",
    taskNumbers: [26],
    title: "Обработка данных: сортировка и отбор",
    summary:
      "Чтение файлов, сортировка записей, отбор при ограничении и обработка событий.",
  },
  {
    id: "data-analysis",
    taskNumbers: [27],
    title: "Анализ данных: кластеризация",
    summary:
      "Группировка записей по признаку, поиск центра и проверка результатов.",
  },
];
