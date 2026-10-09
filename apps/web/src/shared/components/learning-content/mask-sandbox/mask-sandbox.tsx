import { useState } from "react";
import { Field } from "~/shared/components/field";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { checkMask, type MaskCheck, type MaskSegment } from "./mask-segment";
import styles from "./mask-sandbox.module.css";

type Props = {
  defaultMask: string;
  defaultNumber: string;
};

const messages: Record<Exclude<MaskCheck["status"], "accepted">, string> = {
  empty: "Введите маску и число.",
  "invalid-number": "Число должно состоять только из цифр.",
  "invalid-mask": "В маске допустимы только цифры, ? и *.",
  rejected: "Не подходит: число нельзя разбить по частям маски.",
};

/**
 * Mask sandbox (Change 171): the learner changes the mask or the number and
 * sees which digits each part of the mask takes. An enhancement only:
 * without scripting the same worked split of the default pair is shown.
 */
export const MaskSandbox: React.FC<Props> = (props) => {
  const enhanced = useIsEnhanced();
  const [mask, setMask] = useState(props.defaultMask);
  const [value, setValue] = useState(props.defaultNumber);

  if (!enhanced)
    return (
      <div className={styles.root} data-mask-sandbox data-learning-block>
        <p className={styles.example}>
          Маска <code>{props.defaultMask}</code>, число{" "}
          <code>{props.defaultNumber}</code>
        </p>
        <MaskResult check={checkMask(props.defaultMask, props.defaultNumber)} />
        <Legend />
      </div>
    );

  return (
    <div
      className={styles.root}
      data-mask-sandbox
      data-enhanced
      data-learning-block
    >
      <div className={styles.inputs}>
        <Field
          label="Маска"
          value={mask}
          spellCheck={false}
          autoComplete="off"
          className={styles.field}
          onChange={(event) => setMask(event.currentTarget.value)}
        />
        <Field
          label="Число"
          value={value}
          inputMode="numeric"
          spellCheck={false}
          autoComplete="off"
          className={styles.field}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </div>
      <div aria-live="polite">
        <MaskResult check={checkMask(mask, value)} />
      </div>
      <Legend />
    </div>
  );
};

const MaskResult: React.FC<{ check: MaskCheck }> = ({ check }) => {
  if (check.status !== "accepted")
    return (
      <p className={styles.message} data-mask-result="rejected">
        {messages[check.status]}
      </p>
    );
  const star = check.segments.find((segment) => segment.part === "*");
  let note = "";
  if (star)
    note = star.text
      ? ` Звёздочка заменяет «${star.text}».`
      : " Звёздочка здесь пустая.";
  return (
    <>
      <Cells segments={check.segments} />
      <p className={styles.message} data-mask-result="accepted">
        {`Подходит.${note}`}
      </p>
    </>
  );
};

const Cells: React.FC<{ segments: readonly MaskSegment[] }> = (props) => (
  <div className={styles.cells} aria-hidden="true">
    {props.segments.flatMap((segment, index) => {
      if (segment.part === "*" && !segment.text)
        return [<span key={index} className={styles.empty} />];
      const kind =
        segment.part === "?" || segment.part === "*" ? segment.part : "digits";
      return [...segment.text].map((char, charIndex) => (
        <span
          key={`${String(index)}-${String(charIndex)}`}
          className={styles.cell}
          data-part={kind}
        >
          {char}
        </span>
      ));
    })}
  </div>
);

const Legend: React.FC = () => (
  <p className={styles.legend}>
    Белые клетки — обязательные цифры маски, серые — <code>?</code>, в оранжевой
    рамке — <code>*</code>. Тонкая оранжевая черта — пустая <code>*</code>.
  </p>
);
