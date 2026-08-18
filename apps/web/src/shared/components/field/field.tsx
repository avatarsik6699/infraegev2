import { Field as BaseField } from "@base-ui/react/field";
import { Input } from "~/shared/components/input";
import type { FieldTypes } from "./field.types";
import styles from "./field.module.css";

export const Field: React.FC<FieldTypes.Props> = ({
  label,
  description,
  error,
  invalid = Boolean(error),
  disabled,
  className,
  ...inputProps
}) => (
  <BaseField.Root className={styles.root} invalid={invalid} disabled={disabled}>
    <BaseField.Label className={styles.label}>{label}</BaseField.Label>
    {description ? (
      <BaseField.Description className={styles.description}>
        {description}
      </BaseField.Description>
    ) : null}
    <Input
      {...inputProps}
      className={className}
      disabled={disabled}
      invalid={invalid}
    />
    {error ? (
      <BaseField.Error
        className={styles.error}
        match
        role="status"
        aria-live="polite"
      >
        {error}
      </BaseField.Error>
    ) : null}
  </BaseField.Root>
);
