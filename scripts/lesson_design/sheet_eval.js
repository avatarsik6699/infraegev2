// Browser evaluator of the Excel course's live sheet: a port of sheet_eval.py.
// sheet_eval.py is the reference; this file must reproduce its display of every
// cell of sheet_cases.json (node scripts/lesson_design/sheet_conformance.mjs).
// Russian locale: Russian names, ";" between arguments, decimal comma.

export const EMPTY = { empty: true };
export function Err(code) {
  return { err: code };
}
const DIV0 = Err("#ДЕЛ/0!"),
  NA = Err("#Н/Д"),
  VALUE = Err("#ЗНАЧ!"),
  NAME = Err("#ИМЯ?"),
  REF = Err("#ССЫЛКА!"),
  NUM = Err("#ЧИСЛО!"),
  CYCLE = Err("#ЦИКЛ!");

class SheetError extends Error {
  constructor(err) {
    super(err.err);
    this.e = err;
  }
}
class FormulaError extends Error {}

const isErr = (v) => v !== null && typeof v === "object" && "err" in v;
const isNum = (v) => typeof v === "number";

// addresses ------------------------------------------------------------------
export function colNumber(letters) {
  let n = 0;
  for (const ch of letters) n = n * 26 + ch.charCodeAt(0) - 64;
  return n;
}
export function colLetters(n) {
  let s = "";
  while (n) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
const CELL = /^(\$?)([A-Z]{1,3})(\$?)(\d+)$/;
export function parseAddress(text) {
  const m = CELL.exec(text.replace(/\$/g, ""));
  if (!m) throw new Error("bad address " + text);
  return [Number(m[4]), colNumber(m[2])];
}
export function address(r, c) {
  return colLetters(c) + r;
}

// tokenizer ------------------------------------------------------------------
const L = "A-Za-zА-Яа-яЁё_";
const W = "\\wА-Яа-яЁё.";
const TOKEN = new RegExp(
  "(\\s+)" +
    '|("(?:[^"]|"")*")' +
    "|((?:(?:'(?:[^']|'')+'|[" +
    L +
    "][" +
    W +
    "]*)!)?\\$?[A-Z]{1,3}\\$?\\d+(?::\\$?[A-Z]{1,3}\\$?\\d+)?)(?![\\wА-Яа-яЁё(])" +
    "|([A-Za-zА-Яа-яЁё][" +
    W +
    "]*)(?=\\s*\\()" +
    "|(ИСТИНА|ЛОЖЬ)(?![\\wА-Яа-яЁё])" +
    "|(\\d+(?:,\\d+)?(?:[Ee][+-]?\\d+)?)" +
    "|(<>|<=|>=|[-+*/^&=<>%();])" +
    "|(.)",
  "gy",
);
const KINDS = [null, "ws", "str", "ref", "func", "bool", "num", "op", "bad"];

export function tokenize(formula) {
  const body = formula.startsWith("=") ? formula.slice(1) : formula;
  const offset = formula.length - body.length;
  const toks = [];
  TOKEN.lastIndex = 0;
  let m;
  while (TOKEN.lastIndex < body.length && (m = TOKEN.exec(body))) {
    let kind = null;
    for (let i = 1; i < KINDS.length; i++)
      if (m[i] !== undefined) {
        kind = KINDS[i];
        break;
      }
    if (kind === "ws") continue;
    if (kind === "bad") throw new FormulaError("unexpected " + m[0]);
    toks.push({ kind, text: m[0], start: m.index + offset });
  }
  return toks;
}

export function parseRef(text) {
  let sheet = null;
  const bang = text.lastIndexOf("!");
  if (bang >= 0) {
    sheet = text.slice(0, bang);
    text = text.slice(bang + 1);
    if (sheet.startsWith("'")) sheet = sheet.slice(1, -1).replace(/''/g, "'");
  }
  const parts = text.split(":");
  const ends = parts.map((p) => {
    const m = CELL.exec(p);
    return [Number(m[4]), colNumber(m[2])];
  });
  const [a, b] = [ends[0], ends[ends.length - 1]];
  return {
    sheet,
    r1: Math.min(a[0], b[0]),
    c1: Math.min(a[1], b[1]),
    r2: Math.max(a[0], b[0]),
    c2: Math.max(a[1], b[1]),
    isRange: parts.length === 2,
  };
}

export function references(formula) {
  return tokenize(formula)
    .filter((t) => t.kind === "ref")
    .map((t) => parseRef(t.text));
}

// parser ---------------------------------------------------------------------
const PRECEDENCE = [
  ["=", "<>", "<", ">", "<=", ">="],
  ["&"],
  ["+", "-"],
  ["*", "/"],
  ["^"],
];

function parse(formula) {
  if (!formula.startsWith("=")) throw new FormulaError("no =");
  const toks = tokenize(formula);
  let i = 0;
  const peek = () => toks[i];
  const take = (text) => {
    const t = toks[i];
    if (!t || (text !== undefined && t.text !== text))
      throw new FormulaError("expected " + text);
    i++;
    return t;
  };
  function binary(level) {
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
  function unary() {
    const t = peek();
    if (t && t.kind === "op" && (t.text === "+" || t.text === "-")) {
      i++;
      return { kind: "unary", op: t.text, args: [unary()] };
    }
    let node = primary();
    while (peek() && peek().text === "%") {
      i++;
      node = { kind: "percent", args: [node] };
    }
    return node;
  }
  function primary() {
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
      const args = [];
      if (peek() && peek().text === ")") {
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
    throw new FormulaError("unexpected " + t.text);
  }
  const node = binary(0);
  if (i < toks.length) throw new FormulaError("unexpected " + toks[i].text);
  return node;
}

// conversions ----------------------------------------------------------------
const NUMBER_INPUT = /^[+-]?(\d+(,\d*)?|,\d+)([Ee][+-]?\d+)?$/;
const DATE_INPUT = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
const DAY = 86400000;
const EPOCH = Date.UTC(1899, 11, 30);

function dateSerial(y, m, d) {
  return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / DAY);
}
function serialParts(serial) {
  const d = new Date(EPOCH + Math.floor(serial) * DAY);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

export function parseNumberText(text) {
  let s = text.trim().replace(/[  ]/g, "");
  const percent = s.endsWith("%");
  if (percent) s = s.slice(0, -1);
  if (NUMBER_INPUT.test(s)) {
    const v = Number(s.replace(",", "."));
    return percent ? v / 100 : v;
  }
  const m = DATE_INPUT.exec(s);
  if (m && !percent) {
    const y = Number(m[3]),
      mo = Number(m[2]),
      d = Number(m[1]);
    const dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return dateSerial(y, mo, d);
  }
  return null;
}

export function typed(text) {
  if (text === "") return EMPTY;
  if (text.startsWith("'")) return text.slice(1);
  const up = text.toUpperCase();
  if (up === "ИСТИНА" || up === "ЛОЖЬ") return up === "ИСТИНА";
  const n = parseNumberText(text);
  return n === null ? text : n;
}

export function formatNumber(x) {
  // Python f"{x:.15g}" with a decimal comma: 15 significant digits, no trailing zeros
  if (x === 0) return "0";
  if (Number.isInteger(x) && Math.abs(x) < 1e15) return String(x);
  const [mant, exp] = x.toExponential(14).split("e");
  const e = Number(exp);
  const strip = (t) =>
    t.includes(".") ? t.replace(/0+$/, "").replace(/\.$/, "") : t;
  if (e < -4 || e >= 15) {
    return (
      strip(mant).replace(".", ",") +
      "E" +
      (e < 0 ? "-" : "+") +
      String(Math.abs(e)).padStart(2, "0")
    );
  }
  return strip(x.toFixed(14 - e)).replace(".", ",");
}

export function display(v) {
  if (isErr(v)) return v.err;
  if (v === EMPTY) return "";
  if (typeof v === "boolean") return v ? "ИСТИНА" : "ЛОЖЬ";
  if (isNum(v)) return formatNumber(v);
  return String(v);
}

function toNumber(v) {
  if (isErr(v)) throw new SheetError(v);
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v === EMPTY) return 0;
  if (isNum(v)) return v;
  const n = parseNumberText(String(v));
  if (n === null) throw new SheetError(VALUE);
  return n;
}
function toText(v) {
  if (isErr(v)) throw new SheetError(v);
  return display(v);
}
function toBool(v) {
  if (isErr(v)) throw new SheetError(v);
  if (typeof v === "boolean") return v;
  if (v === EMPTY) return false;
  if (isNum(v)) return v !== 0;
  const up = String(v).toUpperCase();
  if (up === "ИСТИНА" || up === "TRUE") return true;
  if (up === "ЛОЖЬ" || up === "FALSE") return false;
  throw new SheetError(VALUE);
}
const rank = (v) =>
  typeof v === "boolean" ? 2 : typeof v === "string" ? 1 : 0;
const lower = (s) => s.toLowerCase();
function cmpStr(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
} // code-point order, like Python
function compare(a, b) {
  if (isErr(a)) throw new SheetError(a);
  if (isErr(b)) throw new SheetError(b);
  if (a === EMPTY)
    a = typeof b === "string" ? "" : typeof b === "boolean" ? false : 0;
  if (b === EMPTY)
    b = typeof a === "string" ? "" : typeof a === "boolean" ? false : 0;
  const ra = rank(a),
    rb = rank(b);
  if (ra !== rb) return ra < rb ? -1 : 1;
  if (typeof a === "string") return cmpStr(lower(a), lower(String(b)));
  const x = Number(a),
    y = Number(b);
  return x > y ? 1 : x < y ? -1 : 0;
}

// exact decimal rounding as Python's Decimal(repr(x)).quantize ------------------
function roundDecimal(x, digits, mode) {
  // mode: "half-up" (away from zero), "ceil", "floor", "down" (toward zero)
  const repr = shortest(x);
  let neg = repr.startsWith("-");
  let [int, frac = ""] = (neg ? repr.slice(1) : repr).split(".");
  let all = int + frac,
    point = int.length; // decimal digits and where the point is
  const keep = point + digits; // digits kept from the left
  if (keep < 0) {
    all = "0".repeat(-keep) + all;
    point += -keep;
  }
  const k = point + digits;
  let head = all.slice(0, Math.max(k, 0)) || "0";
  const tail = all.slice(Math.max(k, 0));
  const tailNonZero = /[1-9]/.test(tail);
  let up;
  if (mode === "half-up") up = tail.length > 0 && tail[0] >= "5";
  else if (mode === "down") up = false;
  else if (mode === "ceil") up = !neg && tailNonZero;
  else up = neg && tailNonZero; // floor
  let n = BigInt(head);
  if (up) n += 1n;
  let s = n.toString();
  const scale = digits >= 0 ? digits : 0;
  if (digits < 0) s += "0".repeat(-digits);
  let value;
  if (scale > 0) {
    s = s.padStart(scale + 1, "0");
    value = Number(s.slice(0, -scale) + "." + s.slice(-scale));
  } else value = Number(s);
  if (value === 0) neg = false;
  return neg ? -value : value;
}
function shortest(x) {
  // Python repr: shortest round-trip, without exponent for our ranges
  let s = String(x);
  if (/e/.test(s)) {
    const [m, e] = s.split("e");
    const exp = Number(e);
    let [i, f = ""] = m.replace("-", "").split(".");
    let digits = i + f,
      point = i.length + exp;
    if (point <= 0) s = "0." + "0".repeat(-point) + digits;
    else if (point >= digits.length)
      s = digits + "0".repeat(point - digits.length);
    else s = digits.slice(0, point) + "." + digits.slice(point);
    if (m.startsWith("-")) s = "-" + s;
  }
  return s;
}

// criteria -------------------------------------------------------------------
function wildcard(pattern) {
  let out = "";
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (
      ch === "~" &&
      i + 1 < pattern.length &&
      "*?~".includes(pattern[i + 1])
    ) {
      out += escapeRe(pattern[++i]);
      continue;
    }
    out += ch === "*" ? "[\\s\\S]*" : ch === "?" ? "[\\s\\S]" : escapeRe(ch);
  }
  return new RegExp("^" + out + "$", "i");
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
}

function criterion(crit) {
  if (isErr(crit)) throw new SheetError(crit);
  if (crit === EMPTY) crit = 0;
  if (typeof crit === "boolean")
    return (v) => typeof v === "boolean" && v === crit;
  if (isNum(crit))
    return (v) =>
      (isNum(v) && v === crit) ||
      (typeof v === "string" && parseNumberText(v) === crit);
  const text = String(crit);
  const m = /^(<=|>=|<>|<|>|=)?([\s\S]*)$/.exec(text);
  const op = m[1] || "=",
    rest = m[2];
  const number = rest !== "" ? parseNumberText(rest) : null;
  const up = rest.toUpperCase();
  if (up === "ИСТИНА" || up === "ЛОЖЬ") {
    const flag = up === "ИСТИНА";
    if (op === "=") return (v) => typeof v === "boolean" && v === flag;
    if (op === "<>") return (v) => !(typeof v === "boolean" && v === flag);
  }
  if (number !== null) {
    return (v) => {
      if (!isNum(v)) return op === "<>";
      return {
        "=": v === number,
        "<>": v !== number,
        "<": v < number,
        ">": v > number,
        "<=": v <= number,
        ">=": v >= number,
      }[op];
    };
  }
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
  return (v) => {
    if (typeof v !== "string") return false;
    const c = cmpStr(lower(v), lower(rest));
    return { "<": c < 0, ">": c > 0, "<=": c <= 0, ">=": c >= 0 }[op];
  };
}

// ranges ---------------------------------------------------------------------
class Range {
  constructor(rows, ref, sheet) {
    this.rows = rows;
    this.ref = ref;
    this.sheet = sheet;
  }
  flat() {
    return this.rows.flat();
  }
  get shape() {
    return [this.rows.length, this.rows.length ? this.rows[0].length : 0];
  }
}
const isRange = (v) => v instanceof Range;

// book -----------------------------------------------------------------------
export class Book {
  constructor() {
    this.sheets = new Map();
    this.cache = new Map();
    this.stack = new Set();
    this.here = []; // rows of the cells being computed, for СТРОКА()
  }
  sheet(name) {
    if (!this.sheets.has(name))
      this.sheets.set(name, {
        name,
        inputs: new Map(),
        filtered: new Set(),
        hidden: new Set(),
      });
    return this.sheets.get(name);
  }
  set(sheet, addr, text) {
    this.sheet(sheet).inputs.set(parseAddress(addr).join(","), text);
    this.cache.clear();
  }
  value(sheet, addr) {
    const [r, c] = parseAddress(addr);
    try {
      return this.cell(this.sheet(sheet), r, c);
    } catch (e) {
      if (e instanceof SheetError) return e.e;
      throw e;
    }
  }
  cell(sheet, r, c) {
    const key = sheet.name + "!" + r + "," + c;
    if (this.cache.has(key)) return this.cache.get(key);
    const text = sheet.inputs.get(r + "," + c) || "";
    if (!text.startsWith("=")) return typed(text);
    if (this.stack.has(key)) throw new SheetError(CYCLE);
    this.stack.add(key);
    this.here.push(r);
    let value;
    try {
      value = this.formula(text, sheet);
    } finally {
      this.stack.delete(key);
      this.here.pop();
    }
    this.cache.set(key, value);
    return value;
  }
  formula(text, sheet) {
    let node;
    try {
      node = parse(text);
    } catch (e) {
      if (e instanceof FormulaError) return NAME;
      throw e;
    }
    let result;
    try {
      result = this.eval(node, sheet);
    } catch (e) {
      if (e instanceof SheetError) {
        if (e.e === CYCLE) throw e;
        return e.e;
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
  target(ref, sheet) {
    if (ref.sheet === null) return sheet;
    if (!this.sheets.has(ref.sheet)) throw new SheetError(REF);
    return this.sheets.get(ref.sheet);
  }
  range(ref, sheet) {
    const src = this.target(ref, sheet);
    const rows = [];
    for (let r = ref.r1; r <= ref.r2; r++) {
      const row = [];
      for (let c = ref.c1; c <= ref.c2; c++) row.push(this.cell(src, r, c));
      rows.push(row);
    }
    return new Range(rows, ref, src);
  }
  eval(node, sheet) {
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
        return this.binary(node, sheet);
      case "func":
        return this.call(node, sheet);
    }
    throw new Error(node.kind);
  }
  scalar(node, sheet) {
    return scalar(this.eval(node, sheet));
  }
  binary(node, sheet) {
    const op = node.op;
    const a = this.scalar(node.args[0], sheet),
      b = this.scalar(node.args[1], sheet);
    if (op === "&") return toText(a) + toText(b);
    if (["=", "<>", "<", ">", "<=", ">="].includes(op)) {
      const c = compare(a, b);
      return {
        "=": c === 0,
        "<>": c !== 0,
        "<": c < 0,
        ">": c > 0,
        "<=": c <= 0,
        ">=": c >= 0,
      }[op];
    }
    const x = toNumber(a),
      y = toNumber(b);
    if (op === "+") return x + y;
    if (op === "-") return x - y;
    if (op === "*") return x * y;
    if (op === "/") {
      if (y === 0) throw new SheetError(DIV0);
      return x / y;
    }
    if (op === "^") {
      if (x === 0 && y < 0) throw new SheetError(DIV0);
      const r = Math.pow(x, y);
      if (!Number.isFinite(r) || Number.isNaN(r)) throw new SheetError(NUM);
      return r;
    }
    throw new Error(op);
  }
  call(node, sheet) {
    const impl = FUNCTIONS[node.name];
    if (!impl) throw new SheetError(NAME);
    if (LAZY.has(node.name)) return impl(this, sheet, node.args);
    const args = node.args.map((a) =>
      a.kind === "ref" ? this.range(a.ref, sheet) : this.eval(a, sheet),
    );
    return impl(this, sheet, args);
  }
}

// helpers --------------------------------------------------------------------
function need(args, low, high = low) {
  if (args.length < low || args.length > high) throw new SheetError(VALUE);
}
function scalar(v) {
  if (isRange(v)) {
    const [h, w] = v.shape;
    if (h === 1 && w === 1) return v.rows[0][0];
    throw new SheetError(VALUE);
  }
  return v;
}
function fsum(xs) {
  // exactly rounded sum as Python's math.fsum (Shewchuk)
  const partials = [];
  for (let x of xs) {
    let i = 0;
    for (let y of partials) {
      if (Math.abs(x) < Math.abs(y)) [x, y] = [y, x];
      const hi = x + y,
        lo = y - (hi - x);
      if (lo) partials[i++] = lo;
      x = hi;
    }
    partials.length = i;
    partials.push(x);
  }
  let n = partials.length,
    hi = 0;
  if (n > 0) {
    hi = partials[--n];
    let lo = 0;
    while (n > 0) {
      const x = hi,
        y = partials[--n];
      hi = x + y;
      const yr = hi - x;
      lo = y - yr;
      if (lo) break;
    }
    if (
      n > 0 &&
      ((lo < 0 && partials[n - 1] < 0) || (lo > 0 && partials[n - 1] > 0))
    ) {
      const y = lo * 2,
        x = hi + y,
        yr = x - hi;
      if (y === yr) hi = x;
    }
  }
  return hi;
}
function numbers(args) {
  const out = [];
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
const fSum = (b, s, args) => fsum(numbers(args));
const fSumsq = (b, s, args) => fsum(numbers(args).map((x) => x * x));
function fCount(b, s, args) {
  let n = 0;
  for (const a of args) {
    if (isRange(a)) n += a.flat().filter(isNum).length;
    else if (typeof a === "boolean" || isNum(a)) n++;
    else if (typeof a === "string" && parseNumberText(a) !== null) n++;
  }
  return n;
}
function fCounta(b, s, args) {
  let n = 0;
  for (const a of args) {
    if (isRange(a)) n += a.flat().filter((v) => v !== EMPTY).length;
    else if (a !== EMPTY) n++;
  }
  return n;
}
function fCountblank(b, s, args) {
  need(args, 1);
  if (!isRange(args[0])) throw new SheetError(VALUE);
  return args[0].flat().filter((v) => v === EMPTY || v === "").length;
}
function fAverage(b, s, args) {
  const xs = numbers(args);
  if (!xs.length) throw new SheetError(DIV0);
  return fsum(xs) / xs.length;
}
const fMin = (b, s, args) => {
  const xs = numbers(args);
  return xs.length ? Math.min(...xs) : 0;
};
const fMax = (b, s, args) => {
  const xs = numbers(args);
  return xs.length ? Math.max(...xs) : 0;
};
function kth(args, reverse) {
  need(args, 2);
  const xs = numbers([args[0]]).sort((a, b) => (reverse ? b - a : a - b));
  const k = Math.ceil(toNumber(scalar(args[1])));
  if (!xs.length || k < 1 || k > xs.length) throw new SheetError(NUM);
  return xs[k - 1];
}
function logicals(args) {
  const out = [];
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
function fIf(book, sheet, nodes) {
  need(nodes, 1, 3);
  if (toBool(book.scalar(nodes[0], sheet))) {
    if (nodes.length < 2) return true;
    if (nodes[1].kind === "missing") return 0;
    return book.eval(nodes[1], sheet);
  }
  if (nodes.length < 3) return false;
  if (nodes[2].kind === "missing") return 0;
  return book.eval(nodes[2], sheet);
}
function fIferror(book, sheet, nodes) {
  need(nodes, 2);
  let v;
  try {
    v = book.eval(nodes[0], sheet);
  } catch (e) {
    if (e instanceof SheetError && e.e !== CYCLE)
      return book.eval(nodes[1], sheet);
    throw e;
  }
  return isErr(v) ? book.eval(nodes[1], sheet) : v;
}
function asRange(a) {
  if (!isRange(a)) throw new SheetError(VALUE);
  return a;
}
function fCountif(b, s, args) {
  need(args, 2);
  const test = criterion(scalar(args[1]));
  return asRange(args[0])
    .flat()
    .filter((v) => !isErr(v) && test(v)).length;
}
function ifsMask(args) {
  if (args.length % 2) throw new SheetError(VALUE);
  let shape = null,
    mask = [];
  for (let i = 0; i < args.length; i += 2) {
    const rng = args[i];
    if (!isRange(rng)) throw new SheetError(VALUE);
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
  return { mask, shape };
}
function fCountifs(b, s, args) {
  if (!args.length) throw new SheetError(VALUE);
  return ifsMask(args).mask.filter(Boolean).length;
}
function resized(book, base, rng) {
  const [h, w] = base.shape;
  const ref = {
    sheet: rng.ref.sheet,
    r1: rng.ref.r1,
    c1: rng.ref.c1,
    r2: rng.ref.r1 + h - 1,
    c2: rng.ref.c1 + w - 1,
    isRange: true,
  };
  const rows = [];
  for (let r = ref.r1; r <= ref.r2; r++) {
    const row = [];
    for (let c = ref.c1; c <= ref.c2; c++) row.push(book.cell(rng.sheet, r, c));
    rows.push(row);
  }
  return rows.flat();
}
function summable(values, mask) {
  const out = [];
  values.forEach((v, i) => {
    if (!mask[i]) return;
    if (isErr(v)) throw new SheetError(v);
    if (isNum(v)) out.push(v);
  });
  return out;
}
function condValues(book, args) {
  need(args, 2, 3);
  const rng = asRange(args[0]);
  const test = criterion(scalar(args[1]));
  const mask = rng.flat().map((v) => !isErr(v) && test(v));
  const values =
    args.length === 2 ? rng.flat() : resized(book, rng, asRange(args[2]));
  return summable(values, mask);
}
const fSumif = (book, s, args) => fsum(condValues(book, args));
function fAverageif(book, s, args) {
  const xs = condValues(book, args);
  if (!xs.length) throw new SheetError(DIV0);
  return fsum(xs) / xs.length;
}
function ifsValues(args) {
  if (args.length < 3) throw new SheetError(VALUE);
  const total = asRange(args[0]);
  const { mask, shape } = ifsMask(args.slice(1));
  if (total.shape[0] !== shape[0] || total.shape[1] !== shape[1])
    throw new SheetError(VALUE);
  return summable(total.flat(), mask);
}
const fSumifs = (b, s, args) => fsum(ifsValues(args));
function fAverageifs(b, s, args) {
  const xs = ifsValues(args);
  if (!xs.length) throw new SheetError(DIV0);
  return fsum(xs) / xs.length;
}
function numArgs(args, low, high = low) {
  need(args, low, high);
  return args.map((a) => toNumber(scalar(a)));
}
function fMod(b, s, args) {
  const [n, d] = numArgs(args, 2);
  if (d === 0) throw new SheetError(DIV0);
  return n - d * Math.floor(n / d);
}
function fRound(posMode, negMode) {
  return (b, s, args) => {
    const [x, digits] = numArgs(args, 2);
    return roundDecimal(x, Math.trunc(digits), x >= 0 ? posMode : negMode);
  };
}
function fTrunc(b, s, args) {
  const xs = numArgs(args, 1, 2);
  return roundDecimal(xs[0], xs.length > 1 ? Math.trunc(xs[1]) : 0, "down");
}
function fInt(b, s, args) {
  const [x] = numArgs(args, 1);
  return Math.floor(x);
}
function fAbs(b, s, args) {
  const [x] = numArgs(args, 1);
  return Math.abs(x);
}
function lookupEqual(a, b) {
  if (isErr(a) || isErr(b) || a === EMPTY || b === EMPTY) return false;
  if (rank(a) !== rank(b)) return false;
  if (typeof a === "string")
    return typeof b === "string" && wildcard(a).test(b);
  return a === b;
}
function approximate(key, values, descending = false) {
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
function fVlookup(book, s, args) {
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
}
function fMatch(book, s, args) {
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
}
function fIndex(book, s, args) {
  need(args, 2, 3);
  const rng = asRange(args[0]);
  const [rows, cols] = rng.shape;
  const a = Math.trunc(toNumber(scalar(args[1])));
  const b =
    args.length === 3 && args[2] !== EMPTY
      ? Math.trunc(toNumber(scalar(args[2])))
      : null;
  let r, c;
  if (b === null) {
    if (rows === 1) {
      r = 1;
      c = a;
    } else if (cols === 1) {
      r = a;
      c = 1;
    } else throw new SheetError(REF);
  } else {
    r = a;
    c = b;
  }
  if (r < 1 || c < 1 || r > rows || c > cols) throw new SheetError(REF);
  return rng.rows[r - 1][c - 1];
}
const SUBTOTAL_OPS = {
  1: fAverage,
  2: fCount,
  3: fCounta,
  4: fMax,
  5: fMin,
  9: fSum,
};
function fSubtotal(book, sheet, args) {
  if (args.length < 2) throw new SheetError(VALUE);
  const code = Math.trunc(toNumber(scalar(args[0])));
  const base = code > 100 ? code - 100 : code;
  if (!SUBTOTAL_OPS[base]) throw new SheetError(VALUE);
  const visible = args.slice(1).map((a) => {
    const rng = asRange(a);
    const rows = [];
    rng.rows.forEach((row, off) => {
      const r = rng.ref.r1 + off;
      if (rng.sheet.filtered.has(r) || (code > 100 && rng.sheet.hidden.has(r)))
        return;
      rows.push(
        row.map((v, k) => {
          const text = rng.sheet.inputs.get(r + "," + (rng.ref.c1 + k)) || "";
          return text.startsWith("=") &&
            text.toUpperCase().includes("ПРОМЕЖУТОЧНЫЕ.ИТОГИ")
            ? EMPTY
            : v;
        }),
      );
    });
    return new Range(rows.length ? rows : [[]], rng.ref, rng.sheet);
  });
  return SUBTOTAL_OPS[base](book, sheet, visible);
}
const textArg = (a) => toText(scalar(a));
const chars = (s) => Array.from(s);
function fLen(b, s, args) {
  need(args, 1);
  return chars(textArg(args[0])).length;
}
function fLeft(b, s, args) {
  need(args, 1, 2);
  const n = args.length === 2 ? Math.trunc(toNumber(scalar(args[1]))) : 1;
  if (n < 0) throw new SheetError(VALUE);
  return chars(textArg(args[0])).slice(0, n).join("");
}
function fRight(b, s, args) {
  need(args, 1, 2);
  const n = args.length === 2 ? Math.trunc(toNumber(scalar(args[1]))) : 1;
  if (n < 0) throw new SheetError(VALUE);
  const t = chars(textArg(args[0]));
  return n ? t.slice(Math.max(t.length - n, 0)).join("") : "";
}
function fMid(b, s, args) {
  need(args, 3);
  const t = chars(textArg(args[0]));
  const st = Math.trunc(toNumber(scalar(args[1]))),
    n = Math.trunc(toNumber(scalar(args[2])));
  if (st < 1 || n < 0) throw new SheetError(VALUE);
  return t.slice(st - 1, st - 1 + n).join("");
}
function fTrim(b, s, args) {
  need(args, 1);
  return textArg(args[0])
    .replace(/^ +| +$/g, "")
    .replace(/ +/g, " ");
}
function fSubstitute(b, s, args) {
  need(args, 3, 4);
  const text = textArg(args[0]),
    old = textArg(args[1]),
    neu = textArg(args[2]);
  if (old === "") return text;
  if (args.length === 3) return text.split(old).join(neu);
  const k = Math.trunc(toNumber(scalar(args[3])));
  if (k < 1) throw new SheetError(VALUE);
  let pos = -1;
  for (let i = 0; i < k; i++) {
    pos = text.indexOf(old, pos + 1);
    if (pos < 0) return text;
  }
  return text.slice(0, pos) + neu + text.slice(pos + old.length);
}
function fExact(b, s, args) {
  need(args, 2);
  return textArg(args[0]) === textArg(args[1]);
}
function fValue(b, s, args) {
  need(args, 1);
  const v = scalar(args[0]);
  if (isNum(v)) return v;
  if (isErr(v)) throw new SheetError(v);
  if (v === EMPTY) return 0;
  if (typeof v === "boolean") throw new SheetError(VALUE);
  const n = parseNumberText(String(v));
  if (n === null) throw new SheetError(VALUE);
  return n;
}
function fIsnumber(b, s, args) {
  need(args, 1);
  return isNum(scalar(args[0]));
}
function fIstext(b, s, args) {
  need(args, 1);
  return typeof scalar(args[0]) === "string";
}
const fAnd = (b, s, args) => logicals(args).every(Boolean);
const fOr = (b, s, args) => logicals(args).some(Boolean);
function fNot(b, s, args) {
  need(args, 1);
  return !toBool(scalar(args[0]));
}
function fRow(book, sheet, nodes) {
  // СТРОКА(): the row of the cell itself; СТРОКА(B7): the row of a reference
  need(nodes, 0, 1);
  if (nodes.length) {
    if (nodes[0].kind !== "ref") throw new SheetError(VALUE);
    return nodes[0].ref.r1;
  }
  if (!book.here.length) throw new SheetError(VALUE);
  return book.here[book.here.length - 1];
}
function fDate(b, s, args) {
  let [y, m, d] = numArgs(args, 3).map(Math.trunc);
  if (y >= 0 && y < 1900) y += 1900;
  y += Math.floor((m - 1) / 12);
  m = ((((m - 1) % 12) + 12) % 12) + 1;
  const serial = dateSerial(y, m, 1) + d - 1;
  if (serial < 1 || y > 9999) throw new SheetError(NUM);
  return serial;
}
function datePart(part) {
  return (b, s, args) => {
    const [x] = numArgs(args, 1);
    if (x < 0) throw new SheetError(NUM);
    return serialParts(x)[part];
  };
}

const FUNCTIONS = {
  СУММ: fSum,
  СЧЁТ: fCount,
  СЧЁТЗ: fCounta,
  СЧИТАТЬПУСТОТЫ: fCountblank,
  СРЗНАЧ: fAverage,
  МИН: fMin,
  МАКС: fMax,
  НАИМЕНЬШИЙ: (b, s, a) => kth(a, false),
  НАИБОЛЬШИЙ: (b, s, a) => kth(a, true),
  ЕСЛИ: fIf,
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
  ЕСЛИОШИБКА: fIferror,
  СТРОКА: fRow,
  СУММКВ: fSumsq,
};
const LAZY = new Set(["ЕСЛИ", "ЕСЛИОШИБКА", "СТРОКА"]);

// formats (sheetblock.formatted) ------------------------------------------------
export function formatted(value, kind) {
  if (!kind || !isNum(value)) return display(value);
  if (kind === "дата") {
    const p = serialParts(value);
    return (
      String(p.day).padStart(2, "0") +
      "." +
      String(p.month).padStart(2, "0") +
      "." +
      p.year
    );
  }
  let digits, percent;
  if (kind === "%") {
    digits = 0;
    percent = true;
  } else {
    const m = /^0(?:,(0+))?(%?)$/.exec(kind);
    if (!m) return display(value);
    digits = (m[1] || "").length;
    percent = m[2] === "%";
  }
  const x = percent ? value * 100 : value;
  let text = pyFixed(x, digits).replace(".", ",");
  if (text.startsWith("-") && Number(text.replace(",", ".")) === 0)
    text = text.slice(1);
  return text + (percent ? "%" : "");
}
function pyFixed(x, digits) {
  // Python f"{x:.Nf}": exact binary value rounded half-to-even; toFixed rounds the same exact value half-up
  return roundHalfEvenExact(x, digits);
}
function roundHalfEvenExact(x, digits) {
  const s = x.toFixed(Math.min(digits + 20, 100)); // exact enough decimal expansion of the double
  const neg = s.startsWith("-");
  let [int, frac] = (neg ? s.slice(1) : s).split(".");
  frac = frac || "";
  const keep = frac.slice(0, digits),
    rest = frac.slice(digits);
  let n = BigInt(int + keep);
  const half = rest.length ? rest[0] : "0";
  const beyond = /[1-9]/.test(rest.slice(1));
  if (half > "5" || (half === "5" && (beyond || n % 2n === 1n))) n += 1n;
  let out = n.toString().padStart(digits + 1, "0");
  if (digits > 0) out = out.slice(0, -digits) + "." + out.slice(-digits);
  return (neg ? "-" : "") + out;
}
