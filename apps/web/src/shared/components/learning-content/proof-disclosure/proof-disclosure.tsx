import { ChevronDown, ChevronRight, Search } from "lucide-react";
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

/** Purposes of a closed block, by the first words of its title (F14). */
const PURPOSES: readonly (readonly [RegExp, string])[] = [
  [/^(Почему|Доказательство)/u, "Обоснование"],
  [/^(То же правило|Все длины|Общая формула)/u, "Общий случай"],
  [
    /^(Другой способ|Тот же ответ|Строковый вариант|Ручная проверка|Проверка)/u,
    "Другой способ",
  ],
  [/^(Формул|Запись )/u, "Формула"],
  [/^(Разбор|Программа)/u, "Подробный разбор"],
  [/^Таблица/u, "Справка"],
];

/** What a closed block adds to the step: «Обоснование», «Другой способ»… */
export function disclosurePurpose(summary: string): string {
  return (
    PURPOSES.find(([pattern]) => pattern.test(summary))?.[1] ?? "Дополнительно"
  );
}

/** The label over the title; a title that already names its purpose keeps only «Необязательно». */
export function disclosureLabel(summary: string): string {
  const purpose = disclosurePurpose(summary);
  return summary.toLowerCase().startsWith(purpose.toLowerCase())
    ? "Необязательно"
    : `${purpose} · необязательно`;
}

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
            <Search size={14} strokeWidth={1.75} />
          </span>
          <span className={styles.title}>
            <span className={styles.label}>{topic ? `${label}:` : label}</span>
            {topic ? <span className={styles.topic}>{topic}</span> : null}
          </span>
          <ChevronDown className={styles.toggle} aria-hidden size={14} />
        </summary>
        <div className={styles.body}>{props.children}</div>
      </details>
    );
  }
  return (
    <details className={styles.root} data-proof-disclosure data-learning-block>
      <summary className={styles.summary}>
        <ChevronRight className={styles.chevron} aria-hidden size={16} />
        {/* F14: the purpose says why the block stands apart — extra depth
            the step does not need */}
        <span className={styles.stack} data-proof-title>
          <span className={styles.purpose}>
            {disclosureLabel(props.summary)}
          </span>
          <span className={styles.heading}>{props.summary}</span>
        </span>
      </summary>
      <div className={styles.body}>{props.children}</div>
    </details>
  );
};
