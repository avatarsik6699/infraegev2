import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KeyCombo } from "~/shared/components/key-combo";
import {
  FillSandbox,
  FormulaBlock,
  type LessonMediaTypes,
  SheetBlock,
} from "~/shared/components/learning-content";

const flags = vi.hoisted(() => ({ enhanced: true }));
vi.mock("~/shared/lib/use-is-enhanced", () => ({
  useIsEnhanced: () => flags.enhanced,
}));

afterEach(() => {
  flags.enhanced = true;
});

// The lesson 5 sheet: one formula copied down, an editable price.
const base: LessonMediaTypes.Sheet = {
  kind: "sheet",
  sheets: [
    {
      name: "База",
      cols: [1, 4],
      rows: [1, 3],
      inputs: {
        A1: "Товар",
        B1: "Цена",
        C1: "Количество",
        D1: "Стоимость",
        A2: "Тетрадь",
        B2: "40",
        C2: "5",
        D2: "=B2*C2",
        A3: "Ручка",
        B3: "20",
        C3: "3",
        D3: "=B3*C3",
      },
      formats: {},
      filtered: [],
      hidden: [],
      edit: ["B2", "C2", "B3", "C3"],
      formulas: [{ cell: "D2", formula: "=B2*C2", until: "D3" }],
    },
  ],
  select: ["База", "D3"],
};

const books: LessonMediaTypes.Sheet = {
  kind: "sheet",
  sheets: [
    {
      name: "Операции",
      cols: [1, 2],
      rows: [1, 2],
      inputs: {
        A1: "Код",
        B1: "Категория",
        A2: "103",
        B2: "=ВПР(A2;Товары!$A$2:$B$3;2;0)",
      },
      formats: {},
      filtered: [],
      hidden: [],
      edit: ["A2"],
      formulas: [{ cell: "B2", formula: "=ВПР(A2;Товары!$A$2:$B$3;2;0)" }],
    },
    {
      name: "Товары",
      cols: [1, 2],
      rows: [1, 3],
      inputs: {
        A1: "Код",
        B1: "Категория",
        A2: "102",
        B2: "Напитки",
        A3: "103",
        B3: "Выпечка",
      },
      formats: {},
      filtered: [],
      hidden: [],
      edit: [],
      formulas: [],
    },
  ],
  select: ["Операции", "B2"],
};

const cell = (name: string) =>
  screen.getByRole("gridcell", { name }) as HTMLTableCellElement;

