import { Lightbulb, TriangleAlert } from "lucide-react";
import type { CalloutTypes } from "./callout.types";
import styles from "./callout.module.css";

const toneIcons: Record<CalloutTypes.Tone, typeof Lightbulb> = {
  idea: Lightbulb,
  warning: TriangleAlert,
};

export const Callout: React.FC<CalloutTypes.Props> = ({
  density = "default",
  ...props
}) => {
  const Icon = toneIcons[props.tone];
  return (
    <aside
      className={styles.root}
      data-tone={props.tone}
      data-density={density}
      aria-label={props.title}
    >
      <Icon
        className={styles.icon}
        aria-hidden="true"
        size={18}
        strokeWidth={1.75}
      />
      <div className={styles.content}>
        <span className={styles.title}>{props.title}</span>
        <div className={styles.body}>{props.children}</div>
      </div>
    </aside>
  );
};
