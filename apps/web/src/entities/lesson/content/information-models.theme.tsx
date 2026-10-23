import { LessonTable } from "~/shared/components/learning-content";

// The through-line task of topic 1 (№ 1 of the FIPI 2027 demo project) and
// the table of roads every example is written as: public, shared by the free
// lesson and its paid subtopics.
export const THEME_TASK = (
  <>
    «На рисунке схема дорог N-ского района изображена в виде графа, в таблице
    содержатся сведения о протяжённости каждой из этих дорог (в километрах). Так
    как таблицу и схему рисовали независимо друг от друга, нумерация населённых
    пунктов в таблице никак не связана с буквенными обозначениями на графе.
    Определите, какова сумма протяжённостей дорог из пункта E в пункт A и из
    пункта B в пункт C. В ответе запишите целое число.»
  </>
);

export const R = "1-analiz-informacionnyh-modelej";

/** Roads of a table: [from, to, length] — a length or «*» when only the road
 *  is known. */
export type Road = readonly [number, number, number | "*"];

/** The roads of the through-line task: the table of the demo. */
export const THEME_ROADS: readonly Road[] = [
  [1, 2, 39],
  [1, 5, 53],
  [1, 6, 30],
  [2, 3, 21],
  [3, 4, 8],
  [3, 5, 3],
  [4, 5, 13],
  [4, 6, 5],
];

/** A table of roads between points 1…n, as in the exam: a road is written
 *  twice, in the row and in the column of each end; no road — an empty cell. */
export const RoadTable: React.FC<{
  label: string;
  size: number;
  roads: readonly Road[];
}> = (props) => {
  const cell = new Map<string, string>();
  for (const [a, b, w] of props.roads) {
    cell.set(`${String(a)}-${String(b)}`, String(w));
    cell.set(`${String(b)}-${String(a)}`, String(w));
  }
  const names = Array.from({ length: props.size }, (_, i) => i + 1);
  return (
    <LessonTable
      label={props.label}
      columns={[
        { label: "Пункт" },
        ...names.map((n) => ({ label: String(n), numeric: true })),
      ]}
      rows={names.map((r) => [
        <strong key="r">{r}</strong>,
        ...names.map((c) => cell.get(`${String(r)}-${String(c)}`) ?? ""),
      ])}
    />
  );
};
