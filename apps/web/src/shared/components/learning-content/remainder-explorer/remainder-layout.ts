/**
 * Layout of `figures.remainder_svg` (scripts/lesson_design): n cells in
 * portions of d, full portions first, the remainder last and accented;
 * portions wrap to a new row when they do not fit the 660-wide canvas.
 */
export type RemainderPortion = {
  x: number;
  y: number;
  size: number;
  rest: boolean;
};

export type RemainderLayout = {
  quotient: number;
  remainder: number;
  portions: RemainderPortion[];
  /** Baseline of the summary line under the portions. */
  summaryY: number;
  height: number;
};

export const REMAINDER_CANVAS = {
  width: 660,
  cell: 32,
  gap: 18,
  left: 20,
  top: 16,
  right: 640,
} as const;

const ROW = REMAINDER_CANVAS.cell + 46;

export function remainderLayout(n: number, d: number): RemainderLayout {
  const quotient = Math.floor(n / d);
  const remainder = n % d;
  const sizes = Array.from({ length: quotient }, () => d);
  if (remainder) sizes.push(remainder);
  const { cell, gap, left, top, right } = REMAINDER_CANVAS;
  const portions: RemainderPortion[] = [];
  let x = left;
  let row = 0;
  sizes.forEach((size, index) => {
    const width = size * cell;
    if (x + width > right && x > left) {
      x = left;
      row += 1;
    }
    portions.push({ x, y: top + row * ROW, size, rest: index === quotient });
    x += width + gap;
  });
  const summaryY = top + row * ROW + cell + 70;
  return { quotient, remainder, portions, summaryY, height: summaryY + 18 };
}
