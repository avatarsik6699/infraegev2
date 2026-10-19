// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./winning-strategy.paid.umenshenie-i-usloviya.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "te-zhe-proverki",
      navLabel: "Те же проверки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Игры с уменьшением кучи и игры с ходами по условию решаются теми
              же логическими проверками: меняются только разрешённые действия и
              условие окончания.
            </strong>{" "}
            В последних вариантах кучу часто уменьшают — вычитанием и делением с
            округлением, а ходы бывают разрешены только при условии: «если число
            чётное», «если делится на 3».
          </Typography.Text>
          <Typography.Text>
            Учебная игра: разрешено убрать один камень либо разделить количество
            камней на 2 с округлением вниз, выигрывает получивший не более 10
            камней, первоначально S ≥ 11.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "umenshenie-kuchi",
      navLabel: "Уменьшение кучи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Уменьшение кучи записывается теми же двумя функциями.
            </strong>{" "}
            Правила:
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(s):\n    return [s - 1, s // 2]\n\n\ndef finished(s):\n    return s <= 10"
            }
            label={
              "Уменьшение кучи записывается теми же двумя функциями. Правила"
            }
            language="python"
          />
          <Typography.Text>
            Операция{" "}
            <PythonTerm term="intdiv">
              <Notation>{"//"}</Notation>
            </PythonTerm>{" "}
            для неотрицательных целых чисел означает целочисленное деление с
            округлением вниз:
          </Typography.Text>
          <CodeBlock
            code={"print(20 // 2, 21 // 2, 22 // 2)"}
            label={"Код на Python: print(20 // 2, 21 // 2, 22 // 2)"}
            language="python"
            output={"10 10 11"}
          />
          <Typography.Text>
            Поэтому из 21 можно выиграть сразу: 21 → 10. А из 22 делением
            получится 11 — игра ещё продолжается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "blizhajshie-gruppy",
      navLabel: "Ближайшие группы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ближайшие группы позиций находят так же, от конца игры.
            </strong>{" "}
            <Notation>{"W1"}</Notation> — 11, 12, …, 21.{" "}
            <Notation>{"L1"}</Notation> — 22, потому что 22 → 21 или 22 → 11, и
            оба результата — <Notation>{"W1"}</Notation>. Для{" "}
            <Notation>{"W2"}</Notation> нужно одним ходом попасть в 22.
            Убавлением единицы: S − 1 = 22, S = 23. Делением на 2 с округлением
            вниз: 44 // 2 = 22 и 45 // 2 = 22. Поэтому{" "}
            <strong>W2 = 23, 44, 45</strong>.
          </Typography.Text>
          <Typography.Text>
            Для этой игры <Notation>{"L2"}</Notation> — позиции 24 и 46.
            Проверим: 24 → 23 или 24 → 12, здесь 23 —{" "}
            <Notation>{"W2"}</Notation>, а 12 — <Notation>{"W1"}</Notation>. И
            46 → 45 или 46 → 23, здесь оба результата —{" "}
            <Notation>{"W2"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gameLine11_46_12_10_11254347}
            caption={
              <>
                Убывающая игра: −1 или //2, победа при s ≤ 10. Деление
                перепрыгивает далеко: в ловушку 22 ведут 23, 44 и 45. Позиции
                26–42 пропущены — ни одна из них не попала в группы.
              </>
            }
          />
          <Typography.Text>
            Функции подтемы 3 с новыми <Notation>{"moves"}</Notation> и{" "}
            <Notation>{"finished"}</Notation> дают то же самое. Перебор идёт{" "}
            <strong>вверх от порога</strong>: S ≥ 11.
          </Typography.Text>
          <CodeBlock
            code={
              "print([s for s in range(11, 60) if lose1(s)])\nprint([s for s in range(11, 60) if win2(s)])\nprint([s for s in range(11, 60) if lose2(s)])"
            }
            label={"Перебор идёт вверх от порога: S ≥ 11"}
            language="python"
            output={"[22]\n[23, 44, 45]\n[24, 46]"}
          />
          <Typography.Text>
            Таким образом, даже при уменьшении кучи работают те же правила: есть
            победный ход; все ходы дают сопернику немедленную победу; есть
            переход в такую ловушку; все ходы дают сопернику победу за один или
            два его хода.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "okruglenie",
      navLabel: "Округление",
      explanation: (
        <>
          <Typography.Text>
            <strong>Округление нужно переносить из условия буквально.</strong>{" "}
            Для положительных целых чисел каждый вид деления записывается
            по-своему:
          </Typography.Text>
          <VariantPicker
            label={"Что требует условие и как записать"}
            variants={[
              {
                label: "Деление с округлением вниз",
                value: (
                  <>
                    <Notation>{"s // d"}</Notation>
                  </>
                ),
                note: <>21 // 2 = 10</>,
              },
              {
                label: "Деление с округлением вверх",
                value: (
                  <>
                    <Notation>{"(s + d - 1) // d"}</Notation>
                  </>
                ),
                note: <>(21 + 1) // 2 = 11</>,
              },
              {
                label: "Деление только при делимости без остатка",
                value: (
                  <>
                    сначала проверить <Notation>{"s % d == 0"}</Notation>
                  </>
                ),
                note: <>21 на 2 не делится — хода нет</>,
              },
            ]}
          />
          <Typography.Text>
            <Notation>{"%"}</Notation> возвращает остаток от деления. Обычное{" "}
            <Notation>{"/"}</Notation> может дать дробное число, а{" "}
            <PythonTerm term="round">
              <Notation>{"round()"}</Notation>
            </PythonTerm>{" "}
            округляет по другому правилу.{" "}
            <strong>Подставлять их вместо нужного округления нельзя:</strong>
          </Typography.Text>
          <CodeBlock
            code={
              "print(10 % 3, 12 % 3)\nprint(21 / 2, round(10.5), (21 + 1) // 2)"
            }
            label={"Подставлять их вместо нужного округления нельзя"}
            language="python"
            output={"1 0\n10.5 10 11"}
          />
          <Typography.Text>
            Деление вверх через{" "}
            <PythonTerm term="ceil">
              <Notation>{"(s + d - 1) // d"}</Notation>
            </PythonTerm>{" "}
            работает без дробей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica-deleniya",
      navLabel: "Граница деления",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Граница для деления вниз — последнее число, которое ещё делится «в
              порог».
            </strong>{" "}
            Например, s // 4 ≤ 10 выполняется вплоть до s = 43, потому что 43 //
            4 = 10, но 44 // 4 = 11.{" "}
            <strong>Поэтому граница здесь 43, а не 40.</strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naimenshee-i-naibolshee",
      navLabel: "Наименьшее и наибольшее S",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наименьшее S ищут перебором вверх от порога, а для наибольшего
              нужна граница, выведенная из правил.
            </strong>{" "}
            В убывающей игре верхнего предела S в условии нет: «S ≥ 11». Если
            спрашивают наименьшее значение или два наименьших, перебор просто
            идёт вверх, пока они не найдутся. Если спрашивают наибольшее или все
            значения, перебор до случайного числа ничего не доказывает (подтема
            3).
          </Typography.Text>
          <Typography.Text>
            Найдём наибольшее S, при котором Ваня может выиграть первым ходом
            после неудачного хода Пети. Быстрее всего куча уменьшается двумя
            делениями подряд: из S получается S // 2 // 2 = S // 4. Чтобы Ваня
            закончил игру, нужно S // 4 ≤ 10, а это выполняется только до S = 43
            — граница из предыдущего шага.{" "}
            <strong>
              Из любого S ≥ 44 даже самый быстрый спуск за два хода не доходит
              до 10
            </strong>
            , значит, дальше подходящих S нет. Партия 43 → 21 → 10 возможна: ход
            Пети в 21 игру не заканчивает.
          </Typography.Text>
          <CodeBlock
            code={
              "found = [s for s in range(11, 44) if after_mistake(s)]\nprint(max(found))"
            }
            label={
              "Партия 43 → 21 → 10 возможна: ход Пети в 21 игру не заканчивает"
            }
            language="python"
            output={"43"}
          />
          <Typography.Text>
            Для гарантии (<Notation>{"L1"}</Notation>) рассуждают наоборот:{" "}
            <strong>
              после каждого хода Пети, даже самого слабого, у Вани должен быть
              победный ход
            </strong>
            , поэтому границу даёт самый медленный ход Пети. Здесь самый
            медленный — −1: из S − 1 Ваня должен выиграть, то есть S − 1 ≤ 21, S
            ≤ 22.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "hody-s-usloviem",
      navLabel: "Ходы с условием",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если некоторые команды разрешены только при определённых условиях,
              в <Notation>{"moves"}</Notation> включаются только разрешённые
              действия.
            </strong>{" "}
            Например, деление на 2 — только без остатка. Ход появляется в списке
            после проверки{" "}
            <PythonTerm term="if">
              <Notation>{"if"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(s):\n    result = [s - 1]\n\n    if s % 2 == 0:\n        result.append(s // 2)\n\n    return result\n\n\nprint(moves(13), moves(14))\nprint([s for s in range(11, 30) if lose1(s)])"
            }
            label={"Ход появляется в списке после проверки {{if|if}}"}
            language="python"
            output={"[12] [13, 7]\n[13, 15, 17, 19, 21]"}
          />
          <Typography.Text>
            <strong>Условие меняет всю картину групп.</strong> Без него 13 была{" "}
            <Notation>{"W1"}</Notation> (13 // 2 = 6), а теперь из 13 есть
            только ход в 12, и это <Notation>{"L1"}</Notation>. Так же
            записывают любые ходы с условием: «если чётное — уменьшить вдвое,
            если кратно трём — на треть», «добавить делитель числа», а в двух
            кучах — «добавлять только в меньшую кучу»: проверка{" "}
            <Notation>{"if a <= b:"}</Notation> выбирает, какую кучу можно
            менять.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapreshchyonnyj-rezultat",
      navLabel: "Запрещённый результат",
      explanation: (
        <>
          <Typography.Text>
            <strong>Запрещённый результат удаляют из списка ходов.</strong> Это
            делают <PythonTerm term="comp">списковым включением</PythonTerm>.
            Если нужно попасть <strong>ровно</strong> в заданное число и
            превышение запрещено, необходимо не только изменить проверку
            окончания, но и убрать запрещённые ходы:
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(s):\n    candidates = [s + 1, s * 2]\n    return [q for q in candidates if q <= 21]\n\n\ndef finished(s):\n    return s == 21\n\n\nprint(moves(11), moves(15), finished(21))"
            }
            label={"Код на Python: def moves(s):"}
            language="python"
            output={"[12] [16] True"}
          />
          <Typography.Text>
            Конструкция{" "}
            <Notation>{"[q for q in candidates if q <= 21]"}</Notation> создаёт
            список из тех кандидатов <Notation>{"q"}</Notation>, для которых
            выполнено условие <Notation>{"q <= 21"}</Notation>. Так же
            запрещают, например, ход, после которого количество камней делится
            на 3: <Notation>{"q % 3 != 0"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если же превышение порога разрешено, но приводит к поражению
            сделавшего ход, это уже другой исход завершения.{" "}
            <strong>
              Нельзя считать любой конец победой предыдущего игрока
            </strong>
            : функция должна различать победное завершение и проигрышное.
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
            <strong>
              Позицию без ходов обрабатывают отдельно:{" "}
              <Notation>{"all"}</Notation> от пустого списка даёт{" "}
              <Notation>{"True"}</Notation>.
            </strong>{" "}
            Функции подтемы 3 рассчитаны на игры, где у каждой незавершённой
            позиции есть хотя бы один разрешённый ход. Если ходы зависят от
            делителей, это не так. Пусть к куче можно добавить её делитель d,
            где 1 {"<"} d {"<"} s, а побеждает получивший не менее 30 камней. У
            простого числа таких делителей нет:
          </Typography.Text>
          <CodeBlock
            code={
              "def moves(s):\n    return [s + d for d in range(2, s) if s % d == 0]\n\n\ndef finished(s):\n    return s >= 30\n\n\nprint(moves(12), moves(7))\nprint(lose1(7))"
            }
            label={"У простого числа таких делителей нет"}
            language="python"
            output={"[14, 15, 16, 18] []\nTrue"}
          />
          <Typography.Text>
            <Notation>{"lose1(7)"}</Notation> проверяет «все ходы ведут в{" "}
            <Notation>{"W1"}</Notation>», а ходов нет — и{" "}
            <PythonTerm term="anyall">
              <Notation>{"all([])"}</Notation>
            </PythonTerm>{" "}
            даёт <Notation>{"True"}</Notation>: нет ни одного нарушения. Но из 7
            Петя вообще не может сходить, и что это значит, решает условие. В
            задачах с делителями так бывает и с S = 1, и без такой проверки
            ответ получается на одно значение больше. Исправление — потребовать,
            чтобы ходы были: <Notation>{"moves(p) and all(...)"}</Notation>, или
            исключить такие S из перебора по условию.
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
                note: (
                  <>
                    Уменьшение кучи — те же функции с другими{" "}
                    <Notation>{"moves"}</Notation> и{" "}
                    <Notation>{"finished"}</Notation>; перебор S идёт вверх от
                    порога.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Округление переносят буквально: <Notation>{"//"}</Notation>{" "}
                    — вниз, <Notation>{"(s + d - 1) // d"}</Notation> — вверх,{" "}
                    <Notation>{"s % d == 0"}</Notation> — ход только при
                    делимости.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Для наибольшего S без верхней границы выводят границу: самый
                    быстрый спуск для неудачного хода, самый медленный ход Пети
                    — для гарантии.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Ход по условию — <Notation>{"if"}</Notation> в{" "}
                    <Notation>{"moves"}</Notation>, запрещённый результат —
                    фильтр списка; позицию без ходов обрабатывают отдельно.
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
      id: "zadacha-2",
      prompt: (
        <>
          Ход: разделить кучу на 3 с округлением вверх. Запиши выражение для{" "}
          <Notation>{"moves"}</Notation>. Что получится из 20 и из 21?
        </>
      ),
      reveal: (
        <>
          <Notation>{"(s + 2) // 3"}</Notation>: из 20 получается 7, из 21 —
          тоже 7.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Игра: убрать два камня или разделить кучу на 3 с округлением вниз,
          выигрывает получивший не более 15 камней, S ≥ 16. Найди вручную{" "}
          <Notation>{"W1"}</Notation>, <Notation>{"L1"}</Notation> и{" "}
          <Notation>{"W2"}</Notation>.
        </>
      ),
      reveal: (
        <>
          <Notation>{"W1"}</Notation>: 16–47 (47 // 3 = 15);{" "}
          <Notation>{"L1"}</Notation>: 48, 49 (оба хода ведут в{" "}
          <Notation>{"W1"}</Notation>); <Notation>{"W2"}</Notation>: 50, 51 (−2)
          и 144–149 (деление на 3 даёт 48 или 49).
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Игра: убрать один камень; если количество камней делится на 3, можно
          уменьшить его в три раза. Выигрывает получивший не более 10 камней.
          Найди программой все <Notation>{"L1"}</Notation> при 11 ≤ S ≤ 40 и
          наименьшую позицию <Notation>{"L2"}</Notation>.
        </>
      ),
      reveal: (
        <>
          <Notation>{"L1"}</Notation>: 13, 16, 19, 22, 25, 28, 31; наименьшая{" "}
          <Notation>{"L2"}</Notation> — 33.
        </>
      ),
    },
    {
      id: "zadacha-6",
      prompt: (
        <>
          В игре «добавить делитель d, 1 {"<"} d {"<"} s, победа при s ≥ 30» при
          каких S от 2 до 10 нет ни одного хода? Что вернёт для них{" "}
          <Notation>{"lose1"}</Notation> и как это исправить?
        </>
      ),
      reveal: (
        <>
          2, 3, 5, 7 — у простых чисел нет делителей между 1 и s.{" "}
          <Notation>{"lose1"}</Notation> вернёт <Notation>{"True"}</Notation>,
          потому что <Notation>{"all([])"}</Notation> —{" "}
          <Notation>{"True"}</Notation>; нужно проверять, что список ходов не
          пуст.
        </>
      ),
    },
  ],
};

export default content;
