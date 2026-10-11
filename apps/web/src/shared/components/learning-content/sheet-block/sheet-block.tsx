import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { address, colLetters, parseAddress } from "~/shared/lib/sheet-eval";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import type { LessonMediaTypes } from "../lesson-media/lesson-media.types";
import {
  bookFor,
  cellKey,
  cellViews,
  firstSelection,
  framesOf,
  inputOf,
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

/**
 * A live sheet of the Excel course (Change 177), the stand's mini-sheet: column
 * letters and row numbers, a formula bar, coloured frames of the cells the
 * selected formula reads, source cells the learner retypes with the sheet
 * recomputed in the browser. SSR and no-JS show the values and the formulas.
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

  const book = useMemo(() => bookFor(props, edits), [props, edits]);
  const views = useMemo(() => cellViews(props, book), [props, book]);
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

  useEffect(() => {
    if (!focusRequest.current) return;
    focusRequest.current = false;
    cellRefs.current.get(cellKey(selection.sheet, selection.addr))?.focus();
  }, [selection]);

  const say = (sheet: string, addr: string, tail = "") =>
    setMessage(
      `${addr}: ${views.get(cellKey(sheet, addr))?.shown ?? ""}${tail}`,
    );

  const select = (sheet: string, addr: string, focus: boolean) => {
    focusRequest.current = focus;
    setSelection({ sheet, addr });
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

  const shownAddr = enhanced
    ? `${multi ? `${selection.sheet}!` : ""}${selection.addr}`
    : (props.select?.[1] ?? "");

  return (
    <figure
      className={styles.root}
      role="group"
      aria-label={props.label}
      data-sheet-block
      data-enhanced={enhanced || undefined}
      data-learning-block
    >
      <div className={styles.bar}>
        <span className={styles.address} aria-label="Адрес ячейки">
          {shownAddr}
        </span>
        <span className={styles.fx} aria-hidden="true">
          fx
        </span>
        <output className={styles.formula} aria-label="Строка формул">
          {frames.parts.map((part, k) =>
            part.color ? (
              <span key={k} className={styles.formulaRef} data-ref={part.color}>
                {part.text}
              </span>
            ) : (
              part.text
            ),
          )}
        </output>
        {enhanced && edits.size ? (
          <Button hierarchy="secondary" density="compact" onClick={reset}>
            Вернуть исходные
          </Button>
        ) : null}
      </div>
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
                          data-input={(enhanced && view?.editable) || undefined}
                          data-selected={selected || undefined}
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
      {multi && enhanced ? (
        <div className={styles.tabs} role="tablist" aria-label="Листы книги">
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
      <FormulaNote sheets={props.sheets} />
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
}> = (props) => {
  const multi = props.sheets.length > 1;
  const items = props.sheets.flatMap((part) =>
    part.formulas.map((f) => ({
      key: `${part.name}!${f.cell}`,
      text: `${multi ? `${part.name}!` : ""}${f.cell}: ${f.formula}`,
      until: f.until,
    })),
  );
  if (!items.length) return null;
  return (
    <Typography.Text className={styles.note}>
      {"Формулы: "}
      {items.map((item, k) => (
        <span key={item.key}>
          {k ? "; " : null}
          <code>{item.text}</code>
          {item.until ? `, скопирована до ${item.until}` : null}
        </span>
      ))}
    </Typography.Text>
  );
};
