import type { TopicCatalogTypes } from "./topic-catalog.types";

type Level = TopicCatalogTypes.Level;
type Goal = TopicCatalogTypes.Goal;

const levelOf = (task: number): Level => {
  if (task <= 10 || task === 19) return "basic";
  if (task === 21 || task >= 24) return "high";
  return "advanced";
};

/**
 * Change 185 (F34): level, approximate minutes and points of each task after
 * the generalised plan in the FIPI project specification of the 2027 KIM —
 * the same dated source as the catalog (SPEC §3). Tasks 26 and 27 give two
 * points; the minutes add up to the exam's 235.
 */
const minutes: readonly number[] = [
  3, 3, 3, 2, 4, 4, 5, 4, 6, 3, 3, 6, 7, 3, 3, 5, 13, 8, 5, 7, 10, 7, 12, 18,
  20, 35, 36,
];
const taskNumbers = Array.from({ length: 27 }, (_, index) => index + 1);
const points = (task: number) => (task >= 26 ? 2 : 1);

/**
 * Primary to test score, the approximate scale of past years: it is approved
 * every year, so the page names targets, never a promised result.
 */
const testScale: readonly number[] = [
  0, 7, 14, 20, 27, 34, 40, 43, 46, 48, 51, 54, 56, 59, 62, 64, 67, 70, 72, 75,
  78, 80, 83, 85, 88, 90, 93, 95, 98, 100,
];

/** F35: goals are cumulative by level; Хард takes every task. */
const goals: readonly TopicCatalogTypes.GoalDefinition[] = [
  {
    id: "base",
    title: "База",
    target: 40,
    levels: ["basic"],
    summary: "Без программирования: только математика и простые решения.",
  },
  {
    id: "standard",
    title: "Стандарт",
    target: 60,
    levels: ["basic", "advanced"],
    summary:
      "Проверенные методы и шаблоны: стабильный результат выше среднего.",
  },
  {
    id: "hard",
    title: "Хард",
    target: 80,
    levels: ["basic", "advanced", "high"],
    summary: "Серьёзное программирование и самые сложные задачи.",
  },
];

const goalById = (id: Goal) => goals.find((goal) => goal.id === id) ?? goals[2];

export const examPlan = {
  levelTitles: {
    basic: "Базовый",
    advanced: "Повышенный",
    high: "Высокий",
  } satisfies Record<Level, string>,
  goals,
  defaultGoal: "hard" as Goal,
  isGoal: (value: unknown): value is Goal =>
    goals.some((goal) => goal.id === value),
  level: levelOf,
  minutes: (task: number) => minutes[task - 1] ?? 0,
  points,
  /** Levels of a topic's tasks, in task order («19–21»: three levels). */
  levels: (numbers: TopicCatalogTypes.TaskNumbers): readonly Level[] =>
    numbers.map(levelOf),
  inGoal: (numbers: TopicCatalogTypes.TaskNumbers, id: Goal) =>
    numbers.some((task) => goalById(id).levels.includes(levelOf(task))),
  /** Tasks, the most primary points and their test score for a goal. */
  goalScope: (id: Goal) => {
    const tasks = taskNumbers.filter((task) =>
      goalById(id).levels.includes(levelOf(task)),
    );
    const primary = tasks.reduce((sum, task) => sum + points(task), 0);
    return {
      tasks: tasks.length,
      primary,
      score: testScale[primary] ?? 100,
      totalMinutes: tasks.reduce(
        (sum, task) => sum + (minutes[task - 1] ?? 0),
        0,
      ),
    };
  },
  goal: goalById,
};
