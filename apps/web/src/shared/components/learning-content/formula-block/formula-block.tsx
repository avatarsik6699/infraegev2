import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { copyText } from "~/shared/lib/clipboard";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { formulaParts } from "./formula-parts";
import styles from "./formula-block.module.css";

export type FormulaLine = {
  /** The cell the formula is written in («B2»), when the text names one. */
  cell?: string;
  formula: string;
};

export type FormulaBlockProps = {
  lines: readonly FormulaLine[];
  /** «Формула» or «Шаблон формулы»: the block's accessible name. */
  label: string;
};

/**
 * A formula of the Excel course (Change 177 F9): drawn as the sheet's formula
 * bar, not as a code block — an optional cell address, «fx», the formula with
 * function names in medium weight and the slots of a template in italics, and
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
    >
      {props.lines.map((line, index) => (
        <div key={`${String(index)}-${line.formula}`} className={styles.row}>
          {line.cell ? <span className={styles.cell}>{line.cell}</span> : null}
          <span className={styles.fx} aria-hidden="true">
            fx
          </span>
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
                part.text
              ),
            )}
          </code>
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
