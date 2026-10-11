/**
 * Evaluator of the Excel course's live sheet (Change 177): a port of the
 * stand's `scripts/lesson_design/sheet_eval.js`, whose reference is
 * `sheet_eval.py`. Every cell of `tests/fixtures/sheet-cases.json` must show
 * exactly what the reference shows. Russian locale: Russian function names,
 * «;» between arguments, a decimal comma. Only the functions of the course.
 */

export type Empty = { readonly empty: true };
export type ErrValue = { readonly err: string };
export type Value = number | string | boolean | Empty | ErrValue;

export const EMPTY: Empty = Object.freeze({ empty: true });
const err = (code: string): ErrValue => Object.freeze({ err: code });
const DIV0 = err("#ДЕЛ/0!");
const NA = err("#Н/Д");
const VALUE = err("#ЗНАЧ!");
const NAME = err("#ИМЯ?");
const REF = err("#ССЫЛКА!");
const NUM = err("#ЧИСЛО!");
const CYCLE = err("#ЦИКЛ!");

class SheetError extends Error {
  readonly value: ErrValue;
  constructor(value: ErrValue) {
    super(value.err);
    this.value = value;
  }
}
class FormulaError extends Error {}

export const isErr = (v: unknown): v is ErrValue =>
  v !== null && typeof v === "object" && "err" in v;
const isNum = (v: unknown): v is number => typeof v === "number";
const isEmpty = (v: unknown): v is Empty => v === EMPTY;
/** -1, 0 or 1 by the order of two numbers or two strings (code points, as Python). */
function order<T extends number | string>(a: T, b: T): number {
  if (a > b) return 1;
  return a < b ? -1 : 0;
}

// addresses ------------------------------------------------------------------

export function colNumber(letters: string): number {
  let n = 0;
  for (const ch of letters) n = n * 26 + ch.charCodeAt(0) - 64;
  return n;
}

export function colLetters(n: number): string {
  let s = "";
  let rest = n;
  while (rest) {
    const r = (rest - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    rest = Math.floor((rest - 1) / 26);
  }
  return s;
}

const CELL = /^(\$?)([A-Z]{1,3})(\$?)(\d+)$/;

/** «B3» → [row, column], both from 1. */
export function parseAddress(text: string): [number, number] {
  const m = CELL.exec(text.replace(/\$/g, ""));
  if (!m) throw new Error(`bad address ${text}`);
  return [Number(m[4]), colNumber(m[2])];
}

export const address = (row: number, col: number): string =>
  colLetters(col) + String(row);

// tokenizer ------------------------------------------------------------------

export type TokenKind = "str" | "ref" | "func" | "bool" | "num" | "op";
export type Token = { kind: TokenKind; text: string; start: number };

const LETTER = "A-Za-zА-Яа-яЁё_";
const WORD = "\\wА-Яа-яЁё.";
const TOKEN = new RegExp(
  "(\\s+)" +
    '|("(?:[^"]|"")*")' +
    `|((?:(?:'(?:[^']|'')+'|[${LETTER}][${WORD}]*)!)?\\$?[A-Z]{1,3}\\$?\\d+(?::\\$?[A-Z]{1,3}\\$?\\d+)?)(?![\\wА-Яа-яЁё(])` +
    `|([A-Za-zА-Яа-яЁё][${WORD}]*)(?=\\s*\\()` +
    "|(ИСТИНА|ЛОЖЬ)(?![\\wА-Яа-яЁё])" +
    "|(\\d+(?:,\\d+)?(?:[Ee][+-]?\\d+)?)" +
    "|(<>|<=|>=|[-+*/^&=<>%();])" +
    "|(.)",
  "gy",
);
const KINDS = [
  null,
  "ws",
  "str",
  "ref",
  "func",
  "bool",
  "num",
  "op",
  "bad",
] as const;

/** Tokens of a formula; `start` counts from the formula's own «=». */
export function tokenize(formula: string): Token[] {
  const body = formula.startsWith("=") ? formula.slice(1) : formula;
  const offset = formula.length - body.length;
  const toks: Token[] = [];
  const re = new RegExp(TOKEN.source, TOKEN.flags);
  let m: RegExpExecArray | null;
  while (re.lastIndex < body.length && (m = re.exec(body))) {
    let kind: (typeof KINDS)[number] = null;
    for (let i = 1; i < KINDS.length; i++)
      if (m[i] !== undefined) {
        kind = KINDS[i];
        break;
      }
    if (kind === "ws" || kind === null) continue;
    if (kind === "bad") throw new FormulaError(`unexpected ${m[0]}`);
    toks.push({ kind, text: m[0], start: m.index + offset });
  }
  return toks;
}

export type Ref = {
  sheet: string | null;
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  isRange: boolean;
};

export function parseRef(source: string): Ref {
  let sheet: string | null = null;
  let text = source;
  const bang = text.lastIndexOf("!");
  if (bang >= 0) {
    sheet = text.slice(0, bang);
    text = text.slice(bang + 1);
    if (sheet.startsWith("'")) sheet = sheet.slice(1, -1).replace(/''/g, "'");
  }
  const parts = text.split(":");
  const ends = parts.map((p) => parseAddress(p));
  const a = ends[0];
  const b = ends[ends.length - 1];
  return {
    sheet,
    r1: Math.min(a[0], b[0]),
    c1: Math.min(a[1], b[1]),
    r2: Math.max(a[0], b[0]),
    c2: Math.max(a[1], b[1]),
    isRange: parts.length === 2,
  };
}

/** Every cell or range a formula reads, in order of appearance. */
export function references(formula: string): Ref[] {
  return tokenize(formula)
    .filter((t) => t.kind === "ref")
    .map((t) => parseRef(t.text));
}

// parser ---------------------------------------------------------------------

type Node =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "bool"; value: boolean }
  | { kind: "ref"; ref: Ref }
  | { kind: "missing" }
  | { kind: "unary"; op: string; args: [Node] }
  | { kind: "percent"; args: [Node] }
  | { kind: "binary"; op: string; args: [Node, Node] }
  | { kind: "func"; name: string; args: Node[] };

