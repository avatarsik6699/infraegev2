import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { TooltipTypes } from "./tooltip.types";
import styles from "./tooltip.module.css";

/**
 * A short hint on hover and keyboard focus (Change 185: the `/ege` goal
 * steps). The trigger keeps its own semantics; screen readers get the same
 * text from the control's own description, not from this popup.
 */
export const Tooltip: React.FC<TooltipTypes.Props> = (props) => (
  <BaseTooltip.Root>
    <BaseTooltip.Trigger delay={300} render={props.children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        side={props.side ?? "bottom"}
        sideOffset={6}
        className={styles.positioner}
      >
        <BaseTooltip.Popup className={styles.popup}>
          {props.content}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);
