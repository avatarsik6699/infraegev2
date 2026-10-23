import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "~/shared/components/code-block";
import {
  Checkpoint,
  checkMask,
  LessonDiagram,
  LessonSummary,
  RemainderExplorer,
  remainderLayout,
  TokenSet,
  TopicCheatSheet,
  VariantPicker,
  LessonStepper,
  LessonTable,
  MaskSandbox,
  ProofDisclosure,
  segmentByMask,
  disclosureLabel,
  disclosurePurpose,
} from "~/shared/components/learning-content";

const flags = vi.hoisted(() => ({ enhanced: true, reducedMotion: false }));
vi.mock("~/shared/lib/use-is-enhanced", () => ({
  useIsEnhanced: () => flags.enhanced,
}));
vi.mock("~/shared/lib/media-query", () => ({
  useMediaQuery: () => flags.reducedMotion,
}));

afterEach(() => {
  flags.enhanced = true;
  flags.reducedMotion = false;
  vi.useRealTimers();
});

const svg = (mark: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 660 214"><text font-family="inherit">${mark}</text></svg>`;
const frames = [
  { svg: svg("кадр 1"), caption: "Проверяем 1." },
  { svg: svg("кадр 2"), caption: "Проверяем 2." },
  { svg: svg("кадр 3"), caption: "Стоп." },
] as const;

describe("LessonTable", () => {
  it("is a semantic table whose numeric columns are marked and scroll in place", () => {
    const { container } = render(
      <LessonTable
        label="Пары делителей 36"
        columns={[{ label: "Ширина", numeric: true }, { label: "Проверка" }]}
        rows={[
          ["1", "1 · 36 = 36"],
          ["2", "2 · 18 = 36"],
        ]}
      />,
    );
    const region = screen.getByRole("region", { name: "Пары делителей 36" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(
      [...container.querySelectorAll("th")].map((th) =>
        th.getAttribute("scope"),
      ),
    ).toEqual(["col", "col"]);
    expect(container.querySelectorAll("td[data-numeric]")).toHaveLength(2);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(2);
  });
});

describe("ProofDisclosure", () => {
  it("keeps the whole proof in the page, closed by default", () => {
    const html = renderToStaticMarkup(
      <ProofDisclosure summary="Доказательство для любого числа n">
        <p>Пусть n = d · q.</p>
      </ProofDisclosure>,
    );
    expect(html).toMatch(/^<details(?![^>]*\bopen\b)/u);
    expect(html).toContain("<summary");
    expect(html).toContain("Доказательство для любого числа n");
    expect(html).toContain("Пусть n = d · q.");
  });
});

describe("LessonDiagram", () => {
  it("draws the generated SVG inline in the page font with its size reserved", () => {
    const html = renderToStaticMarkup(
      <LessonDiagram
        svg={svg("36 клеток")}
        width={660}
        height={320}
        alt="Прямоугольники из 36 клеток"
        caption="Ширина и высота — пара делителей."
      />,
    );
    const { container } = render(
      <div dangerouslySetInnerHTML={{ __html: html }} />,
    );
    const picture = container.querySelector(
      'figure[data-lesson-diagram] [role="img"]',
    )!;
    expect(picture.getAttribute("aria-label")).toBe(
      "Прямоугольники из 36 клеток",
    );
    expect(picture.getAttribute("style")).toContain("aspect-ratio:660 / 320");
    expect(picture.querySelector("svg text")?.getAttribute("font-family")).toBe(
      "inherit",
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelectorAll("figcaption")).toHaveLength(1);
  });
});

describe("LessonStepper", () => {
  it("without scripting shows the final frame and every step as text", () => {
    flags.enhanced = false;
    const { container } = render(
      <LessonStepper
        label="Поиск по шагам"
        width={660}
        height={214}
        frames={frames}
      />,
    );
    const pictures = container.querySelectorAll('[role="img"]');
    expect(pictures).toHaveLength(1);
    expect(pictures[0]?.textContent).toBe("кадр 3");
    expect(
      [...container.querySelectorAll("[data-stepper-steps] li")].map(
        (item) => item.textContent,
      ),
    ).toEqual(frames.map(({ caption }) => caption));
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("steps by hand from the first frame and announces each caption", () => {
    render(
      <LessonStepper
        label="Поиск по шагам"
        width={660}
        height={214}
        frames={frames}
      />,
    );
    const caption = document.querySelector("[data-stepper-caption]")!;
    expect(caption.getAttribute("aria-live")).toBe("polite");
    expect(caption.textContent).toBe("Проверяем 1.");
    const previous = screen.getByRole("button", { name: "Предыдущий шаг" });
    expect(previous.hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Следующий шаг" }));
    expect(caption.textContent).toBe("Проверяем 2.");
    expect(screen.getByText("2 / 3")).toBeTruthy();
    expect(
      screen.getByRole("slider", { name: "Шаг схемы: Поиск по шагам" }),
    ).toHaveProperty("value", "1");
    fireEvent.click(previous);
    expect(caption.textContent).toBe("Проверяем 1.");
  });

  it("plays only on request and stops on the last frame", () => {
    vi.useFakeTimers();
    render(
      <LessonStepper
        label="Поиск по шагам"
        width={660}
        height={214}
        frames={frames}
      />,
    );
    const caption = document.querySelector("[data-stepper-caption]")!;
    act(() => vi.advanceTimersByTime(5000));
    expect(caption.textContent).toBe("Проверяем 1.");
    fireEvent.click(screen.getByRole("button", { name: "Воспроизвести" }));
    expect(screen.getByRole("button", { name: "Пауза" })).toBeTruthy();
    act(() => vi.advanceTimersByTime(1600));
    expect(caption.textContent).toBe("Проверяем 2.");
    act(() => vi.advanceTimersByTime(1600));
    expect(caption.textContent).toBe("Стоп.");
    act(() => vi.advanceTimersByTime(5000));
    expect(caption.textContent).toBe("Стоп.");
    expect(screen.getByRole("button", { name: "Воспроизвести" })).toBeTruthy();
  });

  it("keeps manual stepping only under reduced motion", () => {
    flags.reducedMotion = true;
    render(
      <LessonStepper
        label="Поиск по шагам"
        width={660}
        height={214}
        frames={frames}
      />,
    );
    expect(screen.queryByRole("button", { name: "Воспроизвести" })).toBeNull();
    expect(screen.getByRole("button", { name: "Следующий шаг" })).toBeTruthy();
  });
});

describe("mask segmentation", () => {
  it.each([
    ["12*3?", "120034", ["12", "00", "3", "4"]],
    ["12*3?", "1239934", ["12", "399", "3", "4"]],
    ["1*2", "152", ["1", "5", "2"]],
    ["12*3?", "1234", ["12", "", "3", "4"]],
  ])("splits %s / %s like the stand", (mask, value, texts) => {
    expect(segmentByMask(mask, value)?.map(({ text }) => text)).toEqual(texts);
  });

  it("rejects a number that cannot be split and input with letters", () => {
    expect(checkMask("12*3?", "12304")).toEqual({ status: "rejected" });
    expect(checkMask("12*3?", "12a34")).toEqual({ status: "invalid-number" });
    expect(checkMask("12x3?", "1234")).toEqual({ status: "invalid-mask" });
    expect(checkMask("", "1234")).toEqual({ status: "empty" });
  });
});

describe("MaskSandbox", () => {
  it("is an enhancement: without scripting a worked split of the default pair", () => {
    flags.enhanced = false;
    const { container } = render(
      <MaskSandbox defaultMask="12*3?" defaultNumber="120034" />,
    );
    expect(container.querySelector("input")).toBeNull();
    expect(container.textContent).toContain("Звёздочка заменяет «00».");
  });

  it("re-splits the number as the learner types", () => {
    render(<MaskSandbox defaultMask="12*3?" defaultNumber="120034" />);
    expect(screen.getByText("Подходит. Звёздочка заменяет «00».")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Число"), {
      target: { value: "12304" },
    });
    expect(
      screen.getByText("Не подходит: число нельзя разбить по частям маски."),
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Маска"), {
      target: { value: "1*2" },
    });
    fireEvent.change(screen.getByLabelText("Число"), {
      target: { value: "152" },
    });
    expect(screen.getByText("Подходит. Звёздочка заменяет «5».")).toBeTruthy();
  });
});

describe("CodeBlock output", () => {
  it("shows what the program prints under the code, line by line as on screen", () => {
    const { container } = render(
      <CodeBlock
        code={"for n in range(10, 13):\n    print(n)"}
        label="Перебор"
        language="python"
        output={"10\n11\n12\n"}
      />,
    );
    const output = container.querySelector("[data-code-output]")!;
    expect(output.textContent).toBe("Вывод:10\n11\n12");
    expect(output.querySelector("samp")?.textContent).toBe("10\n11\n12");
  });
});

describe("VariantPicker", () => {
  const variants = [
    { label: "кратно 7", value: "n % 7 == 0" },
    { label: "не кратно 7", value: "n % 7 != 0", note: "остаток не ноль" },
  ] as const;

  it("lists every variant without scripting", () => {
    flags.enhanced = false;
    const { container } = render(
      <VariantPicker label="Формулировка" variants={variants} />,
    );
    expect(
      [...container.querySelectorAll("dt")].map((dt) => dt.textContent),
    ).toEqual(["кратно 7", "не кратно 7"]);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("shows one chosen variant and announces the change", () => {
    const { container } = render(
      <VariantPicker
        label="Формулировка"
        variants={variants}
        defaultIndex={1}
      />,
    );
    const result = container.querySelector("[data-variant-result]")!;
    expect(result.getAttribute("aria-live")).toBe("polite");
    // Change 184: the chosen chip captions its value
    expect(result.textContent).toBe("не кратно 7n % 7 != 0остаток не ноль");
    const first = screen.getByRole("button", { name: "кратно 7" });
    expect(first.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(first);
    expect(first.getAttribute("aria-pressed")).toBe("true");
    expect(result.textContent).toBe("кратно 7n % 7 == 0");
  });
});

describe("TokenSet", () => {
  it("emphasises the chosen members and reads them out", () => {
    const { container } = render(
      <TokenSet values={[1, 2, 3, 4, 6, 12]} selected={[2, 4, 6, 12]} />,
    );
    expect(
      [...container.querySelectorAll("[data-on]")].map((t) => t.textContent),
    ).toEqual(["2", "4", "6", "12"]);
    expect(container.textContent).toContain("2, 4, 6, 12");
  });
});

describe("RemainderExplorer", () => {
  it("lays out portions like figures.remainder_svg and wraps long rows", () => {
    expect(remainderLayout(17, 5)).toMatchObject({
      quotient: 3,
      remainder: 2,
      summaryY: 118,
      height: 136,
    });
    expect(
      remainderLayout(17, 5).portions.map((p) => [p.x, p.size, p.rest]),
    ).toEqual([
      [20, 5, false],
      [198, 5, false],
      [376, 5, false],
      [554, 2, true],
    ]);
    expect(remainderLayout(20, 5).portions.every((p) => !p.rest)).toBe(true);
    expect(remainderLayout(3, 7).portions).toEqual([
      { x: 20, y: 16, size: 3, rest: true },
    ]);
    expect(
      new Set(remainderLayout(40, 2).portions.map((p) => p.y)).size,
    ).toBeGreaterThan(1);
  });

  it("is static without scripting and changes n, d and presets when enhanced", () => {
    flags.enhanced = false;
    const { unmount } = render(
      <RemainderExplorer n={17} d={5} caption="Подпись" />,
    );
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "17 клеток порциями по 5: 3 полные порции и 2 в остатке",
    );
    expect(screen.queryByRole("button")).toBeNull();
    unmount();
    flags.enhanced = true;
    render(<RemainderExplorer n={17} d={5} caption="Подпись" />);
    fireEvent.click(screen.getByRole("button", { name: "Увеличить n" }));
    expect(screen.getByRole("img").getAttribute("aria-label")).toContain(
      "18 клеток порциями по 5",
    );
    fireEvent.click(screen.getByRole("button", { name: "3 и 7" }));
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "3 клетки порциями по 7: 0 полных порций и 3 в остатке",
    );
  });
});

describe("TopicCheatSheet", () => {
  it("keeps the solving order, every subtopic block and the final checks", () => {
    const { container } = render(
      <TopicCheatSheet
        label="Задание 25 на одной схеме"
        flow={[
          { name: "Кандидаты", note: "что перебрать" },
          { name: "Проверка", note: "условие в код" },
        ]}
        groups={[
          {
            number: 1,
            title: <a href="/p">Перебор</a>,
            rows: [{ key: "range", note: "отрезок" }],
          },
          {
            number: 6,
            title: "Вид числа",
            level: "дополнительный урок",
            rows: [],
          },
        ]}
        sections={[
          {
            title: "Откуда брать",
            rows: [{ key: "кратные", note: "делимость" }],
            columns: true,
            note: "сравнить",
          },
          { title: "Три вопроса", steps: ["Пропуск?", "Лишнее?", "Вывод?"] },
        ]}
        caption="Шпаргалка"
      />,
    );
    expect(container.querySelectorAll("ol li")).toHaveLength(5);
    expect(screen.getByRole("link", { name: "Перебор" })).toBeTruthy();
    expect(container.textContent).toContain("дополнительный урок");
    expect(container.querySelectorAll("figcaption")).toHaveLength(1);
  });
});

describe("ProofDisclosure purpose (Change 184 F14)", () => {
  it("names why a closed block stands apart from the step", () => {
    expect(disclosurePurpose("Почему сумма цифр даёт тот же остаток")).toBe(
      "Обоснование",
    );
    expect(
      disclosurePurpose(
        "Другой способ отбора: список подходящих ID и СЧЁТЕСЛИ",
      ),
    ).toBe("Другой способ");
    expect(disclosurePurpose("Тот же ответ без программы")).toBe(
      "Другой способ",
    );
    expect(disclosurePurpose("То же правило для любых частот и длин")).toBe(
      "Общий случай",
    );
    expect(disclosurePurpose("Формула числа сочетаний через факториал")).toBe(
      "Формула",
    );
    expect(disclosurePurpose("Разбор второй половины программы")).toBe(
      "Подробный разбор",
    );
    expect(disclosureLabel("Почему так для любого составного n")).toBe(
      "Обоснование · необязательно",
    );
    expect(
      disclosureLabel("Другой способ отбора: список подходящих ID и СЧЁТЕСЛИ"),
    ).toBe("Необязательно");
  });
});

describe("Checkpoint (Change 184, variant A)", () => {
  const items = [
    { id: "a", prompt: <>Что означает строка?</>, reveal: <>Одну выдачу.</> },
    { id: "b", prompt: <>Где ключ?</>, reveal: <>В первом столбце.</> },
  ];

  it("is a titled region of question tabs with closed answers (Change 186 F54)", () => {
    const { container } = render(<Checkpoint items={items} headingOrder={3} />);
    const region = screen.getByRole("region", { name: "Проверьте себя" });
    expect(region.querySelector("h3")?.textContent).toBe("Проверьте себя");
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Вопрос 1",
      "Вопрос 2",
    ]);
    const shown = (text: string) =>
      !screen
        .getByText(text)
        .closest('[role="tabpanel"]')
        ?.hasAttribute("hidden");
    expect(shown("Что означает строка?")).toBe(true);
    expect(shown("Где ключ?")).toBe(false);
    fireEvent.click(screen.getByRole("tab", { name: "Вопрос 2" }));
    expect(shown("Где ключ?")).toBe(true);
    expect(shown("Что означает строка?")).toBe(false);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(2);
    expect([...details].some((d) => d.open)).toBe(false);
    // the question is text, not the toggle: links and terms work inside it
    expect(details[0].querySelector("summary")?.textContent).not.toContain(
      "Что означает",
    );
  });

  it("opens one answer, captioned «Ответ», from its toggle", () => {
    const { container } = render(<Checkpoint items={items} />);
    const first = container.querySelector("details")!;
    fireEvent.click(first.querySelector("summary")!);
    first.open = true;
    expect(first.textContent).toContain("ОтветОдну выдачу.");
    expect(container.querySelectorAll("details[open]")).toHaveLength(1);
  });
});

describe("LessonSummary (Change 184, variant C)", () => {
  it("shows keys over notes, and a keyless item as one line", () => {
    const { container } = render(
      <LessonSummary
        items={[
          { key: <>Первичный ключ</>, note: <>различает записи</> },
          { note: <>Строка — запись.</> },
        ]}
      />,
    );
    const items = container.querySelectorAll("[data-lesson-summary] > li");
    expect(items).toHaveLength(2);
    expect(items[0].children).toHaveLength(2);
    expect(items[0].textContent).toBe("Первичный ключразличает записи");
    expect(items[1].children).toHaveLength(1);
  });
});
