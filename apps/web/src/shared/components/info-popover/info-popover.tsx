import { Popover } from "@base-ui/react/popover";
import { CircleQuestionMark } from "lucide-react";
import { useId } from "react";
import patterns from "~/shared/styles/patterns.module.css";
import styles from "./info-popover.module.css";
import type { InfoPopoverTypes } from "./info-popover.types";
export const InfoPopover: React.FC<InfoPopoverTypes.Props> = (props) => {
  const nativeId = useId();
  // A text trigger is named by its own text; the icon needs the label.
  const triggerClass = props.trigger ? styles.textTrigger : styles.trigger;
  const triggerLabel = props.trigger ? undefined : props.label;
  const triggerContent = props.trigger ?? (
    <CircleQuestionMark size={18} aria-hidden="true" />
  );
  return (
    <>
      <noscript>
        {props.inline ? (
          <>
            <button
              type="button"
              className={triggerClass}
              popoverTarget={nativeId}
              aria-label={triggerLabel}
            >
              {triggerContent}
            </button>
            <span
              id={nativeId}
              popover="auto"
              role="dialog"
              aria-label={props.label}
              className={`${styles.popup} ${styles.native}`}
            >
              {props.children}
              {props.closeLabel ? (
                <button
                  type="button"
                  className={styles.close}
                  popoverTarget={nativeId}
                  popoverTargetAction="hide"
                >
                  {props.closeLabel}
                </button>
              ) : null}
            </span>
          </>
        ) : (
          <details className={styles.fallback}>
            <summary aria-label={props.label}>
              <CircleQuestionMark size={18} aria-hidden="true" />
            </summary>
            <div className={styles.popup}>{props.children}</div>
          </details>
        )}
      </noscript>
      <span className={patterns.scriptedOnly}>
        <Popover.Root>
          <Popover.Trigger
            openOnHover
            className={triggerClass}
            aria-label={triggerLabel}
          >
            {triggerContent}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={6} className={styles.positioner}>
              <Popover.Popup className={styles.popup} aria-label={props.label}>
                {props.children}
                {props.closeLabel ? (
                  <Popover.Close className={styles.close}>
                    {props.closeLabel}
                  </Popover.Close>
                ) : null}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </span>
    </>
  );
};
