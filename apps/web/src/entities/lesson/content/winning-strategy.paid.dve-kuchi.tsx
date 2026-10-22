// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./winning-strategy.paid.dve-kuchi.media";
import { THEME_QUESTIONS, THEME_TASK } from "./winning-strategy.theme";
import { PythonTerm } from "./python-term";

const RULES =
  "def moves(p):\n    a, b = p\n    return [(a + 3, b), (a * 2, b),\n            (a, b + 3), (a, b * 2)]\n\n\ndef finished(p):\n    a, b = p\n    return a + b >= 100";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "para-chisel",
      navLabel: "Пара чисел",
      explanation: (
        <>
          <Typography.Text>
            Чем позиция с двумя кучами отличается от позиции с одной?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Позиция — пара чисел (a, b): камни в первой и во второй куче. Ход
              меняет одну кучу, и какую — выбирает тот, кто ходит.
            </strong>{" "}
            В задаче темы можно добавить три камня или удвоить кучу. Из (7, 10)
            получается четыре позиции:
          </Typography.Text>
          <ul>
            <li>(10, 10) — три камня в первую кучу;</li>
            <li>(14, 10) — удвоить первую;</li>
            <li>(7, 13) — три камня во вторую;</li>
            <li>(7, 20) — удвоить вторую.</li>
          </ul>
          <Typography.Text>
            Если условие не говорит иного, за ход нельзя менять обе кучи сразу.
            И «своих» куч у игроков нет: и Петя, и Ваня на каждом ходе выбирают
            из всех четырёх ходов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kuchi-v-kode",
      navLabel: "Две кучи в коде",
      explanation: (
        <>
          <Typography.Text>Что поменять в программе?</Typography.Text>
          <Typography.Text>
            <strong>
              Только <Notation>{"moves"}</Notation> и{" "}
              <Notation>{"finished"}</Notation>: позиция становится парой, а
              функция <Notation>{"g"}</Notation> остаётся прежней.
            </strong>{" "}
            Правила задачи темы:
          </Typography.Text>
          <CodeBlock
            code={RULES + "\n\n\nprint(moves((7, 10)), finished((7, 93)))"}
            label={"Правила задачи темы"}
            language="python"
            output={"[(10, 10), (14, 10), (7, 13), (7, 20)] True"}
          />
          <Typography.Text>
            Пару в Python записывают{" "}
            <PythonTerm term="tuple">кортежем</PythonTerm>:{" "}
            <Notation>{"(7, 10)"}</Notation>. Строка{" "}
            <Notation>{"a, b = p"}</Notation> раскладывает его на две кучи.{" "}
            <Notation>{"g"}</Notation> работает с позицией только через{" "}
            <Notation>{"moves"}</Notation> и <Notation>{"finished"}</Notation>,
            поэтому ей всё равно, число в позиции или пара.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: кортеж, а не список"
          >
            <Typography.Text>
              <Notation>{"@cache"}</Notation> запоминает ответы по аргументу, а
              список <Notation>{"[7, 10]"}</Notation> запомнить не может: Python
              остановится с ошибкой{" "}
              <Notation>{"TypeError: unhashable type: 'list'"}</Notation>.
              Поэтому позиции — кортежи в круглых скобках.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "setka-pozicij",
      navLabel: "Сетка позиций",
      explanation: (
        <>
          <Typography.Text>
            Как выглядят группы позиций двух куч?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Позиции двух куч — клетки таблицы: строка — первая куча, столбец —
              вторая.
            </strong>{" "}
            Возьмём игру поменьше: +1 или ×2 в одну кучу, победа при сумме не
            менее 20, начало (3, S):
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gameGrid3_7_12_20}
            caption={
              <>
                Группы позиций (a, b) при a ≤ 7 и b ≤ 12. В строке a = 3 —
                начальные позиции (3, S): П2 при S = 3, В2 при 4, 6, 7, П1 при
                8.
              </>
            }
          />
          <Typography.Text>
            Проверим (3, 8). Ходы дают (4, 8), (6, 8), (3, 9) и (3, 16) — из
            каждой соперник выигрывает сразу: удваивает вторую кучу или
            добавляет камень к 16. Все ходы ведут в В1, значит, (3, 8) — П1.
          </Typography.Text>
          <Typography.Text>
            Сумма камней позицию не описывает. У (6, 6) и (2, 10) сумма 12, но
            из (2, 10) удвоение даёт (2, 20) — победа, а из (6, 6) лучший ход
            даёт только 18. Удваивают одну кучу, поэтому важно, как камни
            разложены, — на сетке у этих клеток разные группы.
          </Typography.Text>
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
          <Typography.Text>{THEME_QUESTIONS[0]}</Typography.Text>
          <Typography.Text>{THEME_QUESTIONS[1]}</Typography.Text>
          <Typography.Text>{THEME_QUESTIONS[2]}</Typography.Text>
          <Typography.Text>
            <strong>
              Программа из подтемы 3 с новыми правилами и начальными позициями
              (7, S) отвечает на все три вопроса за один запуск.
            </strong>{" "}
            Ответ — вторая куча, <Notation>{"p[1]"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n" +
              RULES +
              "\n\n\n@cache\ndef g(s):\n    nxt = moves(s)\n    if any(finished(q) for q in nxt):\n        return 1  # В1\n    r = [g(q) for q in nxt]\n    if all(x == 1 for x in r):\n        return -1  # П1\n    if -1 in r:\n        return 2  # В2\n    if all(x > 0 for x in r):\n        return -2  # П2\n    return 0\n\n\ndef mistake(s):\n    # Петя ходит так, что Ваня выигрывает сразу\n    return any(not finished(q) and g(q) == 1\n               for q in moves(s))\n\n\nstarts = [(7, s) for s in range(1, 93)]\nprint(min(p[1] for p in starts if mistake(p)))\nprint([p[1] for p in starts if g(p) == 2][:2])\nprint(min(p[1] for p in starts if g(p) == -2))"
            }
            label={"Задача темы: вся программа"}
            language="python"
            output={"24\n[23, 42]\n39"}
          />
          <Typography.Text>
            Ответы: задание 19 — <strong>24</strong>, задание 20 —{" "}
            <strong>23 42</strong>, задание 21 — <strong>39</strong>. Их можно
            проверить и рассуждением:
          </Typography.Text>
          <ul>
            <li>
              19: быстрее всего растёт вторая куча при двух удвоениях: 7 + 4S ≥
              100, то есть S ≥ 24. Из (7, 23) получится только 7 + 92 = 99.
            </li>
            <li>
              20: из (7, 23) Петя удваивает вторую кучу и отдаёт Ване (7, 46).
              Это П1: после любого хода Вани — (10, 46), (14, 46), (7, 49) или
              (7, 92) — Петя добирает до 100 одним ходом. Из (7, 42) ловушка —
              (7, 45), туда ведёт ход +3.
            </li>
            <li>
              21: из (7, 39) три хода ведут в В2 Вани, а ход (7, 78) — в В1. Все
              ходы в В1 или В2, но не все в В1 — это П2.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "drugie-pravila",
      navLabel: "Другие правила",
      explanation: (
        <>
          <Typography.Text>
            А если игра кончается не по сумме или ходы другие?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Меняются только <Notation>{"moves"}</Notation> и{" "}
              <Notation>{"finished"}</Notation> — их пишут дословно по условию.
            </strong>{" "}
            Правила окончания в подборках бывают такие:
          </Typography.Text>
          <VariantPicker
            label={"Условие окончания и finished"}
            variants={[
              {
                label: "сумма не менее 100",
                value: <Notation>{"a + b >= 100"}</Notation>,
                note: <>чаще всего</>,
              },
              {
                label: "в одной из куч не менее 50",
                value: <Notation>{"a >= 50 or b >= 50"}</Notation>,
                note: <>хватает одной кучи</>,
              },
              {
                label: "в обеих кучах не менее 50",
                value: <Notation>{"a >= 50 and b >= 50"}</Notation>,
                note: <>нужны обе сразу</>,
              },
              {
                label: "произведение не менее 400",
                value: <Notation>{"a * b >= 400"}</Notation>,
                note: <>«произведение количеств камней»</>,
              },
            ]}
          />
          <Typography.Text>
            С ходами так же. «Добавить в кучу столько камней, сколько в другой»
            — это <Notation>{"(a + b, b)"}</Notation> и{" "}
            <Notation>{"(a, a + b)"}</Notation>. «Первую кучу можно удвоить, а
            вторую — утроить» — <Notation>{"(a * 2, b)"}</Notation> и{" "}
            <Notation>{"(a, b * 3)"}</Notation>. Перечисли в{" "}
            <Notation>{"moves"}</Notation> все ходы, что разрешает условие, — и
            ни одного лишнего.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kuchi-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Позиция", note: <>пара (a, b) — кортеж</> },
              {
                key: "Ход",
                note: <>меняет одну кучу, любую из двух</>,
              },
              {
                key: "moves",
                note: <>четыре хода: каждая операция с каждой кучей</>,
              },
              {
                key: "g",
                note: <>не меняется</>,
              },
              {
                key: "Сумма",
                note: <>не описывает позицию: важно, как разложены камни</>,
              },
              {
                key: "Начало (7, S)",
                note: (
                  <>
                    ответ — <Notation>{"p[1]"}</Notation>
                  </>
                ),
              },
              { key: "Задача темы", note: <>24; 23 42; 39</> },
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
          Игра: добавить один камень или удвоить одну из куч. Какие позиции
          получаются из (5, 8)?
        </>
      ),
      reveal: <>Четыре: (6, 8), (10, 8), (5, 9) и (5, 16).</>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Почему в программе позицию нельзя заменить суммой{" "}
          <Notation>{"a + b"}</Notation>, даже если игра кончается по сумме?
        </>
      ),
      reveal: (
        <>
          Ходы зависят от того, как разложены камни: из (2, 10) удвоение даёт
          сумму 22, а из (6, 6) с той же суммой 12 — только 18.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Игра: +1 или ×2 в одну кучу, победа при сумме не менее 20. Какая
          группа у (3, 8)?
        </>
      ),
      reveal: (
        <>
          П1: ходы дают (4, 8), (6, 8), (3, 9) и (3, 16), и из каждой соперник
          сразу доходит до 20.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Почему в задаче темы наименьшее S для неудачного хода Пети — 24, а не
          23?
        </>
      ),
      reveal: (
        <>
          Быстрее всего — два удвоения второй кучи: 7 + 4S ≥ 100 даёт S ≥ 24. Из
          (7, 23) так получается 7 + 92 = 99.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Игра кончается, когда хотя бы в одной куче не менее 50 камней. Как
          записать <Notation>{"finished"}</Notation>?
        </>
      ),
      reveal: (
        <>
          <Notation>{"return a >= 50 or b >= 50"}</Notation> — после{" "}
          <Notation>{"a, b = p"}</Notation>.
        </>
      ),
    },
  ],
};

export default content;