const PRECEDENCE = [
  ["=", "<>", "<", ">", "<=", ">="],
  ["&"],
  ["+", "-"],
  ["*", "/"],
  ["^"],
];

function parse(formula: string): Node {
  if (!formula.startsWith("=")) throw new FormulaError("no =");
  const toks = tokenize(formula);
  let i = 0;
  const peek = (): Token | undefined => toks[i];
  const take = (text?: string): Token => {
    const t = toks[i];
    if (!t || (text !== undefined && t.text !== text))
      throw new FormulaError(`expected ${text ?? "a value"}`);
    i++;
    return t;
  };
  function binary(level: number): Node {
    if (level === PRECEDENCE.length) return unary();
    let node = binary(level + 1);
    for (;;) {
      const t = peek();
      if (!(t && t.kind === "op" && PRECEDENCE[level].includes(t.text)))
        return node;
      i++;
      node = { kind: "binary", op: t.text, args: [node, binary(level + 1)] };
    }
  }
  function unary(): Node {
    // Excel: unary minus binds tighter than ^ (=-2^2 is 4)
    const t = peek();
    if (t && t.kind === "op" && (t.text === "+" || t.text === "-")) {
      i++;
      return { kind: "unary", op: t.text, args: [unary()] };
    }
    let node = primary();
    while (peek()?.text === "%") {
      i++;
      node = { kind: "percent", args: [node] };
    }
    return node;
  }
  function primary(): Node {
    const t = take();
    if (t.kind === "num")
      return { kind: "num", value: Number(t.text.replace(",", ".")) };
    if (t.kind === "str")
      return { kind: "str", value: t.text.slice(1, -1).replace(/""/g, '"') };
    if (t.kind === "bool") return { kind: "bool", value: t.text === "ИСТИНА" };
    if (t.kind === "ref") return { kind: "ref", ref: parseRef(t.text) };
    if (t.kind === "func") {
      const name = t.text.toUpperCase();
      take("(");
      const args: Node[] = [];
      if (peek()?.text === ")") {
        i++;
        return { kind: "func", name, args };
      }
      for (;;) {
        const n = peek();
        args.push(
          n && (n.text === ";" || n.text === ")")
            ? { kind: "missing" }
            : binary(0),
        );
        const sep = take();
        if (sep.text === ")") return { kind: "func", name, args };
        if (sep.text !== ";") throw new FormulaError("expected ;");
      }
    }
    if (t.text === "(") {
      const node = binary(0);
      take(")");
      return node;
    }
    throw new FormulaError(`unexpected ${t.text}`);
  }
  const node = binary(0);
  if (i < toks.length) throw new FormulaError(`unexpected ${toks[i].text}`);
  return node;
}

// conversions ----------------------------------------------------------------

const NUMBER_INPUT = /^[+-]?(\d+(,\d*)?|,\d+)([Ee][+-]?\d+)?$/;
const DATE_INPUT = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
const DAY = 86400000;
const EPOCH = Date.UTC(1899, 11, 30);

const dateSerial = (y: number, m: number, d: number): number =>
  Math.round((Date.UTC(y, m - 1, d) - EPOCH) / DAY);

