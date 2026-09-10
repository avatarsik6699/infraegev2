import { CustomIcon } from "~/shared/components/custom-icon";
import styles from "./status-scene.module.css";

const statusSceneCardIcons = {
  theory: CustomIcon.Book,
  practice: CustomIcon.Checklist,
  tasks: CustomIcon.Braces,
  statistics: CustomIcon.BarChart,
};

export const StatusSceneCard: React.FC<{
  kind: keyof typeof statusSceneCardIcons;
  label: string;
}> = (props) => {
  const Icon = statusSceneCardIcons[props.kind];
  return (
    <div className={styles.card} data-card={props.kind}>
      <Icon className={styles.cardIcon} />
      <div className={styles.cardContent}>
        <span className={styles.cardLabel}>{props.label}</span>
        <i />
        <i />
        <i />
      </div>
    </div>
  );
};
