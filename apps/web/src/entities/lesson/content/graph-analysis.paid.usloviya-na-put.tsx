// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./graph-analysis.paid.usloviya-na-put.media";
import { READ_GRAPH } from "./graph-analysis.paid.code";
import { PythonTerm } from "./python-term";

const F_VT =
  '@cache\ndef f(v, t):\n    if v == t:\n        return 0\n    best = float("inf")\n    for u, w in graph.get(v, []):\n        best = min(best, w + f(u, t))\n    return best';
const G_BAN =
  'BAN = 7\n\n\n@cache\ndef g(v, t):\n    if v == BAN:\n        return float("inf")\n    if v == t:\n        return 0\n    best = float("inf")\n    for u, w in graph.get(v, []):\n        best = min(best, w + g(u, t))\n    return best';

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "cel-parametr",
      navLabel: "Цель — параметр",
      explanation: (
        <>
          <Typography.Text>
            В условии спрашивают путь не до 100, а до другой вершины — или через
            промежуточную. Как не переписывать функцию каждый раз?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сделать цель вторым параметром: f(v, t) — длина кратчайшего пути
              из v в t.
            </strong>{" "}
            В функции меняется одна строка — сравниваем v не с 100, а с t.{" "}
            <Notation>{"@cache"}</Notation> запоминает ответ для каждой пары (v,
            t), так что разные цели не смешиваются.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n" +
              READ_GRAPH +
              "\n\n\n" +
              F_VT +
              "\n\n\nprint(f(1, 100), f(1, 4), f(6, 12))"
            }
            collapsible={false}
            label={"Цель — второй параметр функции"}
            language="python"
            output={"7.5 2.5 9.5"}
          />
          <Typography.Text>
            Из 6 в 12 лучший путь — 6 → 1 → 7 → 100 → 12: 1.0 + 5.5 + 2.0 + 1.0
            = 9.5. Дальше в подтеме все условия собираем из таких кусков.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cherez-vershinu",
      navLabel: "Через вершину",
      explanation: (
        <>
          <Typography.Text>
            Путь из 1 в 100 должен пройти через вершину 4. Как найти самый
            короткий такой путь?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разрезать его в вершине 4 на два участка и сложить их минимумы:
              f(1, 4) + f(4, 100).
            </strong>{" "}
            Любой путь через 4 — это участок до 4 и участок после. Каждый не
            короче своего минимума, а два лучших участка всегда можно склеить в
            4.
          </Typography.Text>
          <CodeBlock
            code={"print(f(1, 4) + f(4, 100))"}
            label={"Обязательная вершина 4"}
            language="python"
            output={"10.5"}
          />
          <Typography.Text>
            Получилось 2.5 + 8.0 = 10.5 — дороже, чем 7.5 без условия: лучший
            путь через 4 не проходит.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.mustVertex}
            caption={
              <>
                Обязательная вершина 4 обведена. Кратчайший путь через неё — 1 →
                4 → 100, его длина 10.5.
              </>
            }
          />
          <Typography.Text>
            Если обязательных вершин две, участков три. В каком порядке их
            проходить, угадывать не нужно: посчитай оба порядка и возьми
            меньший. Например, путь из 6 в 100 через 1 и 7:
          </Typography.Text>
          <CodeBlock
            code={
              "a = f(6, 1) + f(1, 7) + f(7, 100)\nb = f(6, 7) + f(7, 1) + f(1, 100)\nprint(a, b, min(a, b))"
            }
            label={"Две обязательные вершины — два порядка"}
            language="python"
            output={"8.5 inf 8.5"}
          />
          <Typography.Text>
            Из 7 в 1 пути нет, поэтому второй порядок дал бесконечность. В графе
            без циклов иначе и не бывает: если бы из 1 можно было попасть в 7, а
            из 7 — в 1, получился бы цикл. Подходит не больше одного порядка.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "v-obhod",
      navLabel: "В обход вершины",
      explanation: (
        <>
          <Typography.Text>
            А если через вершину 7 проходить нельзя?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сделать её тупиком: в запрещённой вершине функция сразу возвращает
              бесконечность.
            </strong>{" "}
            Тогда ни одна стрелка в 7 не выиграет минимум — так же, как стрелка
            в настоящий тупик в подтеме 2.
          </Typography.Text>
          <CodeBlock
            code={G_BAN + "\n\n\nprint(g(1, 100), g(6, 100))"}
            label={"Запрещённая вершина — тупик"}
            language="python"
            output={"10.5 11.5"}
          />
          <Typography.Text>
            Проверка запрета стоит первой: даже если запрещена сама цель, войти
            в неё нельзя. Для запрета пишут отдельную функцию со своим{" "}
            <Notation>{"@cache"}</Notation>: ответы f без запрета к ней не
            подходят.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.bannedVertex}
            caption={
              <>
                Вершина 7 запрещена, её стрелки не работают. Лучший оставшийся
                путь из 1 — 1 → 4 → 100 за 10.5.
              </>
            }
          />
          <Typography.Text>
            С запретом пути может и не остаться — тогда функция вернёт{" "}
            <Notation>{"inf"}</Notation>, а <Notation>{"int(inf)"}</Notation>{" "}
            остановит программу ошибкой. В задачах экзамена пишут «существование
            пути гарантируется»; если такой фразы нет, сначала выведи само
            значение.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cherez-rebro",
      navLabel: "Через ребро",
      explanation: (
        <>
          <Typography.Text>
            Путь из 6 в 100 должен пройти по ребру 6 → 7. Как это учесть?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Путь через ребро a → b — это участок до a, само ребро и участок от
              b: f(s, a) + вес ребра + f(b, t).
            </strong>{" "}
            Вес ребра берут из списка вершины a.{" "}
            <Notation>{"dict(graph[6])"}</Notation> превращает список пар в
            словарь «куда → вес»:
          </Typography.Text>
          <CodeBlock
            code={
              "print(dict(graph[6]))\nprint(f(6, 6) + dict(graph[6])[7] + f(7, 100))"
            }
            label={"Обязательное ребро 6 → 7"}
            language="python"
            output={"{7: 7.0, 1: 1.0}\n9.0"}
          />
          <Typography.Text>
            Участок до 6 пустой — путь и так начинается в 6, поэтому f(6, 6) =
            0. Вышло 7.0 + 2.0 = 9, хотя без условия путь из 6 стоит 8.5.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.mustEdge}
            caption={
              <>
                Обязательное ребро 6 → 7. Кратчайший путь по нему — 6 → 7 → 100
                за 9.0; путь 6 → 1 → 7 → 100 короче, но идёт мимо этого ребра.
              </>
            }
          />
          <Typography.Text>
            Так же решают задачу, где заданы первое и последнее ребро пути. Из 6
            в 12, первое ребро 6 → 7, последнее 100 → 12: вес первого, плюс f(7,
            100), плюс вес последнего — 7.0 + 2.0 + 1.0 = 10.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "usloviya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Цель — параметр", note: <>f(v, t) — путь из v в t</> },
              { key: "Через вершину k", note: <>f(s, k) + f(k, t)</> },
              {
                key: "Через две вершины",
                note: <>оба порядка, взять меньший</>,
              },
              {
                key: "В обход вершины",
                note: <>отдельная функция: в запрещённой вершине ∞</>,
              },
              {
                key: "Через ребро a → b",
                note: <>f(s, a) + вес + f(b, t)</>,
              },
              {
                key: "Вес ребра",
                note: <Notation>{"dict(graph[a])[b]"}</Notation>,
              },
              {
                key: "Пути нет",
                note: (
                  <>
                    функция вернёт inf, <PythonTerm term="num">int</PythonTerm>{" "}
                    от неё — ошибка
                  </>
                ),
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
          Найди длину кратчайшего пути из 1 в 100 через вершину 7 в учебном
          графе.
        </>
      ),
      reveal: (
        <>
          f(1, 7) + f(7, 100) = 5.5 + 2.0 = 7.5 — как и без условия: кратчайший
          путь и так идёт через 7.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>А через вершину 6?</>,
      reveal: <>Такого пути нет: в 6 не входит ни одна стрелка, f(1, 6) = ∞.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Найди кратчайший путь из 6 в 100 в обход вершины 7. Почему он не 8.5?
        </>
      ),
      reveal: (
        <>
          6 → 1 → 4 → 100 за 11.5. Путь за 8.5 — это 6 → 1 → 7 → 100, а он
          проходит через запрещённую 7.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Обязательные вершины A и B. Почему в графе без циклов путь может
          пройти их только в одном порядке?
        </>
      ),
      reveal: (
        <>
          Если бы из A можно было попасть в B, а из B — в A, получился бы цикл A
          → … → B → … → A.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>Найди кратчайший путь из 6 в 12, проходящий по ребру 1 → 100.</>
      ),
      reveal: (
        <>
          f(6, 1) + 12.0 + f(100, 12) = 1.0 + 12.0 + 1.0 = 14: путь 6 → 1 → 100
          → 12.
        </>
      ),
    },
  ],
};

export default content;
