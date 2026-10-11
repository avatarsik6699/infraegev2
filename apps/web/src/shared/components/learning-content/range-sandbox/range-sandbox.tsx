import { useState } from "react";
import { Field } from "~/shared/components/field";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { parseWhole, rangeValues, sliceIndexes } from "./range-values";
import styles from "./range-sandbox.module.css";

export type RangeSandboxProps = {
  mode: "range" | "slice";
  start: number | null;
  stop: number | null;
  step: number;
  /** The sliced string (slice mode). */
  text?: string;
};

type Result =
  | {
      kind: "range";
      start: number;
      stop: number;
      step: number;
      values: number[];
    }
  | { kind: "slice"; text: string; taken: number[]; spec: string; step: number }
  | { kind: "message"; message: string };

const MAX_SPAN = 60;
const MAX_TEXT = 10;

const signed = (value: number) =>
  value > 0 ? `+${String(value)}` : String(value);

function evaluate(
  mode: RangeSandboxProps["mode"],
  start: number | null,
  stop: number | null,
  rawStep: number | null,
  text: string,
): Result {
  const step = rawStep ?? 1;
  if ([start, stop, step].some((v) => v !== null && Number.isNaN(v)))
    return { kind: "message", message: "Нужны целые числа." };
  if (step === 0)
    return {
      kind: "message",
      message: `${mode === "range" ? "range" : "Срез"} с шагом 0 — ошибка ValueError: шаг не может быть нулём.`,
    };
  if (mode === "range") {
    if (start === null || stop === null)
      return { kind: "message", message: "Для range заполни start и stop." };
    if (Math.abs(stop - start) > MAX_SPAN)
      return {
        kind: "message",
        message: "Возьми границы поближе: не дальше 60 друг от друга.",
      };
    return {
      kind: "range",
      start,
      stop,
      step,
      values: rangeValues(start, stop, step),
    };
  }
  const word = text.slice(0, MAX_TEXT) || "A";
  const spec =
    `${start === null ? "" : String(start)}:${stop === null ? "" : String(stop)}` +
    (step === 1 ? "" : `:${String(step)}`);
  return {
    kind: "slice",
    text: word,
    taken: sliceIndexes(start, stop, step, word.length),
    spec,
    step,
  };
}

function describe(result: Result): string {
  if (result.kind === "message") return result.message;
  if (result.kind === "range") {
    const list = `list(range(${String(result.start)}, ${String(result.stop)}, ${String(result.step)})) → [${result.values.join(", ")}]`;
    if (result.values.length) return list;
    const compare = result.step > 0 ? " не меньше " : " не больше ";
    return `${list} — пусто: при шаге ${signed(result.step)} уже первое значение ${String(result.start)}${compare}stop ${String(result.stop)}.`;
  }
  const taken = result.taken.map((k) => result.text[k] ?? "").join("");
  return `s[${result.spec}] → '${taken}'${result.taken.length ? "" : " — пустой срез, это не ошибка."}`;
}

const RangeLine: React.FC<{
  start: number;
  stop: number;
  step: number;
  values: number[];
}> = (props) => {
  const lo = Math.min(props.start, props.stop) - 1;
  const hi = Math.max(props.start, props.stop) + 1;
  const left = 30;
  const right = 630;
  const base = 70;
  const x = (v: number) => left + ((v - lo) / (hi - lo)) * (right - left);
  const every = Math.ceil((hi - lo + 1) / 26);
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v += 1) ticks.push(v);
  const label = Math.max(70, Math.min(590, x(props.stop)));
  return (
    <svg className={styles.svg} viewBox="0 0 660 120" aria-hidden="true">
      <line className={styles.axis} x1={left} y1={base} x2={right} y2={base} />
      {ticks.map((v) => (
        <g key={v}>
          <line
            className={styles.tick}
            x1={x(v)}
            y1={base - 4}
            x2={x(v)}
            y2={base + 4}
          />
          {(v - lo) % every === 0 || props.values.includes(v) ? (
            <text
              fontSize={14}
              className={
                props.values.includes(v) ? styles.labelOn : styles.label
              }
              x={x(v)}
              y={base + 26}
              textAnchor="middle"
            >
              {v}
            </text>
          ) : null}
        </g>
      ))}
      {props.values.map((v, k) => {
        const previous = props.values[k - 1];
        return (
          <g key={v}>
            {previous === undefined ? null : (
              <>
                <path
                  className={styles.arc}
                  d={`M ${String(x(previous))} ${String(base - 12)} Q ${String((x(previous) + x(v)) / 2)} ${String(base - 42)} ${String(x(v))} ${String(base - 12)}`}
                />
                {Math.abs(x(v) - x(previous)) > 26 ? (
                  <text
                    fontSize={14}
                    className={styles.label}
                    x={(x(previous) + x(v)) / 2}
                    y={base - 34}
                    textAnchor="middle"
                  >
                    {signed(props.step)}
                  </text>
                ) : null}
              </>
            )}
            <circle className={styles.dot} cx={x(v)} cy={base} r={9} />
          </g>
        );
      })}
      <line
        className={styles.stop}
        x1={x(props.stop)}
        y1={base - 20}
        x2={x(props.stop)}
        y2={base + 8}
      />
      <text
        fontSize={14}
        className={styles.labelOn}
        x={label}
        y={18}
        textAnchor="middle"
      >
        {`stop = ${String(props.stop)}, не входит`}
      </text>
    </svg>
  );
};

