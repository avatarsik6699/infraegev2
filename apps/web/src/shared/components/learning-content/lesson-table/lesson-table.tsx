import { cssUtils } from "~/shared/lib/css-utils";
import type { LessonTableTypes } from "./lesson-table.types";
import styles from "./lesson-table.module.css";

/**
 * Learning table (Change 171): a semantic table whose numeric columns line up
 * by digits. A wide table scrolls inside its own region, never the page.
 */
export const LessonTable: React.FC<LessonTableTypes.Props> = (props) => (
  <div
    className={cssUtils.cx(styles.root, props.className)}
    role="region"
    aria-label={props.label}
    // Keyboard users can scroll a table that is wider than the column.
    tabIndex={0}
    data-lesson-table
    data-learning-block
  >
    <table className={styles.table}>
      <thead>
        <tr>
          {props.columns.map((column, index) => (
            <th
              key={index}
              scope="col"
              data-numeric={column.numeric || undefined}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, index) => (
              <td
                key={index}
                data-numeric={props.columns[index]?.numeric || undefined}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
