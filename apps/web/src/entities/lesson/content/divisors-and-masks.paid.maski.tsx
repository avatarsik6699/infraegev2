// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  MaskSandbox,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./divisors-and-masks.paid.maski.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "maski-ideya",
      navLabel: "Главная идея",
      explanation: (
        <>
          <Typography.Text>
            Главная идея подтемы:{" "}
            <strong>
              маска описывает запись числа, а не его арифметические свойства,
              поэтому кандидатов можно либо проверять по маске, либо сразу
              строить по ней
            </strong>
            . Маски с делимостью стабильно встречаются на экзамене с 2022 года:
            это больше трети задач задания 25.
          </Typography.Text>
          <Typography.Text>
            Работу со строками — <Notation>{"str"}</Notation>,{" "}
            <Notation>{"int"}</Notation>, <Notation>{"len"}</Notation> — мы
            разобрали в подтеме 1. Функция <Notation>{"get_divisors"}</Notation>{" "}
            из подтемы 2 понадобится в конце.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "znaki-maski",
      navLabel: "Знаки ? и *",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Теперь перейдём к маскам: они описывают не арифметические свойства
              числа, а его запись цифрами.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Маска — образец, с которым сравнивается десятичная запись числа. В
            стандартных условиях задания обычная цифра должна стоять на
            указанном месте, <Notation>{"?"}</Notation> заменяет ровно одну
            произвольную цифру, а <Notation>{"*"}</Notation> —
            последовательность цифр любой длины, в том числе нулевой.
          </Typography.Text>
          <Typography.Text>
            Так, маске <Notation>{"12?4"}</Notation> соответствуют 1204, 1214,
            1224, …, 1294. А маске <Notation>{"12*4"}</Notation> — например,
            124, 1204, 1234, 12004 и 1234564: звёздочка в них обозначает пустую
            строку, <Notation>{"0"}</Notation>, <Notation>{"3"}</Notation>,{" "}
            <Notation>{"00"}</Notation> и <Notation>{"3456"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>Пустая строка и цифра 0 — разные вещи.</strong> Подставив
            вместо <Notation>{"*"}</Notation> в маске{" "}
            <Notation>{"12*4"}</Notation> ничего, получим 124, подставив{" "}
            <Notation>{"0"}</Notation> — 1204, а <Notation>{"00"}</Notation> —
            12004. Если забыть пустой вариант, часть подходящих чисел будет
            потеряна.
          </Typography.Text>
          <Typography.Text>
            Рассмотрим маску посложнее — <Notation>{"12*3?"}</Notation>. В ней
            фиксировано начало <Notation>{"12"}</Notation>, затем идёт
            произвольная вставка, затем цифра <Notation>{"3"}</Notation> и ровно
            одна любая цифра. Разложим несколько чисел по её частям: каждая
            цифра числа становится под ту часть маски, которой она
            соответствует.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.maskAlign123}
            caption={
              <>
                Числа, разложенные по частям маски 12*3?. Звёздочка может
                забрать любое количество цифр, в том числе ни одной. Серые
                клетки — числа, которые разложить по маске нельзя: у 12304 перед
                последней цифрой стоит 0, а требуется 3, а у 123 не хватает
                цифры для ?.
              </>
            }
          />
          <Typography.Text>
            Если в маске несколько вопросительных знаков, каждый заполняется
            независимо: они не обязаны обозначать одинаковые цифры.
          </Typography.Text>
          <Typography.Text>
            Попробуйте сами: поменяйте маску или число и посмотрите, как цифры
            распределяются по её частям. Например, проверьте 12304, 1203 и
            1239934 для маски <Notation>{"12*3?"}</Notation> или придумайте свою
            маску.
          </Typography.Text>
          <MaskSandbox defaultMask="12*3?" defaultNumber="120034" />
        </>
      ),
    },
    {
      id: "dlina-zvezdochki",
      navLabel: "Длина звёздочки",
      explanation: (
        <>
          <Typography.Text>
            Это удобно для определения возможной длины звёздочки. В маске{" "}
            <Notation>{"12*3?"}</Notation> обязательных цифр четыре: две в{" "}
            <Notation>{"12"}</Notation>, одна <Notation>{"3"}</Notation> и одна
            для <Notation>{"?"}</Notation>. Поэтому при ограничении до
            шестизначных чисел звёздочка может содержать 0, 1 или 2 цифры. При
            произвольном ограничении <Notation>{"limit"}</Notation> безопасная
            верхняя оценка такая:
          </Typography.Text>
          <CodeBlock
            code={"max_star_length = len(str(limit)) - 4"}
            label={
              "При произвольном ограничении limit безопасная верхняя оценка такая"
            }
            language="python"
          />
          <Typography.Text>
            После генерации всё равно нужно проверять{" "}
            <Notation>{"n <= limit"}</Notation>: количество цифр само по себе не
            гарантирует численную границу. Числа 120000 и 999999 оба
            шестизначные, но при ограничении 200000 второе уже не подходит.
          </Typography.Text>
          <Typography.Text>
            И помните, что 10⁹ = 1000000000 имеет <strong>десять</strong> цифр.
            Формулировки «меньше 10⁹» и «не больше 10⁹» отличаются включением
            этой границы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fnmatch",
      navLabel: "Проверка fnmatch",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Проверить соответствие готового числа маске можно стандартной
              функцией <Notation>{"fnmatch"}</Notation>.
            </strong>{" "}
            Её подключают строкой{" "}
            <PythonTerm term="import">
              <Notation>{"from fnmatch import fnmatch"}</Notation>
            </PythonTerm>{" "}
            и вызывают как <Notation>{"fnmatch(str(n), mask)"}</Notation>:
            первый аргумент — проверяемая строка, второй — маска.
          </Typography.Text>
          <CodeBlock
            code={
              'from fnmatch import fnmatch\n\nprint(fnmatch("1234", "12*3?"))\nprint(fnmatch("12304", "12*3?"))'
            }
            label={"Код на Python: from fnmatch import fnmatch"}
            language="python"
            output={"True\nFalse"}
          />
          <Typography.Text>
            Функция сопоставляет строку с шаблоном целиком. В самой{" "}
            <Notation>{"fnmatch"}</Notation> знаки <Notation>{"?"}</Notation> и{" "}
            <Notation>{"*"}</Notation> работают с произвольными символами; когда
            передаём <Notation>{"str(n)"}</Notation> для натурального числа,
            строка состоит только из цифр, поэтому это соответствует смыслу
            числовой маски.{" "}
            <ExternalLink href="https://docs.python.org/3/library/fnmatch.html">
              Python 3.14.8 documentation
            </ExternalLink>
          </Typography.Text>
          <Typography.Text>
            При этом <Notation>{"fnmatch"}</Notation> проверяет только маску.
            Делимость числа, верхнюю границу, количество делителей и другие
            ограничения она не проверяет — их нужно учитывать отдельно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-kratnyh",
      navLabel: "Перебор кратных",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если число должно делиться на k, выгодно перебирать только кратные
              k.
            </strong>{" "}
            Это первый основной способ решения задач на маски.
          </Typography.Text>
          <Typography.Text>
            Положительные числа, кратные k, — это k, 2k, 3k, 4k, … Для их
            перебора у{" "}
            <PythonTerm term="for">
              <Notation>{"range"}</Notation>
            </PythonTerm>{" "}
            есть третий аргумент — шаг:
          </Typography.Text>
          <CodeBlock
            code={"for n in range(7, 31, 7):\n    print(n)"}
            label={"Код на Python: for n in range(7, 31, 7):"}
            language="python"
            output={"7\n14\n21\n28"}
          />
          <blockquote>
            <Typography.Text>
              Найти числа не больше 99 999, запись которых соответствует маске{" "}
              <Notation>{"12*3?"}</Notation>, а сами числа делятся на 13.
              Вывести числа и частные.
            </Typography.Text>
          </blockquote>
          <CodeBlock
            code={
              'from fnmatch import fnmatch\n\nlimit = 99_999\ndivisor = 13\n\nfor n in range(divisor, limit + 1, divisor):\n    if fnmatch(str(n), "12*3?"):\n        print(n, n // divisor)'
            }
            label={"Код на Python: from fnmatch import fnmatch"}
            language="python"
            output={
              "1235 95\n12038 926\n12233 941\n12337 949\n12532 964\n12636 972\n12831 987\n12935 995"
            }
          />
          <Typography.Text>
            Подчёркивание в <Notation>{"99_999"}</Notation> нужно только для
            удобства чтения — это то же значение, что{" "}
            <Notation>{"99999"}</Notation>. Перебор уже обеспечивает
            положительность чисел (начали с 13), делимость на 13 (шаг 13),
            верхнюю границу и порядок возрастания. Внутри цикла остаётся
            проверить маску, а проверка <Notation>{"n % 13 == 0"}</Notation>{" "}
            здесь не нужна: она всегда истинна.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervoe-kratnoe",
      navLabel: "Первое кратное",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При поиске кратных внутри отрезка важно правильно выбрать первое
              число.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Частая ошибка — думать, что{" "}
            <Notation>{"range(L, R + 1, k)"}</Notation> перебирает кратные{" "}
            <Notation>{"k"}</Notation>. На самом деле он перебирает L, L + k, L
            + 2k, … — и если само L не кратно k, все эти числа имеют тот же
            ненулевой остаток:
          </Typography.Text>
          <CodeBlock
            code={"print(list(range(100, 151, 23)))"}
            label={"Код на Python: print(list(range(100, 151, 23)))"}
            language="python"
            output={"[100, 123, 146]"}
          />
          <Typography.Text>
            Ни одно из них не кратно 23. Нужно сначала найти первое кратное, не
            меньшее L:
          </Typography.Text>
          <CodeBlock
            code={"start = L\n\nif L % k != 0:\n    start = L + (k - L % k)"}
            label={
              "Ни одно из них не кратно 23. Нужно сначала найти первое кратное, не меньшее L"
            }
            language="python"
          />
          <Typography.Text>
            Для L = 100 и k = 23: 100 = 23 · 4 + 8, до следующего кратного не
            хватает 23 − 8 = 15, поэтому start = 100 + 15 = 115. Теперь{" "}
            <Notation>{"range(start, R + 1, k)"}</Notation> даёт нужные кратные.
          </Typography.Text>
          <Typography.Text>
            Ту же границу можно вычислить одной формулой — она округляет L / k
            вверх до целого и умножает на k. Для понимания достаточно сначала
            уверенно пользоваться вариантом через остаток.
          </Typography.Text>
          <CodeBlock
            code={"start = ((L + k - 1) // k) * k"}
            label={
              "Для понимания достаточно сначала уверенно пользоваться вариантом через остаток"
            }
            language="python"
          />
        </>
      ),
    },
    {
      id: "generaciya-po-maske",
      navLabel: "Генерация по маске",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Второй основной способ решения масок — создавать числа сразу по
              маске.
            </strong>{" "}
            Иногда это значительно быстрее перебора кратных.
          </Typography.Text>
          <Typography.Text>
            Если искать до 10⁹ среди кратных 23, получится примерно 10⁹ / 23 ≈
            43,5 млн кандидатов. Но если маска содержит только два
            вопросительных знака и больше никаких переменных мест, ей
            соответствуют всего 10 · 10 = 100 записей — при условии, что первая
            цифра уже фиксирована и не равна нулю. Вместо десятков миллионов
            проверок можно выполнить сто.
          </Typography.Text>
          <Typography.Text>
            Например, в одной из задач такого типа используется маска{" "}
            <Notation>{"12345?7?8"}</Notation>, требуется делимость на 23, а
            верхняя граница равна 10⁹.
          </Typography.Text>
          <Typography.Text>
            Обозначим цифры на местах вопросительных знаков через{" "}
            <Notation>{"a"}</Notation> и <Notation>{"b"}</Notation>: число имеет
            вид <Notation>{"12345 a 7 b 8"}</Notation>, и каждая из цифр
            принимает значения от 0 до 9. Вложенные циклы перебирают для каждого{" "}
            <Notation>{"a"}</Notation> все десять значений{" "}
            <Notation>{"b"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'answers = []\n\nfor a in range(10):\n    for b in range(10):\n        s = "12345" + str(a) + "7" + str(b) + "8"\n        n = int(s)\n\n        if n <= 10 ** 9 and n % 23 == 0:\n            answers.append(n)\n\nfor n in sorted(answers):\n    print(n, n // 23)'
            }
            label={
              "Вложенные циклы перебирают для каждого a все десять значений b"
            }
            language="python"
            output={
              "123450798 5367426\n123451718 5367466\n123453788 5367556\n123454708 5367596\n123456778 5367686\n123459768 5367816"
            }
          />
          <Typography.Text>
            Соответствие маске здесь гарантируется самим способом построения
            числа.
          </Typography.Text>
          <Typography.Text>
            То же число можно собрать арифметически: n = 123450708 + 1000a +
            10b, потому что <Notation>{"a"}</Notation> стоит в разряде тысяч, а{" "}
            <Notation>{"b"}</Notation> — в разряде десятков. Строковый вариант
            обычно проще читать, а арифметический помогает увидеть связь маски с
            разрядами числа.
          </Typography.Text>
          <CodeBlock
            code={"n = 123450708 + 1000 * a + 10 * b"}
            label={"Код на Python: n = 123450708 + 1000 * a + 10 * b"}
            language="python"
          />
        </>
      ),
    },
    {
      id: "ocenka-kandidatov",
      navLabel: "Оценка кандидатов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество кандидатов нужно оценивать до запуска программы.
            </strong>{" "}
            Это помогает выбрать между перебором кратных и генерацией по маске.
          </Typography.Text>
          <Typography.Text>
            Для маски без звёздочек с q вопросительными знаками число комбинаций
            обычно 10<sup>q</sup>. Если вопросительный знак стоит первым, нельзя
            разрешать ему принимать 0 в обычной записи многозначного числа.
          </Typography.Text>
          <Typography.Text>
            Для одной звёздочки длиной от 0 до s количество вариантов её
            заполнения — 1 + 10 + 10² + … + 10<sup>s</sup>. Первый член равен 1,
            потому что пустая строка — один вариант; длина 1 даёт десять
            вариантов <Notation>{"0"}</Notation>–<Notation>{"9"}</Notation>,
            длина 2 — сто вариантов <Notation>{"00"}</Notation>–
            <Notation>{"99"}</Notation>, длина 3 — тысячу. Если дополнительно
            есть q вопросительных знаков, количество сочетаний при фиксированном
            ненулевом начале — 10<sup>q</sup> · (1 + 10 + … + 10<sup>s</sup>).
          </Typography.Text>
          <Typography.Text>
            Например, у маски <Notation>{"12*3?"}</Notation> при ограничении до
            шести цифр один вопросительный знак и звёздочка длиной от 0 до 2.
            Получаем 10 · (1 + 10 + 100) = 1110 кандидатов.
          </Typography.Text>
          <Typography.Text>
            Это число сравнивают с количеством кратных в разрешённом диапазоне и
            выбирают более короткий перебор. Учитывать нужно и стоимость
            проверки: найти остаток от деления обычно дешевле, чем полностью
            найти делители большого числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nuli-v-zvezdochke",
      navLabel: "Нули в звёздочке",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Генерация звёздочки требует сохранять нули внутри подстановки.
            </strong>{" "}
            Это одна из самых частых ошибок в задачах на маски.
          </Typography.Text>
          <Typography.Text>
            Если звёздочка должна заменять две цифры, нужны все варианты{" "}
            <Notation>{"00"}</Notation>, <Notation>{"01"}</Notation>, …,{" "}
            <Notation>{"09"}</Notation>, <Notation>{"10"}</Notation>, …,{" "}
            <Notation>{"99"}</Notation>. Но <Notation>{"str(7)"}</Notation> даёт{" "}
            <Notation>{'"7"'}</Notation>, а не <Notation>{'"07"'}</Notation>:
            если напрямую использовать числа от 0 до 99, вставки{" "}
            <Notation>{"00"}</Notation>–<Notation>{"09"}</Notation> не будут
            двухсимвольными строками. Дополнить строку нулями слева до нужной
            длины помогает метод <Notation>{"zfill"}</Notation> — действие,
            которое вызывают через точку у строки:
          </Typography.Text>
          <CodeBlock
            code={
              "print(str(7).zfill(2), str(0).zfill(2))\nprint(str(42).zfill(2), str(7).zfill(3))"
            }
            label={"Код на Python: print(str(7).zfill(2), str(0).zfill(2))"}
            language="python"
            output={"07 00\n42 007"}
          />
          <Typography.Text>
            Теперь построим числа по маске <Notation>{"12*3?"}</Notation> для
            уже знакомого условия: <Notation>{"n <= 99_999"}</Notation> и число
            кратно 13.
          </Typography.Text>
          <CodeBlock
            code={
              'limit = 99_999\ndivisor = 13\n\nmandatory_length = 4\nmax_star_length = len(str(limit)) - mandatory_length\n\nanswers = []\n\nfor length in range(max_star_length + 1):\n    for value in range(10 ** length):\n        if length == 0:\n            star = ""\n        else:\n            star = str(value).zfill(length)\n\n        for digit in range(10):\n            s = "12" + star + "3" + str(digit)\n            n = int(s)\n\n            if n <= limit and n % divisor == 0:\n                answers.append(n)\n\nfor n in sorted(answers):\n    print(n, n // divisor)'
            }
            label={"для уже знакомого условия: n <= 99_999 и число кратно 13"}
            language="python"
            output={
              "1235 95\n12038 926\n12233 941\n12337 949\n12532 964\n12636 972\n12831 987\n12935 995"
            }
          />
          <Typography.Text>
            Ответ совпал с перебором кратных. В маске четыре обязательные цифры,
            звёздочка добавляет к ним новые. Внешний цикл перебирает длину
            вставки, начиная с нулевой, а следующий — значения, которыми можно
            заполнить вставку этой длины: при{" "}
            <Notation>{"length == 2"}</Notation> это 0, 1, …, 99, а после{" "}
            <Notation>{"zfill(2)"}</Notation> — <Notation>{"00"}</Notation>,{" "}
            <Notation>{"01"}</Notation>, …, <Notation>{"99"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Нулевая длина обрабатывается отдельно. При ней{" "}
            <Notation>{"range(10 ** 0)"}</Notation> — это{" "}
            <Notation>{"range(1)"}</Notation>, один проход со значением 0, но
            нужна не строка <Notation>{'"0"'}</Notation>, а отсутствие символов
            — <Notation>{'""'}</Notation>. В этом примере верхняя граница
            пятизначная, поэтому звёздочка имеет длину 0 или 1. Если заменить{" "}
            <Notation>{"limit"}</Notation> на <Notation>{"999_999"}</Notation>,
            та же программа сама начнёт рассматривать и двухсимвольные вставки,
            включая <Notation>{"00"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нули внутри числа не исчезают при преобразовании всей записи в{" "}
              <Notation>{"int"}</Notation>.
            </strong>{" "}
            <Notation>{'int("12" + "00" + "3" + "4")'}</Notation> даёт 120034.
            Проблема возникает тогда, когда нужные нули потеряны ещё до
            соединения частей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-zvezdochek",
      navLabel: "Начальные нули и несколько *",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Начальные нули и несколько звёздочек требуют отдельного внимания.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Обычная десятичная запись натурального числа не начинается с нуля:{" "}
            <Notation>{'int("0123")'}</Notation> даёт 123, а запись{" "}
            <Notation>{"str(123)"}</Notation> — это{" "}
            <Notation>{'"123"'}</Notation>, не <Notation>{'"0123"'}</Notation>.
            Поэтому при генерации четырёхзначного числа по маске{" "}
            <Notation>{"?123"}</Notation> первый вопросительный знак должен
            принимать значения от 1 до 9:
          </Typography.Text>
          <CodeBlock
            code={
              'for first_digit in range(1, 10):\n    n = int(str(first_digit) + "123")'
            }
            label={"Код на Python: for first_digit in range(1, 10):"}
            language="python"
          />
          <Typography.Text>
            Если маска начинается со звёздочки или устроена сложнее, полезно
            дополнительно проверять уже полученное число через{" "}
            <Notation>{"fnmatch(str(n), mask)"}</Notation>: так с маской
            сравнивается именно обычная запись числа.
          </Typography.Text>
          <Typography.Text>
            При нескольких звёздочках одно число иногда можно получить разными
            способами. Для маски <Notation>{"1*2*3"}</Notation> число 1223
            собирается и как 1 + "" + 2 + "2" + 3, и как 1 + "2" + 2 + "" + 3:
            число одно, а способов подстановки два. Если генерация допускает
            такие совпадения, результаты удобно складывать в{" "}
            <PythonTerm term="set">множество</PythonTerm> — повторов в нём не
            будет:
          </Typography.Text>
          <CodeBlock
            code={"answers = set()"}
            label={"Код на Python: answers = set()"}
            language="python"
          />
          <Typography.Text>
            Число добавляют через <Notation>{"answers.add(n)"}</Notation>, а
            после завершения выводят по возрастанию:
          </Typography.Text>
          <CodeBlock
            code={"for n in sorted(answers):\n    print(n)"}
            label={
              "Число добавляют через answers.add(n), а после завершения выводят по возрастанию"
            }
            language="python"
          />
          <Typography.Text>
            Для масок с несколькими звёздочками перебор кратных с проверкой{" "}
            <Notation>{"fnmatch"}</Notation> часто оказывается проще по
            устройству. Его всё равно нужно предварительно оценить по количеству
            кандидатов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maska-i-deliteli",
      navLabel: "Маска и делители",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условия на маску и делители можно объединять в одной программе.
            </strong>{" "}
            Здесь полезно сначала выполнять проверки, которые быстро отбрасывают
            неподходящие числа.
          </Typography.Text>
          <Typography.Text>
            Пусть число должно соответствовать маске, делиться на заданное{" "}
            <Notation>{"k"}</Notation> и иметь ровно определённое количество
            делителей. Разумный порядок: получить кратные{" "}
            <Notation>{"k"}</Notation> или сразу сгенерировать числа по маске,
            проверить оставшееся простое условие и только затем искать делители.
          </Typography.Text>
          <CodeBlock
            code={
              'from fnmatch import fnmatch\n\nlimit = 100_000\nk = 37\n\nfor n in range(k, limit + 1, k):\n    if fnmatch(str(n), "1?2*"):\n        D = get_divisors(n)\n\n        if len(D) == 8:\n            print(n)'
            }
            label={"Код на Python: from fnmatch import fnmatch"}
            language="python"
          />
          <Typography.Text>
            Сначала маска отбирает небольшую часть кандидатов, и полный поиск
            делителей выполняется только для них.
          </Typography.Text>
          <Typography.Text>
            Маска может относиться и не к исходному числу, а к его делителю.
            Здесь ищутся делители, запись которых начинается на 1 и
            заканчивается на 7 с допустимой вставкой между ними:
          </Typography.Text>
          <CodeBlock
            code={
              'selected = []\n\nfor d in get_divisors(n):\n    if fnmatch(str(d), "1*7"):\n        selected.append(d)'
            }
            label={"Код на Python: selected = []"}
            language="python"
          />
          <Typography.Text>
            Поэтому сначала нужно определить <strong>объект условия</strong>:
            маска самого числа, маска делителя, окончание суммы делителей или
            простота вычисленной величины. В коде эти проверки выглядят похоже,
            но выполняются над разными переменными.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "opredelenie-znakov",
      navLabel: "Определение знаков",
      explanation: (
        <>
          <Typography.Text>
            <strong>Определение знаков маски всегда читаем в условии.</strong> В
            тренировочных работах встречаются маски, где{" "}
            <Notation>{"?"}</Notation> означает не любую цифру, а только{" "}
            <strong>чётную</strong> или только <strong>нечётную</strong>.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"fnmatch"}</Notation> позволяет записать набор допустимых
            символов в квадратных скобках: <Notation>{"[02468]"}</Notation> —
            одна чётная цифра, <Notation>{"[13579]"}</Notation> — одна нечётная.
            Например, если <Notation>{"?"}</Notation> в маске{" "}
            <Notation>{"5?8*1"}</Notation> означает чётную цифру, для{" "}
            <Notation>{"fnmatch"}</Notation> ту же маску пишут как{" "}
            <Notation>{"5[02468]8*1"}</Notation>. Посчитаем кратные 701 не
            больше 10⁷, подходящие под неё:
          </Typography.Text>
          <CodeBlock
            code={
              'from fnmatch import fnmatch\n\ncount = 0\n\nfor n in range(701, 10 ** 7 + 1, 701):\n    if fnmatch(str(n), "5[02468]8*1"):\n        count += 1\n\nprint(count)'
            }
            label={"Посчитаем кратные 701 не больше 10⁷, подходящие под неё"}
            language="python"
            output={"9"}
          />
          <Typography.Text>
            Если же числа генерируются по маске, для такого{" "}
            <Notation>{"?"}</Notation> вместо <Notation>{"range(10)"}</Notation>{" "}
            перебирают <Notation>{"[0, 2, 4, 6, 8]"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maski-korotko",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    <Notation>{"?"}</Notation> — ровно одна цифра;{" "}
                    <Notation>{"*"}</Notation> — любая последовательность,{" "}
                    <strong>в том числе пустая</strong>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Готовое число проверяем{" "}
                    <Notation>{"fnmatch(str(n), mask)"}</Notation>. Сама маска
                    не проверяет делимость и границы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    При делимости на k перебираем кратные:{" "}
                    <Notation>{"range(первое_кратное, R + 1, k)"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Если переменных мест мало, строим числа по маске. Вставки
                    звёздочки дополняем нулями: <Notation>{"zfill"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Перед запуском оцениваем число кандидатов обоими способами и
                    выбираем меньший перебор.
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
      id: "zfill",
      prompt: (
        <>
          Что вернёт <Notation>{"str(5).zfill(3)"}</Notation>? Почему без{" "}
          <Notation>{"zfill"}</Notation> генерация по маске{" "}
          <Notation>{"1*2"}</Notation> потеряет число 1052?
        </>
      ),
      reveal: (
        <>
          <Notation>{'"005"'}</Notation>. Число 1052 получается вставкой{" "}
          <Notation>{"05"}</Notation>. Если перебирать вставку как числа 0…99
          через <Notation>{"str(value)"}</Notation>, значение 5 даст строку{" "}
          <Notation>{'"5"'}</Notation>, и вместо 1052 получится 152.
        </>
      ),
    },
  ],
};

export default content;
