import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findCourseLessonPublicationByRouteSlugs } from "~/entities/course";
import {
  courseLessonSlug,
  retiredCourseLessonSlugs,
} from "~/entities/lesson/content/python-course-lesson-link";
import { pythonTerms } from "~/entities/lesson/content/python-terms";

const CONTENT = join(__dirname, "../src/entities/lesson/content");

/** Every Python course lesson slug named by topic lessons and the term
 * registry; Excel terms (Change 184) are checked against the Excel course. */
const namedSlugs = () =>
  readdirSync(CONTENT)
    .filter((name) => name.endsWith(".tsx") && name !== "python-terms.tsx")
    .flatMap((name) =>
      [
        ...readFileSync(join(CONTENT, name), "utf8").matchAll(
          /lessonSlug(?:=|: )"([^"]+)"/gu,
        ),
      ].map((match) => ({ file: name, slug: match[1] ?? "" })),
    )
    .concat(
      Object.values(pythonTerms)
        .filter((entry) => entry.course === "python")
        .map((entry) => ({ file: "python-terms.tsx", slug: entry.lessonSlug })),
    );

describe("links to the Python course (Change 175)", () => {
  it("lead to published lessons, retired ones through their replacement", () => {
    const named = namedSlugs();
    expect(named.length).toBeGreaterThan(0);
    for (const { file, slug } of named) {
      expect(
        findCourseLessonPublicationByRouteSlugs(
          "python",
          courseLessonSlug(slug),
        ),
        `${file}: ${slug}`,
      ).toMatchObject({ status: "published" });
    }
  });

  it("names published Excel course lessons in spreadsheet terms", () => {
    const excel = Object.values(pythonTerms).filter(
      (entry) => entry.course === "excel",
    );
    expect(excel.length).toBeGreaterThan(0);
    for (const entry of excel) {
      expect(
        findCourseLessonPublicationByRouteSlugs("excel", entry.lessonSlug),
        entry.lessonSlug,
      ).toMatchObject({ status: "published" });
    }
  });

  it("redirects only slugs that the course really retired", () => {
    for (const [retired, replacement] of Object.entries(
      retiredCourseLessonSlugs,
    )) {
      expect(
        findCourseLessonPublicationByRouteSlugs("python", retired),
      ).toBeUndefined();
      expect(
        findCourseLessonPublicationByRouteSlugs("python", replacement),
      ).toBeDefined();
    }
  });
});
