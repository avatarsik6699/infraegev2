import { describe, expect, it } from "vitest";
import {
  courseProgress,
  courseLessonPublications,
  coursePublications,
  findCourseByRouteSlug,
  findCourseLessonPublicationByRouteSlugs,
  findCourseLessonByRouteSlugs,
  findCoursePublicationByRouteSlug,
  getCourseLessons,
  type CourseProgressTypes,
} from "~/entities/course";
import course from "../../../content/lesson-design/course-python/course.json";
import {
  loadMigrationPractice as loadPracticeTasks,
  migrationTaskIds,
} from "./practice-migration-fixture";

describe("Python course foundation", () => {
  const planned = course.modules.flatMap((courseModule) =>
    courseModule.lessons.map((lesson) => ({
      ...lesson.site,
      title: lesson.title,
      level: lesson.level === "дополнительный" ? "advanced" : "core",
    })),
  );

  it("publishes the rebuilt course of the stand (Change 175)", () => {
    expect(coursePublications).toEqual([
      expect.objectContaining({
        id: "python",
        routeSlug: "python",
        stage: "complete",
        status: "published",
      }),
    ]);
    expect(courseLessonPublications.map((lesson) => lesson.id)).toEqual(
      planned.map((lesson) => lesson.id),
    );
    expect(
      courseLessonPublications.every((lesson) => lesson.status === "published"),
    ).toBe(true);
    const pythonCourse = findCourseByRouteSlug("python");
    if (!pythonCourse) throw new Error("Published Python course is missing");
    expect(pythonCourse.modules.map((courseModule) => courseModule.id)).toEqual(
      course.modules.map((courseModule) => courseModule.id),
    );
    expect(getCourseLessons(pythonCourse).map((lesson) => lesson.id)).toEqual(
      planned.map((lesson) => lesson.id),
    );
  });

  it("resolves lessons by route slug and drops the retired ones", () => {
    expect(
      findCourseLessonPublicationByRouteSlugs("python", "pervaya-programma"),
    ).toMatchObject({ id: "python-first-program", status: "published" });
    expect(
      findCourseLessonByRouteSlugs("python", "logicheskie-vyrazheniya"),
    ).toMatchObject({ id: "python-logic" });
    expect(findCoursePublicationByRouteSlug("python")).toBeDefined();
    expect(
      findCourseLessonPublicationByRouteSlugs("missing", "pervaya-programma"),
    ).toBeUndefined();
    for (const retired of ["oshibki", "spisok-del", "otbor-rezultata"]) {
      expect(findCourseLessonByRouteSlugs("python", retired)).toBeUndefined();
    }
  });

  it("marks the additional lessons in the plan and the definitions", () => {
    const pythonCourse = findCourseByRouteSlug("python");
    if (!pythonCourse) throw new Error("Published Python course is missing");
    const advanced = planned
      .filter((lesson) => lesson.level === "advanced")
      .map((lesson) => lesson.id);
    expect(advanced).toEqual([
      "python-classes",
      "python-advanced-features",
      "python-testing",
    ]);
    const planItems = pythonCourse.modules.flatMap(
      (courseModule) => courseModule.lessonPlan,
    );
    expect(
      planItems.filter((item) => item.level === "advanced").map((i) => i.id),
    ).toEqual(advanced);
    for (const lesson of getCourseLessons(pythonCourse)) {
      expect(lesson.level ?? "core").toBe(
        advanced.includes(lesson.id) ? "advanced" : "core",
      );
    }
  });

  it("opens every lesson with an untitled lead and ends it with a result", () => {
    const pythonCourse = findCourseByRouteSlug("python");
    if (!pythonCourse) throw new Error("Published Python course is missing");
    for (const lesson of getCourseLessons(pythonCourse)) {
      expect(lesson.theory[0]).toMatchObject({ id: "intro", lead: true });
      expect(lesson.theory.slice(1).some((concept) => concept.lead)).toBe(
        false,
      );
      const ids = lesson.theory.map((concept) => concept.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(
        lesson.theory.every((concept) => concept.navLabel.length > 0),
      ).toBe(true);
      expect(lesson.result).toBeTruthy();
    }
  });

  it("loads every lesson's tasks in order without checker secrets", async () => {
    for (const lesson of planned) {
      const ids = migrationTaskIds(lesson.id);
      expect(ids.length, lesson.id).toBeGreaterThan(0);
      expect(ids.every((id) => id.startsWith(`${lesson.id}-t`))).toBe(true);
      const tasks = await loadPracticeTasks(ids);
      expect(tasks.map((task) => task.id)).toEqual(ids);
      for (const task of tasks) {
        expect(JSON.stringify(task)).not.toContain("answer_variants");
      }
    }
  });
});

describe("course progress", () => {
  it("keeps additional lessons out of course mastery (Change 175)", () => {
    const lessons: CourseProgressTypes.Lesson[] = [
      { id: "core", tasks: [{ id: "a", solutionRevision: 1 }] },
      {
        id: "extra",
        level: "advanced",
        tasks: [{ id: "b", solutionRevision: 1 }],
      },
    ];
    const progress = courseProgress.calculate(lessons, {
      core: { solvedTaskIds: ["a"] },
      extra: { solvedTaskIds: ["b"] },
    });
    expect(progress).toEqual({
      masteredLessonIds: ["core"],
      availableCount: 1,
      allAvailableMastered: true,
    });
    const practice = courseProgress.calculatePractice(lessons, {
      extra: { solvedTaskIds: ["b"] },
    });
    expect(practice.solved).toBe(0);
    expect(practice.total).toBe(1);
    expect(practice.byLessonId.extra?.mastered).toBe(true);
  });

  it("counts mastery only across the available lesson set", () => {
    const lessons = [
      {
        id: "first",
        tasks: [{ id: "a", solutionRevision: 1 }],
        masteryThreshold: 0.8,
      },
      {
        id: "second",
        tasks: [
          { id: "b", solutionRevision: 1 },
          { id: "c", solutionRevision: 1 },
        ],
        masteryThreshold: 0.5,
      },
    ];

    expect(
      courseProgress.calculate(lessons, {
        first: { solvedTaskIds: ["a"] },
        second: { solvedTaskIds: [] },
      }),
    ).toEqual({
      masteredLessonIds: ["first"],
      availableCount: 2,
      allAvailableMastered: false,
    });

    expect(
      courseProgress.calculate(lessons, {
        first: { solvedTaskIds: ["a"] },
        second: { solvedTaskIds: ["b"] },
      }),
    ).toEqual({
      masteredLessonIds: ["first", "second"],
      availableCount: 2,
      allAvailableMastered: true,
    });
  });

  it.each([
    {
      progress: {
        allAvailableMastered: false,
        availableCount: 2,
        masteredLessonIds: [],
      },
      expected: "Освоено 0 из 2 доступных уроков.",
    },
    {
      progress: {
        allAvailableMastered: false,
        availableCount: 2,
        masteredLessonIds: ["first"],
      },
      expected: "Освоено 1 из 2 доступных уроков.",
    },
    {
      progress: {
        allAvailableMastered: true,
        availableCount: 2,
        masteredLessonIds: ["first", "second"],
      },
      expected:
        "Освоены все доступные уроки: 2 из 2. Курс продолжает развиваться.",
    },
  ])(
    "selects explicit progress copy",
    ({ progress, expected }: ProgressCopyCase) => {
      expect(courseProgress.formatOverviewCopy(progress)).toBe(expected);
    },
  );

  it("formats compact catalog progress without exposing a percentage", () => {
    expect(
      courseProgress.formatCatalogCopy({
        allAvailableMastered: false,
        availableCount: 28,
        masteredLessonIds: ["first", "second"],
      }),
    ).toBe("Освоено 2 из 28 уроков");
  });
});

type ProgressCopyCase = {
  progress: CourseProgressTypes.Snapshot;
  expected: string;
};
