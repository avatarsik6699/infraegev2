import { useState } from "react";
import { Field } from "~/shared/components/field";
import { Typography } from "~/shared/components/typography";
import { russianCount } from "~/shared/lib/russian-count";
import { parseAddress, shiftFormula } from "~/shared/lib/sheet-eval";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import styles from "./fill-sandbox.module.css";

export type FillSandboxProps = {
  /** The formula standing in `origin`, as the lesson writes it. */
  defaultFormula: string;
  origin: string;
  defaultTarget: string;
};

type Copy =
  | {
      kind: "copy";
      parts: ReturnType<typeof shiftFormula>["parts"];
      note: string;
    }
  | { kind: "message"; message: string };

const CELL = /^[A-Z]{1,3}[1-9]\d*$/;

/** «Копия сдвинута на 2 строки вниз и на 2 столбца вправо.» */
export function describeShift(drow: number, dcol: number): string {
  const parts: string[] = [];
  if (drow)
    parts.push(
      `на ${russianCount.of(Math.abs(drow), ["строку", "строки", "строк"])} ${drow > 0 ? "вниз" : "вверх"}`,
    );
  if (dcol)
    parts.push(
      `на ${russianCount.of(Math.abs(dcol), ["столбец", "столбца", "столбцов"])} ${dcol > 0 ? "вправо" : "влево"}`,
    );
  return parts.length
    ? `Копия сдвинута ${parts.join(" и ")}.`
    : "Копия на том же месте.";
}

function copyOf(formula: string, origin: string, target: string): Copy {
  const to = target.trim().toUpperCase();
  if (!CELL.test(to))
    return {
      kind: "message",
      message: "Адрес ячейки: буквы столбца и номер строки, например D4.",
    };
  const text = formula.trim();
  if (!text.startsWith("="))
    return { kind: "message", message: "Формула начинается со знака =." };
  const [r1, c1] = parseAddress(origin);
  const [r2, c2] = parseAddress(to);
  let result: ReturnType<typeof shiftFormula>;
  try {
    result = shiftFormula(text, r2 - r1, c2 - c1);
  } catch {
    return {
      kind: "message",
      message: "В формуле есть знак, которого Excel не поймёт.",
    };
  }
  return {
    kind: "copy",
    parts: result.parts,
    note:
      describeShift(r2 - r1, c2 - c1) +
      (result.offSheet
        ? " Адрес ушёл за край листа — Excel пишет #ССЫЛКА!."
        : ""),
  };
}

/**
 * Copy sandbox of the Excel course (Change 177, the stand's `fill_try`): a
 * formula standing in `origin` is copied to the cell the learner names; the
 * new formula marks the parts of every address that moved. Without scripting
 * the lesson's own example stays worked out.
 */
export const FillSandbox: React.FC<FillSandboxProps> = (props) => {
  const enhanced = useIsEnhanced();
  const [formula, setFormula] = useState(props.defaultFormula);
  const [target, setTarget] = useState(props.defaultTarget);
  const copy = copyOf(formula, props.origin, target);
  const shown = CELL.test(target.trim().toUpperCase())
    ? target.trim().toUpperCase()
    : props.defaultTarget;

  return (
    <div
      className={styles.root}
      data-fill-sandbox
      data-enhanced={enhanced || undefined}
      data-learning-block
    >
      {enhanced ? (
        <div className={styles.inputs}>
          <Field
            label={`Формула в ${props.origin}`}
            value={formula}
            spellCheck={false}
            autoComplete="off"
            className={styles.formulaField}
            onChange={(event) => setFormula(event.currentTarget.value)}
          />
          <Field
            label="Копируем в"
            value={target}
            maxLength={6}
            spellCheck={false}
            autoComplete="off"
            className={styles.targetField}
            onChange={(event) => setTarget(event.currentTarget.value)}
          />
        </div>
      ) : (
        <Typography.Text className={styles.given}>
          {`Формула в ${props.origin}: `}
          <code className={styles.code}>{props.defaultFormula}</code>
        </Typography.Text>
      )}
      {copy.kind === "copy" ? (
        <Typography.Text className={styles.result}>
          <span className={styles.resultLabel}>{`В ${shown} окажется`}</span>{" "}
          <code className={styles.code}>
            {copy.parts.map((part, k) =>
              part.moved ? (
                <mark key={k} className={styles.moved}>
                  {part.text}
                </mark>
              ) : (
                part.text
              ),
            )}
          </code>
        </Typography.Text>
      ) : null}
      <Typography.Text className={styles.message} aria-live="polite">
        {copy.kind === "copy" ? copy.note : copy.message}
      </Typography.Text>
      {enhanced ? (
        <Typography.Text className={styles.note}>
          Изменившиеся части адресов выделены. Поставь или убери $ и посмотри,
          какие части перестают сдвигаться.
        </Typography.Text>
      ) : null}
    </div>
  );
};
