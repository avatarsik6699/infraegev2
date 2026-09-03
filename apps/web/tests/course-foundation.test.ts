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
  it("publishes the complete expanded curriculum for final evaluation", () => {
    expect(coursePublications).toEqual([
      expect.objectContaining({
        id: "python",
        routeSlug: "python",
        stage: "complete",
        status: "published",
      }),
    ]);
    expect(courseLessonPublications).toHaveLength(28);
    expect(
      courseLessonPublications.filter(
        (lesson) => lesson.status === "published",
      ),
    ).toHaveLength(28);
    expect(
      courseLessonPublications.filter((lesson) => lesson.status === "review"),
    ).toHaveLength(0);
    expect(
      courseLessonPublications.find(
        (lesson) => lesson.id === "python-todo-start",
      ),
    ).toMatchObject({
      routeSlug: "spisok-del",
      title: "Добавляем дела и выводим список",
    });
    expect(
      courseLessonPublications.find(
        (lesson) => lesson.id === "python-todo-actions",
      ),
    ).toMatchObject({ routeSlug: "deystviya-so-spiskom" });
    expect(
      courseLessonPublications.find(
        (lesson) => lesson.id === "python-todo-storage",
      ),
    ).toMatchObject({ routeSlug: "sohranenie-spiska-del" });
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
    ).toMatchObject({ id: "python-errors", status: "published" });
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
    const courseLessons = getCourseLessons(pythonCourse);
    expect(courseLessons).toHaveLength(28);
    expect(courseLessons.slice(0, 5)).toEqual([
      pythonFirstProgramLesson,
      expect.objectContaining({ id: "python-numbers" }),
      pythonErrorsLesson,
      pythonConditionsLesson,
      expect.objectContaining({ id: "python-compound-conditions" }),
    ]);
    expect(pythonCourse.modules).toHaveLength(9);
    expect(
      pythonCourse.modules.flatMap((courseModule) => courseModule.lessonPlan),
    ).toHaveLength(28);
    expect(pythonCourse).toMatchObject({
      summary:
        "От первой программы — к задачам и алгоритмам, которые пригодятся на ЕГЭ.",
      audience:
        "Подойдёт, если вы раньше не программировали: начнём с самого начала и будем двигаться небольшими шагами.",
      learningOutcomes: [
        "Понимать, что делает небольшая программа и как меняются значения",
        "Писать и проверять простые программы на Python",
        "Разбираться в сообщениях об ошибках и находить причину",
        "Собирать знакомые команды и конструкции в терминальное приложение с сохранением данных",
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

  it("preserves the first-program editorial pilot structure and tasks", () => {
    const lesson = findCourseLessonByRouteSlugs("python", "pervaya-programma");

    expect(lesson).toBeDefined();
    expect(lesson?.theory.map((concept) => concept.id)).toEqual([
      "program-order",
      "values-and-variables",
      "input-and-conversion",
      "calculation-and-output",
      "run-and-check",
    ]);
    expect(lesson?.practiceTaskIds).toEqual([
      "python-first-program-output-order",
      "python-first-program-variable-trace",
      "python-first-program-input-conversion",
      "python-first-program-expression",
      "python-first-program-local-run",
    ]);
    expect(lesson).toMatchObject({
      accessTier: "free",
      masteryThreshold: 0.8,
      status: "published",
    });
  });

  it("preserves the foundation editorial batch structure and tasks", () => {
    const cases = [
      {
        routeSlug: "chisla-i-vyrazheniya",
        sectionIds: ["types", "operations", "precedence", "workflow"],
        practiceTaskIds: [
          "python-numbers-precedence",
          "python-numbers-division",
          "python-numbers-remainder",
          "python-numbers-conversion",
          "python-numbers-local-run",
        ],
      },
      {
        routeSlug: "oshibki",
        sectionIds: [
          "error-as-clue",
          "read-bottom-up",
          "syntax-error",
          "name-error",
          "type-or-value",
          "fix-and-rerun",
        ],
        practiceTaskIds: [
          "python-errors-final-line",
          "python-errors-source-line",
          "python-errors-syntax-fix",
          "python-errors-value-error",
          "python-errors-local-fix",
        ],
      },
      {
        routeSlug: "usloviya",
        sectionIds: [
          "comparison-result",
          "if-branch",
          "if-else",
          "comparison-boundaries",
          "test-both-branches",
        ],
        practiceTaskIds: [
          "python-conditions-comparison-result",
          "python-conditions-branch-trace",
          "python-conditions-boundary",
          "python-conditions-operator",
          "python-conditions-local-run",
        ],
      },
      {
        routeSlug: "sostavnye-usloviya",
        sectionIds: ["model", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-compound-conditions-branch-order",
          "python-compound-conditions-logic-trace",
          "python-compound-conditions-boundary",
          "python-compound-conditions-fix",
          "python-compound-conditions-local-run",
        ],
      },
    ] as const;

    for (const lessonCase of cases) {
      const lesson = findCourseLessonByRouteSlugs(
        "python",
        lessonCase.routeSlug,
      );

      expect(lesson).toBeDefined();
      expect(lesson?.theory.map((concept) => concept.id)).toEqual(
        lessonCase.sectionIds,
      );
      expect(lesson?.practiceTaskIds).toEqual(lessonCase.practiceTaskIds);
      expect(lesson).toMatchObject({
        accessTier: "free",
        masteryThreshold: 0.8,
        status: "published",
      });
    }
  });

  it("preserves the loops editorial batch structure and tasks", () => {
    const cases = [
      {
        routeSlug: "for-i-range",
        sectionIds: ["model", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-for-range-range-values",
          "python-for-range-sum-trace",
          "python-for-range-boundary",
          "python-for-range-fix",
          "python-for-range-local-run",
        ],
      },
      {
        routeSlug: "while",
        sectionIds: ["model", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-while-trace",
          "python-while-stop-value",
          "python-while-condition",
          "python-while-fix",
          "python-while-local-run",
        ],
      },
      {
        routeSlug: "schetchiki-i-nakopiteli",
        sectionIds: ["model", "trace", "other-state", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-loop-state-counter",
          "python-loop-state-accumulator",
          "python-loop-state-boundary",
          "python-loop-state-fix",
          "python-loop-state-local-run",
        ],
      },
      {
        routeSlug: "tsifry-chisla",
        sectionIds: ["one-step", "loop", "zero", "procedure"],
        practiceTaskIds: [
          "python-number-digits-last",
          "python-number-digits-shorten",
          "python-number-digits-trace",
          "python-number-digits-sum",
          "python-number-digits-local-run",
        ],
      },
    ] as const;

    for (const lessonCase of cases) {
      const lesson = findCourseLessonByRouteSlugs(
        "python",
        lessonCase.routeSlug,
      );

      expect(lesson).toBeDefined();
      expect(lesson?.theory.map((concept) => concept.id)).toEqual(
        lessonCase.sectionIds,
      );
      expect(lesson?.practiceTaskIds).toEqual(lessonCase.practiceTaskIds);
      expect(lesson).toMatchObject({
        accessTier: "free",
        masteryThreshold: 0.8,
        status: "published",
      });
    }
  });

  it("preserves the collections editorial batch structure and tasks", () => {
    const cases = [
      {
        routeSlug: "stroki",
        sectionIds: ["model", "trace", "split-join", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-strings-index",
          "python-strings-negative-index",
          "python-strings-slice",
          "python-strings-fix",
          "python-strings-local-run",
        ],
      },
      {
        routeSlug: "spiski",
        sectionIds: ["model", "trace", "remove", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-lists-index",
          "python-lists-mutation",
          "python-lists-append",
          "python-lists-trace",
          "python-lists-local-run",
        ],
      },
      {
        routeSlug: "mnozhestva",
        sectionIds: ["model", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-sets-unique-count",
          "python-sets-membership",
          "python-sets-add",
          "python-sets-order",
          "python-sets-local-run",
        ],
      },
      {
        routeSlug: "slovari",
        sectionIds: ["model", "trace", "records", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-dictionaries-lookup",
          "python-dictionaries-update",
          "python-dictionaries-membership",
          "python-dictionaries-get",
          "python-dictionaries-local-run",
        ],
      },
      {
        routeSlug: "sortirovka-i-poisk",
        sectionIds: ["search", "sorted", "key", "choice"],
        practiceTaskIds: [
          "python-sorting-search-linear",
          "python-sorting-search-sorted",
          "python-sorting-search-in-place",
          "python-sorting-search-key",
          "python-sorting-search-local-run",
        ],
      },
      {
        routeSlug: "vklyucheniya",
        sectionIds: ["from-loop", "filter", "kinds", "decision"],
        practiceTaskIds: [
          "python-comprehensions-list",
          "python-comprehensions-filter",
          "python-comprehensions-set",
          "python-comprehensions-dict",
          "python-comprehensions-local-run",
        ],
      },
    ] as const;

    for (const lessonCase of cases) {
      const lesson = findCourseLessonByRouteSlugs(
        "python",
        lessonCase.routeSlug,
      );

      expect(lesson).toBeDefined();
      expect(lesson?.theory.map((concept) => concept.id)).toEqual(
        lessonCase.sectionIds,
      );
      expect(lesson?.practiceTaskIds).toEqual(lessonCase.practiceTaskIds);
      expect(lesson).toMatchObject({
        accessTier: "free",
        masteryThreshold: 0.8,
        status: "published",
      });
    }
  });

  it("preserves the functions and files editorial batch structure and tasks", () => {
    const cases = [
      {
        routeSlug: "funktsii",
        sectionIds: ["model", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-functions-call",
          "python-functions-parameters",
          "python-functions-return",
          "python-functions-fix",
          "python-functions-local-run",
        ],
      },
      {
        routeSlug: "chasti-programmy",
        sectionIds: ["model", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-program-parts-responsibility",
          "python-program-parts-data-flow",
          "python-program-parts-composition",
          "python-program-parts-fix",
          "python-program-parts-local-run",
        ],
      },
      {
        routeSlug: "iteratory-i-generatory",
        sectionIds: ["inside-for", "exhaustion", "generator", "choice"],
        practiceTaskIds: [
          "python-iterators-generators-iterable",
          "python-iterators-generators-next",
          "python-iterators-generators-exhausted",
          "python-iterators-generators-yield",
          "python-iterators-generators-local-run",
        ],
      },
      {
        routeSlug: "obrabotka-isklyucheniy",
        sectionIds: ["expected", "specific", "retry", "decision"],
        practiceTaskIds: [
          "python-exceptions-value-error",
          "python-exceptions-specific",
          "python-exceptions-else",
          "python-exceptions-loop",
          "python-exceptions-local-run",
        ],
      },
      {
        routeSlug: "fayly",
        sectionIds: ["model", "write", "trace", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-files-read-line",
          "python-files-strip",
          "python-files-parse",
          "python-files-aggregate",
          "python-files-local-run",
        ],
      },
      {
        routeSlug: "tablitsy",
        sectionIds: ["model", "trace", "records", "pitfall", "workflow"],
        practiceTaskIds: [
          "python-tables-split",
          "python-tables-columns",
          "python-tables-filter",
          "python-tables-aggregate",
          "python-tables-local-run",
        ],
      },
    ] as const;

    for (const lessonCase of cases) {
      const lesson = findCourseLessonByRouteSlugs(
        "python",
        lessonCase.routeSlug,
      );

      expect(lesson).toBeDefined();
      expect(lesson?.theory.map((concept) => concept.id)).toEqual(
        lessonCase.sectionIds,
      );
      expect(lesson?.practiceTaskIds).toEqual(lessonCase.practiceTaskIds);
      expect(lesson).toMatchObject({
        accessTier: "free",
        masteryThreshold: 0.8,
        status: "published",
      });
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

  it("loads the published errors tasks without checker secrets", async () => {
    const pythonErrorsLesson = findCourseLessonByRouteSlugs(
      "python",
      "oshibki",
    );
    if (!pythonErrorsLesson) {
      throw new Error("Published Python errors lesson fixture is missing");
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

  it("loads every authored lesson task family without checker secrets", async () => {
    for (const publication of courseLessonPublications) {
      const lesson = findCourseLessonByRouteSlugs(
        "python",
        publication.routeSlug,
      );
      expect(lesson).toMatchObject({
        id: publication.id,
        status: publication.status,
      });
      if (!lesson) throw new Error(`Missing lesson ${publication.id}`);

      const tasks = await loadPracticeTasks(lesson.practiceTaskIds);
      expect(tasks.map((task) => task.id)).toEqual(lesson.practiceTaskIds);
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
