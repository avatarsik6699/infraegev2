import styles from "./foundation-page.module.css";
import { HomeLearningMapScene } from "./home-learning-map-scene";

export const HomeLearningMap: React.FC = () => (
  <div className={styles.map} aria-hidden="true" data-home-map>
    <HomeLearningMapScene />
  </div>
);
