import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { openFullscreen, watchFullscreen } from "~/shared/lib/fullscreen";
import { address, colLetters, parseAddress } from "~/shared/lib/sheet-eval";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { formulaParts } from "../formula-block/formula-parts";
import { formulaLayout, linesOf } from "../formula-block/formula-layout";
import { breakable } from "../formula-block/formula-text";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";
import {
  bookFor,
  cellKey,
  cellViews,
  firstSelection,
  framesOf,
  inFormulaRange,
  inputOf,
  shownCell,
  statusOf,
  visibleRows,
} from "./sheet-model";
import styles from "./sheet-block.module.css";

export type SheetBlockProps = LessonMediaTypes.Sheet & {
  /** Accessible name of the block: «Лист «База»». */
  label: string;
};

type Selection = { sheet: string; addr: string };
type Editing = Selection & { text: string; selectAll: boolean };

/** One tab stop in the grid: the selected cell (roving tabindex). */
const tabStop = (enhanced: boolean, selected: boolean) => {
  if (!enhanced) return undefined;
  return selected ? 0 : -1;
};

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

const TAB_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

/** Characters of a formula on one line of the bar at the column width. */
const BAR_LINE = 62;

/**
 * Lines the bar keeps for the longest formula of the block as one flowing
 * line, at most three: selecting another cell never moves the grid (F13).
 */
const barLines = (sheets: readonly LessonMediaTypes.SheetPart[]) =>
  Math.min(
    3,
    Math.max(
      1,
      ...sheets.flatMap((part) =>
        Object.values(part.inputs)
          .filter((text) => text.startsWith("="))
          .map((text) => Math.ceil(text.length / BAR_LINE)),
      ),
    ),
  );

/**
 * A live sheet of the Excel course (Change 177), the stand's mini-sheet: column
 * letters and row numbers, a formula bar, coloured frames of the cells the
 * selected formula reads, source cells the learner retypes with the sheet
 * recomputed in the browser. SSR and no-JS show the values and the formulas.
 * Change 184: the sheets share the height of the tallest one up to a limit and
 * scroll inside it, a long formula breaks between its arguments, the formulas
 * under the grid select their cells, and the block opens on the whole screen.
 */
