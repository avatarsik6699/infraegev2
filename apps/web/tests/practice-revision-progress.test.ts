import { beforeEach, describe, expect, it } from "vitest";
import {
  currentLessonProgress,
  markTaskSolved,
} from "~/features/lesson-progress/model/lesson-progress-state";
import { createLessonProgressRegistry } from "~/features/lesson-progress/model/lesson-progress-registry";
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
    expect(JSON.stringify(loaded)).not.toContain("42");
    expect(
      loaded?.state.lessons["python-first-program"]?.solvedRevisions?.[task],
    ).toEqual({ "1": true });
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

  it("retains historical revision facts while only the displayed revision counts", () => {
    const taskId = "python-first-program-output-order";
    const historical = markTaskSolved({ solvedTaskIds: [] }, taskId, 1);
    expect(
      currentLessonProgress(historical, [{ id: taskId, solutionRevision: 1 }])
        .solvedTaskIds,
    ).toEqual([taskId]);
    expect(
      currentLessonProgress(historical, [{ id: taskId, solutionRevision: 2 }])
        .solvedTaskIds,
    ).toEqual([]);
    const current = markTaskSolved(historical, taskId, 2);
    expect(current.solvedRevisions?.[taskId]).toEqual({
      "1": true,
      "2": true,
    });
    const projected = currentLessonProgress(current, [
      { id: taskId, solutionRevision: 2 },
    ]);
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
    const first = markTaskSolved({ solvedTaskIds: [] }, task.id, 1);
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

  it("rejects guest store writes while retaining member revision facts", () => {
    const guest = createLessonProgressRegistry();
    const guestResult = guest.getState().markSolved("lesson", "task", 1);
    expect(guestResult).toEqual({ solvedTaskIds: [] });
    expect(guest.getState().lessons).toEqual({});

    const member = createLessonProgressRegistry("account-1");
    member.getState().markSolved("lesson", "task", 1);
    expect(member.getState().lessons).toEqual({
      lesson: {
        solvedTaskIds: ["task"],
        solvedRevisions: { task: { "1": true } },
      },
    });
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
      "python-first-program-output-order": { "1": true },
    });
    expect(progress?.solvedTaskIds).toContain("unrelated");
  });
});
