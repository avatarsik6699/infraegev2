import { describe, expect, it } from "vitest";
import {
  preobrazovanieZapiseyChiselLesson,
  rekursiyaLesson,
} from "~/entities/lesson";
import {
  loadMigrationPractice as loadPracticeTasks,
  migrationTaskIds,
} from "./practice-migration-fixture";

describe("lesson route data", () => {
  it("loads public task projections in the authored order without checker secrets", async () => {
    const tasks = await loadPracticeTasks(migrationTaskIds(rekursiyaLesson.id));

    expect(tasks.map((task) => task.id)).toEqual(
      migrationTaskIds(rekursiyaLesson.id),
    );
    // Change 184: the lesson rebuilt from the stand; its final page tasks
    // (task-16-8-…) have no theory link, as on every pipeline lesson.
    expect(tasks).toHaveLength(55);
    expect(tasks.slice(0, 4).map((task) => task.difficultyLabel)).toEqual([
      "Лёгкая",
      "Лёгкая",
      "Лёгкая",
      "Лёгкая",
    ]);
    for (const task of tasks) {
      expect(task.title).not.toBe("");
      expect(task.statement).not.toBe("");
      expect(task.theoryLinks.length > 0).toBe(
        !task.id.startsWith("task-16-8-"),
      );
      expect(task.solution.some((block) => block.type === "code")).toBe(true);
      expect(task).not.toHaveProperty("answer_variants");
      expect(task).not.toHaveProperty("explanation");
    }
  });

  it("loads the task-5 lesson's 39 tasks in order (Change 197)", async () => {
    const ids = migrationTaskIds(preobrazovanieZapiseyChiselLesson.id);
    const tasks = await loadPracticeTasks(ids);

    expect(tasks.map((task) => task.id)).toEqual(ids);
    expect(tasks).toHaveLength(39);
    for (const task of tasks) {
      expect(task.theoryLinks.length > 0).toBe(
        !task.id.startsWith("task-5-7-"),
      );
      expect(task.solution.some((block) => block.type === "code")).toBe(true);
      expect(task).not.toHaveProperty("answer_variants");
      expect(task).not.toHaveProperty("numeric_tolerance");
    }
  });
});
