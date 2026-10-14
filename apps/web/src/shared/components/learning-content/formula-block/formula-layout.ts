/**
 * Lines of a long formula (Change 184 F9): a formula wider than a line breaks
 * between the arguments of its call, never inside one, as a learner breaks it
 * in Excel with Alt+Enter. The «ЕСЛИМН» functions keep each «range; criterion»
 * pair on one line. A line still too long breaks the first call inside it once
 * more, one level deeper.
 */
export type FormulaLine = { start: number; end: number; indent: number };

/** Longer formulas break; shorter ones stay on one line. */
export const FORMULA_LINE = 44;

// arguments before the «range; criterion» pairs
const PAIRS: Record<string, number> = {
  СУММЕСЛИМН: 1,
  СРЗНАЧЕСЛИМН: 1,
  МАКСЕСЛИМН: 1,
  МИНЕСЛИМН: 1,
  СЧЁТЕСЛИМН: 0,
};

const NAME = /[A-ZА-ЯЁ][A-ZА-ЯЁ0-9.]*$/u;

type Call = { name: string; open: number; close: number; seps: number[] };

/** Calls of the formula with their own separators, quoted text skipped. */
function calls(formula: string): Call[] {
  const found: Call[] = [];
  const stack: Call[] = [];
  let quote: string | null = null;
  for (let i = 0; i < formula.length; i++) {
    const ch = formula[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") {
      const name = NAME.exec(formula.slice(0, i))?.[0] ?? "";
      stack.push({ name, open: i, close: -1, seps: [] });
    } else if (ch === ";") stack.at(-1)?.seps.push(i);
    else if (ch === ")") {
      const call = stack.pop();
      if (call) found.push({ ...call, close: i });
    }
  }
  return found.sort((a, b) => a.open - b.open);
}

/** Where the lines of one call start: after the separators that end a group. */
function groupStarts(call: Call): number[] {
  const lead = PAIRS[call.name] as number | undefined;
  return call.seps
    .filter((_, k) =>
      lead === undefined ? true : k < lead || (k - lead) % 2 === 1,
    )
    .map((sep) => sep + 1);
}

function split(line: FormulaLine, all: Call[], depth: number): FormulaLine[] {
  if (line.end - line.start <= FORMULA_LINE || depth > 1) return [line];
  const call = all.find(
    (c) => c.open >= line.start && c.close < line.end && c.seps.length > 0,
  );
  if (!call) return [line];
  const starts = groupStarts(call);
  const bounds = [line.start, ...starts, line.end];
  const lines: FormulaLine[] = [];
  for (let k = 0; k + 1 < bounds.length; k++) {
    const part = {
      start: bounds[k],
      end: bounds[k + 1],
      indent: k === 0 ? line.indent : line.indent + depth + 1,
    };
    lines.push(...split(part, all, depth + 1));
  }
  return lines;
}

/** The lines of a formula; one line when it is short or has no call. */
export function formulaLayout(formula: string): FormulaLine[] {
  const whole = { start: 0, end: formula.length, indent: 0 };
  if (!formula.startsWith("=")) return [whole];
  return split(whole, calls(formula), 0);
}

/** Pieces of a formula cut at its line starts: each line with its pieces. */
export function linesOf<T extends { text: string }>(
  parts: readonly T[],
  layout: readonly FormulaLine[],
): { indent: number; parts: T[] }[] {
  const lines = layout.map((line) => ({
    indent: line.indent,
    parts: [] as T[],
  }));
  let pos = 0;
  for (const part of parts) {
    let offset = 0;
    while (offset < part.text.length) {
      const at = pos + offset;
      const index = layout.findIndex((l) => at >= l.start && at < l.end);
      const end = Math.min(layout[index].end - pos, part.text.length);
      lines[index].parts.push({ ...part, text: part.text.slice(offset, end) });
      offset = end;
    }
    pos += part.text.length;
  }
  return lines;
}
