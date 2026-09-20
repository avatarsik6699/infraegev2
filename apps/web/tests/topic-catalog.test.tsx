import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { topicCatalog } from "~/entities/topic-catalog";
import { topicCatalogModel } from "~/pages/topic-catalog/model/topic-catalog-model";
import { TopicCatalogPage } from "~/pages/topic-catalog";

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
    const RouterLink = ({
      children,
      params,
      to,
      ...props
    }: React.ComponentProps<"a"> & {
      to: string;
      params?: Record<string, string>;
    }) => {
      const href = Object.entries(params ?? {}).reduce(
        (path, [key, value]) => path.replace(`$${key}`, value),
        to,
      );
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    };

    return {
      ...actual,
      createLink:
        (Component: React.ComponentType<React.ComponentProps<"a">>) =>
        ({
          children,
          params,
          to,
          ...props
        }: React.ComponentProps<"a"> & {
          to: string;
          params?: Record<string, string>;
        }) => {
          const href = Object.entries(params ?? {}).reduce(
            (path, [key, value]) => path.replace(`$${key}`, value),
            to,
          );
          return (
            <Component href={href} {...props}>
              {children}
            </Component>
          );
        },
      Link: RouterLink,
    };
  },
);

const summary = {
  topics: [
    {
      id: "rekursiya",
      tasks: [
        { id: "r1", solution_revision: 1 },
        { id: "r2", solution_revision: 2 },
      ],
    },
    {
      id: "preobrazovanie-zapisey-chisel",
      tasks: [{ id: "n1", solution_revision: 1 }],
    },
  ],
};
const renderCatalog = () =>
  render(
    <LessonProgressProvider>
      <TopicCatalogPage />
    </LessonProgressProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(() => Promise.resolve(Response.json(summary))),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("TopicCatalogPage", () => {
  it("renders the complete catalog and links only published topics", async () => {
    const { container } = renderCatalog();
    const cards = container.querySelectorAll("[data-topic-card]");

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Темы ЕГЭ",
    );
    expect(cards).toHaveLength(25);
    expect(
      container.querySelectorAll('[data-topic-status="published"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-topic-status="planned"]'),
    ).toHaveLength(23);
    expect(
      container.querySelectorAll('[data-topic-status="published"] a'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-topic-status="planned"] a'),
    ).toHaveLength(0);
    expect(
      screen
        .getByRole("link", { name: "Преобразование записей чисел" })
        .getAttribute("href"),
    ).toBe("/ege/5-preobrazovanie-zapisey-chisel");
    expect(
      screen
        .getByRole("link", { name: "Рекурсивные алгоритмы" })
        .getAttribute("href"),
    ).toBe("/ege/16-rekursiya");
    expect(screen.getByText("Задания 19–21")).not.toBeNull();
    expect(screen.getAllByText("Скоро")).toHaveLength(23);
    await screen.findByText("Решено 0 из 2");
  });
});

it("combines live search and status filters, clears input and resets empty results", async () => {
  const view = renderCatalog();
  await screen.findByText("Решено 0 из 2");
  fireEvent.click(screen.getByRole("button", { name: "Не начаты" }));
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(2);
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "РЕКУРС" },
  });
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Очистить поиск" }));
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(2);
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "unknown" },
  });
  expect(screen.getByText("Темы не найдены")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Сбросить фильтры" }));
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(25);
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("");
});

it("counts only current topic answers, keeps completed in All and excludes stale/removed/course tasks", async () => {
  localStorage.setItem(
    "infraege:lesson-progress:v2",
    JSON.stringify({
      version: 1,
      data: {
        lessons: {
          rekursiya: {
            solvedTaskIds: ["r1", "r2", "gone"],
            acceptedAnswers: {},
            solvedRevisions: {
              r1: { "1": "1" },
              r2: { "1": "2" },
              gone: { "1": "3" },
            },
          },
          "preobrazovanie-zapisey-chisel": {
            solvedTaskIds: ["n1"],
            acceptedAnswers: {},
            solvedRevisions: { n1: { "1": "4" } },
          },
          python: {
            solvedTaskIds: ["python1"],
            acceptedAnswers: {},
            solvedRevisions: { python1: { "1": "5" } },
          },
        },
      },
    }),
  );
  const view = renderCatalog();
  await screen.findByText("Решено задач в темах: 2");
  expect(screen.getByText("Решено 1 из 2")).not.toBeNull();
  expect(screen.getByText("Практика завершена")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "В процессе" }));
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(1);
  expect(
    screen.getByRole("link", { name: "Рекурсивные алгоритмы" }),
  ).not.toBeNull();
  expect(screen.getByText("Решено задач в темах: 2")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Не начаты" }));
  expect(screen.getByText("Темы не найдены")).not.toBeNull();
});

it("keeps navigation/search usable on API error and retries without inventing zero totals", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementation(() => Promise.resolve(Response.json(summary))),
  );
  renderCatalog();
  await screen.findByText("Прогресс временно недоступен");
  expect(screen.queryByText("Решено 0 из 2")).toBeNull();
  expect(
    (screen.getByRole("button", { name: "Не начаты" }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "16" } });
  expect(
    screen.getByRole("link", { name: "Рекурсивные алгоритмы" }),
  ).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Повторить" }));
  await screen.findByText("Решено 0 из 2");
  expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("16");
});

it("treats missing summaries as unavailable and recovers corrupt storage", async () => {
  localStorage.setItem("infraege:lesson-progress:v2", "broken");
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(Response.json({ topics: [summary.topics[0]] })),
      ),
  );
  renderCatalog();
  await screen.findByText("Прогресс временно недоступен");
  expect(screen.getByText("Решено 0 из 2")).not.toBeNull();
  expect(screen.getAllByText("Прогресс недоступен")).toHaveLength(1);
});

it("does not flash zero progress while summary is pending", async () => {
  let resolve!: (value: Response) => void;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(
      () =>
        new Promise<Response>((done) => {
          resolve = done;
        }),
    ),
  );
  renderCatalog();
  expect(screen.getAllByText("Прогресс загружается")).toHaveLength(2);
  expect(screen.queryByRole("progressbar")).toBeNull();
  await waitFor(() => expect(resolve).toBeTypeOf("function"));
  resolve(Response.json(summary));
  await screen.findByText("Решено 0 из 2");
});

it("matches grouped numbers and normalizes Cyrillic search without changing ordering", () => {
  const matches = (q: string) =>
    topicCatalog.entries.filter((entry) =>
      topicCatalogModel.matches(entry, q, "all", undefined),
    );
  expect(matches("20").map((entry) => entry.id)).toEqual(["winning-strategy"]);
  expect(matches("05").map((entry) => entry.id)).toEqual([
    "preobrazovanie-zapisey-chisel",
  ]);
  expect(matches(" подсчет ").length).toBeGreaterThan(0);
  expect(matches("подсчет")).toEqual(matches("ПОДСЧЁТ"));
});
