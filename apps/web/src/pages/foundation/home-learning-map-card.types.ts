import type { CustomIconTypes } from "~/shared/components/custom-icon";
import type { homeLearningMapGeometry } from "./home-learning-map-geometry";

export type HomeLearningMapCardData =
  (typeof homeLearningMapGeometry.cards)[keyof typeof homeLearningMapGeometry.cards] & {
    caption: string;
    future?: boolean;
    icon: React.FC<CustomIconTypes.GlyphProps>;
    id: keyof typeof homeLearningMapGeometry.cards;
    title: string;
  };
