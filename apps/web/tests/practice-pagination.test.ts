import { describe, expect, it } from "vitest";
import { practicePagination } from "~/pages/practice-catalog/model/practice-pagination";

describe("practice pagination", () => {
  it("shows every page in a short result", () => {
    expect(practicePagination.pages(1, 1)).toEqual([1]);
    expect(practicePagination.pages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  it("keeps boundaries, current page and neighbours throughout a long result", () => {
    for (let current = 1; current <= 55; current += 1) {
      const pages = practicePagination.pages(current, 55);
      expect(pages[0]).toBe(1);
      expect(pages.at(-1)).toBe(55);
      expect(pages).toContain(current);
      if (current > 1) expect(pages).toContain(current - 1);
      if (current < 55) expect(pages).toContain(current + 1);
      expect(pages).toEqual([...new Set(pages)].sort((a, b) => a - b));
      expect(pages.length).toBeLessThanOrEqual(7);
    }
  });
});
