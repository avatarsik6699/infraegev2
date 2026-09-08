import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TopicCatalogPage } from "~/pages/topic-catalog";

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
    const RouterLink = ({
      children,
      params,
      to,
      ...props
    }: React.ComponentProps<"a"> & {
      to: string;
      params?: Record<string, string>;
    }) => {
      const href = Object.entries(params ?? {}).reduce(
        (path, [key, value]) => path.replace(`$${key}`, value),
        to,
      );
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    };

    return {
      ...actual,
      createLink:
        (Component: React.ComponentType<React.ComponentProps<"a">>) =>
        ({
          children,
          params,
          to,
          ...props
        }: React.ComponentProps<"a"> & {
          to: string;
          params?: Record<string, string>;
        }) => {
          const href = Object.entries(params ?? {}).reduce(
            (path, [key, value]) => path.replace(`$${key}`, value),
            to,
          );
          return (
            <Component href={href} {...props}>
              {children}
            </Component>
          );
        },
      Link: RouterLink,
    };
  },
);

describe("TopicCatalogPage", () => {
  it("renders the complete catalog and links only published topics", () => {
    const { container } = render(<TopicCatalogPage />);
    const cards = container.querySelectorAll("[data-topic-card]");

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Темы ЕГЭ по информатике",
    );
    expect(cards).toHaveLength(25);
    expect(
      container.querySelectorAll('[data-topic-status="published"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-topic-status="planned"]'),
    ).toHaveLength(23);
    expect(screen.getAllByRole("link", { name: "Открыть тему" })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole("navigation", { name: "Разделы сайта" }),
    ).toHaveLength(2);
    expect(
      screen.getByText("25 тем для всех 27 заданий", { exact: true }),
    ).not.toBeNull();
    expect(
      container
        .querySelector('a[href^="https://fipi.ru/"]')
        ?.getAttribute("data-hierarchy"),
    ).toBe("drawn");
    expect(
      screen.queryByText(/Не обязательно идти с первого номера/),
    ).toBeNull();
    expect(screen.queryByText("Можно изучать")).toBeNull();
    expect(container.querySelectorAll('img[src^="/topics/"]')).toHaveLength(2);
    expect(container.querySelectorAll("[data-topic-media]")).toHaveLength(25);
    expect(container.querySelectorAll("[data-topic-footer]")).toHaveLength(25);
    expect(container.querySelectorAll("[data-topic-placeholder]")).toHaveLength(
      23,
    );
    const publishedDecorations = Array.from(
      container.querySelectorAll(
        '[data-topic-status="published"] [aria-hidden="true"]',
      ),
    );
    expect(
      publishedDecorations.some(
        (element) => element.textContent?.trim() === "05",
      ),
    ).toBe(true);
    expect(
      publishedDecorations.some(
        (element) => element.textContent?.trim() === "16",
      ),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: "Открыть тему" })[0]
        .getAttribute("href"),
    ).toBe("/ege/5-preobrazovanie-zapisey-chisel");
    expect(screen.getByText("Задания 19–21")).not.toBeNull();
    expect(screen.getAllByText("Скоро")).toHaveLength(23);
    expect(container.querySelectorAll("[data-badge]")).toHaveLength(23);
  });
});
