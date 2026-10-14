import { Fragment } from "react";
import styles from "./key-combo.module.css";

export type KeyComboProps = {
  /** Keys pressed together, in order: ["Ctrl", "Shift", "стрелка"]. */
  keys: readonly string[];
};

/**
 * A keyboard shortcut in running text (Change 177): every key a keycap,
 * joined by «+»; it wraps between keys only when the line is too narrow.
 */
export const KeyCombo: React.FC<KeyComboProps> = (props) => (
  <span className={styles.root}>
    {props.keys.map((key, index) => (
      <Fragment key={`${key}-${String(index)}`}>
        {index ? <wbr /> : null}
        <span className={styles.part}>
          {index ? (
            <span className={styles.plus} aria-hidden="true">
              +
            </span>
          ) : null}
          <kbd className={styles.key}>{key}</kbd>
        </span>
      </Fragment>
    ))}
  </span>
);
