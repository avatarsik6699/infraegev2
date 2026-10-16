import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { PracticeTaskHelp } from "~/features/lesson-practice/components/practice-task-help";

const helpTask = (
  hint: boolean,
  solution: boolean,
): PracticeTaskTypes.Task => ({
  id: "optional-help",
  title: "Задача без обязательного разбора",
  solutionRevision: 1,
  difficulty: 1,
  difficultyLabel: "Лёгкая",
  statement: [{ type: "text", text: "Найдите ответ." }],
  hint: hint ? [{ type: "text", text: "Начните с условия." }] : [],
  solution: solution ? [{ type: "text", text: "Проверьте все варианты." }] : [],
  theoryLinks: [],
});

const view = (task: PracticeTaskTypes.Task) => (
  <PracticeTaskHelp task={task}>
    <button>Проверить</button>
  </PracticeTaskHelp>
);

afterEach(cleanup);

describe("optional practice help", () => {
  it.each([
    [false, false],
    [true, false],
    [false, true],
    [true, true],
  ])(
    "omits absent help in SSR/no-JS and hydration (hint=%s, solution=%s)",
    (hint, solution) => {
      const task = helpTask(hint, solution);
      const container = document.createElement("div");
      container.innerHTML = renderToString(view(task));
      document.body.appendChild(container);
      // No-script CSS may reveal hidden panels, so absent help must not exist in HTML.
      for (const [kind, present] of [
        ["hint", hint],
        ["solution", solution],
      ] as const) {
        expect(
          container.querySelectorAll(`[data-practice-help="${kind}"]`),
        ).toHaveLength(present ? 1 : 0);
        expect(
          container.querySelectorAll(`[aria-controls="${kind}-${task.id}"]`),
        ).toHaveLength(present ? 1 : 0);
      }
      expect(
        within(container).getByRole("button", { name: "Проверить" }),
      ).toBeTruthy();
      const hydrated = render(view(task), { container, hydrate: true });
      for (const [kind, present, label] of [
        ["hint", hint, "Подсказка"],
        ["solution", solution, "Решение"],
      ] as const) {
        const button = within(container).queryByRole("button", { name: label });
        const panel = container.querySelector<HTMLElement>(
          `[data-practice-help="${kind}"]`,
        );
        if (!present) {
          expect(button).toBeNull();
          expect(panel).toBeNull();
          continue;
        }
        expect(panel?.hidden).toBe(true);
        fireEvent.click(button!);
        expect(button?.getAttribute("aria-expanded")).toBe("true");
        expect(panel?.hidden).toBe(false);
        fireEvent.click(button!);
        expect(panel?.hidden).toBe(true);
      }
      hydrated.unmount();
      container.remove();
    },
  );
});
