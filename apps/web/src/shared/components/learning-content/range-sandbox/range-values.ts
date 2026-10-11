/** Values of Python's `range(start, stop, step)`, capped for drawing. */
export function rangeValues(
  start: number,
  stop: number,
  step: number,
  limit = 200,
): number[] {
  const out: number[] = [];
  if (step > 0)
    for (let v = start; v < stop && out.length < limit; v += step) out.push(v);
  else if (step < 0)
    for (let v = start; v > stop && out.length < limit; v += step) out.push(v);
  return out;
}

/**
 * Indexes a slice `s[start:stop:step]` takes from a sequence of `length`,
 * as Python's `slice.indices`: `null` is an omitted bound.
 */
export function sliceIndexes(
  start: number | null,
  stop: number | null,
  step: number,
  length: number,
): number[] {
  const lower = step > 0 ? 0 : -1;
  const upper = step > 0 ? length : length - 1;
  const fix = (value: number | null, fallback: number) => {
    if (value === null) return fallback;
    if (value < 0) return Math.max(value + length, lower);
    return Math.min(value, upper);
  };
  const from = fix(start, step > 0 ? 0 : length - 1);
  const to = fix(stop, step > 0 ? length : -1);
  return rangeValues(from, to, step);
}

/** A whole number typed by the learner; empty is `null`, garbage is `NaN`. */
export function parseWhole(text: string): number | null {
  const value = text.trim().replace("−", "-");
  if (value === "") return null;
  return /^-?\d+$/u.test(value) ? Number.parseInt(value, 10) : Number.NaN;
}
