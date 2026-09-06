import type { SvgPatternTypes } from "~/shared/components/svg-pattern";

const horizontalFade = (y: number) => ({
  from: { x: 0, y },
  to: { x: 1600, y },
  stops: [
    { offset: 0, opacity: 0 },
    { offset: 0.12, opacity: 0.5 },
    { offset: 0.34, opacity: 0.9 },
    { offset: 0.72, opacity: 0.72 },
    { offset: 1, opacity: 0 },
  ],
});

export const homeAmbientPatterns = {
  engineeringGrid: {
    bounds: { x: 0, y: 0, width: 1600, height: 900 },
    fade: horizontalFade(450),
    opacity: 0.23,
    transform: "translate(-40 20) rotate(-1 800 450)",
    strokes: [
      {
        id: "grid-minor",
        d: "M0 0V860M100 0V860M200 0V860M300 0V860M400 0V860M500 0V860M600 0V860M700 0V860M800 0V860M900 0V860M1000 0V860M1100 0V860M1200 0V860M1300 0V860M1400 0V860M1500 0V860M1600 0V860M0 0H1600M0 90H1600M0 180H1600M0 270H1600M0 360H1600M0 450H1600M0 540H1600M0 630H1600M0 720H1600M0 810H1600M0 860H1600",
        strokeWidth: 0.38,
      },
      {
        id: "grid-major",
        d: "M0 0V860M400 0V860M800 0V860M1200 0V860M1600 0V860M0 0H1600M0 360H1600M0 720H1600",
        opacity: 0.72,
        strokeWidth: 0.58,
      },
      {
        id: "grid-calibration",
        d: "M0 878V860M100 870V860M200 870V860M300 870V860M400 878V860M500 870V860M600 870V860M700 870V860M800 878V860M900 870V860M1000 870V860M1100 870V860M1200 878V860M1300 870V860M1400 870V860M1500 870V860M1600 878V860",
        opacity: 0.82,
        strokeWidth: 0.62,
      },
    ],
    labels: [
      { id: "grid-origin", text: "0", x: 8, y: 850, opacity: 0.56 },
      { id: "grid-x", text: "x", x: 1572, y: 850, opacity: 0.48 },
      { id: "grid-y", text: "y", x: 10, y: 18, opacity: 0.48 },
    ],
  },
  calibration: {
    bounds: { x: 410, y: 120, width: 910, height: 620 },
    fade: horizontalFade(390),
    opacity: 0.4,
    transform: "translate(470 210) rotate(2 360 190)",
    strokes: [
      {
        id: "calibration-axis",
        d: "M0 190H720M0 176V204M90 182V198M180 182V198M270 176V204M360 182V198M450 182V198M540 176V204M630 182V198M720 176V204",
        strokeWidth: 0.72,
        pathLength: 100,
        dashArray: "20 6 9 8 16 7 21 13",
      },
      {
        id: "calibration-brackets",
        d: "M90 146V118H270V146M450 234V262H630V234",
        strokeWidth: 0.5,
        opacity: 0.64,
      },
    ],
    labels: [
      { id: "calibration-20", text: "20", x: 172, y: 110, opacity: 0.55 },
      { id: "calibration-60", text: "60", x: 532, y: 280, opacity: 0.48 },
    ],
  },
  notation: {
    bounds: { x: 500, y: 30, width: 860, height: 210 },
    fade: horizontalFade(120),
    opacity: 0.44,
    transform: "translate(530 70) rotate(-2 390 80)",
    labels: [
      { id: "notation-function", text: "f(n)", x: 0, y: 18 },
      { id: "notation-array", text: "a[m]", x: 225, y: 78, opacity: 0.7 },
      { id: "notation-binary", text: "101101₂", x: 485, y: 12 },
      { id: "notation-graph", text: "O(V+E)", x: 735, y: 96, opacity: 0.62 },
    ],
  },
} as const satisfies Record<string, SvgPatternTypes.PresetProps>;
