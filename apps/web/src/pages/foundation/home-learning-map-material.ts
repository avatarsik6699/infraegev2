import type { SvgPatternTypes } from "~/shared/components/svg-pattern";

type MaterialKind = "theory" | "practice" | "tasks" | "statistics";

const create = (
  kind: MaterialKind,
  width: number,
  height: number,
  stage = false,
): SvgPatternTypes.PresetProps => {
  const strokes: SvgPatternTypes.Stroke[] = [];
  const nodes: SvgPatternTypes.Node[] = [];
  if (kind === "theory") {
    for (const radius of [20, 30, 40, 50, 60, 70]) {
      strokes.push({
        id: `contour-${String(radius)}`,
        d: `M${String(width - 16 - radius)} 10 A${String(radius)} ${String(radius)} 0 0 0 ${String(width - 16)} ${String(10 + radius)}`,
        strokeWidth: 0.8,
      });
    }
  } else if (kind === "practice") {
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 9; column += 1) {
        nodes.push({
          id: `dot-${String(row)}-${String(column)}`,
          cx: width - 112 + column * 11,
          cy: 12 + row * 10,
          r: 1.05,
        });
      }
    }
  } else if (kind === "tasks") {
    for (let index = 0; index < 5; index += 1) {
      const x = width - 92 + index * 16;
      const y = height - 22 - (index % 2) * 12;
      strokes.push({
        id: `woven-${String(index)}`,
        d: `M${String(x - 10)} ${String(y)}q10 -18 20 0q-10 18 -20 0Z`,
        strokeWidth: 0.8,
      });
    }
  } else {
    for (let index = 0; index < 5; index += 1) {
      const y = height - 10 - index * 8;
      strokes.push({
        id: `wave-${String(index)}`,
        d: `M16 ${String(y)}C60 ${String(y - 36)} 104 ${String(y + 12)} 156 ${String(y - 10)}S${String(width - 54)} ${String(y - 40)} ${String(width - 14)} ${String(y - 24)}`,
        strokeWidth: 0.7,
      });
    }
  }
  return {
    bounds: { x: 10, y: 8, width: width - 20, height: height - 16 },
    strokes,
    nodes,
    fade: {
      from: { x: 0, y: 0 },
      to: { x: 0, y: height },
      stops: [
        { offset: 0, opacity: 0 },
        { offset: 0.14, opacity: 0.8 },
        { offset: 0.4, opacity: stage ? 0.12 : 0.18 },
        { offset: 0.68, opacity: 0.14 },
        { offset: 0.88, opacity: 0.9 },
        { offset: 1, opacity: 0 },
      ],
    },
  };
};

export const homeLearningMapMaterial = { create };
