import type { LessonTypes } from "~/entities/lesson";

export const practiceTasks: LessonTypes.LocalPracticeTask[] = [
  {
    id: "design-system-lab-base-case",
    difficultyLabel: "Разминка",
    title: "Найдите базовый случай",
    statement:
      "Функция countdown(n) вызывает countdown(n - 1), пока n не станет равно 0. При каком значении n вызовов больше не будет?",
    answers: ["0", "ноль"],
    hint: "Базовый случай — вход, при котором функция не делает рекурсивный вызов.",
    explanation:
      "При n = 0 функция возвращается сразу, без нового вызова — это и есть базовый случай.",
    solution: [
      {
        type: "text",
        text: "При n = 0 функция возвращается сразу, без нового вызова — это и есть базовый случай.",
      },
    ],
    theoryLinks: [{ hash: "base-case", label: "Базовый случай" }],
  },
  {
    id: "design-system-lab-call-count",
    difficultyLabel: "Применение",
    title: "Посчитайте вызовы",
    statement:
      "countdown(3) вызывает countdown(2), тот — countdown(1), тот — countdown(0). Сколько всего вызовов функции countdown произойдёт?",
    answers: ["4", "четыре"],
    hint: "Считайте сам исходный вызов countdown(3) тоже.",
    explanation:
      "4 вызова: countdown(3), countdown(2), countdown(1), countdown(0) — последний из них базовый случай.",
    solution: [
      {
        type: "text",
        text: "4 вызова: countdown(3), countdown(2), countdown(1), countdown(0) — последний из них базовый случай.",
      },
    ],
    theoryLinks: [{ hash: "base-case", label: "Базовый случай" }],
  },
];

export const colorTokens = [
  { name: "--color-bg", label: "Фон страницы" },
  { name: "--color-surface", label: "Поверхность" },
  { name: "--color-text", label: "Текст" },
  { name: "--color-muted", label: "Вторичный текст" },
  { name: "--color-rule", label: "Линия" },
  { name: "--color-accent", label: "Основное действие" },
  { name: "--color-code", label: "Код (фон)" },
] as const;

export const fontTokens = [
  {
    name: "--font-reading",
    label: "Reading — Literata",
    sample: "Рекурсия — это вызов функции самой себя.",
  },
  {
    name: "--font-ui",
    label: "UI — Onest",
    sample: "Навигация, подписи, интерфейсные элементы.",
  },
  {
    name: "--font-data",
    label: "Data — mono",
    sample: "def fib(n): return n if n < 2 else fib(n-1)+fib(n-2)",
  },
] as const;

export const tonalSteps = [
  { name: "--color-surface", label: "surface · 0" },
  { name: "--surface-tonal-1", label: "tonal · 1" },
  { name: "--surface-tonal-2", label: "tonal · 2" },
] as const;

export const spacingTokens = [
  { name: "--space-0-5", label: "space-0-5" },
  { name: "--space-1", label: "space-1" },
  { name: "--space-1-5", label: "space-1-5" },
  { name: "--space-2", label: "space-2" },
  { name: "--space-3", label: "space-3" },
  { name: "--space-4", label: "space-4" },
  { name: "--space-5", label: "space-5" },
  { name: "--space-6", label: "space-6" },
  { name: "--space-section-break", label: "space-section-break" },
] as const;

export const catalogNavigation = [
  { id: "foundations", label: "Foundations" },
  { id: "primitives", label: "Primitives" },
  { id: "feedback-disclosure", label: "Feedback & Disclosure" },
  { id: "lesson-patterns", label: "Lesson Patterns" },
  { id: "composite-flows", label: "Composite Flows" },
] as const;
