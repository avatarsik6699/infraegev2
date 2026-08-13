import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LessonSectionHeading } from "~/entities/lesson";
import { LearningVisualFrame } from "~/entities/learning-visual";
import {
  createLessonProgressStore,
  LessonProgress,
} from "~/features/lesson-progress";
import { LessonDesignLab } from "~/pages/lesson-design-lab";
import {
  buildLessonOutlinePaths,
  type LessonOutlineGeometry,
  LessonOutline,
} from "~/widgets/lesson-outline";
import { calculateReadingPosition } from "~/shared/lib/reading-position";
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

  it("builds connector paths with explicit clearance around solid nodes", () => {
    const geometry: LessonOutlineGeometry = {
      width: 220,
      height: 100,
      nodes: [
        {
          id: "theory",
          groupId: "theory",
          kind: "group",
          x: 8,
          y: 10,
          radius: 4.5,
        },
        {
          id: "range",
          groupId: "theory",
          kind: "item",
          x: 32,
          y: 40,
          radius: 3.5,
        },
        {
          id: "speed",
          groupId: "theory",
          kind: "item",
          x: 32,
          y: 58,
          radius: 3.5,
        },
        {
          id: "practice",
          groupId: "practice",
          kind: "group",
          x: 8,
          y: 80,
          radius: 4.5,
        },
      ],
    };

    const result = buildLessonOutlinePaths(geometry, "speed");
    expect(result.paths.find(({ kind }) => kind === "trunk")?.d).toBe(
      "M 8 19.5 V 70.5",
    );
    expect(result.paths.find(({ kind }) => kind === "branch")?.d).toContain(
      "H 23.5",
    );
    expect(result.activePath?.d).toContain("M 8 19.5");
    expect(result.activePath?.d).toContain("M 20 58 H 23.5");
    expect(result.activePath?.d).not.toContain("M 20 40 H 23.5");
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
      screen.getByText("Средняя").closest(".mantine-Badge-root"),
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

  it("keeps one enhanced practice task active without losing draft answers", () => {
    lessonProgress.clear();
    render(<LessonDesignLab />);

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
      name: /Задача 1 из 5/,
    });
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(firstTab.getAttribute("tabindex")).toBe("0");
    expect(
      document.querySelectorAll("[data-practice-task]:not([hidden])"),
    ).toHaveLength(1);
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByText("Решено 0 из 5 задач")).toBeTruthy();

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
    expect(secondTab.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(secondTab);
    fireEvent.keyDown(secondTab, { key: "Home" });
    expect(firstTab.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(firstTab);

    const answer = screen.getByRole("textbox");
    const check = screen.getByRole("button", { name: "Проверить" });
    if (!answer || !check) throw new Error("Missing first practice controls");
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
    expect(screen.getByRole("status").textContent).toContain("Пока нет");
    expect(screen.getByText("Решено 0 из 5 задач")).toBeTruthy();

    fireEvent.change(answer, { target: { value: "левая" } });
    fireEvent.click(check);
    expect(screen.getByRole("status").textContent).toContain("Верно");
    expect(screen.getByText("Решено 1 из 5 задач")).toBeTruthy();
    expect(answer.hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Решено" })).toBeTruthy();
    expect(
      screen.getByText("решено").closest(".mantine-Badge-root"),
    ).not.toBeNull();
    const next = screen.getByRole("button", {
      name: "Следующая задача: Сдвиньте левую границу",
    });
    expect(
      within(tabs)
        .getByRole("tab", { name: /Задача 1 из 5,.*решена/ })
        .getAttribute("data-solved"),
    ).toBe("true");
    fireEvent.click(next);
    expect(document.activeElement).toBe(
      screen.getByRole("heading", {
        level: 4,
        name: "Сдвиньте левую границу",
      }),
    );
    lessonProgress.clear();
  });

  it("clamps the reading position to the article travel range", () => {
    expect(calculateReadingPosition(0, 100, 1100, 600)).toBe(0);
    expect(calculateReadingPosition(350, 100, 1100, 600)).toBe(0.5);
    expect(calculateReadingPosition(900, 100, 1100, 600)).toBe(1);
  });

  it("separates task mastery from navigation and persists solved task ids", () => {
    lessonProgress.clear();
    lessonProgress.markSolved("task-1");
    lessonProgress.markSolved("task-1");
    expect(lessonProgress.getSnapshot().solvedTaskIds).toEqual(["task-1"]);
    expect(window.localStorage.getItem(lessonProgressStorageKey)).toContain(
      "task-1",
    );

    render(<LessonProgress solved={4} total={5} masteryThreshold={0.8} />);
    expect(
      screen.getByRole("progressbar", { name: "Решённые задачи темы" }),
    ).toBeTruthy();
    expect(screen.getByText("Тема освоена")).toBeTruthy();
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
    expect(lessonProgress.getSnapshot().solvedTaskIds).toEqual([]);
    expect(window.localStorage.getItem(lessonProgressStorageKey)).toBeNull();
    unsubscribe();
  });
});
