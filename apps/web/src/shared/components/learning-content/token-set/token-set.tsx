import styles from "./token-set.module.css";

type Props = {
  /** The whole set, in order. */
  values: readonly (number | string)[];
  /** Members that satisfy the requirement; shown emphasised. */
  selected: readonly (number | string)[];
};

/** A small set where the chosen members stand out, e.g. divisors of 12. */
export const TokenSet: React.FC<Props> = (props) => {
  const chosen = new Set(props.selected.map(String));
  return (
    <span className={styles.root} data-token-set>
      <span className={styles.row} aria-hidden="true">
        {props.values.map((value) => (
          <span
            key={String(value)}
            className={styles.token}
            data-on={chosen.has(String(value)) || undefined}
          >
            {value}
          </span>
        ))}
      </span>
      <span className={styles.hidden}>{props.selected.join(", ")}</span>
    </span>
  );
};
