import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import {
  createLocalPracticeChecker,
  LessonPractice,
} from "~/features/lesson-practice";
import { render } from "./render";

const task: PracticeTaskTypes.LocalTask = {
  id: "rich-task",
  difficultyLabel: "Средняя",
  title: "Разберите данные",
  statement: [
    { type: "text", text: "Вызовите `countdown(2)`." },
    {
      type: "list",
      style: "unordered",
      items: ["Прочитайте код", "Сверьте строки"],
    },
    {
      type: "code",
      language: "python",
      code: "print(2)",
      caption: "Код условия",
    },
    {
      type: "table",
      headers: ["n", "Результат"],
      rows: [["2", "?"]],
      caption: "Данные",
    },
    {
      type: "image",
      src: "/content/tasks/rich-task/image.png",
      alt: "Числовая схема",
      caption: "Опорное изображение",
      width: 640,
      height: 360,
    },
    {
      type: "attachment",
      src: "/content/tasks/rich-task/data.txt",
      label: "data.txt",
      description: "Исходные данные",
      mimeType: "text/plain",
      sizeBytes: 6,
    },
  ],
  hint: [{ type: "callout", tone: "idea", text: "Начните с базового случая." }],
  solution: [
    {
      type: "diagram",
      src: "/content/tasks/rich-task/diagram.webp",
      alt: "Схема вызовов",
      caption: "Движение к базовому случаю",
      width: 640,
      height: 360,
      purpose: "Удержать порядок вызовов",
      accessibleDescription: "Второй вызов ведёт к первому, затем к нулевому.",
      pointers: [{ label: "Ноль", description: "Базовый случай" }],
    },
  ],
  answers: ["2"],
  explanation: "Верно.",
  theoryLinks: [],
};

describe("rich practice content", () => {
  it("explains an empty practice without constructing empty tabs", () => {
    render(
      <LessonPractice
        tasks={[]}
        solvedTaskIds={[]}
        acceptedAnswers={{}}
        checkAnswer={vi.fn()}
        onTaskSolved={() => 0}
      />,
    );
    expect(
      screen.getByText("В этом уроке нет практических заданий"),
    ).toBeTruthy();
    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("keeps service failures separate from answer validation and preserves input for explicit retry", async () => {
    const checker = vi
      .fn()
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockResolvedValueOnce({ correct: true, explanation: "Верно." });
    render(
      <LessonPractice
        tasks={[task]}
        solvedTaskIds={[]}
        acceptedAnswers={{}}
        checkAnswer={checker}
        onTaskSolved={() => 1}
      />,
    );
    const input = screen.getByRole("textbox", {
      name: "Ответ",
    }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    await screen.findByRole("alert");
    expect(input.value).toBe("2");
    expect(input.getAttribute("aria-invalid")).not.toBe("true");
    expect(checker).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    await waitFor(() => expect(checker).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });
  it("keeps every authored block in server-rendered HTML", () => {
    const html = renderToStaticMarkup(
      <LessonPractice
        tasks={[task]}
        solvedTaskIds={[]}
        acceptedAnswers={{}}
        checkAnswer={createLocalPracticeChecker([task])}
        onTaskSolved={() => 0}
      />,
    );

    expect(html).toContain("countdown(2)");
    expect(html).toContain("<ul");
    expect(html).toContain("<table");
    expect(html).toContain("<img");
    expect(html).toContain('href="/content/tasks/rich-task/data.txt"');
    expect(html).toContain("Второй вызов ведёт к первому");
    expect(html).not.toContain("opacity:0");
  });

  it("renders semantic content and independent help disclosures", () => {
    render(
      <LessonPractice
        tasks={[task]}
        solvedTaskIds={[]}
        acceptedAnswers={{}}
        checkAnswer={createLocalPracticeChecker([task])}
        onTaskSolved={() => 0}
      />,
    );

    expect(screen.getByRole("table", { name: "Данные" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Числовая схема" })).toBeTruthy();
    const download = screen.getByRole("link", { name: /data\.txt/ });
    expect(download.getAttribute("download")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Подсказка" }));
    expect(screen.getByText("Начните с базового случая.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Решение" }));
    expect(screen.getByText("Удержать порядок вызовов")).toBeTruthy();
  });
});