describe("SheetBlock (Change 177)", () => {
  it("renders values and formulas without scripting", () => {
    flags.enhanced = false;
    const html = renderToStaticMarkup(
      <SheetBlock {...base} label="Лист «База»" />,
    );
    expect(html).toContain(">200<");
    expect(html).toContain(">60<");
    expect(html).toContain(">Формулы в ячейках<");
    expect(html).toContain("<code>D2</code>");
    expect(html).toContain("скопирована до D3");
    expect(html).toContain("=B2*C2");
    expect(html).not.toContain('role="grid"');
    expect(html).not.toContain("Вернуть исходные");
  });

  it("frames the cells the selected formula reads", () => {
    const view = render(<SheetBlock {...base} label="Лист «База»" />);
    expect(screen.getByLabelText("Строка формул").textContent).toBe("=B3*C3");
    const frames = [...view.container.querySelectorAll("td[data-ref]")];
    expect(frames.map((td) => td.textContent)).toEqual(["20", "3"]);
    fireEvent.click(cell("200"));
    expect(screen.getByLabelText("Строка формул").textContent).toBe("=B2*C2");
    expect(
      [...view.container.querySelectorAll("td[data-ref]")].map((td) =>
        td.getAttribute("data-ref"),
      ),
    ).toEqual(["1", "2"]);
  });

  it("recalculates after a source cell is retyped and resets", () => {
    render(<SheetBlock {...base} label="Лист «База»" />);
    fireEvent.click(cell("5"));
    fireEvent.keyDown(cell("5"), { key: "6" });
    const input = screen.getByLabelText("Ячейка C2");
    fireEvent.change(input, { target: { value: "6" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(cell("240")).toBeTruthy();
    expect(screen.getByText(/пересчитано формул: 1/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Вернуть исходные" }));
    expect(cell("200")).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Вернуть исходные" }),
    ).toBeNull();
  });

  it("shows #ЗНАЧ! for text in a number cell and keeps formulas read-only", () => {
    render(<SheetBlock {...base} label="Лист «База»" />);
    fireEvent.doubleClick(cell("40"));
    const input = screen.getByLabelText("Ячейка B2");
    fireEvent.change(input, { target: { value: "сорок" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(cell("#ЗНАЧ!")).toBeTruthy();
    fireEvent.doubleClick(cell("60"));
    expect(screen.queryByLabelText("Ячейка D3")).toBeNull();
    expect(
      screen.getByText(
        "Это формула: её считает таблица. Измени исходные числа.",
      ),
    ).toBeTruthy();
  });

  it("cancels typing with Esc and moves with the arrows", () => {
    render(<SheetBlock {...base} label="Лист «База»" />);
    fireEvent.click(cell("3"));
    fireEvent.keyDown(cell("3"), { key: "F2" });
    const input = screen.getByLabelText("Ячейка C3");
    fireEvent.change(input, { target: { value: "9" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(cell("60")).toBeTruthy();
    fireEvent.keyDown(cell("3"), { key: "ArrowUp" });
    expect(cell("5").getAttribute("aria-selected")).toBe("true");
  });

  it("marks the tab of the sheet a formula reads and keeps it after switching", () => {
    const view = render(<SheetBlock {...books} label="Лист «Операции»" />);
    expect(cell("Выпечка")).toBeTruthy();
    const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");
    expect(tabs[1]?.getAttribute("data-ref")).toBe("2");
    fireEvent.click(tabs[1]!);
    const goods = view.container.querySelector('[data-sheet-name="Товары"]');
    expect(goods?.hasAttribute("hidden")).toBe(false);
    expect(goods?.querySelectorAll("td[data-ref]")).toHaveLength(4);
  });

  it("draws the walls of a field without scripting (Change 184)", () => {
    flags.enhanced = false;
    const [part] = base.sheets;
    const html = renderToStaticMarkup(
      <SheetBlock
        {...base}
        sheets={[{ ...part, walls: { B2: "rb", C3: "t" } }]}
        label="Лист «База»"
      />,
    );
    expect(html.match(/data-wall="[trbl]+"/gu)).toEqual([
      'data-wall="rb"',
      'data-wall="t"',
    ]);
  });

  it("switches sheets with the arrows and keeps a tab stop in the shown grid", () => {
    const view = render(<SheetBlock {...books} label="Лист «Операции»" />);
    const tabs = within(screen.getByRole("tablist")).getAllByRole("tab");
    fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[1]);
    const goods = view.container.querySelector('[data-sheet-name="Товары"]');
    expect(goods?.querySelectorAll('td[tabindex="0"]')).toHaveLength(1);
  });
});

describe("SheetBlock (Change 184)", () => {
  it("selects the cell of a formula listed under the grid", () => {
    render(<SheetBlock {...books} label="Лист «Операции»" />);
    const row = screen.getByRole("button", { name: /B2.*ВПР/u });
    fireEvent.click(row);
    expect(row.getAttribute("aria-current")).toBe("true");
    expect(screen.getByLabelText("Строка формул").textContent).toBe(
      "=ВПР(A2;Товары!$A$2:$B$3;2;0)",
    );
  });

  it("names the sheet of the formulas and the sheets with data only (F12)", () => {
    render(<SheetBlock {...books} label="Лист «Операции»" />);
    expect(screen.getByText("Формулы в ячейках листа «Операции»")).toBeTruthy();
    expect(
      screen.getByText(
        "Нажми на формулу — её ячейка выделится в таблице. На листе «Товары» формул нет — только данные.",
      ),
    ).toBeTruthy();
  });

  it("unfolds a long formula by its arguments on request (F13)", () => {
    const formula =
      '=СУММЕСЛИМН(D2:D3;A2:A3;">=100";B2:B3;"Выпечка";A2:A3;"<=200")';
    const [part] = base.sheets;
    render(
      <SheetBlock
        {...base}
        sheets={[
          {
            ...part,
            inputs: { ...part.inputs, D4: formula },
            formulas: [{ cell: "D4", formula }],
          },
        ]}
        select={["База", "D4"]}
        label="Лист «База»"
      />,
    );
    const bar = screen.getByLabelText("Строка формул");
    expect(bar.textContent).toBe(formula);
    expect(bar.hasAttribute("data-unfolded")).toBe(false);
    const unfold = screen.getByRole("button", {
      name: "Формула по аргументам",
    });
    fireEvent.click(unfold);
    expect(unfold.getAttribute("aria-expanded")).toBe("true");
    expect(bar.hasAttribute("data-unfolded")).toBe(true);
    expect(bar.textContent).toBe(formula);
  });

  it("covers the screen and returns to the page with Esc", () => {
    const view = render(<SheetBlock {...base} label="Лист «База»" />);
    const root = view.container.querySelector("[data-sheet-block]");
    fireEvent.click(
      screen.getByRole("button", { name: "Таблица на весь экран" }),
    );
    expect(root?.hasAttribute("data-expanded")).toBe(true);
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(root?.hasAttribute("data-expanded")).toBe(false);
    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("SheetBlock (Change 225)", () => {
  it("shows a selected copy's own address and formula in the list", () => {
    render(<SheetBlock {...base} label="Лист «База»" />);
    const row = screen.getByRole("button", { name: /D3/u });
    expect(row.getAttribute("aria-current")).toBe("true");
    expect(row.textContent).toContain("копия формулы D2");
    expect(row.textContent).toContain("=B3*C3");
    fireEvent.click(cell("200"));
    const source = screen.getByRole("button", { name: /D2/u });
    expect(source.textContent).toContain("скопирована до D3");
    expect(source.textContent).toContain("=B2*C2");
  });

  it("relates every cell of a rectangle a formula was copied over", () => {
    const table: LessonMediaTypes.Sheet = {
      ...base,
      sheets: [
        {
          ...base.sheets[0],
          inputs: { ...base.sheets[0].inputs, C3: "=B3*C2" },
          formulas: [{ cell: "C2", formula: "=B2*C1", until: "D3" }],
        },
      ],
      select: ["База", "D3"],
    };
    render(<SheetBlock {...table} label="Лист «База»" />);
    expect(
      screen.getByRole("button", { name: /D3/u }).getAttribute("aria-current"),
    ).toBe("true");
  });

  it("starts afresh when the same place shows another lesson's sheet", () => {
    const { container, rerender } = render(
      <SheetBlock {...base} label="Лист «База»" />,
    );
    fireEvent.click(cell("40"));
    rerender(<SheetBlock {...books} label="Лист «Операции»" />);
    const grid = container.querySelector<HTMLElement>(
      '[data-sheet-name="Операции"]',
    );
    expect(grid?.hidden).toBe(false);
    expect(screen.getByLabelText("Адрес ячейки").textContent).toBe(
      "Операции!B2",
    );
  });

  it("keeps the frames of cells on the grid's edge inside them", () => {
    render(<SheetBlock {...base} label="Лист «База»" />);
    expect(cell("Товар").getAttribute("data-at")).toBe("tl");
    expect(cell("60").getAttribute("data-at")).toBe("br");
    expect(cell("40").getAttribute("data-at")).toBeNull();
  });
});

describe("FillSandbox (Change 177)", () => {
  it("copies the formula and marks the moved parts", () => {
    const view = render(
      <FillSandbox defaultFormula="=$A2*B$1" origin="B2" defaultTarget="D4" />,
    );
    expect(view.container.querySelector("code")?.textContent).toBe("=$A4*D$1");
    expect(
      [...view.container.querySelectorAll("mark")].map((m) => m.textContent),
    ).toEqual(["4", "D"]);
    expect(
      screen.getByText(
        "Копия сдвинута на 2 строки вниз и на 2 столбца вправо.",
      ),
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Формула в B2"), {
      target: { value: "=A1*2" },
    });
    fireEvent.change(screen.getByLabelText("Копируем в"), {
      target: { value: "B1" },
    });
    expect(view.container.querySelector("code")?.textContent).toBe(
      "=#ССЫЛКА!*2",
    );
    expect(screen.getByText(/Адрес ушёл за край листа/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Копируем в"), {
      target: { value: "D" },
    });
    expect(
      screen.getByText(
        "Адрес ячейки: буквы столбца и номер строки, например D4.",
      ),
    ).toBeTruthy();
  });

  it("keeps the worked example without scripting", () => {
    flags.enhanced = false;
    const html = renderToStaticMarkup(
      <FillSandbox defaultFormula="=$A2*B$1" origin="B2" defaultTarget="D4" />,
    );
    expect(html).toContain("=$A2*B$1");
    expect(html).toContain("В D4 окажется");
    expect(html).not.toContain("<input");
  });
});

describe("FormulaBlock (Change 184, display line)", () => {
  it("shows the cell and the formula with function names and template slots", () => {
    const html = renderToStaticMarkup(
      <FormulaBlock
        label="Шаблон формулы"
        lines={[
          { cell: "B2", formula: "=$A2*B$1" },
          { formula: '=ЕСЛИ(условие;"да";0)' },
        ]}
      />,
    );
    expect(html).toContain('aria-label="Шаблон формулы"');
    expect(html).toContain(">B2</span>");
    expect(html).not.toContain(">fx<");
    expect(html).toMatch(/<span class="[^"]*function[^"]*">ЕСЛИ<\/span>/);
    expect(html).toMatch(/<span class="[^"]*slot[^"]*">условие<\/span>/);
    // quoted text is not a slot
    expect(html).toContain("&quot;да&quot;");
    expect(html).not.toMatch(/slot[^"]*">да</);
  });

  it("shows the value of a cell after its formula", () => {
    const html = renderToStaticMarkup(
      <FormulaBlock
        label="Формула"
        lines={[
          {
            cell: "H2",
            formula: "=ВПР(C2;'Магазин'!$A$2:$C$4;2;0)",
            result: "Северный",
          },
        ]}
      />,
    );
    expect(html).toMatch(/data-formula-result[^>]*>.*результат: .*Северный/);
  });

  it("copies the formulas without the cell addresses", () => {
    const write = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { clipboard: { writeText: write } });
    render(
      <FormulaBlock
        label="Формула"
        lines={[{ cell: "G2", formula: "=СЧЁТЕСЛИ($A2:$F2;A2)" }]}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Скопировать формулу" }),
    );
    expect(write).toHaveBeenCalledWith("=СЧЁТЕСЛИ($A2:$F2;A2)");
  });
});

describe("KeyCombo (Change 177)", () => {
  it("draws every key as a keycap joined by a hidden plus", () => {
    const html = renderToStaticMarkup(
      <KeyCombo keys={["Ctrl", "Shift", "стрелка"]} />,
    );
    expect(html.match(/<kbd/g)).toHaveLength(3);
    expect(html).toContain(">Shift</kbd>");
    expect(html.match(/aria-hidden="true">\+</g)).toHaveLength(2);
  });
});
