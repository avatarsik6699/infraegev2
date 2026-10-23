import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonExceptionsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-exceptions.media";

export const pythonExceptionsLesson = defineCourseLesson({
  ...pythonExceptionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Перехватывать ошибки",
    "Сообщать об ошибке через raise",
    "Подбирать проверочные примеры",
  ],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Функция <Notation>{"total_and_best"}</Notation> из урока об
            аргументах считает сумму и наибольшее списка. Если файл с числами
            пуст, список тоже пуст, и вызов{" "}
            <Notation>{"total_and_best([])"}</Notation> останавливает программу
            на <Notation>{"numbers[0]"}</Notation> с ошибкой{" "}
            <Notation>{"IndexError: list index out of range"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Такое сообщение — <strong>исключение</strong>: сигнал, что операция
            не смогла выполниться обычным образом.{" "}
            <strong>
              Ожидаемое исключение программа может перехватить и обработать, о
              нарушенной договорённости — сообщить своим понятным исключением, а
              неожиданное должно остановить программу и показать ошибку
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Научимся перехватывать ошибку ввода, сделаем понятное сообщение для
            пустого списка и разберём, как искать ошибки и какими примерами
            проверять функцию.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "try и except",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"try"}</Notation> выполняет действие, которое может не
              получиться, <Notation>{"except"}</Notation> обрабатывает только
              ожидаемую проблему.
            </strong>{" "}
            Ошибки <Notation>{"ValueError"}</Notation> и{" "}
            <Notation>{"ZeroDivisionError"}</Notation> мы видели с первого
            урока. Теперь научимся их обрабатывать:
          </Typography.Text>
          <CodeBlock
            code={
              'text = "abc"\ntry:\n    number = int(text)\nexcept ValueError:\n    print("Нужно ввести целое число")\nelse:\n    print(number * 2)'
            }
            label={"Перехват ValueError при переводе строки в число"}
            language="python"
            fileName="main.py"
            output={"Нужно ввести целое число"}
          />
          <Typography.Text>
            Блок <Notation>{"try"}</Notation> выполняется как обычно. Если в нём
            возникла ошибка <Notation>{"ValueError"}</Notation>, остаток блока
            пропускается и выполняется{" "}
            <Notation>{"except ValueError"}</Notation>.{" "}
            <Notation>{"else"}</Notation> выполняется, только если ошибки не
            было. Схема показывает, какие строки выполнились для двух значений:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tryPaths}
            caption={
              <>
                Для <Notation>{'"abc"'}</Notation> строка с{" "}
                <Notation>{"int"}</Notation> начинает выполняться и прерывается
                ошибкой: <Notation>{"number"}</Notation> не получает значения,
                выполнение переходит к <Notation>{"except"}</Notation>, а{" "}
                <Notation>{"else"}</Notation> пропускается.
              </>
            }
          />
          <Typography.Text>
            Главное применение — повторный ввод: программа просит число, пока не
            получит целое. <Notation>{"while True"}</Notation> из урока о{" "}
            <Notation>{"while"}</Notation> повторяет попытку, а{" "}
            <Notation>{"break"}</Notation> в <Notation>{"else"}</Notation>{" "}
            завершает цикл после удачного ввода:
          </Typography.Text>
          <CodeBlock
            code={
              'while True:\n    text = input("Число: ")\n    try:\n        number = int(text)\n    except ValueError:\n        print("Введите целое число")\n    else:\n        break\nprint(number * 2)'
            }
            label={"Повторный ввод до целого числа"}
            language="python"
            fileName="main.py"
            output={"Число: ⟪три⟫\nВведите целое число\nЧисло: ⟪3⟫\n6"}
          />
          <Typography.Text>
            Не окружай всю программу <Notation>{"except: pass"}</Notation>: так
            спрячутся и твои собственные ошибки. Перехватывай конкретное
            ожидаемое исключение и решай, что делать. Если вход по условию
            всегда правильный, ошибка чтения должна остановить программу — она
            укажет на неверно понятый формат.
          </Typography.Text>
          <Typography.Text>
            После <Notation>{"else"}</Notation> можно добавить{" "}
            <Notation>{"finally"}</Notation>: его блок выполняется в любом
            случае — была ошибка или нет. Запусти цикл по шагам: для{" "}
            <Notation>{'"7"'}</Notation> после <Notation>{"try"}</Notation>{" "}
            выполняется <Notation>{"else"}</Notation>, для{" "}
            <Notation>{'"x"'}</Notation> — <Notation>{"except"}</Notation>, а{" "}
            <Notation>{"finally"}</Notation> — в обоих случаях.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runParseNumbers}
            label={"try, except, else и finally в цикле"}
          />
          <ProofDisclosure summary="Тонкости: зачем finally" kind="nuance">
            <Typography.Text>
              <Notation>{"finally"}</Notation> выполняется и при выходе из
              функции через <Notation>{"return"}</Notation>, поэтому в нём
              освобождают ресурсы. Для файла это уже делает{" "}
              <Notation>{"with"}</Notation>. Если процесс аварийно завершила
              операционная система, Python не гарантирует выполнение{" "}
              <Notation>{"finally"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "raise",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"raise"}</Notation> сообщает о нарушении договорённости
              функции.
            </strong>{" "}
            У пустого списка нет наибольшего, и{" "}
            <Notation>{"total_and_best"}</Notation> должна сказать об этом
            понятно, а не <Notation>{"IndexError"}</Notation> из своей середины:
          </Typography.Text>
          <CodeBlock
            code={
              'def total_and_best(numbers):\n    if not numbers:\n        raise ValueError("Пустой список: наибольшего нет")\n    total = 0\n    best = numbers[0]\n    for x in numbers:\n        total += x\n        if x > best:\n            best = x\n    return total, best\n\nprint(total_and_best([5, -2, 10, 7]))\nprint(total_and_best([]))'
            }
            label={"total_and_best сообщает о пустом списке"}
            language="python"
            fileName="main.py"
            output={"(20, 10)"}
            error={"ValueError: Пустой список: наибольшего нет"}
          />
          <Typography.Text>
            <Notation>{"not numbers"}</Notation> истинно для пустого списка:
            пустые коллекции ложны. <Notation>{"raise"}</Notation> создаёт
            исключение с нашим текстом, и вызов прерывается. Вызывающий код
            перехватывает его, как любое другое:
          </Typography.Text>
          <CodeBlock
            code={
              'try:\n    total, best = total_and_best([])\nexcept ValueError:\n    print("Файл пуст")\nelse:\n    print(total, best)'
            }
            label={"Перехват ValueError из total_and_best"}
            language="python"
            fileName="main.py"
            output={"Файл пуст"}
          />
          <Typography.Text>
            Можно было вернуть <Notation>{"None"}</Notation> вместо наибольшего
            — это тоже договорённость. Нельзя молча вернуть 0: пустой список не
            имеет наибольшего 0. Какое поведение выбрано, пишут в описании
            функции.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Отладка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ошибку ищут по состоянию: печатают промежуточные значения или идут
              отладчиком.
            </strong>{" "}
            <strong>Отладка</strong> — поиск причины, по которой программа
            работает неверно. Простой способ — временно печатать значения
            переменных на каждом шаге:
          </Typography.Text>
          <CodeBlock
            code={
              'numbers = [3, -1, 4]\ntotal = 0\nfor i, value in enumerate(numbers):\n    total += value\n    print("шаг", i, "элемент", value, "сумма", total)'
            }
            label={"Отладочная печать суммы по шагам"}
            language="python"
            fileName="main.py"
            output={
              "шаг 0 элемент 3 сумма 3\nшаг 1 элемент -1 сумма 2\nшаг 2 элемент 4 сумма 6"
            }
          />
          <Typography.Text>
            Такая печать показывает то же, что запуск по шагам в уроках:
            значения после каждой итерации. Ищи шаг, на котором значение впервые
            разошлось с ожидаемым, — ошибка в строках перед ним.
          </Typography.Text>
          <Typography.Text>
            Другой способ — <strong>отладчик</strong>. В PyCharm и VS Code
            щелчок слева от номера строки ставит <strong>точку останова</strong>
            ; запуск в режиме отладки (значок жука) останавливает программу на
            ней, показывает значения переменных и выполняет дальше по одной
            строке.
          </Typography.Text>
          <Typography.Text>
            Перед сдачей решения на автоматическую проверку отладочную печать
            убирают: она станет лишним текстом в ответе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "assert",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"assert"}</Notation> проверяет предположение автора
              программы.
            </strong>{" "}
            <Notation>{"assert условие"}</Notation> молчит, если условие
            истинно, и вызывает <Notation>{"AssertionError"}</Notation>, если
            ложно:
          </Typography.Text>
          <CodeBlock
            code={
              "def double(number):\n    return number * 2\n\nassert double(4) == 8\nassert double(-3) == -6\nassert double(5) == 11"
            }
            label={"Проверки функции double через assert"}
            language="python"
            fileName="main.py"
            error={"AssertionError"}
          />
          <Typography.Text>
            Первые две проверки прошли молча, третья ложна — в ней ошибся автор
            проверки: 5 · 2 = 10. Так быстро проверяют свою функцию на
            нескольких примерах.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: assert и python -O" kind="nuance">
            <Typography.Text>
              При запуске <Notation>{"python -O"}</Notation> проверки{" "}
              <Notation>{"assert"}</Notation> отключаются. Поэтому проверять
              ввод пользователя через <Notation>{"assert"}</Notation> нельзя —
              для этого <Notation>{"if"}</Notation> и{" "}
              <Notation>{"raise"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Проверочные примеры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Проверочные примеры выбирают так, чтобы каждый ловил свою ошибку.
            </strong>{" "}
            Один удачный пример ничего не доказывает. Проверь обычный случай,
            самый маленький вход, пустой вход, отрицательные числа и повторы,
            если они разрешены. Для <Notation>{"total_and_best"}</Notation>{" "}
            набор может быть таким:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"[5, -2, 10, 7]"}</Notation> — обычный случай, ловит
              неверную формулу;
            </li>
            <li>
              <Notation>{"[5]"}</Notation> — один элемент, ловит ошибку границы
              цикла;
            </li>
            <li>
              <Notation>{"[]"}</Notation> — пустой вход, ловит{" "}
              <Notation>{"IndexError"}</Notation> вместо выбранного{" "}
              <Notation>{"ValueError"}</Notation>;
            </li>
            <li>
              <Notation>{"[-4, -2]"}</Notation> — только отрицательные, ловят
              начальное <Notation>{"best = 0"}</Notation>;
            </li>
            <li>
              <Notation>{"[3, 3]"}</Notation> — повторы, ловят сравнение{" "}
              <Notation>{">="}</Notation> там, где это важно.
            </li>
          </ul>
          <Typography.Text>
            Для цикла от <Notation>{"a"}</Notation> до{" "}
            <Notation>{"b"}</Notation> добавь случай{" "}
            <Notation>{"a == b"}</Notation>, для пар соседей — списки длины 0, 1
            и 2. Входы, которые функция по договорённости не принимает,
            проверять не нужно, но эту границу надо знать.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{"total_and_best"}</Notation> мало проверить только
            на <Notation>{"[1, 2, 3]"}</Notation>? Какие примеры добавить?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Этот пример не проверит один элемент, пустой вход и отрицательные
            числа. Добавь <Notation>{"[5]"}</Notation>,{" "}
            <Notation>{"[-4, -2]"}</Notation> и <Notation>{"[]"}</Notation> —
            для него ожидается <Notation>{"ValueError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            В программе повторного ввода ввели <Notation>{"2.5"}</Notation>,
            затем <Notation>{"4"}</Notation>. Что она напечатает после этих
            вводов?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «Введите целое число» — <Notation>{'int("2.5")'}</Notation> даёт{" "}
            <Notation>{"ValueError"}</Notation>; затем 8.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает цикл с <Notation>{"finally"}</Notation> из урока для
            списка <Notation>{'["x", "3"]'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «x — не число», «проверено x», 6 и «проверено 3».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Какие две строки отладочной печати выведет цикл из урока для списка{" "}
            <Notation>{"[5, -5]"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «шаг 0 элемент 5 сумма 5» и «шаг 1 элемент -5 сумма 0».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Чем <Notation>{"raise ValueError(...)"}</Notation> в начале{" "}
            <Notation>{"total_and_best"}</Notation> лучше, чем{" "}
            <Notation>{"IndexError"}</Notation> на{" "}
            <Notation>{"numbers[0]"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Сообщение называет причину — пустой список, а не индекс в середине
            функции; вызывающий код перехватывает именно ожидаемую ошибку.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Исключение — сигнал о неудаче: ожидаемое перехватывают, о нарушенной
        договорённости сообщают сами, а остальное должно остановить программу.
        Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: (
              <>
                <Notation>{"try"}</Notation>/<Notation>{"except"}</Notation>
              </>
            ),
            note: (
              <>
                <Notation>{"except Тип"}</Notation> — только ожидаемая ошибка;{" "}
                <Notation>{"else"}</Notation> — если ошибки не было,{" "}
                <Notation>{"finally"}</Notation> — всегда.
              </>
            ),
          },
          {
            key: "Повторный ввод",
            note: (
              <>
                <Notation>{"while True"}</Notation> +{" "}
                <Notation>{"try"}</Notation>, <Notation>{"break"}</Notation> в{" "}
                <Notation>{"else"}</Notation>;{" "}
                <Notation>{"except: pass"}</Notation> не пишут.
              </>
            ),
          },
          {
            key: <Notation>{"raise"}</Notation>,
            note: (
              <>
                <Notation>{'raise ValueError("…")'}</Notation> — понятное
                сообщение о нарушенной договорённости функции.
              </>
            ),
          },
          {
            key: "Отладка",
            note: (
              <>
                Печать состояния по шагам или точка останова в отладчике;
                отладочный вывод удаляют.
              </>
            ),
          },
          {
            key: <Notation>{"assert"}</Notation>,
            note: (
              <>
                Проверка автора; примеры подбирают на один элемент, пустой вход,
                отрицательные числа и повторы.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
