// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./graph-analysis.paid.rekursiya-s-zapominaniem.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "rekursiya-ideya",
      navLabel: "Главная идея",
      explanation: (
        <>
          <Typography.Text>
            Главная идея подтемы:{" "}
            <strong>
              функция <Notation>{"best(v)"}</Notation> считает f(v) по правилу
              из подтемы 2, а <Notation>{"@cache"}</Notation> запоминает каждый
              ответ, поэтому каждая вершина вычисляется один раз
            </strong>
            . Это полное решение задачи демоверсии: прочитать файл, построить
            список смежности, вызвать <Notation>{"best(1)"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Сквозной пример подтемы — файл <Notation>{"23.txt"}</Notation> с
            учебным графом. Чтение файла и список смежности{" "}
            <Notation>{"graph"}</Notation> — из подтемы 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "funkciya-best",
      navLabel: "Функция best",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Правило из подтемы 2 записывается функцией почти дословно.
            </strong>{" "}
            f(цель) = 0; иначе f(v) — минимум «вес ребра + f(следующей вершины)»
            по всем рёбрам из v; если рёбер нет или ни одно не ведёт к цели,
            остаётся +∞.
          </Typography.Text>
          <CodeBlock
            code={
              "def best(v):\n    # Мы уже в цели.\n    if v == TARGET:\n        return Decimal(0)\n\n    # Пока подходящий путь до цели не найден.\n    answer = INF\n\n    for next_vertex, weight in graph.get(v, []):\n        candidate = weight + best(next_vertex)\n\n        if candidate < answer:\n            answer = candidate\n\n    return answer"
            }
            label={"Код на Python: def best(v):"}
            language="python"
          />
          <Typography.Text>
            Функция{" "}
            <PythonTerm term="def">
              <Notation>{"best"}</Notation>
            </PythonTerm>{" "}
            вызывает саму себя для следующей вершины — это{" "}
            <PythonTerm term="rec">рекурсия</PythonTerm>. Базовый случай — цель:
            там ответ известен сразу.
          </Typography.Text>
          <Typography.Text>
            Посмотри, как автоматически обрабатывается тупик. В начале{" "}
            <Notation>{"answer = INF"}</Notation>. Исходящих рёбер нет, поэтому
            цикл не выполняется, и функция возвращает{" "}
            <Notation>{"INF"}</Notation>. Если исходящие рёбра есть, но все они
            ведут в вершины, из которых цель недостижима, результат тоже
            останется бесконечным: w + ∞ = ∞.
          </Typography.Text>
          <Typography.Text>
            При этом целевая вершина обрабатывается раньше цикла. Даже если из
            неё есть исходящие рёбра, идти по ним уже не требуется: цель
            достигнута.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cache",
      navLabel: "Запоминание @cache",
      explanation: (
        <>
          <Typography.Text>
            <strong>Рекурсивные ответы нужно запоминать.</strong> Представь, что
            из нескольких вершин можно попасть в одну и ту же вершину{" "}
            <Notation>{"7"}</Notation>. Для каждой из них понадобится значение
            f(7). Но оно одинаково: граф и цель не меняются. Если каждый раз
            заново вычислять f(7), одни и те же участки графа будут
            обрабатываться повторно.
          </Typography.Text>
          <Typography.Text>
            Лучше при первом вызове вычислить ответ, сохранить его, а при
            следующем таком же вызове сразу вернуть сохранённое значение. Это
            называется <strong>запоминанием результатов</strong>, или{" "}
            <strong>мемоизацией</strong>.
          </Typography.Text>
          <Typography.Text>
            В Python для этого есть <Notation>{"cache"}</Notation> из модуля{" "}
            <Notation>{"functools"}</Notation>:{" "}
            <PythonTerm term="import">
              <Notation>{"from functools import cache"}</Notation>
            </PythonTerm>
            . Строка <Notation>{"@cache"}</Notation> перед определением функции
            подключает автоматическое запоминание её результатов по аргументам.
            Такая запись с <Notation>{"@"}</Notation> называется декоратором;
            здесь достаточно понимать её конкретное действие: повторный вызов с
            той же вершиной использует сохранённый ответ.
          </Typography.Text>
          <Typography.Text>
            Сравните вызовы на учебном графе. Слева каждый вызов{" "}
            <Notation>{"best"}</Notation> заново обходит всё, что ниже него.
            Справа повторный вызов сразу получает сохранённый ответ:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.callTree_6c3a58}
            caption={
              <>
                Дерево вызовов best(1). Без запоминания best(7) считается
                дважды, best(100) — четыре раза. С @cache каждая вершина
                вычисляется один раз, остальные вызовы берут ответ из памяти.
              </>
            }
          />
          <Typography.Text>
            На четырёх вершинах разница невелика. Но на больших графах без
            запоминания она огромна. Если вершины 1, 2, …, 30 соединены рёбрами
            i → i + 1 и i → i + 2, а цель — 30, то <Notation>{"best"}</Notation>{" "}
            без <Notation>{"@cache"}</Notation> будет вызвана 2 178 308 раз, а с{" "}
            <Notation>{"@cache"}</Notation> — 30 раз, по разу на вершину.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rekursiya-po-shagam",
      navLabel: "Рекурсия по шагам",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Посмотрим, как работает рекурсия с запоминанием на учебном графе.
            </strong>{" "}
            Стек вызовов — цепочка функций, которые начали работу и ждут ответа
            от следующей. Значения f появляются под вершинами, как только они
            вычислены и сохранены:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.bestStepper_6c3a58}
            label={
              "Рекурсия с запоминанием по шагам: стек вызовов и сохранённые ответы"
            }
          />
          <Typography.Text>
            <Notation>{"best(1)"}</Notation> сначала уходит вглубь до цели по
            рёбрам 1 → 40 → 7 → 100 и только на обратном пути получает числа.
            Когда <Notation>{"best(40)"}</Notation> и{" "}
            <Notation>{"best(1)"}</Notation> второй раз доходят до вершин 7 и
            100, их ответы уже сохранены и берутся из памяти, без нового обхода.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "programma",
      navLabel: "Программа целиком",
      explanation: (
        <>
          <Typography.Text>
            <strong>Соберём основное решение целиком.</strong> Сохрани входные
            данные под именем <Notation>{"23.txt"}</Notation> в рабочей папке
            программы или подставь своё имя файла в{" "}
            <Notation>{"open"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'from decimal import Decimal\nfrom functools import cache\n\nSOURCE = 1\nTARGET = 100\nINF = Decimal("Infinity")\n\n# Читаем рёбра из файла.\nedges = []\n\nwith open("23.txt") as f:\n    for line in f:\n        if not line.strip():\n            continue\n\n        parts = line.split()\n        u = int(parts[0])\n        v = int(parts[1])\n        w = Decimal(parts[2])\n        edges.append((u, v, w))\n\n# Список смежности: вершина -> её исходящие переходы.\ngraph = {}\n\nfor u, v, w in edges:\n    if u not in graph:\n        graph[u] = []\n\n    graph[u].append((v, w))\n\n\n@cache\ndef best(v):\n    if v == TARGET:\n        return Decimal(0)\n\n    answer = INF\n\n    for next_vertex, weight in graph.get(v, []):\n        candidate = weight + best(next_vertex)\n\n        if candidate < answer:\n            answer = candidate\n\n    return answer\n\n\n# По условию путь до TARGET существует.\nprint(int(best(SOURCE)))'
            }
            label={"Код на Python: from decimal import Decimal"}
            language="python"
            output={"6"}
          />
          <Typography.Text>
            Строки файла <Notation>{"23.txt"}</Notation> идут не по порядку
            движения (<Notation>{"7 100 3.0"}</Notation> — первая), но рекурсии
            это не мешает: она сама идёт по рёбрам от вершины к вершине. Дробная
            часть отбрасывается только у полной суммы — в самой последней
            строке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zavershenie",
      navLabel: "Почему завершается",
      explanation: (
        <>
          <Typography.Text>
            <strong>Почему такая рекурсия завершается?</strong> Каждый вложенный
            вызов соответствует движению по стрелке. Если бы функция могла
            бесконечно переходить к новым вложенным вызовам в конечном графе,
            какая-то вершина повторилась бы. Это означало бы наличие
            направленного цикла. По условию циклов нет, поэтому цепочка вызовов
            обязательно закончится — либо на целевой вершине, либо на вершине
            без исходящих рёбер.
          </Typography.Text>
          <Typography.Text>
            Сам по себе <Notation>{"cache"}</Notation> не устраняет циклы. Если
            есть переходы A → B → A, результат для A ещё не вычислен к моменту
            повторного вызова A, поэтому брать из памяти пока нечего. Именно
            гарантия ацикличности делает этот рекурсивный способ подходящим.
          </Typography.Text>
          <Typography.Text>
            Глубина вложенных вызовов не больше числа рёбер на самом длинном
            пути. В файле задания не больше 200 рёбер, а Python по умолчанию
            допускает около 1000 вложенных вызовов, так что запас есть.
          </Typography.Text>
          <Typography.Text>
            Также сохранённые ответы относятся к конкретному графу и конкретной
            цели. Если менять их в уже работающей программе, старые результаты
            нельзя автоматически использовать для новой задачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dinamika",
      navLabel: "Динамическое программирование",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сохранение ответов на подзадачи и построение через них более
              сложных ответов относится к динамическому программированию.
            </strong>{" "}
            Подзадача здесь звучит так: найти лучшую стоимость от некоторой
            вершины до цели. Это название не означает какой-то особой команды
            Python. Речь о способе рассуждения:
          </Typography.Text>
          <ol>
            <li>Определить, какую информацию хранить.</li>
            <li>Задать простейшие начальные значения.</li>
            <li>Вывести правило получения новых значений.</li>
            <li>
              Организовать вычисления так, чтобы не выполнять одну и ту же
              работу бессмысленно много раз.
            </li>
          </ol>
          <Typography.Text>
            В рекурсивном решении с запоминанием каждая нужная вершина
            полноценно вычисляется один раз, а её исходящие рёбра
            просматриваются один раз. Поэтому объём работы после построения
            графа оценивается как O(V + E), где V — количество вершин, E —
            количество рёбер. Обозначение O(…) описывает, как объём работы
            растёт вместе с размером данных. Для файла из 200 строк ответ
            получается мгновенно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rekursiya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    <Notation>{"best(v)"}</Notation>: в цели —{" "}
                    <Notation>{"Decimal(0)"}</Notation>, иначе минимум{" "}
                    <Notation>{"weight + best(next_vertex)"}</Notation> по
                    рёбрам из <Notation>{"graph.get(v, [])"}</Notation>, начиная
                    с <Notation>{"INF"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"@cache"}</Notation> запоминает ответы: каждая
                    вершина вычисляется один раз, работа — O(V + E).
                  </>
                ),
              },
              {
                note: (
                  <>
                    Рекурсия завершается, потому что граф ациклический; на графе
                    с циклом этот способ не работает.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Целая часть берётся один раз, в конце:{" "}
                    <Notation>{"int(best(SOURCE))"}</Notation>.
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
      id: "best-81",
      prompt: (
        <>
          Что вернёт <Notation>{"best(81)"}</Notation> для графа с рёбрами 1 →
          100 (12) и 1 → 81 (2)? Что вернёт <Notation>{"best(1)"}</Notation>?
        </>
      ),
      reveal: (
        <>
          <Notation>{"best(81)"}</Notation> — <Notation>{"INF"}</Notation>:
          рёбер из 81 нет, цикл не выполняется. <Notation>{"best(1)"}</Notation>{" "}
          — 12.
        </>
      ),
    },
    {
      id: "cikl-v-rekursii",
      prompt: (
        <>
          В графе есть рёбра 5 → 8 и 8 → 5. Что произойдёт при вызове{" "}
          <Notation>{"best(5)"}</Notation>? Поможет ли{" "}
          <Notation>{"@cache"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Вызовы <Notation>{"best(5)"}</Notation> →{" "}
          <Notation>{"best(8)"}</Notation> → <Notation>{"best(5)"}</Notation> →
          … никогда не закончатся, Python остановит программу ошибкой о
          превышении глубины рекурсии. <Notation>{"@cache"}</Notation> не
          поможет: ответ для 5 ещё не вычислен к моменту повторного вызова.
        </>
      ),
    },
    {
      id: "bez-celi",
      prompt: (
        <>
          Что вернёт <Notation>{"best(100)"}</Notation> на учебном графе, если
          убрать из функции проверку <Notation>{"if v == TARGET"}</Notation>?
          Что тогда выведет программа?
        </>
      ),
      reveal: (
        <>
          <Notation>{"INF"}</Notation>: из 100 рёбер нет, и цель превратится в
          тупик. Тогда все значения станут бесконечными, а{" "}
          <Notation>{"int(best(SOURCE))"}</Notation> завершится ошибкой —
          бесконечность нельзя превратить в целое число.
        </>
      ),
    },
    {
      id: "round",
      prompt: (
        <>
          Что изменится в ответе, если в последней строке программы написать{" "}
          <Notation>{"print(round(best(SOURCE)))"}</Notation>, а длина
          кратчайшего пути равна 12.6?
        </>
      ),
      reveal: (
        <>
          <Notation>{"round(12.6)"}</Notation> даёт 13, а нужна целая часть —
          12.
        </>
      ),
    },
  ],
};

export default content;
