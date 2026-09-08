import type { SvgPatternTypes } from "~/shared/components/svg-pattern";

const bounds = { x: 0, y: 0, width: 260, height: 200 };
const labels = (lines: readonly string[], x = 20, y = 30) =>
  lines.map((text, index) => ({
    id: `line-${String(index)}`,
    text,
    x,
    y: y + index * 22,
  }));

export const topicCatalogPatterns = {
  byte: {
    bounds,
    strokes: [
      {
        id: "cells",
        d: "M20 50H244V82H20ZM48 50V82M76 50V82M104 50V82M132 50V82M160 50V82M188 50V82M216 50V82M20 96v8H244v-8",
        strokeWidth: 0.7,
      },
    ],
    labels: [
      { id: "binary", text: "101101₂", x: 20, y: 35 },
      { id: "bits", text: "1  0  1  1  0  1  0  1", x: 27, y: 71 },
      { id: "byte", text: "8 bit = 1 byte", x: 61, y: 129 },
    ],
  },
  logic: {
    bounds,
    strokes: [
      {
        id: "gate",
        d: "M30 65H65M30 105H65M65 45H100A40 40 0 0 1 100 125H65ZM140 85H200",
        strokeWidth: 0.8,
      },
    ],
    labels: [
      { id: "in-a", text: "1", x: 12, y: 69 },
      { id: "in-b", text: "0", x: 12, y: 109 },
      { id: "and", text: "AND", x: 82, y: 90 },
      { id: "out", text: "0", x: 215, y: 89 },
    ],
  },
  graph: {
    bounds,
    strokes: [
      {
        id: "edges",
        d: "M30 90L90 35 170 70 205 140 100 166 30 90M90 35L100 166 170 70M30 90L170 70",
        strokeWidth: 0.8,
      },
    ],
    nodes: [
      { id: "a", cx: 30, cy: 90, r: 6 },
      { id: "b", cx: 90, cy: 35, r: 6 },
      { id: "c", cx: 170, cy: 70, r: 6 },
      { id: "d", cx: 205, cy: 140, r: 6 },
      { id: "e", cx: 100, cy: 166, r: 6 },
    ],
  },
  search: {
    bounds,
    labels: labels([
      "l, r = 0, n - 1",
      "while l <= r:",
      "  m = (l + r) // 2",
      "  if a[m] == x:",
      "    return m",
      "  elif a[m] < x:",
      "    l = m + 1",
    ]),
  },
  truth: {
    bounds,
    strokes: [{ id: "table", d: "M42 47H198M144 20V168", strokeWidth: 0.7 }],
    labels: labels(
      ["A   B │ Y", "0   0   0", "0   1   1", "1   0   1", "1   1   1"],
      55,
      36,
    ),
  },
  recursion: {
    bounds,
    strokes: [
      {
        id: "tree",
        d: "M130 40L65 78M130 40L195 78M65 107L30 143M65 107L100 143M195 107L160 143M195 107L230 143",
        strokeWidth: 0.8,
      },
    ],
    labels: [
      { id: "root", text: "f(n)", x: 114, y: 30 },
      { id: "left", text: "f(n−1)", x: 42, y: 98 },
      { id: "right", text: "f(n−2)", x: 170, y: 98 },
      { id: "leaf", text: "…", x: 26, y: 170 },
      { id: "leaf2", text: "…", x: 223, y: 170 },
    ],
  },
  powers: {
    bounds,
    labels: labels(
      ["2⁰ = 1", "2¹ = 2", "2² = 4", "2³ = 8", "2⁴ = 16", "2⁵ = 32", "2⁶ = 64"],
      70,
      24,
    ),
  },
  queue: {
    bounds,
    strokes: [
      {
        id: "queue",
        d: "M12 55H38M30 49l8 6-8 6M45 40H77V72H45ZM85 40H117V72H85ZM125 40H157V72H125ZM165 40H197V72H165ZM45 85v10H197v-10M207 55H239M231 49l8 6-8 6",
        strokeWidth: 0.8,
      },
    ],
    labels: [
      { id: "bfs", text: "BFS", x: 98, y: 127 },
      { id: "cost", text: "O(V + E)", x: 79, y: 152 },
    ],
  },
} as const satisfies Record<string, SvgPatternTypes.PresetProps>;
