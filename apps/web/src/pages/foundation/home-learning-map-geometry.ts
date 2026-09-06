type CardLayout = {
  height: number;
  originX: number;
  originY: number;
  rotation: number;
  width: number;
  x: number;
  y: number;
};

const cardLayout = (layout: CardLayout) => ({
  ...layout,
  transform: `translate(${String(layout.x)} ${String(layout.y)}) rotate(${String(layout.rotation)} ${String(layout.originX)} ${String(layout.originY)})`,
});

const cards = {
  theory: cardLayout({
    x: 230,
    y: 22,
    width: 244,
    height: 80,
    rotation: -5,
    originX: 122,
    originY: 40,
  }),
  practice: cardLayout({
    x: 770,
    y: 144,
    width: 248,
    height: 82,
    rotation: 8,
    originX: 124,
    originY: 41,
  }),
  tasks: cardLayout({
    x: -12,
    y: 500,
    width: 258,
    height: 80,
    rotation: 6,
    originX: 129,
    originY: 40,
  }),
  statistics: cardLayout({
    x: 766,
    y: 528,
    width: 252,
    height: 80,
    rotation: -7,
    originX: 126,
    originY: 40,
  }),
} as const;

const stages = {
  theory: { x: 400, y: 180, width: 244, height: 78 },
  practice: { x: 418, y: 322, width: 244, height: 78 },
  tasks: { x: 392, y: 456, width: 248, height: 100 },
  progress: { x: 451, y: 628, width: 142, height: 54 },
} as const;

const stageCenterX = (stage: (typeof stages)[keyof typeof stages]) =>
  stage.x + stage.width / 2;

const connections = [
  {
    id: "theory-practice",
    start: {
      x: stageCenterX(stages.theory),
      y: stages.theory.y + stages.theory.height,
    },
    end: {
      x: stageCenterX(stages.practice),
      y: stages.practice.y,
    },
    controls: [
      { x: 520, y: 280 },
      { x: 542, y: 300 },
    ],
  },
  {
    id: "practice-tasks",
    start: {
      x: stageCenterX(stages.practice),
      y: stages.practice.y + stages.practice.height,
    },
    end: {
      x: stageCenterX(stages.tasks),
      y: stages.tasks.y,
    },
    controls: [
      { x: 542, y: 420 },
      { x: 514, y: 438 },
    ],
  },
  {
    id: "tasks-progress",
    start: {
      x: stageCenterX(stages.tasks),
      y: stages.tasks.y + stages.tasks.height,
    },
    end: {
      x: stageCenterX(stages.progress),
      y: stages.progress.y,
    },
    controls: [
      { x: 514, y: 580 },
      { x: 524, y: 604 },
    ],
  },
] as const;

const cardConnections = [
  {
    id: "theory-card",
    start: { x: 470, y: stages.theory.y },
    controls: [
      { x: 466, y: 136 },
      { x: 398, y: 146 },
    ],
    end: { x: 359, y: 110 },
  },
  {
    id: "practice-card",
    start: { x: stages.practice.x + stages.practice.width, y: 350 },
    controls: [
      { x: 770, y: 340 },
      { x: 820, y: 205 },
    ],
    end: { x: 778, y: 130 },
  },
  {
    id: "tasks-card",
    start: { x: stages.tasks.x, y: 506 },
    controls: [
      { x: 350, y: 480 },
      { x: 310, y: 570 },
    ],
    end: { x: 254, y: 553 },
  },
  {
    id: "statistics-card",
    start: { x: stages.progress.x + stages.progress.width, y: 655 },
    controls: [
      { x: 635, y: 680 },
      { x: 713, y: 590 },
    ],
    end: { x: 758, y: 585 },
  },
] as const;

const patternConnections = [
  {
    id: "algorithm-pattern",
    start: { x: stages.theory.x, y: 206 },
    controls: [
      { x: 342, y: 272 },
      { x: 256, y: 112 },
    ],
    end: { x: 182, y: 160 },
  },
  {
    id: "logic-pulse-pattern",
    start: { x: 590, y: stages.theory.y },
    controls: [
      { x: 575, y: 150 },
      { x: 625, y: 120 },
    ],
    end: { x: 610, y: 91 },
  },
  {
    id: "byte-pattern",
    start: { x: stages.theory.x, y: 238 },
    controls: [
      { x: 350, y: 315 },
      { x: 280, y: 270 },
    ],
    end: { x: 216, y: 326 },
  },
  {
    id: "truth-table-pattern",
    start: { x: 624, y: stages.theory.y },
    controls: [
      { x: 678, y: 92 },
      { x: 790, y: 76 },
    ],
    end: { x: 860, y: 102 },
  },
  {
    id: "traversal-pattern",
    start: { x: stages.theory.x, y: 248 },
    controls: [
      { x: 350, y: 330 },
      { x: 370, y: 430 },
    ],
    via: {
      end: { x: 386, y: 455 },
      controls: [
        { x: 410, y: 500 },
        { x: 390, y: 610 },
      ],
    },
    end: { x: 290, y: 660 },
  },
] as const;

const cycleConnections = [
  {
    id: "practice-card-theory-loop",
    start: { x: 766, y: 210 },
    controls: [
      { x: 730, y: 195 },
      { x: 710, y: 180 },
    ],
    via: {
      end: { x: 690, y: 185 },
      controls: [
        { x: 668, y: 195 },
        { x: 672, y: 198 },
      ],
    },
    end: { x: stages.theory.x + stages.theory.width + 4, y: 215 },
  },
] as const;

export const homeLearningMapGeometry = {
  cardConnections,
  cards,
  connections,
  cycleConnections,
  patternConnections,
  stages,
} as const;
