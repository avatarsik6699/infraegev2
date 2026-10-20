import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonLogicLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-logic.media";

export const pythonLogicLesson = defineCourseLesson({
  ...pythonLogicLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Переводить «и»", "«или»", "«не» в условия"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            До сих пор программа выполняла все строки подряд. Но часто действие
            зависит от данных: хватит ли денег, делится ли число, попадает ли
            балл в нужный диапазон.{" "}
            <strong>
              Чтобы программа могла выбирать, ей нужны ответы «да» или «нет».
              Такие ответы дают сравнения, а <Notation>{"and"}</Notation>,{" "}
              <Notation>{"or"}</Notation> и <Notation>{"not"}</Notation>{" "}
              собирают из простых ответов сложные
            </strong>
            . Как программа выбирает действия по ответу, разберём в следующем
            уроке.
          </Typography.Text>
          <Typography.Text>
            Проверять условия будем на числе <Notation>{"x = 12"}</Notation>:
            чётно ли оно, делится ли на 3, лежит ли между 5 и 20.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Сравнения",
      explanation: (
        <>
          <Typography.Text>
            <strong>Сравнение отвечает на вопрос «да» или «нет».</strong> Ответ
            — одно из двух значений: <Notation>{"True"}</Notation> («да»,
            истина) или <Notation>{"False"}</Notation> («нет», ложь). Это не
            текст, а значения особого типа <Notation>{"bool"}</Notation> — того,
            что в уроке о типах был обещан на потом:
          </Typography.Text>
          <CodeBlock
            code={
              "temperature = 18\nis_warm = temperature >= 15\nprint(is_warm)\nprint(type(is_warm))"
            }
            label={"Сравнение отвечает на вопрос «да» или «нет»"}
            language="python"
            fileName="main.py"
            output={"True\n<class 'bool'>"}
          />
          <Typography.Text>
            <Notation>{"="}</Notation> присваивает, <Notation>{"=="}</Notation>{" "}
            сравнивает. В записи{" "}
            <Notation>{"is_warm = temperature >= 15"}</Notation> правая часть
            отвечает на вопрос, а <Notation>{"="}</Notation> связывает имя с
            ответом. Всего сравнений шесть:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 12\nprint(x == 12)  # равно\nprint(x != 12)  # не равно\nprint(x < 20)   # меньше\nprint(x > 20)   # больше\nprint(x <= 12)  # меньше или равно\nprint(x >= 15)  # больше или равно"
            }
            label={"Всего сравнений шесть"}
            language="python"
            fileName="main.py"
            output={"True\nFalse\nTrue\nFalse\nTrue\nFalse"}
          />
          <Typography.Text>
            Знаки из двух символов пишутся слитно: <Notation>{"<="}</Notation>,
            а не <Notation>{"< ="}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Сравнивать имеет смысл значения одного типа. Строка никогда не равна
            числу: <Notation>{'"40" == 40'}</Notation> даёт{" "}
            <Notation>{"False"}</Notation>, хотя на экране оба выглядят как 40.
            Поэтому число из <Notation>{"input"}</Notation> сначала превращают
            через <Notation>{"int"}</Notation>, как в прошлом уроке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "and, or, not",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"and"}</Notation> требует обоих условий,{" "}
              <Notation>{"or"}</Notation> — хотя бы одного,{" "}
              <Notation>{"not"}</Notation> меняет ответ на противоположный.
            </strong>{" "}
            Возьмём два простых условия для <Notation>{"x = 12"}</Notation>:{" "}
            <Notation>{"a"}</Notation> — «x чётно», <Notation>{"b"}</Notation> —
            «x больше 20»:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 12\na = x % 2 == 0\nb = x > 20\nprint(a and b)\nprint(a or b)\nprint(not b)"
            }
            label={"Два простых условия для x = 12"}
            language="python"
            fileName="main.py"
            output={"False\nTrue\nTrue"}
          />
          <Typography.Text>
            <Notation>{"a"}</Notation> истинно, <Notation>{"b"}</Notation>{" "}
            ложно. <Notation>{"and"}</Notation> требует обоих — ответ{" "}
            <Notation>{"False"}</Notation>; <Notation>{"or"}</Notation> хватает
            одного — <Notation>{"True"}</Notation>; <Notation>{"not"}</Notation>{" "}
            переворачивает ложное <Notation>{"b"}</Notation> в{" "}
            <Notation>{"True"}</Notation>. У двух условий всего четыре
            сочетания; разложим их клетками и отметим, где выражение истинно:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.truthGrids}
            caption={
              <>
                <Notation>{"and"}</Notation> истинно в одной клетке — когда
                истинны оба. <Notation>{"or"}</Notation> ложно в одной клетке —
                когда ложны оба. <Notation>{"a != b"}</Notation> истинно на
                диагонали: ровно одно из двух. Точка — наш случай{" "}
                <Notation>{"x = 12"}</Notation>: <Notation>{"a"}</Notation>{" "}
                истинно, <Notation>{"b"}</Notation> ложно.
              </>
            }
          />
          <Typography.Text>
            Обрати внимание на нижнюю правую клетку <Notation>{"or"}</Notation>:{" "}
            <Notation>{"or"}</Notation> истинно и тогда, когда верны оба
            условия, — это не «одно из двух». «Ровно одно из двух» записывают
            как <Notation>{"a != b"}</Notation>: ответы двух условий
            различаются.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: != для чисел" kind="nuance">
            <Typography.Text>
              «Ровно одно» <Notation>{"!="}</Notation> означает только между
              логическими значениями. Между числами это просто «числа
              различаются»: <Notation>{"3 != 5"}</Notation> — это{" "}
              <Notation>{"True"}</Notation>, и никакого «одного из двух» тут
              нет.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <strong>Интервал</strong> записывают цепочкой сравнений:
          </Typography.Text>
          <CodeBlock
            code={"x = 12\nprint(5 <= x < 20)\nprint(5 <= x and x < 20)"}
            label={"Интервал записывают цепочкой сравнений"}
            language="python"
            fileName="main.py"
            output={"True\nTrue"}
          />
          <Typography.Text>
            <Notation>{"5 <= x < 20"}</Notation> — то же, что{" "}
            <Notation>{"5 <= x and x < 20"}</Notation>: выполняются оба
            сравнения.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.interval5_20_12}
            caption={
              <>
                Закрашенный конец 5 входит в интервал (
                <Notation>{"<="}</Notation>), пустой конец 20 — нет (
                <Notation>{"<"}</Notation>). 12 лежит внутри, поэтому ответ{" "}
                <Notation>{"True"}</Notation>.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s2-poryadok",
      navLabel: "Порядок and, or, not",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала вычисляются сравнения, затем <Notation>{"not"}</Notation>,
              затем <Notation>{"and"}</Notation> и только потом{" "}
              <Notation>{"or"}</Notation>.
            </strong>{" "}
            Это похоже на арифметику, где умножение сильнее сложения:{" "}
            <Notation>{"and"}</Notation> сильнее <Notation>{"or"}</Notation>.
            Проверим на правиле високосного года: год високосный, если делится
            на 4 и не делится на 100 — или если делится на 400:
          </Typography.Text>
          <CodeBlock
            code={
              "y = 2000\nprint(y % 4 == 0 and y % 100 != 0 or y % 400 == 0)\nx = 12\nprint(not x % 3 == 0)"
            }
            label={"Проверим на правиле високосного года"}
            language="python"
            fileName="main.py"
            output={"True\nFalse"}
          />
          <Typography.Text>
            В первой записи Python сначала вычисляет три сравнения, затем{" "}
            <Notation>{"and"}</Notation> из первых двух, затем{" "}
            <Notation>{"or"}</Notation> с третьим. Во второй{" "}
            <Notation>{"not"}</Notation> применяется к готовому сравнению{" "}
            <Notation>{"x % 3 == 0"}</Notation>: 12 делится на 3, сравнение даёт{" "}
            <Notation>{"True"}</Notation>, а <Notation>{"not"}</Notation>{" "}
            превращает его в <Notation>{"False"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.boolTree}
            caption={
              <>
                Как в арифметике, операция выполняется, когда готовы значения
                под ней. Для 2000 первая пара сравнений даёт{" "}
                <Notation>{"True"}</Notation> и <Notation>{"False"}</Notation>,{" "}
                <Notation>{"and"}</Notation> — <Notation>{"False"}</Notation>,
                но третье сравнение истинно, и <Notation>{"or"}</Notation> даёт{" "}
                <Notation>{"True"}</Notation>. Слева{" "}
                <Notation>{"not"}</Notation> стоит над всем сравнением.
              </>
            }
          />
          <Typography.Text>
            Если сомневаешься в порядке, ставь скобки:{" "}
            <Notation>
              {"(y % 4 == 0 and y % 100 != 0) or y % 400 == 0"}
            </Notation>{" "}
            читается сразу, без знания правил.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Короткое вычисление",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Python не вычисляет часть условия, которая уже не влияет на ответ.
            </strong>{" "}
            В <Notation>{"a and b"}</Notation> значение{" "}
            <Notation>{"b"}</Notation> не нужно, если <Notation>{"a"}</Notation>{" "}
            ложно. В <Notation>{"a or b"}</Notation> значение{" "}
            <Notation>{"b"}</Notation> не нужно, если <Notation>{"a"}</Notation>{" "}
            истинно. Это называют коротким вычислением.
          </Typography.Text>
          <CodeBlock
            code={
              "x = 0\nprint(x != 0 and 10 / x > 2)\nprint(x == 0 or 10 / x > 2)"
            }
            label={"Это называют коротким вычислением"}
            language="python"
            fileName="main.py"
            output={"False\nTrue"}
          />
          <LessonDiagram
            {...lessonMedia.shortCircuit}
            caption={
              <>
                Как только левой части хватает для ответа, правая пропускается.
                Поэтому <Notation>{"10 / x"}</Notation> при{" "}
                <Notation>{"x = 0"}</Notation> не выполняется ни в одной строке.
              </>
            }
          />
          <Typography.Text>
            Деления на ноль нет ни в одной строке: правая часть не вычислялась.
            Порядок частей значим: проверка, которая защищает от ошибки, должна
            стоять раньше действия, которое без неё упадёт. Если переставить
            части, <Notation>{"10 / x > 2 and x != 0"}</Notation> остановится с{" "}
            <Notation>{"ZeroDivisionError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Истинность значений",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Любое значение в условии считается истинным или ложным.
            </strong>{" "}
            Ноль, пустая строка и <Notation>{"None"}</Notation> считаются
            ложными; ненулевые числа и непустые строки — истинными. Позднее к
            ложным добавятся пустые коллекции.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.truthy}
            caption={
              <>
                Ложных значений немного, их легко запомнить: ноль, пустая
                строка, <Notation>{"None"}</Notation> и сам{" "}
                <Notation>{"False"}</Notation>. Всё остальное истинно, в том
                числе строки <Notation>{'"0"'}</Notation>,{" "}
                <Notation>{'"False"'}</Notation> и строка из одного пробела.
              </>
            }
          />
          <Typography.Text>
            <Notation>{"bool(value)"}</Notation> показывает, истинно ли
            значение. <Notation>{'bool("False")'}</Notation> равно{" "}
            <Notation>{"True"}</Notation>: строка непустая, а английское слово в
            ней Python не читает.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"or"}</Notation> и <Notation>{"and"}</Notation>{" "}
            возвращают одну из своих частей, а не обязательно{" "}
            <Notation>{"True"}</Notation> или <Notation>{"False"}</Notation>.{" "}
            <Notation>{"or"}</Notation> с ложной левой частью отдаёт правую,{" "}
            <Notation>{"and"}</Notation> с ложной левой частью отдаёт её саму:{" "}
            <Notation>{"0 and 5"}</Notation> — это 0. Со сравнениями этого не
            видно: их части и так <Notation>{"True"}</Notation> или{" "}
            <Notation>{"False"}</Notation>. Зато отсюда частая ошибка: «x равно
            2 или 3» хочется записать как <Notation>{"x == 2 or 3"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"x = 12\nprint(x == 2 or 3)\nprint(x == 2 or x == 3)"}
            label={"x == 2 or 3 — частая ошибка"}
            language="python"
            fileName="main.py"
            output={"3\nFalse"}
          />
          <Typography.Text>
            Python читает первую запись как{" "}
            <Notation>{"(x == 2) or 3"}</Notation>. Левая часть ложна, и{" "}
            <Notation>{"or"}</Notation> отдаёт правую — само число 3. А 3 в
            условии истинно, поэтому такое «условие» выполняется при любом{" "}
            <Notation>{"x"}</Notation>. Сравнение нужно повторить:{" "}
            <Notation>{"x == 2 or x == 3"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: запасное значение через or"
            kind="nuance"
          >
            <Typography.Text>
              Точное правило: <Notation>{"or"}</Notation> возвращает первую
              истинную часть, а если такой нет — последнюю;{" "}
              <Notation>{"and"}</Notation> — первую ложную или последнюю. На
              этом держится запись запасного значения:{" "}
              <Notation>{'"" or "Без названия"'}</Notation> даёт «Без названия»,
              а <Notation>{"5 and 8"}</Notation> — 8.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Отрицание и импликация",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Отрицание составного условия меняет <Notation>{"and"}</Notation>{" "}
              на <Notation>{"or"}</Notation>.
            </strong>{" "}
            Выражение <Notation>{"not (a and b)"}</Notation> истинно, когда хотя
            бы одно из условий ложно; оно равносильно{" "}
            <Notation>{"(not a) or (not b)"}</Notation>. Аналогично{" "}
            <Notation>{"not (a or b)"}</Notation> равносильно{" "}
            <Notation>{"(not a) and (not b)"}</Notation>. Проверим на{" "}
            <Notation>{"x = 12"}</Notation>: «неверно, что x чётно и больше 20»
            — то же, что «x нечётно или не больше 20»:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 12\nprint(not (x % 2 == 0 and x > 20))\nprint(x % 2 != 0 or x <= 20)"
            }
            label={"Отрицание составного условия меняет and на or"}
            language="python"
            fileName="main.py"
            output={"True\nTrue"}
          />
          <Typography.Text>
            <strong>Импликация</strong> «если A, то B» ложна только при истинном
            A и ложном B. Её можно записать{" "}
            <Notation>{"(not A) or B"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.truthGrids_d041ff}
            caption={
              <>
                Единственная ложная клетка — A истинно, B ложно: обещание «если
                A, то B» нарушено. Если A ложно, обещание не проверяется, и
                импликация истинна.
              </>
            }
          />
          <Typography.Text>
            В задачах ЕГЭ о логике (например, в задачах 2 и 15) встречаются
            импликация → и тождество ≡. В Python их записывают так: A → B — это{" "}
            <Notation>{"(not A) or B"}</Notation>, A ≡ B — это{" "}
            <Notation>{"A == B"}</Notation>: ответы двух условий совпадают.
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
            Что напечатает <Notation>{"print(7 >= 7, 7 > 7)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            True False: <Notation>{">="}</Notation> включает равенство,{" "}
            <Notation>{">"}</Notation> — нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Программа из двух строк <Notation>{"x = input()"}</Notation> и{" "}
            <Notation>{"print(x == 5)"}</Notation>. Что она напечатает, если
            ввести 5? Почему?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            False: <Notation>{"input"}</Notation> вернул строку{" "}
            <Notation>{'"5"'}</Notation>, а строка не равна числу. Нужно{" "}
            <Notation>{"int(input()) == 5"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Чему равно <Notation>{"True or False and False"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            True: <Notation>{"and"}</Notation> выполняется раньше —{" "}
            <Notation>{"False and False"}</Notation> даёт False, затем{" "}
            <Notation>{"True or False"}</Notation> — True.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Пусть <Notation>{"x = 0"}</Notation>. Что случится при{" "}
            <Notation>{"print(10 / x > 2 and x != 0)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"ZeroDivisionError"}</Notation>: левая часть вычисляется
            первой, а в ней деление на ноль. Проверку{" "}
            <Notation>{"x != 0"}</Notation> нужно поставить слева.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает <Notation>{"print(x == 1 or 2)"}</Notation> при{" "}
            <Notation>{"x = 5"}</Notation>? Как записать условие «x равно 1 или
            2» правильно?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2: левая часть ложна, и <Notation>{"or"}</Notation> отдаёт правую —
            число 2. Верно: <Notation>{"x == 1 or x == 2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        За урок ты научился задавать программе вопросы и собирать из простых
        ответов сложные. В следующем уроке программа начнёт по этим ответам
        выбирать, что делать. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Сравнения",
            note: (
              <>
                <Notation>{"== != < > <= >="}</Notation> дают{" "}
                <Notation>{"True"}</Notation> или <Notation>{"False"}</Notation>{" "}
                — значения типа <Notation>{"bool"}</Notation>.{" "}
                <Notation>{"="}</Notation> присваивает,{" "}
                <Notation>{"=="}</Notation> сравнивает.
              </>
            ),
          },
          {
            key: <Notation>{"and, or, not"}</Notation>,
            note: (
              <>
                Оба; хотя бы одно, в том числе оба; наоборот. «Ровно одно» —{" "}
                <Notation>{"a != b"}</Notation>.
              </>
            ),
          },
          {
            key: "Порядок",
            note: (
              <>
                Сравнения, <Notation>{"not"}</Notation>,{" "}
                <Notation>{"and"}</Notation>, <Notation>{"or"}</Notation>.
                Сомневаешься — ставь скобки.
              </>
            ),
          },
          {
            key: "Интервал",
            note: (
              <>
                <Notation>{"5 <= x < 20"}</Notation> — то же, что{" "}
                <Notation>{"5 <= x and x < 20"}</Notation>.
              </>
            ),
          },
          {
            key: "Короткое вычисление",
            note: (
              <>
                Правая часть не вычисляется, если ответ уже известен: проверка,
                которая защищает от ошибки, — первой.
              </>
            ),
          },
          {
            key: "Истинность",
            note: (
              <>
                Ложны 0, пустая строка, <Notation>{"None"}</Notation> и{" "}
                <Notation>{"False"}</Notation>. Пиши{" "}
                <Notation>{"x == 2 or x == 3"}</Notation>, а не{" "}
                <Notation>{"x == 2 or 3"}</Notation>.
              </>
            ),
          },
          {
            key: "Отрицание",
            note: (
              <>
                <Notation>{"not (a and b)"}</Notation> —{" "}
                <Notation>{"not a or not b"}</Notation>;{" "}
                <Notation>{"not (a or b)"}</Notation> —{" "}
                <Notation>{"not a and not b"}</Notation>.
              </>
            ),
          },
          {
            key: "→ и ≡",
            note: (
              <>
                A → B — <Notation>{"(not A) or B"}</Notation>; A ≡ B —{" "}
                <Notation>{"A == B"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
