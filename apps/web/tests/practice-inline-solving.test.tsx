import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PracticeTaskList } from "~/pages/practice-catalog/components/practice-task-list";
import { PracticeProgressProvider } from "~/features/practice-progress";
import type { PracticeTaskWidgetTypes } from "~/widgets/practice-task";
import type { PracticeCatalogTypes } from "~/entities/practice-task";
import { ApiError } from "~/shared/api";

const mocks = vi.hoisted(() => ({ load: vi.fn(), check: vi.fn() }));
vi.mock("~/widgets/practice-task/api/get-practice-task", () => ({
  getPracticeTask: mocks.load,
}));
vi.mock("~/features/lesson-practice/api/check-practice-answer", () => ({
  checkPracticeAnswer: mocks.check,
}));
vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

function detail(id: string, revision = 1): PracticeTaskWidgetTypes.Result {
  return {
    status: "ready",
    links: [{ href: "/ege/16-rekursiya", label: "Теория рекурсии" }],
    detail: {
      task: {
        id,
        title: id,
        solutionRevision: revision,
        difficulty: 1,
        difficultyLabel: "Базовая",
        answerInstruction:
          "Запишите целое число в десятичной системе счисления.",
        statement: [{ type: "text", text: `Условие ${id}` }],
        hint: [{ type: "text", text: `Подсказка ${id}` }],
        solution: [{ type: "text", text: `Разбор ${id}` }],
        theoryLinks: [],
      },
      sources: [],
      theoryLinks: [],
      catalogVisible: true,
      answerInstruction: "Запишите целое число в десятичной системе счисления.",
      examNumbers: [16],
      difficulty: 2,
      estimatedMinutes: null,
    },
  };
}
function entry(id: string): PracticeCatalogTypes.Entry {
  return {
    id,
    title: id,
    answer_instruction: "Запишите целое число в десятичной системе счисления.",
    short_description: "Краткое условие",
    difficulty: 1,
    estimated_minutes: null,
    solution_revision: 1,
    skills: ["recursion"],
    exam_numbers: [16],
  };
}
function rows(key = "selection") {
  return (
    <PracticeProgressProvider>
      <PracticeTaskList
        key={key}
        tasks={["first", "second"].map(entry)}
        search={{}}
        skills={[{ value: "recursion", label: "Рекурсия" }]}
      />
    </PracticeProgressProvider>
  );
}
const row = (index: number) => within(screen.getAllByRole("listitem")[index]!);
async function open(id = "first") {
  fireEvent.click(screen.getByRole("button", { name: id }));
  await screen.findByText(`Условие ${id}`);
}

