import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  AppNavigationProgress,
  createAppQueryClient,
  RoutePending,
} from "~/app";
import { EmptyState } from "~/shared/components/empty-state";
import { render } from "./render";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: React.ComponentProps<"a"> & { to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useRouterState: vi.fn(() => ({ isLoading: false, matches: [] })),
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
    const { container, unmount } = render(<RoutePending />);
    expect(screen.getByRole("status").textContent).toContain("Загружаем");
    expect(container.querySelector("[data-route-state-frame]")).not.toBeNull();
    expect(container.querySelector("[data-public-header]")).not.toBeNull();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
    unmount();

    render(
      <EmptyState title="Пока пусто" description="Данные появятся позже" />,
    );
    expect(screen.getByRole("heading", { name: "Пока пусто" })).toBeTruthy();
    expect(screen.getByText("Данные появятся позже")).toBeTruthy();
  });

  it("keeps an idle navigation progress indicator out of the accessibility tree", () => {
    render(<AppNavigationProgress />);

    expect(
      screen.queryByRole("progressbar", { name: "Загрузка страницы" }),
    ).toBeNull();
  });
});
