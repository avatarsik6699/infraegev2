import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  AppNavigationProgress,
  createAppQueryClient,
  RouteNotFound,
  RouteError,
} from "~/app";
import { EmptyState } from "~/shared/components/empty-state";
import { render } from "./render";

const recoveryMocks = vi.hoisted(() => ({
  invalidate: vi.fn(),
  reload: vi.fn(),
  loading: false,
  loaderError: false,
}));
vi.mock("~/shared/lib/document-recovery", () => ({
  documentRecovery: {
    reload: recoveryMocks.reload,
    isChunkLoadError: (error: Error) =>
      error.message.includes("dynamically imported module"),
  },
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    createLink:
      (Component: React.ComponentType<React.ComponentProps<"a">>) =>
      ({
        to,
        children,
        ...props
      }: React.ComponentProps<"a"> & { to: string }) => (
        <Component href={to} {...props}>
          {children}
        </Component>
      ),
    Link: ({
      children,
      to,
      ...props
    }: React.ComponentProps<"a"> & { to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
    useRouter: () => ({ invalidate: recoveryMocks.invalidate }),
    useRouterState: vi.fn(() => ({
      isLoading: recoveryMocks.loading,
      matches: recoveryMocks.loaderError ? [{ status: "error" }] : [],
    })),
  };
});

describe("client foundation states", () => {
  it("offers one recovery destination within the missing-page scene", () => {
    const { container } = render(<RouteNotFound />);
    const links = container.querySelectorAll("[data-status-scene] a");
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe("/");
    expect(links[0]?.textContent).toContain("На главную");
  });

  it("creates isolated query clients with requests configured for no retries", () => {
    const first = createAppQueryClient();
    const second = createAppQueryClient();

    expect(first).not.toBe(second);
    expect(first.getDefaultOptions().queries?.retry).toBe(false);
    expect(first.getDefaultOptions().mutations?.retry).toBe(false);
  });

  it("renders a semantic empty state", () => {
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

  it("reruns a failed loader once and disables retry while it is in flight", async () => {
    let finish: () => void = () => undefined;
    recoveryMocks.invalidate.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    const reset = vi.fn();
    recoveryMocks.loaderError = true;
    render(
      <RouteError
        error={new Error("loader failed")}
        info={{ componentStack: "at MatchInnerImpl" }}
        reset={reset}
      />,
    );
    const button = screen.getByRole("button", { name: "Повторить" });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(recoveryMocks.invalidate).toHaveBeenCalledTimes(1);
    expect(button.hasAttribute("disabled")).toBe(true);
    expect(reset).not.toHaveBeenCalled();
    await act(async () => {
      finish();
    });
    await waitFor(() => expect(button.hasAttribute("disabled")).toBe(false));
  });

  it("resets render failures without rerunning a loader", () => {
    const reset = vi.fn();
    recoveryMocks.loaderError = false;
    const calls = recoveryMocks.invalidate.mock.calls.length;
    render(
      <RouteError
        error={new Error("render failed")}
        info={{ componentStack: "at lesson" }}
        reset={reset}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Повторить" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(recoveryMocks.invalidate.mock.calls.length).toBe(calls);
  });

  it("reloads the document explicitly for a failed module", () => {
    render(
      <RouteError
        error={new Error("Failed to fetch dynamically imported module")}
        reset={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Обновить страницу" }));
    expect(recoveryMocks.reload).toHaveBeenCalledOnce();
  });

  it("shows delayed progress and removes it when navigation finishes", () => {
    vi.useFakeTimers();
    recoveryMocks.loading = true;
    const view = render(<AppNavigationProgress />);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(
      screen.getByRole("progressbar", { name: "Загрузка страницы" }),
    ).toBeTruthy();
    recoveryMocks.loading = false;
    view.rerender(<AppNavigationProgress />);
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(screen.queryByRole("progressbar")).toBeNull();
    vi.useRealTimers();
  });

  it("does not flash progress for a transition shorter than 150ms", () => {
    vi.useFakeTimers();
    recoveryMocks.loading = true;
    const view = render(<AppNavigationProgress />);
    act(() => {
      vi.advanceTimersByTime(149);
    });
    expect(screen.queryByRole("progressbar")).toBeNull();
    recoveryMocks.loading = false;
    view.rerender(<AppNavigationProgress />);
    act(() => {
      vi.runOnlyPendingTimers();
    });
    expect(screen.queryByRole("progressbar")).toBeNull();
    vi.useRealTimers();
  });
});
