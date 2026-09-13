import type { PracticeCatalogTypes } from "./practice-catalog.types";

function search(value: Record<string, unknown>): PracticeCatalogTypes.Search {
  const result: PracticeCatalogTypes.Search =
    value.invalid === true ? { invalid: true } : {};
  for (const key of ["skill", "cursor"] as const) {
    const raw = value[key];
    if (raw === undefined || raw === "") continue;
    if (
      typeof raw !== "string" ||
      raw.length > (key === "cursor" ? 1024 : 120) ||
      (key === "skill" && !/^[a-z0-9][a-z0-9_-]*$/.test(raw))
    )
      result.invalid = true;
    else result[key] = raw;
  }
  for (const key of ["difficulty", "exam_number"] as const) {
    const raw = value[key];
    if (raw === undefined || raw === "") continue;
    const number =
      typeof raw === "number" || typeof raw === "string" ? Number(raw) : NaN;
    if (
      !Number.isInteger(number) ||
      number < 1 ||
      number > (key === "difficulty" ? 3 : 27)
    )
      result.invalid = true;
    else result[key] = number;
  }
  return result;
}

function href(value: PracticeCatalogTypes.Search) {
  const params = new URLSearchParams();
  for (const key of ["skill", "exam_number", "difficulty", "cursor"] as const) {
    if (value[key] !== undefined) params.set(key, String(value[key]));
  }
  return `/practice${params.size ? `?${params.toString()}` : ""}`;
}

export const practiceCatalog = { search, href };
