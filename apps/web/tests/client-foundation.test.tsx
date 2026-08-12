import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "~/shared/components/empty-state";
import { RoutePending } from "~/shared/components/route-state";
import { AppNavigationProgress } from "~/shared/components/navigation-progress";
import { createAppQueryClient } from "~/shared/lib/query-client";
import { render } from "./render";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useRouterState: vi.fn(
      (options: { select: (state: { isLoading: boolean }) => unknown }) =>
        options.select({ isLoading: false }),
    ),
  };
});

describe("client foundation states", () => {
  it("creates isolated query clients with requests configured for no retries", () => {
    const first = createAppQueryClient();
    const second = createAppQueryClient();

    expect(first).not.toBe(second);
    expect(first.getDefaultOptions().queries?.retry).toBe(false);
    expect(first.getDefaultOptions().mutations?.retry).toBe(false);
  });

  it("announces route loading and renders a semantic empty state", () => {
    const { unmount } = render(<RoutePending />);
    expect(screen.getByRole("status").textContent).toContain("Загружаем");
    unmount();

    render(
      <EmptyState title="Пока пусто" description="Данные появятся позже" />,
    );
    expect(screen.getByRole("heading", { name: "Пока пусто" })).toBeTruthy();
    expect(screen.getByText("Данные появятся позже")).toBeTruthy();
  });

  it("gives the navigation progress indicator an accessible name", () => {
    render(<AppNavigationProgress />);

    expect(
      screen.getByRole("progressbar", { name: "Загрузка страницы" }),
    ).toBeTruthy();
  });
});
