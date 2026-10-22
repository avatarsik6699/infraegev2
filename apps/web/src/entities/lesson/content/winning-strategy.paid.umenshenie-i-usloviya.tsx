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
import { lessonMedia } from "./winning-strategy.paid.umenshenie-i-usloviya.media";
import { PythonTerm } from "./python-term";

const G =
  "@cache\ndef g(s):\n    nxt = moves(s)\n    if any(finished(q) for q in nxt):\n        return 1  # В1\n    r = [g(q) for q in nxt]\n    if all(x == 1 for x in r):\n        return -1  # П1\n    if -1 in r:\n        return 2  # В2\n    if all(x > 0 for x in r):\n        return -2  # П2\n    return 0";
const RULES =
  "def moves(s):\n    return [s - 1, s // 2]\n\n\ndef finished(s):\n    return s <= 10";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "umenshenie-kuchi",
      navLabel: "Уменьшение кучи",
      explanation: (
        <>
          <Typography.Text>Что меняется, когда кучу уменьшают?</Typography.Text>
          <Typography.Text>
            <strong>
              Только правила: ходы уменьшают кучу, а выигрывает тот, кто первым
              опустился до порога. Функция <Notation>{"g"}</Notation> прежняя.
            </strong>{" "}
            Учебная игра: можно убрать один камень или уменьшить кучу вдвое с
            округлением вниз; выигрывает тот, у кого после хода в куче не более
            10 камней; S ≥ 11.
          </Typography.Text>
          <CodeBlock
            code={RULES + "\n\n\nprint(moves(21), moves(22))"}
            label={"Правила убывающей игры"}
            language="python"
            output={"[20, 10] [21, 11]"}
          />
          <Typography.Text>
            <Notation>{"//"}</Notation> —{" "}
            <PythonTerm term="intdiv">деление с округлением вниз</PythonTerm>:
            21 // 2 = 10, поэтому из 21 выигрывают сразу. А из 22 делением
            получится 11 — игра продолжается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gruppy-umensheniya",
      navLabel: "Группы позиций",
      explanation: (
        <>
          <Typography.Text>Где здесь В1, П1, В2 и П2?</Typography.Text>
          <Typography.Text>
            <strong>
              Определения те же, только конец игры теперь внизу: ближе к победе
              — меньше камней, и перебор идёт вверх от порога.
            </strong>{" "}
            В1 — 11–21. П1 — 22: оба хода, в 21 и в 11, ведут в В1. В ловушку 22
            ведут 23 (−1), 44 и 45 (44 // 2 = 45 // 2 = 22) — это В2. П2 — 24 и
            46.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gameLine11_46_12_10_11254347}
            caption={
              <>
                Убывающая игра: −1 или //2, победа при s ≤ 10. Деление
                перепрыгивает далеко: в ловушку 22 ведут 23, 44 и 45. Позиции
                26–42 пропущены — ни одна не попала в группы.
              </>
            }
          />
          <Typography.Text>Программа находит то же:</Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n" +
              RULES +
              "\n\n\n" +
              G +
              "\n\n\nstarts = range(11, 60)\nprint([s for s in starts if g(s) == -1])\nprint([s for s in starts if g(s) == 2])\nprint([s for s in starts if g(s) == -2])"
            }
            label={"Перебор идёт вверх от порога: S ≥ 11"}
            language="python"
            output={"[22]\n[23, 44, 45]\n[24, 46]"}
          />
        </>
      ),
    },
    {
      id: "okruglenie",
      navLabel: "Округление",
      explanation: (
        <>
          <Typography.Text>
            Как записать «уменьшить в два раза» в коде?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Так, как сказано в условии: округление вниз, вверх или «только
              если делится нацело» — это три разных хода.
            </strong>
          </Typography.Text>
          <VariantPicker
            label={"Слова условия и запись в moves"}
            variants={[
              {
                label: "с округлением вниз",
                value: <Notation>{"s // 2"}</Notation>,
                note: <>21 // 2 = 10</>,
              },
              {
                label: "с округлением вверх",
                value: <Notation>{"(s + 1) // 2"}</Notation>,
                note: <>(21 + 1) // 2 = 11</>,
              },
              {
                label: "если делится нацело",
                value: <Notation>{"if s % 2 == 0"}</Notation>,
                note: <>21 на 2 не делится — хода нет</>,
              },
            ]}
          />
          <Typography.Text>
            Обычное деление и <Notation>{"round"}</Notation> не подходят:{" "}
            <Notation>{"21 / 2"}</Notation> даёт дробное 10.5, а{" "}
            <Notation>{"round(10.5)"}</Notation> — 10, потому что округляет к
            чётному:
          </Typography.Text>
          <CodeBlock
            code={"print(21 // 2, (21 + 1) // 2, 21 / 2, round(10.5))"}
            label={"Три способа поделить 21 пополам"}
            language="python"
            output={"10 11 10.5 10"}
          />
          <Typography.Text>
            Деление на 3 с округлением вверх —{" "}
            <Notation>{"(s + 2) // 3"}</Notation>: к числу добавляют делитель
            без единицы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica",
      navLabel: "Граница перебора",
      explanation: (
        <>
          <Typography.Text>
            В условии «S ≥ 11», а сверху границы нет. До какого S перебирать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Наименьшее S ищут вверх от порога, пока не найдётся. Для
              наибольшего нужна граница из рассуждения: дальше неё ответов быть
              не может.
            </strong>{" "}
            Найдём наибольшее S, при котором Ваня может выиграть первым ходом
            после неудачного хода Пети.
          </Typography.Text>
          <Typography.Text>
            Быстрее всего куча убывает от двух делений подряд: из S получается S
            // 4. Чтобы Ваня дошёл до порога, нужно S // 4 ≤ 10, а это верно
            только до S = 43: 43 // 4 = 10, но 44 // 4 = 11. Значит, ответ не
            больше 43, и перебора до 1000 хватит с запасом:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n" +
              RULES +
              "\n\n\n" +
              G +
              "\n\n\ndef mistake(s):\n    return any(not finished(q) and g(q) == 1\n               for q in moves(s))\n\n\nprint(max(s for s in range(11, 1000) if mistake(s)))"
            }
            label={"Наибольшее S с запасом по границе"}
            language="python"
            output={"43"}
          />
          <Typography.Text>
            Если спрашивают о гарантии — «при любом ходе Пети Ваня выигрывает
            первым ходом», — граница другая. Ваня должен выиграть даже после
            самого медленного хода Пети, здесь это −1. Значит, S − 1 должно быть
            В1, то есть S − 1 ≤ 21 и S ≤ 22. Дальше П1 быть не может.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: очень большие S">
            <Typography.Text>
              В экзаменационных задачах порог бывает в десятки тысяч камней.
              Перебирай S вверх от порога: тогда для каждого нового S позиции
              ниже уже запомнены, и рекурсия неглубокая. Если начать сразу с
              огромного S, цепочка вызовов −1, −1, −1… упрётся в{" "}
              <PythonTerm term="reclimit">предел глубины рекурсии</PythonTerm>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "hody-s-usloviem",
      navLabel: "Ходы с условием",
      explanation: (
        <>
          <Typography.Text>
            Как записать ход, который разрешён не всегда?
          </Typography.Text>
          <Typography.Text>
            <strong>
              В <Notation>{"moves"}</Notation> ход добавляют только после
              проверки условия.
            </strong>{" "}
            Пусть делить пополам можно только чётную кучу:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\ndef moves(s):\n    result = [s - 1]\n    if s % 2 == 0:\n        result.append(s // 2)\n    return result\n\n\ndef finished(s):\n    return s <= 10\n\n\n" +
              G +
              "\n\n\nprint(moves(13), moves(14))\nprint([s for s in range(11, 30) if g(s) == -1])"
            }
            label={"Ход появляется после проверки {{if|if}}"}
            language="python"
            output={"[12] [13, 7]\n[13, 15, 17, 19, 21]"}
          />
          <Typography.Text>
            Условие меняет все группы. Без него 13 была В1 (13 // 2 = 6), а
            теперь из 13 один ход — в 12, а это В1 соперника. Так же пишут «если
            кратно трём», «добавить делитель числа», «добавлять только в меньшую
            кучу».
          </Typography.Text>
          <Typography.Text>
            Запрещённый результат тоже убирают в <Notation>{"moves"}</Notation>.
            «Превышать 21 нельзя» —{" "}
            <Notation>{"[q for q in (s + 1, s * 2) if q <= 21]"}</Notation>, а{" "}
            <Notation>{"finished"}</Notation> тогда проверяет{" "}
            <Notation>{"s == 21"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bez-hodov",
      navLabel: "Позиция без ходов",
      explanation: (
        <>
          <Typography.Text>
            Что делает <Notation>{"g"}</Notation>, если из позиции нет ни одного
            хода?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Возвращает −1, и это обычно ошибка: для пустого списка{" "}
              <Notation>{"all"}</Notation> даёт <Notation>{"True"}</Notation>.
            </strong>{" "}
            Пусть к куче можно добавить её делитель d, 1 {"<"} d {"<"} s, а
            выигрывает получивший не менее 30 камней. У простого числа таких
            делителей нет:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\ndef moves(s):\n    return [s + d for d in range(2, s) if s % d == 0]\n\n\ndef finished(s):\n    return s >= 30\n\n\n" +
              G +
              "\n\n\nprint(moves(12), moves(7), g(7))"
            }
            label={"У простого числа нет ходов"}
            language="python"
            output={"[14, 15, 16, 18] [] -1"}
          />
          <Typography.Text>
            Из 7 Петя не может сходить вовсе, а программа назвала 7 позицией П1:
            ни одного хода — значит, «все ходы ведут в В1».{" "}
            <PythonTerm term="anyall">
              <Notation>{"all([])"}</Notation>
            </PythonTerm>{" "}
            верен, потому что нарушений нет. Что значит позиция без ходов,
            решает условие. Если она не должна попадать в ответ, добавь в начало{" "}
            <Notation>{"g"}</Notation> строку{" "}
            <Notation>{"if not nxt: return 0"}</Notation> — сразу после{" "}
            <Notation>{"nxt = moves(s)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "umenshenie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Уменьшение",
                note: <>те же группы; перебор вверх от порога</>,
              },
              {
                key: "Вниз",
                note: <Notation>{"s // 2"}</Notation>,
              },
              {
                key: "Вверх",
                note: <Notation>{"(s + 1) // 2"}</Notation>,
              },
              {
                key: "Наибольшее S",
                note: <>граница — самый быстрый спуск до порога</>,
              },
              {
                key: "Ход с условием",
                note: (
                  <>
                    добавить в <Notation>{"moves"}</Notation> после{" "}
                    <Notation>{"if"}</Notation>
                  </>
                ),
              },
              {
                key: "Нет ходов",
                note: (
                  <>
                    <Notation>{"all([])"}</Notation> — True: решить по условию
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
          Игра: убрать один камень или разделить кучу на 2 с округлением вниз,
          победа при s ≤ 10. Почему 22 — П1?
        </>
      ),
      reveal: (
        <>
          Из 22 получаются 21 и 11, а из обеих соперник выигрывает сразу: 21 //
          2 = 10 и 11 − 1 = 10.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>До какого наибольшего S верно s // 4 ≤ 12?</>,
      reveal: <>До 51: 51 // 4 = 12, а 52 // 4 = 13.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Кучу можно уменьшить в три раза с округлением вверх. Как записать этот
          ход для s?
        </>
      ),
      reveal: (
        <>
          <Notation>{"(s + 2) // 3"}</Notation>: например, 10 → 4, а 9 → 3.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Ход «уменьшить вдвое» разрешён только для чётной кучи. Что вернёт{" "}
          <Notation>{"moves(15)"}</Notation> в игре «−1 или //2»?
        </>
      ),
      reveal: (
        <>
          <Notation>{"[14]"}</Notation>: 15 нечётное, деления нет.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Почему для наименьшего S граница перебора не нужна, а для наибольшего
          — нужна?
        </>
      ),
      reveal: (
        <>
          Наименьшее — первое найденное при переборе вверх. Наибольшее можно
          назвать, только зная, что дальше подходящих S нет, — это и даёт
          граница.
        </>
      ),
    },
  ],
};

export default content;
