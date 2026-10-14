import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { copyText } from "~/shared/lib/clipboard";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { breakable } from "./formula-text";
import { formulaParts } from "./formula-parts";
import styles from "./formula-block.module.css";

export type FormulaLine = {
  /** The cell the formula is written in («B2»), when the text names one. */
  cell?: string;
  formula: string;
  /** What the formula shows in that cell («Северный»), when the text gives it. */
  result?: string;
};

export type FormulaBlockProps = {
  lines: readonly FormulaLine[];
  /** «Формула» or «Шаблон формулы»: the block's accessible name. */
  label: string;
};

/**
 * A formula of the Excel course, set as a display line (Change 184, variant C
 * of the architect's review): no frame and no «fx», the formula in the data
 * face between two hairlines like the rows of a learning table, the cell
 * address in the label face before it and, when the text gives it, the value
 * the cell shows after «⇒». Function names are medium, template slots italic;
 * one quiet copy button. Readable without scripting.
 */
export const FormulaBlock: React.FC<FormulaBlockProps> = (props) => {
  const enhanced = useIsEnhanced();
  const [copied, setCopied] = useState(false);
  const text = props.lines.map((line) => line.formula).join("\n");
  const copy = async () => {
    setCopied(await copyText(text));
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <figure
      className={styles.root}
      role="group"
      aria-label={props.label}
      data-formula-block
      data-learning-block
      data-cells={props.lines.some((line) => line.cell) || undefined}
    >
      {props.lines.map((line, index) => (
        <div key={`${String(index)}-${line.formula}`} className={styles.row}>
          {line.cell ? <span className={styles.cell}>{line.cell}</span> : null}
          <code className={styles.formula}>
            {formulaParts(line.formula).map((part, k) =>
              part.kind ? (
                <span
                  key={k}
                  className={
                    part.kind === "function" ? styles.function : styles.slot
                  }
                >
                  {part.text}
                </span>
              ) : (
                <span key={k}>{breakable(part.text, k)}</span>
              ),
            )}
          </code>
          {line.result ? (
            <span className={styles.result} data-formula-result>
              <span className={styles.visuallyHidden}>результат: </span>
              {line.result}
            </span>
          ) : null}
        </div>
      ))}
      {enhanced ? (
        <Button
          className={styles.copy}
          surface="bare"
          density="compact"
          hierarchy="quiet"
          iconOnly
          iconStart={
            copied ? (
              <Check aria-hidden="true" size={14} />
            ) : (
              <Copy aria-hidden="true" size={14} />
            )
          }
          aria-label={copied ? "Формула скопирована" : "Скопировать формулу"}
          title="Скопировать формулу"
          onClick={() => void copy()}
        />
      ) : null}
    </figure>
  );
};
