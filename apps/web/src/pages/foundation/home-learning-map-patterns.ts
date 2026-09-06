import type { SvgDrawingTypes } from "~/shared/components/svg-drawing";
import type { SvgPatternTypes } from "~/shared/components/svg-pattern";

const fieldFade = (
  from: SvgDrawingTypes.Point,
  to: SvgDrawingTypes.Point,
): SvgDrawingTypes.Fade => ({
  from,
  to,
  stops: [
    { offset: 0, opacity: 0 },
    { offset: 0.12, opacity: 0.42 },
    { offset: 0.28, opacity: 0.92 },
    { offset: 0.66, opacity: 0.84 },
    { offset: 0.9, opacity: 0.28 },
    { offset: 1, opacity: 0 },
  ],
});

const labels = (
  prefix: string,
  lines: readonly Omit<SvgPatternTypes.Label, "id">[],
): readonly SvgPatternTypes.Label[] =>
  lines.map((line, index) => ({
    id: `${prefix}-${String(index + 1)}`,
    ...line,
  }));

export const homeLearningMapPatterns = {
  algorithm: {
    bounds: { x: -24, y: 18, width: 236, height: 220 },
    fade: fieldFade({ x: -24, y: 128 }, { x: 212, y: 128 }),
    opacity: 0.68,
    transform: "translate(-8 58) rotate(-3.4 88 82)",
    labels: labels("algorithm", [
      { text: "def bin_search(a, x):", x: 0, y: 0, opacity: 0.92 },
      { text: "l, r = 0, len(a) - 1", x: 18, y: 23 },
      { text: "while l <= r:", x: 18, y: 46 },
      { text: "m = (l + r) // 2", x: 40, y: 69 },
      { text: "if a[m] == x:", x: 40, y: 92 },
      { text: "return m", x: 62, y: 115, opacity: 0.82 },
      { text: "elif a[m] < x:", x: 40, y: 138, opacity: 0.68 },
      { text: "l = m + 1", x: 62, y: 161, opacity: 0.54 },
    ]),
  },
  logicPulse: {
    bounds: { x: 540, y: 24, width: 172, height: 100 },
    fade: fieldFade({ x: 540, y: 74 }, { x: 712, y: 74 }),
    opacity: 0.55,
    transform: "translate(558 48) rotate(4.2 51 22)",
    strokes: [
      {
        id: "logic-pulse",
        d: "M0 28H24V12H49V29H76V18H102",
        strokeWidth: 0.6,
        pathLength: 100,
        dashArray: "24 2 18 3 28 2 20 3",
      },
    ],
    labels: labels("pulse", [
      { text: "0", x: 2, y: 4, opacity: 0.64 },
      { text: "1", x: 42, y: 4, opacity: 0.78 },
      { text: "0", x: 94, y: 4, opacity: 0.56 },
    ]),
  },
  byte: {
    bounds: { x: -18, y: 262, width: 288, height: 164 },
    fade: fieldFade({ x: -18, y: 344 }, { x: 270, y: 344 }),
    opacity: 0.74,
    transform: "translate(12 284) rotate(3.2 96 52)",
    strokes: [
      {
        id: "byte-cells",
        d: "M0 22H192V58H0ZM32 22V58M64 22V58M96 22V58M128 22V58M160 22V58",
        strokeWidth: 0.62,
      },
      {
        id: "byte-bracket",
        d: "M0 72v8h192v-8",
        strokeWidth: 0.62,
      },
    ],
    labels: labels("byte", [
      { text: "101101₂", x: 0, y: 0, opacity: 0.88 },
      { text: "1", x: 13, y: 47 },
      { text: "0", x: 45, y: 47 },
      { text: "1", x: 77, y: 47 },
      { text: "1", x: 109, y: 47 },
      { text: "0", x: 141, y: 47 },
      { text: "1", x: 173, y: 47 },
      { text: "6 bit", x: 96, y: 104, opacity: 0.68 },
    ]),
  },
  truthTable: {
    bounds: { x: 852, y: 8, width: 188, height: 202 },
    fade: fieldFade({ x: 1040, y: 109 }, { x: 852, y: 109 }),
    opacity: 0.67,
    transform: "translate(874 28) rotate(3.6 56 67)",
    strokes: [
      {
        id: "truth-table-frame",
        d: "M0 24H112M72 0V134",
        strokeWidth: 0.64,
      },
    ],
    labels: labels("truth", [
      { text: "A", x: 10, y: 14 },
      { text: "B", x: 42, y: 14 },
      { text: "Y", x: 88, y: 14 },
      { text: "0", x: 10, y: 48 },
      { text: "0", x: 42, y: 48 },
      { text: "0", x: 88, y: 48 },
      { text: "0", x: 10, y: 76 },
      { text: "1", x: 42, y: 76 },
      { text: "1", x: 88, y: 76 },
      { text: "1", x: 10, y: 104 },
      { text: "0", x: 42, y: 104 },
      { text: "1", x: 88, y: 104 },
      { text: "1", x: 10, y: 132, opacity: 0.64 },
      { text: "1", x: 42, y: 132, opacity: 0.64 },
      { text: "1", x: 88, y: 132, opacity: 0.64 },
    ]),
  },
  powers: {
    bounds: { x: 864, y: 286, width: 176, height: 204 },
    fade: fieldFade({ x: 1040, y: 388 }, { x: 864, y: 388 }),
    opacity: 0.62,
    transform: "translate(884 320) rotate(4.4 42 68)",
    labels: labels("powers", [
      { text: "2⁰  =   1", x: 0, y: 0 },
      { text: "2¹  =   2", x: 0, y: 27 },
      { text: "2²  =   4", x: 0, y: 54 },
      { text: "2³  =   8", x: 0, y: 81 },
      { text: "2⁴  =  16", x: 0, y: 108, opacity: 0.82 },
      { text: "2⁵  =  32", x: 0, y: 135, opacity: 0.6 },
    ]),
  },
  hexNibble: {
    bounds: { x: 792, y: 612, width: 224, height: 94 },
    fade: fieldFade({ x: 1016, y: 659 }, { x: 792, y: 659 }),
    opacity: 0.5,
    transform: "translate(824 646) rotate(-3.8 61 26)",
    strokes: [
      {
        id: "hex-nibble-bracket",
        d: "M0 20v8h122v-8M61 28v13",
        strokeWidth: 0.56,
      },
    ],
    labels: labels("hex", [
      { text: "2D₁₆", x: 0, y: 5, opacity: 0.78 },
      { text: "0010 1101₂", x: 122, y: 5, opacity: 0.62, textAnchor: "end" },
      { text: "45₁₀", x: 61, y: 56, opacity: 0.54, textAnchor: "middle" },
    ]),
  },
  traversal: {
    bounds: { x: -12, y: 590, width: 328, height: 130 },
    fade: fieldFade({ x: -12, y: 655 }, { x: 316, y: 655 }),
    opacity: 0.64,
    transform: "translate(28 620) rotate(3.4 123 49)",
    strokes: [
      {
        id: "traversal-route",
        d: "M8 49C38 16 68 22 96 48S151 78 182 46 222 15 246 34",
        strokeWidth: 0.66,
        pathLength: 100,
        dashArray: "16 4 8 5 20 6 5 5",
      },
      {
        id: "traversal-branches",
        d: "M96 48C82 66 72 78 61 91M182 46C195 61 207 72 224 83",
        strokeWidth: 0.56,
        pathLength: 100,
        dashArray: "14 5 4 6",
        opacity: 0.72,
      },
    ],
    labels: labels("traversal", [
      { text: "BFS", x: 0, y: 0, opacity: 0.72 },
      { text: "O(V+E)", x: 194, y: 1, opacity: 0.58 },
    ]),
    nodes: [
      { id: "start", cx: 8, cy: 49, r: 2.5 },
      { id: "one", cx: 52, cy: 31, r: 2.5 },
      { id: "two", cx: 96, cy: 48, r: 2.5 },
      { id: "three", cx: 141, cy: 67, r: 2.5 },
      { id: "four", cx: 182, cy: 46, r: 2.5 },
      { id: "five", cx: 220, cy: 23, r: 2.5 },
      { id: "end", cx: 246, cy: 34, r: 3 },
      { id: "branch-a", cx: 61, cy: 91, r: 2.2, opacity: 0.72 },
      { id: "branch-b", cx: 224, cy: 83, r: 2.2, opacity: 0.72 },
    ],
  },
} as const satisfies Record<string, SvgPatternTypes.PresetProps>;
