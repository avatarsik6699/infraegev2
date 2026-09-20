import { PracticeDifficultyGlyph } from "./practice-difficulty-glyph";
import { practiceCatalog } from "./practice-catalog";
import styles from "./practice-difficulty.module.css";

export const PracticeDifficulty: React.FC<{ level: number }> = (props) => (
  <span className={styles.root}>
    <PracticeDifficultyGlyph level={props.level} />
    {practiceCatalog.difficultyLabel(props.level)}
  </span>
);
