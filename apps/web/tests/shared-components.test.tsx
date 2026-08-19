import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "~/shared/components/badge";
import { Accordion } from "~/shared/components/accordion";
import { Button } from "~/shared/components/button";
import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { Field } from "~/shared/components/field";
import { Image } from "~/shared/components/image";
import { Notation } from "~/shared/components/notation";
import { PageContainer } from "~/shared/components/page-container";
import { Progress } from "~/shared/components/progress";
import {
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "~/shared/components/tabs";
import { Typography } from "~/shared/components/typography";
import { render } from "./render";

const { copyText } = vi.hoisted(() => ({
  copyText: vi.fn(async () => true),
}));

vi.mock("~/shared/lib/clipboard", () => ({ copyText }));

describe("ExternalLink", () => {
  it("stays in the current tab by default", () => {
    render(<ExternalLink href="https://example.com">Справка</ExternalLink>);
    const link = screen.getByRole("link", { name: "Справка" });
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
  });

  it("announces and secures an explicitly new tab", () => {
    render(
      <ExternalLink href="https://example.com" newTab>
        Справка
      </ExternalLink>,
    );
    const link = screen.getByRole("link", {
      name: "Справка (откроется в новой вкладке)",
    });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("Image", () => {
  it("applies loading defaults to informative images", () => {
    render(<Image src="/diagram.png" alt="Диаграмма" />);
    const image = screen.getByRole("img", { name: "Диаграмма" });
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("decoding")).toBe("async");
  });

  it("removes decorative images from the accessibility tree", () => {
    const result = render(<Image src="/texture.png" decorative />);
    const image = result.container.querySelector("img");
    expect(image?.getAttribute("alt")).toBe("");
    expect(image?.getAttribute("aria-hidden")).toBe("true");
  });

  it("forwards an explicit fallback source", () => {
    render(
      <Image src="/missing.png" fallbackSrc="/fallback.png" alt="Диаграмма" />,
    );
    const image = screen.getByRole("img", { name: "Диаграмма" });
    fireEvent.error(image);
    expect(image.getAttribute("src")).toBe("/fallback.png");
  });

  it("announces a labeled placeholder once an informative image fails", () => {
    render(<Image src="/missing.png" alt="Диаграмма" />);
    fireEvent.error(screen.getByRole("img", { name: "Диаграмма" }));
    const placeholder = screen.getByRole("img", { name: "Диаграмма" });
    expect(placeholder.getAttribute("aria-hidden")).toBeNull();
  });

  it("keeps a decorative image's failure placeholder out of the accessibility tree", () => {
    const result = render(<Image src="/missing.png" decorative />);
    const image = result.container.querySelector("img");
    if (!image) throw new Error("expected an img element");
    fireEvent.error(image);
    const placeholder = result.container.querySelector(
      '[role="img"]',
    ) as HTMLElement | null;
    expect(placeholder?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Button", () => {
  it("uses the primary/default semantic contract", () => {
    render(<Button>Проверить</Button>);
    const button = screen.getByRole("button", { name: "Проверить" });
    expect(button.getAttribute("data-hierarchy")).toBe("primary");
    expect(button.getAttribute("data-density")).toBe("default");
  });

  it("disables interaction and exposes busy state while loading", () => {
    render(<Button loading>Проверяем</Button>);
    const button = screen.getByRole("button", { name: "Проверяем" });
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });
});

describe("CodeBlock", () => {
  it("renders synchronous Python tokens and optional line numbers as React nodes", () => {
    const result = render(
      <CodeBlock
        code={"def factorial(n):\n    return n * factorial(n - 1)"}
        label="Рекурсивная функция"
        language="python"
        showLineNumbers
      />,
    );

    expect(
      result.container.querySelector('[data-token="kwd"]')?.textContent,
    ).toBe("def");
    expect(
      result.container.querySelectorAll('[data-token="func"]').length,
    ).toBeGreaterThan(0);
    expect(result.container.querySelector("code")?.textContent).toContain(
      "2    return",
    );
  });

  it("keeps plain text free of syntax-token markup", () => {
    const result = render(
      <CodeBlock code="F(1) = 1" label="Базовый случай" language="text" />,
    );

    expect(result.container.querySelector("[data-token]")).toBeNull();
  });

  it("copies through the browser boundary and announces success", async () => {
    copyText.mockResolvedValueOnce(true);
    render(
      <CodeBlock
        code="return factorial(n - 1)"
        label="Рекурсивный шаг"
        language="python"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Копировать код" }));

    await waitFor(() => {
      expect(copyText).toHaveBeenCalledWith("return factorial(n - 1)");
      expect(screen.getByRole("status").textContent).toBe(
        "Код скопирован в буфер обмена.",
      );
    });
  });

  it("keeps copying retryable when the browser boundary rejects it", async () => {
    copyText.mockResolvedValueOnce(false);
    render(
      <CodeBlock code="F(1) = 1" label="Базовый случай" language="text" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Копировать код" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Не удалось скопировать" }),
      ).toBeTruthy();
      expect(screen.getByRole("status").textContent).toContain(
        "Попробуйте ещё раз",
      );
    });
  });
});

describe("Field and feedback", () => {
  it("ties a visible validation message to the preserved input value", () => {
    render(
      <Field
        label="Ответ"
        description="Введите целое число"
        error="Ответ должен быть целым числом"
        defaultValue="четыре"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Ответ" });
    expect((input as HTMLInputElement).value).toBe("четыре");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("status").textContent).toBe(
      "Ответ должен быть целым числом",
    );
  });

  it("keeps a visually hidden answer label as the accessible name", () => {
    render(
      <Field
        label="Ответ"
        labelVisibility="sr-only"
        placeholder="Без единиц измерения"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Ответ" })).toBeTruthy();
    expect(screen.queryByText("Ответ")).toBeTruthy();
    expect(
      screen
        .getByRole("textbox", { name: "Ответ" })
        .getAttribute("placeholder"),
    ).toBe("Без единиц измерения");
  });
});

describe("Progress and disclosure", () => {
  it("announces a human-readable determinate value", () => {
    render(
      <Progress
        label="Прогресс темы"
        max={5}
        value={3}
        valueText="Решено 3 из 5 задач"
      />,
    );

    const progress = screen.getByRole("progressbar", {
      name: "Прогресс темы",
    });
    expect(progress.getAttribute("aria-valuenow")).toBe("3");
    expect(progress.getAttribute("aria-valuetext")).toBe("Решено 3 из 5 задач");
  });

  it("connects an accordion trigger to its panel", () => {
    render(
      <Accordion
        items={[
          {
            id: "base-case",
            title: "Что делает базовый случай?",
            content: "Останавливает рекурсивные вызовы.",
          },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Что делает базовый случай?",
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("renders accordion content linearly before enhancement", () => {
    const markup = renderToString(
      <Accordion
        items={[
          {
            id: "base-case",
            title: "Что делает базовый случай?",
            content: "Останавливает рекурсивные вызовы.",
          },
        ]}
      />,
    );

    expect(markup).toContain('data-unenhanced-accordion=""');
    expect(markup).toContain("Что делает базовый случай?");
    expect(markup).toContain("Останавливает рекурсивные вызовы.");
    expect(markup).not.toContain('hidden=""');
  });
});

describe("Tabs", () => {
  it("renders every panel as linear semantic content before enhancement", () => {
    const markup = renderToString(
      <TabsRoot value="first" onValueChange={() => undefined}>
        <TabsList label="Разделы" hidden>
          <TabsTab value="first">Первый</TabsTab>
          <TabsTab value="second">Второй</TabsTab>
        </TabsList>
        <TabsPanel value="first">Первое содержимое</TabsPanel>
        <TabsPanel value="second">Второе содержимое</TabsPanel>
      </TabsRoot>,
    );

    expect(markup.match(/data-unenhanced-tab-panel=""/g)).toHaveLength(2);
    expect(markup).toContain("Первое содержимое");
    expect(markup).toContain("Второе содержимое");
    expect(markup).not.toContain('role="tabpanel"');
    expect(markup).not.toContain('inert=""');
  });
});

describe("Badge", () => {
  it("carries its tone as a data attribute for CSS to key off", () => {
    const result = render(<Badge tone="success">решено</Badge>);
    const badge = result.container.querySelector("[data-tone]");
    expect(badge?.getAttribute("data-tone")).toBe("success");
  });

  it("defaults to a neutral semantic tone", () => {
    const result = render(<Badge>разбор</Badge>);
    expect(
      result.container.querySelector("[data-tone]")?.getAttribute("data-tone"),
    ).toBe("neutral");
  });

  it("maps icon to a leading section", () => {
    render(<Badge icon={<span data-testid="icon" />}>решено</Badge>);
    expect(screen.getByTestId("icon")).toBeTruthy();
  });
});

describe("Notation", () => {
  it("renders a code fragment as a <code> element", () => {
    render(<Notation kind="code">countdown(n)</Notation>);
    expect(screen.getByText("countdown(n)").tagName).toBe("CODE");
  });

  it("renders a formula as a <var> element, defaulting kind to code", () => {
    render(<Notation kind="formula">F(n)</Notation>);
    expect(screen.getByText("F(n)").tagName).toBe("VAR");
    render(<Notation>x</Notation>);
    expect(screen.getByText("x").tagName).toBe("CODE");
  });
});

describe("Typography and PageContainer", () => {
  it("preserves semantic heading and main landmarks", () => {
    render(
      <PageContainer>
        <Typography.Title order={2}>Раздел</Typography.Title>
        <Typography.Text>Содержимое раздела</Typography.Text>
      </PageContainer>,
    );
    expect(screen.getByRole("main")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
      "Раздел",
    );
    expect(screen.getByText("Содержимое раздела").tagName).toBe("P");
    expect(
      screen.getByText("Содержимое раздела").getAttribute("data-variant"),
    ).toBe("body");
  });
});
