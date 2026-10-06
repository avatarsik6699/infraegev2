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
  session: {
    account: null as { id: string } | null,
    csrfToken: null as string | null,
    status: "ready" as const,
    refresh: vi.fn(),
  },
}));
vi.mock("~/widgets/practice-task/api/get-practice-task", () => ({
  getPracticeTask: mocks.refresh,
}));
vi.mock(
  "~/features/lesson-practice/api/check-practice-answer",
  async (importOriginal: () => Promise<object>) => ({
    ...(await importOriginal()),
    checkPracticeAnswer: mocks.check,
  }),
);
vi.mock("~/features/account", () => ({
  useAccountSession: () => mocks.session,
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
function page(value = result, key = "initial") {
  return (
    <PracticeProgressProvider accountId={mocks.session.account?.id}>
      <PracticeTaskPage
        key={key}
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
  mocks.session.account = null;
  mocks.session.csrfToken = null;
});
it("renders the detail layout and one context-preserving return link in SSR", () => {
  const html = renderToStaticMarkup(page());
  expect(html).toContain("ЕГЭ 16 · Рекурсия");
  expect(html).toContain('data-presentation="detail"');
  expect(html).toContain("Вычислите F(5).");
  expect(html).toContain("Начните с базы.");
  expect(html).toContain("Получится 42.");
  expect(html).not.toContain("Источник не указан");
  expect(html).not.toContain("Следующая задача");
  render(page());
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Вычисление функции",
  );
  expect(screen.getByText("ЕГЭ 16 · Рекурсия").tagName).toBe("P");
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
it("keeps retry feedback locally but no guest progress after reload", async () => {
  mocks.check.mockResolvedValue({ correct: true, explanation: "" });
  const view = render(page());
  const input = await screen.findByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "42" } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  await screen.findByText("Верно. Ответ принят.");
  expect(screen.queryByRole("button", { name: "Решить ещё раз" })).toBeNull();
  expect((input as HTMLInputElement).disabled).toBe(true);
  view.rerender(page(result, "after-navigation"));
  await waitFor(() =>
    expect((screen.getByRole("textbox") as HTMLInputElement).disabled).toBe(
      false,
    ),
  );
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
  fireEvent.click(screen.getByRole("button", { name: "Подсказка" }));
  fireEvent.click(screen.getByRole("button", { name: "Решение" }));
  expect(screen.getByText("Начните с базы.")).not.toBeNull();
  expect(screen.getByText("Получится 42.")).not.toBeNull();
});
it("saves a signed-in standalone result under the canonical context", async () => {
  mocks.session.account = { id: "account-1" };
  mocks.session.csrfToken = "csrf";
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        correct: true,
        saved: true,
        solution_revision: 1,
        explanation: [{ type: "text", data: { markdown: "Разбор" } }],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
  );
  vi.stubGlobal("fetch", fetchMock);

  render(page());
  const input = await screen.findByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "42" } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  await waitFor(() =>
    expect(
      fetchMock.mock.calls.some((call: readonly unknown[]) =>
        (call[0] as Request).url.includes("/check-and-save"),
      ),
    ).toBe(true),
  );

  const request = fetchMock.mock.calls
    .map((call: readonly unknown[]) => call[0] as Request)
    .find((request: Request) => request.url.includes("/check-and-save"));
  expect(request).toBeDefined();
  await expect(request!.json()).resolves.toMatchObject({
    context_kind: "standalone",
    context_id: "standalone",
  });
});
it("checks a lesson-only task without saving it as catalog progress", async () => {
  // Change 170 F48: standalone progress counts catalog tasks only.
  mocks.session.account = { id: "account-1" };
  mocks.session.csrfToken = "csrf";
  mocks.check.mockResolvedValue({ correct: true, explanation: "" });
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  render(
    page({ ...result, detail: { ...result.detail!, catalogVisible: false } }),
  );
  const input = await screen.findByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "42" } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  await screen.findByText("Верно. Ответ принят.");
  expect(mocks.check).toHaveBeenCalledWith("detail-task", "42", 1);
  expect(
    fetchMock.mock.calls.some((call: readonly unknown[]) =>
      String((call[0] as Request).url).includes("/check-and-save"),
    ),
  ).toBe(false);
});
it("retains the answer on checker failure and associates feedback with its field", async () => {
  mocks.check.mockRejectedValue(new Error("offline"));
  render(page());
  const input = screen.getByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "123" } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  await screen.findByRole("status");
  expect((input as HTMLInputElement).value).toBe("123");
  expect(
    document.getElementById(input.getAttribute("aria-describedby")!)
      ?.textContent,
  ).toBe("Не удалось проверить ответ. Попробуйте ещё раз.");
});
it("asks for an answer instead of checking an empty field", async () => {
  render(page());
  const input = screen.getByRole("textbox", { name: "Ваш ответ" });
  await waitFor(() => expect((input as HTMLInputElement).disabled).toBe(false));
  fireEvent.change(input, { target: { value: "   " } });
  fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
  expect(mocks.check).not.toHaveBeenCalled();
  expect(
    document.getElementById(input.getAttribute("aria-describedby")!)
      ?.textContent,
  ).toBe("Введите ответ, чтобы проверить.");
  expect(document.activeElement).toBe(input);
  fireEvent.change(input, { target: { value: "1" } });
  expect(screen.queryByText("Введите ответ, чтобы проверить.")).toBeNull();
});
it("shows a quiet text return link before the topic label", () => {
  render(page());
  const back = screen.getByRole("link", { name: "К списку задач" });
  expect(back.textContent).toBe("К списку задач");
  expect(back.nextElementSibling?.textContent).toBe("ЕГЭ 16 · Рекурсия");
});
