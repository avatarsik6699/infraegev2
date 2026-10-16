import { describe, expect, it } from "vitest";
import { practiceCatalog, practiceSource } from "~/entities/practice-task";

describe("Change 191 practice catalog helpers", () => {
  it("resolves legacy single-number links of the merged 19–21 topic", () => {
    expect(
      practiceCatalog.search({ topics: ["ege-20", "ege-8"] }).topics,
    ).toEqual(["ege-19-21", "ege-8"]);
    expect(
      practiceCatalog.search({ topics: ["ege-19", "ege-21", "ege-19-21"] })
        .topics,
    ).toEqual(["ege-19-21"]);
  });

  it("labels single and merged exam numbers", () => {
    expect(practiceCatalog.numberLabel([8])).toBe("№ 8");
    expect(practiceCatalog.numberLabel([19, 20, 21])).toBe("№ 19–21");
    expect(practiceCatalog.numberLabel([])).toBeUndefined();
  });

  it("labels a source without a copy marker", () => {
    expect(
      practiceSource.label({
        kind: "bank",
        title: "КЕГЭ — Пересдача 03.07.25",
        original_id: "15334",
        year: null,
        url: "https://kompege.ru/task?id=15334",
      }),
    ).toBe("КЕГЭ — Пересдача 03.07.25 · № 15334");
  });
});
