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
    expect(
      container.querySelectorAll('[data-topic-status="published"] a'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-topic-status="planned"] a'),
    ).toHaveLength(0);
    expect(
      screen
        .getByRole("link", { name: "Преобразование записей чисел" })
        .getAttribute("href"),
    ).toBe("/ege/5-preobrazovanie-zapisey-chisel");
    expect(
      screen
        .getByRole("link", { name: "Рекурсивные алгоритмы" })
        .getAttribute("href"),
    ).toBe("/ege/16-rekursiya");
    expect(screen.getByText("Задания 19–21")).not.toBeNull();
    expect(screen.getAllByText("В плане")).toHaveLength(23);
  });
});
