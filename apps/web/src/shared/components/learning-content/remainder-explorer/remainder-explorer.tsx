import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/shared/components/button";
import { russianCount } from "~/shared/lib/russian-count";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { ChoiceChips } from "../choice-chips";
import mediaStyles from "../lesson-media/lesson-media.module.css";
import {
  REMAINDER_CANVAS,
  remainderLayout,
  type RemainderLayout,
} from "./remainder-layout";
import styles from "./remainder-explorer.module.css";

type Preset = readonly [n: number, d: number];

type Props = {
  n: number;
  d: number;
  caption: React.ReactNode;
  /** Example pairs; by default the ordinary case, no remainder, n < d. */
  presets?: readonly Preset[];
};

const DEFAULT_PRESETS: readonly Preset[] = [
  [17, 5],
  [20, 5],
  [3, 7],
];
const LIMITS = { n: [1, 40], d: [2, 9] } as const;

/**
 * Division with remainder as cells in portions (Change 171): steppers for n
 * and d and three presets — the ordinary case, no remainder, a number smaller
 * than the divisor. Without scripting the figure for the given n and d stays.
 */
export const RemainderExplorer: React.FC<Props> = (props) => {
  const enhanced = useIsEnhanced();
  const presets = props.presets ?? DEFAULT_PRESETS;
  const [values, setValues] = useState({ n: props.n, d: props.d });
  const change = (key: "n" | "d", step: number) => {
    const [low, high] = LIMITS[key];
    setValues((current) => ({
      ...current,
      [key]: Math.max(low, Math.min(high, current[key] + step)),
    }));
  };

  return (
    <figure className={mediaStyles.figure} data-remainder-explorer>
      <div className={mediaStyles.plate} tabIndex={0}>
        <RemainderSvg
          n={values.n}
          d={values.d}
          layout={remainderLayout(values.n, values.d)}
        />
      </div>
      {enhanced ? (
        <div className={styles.controls}>
          {(["n", "d"] as const).map((key) => (
            <span key={key} className={styles.number}>
              <span className={styles.name}>{key}</span>
              <Button
                type="button"
                hierarchy="secondary"
                density="compact"
                iconOnly
                iconStart={<Minus size={16} aria-hidden="true" />}
                aria-label={key === "n" ? "Уменьшить n" : "Уменьшить d"}
                disabled={values[key] <= LIMITS[key][0]}
                onClick={() => change(key, -1)}
              />
              <output className={styles.value} aria-live="polite">
                {values[key]}
              </output>
              <Button
                type="button"
                hierarchy="secondary"
                density="compact"
                iconOnly
                iconStart={<Plus size={16} aria-hidden="true" />}
                aria-label={key === "n" ? "Увеличить n" : "Увеличить d"}
                disabled={values[key] >= LIMITS[key][1]}
                onClick={() => change(key, 1)}
              />
            </span>
          ))}
          <ChoiceChips
            label="Примеры"
            options={presets.map(([n, d]) => `${String(n)} и ${String(d)}`)}
            selected={presets.findIndex(
              ([n, d]) => values.n === n && values.d === d,
            )}
            onSelect={(index) => {
              const [n, d] = presets[index] ?? [props.n, props.d];
              setValues({ n, d });
            }}
          />
        </div>
      ) : null}
      <figcaption className={mediaStyles.caption}>{props.caption}</figcaption>
    </figure>
  );
};

const INK = "var(--color-text)";
const MUTED = "var(--color-muted)";
const ACCENT = "var(--color-brand-orange)";

const RemainderSvg: React.FC<{
  n: number;
  d: number;
  layout: RemainderLayout;
}> = (props) => {
  const { cell, left, width, right } = REMAINDER_CANVAS;
  const { quotient, remainder, portions, summaryY, height } = props.layout;
  const label = `${russianCount.of(props.n, ["клетка", "клетки", "клеток"])} порциями по ${String(props.d)}: ${russianCount.of(quotient, ["полная порция", "полные порции", "полных порций"])} и ${String(remainder)} в остатке`;
  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      role="img"
      aria-label={label}
    >
      {portions.map((portion, index) => {
        const color = portion.rest ? ACCENT : INK;
        const w = portion.size * cell;
        return (
          <g key={index}>
            {Array.from({ length: portion.size }, (_, c) => (
              <rect
                key={c}
                x={portion.x + c * cell + 1}
                y={portion.y}
                width={cell - 2}
                height={cell - 2}
                rx={4}
                fill="var(--color-surface)"
                stroke={color}
                strokeWidth={portion.rest ? 2 : 1.5}
              />
            ))}
            <path
              d={`M ${String(portion.x + 2)} ${String(portion.y + cell + 8)} v 6 H ${String(portion.x + w - 2)} v -6`}
              fill="none"
              stroke={portion.rest ? ACCENT : MUTED}
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={portion.x + w / 2}
              y={portion.y + cell + 34}
              textAnchor="middle"
              fontSize={15}
              fill={color}
            >
              {portion.size}
            </text>
          </g>
        );
      })}
      <text x={left} y={summaryY} fontSize={16} fontWeight={600} fill={INK}>
        {`${String(props.n)} // ${String(props.d)} = ${String(quotient)}`}
      </text>
      <text x={left + 104} y={summaryY} fontSize={15} fill={MUTED}>
        — полные порции
      </text>
      <text
        x={right - 76}
        y={summaryY}
        fontSize={16}
        fontWeight={600}
        fill={ACCENT}
        textAnchor="end"
      >
        {`${String(props.n)} % ${String(props.d)} = ${String(remainder)}`}
      </text>
      <text x={right} y={summaryY} fontSize={15} fill={MUTED} textAnchor="end">
        — остаток
      </text>
    </svg>
  );
};
