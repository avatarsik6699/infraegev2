// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./winning-strategy.paid.chetyre-proverki.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "rassuzhdeniya-v-kod",
      navLabel: "Рассуждения в код",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рассуждения подтемы 2 переводятся в Python почти дословно: четыре
              функции повторяют определения четырёх групп позиций.
            </strong>{" "}
            Без рекурсии и без новых идей — только правила игры,{" "}
            <Notation>{"any"}</Notation> и <Notation>{"all"}</Notation>.
            Программа нужна почти во всех задачах экзамена — там, где ручная
            таблица слишком длинна: при пороге в сотни и тысячи камней или при
            ходах с условиями.
          </Typography.Text>
          <Typography.Text>
            Переводим в код ту же игру: +1 или ×2, победа при s ≥ 21. Программа
            должна получить то же, что ручной разбор: неудачный ход Пети
            возможен с S = 6, <Notation>{"L1"}</Notation> — 10,{" "}
            <Notation>{"W2"}</Notation> — 5 и 9, <Notation>{"L2"}</Notation> —
            8.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "moves-i-finished",
      navLabel: "Ходы и конец игры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Правила игры записываются двумя функциями: какие позиции
              получаются одним ходом и закончилась ли игра.
            </strong>{" "}
            Обозначения:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"p"}</Notation> — рассматриваемая позиция;
            </li>
            <li>
              <Notation>{"q"}</Notation> — позиция после одного разрешённого
              хода;
            </li>
            <li>
              <Notation>{"moves(p)"}</Notation> — список всех позиций, которые
              можно получить одним ходом;
            </li>
            <li>
              <Notation>{"finished(p)"}</Notation> — проверка, закончилась ли
              игра.
            </li>
          </ul>
          <Typography.Text>
            Правила нашей игры — две <PythonTerm term="def">функции</PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(s):\n    return [s + 1, s * 2]\n\n\ndef finished(s):\n    return s >= 21"
            }
            label={"Правила нашей игры — две {{def|функции}}"}
            language="python"
          />
          <Typography.Text>Проверим их на нескольких позициях:</Typography.Text>
          <CodeBlock
            code={
              "print(moves(10))\nprint(finished(20), finished(21), finished(40))"
            }
            label={"Проверим их на нескольких позициях"}
            language="python"
            output={"[11, 20]\nFalse True True"}
          />
        </>
      ),
    },
    {
      id: "any",
      navLabel: "Запись any",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Запись <Notation>{"any(finished(q) for q in moves(p))"}</Notation>{" "}
              спрашивает: есть ли ход, после которого игра окончена?
            </strong>{" "}
            Для каждой позиции <Notation>{"q"}</Notation>, полученной одним
            ходом из <Notation>{"p"}</Notation>, проверить окончание игры. Затем
            выяснить, есть ли хотя бы один результат{" "}
            <Notation>{"True"}</Notation>. Её можно записать длиннее —{" "}
            <PythonTerm term="list">списком</PythonTerm> и{" "}
            <PythonTerm term="for">циклом</PythonTerm>. Пройди программу по
            шагам для p = 11:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runChecks}
            label={"Пройди программу по шагам для p = 11"}
          />
          <Typography.Text>
            Ход 11 → 12 игру не закончил, ход 11 → 22 закончил, поэтому{" "}
            <Notation>{"any"}</Notation> даёт <Notation>{"True"}</Notation>.
            Короткая запись{" "}
            <Notation>{"any(finished(q) for q in moves(p))"}</Notation> делает
            то же без промежуточного списка: внутри —{" "}
            <PythonTerm term="genexp">генераторное выражение</PythonTerm>, а{" "}
            <PythonTerm term="anyall">
              <Notation>{"any"}</Notation>
            </PythonTerm>{" "}
            получает результаты по одному.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetyre-proverki",
      navLabel: "Четыре проверки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Четыре проверки — это определения групп, записанные кодом.
            </strong>{" "}
            <PythonTerm term="andor">
              <Notation>{"not"}</Notation>, <Notation>{"and"}</Notation>,{" "}
              <Notation>{"or"}</Notation>
            </PythonTerm>{" "}
            — отрицание, «оба условия», «хотя бы одно»:
          </Typography.Text>
          <CodeBlock
            code={
              "def win1(p):\n    return (\n        not finished(p)\n        and any(finished(q) for q in moves(p))\n    )\n\n\ndef lose1(p):\n    return (\n        not finished(p)\n        and all(win1(q) for q in moves(p))\n    )\n\n\ndef win2(p):\n    return (\n        not finished(p)\n        and not win1(p)\n        and any(lose1(q) for q in moves(p))\n    )\n\n\ndef lose2(p):\n    return (\n        not finished(p)\n        and not lose1(p)\n        and all(win1(q) or win2(q) for q in moves(p))\n    )"
            }
            label={
              "{{andor|not, and, or}} — отрицание, «оба условия», «хотя бы одно»"
            }
            language="python"
          />
          <Typography.Text>Поясним функции по очереди:</Typography.Text>
          <ul>
            <li>
              <Notation>{"win1(p)"}</Notation> — игра ещё не закончилась, и
              существует ход, который её завершает;
            </li>
            <li>
              <Notation>{"lose1(p)"}</Notation> — игра ещё не закончилась, и
              после любого нашего хода соперник получает возможность немедленно
              выиграть;
            </li>
            <li>
              <Notation>{"win2(p)"}</Notation> — игра ещё не закончилась,
              немедленно выиграть нельзя, но можно передать сопернику позицию{" "}
              <Notation>{"L1"}</Notation>;
            </li>
            <li>
              <Notation>{"lose2(p)"}</Notation> — игра ещё не закончилась,
              позиция не является <Notation>{"L1"}</Notation>, а после любого
              нашего хода соперник получает <Notation>{"W1"}</Notation> или{" "}
              <Notation>{"W2"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            Отдельно проверим возможность неудачного хода:
          </Typography.Text>
          <CodeBlock
            code={
              "def after_mistake(p):\n    return (\n        not finished(p)\n        and any(win1(q) for q in moves(p))\n    )"
            }
            label={"Отдельно проверим возможность неудачного хода"}
            language="python"
          />
          <Typography.Text>
            Здесь стоит <Notation>{"any"}</Notation>, потому что нам достаточно{" "}
            <strong>одного</strong> хода Пети, после которого соперник сможет
            выиграть сразу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "not-finished",
      navLabel: "Проверка not finished",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"not finished(p)"}</Notation> стоит первым, чтобы не
              анализировать уже завершившуюся игру как активную.
            </strong>{" "}
            Например, <Notation>{"win1(22)"}</Notation> должно вернуть{" "}
            <Notation>{"False"}</Notation>: из 22 уже не требуется выигрывать
            новым ходом — партия закончилась раньше. Это важно и внутри других
            функций. Если Петя своим ходом получил 22, нельзя продолжать
            рассуждение так, будто Ваня теперь получил удобную позицию для
            следующего хода.
          </Typography.Text>
          <Typography.Text>
            В выражении <Notation>{"not finished(p) and …"}</Notation> Python
            сначала проверяет левую часть.{" "}
            <strong>
              Если игра закончилась, левая часть равна{" "}
              <Notation>{"False"}</Notation>, и дальнейшие ходы вычислять уже не
              нужно.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={"print(win1(22), win1(11), lose1(22), lose1(10))"}
            label={
              "Если игра закончилась, левая часть равна False, и дальнейшие ходы вычислять уже не нужно"
            }
            language="python"
            output={"False True False True"}
          />
        </>
      ),
    },
    {
      id: "poisk-znachenij",
      navLabel: "Поиск значений S",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Поиск стратегии и поиск ответа — два отдельных действия: сначала
              собираем все подходящие значения S.
            </strong>{" "}
            Не нужно смешивать проверку одного значения S с поиском минимума.{" "}
            <PythonTerm term="for">
              <Notation>{"range(1, 21)"}</Notation>
            </PythonTerm>{" "}
            перебирает числа от 1 до 20 включительно: правая граница в{" "}
            <Notation>{"range"}</Notation> не включается.
          </Typography.Text>
          <CodeBlock
            code={
              'answer19_mistake = []\nanswer19_guaranteed = []\nanswer20 = []\nanswer21 = []\n\nfor s in range(1, 21):\n    p = s\n\n    if after_mistake(p):\n        answer19_mistake.append(s)\n\n    if lose1(p):\n        answer19_guaranteed.append(s)\n\n    if win2(p):\n        answer20.append(s)\n\n    if lose2(p):\n        answer21.append(s)\n\nprint("19, после неудачного хода:", min(answer19_mistake))\nprint("19, при любом ходе:", answer19_guaranteed)\nprint("20:", answer20)\nprint("21:", answer21)'
            }
            label={"Код на Python: answer19_mistake = []"}
            language="python"
            output={
              "19, после неудачного хода: 6\n19, при любом ходе: [10]\n20: [5, 9]\n21: [8]"
            }
          />
          <Typography.Text>
            Это те же числа, что и в ручной таблице подтемы 2.{" "}
            <PythonTerm term="agg">
              <Notation>{"min(...)"}</Notation>
            </PythonTerm>{" "}
            находит наименьшее число из найденных.
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
            <strong>
              Форма ответа определяется условием, а не программой.
            </strong>{" "}
            Список найденных значений один, а взять из него нужно ровно то, о
            чём спрашивают:
          </Typography.Text>
          <VariantPicker
            label={"Что спрашивают и что взять из списка"}
            variants={[
              {
                label: "Все значения",
                value: <>весь список по возрастанию</>,
                note: (
                  <>
                    <Notation>{"answer20"}</Notation>
                  </>
                ),
              },
              {
                label: "Наименьшее",
                value: <>первое при переборе по возрастанию</>,
                note: (
                  <>
                    <Notation>{"min(answer21)"}</Notation>
                  </>
                ),
              },
              {
                label: "Наибольшее",
                value: <>последнее</>,
                note: (
                  <>
                    <Notation>{"max(answer21)"}</Notation>
                  </>
                ),
              },
              {
                label: "Два наименьших",
                value: <>первые два</>,
                note: (
                  <>
                    <Notation>{"answer20[:2]"}</Notation>
                  </>
                ),
              },
              {
                label: "Два наибольших",
                value: <>последние два</>,
                note: (
                  <>
                    <Notation>{"answer20[-2:]"}</Notation>
                  </>
                ),
              },
              {
                label: "Наименьшее и наибольшее",
                value: <>первое и последнее</>,
                note: (
                  <>
                    <Notation>{"answer20[0], answer20[-1]"}</Notation>
                  </>
                ),
              },
              {
                label: "Количество значений",
                value: <>длина списка</>,
                note: (
                  <>
                    <Notation>{"len(answer20)"}</Notation>
                  </>
                ),
              },
              {
                label: "Сумма значений",
                value: <>сумма списка</>,
                note: (
                  <>
                    <Notation>{"sum(answer20)"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Если программа нашла три подходящих значения, а условие просит{" "}
            <strong>два наименьших</strong>, это не ошибка программы. Просто
            требуется выбрать часть найденных значений. Срез{" "}
            <Notation>{"[:2]"}</Notation> —{" "}
            <PythonTerm term="slice">первые два элемента</PythonTerm>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica-perebora",
      navLabel: "Граница перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если верхняя граница S не указана, перебор до случайного числа сам
              по себе не доказывает, что дальше ничего нет.
            </strong>{" "}
            Для поиска первого или первых нескольких значений можно двигаться по
            возрастанию до их нахождения.{" "}
            <strong>
              Для поиска максимума или всех значений нужна обоснованная граница.
            </strong>{" "}
            В играх с увеличением кучи граница задана самим условием: S меньше
            порога. Где её приходится выводить, разберём в подтеме 5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proverki-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    <Notation>{"moves"}</Notation> и{" "}
                    <Notation>{"finished"}</Notation> — правила игры, всё
                    остальное от правил не зависит.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"win1"}</Notation>,{" "}
                    <Notation>{"lose1"}</Notation>,{" "}
                    <Notation>{"win2"}</Notation>,{" "}
                    <Notation>{"lose2"}</Notation> и{" "}
                    <Notation>{"after_mistake"}</Notation> дословно повторяют
                    определения: «есть ход» — <Notation>{"any"}</Notation>, «все
                    ходы» — <Notation>{"all"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"not finished(p)"}</Notation> стоит первым:
                    завершённая партия не продолжается.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сначала собираем все подходящие S, потом берём из списка то,
                    что спрашивают.
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
          Запиши <Notation>{"moves"}</Notation> и{" "}
          <Notation>{"finished"}</Notation> для игры: можно добавить два или три
          камня либо удвоить кучу, игра заканчивается, когда в куче не менее 50
          камней.
        </>
      ),
      reveal: (
        <>
          <Notation>{"moves(s)"}</Notation> возвращает{" "}
          <Notation>{"[s + 2, s + 3, s * 2]"}</Notation>,{" "}
          <Notation>{"finished(s)"}</Notation> —{" "}
          <Notation>{"s >= 50"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Что вернут <Notation>{"win1(25)"}</Notation> и{" "}
          <Notation>{"lose1(25)"}</Notation> для игры задачи 1? Почему?
        </>
      ),
      reveal: (
        <>
          <Notation>{"win1(25)"}</Notation> — <Notation>{"True"}</Notation>: 25
          · 2 = 50. <Notation>{"lose1(25)"}</Notation> —{" "}
          <Notation>{"False"}</Notation>: из 25 можно выиграть сразу, значит, не
          все ходы отдают сопернику <Notation>{"W1"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Для игры задачи 1 найди программой все <Notation>{"L1"}</Notation>,{" "}
          <Notation>{"W2"}</Notation>, <Notation>{"L2"}</Notation> и наименьшее
          S, при котором возможна победа Вани после неудачного хода Пети.
        </>
      ),
      reveal: (
        <>
          <Notation>{"L1"}</Notation>: 23, 24; <Notation>{"W2"}</Notation>: 12,
          20, 21, 22; <Notation>{"L2"}</Notation>: 18, 19; после неудачного хода
          — 13 (13 · 2 · 2 = 52).
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Проверь программой ответ задачи 5 подтемы 2: игра +1 или +3, победа
          при s ≥ 12. Что нужно изменить в программе?
        </>
      ),
      reveal: (
        <>
          Те же ответы: <Notation>{"W1"}</Notation> — 9, 10, 11,{" "}
          <Notation>{"L1"}</Notation> — 8, <Notation>{"W2"}</Notation> — 5, 7,{" "}
          <Notation>{"L2"}</Notation> — 4, 6. Меняются только{" "}
          <Notation>{"moves"}</Notation> (
          <Notation>{"[s + 1, s + 3]"}</Notation>) и{" "}
          <Notation>{"finished"}</Notation> (<Notation>{"s >= 12"}</Notation>) и
          диапазон <Notation>{"range(1, 12)"}</Notation>.
        </>
      ),
    },
  ],
};

export default content;
