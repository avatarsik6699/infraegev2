/** A piece of a formula: function names, quoted text and template slots. */
export type FormulaPart = { text: string; kind?: "function" | "slot" };

// quoted text stays as it is; a lower-case word or «…» stands for an argument
const PART =
  /("[^"]*")|([A-ZА-ЯЁ][A-ZА-ЯЁ0-9.]*(?=\())|([a-zа-яё][\wа-яё]*|…)/gu;

/** The same split as the stand's `build.formula_html`. */
export function formulaParts(formula: string): FormulaPart[] {
  const parts: FormulaPart[] = [];
  let pos = 0;
  for (const m of formula.matchAll(PART)) {
    const start = m.index;
    if (start > pos) parts.push({ text: formula.slice(pos, start) });
    if (m[2]) parts.push({ text: m[2], kind: "function" });
    else if (m[3]) parts.push({ text: m[3], kind: "slot" });
    else parts.push({ text: m[0] });
    pos = start + m[0].length;
  }
  if (pos < formula.length) parts.push({ text: formula.slice(pos) });
  return parts;
}