describe("inline solving", () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.load
      .mockReset()
      .mockImplementation(({ data }: { data: string }) =>
        Promise.resolve(detail(data)),
      );
    mocks.check
      .mockReset()
      .mockResolvedValue({ correct: false, explanation: "" });
  });
  it("loads on demand, keeps independent drafts/help on collapse, resets on selection change", async () => {
    const view = render(rows());
    expect(screen.getAllByText("Целое число")).toHaveLength(2);
    expect(mocks.load).not.toHaveBeenCalled();
    await open();
    await open("second");
    fireEvent.change(row(0).getByRole("textbox"), { target: { value: "123" } });
    fireEvent.change(row(1).getByRole("textbox"), { target: { value: "456" } });
    fireEvent.click(row(0).getByRole("button", { name: "Подсказка" }));
    fireEvent.click(row(0).getByRole("button", { name: "first" }));

    expect(row(0).queryByRole("textbox")).toBeNull();
    await open();
    expect((row(0).getByRole("textbox") as HTMLInputElement).value).toBe("123");
    expect((row(1).getByRole("textbox") as HTMLInputElement).value).toBe("456");
    expect(
      row(0)
        .getByRole("button", { name: "Скрыть подсказку" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(mocks.load).toHaveBeenCalledTimes(2);
    view.rerender(rows("new-selection"));
    await open();
    expect((row(0).getByRole("textbox") as HTMLInputElement).value).toBe("");
  });
  it("expands the current page, preserves drafts on collapse and respects individual toggles", async () => {
    const view = render(rows());
    const expand = screen.getByRole("button", { name: "Раскрыть все" });
    expect(screen.queryByRole("button", { name: "Свернуть все" })).toBeNull();
    fireEvent.click(expand);
    await screen.findByText("Условие second");
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(expand.getAttribute("aria-expanded")).toBe("true");
    fireEvent.change(row(0).getByRole("textbox"), { target: { value: "123" } });
    fireEvent.click(row(0).getByRole("button", { name: "Подсказка" }));
    fireEvent.click(row(1).getByRole("button", { name: "second" }));
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(expand);
    fireEvent.click(screen.getByRole("button", { name: "Свернуть все" }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    fireEvent.click(expand);
    expect((row(0).getByRole("textbox") as HTMLInputElement).value).toBe("123");
    expect(
      row(0).getByRole("button", { name: "Скрыть подсказку" }),
    ).toBeTruthy();
    expect(mocks.load).toHaveBeenCalledTimes(2);
    view.rerender(rows("new-page"));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });
  it("keeps other tasks usable when bulk loading fails locally", async () => {
    mocks.load.mockResolvedValueOnce({
      status: "unavailable",
      detail: null,
      links: [],
    });
    render(rows());
    fireEvent.click(screen.getByRole("button", { name: "Раскрыть все" }));
    await screen.findByText("Условие second");
    fireEvent.click(
      screen.getByRole("button", { name: "Повторить загрузку задачи" }),
    );
    await screen.findByText("Условие first");
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });
  it("retains input through stale refresh and service failure, checks the new revision", async () => {
    render(rows());
    await open();
    fireEvent.change(row(0).getByRole("textbox"), { target: { value: "42" } });
    mocks.check.mockRejectedValueOnce(
      new ApiError("http", "stale", { status: 409 }),
    );
    fireEvent.click(row(0).getByRole("button", { name: "Проверить" }));
    await screen.findByRole("button", { name: "Обновить условие" });
    mocks.load.mockRejectedValueOnce(new Error("offline"));
    fireEvent.click(row(0).getByRole("button", { name: "Обновить условие" }));
    await screen.findByText(/Не удалось проверить ответ/);
    expect((row(0).getByRole("textbox") as HTMLInputElement).value).toBe("42");
    mocks.check.mockRejectedValueOnce(
      new ApiError("http", "stale", { status: 409 }),
    );
    fireEvent.click(row(0).getByRole("button", { name: "Проверить" }));
    await screen.findByRole("button", { name: "Обновить условие" });
    mocks.load.mockResolvedValueOnce(detail("first", 2));
    fireEvent.click(row(0).getByRole("button", { name: "Обновить условие" }));
    await waitFor(() =>
      expect(
        row(0).queryByRole("button", { name: "Обновить условие" }),
      ).toBeNull(),
    );
    expect((row(0).getByRole("textbox") as HTMLInputElement).value).toBe("42");
    mocks.check.mockResolvedValueOnce({ correct: true, explanation: "" });
    fireEvent.click(row(0).getByRole("button", { name: "Проверить" }));
    await screen.findByRole("button", { name: "Решить ещё раз" });
    expect(mocks.check).toHaveBeenLastCalledWith("first", "42", 2);
    expect(row(0).getByRole("status").textContent).toBe("Ответ принят");
    expect(row(0).queryByText("Верно.")).toBeNull();
    expect(row(0).queryByText("Эта версия задачи решена.")).toBeNull();
    expect(row(0).getByRole("textbox").getAttribute("data-solved")).toBe(
      "true",
    );
    fireEvent.click(row(0).getByRole("button", { name: "Решить ещё раз" }));
    await waitFor(() =>
      expect((row(0).getByRole("textbox") as HTMLInputElement).disabled).toBe(
        false,
      ),
    );
    expect(document.activeElement).toBe(row(0).getByRole("textbox"));

    expect(localStorage.getItem("infraege:practice-progress")).toContain(
      '"2":"42"',
    );
    expect(localStorage.getItem("infraege:lesson-progress:v2")).toBeNull();
  });
  it("does not steal focus when a hidden check completes or is reopened", async () => {
    let resolve!: (value: { correct: boolean; explanation: string }) => void;
    mocks.check.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    render(rows());
    await open();
    await open("second");
    fireEvent.change(row(0).getByRole("textbox"), { target: { value: "1" } });
    fireEvent.click(row(0).getByRole("button", { name: "Проверить" }));
    fireEvent.click(row(0).getByRole("button", { name: "first" }));
    act(() => row(1).getByRole("textbox").focus());
    await act(async () => {
      resolve({ correct: false, explanation: "" });
    });
    expect(document.activeElement).toBe(row(1).getByRole("textbox"));
    await open();
    expect(document.activeElement).toBe(row(1).getByRole("textbox"));
  });
  it("labels the catalog answer and associates incorrect feedback without duplicate progress copy", async () => {
    render(rows());
    await open();
    const input = row(0).getByRole("textbox", { name: "Ваш ответ" });
    fireEvent.change(input, { target: { value: "wrong" } });
    fireEvent.click(row(0).getByRole("button", { name: "Проверить" }));
    const error = await screen.findByText(/Ответ пока не подходит/);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
      error.id,
    );
    expect(
      row(0).queryByText(/Прогресс сохраняется в этом браузере/),
    ).toBeNull();
    expect(row(0).getByRole("link", { name: /^Теория$/ })).toBeTruthy();
    expect(
      row(0).queryByText(
        "Запишите целое число в десятичной системе счисления.",
      ),
    ).toBeNull();
    expect(row(0).getByRole("heading", { name: "16 номер" })).toBeTruthy();
  });
  it("deduplicates loading, retries locally and isolates missing tasks", async () => {
    let resolve!: (value: PracticeTaskWidgetTypes.Result) => void;
    mocks.load.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    render(rows());
    const trigger = screen.getByRole("button", { name: "first" });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(mocks.load).toHaveBeenCalledTimes(1);
    await act(async () => {
      resolve({ status: "unavailable", detail: null, links: [] });
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Повторить загрузку задачи" }),
    );
    await screen.findByText("Условие first");
    mocks.load.mockResolvedValueOnce({
      status: "missing",
      detail: null,
      links: [],
    });
    fireEvent.click(screen.getByRole("button", { name: "second" }));
    await screen.findByText(/Задача больше недоступна/);
    expect((row(0).getByRole("textbox") as HTMLInputElement).disabled).toBe(
      false,
    );
  });
});
