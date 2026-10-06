import { Dialog } from "@base-ui/react/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import type { ConfirmationDialogTypes } from "./confirmation-dialog.types";
import styles from "./confirmation-dialog.module.css";

export const ConfirmationDialog: React.FC<ConfirmationDialogTypes.Props> = (
  props,
) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filled = props.actions === "filled";
  const confirm = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await props.onConfirm();
      setOpen(false);
    } catch (reason) {
      props.onError?.(reason);
      setError(
        props.errorMessage?.(reason) ??
          "Действие не выполнено. Попробуйте ещё раз.",
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <Dialog.Root
      /* F21: Escape and a click outside close it, unlike AlertDialog. */
      open={open}
      onOpenChange={(nextOpen) => {
        if (pending && !nextOpen) return;
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
      }}
    >
      <Dialog.Trigger
        render={
          <Button
            hierarchy={
              props.triggerAppearance === "danger" ? "destructive" : "quiet"
            }
            density={
              props.triggerAppearance === "subtle" ? "compact" : "default"
            }
            surface={props.triggerAppearance === "subtle" ? "bare" : "default"}
            iconStart={
              props.triggerAppearance === "danger" ? (
                <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
              ) : undefined
            }
            className={
              props.triggerAppearance === "subtle"
                ? styles.subtleTrigger
                : undefined
            }
          />
        }
        aria-label={props.triggerAriaLabel}
      >
        {props.triggerLabel}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Viewport className={styles.viewport}>
          <Dialog.Popup className={styles.popup} role="alertdialog">
            <div className={styles.copy}>
              <Dialog.Title className={styles.title}>
                {props.title}
              </Dialog.Title>
              <Dialog.Description className={styles.description}>
                {props.description}
              </Dialog.Description>
            </div>
            <div className={styles.actions}>
              <Dialog.Close
                render={
                  <Button
                    hierarchy={filled ? "soft" : "quiet"}
                    surface={filled ? "default" : "bare"}
                    type="button"
                    disabled={pending}
                  />
                }
              >
                Отмена
              </Dialog.Close>
              <Button
                hierarchy={filled ? "danger" : "destructive"}
                type="button"
                loading={pending}
                onClick={() => {
                  void confirm();
                }}
              >
                {props.confirmLabel}
              </Button>
            </div>
            {error ? (
              <Typography.Text role="alert" className={styles.error}>
                {error}
              </Typography.Text>
            ) : null}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
