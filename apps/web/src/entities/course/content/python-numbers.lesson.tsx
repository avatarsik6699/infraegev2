import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  RemainderExplorer,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonNumbersLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-numbers.media";

export const pythonNumbersLesson = defineCourseLesson({
  ...pythonNumbersLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Пользоваться //", "%", "**", "Брать цифры числа"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Целое деление <Notation>{"//"}</Notation> и остаток{" "}
              <Notation>{"%"}</Notation> вместе описывают одно равенство{" "}
              <Notation>{"a = (a // b) * b + a % b"}</Notation>
            </strong>
            . Из него следуют проверка делимости, последняя цифра числа и
            разложение секунд на часы и минуты. Опора — урок о значениях: здесь
            те же <Notation>{"int"}</Notation> и <Notation>{"float"}</Notation>,
            но с операциями над ними.
          </Typography.Text>
          <Typography.Text>
            Все примеры урока держатся на числе 23 и делителе 5: в 23 содержатся
            четыре полные пятёрки и ещё 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Семь операций",
      explanation: (
        <>
          <Typography.Text>
            <strong>В Python семь основных арифметических операций.</strong> Три
            из них работают как в математике: сложение{" "}
            <Notation>{"+"}</Notation>, вычитание <Notation>{"-"}</Notation> и
            умножение <Notation>{"*"}</Notation>. Новое — три вида деления и
            степень <Notation>{"**"}</Notation>: <Notation>{"2 ** 5"}</Notation>{" "}
            — это 2⁵ = 32.
          </Typography.Text>
          <Typography.Text>
            Обычное деление <Notation>{"/"}</Notation> всегда даёт дробное
            число, даже если делится нацело: <Notation>{"8 / 2"}</Notation> —
            это <Notation>{"4.0"}</Notation>, а не <Notation>{"4"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Для целых <Notation>{"a"}</Notation> и <Notation>{"b"}</Notation> с
            ненулевым <Notation>{"b"}</Notation> выполняется:
          </Typography.Text>
          <Typography.Text>
            <Notation>{"a = (a // b) * b + a % b"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Это объясняет одновременно частное и остаток. Разделим 23 на 5 тремя
            способами:
          </Typography.Text>
          <CodeBlock
            code={
              "print(23 / 5)\nprint(23 // 5)\nprint(23 % 5)\nprint(23 // 5 * 5 + 23 % 5)"
            }
            label={
              "Это объясняет одновременно частное и остаток. Разделим 23 на 5 тремя способами"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"4.6\n4\n3\n23"}
          />
          <Typography.Text>
            <Notation>{"/"}</Notation> даёт точное частное 4.6,{" "}
            <Notation>{"//"}</Notation> — сколько в 23 полных пятёрок, то есть
            4, а <Notation>{"%"}</Notation> — сколько осталось сверх них, то
            есть 3. Последняя строка собирает 23 обратно из частного и остатка.
          </Typography.Text>
          <RemainderExplorer
            n={23}
            d={5}
            caption={
              <>
                Клетки числа n разложены порциями по d: полные порции — частное{" "}
                <Notation>{"n // d"}</Notation>, клетки, которым не хватило на
                порцию, — остаток <Notation>{"n % d"}</Notation>. Меняйте числа
                или выберите пример.
              </>
            }
          />
          <Typography.Text>
            Проверь равенство на своих числах: при 30 и 6 остатка нет — 30
            делится на 6, а при 7 и 9 нет ни одной полной порции: 7 // 9 = 0, 7
            % 9 = 7.
          </Typography.Text>
          <Typography.Text>
            Умножение записывается явно: <Notation>{"2 * x"}</Notation>, а не{" "}
            <Notation>{"2x"}</Notation>. Степень обозначается{" "}
            <Notation>{"**"}</Notation>, а не <Notation>{"^"}</Notation>. Знак{" "}
            <Notation>{"^"}</Notation> имеет другое назначение, которое будет
            объяснено в уроке о битах.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Округление вниз",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Отбросить дробную часть» и «округлить вниз» — разные действия.
            </strong>{" "}
            Для положительных чисел они совпадают, поэтому разницу видно только
            на отрицательных:
          </Typography.Text>
          <CodeBlock
            code={
              "print(-7 / 3)\nprint(-7 // 3)\nprint(-7 % 3)\nprint(int(-7 / 3))"
            }
            label={
              "Для положительных чисел они совпадают, поэтому разницу видно только на отрицательных"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"-2.3333333333333335\n-3\n2\n-2"}
          />
          <Typography.Text>
            Вниз означает к меньшему числу: среди целых, не превышающих −2.333…,
            наибольшее — −3. Остаток согласован с частным:{" "}
            <Notation>{"-7 = (-3) * 3 + 2"}</Notation>. При положительном
            делителе остаток неотрицателен и меньше делителя. В общем случае
            ненулевой остаток имеет знак делителя.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.floorLine}
            caption={
              <>
                <Notation>{"//"}</Notation> всегда идёт влево по числовой
                прямой, к меньшему целому. <Notation>{"int()"}</Notation> идёт к
                нулю. Для 4.6 это одно и то же направление, а для −2.33 —
                противоположные.
              </>
            }
          />
          <Typography.Text>
            <Notation>{"int"}</Notation> для конечного дробного числа
            отбрасывает дробную часть по направлению к нулю. Поэтому заменять{" "}
            <Notation>{"//"}</Notation> на <Notation>{"int(a / b)"}</Notation>{" "}
            нельзя: мешают и отрицательные значения, и потеря точности при
            переходе больших целых во <Notation>{"float"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Порядок операций",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Порядок операций такой же, как в математике, но степень
              группируется справа.
            </strong>{" "}
            Сначала выполняются выражения в скобках, затем степени, умножение и
            деления, затем сложение и вычитание. Операции одной обычной
            арифметической ступени выполняются слева направо. Для степеней есть
            особенность: цепочка группируется справа.
          </Typography.Text>
          <CodeBlock
            code={
              "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(2 ** 3 ** 2)\nprint(-3 ** 2)\nprint((-3) ** 2)"
            }
            label={"Для степеней есть особенность: цепочка группируется справа"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"14\n20\n512\n-9\n9"}
          />
          <Typography.Text>
            <Notation>{"2 ** 3 ** 2"}</Notation> — это{" "}
            <Notation>{"2 ** (3 ** 2)"}</Notation>, то есть 2⁹ = 512.{" "}
            <Notation>{"-3 ** 2"}</Notation> — это{" "}
            <Notation>{"-(3 ** 2)"}</Notation>: минус применяется после степени.
          </Typography.Text>
          <Typography.Text>
            Порядок удобно видеть деревом: каждая операция ждёт значения своих
            веток, поэтому нижние операции выполняются первыми.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exprTrees}
            caption={
              <>
                В <Notation>{"2 + 3 * 4"}</Notation> умножение стоит ниже
                сложения и выполняется первым. В цепочке степеней ниже
                оказывается правая часть, а минус в{" "}
                <Notation>{"-3 ** 2"}</Notation> стоит над степенью и
                применяется к готовому 9.
              </>
            }
          />
          <Typography.Text>
            Не превращай знание приоритетов в соревнование. Скобки полезны, если
            по ним сразу понятен математический смысл.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Точность чисел",
      explanation: (
        <>
          <Typography.Text>
            <strong>Целые числа точные, а дробные — приближённые.</strong>{" "}
            Python умеет работать с целыми намного больше привычных 32- или
            64-битных диапазонов: например, <Notation>{"2 ** 200"}</Notation>{" "}
            остаётся точным целым. Ограничения задаются ресурсами компьютера, а
            операции с огромными числами занимают больше времени. «Целое
            произвольной точности» не означает «вычисления любой величины
            бесплатны».
          </Typography.Text>
          <Typography.Text>
            <Notation>{"float"}</Notation> хранит приближение числа в двоичной
            форме. Так же как десятичная запись 1/3 бесконечна, некоторые
            короткие десятичные дроби не имеют конечной двоичной записи.
          </Typography.Text>
          <CodeBlock
            code={"print(0.1 + 0.2 == 0.3)\nprint(0.1 + 0.2)"}
            label={"Программа на Python"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"False\n0.30000000000000004"}
          />
          <Typography.Text>
            <Notation>{"=="}</Notation> здесь проверяет равенство и отвечает{" "}
            <Notation>{"True"}</Notation> или <Notation>{"False"}</Notation>;
            подробно сравнения разберём в уроке о логических выражениях. Это
            свойство выбранного представления, а не случайная поломка Python.
            Для проверки целочисленной делимости используй{" "}
            <Notation>{"%"}</Notation>, не дробное деление. Если задача по
            смыслу целочисленная, сохраняй целые как можно дольше.
          </Typography.Text>
          <Typography.Text>
            Для сравнения результатов приближённых вычислений подходит{" "}
            <Notation>{"math.isclose"}</Notation> — он появится в уроке о
            стандартной библиотеке. Допуск зависит от масштаба и смысла задачи,
            его нельзя выбирать механически.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Готовые функции",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Модуль, минимум, максимум и округление — готовые действия.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "print(abs(-12))\nprint(min(5, 2, 9))\nprint(max(5, 2, 9))\nprint(round(2.5))\nprint(round(3.5))"
            }
            label={"Модуль, минимум, максимум и округление — готовые действия"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"12\n2\n9\n2\n4"}
          />
          <Typography.Text>
            <Notation>{"abs"}</Notation> даёт модуль числа,{" "}
            <Notation>{"min"}</Notation> и <Notation>{"max"}</Notation> —
            наименьшее и наибольшее из переданных значений.{" "}
            <Notation>{"round"}</Notation> округляет до ближайшего; при точном
            равенстве расстояний используется ближайшее чётное. Поэтому 2.5
            превратилось в 2, а 3.5 — в 4.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: округление дробных" kind="nuance">
            <Typography.Text>
              Из-за представления <Notation>{"float"}</Notation> некоторые
              десятичные «половинки» внутри компьютера не точные половинки:
              поэтому <Notation>{"round(2.675, 2)"}</Notation> даёт{" "}
              <Notation>{"2.67"}</Notation>. Для денежных сумм часто подходят
              целые копейки или <Notation>{"Decimal"}</Notation> из стандартной
              библиотеки.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Делимость и цифры",
      explanation: (
        <>
          <Typography.Text>
            <strong>Делимость и цифры числа — это остатки.</strong> Условие «
            <Notation>{"n"}</Notation> делится на <Notation>{"d"}</Notation>»
            означает нулевой остаток: <Notation>{"n % d"}</Notation> равно 0.
            Нельзя делить на ноль. Чётность проверяется остатком от деления на
            2, в том числе для отрицательных целых.
          </Typography.Text>
          <Typography.Text>
            Если <Notation>{"n"}</Notation> — неотрицательное целое, то{" "}
            <Notation>{"n % 10"}</Notation> — последняя десятичная цифра, а{" "}
            <Notation>{"n // 10"}</Notation> — число без неё. Почему? Любое
            такое число представимо как <Notation>{"10 * q + r"}</Notation>, где{" "}
            <Notation>{"r"}</Notation> — от 0 до 9. Эти{" "}
            <Notation>{"q"}</Notation> и <Notation>{"r"}</Notation> и вычисляют
            две операции. Например, 472 = 10 · 47 + 2.
          </Typography.Text>
          <CodeBlock
            code={"n = 472\nprint(n % 10)\nprint(n // 10)\nprint(n // 10 % 10)"}
            label={"Например, 472 = 10 · 47 + 2"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"2\n47\n7"}
          />
          <Typography.Text>
            Третья строка сначала отбрасывает последнюю цифру, а затем берёт
            последнюю цифру того, что осталось, — получается вторая цифра
            справа. Для цифр отрицательного числа обычно сначала берут{" "}
            <Notation>{"abs(n)"}</Notation>: знак не является цифрой.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.placeValue472}
            caption={
              <>
                Каждая цифра записи весит своё: 472 = 4 · 100 + 7 · 10 + 2 · 1.{" "}
                <Notation>{"n % 10"}</Notation> берёт цифру с весом 1, а{" "}
                <Notation>{"n // 10"}</Notation> сдвигает остальные на разряд
                вправо: 47 = 4 · 10 + 7.
              </>
            }
          />
          <Typography.Text>
            Те же две операции раскладывают время. В 3671 секунде содержится 1
            полный час (3600 секунд), в остатке 71 секунда, из них 1 полная
            минута и 11 секунд:
          </Typography.Text>
          <CodeBlock
            code={
              "seconds = 3671\nhours = seconds // 3600\nminutes = seconds % 3600 // 60\nremaining_seconds = seconds % 60\nprint(hours, minutes, remaining_seconds)"
            }
            label={"Программа на Python"}
            language="python"
            fileName="seconds.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"1 1 11"}
          />
          <LessonDiagram
            {...lessonMedia.timeSplit3671}
            caption={
              <>
                Каждая операция отделяет свою часть:{" "}
                <Notation>{"// 3600"}</Notation> — полные часы,{" "}
                <Notation>{"% 3600 // 60"}</Notation> — полные минуты из того,
                что осталось после часов, <Notation>{"% 60"}</Notation> —
                секунды сверх полных минут.
              </>
            }
          />
          <Typography.Text>
            <Notation>{"print"}</Notation> с несколькими значениями через
            запятую печатает их через пробел; подробнее — в следующем уроке.
            Остаток от деления на 3600 удаляет полные часы. Деление оставшегося
            количества на 60 выделяет полные минуты. Для неотрицательной
            длительности это именно требуемое разложение.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <LessonSummary
        items={[
          {
            note: (
              <>
                <Notation>{"//"}</Notation> — частное с округлением вниз,{" "}
                <Notation>{"%"}</Notation> — остаток; вместе{" "}
                <Notation>{"a = (a // b) * b + a % b"}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"//"}</Notation> округляет вниз,{" "}
                <Notation>{"int(a / b)"}</Notation> — к нулю: при отрицательном
                частном не нацело ответы расходятся; остаток при положительном
                делителе неотрицателен.
              </>
            ),
          },
          {
            note: (
              <>
                Степень <Notation>{"**"}</Notation> группируется справа, а{" "}
                <Notation>{"-3 ** 2"}</Notation> равно −9.
              </>
            ),
          },
          {
            note: (
              <>
                Целые точные, <Notation>{"float"}</Notation> приближённые:{" "}
                <Notation>{"0.1 + 0.2"}</Notation> не равно{" "}
                <Notation>{"0.3"}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"n % 10"}</Notation> — последняя цифра,{" "}
                <Notation>{"n // 10"}</Notation> — число без неё; делимость —
                нулевой остаток.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
