import { Dialog } from "@base-ui/react/dialog";
import { Button } from "~/shared/components/button";
import styles from "./modal-dialog.module.css";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  /** While true the dialog cannot be dismissed (a request is in flight). */
  busy?: boolean;
  "data-dialog"?: string;
};

/**
 * Change 227: a controlled dialog with the shared chrome — title, description, the caller's
 * content and «Отмена» — for flows whose content is not a single confirm button.
 */
export const ModalDialog: React.FC<Props> = (props) => (
  <Dialog.Root
    open={props.open}
    onOpenChange={(open) => {
      if (props.busy && !open) return;
      props.onOpenChange(open);
    }}
  >
    <Dialog.Portal>
      <Dialog.Backdrop className={styles.backdrop} />
      <Dialog.Viewport className={styles.viewport}>
        <Dialog.Popup
          className={styles.popup}
          data-dialog={props["data-dialog"]}
        >
          <div className={styles.copy}>
            <Dialog.Title className={styles.title}>{props.title}</Dialog.Title>
            <Dialog.Description className={styles.description}>
              {props.description}
            </Dialog.Description>
          </div>
          {props.children}
          <div className={styles.actions}>
            <Dialog.Close
              render={
                <Button
                  hierarchy="quiet"
                  surface="bare"
                  type="button"
                  disabled={props.busy}
                />
              }
            >
              Отмена
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
);
