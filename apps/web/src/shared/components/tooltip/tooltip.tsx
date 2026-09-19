import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { TooltipTypes } from "./tooltip.types";
import styles from "./tooltip.module.css";

export const Tooltip: React.FC<TooltipTypes.Props> = (props) => (
  <BaseTooltip.Root>
    <BaseTooltip.Trigger render={props.children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={6} className={styles.positioner}>
        <BaseTooltip.Popup className={styles.popup} role="tooltip">
          {props.label}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
);
