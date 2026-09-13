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
    expect(tasks.map((task) => task.difficultyLabel)).toEqual([
      "Базовая",
      "Средняя",
      "Средняя",
      "Высокая",
      "Высокая",
    ]);
    for (const task of tasks) {
      expect(task.title).not.toBe("");
      expect(task.statement).not.toBe("");
      expect(task.theoryLinks.length).toBeGreaterThan(0);
      expect(task.solution.length).toBeGreaterThan(0);
      expect(task).not.toHaveProperty("answer_variants");
      expect(task).not.toHaveProperty("explanation");
    }
    expect(tasks[1]?.solution.some((block) => block.type === "code")).toBe(
      true,
    );
    expect(tasks[3]?.solution.some((block) => block.type === "code")).toBe(
      true,
    );
  });

  it("loads five task-5 projections in order without checker secrets", async () => {
    const tasks = await loadPracticeTasks(
      migrationTaskIds(preobrazovanieZapiseyChiselLesson.id),
    );

    expect(tasks.map((task) => task.id)).toEqual(
      migrationTaskIds(preobrazovanieZapiseyChiselLesson.id),
    );
    expect(tasks.map((task) => task.difficultyLabel)).toEqual([
      "Базовая",
      "Средняя",
      "Средняя",
      "Высокая",
      "Высокая",
    ]);
    for (const task of tasks) {
      expect(task.title).not.toBe("");
      expect(task.statement).not.toBe("");
      expect(task.theoryLinks.length).toBeGreaterThan(0);
      expect(task.solution.length).toBeGreaterThan(0);
      expect(task).not.toHaveProperty("answer_variants");
      expect(task).not.toHaveProperty("numeric_tolerance");
      expect(task).not.toHaveProperty("explanation");
    }
    expect(tasks[4]?.solution.some((block) => block.type === "code")).toBe(
      true,
    );
  });
});
