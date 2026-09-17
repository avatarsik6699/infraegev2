import { useId } from "react";
import type { SelectFieldTypes } from "./select-field.types";
import styles from "./select-field.module.css";

// Native form semantics keep GET filters functional before hydration and without JavaScript.
export const SelectField: React.FC<SelectFieldTypes.Props> = ({
  label,
  options,
  ...selectProps
}) => {
  const labelId = useId();
  return (
    <label className={styles.field}>
      <span className={styles.label} id={labelId}>
        {label}
      </span>
      <select
        {...selectProps}
        className={styles.control}
        aria-labelledby={labelId}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
