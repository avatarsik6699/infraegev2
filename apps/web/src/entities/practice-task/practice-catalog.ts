import type { PracticeCatalogTypes } from "./practice-catalog.types";

function search(value: Record<string, unknown>): PracticeCatalogTypes.Search {
  const result: PracticeCatalogTypes.Search =
    value.invalid === true ? { invalid: true } : {};
  if (value.q !== undefined && value.q !== "") {
    if (typeof value.q !== "string" || value.q.length > 200)
      result.invalid = true;
    else if (value.q.trim()) result.q = value.q.trim();
  }
  if (value.topics !== undefined) {
    const topics = Array.isArray(value.topics) ? value.topics : [value.topics];
    if (
      topics.length > 100 ||
      topics.some(
        (topic) =>
          typeof topic !== "string" ||
          !/^[a-z0-9][a-z0-9_-]{0,119}$/.test(topic),
      )
    )
      result.invalid = true;
    else if (topics.length)
      result.topics = [...new Set(topics as string[])].sort();
  }
  if (
    value.sort !== undefined &&
    value.sort !== "" &&
    value.sort !== "default"
  ) {
    if (value.sort === "difficulty_asc" || value.sort === "difficulty_desc")
      result.sort = value.sort;
    else result.invalid = true;
  }
  if (value.limit !== undefined && value.limit !== "") {
    const limit = Number(value.limit);
    if (limit === 10 || limit === 30 || limit === 50 || limit === 100)
      result.limit = limit;
    else result.invalid = true;
  }
  for (const key of ["skill"] as const) {
    const raw = value[key];
    if (raw === undefined || raw === "") continue;
    if (
      typeof raw !== "string" ||
      raw.length > 120 ||
      (key === "skill" && !/^[a-z0-9][a-z0-9_-]*$/.test(raw))
    )
      result.invalid = true;
    else result[key] = raw;
  }
  for (const key of ["difficulty", "exam_number", "page"] as const) {
    const raw = value[key];
    if (raw === undefined || raw === "") continue;
    const number =
      typeof raw === "number" || typeof raw === "string" ? Number(raw) : NaN;
    if (
      !Number.isInteger(number) ||
      number < 1 ||
      number > { difficulty: 3, page: 100000, exam_number: 27 }[key]
    )
      result.invalid = true;
    else result[key] = number;
  }
  return result;
}

function href(value: PracticeCatalogTypes.Search) {
  const params = new URLSearchParams();
  for (const key of [
    "q",
    "sort",
    "limit",
    "skill",
    "exam_number",
    "difficulty",
    "page",
  ] as const) {
    if (value[key] !== undefined) params.set(key, String(value[key]));
  }
  for (const topic of value.topics ?? []) params.append("topics", topic);
  return `/practice${params.size ? `?${params.toString()}` : ""}`;
}

function taskSearch(
  value: Record<string, unknown>,
): PracticeCatalogTypes.TaskSearch {
  const parsed = search(value);
  if (parsed.invalid) return {};
  return parsed;
}

function taskHref(id: string, value: PracticeCatalogTypes.TaskSearch = {}) {
  const params = new URLSearchParams(href(value).split("?")[1]);
  return `/practice/${encodeURIComponent(id)}${params.size ? `?${params.toString()}` : ""}`;
}

function returnHref(value: PracticeCatalogTypes.TaskSearch) {
  return href(value);
}

function difficultyLabel(value: number) {
  return ["Базовая", "Средняя", "Высокая"][value - 1] ?? "Сложность не указана";
}

function countLabel(count: number) {
  const last = count % 10;
  const teen = count % 100;
  let word = "заданий";
  if (last === 1 && teen !== 11) word = "задание";
  else if (last >= 2 && last <= 4 && (teen < 12 || teen > 14)) word = "задания";
  return `${count} ${word}`;
}

export const practiceCatalog = {
  countLabel,
  search,
  href,
  taskSearch,
  taskHref,
  returnHref,
  difficultyLabel,
};
