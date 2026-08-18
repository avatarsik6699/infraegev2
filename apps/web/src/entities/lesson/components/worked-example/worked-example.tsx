import { Typography } from "~/shared/components/typography";
import styles from "./worked-example.module.css";

type Props = {
  title: string;
  prompt: React.ReactNode;
  steps: readonly React.ReactNode[];
};

export const WorkedExample: React.FC<Props> = (props) => {
  return (
    <figure className={styles.root}>
      <figcaption className={styles.eyebrow}>Разобранный пример</figcaption>
      <Typography.Text component="div" className={styles.title}>
        {props.title}
      </Typography.Text>
      <Typography.Text component="div" className={styles.prompt}>
        {props.prompt}
      </Typography.Text>
      <ol className={styles.steps}>
        {props.steps.map((step, index) => (
          <li key={index} className={styles.step}>
            <span className={styles.stepBadge} aria-hidden="true">
              {index + 1}
            </span>
            <Typography.Text component="div">{step}</Typography.Text>
          </li>
        ))}
      </ol>
    </figure>
  );
};
