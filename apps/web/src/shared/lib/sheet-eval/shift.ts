import { colLetters, colNumber, tokenize } from "./sheet-eval";

/** A piece of a copied formula; `moved` marks a column or row that changed. */
export type ShiftPart = { text: string; moved: boolean };

export type ShiftResult = {
  parts: ShiftPart[];
  /** An address went off the sheet: Excel writes #ССЫЛКА! in its place. */
  offSheet: boolean;
};

const END = /^(\$?)([A-Z]{1,3})(\$?)(\d+)$/;

/**
 * The formula as Excel writes it after copying by `drow` rows and `dcol`
 * columns (sheet_eval.shift): parts of an address without `$` move, parts
 * with `$` stay. Throws on a formula that does not tokenize.
 */
export function shiftFormula(
  formula: string,
  drow: number,
  dcol: number,
): ShiftResult {
  const parts: ShiftPart[] = [];
  let offSheet = false;
  let pos = 0;
  const plain = (text: string) => {
    if (text) parts.push({ text, moved: false });
  };
  for (const tok of tokenize(formula)) {
    if (tok.kind !== "ref") continue;
    plain(formula.slice(pos, tok.start));
    pos = tok.start + tok.text.length;
    const bang = tok.text.lastIndexOf("!");
    const prefix = bang >= 0 ? tok.text.slice(0, bang + 1) : "";
    const moved: ShiftPart[] = [];
    let bad = false;
    tok.text
      .slice(bang + 1)
      .split(":")
      .forEach((end, k) => {
        const m = END.exec(end);
        if (!m) throw new Error(`bad reference ${tok.text}`);
        const col = colNumber(m[2]) + (m[1] ? 0 : dcol);
        const row = Number(m[4]) + (m[3] ? 0 : drow);
        if (col < 1 || row < 1) bad = true;
        const letters = colLetters(Math.max(col, 1));
        if (k) moved.push({ text: ":", moved: false });
        moved.push(
          { text: m[1], moved: false },
          { text: letters, moved: letters !== m[2] },
          { text: m[3], moved: false },
          { text: String(row), moved: String(row) !== m[4] },
        );
      });
    if (bad) {
      offSheet = true;
      parts.push({ text: "#ССЫЛКА!", moved: true });
    } else {
      plain(prefix);
      parts.push(...moved.filter((p) => p.text !== ""));
    }
  }
  plain(formula.slice(pos));
  return { parts, offSheet };
}