const SliceCells: React.FC<{ text: string; taken: number[]; step: number }> = (
  props,
) => {
  const cell = 46;
  const left = 30;
  const top = 30;
  const n = props.text.length;
  const first = props.taken[0];
  const last = props.taken.at(-1);
  return (
    <svg className={styles.svg} viewBox="0 0 660 156" aria-hidden="true">
      {[...props.text].map((char, k) => {
        const on = props.taken.indexOf(k);
        const left0 = left + k * cell;
        return (
          <g key={k}>
            <rect
              className={on >= 0 ? styles.cellOn : styles.cell}
              x={left0}
              y={top}
              width={cell}
              height={cell}
            />
            <text
              fontSize={19}
              className={styles.char}
              x={left0 + cell / 2}
              y={top + 30}
              textAnchor="middle"
            >
              {char}
            </text>
            <text
              fontSize={14}
              className={styles.label}
              x={left0 + cell / 2}
              y={top - 9}
              textAnchor="middle"
            >
              {k}
            </text>
            <text
              fontSize={14}
              className={styles.label}
              x={left0 + cell / 2}
              y={top + cell + 20}
              textAnchor="middle"
            >
              {k - n}
            </text>
            {on >= 0 ? (
              <text
                fontSize={13}
                className={styles.order}
                x={left0 + cell / 2}
                y={top + cell + 44}
                textAnchor="middle"
              >
                {`${String(on + 1)}-й`}
              </text>
            ) : null}
          </g>
        );
      })}
      {props.step > 0 && first !== undefined && last !== undefined
        ? [first, last + 1].map((k) => (
            <line
              key={k}
              className={styles.bound}
              x1={left + k * cell}
              y1={top - 4}
              x2={left + k * cell}
              y2={top + cell + 4}
            />
          ))
        : null}
    </svg>
  );
};

function drawing(result: Result): React.ReactNode {
  if (result.kind === "range") return <RangeLine {...result} />;
  if (result.kind === "slice")
    return (
      <SliceCells text={result.text} taken={result.taken} step={result.step} />
    );
  return null;
}

/**
 * Sandbox for `range(start, stop, step)` and the slice `s[start:stop:step]`
 * (Change 175, the stand's `range_try`): the same drawing as the lesson's
 * range and slice diagrams, redrawn as the learner types. Without scripting
 * the default example is drawn.
 */
export const RangeSandbox: React.FC<RangeSandboxProps> = (props) => {
  const enhanced = useIsEnhanced();
  const show = (v: number | null) => (v === null ? "" : String(v));
  const [start, setStart] = useState(show(props.start));
  const [stop, setStop] = useState(show(props.stop));
  const [step, setStep] = useState(show(props.step));
  const [text, setText] = useState(props.text ?? "");
  const result = evaluate(
    props.mode,
    parseWhole(start),
    parseWhole(stop),
    parseWhole(step),
    text,
  );
  const note =
    props.mode === "range"
      ? "Попробуй шаг −1, start меньше stop и шаг 0."
      : "Пустое поле start или stop в срезе означает «от края», как пропущенная граница.";

  return (
    <div
      className={styles.root}
      data-range-sandbox={props.mode}
      data-enhanced={enhanced || undefined}
      data-learning-block
    >
      <div className={styles.plate}>{drawing(result)}</div>
      {enhanced ? (
        <div className={styles.inputs}>
          {props.mode === "slice" ? (
            <Field
              label="Строка s"
              value={text}
              maxLength={MAX_TEXT}
              spellCheck={false}
              autoComplete="off"
              className={styles.field}
              onChange={(event) => setText(event.currentTarget.value)}
            />
          ) : null}
          <Field
            label="start"
            value={start}
            inputMode="numeric"
            autoComplete="off"
            className={styles.field}
            onChange={(event) => setStart(event.currentTarget.value)}
          />
          <Field
            label="stop"
            value={stop}
            inputMode="numeric"
            autoComplete="off"
            className={styles.field}
            onChange={(event) => setStop(event.currentTarget.value)}
          />
          <Field
            label="step"
            value={step}
            inputMode="numeric"
            autoComplete="off"
            className={styles.field}
            onChange={(event) => setStep(event.currentTarget.value)}
          />
        </div>
      ) : null}
      <p className={styles.message} aria-live="polite" data-range-result>
        {describe(result)}
      </p>
      {enhanced ? <p className={styles.note}>{note}</p> : null}
    </div>
  );
};
