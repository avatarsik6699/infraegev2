// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { READ_GRAPH } from "./graph-analysis.paid.code";
import { PythonTerm } from "./python-term";

const F_K =
  '@cache\ndef f(v, k):\n    if k == 0:\n        return 0 if v == 100 else float("inf")\n    best = float("inf")\n    for u, w in graph.get(v, []):\n        best = min(best, w + f(u, k - 1))\n    return best';
const COUNT_K =
  "@cache\ndef count(v, k):\n    if k == 0:\n        return 1 if v == 100 else 0\n    total = 0\n    for u, w in graph.get(v, []):\n        total += count(u, k - 1)\n    return total";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "vtoroj-parametr",
      navLabel: "Второй параметр",
      explanation: (
        <>
          <Typography.Text>
            Это дополнительный урок: такие задачи есть в подборках, а задачи
            основных подтем решаются без него. Нужен кратчайший путь из 6 в 100
            ровно из двух рёбер. Хватит ли одного числа f(v) на вершину?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: лучший остаток из вершины зависит от того, сколько рёбер ещё
              нужно пройти. Поэтому у функции второй параметр — f(v, k), длина
              кратчайшего пути из v в 100 ровно из k рёбер.
            </strong>{" "}
            Шаг по стрелке оставляет на одно ребро меньше. Когда рёбер не
            осталось, путь годится, только если мы в цели.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n" +
              READ_GRAPH +
              "\n\n\n" +
              F_K +
              "\n\n\nprint(f(1, 1), f(1, 2), f(1, 3))\nprint(f(6, 2), f(6, 3))"
            }
            collapsible={false}
            label={"Ровно k рёбер — второй параметр"}
            language="python"
            output={"12.0 7.5 inf\n9.0 8.5"}
          />
          <Typography.Text>
            Из 6 ровно двумя рёбрами лучше всего 6 → 7 → 100 за 9.0, хотя
            кратчайший путь вообще — 6 → 1 → 7 → 100 за 8.5, из трёх рёбер.
            Значения f(v, k) для учебного графа:
          </Typography.Text>
          <LessonTable
            label={"Длина лучшего пути до 100 ровно из k рёбер"}
            columns={[
              { label: "Вершина", numeric: true },
              { label: "k = 1", numeric: true },
              { label: "k = 2", numeric: true },
              { label: "k = 3", numeric: true },
            ]}
            rows={[
              ["7", "2.0", "∞", "∞"],
              ["4", "8.0", "∞", "∞"],
              ["1", "12.0", "7.5", "∞"],
              ["6", "∞", "9.0", "8.5"],
            ]}
          />
          <Typography.Text>
            У вершины 1 теперь не одно число, а целая строка. Каждое значение
            собирается из столбца левее: f(1, 2) = min(5.5 + f(7, 1); 2.5 + f(4,
            1)) = 7.5. <Notation>{"@cache"}</Notation> запоминает ответ для
            каждой пары (v, k).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ne-bolshe-ne-menshe",
      navLabel: "Не больше и не меньше k",
      explanation: (
        <>
          <Typography.Text>
            А если путь должен состоять не меньше чем из 3 рёбер? Или не больше
            чем из 2?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все подходящие числа рёбер и взять лучшее: минимум f(v,
              j) по всем j из нужного диапазона.
            </strong>{" "}
            Сверху число рёбер ограничено: в графе без циклов ребро не
            повторяется, так что путь не длиннее числа строк в файле — 200.
          </Typography.Text>
          <CodeBlock
            code={
              "print(min(f(6, j) for j in range(3, 201)))\nprint(min(f(6, j) for j in range(1, 3)))"
            }
            label={"Не меньше 3 рёбер и не больше 2 рёбер"}
            language="python"
            output={"8.5\n9.0"}
          />
          <Typography.Text>
            Внутри <Notation>{"min"}</Notation> —{" "}
            <PythonTerm term="genexp">генераторное выражение</PythonTerm>: f(6,
            j) для каждого j из диапазона. Невозможные длины дают ∞ и минимум не
            портят. Если в файле больше строк, верхняя граница — их число плюс
            один.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-putej-k",
      navLabel: "Число путей из k рёбер",
      explanation: (
        <>
          <Typography.Text>
            Сколько путей из 6 в 100 состоят ровно из 3 рёбер?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Подсчёт путей из подтемы 5 со вторым параметром: когда рёбер не
              осталось, путь засчитывается, только если мы в цели.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              COUNT_K +
              "\n\n\nprint(count(6, 2), count(6, 3))\nprint(sum(count(6, j) for j in range(1, 4)))"
            }
            label={"Число путей ровно из k и не больше k рёбер"}
            language="python"
            output={"2 2\n4"}
          />
          <Typography.Text>
            Из двух рёбер — 6 → 7 → 100 и 6 → 1 → 100, из трёх — 6 → 1 → 7 → 100
            и 6 → 1 → 4 → 100. Путей не больше чем из трёх рёбер — сумма по j от
            1 до 3: 0 + 2 + 2 = 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "k-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Ровно k рёбер",
                note: <>f(v, k): шаг по стрелке — k − 1</>,
              },
              {
                key: "k = 0, кратчайший путь",
                note: <>в цели 0, в другой вершине ∞</>,
              },
              {
                key: "k = 0, число путей",
                note: <>в цели 1, в другой вершине 0</>,
              },
              {
                key: "Не меньше / не больше",
                note: <>min или сумма по j из диапазона</>,
              },
              {
                key: "Верхняя граница",
                note: <>рёбер в пути не больше, чем строк в файле</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Почему для пути ровно из k рёбер не хватает одного числа f(v) на
          вершину?
        </>
      ),
      reveal: (
        <>
          Лучший остаток зависит от того, сколько рёбер ещё пройти: из 1 лучший
          путь в одно ребро стоит 12, в два — 7.5.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Найди кратчайший путь из 1 в 100 ровно из трёх рёбер.</>,
      reveal: (
        <>
          Такого нет, f(1, 3) = ∞: все пути из 1 в 100 — из одного или двух
          рёбер.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Что вернёт <Notation>{"f(100, 1)"}</Notation>? Почему не 0?
        </>
      ),
      reveal: (
        <>
          ∞: из 100 нужно пройти ещё одно ребро, а оно ведёт в тупик 12. Ноль —
          только когда рёбер не осталось и мы в цели.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>Сколько путей из 1 в 100 состоят не больше чем из двух рёбер?</>
      ),
      reveal: <>Три: одно ребро — 1 путь, два ребра — 2 пути.</>,
    },
  ],
};

export default content;
