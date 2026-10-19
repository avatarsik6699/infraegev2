import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  MaskSandbox,
  VariantPicker,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonNotationPatternsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-notation-patterns.media";

export const pythonNotationPatternsLesson = defineCourseLesson({
  ...pythonNotationPatternsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Int(…", "Base)", "Bin", "Биты", "Fnmatch", "Re"],
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
              Число и его запись — разные вещи: Python переводит запись в число
              и обратно, умеет работать с отдельными битами и проверять запись
              по шаблону
            </strong>
            . Опора — цифры числа через <Notation>{"%"}</Notation> и{" "}
            <Notation>{"//"}</Notation> из уроков о числах и{" "}
            <Notation>{"while"}</Notation> и строковые методы: двоичная запись
            устроена так же, как десятичная, только с другими весами разрядов.
          </Typography.Text>
          <Typography.Text>
            Всё время будем возвращаться к числу 47: его двоичной записи{" "}
            <Notation>{"101111"}</Notation>, битам и проверке записей по маске.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Системы счисления",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Запись числа зависит от основания, а{" "}
              <Notation>{"int(text, base)"}</Notation> переводит запись в число.
            </strong>{" "}
            Число само по себе не «двоичное» или «десятичное»: так называют его
            запись. У записи с основанием <Notation>{"base"}</Notation> разряды
            имеют веса <Notation>{"1"}</Notation>, <Notation>{"base"}</Notation>
            , <Notation>{"base ** 2"}</Notation> и далее. Например,{" "}
            <Notation>{"1011"}</Notation> в двоичной записи означает{" "}
            <Notation>{"1*8 + 0*4 + 1*2 + 1 = 11"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.placeValue1011_2}
            caption={
              <>
                Та же схема разрядов, что для десятичного числа 472 в уроке о
                числах, только веса — степени двойки: 8, 4, 2, 1.
              </>
            }
          />
          <CodeBlock
            code={
              'print(int("1011", 2))\nprint(int("101111", 2))\nprint(int("FF", 16))\nprint(bin(47), oct(47), hex(255))\nprint(bin(47)[2:])'
            }
            label={
              "Например, 1011 в двоичной записи означает 1*8 + 0*4 + 1*2 + 1 = 11"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"11\n47\n255\n0b101111 0o57 0xff\n101111"}
          />
          <Typography.Text>
            <Notation>{"int(text, base)"}</Notation> разбирает запись в заданном
            основании. Встроенные <Notation>{"bin"}</Notation>,{" "}
            <Notation>{"oct"}</Notation>, <Notation>{"hex"}</Notation> создают
            записи с префиксами <Notation>{"0b"}</Notation>,{" "}
            <Notation>{"0o"}</Notation>, <Notation>{"0x"}</Notation>. Для
            неотрицательного числа часто используют{" "}
            <Notation>{"bin(n)[2:]"}</Notation>. Для отрицательного такой срез
            неверен из-за начального минуса; обрабатывай знак отдельно.
          </Typography.Text>
          <Typography.Text>
            Последний разряд записи определяется остатком{" "}
            <Notation>{"n % base"}</Notation>, остальные остаются в{" "}
            <Notation>{"n // base"}</Notation> — та же идея, что с десятичными
            цифрами в уроке о <Notation>{"while"}</Notation>. Полный алгоритм
            перевода в любое основание разобран в теме 14.
          </Typography.Text>
          <Typography.Text>
            <Notation>{'format(n, "b")'}</Notation> даёт двоичную запись без
            префикса, а <Notation>{'format(n, "08b")'}</Notation> — дополненную
            нулями слева до восьми знаков:
          </Typography.Text>
          <CodeBlock
            code={
              'print(format(47, "b"))\nprint(format(5, "08b"))\nprint(format(255, "x"))'
            }
            label={"Программа на Python"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"101111\n00000101\nff"}
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Битовые операции",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Битовые операции обрабатывают соответствующие разряды целых
              независимо.
            </strong>{" "}
            <strong>Бит</strong> — двоичный разряд. Побитовые операции
            независимо обрабатывают соответствующие разряды целых. Возьмём{" "}
            <Notation>{"a = 6"}</Notation>, то есть двоичное{" "}
            <Notation>{"110"}</Notation>, и <Notation>{"b = 3"}</Notation>, то
            есть <Notation>{"011"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.bits6_3}
            caption={
              <>
                Каждый разряд результата зависит только от двух битов над ним,
                соседние разряды не влияют. Сдвиги переносят всю запись: влево —
                умножение на 2, вправо — целое деление на 2.
              </>
            }
          />
          <CodeBlock
            code={
              "a = 6\nb = 3\nprint(a & b, a | b, a ^ b, a << 1, a >> 1)\nprint((47).bit_count(), (47).bit_length())"
            }
            label={"Возьмём a = 6, то есть двоичное 110, и b = 3, то есть 011"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"2 7 5 12 3\n5 6"}
          />
          <Typography.Text>
            Сдвиг влево на <Notation>{"k >= 0"}</Notation> соответствует
            умножению на <Notation>{"2 ** k"}</Notation>, вправо —
            целочисленному делению на <Notation>{"2 ** k"}</Notation>.{" "}
            <Notation>{"~n"}</Notation> для Python-целых равно{" "}
            <Notation>{"-n - 1"}</Notation>: целые не ограничены автоматически
            восьмью или тридцатью двумя битами. Для отрицательных чисел важно
            понимать представление, поэтому начинай с неотрицательных.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"n.bit_count()"}</Notation> считает единицы в двоичной
            записи модуля числа. <Notation>{"n.bit_length()"}</Notation> даёт
            число разрядов модуля без ведущих нулей; для 0 это 0, хотя текстовая
            запись <Notation>{'"0"'}</Notation> имеет длину 1. У 47 ={" "}
            <Notation>{"101111"}</Notation> пять единиц и шесть разрядов. Скобки
            вокруг 47 нужны, чтобы точку не приняли за дробную часть числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Маски fnmatch",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Маска <Notation>{"fnmatch"}</Notation> проверяет запись целиком:{" "}
              <Notation>{"?"}</Notation> — один символ,{" "}
              <Notation>{"*"}</Notation> — любая последовательность.
            </strong>{" "}
            В распространённой записи масок <Notation>{"?"}</Notation> означает
            ровно один символ, а <Notation>{"*"}</Notation> — любую
            последовательность, включая пустую. Для строк, состоящих только из
            цифр, это соответствует одной цифре и произвольному количеству цифр.
          </Typography.Text>
          <CodeBlock
            code={
              'from fnmatch import fnmatchcase\n\nprint(fnmatchcase("102", "1?2*"))\nprint(fnmatchcase("15200", "1?2*"))\nprint(fnmatchcase("12", "1?2*"))'
            }
            label={"Программа на Python"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"True\nTrue\nFalse"}
          />
          <Typography.Text>
            В первом случае <Notation>{"*"}</Notation> пустая; в последнем на
            месте <Notation>{"?"}</Notation> нет символа: после 1 сразу 2, и
            шаблону не хватает длины. Сам <Notation>{"fnmatchcase"}</Notation>{" "}
            не ограничивает подстановки цифрами. Ограничение обеспечивается тем,
            что проверяется <Notation>{"str(n)"}</Notation> для неотрицательного
            целого. Функция проверяет всю строку. <Notation>{"case"}</Notation>{" "}
            в имени означает, что большие и маленькие буквы различаются на любом
            компьютере; для цифр это не важно. В темах ЕГЭ встречается и{" "}
            <Notation>{"fnmatch"}</Notation> без <Notation>{"case"}</Notation> —
            для строк из цифр результат одинаков.
          </Typography.Text>
          <Typography.Text>
            Проверь маску на своих записях: схема показывает, какие цифры заняли{" "}
            <Notation>{"?"}</Notation> и <Notation>{"*"}</Notation>, а если
            запись не подходит — говорит об этом.
          </Typography.Text>
          <MaskSandbox defaultMask="1?2*" defaultNumber="15200" />
          <CodeBlock
            code={
              'from fnmatch import fnmatchcase\n\nanswers = []\nfor n in range(7, 10_000, 7):\n    if fnmatchcase(str(n), "1?2*"):\n        answers.append((n, n // 7))\nprint(answers[:5])'
            }
            label={"и *, а если запись не подходит — говорит об этом"}
            language="python"
            fileName="answers.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={
              "[(112, 16), (182, 26), (1022, 146), (1029, 147), (1120, 160)]"
            }
          />
          <Typography.Text>
            Граница исключает 10 000. Перебор по возрастанию даёт упорядоченные
            ответы без дополнительной сортировки. <Notation>{"?"}</Notation>{" "}
            нельзя заменить пустотой; <Notation>{"*"}</Notation> может означать
            ноль символов — этот случай легко забыть при ручном построении
            кандидатов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Регулярные выражения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Регулярное выражение — другой язык шаблонов со своими правилами.
            </strong>{" "}
            <strong>Регулярное выражение</strong> описывает текстовый шаблон с
            собственными правилами. В нём <Notation>{"*"}</Notation> не значит
            «любой текст»: это повторение предыдущего элемента ноль или более
            раз. Основные записи — выбери запись, чтобы увидеть, какие строки
            она описывает целиком:
          </Typography.Text>
          <VariantPicker
            label={"Запись regex и строки, которые она описывает целиком"}
            variants={[
              {
                label: "[0-9]",
                value: (
                  <>
                    подходят <Notation>{'"7"'}</Notation>; не подходят{" "}
                    <Notation>{'"a"'}</Notation>
                  </>
                ),
                note: <>одна ASCII-цифра</>,
              },
              {
                label: "[ABC]",
                value: (
                  <>
                    подходят <Notation>{'"B"'}</Notation>; не подходят{" "}
                    <Notation>{'"D"'}</Notation>
                  </>
                ),
                note: <>один символ из набора</>,
              },
              {
                label: ".",
                value: (
                  <>
                    подходят <Notation>{'"?"'}</Notation>; не подходят{" "}
                    <Notation>{'""'}</Notation>
                  </>
                ),
                note: <>любой символ, обычно кроме перевода строки</>,
              },
              {
                label: "X*",
                value: (
                  <>
                    подходят <Notation>{'""'}</Notation>,{" "}
                    <Notation>{'"XXX"'}</Notation>; не подходят{" "}
                    <Notation>{'"XY"'}</Notation>
                  </>
                ),
                note: <>ноль или более повторений X</>,
              },
              {
                label: "X+",
                value: (
                  <>
                    подходят <Notation>{'"XXX"'}</Notation>; не подходят{" "}
                    <Notation>{'""'}</Notation>
                  </>
                ),
                note: <>одно или более повторений</>,
              },
              {
                label: "X?",
                value: (
                  <>
                    подходят <Notation>{'""'}</Notation>,{" "}
                    <Notation>{'"X"'}</Notation>; не подходят{" "}
                    <Notation>{'"XX"'}</Notation>
                  </>
                ),
                note: <>ноль или одно повторение</>,
              },
              {
                label: "X{3}",
                value: (
                  <>
                    подходят <Notation>{'"XXX"'}</Notation>; не подходят{" "}
                    <Notation>{'"XX"'}</Notation>
                  </>
                ),
                note: <>ровно три повторения</>,
              },
              {
                label: "X{2,4}",
                value: (
                  <>
                    подходят <Notation>{'"XX"'}</Notation>,{" "}
                    <Notation>{'"XXXX"'}</Notation>; не подходят{" "}
                    <Notation>{'"X"'}</Notation>
                  </>
                ),
                note: <>от двух до четырёх повторений</>,
              },
              {
                label: "A|B",
                value: (
                  <>
                    подходят <Notation>{'"A"'}</Notation>; не подходят{" "}
                    <Notation>{'"AB"'}</Notation>
                  </>
                ),
                note: <>одно из двух</>,
              },
              {
                label: "(AB)+",
                value: (
                  <>
                    подходят <Notation>{'"ABAB"'}</Notation>; не подходят{" "}
                    <Notation>{'"ABA"'}</Notation>
                  </>
                ),
                note: <>группа: повторяется целиком</>,
              },
            ]}
          />
          <Typography.Text>
            Эквивалент маски <Notation>{"1?2*"}</Notation> для десятичных
            записей — <Notation>{"1[0-9]2[0-9]*"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'import re\n\npattern = r"1[0-9]2[0-9]*"\nprint(re.fullmatch(pattern, "15200") is not None)\nprint(re.fullmatch(pattern, "12") is not None)'
            }
            label={
              "Эквивалент маски 1?2* для десятичных записей — 1[0-9]2[0-9]*"
            }
            language="python"
            fileName="pattern.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"True\nFalse"}
          />
          <Typography.Text>
            Префикс <Notation>{"r"}</Notation> создаёт сырую строку, удобную для
            обратных слешей в шаблоне. Сам regex всё равно понимает свои
            специальные символы. <Notation>{"fullmatch"}</Notation> требует
            совпадения со всей строкой; <Notation>{"search"}</Notation> ищет где
            угодно; <Notation>{"match"}</Notation> — только с начала, но не
            обязательно до конца. Успех возвращается объектом совпадения,
            неуспех — <Notation>{"None"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Объект совпадения знает найденный текст и его место.{" "}
            <Notation>{"re.finditer"}</Notation> перебирает все совпадения по
            очереди:
          </Typography.Text>
          <CodeBlock
            code={
              'import re\n\nfor m in re.finditer(r"[0-9]+", "a12b345c6"):\n    print(m.group(), m.start(), m.end())'
            }
            label={"re.finditer перебирает все совпадения по очереди"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"12 1 3\n345 4 7\n6 8 9"}
          />
          <Typography.Text>
            <Notation>{"group()"}</Notation> — найденный текст,{" "}
            <Notation>{"start()"}</Notation> — индекс его начала,{" "}
            <Notation>{"end()"}</Notation> — индекс сразу после конца, как
            граница среза: <Notation>{'"a12b345c6"[4:7]'}</Notation> — это{" "}
            <Notation>{'"345"'}</Notation>. <Notation>{"re.findall"}</Notation>{" "}
            возвращает список найденных строк, но, как и{" "}
            <Notation>{"count"}</Notation>, без перекрытий: пересекающиеся
            фрагменты им не посчитать. Сложные регулярные выражения иногда много
            раз возвращаются к прежним выборам и работают медленно; простой цикл
            бывает яснее и надёжнее.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Подходят ли записи <Notation>{'"1234"'}</Notation> и{" "}
            <Notation>{'"13"'}</Notation> под маску{" "}
            <Notation>{'"1?3*"'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «1234» подходит, «13» — нет: на месте <Notation>{"?"}</Notation> нет
            символа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт <Notation>{'re.fullmatch(r"[0-9]+", "123a")'}</Notation>?
            А <Notation>{'re.search(r"[0-9]+", "123a")'}</Notation> — найдёт ли
            что-нибудь?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            None; <Notation>{"search"}</Notation> найдёт 123 в начале строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Какие <Notation>{"group"}</Notation>, <Notation>{"start"}</Notation>{" "}
            и <Notation>{"end"}</Notation> у совпадений{" "}
            <Notation>{'r"[A-Z]+"'}</Notation> в строке{" "}
            <Notation>{'"abCDeFGHi"'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>CD 2 4 и FGH 5 8.</Typography.Text>
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
                <Notation>{"int(text, base)"}</Notation> — запись в число;{" "}
                <Notation>{"bin"}</Notation>, <Notation>{"oct"}</Notation>,{" "}
                <Notation>{"hex"}</Notation> — число в запись с префиксом,{" "}
                <Notation>{'format(n, "08b")'}</Notation> — без префикса и с
                нулями.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"&"}</Notation>, <Notation>{"|"}</Notation>,{" "}
                <Notation>{"^"}</Notation>, <Notation>{"<<"}</Notation>,{" "}
                <Notation>{">>"}</Notation> работают с разрядами;{" "}
                <Notation>{"bit_count"}</Notation> и{" "}
                <Notation>{"bit_length"}</Notation> — единицы и длина записи.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"fnmatchcase(text, mask)"}</Notation>:{" "}
                <Notation>{"?"}</Notation> — ровно один символ,{" "}
                <Notation>{"*"}</Notation> — любая последовательность, в том
                числе пустая.
              </>
            ),
          },
          {
            note: (
              <>
                В regex <Notation>{"*"}</Notation> — повторение предыдущего;{" "}
                <Notation>{"fullmatch"}</Notation> проверяет всю строку.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"finditer"}</Notation> даёт совпадения с{" "}
                <Notation>{"group"}</Notation>, <Notation>{"start"}</Notation> и{" "}
                <Notation>{"end"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
