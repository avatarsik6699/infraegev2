import { Popover } from "@base-ui/react/popover";
import { CircleQuestionMark } from "lucide-react";
import patterns from "~/shared/styles/patterns.module.css";
import styles from "./info-popover.module.css";
import type { InfoPopoverTypes } from "./info-popover.types";
export const InfoPopover: React.FC<InfoPopoverTypes.Props> = (props) => {
  return (
    <>
      <noscript>
        <details className={styles.fallback}>
          <summary aria-label={props.label}>
            <CircleQuestionMark size={18} aria-hidden="true" />
          </summary>
          <div className={styles.popup}>{props.children}</div>
        </details>
      </noscript>
      <span className={patterns.scriptedOnly}>
        <Popover.Root>
          <Popover.Trigger
            openOnHover
            className={styles.trigger}
            aria-label={props.label}
          >
            <CircleQuestionMark size={18} aria-hidden="true" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={6} className={styles.positioner}>
              <Popover.Popup className={styles.popup} aria-label={props.label}>
                {props.children}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </span>
    </>
  );
};
