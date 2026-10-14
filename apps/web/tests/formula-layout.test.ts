import { describe, expect, it } from "vitest";
import {
  formulaLayout,
  linesOf,
} from "~/shared/components/learning-content/formula-block/formula-layout";

const lines = (formula: string) =>
  formulaLayout(formula).map(
    (line) =>
      `${" ".repeat(line.indent * 2)}${formula.slice(line.start, line.end)}`,
  );

describe("formula layout (Change 184 F9)", () => {
  it("keeps a short formula on one line", () => {
    expect(lines('=ЕСЛИ(E2="Поступление";F2;-F2)')).toEqual([
      '=ЕСЛИ(E2="Поступление";F2;-F2)',
    ]);
  });

  it("breaks СУММЕСЛИМН into the sum range and its range-criterion pairs", () => {
    expect(
      lines(
        '=СУММЕСЛИМН(J2:J13;H2:H13;"Северный";D2:D13;102;B2:B13;">="&ДАТА(2026;6;1);B2:B13;"<="&ДАТА(2026;6;10))',
      ),
    ).toEqual([
      "=СУММЕСЛИМН(J2:J13;",
      '  H2:H13;"Северный";',
      "  D2:D13;102;",
      '  B2:B13;">="&ДАТА(2026;6;1);',
      '  B2:B13;"<="&ДАТА(2026;6;10))',
    ]);
  });

  it("breaks the long first argument once more, deeper", () => {
    expect(
      lines(
        '=ЕСЛИ(И(H2="Северный";I2="Фабрика А";B2>=ДАТА(2026;6;1);B2<=ДАТА(2026;6;10));1;0)',
      ),
    ).toEqual([
      '=ЕСЛИ(И(H2="Северный";',
      '    I2="Фабрика А";',
      "    B2>=ДАТА(2026;6;1);",
      "    B2<=ДАТА(2026;6;10));",
      "  1;",
      "  0)",
    ]);
  });

  it("never breaks inside quoted text or a quoted sheet name", () => {
    const formula =
      "=ВПР(D2;'Товар; склад'!$A$2:$F$40;5;0)+ВПР(D2;'Товар'!$A$2:$F$40;6;0)";
    for (const line of lines(formula)) expect(line).not.toMatch(/^\s*склад/u);
  });

  it("cuts the coloured pieces of the bar at the line starts", () => {
    const formula = '=СЧЁТЕСЛИМН(A2:A99;">5";B2:B99;"<9";C2:C99;1)';
    const parts = [
      { text: "=СЧЁТЕСЛИМН(" },
      { text: "A2:A99", color: 1 },
      { text: ';">5";' },
      { text: "B2:B99", color: 2 },
      { text: ';"<9";' },
      { text: "C2:C99", color: 3 },
      { text: ";1)" },
    ];
    const rows = linesOf(parts, formulaLayout(formula));
    expect(rows.map((row) => row.parts.map((p) => p.text).join(""))).toEqual([
      '=СЧЁТЕСЛИМН(A2:A99;">5";',
      'B2:B99;"<9";',
      "C2:C99;1)",
    ]);
    expect(rows[1]?.parts[0]).toEqual({ text: "B2:B99", color: 2 });
  });
});