export const SheetBlock: React.FC<SheetBlockProps> = (props) => {
  const enhanced = useIsEnhanced();
  const [edits, setEdits] = useState<ReadonlyMap<string, string>>(new Map());
  const [selection, setSelection] = useState<Selection>(() => {
    const [sheet, addr] = firstSelection(props);
    return { sheet, addr };
  });
  const [activeSheet, setActiveSheet] = useState(props.sheets[0].name);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [message, setMessage] = useState("");
  // cells whose shown value changed with the last edit, and its number: a new
  // number remounts them and restarts the highlight
  const [changed, setChanged] = useState<{ keys: Set<string>; round: number }>({
    keys: new Set(),
    round: 0,
  });
  const focusRequest = useRef(false);
  // the cell being typed into, cleared synchronously: a blur that follows
  // Enter, Tab or Esc must not commit the same text a second time
  const editingRef = useRef<Editing | null>(null);
  const cellRefs = useRef(new Map<string, HTMLTableCellElement>());
  const rootRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  // the formula of the bar broken by its arguments, on the learner's request
  const [unfolded, setUnfolded] = useState(false);

  const book = useMemo(() => bookFor(props, edits), [props, edits]);
  const views = useMemo(() => cellViews(props, book), [props, book]);
  const statuses = useMemo(
    () =>
      new Map(props.sheets.map((part) => [part.name, statusOf(part, book)])),
    [props, book],
  );
  const selectedText = inputOf(book, selection.sheet, selection.addr);
  const frames = enhanced
    ? framesOf(selectedText, selection.sheet)
    : framesOf(
        props.select
          ? (props.sheets.find((s) => s.name === props.select?.[0])?.inputs[
              props.select[1]
            ] ?? "")
          : "",
        props.select?.[0] ?? props.sheets[0].name,
      );
  const multi = props.sheets.length > 1;
  const lines = useMemo(() => barLines(props.sheets), [props.sheets]);
  const barText = enhanced
    ? selectedText
    : (props.sheets.find((s) => s.name === props.select?.[0])?.inputs[
        props.select?.[1] ?? ""
      ] ?? "");
  const layout = formulaLayout(barText);
  const foldable = layout.length > 1;

  // the whole screen: the Fullscreen API where there is one, else the block
  // covers the window; Esc or the button returns it to the page
  useEffect(() => {
    if (!expanded) return;
    return watchFullscreen(rootRef.current, () => setExpanded(false));
  }, [expanded]);

  const toggleExpanded = () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (rootRef.current) openFullscreen(rootRef.current);
  };

  useEffect(() => {
    if (!focusRequest.current) return;
    focusRequest.current = false;
    cellRefs.current.get(cellKey(selection.sheet, selection.addr))?.focus();
  }, [selection]);

  // the selected cell stays in sight, as in Excel: the grid scrolls sideways
  // to it (a helper column far to the right is selected first)
  // a block in a closed tab has no size yet: it scrolls when it is shown
  useEffect(() => {
    if (!enhanced) return;
    const cell = cellRefs.current.get(cellKey(selection.sheet, selection.addr));
    const box = cell?.closest<HTMLElement>("[data-sheet-name]");
    if (!cell || !box || box.hidden) return;
    const reveal = () => {
      const c = cell.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      if (c.right > b.right) box.scrollLeft += c.right - b.right + 8;
      else if (c.left < b.left) box.scrollLeft -= b.left - c.left + 48;
    };
    if (box.clientWidth > 0) {
      reveal();
      return;
    }
    const watch = new ResizeObserver(() => {
      if (box.clientWidth === 0) return;
      watch.disconnect();
      reveal();
    });
    watch.observe(box);
    return () => watch.disconnect();
  }, [enhanced, selection, activeSheet]);

  const say = (sheet: string, addr: string, tail = "") =>
    setMessage(
      `${addr}: ${views.get(cellKey(sheet, addr))?.shown ?? ""}${tail}`,
    );

  const select = (sheet: string, addr: string, focus: boolean) => {
    focusRequest.current = focus;
    setSelection({ sheet, addr });
  };

  // a formula under the grid: its sheet is shown and its cell selected
  const showFormula = (sheet: string, addr: string) => {
    const part = props.sheets.find((one) => one.name === sheet);
    const formula = part?.formulas.find((f) => f.cell === addr);
    const cell = part && formula ? shownCell(part, formula) : addr;
    setActiveSheet(sheet);
    select(sheet, cell, false);
    say(sheet, cell);
  };

  const move = (d: [number, number], announce: boolean) => {
    const part = props.sheets.find((s) => s.name === selection.sheet);
    if (!part) return;
    const [r, c] = parseAddress(selection.addr);
    const rows = visibleRows(part);
    const row = d[0] ? rows[rows.indexOf(r) + d[0]] : r;
    const col = c + d[1];
    if (row === undefined || col < part.cols[0] || col > part.cols[1]) return;
    const next = address(row, col);
    select(part.name, next, true);
    if (announce) say(part.name, next);
  };

  const startEdit = (sheet: string, addr: string, typed?: string) => {
    const view = views.get(cellKey(sheet, addr));
    if (!view?.editable) {
      setMessage(
        view?.formula
          ? "Это формула: её считает таблица. Измени исходные числа."
          : "Эту ячейку в примере не меняем.",
      );
      return;
    }
    const next = {
      sheet,
      addr,
      text: typed ?? inputOf(book, sheet, addr),
      selectAll: typed === undefined,
    };
    editingRef.current = next;
    setEditing(next);
  };

  const commit = (keep: boolean) => {
    const at = editingRef.current;
    if (!at) return;
    editingRef.current = null;
    const { sheet, addr, text } = at;
    setEditing(null);
    if (!keep || text === inputOf(book, sheet, addr)) return;
    const next = new Map(edits);
    const original = props.sheets.find((s) => s.name === sheet)?.inputs[addr];
    if (text === (original ?? "")) next.delete(cellKey(sheet, addr));
    else next.set(cellKey(sheet, addr), text);
    const after = cellViews(props, bookFor(props, next));
    const keys = new Set<string>();
    let formulas = 0;
    for (const [key, view] of after) {
      if (view.shown === views.get(key)?.shown) continue;
      keys.add(key);
      if (view.formula) formulas++;
    }
    setEdits(next);
    setChanged((current) => ({ keys, round: current.round + 1 }));
    setMessage(
      `${addr}: ${after.get(cellKey(sheet, addr))?.shown ?? ""}${
        formulas
          ? ` — пересчитано формул: ${String(formulas)}`
          : " — формулы не изменились"
      }`,
    );
  };

  const reset = () => {
    const keys = new Set<string>();
    const after = cellViews(props, bookFor(props, new Map()));
    for (const [key, view] of after)
      if (view.shown !== views.get(key)?.shown) keys.add(key);
    setEdits(new Map());
    setChanged((current) => ({ keys, round: current.round + 1 }));
    setMessage("Исходные числа восстановлены.");
  };

  const onCellKey = (
    event: React.KeyboardEvent<HTMLTableCellElement>,
    sheet: string,
    addr: string,
  ) => {
    if (editing) return;
    const arrow = ARROWS[event.key] as [number, number] | undefined;
    if (arrow) {
      event.preventDefault();
      move(arrow, true);
    } else if (event.key === "Enter" || event.key === "F2") {
      event.preventDefault();
      startEdit(sheet, addr);
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      startEdit(sheet, addr, event.key);
    }
  };

  const onEditKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      commit(true);
      const back = event.shiftKey ? -1 : 1;
      move(event.key === "Tab" ? [0, back] : [back, 0], false);
    } else if (event.key === "Escape") {
      event.preventDefault();
      const at = editingRef.current;
      editingRef.current = null;
      setEditing(null);
      if (at) select(at.sheet, at.addr, true);
    }
  };

  // tabs of the sheets: the arrows move between them, as in a tab list
  const onTabKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = TAB_STEPS[event.key] as number | undefined;
    if (!step) return;
    event.preventDefault();
    const names = props.sheets.map((s) => s.name);
    const next =
      names[(names.indexOf(activeSheet) + step + names.length) % names.length];
    setActiveSheet(next);
    const tabs = event.currentTarget.parentElement?.children;
    (tabs?.[names.indexOf(next)] as HTMLElement | undefined)?.focus();
  };

  const barPart = (part: (typeof frames.parts)[number], k: number) =>
    part.color ? (
      <span key={k} className={styles.formulaRef} data-ref={part.color}>
        {breakable(part.text, k)}
      </span>
    ) : (
      <span key={k}>{breakable(part.text, k)}</span>
    );

  const shownAddr = enhanced
    ? `${multi ? `${selection.sheet}!` : ""}${selection.addr}`
    : (props.select?.[1] ?? "");

  return (
    <figure
      ref={rootRef}
      className={styles.root}
      role="group"
      aria-label={props.label}
      data-sheet-block
      data-enhanced={enhanced || undefined}
      data-expanded={expanded || undefined}
      data-learning-block
    >
      <div className={styles.bar}>
        <span className={styles.address} aria-label="Адрес ячейки">
          {shownAddr}
        </span>
        <span className={styles.fx} aria-hidden="true">
          fx
        </span>
        <output
          className={styles.formula}
          aria-label="Строка формул"
          data-unfolded={(unfolded && foldable) || undefined}
          style={{ "--bar-lines": lines } as React.CSSProperties}
        >
          {unfolded && foldable
            ? linesOf(frames.parts, layout).map((line, n) => (
                <span
                  key={n}
                  className={styles.formulaLine}
                  style={{ "--indent": line.indent } as React.CSSProperties}
                >
                  {line.parts.map((part, k) => barPart(part, k))}
                </span>
              ))
            : frames.parts.map((part, k) => barPart(part, k))}
        </output>
        {enhanced && foldable ? (
          <Button
            surface="bare"
            density="compact"
            hierarchy="quiet"
            iconOnly
            iconStart={
              unfolded ? (
                <ChevronUp aria-hidden="true" size={16} />
              ) : (
                <ChevronDown aria-hidden="true" size={16} />
              )
            }
            aria-expanded={unfolded}
            aria-label="Формула по аргументам"
            title={
              unfolded
                ? "Собрать формулу в строку"
                : "Разобрать формулу по аргументам"
            }
            onClick={() => setUnfolded((current) => !current)}
          />
        ) : null}
        {enhanced && edits.size ? (
          <Button hierarchy="secondary" density="compact" onClick={reset}>
            Вернуть исходные
          </Button>
        ) : null}
        {enhanced ? (
          <Button
            className={styles.expand}
            surface="bare"
            density="compact"
            hierarchy="quiet"
            iconOnly
            iconStart={
              expanded ? (
                <Minimize2 aria-hidden="true" size={16} />
              ) : (
                <Maximize2 aria-hidden="true" size={16} />
              )
            }
            aria-label={
              expanded ? "Вернуть таблицу на страницу" : "Таблица на весь экран"
            }
            title={expanded ? "Вернуть на страницу (Esc)" : "На весь экран"}
            onClick={toggleExpanded}
          />
        ) : null}
      </div>
      <div
        className={styles.sheets}
        data-stacked={(multi && enhanced) || undefined}
      >
        {props.sheets.map((part) => {
          const hidden = enhanced ? part.name !== activeSheet : false;
          const columns: number[] = [];
          for (let c = part.cols[0]; c <= part.cols[1]; c++) columns.push(c);
          return (
            <div
              key={part.name}
              className={styles.scroll}
              role={multi && enhanced ? "tabpanel" : undefined}
              aria-label={multi ? `Лист «${part.name}»` : undefined}
              hidden={hidden}
              data-sheet-name={part.name}
            >
              {multi && !enhanced ? (
                <Typography.Text component="span" className={styles.sheetName}>
                  {`Лист «${part.name}»`}
                </Typography.Text>
              ) : null}
              <table
                className={styles.grid}
                role={enhanced ? "grid" : undefined}
                aria-label={`Лист «${part.name}»`}
              >
                <thead>
                  <tr>
                    <th className={styles.corner} aria-hidden="true" />
                    {columns.map((c) => (
                      <th key={c} scope="col">
                        {colLetters(c)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows(part).map((r) => (
                    <tr key={r}>
                      <th scope="row">{r}</th>
                      {columns.map((c) => {
                        const addr = address(r, c);
                        const key = cellKey(part.name, addr);
                        const view = views.get(key);
                        const selected =
                          enhanced &&
                          selection.sheet === part.name &&
                          selection.addr === addr;
                        // the selection on another sheet: the grid's first cell
                        // keeps a tab stop
                        const entry =
                          selection.sheet !== part.name &&
                          r === visibleRows(part)[0] &&
                          c === part.cols[0];
                        const frame = frames.cells.get(key);
                        const isEditing =
                          editing?.sheet === part.name && editing.addr === addr;
                        const flash = changed.keys.has(key);
                        return (
                          <td
                            key={
                              flash ? `${addr}-${String(changed.round)}` : addr
                            }
                            ref={(node) => {
                              if (node) cellRefs.current.set(key, node);
                              else cellRefs.current.delete(key);
                            }}
                            className={styles.cell}
                            data-kind={view?.kind}
                            data-formula={view?.formula || undefined}
                            data-input={
                              (enhanced && view?.editable) || undefined
                            }
                            data-selected={selected || undefined}
                            data-status={
                              statuses.get(part.name)?.cells.has(key) ||
                              undefined
                            }
                            data-wall={part.walls?.[addr]}
                            data-ref={frame?.color}
                            data-edge={frame?.edge}
                            data-changed={flash || undefined}
                            role={enhanced ? "gridcell" : undefined}
                            aria-selected={enhanced ? selected : undefined}
                            tabIndex={tabStop(enhanced, selected || entry)}
                            onClick={
                              enhanced && !isEditing
                                ? () => select(part.name, addr, true)
                                : undefined
                            }
                            onFocus={
                              enhanced && entry
                                ? () => select(part.name, addr, false)
                                : undefined
                            }
                            onDoubleClick={
                              enhanced
                                ? () => startEdit(part.name, addr)
                                : undefined
                            }
                            onKeyDown={
                              enhanced
                                ? (event) => onCellKey(event, part.name, addr)
                                : undefined
                            }
                          >
                            {isEditing ? (
                              <input
                                className={styles.input}
                                aria-label={`Ячейка ${addr}`}
                                value={editing.text}
                                autoFocus
                                onFocus={(event) => {
                                  if (editing.selectAll)
                                    event.currentTarget.select();
                                }}
                                onChange={(event) => {
                                  const text = event.currentTarget.value;
                                  const at = editingRef.current;
                                  if (!at) return;
                                  editingRef.current = { ...at, text };
                                  setEditing(editingRef.current);
                                }}
                                onKeyDown={onEditKey}
                                onBlur={() => commit(true)}
                              />
                            ) : (
                              view?.shown
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      {multi && enhanced ? (
        <div className={styles.tabs} role="tablist" aria-label="Листы файла">
          {props.sheets.map((part) => {
            const on = part.name === activeSheet;
            return (
              <button
                key={part.name}
                type="button"
                role="tab"
                className={styles.tab}
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                data-ref={on ? undefined : frames.tabs.get(part.name)}
                onClick={() => setActiveSheet(part.name)}
                onKeyDown={onTabKey}
              >
                {part.name}
              </button>
            );
          })}
        </div>
      ) : null}
      {props.sheets.map((part) => {
        const status = statuses.get(part.name);
        if (!status || (enhanced && part.name !== activeSheet)) return null;
        return (
          <Typography.Text
            key={part.name}
            component="span"
            className={styles.status}
            data-sheet-status={part.name}
          >
            <span>{`Количество: ${String(status.count)}`}</span>
            <span>{`Сумма: ${status.sum}`}</span>
          </Typography.Text>
        );
      })}
      <FormulaNote
        sheets={props.sheets}
        selected={enhanced ? selection : undefined}
        onShow={enhanced ? showFormula : undefined}
      />
      <Typography.Text
        component="span"
        className={styles.live}
        aria-live="polite"
      >
        {message}
      </Typography.Text>
    </figure>
  );
};

const FormulaNote: React.FC<{
  sheets: readonly LessonMediaTypes.SheetPart[];
  /** The selected cell: its formula is marked in the list. */
  selected?: Selection;
  /** Selects the cell of a formula in the grid (with scripting). */
  onShow?: (sheet: string, addr: string) => void;
}> = (props) => {
  const items = props.sheets.flatMap((part) =>
    part.formulas.map((f) => ({ sheet: part.name, ...f })),
  );
  if (!items.length) return null;
  // F12: say what the list is — the formulas written in the cells — on which
  // sheets they stand, which sheets hold data only, and what a row does
  const withFormulas = [...new Set(items.map((item) => item.sheet))];
  const named = withFormulas.length > 1;
  const multi = props.sheets.length > 1;
  const dataOnly = props.sheets
    .map((part) => part.name)
    .filter((name) => !withFormulas.includes(name));
  const caption = multi
    ? `Формулы в ячейках ${named ? "листов" : "листа"} ${withFormulas
        .map((name) => `«${name}»`)
        .join(" и ")}`
    : "Формулы в ячейках";
  const notes = [
    props.onShow ? "Нажми на формулу — её ячейка выделится в таблице." : null,
    dataOnly.length
      ? `На ${dataOnly.length > 1 ? "листах" : "листе"} ${dataOnly
          .map((name) => `«${name}»`)
          .join(" и ")} формул нет — только данные.`
      : null,
  ].filter(Boolean);
  return (
    <div className={styles.note}>
      <Typography.Text component="span" className={styles.noteCaption}>
        {caption}
      </Typography.Text>
      {notes.length ? (
        <Typography.Text component="span" className={styles.noteHint}>
          {notes.join(" ")}
        </Typography.Text>
      ) : null}
      <ul className={styles.noteList}>
        {items.map((item) => {
          const at = `${named ? `${item.sheet}!` : ""}${item.cell}`;
          // the formula's cell or one of its copies (a filter may hide the first)
          const current =
            props.selected?.sheet === item.sheet &&
            inFormulaRange(item, props.selected.addr);
          const body = (
            <>
              <span className={styles.noteCell}>
                <code>{at}</code>
                {item.until ? (
                  <span className={styles.noteUntil}>
                    {`скопирована до ${item.until}`}
                  </span>
                ) : null}
              </span>
              <code className={styles.noteFormula}>
                {formulaParts(item.formula).map((part, k) =>
                  part.kind === "function" ? (
                    <span key={k} className={styles.function}>
                      {part.text}
                    </span>
                  ) : (
                    <span key={k}>{breakable(part.text, k)}</span>
                  ),
                )}
              </code>
            </>
          );
          return (
            <li key={`${item.sheet}!${item.cell}`}>
              {props.onShow ? (
                <button
                  type="button"
                  className={styles.noteRow}
                  aria-current={current || undefined}
                  onClick={() => props.onShow?.(item.sheet, item.cell)}
                >
                  {body}
                </button>
              ) : (
                <span className={styles.noteRow}>{body}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
