import { MascotScene } from "~/shared/components/mascot-scene";
import { Typography } from "~/shared/components/typography";
import type { StatusSceneTypes } from "./status-scene.types";
import styles from "./status-scene.module.css";

/** Open status page: a large mascot scene (404 for a missing page or task, the error scene otherwise), the message and actions. */
export const StatusScene: React.FC<StatusSceneTypes.Props> = (props) => (
  <div className={styles.root} data-status-scene data-kind={props.kind}>
    <MascotScene
      scene={props.code === "404" ? "not-found" : "error"}
      className={styles.illustration}
    />
    <Typography.Title order={props.headingOrder ?? 1} className={styles.title}>
      {props.title}
    </Typography.Title>
    {props.description ? (
      <Typography.Text tone="muted" className={styles.description}>
        {props.description}
      </Typography.Text>
    ) : null}
    {props.children ? (
      <div className={styles.actions}>{props.children}</div>
    ) : null}
  </div>
);
