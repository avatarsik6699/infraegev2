import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "~/shared/components/button";
import type { ConfirmationDialogTypes } from "./confirmation-dialog.types";
import styles from "./confirmation-dialog.module.css";

export const ConfirmationDialog: React.FC<ConfirmationDialogTypes.Props> = (
  props,
) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger
      className={styles.trigger}
      aria-label={props.triggerAriaLabel}
    >
      {props.triggerLabel}
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className={styles.backdrop} />
      <AlertDialog.Viewport className={styles.viewport}>
        <AlertDialog.Popup className={styles.popup}>
          <div className={styles.copy}>
            <AlertDialog.Title className={styles.title}>
              {props.title}
            </AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              {props.description}
            </AlertDialog.Description>
          </div>
          <div className={styles.actions}>
            <AlertDialog.Close
              render={<Button hierarchy="secondary" type="button" />}
            >
              Отмена
            </AlertDialog.Close>
            <AlertDialog.Close
              render={<Button hierarchy="primary" type="button" />}
              onClick={props.onConfirm}
            >
              {props.confirmLabel}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Viewport>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
