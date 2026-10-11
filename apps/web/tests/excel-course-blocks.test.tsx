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
    expect(html).toContain("Формулы: ");
    expect(html).toContain("<code>D2: =B2*C2</code>, скопирована до D3");
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

describe("FormulaBlock (Change 177 F9)", () => {
  it("shows the cell, fx and the formula with function names and template slots", () => {
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
    expect(html.match(/>fx</g)).toHaveLength(2);
    expect(html).toMatch(/<span class="[^"]*function[^"]*">ЕСЛИ<\/span>/);
    expect(html).toMatch(/<span class="[^"]*slot[^"]*">условие<\/span>/);
    // quoted text is not a slot
    expect(html).toContain("&quot;да&quot;");
    expect(html).not.toMatch(/slot[^"]*">да</);
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
