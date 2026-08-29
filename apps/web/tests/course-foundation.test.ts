import { describe, expect, it } from "vitest";
import {
  courseLessonPublications,
  coursePublications,
  findCourseByRouteSlug,
  findCourseLessonPublicationByRouteSlugs,
  findCourseLessonByRouteSlugs,
  findCoursePublicationByRouteSlug,
  getCourseLessons,
} from "~/entities/course";
import { loadPracticeTasks } from "~/entities/practice-task";
import {
  calculateCourseProgress,
  getCourseProgressCopy,
  type CourseProgressSnapshot,
} from "~/pages/course-overview/components/course-overview-progress.model";

describe("Python course foundation", () => {
  it("publishes two lessons and keeps the errors lesson in review", () => {
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
      expect.objectContaining({
        id: "python-errors",
        routeSlug: "oshibki",
        status: "review",
      }),
      expect.objectContaining({
        id: "python-conditions",
        routeSlug: "usloviya",
        status: "published",
      }),
    ]);
  });

  it("resolves only lessons owned by the requested course", () => {
    const pythonCourse = findCourseByRouteSlug("python");
    const pythonFirstProgramLesson = findCourseLessonByRouteSlugs(
      "python",
      "pervaya-programma",
    );
    const pythonConditionsLesson = findCourseLessonByRouteSlugs(
      "python",
      "usloviya",
    );
    const pythonErrorsLesson = findCourseLessonByRouteSlugs(
      "python",
      "oshibki",
    );

    expect(findCoursePublicationByRouteSlug("python")).toMatchObject({
      id: "python",
      status: "published",
    });
    expect(
      findCourseLessonPublicationByRouteSlugs("python", "pervaya-programma"),
    ).toMatchObject({ id: "python-first-program", status: "published" });
    expect(
      findCourseLessonPublicationByRouteSlugs("missing", "pervaya-programma"),
    ).toBeUndefined();
    expect(
      findCourseLessonPublicationByRouteSlugs("python", "oshibki"),
    ).toMatchObject({ id: "python-errors", status: "review" });
    expect(
      findCourseLessonPublicationByRouteSlugs("python", "usloviya"),
    ).toMatchObject({ id: "python-conditions", status: "published" });
    expect(pythonCourse).toBeDefined();
    expect(pythonFirstProgramLesson).toBeDefined();
    expect(pythonErrorsLesson).toBeDefined();
    expect(pythonConditionsLesson).toBeDefined();
    expect(findCourseLessonByRouteSlugs("missing", "pervaya-programma")).toBe(
      undefined,
    );
    if (
      !pythonCourse ||
      !pythonFirstProgramLesson ||
      !pythonErrorsLesson ||
      !pythonConditionsLesson
    ) {
      throw new Error("Published Python course fixture is missing");
    }
    expect(getCourseLessons(pythonCourse)).toEqual([
      pythonFirstProgramLesson,
      pythonErrorsLesson,
      pythonConditionsLesson,
    ]);
    expect(pythonCourse.modules).toHaveLength(9);
    expect(
      pythonCourse.modules.flatMap((courseModule) => courseModule.lessonPlan),
    ).toHaveLength(19);
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
    const pythonFirstProgramLesson = findCourseLessonByRouteSlugs(
      "python",
      "pervaya-programma",
    );
    if (!pythonFirstProgramLesson) {
      throw new Error("Published Python course lesson fixture is missing");
    }
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

  it("loads the published conditions tasks without checker secrets", async () => {
    const pythonConditionsLesson = findCourseLessonByRouteSlugs(
      "python",
      "usloviya",
    );
    if (!pythonConditionsLesson) {
      throw new Error("Published Python conditions lesson fixture is missing");
    }
    const tasks = await loadPracticeTasks(
      pythonConditionsLesson.practiceTaskIds,
    );

    expect(tasks.map((task) => task.id)).toEqual(
      pythonConditionsLesson.practiceTaskIds,
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

  it("loads the review errors tasks without checker secrets", async () => {
    const pythonErrorsLesson = findCourseLessonByRouteSlugs(
      "python",
      "oshibki",
    );
    if (!pythonErrorsLesson) {
      throw new Error("Review Python errors lesson fixture is missing");
    }
    const tasks = await loadPracticeTasks(pythonErrorsLesson.practiceTaskIds);

    expect(tasks.map((task) => task.id)).toEqual(
      pythonErrorsLesson.practiceTaskIds,
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
