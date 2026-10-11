import {
  Book,
  address,
  formatted,
  kindOf,
  parseAddress,
  parseRef,
  tokenize,
} from "~/shared/lib/sheet-eval";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";

/** «Лист!B2» — a cell across the sheets of one block. */
export const cellKey = (sheet: string, addr: string) => `${sheet}!${addr}`;

/** Five frame colours, as Excel colours the references of a formula. */
export const REF_COLORS = 5;

export type CellView = {
  shown: string;
  kind: ReturnType<typeof kindOf>;
  formula: boolean;
  editable: boolean;
};

/** The block's book: the author's inputs with the learner's edits on top. */
export function bookFor(
  data: LessonMediaTypes.Sheet,
  edits: ReadonlyMap<string, string>,
): Book {
  const book = new Book();
  for (const part of data.sheets) {
    const sheet = book.sheet(part.name);
    part.filtered.forEach((r) => sheet.filtered.add(r));
    part.hidden.forEach((r) => sheet.hidden.add(r));
    for (const [addr, text] of Object.entries(part.inputs))
      book.set(part.name, addr, text);
  }
  for (const [key, text] of edits) {
    const bang = key.lastIndexOf("!");
    book.set(key.slice(0, bang), key.slice(bang + 1), text);
  }
  return book;
}

/** What every cell of the block shows. */
export function cellViews(
  data: LessonMediaTypes.Sheet,
  book: Book,
): Map<string, CellView> {
  const views = new Map<string, CellView>();
  for (const part of data.sheets) {
    const editable = new Set(part.edit);
    for (let r = part.rows[0]; r <= part.rows[1]; r++)
      for (let c = part.cols[0]; c <= part.cols[1]; c++) {
        const addr = address(r, c);
        const value = book.value(part.name, addr);
        views.set(cellKey(part.name, addr), {
          shown: formatted(value, part.formats[addr]),
          kind: kindOf(value),
          formula: inputOf(book, part.name, addr).startsWith("="),
          editable: editable.has(addr),
        });
      }
  }
  return views;
}

export function inputOf(book: Book, sheet: string, addr: string): string {
  return book.sheet(sheet).inputs.get(parseAddress(addr).join(",")) ?? "";
}

/** A piece of the formula bar; `color` (1…5) marks a reference. */
export type FormulaPart = { text: string; color?: number };

export type Frame = { color: number; edge: string };

export type Frames = {
  parts: FormulaPart[];
  /** Cells the formula reads, by cellKey: colour and outer edges (t, b, l, r). */
  cells: Map<string, Frame>;
  /** Colour of a sheet tab whose cells the formula reads. */
  tabs: Map<string, number>;
};

/**
 * The formula of the selected cell with its references coloured, and the frames
 * of the cells they read — on the formula's own sheet or on another one.
 */
export function framesOf(text: string, sheet: string): Frames {
  const parts: FormulaPart[] = [];
  const cells = new Map<string, Frame>();
  const tabs = new Map<string, number>();
  if (!text.startsWith("=")) return { parts: [{ text }], cells, tabs };
  let toks: ReturnType<typeof tokenize>;
  try {
    toks = tokenize(text);
  } catch {
    return { parts: [{ text }], cells, tabs };
  }
  const colors = new Map<string, number>();
  let pos = 0;
  for (const tok of toks) {
    if (tok.kind !== "ref") continue;
    let color = colors.get(tok.text);
    if (color === undefined) {
      color = (colors.size % REF_COLORS) + 1;
      colors.set(tok.text, color);
      const ref = parseRef(tok.text);
      const target = ref.sheet ?? sheet;
      tabs.set(target, color);
      for (let r = ref.r1; r <= ref.r2; r++)
        for (let c = ref.c1; c <= ref.c2; c++) {
          const edge =
            (r === ref.r1 ? "t" : "") +
            (r === ref.r2 ? "b" : "") +
            (c === ref.c1 ? "l" : "") +
            (c === ref.c2 ? "r" : "");
          cells.set(cellKey(target, address(r, c)), { color, edge });
        }
    }
    if (tok.start > pos) parts.push({ text: text.slice(pos, tok.start) });
    parts.push({ text: tok.text, color });
    pos = tok.start + tok.text.length;
  }
  if (pos < text.length) parts.push({ text: text.slice(pos) });
  return { parts, cells, tabs };
}

/** Visible rows of a sheet: the filter and hand-hidden rows are skipped. */
export function visibleRows(part: LessonMediaTypes.SheetPart): number[] {
  const out: number[] = [];
  for (let r = part.rows[0]; r <= part.rows[1]; r++)
    if (!part.filtered.includes(r) && !part.hidden.includes(r)) out.push(r);
  return out;
}

/** The cell selected first: the author's choice, else the first formula. */
export function firstSelection(
  data: LessonMediaTypes.Sheet,
): readonly [string, string] {
  if (data.select) return data.select;
  for (const part of data.sheets)
    for (const [addr, text] of Object.entries(part.inputs))
      if (text.startsWith("=")) return [part.name, addr];
  const part = data.sheets[0];
  return [part.name, address(part.rows[0], part.cols[0])];
}
