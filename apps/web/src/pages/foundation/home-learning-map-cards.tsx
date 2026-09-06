import { CustomIcon } from "~/shared/components/custom-icon";
import type { CustomIconTypes } from "~/shared/components/custom-icon";
import styles from "./foundation-page.module.css";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

type MapCard = {
  caption: string;
  future?: boolean;
  height: number;
  icon: React.FC<CustomIconTypes.GlyphProps>;
  iconBox: { height: number; width: number; x: number; y: number };
  id: string;
  textX: number;
  title: string;
  transform: string;
  width: number;
};

const mapCards = [
  {
    ...homeLearningMapGeometry.cards.theory,
    caption: "Понятно о сложном",
    icon: CustomIcon.Book,
    iconBox: { height: 54, width: 60, x: 20, y: 13 },
    id: "theory",
    textX: 96,
    title: "Теория",
  },
  {
    ...homeLearningMapGeometry.cards.practice,
    caption: "Разборы и примеры",
    icon: CustomIcon.Checklist,
    iconBox: { height: 58, width: 48, x: 22, y: 12 },
    id: "practice",
    textX: 91,
    title: "Практика",
  },
  {
    ...homeLearningMapGeometry.cards.tasks,
    caption: "Тренируйся на реальных",
    icon: CustomIcon.Braces,
    iconBox: { height: 48, width: 64, x: 16, y: 16 },
    id: "tasks",
    textX: 91,
    title: "Задания",
  },
  {
    ...homeLearningMapGeometry.cards.statistics,
    caption: "Отслеживай прогресс",
    future: true,
    icon: CustomIcon.BarChart,
    iconBox: { height: 52, width: 58, x: 17, y: 15 },
    id: "statistics",
    textX: 90,
    title: "Статистика",
  },
] as const satisfies readonly MapCard[];

const MapPaperCard: React.FC<{ card: MapCard }> = ({ card }) => {
  const Icon = card.icon;
  const highlightEnd = card.width - 14;

  return (
    <g
      className={`${styles.paperCard}${card.future ? ` ${styles.futurePaperCard}` : ""}`}
      data-home-map-card={card.id}
      transform={card.transform}
    >
      <rect
        className={styles.cardSurface}
        data-card-surface
        width={card.width}
        height={card.height}
        rx="10"
      />
      <rect
        className={styles.surfaceMotionBorder}
        data-home-motion="card-border"
        width={card.width}
        height={card.height}
        pathLength="100"
        rx="10"
      />
      <path
        className={styles.cardHighlight}
        d={`M14 2.5 C${card.width * 0.34} .7 ${card.width * 0.72} 1.2 ${highlightEnd} 3`}
      />
      <Icon
        className={styles.cardIcon}
        x={card.iconBox.x}
        y={card.iconBox.y}
        width={card.iconBox.width}
        height={card.iconBox.height}
      />
      <text className={styles.cardTitle} x={card.textX} y="34">
        {card.title}
      </text>
      <text
        className={styles.cardCaption}
        data-card-caption
        x={card.textX}
        y="58"
      >
        {card.caption}
      </text>
    </g>
  );
};

export const HomeLearningMapCards: React.FC = () =>
  mapCards.map((card) => <MapPaperCard key={card.id} card={card} />);
