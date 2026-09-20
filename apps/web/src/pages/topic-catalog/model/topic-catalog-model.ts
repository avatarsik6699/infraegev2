import type { TopicCatalogTypes } from "~/entities/topic-catalog";
import type { TopicCatalogPageTypes } from "../topic-catalog-page.types";

export const topicCatalogModel = {
  filters: [
    { value: "all", label: "Все темы" },
    { value: "started", label: "В процессе" },
    { value: "not-started", label: "Не начаты" },
  ] as const,
  normalize: (value: string) =>
    value.toLocaleLowerCase("ru").replaceAll("ё", "е").trim(),
  number: (numbers: TopicCatalogTypes.TaskNumbers) =>
    numbers.length === 1
      ? String(numbers[0]).padStart(2, "0")
      : `${String(numbers[0])}–${String(numbers.at(-1))}`,
  matches: (
    entry: TopicCatalogTypes.Entry,
    query: string,
    filter: TopicCatalogPageTypes.Filter,
    progress: TopicCatalogPageTypes.Progress | undefined,
  ) => {
    const needle = topicCatalogModel.normalize(query);
    const text = topicCatalogModel.normalize(`${entry.title} ${entry.summary}`);
    const matchesQuery =
      text.includes(needle) ||
      entry.taskNumbers.some(
        (number) =>
          String(number) === needle ||
          String(number).padStart(2, "0") === needle,
      );
    if (!matchesQuery) return false;
    if (filter === "all") return true;
    if (entry.status !== "published" || !progress || progress.total === 0)
      return false;
    return filter === "not-started"
      ? progress.solved === 0
      : progress.solved > 0 && progress.solved < progress.total;
  },
  progressStatus: (progress: TopicCatalogPageTypes.Progress) => {
    if (progress.solved === 0) return "Практика не начата";
    if (progress.solved === progress.total) return "Практика завершена";
    return "Практика в процессе";
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
