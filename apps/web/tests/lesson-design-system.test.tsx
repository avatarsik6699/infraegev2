import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LessonSectionHeading, rekursiyaLesson } from "~/entities/lesson";
import { LearningVisualFrame } from "~/entities/learning-visual";
import {
  createLessonProgressStore,
  LessonProgress,
} from "~/features/lesson-progress";
import { LessonDesignLab } from "~/pages/lesson-design-lab";
import { TopicLessonPage } from "~/pages/topic-lesson";
import { calculateReadingPosition } from "~/shared/lib/reading-position";
import { LessonOutline } from "~/widgets/lesson-outline";
import { render } from "./render";

vi.mock(
  "@tanstack/react-router",
  async (
    importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
  ) => {
    const actual = await importOriginal();
    return {
      ...actual,
      Link: ({
        children,
        to,
        ...props
      }: React.ComponentProps<"a"> & { to: string }) => (
        <a href={to} {...props}>
          {children}
        </a>
      ),
      useCanGoBack: () => false,
      useRouter: () => ({ history: { back: vi.fn() } }),
    };
  },
);

const lessonProgress = createLessonProgressStore({
  lessonId: "binary-search",
});
const lessonProgressStorageKey = "infraege:lesson:binary-search:progress";

describe("lesson design system", () => {
  it("renders a nested semantic outline with a current child anchor", () => {
    render(
      <LessonOutline
        groups={[
          {
            id: "theory",
            label: "Теория",
            items: [
              {
                id: "range",
                label: "Середина превращает неизвестность в выбор",
              },
            ],
          },
        ]}
        activeId="range"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Содержание урока" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Теория" }).getAttribute("href"),
    ).toBe("#theory");
    expect(
      screen
        .getByRole("link", {
          name: "Середина превращает неизвестность в выбор",
        })
        .getAttribute("aria-current"),
    ).toBe("location");
    expect(
      screen
        .getByRole("link", { name: "Теория" })
        .getAttribute("data-active-branch"),
    ).toBe("true");
  });

  it("keeps the learning visual alternative visible", () => {
    render(
      <LearningVisualFrame
        caption="Схема"
        purpose="Объяснить шаг"
        accessibleDescription="Диапазон уменьшается вдвое."
      >
        <div aria-hidden="true">visual</div>
      </LearningVisualFrame>,
    );

    expect(screen.getByText(/Диапазон уменьшается вдвое/)).toBeTruthy();
  });

  it("pairs a semantic section heading with a silent visual index", () => {
    render(
      <LessonSectionHeading index={3}>Что важно для ЕГЭ</LessonSectionHeading>,
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Что важно для ЕГЭ",
    });
    expect(heading.textContent).toBe("§ 3 ·Что важно для ЕГЭ");
  });

  it("keeps the four lesson stages above their local theory headings", () => {
    render(<LessonDesignLab />);

    for (const name of [
      "Теория",
      "Практика",
      "Что важно для ЕГЭ",
      "Результат",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeTruthy();
    }
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Середина превращает неизвестность в выбор",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 3, name: "Почему это быстро" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Копировать код/ })).toBeTruthy();
    expect(
      screen.getByText("Средняя").closest('[data-tone="accent"]'),
    ).not.toBeNull();
    for (const name of [
      "Попробуйте сами",
      "Типичная ошибка с границами",
      "Что получилось",
      "Следующий шаг",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeTruthy();
      expect(screen.getByRole("link", { name })).toBeTruthy();
    }
  });

  it("keeps the site header focused on the brand", () => {
    render(<LessonDesignLab />);

    const siteHeader = document.querySelector<HTMLElement>(
      "[data-lesson-site-header]",
    );
    expect(siteHeader).not.toBeNull();
    if (!siteHeader) return;

    expect(Array.from(siteHeader.children)).toHaveLength(1);
    expect(
      within(siteHeader).getByRole("link", {
        name: "infraege — на главную",
      }).textContent,
    ).toBe("infraege");
    expect(within(siteHeader).queryByText("Темы")).toBeNull();
    expect(within(siteHeader).queryByText("Тренажёр")).toBeNull();
  });

  it("keeps recursion metadata with the title while leaving progress and duplicate outcomes out", () => {
    render(
      <TopicLessonPage
        lesson={rekursiyaLesson}
        tasks={[
          {
            id: "rekursiya-base-sequence",
            difficultyLabel: "Базовая",
            title: "База",
            statement: "Условие",
            hint: "Подсказка",
            theoryLinks: [],
            solution: [{ type: "text", text: "Решение базовой задачи" }],
          },
          {
            id: "rekursiya-call-stack-trace",
            difficultyLabel: "Средняя",
            title: "Вызовы",
            statement: "Условие",
            hint: "Подсказка",
            theoryLinks: [],
            solution: [{ type: "text", text: "Решение задачи о вызовах" }],
          },
          {
            id: "rekursiya-two-values",
            difficultyLabel: "Средняя",
            title: "Два значения",
            statement: "Условие",
            hint: "Подсказка",
            theoryLinks: [],
            solution: [{ type: "text", text: "Решение о двух значениях" }],
          },
          {
            id: "rekursiya-repeated-calls",
            difficultyLabel: "Высокая",
            title: "Повторы",
            statement: "Условие",
            hint: "Подсказка",
            theoryLinks: [],
            solution: [{ type: "text", text: "Решение задачи о повторах" }],
          },
          {
            id: "rekursiya-large-ratio",
            difficultyLabel: "Высокая",
            title: "Отношение",
            statement: "Условие",
            hint: "Подсказка",
            theoryLinks: [],
            solution: [{ type: "text", text: "Решение об отношении" }],
          },
        ]}
      />,
    );

    const metadata = screen.getByLabelText("Сведения об уроке");
    expect(within(metadata).getByText("Задание 16")).toBeTruthy();
    expect(within(metadata).getByText("ЕГЭ по информатике")).toBeTruthy();
    expect(within(metadata).getByText("5 задач")).toBeTruthy();
    expect(within(metadata).getByText("Бесплатно")).toBeTruthy();

    const rail = document.querySelector<HTMLElement>("[data-outline-rail]");
    const article = document.querySelector<HTMLElement>("[data-article-frame]");
    const marginRail =
      document.querySelector<HTMLElement>("[data-margin-rail]");
    expect(rail).not.toBeNull();
    expect(article).not.toBeNull();
    expect(marginRail).not.toBeNull();
    if (!rail || !article || !marginRail) return;
    expect(within(rail).queryByRole("progressbar")).toBeNull();
    expect(within(article).queryByRole("progressbar")).toBeNull();
    expect(marginRail.children).toHaveLength(0);
    expect(
      screen.queryByRole("heading", { name: "После урока вы сможете" }),
    ).toBeNull();
    expect(screen.queryByRole("heading", { name: "Освоение темы" })).toBeNull();
    expect(
      screen.queryByRole("navigation", { name: "Вернуться к теории" }),
    ).toBeNull();
    const checkpoints = screen.getAllByLabelText("Проверьте себя");
    expect(checkpoints).toHaveLength(4);
    expect(
      checkpoints.map(
        (checkpoint) => within(checkpoint).getAllByRole("button").length,
      ),
    ).toEqual([2, 2, 2, 1]);
    for (const checkpoint of checkpoints) {
      expect(checkpoint.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    }

    const template = screen.getByRole("group", {
      name: "Универсальный шаблон: одно предыдущее значение",
    });
    expect(within(template).getByText("Python")).toBeTruthy();
    expect(within(template).queryByText("пример", { exact: false })).toBeNull();
  });

  it("keeps one enhanced practice task active without losing draft answers", async () => {
    lessonProgress.clear();
    const lesson = render(<LessonDesignLab />);

    expect(screen.queryByRole("link", { name: "В избранное" })).toBeNull();
    expect(screen.queryByRole("link", { name: "К практике" })).toBeNull();
    expect(
      screen.getByRole("link", { name: "Назад к темам" }).getAttribute("href"),
    ).toBe("/");
    const tabs = screen.getByRole("tablist", {
      name: "Задачи по сложности",
    });
    expect(within(tabs).getAllByRole("tab")).toHaveLength(5);
    const firstTab = within(tabs).getByRole("tab", {
      name: /^01 · Разминка\. Задача 1 из 5/,
    });
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(firstTab.getAttribute("tabindex")).toBe("0");
    expect(
      document.querySelectorAll("[data-practice-task]:not([hidden])"),
    ).toHaveLength(1);
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(
      screen
        .getByRole("progressbar", { name: "Решённые задачи темы" })
        .getAttribute("aria-valuetext"),
    ).toBe("Решено 0 из 5 задач");

    const firstTaskTheory = screen.getByRole("navigation", {
      name: "Теория к задаче «Выберите половину»",
    });
    expect(
      within(firstTaskTheory)
        .getByRole("link", { name: "Схема сравнения" })
        .getAttribute("href"),
    ).toBe("#range");

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });
    const secondTab = within(tabs).getByRole("tab", {
      name: /Задача 2 из 5/,
    });
    await waitFor(() => {
      expect(secondTab.getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(secondTab);
    });
    fireEvent.keyDown(secondTab, { key: "Home" });
    await waitFor(() => {
      expect(firstTab.getAttribute("aria-selected")).toBe("true");
      expect(document.activeElement).toBe(firstTab);
    });

    const answer = screen.getByRole("textbox");
    const check = screen.getByRole("button", { name: "Проверить" });
    const solution = screen.getByRole("button", { name: "Решение" });
    if (!answer || !check) throw new Error("Missing first practice controls");
    fireEvent.click(solution);
    expect(screen.getByText(/Оставляем левую половину/)).toBeTruthy();
    fireEvent.change(answer, { target: { value: "черновик" } });
    fireEvent.click(within(tabs).getByRole("tab", { name: /Задача 2 из 5/ }));
    expect(screen.getByRole("textbox").getAttribute("id")).toBe(
      "answer-left-boundary",
    );
    fireEvent.click(within(tabs).getByRole("tab", { name: /Задача 4 из 5/ }));
    expect(
      within(
        screen.getByRole("navigation", {
          name: "Теория к задаче «Сохраните последний кандидат»",
        }),
      ).getAllByRole("link"),
    ).toHaveLength(2);
    fireEvent.click(within(tabs).getByRole("tab", { name: /Задача 1 из 5/ }));
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
      "черновик",
    );

    fireEvent.change(answer, { target: { value: "правая" } });
    fireEvent.click(check);
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("Пока нет");
    });
    expect(
      screen
        .getByRole("progressbar", { name: "Решённые задачи темы" })
        .getAttribute("aria-valuetext"),
    ).toBe("Решено 0 из 5 задач");

    fireEvent.change(answer, { target: { value: "левая" } });
    fireEvent.click(check);
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("Верно");
    });
    expect(
      screen
        .getByRole("progressbar", { name: "Решённые задачи темы" })
        .getAttribute("aria-valuetext"),
    ).toBe("Решено 1 из 5 задач");
    expect(answer.hasAttribute("disabled")).toBe(true);
    expect(answer.getAttribute("data-solved")).toBe("true");
    expect((answer as HTMLInputElement).value).toBe("левая");
    expect(
      screen
        .getByRole("button", { name: "Проверить" })
        .hasAttribute("disabled"),
    ).toBe(true);
    expect(screen.queryByText("решено", { exact: true })).toBeNull();
    expect(
      screen.queryByRole("button", { name: /Следующая задача:/ }),
    ).toBeNull();
    expect(
      screen.queryByRole("link", { name: "Перейти к результату" }),
    ).toBeNull();
    expect(
      within(tabs)
        .getByRole("tab", { name: /Задача 1 из 5:.*решена/ })
        .getAttribute("data-solved"),
    ).toBe("true");
    fireEvent.click(within(tabs).getByRole("tab", { name: /Задача 2 из 5/ }));
    expect(secondTab.getAttribute("aria-selected")).toBe("true");

    lesson.unmount();
    render(<LessonDesignLab />);
    const restoredAnswer = screen.getByRole("textbox", { name: "Ответ" });
    expect((restoredAnswer as HTMLInputElement).value).toBe("левая");
    expect(restoredAnswer.hasAttribute("disabled")).toBe(true);
    expect(
      screen
        .getByRole("button", { name: "Проверить" })
        .hasAttribute("disabled"),
    ).toBe(true);
    lessonProgress.clear();
  });

  it("clamps the reading position to the article travel range", () => {
    expect(calculateReadingPosition(0, 100, 1100, 600)).toBe(0);
    expect(calculateReadingPosition(350, 100, 1100, 600)).toBe(0.5);
    expect(calculateReadingPosition(900, 100, 1100, 600)).toBe(1);
  });

  it("separates task mastery from navigation and persists solved task ids", () => {
    lessonProgress.clear();
    lessonProgress.markSolved("task-1", " 42 ");
    lessonProgress.markSolved("task-1", " 42 ");
    expect(lessonProgress.getSnapshot().solvedTaskIds).toEqual(["task-1"]);
    expect(lessonProgress.getSnapshot().acceptedAnswers).toEqual({
      "task-1": " 42 ",
    });
    expect(window.localStorage.getItem(lessonProgressStorageKey)).toContain(
      "task-1",
    );
    expect(window.localStorage.getItem(lessonProgressStorageKey)).toContain(
      " 42 ",
    );

    render(<LessonProgress solved={4} total={5} masteryThreshold={0.8} />);
    expect(
      screen.getByRole("progressbar", { name: "Решённые задачи темы" }),
    ).toBeTruthy();
    expect(screen.getByText("Тема освоена")).toBeTruthy();
    lessonProgress.clear();
  });

  it("keeps legacy solved progress without inventing an accepted answer", () => {
    lessonProgress.clear();
    const unsubscribe = lessonProgress.subscribe(() => undefined);
    window.localStorage.setItem(
      lessonProgressStorageKey,
      JSON.stringify({
        version: 1,
        data: { solvedTaskIds: ["keep-half"] },
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: lessonProgressStorageKey,
      }),
    );
    expect(lessonProgress.getSnapshot()).toEqual({
      acceptedAnswers: {},
      solvedTaskIds: ["keep-half"],
    });
    render(<LessonDesignLab />);
    expect(
      screen
        .getByPlaceholderText("Ответ был принят ранее")
        .hasAttribute("disabled"),
    ).toBe(true);
    unsubscribe();
    lessonProgress.clear();
  });

  it("ignores a corrupted stored progress envelope", () => {
    lessonProgress.clear();
    const unsubscribe = lessonProgress.subscribe(() => undefined);
    window.localStorage.setItem(lessonProgressStorageKey, "not-json");
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: lessonProgressStorageKey,
      }),
    );
    expect(lessonProgress.getSnapshot()).toEqual({
      acceptedAnswers: {},
      solvedTaskIds: [],
    });
    expect(window.localStorage.getItem(lessonProgressStorageKey)).toBeNull();
    unsubscribe();
  });
});
