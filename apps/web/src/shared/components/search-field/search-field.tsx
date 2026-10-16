import { useRef, useState } from "react";
import { Autocomplete } from "@base-ui/react/autocomplete";
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
  const adornment = (
    <>
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
      <Button
        className={styles.action}
        type="submit"
        hierarchy="quiet"
        iconOnly
        aria-label={props.submitLabel}
        iconStart={<Search size={18} aria-hidden="true" />}
      />
    </>
  );
  const field = {
    label: props.label,
    labelVisibility: props.labelVisibility,
    name: props.name,
    type: "text",
    placeholder: props.placeholder,
    maxLength: props.maxLength,
    autoComplete: "off",
    spellCheck: false,
    endAdornment: adornment,
  } as const;
  const suggestions = props.suggestions;
  if (!suggestions)
    return (
      <Field
        {...field}
        ref={input}
        role="searchbox"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  return (
    <SuggestingField
      field={field}
      input={input}
      value={value}
      setValue={setValue}
      suggestions={suggestions}
    />
  );
};

/**
 * Change 191 (F2): the WAI-ARIA combobox pattern over the same Field. Typing
 * lists a few matching items; Enter without a highlighted item submits the
 * form (the whole result list), an item opens that match.
 */
const SuggestingField: React.FC<{
  field: Omit<React.ComponentProps<typeof Field>, "value" | "onChange">;
  input: React.RefObject<HTMLInputElement | null>;
  value: string;
  setValue: (value: string) => void;
  suggestions: SearchFieldTypes.Suggestions;
}> = (props) => {
  const s = props.suggestions;
  const status = s.loading && !s.items.length ? s.loadingLabel : null;
  return (
    <Autocomplete.Root
      items={s.items}
      value={props.value}
      onValueChange={(next, details) => {
        // Choosing an item navigates; it never rewrites the typed text.
        if (details.reason !== "item-press") props.setValue(next);
      }}
      itemToStringValue={(item: SearchFieldTypes.Suggestion) => item.title}
      filter={null}
      mode="none"
      openOnInputClick
    >
      <Autocomplete.Input
        render={({ ref, ...inputProps }) => (
          <Field
            {...props.field}
            {...inputProps}
            ref={(node: HTMLInputElement | null) => {
              // Base UI anchors the list to the input; the clear action focuses it.
              props.input.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
          />
        )}
      />
      <Autocomplete.Portal hidden={!s.active}>
        <Autocomplete.Positioner
          className={styles.positioner}
          sideOffset={6}
          align="start"
        >
          <Autocomplete.Popup
            className={styles.popup}
            aria-busy={s.loading || undefined}
          >
            <Autocomplete.Status className={styles.status}>
              {status}
            </Autocomplete.Status>
            <Autocomplete.Empty className={styles.status}>
              {s.loading ? null : s.emptyLabel}
            </Autocomplete.Empty>
            <Autocomplete.List
              className={styles.list}
              aria-label={s.listLabel}
              data-stale={s.loading || undefined}
            >
              {(item: SearchFieldTypes.Suggestion) => (
                <Autocomplete.Item
                  key={item.id}
                  value={item}
                  className={styles.item}
                  onClick={() => s.onSelect(item.id)}
                >
                  <span className={styles.itemTitle}>
                    {item.meta ? (
                      <span className={styles.itemMeta}>{item.meta}</span>
                    ) : null}
                    <Marked text={item.title} ranges={item.titleHighlights} />
                  </span>
                  {item.snippet ? (
                    <span className={styles.itemSnippet}>
                      <Marked
                        text={item.snippet}
                        ranges={item.snippetHighlights}
                      />
                    </span>
                  ) : null}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
            {s.total ? (
              <button
                type="button"
                className={styles.showAll}
                onClick={() => props.input.current?.form?.requestSubmit()}
              >
                {s.showAllLabel(s.total)}
                <span aria-hidden="true">⏎</span>
              </button>
            ) : null}
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
};

const Marked: React.FC<{
  text: string;
  ranges: readonly SearchFieldTypes.Range[];
}> = (props) => {
  const parts: React.ReactNode[] = [];
  let at = 0;
  for (const [start, end] of props.ranges) {
    if (start < at || end > props.text.length) continue;
    parts.push(props.text.slice(at, start));
    parts.push(<mark key={start}>{props.text.slice(start, end)}</mark>);
    at = end;
  }
  parts.push(props.text.slice(at));
  return <>{parts}</>;
};
