import { examPlan, type TopicCatalogTypes } from "~/entities/topic-catalog";
import { russianCount } from "~/shared/lib/russian-count";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";

export const topicCatalogModel = {
  filters: [
    { value: "all", label: "Все темы" },
    { value: "started", label: "В процессе" },
    { value: "not-started", label: "Не начаты" },
  ] as const,
  /** F25: exam order 1–27, published and planned topics together. */
  order: (entries: readonly TopicCatalogTypes.Entry[]) =>
    [...entries].sort((a, b) => a.taskNumbers[0] - b.taskNumbers[0]),
  number: (numbers: TopicCatalogTypes.TaskNumbers) =>
    numbers.length === 1
      ? String(numbers[0]).padStart(2, "0")
      : `${String(numbers[0])}–${String(numbers.at(-1))}`,
  /** F42: what an empty progress filter says. */
  emptyText: (filter: TopicCatalogPageTypes.Filter) =>
    filter === "started"
      ? {
          title: "Пока нет начатых тем",
          text: "Решите задачу в любой теме — она появится здесь.",
        }
      : {
          title: "Все темы уже начаты",
          text: "Неначатых тем с практикой не осталось.",
        },
  /** F40: the progress filter alone — the topic search was removed. */
  matches: (
    entry: TopicCatalogTypes.Entry,
    filter: TopicCatalogPageTypes.Filter,
    progress: TopicCatalogPageTypes.Progress | undefined,
  ) => {
    if (filter === "all") return true;
    if (entry.status !== "published" || !progress || progress.total === 0)
      return false;
    return filter === "not-started"
      ? progress.solved === 0
      : progress.solved > 0 && progress.solved < progress.total;
  },
  /**
   * F34: «Базовый · ≈ 3 мин», «Высокий · ≈ 35 мин · 2 балла»; a grouped
   * topic names its levels («базовый, повышенный, высокий»).
   */
  levelLabel: (numbers: TopicCatalogTypes.TaskNumbers) => {
    const parts = topicCatalogModel.levelParts(numbers);
    return [parts.level, parts.detail].filter(Boolean).join(" · ");
  },
  /** T3: the level and its detail apart, so a narrow row can drop the
   * detail («≈ 3 мин · 2 балла») instead of breaking the line. */
  levelParts: (numbers: TopicCatalogTypes.TaskNumbers) => {
    const levels = [...new Set(examPlan.levels(numbers))];
    if (levels.length > 1)
      return {
        level: levels
          .map((level) => examPlan.levelTitles[level].toLocaleLowerCase("ru"))
          .join(", "),
        detail: "",
      };
    const task = numbers[0];
    const points = examPlan.points(task);
    return {
      level: examPlan.levelTitles[examPlan.level(task)],
      detail: [
        `≈ ${String(examPlan.minutes(task))} мин`,
        points > 1 ? russianCount.of(points, ["балл", "балла", "баллов"]) : "",
      ]
        .filter(Boolean)
        .join(" · "),
    };
  },
  /** F44: a goal's scope for its tooltip: «11 из 27 заданий, до 11
   * первичных ≈ 54 балла». */
  goalScope: (goal: TopicCatalogTypes.Goal) => {
    const scope = examPlan.goalScope(goal);
    const tasks =
      scope.tasks === 27
        ? "Все 27 заданий"
        : `${String(scope.tasks)} из 27 заданий`;
    return `${tasks}, до ${russianCount.of(scope.primary, ["первичного", "первичных", "первичных"])} ≈ ${russianCount.of(scope.score, ["балл", "балла", "баллов"])}`;
  },
  summaryText: (count: number | null, unavailable: boolean) => {
    if (count !== null) return `Решено задач в темах: ${String(count)}`;
    if (unavailable) return "Прогресс временно недоступен";
    return "Решено задач в темах: —";
  },
  aggregate: (
    lessons: TopicCatalogPageTypes.Summary,
    snapshots: Readonly<Record<string, { solvedTaskIds: readonly string[] }>>,
  ) => {
    const byId: Record<string, TopicCatalogPageTypes.Progress> = {};
    const solvedIds = new Set<string>();
    for (const lesson of lessons) {
      if (!lesson.tasks.length) continue;
      const solved = snapshots[lesson.id]?.solvedTaskIds ?? [];
      byId[lesson.id] = { solved: solved.length, total: lesson.tasks.length };
      for (const id of solved) solvedIds.add(id);
    }
    return { byId, totalSolved: solvedIds.size };
  },
  taskCount: (count: number) => {
    const tens = count % 100;
    const units = count % 10;
    let noun = "задач";
    if (tens < 11 || tens > 14) {
      if (units === 1) noun = "задача";
      else if (units >= 2 && units <= 4) noun = "задачи";
    }
    return `${String(count)} ${noun}`;
  },
};
