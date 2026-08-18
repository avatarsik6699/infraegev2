import type { LessonTypes } from "~/entities/lesson";

const outline: LessonTypes.OutlineGroup[] = [
  {
    id: "theory",
    label: "Теория",
    items: [
      { id: "range", label: "Середина превращает неизвестность в выбор" },
      { id: "speed", label: "Почему это быстро" },
    ],
  },
  {
    id: "practice",
    label: "Практика",
    items: [{ id: "try-it", label: "Попробуйте сами" }],
  },
  {
    id: "exam-focus",
    label: "Что важно для ЕГЭ",
    items: [{ id: "mistakes", label: "Типичная ошибка с границами" }],
  },
  {
    id: "result",
    label: "Результат",
    items: [
      { id: "outcome", label: "Что получилось" },
      { id: "next-step", label: "Следующий шаг" },
    ],
  },
];

const practiceTasks: LessonTypes.LocalPracticeTask[] = [
  {
    id: "keep-half",
    difficultyLabel: "Разминка",
    title: "Выберите половину",
    statement:
      "Ищем 27, средний элемент равен 31. Какую половину нужно оставить: левую или правую?",
    answers: ["левая", "левую"],
    hint: "Сравните 27 и 31: искомое число меньше среднего.",
    explanation:
      "Оставляем левую половину. В отсортированном массиве только слева от 31 могут находиться меньшие значения.",
    theoryLinks: [{ hash: "range", label: "Схема сравнения" }],
  },
  {
    id: "left-boundary",
    difficultyLabel: "База",
    title: "Сдвиньте левую границу",
    statement:
      "Если x > a[M] и M = 8, чему должна стать равна левая граница L? Введите число.",
    answers: ["9"],
    hint: "Используйте правило L = M + 1.",
    explanation:
      "Новая левая граница равна 9. Индекс 8 уже проверен, поэтому повторно включать его в диапазон нельзя.",
    theoryLinks: [{ hash: "range", label: "Правило границ" }],
  },
  {
    id: "right-boundary",
    difficultyLabel: "Применение",
    title: "Сдвиньте правую границу",
    statement:
      "Если x < a[M] и M = 8, чему должна стать равна правая граница R? Введите число.",
    answers: ["7"],
    hint: "Используйте правило R = M − 1.",
    explanation:
      "Новая правая граница равна 7. Средний элемент и всё справа от него уже исключены сравнением.",
    theoryLinks: [{ hash: "range", label: "Правило границ" }],
  },
  {
    id: "loop-condition",
    difficultyLabel: "Границы",
    title: "Сохраните последний кандидат",
    statement:
      "Запишите условие цикла для границ L и R, при котором массив из одного оставшегося элемента ещё проверяется.",
    answers: ["l<=r", "left<=right", "l≤r", "left≤right"],
    hint: "Равные границы означают, что остался один допустимый индекс.",
    explanation:
      "Условие L ≤ R сохраняет диапазон из одного элемента. Строгое L < R завершило бы поиск на один шаг раньше.",
    theoryLinks: [
      { hash: "range", label: "Диапазон [L, R]" },
      { hash: "speed", label: "Код алгоритма" },
    ],
  },
  {
    id: "trace-count",
    difficultyLabel: "Трасса",
    title: "Завершите трассировку",
    statement:
      "В массиве [2, 5, 7, 9, 12, 14, 21, 27, 31, 34, 38, 45, 50] двоичный поиск идёт 21 → 34 → 27. Сколько сравнений выполнено?",
    answers: ["3", "три"],
    hint: "Посчитайте все проверенные средние элементы, включая найденный.",
    explanation:
      "Выполнено три сравнения: сначала с 21, затем с 34 и наконец с 27. Последнее сравнение тоже входит в результат.",
    theoryLinks: [{ hash: "range", label: "Схема шагов" }],
  },
];

const code = `def binary_search(a, x):
    left, right = 0, len(a) - 1
    while left <= right:
        middle = (left + right) // 2
        if a[middle] == x:
            return middle
        if a[middle] < x:
            left = middle + 1
        else:
            right = middle - 1
    return -1`;

export const lessonDesignLabConstants = {
  code,
  lessonId: "binary-search",
  masteryThreshold: 0.8,
  outline,
  practiceTasks,
};
