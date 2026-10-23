import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonProgressProvider } from "~/features/lesson-progress";
import { lessonSubtopics, topicLessons } from "~/entities/lesson";
import { examPlan, topicCatalog } from "~/entities/topic-catalog";
import { topicCatalogModel } from "~/pages/topic-catalog/model/topic-catalog-model";
import { TopicCatalogPage } from "~/pages/topic-catalog";
import { lessonPublications } from "~/shared/config/lesson-publication.mjs";

const progressFixture = vi.hoisted(() => ({
  results: [] as {
    context_kind: "topic_lesson" | "course_lesson";
    context_id: string;
    task_id: string;
    solution_revision: number;
  }[],
}));
vi.mock("~/features/account", () => ({
  useAccountSession: () => ({
    account: { id: "member" },
    status: "ready",
    csrfToken: "test",
  }),
}));

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
    {
      id: "spreadsheets",
      tasks: [{ id: "task-9-1-07", solution_revision: 1 }],
    },
    {
      id: "number-sequences",
      tasks: [
        { id: "task-17-01", solution_revision: 1 },
        { id: "task-17-02", solution_revision: 1 },
        { id: "task-17-03", solution_revision: 1 },
        { id: "task-17-04", solution_revision: 1 },
        { id: "task-17-05", solution_revision: 1 },
        { id: "task-17-06", solution_revision: 1 },
        { id: "task-17-07", solution_revision: 1 },
        { id: "task-17-08", solution_revision: 1 },
      ],
    },
    {
      id: "graph-analysis",
      tasks: [{ id: "task-23-1-02", solution_revision: 1 }],
    },
    {
      id: "string-processing",
      tasks: Array.from({ length: 8 }, (_, index) => ({
        id: `task-24-${String(index + 1).padStart(2, "0")}`,
        solution_revision: 1,
      })),
    },
    {
      id: "divisors-and-masks",
      tasks: [
        { id: "task-25-1-01", solution_revision: 1 },
        // An advanced-subtopic task: solved and saved, outside mastery (B1).
        {
          id: "task-25-6-01",
          solution_revision: 1,
          counts_toward_mastery: false,
        },
      ],
    },
    {
      id: "array-processing",
      tasks: [{ id: "task-26-01", solution_revision: 1 }],
    },
    {
      id: "data-analysis",
      tasks: [{ id: "task-27-01", solution_revision: 1 }],
    },
  ],
};
// Every other published topic: one unsolved task, so its card shows progress.
for (const { id } of lessonPublications) {
  if (!summary.topics.some((topic) => topic.id === id))
    summary.topics.push({
      id,
      tasks: [{ id: `${id}-1`, solution_revision: 1 }],
    });
}
const PUBLISHED = lessonPublications.length;
const PLANNED = 25 - PUBLISHED;
const renderCatalog = () =>
  render(
    <LessonProgressProvider accountId="member">
      <TopicCatalogPage />
    </LessonProgressProvider>,
  );

