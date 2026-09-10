export namespace ResponsiveDisclosureTypes {
  export type Props = {
    label: string;
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    children: React.ReactNode;
  };
}
