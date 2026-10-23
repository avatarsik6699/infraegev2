// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./graph-analysis.paid.drugie-voprosy.media";
import { READ_GRAPH } from "./graph-analysis.paid.code";

const COUNT =
  "@cache\ndef count(v):\n    if v == 100:\n        return 1\n    total = 0\n    for u, w in graph.get(v, []):\n        total += count(u)\n    return total";
const LONGEST =
  '@cache\ndef longest(v):\n    if v == 100:\n        return 0\n    best = float("-inf")\n    for u, w in graph.get(v, []):\n        best = max(best, w + longest(u))\n    return best';
const TO_DEAD_END =
  '@cache\ndef to_dead_end(v):\n    if v not in graph:\n        return 0\n    best = float("-inf")\n    for u, w in graph[v]:\n        best = max(best, w + to_dead_end(u))\n    return best';
const FEWEST =
  '@cache\ndef fewest(v):\n    if v == 100:\n        return 0\n    best = float("inf")\n    for u, w in graph.get(v, []):\n        best = min(best, 1 + fewest(u))\n    return best';

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "odna-shema",
      navLabel: "Одна схема",
      explanation: (
        <>
          <Typography.Text>
            В подборках спрашивают не только кратчайший путь: сколько всего
            путей, какой путь самый длинный, сколько в пути рёбер. Нужна ли для
            каждого вопроса своя идея?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет, функция та же. Меняются три места: что вернуть в цели, что
              вернуть в тупике и как собрать ответы соседей.
            </strong>{" "}
            Остальное — словарь из файла, перебор стрелок,{" "}
            <Notation>{"@cache"}</Notation> — не трогаем.
          </Typography.Text>
          <LessonTable
            label={"Что меняется в функции под вопрос"}
            columns={[
              { label: "Вопрос" },
              { label: "В цели" },
              { label: "В тупике" },
              { label: "Как собрать" },
            ]}
            rows={[
              ["кратчайший путь", "0", "∞", "min(w + f(u))"],
              ["самый длинный путь", "0", "−∞", "max(w + f(u))"],
              ["число путей", "1", "0", "сумма f(u)"],
              ["наименьшее число рёбер", "0", "∞", "min(1 + f(u))"],
              ["наибольшее число рёбер", "0", "−∞", "max(1 + f(u))"],
            ]}
          />
          <Typography.Text>
            Значение в тупике — всегда «худшее, что может быть» для этого
            вопроса: оно не должно выиграть сравнение. Для минимума это ∞, для
            максимума −∞, для суммы — 0: путь в тупик в число путей до цели не
            входит. Разберём каждый вопрос на учебном графе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-putej",
      navLabel: "Число путей",
      explanation: (
        <>
          <Typography.Text>Сколько путей ведёт из 1 в 100?</Typography.Text>
          <Typography.Text>
            <strong>
              Каждый путь из v начинается какой-то стрелкой, поэтому число путей
              из v — сумма чисел путей из концов её стрелок. В цели путь один —
              пустой, «уже пришли».
            </strong>{" "}
            Ноль в цели всё бы обнулил: любая сумма нулей — ноль.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n" +
              READ_GRAPH +
              "\n\n\n" +
              COUNT +
              "\n\n\nprint(count(1), count(6))"
            }
            collapsible={false}
            label={"Число путей до 100"}
            language="python"
            output={"3 4"}
          />
          <Typography.Text>
            Из 7 и из 4 к цели ведёт по одному пути, из 1 — 1 + 1 + 1 = 3: через
            7, через 4 и напрямую. Из 6 — путь через 7 и три пути через 1, всего
            4.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.countValues}
            caption={
              <>
                Под вершинами — число путей до 100. У каждой вершины оно равно
                сумме чисел у концов её стрелок; у тупика 12 — ноль.
              </>
            }
          />
          <Typography.Text>
            Путей бывают миллиарды, но Python считает целые числа без
            переполнения, а <Notation>{"@cache"}</Notation> не даёт перебирать
            их по одному. Число путей через ребро a → b — произведение: число
            путей до a, умноженное на число путей от b. Каждый путь до a можно
            склеить с каждым путём от b.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlinnyj-put",
      navLabel: "Самый длинный путь",
      explanation: (
        <>
          <Typography.Text>
            Какой путь из 1 в 100 самый длинный?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тот же расчёт с max вместо min. А в тупике теперь −∞ — иначе путь,
              упёршийся в тупик, мог бы победить.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={LONGEST + "\n\n\nprint(longest(1), longest(6))"}
            label={"Самый длинный путь до 100"}
            language="python"
            output={"12.0 13.0"}
          />
          <Typography.Text>
            Из 1 самый длинный путь — прямая стрелка 1 → 100 за 12.0, из 6 — 6 →
            1 → 100 за 13.0. Если бы из 1 вела стрелка в тупик весом 20, то с
            нулём в тупике ответ стал бы 20 — длина пути, который до 100 не
            доходит. С −∞ такая стрелка никогда не выигрывает максимум.
          </Typography.Text>
          <Typography.Text>
            Бывает и другой вопрос: самый длинный путь из вершины до любого
            тупика. Тогда цели нет, и ноль возвращают как раз в тупике — там,
            где путь закончился:
          </Typography.Text>
          <CodeBlock
            code={TO_DEAD_END + "\n\n\nprint(to_dead_end(6))"}
            label={"Самый длинный путь до любого тупика"}
            language="python"
            output={"14.0"}
          />
          <Typography.Text>
            Из 6 это 6 → 1 → 100 → 12: 1.0 + 12.0 + 1.0 = 14. Тупиков в этом
            графе один — вершина 12.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-reber",
      navLabel: "Число рёбер",
      explanation: (
        <>
          <Typography.Text>
            Из какого наименьшего числа рёбер может состоять путь из 1 в 100?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Это тот же кратчайший путь, только каждое ребро весит 1: вместо w
              прибавляем 1.
            </strong>{" "}
            Веса из файла читаем, как обычно, но не используем.
          </Typography.Text>
          <CodeBlock
            code={FEWEST + "\n\n\nprint(fewest(1), fewest(6))"}
            label={"Наименьшее число рёбер до 100"}
            language="python"
            output={"1 2"}
          />
          <Typography.Text>
            Из 1 хватает одного ребра — 1 → 100, из 6 нужно два: 6 → 7 → 100.
            Наибольшее число рёбер — тот же код с max и −∞ в тупике: из 1 это 2,
            из 6 — 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "drugie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Что меняется",
                note: <>значение в цели, в тупике и как собрать ответы</>,
              },
              { key: "Число путей", note: <>в цели 1, в тупике 0, сумма</> },
              {
                key: "Через ребро a → b",
                note: <>путей до a × путей от b</>,
              },
              {
                key: "Самый длинный путь",
                note: <>max, в тупике −∞</>,
              },
              {
                key: "До любого тупика",
                note: <>цели нет, 0 в тупике, max</>,
              },
              {
                key: "Число рёбер",
                note: <>вместо веса прибавляем 1</>,
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
      prompt: <>Сколько путей ведёт из 1 в 12 в учебном графе?</>,
      reveal: (
        <>Три: в 12 можно попасть только из 100, а из 1 в 100 ведут три пути.</>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Почему в функции подсчёта путей в цели возвращают 1, а не 0?</>,
      reveal: (
        <>
          Дойдя до цели, мы нашли один путь. С нулём в цели все суммы были бы
          нулями.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: <>Сколько путей из 6 в 100 проходит по ребру 6 → 1?</>,
      reveal: (
        <>Три: до 6 путь один — пустой, от 1 до 100 — три пути, 1 × 3 = 3.</>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>Почему для самого длинного пути в тупике возвращают −∞, а не 0?</>
      ),
      reveal: (
        <>
          С нулём путь, упёршийся в тупик, участвовал бы в максимуме и мог бы
          победить, хотя до цели он не доходит.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: <>Из какого наибольшего числа рёбер состоит путь из 6 в 100?</>,
      reveal: <>Из трёх: 6 → 1 → 7 → 100 или 6 → 1 → 4 → 100.</>,
    },
  ],
};

export default content;
