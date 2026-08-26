import { LearningVisualFrame } from "~/entities/learning-visual";
import styles from "../lesson-design-lab.module.css";

const rows = [
  {
    id: "step-1",
    number: "1",
    values: [2, 5, 7, 9, 12, 14, 21, 27, 31, 34, 38, 45, 50],
    middle: 6,
    mutedUntil: -1,
    equation: "a[M] ? x",
    note: "Сравниваем x со средним элементом a[M] в диапазоне [L, R].",
  },
  {
    id: "step-2",
    number: "2",
    values: [2, 5, 7, 9, 12, 14, 18, 27, 31, 34, 38, 41, 50],
    middle: 8,
    mutedUntil: 6,
    equation: "x больше a[M] → L = M + 1",
    note: "Если x > a[M], элементы слева не могут быть равны x.",
  },
  {
    id: "step-3",
    number: "3",
    values: [2, 5, 7, 9, 12, 14, 18, 27, 31, 34, 41, 45, 50],
    middle: 8,
    mutedUntil: 7,
    equation: "x меньше a[M] → R = M − 1",
    note: "Если x < a[M], элементы справа не могут быть равны x.",
  },
] as const;

export const BinarySearchProof: React.FC = () => (
  <LearningVisualFrame
    className={styles.visual}
    caption="Три состояния одного шага двоичного поиска"
    purpose="Цель: связать сравнение с безопасным отсечением диапазона"
    accessibleDescription="В исходном отсортированном диапазоне выбирается середина. Если искомое значение больше среднего, левая половина исключается; если меньше — исключается правая. После каждого сравнения остаётся не более половины прежних кандидатов."
  >
    <div className={styles.proof} aria-hidden="true">
      {rows.map((row, rowIndex) => (
        <div className={styles.proofRow} key={row.id} data-proof-row>
          <div className={styles.stage} data-proof-stage>
            <span className={styles.stageNumber}>{row.number}.</span>
            <div className={styles.arrayWrap}>
              <div className={styles.bounds}>
                <var>L</var>
                <var>M</var>
                <var>R</var>
              </div>
              <div className={styles.array}>
                {row.values.map((value, index) => (
                  <span
                    className={proofCellClass(row, index)}
                    key={`${row.id}-${String(index)}`}
                  >
                    {value}
                  </span>
                ))}
              </div>
              <p className={styles.equation}>{row.equation}</p>
            </div>
          </div>
          <svg
            className={styles.leader}
            viewBox="0 0 120 84"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path d={leaderPath(rowIndex)} />
          </svg>
          <div className={styles.explanation} data-proof-note>
            <span>{row.number}</span>
            <p>{row.note}</p>
          </div>
        </div>
      ))}
    </div>
  </LearningVisualFrame>
);

function proofCellClass(
  row: (typeof rows)[number],
  index: number,
): string | undefined {
  if (index === row.middle) return styles.middleCell;
  if (index <= row.mutedUntil) return styles.mutedCell;
  return undefined;
}

// A horizontal-ease cubic curve rather than orthogonal H/V/Q segments — same
// technique as the annotated-diagram leaders (diagram-geometry.ts), so it
// reads as a hand-inked connector rather than a ruled schematic, matching
// the reference diagrams' ("docs/artifacts/diagram-references/") ink-line
// style. Endpoints are unchanged from the previous orthogonal paths.
function leaderPath(rowIndex: number): string {
  if (rowIndex === 0) return "M 0 54 C 60 54 60 16 120 16";
  if (rowIndex === 1) return "M 0 42 C 60 42 60 22 120 22";
  return "M 0 30 C 60 30 60 10 120 10";
}
