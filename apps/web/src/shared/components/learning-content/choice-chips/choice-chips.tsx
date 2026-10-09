import styles from "./choice-chips.module.css";

type Props = {
  /** Accessible name of the group, e.g. «Примеры». */
  label: string;
  options: readonly string[];
  /** Index of the pressed chip; -1 when none matches the current state. */
  selected: number;
  onSelect: (index: number) => void;
};

/**
 * A row of toggle chips for lesson widgets (Change 171): one pressed chip,
 * `aria-pressed`, rounded hairline look. Shared by `VariantPicker` and the
 * presets of `RemainderExplorer`; use it for any «choose an example» row.
 */
export const ChoiceChips: React.FC<Props> = (props) => (
  <span className={styles.root} role="group" aria-label={props.label}>
    {props.options.map((option, index) => (
      <button
        key={option}
        type="button"
        className={styles.chip}
        aria-pressed={index === props.selected}
        onClick={() => props.onSelect(index)}
      >
        {option}
      </button>
    ))}
  </span>
);