function serialParts(serial: number): {
  year: number;
  month: number;
  day: number;
} {
  const d = new Date(EPOCH + Math.floor(serial) * DAY);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** A number typed as text: «12,5», «15%», «05.10.2026» (a date serial). */
export function parseNumberText(text: string): number | null {
  let s = text.trim().replace(/\u00a0|\u202f/g, "");
  const percent = s.endsWith("%");
  if (percent) s = s.slice(0, -1);
  if (NUMBER_INPUT.test(s)) {
    const v = Number(s.replace(",", "."));
    return percent ? v / 100 : v;
  }
  const m = DATE_INPUT.exec(s);
  if (m && !percent) {
    const y = Number(m[3]);
    const mo = Number(m[2]);
    const d = Number(m[1]);
    const dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return dateSerial(y, mo, d);
  }
  return null;
}

/** What Excel stores when `text` is typed into a cell (not a formula). */
export function typed(text: string): Value {
  if (text === "") return EMPTY;
  if (text.startsWith("'")) return text.slice(1);
  const up = text.toUpperCase();
  if (up === "ИСТИНА" || up === "ЛОЖЬ") return up === "ИСТИНА";
  const n = parseNumberText(text);
  return n === null ? text : n;
}

/** General format: up to 15 significant digits, a decimal comma. */
export function formatNumber(x: number): string {
  if (x === 0) return "0";
  if (Number.isInteger(x) && Math.abs(x) < 1e15) return String(x);
  const [mant, exp] = x.toExponential(14).split("e");
  const e = Number(exp);
  const strip = (t: string) =>
    t.includes(".") ? t.replace(/0+$/, "").replace(/\.$/, "") : t;
  if (e < -4 || e >= 15) {
    return `${strip(mant).replace(".", ",")}E${e < 0 ? "-" : "+"}${String(Math.abs(e)).padStart(2, "0")}`;
  }
  return strip(x.toFixed(14 - e)).replace(".", ",");
}

export function display(v: Value): string {
  if (isErr(v)) return v.err;
  if (isEmpty(v)) return "";
  if (typeof v === "boolean") return v ? "ИСТИНА" : "ЛОЖЬ";
  if (isNum(v)) return formatNumber(v);
  return v;
}

function toNumber(v: Value): number {
  if (isErr(v)) throw new SheetError(v);
  if (typeof v === "boolean") return v ? 1 : 0;
  if (isEmpty(v)) return 0;
  if (isNum(v)) return v;
  const n = parseNumberText(v);
  if (n === null) throw new SheetError(VALUE);
  return n;
}

function toText(v: Value): string {
  if (isErr(v)) throw new SheetError(v);
  return display(v);
}

function toBool(v: Value): boolean {
  if (isErr(v)) throw new SheetError(v);
  if (typeof v === "boolean") return v;
  if (isEmpty(v)) return false;
  if (isNum(v)) return v !== 0;
  const up = v.toUpperCase();
  if (up === "ИСТИНА" || up === "TRUE") return true;
  if (up === "ЛОЖЬ" || up === "FALSE") return false;
  throw new SheetError(VALUE);
}

function rank(v: Value): number {
  if (typeof v === "boolean") return 2;
  return typeof v === "string" ? 1 : 0;
}

/** An empty cell compared with a value acts as that type's zero. */
function zeroLike(other: Value): string | boolean | number {
  if (typeof other === "string") return "";
  return typeof other === "boolean" ? false : 0;
}

function compare(left: Value, right: Value): number {
  if (isErr(left)) throw new SheetError(left);
  if (isErr(right)) throw new SheetError(right);
  const a = isEmpty(left) ? zeroLike(right) : left;
  const b = isEmpty(right) ? zeroLike(a) : right;
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra < rb ? -1 : 1;
  if (typeof a === "string" && typeof b === "string")
    return order(a.toLowerCase(), b.toLowerCase());
  return order(Number(a), Number(b));
}

// exact decimal rounding as Python's Decimal(repr(x)).quantize ------------------

type RoundMode = "half-up" | "ceil" | "floor" | "down";

function shortest(x: number): string {
  // Python repr: shortest round-trip, without an exponent
  let s = String(x);
  if (s.includes("e")) {
    const [m, e] = s.split("e");
    const exp = Number(e);
    const [i, f = ""] = m.replace("-", "").split(".");
    const digits = i + f;
    const point = i.length + exp;
    if (point <= 0) s = `0.${"0".repeat(-point)}${digits}`;
    else if (point >= digits.length)
      s = digits + "0".repeat(point - digits.length);
    else s = `${digits.slice(0, point)}.${digits.slice(point)}`;
    if (m.startsWith("-")) s = `-${s}`;
  }
  return s;
}

function roundDecimal(x: number, digits: number, mode: RoundMode): number {
  const repr = shortest(x);
  let neg = repr.startsWith("-");
  const [int, frac = ""] = (neg ? repr.slice(1) : repr).split(".");
  let all = int + frac;
  let point = int.length;
  const keep = point + digits;
  if (keep < 0) {
    all = "0".repeat(-keep) + all;
    point += -keep;
  }
  const k = point + digits;
  const head = all.slice(0, Math.max(k, 0)) || "0";
  const tail = all.slice(Math.max(k, 0));
  const tailNonZero = /[1-9]/.test(tail);
  let up: boolean;
  if (mode === "half-up") up = tail.length > 0 && tail[0] >= "5";
  else if (mode === "down") up = false;
  else if (mode === "ceil") up = !neg && tailNonZero;
  else up = neg && tailNonZero;
  let n = BigInt(head);
  if (up) n += 1n;
  let s = n.toString();
  const scale = digits >= 0 ? digits : 0;
  if (digits < 0) s += "0".repeat(-digits);
  let value: number;
  if (scale > 0) {
    s = s.padStart(scale + 1, "0");
    value = Number(`${s.slice(0, -scale)}.${s.slice(-scale)}`);
  } else value = Number(s);
  if (value === 0) neg = false;
  return neg ? -value : value;
}

// criteria -------------------------------------------------------------------

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");

function wildcard(pattern: string): RegExp {
  let out = "";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (
      ch === "~" &&
      i + 1 < pattern.length &&
      "*?~".includes(pattern[i + 1])
    ) {
      i++;
      out += escapeRe(pattern[i]);
      continue;
    }
    if (ch === "*") out += "[\\s\\S]*";
    else if (ch === "?") out += "[\\s\\S]";
    else out += escapeRe(ch);
  }
  return new RegExp(`^${out}$`, "i");
}

type Test = (v: Value) => boolean;
type Op = "=" | "<>" | "<" | ">" | "<=" | ">=";

function compareBy(op: Op, c: number): boolean {
  switch (op) {
    case "=":
      return c === 0;
    case "<>":
      return c !== 0;
    case "<":
      return c < 0;
    case ">":
      return c > 0;
    case "<=":
      return c <= 0;
    case ">=":
      return c >= 0;
  }
}

/** A predicate for criteria of the СЧЁТЕСЛИ family. */
function criterion(value: Value): Test {
  if (isErr(value)) throw new SheetError(value);
  const crit = isEmpty(value) ? 0 : value;
  if (typeof crit === "boolean")
    return (v) => typeof v === "boolean" && v === crit;
  if (isNum(crit))
    return (v) =>
      (isNum(v) && v === crit) ||
      (typeof v === "string" && parseNumberText(v) === crit);
  const text = crit;
  const m = /^(<=|>=|<>|<|>|=)?([\s\S]*)$/.exec(text);
  const op = ((m?.[1] ?? "") || "=") as Op;
  const rest = m?.[2] ?? "";
  const number = rest !== "" ? parseNumberText(rest) : null;
  const up = rest.toUpperCase();
  if (up === "ИСТИНА" || up === "ЛОЖЬ") {
    const flag = up === "ИСТИНА";
    if (op === "=") return (v) => typeof v === "boolean" && v === flag;
    if (op === "<>") return (v) => !(typeof v === "boolean" && v === flag);
  }
  if (number !== null)
    return (v) => (isNum(v) ? compareBy(op, order(v, number)) : op === "<>");
  if (rest === "") {
    if (op === "=") return (v) => v === EMPTY || v === "";
    if (op === "<>") return (v) => !(v === EMPTY || v === "");
  }
  if (op === "=" || op === "<>") {
    const rx = wildcard(rest);
    return (v) => {
      const hit = typeof v === "string" && rx.test(v);
      return op === "=" ? hit : !hit;
    };
  }
  return (v) =>
    typeof v === "string" &&
    compareBy(op, order(v.toLowerCase(), rest.toLowerCase()));
}

