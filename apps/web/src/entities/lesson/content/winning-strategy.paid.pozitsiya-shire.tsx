// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { LessonSummary } from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "dopolnitelnyy-urok-poziciya",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет закрыть все возможные случаи заданий 19–21: это редкие
            задачи, на реальных экзаменах такие задачи не встречались. Задачи
            основных подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              В позиции нужно хранить всю информацию, которая влияет на
              допустимые следующие ходы и на исход игры.
            </strong>{" "}
            Иногда одного числа камней или пары куч для этого мало: правила
            запрещают повторять ход, вопрос задан без ограничения числа ходов
            или спрашивают не об одном S, а обо всех позициях сразу. Функции{" "}
            <Notation>{"moves"}</Notation>, <Notation>{"finished"}</Notation> и{" "}
            <Notation>{"f"}</Notation> из подтем 3–6 считаем определёнными выше
            в программе.
          </Typography.Text>
          <Typography.Text>
            Основная игра урока — та же: +1 или ×2, победа при s ≥ 21; для
            запрета повтора к ней добавим ход +2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyanie-shire",
      navLabel: "Состояние шире числа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если выбор следующего действия зависит от предыдущего, количества
              камней уже недостаточно для полного описания ситуации.
            </strong>{" "}
            Например, правило: нельзя повторять ход, который только что сделал
            соперник. Тогда состояние должно хранить пару (количество камней,
            предыдущая команда). Почему? Потому что{" "}
            <strong>
              при одинаковом количестве камней разрешённые действия могут
              различаться из-за разных предыдущих команд
            </strong>
            : если в куче 5 и соперник только что добавил два камня, можно
            получить 6 или 10, но не 7.
          </Typography.Text>
          <Typography.Text>
            Игра: можно добавить один или два камня либо удвоить кучу, нельзя
            повторять ход, который только что сделал соперник, победа при s ≥
            21. Позиция — кортеж <Notation>{"(s, last)"}</Notation>, где{" "}
            <Notation>{"last"}</Notation> — последняя команда; у начальной
            позиции её нет, поэтому там пустая строка{" "}
            <Notation>{'""'}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'def moves(p):\n    s, last = p\n    result = []\n    if last != "+1":\n        result.append((s + 1, "+1"))\n    if last != "+2":\n        result.append((s + 2, "+2"))\n    if last != "×2":\n        result.append((s * 2, "×2"))\n    return result\n\n\ndef finished(p):\n    return p[0] >= 21\n\n\nprint(moves((5, "+2")))\nstarts = [(s, "") for s in range(1, 21)]\nprint([p[0] for p in starts if not f(p, 1) and f(p, 2)])\nprint([p[0] for p in starts if not f(p, 1) and f(p, 3)])\nprint([p[0] for p in starts if not f(p, 2) and f(p, 4)])'
            }
            label={"Код на Python: def moves(p):"}
            language="python"
            output={"[(6, '+1'), (10, '×2')]\n[10]\n[5, 6, 7, 8, 9]\n[4]"}
          />
          <Typography.Text>
            Функция <Notation>{"f"}</Notation> не изменилась: она работает с
            позицией только через <Notation>{"moves"}</Notation> и{" "}
            <Notation>{"finished"}</Notation>.{" "}
            <strong>История меняет группы</strong>: позиции 6, 7, 8 без запрета
            не были <Notation>{"W2"}</Notation>, а теперь Петя выигрывает из них
            вторым ходом — запрет мешает Ване уйти от ловушки.
          </Typography.Text>
          <Typography.Text>
            Если запрет касается предыдущего хода{" "}
            <strong>каждого конкретного игрока</strong> («нельзя повторять свой
            прошлый ход»), потребуется помнить историю отдельно для игроков:
            позиция <Notation>{"(s, мой_прошлый, чужой_прошлый)"}</Notation>, а
            после хода два последних элемента меняются местами — следующий игрок
            видит свой прошлый ход на втором месте.
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
            <strong>
              Вопрос без ограничения числа ходов решается рекурсией «играть до
              конца».
            </strong>{" "}
            Иногда спрашивают: «у Вани есть выигрышная стратегия, позволяющая
            ему выиграть при любой игре Пети» — без слов «первым» или «вторым».
            Тогда m не нужен. Позиция выигрышная для того, кто ходит, если{" "}
            <strong>существует</strong> ход, который сразу заканчивает игру или
            передаёт сопернику проигрышную позицию:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n@cache\ndef win(s):\n    return any(finished(q) or not win(q) for q in moves(s))\n\n\ndef moves(s):\n    return [s + 1, s * 2]\n\n\ndef finished(s):\n    return s >= 21\n\n\nprint([s for s in range(1, 21) if not win(s)])"
            }
            label={"Код на Python: from functools import cache"}
            language="python"
            output={"[2, 6, 8, 10]"}
          />
          <Typography.Text>
            Если все ходы ведут в выигрышные позиции противника, текущая позиция
            проигрышна: <Notation>{"any"}</Notation> даёт{" "}
            <Notation>{"False"}</Notation>, и Ваня выигрывает при любой игре
            Пети при S = 2, 6, 8, 10. Знакомые 10 (<Notation>{"L1"}</Notation>)
            и 8 (<Notation>{"L2"}</Notation>) здесь есть, а 2 и 6 — позиции, где
            Ваня выигрывает позже. <Notation>{"@cache"}</Notation> здесь нужен:
            без запоминания одни и те же позиции пересчитываются в разных
            партиях много раз.
          </Typography.Text>
          <Typography.Text>
            <strong>Различай два вида рекурсии.</strong> Рекурсия с ограничением{" "}
            <Notation>{"m"}</Notation> останавливается, потому что число
            оставшихся ходов уменьшается. Рекурсия «играть до конца» требует
            уверенности, что бесконечные последовательности невозможны. В играх,
            где положительное количество камней строго увеличивается до верхнего
            порога или строго уменьшается до нижнего, завершение обосновать
            легко. Если разрешены и увеличение, и уменьшение, возможны
            возвращения к прежним позициям. Тогда простая неограниченная
            рекурсия требует дополнительного анализа.
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
            <strong>
              Иногда спрашивают не о начальном S, а обо всех позициях сразу —
              тогда перебирают пары куч.
            </strong>{" "}
            Встречается такой вопрос: «Известно, что Петя смог выиграть первым
            ходом. Какое наименьшее число камней могло быть суммарно в двух
            кучах?» Начального S здесь нет: подходит любая позиция (a, b), из
            которой есть победный ход. Перебираем все пары{" "}
            <PythonTerm term="nested">вложенными циклами</PythonTerm> и берём
            наименьшую сумму. Для двух куч с ходами +1 или ×2 и победой при
            сумме не менее 20:
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(p):\n    a, b = p\n    return [(a + 1, b), (a * 2, b), (a, b + 1), (a, b * 2)]\n\n\ndef finished(p):\n    return p[0] + p[1] >= 20\n\n\nbest = None\nfor a in range(1, 20):\n    for b in range(1, 20):\n        p = (a, b)\n        wins = any(finished(q) for q in moves(p))\n        if not finished(p) and wins:\n            if best is None or a + b < best:\n                best = a + b\nprint(best)"
            }
            label={
              "Для двух куч с ходами +1 или ×2 и победой при сумме не менее 20"
            }
            language="python"
            output={"11"}
          />
          <Typography.Text>
            Например, (1, 10): удвоение второй кучи даёт сумму 21. При сумме 10
            не хватает даже лучшего хода: из (1, 9) получается 19. Рассуждением
            то же видно сразу: после удвоения большей кучи сумма равна a + b +
            max(a, b), и выгоднее всего, чтобы почти все камни были в одной
            куче.
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
                note: (
                  <>
                    Позиция хранит всё, что влияет на ходы и исход: при запрете
                    повтора — последний ход, при запрете своего повтора — оба
                    последних.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Без ограничения числа ходов:{" "}
                    <Notation>{"win(p) = any(конец или not win(q))"}</Notation>{" "}
                    с <Notation>{"@cache"}</Notation>; нужно обосновать, что
                    игра конечна.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Если начального S нет, перебирают все позиции и берут нужную
                    по условию.
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
          В игре урока (+1, +2, ×2, нельзя повторить ход соперника) в куче 8,
          соперник только что удвоил кучу. Какие позиции можно получить?
        </>
      ),
      reveal: (
        <>(9, '+1') и (10, '+2'): удваивать нельзя — это ход соперника.</>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Почему в этой игре позицию нельзя хранить одним числом? Приведи две
          позиции с одинаковым числом камней и разными ходами.
        </>
      ),
      reveal: (
        <>
          Например, 5 после хода +2 и 5 после хода +1: из первой нельзя получить
          7, из второй нельзя получить 6.
        </>
      ),
    },
  ],
};

export default content;
