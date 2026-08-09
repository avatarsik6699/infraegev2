import type { TableDiagramBlockData } from "~/entities/content/model/types";

/**
 * Encoding grids / truth tables — semantic HTML `<table>`, not SVG (docs/SPEC.md §5.2/§8):
 * a screen reader understands a real table natively, which arbitrary text-in-SVG does not.
 */
export function TableDiagramBlock({ data }: { data: TableDiagramBlockData }) {
  const highlighted = new Set(data.highlightedCells ?? []);
  return (
    <table data-diagram aria-label={data.ariaLabel}>
      <caption style={{ position: "absolute", left: "-9999px" }}>
        {data.ariaLabel}
      </caption>
      <thead>
        <tr>
          {data.headers.map((h, i) => (
            <th key={i} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                data-highlighted={
                  highlighted.has(`${rowIndex},${colIndex}`) ? "true" : "false"
                }
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
