// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { LessonSummary } from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { PythonTerm } from "./python-term";

const G_TAIL =
  "    nxt = moves(s)\n    if any(finished(q) for q in nxt):\n        return 1  # В1\n    r = [g(q) for q in nxt]\n    if all(x == 1 for x in r):\n        return -1  # П1\n    if -1 in r:\n        return 2  # В2";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "tretij-hod",
      navLabel: "Третий ход",
      explanation: (
        <>
          <Typography.Text>
            Это дополнительный урок: такие задачи редки, на экзамене их почти не
            было. Как ответить на вопрос о третьем ходе — «Петя не может
            выиграть за один и за два хода, но выигрывает своим третьим ходом»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Продолжить разбор от конца ещё на шаг: В3 — есть ход в П2, П3 —
              все ходы ведут в В1, В2 или В3.
            </strong>{" "}
            В функции <Notation>{"g"}</Notation> появляются две строки, а
            проверка П2 становится строже: теперь среди ответов бывает и 3.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\ndef moves(s):\n    return [s + 1, s * 2]\n\n\ndef finished(s):\n    return s >= 21\n\n\n@cache\ndef g(s):\n" +
              G_TAIL +
              "\n    if all(0 < x <= 2 for x in r):\n        return -2  # П2\n    if -2 in r:\n        return 3  # В3\n    if all(x > 0 for x in r):\n        return -3  # П3\n    return 0\n\n\nstarts = range(1, 21)\nprint([s for s in starts if g(s) == 3])\nprint([s for s in starts if g(s) == -3])"
            }
            label={"Группы В3 и П3"}
            language="python"
            output={"[4, 7]\n[6]"}
          />
          <Typography.Text>
            Из 4 Петя удваивает кучу и отдаёт Ване 8 — это П2: что бы Ваня ни
            делал, Петя выиграет не позже третьего хода. Из 6 оба хода плохи: в
            7 (В3 Вани) и в 12 (В1 Вани), поэтому 6 — П3.
          </Typography.Text>
          <Typography.Text>
            Без <Notation>{"0 < x <= 2"}</Notation> позиция с ходами в В1 и В3
            попала бы в П2, хотя соперник выигрывает только третьим ходом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyanie-shire",
      navLabel: "Запрет повтора",
      explanation: (
        <>
          <Typography.Text>
            Что, если нельзя повторять ход, который только что сделал соперник?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда числа камней мало: в позицию добавляют прошлый ход — пару
              (s, last).
            </strong>{" "}
            Ходы зависят не только от кучи, но и от того, как в неё пришли.
            Игра: +1, +2 или ×2, нельзя повторять ход соперника, победа при s ≥
            21. У начальной позиции прошлого хода нет — пустая строка:
          </Typography.Text>
          <CodeBlock
            code={
              'from functools import cache\n\n\ndef moves(p):\n    s, last = p\n    result = []\n    if last != "+1":\n        result.append((s + 1, "+1"))\n    if last != "+2":\n        result.append((s + 2, "+2"))\n    if last != "×2":\n        result.append((s * 2, "×2"))\n    return result\n\n\ndef finished(p):\n    return p[0] >= 21\n\n\n@cache\ndef g(s):\n' +
              G_TAIL +
              '\n    if all(x > 0 for x in r):\n        return -2  # П2\n    return 0\n\n\nprint(moves((5, "+2")))\nstarts = [(s, "") for s in range(1, 21)]\nprint([p[0] for p in starts if g(p) == -1])\nprint([p[0] for p in starts if g(p) == 2])\nprint([p[0] for p in starts if g(p) == -2])'
            }
            label={"Позиция — пара: куча и прошлый ход"}
            language="python"
            output={"[(6, '+1'), (10, '×2')]\n[10]\n[5, 6, 7, 8, 9]\n[4]"}
          />
          <Typography.Text>
            Функция <Notation>{"g"}</Notation> не изменилась — она видит позицию
            только через <Notation>{"moves"}</Notation> и{" "}
            <Notation>{"finished"}</Notation>. А группы изменились: без запрета
            В2 были 5, 8 и 9, теперь к ним добавились 6 и 7 — запрет мешает Ване
            уйти от ловушки.
          </Typography.Text>
          <Typography.Text>
            Если нельзя повторять свой собственный прошлый ход, хранят оба: (s,
            мой прошлый, чужой прошлый), и после хода последние два элемента
            меняются местами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "do-konca",
      navLabel: "Игра до конца",
      explanation: (
        <>
          <Typography.Text>
            Иногда спрашивают без номера хода: «у Вани есть выигрышная стратегия
            при любой игре Пети». Как это проверить?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Играть до конца: позиция выигрышная, если есть ход, который
              кончает игру или отдаёт сопернику проигрышную позицию.
            </strong>{" "}
            Номер хода не нужен, хватает одной{" "}
            <PythonTerm term="rec">рекурсивной</PythonTerm> функции:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\ndef moves(s):\n    return [s + 1, s * 2]\n\n\ndef finished(s):\n    return s >= 21\n\n\n@cache\ndef win(s):\n    return any(finished(q) or not win(q)\n               for q in moves(s))\n\n\nprint([s for s in range(1, 21) if not win(s)])"
            }
            label={"Ваня выигрывает при любой игре Пети"}
            language="python"
            output={"[2, 6, 8, 10]"}
          />
          <Typography.Text>
            Здесь есть знакомые 10 (П1) и 8 (П2), а 2 и 6 — позиции, где Ваня
            выигрывает позже. Рекурсия кончается, потому что куча всё время
            растёт. В играх, где можно вернуться в прежнюю позицию, так делать
            нельзя: вызовы пойдут по кругу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vse-pozicii",
      navLabel: "Все позиции сразу",
      explanation: (
        <>
          <Typography.Text>
            «Известно, что Петя выиграл первым ходом. Какое наименьшее число
            камней могло быть в двух кучах вместе?» Начального S тут нет — как
            решать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все позиции (a, b) двумя циклами и взять наименьшую
              сумму среди тех, где есть победный ход.
            </strong>{" "}
            Игра: +1 или ×2 в одну кучу, победа при сумме не менее 20:
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(p):\n    a, b = p\n    return [(a + 1, b), (a * 2, b), (a, b + 1), (a, b * 2)]\n\n\ndef finished(p):\n    return p[0] + p[1] >= 20\n\n\nbest = None\nfor a in range(1, 20):\n    for b in range(1, 20):\n        p = (a, b)\n        wins = any(finished(q) for q in moves(p))\n        if not finished(p) and wins:\n            if best is None or a + b < best:\n                best = a + b\nprint(best)"
            }
            label={"Наименьшая сумма позиции В1"}
            language="python"
            output={"11"}
          />
          <Typography.Text>
            Например, (1, 10): удвоение второй кучи даёт сумму 21. А при сумме
            10 не хватает даже лучшего хода: из (1, 9) получится 19. Выгоднее
            всего, когда почти все камни в одной куче, — её и удваивают.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "shire-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "В3",
                note: <>есть ход в П2</>,
              },
              {
                key: "П3",
                note: (
                  <>
                    все ходы в В1–В3; П2 тогда —{" "}
                    <Notation>{"0 < x <= 2"}</Notation>
                  </>
                ),
              },
              {
                key: "Запрет повтора",
                note: <>позиция (s, last)</>,
              },
              {
                key: "Без номера хода",
                note: (
                  <>
                    <Notation>{"win"}</Notation>: победный ход или ход в
                    проигрыш соперника
                  </>
                ),
              },
              {
                key: "Все позиции",
                note: <>два цикла по a и b</>,
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
          Ходы из позиции дают <Notation>{"r = [3, 1]"}</Notation>. Какая это
          группа и почему её нельзя считать П2?
        </>
      ),
      reveal: (
        <>
          П3: все ходы ведут в выигрыш соперника, но один из них — в В3, где
          соперник выигрывает только третьим ходом.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Нельзя повторять ход соперника. Почему позиции (12, "+1") и (12, "×2")
          — разные?
        </>
      ),
      reveal: (
        <>
          Из них разные ходы: после «+1» нельзя добавить один камень, после «×2»
          — удвоить.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Что вернёт <Notation>{"win(10)"}</Notation> в игре +1 или ×2 до 21 и
          почему?
        </>
      ),
      reveal: (
        <>
          <Notation>{"False"}</Notation>: оба хода — в 11 и в 20 — не кончают
          игру и отдают сопернику выигрышную позицию.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Игра: +1 или ×3 в одну кучу, победа при сумме не менее 30. Какую
          наименьшую сумму может иметь позиция, из которой выигрывают первым
          ходом?
        </>
      ),
      reveal: (
        <>
          11: из (1, 10) утроение второй кучи даёт 1 + 30 = 31. При сумме 10
          лучшее — (1, 9) → 1 + 27 = 28.
        </>
      ),
    },
  ],
};

export default content;
