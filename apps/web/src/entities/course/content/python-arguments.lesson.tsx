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
import { pythonArgumentsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-arguments.media";

export const pythonArgumentsLesson = defineCourseLesson({
  ...pythonArgumentsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Значения по умолчанию", "Кортеж результатов", "Lambda"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Цену со скидкой считают постоянно, но скидка есть не всегда. Писать
            каждый раз <Notation>{"final_price(200, 0)"}</Notation> неудобно, а
            иногда функция должна вернуть сразу два ответа.{" "}
            <strong>
              У функции есть договорённость — что она принимает, что возвращает
              и меняет ли данные; значения по умолчанию, именованные аргументы и
              несколько результатов делают её удобной
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём это на цене со скидкой{" "}
            <Notation>{"final_price(price, discount=0)"}</Notation>, а в конце
            оформим функцией сквозную задачу курса.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Значения по умолчанию",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Параметр со значением по умолчанию можно не передавать, а аргумент
              можно назвать по имени.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "def final_price(price, discount=0):\n    return price * (100 - discount) / 100\n\nprint(final_price(200))\nprint(final_price(200, 10))\nprint(final_price(discount=10, price=200))"
            }
            label={
              "Параметр со значением по умолчанию можно не передавать, а аргумент можно назвать по имени"
            }
            language="python"
            fileName="main.py"
            output={"200.0\n180.0\n180.0"}
          />
          <Typography.Text>
            <Notation>{"discount=0"}</Notation> в определении — значение по
            умолчанию. В вызове именованные аргументы уточняют, какому параметру
            соответствует значение. Вот как параметры получают значения в трёх
            вызовах:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.argBinding}
            caption={
              <>
                По позиции значение идёт в параметр на том же месте, по имени —
                в параметр с этим именем. Если значения нет,{" "}
                <Notation>{"discount"}</Notation> берёт значение по умолчанию 0.
              </>
            }
          />
          <Typography.Text>
            Обычные позиционные аргументы записывают перед именованными. Одному
            параметру нельзя передать значение дважды:
          </Typography.Text>
          <CodeBlock
            code={
              "def final_price(price, discount=0):\n    return price * (100 - discount) / 100\n\nprint(final_price(200, price=100))"
            }
            label={"Одному параметру нельзя передать значение дважды"}
            language="python"
            fileName="main.py"
            error={
              "TypeError: final_price() got multiple values for argument 'price'"
            }
          />
          <Typography.Text>
            Значения по умолчанию вычисляются при выполнении определения, а не
            заново для каждого вызова. Поэтому изменяемый список в параметре по
            умолчанию будет общим между вызовами:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runDefaultList}
            label={
              "Поэтому изменяемый список в параметре по умолчанию будет общим между вызовами"
            }
          />
          <Typography.Text>
            Второй вызов увидел единицу из первого: список по умолчанию создан
            один раз. Нажми «Запуск» и пройди программу по шагам: во втором
            вызове <Notation>{"items"}</Notation> ведёт к тому же списку, что и
            в первом, — он создан, когда выполнилось{" "}
            <Notation>{"def"}</Notation>, и уже содержит 1.
          </Typography.Text>
          <Typography.Text>
            Правильный приём — <Notation>{"None"}</Notation> по умолчанию и
            новый список внутри:
          </Typography.Text>
          <CodeBlock
            code={
              "def add_item(item, items=None):\n    if items is None:\n        items = []\n    items.append(item)\n    return items\n\nprint(add_item(1))\nprint(add_item(2))"
            }
            label={"Правильный приём — None по умолчанию и новый список внутри"}
            language="python"
            fileName="main.py"
            output={"[1]\n[2]"}
          />
          <Typography.Text>
            <Notation>{"None"}</Notation> обозначает отсутствие переданного
            списка. В таком случае создаётся новый. Если пользователь явно
            передал список, функция изменит именно его. Эта договорённость
            должна быть понятна из описания.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Несколько результатов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Функция может вернуть несколько значений — на самом деле один
              кортеж.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "def quotient_and_remainder(a, b):\n    return a // b, a % b\n\nq, r = quotient_and_remainder(23, 5)\nprint(q, r)"
            }
            label={
              "Функция может вернуть несколько значений — на самом деле один кортеж"
            }
            language="python"
            fileName="main.py"
            output={"4 3"}
          />
          <Typography.Text>
            Фактически возвращается один кортеж, который распаковывается. Для
            этой конкретной операции уже существует{" "}
            <Notation>{"divmod(a, b)"}</Notation>, но пример показывает общую
            механику.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tupleReturn}
            caption={
              <>
                <Notation>{"return"}</Notation> отдаёт два значения как один
                кортеж <Notation>{"(4, 3)"}</Notation>, а строка вызова
                раскладывает его: <Notation>{"q"}</Notation> получает 4,{" "}
                <Notation>{"r"}</Notation> — 3.
              </>
            }
          />
          <ProofDisclosure
            summary="Тонкости: звёздочки и косая черта в параметрах"
            kind="nuance"
          >
            <Typography.Text>
              Параметр <Notation>{"*values"}</Notation> собирает сколько угодно
              позиционных аргументов в кортеж,{" "}
              <Notation>{"**options"}</Notation> — именованные аргументы в
              словарь. Звёздочки здесь — не умножение и не степень:
            </Typography.Text>
            <CodeBlock
              code={
                "def total_of(*values):\n    return sum(values)\n\nprint(total_of(2, 3, 5))\nprint(total_of())"
              }
              label={"*values собирает аргументы в кортеж"}
              language="python"
              fileName="main.py"
              output={"10\n0"}
            />
            <Typography.Text>
              Звёздочка без имени заставляет следующие параметры передавать по
              имени:{" "}
              <Notation>{'def show(value, *, label="Результат"):'}</Notation>.
              Косая черта <Notation>{"/"}</Notation> делает предыдущие параметры
              только позиционными. Такие формы встречаются в документации; для
              своих первых функций они не нужны.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Функция как значение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Функцию можно передать как значение;{" "}
              <Notation>{"lambda"}</Notation> создаёт короткую функцию из одного
              выражения.
            </strong>{" "}
            Имя функции можно передать другой функции. Без скобок это сама
            функция; со скобками — результат её вызова.
          </Typography.Text>
          <CodeBlock
            code={
              "def last_digit(number):\n    return abs(number) % 10\n\nrule = last_digit\nprint(rule(47))\nshort_rule = lambda number: abs(number) % 10\nprint(short_rule(-123))"
            }
            label={
              "Без скобок это сама функция; со скобками — результат её вызова"
            }
            language="python"
            fileName="main.py"
            output={"7\n3"}
          />
          <Typography.Text>
            <Notation>{"lambda number: abs(number) % 10"}</Notation> создаёт
            короткую функцию с одним выражением. Она делает то же, что{" "}
            <Notation>{"last_digit"}</Notation>, только у неё нет собственного
            имени. Она автоматически возвращает результат выражения. Несколько
            инструкций в <Notation>{"lambda"}</Notation> не помещают: используй{" "}
            <Notation>{"def"}</Notation>. Чаще всего{" "}
            <Notation>{"lambda"}</Notation> передают другой функции — например,
            как правило сортировки в уроке о сортировке.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.functionNames}
            caption={
              <>
                <Notation>{"rule = last_digit"}</Notation> — второе имя той же
                функции, как <Notation>{"b = a"}</Notation> у списков. Функция
                из <Notation>{"lambda"}</Notation> собственного имени не имеет,
                её связали с именем <Notation>{"short_rule"}</Notation>.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Договорённость функции",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Хорошая функция начинается с договорённости о входе, результате и
              особых случаях.
            </strong>{" "}
            Сначала сформулируй <strong>договорённость</strong>: что функция
            принимает, что возвращает, какие случаи допускаются, меняет ли
            аргументы. Например: «принимает целое число, возвращает сумму цифр
            его модуля».
          </Typography.Text>
          <CodeBlock
            code={
              'def digit_sum(number):\n    """Вернуть сумму десятичных цифр модуля целого числа."""\n    number = abs(number)\n    total = 0\n    while number > 0:\n        total += number % 10\n        number //= 10\n    return total\n\nprint(digit_sum(-5072), digit_sum(0))'
            }
            label={
              "Например: «принимает целое число, возвращает сумму цифр его модуля»"
            }
            language="python"
            fileName="main.py"
            output={"14 0"}
          />
          <Typography.Text>
            Первая строка текста в теле функции —{" "}
            <strong>строка документации</strong>, или docstring. Её может
            показывать <Notation>{"help(digit_sum)"}</Notation>. Тройные кавычки
            позволяют записывать многострочный текст; это не особый вид
            комментария.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "return после цикла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Возврат ставят после цикла, когда просмотрены все элементы.
            </strong>{" "}
            Напишем <Notation>{"count_even(numbers)"}</Notation>, возвращающую
            количество чётных элементов без изменения списка:
          </Typography.Text>
          <CodeBlock
            code={
              "def count_even(numbers):\n    count = 0\n    for number in numbers:\n        if number % 2 == 0:\n            count += 1\n    return count\n\nprint(count_even([0, 3, -4, 7]))\nprint(count_even([]))"
            }
            label={
              "Напишем count_even(numbers), возвращающую количество чётных элементов без изменения списка"
            }
            language="python"
            fileName="main.py"
            output={"2\n0"}
          />
          <Typography.Text>
            Возврат стоит после цикла. Если поставить его внутри тела, функция
            закончится после первого элемента. Для пустого списка корректно
            возвращается 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6-skvoznaya",
      navLabel: "Сквозная задача",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сквозная задача курса: сумма и наибольшее — одной функцией с двумя
              результатами.
            </strong>{" "}
            Цикл из урока о списках оформим функцией с договорённостью
            «принимает непустой список чисел, возвращает сумму и наибольшее»:
          </Typography.Text>
          <CodeBlock
            code={
              "def total_and_best(numbers):\n    total = 0\n    best = numbers[0]\n    for x in numbers:\n        total += x\n        if x > best:\n            best = x\n    return total, best\n\ntotal, best = total_and_best([5, -2, 10, 7])\nprint(total, best)"
            }
            label={"Сумма и наибольшее одной функцией"}
            language="python"
            fileName="main.py"
            output={"20 10"}
          />
          <Typography.Text>
            <Notation>{"return total, best"}</Notation> возвращает один кортеж,
            а строка вызова раскладывает его на два имени. Слово «непустой» в
            договорённости важно: для пустого списка{" "}
            <Notation>{"numbers[0]"}</Notation> остановит программу с{" "}
            <Notation>{"IndexError"}</Notation>. Теперь функцию можно вызвать
            для любого списка — из ввода, из файла, из другой функции.
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
            Что вернут <Notation>{"final_price(300)"}</Notation> и{" "}
            <Notation>{"final_price(300, discount=50)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            300.0 и 150.0: без второго аргумента скидка по умолчанию 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает{" "}
            <Notation>{"total, best = total_and_best([3, 9, -1])"}</Notation>, а
            затем <Notation>{"print(total, best)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            11 9: функция вернула кортеж (11, 9), и он разложился на два имени.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Чем отличаются <Notation>{"rule = len"}</Notation> и{" "}
            <Notation>{"rule = len('abc')"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В первом случае <Notation>{"rule"}</Notation> — сама функция{" "}
            <Notation>{"len"}</Notation>, её можно вызвать. Во втором —
            результат вызова, число 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Функцию <Notation>{"add_item_bad"}</Notation> из урока вызвали
            трижды подряд: <Notation>{"add_item_bad(1)"}</Notation>,{" "}
            <Notation>{"add_item_bad(2, [])"}</Notation>,{" "}
            <Notation>{"add_item_bad(3)"}</Notation>. Что вернёт каждый вызов?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            [1], [2] и [1, 3]: второй вызов работает со своим переданным
            списком, а третий — снова с общим списком по умолчанию.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            После <Notation>{"rule = len"}</Notation> что дадут{" "}
            <Notation>{'rule("abc")'}</Notation> и чем{" "}
            <Notation>{"rule"}</Notation> отличается от{" "}
            <Notation>{"rule()"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            3; <Notation>{"rule"}</Notation> — сама функция{" "}
            <Notation>{"len"}</Notation>, а <Notation>{"rule()"}</Notation> — её
            вызов без аргумента, который вызовет{" "}
            <Notation>{"TypeError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Договорённость функции — что она принимает, что возвращает и меняет ли
        данные — делает её удобной для любого вызова. Вот что понадобится
        дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "По умолчанию",
            note: (
              <>
                <Notation>{"def f(a, b=0)"}</Notation> —{" "}
                <Notation>{"b"}</Notation> можно не передавать;{" "}
                <Notation>{"f(b=1, a=2)"}</Notation> — аргументы по имени.
              </>
            ),
          },
          {
            key: "Список по умолчанию",
            note: (
              <>
                Изменяемое значение по умолчанию общее для всех вызовов:
                используй <Notation>{"None"}</Notation> и новый объект внутри.
              </>
            ),
          },
          {
            key: "Два результата",
            note: (
              <>
                <Notation>{"return a, b"}</Notation> возвращает кортеж, его
                распаковывают: <Notation>{"q, r = f(...)"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"total_and_best"}</Notation>,
            note: (
              <>
                Сквозная задача функцией:{" "}
                <Notation>{"return total, best"}</Notation>, вызов раскладывает
                результат на два имени.
              </>
            ),
          },
          {
            key: "Функция как значение",
            note: (
              <>
                Функцию передают без скобок;{" "}
                <Notation>{"lambda x: выражение"}</Notation> — короткая функция;
                docstring описывает договорённость.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
