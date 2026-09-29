import { describe, expect, it, vi } from "vitest";
import { rekursiyaLesson } from "~/entities/lesson";
import { renderAuthoredLessonContent } from "./lesson-content-test-utils";

vi.mock("~/shared/components/action-link", () => ({
  ActionLink: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

/** F и G из раздела «Две связанные функции»: F = 1, G = 2 при n ≤ 2, дальше перекрёстно. */
function referenceTable(top: number) {
  const f: number[] = [0, 1, 1];
  const g: number[] = [0, 2, 2];
  for (let n = 3; n <= top; n += 1) {
    f[n] = f[n - 1]! + g[n - 2]!;
    g[n] = g[n - 1]! + f[n - 1]!;
  }
  return Array.from({ length: top }, (_, i) => [i + 1, f[i + 1]!, g[i + 1]!]);
}

describe("two functions worked example", () => {
  const concept = rekursiyaLesson.theory.find(
    ({ id }) => id === "two-functions",
  )!;

  it("keeps the values as comments inside the single code block and they match the recursion and F(8) = 44", () => {
    const container = renderAuthoredLessonContent([concept.workedExample]);
    const text = [...container.querySelectorAll("pre > code > span")]
      .map((line) => line.lastElementChild?.textContent ?? "")
      .join("\n");
    const reference = referenceTable(8);
    for (const [column, name] of [
      [1, "F(n)"],
      [2, "G(n)"],
    ] as const) {
      const line = reference.map((row) => row[column]).join(" ");
      const found = [
        ...text.matchAll(
          new RegExp(name.replace(/[()]/g, "\\$&") + "((?: +\\d+){8})", "g"),
        ),
      ].map((match) => match[1]!.trim().split(/ +/).join(" "));
      expect(found, name).toContain(line);
    }
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelectorAll("pre")).toHaveLength(1);
  });

  it("keeps the manual steps short and points to the table", () => {
    const container = renderAuthoredLessonContent([concept.workedExample]);
    expect(container.querySelectorAll("ol > li")).toHaveLength(4);
    expect(container.textContent).toContain("Вся таблица ниже");
  });
});
