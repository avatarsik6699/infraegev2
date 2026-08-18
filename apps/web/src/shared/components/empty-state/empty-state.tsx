import { useId } from "react";
import { Typography } from "~/shared/components/typography";
import type { EmptyStateTypes } from "./empty-state.types";
import styles from "./empty-state.module.css";

export const EmptyState: React.FC<EmptyStateTypes.Props> = (props) => {
  const generatedHeadingId = useId();
  const headingId = props.headingId ?? generatedHeadingId;

  return (
    <section className={styles.root} aria-labelledby={headingId}>
      <Typography.Title order={props.headingOrder ?? 2} id={headingId}>
        {props.title}
      </Typography.Title>
      <Typography.Text tone="muted">{props.description}</Typography.Text>
      {props.action ? (
        <div className={styles.action}>{props.action}</div>
      ) : null}
    </section>
  );
};
