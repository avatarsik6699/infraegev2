import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";
import { PracticeTaskPage } from "~/pages/practice-task";
import { PracticeProgressProvider } from "~/features/practice-progress";
import type { PracticeTaskWidgetTypes } from "~/widgets/practice-task";

const mocks = vi.hoisted(() => ({
  check: vi.fn(),
  refresh: vi.fn(),
  invalidate: vi.fn(),
}));
vi.mock("~/widgets/practice-task/api/get-practice-task", () => ({
  getPracticeTask: mocks.refresh,
}));
vi.mock("~/features/lesson-practice/api/check-practice-answer", () => ({
  checkPracticeAnswer: mocks.check,
}));
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ invalidate: mocks.invalidate }),
}));
vi.mock("~/widgets/public-header", () => ({ PublicHeader: () => null }));
vi.mock("~/widgets/public-footer", () => ({ PublicFooter: () => null }));
vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({
    to,
    children,
    ariaLabel,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
    ariaLabel?: string;
    [key: string]: unknown;
  }) => (
    <a {...rest} href={to} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

const result: PracticeTaskWidgetTypes.Result = {
  status: "ready",
  links: [{ href: "/ege/16-rekursiya", label: "Рекурсия" }],
  detail: {
    task: {
      id: "detail-task",
      title: "Вычисление функции",
      solutionRevision: 1,
      difficulty: 2,
      difficultyLabel: "Средняя",
      statement: [{ type: "text", text: "Вычислите F(5)." }],
      hint: [{ type: "text", text: "Начните с базы." }],
      solution: [{ type: "text", text: "Получится 42." }],
      theoryLinks: [],
    },
    sources: [
      {
        kind: "unknown",
        primary: true,
        role: "original",
        title: null,
        author: null,
        year: null,
        url: null,
        original_id: null,
        adaptation: null,
      },
    ],
    theoryLinks: [],
    answerInstruction: "Запишите целое число в десятичной системе счисления.",
    catalogVisible: true,
    examNumbers: [16],
    difficulty: 2,
    estimatedMinutes: null,
  },
};
function page(value = result) {
  return (
    <PracticeProgressProvider>
      <PracticeTaskPage
        result={value}
        search={{
          topics: ["ege-16"],
          q: "функция",
          page: 2,
          limit: 10,
          sort: "difficulty_desc",
        }}
      />
    </PracticeProgressProvider>
  );
}
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
it("renders the compact detail and one context-preserving return link in SSR", () => {
  const html = renderToStaticMarkup(page());
  expect(html).toContain("16 номер. Рекурсия");
  expect(html).toContain('data-layout="compact"');
  expect(html).toContain("Вычислите F(5).");
  expect(html).toContain("Начните с базы.");
  expect(html).toContain("Получится 42.");
  expect(html).not.toContain("Источник не указан");
  expect(html).not.toContain("Следующая задача");
  render(page());
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "16 номер. Рекурсия",
  );
  expect(
    screen.queryByRole("heading", { name: "Вычисление функции" }),
  ).toBeNull();
  expect(screen.getByText("Вычисление функции").tagName).toBe("P");
  expect(screen.getByText("Средняя")).not.toBeNull();
  expect(screen.getByText("Целое число", { exact: true })).not.toBeNull();
  const back = screen.getByRole("link", { name: "К списку задач" });
  const url = new URL(back.getAttribute("href")!, "http://localhost");
  expect(url.searchParams.get("topics")).toBe("ege-16");
  expect(url.searchParams.get("q")).toBe("функция");
  expect(url.searchParams.get("page")).toBe("2");
  expect(url.searchParams.get("limit")).toBe("10");
  expect(url.searchParams.get("sort")).toBe("difficulty_desc");
});
it("keeps one retry action next to an accepted answer and preserves progress on reload", async () => {
  mocks.check.mockResolvedValue({ correct: true, explanation: "" });
  const view = render(page());
  const input = await screen.findByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "42" } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  await screen.findByRole("button", { name: "Решить ещё раз" });
  expect(
    screen.getAllByRole("button", { name: "Решить ещё раз" }),
  ).toHaveLength(1);
  expect((input as HTMLInputElement).disabled).toBe(true);
  view.unmount();
  render(page());
  await screen.findByRole("button", { name: "Решить ещё раз" });
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("42");
  fireEvent.click(screen.getByRole("button", { name: "Решить ещё раз" }));
  expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(
    false,
  );
  fireEvent.click(screen.getByRole("button", { name: "Подсказка" }));
  fireEvent.click(screen.getByRole("button", { name: "Решение" }));
  expect(
    screen.getByRole("heading", { name: "Подсказка", level: 2 }),
  ).not.toBeNull();
  expect(
    screen.getByRole("heading", { name: "Решение", level: 2 }),
  ).not.toBeNull();
});
it("retains the answer on checker failure and associates feedback with its field", async () => {
  mocks.check.mockRejectedValue(new Error("offline"));
  render(page());
  const input = screen.getByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "123" } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  await screen.findByRole("alert");
  expect((input as HTMLInputElement).value).toBe("123");
  expect(
    document.getElementById(input.getAttribute("aria-describedby")!)
      ?.textContent,
  ).toBe("Не удалось проверить ответ. Попробуйте ещё раз.");
});
it("shows an icon-only return link with a keyboard tooltip", async () => {
  render(page());
  const back = screen.getByRole("link", { name: "К списку задач" });
  expect(back.textContent).toBe("");
  fireEvent.focus(back);
  expect((await screen.findByRole("tooltip")).textContent).toBe(
    "К списку задач",
  );
});
