// Ink pen shared by the pose build and the scenes: seeded random, spline,
// variable-width stroke outline and ink drop.

export const INK = "#17191e";
export const ORANGE = "#ff6a00";

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Catmull-Rom spline through the points.
export function dense(pts, per) {
  const result = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    for (let k = 0; k < per; k++) {
      const t = k / per;
      const t2 = t * t;
      const t3 = t2 * t;
      result.push(
        [0, 1].map(
          (j) =>
            0.5 *
            (2 * p1[j] +
              (-p0[j] + p2[j]) * t +
              (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 +
              (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3),
        ),
      );
    }
  }
  result.push(pts[pts.length - 1]);
  return result;
}

export const polygon = (ring) =>
  "M" +
  ring.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L") +
  " Z";

// Variable-width stroke outline: pen pressure along the line, tapered ends.
export function inkStroke(
  pts,
  width,
  r,
  { taperIn = 0.14, taperOut = 0.2 } = {},
) {
  const n = pts.length;
  const cumulative = [0];
  for (let i = 1; i < n; i++) {
    cumulative.push(
      cumulative[i - 1] +
        Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]),
    );
  }
  const total = cumulative[n - 1] || 1;
  const f1 = 1 + r() * 2.5;
  const ph1 = r() * 6.28;
  const f2 = 4 + r() * 5;
  const ph2 = r() * 6.28;
  const left = [];
  const right = [];
  for (let i = 0; i < n; i++) {
    const t = cumulative[i] / total;
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    let nx = -(b[1] - a[1]);
    let ny = b[0] - a[0];
    const length = Math.hypot(nx, ny) || 1;
    nx /= length;
    ny /= length;
    const taper = Math.min(1, t / taperIn, (1 - t) / taperOut);
    const pressure =
      0.78 +
      0.22 * Math.sin(t * Math.PI * f1 + ph1) +
      0.08 * Math.sin(t * Math.PI * f2 + ph2);
    const half =
      Math.max(0.25, width * pressure * Math.pow(Math.max(0, taper), 0.55)) / 2;
    left.push([pts[i][0] + nx * half, pts[i][1] + ny * half]);
    right.push([pts[i][0] - nx * half, pts[i][1] - ny * half]);
  }
  return polygon(left.concat(right.reverse()));
}

// Ink drop: eye dots, the dot of a question mark.
export function inkDot(cx, cy, rx, ry, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const k = 0.85 + r() * 0.3;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  pts.push(pts[0], pts[1]);
  return polygon(dense(pts, 4));
}
