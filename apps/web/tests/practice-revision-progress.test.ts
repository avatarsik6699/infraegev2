import { beforeEach, describe, expect, it } from "vitest";
import {
  currentLessonProgress,
  markTaskSolved,
} from "~/features/lesson-progress/model/lesson-progress-state";
import { lessonProgressStorage } from "~/features/lesson-progress/model/lesson-progress-storage";
import { courseProgress } from "~/entities/course";

describe("revision-aware lesson progress", () => {
  beforeEach(() => localStorage.clear());

  it("migrates the old registry and isolates new revisions from old-tab writes", async () => {
    const task = "python-first-program-output-order";
    localStorage.setItem(
      "infraege:lesson-progress",
      JSON.stringify({
        version: 1,
        data: {
          lessons: {
            "python-first-program": {
              solvedTaskIds: [task],
              acceptedAnswers: { [task]: "42" },
            },
          },
        },
      }),
    );
    const loaded = await lessonProgressStorage.persistStorage.getItem("unused");
    expect(
      loaded?.state.lessons["python-first-program"]?.solvedRevisions?.[task],
    ).toEqual({ "1": "42" });
    if (!loaded) throw new Error("missing migrated state");
    await lessonProgressStorage.persistStorage.setItem("unused", loaded);
    localStorage.setItem(
      "infraege:lesson-progress",
      JSON.stringify({ version: 1, data: { lessons: {} } }),
    );
    expect(
      await lessonProgressStorage.persistStorage.getItem("unused"),
    ).toEqual(loaded);
  });

  it("retains historical answers while only the displayed revision counts", () => {
    const taskId = "python-first-program-output-order";
    const historical = markTaskSolved(
      { solvedTaskIds: [], acceptedAnswers: {} },
      taskId,
      "old",
      1,
    );
    expect(
      currentLessonProgress(historical, [{ id: taskId, solutionRevision: 1 }])
        .solvedTaskIds,
    ).toEqual([taskId]);
    expect(
      currentLessonProgress(historical, [{ id: taskId, solutionRevision: 2 }])
        .solvedTaskIds,
    ).toEqual([]);
    const current = markTaskSolved(historical, taskId, "new", 2);
    expect(current.solvedRevisions?.[taskId]).toEqual({
      "1": "old",
      "2": "new",
    });
    const projected = currentLessonProgress(current, [
      { id: taskId, solutionRevision: 2 },
    ]);
    expect(projected.acceptedAnswers[taskId]).toBe("new");
    const lessons = [
      { id: "lesson", tasks: [{ id: taskId, solutionRevision: 2 }] },
    ];
    expect(
      courseProgress.calculate(lessons, { lesson: projected })
        .masteredLessonIds,
    ).toEqual(["lesson"]);
    expect(
      courseProgress.calculate(lessons, {
        lesson: currentLessonProgress(historical, lessons[0]!.tasks),
      }).masteredLessonIds,
    ).toEqual([]);
  });

  it("does not grant a task success to another lesson", () => {
    const task = { id: "shared-task", solutionRevision: 1 };
    const first = markTaskSolved(
      { solvedTaskIds: [], acceptedAnswers: {} },
      task.id,
      "42",
      1,
    );
    expect(
      courseProgress.calculate(
        [
          { id: "first", tasks: [task] },
          { id: "second", tasks: [task] },
        ],
        { first: currentLessonProgress(first, [task]) },
      ).masteredLessonIds,
    ).toEqual(["first"]);
  });

  it("migrates only verified first-import task membership from legacy lesson storage", () => {
    localStorage.setItem(
      "infraege:lesson:python-first-program:progress",
      JSON.stringify({
        version: 1,
        data: {
          solvedTaskIds: ["python-first-program-output-order", "unrelated"],
          acceptedAnswers: { "python-first-program-output-order": "42" },
        },
      }),
    );
    const progress = lessonProgressStorage.readLegacy("python-first-program");
    expect(progress?.solvedRevisions).toEqual({
      "python-first-program-output-order": { "1": "42" },
    });
    expect(progress?.solvedTaskIds).toContain("unrelated");
  });
});