beforeEach(() => {
  progressFixture.results = [];
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);
      return Promise.resolve(
        Response.json(
          url.includes("/api/progress")
            ? { results: progressFixture.results }
            : summary,
        ),
      );
    }),
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
    ).toHaveLength(PUBLISHED);
    expect(
      container.querySelectorAll('[data-topic-status="planned"]'),
    ).toHaveLength(PLANNED);
    expect(
      container.querySelectorAll('[data-topic-status="published"] a'),
    ).toHaveLength(PUBLISHED);
    expect(
      container.querySelectorAll('[data-topic-status="planned"] a'),
    ).toHaveLength(0);
    expect(
      screen
        .getByRole("link", { name: "Формальное исполнение алгоритма" })
        .getAttribute("href"),
    ).toBe("/ege/5-preobrazovanie-zapisey-chisel/chislo-i-zapis");
    expect(
      screen
        .getByRole("link", { name: "Электронные таблицы" })
        .getAttribute("href"),
    ).toBe("/ege/9-obrabotka-tablicy-chisel/stroka-i-uslovie");
    expect(
      screen
        .getByRole("link", { name: "Рекуррентные выражения" })
        .getAttribute("href"),
    ).toBe("/ege/16-rekursiya/funktsiya-cherez-sebya");
    expect(
      screen
        .getByRole("link", { name: "Обработка числовой последовательности" })
        .getAttribute("href"),
    ).toBe("/ege/17-chislovye-posledovatelnosti/chisla-i-proverki");
    expect(
      screen
        .getByRole("link", { name: "Обработка символьной информации" })
        .getAttribute("href"),
    ).toBe("/ege/24-obrabotka-simvolnyh-strok/stroka-i-cepochka");
    expect(
      container.querySelector('[data-topic-id="winning-strategy"]')
        ?.textContent,
    ).toContain("Задания 19–21 · базовый, повышенный, высокий");
    expect(
      screen
        .getByRole("link", { name: "Обработка целочисленной информации" })
        .getAttribute("href"),
    ).toBe("/ege/25-deliteli-i-maski/perebor-i-proverki");
    expect(
      screen
        .getByRole("link", { name: "Обработка данных с сортировкой" })
        .getAttribute("href"),
    ).toBe("/ege/26-sortirovka-i-otbor/zapisi-i-rejting");
    expect(
      screen.getByRole("link", { name: "Анализ данных" }).getAttribute("href"),
    ).toBe("/ege/27-analiz-dannyh-i-klasterizatsiya/tochki-i-rasstoyaniya");
    expect(screen.queryAllByText("Скоро")).toHaveLength(PLANNED);
    // Change 190: the map legend names «скоро» only while a topic is planned
    expect(
      container
        .querySelector("[data-exam-map]")
        ?.textContent?.includes("скоро"),
    ).toBe(PLANNED > 0);
    await screen.findByText("Решено 0 из 2");
  });
});

/** F40: the progress filter is a dropdown («Прогресс: Все темы»). */
const chooseProgress = async (label: string) => {
  fireEvent.click(screen.getByRole("combobox", { name: /Прогресс/ }));
  const option = await screen.findByRole("option", { name: label });
  // Base UI picks an item on pointer up after the pointer went down on it
  fireEvent.pointerDown(option, { pointerType: "mouse" });
  fireEvent.mouseDown(option);
  fireEvent.pointerUp(option, { pointerType: "mouse" });
  fireEvent.mouseUp(option);
  fireEvent.click(option);
  await waitFor(() =>
    expect(
      screen.getByRole("combobox", { name: /Прогресс/ }).textContent,
    ).toContain(label),
  );
};

