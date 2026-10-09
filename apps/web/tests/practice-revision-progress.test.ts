import { beforeEach, describe, expect, it } from "vitest";
import {
  currentLessonProgress,
  markTaskSolved,
} from "~/features/lesson-progress/model/lesson-progress-state";
import { createLessonProgressRegistry } from "~/features/lesson-progress/model/lesson-progress-registry";
import { courseProgress } from "~/entities/course";

describe("revision-aware lesson progress", () => {
  beforeEach(() => localStorage.clear());

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
});
