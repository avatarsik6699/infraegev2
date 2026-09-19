import { useEffect, useId, useRef, useState } from "react";
import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import type { InlineSelectTypes } from "./inline-select.types";
import patterns from "~/shared/styles/patterns.module.css";
import styles from "./inline-select.module.css";

export const InlineSelect: React.FC<InlineSelectTypes.Props> = (props) => {
  const enhanced = useIsEnhanced();
  const labelId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.defaultValue);
  useEffect(
    function submitSelectionFx() {
      if (value !== props.defaultValue) input.current?.form?.requestSubmit();
    },
    [value, props.defaultValue],
  );
  return (
    <div className={styles.root}>
      <span id={labelId} className={styles.label}>
        {props.label}:
      </span>
      <div className={patterns.scriptedOnly}>
        <input
          disabled={!enhanced}
          ref={input}
          type="hidden"
          form={props.form}
          name={props.name}
          value={value}
        />
        <Select.Root
          items={props.options}
          value={value}
          onValueChange={(next) => {
            if (next !== null) setValue(next);
          }}
        >
          <Select.Trigger aria-labelledby={labelId} className={styles.trigger}>
            <Select.Value />
            <Select.Icon>
              <ChevronDown size={14} aria-hidden="true" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner
              align="end"
              sideOffset={4}
              alignItemWithTrigger={false}
              className={styles.positioner}
            >
              <Select.Popup className={styles.popup}>
                <Select.List>
                  {props.options.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className={styles.item}
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <Check size={14} aria-hidden="true" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
      <noscript>
        <select
          aria-labelledby={labelId}
          name={props.name}
          form={props.form}
          defaultValue={props.defaultValue}
          className={styles.trigger}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </noscript>
    </div>
  );
};
