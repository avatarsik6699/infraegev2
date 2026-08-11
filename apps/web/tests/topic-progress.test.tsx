import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Task, Topic } from "~/entities/content";
import { getTopicProgress } from "~/features/track-progress";
import { TopicPage } from "~/pages/topic";
import { render } from "./render";

vi.mock("~/entities/content", () => ({
  PrerequisiteCallout: () => null,
}));

const tasks: Task[] = Array.from({ length: 5 }, (_, index) => ({
  id: `task-${index + 1}`,
  topic_ids: ["topic-a"],
  statement: `Задача ${index + 1}`,
  checker_type: "exact_match",
  answer_variants: ["да"],
  interaction_type: "production",
  explanation: [],
  difficulty: 1,
  is_interleaving_eligible: true,
}));

const topic: Topic = {
  id: "topic-a",
  task_numbers: [1],
  title: "Тестовая тема",
  summary: "Тест",
  sections: [
    {
      id: "idea",
      role: "idea",
      title: "Идея",
      blocks: [],
    },
  ],
  quick_reference_blocks: [],
  learning_outcomes: ["Решать тестовую задачу"],
  prerequisites: [],
  mastery_threshold: 0.8,
  related_topics: [],
  practice_task_ids: tasks.map((task) => task.id),
  status: "review",
  access_tier: "free",
};

function renderTopic() {
  return render(
    <TopicPage topic={topic} tasks={tasks} prerequisites={[]} related={[]} />,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("topic practice progress", () => {
  it("counts distinct correct tasks and marks mastery at four of five", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({ correct: true, explanation: [] }),
      })),
    );
    renderTopic();

    expect(screen.getByRole("link", { name: /Идея/ }).getAttribute("href")).toBe(
      "#idea",
    );
    expect(
      screen.getByRole("link", { name: /К практике/ }).getAttribute("href"),
    ).toBe("#practice");

    const inputs = screen.getAllByRole("textbox", { name: "Ответ" });
    const buttons = screen.getAllByRole("button", { name: "Проверить" });
    for (let index = 0; index < 4; index += 1) {
      fireEvent.change(inputs[index], { target: { value: "да" } });
      fireEvent.click(buttons[index]);
      await waitFor(() =>
        expect(
          screen.getByRole("progressbar").getAttribute("aria-valuenow"),
        ).toBe(String((index + 1) * 20)),
      );
    }

    expect(screen.getByText("Тема освоена")).toBeTruthy();
    fireEvent.click(buttons[0]);
    await waitFor(() =>
      expect(getTopicProgress(topic.id, tasks.map((task) => task.id))).toEqual({
        correctCount: 4,
        totalCount: 5,
        ratio: 0.8,
        mastered: true,
      }),
    );
  });

  it("allows a wrong attempt to be retried without counting the wrong result", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ correct: false, explanation: [] }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ correct: true, explanation: [] }),
      });
    vi.stubGlobal("fetch", fetchMock);
    renderTopic();

    const input = screen.getAllByRole("textbox", { name: "Ответ" })[0];
    const button = screen.getAllByRole("button", { name: "Проверить" })[0];
    fireEvent.change(input, { target: { value: "нет" } });
    fireEvent.click(button);
    await screen.findByText("Неверно.");
    expect(getTopicProgress(topic.id, tasks.map((task) => task.id)).ratio).toBe(0);

    fireEvent.change(input, { target: { value: "да" } });
    fireEvent.click(button);
    await screen.findByText("Верно!");
    expect(getTopicProgress(topic.id, tasks.map((task) => task.id)).ratio).toBe(0.2);
  });
});
