import { AlertDialog } from "@base-ui/react/alert-dialog";
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
    <AlertDialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (pending && !nextOpen) return;
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
      }}
    >
      <AlertDialog.Trigger
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
                render={
                  <Button
                    hierarchy="quiet"
                    surface="bare"
                    type="button"
                    disabled={pending}
                  />
                }
              >
                Отмена
              </AlertDialog.Close>
              <Button
                hierarchy="destructive"
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
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
