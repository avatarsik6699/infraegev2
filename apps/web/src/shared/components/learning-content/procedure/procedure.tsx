import { Typography } from "~/shared/components/typography";
import styles from "./procedure.module.css";

type ProcedureStep = {
  label: string;
  detail: React.ReactNode;
};

type Props = {
  title: string;
  steps: readonly ProcedureStep[];
};

export const Procedure: React.FC<Props> = (props) => {
  return (
    <figure className={styles.root}>
      <figcaption className={styles.eyebrow}>Как действовать</figcaption>
      <Typography.Text component="div" className={styles.title}>
        {props.title}
      </Typography.Text>
      <ol className={styles.steps}>
        {props.steps.map((step) => (
          <li key={step.label} className={styles.step}>
            <Typography.Text component="div">
              <strong className={styles.stepLabel}>{step.label}</strong>{" "}
              {step.detail}
            </Typography.Text>
          </li>
        ))}
      </ol>
    </figure>
  );
};