// ranges and the book -----------------------------------------------------------

export type Sheet = {
  name: string;
  /** Typed text by «row,col». */
  inputs: Map<string, string>;
  /** Rows hidden by a filter and by hand (ПРОМЕЖУТОЧНЫЕ.ИТОГИ 9 and 109). */
  filtered: Set<number>;
  hidden: Set<number>;
};

class Range {
  constructor(
    readonly rows: Value[][],
    readonly ref: Ref,
    readonly sheet: Sheet,
  ) {}
  flat(): Value[] {
    return this.rows.flat();
  }
  get shape(): [number, number] {
    return [this.rows.length, this.rows.length ? this.rows[0].length : 0];
  }
}

type Result = Value | Range;
const isRange = (v: unknown): v is Range => v instanceof Range;

type Impl = (book: Book, sheet: Sheet, args: Result[]) => Value;
type LazyImpl = (book: Book, sheet: Sheet, nodes: Node[]) => Result;

export class Book {
  readonly sheets = new Map<string, Sheet>();
  private readonly cache = new Map<string, Value>();
  private readonly stack = new Set<string>();
  /** Rows of the cells being computed, for СТРОКА(). */
  readonly here: number[] = [];

  sheet(name: string): Sheet {
    let found = this.sheets.get(name);
    if (!found) {
      found = {
        name,
        inputs: new Map(),
        filtered: new Set(),
        hidden: new Set(),
      };
      this.sheets.set(name, found);
    }
    return found;
  }

  set(sheet: string, addr: string, text: string): void {
    this.sheet(sheet).inputs.set(parseAddress(addr).join(","), text);
    this.cache.clear();
  }

  value(sheet: string, addr: string): Value {
    const [r, c] = parseAddress(addr);
    try {
      return this.cell(this.sheet(sheet), r, c);
    } catch (e) {
      if (e instanceof SheetError) return e.value;
      throw e;
    }
  }

