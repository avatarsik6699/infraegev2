import { X } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import styles from "./mistake.module.css";

type Props = {
  claim: React.ReactNode;
  explanation: React.ReactNode;
};

export const Mistake: React.FC<Props> = (props) => {
  return (
    <figure className={styles.root}>
      <figcaption className={styles.eyebrow}>Типичная ошибка</figcaption>
      <Typography.Text component="div" className={styles.claim}>
        <X
          className={styles.claimIcon}
          size={15}
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <span className={styles.claimText}>{props.claim}</span>
      </Typography.Text>
      <Typography.Text component="div" className={styles.explanation}>
        {props.explanation}
      </Typography.Text>
    </figure>
  );
};