it("filters by progress and resets an empty result to all topics", async () => {
  const view = renderCatalog();
  await screen.findByText("Решено 0 из 2");
  expect(screen.queryByRole("searchbox")).toBeNull();
  await chooseProgress("Не начаты");
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(
    PUBLISHED,
  );
  await chooseProgress("В процессе");
  expect(screen.getByText("Пока нет начатых тем")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Показать все темы" }));
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(25);
});

it("counts only current topic answers, keeps completed in All and excludes stale/removed/course tasks", async () => {
  progressFixture.results = [
    {
      context_kind: "topic_lesson",
      context_id: "rekursiya",
      task_id: "r1",
      solution_revision: 1,
    },
    {
      context_kind: "topic_lesson",
      context_id: "rekursiya",
      task_id: "r2",
      solution_revision: 1,
    },
    {
      context_kind: "topic_lesson",
      context_id: "rekursiya",
      task_id: "removed-r3",
      solution_revision: 1,
    },
    {
      context_kind: "topic_lesson",
      context_id: "preobrazovanie-zapisey-chisel",
      task_id: "n1",
      solution_revision: 1,
    },
    {
      context_kind: "course_lesson",
      context_id: "python",
      task_id: "r1",
      solution_revision: 1,
    },
    {
      context_kind: "course_lesson",
      context_id: "python",
      task_id: "r2",
      solution_revision: 2,
    },
  ];
  const view = renderCatalog();
  await screen.findByText("Решено задач в темах: 2");
  expect(screen.getByText("Решено 1 из 2")).not.toBeNull();
  // F30 (E4): completion reads from the count and the full bar
  expect(screen.getByText("Решено 1 из 1")).not.toBeNull();
  await chooseProgress("В процессе");
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(1);
  expect(
    screen.getByRole("link", { name: "Рекуррентные выражения" }),
  ).not.toBeNull();
  expect(screen.getByText("Решено задач в темах: 2")).not.toBeNull();
  await chooseProgress("Не начаты");
  expect(view.container.querySelectorAll("[data-topic-card]")).toHaveLength(
    PUBLISHED - 2,
  );
  expect(
    screen.getByRole("link", { name: "Обработка числовой последовательности" }),
  ).not.toBeNull();
  expect(
    screen.getByRole("link", { name: "Обработка символьной информации" }),
  ).not.toBeNull();
});

it("leaves advanced-subtopic tasks out of a topic's mastery total", async () => {
  progressFixture.results = [
    {
      context_kind: "topic_lesson",
      context_id: "divisors-and-masks",
      task_id: "task-25-1-01",
      solution_revision: 1,
    },
    {
      context_kind: "topic_lesson",
      context_id: "divisors-and-masks",
      task_id: "task-25-6-01",
      solution_revision: 1,
    },
  ];
  renderCatalog();
  await screen.findByText("Решено задач в темах: 1");
  // F30 (E4): completion reads from the count and the full bar
  expect(screen.getByText("Решено 1 из 1")).not.toBeNull();
});

it("keeps navigation/search usable on API error and retries without inventing zero totals", async () => {
  let failed = false;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/api/progress"))
        return Promise.resolve(Response.json({ results: [] }));
      if (!failed) {
        failed = true;
        return Promise.reject(new Error("offline"));
      }
      return Promise.resolve(Response.json(summary));
    }),
  );
  renderCatalog();
  await screen.findByText("Прогресс временно недоступен");
  expect(screen.queryByText("Решено 0 из 2")).toBeNull();
  fireEvent.click(screen.getByRole("combobox", { name: /Прогресс/ }));
  expect(
    (await screen.findByRole("option", { name: "Не начаты" })).getAttribute(
      "aria-disabled",
    ),
  ).toBe("true");
  fireEvent.keyDown(document.activeElement ?? document.body, {
    key: "Escape",
  });
  expect(
    screen.getByRole("link", { name: "Рекуррентные выражения" }),
  ).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Повторить" }));
  await screen.findByText("Решено 0 из 2");
});

it("treats missing summaries as unavailable and recovers corrupt storage", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);
      return Promise.resolve(
        Response.json(
          url.includes("/api/progress")
            ? { results: [] }
            : { topics: [summary.topics[0]] },
        ),
      );
    }),
  );
  renderCatalog();
  await screen.findByText("Прогресс временно недоступен");
  expect(screen.getByText("Решено 0 из 2")).not.toBeNull();
  expect(screen.getAllByText("Прогресс недоступен")).toHaveLength(
    PUBLISHED - 1,
  );
});

it("does not flash zero progress while summary is pending", async () => {
  let resolve!: (value: Response) => void;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);
      if (url.includes("/api/progress"))
        return Promise.resolve(Response.json({ results: [] }));
      return new Promise<Response>((done) => {
        resolve = done;
      });
    }),
  );
  renderCatalog();
  expect(screen.getAllByText("Прогресс загружается")).toHaveLength(PUBLISHED);
  expect(screen.queryByRole("progressbar")).toBeNull();
  await waitFor(() => expect(resolve).toBeTypeOf("function"));
  resolve(Response.json(summary));
  await screen.findByText("Решено 0 из 2");
});

