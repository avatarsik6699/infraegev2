/** One part of a mask (`?`, `*` or required digits) and the digits it took. */
export type MaskSegment = { part: string; text: string };

export type MaskCheck =
  | { status: "empty" }
  | { status: "invalid-number" }
  | { status: "invalid-mask" }
  | { status: "rejected" }
  | { status: "accepted"; segments: readonly MaskSegment[] };

/** Splits a mask into `?`, `*` and runs of required characters. */
export function maskParts(mask: string): string[] {
  const parts: string[] = [];
  let run = "";
  for (const char of mask) {
    if (char === "?" || char === "*") {
      if (run) parts.push(run);
      run = "";
      parts.push(char);
    } else run += char;
  }
  if (run) parts.push(run);
  return parts;
}

/**
 * Port of `_segment` in scripts/lesson_design/figures.py: the first valid
 * split of `value` by the mask parts, `*` as short as possible; `null` when
 * the value does not match.
 */
export function segmentByMask(
  mask: string,
  value: string,
): MaskSegment[] | null {
  const parts = maskParts(mask);
  const go = (i: number, k: number): MaskSegment[] | null => {
    if (i === parts.length) return k === value.length ? [] : null;
    const part = parts[i] ?? "";
    if (part === "?") {
      if (k >= value.length || !/[0-9]/.test(value.charAt(k))) return null;
      const rest = go(i + 1, k + 1);
      return rest && [{ part, text: value.charAt(k) }, ...rest];
    }
    if (part === "*") {
      for (let length = 0; length <= value.length - k; length += 1) {
        const rest = go(i + 1, k + length);
        if (rest) return [{ part, text: value.slice(k, k + length) }, ...rest];
      }
      return null;
    }
    if (!value.startsWith(part, k)) return null;
    const rest = go(i + 1, k + part.length);
    return rest && [{ part, text: part }, ...rest];
  };
  return go(0, 0);
}

/** Validates the learner's input the way the stand does, then splits it. */
export function checkMask(mask: string, value: string): MaskCheck {
  const cleanMask = mask.trim();
  const cleanValue = value.trim();
  if (!cleanMask || !cleanValue) return { status: "empty" };
  if (!/^[0-9]+$/.test(cleanValue)) return { status: "invalid-number" };
  if (!/^[0-9?*]+$/.test(cleanMask)) return { status: "invalid-mask" };
  const segments = segmentByMask(cleanMask, cleanValue);
  return segments ? { status: "accepted", segments } : { status: "rejected" };
}
