export namespace ConfirmationDialogTypes {
  export type Props = {
    title: string;
    description: React.ReactNode;
    triggerLabel: string;
    triggerAriaLabel?: string;
    triggerAppearance?: "default" | "subtle";
    confirmLabel: string;
    onConfirm: () => void;
  };
}
