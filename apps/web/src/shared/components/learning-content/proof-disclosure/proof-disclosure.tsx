import { ChevronRight } from "lucide-react";
import styles from "./proof-disclosure.module.css";

type Props = {
  /** «Доказательство …»: what the closed block proves. */
  summary: string;
  children: React.ReactNode;
};

/**
 * A formal proof under the example that already showed the idea (P18):
 * closed by default, a native `details`, so the full text is in the SSR page
 * and opens without scripting.
 */
export const ProofDisclosure: React.FC<Props> = (props) => (
  <details className={styles.root} data-proof-disclosure data-learning-block>
    <summary className={styles.summary}>
      <ChevronRight className={styles.chevron} aria-hidden size={16} />
      {props.summary}
    </summary>
    <div className={styles.body}>{props.children}</div>
  </details>
);
