// The browser evaluator of the live sheet against the reference (sheet_eval.py).
//
//   python3 -I scripts/lesson_design/verify_sheets.py content/lesson-design/course-excel --cases
//   node scripts/lesson_design/sheet_conformance.mjs apps/web/tests/fixtures/sheet-cases.json
//
// Every case is a sheet block with some cells retyped; every cell must show
// exactly what sheet_eval.py + sheetblock.formatted show. Exit code 1 on a mismatch.
import { readFileSync } from "node:fs";
import { Book, formatted } from "./sheet_eval.js";

const path = process.argv[2];
if (!path) {
  console.error(
    "usage: node sheet_conformance.mjs apps/web/tests/fixtures/sheet-cases.json",
  );
  process.exit(2);
}
const cases = JSON.parse(readFileSync(path, "utf-8"));
let cells = 0;
const bad = [];
cases.forEach((c, i) => {
  const book = new Book();
  const formats = {};
  for (const s of c.block.sheets) {
    const sheet = book.sheet(s.name);
    for (const [addr, text] of Object.entries(s.inputs))
      book.set(s.name, addr, text);
    s.filtered.forEach((r) => sheet.filtered.add(r));
    s.hidden.forEach((r) => sheet.hidden.add(r));
    for (const [addr, kind] of Object.entries(s.formats))
      formats[s.name + "!" + addr] = kind;
  }
  for (const [key, text] of Object.entries(c.edits)) {
    const [name, addr] = key.split("!");
    book.set(name, addr, text);
  }
  for (const [key, want] of Object.entries(c.expected)) {
    const [name, addr] = key.split("!");
    const got = formatted(book.value(name, addr), formats[key]);
    cells++;
    if (got !== want)
      bad.push(
        `case ${i} ${key}: js ${JSON.stringify(got)}, python ${JSON.stringify(want)}`,
      );
  }
});
bad.slice(0, 40).forEach((line) => console.log(line));
console.log(`${cases.length} cases, ${cells} cells; ${bad.length} mismatches`);
process.exit(bad.length ? 1 : 0);
