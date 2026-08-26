import { TriangleAlert } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import styles from "./mistake.module.css";

type Props = {
  claim: React.ReactNode;
  explanation: React.ReactNode;
};

export const Mistake: React.FC<Props> = (props) => {
  return (
    <aside className={styles.root} aria-label="Частая ошибка">
      <div className={styles.heading}>
        <TriangleAlert
          className={styles.icon}
          aria-hidden="true"
          size={18}
          strokeWidth={2}
        />
        <Typography.Text component="span" className={styles.label}>
          Частая ошибка
        </Typography.Text>
      </div>
      <Typography.Text component="div" className={styles.claim}>
        {props.claim}
      </Typography.Text>
      <Typography.Text component="div" className={styles.explanationLabel}>
        Что здесь не так
      </Typography.Text>
      <Typography.Text component="div" className={styles.explanation}>
        {props.explanation}
      </Typography.Text>
    </aside>
  );
};
