import { AlertDialog } from "@base-ui/react/alert-dialog";
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
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.backdrop} />
        <AlertDialog.Viewport className={styles.viewport}>
          <AlertDialog.Popup className={styles.popup}>
            <AlertDialog.Title className={styles.title}>
              {props.title}
            </AlertDialog.Title>
            <AlertDialog.Description className={styles.description}>
              {props.description}
            </AlertDialog.Description>
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
                <Button type="submit" hierarchy="destructive" loading={pending}>
                  {props.confirmLabel}
                </Button>
              </div>
            </form>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
