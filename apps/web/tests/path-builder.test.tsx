import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { lessonMedia } from "~/entities/lesson/content/graph-analysis.media";
import {
  PathBuilder,
  decimalSum,
  startState,
  statusText,
  step,
} from "~/shared/components/learning-content";

const flags = vi.hoisted(() => ({ enhanced: true }));
vi.mock("~/shared/lib/use-is-enhanced", () => ({
  useIsEnhanced: () => flags.enhanced,
}));

afterEach(() => {
  flags.enhanced = true;
});

// The topic 23 textbook graph exported from figures.path_builder_data.
const graph = Object.values(lessonMedia).find((item) => item.kind === "graph");
if (graph?.kind !== "graph") throw new Error("no graph sandbox in topic 23");

const walk = (...vertices: number[]) =>
  vertices.reduce((state, v) => step(graph, state, v), startState(graph));

describe("path rules", () => {
  it("adds decimal weights exactly", () => {
    expect(decimalSum(["2", "1", "3"])).toBe("6");
    expect(decimalSum(["0.1", "0.2"])).toBe("0.3");
    expect(decimalSum(["2.4", "1.3", "3.2"])).toBe("6.9");
    expect(decimalSum(["4.1", "2.9"])).toBe("7");
  });

  it("moves only along arrows and explains a refused move", () => {
    const refused = walk(7, 1);
    expect(refused.path).toEqual([1, 7]);
    expect(statusText(graph, refused)).toBe(
      "Путь: 1 → 7 · длина 5.5. Из 7 в 1 ребра нет: стрелка идёт только 1 → 7",
    );
  });

  it("compares the finished path with the shortest one", () => {
    expect(statusText(graph, walk(7, 100))).toBe(
      "Путь: 1 → 7 → 100 · длина 5.5 + 2.0 = 7.5. Дошли до цели. Это кратчайший путь",
    );
    expect(statusText(graph, walk(4, 100))).toBe(
      "Путь: 1 → 4 → 100 · длина 2.5 + 8.0 = 10.5. Дошли до цели. Есть путь короче — попробуйте найти его",
    );
    expect(walk(100, 7).path).toEqual([1, 100]);
  });
});

describe("PathBuilder", () => {
  it("is a static picture of the graph without scripting", () => {
    flags.enhanced = false;
    const html = renderToStaticMarkup(
      <PathBuilder {...graph} caption="Подпись" />,
    );
    expect(html).toContain('role="img"');
    expect(html).not.toContain('role="button"');
    expect(html).not.toContain("Шаг назад");
    expect(html).toContain("Подпись");
  });

  it("builds a path from activated vertices, steps back and starts over", () => {
    render(<PathBuilder {...graph} caption="Подпись" />);
    const status = () => screen.getByText(/^Путь:/u).textContent;
    expect(status()).toBe("Путь: 1. Начинаем в вершине 1: выберите, куда идти");
    fireEvent.click(screen.getByRole("button", { name: "Вершина 6" }));
    fireEvent.click(screen.getByRole("button", { name: "Вершина 7" }));
    fireEvent.keyDown(screen.getByRole("button", { name: "Вершина 12" }), {
      key: "Enter",
    });
    expect(status()).toBe("Путь: 1 → 7 · длина 5.5. Из 7 в 12 ребра нет");
    fireEvent.click(screen.getByRole("button", { name: "Шаг назад" }));
    expect(status()).toBe("Путь: 1. Начинаем в вершине 1: выберите, куда идти");
    fireEvent.click(screen.getByRole("button", { name: "Сначала" }));
    expect(status()).toBe("Путь: 1. Начинаем в вершине 1: выберите, куда идти");
    expect(screen.getByText(/^Путь:/u).getAttribute("aria-live")).toBe(
      "polite",
    );
  });
});
