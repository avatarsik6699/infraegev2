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

export const homeLearningMapGeometry = {
  cards,
  stages,
} as const;
