import { SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { practiceCatalog } from "./practice-catalog";
import styles from "./practice-difficulty.module.css";

export const PracticeDifficulty: React.FC<{ level: number }> = (props) => (
  <span className={styles.root}>
    <span className={styles.scale} aria-hidden="true">
      <SignalHigh size={22} viewBox="4 6 16 16" className={styles.track} />
      {props.level === 1 && <SignalLow size={22} viewBox="4 6 16 16" />}
      {props.level === 2 && <SignalMedium size={22} viewBox="4 6 16 16" />}
      {props.level === 3 && <SignalHigh size={22} viewBox="4 6 16 16" />}
    </span>
    {practiceCatalog.difficultyLabel(props.level)}
  </span>
);
