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
    x: 200,
    y: 0,
    width: 286,
    height: 108,
    rotation: -5,
    originX: 122,
    originY: 40,
  }),
  practice: cardLayout({
    x: 730,
    y: 142,
    width: 282,
    height: 116,
    rotation: 8,
    originX: 124,
    originY: 41,
  }),
  tasks: cardLayout({
    x: -4,
    y: 478,
    width: 290,
    height: 112,
    rotation: 6,
    originX: 129,
    originY: 40,
  }),
  statistics: cardLayout({
    x: 758,
    y: 528,
    width: 286,
    height: 112,
    rotation: -7,
    originX: 126,
    originY: 40,
  }),
} as const;

const projectCardPoint = (
  card: CardLayout,
  point: { x: number; y: number },
) => {
  const localX = point.x - card.originX;
  const localY = point.y - card.originY;
  const rotation = (card.rotation * Math.PI) / 180;
  return {
    x:
      card.x +
      card.originX +
      localX * Math.cos(rotation) -
      localY * Math.sin(rotation),
    y:
      card.y +
      card.originY +
      localX * Math.sin(rotation) +
      localY * Math.cos(rotation),
  };
};

const stages = {
  theory: { x: 400, y: 180, width: 244, height: 78 },
  practice: { x: 418, y: 322, width: 244, height: 78 },
  tasks: { x: 392, y: 456, width: 248, height: 100 },
  progress: { x: 458, y: 614, width: 128, height: 128 },
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
    end: projectCardPoint(cards.theory, {
      x: cards.theory.width / 2,
      y: cards.theory.height + 6,
    }),
  },
  {
    id: "practice-card",
    start: { x: stages.practice.x + stages.practice.width, y: 350 },
    controls: [
      { x: 770, y: 340 },
      { x: 820, y: 205 },
    ],
    end: projectCardPoint(cards.practice, { x: 0, y: -6 }),
  },
  {
    id: "tasks-card",
    start: { x: stages.tasks.x, y: 506 },
    controls: [
      { x: 350, y: 480 },
      { x: 310, y: 570 },
    ],
    end: projectCardPoint(cards.tasks, {
      x: cards.tasks.width + 6,
      y: cards.tasks.height / 2,
    }),
  },
  {
    id: "statistics-card",
    start: { x: stages.progress.x + stages.progress.width, y: 678 },
    controls: [
      { x: 635, y: 680 },
      { x: 713, y: 590 },
    ],
    end: projectCardPoint(cards.statistics, {
      x: -6,
      y: cards.statistics.height / 2,
    }),
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
      { x: 678, y: 50 },
      { x: 790, y: 40 },
    ],
    end: { x: 860, y: 102 },
  },
] as const;

const cycleConnections = [
  {
    id: "practice-card-theory-loop",
    start: projectCardPoint(cards.practice, { x: -6, y: 60 }),
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

const compact = {
  stages: {
    theory: { x: 60, y: 150, scale: 1.7 },
    practice: { x: 530, y: 500, scale: 1.7 },
    tasks: { x: 60, y: 850, scale: 1.7 },
    progress: { x: 660, y: 1190, scale: 1.7 },
  },
  cards: {
    theory: { x: 565, y: 52, scale: 1.4 },
    practice: { x: 60, y: 350, scale: 1.4 },
    tasks: { x: 560, y: 740, scale: 1.4 },
    statistics: { x: 65, y: 1130, scale: 1.4 },
  },
  connections: [
    {
      id: "theory-practice",
      start: { x: 267.4, y: 282.6 },
      controls: [
        { x: 260, y: 410 },
        { x: 745, y: 365 },
      ],
      end: { x: 737.4, y: 500 },
    },
    {
      id: "practice-tasks",
      start: { x: 737.4, y: 632.6 },
      controls: [
        { x: 750, y: 755 },
        { x: 260, y: 725 },
      ],
      end: { x: 270.8, y: 850 },
    },
    {
      id: "tasks-progress",
      start: { x: 270.8, y: 1020 },
      controls: [
        { x: 265, y: 1120 },
        { x: 790, y: 1070 },
      ],
      end: { x: 768.8, y: 1190 },
    },
  ],
  cardConnections: [
    {
      id: "theory-card",
      start: { x: 474.8, y: 195 },
      controls: [
        { x: 540, y: 228 },
        { x: 545, y: 215 },
      ],
      end: { x: 570, y: 180 },
    },
    {
      id: "practice-card",
      start: { x: 530, y: 545 },
      controls: [
        { x: 460, y: 575 },
        { x: 505, y: 455 },
      ],
      end: { x: 450, y: 435 },
    },
    {
      id: "tasks-card",
      start: { x: 481.6, y: 920 },
      controls: [
        { x: 550, y: 945 },
        { x: 535, y: 900 },
      ],
      end: { x: 570, y: 860 },
    },
    {
      id: "statistics-card",
      start: { x: 660, y: 1298.8 },
      controls: [
        { x: 615, y: 1285 },
        { x: 535, y: 1265 },
      ],
      end: { x: 480, y: 1200 },
    },
  ],
  cycleConnections: [
    {
      id: "practice-card-theory-loop",
      start: { x: 265, y: 350 },
      controls: [
        { x: 200, y: 335 },
        { x: 115, y: 320 },
      ],
      via: {
        end: { x: 100, y: 300 },
        controls: [
          { x: 30, y: 265 },
          { x: 20, y: 160 },
        ],
      },
      end: { x: 60, y: 196 },
    },
  ],
} as const;

const cardMotion = {
  theory: { lift: 7, delay: 0 },
  practice: { lift: 15, delay: 0.65 },
  tasks: { lift: 11, delay: 1.2 },
  statistics: { lift: 5, delay: 0.3 },
} as const;

export const homeLearningMapGeometry = {
  projectCardPoint,
  cardMotion,
  compact,
  cardConnections,
  cards,
  connections,
  cycleConnections,
  patternConnections,
  stages,
} as const;
