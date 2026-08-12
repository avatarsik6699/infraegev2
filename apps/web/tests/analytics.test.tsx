import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "~/entities/content";
import { PracticeTaskWidget } from "~/features/check-answer";
import { trackTopicView } from "~/shared/lib/analytics";
import { render } from "./render";

const task: Task = {
  id: "analytics-task",
  topic_ids: ["analytics-topic"],
  statement: "Введите ответ",
  checker_type: "exact_match",
  answer_variants: ["да"],
  interaction_type: "production",
  explanation: [],
  difficulty: 1,
  is_interleaving_eligible: true,
};

type AnalyticsWindow = Window & {
  umami?: { track: ReturnType<typeof vi.fn> };
};

beforeEach(() => {
  Object.defineProperty(navigator, "doNotTrack", {
    configurable: true,
    value: "0",
  });
});

describe("privacy-minimized analytics", () => {
  it("tracks only allowlisted practice metadata without the submitted answer", async () => {
    const track = vi.fn();
    (window as AnalyticsWindow).umami = { track };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ correct: false, explanation: [] }),
      })),
    );

    render(
      <PracticeTaskWidget
        task={task}
        analytics={{ topicId: "analytics-topic", taskIndex: 2, totalTasks: 5 }}
      />,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Ответ" }), {
      target: { value: "секретный ответ" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    await screen.findByText("Неверно.");

    expect(track).toHaveBeenCalledWith("practice_start", {
      topic_id: "analytics-topic",
      total_tasks: 5,
    });
    expect(track).toHaveBeenCalledWith("practice_answer", {
      topic_id: "analytics-topic",
      task_index: 2,
      result: "wrong",
    });
    expect(JSON.stringify(track.mock.calls)).not.toContain("секретный ответ");
  });

  it("does not track when Do Not Track is enabled", () => {
    const track = vi.fn();
    (window as AnalyticsWindow).umami = { track };
    Object.defineProperty(navigator, "doNotTrack", {
      configurable: true,
      value: "1",
    });

    trackTopicView("dnt-topic");
    expect(track).not.toHaveBeenCalled();
  });

  it("shows retryable feedback when the answer API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 503 })),
    );

    render(<PracticeTaskWidget task={task} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Ответ" }), {
      target: { value: "ответ" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));

    const errorMessage = await screen.findByText(
      "Не удалось проверить ответ. Попробуйте ещё раз.",
    );
    expect(errorMessage.closest('[role="alert"]')).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: "Проверить" })
        .hasAttribute("disabled"),
    ).toBe(false);
  });
});
