export namespace ConfirmationDialogTypes {
  export type Props = {
    title: string;
    description: React.ReactNode;
    triggerLabel: string;
    triggerAriaLabel?: string;
    confirmLabel: string;
    onConfirm: () => void;
  };
}
