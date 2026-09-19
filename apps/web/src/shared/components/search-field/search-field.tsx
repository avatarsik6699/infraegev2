import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Field } from "~/shared/components/field";
import { Button } from "~/shared/components/button";
import styles from "./search-field.module.css";
import type { SearchFieldTypes } from "./search-field.types";

export const SearchField: React.FC<SearchFieldTypes.Props> = (props) => {
  const [value, setValue] = useState(props.defaultValue ?? "");
  const input = useRef<HTMLInputElement>(null);
  return (
    <Field
      ref={input}
      label={props.label}
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
          {value.length > 0 && (
            <Button
              className={styles.action}
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
          )}
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
