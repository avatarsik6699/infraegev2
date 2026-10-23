import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "~/shared/components/code-block";
import {
  CodeRunner,
  type LessonMediaTypes,
  LessonTheory,
  ProofDisclosure,
  RangeSandbox,
  parseWhole,
  rangeValues,
  sliceIndexes,
} from "~/shared/components/learning-content";

const flags = vi.hoisted(() => ({ enhanced: true }));
vi.mock("~/shared/lib/use-is-enhanced", () => ({
  useIsEnhanced: () => flags.enhanced,
}));

afterEach(() => {
  flags.enhanced = true;
});

describe("CodeBlock output (Change 175, 197)", () => {
  it("keeps the lines, shows typed input as a key and the error in red", () => {
    const html = renderToStaticMarkup(
      <CodeBlock
        code={'name = input("Имя? ")\nprint(1 / 0)'}
        label="Пример"
        language="python"
        fileName="greet.py"
        output={"Имя? ⟪Анна⟫\n10"}
        error={"ZeroDivisionError: division by zero"}
      />,
    );
    expect(html).toContain("greet.py");
    expect(html).toMatch(
      /<svg[^>]*lucide-square-terminal[^>]*>.*?<\/svg>Вывод:/su,
    );
    expect(html).toMatch(/<kbd[^>]*>Анна<span[^>]*aria-label="Enter"[^>]*>↵/u);
    expect(html).toMatch(/data-code-error[^>]*>ZeroDivisionError/u);
    expect(html).not.toContain("⟪");
  });

  it("folds output longer than eight lines behind «Показать весь вывод»", () => {
    render(
      <CodeBlock
        code="for i in range(12):\n    print(i)"
        label="Длинный вывод"
        language="python"
        output={Array.from({ length: 12 }, (_, i) => String(i)).join("\n")}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Показать весь вывод" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(
      screen
        .getByRole("button", { name: "Свернуть вывод" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("shows every output line by line, in the topics too (Change 197)", () => {
    const html = renderToStaticMarkup(
      <CodeBlock
        code="print(1)\nprint(2)"
        label="Ряд"
        language="python"
        output={"1\n2"}
      />,
    );
    expect(html).toContain("1\n2");
    expect(html).not.toContain("1, 2");
  });
});

const step = (
  line: number | null,
  text: string,
  out: string,
  names: LessonMediaTypes.RunName[],
  extra: Partial<LessonMediaTypes.RunStep> = {},
): LessonMediaTypes.RunStep => ({
  line,
  text,
  kind: "line",
  frames: [{ title: "программа", names }],
  objs: {},
  out,
  ...extra,
});

const run: LessonMediaTypes.Run = {
  kind: "run",
  code: "x = 5\nprint(x)\nprint(1 / 0)",
  fileName: "demo.py",
  output: "5",
  error: "ZeroDivisionError: division by zero",
  steps: [
    step(null, "Программа ещё не запущена.", "", [], { kind: "start" }),
    step(1, "`x` получает значение `5`.", "", [
      { n: "x", v: "5", ref: null, ch: true },
    ]),
    step(2, "На экран выводится «5».", "5\n", [
      { n: "x", v: "5", ref: null, ch: false },
    ]),
    step(
      3,
      "Ошибка: программа остановлена.",
      "5\n",
      [{ n: "x", v: "5", ref: null, ch: false }],
      {
        kind: "error",
        stop: true,
        error: "ZeroDivisionError: division by zero",
      },
    ),
  ],
};

describe("CodeRunner (Change 175)", () => {
  it("without scripting is the ordinary code block with its output", () => {
    flags.enhanced = false;
    const html = renderToStaticMarkup(<CodeRunner {...run} label="Демо" />);
    expect(html).toContain("demo.py");
    expect(html).toContain("ZeroDivisionError");
    expect(html).not.toContain("Запуск");
  });

  it("steps through the recorded run by buttons and keys", () => {
    render(<CodeRunner {...run} label="Демо" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Выполнить программу по шагам" }),
    );
    const root = document.querySelector("[data-code-runner]") as HTMLElement;
    expect(root.dataset.running).toBe("true");
    expect(screen.getByText("1 / 3")).not.toBeNull();
    const current = () =>
      root.querySelector('[data-current] [class*="noteLine"]')?.textContent;
    expect(current()).toBe("Строка 1:");
    expect(root.querySelector('[data-active="current"]')).not.toBeNull();
    fireEvent.keyDown(root, { key: "ArrowRight" });
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(screen.getByText("3 / 3")).not.toBeNull();
    expect(root.querySelector('[data-active="error"]')).not.toBeNull();
    const shownOutput = root.querySelector("[data-current] [data-code-error]");
    expect(shownOutput?.textContent).toContain("ZeroDivisionError");
    expect(
      screen
        .getByRole("button", { name: "Следующий шаг" })
        .hasAttribute("disabled"),
    ).toBe(true);
    fireEvent.keyDown(root, { key: "Escape" });
    expect(root.dataset.running).toBeUndefined();
    expect(
      screen.getByRole("button", { name: "Выполнить программу по шагам" }),
    ).not.toBeNull();
  });

  it("explains a step with code in backticks as inline code", () => {
    render(<CodeRunner {...run} label="Демо" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Выполнить программу по шагам" }),
    );
    const note = document.querySelector("[data-current] [class*='noteLine']")
      ?.parentElement as HTMLElement;
    expect(within(note).getByText("x").tagName).toBe("CODE");
  });
});

describe("RangeSandbox values follow Python (Change 175)", () => {
  it("range: stop excluded, negative step, empty result", () => {
    expect(rangeValues(2, 9, 3)).toEqual([2, 5, 8]);
    expect(rangeValues(5, 0, -2)).toEqual([5, 3, 1]);
    expect(rangeValues(5, 0, 1)).toEqual([]);
    expect(rangeValues(0, 5, 0)).toEqual([]);
  });

  it("slices: omitted bounds, negative indexes, steps and overflow", () => {
    const s = "ABCDEFG";
    const take = (a: number | null, b: number | null, st: number) =>
      sliceIndexes(a, b, st, s.length)
        .map((k) => s[k])
        .join("");
    expect(take(1, 4, 1)).toBe("BCD");
    expect(take(null, null, -1)).toBe("GFEDCBA");
    expect(take(5, 1, -1)).toBe("FEDC");
    expect(take(5, -1, -1)).toBe("");
    expect(take(null, 100, 1)).toBe(s);
    expect(take(-3, null, 1)).toBe("EFG");
    expect(take(null, null, 2)).toBe("ACEG");
  });

  it("reads whole numbers and rejects the rest", () => {
    expect(parseWhole(" −3 ")).toBe(-3);
    expect(parseWhole("")).toBeNull();
    expect(Number.isNaN(parseWhole("2.5"))).toBe(true);
  });

  it("explains an empty range and a zero step", () => {
    render(<RangeSandbox mode="range" start={2} stop={9} step={3} />);
    expect(screen.getByText(/\[2, 5, 8\]/u)).not.toBeNull();
    fireEvent.change(screen.getByLabelText("step"), {
      target: { value: "-1" },
    });
    expect(screen.getByText(/пусто: при шаге -1/u)).not.toBeNull();
    fireEvent.change(screen.getByLabelText("step"), { target: { value: "0" } });
    expect(screen.getByText(/шаг не может быть нулём/u)).not.toBeNull();
  });

  it("draws the default slice without scripting", () => {
    flags.enhanced = false;
    const html = renderToStaticMarkup(
      <RangeSandbox mode="slice" start={1} stop={4} step={1} text="ABCDEFG" />,
    );
    expect(html).toContain("s[1:4] → &#x27;BCD&#x27;");
    expect(html).not.toContain("<input");
  });
});

describe("Course lesson text blocks (Change 175 review)", () => {
  it("shows the lead without a heading of its own", () => {
    const html = renderToStaticMarkup(
      <LessonTheory
        variant="page"
        conceptHeadingOrder={2}
        concepts={[
          {
            id: "intro",
            navLabel: "Вступление",
            lead: true,
            explanation: <p>Главное.</p>,
          },
          { id: "s1", navLabel: "Шаг", explanation: <p>Шаг.</p> },
        ]}
      />,
    );
    expect(html).not.toContain("Вступление");
    expect(html).toMatch(/<h2[^>]*>Шаг<\/h2>/u);
  });

  it("marks «Тонкости» with its own look and splits the topic", () => {
    const html = renderToStaticMarkup(
      <ProofDisclosure kind="nuance" summary="Тонкости: округление дробных">
        <p>Текст.</p>
      </ProofDisclosure>,
    );
    expect(html).toContain('data-kind="nuance"');
    expect(html).toMatch(/>Тонкости:<\/span><span[^>]*>округление дробных</u);
  });
});
