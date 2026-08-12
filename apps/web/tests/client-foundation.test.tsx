import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Task } from "~/entities/content";
import { PracticeTaskWidget } from "~/features/check-answer";
import { ContentBlockList } from "~/entities/content-block";
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

const task: Task = {
  id: "form-task",
  topic_ids: ["forms"],
  statement: "Введите ответ",
  checker_type: "exact_match",
  answer_variants: ["да"],
  interaction_type: "production",
  explanation: [],
  difficulty: 1,
  is_interleaving_eligible: true,
};

describe("client foundation states", () => {
  it("validates a blank answer without making a request and returns focus", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<PracticeTaskWidget task={task} />);

    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

    const input = await screen.findByRole("textbox", { name: /Ответ/ });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input).toBe(document.activeElement);
    expect(fetchMock).not.toHaveBeenCalled();
  });

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

  it("renders code content while the highlighter loads", async () => {
    render(
      <ContentBlockList
        blocks={[
          {
            type: "code_example",
            data: {
              code: "const answer = 42;",
              language: "typescript",
              caption: "Пример",
            },
          },
        ]}
      />,
    );

    expect(await screen.findByText("const answer = 42;")).toBeTruthy();
    expect(screen.getByText("Пример")).toBeTruthy();
  });
});
