import { lessonPublications } from "~/shared/config/lesson-publication.mjs";
import type { TopicCatalogTypes } from "./topic-catalog.types";

const definitions: readonly TopicCatalogTypes.Definition[] = [
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
    title: "Алгоритмы для исполнителей",
    summary:
      "Пошаговое выполнение команд и определение исходных данных по результату.",
  },
  {
    id: "branching-and-enumeration",
    taskNumbers: [13],
    title: "Ветвления и перебор вариантов",
    summary:
      "Операторы присваивания, условия и дерево возможных ходов алгоритма.",
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
      "Количество путей, ориентированные графы и поиск оптимального маршрута.",
  },
  {
    id: "string-processing",
    taskNumbers: [24],
    title: "Обработка символьных строк",
    summary:
      "Поиск и замена подстрок, подсчёт символов и разбор текстовых данных.",
  },
  {
    id: "integer-processing",
    taskNumbers: [25],
    title: "Обработка целых чисел",
    summary:
      "Делители, простые числа, цифры записи и эффективный перебор диапазона.",
  },
  {
    id: "array-processing",
    taskNumbers: [26],
    title: "Обработка и сортировка массивов",
    summary:
      "Однопроходные алгоритмы, поиск экстремумов и упорядочивание данных.",
  },
  {
    id: "data-analysis",
    taskNumbers: [27],
    title: "Анализ данных",
    summary:
      "Построение модели, преобразование данных и интерпретация результата программы.",
  },
];

const publicationById = new Map(
  lessonPublications.map(
    (publication) => [publication.id, publication] as const,
  ),
);

const entries: readonly TopicCatalogTypes.Entry[] = definitions.map(
  (definition) => {
    const publication = publicationById.get(definition.id);
    if (publication?.status !== "published") {
      return { ...definition, status: "planned" };
    }

    return {
      ...definition,
      taskNumbers: publication.taskNumbers,
      title: publication.title,
      summary: publication.summary,
      status: "published",
      routeSlug: publication.routeSlug,
    };
  },
);

function formatTaskNumbers(taskNumbers: TopicCatalogTypes.TaskNumbers): string {
  if (taskNumbers.length === 1) {
    return `Задание ${String(taskNumbers[0])}`;
  }

  const consecutive = taskNumbers.every(
    (taskNumber, index) =>
      index === 0 || taskNumber === taskNumbers[index - 1] + 1,
  );

  return consecutive
    ? `Задания ${String(taskNumbers[0])}–${String(taskNumbers.at(-1))}`
    : `Задания ${taskNumbers.join(", ")}`;
}

export const topicCatalog = {
  entries,
  formatTaskNumbers,
} as const;
