import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Field } from "~/shared/components/field";
import { Button } from "~/shared/components/button";
import styles from "./search-field.module.css";
import type { SearchFieldTypes } from "./search-field.types";

export const SearchField: React.FC<SearchFieldTypes.Props> = (props) => {
  const [localValue, setLocalValue] = useState(props.defaultValue ?? "");
  const value = props.value ?? localValue;
  const setValue = (next: string) => {
    if (props.value === undefined) setLocalValue(next);
    props.onValueChange?.(next);
  };
  const input = useRef<HTMLInputElement>(null);
  return (
    <Field
      ref={input}
      label={props.label}
      labelVisibility={props.labelVisibility}
      name={props.name}
      type="text"
      role="searchbox"
      placeholder={props.placeholder}
      maxLength={props.maxLength}
      autoComplete="off"
      spellCheck={false}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      endAdornment={
        <>
          {
            <Button
              className={styles.action}
              data-empty={value.length === 0}
              aria-hidden={value.length === 0}
              tabIndex={value.length === 0 ? -1 : undefined}
              type="button"
              hierarchy="quiet"
              iconOnly
              aria-label={props.clearLabel}
              iconStart={<X size={16} aria-hidden="true" />}
              onClick={() => {
                setValue("");
                input.current?.focus();
              }}
            />
          }
          <Button
            className={styles.action}
            type="submit"
            hierarchy="quiet"
            iconOnly
            aria-label={props.submitLabel}
            iconStart={<Search size={18} aria-hidden="true" />}
          />
        </>
      }
    />
  );
};
