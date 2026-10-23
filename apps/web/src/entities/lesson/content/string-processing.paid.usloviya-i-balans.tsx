// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonSummary,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.usloviya-i-balans.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "znachenie-nol",
      navLabel: "Значение равно нулю",
      explanation: (
        <>
          <Typography.Text>
            Это дополнительный урок: такие условия есть в сборниках и пробниках,
            а задачи основных подтем решаются без него. Нужно самое длинное
            корректное выражение с + и *, значение которого равно нулю. Неужели
            придётся вычислять все выражения?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет. Сумма неотрицательных чисел равна нулю, только если каждое
              слагаемое — ноль. А произведение равно нулю, когда среди
              множителей есть 0. Значит, выражение — сумма произведений, и в
              каждом произведении есть число 0.
            </strong>{" "}
            Это снова шаблон: слагаемое — множители через *, среди которых 0.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = '12*0+5*0*7+3'\nnumber = r'(?:0|[1-9][0-9]*)'\nterm = r'(?:' + number + r'\\*)*0(?:\\*' + number + r')*'\npattern = term + r'(?:\\+' + term + r')*'\nfor m in re.finditer(pattern, s):\n    print(m.group())"
            }
            label={"Выражения со значением 0"}
            language="python"
            output={"12*0+5*0*7"}
          />
          <Typography.Text>
            12*0 и 5*0*7 равны нулю, а слагаемое 3 — нет, на нём выражение
            обрывается. Внутри шаблона * пишут как <Notation>{"\\*"}</Notation>:
            без обратной косой черты звёздочка значит «сколько угодно раз».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ne-bolee-k-chisel",
      navLabel: "Не более K чисел",
      explanation: (
        <>
          <Typography.Text>
            Нужно самое длинное корректное выражение, в котором не больше двух
            чисел. Почему нельзя просто поменять * в шаблоне на «не больше
            одного повтора»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Потому что finditer отдаст непересекающиеся куски и может
              разрезать выражение неудачно. Надёжнее найти длинные выражения
              целиком, а внутри каждого перебрать окна из K соседних чисел.
            </strong>{" "}
            В строке 1+2+345678 при поиске сразу по два числа найдётся 1+2, а за
            ним 345678 — и лучший кусок 2+345678 потеряется.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = '1+2+345678'\nK = 2\nbest = 0\nfor e in re.finditer(r'[1-9]+(?:[+*][1-9]+)*', s):\n    numbers = list(re.finditer(r'[1-9]+', e.group()))\n    for j in range(len(numbers)):\n        i = max(0, j - K + 1)\n        best = max(best, numbers[j].end() - numbers[i].start())\n\nprint(best)"
            }
            label={"Не больше двух чисел в выражении"}
            language="python"
            output={"8"}
          />
          <Typography.Text>
            <Notation>{"numbers[j].start()"}</Notation> и{" "}
            <Notation>{"numbers[j].end()"}</Notation> — где число начинается и
            где кончается внутри выражения. Окно из чисел с i по j — это кусок
            от начала i-го числа до конца j-го. Обрезать крайние числа
            невыгодно: длина уменьшится, а чисел меньше не станет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "poryadok-dejstvij",
      navLabel: "Порядок действий",
      explanation: (
        <>
          <Typography.Text>
            Нужно выражение, в котором действия слева направо дают тот же
            порядок, что и правила математики. Когда это так?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Когда после первого + или − умножения уже нет. 2*3+4 считается
              слева направо правильно, а в 2+3*4 умножение надо сделать раньше
              сложения.
            </strong>{" "}
            Идём по найденному выражению и помним последний + или −. Встретили *
            после него — начало куска переносим за этот знак.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = '6*2-3*4-5'\nnumber = r'(?:0|[1-9][0-9]*)'\npattern = number + r'(?:[-+*]' + number + r')*'\nbest = 0\nfor match in re.finditer(pattern, s):\n    text = match.group()\n    start = 0\n    last = -1\n    for i in range(len(text)):\n        if text[i] in '+-':\n            last = i\n        elif text[i] == '*' and last >= start:\n            start = last + 1\n        best = max(best, i - start + 1)\n\nprint(best)"
            }
            label={"Порядок слева направо совпадает с математическим"}
            language="python"
            output={"5"}
          />
          <Typography.Text>
            Подходят 6*2-3 и 3*4-5, по 5 символов. Всё выражение — нет:
            умножение 3*4 стоит после вычитания.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summa-posle-bukvy",
      navLabel: "Сумма после буквы",
      explanation: (
        <>
          <Typography.Text>
            Нужно наибольшее значение суммы натуральных чисел со знаками + и −,
            которая стоит сразу после буквы C. Самая длинная сумма — самая
            большая?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: вычитание её уменьшает. Поэтому перебирают начальные части
              суммы, которые кончаются целым числом, и считают значение каждой.
            </strong>{" "}
            Обрывать число посередине невыгодно: после + целое число больше
            своего начала, а перед − выгоднее остановиться вовсе.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = 'C12+5-30+7D3+4'\nbest = None\nfor match in re.finditer(r'C([1-9]+(?:[-+][1-9]+)*)', s):\n    total = 0\n    for term in re.finditer(r'([-+]?)([1-9]+)', match.group(1)):\n        value = int(term.group(2))\n        if term.group(1) == '-':\n            total -= value\n        else:\n            total += value\n        if best is None or total > best:\n            best = total\n\nprint(best)"
            }
            label={"Наибольшая сумма после буквы C"}
            language="python"
            output={"17"}
          />
          <Typography.Text>
            Круглые скобки в шаблоне запоминают части совпадения:{" "}
            <Notation>{"match.group(1)"}</Notation> — сама сумма без буквы C,{" "}
            <Notation>{"term.group(1)"}</Notation> — знак,{" "}
            <Notation>{"term.group(2)"}</Notation> — число. Начальные части 12,
            12+5, 12+5-30, 12+5-30+7 дают 12, 17, −13 и −6; наибольшее — 17.
            Сумма 3+4 стоит после D и не считается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "balans",
      navLabel: "Баланс",
      explanation: (
        <>
          <Typography.Text>
            Нужен самый длинный фрагмент, в котором букв ровно вдвое больше, чем
            цифр. Окно здесь не работает: условие то выполняется, то нет, и
            непонятно, когда сдвигать левую границу. Что делать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Считать баланс: за букву +1, за цифру −2. Во фрагменте букв вдвое
              больше цифр, когда его баланс равен нулю — то есть когда на его
              границах накопленный баланс одинаковый.
            </strong>{" "}
            Для каждого значения баланса запоминаем, где оно встретилось
            впервые: от первого появления до текущего символа — самый длинный
            подходящий фрагмент с таким концом.
          </Typography.Text>
          <Typography.Text>
            Запусти по шагам строку MKL1N и следи за словарём first.{" "}
            <Notation>{"first = {0: -1}"}</Notation> значит: до начала строки,
            на условной позиции −1, баланс был нулевым.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runBalance}
            label={"Букв вдвое больше цифр — баланс по шагам"}
          />
          <Typography.Text>
            После M баланс 1, на позиции 3 — снова 1: между ними фрагмент KL1,
            две буквы и одна цифра. Ответ — 3. Если в строке есть символы,
            которые не буквы и не цифры, сначала реши по условию, дают ли они 0
            или обрывают фрагмент.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "usloviya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Значение 0",
                note: <>каждое слагаемое — произведение с нулём</>,
              },
              {
                key: "Не более K чисел",
                note: <>сначала целые выражения, потом окна из K чисел</>,
              },
              {
                key: "Порядок действий",
                note: <>после + или − умножения нет</>,
              },
              {
                key: "Сумма после буквы",
                note: <>перебор начальных частей до целого числа</>,
              },
              {
                key: "Баланс",
                note: (
                  <>
                    одинаковый на границах —{" "}
                    <PythonTerm term="dict">словарь</PythonTerm> первых
                    появлений
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
      prompt: <>Равно ли нулю значение выражения 0*5+7*0? А 0+3*0*2+1?</>,
      reveal: (
        <>
          Первое — да: в каждом слагаемом есть 0. Второе — нет: слагаемое 1 без
          нуля.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Какое выражение не больше чем из двух чисел самое длинное в строке
          9*8+76+5?
        </>
      ),
      reveal: <>8+76, 4 символа. 9*8 и 76+5 короче.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          В каких выражениях порядок действий слева направо совпадает с
          математическим: 7*2-5, 7-2*5, 3*4*5-1?
        </>
      ),
      reveal: <>7*2-5 и 3*4*5-1. В 7-2*5 умножение стоит после вычитания.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          За букву +1, за цифру −2. На позициях 3 и 9 баланс одинаковый. Что
          можно сказать о фрагменте с 4-й по 9-ю позицию?
        </>
      ),
      reveal: (
        <>
          Его баланс 0: букв в нём ровно вдвое больше, чем цифр — четыре буквы и
          две цифры.
        </>
      ),
    },
  ],
};

export default content;
