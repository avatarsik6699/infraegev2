import { describe, expect, it } from "vitest";
import {
  courseLessonPublications,
  coursePublications,
  findCourseByRouteSlug,
  findCourseLessonByRouteSlugs,
  getCourseLessons,
  pythonCourse,
  pythonFirstProgramLesson,
} from "~/entities/course";
import { loadPracticeTasks } from "~/entities/practice-task";
import {
  calculateCourseProgress,
  getCourseProgressCopy,
  type CourseProgressSnapshot,
} from "~/pages/course-overview/components/course-overview-progress.model";

describe("Python course foundation", () => {
  it("publishes the course and its first lesson as one unit", () => {
    expect(coursePublications).toEqual([
      expect.objectContaining({
        id: "python",
        routeSlug: "python",
        stage: "early_access",
        status: "published",
      }),
    ]);
    expect(courseLessonPublications).toEqual([
      expect.objectContaining({
        id: "python-first-program",
        routeSlug: "pervaya-programma",
        status: "published",
      }),
    ]);
  });

  it("resolves only lessons owned by the requested course", () => {
    expect(findCourseByRouteSlug("python")).toBe(pythonCourse);
    expect(findCourseLessonByRouteSlugs("python", "pervaya-programma")).toBe(
      pythonFirstProgramLesson,
    );
    expect(findCourseLessonByRouteSlugs("missing", "pervaya-programma")).toBe(
      undefined,
    );
    expect(getCourseLessons(pythonCourse)).toEqual([pythonFirstProgramLesson]);
    expect(pythonCourse.modules).toHaveLength(9);
    expect(pythonCourse).toMatchObject({
      summary:
        "От первой программы — к задачам и алгоритмам, которые пригодятся на ЕГЭ.",
      audience:
        "Подойдёт, если вы раньше не программировали: начнём с самого начала и будем двигаться небольшими шагами.",
      learningOutcomes: [
        "Понимать, что делает небольшая программа и как меняются значения",
        "Писать и проверять простые программы на Python",
        "Разбираться в сообщениях об ошибках и находить причину",
        "Собирать знакомые команды и конструкции в готовое решение",
      ],
    });
  });

  it("loads five authored practice tasks in order without checker secrets", async () => {
    const tasks = await loadPracticeTasks(
      pythonFirstProgramLesson.practiceTaskIds,
    );

    expect(tasks.map((task) => task.id)).toEqual(
      pythonFirstProgramLesson.practiceTaskIds,
    );
    expect(tasks).toHaveLength(5);
    for (const task of tasks) {
      expect(task.title).not.toBe("");
      expect(task.statement).not.toBe("");
      expect(task.theoryLinks.length).toBeGreaterThan(0);
      expect(task.solution.length).toBeGreaterThan(0);
      expect(task).not.toHaveProperty("answer_variants");
      expect(task).not.toHaveProperty("numeric_tolerance");
      expect(task).not.toHaveProperty("explanation");
    }
  });
});

describe("course progress", () => {
  it("counts mastery only across the available lesson set", () => {
    const lessons = [
      {
        id: "first",
        taskIds: ["a"],
        masteryThreshold: 0.8,
      },
      {
        id: "second",
        taskIds: ["b", "c"],
        masteryThreshold: 0.5,
      },
    ];

    expect(
      calculateCourseProgress(lessons, {
        first: { acceptedAnswers: {}, solvedTaskIds: ["a"] },
        second: { acceptedAnswers: {}, solvedTaskIds: [] },
      }),
    ).toEqual({
      masteredLessonIds: ["first"],
      availableCount: 2,
      allAvailableMastered: false,
    });

    expect(
      calculateCourseProgress(lessons, {
        first: { acceptedAnswers: {}, solvedTaskIds: ["a"] },
        second: { acceptedAnswers: { b: "answer" }, solvedTaskIds: ["b"] },
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
      expect(getCourseProgressCopy(progress)).toBe(expected);
    },
  );
});

type ProgressCopyCase = {
  progress: CourseProgressSnapshot;
  expected: string;
};
