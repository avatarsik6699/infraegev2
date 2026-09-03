import { CircleCheck, CircleX } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import styles from "./mistake.module.css";

type Props = {
  claim: React.ReactNode;
  explanation: React.ReactNode;
};

export const Mistake: React.FC<Props> = (props) => {
  return (
    <aside
      className={styles.root}
      data-learning-block
      aria-label="Сравнение ошибочного и правильного рассуждения"
    >
      <div className={styles.comparison} data-status="incorrect">
        <CircleX
          className={styles.icon}
          aria-hidden="true"
          size={16}
          strokeWidth={1.8}
        />
        <div className={styles.copy}>
          <Typography.Text component="span" className={styles.label}>
            Неверно
          </Typography.Text>
          <Typography.Text component="div" className={styles.content}>
            {props.claim}
          </Typography.Text>
        </div>
      </div>
      <div className={styles.comparison} data-status="correct">
        <CircleCheck
          className={styles.icon}
          aria-hidden="true"
          size={16}
          strokeWidth={1.8}
        />
        <div className={styles.copy}>
          <Typography.Text component="span" className={styles.label}>
            Как правильно
          </Typography.Text>
          <Typography.Text component="div" className={styles.content}>
            {props.explanation}
          </Typography.Text>
        </div>
      </div>
    </aside>
  );
};
