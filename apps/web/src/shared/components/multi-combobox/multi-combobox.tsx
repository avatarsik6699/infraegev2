import { useRef, useState } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "~/shared/components/button";
import styles from "./multi-combobox.module.css";

import type { MultiComboboxTypes } from "./multi-combobox.types";
export const MultiCombobox: React.FC<MultiComboboxTypes.Props> = (props) => {
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(props.value);
  const [query, setQuery] = useState("");
  const items = props.options.filter((item) =>
    item.label.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")),
  );
  const label =
    props.value.length === 1
      ? props.options.find((item) => item.value === props.value[0])?.label
      : props.selectedLabel;
  return (
    <Combobox.Root<string, true>
      multiple
      items={items.map((item) => item.value)}
      value={draft}
      onValueChange={setDraft}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setDraft(props.value);
        setQuery("");
      }}
      inputValue={query}
      onInputValueChange={setQuery}
      filter={null}
    >
      <div className={styles.field}>
        <Combobox.Label className={styles.fieldLabel}>
          {props.label}
        </Combobox.Label>
        <Combobox.Trigger className={styles.trigger} aria-label={props.label}>
          <span>{props.value.length ? label : props.emptySelectionLabel}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={6} className={styles.positioner}>
          <Combobox.Popup
            className={styles.popup}
            initialFocus={(interaction) =>
              interaction === "keyboard" ? input.current : false
            }
          >
            <div className={styles.search}>
              <Search size={16} aria-hidden="true" />
              <Combobox.Input
                ref={input}
                aria-label={props.searchPlaceholder}
                placeholder={props.searchPlaceholder}
              />
            </div>
            <Combobox.Empty className={styles.empty}>
              {props.emptyLabel}
            </Combobox.Empty>
            <Combobox.List className={styles.list}>
              {[...new Set(items.map((item) => item.group))].map((group) => (
                <Combobox.Group
                  key={group}
                  items={items
                    .filter((item) => item.group === group)
                    .map((item) => item.value)}
                >
                  <Combobox.GroupLabel className={styles.group}>
                    {group}
                  </Combobox.GroupLabel>
                  {items
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <Combobox.Item
                        className={styles.item}
                        value={item.value}
                        key={item.value}
                      >
                        <span>
                          <span className={styles.label}>{item.label}</span>
                          <span className={styles.description}>
                            {item.description}
                          </span>
                        </span>
                        <Combobox.ItemIndicator>
                          <Check size={16} aria-hidden="true" />
                        </Combobox.ItemIndicator>
                      </Combobox.Item>
                    ))}
                </Combobox.Group>
              ))}
            </Combobox.List>
            <div className={styles.footer}>
              <Button hierarchy="quiet" onClick={() => setDraft([])}>
                Сбросить
              </Button>
              <Button
                onClick={() => {
                  props.onApply(draft);
                  setOpen(false);
                }}
              >
                Применить
              </Button>
            </div>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
