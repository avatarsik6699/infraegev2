import { ChevronDown, ChevronRight, Microscope } from "lucide-react";
import styles from "./proof-disclosure.module.css";

type Props = {
  /** «Доказательство …»: what the closed block proves; «Тонкости: …» for a nuance. */
  summary: string;
  /**
   * `nuance` — fine points of a step kept out of its main line (course
   * lessons, «Тонкости: …»): its own mark and the topic after the label.
   */
  kind?: "proof" | "nuance";
  children: React.ReactNode;
};

/**
 * A formal proof under the example that already showed the idea (P18), or
 * the fine points of a step: closed by default, a native `details`, so the
 * full text is in the SSR page and opens without scripting.
 */
export const ProofDisclosure: React.FC<Props> = (props) => {
  if (props.kind === "nuance") {
    const [label, ...rest] = props.summary.split(": ");
    const topic = rest.join(": ");
    return (
      <details
        className={styles.root}
        data-proof-disclosure
        data-kind="nuance"
        data-learning-block
      >
        <summary className={styles.summary}>
          <span className={styles.mark} aria-hidden="true">
            <Microscope size={16} strokeWidth={1.75} />
          </span>
          <span className={styles.title}>
            <span className={styles.label}>{label}</span>
            {topic ? <span className={styles.topic}>{topic}</span> : null}
          </span>
          <ChevronDown className={styles.toggle} aria-hidden size={16} />
        </summary>
        <div className={styles.body}>{props.children}</div>
      </details>
    );
  }
  return (
    <details className={styles.root} data-proof-disclosure data-learning-block>
      <summary className={styles.summary}>
        <ChevronRight className={styles.chevron} aria-hidden size={16} />
        {props.summary}
      </summary>
      <div className={styles.body}>{props.children}</div>
    </details>
  );
};
