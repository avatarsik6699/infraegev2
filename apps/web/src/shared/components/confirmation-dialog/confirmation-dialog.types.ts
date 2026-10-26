export namespace ConfirmationDialogTypes {
  export type Props = {
    title: string;
    description: React.ReactNode;
    triggerLabel: string;
    triggerAriaLabel?: string;
    triggerAppearance?: "default" | "subtle" | "danger";
    triggerClassName?: string;
    confirmLabel: string;
    /** `filled`: soft «Отмена» and a filled danger confirm (lesson reset). */
    actions?: "outlined" | "filled";
    onConfirm: () => void | Promise<void>;
    errorMessage?: (reason: unknown) => string;
    onError?: (reason: unknown) => void;
    /** Change 227: controlled mode, e.g. to ask for a sign-in before it opens. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
}
