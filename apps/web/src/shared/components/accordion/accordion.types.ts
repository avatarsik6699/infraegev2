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
    /** Heading level of the item headers when enhanced (Base UI default is h3). */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
  };
}
