import type { PracticeTaskTypes } from "~/entities/practice-task";

export const practiceTasks: PracticeTaskTypes.LocalTask[] = [
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
    theoryLinks: [{ hash: "widget-base-case", label: "Базовый случай" }],
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
    theoryLinks: [{ hash: "widget-base-case", label: "Базовый случай" }],
  },
];

export const componentPracticeTasks: PracticeTaskTypes.LocalTask[] = [
  {
    ...practiceTasks[0],
    id: "design-system-lab-component-base-case",
    theoryLinks: [
      { hash: "catalog-recursive-step", label: "Рекурсивный вызов" },
    ],
  },
];

export const componentErrorPracticeTasks: PracticeTaskTypes.LocalTask[] = [
  {
    ...practiceTasks[0],
    id: "design-system-lab-component-check-error",
    theoryLinks: [
      { hash: "catalog-recursive-step", label: "Рекурсивный вызов" },
    ],
  },
];

export const colorTokens = [
  {
    name: "--color-alchimia-paper",
    label: "Белый фон",
    usage: "Основной фон",
  },
  {
    name: "--color-alchimia-ink",
    label: "Чернила",
    usage: "Заголовки и основной текст",
  },
  {
    name: "--color-alchimia-ink-secondary",
    label: "Вторичные чернила",
    usage: "Пояснения и служебный текст",
  },
  {
    name: "--color-alchimia-rule",
    label: "Граница",
    usage: "Структурные линии",
  },
] as const;

export const fontTokens = [
  {
    name: "--font-alchimia-display",
    label: "Display — Cormorant SC",
    sample: "Алхимия знания начинается с точного вопроса.",
  },
  {
    name: "--font-alchimia-reading",
    label: "Reading — Literata",
    sample: "Рекурсия — это вызов функции самой себя.",
  },
  {
    name: "--font-alchimia-service",
    label: "Service & code — IBM Plex Mono",
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

export const dashboardTabDefinitions = [
  {
    value: "system",
    label: "Система",
    description: "Язык всего приложения",
  },
  {
    value: "components",
    label: "Компоненты",
    description: "Публичные UI-контракты",
  },
  {
    value: "widgets",
    label: "Виджеты",
    description: "Составные части страниц",
  },
] as const;

export const systemSections = [
  { id: "system-identity", label: "Айдентика" },
  { id: "system-typography", label: "Типографика" },
  { id: "system-color", label: "Цвет" },
  { id: "system-surfaces", label: "Поверхности и границы" },
  { id: "system-layout", label: "Layout и адаптивность" },
  { id: "system-accessibility", label: "Доступность" },
  { id: "system-tokens", label: "Карта токенов" },
  { id: "system-rhythm", label: "Вертикальный ритм" },
  { id: "system-icons", label: "Иконки" },
  { id: "system-content-language", label: "Язык контента" },
] as const;

export const componentSections = [
  { id: "components-content", label: "Текст и структура" },
  { id: "components-actions", label: "Действия и навигация" },
  { id: "components-input", label: "Ввод и раскрытие" },
  { id: "components-feedback", label: "Статусы и обратная связь" },
  { id: "components-media", label: "Код и медиа" },
  { id: "components-learning", label: "Учебный контент" },
  { id: "components-features", label: "Продуктовые features" },
] as const;

export const widgetSections = [
  { id: "widgets-chrome", label: "Навигация приложения" },
  { id: "widgets-learning", label: "Навигация урока" },
  { id: "widgets-flow", label: "Учебный flow" },
  { id: "widgets-layout", label: "Композиции страниц" },
] as const;