  cell(sheet: Sheet, r: number, c: number): Value {
    const key = `${sheet.name}!${String(r)},${String(c)}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;
    const text = sheet.inputs.get(`${String(r)},${String(c)}`) ?? "";
    if (!text.startsWith("=")) return typed(text);
    if (this.stack.has(key)) throw new SheetError(CYCLE);
    this.stack.add(key);
    this.here.push(r);
    let value: Value;
    try {
      value = this.formula(text, sheet);
    } finally {
      this.stack.delete(key);
      this.here.pop();
    }
    this.cache.set(key, value);
    return value;
  }

  /** Evaluate a formula as if it stood on `sheet`. */
  formula(text: string, sheet: Sheet): Value {
    let node: Node;
    try {
      node = parse(text);
    } catch (e) {
      if (e instanceof FormulaError) return NAME;
      throw e;
    }
    let result: Result;
    try {
      result = this.eval(node, sheet);
    } catch (e) {
      if (e instanceof SheetError) {
        if (e.value === CYCLE) throw e;
        return e.value;
      }
      throw e;
    }
    if (isRange(result)) {
      const [h, w] = result.shape;
      if (h === 1 && w === 1)
        return result.rows[0][0] === EMPTY ? 0 : result.rows[0][0];
      return VALUE;
    }
    return result === EMPTY ? 0 : result;
  }

  private target(ref: Ref, sheet: Sheet): Sheet {
    if (ref.sheet === null) return sheet;
    const found = this.sheets.get(ref.sheet);
    if (!found) throw new SheetError(REF);
    return found;
  }

  range(ref: Ref, sheet: Sheet): Range {
    const src = this.target(ref, sheet);
    const rows: Value[][] = [];
    for (let r = ref.r1; r <= ref.r2; r++) {
      const row: Value[] = [];
      for (let c = ref.c1; c <= ref.c2; c++) row.push(this.cell(src, r, c));
      rows.push(row);
    }
    return new Range(rows, ref, src);
  }

  eval(node: Node, sheet: Sheet): Result {
    switch (node.kind) {
      case "num":
      case "str":
      case "bool":
        return node.value;
      case "missing":
        return EMPTY;
      case "ref":
        return node.ref.isRange
          ? this.range(node.ref, sheet)
          : this.cell(this.target(node.ref, sheet), node.ref.r1, node.ref.c1);
      case "unary": {
        const v = toNumber(this.scalar(node.args[0], sheet));
        return node.op === "-" ? -v : v;
      }
      case "percent":
        return toNumber(this.scalar(node.args[0], sheet)) / 100;
      case "binary":
        return this.binary(node.op, node.args, sheet);
      case "func":
        return this.call(node.name, node.args, sheet);
    }
  }

  scalar(node: Node, sheet: Sheet): Value {
    return scalar(this.eval(node, sheet));
  }

  private binary(op: string, args: [Node, Node], sheet: Sheet): Value {
    const a = this.scalar(args[0], sheet);
    const b = this.scalar(args[1], sheet);
    if (op === "&") return toText(a) + toText(b);
    if (["=", "<>", "<", ">", "<=", ">="].includes(op))
      return compareBy(op as Op, compare(a, b));
    const x = toNumber(a);
    const y = toNumber(b);
    if (op === "+") return x + y;
    if (op === "-") return x - y;
    if (op === "*") return x * y;
    if (op === "/") {
      if (y === 0) throw new SheetError(DIV0);
      return x / y;
    }
    if (x === 0 && y < 0) throw new SheetError(DIV0);
    const r = Math.pow(x, y);
    if (!Number.isFinite(r)) throw new SheetError(NUM);
    return r;
  }

  private call(name: string, nodes: Node[], sheet: Sheet): Result {
    const lazy = LAZY[name];
    if (lazy) return lazy(this, sheet, nodes);
    const impl = FUNCTIONS[name];
    if (!impl) throw new SheetError(NAME);
    const args = nodes.map((a) =>
      a.kind === "ref" ? this.range(a.ref, sheet) : this.eval(a, sheet),
    );
    return impl(this, sheet, args);
  }
}

// helpers --------------------------------------------------------------------

function need(args: readonly unknown[], low: number, high = low): void {
  if (args.length < low || args.length > high) throw new SheetError(VALUE);
}

function scalar(v: Result): Value {
  if (isRange(v)) {
    const [h, w] = v.shape;
    if (h === 1 && w === 1) return v.rows[0][0];
    throw new SheetError(VALUE);
  }
  return v;
}

/** Exactly rounded sum, as Python's math.fsum (Shewchuk). */
function fsum(xs: readonly number[]): number {
  const partials: number[] = [];
  for (let x of xs) {
    let i = 0;
    for (let y of partials) {
      if (Math.abs(x) < Math.abs(y)) [x, y] = [y, x];
      const hi = x + y;
      const lo = y - (hi - x);
      if (lo) partials[i++] = lo;
      x = hi;
    }
    partials.length = i;
    partials.push(x);
  }
  let n = partials.length;
  let hi = 0;
  if (n > 0) {
    hi = partials[--n];
    let lo = 0;
    while (n > 0) {
      const x = hi;
      const y = partials[--n];
      hi = x + y;
      const yr = hi - x;
      lo = y - yr;
      if (lo) break;
    }
    if (
      n > 0 &&
      ((lo < 0 && partials[n - 1] < 0) || (lo > 0 && partials[n - 1] > 0))
    ) {
      const y = lo * 2;
      const x = hi + y;
      const yr = x - hi;
      if (y === yr) hi = x;
    }
  }
  return hi;
}

function numbers(args: readonly Result[]): number[] {
  const out: number[] = [];
  for (const a of args) {
    if (isRange(a)) {
      for (const v of a.flat()) {
        if (isErr(v)) throw new SheetError(v);
        if (isNum(v)) out.push(v);
      }
    } else if (a === EMPTY) continue;
    else if (isErr(a)) throw new SheetError(a);
    else out.push(toNumber(a));
  }
  return out;
}

function asRange(a: Result): Range {
  if (!isRange(a)) throw new SheetError(VALUE);
  return a;
}

function numArgs(args: readonly Result[], low: number, high = low): number[] {
  need(args, low, high);
  return args.map((a) => toNumber(scalar(a)));
}

const fSum: Impl = (_b, _s, args) => fsum(numbers(args));
const fSumsq: Impl = (_b, _s, args) => fsum(numbers(args).map((x) => x * x));

const fCount: Impl = (_b, _s, args) => {
  let n = 0;
  for (const a of args) {
    if (isRange(a)) n += a.flat().filter(isNum).length;
    else if (typeof a === "boolean" || isNum(a)) n++;
    else if (typeof a === "string" && parseNumberText(a) !== null) n++;
  }
  return n;
};

const fCounta: Impl = (_b, _s, args) => {
  let n = 0;
  for (const a of args) {
    if (isRange(a)) n += a.flat().filter((v) => v !== EMPTY).length;
    else if (a !== EMPTY) n++;
  }
  return n;
};

const fCountblank: Impl = (_b, _s, args) => {
  need(args, 1);
  return asRange(args[0])
    .flat()
    .filter((v) => v === EMPTY || v === "").length;
};

const fAverage: Impl = (_b, _s, args) => {
  const xs = numbers(args);
  if (!xs.length) throw new SheetError(DIV0);
  return fsum(xs) / xs.length;
};

const fMin: Impl = (_b, _s, args) => {
  const xs = numbers(args);
  return xs.length ? Math.min(...xs) : 0;
};

const fMax: Impl = (_b, _s, args) => {
  const xs = numbers(args);
  return xs.length ? Math.max(...xs) : 0;
};

function kth(args: readonly Result[], reverse: boolean): number {
  need(args, 2);
  const xs = numbers([args[0]]).sort((a, b) => (reverse ? b - a : a - b));
  const k = Math.ceil(toNumber(scalar(args[1])));
  if (!xs.length || k < 1 || k > xs.length) throw new SheetError(NUM);
  return xs[k - 1];
}

function logicals(args: readonly Result[]): boolean[] {
  const out: boolean[] = [];
  for (const a of args) {
    if (isRange(a)) {
      for (const v of a.flat()) {
        if (isErr(v)) throw new SheetError(v);
        if (typeof v === "boolean") out.push(v);
        else if (isNum(v)) out.push(v !== 0);
      }
    } else if (a === EMPTY) continue;
    else out.push(toBool(a));
  }
  if (!out.length) throw new SheetError(VALUE);
  return out;
}

const fIf: LazyImpl = (book, sheet, nodes) => {
  need(nodes, 1, 3);
  if (toBool(book.scalar(nodes[0], sheet))) {
    if (nodes.length < 2) return true;
    if (nodes[1].kind === "missing") return 0;
    return book.eval(nodes[1], sheet);
  }
  if (nodes.length < 3) return false;
  if (nodes[2].kind === "missing") return 0;
  return book.eval(nodes[2], sheet);
};

const fIferror: LazyImpl = (book, sheet, nodes) => {
  need(nodes, 2);
  let v: Result;
  try {
    v = book.eval(nodes[0], sheet);
  } catch (e) {
    if (e instanceof SheetError && e.value !== CYCLE)
      return book.eval(nodes[1], sheet);
    throw e;
  }
  return isErr(v) ? book.eval(nodes[1], sheet) : v;
};

const fRow: LazyImpl = (book, _sheet, nodes) => {
  // СТРОКА(): the row of the cell itself; СТРОКА(B7): the row of a reference
  need(nodes, 0, 1);
  if (nodes.length) {
    const node = nodes[0];
    if (node.kind !== "ref") throw new SheetError(VALUE);
    return node.ref.r1;
  }
  if (!book.here.length) throw new SheetError(VALUE);
  return book.here[book.here.length - 1];
};

const fCountif: Impl = (_b, _s, args) => {
  need(args, 2);
  const test = criterion(scalar(args[1]));
  return asRange(args[0])
    .flat()
    .filter((v) => !isErr(v) && test(v)).length;
};

function ifsMask(args: readonly Result[]): {
  mask: boolean[];
  shape: [number, number];
} {
  if (args.length % 2 || !args.length) throw new SheetError(VALUE);
  let shape: [number, number] | null = null;
  let mask: boolean[] = [];
  for (let i = 0; i < args.length; i += 2) {
    const rng = asRange(args[i]);
    if (shape === null) {
      shape = rng.shape;
      mask = rng.flat().map(() => true);
    } else if (rng.shape[0] !== shape[0] || rng.shape[1] !== shape[1])
      throw new SheetError(VALUE);
    const test = criterion(scalar(args[i + 1]));
    rng.flat().forEach((v, j) => {
      if (mask[j] && (isErr(v) || !test(v))) mask[j] = false;
    });
  }
  return { mask, shape: shape ?? [0, 0] };
}

const fCountifs: Impl = (_b, _s, args) =>
  ifsMask(args).mask.filter(Boolean).length;

/** The sum range of СУММЕСЛИ takes the shape of the checked range. */
function resized(book: Book, base: Range, rng: Range): Value[] {
  const [h, w] = base.shape;
  const values: Value[] = [];
  for (let r = rng.ref.r1; r < rng.ref.r1 + h; r++)
    for (let c = rng.ref.c1; c < rng.ref.c1 + w; c++)
      values.push(book.cell(rng.sheet, r, c));
  return values;
}

function summable(
  values: readonly Value[],
  mask: readonly boolean[],
): number[] {
  const out: number[] = [];
  values.forEach((v, i) => {
    if (!mask[i]) return;
    if (isErr(v)) throw new SheetError(v);
    if (isNum(v)) out.push(v);
  });
  return out;
}

function condValues(book: Book, args: readonly Result[]): number[] {
  need(args, 2, 3);
  const rng = asRange(args[0]);
  const test = criterion(scalar(args[1]));
  const mask = rng.flat().map((v) => !isErr(v) && test(v));
  const values =
    args.length === 2 ? rng.flat() : resized(book, rng, asRange(args[2]));
  return summable(values, mask);
}

const fSumif: Impl = (book, _s, args) => fsum(condValues(book, args));

const fAverageif: Impl = (book, _s, args) => {
  const xs = condValues(book, args);
  if (!xs.length) throw new SheetError(DIV0);
  return fsum(xs) / xs.length;
};

function ifsValues(args: readonly Result[]): number[] {
  if (args.length < 3) throw new SheetError(VALUE);
  const total = asRange(args[0]);
  const { mask, shape } = ifsMask(args.slice(1));
  if (total.shape[0] !== shape[0] || total.shape[1] !== shape[1])
    throw new SheetError(VALUE);
  return summable(total.flat(), mask);
}

const fSumifs: Impl = (_b, _s, args) => fsum(ifsValues(args));

const fAverageifs: Impl = (_b, _s, args) => {
  const xs = ifsValues(args);
  if (!xs.length) throw new SheetError(DIV0);
  return fsum(xs) / xs.length;
};

const fMod: Impl = (_b, _s, args) => {
  const [n, d] = numArgs(args, 2);
  if (d === 0) throw new SheetError(DIV0);
  return n - d * Math.floor(n / d);
};

const fRound =
  (positive: RoundMode, negative: RoundMode): Impl =>
  (_b, _s, args) => {
    const [x, digits] = numArgs(args, 2);
    return roundDecimal(x, Math.trunc(digits), x >= 0 ? positive : negative);
  };

const fTrunc: Impl = (_b, _s, args) => {
  const xs = numArgs(args, 1, 2);
  return roundDecimal(xs[0], xs.length > 1 ? Math.trunc(xs[1]) : 0, "down");
};

const fInt: Impl = (_b, _s, args) => Math.floor(numArgs(args, 1)[0]);
const fAbs: Impl = (_b, _s, args) => Math.abs(numArgs(args, 1)[0]);

function lookupEqual(a: Value, b: Value): boolean {
  if (isErr(a) || isErr(b) || a === EMPTY || b === EMPTY) return false;
  if (rank(a) !== rank(b)) return false;
  if (typeof a === "string")
    return typeof b === "string" && wildcard(a).test(b);
  return a === b;
}

function approximate(
  key: Value,
  values: readonly Value[],
  descending = false,
): number {
  let found = -1;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v === EMPTY || isErr(v) || rank(v) !== rank(key)) continue;
    const c = compare(v, key);
    if (descending ? c >= 0 : c <= 0) found = i;
    else break;
  }
  return found;
}

const fVlookup: Impl = (_b, _s, args) => {
  need(args, 3, 4);
  const key = scalar(args[0]);
  if (isErr(key)) throw new SheetError(key);
  const table = asRange(args[1]);
  const col = Math.trunc(toNumber(scalar(args[2])));
  let exact = false;
  if (args.length === 4)
    exact = args[3] === EMPTY ? true : !toBool(scalar(args[3]));
  if (col < 1) throw new SheetError(VALUE);
  if (col > table.shape[1]) throw new SheetError(REF);
  const first = table.rows.map((r) => r[0]);
  if (exact) {
    for (let i = 0; i < first.length; i++)
      if (lookupEqual(key, first[i])) return table.rows[i][col - 1];
    throw new SheetError(NA);
  }
  const i = approximate(key, first);
  if (i < 0) throw new SheetError(NA);
  return table.rows[i][col - 1];
};

const fMatch: Impl = (_b, _s, args) => {
  need(args, 2, 3);
  const key = scalar(args[0]);
  if (isErr(key)) throw new SheetError(key);
  const rng = asRange(args[1]);
  if (!rng.shape.includes(1)) throw new SheetError(NA);
  const kind = args.length === 3 ? Math.trunc(toNumber(scalar(args[2]))) : 1;
  const values = rng.flat();
  if (kind === 0) {
    for (let i = 0; i < values.length; i++)
      if (lookupEqual(key, values[i])) return i + 1;
    throw new SheetError(NA);
  }
  const i = approximate(key, values, kind < 0);
  if (i < 0) throw new SheetError(NA);
  return i + 1;
};

const fIndex: Impl = (_b, _s, args) => {
  need(args, 2, 3);
  const rng = asRange(args[0]);
  const [rows, cols] = rng.shape;
  const a = Math.trunc(toNumber(scalar(args[1])));
  const b =
    args.length === 3 && args[2] !== EMPTY
      ? Math.trunc(toNumber(scalar(args[2])))
      : null;
  let r: number;
  let c: number;
  if (b === null) {
    if (rows === 1) [r, c] = [1, a];
    else if (cols === 1) [r, c] = [a, 1];
    else throw new SheetError(REF);
  } else [r, c] = [a, b];
  if (r < 1 || c < 1 || r > rows || c > cols) throw new SheetError(REF);
  return rng.rows[r - 1][c - 1];
};

const SUBTOTAL_OPS: Record<number, Impl> = {
  1: fAverage,
  2: fCount,
  3: fCounta,
  4: fMax,
  5: fMin,
  9: fSum,
};

const fSubtotal: Impl = (book, sheet, args) => {
  if (args.length < 2) throw new SheetError(VALUE);
  const code = Math.trunc(toNumber(scalar(args[0])));
  const base = code > 100 ? code - 100 : code;
  const op = SUBTOTAL_OPS[base] as Impl | undefined;
  if (!op) throw new SheetError(VALUE);
  const visible = args.slice(1).map((a) => {
    const rng = asRange(a);
    const rows: Value[][] = [];
    rng.rows.forEach((row, off) => {
      const r = rng.ref.r1 + off;
      if (rng.sheet.filtered.has(r) || (code > 100 && rng.sheet.hidden.has(r)))
        return;
      rows.push(
        row.map((v, k) => {
          const text =
            rng.sheet.inputs.get(`${String(r)},${String(rng.ref.c1 + k)}`) ??
            "";
          // other subtotals inside the range are not counted twice
          return text.startsWith("=") &&
            text.toUpperCase().includes("ПРОМЕЖУТОЧНЫЕ.ИТОГИ")
            ? EMPTY
            : v;
        }),
      );
    });
    return new Range(rows.length ? rows : [[]], rng.ref, rng.sheet);
  });
  return op(book, sheet, visible);
};

const textArg = (a: Result): string => toText(scalar(a));
const chars = (s: string): string[] => Array.from(s);

const fLen: Impl = (_b, _s, args) => {
  need(args, 1);
  return chars(textArg(args[0])).length;
};

const fLeft: Impl = (_b, _s, args) => {
  need(args, 1, 2);
  const n = args.length === 2 ? Math.trunc(toNumber(scalar(args[1]))) : 1;
  if (n < 0) throw new SheetError(VALUE);
  return chars(textArg(args[0])).slice(0, n).join("");
};

const fRight: Impl = (_b, _s, args) => {
  need(args, 1, 2);
  const n = args.length === 2 ? Math.trunc(toNumber(scalar(args[1]))) : 1;
  if (n < 0) throw new SheetError(VALUE);
  const t = chars(textArg(args[0]));
  return n ? t.slice(Math.max(t.length - n, 0)).join("") : "";
};

const fMid: Impl = (_b, _s, args) => {
  need(args, 3);
  const t = chars(textArg(args[0]));
  const start = Math.trunc(toNumber(scalar(args[1])));
  const n = Math.trunc(toNumber(scalar(args[2])));
  if (start < 1 || n < 0) throw new SheetError(VALUE);
  return t.slice(start - 1, start - 1 + n).join("");
};

const fTrim: Impl = (_b, _s, args) => {
  need(args, 1);
  return textArg(args[0])
    .replace(/^ +| +$/g, "")
    .replace(/ +/g, " ");
};

const fSubstitute: Impl = (_b, _s, args) => {
  need(args, 3, 4);
  const text = textArg(args[0]);
  const old = textArg(args[1]);
  const replacement = textArg(args[2]);
  if (old === "") return text;
  if (args.length === 3) return text.split(old).join(replacement);
  const k = Math.trunc(toNumber(scalar(args[3])));
  if (k < 1) throw new SheetError(VALUE);
  let pos = -1;
  for (let i = 0; i < k; i++) {
    pos = text.indexOf(old, pos + 1);
    if (pos < 0) return text;
  }
  return text.slice(0, pos) + replacement + text.slice(pos + old.length);
};

const fExact: Impl = (_b, _s, args) => {
  need(args, 2);
  return textArg(args[0]) === textArg(args[1]);
};

const fValue: Impl = (_b, _s, args) => {
  need(args, 1);
  const v = scalar(args[0]);
  if (isNum(v)) return v;
  if (isErr(v)) throw new SheetError(v);
  if (isEmpty(v)) return 0;
  if (typeof v === "boolean") throw new SheetError(VALUE);
  const n = parseNumberText(v);
  if (n === null) throw new SheetError(VALUE);
  return n;
};

const fIsnumber: Impl = (_b, _s, args) => {
  need(args, 1);
  return isNum(scalar(args[0]));
};

const fIstext: Impl = (_b, _s, args) => {
  need(args, 1);
  return typeof scalar(args[0]) === "string";
};

const fAnd: Impl = (_b, _s, args) => logicals(args).every(Boolean);
const fOr: Impl = (_b, _s, args) => logicals(args).some(Boolean);
const fNot: Impl = (_b, _s, args) => {
  need(args, 1);
  return !toBool(scalar(args[0]));
};

const fDate: Impl = (_b, _s, args) => {
  const [year, month, d] = numArgs(args, 3).map(Math.trunc);
  let y = year;
  let m = month;
  if (y >= 0 && y < 1900) y += 1900;
  y += Math.floor((m - 1) / 12);
  m = ((((m - 1) % 12) + 12) % 12) + 1;
  const serial = dateSerial(y, m, 1) + d - 1;
  if (serial < 1 || y > 9999) throw new SheetError(NUM);
  return serial;
};

const datePart =
  (part: "day" | "month" | "year"): Impl =>
  (_b, _s, args) => {
    const [x] = numArgs(args, 1);
    if (x < 0) throw new SheetError(NUM);
    return serialParts(x)[part];
  };

const FUNCTIONS: Partial<Record<string, Impl>> = {
  СУММ: fSum,
  СЧЁТ: fCount,
  СЧЁТЗ: fCounta,
  СЧИТАТЬПУСТОТЫ: fCountblank,
  СРЗНАЧ: fAverage,
  МИН: fMin,
  МАКС: fMax,
  НАИМЕНЬШИЙ: (_b, _s, a) => kth(a, false),
  НАИБОЛЬШИЙ: (_b, _s, a) => kth(a, true),
  И: fAnd,
  ИЛИ: fOr,
  НЕ: fNot,
  СЧЁТЕСЛИ: fCountif,
  СЧЁТЕСЛИМН: fCountifs,
  СУММЕСЛИ: fSumif,
  СУММЕСЛИМН: fSumifs,
  СРЗНАЧЕСЛИ: fAverageif,
  СРЗНАЧЕСЛИМН: fAverageifs,
  ОСТАТ: fMod,
  ABS: fAbs,
  ЦЕЛОЕ: fInt,
  ОТБР: fTrunc,
  ОКРУГЛ: fRound("half-up", "half-up"),
  ОКРУГЛВВЕРХ: fRound("ceil", "floor"),
  ОКРУГЛВНИЗ: fRound("floor", "ceil"),
  ВПР: fVlookup,
  ИНДЕКС: fIndex,
  ПОИСКПОЗ: fMatch,
  "ПРОМЕЖУТОЧНЫЕ.ИТОГИ": fSubtotal,
  ДЛСТР: fLen,
  ЛЕВСИМВ: fLeft,
  ПРАВСИМВ: fRight,
  ПСТР: fMid,
  СЖПРОБЕЛЫ: fTrim,
  ПОДСТАВИТЬ: fSubstitute,
  СОВПАД: fExact,
  ЗНАЧЕН: fValue,
  ЕЧИСЛО: fIsnumber,
  ЕТЕКСТ: fIstext,
  ДАТА: fDate,
  ДЕНЬ: datePart("day"),
  МЕСЯЦ: datePart("month"),
  ГОД: datePart("year"),
  СУММКВ: fSumsq,
};

/** Functions that decide themselves which arguments to evaluate. */
const LAZY: Partial<Record<string, LazyImpl>> = {
  ЕСЛИ: fIf,
  ЕСЛИОШИБКА: fIferror,
  СТРОКА: fRow,
};

// formats (sheetblock.formatted) ------------------------------------------------

/** Python f"{x:.Nf}": the exact binary value rounded half to even. */
function fixedHalfEven(x: number, digits: number): string {
  const s = x.toFixed(Math.min(digits + 20, 100));
  const neg = s.startsWith("-");
  const [int, frac = ""] = (neg ? s.slice(1) : s).split(".");
  const keep = frac.slice(0, digits);
  const rest = frac.slice(digits);
  let n = BigInt(int + keep);
  const half = rest.length ? rest[0] : "0";
  const beyond = /[1-9]/.test(rest.slice(1));
  if (half > "5" || (half === "5" && (beyond || n % 2n === 1n))) n += 1n;
  let out = n.toString().padStart(digits + 1, "0");
  if (digits > 0) out = `${out.slice(0, -digits)}.${out.slice(-digits)}`;
  return (neg ? "-" : "") + out;
}

/** What a cell shows in its number format: «%», «0,00», «0,0%», «дата». */
export function formatted(value: Value, kind?: string): string {
  if (!kind || !isNum(value)) return display(value);
  if (kind === "дата") {
    const p = serialParts(value);
    return `${String(p.day).padStart(2, "0")}.${String(p.month).padStart(2, "0")}.${String(p.year)}`;
  }
  let digits: number;
  let percent: boolean;
  if (kind === "%") {
    digits = 0;
    percent = true;
  } else {
    const m = /^0(?:,(0+))?(%?)$/.exec(kind);
    if (!m) return display(value);
    digits = (m[1] ?? "").length;
    percent = m[2] === "%";
  }
  const x = percent ? value * 100 : value;
  let text = fixedHalfEven(x, digits).replace(".", ",");
  if (text.startsWith("-") && Number(text.replace(",", ".")) === 0)
    text = text.slice(1);
  return text + (percent ? "%" : "");
}

/** Kind of a value for styling: numbers right, text left, errors red. */
export function kindOf(v: Value): "num" | "bool" | "txt" | "err" | "empty" {
  if (isErr(v)) return "err";
  if (typeof v === "boolean") return "bool";
  if (isNum(v)) return "num";
  if (v === EMPTY) return "empty";
  return "txt";
}
