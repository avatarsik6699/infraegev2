import { describe, expect, it } from "vitest";
import { homeLearningMapGeometry } from "~/pages/foundation/home-learning-map-geometry";
import { homeLearningMapPatterns } from "~/pages/foundation/home-learning-map-patterns";
import type { SvgPatternTypes } from "~/shared/components/svg-pattern";

describe("home learning map composition", () => {
  it("keeps the stage and card composition free of connector geometry", () => {
    expect(homeLearningMapGeometry).not.toHaveProperty("connections");
    expect(homeLearningMapGeometry.cards.theory.x).toBeLessThan(
      homeLearningMapGeometry.stages.theory.x,
    );
    expect(homeLearningMapGeometry.cards.practice.x).toBeGreaterThan(
      homeLearningMapGeometry.stages.practice.x,
    );
    expect(homeLearningMapGeometry.cards.tasks.x).toBeLessThan(
      homeLearningMapGeometry.stages.tasks.x,
    );
    expect(homeLearningMapGeometry.cards.statistics.x).toBeGreaterThan(
      homeLearningMapGeometry.stages.tasks.x,
    );

    const theoryGap =
      homeLearningMapGeometry.stages.theory.y -
      (homeLearningMapGeometry.cards.theory.y +
        homeLearningMapGeometry.cards.theory.height);
    const practiceGap =
      homeLearningMapGeometry.cards.practice.x -
      (homeLearningMapGeometry.stages.practice.x +
        homeLearningMapGeometry.stages.practice.width);
    const tasksGap =
      homeLearningMapGeometry.stages.tasks.x -
      (homeLearningMapGeometry.cards.tasks.x +
        homeLearningMapGeometry.cards.tasks.width);
    const statisticsGap =
      homeLearningMapGeometry.cards.statistics.x -
      (homeLearningMapGeometry.stages.tasks.x +
        homeLearningMapGeometry.stages.tasks.width);

    for (const gap of [theoryGap, practiceGap, tasksGap, statisticsGap]) {
      expect(gap).toBeGreaterThanOrEqual(52);
    }

    for (const card of Object.values(homeLearningMapGeometry.cards)) {
      expect(card.width).toBeGreaterThanOrEqual(244);
    }

    expect(homeLearningMapGeometry.cards.tasks.x).toBeLessThan(0);
    expect(homeLearningMapGeometry.cards.practice.x).toBeGreaterThanOrEqual(
      770,
    );
  });

  it("uses the approved notation presets plus two quiet gap fillers", () => {
    expect(Object.keys(homeLearningMapPatterns)).toEqual([
      "algorithm",
      "logicPulse",
      "byte",
      "truthTable",
      "powers",
      "hexNibble",
      "traversal",
    ]);
    expect(homeLearningMapPatterns).not.toHaveProperty("recursion");
    expect(homeLearningMapPatterns).not.toHaveProperty("graph");
  });

  it("fades every background field at both outer edges", () => {
    for (const preset of Object.values(homeLearningMapPatterns)) {
      expect(preset.fade.stops[0]?.opacity).toBe(0);
      expect(preset.fade.stops.at(-1)?.opacity).toBe(0);
      expect(preset.transform).toContain("rotate(");
    }
  });

  it("keeps structural pattern strokes quiet and single-layered", () => {
    const strokes: SvgPatternTypes.Stroke[] = [];
    for (const preset of Object.values(homeLearningMapPatterns)) {
      if ("strokes" in preset) strokes.push(...preset.strokes);
    }

    expect(strokes).toHaveLength(7);
    for (const stroke of strokes) {
      expect(stroke).not.toHaveProperty("echoes");
      expect(stroke.strokeWidth).toBeLessThanOrEqual(0.66);
    }
  });
});
