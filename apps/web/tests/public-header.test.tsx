import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PublicHeader } from "~/widgets/public-header";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      children,
      params,
      to,
      ...props
    }: React.ComponentProps<"a"> & {
      to: string;
      params?: { courseSlug?: string };
    }) => (
      <a
        href={
          params?.courseSlug ? to.replace("$courseSlug", params.courseSlug) : to
        }
        {...props}
      >
        {children}
      </a>
    ),
  };
});

describe("PublicHeader", () => {
  it("renders the infraege identity and honest home navigation", () => {
    const { container } = render(<PublicHeader home />);

    expect(container.querySelector("[data-public-header]")).not.toBeNull();
    expect(container.querySelector("[data-infraege-mark]")).not.toBeNull();
    expect(screen.getByText("infraege", { exact: true })).not.toBeNull();
    expect(
      screen.getByText("подготовка к ЕГЭ по информатике", { exact: true }),
    ).not.toBeNull();
    expect(screen.getByText("просто", { exact: true })).not.toBeNull();
    expect(screen.getByText("понятно", { exact: true })).not.toBeNull();
    expect(screen.getByText("бесплатно", { exact: true })).not.toBeNull();
    expect(
      container.querySelectorAll("[data-infraege-benefits] i"),
    ).toHaveLength(2);
    expect(screen.queryByText("beta", { exact: true })).toBeNull();
    expect(screen.queryByText("v1.0.0", { exact: true })).toBeNull();
    expect(screen.getByLabelText("infraege — ЕГЭ информатика")).not.toBeNull();
    expect(
      screen
        .getAllByRole("link", { name: "Мини-курсы" })[0]
        .getAttribute("href"),
    ).toBe("/courses/python");
    expect(screen.queryByText("скоро", { exact: true })).toBeNull();
    expect(container.querySelectorAll('[aria-disabled="true"]')).toHaveLength(
      8,
    );
    expect(screen.queryByText("Войти", { exact: true })).toBeNull();
    expect(screen.queryByText("Регистрация", { exact: true })).toBeNull();
    expect(screen.queryByRole("link", { name: "Регистрация" })).toBeNull();
  });

  it("keeps the compact internal identity linked to home", () => {
    render(<PublicHeader />);

    expect(
      screen
        .getByRole("link", {
          name: "infraege — ЕГЭ информатика, на главную",
        })
        .getAttribute("href"),
    ).toBe("/");
    expect(
      screen.queryByRole("navigation", { name: "Разделы сайта" }),
    ).toBeNull();
    expect(screen.queryByText("просто", { exact: true })).toBeNull();
  });
});
