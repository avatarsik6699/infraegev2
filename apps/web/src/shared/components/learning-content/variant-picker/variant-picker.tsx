import { useState } from "react";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { ChoiceChips } from "../choice-chips";
import type { VariantPickerTypes } from "./variant-picker.types";
import styles from "./variant-picker.module.css";

/**
 * One of several parallel variants at a time instead of a long enumeration
 * (Change 171): chips choose the variant, its value is announced politely.
 * Without scripting every variant is listed, so nothing is hidden.
 */
export const VariantPicker: React.FC<VariantPickerTypes.Props> = (props) => {
  const enhanced = useIsEnhanced();
  const [index, setIndex] = useState(props.defaultIndex ?? 0);

  if (!enhanced) {
    return (
      <dl className={styles.list} aria-label={props.label} data-variant-picker>
        {props.variants.map((variant) => (
          <div key={variant.label} className={styles.row}>
            <dt className={styles.term}>{variant.label}</dt>
            <dd className={styles.value}>
              <VariantValue variant={variant} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  const current = props.variants[index] ?? props.variants[0];
  return (
    <div className={styles.root} data-variant-picker data-enhanced>
      <ChoiceChips
        label={props.label}
        options={props.variants.map((variant) => variant.label)}
        selected={index}
        onSelect={setIndex}
      />
      <div className={styles.result} aria-live="polite" data-variant-result>
        <VariantValue variant={current} />
      </div>
    </div>
  );
};

const VariantValue: React.FC<{ variant: VariantPickerTypes.Variant }> = (
  props,
) => (
  <>
    <span className={styles.main}>{props.variant.value}</span>
    {props.variant.note ? (
      <span className={styles.note}>{props.variant.note}</span>
    ) : null}
  </>
);
