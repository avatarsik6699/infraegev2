export type TypeGuard<T> = (value: unknown) => value is T;

/** Never throws — returns null on a syntax error or a failed guard, instead of surfacing either. */
function parse<T>(raw: string, guard: TypeGuard<T>): T | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Never throws — returns null on failure (e.g. circular refs) instead of throwing. */
function stringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export const safeJson = { parse, stringify };
