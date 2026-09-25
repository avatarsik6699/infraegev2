export namespace ConfirmationDialogTypes {
  export type Props = {
    title: string;
    description: React.ReactNode;
    triggerLabel: string;
    triggerAriaLabel?: string;
    triggerAppearance?: "default" | "subtle" | "danger";
    confirmLabel: string;
    onConfirm: () => void | Promise<void>;
    errorMessage?: (reason: unknown) => string;
    onError?: (reason: unknown) => void;
  };
}
