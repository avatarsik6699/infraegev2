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
            В прошлом уроке у чисел появились имена, теперь займёмся самими
            вычислениями. Сложение, вычитание и умножение в Python такие же, как
            на уроке математики, а с делением интереснее.{" "}
            <strong>
              Сколько полных пятёрок помещается в 23 и сколько остаётся? Для
              таких вопросов в Python есть две отдельные операции — целое
              деление <Notation>{"//"}</Notation> и остаток{" "}
              <Notation>{"%"}</Notation>
            </strong>
            . На них держатся проверка делимости, цифры числа и перевод секунд в
            часы и минуты.
          </Typography.Text>
          <Typography.Text>
            Ещё в уроке — порядок операций, точность дробных чисел и готовые
            действия: модуль, минимум, максимум и округление.
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
            <strong>В Python семь основных арифметических операций.</strong> Вот
            они все на числах 23 и 5, у каждой строки — комментарий с названием:
          </Typography.Text>
          <CodeBlock
            code={
              "print(23 + 5)   # сложение\nprint(23 - 5)   # вычитание\nprint(23 * 5)   # умножение\nprint(23 / 5)   # деление\nprint(23 // 5)  # целое деление\nprint(23 % 5)   # остаток\nprint(23 ** 5)  # степень"
            }
            label={"Все семь операций на числах 23 и 5"}
            language="python"
            fileName="main.py"
            output={"28\n18\n115\n4.6\n4\n3\n6436343"}
          />
          <Typography.Text>
            Первые три работают как в математике. <Notation>{"**"}</Notation> —
            степень: <Notation>{"23 ** 5"}</Notation> — это 23⁵, а{" "}
            <Notation>{"2 ** 5"}</Notation> — 2⁵ = 32. Обычное деление{" "}
            <Notation>{"/"}</Notation> всегда даёт дробное число{" "}
            <Notation>{"float"}</Notation>, даже если делится нацело:{" "}
            <Notation>{"8 / 2"}</Notation> — это <Notation>{"4.0"}</Notation>, а
            не <Notation>{"4"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Умножение пишут явно: <Notation>{"2 * x"}</Notation>, а не{" "}
            <Notation>{"2x"}</Notation>. Степень — <Notation>{"**"}</Notation>,
            а не <Notation>{"^"}</Notation>: знак <Notation>{"^"}</Notation> в
            Python означает другую операцию.
          </Typography.Text>
          <Typography.Text>
            <strong>Целое деление и остаток.</strong>{" "}
            <Notation>{"23 // 5"}</Notation> — сколько полных пятёрок помещается
            в 23: четыре. <Notation>{"23 % 5"}</Notation> — сколько осталось
            сверх них: 3. Разложи клетки на порции сам:
          </Typography.Text>
          <RemainderExplorer
            n={23}
            d={5}
            caption={
              <>
                Клетки числа n разложены порциями по d: полные порции — частное{" "}
                <Notation>{"n // d"}</Notation>, клетки, которым не хватило на
                порцию, — остаток <Notation>{"n % d"}</Notation>. Меняй числа
                или выбери пример: при 20 и 5 остатка нет — 20 делится на 5, а
                при 3 и 7 нет ни одной полной порции.
              </>
            }
          />
          <Typography.Text>
            Частное и остаток всегда собираются обратно в исходное число: полные
            порции, умноженные на размер порции, плюс остаток. Для целых{" "}
            <Notation>{"a"}</Notation> и <Notation>{"b"}</Notation>, где{" "}
            <Notation>{"b"}</Notation> — не ноль, это равенство{" "}
            <Notation>{"a = (a // b) * b + a % b"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"print(23 // 5 * 5 + 23 % 5)"}
            label={"Частное и остаток собираются обратно в исходное число"}
            language="python"
            fileName="main.py"
            output={"23"}
          />
          <Typography.Text>
            Делить на ноль нельзя и здесь: <Notation>{"23 // 0"}</Notation> и{" "}
            <Notation>{"23 % 0"}</Notation> остановят программу с{" "}
            <Notation>{"ZeroDivisionError"}</Notation>, как деление на ноль в
            первом уроке.
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
              <Notation>{"//"}</Notation> округляет частное вниз — к меньшему
              целому.
            </strong>{" "}
            Для положительных чисел это то же, что отбросить дробную часть:{" "}
            <Notation>{"23 / 5"}</Notation> — 4.6, а{" "}
            <Notation>{"23 // 5"}</Notation> — 4. У отрицательных чисел разница
            видна:
          </Typography.Text>
          <CodeBlock
            code={"print(-7 / 3)\nprint(-7 // 3)\nprint(int(-7 / 3))"}
            label={"У отрицательных чисел разница видна"}
            language="python"
            fileName="main.py"
            output={"-2.3333333333333335\n-3\n-2"}
          />
          <Typography.Text>
            <Notation>{"int(x)"}</Notation> превращает дробное число в целое,
            отбрасывая дробную часть; подробнее о нём — в уроке «Ввод,
            преобразование и вывод». Отбросить дробную часть у −2.33… — значит
            получить −2, то есть сдвинуться к нулю. А округлить вниз — значит
            взять меньшее целое: −3.
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
            Поэтому заменять <Notation>{"a // b"}</Notation> на{" "}
            <Notation>{"int(a / b)"}</Notation> нельзя: для отрицательных чисел
            ответы разойдутся.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: остаток отрицательного числа"
            kind="nuance"
          >
            <Typography.Text>
              Остаток согласован с частным: <Notation>{"-7 % 3"}</Notation>{" "}
              равно 2, потому что −7 = (−3) · 3 + 2. При положительном делителе
              остаток всегда от 0 до делителя без единицы. Если отрицателен
              делитель, ненулевой остаток тоже отрицателен:{" "}
              <Notation>{"7 % -3"}</Notation> равно −2. А{" "}
              <Notation>{"int(a / b)"}</Notation> подводит ещё и на очень
              больших числах: дробное <Notation>{"a / b"}</Notation> хранится
              приближённо (раздел «Точность чисел»).
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Порядок операций",
      explanation: (
        <>
          <Typography.Text>
            <strong>Порядок операций такой же, как в математике.</strong>{" "}
            Сначала скобки, затем степень <Notation>{"**"}</Notation>, затем{" "}
            <Notation>{"*"}</Notation>, <Notation>{"/"}</Notation>,{" "}
            <Notation>{"//"}</Notation>, <Notation>{"%"}</Notation>, затем{" "}
            <Notation>{"+"}</Notation> и <Notation>{"-"}</Notation>. Операции
            одного уровня выполняются слева направо — это касается и{" "}
            <Notation>{"//"}</Notation> с <Notation>{"%"}</Notation>: они стоят
            на одном уровне с умножением.
          </Typography.Text>
          <CodeBlock
            code={
              "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(472 // 10 % 10)\nprint(2 ** 3 ** 2)\nprint(-3 ** 2)\nprint((-3) ** 2)"
            }
            label={"Операции одного уровня выполняются слева направо"}
            language="python"
            fileName="main.py"
            output={"14\n20\n7\n512\n-9\n9"}
          />
          <Typography.Text>
            <Notation>{"472 // 10 % 10"}</Notation> читается слева направо:
            сначала <Notation>{"472 // 10"}</Notation> = 47, затем{" "}
            <Notation>{"47 % 10"}</Notation> = 7. Этот приём понадобится в
            разделе о цифрах числа.
          </Typography.Text>
          <Typography.Text>
            Степень — исключение: цепочку <Notation>{"**"}</Notation> Python
            считает справа налево. <Notation>{"2 ** 3 ** 2"}</Notation> — это{" "}
            <Notation>{"2 ** (3 ** 2)"}</Notation>, то есть 2⁹ = 512. И степень
            выполняется раньше минуса перед числом:{" "}
            <Notation>{"-3 ** 2"}</Notation> — это{" "}
            <Notation>{"-(3 ** 2)"}</Notation>, то есть −9.
          </Typography.Text>
          <Typography.Text>
            Порядок удобно видеть деревом: операция выполняется, когда готовы
            значения под ней, поэтому нижние операции выполняются первыми.
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
            Если сомневаешься в порядке, ставь скобки:{" "}
            <Notation>{"(-3) ** 2"}</Notation> или{" "}
            <Notation>{"2 + (3 * 4)"}</Notation> читаются сразу, без знания
            правил.
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
            <strong>
              Целые числа Python считает точно, а дробные — приближённо.
            </strong>{" "}
            Целое может быть сколь угодно длинным, пока хватает памяти
            компьютера:
          </Typography.Text>
          <CodeBlock
            code={"print(2 ** 100)"}
            label={"Целое может быть сколь угодно длинным"}
            language="python"
            fileName="main.py"
            output={"1267650600228229401496703205376"}
          />
          <Typography.Text>
            С дробными иначе. <Notation>{"float"}</Notation> хранит число с
            ограниченным количеством знаков, поэтому некоторые простые дроби
            записываются чуть неточно — так же, как 1/3 не записать конечной
            десятичной дробью 0.333…:
          </Typography.Text>
          <CodeBlock
            code={"print(0.1 + 0.2)"}
            label={"Некоторые простые дроби записываются чуть неточно"}
            language="python"
            fileName="main.py"
            output={"0.30000000000000004"}
          />
          <Typography.Text>
            Это не ошибка Python, а свойство дробных чисел в компьютере. Отсюда
            правило: если задача о целых — количестве, цифрах, делимости, —
            считай в целых: <Notation>{"//"}</Notation> и{" "}
            <Notation>{"%"}</Notation> вместо <Notation>{"/"}</Notation>.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: сравнение дробных" kind="nuance">
            <Typography.Text>
              Внутри компьютера <Notation>{"float"}</Notation> хранится в
              двоичной записи, а 0.1 в ней — бесконечная дробь, как 1/3 в
              десятичной. Поэтому проверка{" "}
              <Notation>{"0.1 + 0.2 == 0.3"}</Notation> даёт{" "}
              <Notation>{"False"}</Notation>. Дробные результаты сравнивают с
              допуском — функцией <Notation>{"math.isclose"}</Notation> из урока
              о стандартной библиотеке; допуск выбирают по смыслу задачи.
            </Typography.Text>
          </ProofDisclosure>
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
              Модуль, минимум, максимум и округление в Python уже готовы.
            </strong>{" "}
            Это <strong>функции</strong>: записываются они как{" "}
            <Notation>{"print"}</Notation> — имя, а в скобках значения через
            запятую.
          </Typography.Text>
          <CodeBlock
            code={
              "print(abs(-12))\nprint(min(5, 2, 9))\nprint(max(5, 2, 9))\nprint(round(2.5))\nprint(round(3.5))"
            }
            label={"Модуль, минимум, максимум и округление в Python уже готовы"}
            language="python"
            fileName="main.py"
            output={"12\n2\n9\n2\n4"}
          />
          <Typography.Text>
            <Notation>{"abs"}</Notation> даёт модуль числа,{" "}
            <Notation>{"min"}</Notation> и <Notation>{"max"}</Notation> —
            наименьшее и наибольшее из значений в скобках.{" "}
            <Notation>{"round"}</Notation> округляет до ближайшего целого. Но
            при ровной половине — 2.5 или 3.5 — Python выбирает ближайшее
            чётное: 2.5 превратилось в 2, а 3.5 — в 4. Это правило Python, а не
            ошибка.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: округление до знаков после точки"
            kind="nuance"
          >
            <Typography.Text>
              Вторым значением в скобках <Notation>{"round"}</Notation>{" "}
              принимает число знаков после точки:{" "}
              <Notation>{"round(3.14159, 2)"}</Notation> даёт 3.14. Из-за
              неточности <Notation>{"float"}</Notation> некоторые «половинки» на
              деле чуть меньше половины, поэтому{" "}
              <Notation>{"round(2.675, 2)"}</Notation> даёт 2.67. Поэтому деньги
              часто считают в целых копейках.
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
            <strong>Делимость и цифры числа — это остатки.</strong> «
            <Notation>{"n"}</Notation> делится на <Notation>{"d"}</Notation>»
            значит, что остаток <Notation>{"n % d"}</Notation> равен нулю.
            Чётность — остаток от деления на 2: у чётного числа он 0, у
            нечётного 1.
          </Typography.Text>
          <CodeBlock
            code={"print(91 % 7)\nprint(18 % 2)\nprint(17 % 2)"}
            label={"Чётность — остаток от деления на 2"}
            language="python"
            fileName="main.py"
            output={"0\n0\n1"}
          />
          <Typography.Text>
            91 делится на 7, 18 — чётное, 17 — нечётное. Последняя цифра — тоже
            остаток. Если <Notation>{"n"}</Notation> — неотрицательное целое, то{" "}
            <Notation>{"n % 10"}</Notation> — его последняя цифра, а{" "}
            <Notation>{"n // 10"}</Notation> — число без неё. Почему? Любое
            такое число записывается как <Notation>{"10 * q + r"}</Notation>,
            где <Notation>{"r"}</Notation> — от 0 до 9, и эти{" "}
            <Notation>{"q"}</Notation> и <Notation>{"r"}</Notation> как раз
            вычисляют две операции. Например, 472 = 10 · 47 + 2:
          </Typography.Text>
          <CodeBlock
            code={"n = 472\nprint(n % 10)\nprint(n // 10)\nprint(n // 10 % 10)"}
            label={"Например, 472 = 10 · 47 + 2"}
            language="python"
            fileName="main.py"
            output={"2\n47\n7"}
          />
          <Typography.Text>
            Третья строка сначала отбрасывает последнюю цифру, а затем берёт
            последнюю цифру того, что осталось, — получается вторая цифра
            справа. Для цифр отрицательного числа сначала берут{" "}
            <Notation>{"abs(n)"}</Notation>: знак — не цифра.
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
            Те же две операции раскладывают время. В 3671 секунде 1 полный час
            (3600 секунд), в остатке 71 секунда: из них 1 полная минута и 11
            секунд. <Notation>{"print"}</Notation> с несколькими значениями
            через запятую печатает их в одну строку через пробел; подробнее — в
            следующем уроке:
          </Typography.Text>
          <CodeBlock
            code={
              "seconds = 3671\nhours = seconds // 3600\nminutes = seconds % 3600 // 60\nremaining_seconds = seconds % 60\nprint(hours, minutes, remaining_seconds)"
            }
            label={"Те же две операции раскладывают время"}
            language="python"
            fileName="main.py"
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
            Что напечатают <Notation>{"print(17 // 5)"}</Notation> и{" "}
            <Notation>{"print(17 % 5)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            3 и 2: в 17 помещаются три полные пятёрки, и 2 остаётся. Проверка:
            17 = 3 · 5 + 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{"print(10 / 2)"}</Notation> печатает{" "}
            <Notation>{"5.0"}</Notation>, а не <Notation>{"5"}</Notation>? Как
            получить целое 5?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Обычное деление <Notation>{"/"}</Notation> всегда даёт дробное{" "}
            <Notation>{"float"}</Notation>, даже нацело. Целое 5 даёт{" "}
            <Notation>{"10 // 2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Чему равно <Notation>{"-9 // 2"}</Notation>? А{" "}
            <Notation>{"int(-9 / 2)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            −5 и −4: <Notation>{"-9 / 2"}</Notation> — это −4.5;{" "}
            <Notation>{"//"}</Notation> округляет вниз, к меньшему целому, а{" "}
            <Notation>{"int"}</Notation> отбрасывает дробную часть, к нулю.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает <Notation>{"print(2 + 10 // 4 * 3)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            8: <Notation>{"//"}</Notation> и <Notation>{"*"}</Notation> — на
            одном уровне, слева направо: 10 // 4 = 2, 2 * 3 = 6, и только потом
            2 + 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Какими выражениями узнать последнюю цифру числа 2026 и проверить,
            чётное ли оно? Что они дадут?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"2026 % 10"}</Notation> — последняя цифра 6;{" "}
            <Notation>{"2026 % 2"}</Notation> — 0, значит, число чётное.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        За урок ты прошёл все арифметические операции Python, а целое деление и
        остаток научился применять к цифрам числа и ко времени. Вот что из этого
        понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Семь операций",
            note: (
              <>
                <Notation>{"+"}</Notation>, <Notation>{"-"}</Notation>,{" "}
                <Notation>{"*"}</Notation> — как в математике;{" "}
                <Notation>{"**"}</Notation> — степень;{" "}
                <Notation>{"/"}</Notation> — деление с дробным ответом;{" "}
                <Notation>{"//"}</Notation> — целое деление;{" "}
                <Notation>{"%"}</Notation> — остаток.
              </>
            ),
          },
          {
            key: <Notation>{"23 // 5, 23 % 5"}</Notation>,
            note: (
              <>
                4 полные пятёрки и 3 в остатке: 23 = 4 · 5 + 3. На ноль делить
                нельзя — <Notation>{"ZeroDivisionError"}</Notation>.
              </>
            ),
          },
          {
            key: "Округление вниз",
            note: (
              <>
                <Notation>{"//"}</Notation> округляет к меньшему:{" "}
                <Notation>{"-7 // 3"}</Notation> — −3.{" "}
                <Notation>{"int()"}</Notation> отбрасывает дробную часть к нулю:
                −2.
              </>
            ),
          },
          {
            key: "Порядок",
            note: (
              <>
                Скобки, <Notation>{"**"}</Notation>, затем{" "}
                <Notation>{"* / // %"}</Notation>, затем{" "}
                <Notation>{"+ -"}</Notation>. Один уровень — слева направо,
                цепочка <Notation>{"**"}</Notation> — справа налево;{" "}
                <Notation>{"-3 ** 2"}</Notation> — −9.
              </>
            ),
          },
          {
            key: "Точность",
            note: (
              <>
                Целые точные, <Notation>{"float"}</Notation> приближённые:{" "}
                <Notation>{"0.1 + 0.2"}</Notation> — 0.30000000000000004. Задачи
                о целых считают в целых.
              </>
            ),
          },
          {
            key: "Функции",
            note: (
              <>
                <Notation>{"abs"}</Notation>, <Notation>{"min"}</Notation>,{" "}
                <Notation>{"max"}</Notation>, <Notation>{"round"}</Notation>;{" "}
                <Notation>{"round"}</Notation> при ровной половине выбирает
                чётное.
              </>
            ),
          },
          {
            key: "Делимость и цифры",
            note: (
              <>
                Делится — значит <Notation>{"n % d"}</Notation> равно 0.{" "}
                <Notation>{"n % 10"}</Notation> — последняя цифра,{" "}
                <Notation>{"n // 10"}</Notation> — число без неё.
              </>
            ),
          },
          {
            key: "Время",
            note: (
              <>
                <Notation>{"// 3600"}</Notation> — часы,{" "}
                <Notation>{"% 3600 // 60"}</Notation> — минуты,{" "}
                <Notation>{"% 60"}</Notation> — секунды.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
