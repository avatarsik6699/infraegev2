// The through-line task of topic 12 and the table of a machine program: public,
// shared by the free lesson and its paid subtopics.
import { Notation } from "~/shared/components/notation";
import { LessonTable } from "~/shared/components/learning-content";

export const THEME_TASK = (
  <>
    «На ленте исполнителя МТ в соседних ячейках записана последовательность из
    12 символов, каждый из которых 0 или 1; остальные ячейки содержат пустой
    символ λ. В начальный момент головка находится в ближайшей справа от
    последовательности ячейке в состоянии q0. Программа работы исполнителя
    задана таблицей. После выполнения программы в последовательности оказалось
    ровно 5 нулей. Какое наибольшее количество нулей могло быть в исходной
    последовательности?»
  </>
);

/** A program table: a row is a state and its commands, «—» for none. */
export const Program = (props: {
  label: string;
  symbols: readonly string[];
  rows: readonly (readonly string[])[];
}) => {
  const cell = (text: string, key: number) =>
    text === "—" ? "—" : <Notation key={key}>{text}</Notation>;
  return (
    <LessonTable
      label={props.label}
      columns={[
        { label: "Состояние" },
        ...props.symbols.map((symbol, key) => ({ label: cell(symbol, key) })),
      ]}
      rows={props.rows.map((row) => row.map(cell))}
    />
  );
};

/** The program of the through-line task: it subtracts one. */
export const ThemeTable = () => {
  return (
    <Program
      label={"Программа задачи темы"}
      symbols={["λ", "0", "1"]}
      rows={[
        ["q0", "λ, L, q1", "—", "—"],
        ["q1", "λ, S, q1", "1, L, q1", "0, S, q1"],
      ]}
    />
  );
};
