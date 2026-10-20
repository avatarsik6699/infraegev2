import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonInputOutputLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-input-output.media";

export const pythonInputOutputLesson = defineCourseLesson({
  ...pythonInputOutputLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Читать и преобразовывать ввод", "Форматировать вывод"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В прошлых уроках цену и количество тетрадей мы записывали прямо в
            код: <Notation>{"price = 40"}</Notation>. Чтобы посчитать другую
            покупку, пришлось бы править программу.{" "}
            <strong>
              В этом уроке программа сама спросит цену и количество, а ты
              превратишь введённый текст в числа
            </strong>
            . В конце научимся печатать результат в нужном виде: со своим
            текстом и двумя цифрами после точки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Ввод с клавиатуры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"input()"}</Notation> останавливает программу и ждёт,
              пока ты наберёшь текст и нажмёшь Enter.
            </strong>{" "}
            Текст в скобках <Notation>{"input"}</Notation> программа печатает
            как подсказку перед вводом:
          </Typography.Text>
          <CodeBlock
            code={'name = input("Как тебя зовут? ")\nprint("Привет,", name)'}
            label={"Текст в скобках input программа печатает как подсказку"}
            language="python"
            fileName="main.py"
            output={"Как тебя зовут? ⟪Анна⟫\nПривет, Анна"}
          />
          <Typography.Text>
            Когда программа дойдёт до <Notation>{"input"}</Notation>, она
            остановится. В PyCharm щёлкни в панели «Run» внизу, набери ответ и
            нажми Enter; при запуске из терминала набирай прямо в нём. В
            примерах урока набранное показано в рамке, а знак ↵ — это Enter. Сам
            Enter в строку не попадает: в <Notation>{"name"}</Notation> лежит
            только «Анна».
          </Typography.Text>
          <Typography.Text>
            <strong>
              <Notation>{"input"}</Notation> всегда возвращает строку
            </strong>{" "}
            — даже если набраны одни цифры. Введённое 25 будет строкой{" "}
            <Notation>{'"25"'}</Notation>: Python не знает, возраст это, код
            товара или часть номера телефона. Поэтому превратить строку в число
            должен ты:
          </Typography.Text>
          <CodeBlock
            code={"age_text = input()\nage = int(age_text)\nprint(age + 1)"}
            label={"Превратить строку в число должен ты"}
            language="python"
            fileName="main.py"
            output={"⟪25⟫\n26"}
          />
          <Typography.Text>
            <Notation>{"int(...)"}</Notation> превращает строку{" "}
            <Notation>{'"25"'}</Notation> в целое число 25 — подробно о нём в
            следующем разделе. Запись{" "}
            <Notation>{"age = int(input())"}</Notation> делает то же в одну
            строку: Python сначала выполняет внутренние скобки — ввод, а потом
            превращает результат в число. Без <Notation>{"int"}</Notation>{" "}
            выражение <Notation>{"age_text + 1"}</Notation> остановилось бы с{" "}
            <Notation>{"TypeError"}</Notation>: строку нельзя сложить с числом,
            как <Notation>{'10 + "5"'}</Notation> в уроке о типах.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.inputFlow}
            caption={
              <>
                Набранные клавиши <Notation>{"input()"}</Notation> отдаёт
                строкой <Notation>{'"25"'}</Notation>, без Enter. Числом 25 её
                делает только <Notation>{"int(...)"}</Notation>, и тогда{" "}
                <Notation>{"+ 1"}</Notation> даёт 26. Попытка прибавить 1 к
                самой строке заканчивается <Notation>{"TypeError"}</Notation>.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Преобразование",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строку в число превращают <Notation>{"int"}</Notation> и{" "}
              <Notation>{"float"}</Notation>, число в строку —{" "}
              <Notation>{"str"}</Notation>.
            </strong>{" "}
            Это те же имена, что у типов из урока «Значения, типы и переменные»:{" "}
            <Notation>{"int(...)"}</Notation> даёт целое,{" "}
            <Notation>{"float(...)"}</Notation> — дробное,{" "}
            <Notation>{"str(...)"}</Notation> — строку:
          </Typography.Text>
          <CodeBlock
            code={
              'print(int("-12"))\nprint(float("2.75"))\nprint("Итого: " + str(120))'
            }
            label={
              "int и float превращают строку в число, str — число в строку"
            }
            language="python"
            fileName="main.py"
            output={"-12\n2.75\nИтого: 120"}
          />
          <Typography.Text>
            <Notation>{"str"}</Notation> нужен, когда число надо склеить с
            текстом: <Notation>{'"Итого: " + 120'}</Notation> остановится с{" "}
            <Notation>{"TypeError"}</Notation>, а{" "}
            <Notation>{"str(120)"}</Notation> превращает число в строку «120», и
            строки склеиваются.
          </Typography.Text>
          <Typography.Text>
            Превратить получится только подходящую запись:{" "}
            <Notation>{"int"}</Notation> принимает запись целого числа,{" "}
            <Notation>{"float"}</Notation> — числа с точкой. Из записи с точкой
            целое не получится:
          </Typography.Text>
          <CodeBlock
            code={'print(int("2.75"))'}
            label={"Из записи с точкой целое не получится"}
            language="python"
            fileName="main.py"
            error={"ValueError: invalid literal for int() with base 10: '2.75'"}
          />
          <Typography.Text>
            <Notation>{"ValueError"}</Notation> — ошибка значения: в скобках
            строка, но записано в ней не целое число. Так же не сработает{" "}
            <Notation>{'float("2,75")'}</Notation>: дробную часть в Python
            отделяют точкой. А вот <Notation>{"int(2.75)"}</Notation> работает и
            даёт 2: в скобках уже число, и <Notation>{"int"}</Notation>{" "}
            отбрасывает дробную часть, как в уроке о числах.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: запятая и пробелы во вводе"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"int"}</Notation> и <Notation>{"float"}</Notation>{" "}
              пропускают пробелы по краям: <Notation>{'int(" 25 ")'}</Notation>{" "}
              даёт 25. Если же данные приходят с запятой, например «2,75», её
              сначала заменяют точкой — это делают строковыми методами из урока
              о строках.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Преобразование не исправляет смысл само. Код товара{" "}
            <Notation>{'"007"'}</Notation> после <Notation>{"int"}</Notation>{" "}
            превратится в 7: если ведущие нули важны, оставь текст.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Разделитель и конец вывода",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"print"}</Notation> ставит между значениями пробел, а в
              конце — перевод строки.
            </strong>{" "}
            <strong>Перевод строки</strong> — невидимый символ, после которого
            вывод продолжается с начала следующей строки; на схемах его рисуют
            знаком ↵. Обе настройки можно поменять: после значений в скобках{" "}
            <Notation>{"print"}</Notation> пишут <Notation>{"sep="}</Notation> —
            чем разделять значения — и <Notation>{"end="}</Notation> — чем
            закончить вывод:
          </Typography.Text>
          <CodeBlock
            code={
              'print(10, 20, 30)\nprint(10, 20, 30, sep="; ")\nprint(10, 20, 30, sep="")\nprint("Начало", end=" ")\nprint("продолжение")'
            }
            label={"Обе настройки можно поменять"}
            language="python"
            fileName="main.py"
            output={"10 20 30\n10; 20; 30\n102030\nНачало продолжение"}
          />
          <Typography.Text>
            <Notation>{'sep=""'}</Notation> склеивает значения без пробела.
            Четвёртая строка программы закончила вывод пробелом вместо перевода
            строки, поэтому пятая продолжила ту же строку экрана.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.printMarks}
            caption={
              <>
                Невидимые символы вывода показаны рамками:{" "}
                <Notation>{"sep"}</Notation> ставится между значениями,{" "}
                <Notation>{"end"}</Notation> — после последнего; ↵ — перевод
                строки. В третьем примере вывод закончен пробелом вместо ↵,
                поэтому «продолжение» напечаталось на той же строке.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "f-строки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              f-строка собирает текст из готовых кусков и вычисленных значений.
            </strong>{" "}
            Через запятую <Notation>{"print"}</Notation> сам ставит пробелы и
            печатает число целиком. Когда нужен точный вид — свой текст между
            значениями, две цифры после точки, — удобнее f-строка:
          </Typography.Text>
          <CodeBlock
            code={
              'quantity = 3\nprice = 42.5\nprint(f"Тетрадей: {quantity}, стоимость: {quantity * price:.2f}")'
            }
            label={"Когда нужен точный вид, удобнее f-строка"}
            language="python"
            fileName="main.py"
            output={"Тетрадей: 3, стоимость: 127.50"}
          />
          <Typography.Text>
            Буква <Notation>{"f"}</Notation> перед кавычками включает
            подстановку: выражение в фигурных скобках вычисляется, и его
            значение встаёт в текст. Часть <Notation>{":.2f"}</Notation> после
            выражения — формат: две цифры после точки. Округляется только
            напечатанное, само число не меняется.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.fstring}
            caption={
              <>
                f-строка — шаблон: каждое место в фигурных скобках вычисляется и
                заменяется готовым текстом, остальные символы переходят в
                результат как есть.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Стоимость покупки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Соберём всё вместе: программа спрашивает цену тетради и количество
              и печатает стоимость.
            </strong>{" "}
            Цена и количество вводятся на двух отдельных строках, поэтому нужны
            два вызова <Notation>{"input"}</Notation>. Количество всегда целое,
            а цена может быть дробной, например 42.5:
          </Typography.Text>
          <CodeBlock
            code={
              'price = float(input())\nquantity = int(input())\ncost = price * quantity\nprint(f"Стоимость: {cost:.2f}")'
            }
            label={"Программа спрашивает цену тетради и количество"}
            language="python"
            fileName="main.py"
            output={"⟪42.5⟫\n⟪3⟫\nСтоимость: 127.50"}
          />
          <Typography.Text>
            Цену читаем через <Notation>{"float"}</Notation>:{" "}
            <Notation>{'int("42.5")'}</Notation> остановился бы с{" "}
            <Notation>{"ValueError"}</Notation>. Количество — через{" "}
            <Notation>{"int"}</Notation>: дробных тетрадей не бывает. Если
            ввести цену 40, <Notation>{"float"}</Notation> сделает из неё 40.0,
            а f-строка напечатает «Стоимость: 120.00».
          </Typography.Text>
          <Typography.Text>
            В задачах курса ты записываешь в поле ответа то, что напечатала
            программа. Подсказки вроде{" "}
            <Notation>{'input("Введите цену: ")'}</Notation> удобны, но их текст
            тоже попадёт на экран, и его придётся отбрасывать. Поэтому в
            решениях задач подсказки в <Notation>{"input"}</Notation> обычно не
            пишут.
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
            Программа из двух строк <Notation>{"x = input()"}</Notation> и{" "}
            <Notation>{"print(x + x)"}</Notation>. Что она напечатает, если
            ввести 5? Как получить 10?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            55: <Notation>{"input"}</Notation> вернул строку{" "}
            <Notation>{'"5"'}</Notation>, и <Notation>{"+"}</Notation> склеил
            две строки. Чтобы получить 10, нужно{" "}
            <Notation>{"x = int(input())"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что получится при <Notation>{'int("3.5")'}</Notation>? А при{" "}
            <Notation>{"int(3.5)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"ValueError"}</Notation>: строка с точкой — не запись
            целого числа. <Notation>{"int(3.5)"}</Notation> даёт 3: в скобках
            уже число, и дробная часть отбрасывается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что напечатают <Notation>{'print(1, 2, 3, sep="")'}</Notation> и{" "}
            <Notation>{'print(1, 2, 3, sep=", ")'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            123 и «1, 2, 3»: <Notation>{"sep"}</Notation> ставится только между
            значениями.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает программа из двух строк{" "}
            <Notation>{'print("Итого:", end=" ")'}</Notation> и{" "}
            <Notation>{"print(120)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Одну строку «Итого: 120»: первый <Notation>{"print"}</Notation>{" "}
            закончил вывод пробелом, а не переводом строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает <Notation>{'print(f"{10 / 4:.2f}")'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2.50: <Notation>{"10 / 4"}</Notation> — это 2.5, а{" "}
            <Notation>{":.2f"}</Notation> печатает две цифры после точки.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь программа о тетрадях не зависит от чисел в коде: она спрашивает
        цену и количество и печатает стоимость в нужном виде. Вот что из этого
        понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"input()"}</Notation>,
            note: (
              <>
                Останавливает программу и ждёт ввода; возвращает строку без
                Enter. Текст в скобках — подсказка перед вводом.
              </>
            ),
          },
          {
            key: <Notation>{"int(), float(), str()"}</Notation>,
            note: (
              <>
                Строка → целое, строка → дробное, число → строка. Неподходящая
                запись — <Notation>{"ValueError"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"int(input())"}</Notation>,
            note: (
              <>Сначала ввод, затем преобразование — так читают целое число.</>
            ),
          },
          {
            key: <Notation>{"sep, end"}</Notation>,
            note: (
              <>
                Разделитель между значениями (обычно пробел) и конец вывода
                (обычно перевод строки).
              </>
            ),
          },
          {
            key: "f-строка",
            note: (
              <>
                <Notation>{"{…}"}</Notation> подставляет значение,{" "}
                <Notation>{":.2f"}</Notation> печатает две цифры после точки.
              </>
            ),
          },
          {
            key: "Ответ задачи",
            note: (
              <>
                В поле записывают то, что напечатала программа; подсказки в{" "}
                <Notation>{"input"}</Notation> в решениях не пишут.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
