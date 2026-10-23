// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./graph-analysis.paid.programma.media";
import { F_CODE, READ_GRAPH } from "./graph-analysis.paid.code";
import { THEME_TASK } from "./graph-analysis.theme";
import { PythonTerm } from "./python-term";

const PROGRAM =
  "from functools import cache\n\n" + READ_GRAPH + "\n\n\n" + F_CODE;

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "chtenie-fajla",
      navLabel: "Граф из файла",
      explanation: (
        <>
          <Typography.Text>
            Как превратить строки файла в граф, по которому можно ходить?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разложить рёбра по начальным вершинам в{" "}
              <PythonTerm term="dict">словарь</PythonTerm>: ключ — вершина,
              значение — список пар (куда, вес).
            </strong>{" "}
            Тогда все стрелки из вершины v — это{" "}
            <Notation>{"graph[v]"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Каждую строку разбиваем{" "}
            <PythonTerm term="split">
              <Notation>{"line.split()"}</Notation>
            </PythonTerm>
            : без аргумента он делит по любым пробелам и табуляциям, сколько бы
            их ни было. Получаются три куска текста. Номера вершин превращаем в{" "}
            <Notation>{"int"}</Notation>, вес — в <Notation>{"float"}</Notation>
            : он дробный. Заголовка в файле нет — первая строка тоже ребро.
          </Typography.Text>
          <CodeBlock
            code={READ_GRAPH + "\n\nprint(graph[1])\nprint(graph.get(12, []))"}
            collapsible={false}
            label={"Граф из файла — {{dict|словарь}} списков"}
            language="python"
            output={"[(7, 5.5), (100, 12.0), (4, 2.5)]\n[]"}
          />
          <Typography.Text>
            Посмотри, как словарь растёт строка за строкой учебного файла:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.adjacencyStepper}
            label={"Строки файла по одной попадают в словарь"}
          />
          <Typography.Text>
            Из 12 стрелок нет, поэтому и ключа 12 в словаре нет.{" "}
            <Notation>{"graph[12]"}</Notation> остановил бы программу ошибкой
            KeyError, а{" "}
            <PythonTerm term="dictget">
              <Notation>{"graph.get(12, [])"}</Notation>
            </PythonTerm>{" "}
            возвращает пустой список — для тупика это и нужно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "funkciya-f",
      navLabel: "Функция f",
      explanation: (
        <>
          <Typography.Text>
            Как записать правило для f на Python?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Почти дословно: в цели вернуть 0, иначе перебрать стрелки из v и
              взять наименьшее «вес + f(конца)».
            </strong>{" "}
            Функция вызывает сама себя для соседей — это{" "}
            <PythonTerm term="rec">рекурсия</PythonTerm>. Словарь{" "}
            <Notation>{"graph"}</Notation> уже прочитан из файла, как в разделе
            выше; <Notation>{"cache"}</Notation> подключаем первой строкой
            программы.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n" +
              F_CODE +
              "\n\n\nprint(f(1), f(6), f(12))"
            }
            collapsible={false}
            label={"Длина лучшего пути до 100 — {{rec|рекурсивная}} функция"}
            language="python"
            output={"7.5 8.5 inf"}
          />
          <Typography.Text>Разберём функцию по строкам:</Typography.Text>
          <ul>
            <li>
              <Notation>{"if v == 100: return 0"}</Notation> — мы в цели, идти
              больше некуда.
            </li>
            <li>
              <Notation>{'best = float("inf")'}</Notation> — пока ни одного пути
              до цели не найдено: бесконечность.
            </li>
            <li>
              <Notation>{"for u, w in graph.get(v, [])"}</Notation> — каждая
              стрелка v → u весом w. У тупика список пуст, цикл не выполнится, и
              функция вернёт бесконечность — как в подтеме 2.
            </li>
            <li>
              <Notation>{"best = min(best, w + f(u))"}</Notation> — шаг по
              стрелке плюс лучший остаток пути от u.
            </li>
          </ul>
          <Typography.Text>
            Руками мы считали от цели назад, а функция начинает с другого конца:
            f(1) просит f(7), та — f(100). Ответы возвращаются по цепочке
            обратно. Посмотри по шагам; внизу — стек вызовов: функции, которые
            начали работу и ждут ответа.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.fStepper}
            label={"Вызовы f(1) по шагам"}
          />
          <Typography.Text>
            Порядок строк в файле функции неважен: она сама идёт по стрелкам. И
            не зациклится — каждый вложенный вызов это шаг по стрелке, а в графе
            без циклов бесконечно шагать нельзя.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zachem-cache",
      navLabel: "Зачем @cache",
      explanation: (
        <>
          <Typography.Text>
            Что будет, если убрать строку <Notation>{"@cache"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Ответ тот же, но одни и те же вершины будут считаться снова и
              снова.{" "}
              <PythonTerm term="cache">
                <Notation>{"@cache"}</Notation>
              </PythonTerm>{" "}
              запоминает ответ для каждой вершины, и второй раз он берётся из
              памяти.
            </strong>{" "}
            В учебном графе f(7) нужна дважды: из 6 и из 1. Без запоминания
            второй раз она пройдёт свой путь заново:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.callTree}
            caption={
              <>
                Вызовы f(6). Без @cache f(7) считается дважды, f(100) — четыре
                раза. С @cache повторный вызов сразу берёт ответ из памяти.
              </>
            }
          />
          <Typography.Text>
            На восьми рёбрах разница мала. Но в файле задачи темы без{" "}
            <Notation>{"@cache"}</Notation> функция была бы вызвана почти
            триллион раз: она прошла бы по каждому из 150 миллиардов путей.
            Программа не закончит и за сутки. С <Notation>{"@cache"}</Notation>{" "}
            каждая из 59 вершин, до которых можно дойти из 1, считается один
            раз.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"cache"}</Notation> берут из модуля{" "}
            <Notation>{"functools"}</Notation>: первая строка программы —{" "}
            <Notation>{"from functools import cache"}</Notation>, а{" "}
            <Notation>{"@cache"}</Notation> ставят прямо над{" "}
            <Notation>{"def"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: большой файл и глубина рекурсии"
          >
            <Typography.Text>
              В файле экзамена не больше 200 строк, и рекурсия уходит не глубже
              200 вызовов. Но в тренировочных задачах встречаются файлы на 100
              000 рёбер с длинными цепочками. Тогда Python останавливает
              программу ошибкой RecursionError: по умолчанию он разрешает около
              тысячи вложенных вызовов. Помогает строка в начале программы:{" "}
              <PythonTerm term="reclimit">
                <Notation>{"sys.setrecursionlimit(10000)"}</Notation>
              </PythonTerm>{" "}
              после <Notation>{"import sys"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы",
      explanation: (
        <>
          <Typography.Text>Решим задачу темы целиком:</Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Программа та же, меняется только имя файла и последняя строка:
              ответ — целая часть f(1).
            </strong>{" "}
            Файл 23-5.txt приложен к задаче темы в практике этой подтемы —
            сохрани его рядом с программой.
          </Typography.Text>
          <CodeBlock
            code={
              PROGRAM.replace("23.txt", "23-5.txt") +
              "\n\n\nprint(f(1))\nprint(int(f(1)))"
            }
            collapsible={false}
            label={"Программа целиком"}
            language="python"
            output={"10211.630000000003\n10211"}
          />
          <Typography.Text>
            Ответ — <strong>10211</strong>. Посмотри на первую строку вывода:
            10211.630000000003 вместо 10211.63. Дроби в{" "}
            <PythonTerm term="floaterr">
              <Notation>{"float"}</Notation>
            </PythonTerm>{" "}
            хранятся приближённо, и при сложении копятся крошечные ошибки. На
            целую часть они не влияют, пока сумма не стоит вплотную к целому
            числу.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: целая часть, round и почти целые суммы"
          >
            <Typography.Text>
              <Notation>{"int"}</Notation> отбрасывает дробную часть:{" "}
              <Notation>{"int(10211.63)"}</Notation> — 10211.{" "}
              <PythonTerm term="round">
                <Notation>{"round"}</Notation>
              </PythonTerm>{" "}
              округляет и дал бы 10212 — неверный ответ.
            </Typography.Text>
            <Typography.Text>
              Отбрасывать дробь можно только у итоговой суммы. Если отбросить её
              у каждого веса при чтении, ответ уплывёт: 2.8 + 3.6 = 6.4, а 2 + 3
              = 5.
            </Typography.Text>
            <Typography.Text>
              Если вывод вышел вроде 4519.999999999998, настоящая сумма — 4520:
              это ошибка float, и ответ 4520. Поэтому сначала выведи само число,
              а потом его целую часть.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "programma-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Граф",
                note: <>словарь: вершина → список пар (куда, вес)</>,
              },
              {
                key: "Строка файла",
                note: (
                  <>
                    <Notation>{"line.split()"}</Notation>; номера — int, вес —
                    float
                  </>
                ),
              },
              {
                key: "Тупик",
                note: (
                  <>
                    <Notation>{"graph.get(v, [])"}</Notation> — пустой список, f
                    = ∞
                  </>
                ),
              },
              {
                key: "f(v)",
                note: <>в цели 0, иначе min(w + f(u)) по стрелкам из v</>,
              },
              {
                key: "@cache",
                note: <>каждая вершина считается один раз</>,
              },
              {
                key: "Ответ",
                note: (
                  <>
                    <Notation>{"int(f(1))"}</Notation> — в самом конце, не round
                  </>
                ),
              },
              { key: "Задача темы", note: <>10211</> },
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
          Что выведут <Notation>{"print(graph[100])"}</Notation> и{" "}
          <Notation>{"print(graph.get(4, []))"}</Notation> для учебного файла?
        </>
      ),
      reveal: (
        <>
          <Notation>{"[(12, 1.0)]"}</Notation> и{" "}
          <Notation>{"[(100, 8.0)]"}</Notation>: из 100 одна стрелка — в 12, из
          4 — в 100.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Ключа 12 в словаре нет. Почему <Notation>{"f(12)"}</Notation> не
          падает с ошибкой и что возвращает?
        </>
      ),
      reveal: (
        <>
          <Notation>{"graph.get(12, [])"}</Notation> даёт пустой список, цикл не
          выполняется, и функция возвращает начальное{" "}
          <Notation>{'float("inf")'}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Что случится, если убрать из функции проверку{" "}
          <Notation>{"if v == 100"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Цель станет обычной вершиной: из 100 стрелка ведёт в тупик 12, и
          f(100) = ∞. Тогда бесконечными станут все значения, а{" "}
          <Notation>{"int(f(1))"}</Notation> остановит программу ошибкой.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Длина кратчайшего пути — 12.6. Что выведут{" "}
          <Notation>{"int(12.6)"}</Notation> и{" "}
          <Notation>{"round(12.6)"}</Notation>? Что пойдёт в ответ?
        </>
      ),
      reveal: <>12 и 13. В ответ — 12: нужна целая часть.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          В графе есть стрелки 5 → 8 и 8 → 5. Поможет ли{" "}
          <Notation>{"@cache"}</Notation>, если вызвать{" "}
          <Notation>{"f(5)"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Нет. f(5) вызовет f(8), а та — снова f(5), ответ для которой ещё не
          готов: запоминать нечего. Вызовы не кончатся, и Python остановит
          программу ошибкой RecursionError.
        </>
      ),
    },
  ],
};

export default content;
