import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  MaskSandbox,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonNotationPatternsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-notation-patterns.media";

export const pythonNotationPatternsLesson = defineCourseLesson({
  ...pythonNotationPatternsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Переводить записи чисел",
    "Битовые операции",
    "Маски fnmatch",
    "Регулярные выражения",
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
            В задачах ЕГЭ одно и то же число встречается в разных записях: 47 и
            двоичное <Notation>{"101111"}</Notation> — одно число. Нужно
            переводить запись в число и обратно, считать единицы двоичной записи
            и проверять, подходит ли запись под маску вроде{" "}
            <Notation>{"1?2*"}</Notation>.{" "}
            <strong>
              Число и его запись — разные вещи: Python переводит одно в другое,
              работает с отдельными двоичными разрядами и проверяет запись по
              шаблону
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Двоичная запись устроена так же, как десятичная из урока о числах,
            только веса разрядов другие. Начнём с перевода числа 47.
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
            «Двоичным» или «десятичным» бывает не число, а его запись. В записи
            с основанием <Notation>{"base"}</Notation> разряды справа налево
            имеют веса 1, <Notation>{"base"}</Notation>,{" "}
            <Notation>{"base ** 2"}</Notation> и так далее. Например,{" "}
            <Notation>{"1011"}</Notation> в двоичной записи — это 1 · 8 + 0 · 4
            + 1 · 2 + 1 · 1 = 11:
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
            label={"Перевод записей в число и обратно"}
            language="python"
            fileName="main.py"
            output={"11\n47\n255\n0b101111 0o57 0xff\n101111"}
          />
          <Typography.Text>
            <Notation>{"int(text, base)"}</Notation> разбирает запись в заданном
            основании. <Notation>{"bin"}</Notation>,{" "}
            <Notation>{"oct"}</Notation> и <Notation>{"hex"}</Notation> строят
            двоичную, восьмеричную и шестнадцатеричную записи с префиксами{" "}
            <Notation>{"0b"}</Notation>, <Notation>{"0o"}</Notation>,{" "}
            <Notation>{"0x"}</Notation>; срез <Notation>{"[2:]"}</Notation>{" "}
            убирает префикс у неотрицательного числа.
          </Typography.Text>
          <Typography.Text>
            Как получается сама запись? Последний разряд — остаток{" "}
            <Notation>{"n % 2"}</Notation>, остальные разряды хранит{" "}
            <Notation>{"n // 2"}</Notation> — так же в уроке о{" "}
            <Notation>{"while"}</Notation> снимали десятичные цифры через{" "}
            <Notation>{"% 10"}</Notation> и <Notation>{"// 10"}</Notation>.
            Пройди перевод 47 по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.base47}
            label={"Перевод 47 в двоичную запись делением на 2"}
          />
          <Typography.Text>
            Для любого основания то же: остаток{" "}
            <Notation>{"n % base"}</Notation> — новая цифра слева, дальше{" "}
            <Notation>{"n // base"}</Notation>. Подробно перевод разобран в теме
            14.
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
            label={"Записи через format"}
            language="python"
            fileName="main.py"
            output={"101111\n00000101\nff"}
          />
          <ProofDisclosure
            summary="Тонкости: отрицательные числа"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"bin(-5)"}</Notation> — это{" "}
              <Notation>{"'-0b101'"}</Notation>, и срез{" "}
              <Notation>{"[2:]"}</Notation> оставит{" "}
              <Notation>{"'b101'"}</Notation>. Знак обрабатывают отдельно:
              переводят <Notation>{"abs(n)"}</Notation> и добавляют минус.
            </Typography.Text>
          </ProofDisclosure>
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
              Битовые операции работают с каждым двоичным разрядом отдельно.
            </strong>{" "}
            <strong>Бит</strong> — двоичный разряд. Операция сравнивает биты,
            стоящие друг под другом, и соседние разряды на результат не влияют.
            Возьмём <Notation>{"a = 6"}</Notation>, то есть двоичное{" "}
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
            label={"Битовые операции над 6 и 3, единицы и длина записи 47"}
            language="python"
            fileName="main.py"
            output={"2 7 5 12 3\n5 6"}
          />
          <Typography.Text>
            Сдвиг влево на <Notation>{"k"}</Notation> разрядов — умножение на{" "}
            <Notation>{"2 ** k"}</Notation>, вправо — целочисленное деление на{" "}
            <Notation>{"2 ** k"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"n.bit_count()"}</Notation> считает единицы в двоичной
            записи модуля числа. <Notation>{"n.bit_length()"}</Notation> даёт
            число разрядов без ведущих нулей. У 47 ={" "}
            <Notation>{"101111"}</Notation> пять единиц и шесть разрядов. Скобки
            вокруг 47 нужны, чтобы точку не приняли за дробную часть числа.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: ~n и ноль" kind="nuance">
            <Typography.Text>
              Целые Python не ограничены 8 или 32 битами, поэтому{" "}
              <Notation>{"~n"}</Notation> («инверсия всех битов») равно{" "}
              <Notation>{"-n - 1"}</Notation>. У нуля{" "}
              <Notation>{"bit_length()"}</Notation> равен 0, хотя запись{" "}
              <Notation>{'"0"'}</Notation> имеет длину 1.
            </Typography.Text>
          </ProofDisclosure>
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
            В записи числа <Notation>{"?"}</Notation> — ровно одна цифра, а{" "}
            <Notation>{"*"}</Notation> — сколько угодно цифр, в том числе ни
            одной. Функция <Notation>{"fnmatchcase"}</Notation> из модуля{" "}
            <Notation>{"fnmatch"}</Notation> проверяет, подходит ли строка под
            маску целиком:
          </Typography.Text>
          <CodeBlock
            code={
              'from fnmatch import fnmatchcase\n\nprint(fnmatchcase("102", "1?2*"))\nprint(fnmatchcase("15200", "1?2*"))\nprint(fnmatchcase("12", "1?2*"))'
            }
            label={"Три записи и маска 1?2*"}
            language="python"
            fileName="main.py"
            output={"True\nTrue\nFalse"}
          />
          <Typography.Text>
            В первом случае <Notation>{"*"}</Notation> пустая; в последнем на
            месте <Notation>{"?"}</Notation> нет символа: после 1 сразу 2, и
            маске не хватает символа.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: fnmatch и fnmatchcase"
            kind="nuance"
          >
            <Typography.Text>
              Сама маска не знает, что подставлять надо цифры: на месте{" "}
              <Notation>{"?"}</Notation> подойдёт любой символ. Цифры получаются
              потому, что проверяется <Notation>{"str(n)"}</Notation> для
              неотрицательного целого. <Notation>{"case"}</Notation> в имени
              значит, что большие и маленькие буквы различаются на любом
              компьютере. В решениях ЕГЭ встречается и{" "}
              <Notation>{"fnmatch"}</Notation> — для строк из цифр результат тот
              же.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Проверь маску на своих записях: схема показывает, какие цифры заняли{" "}
            <Notation>{"?"}</Notation> и <Notation>{"*"}</Notation>, а если
            запись не подходит — говорит об этом.
          </Typography.Text>
          <MaskSandbox defaultMask="1?2*" defaultNumber="15200" />
          <Typography.Text>
            Типичная задача: найти числа до 10 000, кратные 7, чья запись
            подходит под маску, и для каждого — частное от деления на 7.
            Перебираем кандидатов и проверяем запись:
          </Typography.Text>
          <CodeBlock
            code={
              'from fnmatch import fnmatchcase\n\nanswers = []\nfor n in range(7, 10_000, 7):\n    if fnmatchcase(str(n), "1?2*"):\n        answers.append((n, n // 7))\nprint(answers[:5])'
            }
            label={"Кратные 7 до 10 000 под маской 1?2*"}
            language="python"
            fileName="main.py"
            output={
              "[(112, 16), (182, 26), (1022, 146), (1029, 147), (1120, 160)]"
            }
          />
          <Typography.Text>
            Срез <Notation>{"[:5]"}</Notation> показывает первые пять ответов.
            Граница исключает 10 000, а перебор по возрастанию даёт ответы уже
            по порядку. <Notation>{"?"}</Notation> нельзя заменить пустотой;{" "}
            <Notation>{"*"}</Notation> может означать ноль символов — этот
            случай легко забыть при ручном построении кандидатов.
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
              Регулярное выражение — другой язык шаблонов, со своими правилами.
            </strong>{" "}
            Модуль <Notation>{"re"}</Notation> проверяет и ищет по нему текст. В
            нём <Notation>{"*"}</Notation> не значит «любой текст»: это
            повторение предыдущего элемента ноль или более раз. Основные записи
            — выбери запись, чтобы увидеть, какие строки она описывает целиком:
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
            label={"Маска 1?2* записью регулярного выражения"}
            language="python"
            fileName="main.py"
            output={"True\nFalse"}
          />
          <Typography.Text>
            Шаблон пишут сырой строкой <Notation>{'r"…"'}</Notation>: в ней
            обратная косая черта остаётся сама собой.{" "}
            <Notation>{"fullmatch"}</Notation> требует совпадения со всей
            строкой; <Notation>{"search"}</Notation> ищет где угодно;{" "}
            <Notation>{"match"}</Notation> — только с начала, но не обязательно
            до конца. Успех возвращается объектом совпадения, неуспех —{" "}
            <Notation>{"None"}</Notation>.
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
            label={"Все числа в строке через re.finditer"}
            language="python"
            fileName="main.py"
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
            фрагменты им не посчитать.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: медленные регулярные выражения"
            kind="nuance"
          >
            <Typography.Text>
              Сложное регулярное выражение может много раз возвращаться к
              прежним выборам и работать очень долго на длинной строке. Простой
              цикл в таких задачах бывает яснее и надёжнее.
            </Typography.Text>
          </ProofDisclosure>
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
            Что напечатает{" "}
            <Notation>{'print(int("110", 2), bin(6)[2:])'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"6 110"}</Notation>: 1 · 4 + 1 · 2 + 0 · 1 = 6, и
            обратно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Чему равны <Notation>{"5 & 3"}</Notation> и{" "}
            <Notation>{"5 | 3"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            1 и 7: <Notation>{"101"}</Notation> и <Notation>{"011"}</Notation> —
            общий только младший бит, а вместе заняты все три.
          </Typography.Text>
        </>
      ),
    },
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
      <Typography.Text>
        Запись числа — строка, а число одно: Python переводит одно в другое,
        работает с отдельными битами и проверяет записи по шаблону. Вот что
        понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Перевод",
            note: (
              <>
                <Notation>{"int(text, base)"}</Notation> — запись в число;{" "}
                <Notation>{"bin"}</Notation>, <Notation>{"oct"}</Notation>,{" "}
                <Notation>{"hex"}</Notation>,{" "}
                <Notation>{'format(n, "08b")'}</Notation> — число в запись;
                цифры — остатки <Notation>{"n % base"}</Notation> справа налево.
              </>
            ),
          },
          {
            key: "Биты",
            note: (
              <>
                <Notation>{"&"}</Notation>, <Notation>{"|"}</Notation>,{" "}
                <Notation>{"^"}</Notation> — по разрядам,{" "}
                <Notation>{"<<"}</Notation> и <Notation>{">>"}</Notation> —
                умножение и деление на 2; <Notation>{"bit_count"}</Notation> —
                число единиц.
              </>
            ),
          },
          {
            key: "Маска",
            note: (
              <>
                <Notation>{"fnmatchcase(str(n), mask)"}</Notation>:{" "}
                <Notation>{"?"}</Notation> — ровно один символ,{" "}
                <Notation>{"*"}</Notation> — любые, в том числе ни одного.
              </>
            ),
          },
          {
            key: "Регулярное выражение",
            note: (
              <>
                <Notation>{"*"}</Notation> — повторение предыдущего;{" "}
                <Notation>{"fullmatch"}</Notation> проверяет всю строку,{" "}
                <Notation>{"search"}</Notation> ищет где угодно.
              </>
            ),
          },
          {
            key: <Notation>{"finditer"}</Notation>,
            note: (
              <>
                Совпадения по очереди: <Notation>{"group"}</Notation>,{" "}
                <Notation>{"start"}</Notation> и <Notation>{"end"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
