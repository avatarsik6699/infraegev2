// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  MaskSandbox,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./divisors-and-masks.paid.maski.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "znaki-maski",
      navLabel: "Знаки ? и *",
      explanation: (
        <>
          <Typography.Text>
            Что означает маска <Notation>{"12*3?"}</Notation> и каким числам она
            соответствует?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Маска — образец записи числа: цифры стоят на своих местах,{" "}
              <Notation>{"?"}</Notation> — ровно одна любая цифра,{" "}
              <Notation>{"*"}</Notation> — любая последовательность цифр, даже
              пустая.
            </strong>{" "}
            Маска говорит только о записи числа, а делимость проверяют отдельно.
          </Typography.Text>
          <Typography.Text>
            Маске <Notation>{"12?4"}</Notation> соответствуют десять чисел:
            1204, 1214, …, 1294. Маске <Notation>{"12*4"}</Notation> —
            бесконечно много: 124, 1204, 12004, 1234564. Пустая звёздочка и
            звёздочка «0» — разные числа: 124 и 1204. Разложим по частям маски
            12*3? несколько чисел:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.maskAlign123}
            caption={
              <>
                Числа по частям маски 12*3?. Звёздочка забирает сколько угодно
                цифр, в том числе ни одной. Пунктиром — числа, которые под маску
                не подходят: у 12304 перед последней цифрой 0, а нужна 3; у 123
                не хватает цифры для ?.
              </>
            }
          />
          <Typography.Text>
            Каждый <Notation>{"?"}</Notation> заполняется независимо: в маске{" "}
            <Notation>{"1??"}</Notation> цифры не обязаны совпадать. Попробуй
            сам — поменяй маску или число:
          </Typography.Text>
          <MaskSandbox defaultMask="12*3?" defaultNumber="120034" />
        </>
      ),
    },
    {
      id: "fnmatch",
      navLabel: "Проверка fnmatch",
      explanation: (
        <>
          <Typography.Text>
            Как проверить в программе, подходит ли число под маску?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Функцией <Notation>{"fnmatch(str(n), mask)"}</Notation> из модуля{" "}
              <Notation>{"fnmatch"}</Notation>: маска пишется в ней так же, как
              в условии.
            </strong>{" "}
            Первый аргумент — запись числа, второй — маска; ответ True или
            False.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from fnmatch import fnmatch\n\nmask = '12*3?'\nprint(fnmatch('1234', mask), fnmatch('120034', mask))\nprint(fnmatch('12304', mask), fnmatch('123', mask))"
            }
            label={"Проверка по маске"}
            language="python"
            output={"True True\nFalse False"}
          />
          <Typography.Text>
            fnmatch сравнивает запись целиком: 912345 под маску 12*3? не
            подходит, хотя 1234 в ней есть. Границу и делимость она не проверяет
            — их пишут отдельно. А сравнение строк медленнее остатка, поэтому
            сначала проверяй делимость, потом маску.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-kratnyh",
      navLabel: "Шаг, равный делителю",
      explanation: (
        <>
          <Typography.Text>
            Среди чисел, не превышающих 10¹⁰, найди все, что соответствуют маске{" "}
            <Notation>{"3?12?14*5"}</Notation> и делятся на 1917. Десять
            миллиардов проверок — это часы. Как сократить перебор?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебирать только кратные 1917: начать с 0 и шагать по 1917. Чисел
              станет в 1917 раз меньше, а делимость проверять уже не нужно.
            </strong>{" "}
            Третий аргумент <Notation>{"range"}</Notation> — шаг:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from fnmatch import fnmatch\n\nfor n in range(0, 10**10 + 1, 1917):\n    if fnmatch(str(n), '3?12?14*5'):\n        print(n, n // 1917)"
            }
            label={"Кратные 1917 по маске 3?12?14*5"}
            language="python"
            output={
              "351261495 183235\n3212614035 1675855\n3412614645 1780185\n3712414275 1936575\n3912414885 2040905"
            }
          />
          <Typography.Text>
            Пять миллионов кандидатов — пара секунд. Числа идут по возрастанию,
            так что вывод уже в нужном порядке. 0 тоже кратен 1917, но под маску
            не подходит, и начинать с него безопасно.
          </Typography.Text>
          <Typography.Text>
            Если нужен остаток — «при делении на 123 даёт остаток 42», —
            начинают с самого остатка:{" "}
            <Notation>{"range(42, limit, 123)"}</Notation> перебирает 42, 165,
            288, … — ровно числа вида 123 · k + 42.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Кратные внутри отрезка [L; R]"
          >
            <Typography.Text>
              <Notation>{"range(L, R + 1, k)"}</Notation> идёт по L, L + k, … и
              даёт кратные k, только если само L кратно k. Для [100; 150] и k =
              23 он выдаст 100, 123, 146 — ни одного кратного. Сначала найди
              первое кратное не меньше L:{" "}
              <Notation>{"start = L + (k - L % k) % k"}</Notation>. Для 100 это
              115.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "voprosy-po-maske",
      navLabel: "Числа по маске с ?",
      explanation: (
        <>
          <Typography.Text>
            Числа до 10¹² по маске <Notation>{"4?8?15?16?23"}</Notation>, дающие
            при делении на 123 остаток 42. Даже с шагом 123 это 8 миллиардов
            кандидатов. Что делать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Не искать числа, а построить их по маске: на месте каждого ? —
              цифра от 0 до 9. Четыре знака ? — это 10⁴ = 10 000 чисел, и все
              они заведомо подходят под маску.
            </strong>{" "}
            Все наборы из четырёх цифр перебирает{" "}
            <PythonTerm term="product">
              <Notation>{"product"}</Notation>
            </PythonTerm>{" "}
            из модуля <Notation>{"itertools"}</Notation>, а число собирает{" "}
            <PythonTerm term="fstring">f-строка</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from itertools import product\n\nfound = []\nfor a, b, c, d in product('0123456789', repeat=4):\n    n = int(f'4{a}8{b}15{c}16{d}23')\n    if n % 123 == 42:\n        found.append(n)\n\nprint(len(found), max(found))"
            }
            label={"Числа по маске 4?8?15?16?23"}
            language="python"
            output={"85 498915816123"}
          />
          <Typography.Text>
            <Notation>{"product('0123456789', repeat=4)"}</Notation> выдаёт
            наборы ('0', '0', '0', '0'), ('0', '0', '0', '1'), … до ('9', '9',
            '9', '9'). Подходят 85 чисел, наибольшее — 498915816123. Граница
            10¹² здесь ни при чём: все числа маски двенадцатизначные и меньше
            её.
          </Typography.Text>
          <Typography.Text>
            Если ? стоит первым, ноль на его место ставить нельзя: число не
            начинается с 0. Для первого знака бери цифры{" "}
            <Notation>{"'123456789'"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zvezdochka-po-maske",
      navLabel: "Звёздочка: product",
      explanation: (
        <>
          <Typography.Text>
            А если в маске есть *? Длина вставки заранее не известна. Как
            построить числа по маске <Notation>{"123*678"}</Notation>, не
            превышающие 10⁸, и найти среди них кратные 13?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Оценить, сколько цифр может занять звёздочка, и перебрать вставки
              каждой длины, начиная с пустой.
            </strong>{" "}
            В маске шесть обязательных цифр, а числа до 10⁸ — не длиннее восьми
            цифр. Значит, вставка — от 0 до 2 цифр:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from itertools import product\n\nfor k in range(3):\n    for x in product('0123456789', repeat=k):\n        n = int('123' + ''.join(x) + '678')\n        if n % 13 == 0:\n            print(n, n // 13)"
            }
            label={"Числа по маске 123*678"}
            language="python"
            output={
              "1237678 95206\n12300678 946206\n12313678 947206\n12326678 948206\n12339678 949206\n12352678 950206\n12365678 951206\n12378678 952206\n12391678 953206"
            }
          />
          <Typography.Text>
            <Notation>{"''.join(x)"}</Notation> склеивает набор цифр в строку.
            При k = 0 <Notation>{"product"}</Notation> выдаёт один пустой набор
            — так проверяется и 123678 без вставки. Нули внутри вставки не
            теряются: набор ('0', '0') даёт 12300678. Всего кандидатов 1 + 10 +
            100 = 111 вместо семи миллионов кратных 13.
          </Typography.Text>
          <Typography.Text>
            С двумя звёздочками перебирают обе длины так, чтобы вместе они не
            превышали свободное место. Одно и то же число тогда можно собрать
            по-разному: 1223 по маске 1*2*3 получится, если первая звёздочка
            пустая, а вторая — «2», и наоборот. Поэтому ответы складывают в{" "}
            <PythonTerm term="set">множество</PythonTerm>, оно хранит каждое
            число один раз, а в конце выводят{" "}
            <Notation>{"sorted(found)"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Что выбрать — шаг или построение? Сравни количество кандидатов. Для
            3?12?14*5 и делителя 1917 кратных пять миллионов, а построение дало
            бы 100 · (1 + 10 + 100) = 11 100 чисел — тоже годится. Когда
            делитель маленький, а маска короткая, построение выигрывает в тысячи
            раз.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "drugie-maski",
      navLabel: "Другие маски",
      explanation: (
        <>
          <Typography.Text>
            В тренировочных работах знаки маски иногда определены иначе: «?
            означает одну чётную цифру». Или маску нужно «найти в записи числа».
            Как быть?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Определение знаков всегда читают в условии и переводят в язык
              fnmatch: набор цифр в квадратных скобках — одна цифра из набора,
              звёздочки по краям — «где-то в записи».
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from fnmatch import fnmatch\n\n# ? — одна чётная цифра: [02468]\nmask = '7[02468]23[02468]64*8'\nfor n in range(0, 10**10 + 1, 2026):\n    if fnmatch(str(n), mask):\n        print(n)"
            }
            label={"Маска 7?23?64*8, где ? — чётная цифра"}
            language="python"
            output={"782386498\n7023064168\n7023864438\n7623064068\n7623864338"}
          />
          <Typography.Text>
            <Notation>{"[02468]"}</Notation> — одна чётная цифра,{" "}
            <Notation>{"[13579]"}</Notation> — одна нечётная. Если строишь числа
            по маске, на месте такого ? перебирай{" "}
            <Notation>{"'02468'"}</Notation> вместо всех цифр.
          </Typography.Text>
          <Typography.Text>
            «В записи числа можно найти маску 12*45» значит, что перед маской и
            после неё могут стоять любые цифры. Это та же проверка со
            звёздочками по краям:{" "}
            <Notation>{"fnmatch(str(n), '*12*45*')"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Маска встречается и вместе с делителями: «соответствует маске и
            имеет ровно 8 делителей». Порядок проверок тот же — сначала дешёвые:
            кратность через шаг, потом маска, и только у прошедших ищи делители.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maski-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "? и *",
                note: <>одна любая цифра; любые цифры, даже ни одной</>,
              },
              {
                key: "Проверка",
                note: <Notation>{"fnmatch(str(n), mask)"}</Notation>,
              },
              {
                key: "Шаг k, остаток r",
                note: (
                  <>
                    <Notation>{"range(r, limit + 1, k)"}</Notation>, для кратных
                    r = 0
                  </>
                ),
              },
              {
                key: "Только ?",
                note: (
                  <>
                    построить:{" "}
                    <Notation>{"product(digits, repeat=q)"}</Notation>, первая
                    цифра не 0
                  </>
                ),
              },
              {
                key: "Звёздочка",
                note: <>длины вставки от 0 до оценки; две * — во множество</>,
              },
              {
                key: "Чётная цифра",
                note: <Notation>{"[02468]"}</Notation>,
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
          Какие из чисел 1234, 12304, 123 и 1290034 соответствуют маске{" "}
          <Notation>{"12*3?"}</Notation>?
        </>
      ),
      reveal: (
        <>
          1234 (звёздочка пустая) и 1290034 (звёздочка — 900). У 12304 перед
          последней цифрой 0, а у 123 не хватает цифры для ?.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Сколько чисел соответствует маске <Notation>{"5?8?1"}</Notation>? А
          маске <Notation>{"?58"}</Notation>?
        </>
      ),
      reveal: (
        <>
          100 — по десять цифр на каждый ?. У ?58 первая цифра не может быть
          нулём: 9 чисел, от 158 до 958.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Какой <Notation>{"range"}</Notation> перебирает числа, не превышающие
          10⁹, которые при делении на 37 дают остаток 5?
        </>
      ),
      reveal: <Notation>{"range(5, 10**9 + 1, 37)"}</Notation>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Сколько цифр может занять звёздочка в маске{" "}
          <Notation>{"1*2"}</Notation>, если числа не превышают 10⁶?
        </>
      ),
      reveal: (
        <>
          От 0 до 4: числа до 10⁶ — не длиннее шести цифр (сам 10⁶ под маску не
          подходит), а две цифры уже заняты.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Зачем в построении по маске <Notation>{"123*678"}</Notation> цикл длин
          начинается с <Notation>{"k = 0"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Звёздочка может быть пустой. При k = 0 product выдаёт один пустой
          набор, и проверяется число 123678.
        </>
      ),
    },
  ],
};

export default content;
