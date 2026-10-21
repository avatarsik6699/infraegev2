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
import { pythonFunctionsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-functions.media";

export const pythonFunctionsLesson = defineCourseLesson({
  ...pythonFunctionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Писать функции", "Различать return и print"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Ты уже вызывал готовые действия: <Notation>{"print"}</Notation>,{" "}
            <Notation>{"len"}</Notation>, <Notation>{"max"}</Notation>. Когда
            одно и то же вычисление нужно в нескольких местах, его хочется
            записать один раз и вызывать по имени.{" "}
            <strong>
              Функция — именованное действие: ей передают входные данные, она
              возвращает результат туда, где её вызвали
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Начнём с площади прямоугольника 3 × 5, затем разберём, чем{" "}
            <Notation>{"return"}</Notation> отличается от{" "}
            <Notation>{"print"}</Notation>, почему имена внутри функции не
            мешают внешним и что бывает, когда функция получает список.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Функция",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Функция даёт имя действию с входными данными и результатом.
            </strong>{" "}
            Посчитаем площадь прямоугольника функцией:
          </Typography.Text>
          <CodeBlock
            code={
              "def rectangle_area(width, height):\n    return width * height\n\narea = rectangle_area(3, 5)\nprint(area)\nprint(rectangle_area(2, 10))"
            }
            label={"Функция площади прямоугольника"}
            language="python"
            fileName="main.py"
            output={"15\n20"}
          />
          <Typography.Text>
            <Notation>{"def"}</Notation> создаёт функцию.{" "}
            <Notation>{"rectangle_area"}</Notation> — её имя.{" "}
            <Notation>{"width"}</Notation> и <Notation>{"height"}</Notation> —{" "}
            <strong>параметры</strong>, то есть локальные имена для входных
            данных. В вызове числа 3 и 5 — <strong>аргументы</strong>,
            конкретные переданные значения.
          </Typography.Text>
          <Typography.Text>
            При выполнении <Notation>{"def"}</Notation> тело не запускается: оно
            выполняется при каждом вызове. Поэтому одну функцию можно вызвать
            много раз с разными аргументами: второй вызов дал 20. Вот что
            происходит при вызове <Notation>{"rectangle_area(3, 5)"}</Notation>:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.callFlow}
            caption={
              <>
                Аргументы 3 и 5 становятся значениями параметров{" "}
                <Notation>{"width"}</Notation> и <Notation>{"height"}</Notation>
                , тело вычисляет 15, а <Notation>{"return"}</Notation> отдаёт
                его в строку вызова — она становится{" "}
                <Notation>{"area = 15"}</Notation>.
              </>
            }
          />
          <ProofDisclosure
            summary="Тонкости: где писать определение"
            kind="nuance"
          >
            <Typography.Text>
              Определение должно выполниться раньше вызова. Функция может
              вызывать другую функцию, определённую ниже в файле, — если к
              моменту реального вызова обе <Notation>{"def"}</Notation> уже
              выполнены. Проще всего писать все функции в начале файла.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "return и print",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"return"}</Notation> передаёт значение месту вызова,{" "}
              <Notation>{"print"}</Notation> только показывает текст.
            </strong>{" "}
            <Notation>{"return"}</Notation> завершает текущий вызов и передаёт
            значение тому месту, где он произошёл.{" "}
            <Notation>{"print"}</Notation> показывает текст, но не делает этот
            текст возвращаемым результатом. Нажми «Запуск» и пройди программу по
            шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runSquare}
            label={
              "print показывает текст, но не делает этот текст возвращаемым результатом"
            }
          />
          <Typography.Text>
            При вызове у функции появляются свои переменные — рамка «вызов
            square(4)» внутри программы; после <Notation>{"return"}</Notation>{" "}
            она исчезает, а значение возвращается в строку, где был вызов.
          </Typography.Text>
          <Typography.Text>
            Если вместо <Notation>{"return"}</Notation> поставить{" "}
            <Notation>{"print"}</Notation>, квадраты будут видны на экране, но
            сложение результатов вызовов не сработает: оба вызова вернут{" "}
            <Notation>{"None"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "def square(number):\n    print(number * number)\n\nresult = square(4)\nprint(result)"
            }
            label={"print вместо return"}
            language="python"
            fileName="main.py"
            output={"16\nNone"}
          />
          <Typography.Text>
            Функция без выполненного <Notation>{"return"}</Notation> со
            значением возвращает <Notation>{"None"}</Notation>. Запись{" "}
            <Notation>{"return"}</Notation> без выражения тоже возвращает{" "}
            <Notation>{"None"}</Notation>. Инструкции после выполненного{" "}
            <Notation>{"return"}</Notation> в этом вызове уже не исполняются.
          </Typography.Text>
          <CodeBlock
            code={
              'def describe_sign(number):\n    if number > 0:\n        return "положительное"\n    if number < 0:\n        return "отрицательное"\n    return "ноль"\n\nprint(describe_sign(-4), describe_sign(0))'
            }
            label={
              "Инструкции после выполненного return в этом вызове уже не исполняются"
            }
            language="python"
            fileName="main.py"
            output={"отрицательное ноль"}
          />
          <Typography.Text>
            Ранний возврат позволяет последовательно исключить случаи без лишней
            вложенности: третий <Notation>{"return"}</Notation> выполняется,
            только если первые два не сработали.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Локальные имена",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Имена внутри функции локальны: они не заменяют внешние.
            </strong>{" "}
            <strong>Область видимости</strong> — часть программы, в которой имя
            разрешается определённым способом. Параметры и присваивания внутри
            функции обычно создают локальные имена, существующие для данного
            вызова. Пройди программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runLocalNames}
            label={"Локальное x не заменяет внешнее"}
          />
          <Typography.Text>
            <Notation>{"x = 3"}</Notation> появляется в рамке вызова{" "}
            <Notation>{"calculate"}</Notation>, а внешнее{" "}
            <Notation>{"x"}</Notation> в программе остаётся 10: внутреннее имя
            не заменяет внешнее.
          </Typography.Text>
          <Typography.Text>
            Если внутри функции есть присваивание имени, Python обычно считает
            его локальным во всём теле. Поэтому попытка сначала прочитать его, а
            потом присвоить приводит к ошибке:
          </Typography.Text>
          <CodeBlock
            code={"x = 10\n\ndef show():\n    print(x)\n    x = 3\n\nshow()"}
            label={
              "Поэтому попытка сначала прочитать его, а потом присвоить приводит к ошибке"
            }
            language="python"
            fileName="main.py"
            error={
              "UnboundLocalError: cannot access local variable 'x' where it is not associated with a value"
            }
          />
          <Typography.Text>
            Строка <Notation>{"x = 3"}</Notation> сделала{" "}
            <Notation>{"x"}</Notation> локальным во всей функции, и{" "}
            <Notation>{"print(x)"}</Notation> обратился к локальному имени,
            которое ещё не получило значения. Нужно внешнее значение — передай
            его параметром и верни новое.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: порядок поиска имён, global и nonlocal"
            kind="nuance"
          >
            <Typography.Text>
              Имя Python ищет по уровням: сначала в текущем вызове, затем в
              окружающих функциях, затем в файле, затем среди встроенных имён —
              сокращённо LEGB. <Notation>{"global"}</Notation> и{" "}
              <Notation>{"nonlocal"}</Notation> позволяют функции менять имя
              внешнего уровня, но программу с ними труднее читать.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            У <Notation>{"if"}</Notation> и <Notation>{"for"}</Notation> нет
            собственной отдельной области имён, как у функции. Переменная,
            присвоенная внутри выполненной ветки, остаётся доступной после неё в
            окружающей области.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Параметр и объект",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Присвоить параметру и изменить переданный объект — разные
              действия.
            </strong>{" "}
            Параметр — ещё одно имя того объекта, который передали. Нажми
            «Запуск» и пройди программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runRebindMutate}
            label={
              "Аргументы передаются как объекты, а параметры связываются с ними"
            }
          />
          <Typography.Text>
            В <Notation>{"rebind"}</Notation> заменяется локальная связь имени.
            В <Notation>{"mutate"}</Notation> меняется тот же список, на который
            ссылается внешнее <Notation>{"a"}</Notation>. Это та же модель «имя
            — ссылка на объект», что и в уроке о списках: параметр — ещё одно
            имя того же списка. Изменение данных вне возвращаемого результата
            называют <strong>побочным эффектом</strong>. Вывод и запись файла —
            тоже побочные эффекты.
          </Typography.Text>
          <Typography.Text>
            Пока выполняется <Notation>{"rebind"}</Notation>, стрелки от{" "}
            <Notation>{"a"}</Notation> и <Notation>{"items"}</Notation> сначала
            ведут к одному списку, а после <Notation>{"items = [99]"}</Notation>{" "}
            — к разным. В <Notation>{"mutate"}</Notation> обе стрелки ведут к
            одному списку, и <Notation>{"append"}</Notation> меняет именно его.
          </Typography.Text>
          <Typography.Text>
            В описании функции полезно явно указывать, меняет ли она переданную
            коллекцию. Если изменение не нужно, создавай отдельный результат.
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
            В вызове <Notation>{"rectangle_area(4, 7)"}</Notation> что здесь
            аргументы, а что параметры? Что вернёт вызов?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            4 и 7 — аргументы, <Notation>{"width"}</Notation> и{" "}
            <Notation>{"height"}</Notation> — параметры. Вызов вернёт 28.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>Что напечатает программа?</Typography.Text>
          <CodeBlock
            code={
              "def double(n):\n    print(n * 2)\n\nresult = double(5)\nprint(result)"
            }
            label={"print внутри функции"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            10 и None: функция печатает 10, но ничего не возвращает.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт <Notation>{"describe_sign(5)"}</Notation> из урока и
            какие строки функции при этом выполнятся?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «положительное»: первая проверка истинна, первый{" "}
            <Notation>{"return"}</Notation> завершает вызов, и остальные строки
            не выполняются.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Вне функции задано <Notation>{"count = 0"}</Notation>, а функция{" "}
            <Notation>{"bump()"}</Notation> выполняет{" "}
            <Notation>{"count = count + 1"}</Notation>. Что произойдёт при
            вызове <Notation>{"bump()"}</Notation> и почему?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"UnboundLocalError"}</Notation>: присваивание делает{" "}
            <Notation>{"count"}</Notation> локальным во всём теле, а правая
            часть читает его раньше, чем оно получило значение.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Функция <Notation>{"add_zero(items)"}</Notation> выполняет{" "}
            <Notation>{"items.append(0)"}</Notation>. Чему равен{" "}
            <Notation>{"a"}</Notation> после <Notation>{"a = [1]"}</Notation> и{" "}
            <Notation>{"add_zero(a)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            [1, 0]: параметр <Notation>{"items"}</Notation> — ещё одно имя того
            же списка, и <Notation>{"append"}</Notation> меняет его.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь ты умеешь давать вычислению имя и вызывать его сколько угодно
        раз. Вот что из урока понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"def имя(параметры):"}</Notation>,
            note: <>Создаёт функцию; тело выполняется только при вызове.</>,
          },
          {
            key: "Аргумент и параметр",
            note: (
              <>
                В вызове <Notation>{"rectangle_area(3, 5)"}</Notation> 3 и 5 —
                аргументы, они становятся значениями параметров.
              </>
            ),
          },
          {
            key: <Notation>{"return"}</Notation>,
            note: (
              <>
                Отдаёт значение в место вызова и завершает вызов; без него
                функция возвращает <Notation>{"None"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"print"}</Notation>,
            note: (
              <>Только показывает текст, результатом функции не становится.</>
            ),
          },
          {
            key: "Локальные имена",
            note: (
              <>
                Присваивание внутри функции создаёт своё имя; чтение до
                присваивания — <Notation>{"UnboundLocalError"}</Notation>.
              </>
            ),
          },
          {
            key: "Параметр-список",
            note: (
              <>
                <Notation>{"append"}</Notation> меняет переданный список,
                присваивание параметру — нет.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
