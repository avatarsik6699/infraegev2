import { describe, expect, it } from "vitest";
import { homeLearningMapGeometry } from "~/pages/foundation/home-learning-map-geometry";
import { homeLearningMapPatterns } from "~/pages/foundation/home-learning-map-patterns";
import type { SvgPatternTypes } from "~/shared/components/svg-pattern";

type Point = { x: number; y: number };
type Curve = {
  controls: readonly [Point, Point];
  end: Point;
  id: string;
  start: Point;
  via?: { controls: readonly [Point, Point]; end: Point };
};

const cubicPoint = (
  start: Point,
  controls: readonly [Point, Point],
  end: Point,
  progress: number,
): Point => {
  const inverse = 1 - progress;
  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * progress * controls[0].x +
      3 * inverse * progress ** 2 * controls[1].x +
      progress ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * progress * controls[0].y +
      3 * inverse * progress ** 2 * controls[1].y +
      progress ** 3 * end.y,
  };
};

const sampleCurve = (curve: Curve): Point[] => {
  const segments = curve.via
    ? [
        { start: curve.start, controls: curve.controls, end: curve.via.end },
        {
          start: curve.via.end,
          controls: curve.via.controls,
          end: curve.end,
        },
      ]
    : [{ start: curve.start, controls: curve.controls, end: curve.end }];

  return segments.flatMap((segment, segmentIndex) =>
    Array.from({ length: 81 }, (_, index) => index / 80)
      .slice(segmentIndex === 0 ? 0 : 1)
      .map((progress) =>
        cubicPoint(segment.start, segment.controls, segment.end, progress),
      ),
  );
};

const segmentsCross = (a: Point, b: Point, c: Point, d: Point): boolean => {
  const orientation = (start: Point, end: Point, point: Point) =>
    (end.x - start.x) * (point.y - start.y) -
    (end.y - start.y) * (point.x - start.x);

  return (
    orientation(a, b, c) * orientation(a, b, d) < 0 &&
    orientation(c, d, a) * orientation(c, d, b) < 0
  );
};

describe("home learning map composition", () => {
  it("connects the four stages in order without changing their composition", () => {
    expect(homeLearningMapGeometry.connections.map(({ id }) => id)).toEqual([
      "theory-practice",
      "practice-tasks",
      "tasks-progress",
    ]);
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

    const stageOrder = [
      homeLearningMapGeometry.stages.theory,
      homeLearningMapGeometry.stages.practice,
      homeLearningMapGeometry.stages.tasks,
      homeLearningMapGeometry.stages.progress,
    ];

    homeLearningMapGeometry.connections.forEach((connection, index) => {
      const source = stageOrder[index];
      const destination = stageOrder[index + 1];
      if (!source || !destination) {
        throw new Error("Missing stage for learning-map connection");
      }
      expect(connection.start).toEqual({
        x: source.x + source.width / 2,
        y: source.y + source.height,
      });
      expect(connection.end).toEqual({
        x: destination.x + destination.width / 2,
        y: destination.y,
      });
      expect(connection.end.y).toBeGreaterThan(connection.start.y);
      const endpointX = [connection.start.x, connection.end.x];
      const controlX = connection.controls.map(({ x }) => x);
      expect(Math.min(...controlX)).toBeLessThan(Math.min(...endpointX));
      expect(Math.max(...controlX)).toBeGreaterThan(Math.max(...endpointX));
      for (const control of connection.controls) {
        expect(control.y).toBeGreaterThan(connection.start.y);
        expect(control.y).toBeLessThan(connection.end.y);
      }
    });
  });

  it("keeps satellite trajectories selective and semantically weighted", () => {
    expect(homeLearningMapGeometry.cardConnections.map(({ id }) => id)).toEqual(
      ["theory-card", "practice-card", "tasks-card", "statistics-card"],
    );
    expect(
      homeLearningMapGeometry.patternConnections.map(({ id }) => id),
    ).toEqual([
      "algorithm-pattern",
      "logic-pulse-pattern",
      "byte-pattern",
      "truth-table-pattern",
      "traversal-pattern",
    ]);
    expect(
      homeLearningMapGeometry.cycleConnections.map(({ id }) => id),
    ).toEqual(["practice-card-theory-loop"]);
    expect(homeLearningMapGeometry.patternConnections).toHaveLength(5);
    expect(homeLearningMapGeometry.cardConnections).toHaveLength(4);
    expect(homeLearningMapGeometry.cycleConnections).toHaveLength(1);
    for (const { start } of homeLearningMapGeometry.patternConnections) {
      expect(start.x).toBeGreaterThanOrEqual(
        homeLearningMapGeometry.stages.theory.x,
      );
      expect(start.x).toBeLessThanOrEqual(
        homeLearningMapGeometry.stages.theory.x +
          homeLearningMapGeometry.stages.theory.width,
      );
      expect(start.y).toBeGreaterThanOrEqual(
        homeLearningMapGeometry.stages.theory.y,
      );
      expect(start.y).toBeLessThanOrEqual(
        homeLearningMapGeometry.stages.theory.y +
          homeLearningMapGeometry.stages.theory.height,
      );
    }
    const returnLoop = homeLearningMapGeometry.cycleConnections[0];
    expect(returnLoop.via).toBeDefined();
    expect(returnLoop.end.y).toBeGreaterThan(returnLoop.via.controls[1].y);
  });

  it("keeps every authored connector trajectory free of crossings", () => {
    const curves: readonly Curve[] = [
      ...homeLearningMapGeometry.connections,
      ...homeLearningMapGeometry.cardConnections,
      ...homeLearningMapGeometry.cycleConnections,
      ...homeLearningMapGeometry.patternConnections,
    ];
    const intersections: string[] = [];

    curves.forEach((curve, curveIndex) => {
      const first = sampleCurve(curve);
      curves.slice(curveIndex + 1).forEach((otherCurve) => {
        const second = sampleCurve(otherCurve);
        const crosses = first
          .slice(1)
          .some((point, firstIndex) =>
            second
              .slice(1)
              .some((otherPoint, secondIndex) =>
                segmentsCross(
                  first[firstIndex] ?? point,
                  point,
                  second[secondIndex] ?? otherPoint,
                  otherPoint,
                ),
              ),
          );
        if (crosses) intersections.push(`${curve.id}:${otherCurve.id}`);
      });
    });

    expect(intersections).toEqual([]);
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
