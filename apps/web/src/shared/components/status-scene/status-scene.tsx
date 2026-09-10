import { useRef } from "react";
import { useElementActivity } from "~/shared/lib/element-activity";
import { Typography } from "~/shared/components/typography";
import { StatusScenePattern } from "./status-scene-pattern";
import { StatusSceneArtwork } from "./status-scene-artwork";
import type { StatusSceneTypes } from "./status-scene.types";
import styles from "./status-scene.module.css";

export const StatusScene: React.FC<StatusSceneTypes.Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const active = useElementActivity(ref);
  return (
    <div
      ref={ref}
      className={styles.root}
      data-status-scene
      data-kind={props.kind}
      data-scene={props.kind === "code" ? props.code : props.kind}
      data-motion-active={active}
    >
      <StatusScenePattern />
      {props.kind === "code" ? (
        <span
          className={styles.numeral}
          aria-hidden="true"
          data-code={props.code}
        >
          {props.code}
        </span>
      ) : null}
      {props.kind === "error" ? <StatusSceneArtwork /> : null}
      <div className={styles.copy}>
        <Typography.Title
          order={props.headingOrder ?? 1}
          className={styles.title}
        >
          {props.title}
        </Typography.Title>
        {props.kind === "code" ? (
          <span className={styles.visuallyHidden}>Ошибка {props.code}</span>
        ) : null}
        {props.description ? (
          <Typography.Text className={styles.description} tone="muted">
            {props.description}
          </Typography.Text>
        ) : null}
        {props.children ? (
          <div className={styles.actions}>{props.children}</div>
        ) : null}
      </div>
    </div>
  );
};
