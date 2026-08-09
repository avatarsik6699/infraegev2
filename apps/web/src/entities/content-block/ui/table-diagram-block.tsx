import type { TableDiagramBlockData } from "~/entities/content/model/types";

type Props = { data: TableDiagramBlockData };

/**
 * Encoding grids / truth tables — semantic HTML `<table>`, not SVG (docs/SPEC.md §5.2/§8):
 * a screen reader understands a real table natively, which arbitrary text-in-SVG does not.
 */
export const TableDiagramBlock: React.FC<Props> = (props) => {
  const highlighted = new Set(props.data.highlightedCells ?? []);
  return (
    <table data-diagram aria-label={props.data.ariaLabel}>
      <caption style={{ position: "absolute", left: "-9999px" }}>
        {props.data.ariaLabel}
      </caption>
      <thead>
        <tr>
          {props.data.headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.rows.map((row, rowIndex) => (
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
};
