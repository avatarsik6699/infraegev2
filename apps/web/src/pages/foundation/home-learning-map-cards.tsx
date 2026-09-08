import { CustomIcon } from "~/shared/components/custom-icon";
import { HomeLearningMapCard } from "./home-learning-map-card";
import type { HomeLearningMapCardData } from "./home-learning-map-card.types";
import { homeLearningMapGeometry } from "./home-learning-map-geometry";

const mapCards = [
  {
    ...homeLearningMapGeometry.cards.theory,
    caption: "Понять, как устроено",
    icon: CustomIcon.Book,
    id: "theory",
    title: "Теория",
  },
  {
    ...homeLearningMapGeometry.cards.practice,
    caption: "Разборы и примеры",
    icon: CustomIcon.Checklist,
    id: "practice",
    title: "Практика",
  },
  {
    ...homeLearningMapGeometry.cards.tasks,
    caption: "Применять знания",
    icon: CustomIcon.Braces,
    id: "tasks",
    title: "Задания",
  },
  {
    ...homeLearningMapGeometry.cards.statistics,
    caption: "Замечать свой рост",
    future: true,
    icon: CustomIcon.BarChart,
    id: "statistics",
    title: "Статистика",
  },
] as const satisfies readonly HomeLearningMapCardData[];

export const HomeLearningMapCards: React.FC = () =>
  mapCards.map((card) => <HomeLearningMapCard key={card.id} card={card} />);
