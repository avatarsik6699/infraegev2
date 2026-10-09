export namespace VariantPickerTypes {
  export type Variant = {
    label: string;
    value: React.ReactNode;
    note?: React.ReactNode;
  };

  export type Props = {
    /** Accessible name of the group: what is being chosen. */
    label: string;
    variants: readonly [Variant, ...Variant[]];
    /** Variant shown first; defaults to the first one. */
    defaultIndex?: number;
  };
}
