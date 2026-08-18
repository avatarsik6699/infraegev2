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
    multiple?: boolean;
    className?: string;
  };
}
