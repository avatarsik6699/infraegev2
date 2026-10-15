export namespace InlineSelectTypes {
  export type Option = { value: string; label: string; disabled?: boolean };

  /** Submits its form on change (GET filters, practice catalog). */
  type FormProps = {
    form: string;
    name: string;
    defaultValue: string;
    value?: never;
    onValueChange?: never;
  };

  /** Controlled by the page (the `/ege` progress filter, Change 185). */
  type ControlledProps = {
    value: string;
    onValueChange: (value: string) => void;
    form?: never;
    name?: never;
    defaultValue?: never;
  };

  export type Props = {
    label: string;
    options: Option[];
  } & (FormProps | ControlledProps);
}
