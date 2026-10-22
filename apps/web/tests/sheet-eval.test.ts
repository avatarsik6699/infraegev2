import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  Book,
  display,
  formatted,
  shiftFormula,
} from "~/shared/lib/sheet-eval";

type SheetCase = {
  block: {
    sheets: {
      name: string;
      inputs: Record<string, string>;
      formats: Record<string, string>;
      filtered: number[];
      hidden: number[];
    }[];
  };
  edits: Record<string, string>;
  expected: Record<string, string>;
};

// conformance cases of the evaluator, written by verify_sheets.py --cases from the
// archived stand sheets (Change 177); the reference semantics stay sheet_eval.py
const cases = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "tests/fixtures/sheet-cases.json"),
    "utf8",
  ),
) as SheetCase[];

const split = (key: string): [string, string] => {
  const bang = key.lastIndexOf("!");
  return [key.slice(0, bang), key.slice(bang + 1)];
};

describe("sheet evaluator against the stand's reference (Change 177)", () => {
  it("shows every cell of every case exactly as sheet_eval.py", () => {
    const mismatches: string[] = [];
    let cells = 0;
    cases.forEach((c, i) => {
      const book = new Book();
      const formats: Record<string, string> = {};
      for (const s of c.block.sheets) {
        const sheet = book.sheet(s.name);
        for (const [addr, text] of Object.entries(s.inputs))
          book.set(s.name, addr, text);
        s.filtered.forEach((r) => sheet.filtered.add(r));
        s.hidden.forEach((r) => sheet.hidden.add(r));
        for (const [addr, kind] of Object.entries(s.formats))
          formats[`${s.name}!${addr}`] = kind;
      }
      for (const [key, text] of Object.entries(c.edits))
        book.set(...split(key), text);
      for (const [key, want] of Object.entries(c.expected)) {
        cells++;
        const got = formatted(book.value(...split(key)), formats[key]);
        if (got !== want)
          mismatches.push(`case ${String(i)} ${key}: ${got} ≠ ${want}`);
      }
    });
    expect(cells).toBeGreaterThan(4000);
    expect(mismatches).toEqual([]);
  });

  it("keeps the edge cases the course discusses", () => {
    const book = new Book();
    const sheet = book.sheet("Лист");
    const value = (formula: string) => display(book.formula(formula, sheet));
    expect(value("=-2^2")).toBe("4");
    expect(value("=10<=15<=20")).toBe("ЛОЖЬ");
    expect(value("=ОСТАТ(-7;3)")).toBe("2");
    expect(value("=ОКРУГЛВВЕРХ(-2,3;0)")).toBe("-3");
    expect(value("=ЦЕЛОЕ(-2,3)")).toBe("-3");
    expect(value("=ОТБР(-2,3)")).toBe("-2");
    expect(value("=ДАТА(2026;13;1)")).toBe("46388");
    expect(value("=1/0")).toBe("#ДЕЛ/0!");
    expect(value("=СУММА(1)")).toBe("#ИМЯ?");
    expect(value("=ЕСНД(1/0;0)")).toBe("#ДЕЛ/0!");
    book.set("Лист", "C1", "1");
    book.set("Лист", "D1", "4");
    expect(value("=ЕСНД(ВПР(2;C1:D1;2;0);0)")).toBe("0");
    expect(value("=ЕСНД(ВПР(1;C1:D1;2;0);0)")).toBe("4");
    book.set("Лист", "A1", "=B1");
    book.set("Лист", "B1", "=A1");
    expect(display(book.value("Лист", "A1"))).toBe("#ЦИКЛ!");
  });

  it("formats percent, decimals and dates as a cell does", () => {
    expect(formatted(0.15, "%")).toBe("15%");
    expect(formatted(0.075, "0,0%")).toBe("7,5%");
    expect(formatted(1.23456, "0,00")).toBe("1,23");
    expect(formatted(46300, "дата")).toBe("05.10.2026");
  });
});

describe("copying a formula (shiftFormula)", () => {
  const text = (formula: string, drow: number, dcol: number) =>
    shiftFormula(formula, drow, dcol)
      .parts.map((p) => p.text)
      .join("");

  it("moves the parts without $ and keeps the parts with $", () => {
    expect(text("=$B2*C$1+$H$2", 3, 2)).toBe("=$B5*E$1+$H$2");
    expect(text("=СУММ($A$2:A2)", 5, 0)).toBe("=СУММ($A$2:A7)");
    expect(text("=ВПР(B2;Товары!$A$2:$D$5;3;0)", 1, 0)).toBe(
      "=ВПР(B3;Товары!$A$2:$D$5;3;0)",
    );
  });

  it("marks only the changed column letters and row numbers", () => {
    const moved = shiftFormula("=$A2*B$1", 2, 2)
      .parts.filter((p) => p.moved)
      .map((p) => p.text);
    expect(moved).toEqual(["4", "D"]);
  });

  it("writes #ССЫЛКА! for an address pushed off the sheet", () => {
    const result = shiftFormula("=A1+B2", -1, 0);
    expect(result.offSheet).toBe(true);
    expect(result.parts.map((p) => p.text).join("")).toBe("=#ССЫЛКА!+B1");
  });
});
