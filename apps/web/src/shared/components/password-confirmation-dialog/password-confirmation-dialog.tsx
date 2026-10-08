import { Dialog } from "@base-ui/react/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { PasswordField } from "~/shared/components/password-field";
import { Typography } from "~/shared/components/typography";
import styles from "./password-confirmation-dialog.module.css";

type Props = {
  email: string;
  triggerLabel: string;
  triggerAriaLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (password: string) => Promise<void>;
  errorMessage: (reason: unknown) => string;
  triggerAppearance?: "default" | "danger";
};

export const PasswordConfirmationDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const value = new FormData(event.currentTarget).get("password");
    if (typeof value !== "string" || !value) return;
    setPending(true);
    setError(null);
    try {
      await props.onConfirm(value);
      setOpen(false);
    } catch (reason) {
      setError(props.errorMessage(reason));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog.Root
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
            iconStart={
              props.triggerAppearance === "danger" ? (
                <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
              ) : undefined
            }
            type="button"
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
            <Dialog.Title className={styles.title}>{props.title}</Dialog.Title>
            <Dialog.Description className={styles.description}>
              {props.description}
            </Dialog.Description>
            <form
              className={styles.form}
              method="post"
              onSubmit={(event) => {
                void submit(event);
              }}
            >
              <input
                type="email"
                name="username"
                autoComplete="username"
                aria-hidden="true"
                tabIndex={-1}
                className={styles.username}
                defaultValue={props.email}
                readOnly
              />
              <PasswordField
                name="password"
                label="Текущий пароль"
                autoComplete="current-password"
                maxLength={128}
                required
                disabled={pending}
              />
              {error ? (
                <Typography.Text className={styles.error} role="alert">
                  {error}
                </Typography.Text>
              ) : null}
              <div className={styles.actions}>
                <Dialog.Close
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
                </Dialog.Close>
                <Button type="submit" hierarchy="destructive" loading={pending}>
                  {props.confirmLabel}
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
