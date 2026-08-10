export function finiteNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function records(value: unknown): Array<Record<string, unknown>> {
  if (!value || typeof value !== "object") return [];
  const candidate = value as { items?: unknown; data?: unknown };
  const rows = Array.isArray(candidate.items) ? candidate.items : candidate.data;
  return Array.isArray(rows)
    ? rows.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}
