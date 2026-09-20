export namespace AccordionTypes {
  export type Item = {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
  };

  export type Props = {
    items: readonly Item[];
    defaultOpen?: readonly string[];
    value?: readonly string[];
    onValueChange?: (value: string[]) => void;
    nativeFallback?: boolean;
    multiple?: boolean;
    className?: string;
  };
}
