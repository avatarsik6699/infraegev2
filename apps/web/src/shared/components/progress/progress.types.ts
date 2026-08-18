export namespace ProgressTypes {
  export type Props = {
    value: number | null;
    max?: number;
    label: string;
    valueText?: string;
    className?: string;
  };
}