it("matches topics by practice progress only", () => {
  const entry = topicCatalog.entries.find((item) => item.id === "rekursiya")!;
  const started = { solved: 1, total: 2 };
  expect(topicCatalogModel.matches(entry, "all", undefined)).toBe(true);
  expect(topicCatalogModel.matches(entry, "started", started)).toBe(true);
  expect(topicCatalogModel.matches(entry, "not-started", started)).toBe(false);
  expect(
    topicCatalogModel.matches(entry, "not-started", { solved: 0, total: 2 }),
  ).toBe(true);
});

describe("topic catalog subtopic counts", () => {
  it("match the published lesson definitions", () => {
    for (const lesson of topicLessons) {
      const entry = topicCatalog.entries.find((item) => item.id === lesson.id);
      expect(entry?.status, lesson.id).toBe("published");
      if (entry?.status !== "published") continue;
      expect(entry.subtopicCount, lesson.id).toBe(
        lessonSubtopics(lesson).length,
      );
      expect(entry.firstSubtopic, lesson.id).toBe(
        lessonSubtopics(lesson)[0]?.slug,
      );
    }
  });
});

describe("exam plan (Change 185, F34–F35)", () => {
  it("follows the FIPI 2027 plan: 11 basic, 11 advanced, 5 high, 235 minutes", () => {
    const tasks = Array.from({ length: 27 }, (_, index) => index + 1);
    const count = (level: string) =>
      tasks.filter((task) => examPlan.level(task) === level).length;
    expect([count("basic"), count("advanced"), count("high")]).toEqual([
      11, 11, 5,
    ]);
    expect(tasks.reduce((sum, task) => sum + examPlan.minutes(task), 0)).toBe(
      235,
    );
    expect(tasks.reduce((sum, task) => sum + examPlan.points(task), 0)).toBe(
      29,
    );
  });

  it("builds cumulative goals with their scope", () => {
    expect(examPlan.goalScope("base")).toMatchObject({
      tasks: 11,
      primary: 11,
    });
    expect(examPlan.goalScope("standard")).toMatchObject({
      tasks: 22,
      primary: 22,
    });
    expect(examPlan.goalScope("hard")).toMatchObject({
      tasks: 27,
      primary: 29,
      score: 100,
    });
    expect(examPlan.inGoal([19, 20, 21], "base")).toBe(true);
    expect(examPlan.inGoal([24], "standard")).toBe(false);
  });

  it("labels a row's level, time and points", () => {
    expect(topicCatalogModel.levelLabel([4])).toBe("Базовый · ≈ 2 мин");
    expect(topicCatalogModel.levelLabel([26])).toBe(
      "Высокий · ≈ 35 мин · 2 балла",
    );
    expect(topicCatalogModel.levelLabel([19, 20, 21])).toBe(
      "базовый, повышенный, высокий",
    );
  });
});

it("dims topics outside the chosen goal and keeps the goal on this device", async () => {
  window.localStorage.removeItem("infraege:ege-goal");
  const { container } = renderCatalog();
  const row = (id: string) =>
    container.querySelector(`[data-topic-id="${id}"]`);
  expect(row("string-processing")?.getAttribute("data-in-goal")).toBe("true");
  fireEvent.click(screen.getByRole("radio", { name: /База/ }));
  expect(container.querySelectorAll("[data-topic-card]")).toHaveLength(25);
  expect(row("string-processing")?.getAttribute("data-in-goal")).toBe("false");
  expect(row("networks")?.getAttribute("data-in-goal")).toBe("true");
  expect(
    (screen.getByRole("radio", { name: /База/ }) as HTMLInputElement).checked,
  ).toBe(true);
  // F44: each step describes itself (tooltip on hover, description for AT)
  const base = screen.getByRole("radio", { name: /База/ });
  expect(
    document.getElementById(base.getAttribute("aria-describedby") ?? "")
      ?.textContent,
  ).toContain("11 из 27 заданий, до 11 первичных ≈ 54 балла");
  expect(window.localStorage.getItem("infraege:ege-goal")).toContain("base");
  window.localStorage.removeItem("infraege:ege-goal");
});
