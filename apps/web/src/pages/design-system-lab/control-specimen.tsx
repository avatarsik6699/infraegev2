import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

type ControlSpecimenProps = React.PropsWithChildren<{
  description: string;
  kind: "controls" | "states" | "feedback";
  title: string;
}>;

export const ControlSpecimen: React.FC<ControlSpecimenProps> = ({
  children,
  description,
  kind,
  title,
}) => (
  <div className={styles.controlSpecimen} data-control-specimen={kind}>
    <div className={styles.controlSpecimenMeta}>
      <Typography.Title order={4} className={styles.controlSpecimenHeading}>
        {title}
      </Typography.Title>
      <Typography.Text>{description}</Typography.Text>
    </div>
    <div className={styles.controlSpecimenContent}>{children}</div>
  </div>
);
