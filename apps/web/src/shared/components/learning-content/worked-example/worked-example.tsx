import { ListOrdered } from "lucide-react";
import { Typography } from "~/shared/components/typography";
import styles from "./worked-example.module.css";

type Props = {
  children?: React.ReactNode;
  title: React.ReactNode;
  prompt: React.ReactNode;
  steps: readonly React.ReactNode[];
  withIcon?: boolean;
};

export const WorkedExample: React.FC<Props> = ({
  withIcon = true,
  ...props
}) => {
  return (
    <figure className={styles.root} data-learning-block>
      <figcaption
        className={styles.eyebrow}
        data-has-icon={withIcon || undefined}
      >
        {withIcon ? (
          <ListOrdered
            className={styles.icon}
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
          />
        ) : null}
        <span>Разберём на примере</span>
      </figcaption>
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
      {props.children ? (
        <div className={styles.content}>{props.children}</div>
      ) : null}
    </figure>
  );
};
