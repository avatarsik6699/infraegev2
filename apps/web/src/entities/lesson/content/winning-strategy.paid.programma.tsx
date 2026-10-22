// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./winning-strategy.paid.programma.media";
import { PythonTerm } from "./python-term";

const G_BODY =
  "    nxt = moves(s)\n    if any(finished(q) for q in nxt):\n        return 1  # В1\n    r = [g(q) for q in nxt]\n    if all(x == 1 for x in r):\n        return -1  # П1\n    if -1 in r:\n        return 2  # В2\n    if all(x > 0 for x in r):\n        return -2  # П2\n    return 0";
const RULES =
  "def moves(s):\n    return [s + 1, s * 2]\n\n\ndef finished(s):\n    return s >= 21";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "pravila-v-kode",
      navLabel: "Правила в коде",
      explanation: (
        <>
          <Typography.Text>
            Руками мы разобрали игру с порогом 21. На экзамене порог в сотни
            камней, а куч бывает две — там нужна программа. Как объяснить Python
            правила игры?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Правила записывают двумя функциями: <Notation>{"moves"}</Notation>{" "}
              — какие позиции получаются одним ходом,{" "}
              <Notation>{"finished"}</Notation> — кончилась ли игра.
            </strong>{" "}
            Для нашей игры +1 или ×2 до 21:
          </Typography.Text>
          <CodeBlock
            code={RULES + "\n\n\nprint(moves(10), finished(20), finished(21))"}
            label={"Правила игры — две {{def|функции}}"}
            language="python"
            output={"[11, 20] False True"}
          />
          <Typography.Text>
            Всё, что зависит от условия, живёт в этих двух функциях. Остальная
            программа одна на все игры темы: для новой задачи переписывают
            только <Notation>{"moves"}</Notation> и{" "}
            <Notation>{"finished"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "any-i-all",
      navLabel: "any и all",
      explanation: (
        <>
          <Typography.Text>
            Как записать «есть хотя бы один ход» и «все ходы»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              <PythonTerm term="anyall">
                <Notation>{"any"}</Notation>
              </PythonTerm>{" "}
              — верна ли хотя бы одна проверка, <Notation>{"all"}</Notation> —
              верны ли все.
            </strong>{" "}
            Из 11 можно получить 12 и 22. Кончает ли игру хоть один ход? А все?
          </Typography.Text>
          <CodeBlock
            code={
              "nxt = moves(11)\nprint(nxt)\nprint(any(finished(q) for q in nxt))\nprint(all(finished(q) for q in nxt))"
            }
            label={"Хотя бы один ход и все ходы"}
            language="python"
            output={"[12, 22]\nTrue\nFalse"}
          />
          <Typography.Text>
            Внутри скобок —{" "}
            <PythonTerm term="genexp">генераторное выражение</PythonTerm>: для
            каждой позиции <Notation>{"q"}</Notation> из{" "}
            <Notation>{"nxt"}</Notation> проверить{" "}
            <Notation>{"finished(q)"}</Notation>. Это и есть два правила подтемы
            1: на своём ходе хватает одного удачного —{" "}
            <Notation>{"any"}</Notation>, на ходе соперника нужны все —{" "}
            <Notation>{"all"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gruppa-pozicii",
      navLabel: "Группа позиции",
      explanation: (
        <>
          <Typography.Text>
            Как найти группу позиции программой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Функция <Notation>{"g(s)"}</Notation> проверяет четыре определения
              в том же порядке, что и разбор от конца, и возвращает число: 1 —
              В1, −1 — П1, 2 — В2, −2 — П2, 0 — до победы больше двух ходов.
            </strong>{" "}
            Знак — кто выигрывает: плюс — тот, кто ходит, минус — его соперник.
            Число — каким по счёту ходом всё решится, как цифра в названии
            группы.
          </Typography.Text>
          <CodeBlock
            code={RULES + "\n\n\ndef g(s):\n" + G_BODY + "\n\n\nprint(g(9))"}
            label={"Группа позиции — одна {{rec|рекурсивная}} функция"}
            language="python"
            output={"2"}
          />
          <Typography.Text>Разберём строки по очереди:</Typography.Text>
          <ul>
            <li>
              <Notation>{"any(finished(q) for q in nxt)"}</Notation> — есть ход,
              который кончает игру: В1.
            </li>
            <li>
              <Notation>{"r = [g(q) for q in nxt]"}</Notation> — группы всех
              позиций, которые получит соперник. Здесь функция вызывает саму
              себя. В этих позициях ходит уже соперник, поэтому 1 в списке{" "}
              <Notation>{"r"}</Notation> — это его В1, а не наша.
            </li>
            <li>
              <Notation>{"all(x == 1 for x in r)"}</Notation> — все ходы ведут в
              В1: П1.
            </li>
            <li>
              <Notation>{"-1 in r"}</Notation> — в списке есть −1, то есть ход,
              после которого соперник в П1: В2.
            </li>
            <li>
              <Notation>{"all(x > 0 for x in r)"}</Notation> — все ходы ведут в
              В1 или В2: П2. Положительные числа только у этих двух групп.
            </li>
          </ul>
          <Typography.Text>
            Порядок проверок важен. До строки В2 доходят, только если позиция не
            В1 и не П1, — ровно как в определении. Пройди вызовы{" "}
            <Notation>{"g(9)"}</Notation> по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.gameLabelStepper9}
            label={"Вызовы g(9): каждая позиция получает свою группу"}
          />
          <Typography.Text>
            Отдельного базового случая у функции нет: его роль играет строка В1.
            Каждый вызов идёт к позициям с большим числом камней, а из большой
            кучи какой-то ход кончает игру — функция сразу возвращает 1 и дальше
            не спрашивает. На этом рекурсия и останавливается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapominanie",
      navLabel: "Запоминание",
      explanation: (
        <>
          <Typography.Text>
            Зачем над функцией пишут <Notation>{"@cache"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              В одну позицию можно прийти разными путями, и без запоминания{" "}
              <Notation>{"g"}</Notation> считает её заново каждый раз.
            </strong>{" "}
            В 10 приходят и из 9, и из 5, а с двумя кучами путей к одной позиции
            десятки.
          </Typography.Text>
          <Typography.Text>
            В задаче темы с двумя кучами функция без запоминания делает почти 90
            миллионов вызовов и считает около 40 секунд. С{" "}
            <PythonTerm term="cache">
              <Notation>{"@cache"}</Notation>
            </PythonTerm>{" "}
            — меньше двух тысяч вызовов, и ответ появляется сразу. Запоминание —
            две строки:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n@cache\ndef g(s):\n" + G_BODY
            }
            label={"Та же функция с запоминанием"}
            language="python"
          />
          <Typography.Text>
            Формула функции не меняется: <Notation>{"@cache"}</Notation> только
            запоминает ответ для каждой позиции и при повторном вызове берёт его
            готовым.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tri-voprosa",
      navLabel: "Три вопроса",
      explanation: (
        <>
          <Typography.Text>
            Как получить ответы на задания 19, 20 и 21?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все начальные S и отобрать нужную группу: задание 20 —{" "}
              <Notation>{"g(s) == 2"}</Notation>, задание 21 —{" "}
              <Notation>{"g(s) == -2"}</Notation>.
            </strong>{" "}
            Задание 19 в форме «при любом ходе Пети» — это{" "}
            <Notation>{"g(s) == -1"}</Notation>. А для неудачного хода Пети
            нужна своя проверка: есть ход Пети, после которого Ваня выигрывает
            сразу.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n" +
              RULES +
              "\n\n\n@cache\ndef g(s):\n" +
              G_BODY +
              "\n\n\ndef mistake(s):\n    # Петя ходит так, что Ваня выигрывает сразу\n    return any(not finished(q) and g(q) == 1\n               for q in moves(s))\n\n\nstarts = range(1, 21)\nprint(min(s for s in starts if mistake(s)))\nprint([s for s in starts if g(s) == -1])\nprint([s for s in starts if g(s) == 2])\nprint([s for s in starts if g(s) == -2])"
            }
            label={"Вся программа: ответы на все вопросы"}
            language="python"
            output={"6\n[10]\n[5, 9]\n[8]"}
          />
          <Typography.Text>
            Это те же числа, что в ручном разборе: 6 для неудачного хода, 10 —
            П1, 5 и 9 — В2, 8 — П2. Так программу и проверяют: сначала на
            маленькой игре, где ответ известен, потом меняют правила.
          </Typography.Text>
          <Typography.Text>
            В <Notation>{"mistake"}</Notation> стоит{" "}
            <Notation>{"not finished(q)"}</Notation>: если ход Пети кончил игру,
            Петя выиграл — это не ошибка. Диапазон{" "}
            <Notation>{"range(1, 21)"}</Notation> — все S из условия, от 1 до
            20: правая граница в <Notation>{"range"}</Notation> не входит.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "forma-otveta",
      navLabel: "Форма ответа",
      explanation: (
        <>
          <Typography.Text>
            Программа нашла список значений. Что записать в ответ?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Ровно то, что спрашивает условие: из одного списка берут разные
              части.
            </strong>{" "}
            Пусть подходящие S собраны в{" "}
            <Notation>{"found = [s for s in starts if g(s) == 2]"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Вопрос условия и запись в Python"}
            variants={[
              {
                label: "все значения",
                value: <Notation>{"print(*found)"}</Notation>,
                note: <>через пробел по возрастанию</>,
              },
              {
                label: "наименьшее",
                value: <Notation>{"min(found)"}</Notation>,
                note: <>одно число</>,
              },
              {
                label: "наибольшее",
                value: <Notation>{"max(found)"}</Notation>,
                note: <>одно число</>,
              },
              {
                label: "два наименьших",
                value: <Notation>{"found[:2]"}</Notation>,
                note: <>первые два — список уже по возрастанию</>,
              },
              {
                label: "наименьшее и наибольшее",
                value: <Notation>{"min(found), max(found)"}</Notation>,
                note: <>в порядке условия</>,
              },
              {
                label: "количество",
                value: <Notation>{"len(found)"}</Notation>,
                note: <>сколько значений</>,
              },
            ]}
          />
          <Typography.Text>
            Если в ответе два числа, их пишут через пробел в том порядке, что
            назван в условии: для задания 20 нашей игры — 5 9.
          </Typography.Text>
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
                key: "Правила",
                note: (
                  <>
                    <Notation>{"moves"}</Notation> и{" "}
                    <Notation>{"finished"}</Notation> — дословно по условию
                  </>
                ),
              },
              {
                key: "any",
                note: <>хотя бы один ход — свой ход</>,
              },
              {
                key: "all",
                note: <>все ходы — ход соперника</>,
              },
              {
                key: "g(s)",
                note: <>1, −1, 2, −2 — В1, П1, В2, П2; 0 — дальше</>,
              },
              {
                key: "@cache",
                note: <>каждую позицию считаем один раз</>,
              },
              {
                key: "Задания",
                note: (
                  <>
                    19 — <Notation>{"mistake"}</Notation> или −1, 20 — 2, 21 —
                    −2
                  </>
                ),
              },
              {
                key: "Проверка",
                note: <>игра +1, ×2 до 21: 6, [10], [5, 9], [8]</>,
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
          Что вернёт <Notation>{"g(10)"}</Notation> в игре +1 или ×2 до 21 и
          почему?
        </>
      ),
      reveal: (
        <>
          −1: ни один ход не кончает игру, а оба хода — в 11 и в 20 — ведут в
          В1. Это П1.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Ни один ход не кончает игру, а группы позиций после ходов —{" "}
          <Notation>{"r = [2, 1, -1]"}</Notation>. Что вернёт{" "}
          <Notation>{"g"}</Notation>?
        </>
      ),
      reveal: <>2: не все ходы ведут в В1, зато есть ход в П1 — это В2.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          А если <Notation>{"r = [2, 2]"}</Notation>? А если{" "}
          <Notation>{"r = [1, 0]"}</Notation>?
        </>
      ),
      reveal: (
        <>
          −2: все ходы ведут в В2 — это П2. Во втором случае 0: один ход ведёт в
          позицию, о которой за два хода ничего не известно.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Зачем в <Notation>{"mistake"}</Notation> условие{" "}
          <Notation>{"not finished(q)"}</Notation>? Что посчитается без него?
        </>
      ),
      reveal: (
        <>
          Без него победный ход Пети сойдёт за ошибку: из позиции 21 и выше{" "}
          <Notation>{"g"}</Notation> вернёт 1, хотя игра уже кончилась победой
          Пети.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Для задания 20 программа нашла{" "}
          <Notation>{"[23, 42, 43, 44]"}</Notation>, а спрашивают два наименьших
          значения. Что записать в ответ?
        </>
      ),
      reveal: <>23 42 — первые два числа через пробел.</>,
    },
  ],
};

export default content;
