import { Typography } from "~/shared/components/typography";
import type { StatusSceneTypes } from "./status-scene.types";
import styles from "./status-scene.module.css";
export const StatusScene: React.FC<StatusSceneTypes.Props> = (props) => (
  <div className={styles.root} data-status-scene data-kind={props.kind}>
    {props.kind === "code" ? (
      <Typography.Text tone="muted">Ошибка {props.code}</Typography.Text>
    ) : null}
    <Typography.Title order={props.headingOrder ?? 1}>
      {props.title}
    </Typography.Title>
    {props.description ? (
      <Typography.Text tone="muted">{props.description}</Typography.Text>
    ) : null}
    {props.children ? (
      <div className={styles.actions}>{props.children}</div>
    ) : null}
  </div>
);
