import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
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
            <strong>
              <Notation>{"input"}</Notation> всегда возвращает текст, а
              превратить его в число — решение автора программы
            </strong>
            . Отсюда и правило вывода: печатать только то, что требуется, в
            нужном виде. Опора — уроки о типах и числах:{" "}
            <Notation>{"int(...)"}</Notation> и{" "}
            <Notation>{"float(...)"}</Notation> превращают введённый текст в
            значения, с которыми работает арифметика.
          </Typography.Text>
          <Typography.Text>
            Работать будем с прямоугольником, длина и ширина которого вводятся с
            клавиатуры: найдём его площадь и периметр.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "input возвращает строку",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"input()"}</Notation> ждёт строку от пользователя и
              возвращает её как <Notation>{"str"}</Notation>.
            </strong>{" "}
            Нажатие Enter завершает ввод, а завершающий перевод строки не входит
            в результат.
          </Typography.Text>
          <CodeBlock
            code={'name = input("Как тебя зовут? ")\nprint("Привет,", name)'}
            label={
              "Нажатие Enter завершает ввод, а завершающий перевод строки не входит в результат"
            }
            language="python"
            fileName="name.py"
            output={"Как тебя зовут? ⟪Анна⟫\nПривет, Анна"}
          />
          <Typography.Text>
            Так это выглядит на экране: «Анна» в рамке набрал пользователь,
            остальное напечатала программа. Подсказка{" "}
            <Notation>{"input"}</Notation> стоит на той же строке, что и
            набранный текст, а Enter (↵) переводит строку.
          </Typography.Text>
          <Typography.Text>
            Введённое <Notation>{"25"}</Notation> будет строкой{" "}
            <Notation>{'"25"'}</Notation>. Python не может знать, является это
            возрастом, кодом товара или частью телефонного номера. Поэтому
            решение о преобразовании принимает автор программы.
          </Typography.Text>
          <CodeBlock
            code={"age_text = input()\nage = int(age_text)\nprint(age + 1)"}
            label={"Поэтому решение о преобразовании принимает автор программы"}
            language="python"
            fileName="age_text.py"
            output={"⟪25⟫\n26"}
          />
          <Typography.Text>
            Сокращённая запись <Notation>{"age = int(input())"}</Notation>{" "}
            означает те же этапы: сначала внутренний вызов{" "}
            <Notation>{"input"}</Notation>, затем преобразование его результата
            с помощью <Notation>{"int"}</Notation>. Без{" "}
            <Notation>{"int"}</Notation> выражение{" "}
            <Notation>{"age_text + 1"}</Notation> остановилось бы с{" "}
            <Notation>{"TypeError"}</Notation>: строку нельзя сложить с числом.
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
      navLabel: "Преобразование текста",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Преобразование возможно, только если текст записывает число в
              ожидаемом формате.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={'print(int("-12"))\nprint(float("2.75"))\nprint(str(123))'}
            label={
              "Преобразование возможно, только если текст записывает число в ожидаемом формате"
            }
            language="python"
            fileName="main.py"
            output={"-12\n2.75\n123"}
          />
          <Typography.Text>
            Последнее 123 — уже текст: <Notation>{"str"}</Notation> превращает
            число в строку. А вот целое число из записи с точкой не получится:
          </Typography.Text>
          <CodeBlock
            code={'print(int("2.75"))'}
            label={"А вот целое число из записи с точкой не получится"}
            language="python"
            fileName="main.py"
            error={"ValueError: invalid literal for int() with base 10: '2.75'"}
          />
          <Typography.Text>
            <Notation>{"ValueError"}</Notation> означает, что тип подходит, а
            конкретное значение — нет: строка не записывает целое число в
            ожидаемом формате. <Notation>{"int(2.75)"}</Notation> допустимо и
            даёт 2 — здесь исходное значение уже является числом.{" "}
            <Notation>{'float("2,75")'}</Notation> тоже не подходит: десятичный
            разделитель Python — точка. Если формат входа специально использует
            запятую, её заменяют осознанно после знакомства со строковыми
            методами.
          </Typography.Text>
          <Typography.Text>
            Преобразование не исправляет смысл само. Например, индекс предмета{" "}
            <Notation>{'"007"'}</Notation> после <Notation>{"int"}</Notation>{" "}
            превратится в 7. Если ведущие нули значимы, оставь текст.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "sep и end",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"print"}</Notation> выводит несколько значений через
              разделитель и заканчивает переводом строки.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'print(10, 20, 30)\nprint(10, 20, 30, sep="; ")\nprint("Начало", end=" ")\nprint("продолжение")'
            }
            label={
              "print выводит несколько значений через разделитель и заканчивает переводом строки"
            }
            language="python"
            fileName="main.py"
            output={"10 20 30\n10; 20; 30\nНачало продолжение"}
          />
          <Typography.Text>
            Обычные аргументы — значения для вывода.{" "}
            <Notation>{"sep="}</Notation> задаёт разделитель между ними,{" "}
            <Notation>{"end="}</Notation> — окончание вывода. Такая запись
            передаёт аргумент по имени. По умолчанию разделитель — пробел,
            окончание — перевод строки. Поэтому третий и четвёртый вызовы дали
            одну строку.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.printMarks}
            caption={
              <>
                Невидимые символы вывода показаны рамками:{" "}
                <Notation>{"sep"}</Notation> ставится между значениями,{" "}
                <Notation>{"end"}</Notation> — после последнего; ↵ — перевод
                строки. Третий вызов закончил вывод пробелом вместо ↵, поэтому
                «продолжение» напечаталось на той же строке.
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
              f-строка подставляет вычисленные значения прямо в текст.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'count = 7\nprice = 12.5\nprint(f"Количество: {count}; стоимость: {count * price:.2f}")'
            }
            label={"f-строка подставляет вычисленные значения прямо в текст"}
            language="python"
            fileName="count.py"
            output={"Количество: 7; стоимость: 87.50"}
          />
          <Typography.Text>
            Буква <Notation>{"f"}</Notation> перед кавычками включает
            подстановку выражений из фигурных скобок.{" "}
            <Notation>{"count * price"}</Notation> вычисляется обычным образом.
            Часть <Notation>{":.2f"}</Notation> задаёт формат вывода: две цифры
            после десятичной точки. Она меняет представление при выводе, а не
            превращает исходное число в точное десятичное.
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
          <Typography.Text>
            При автоматической проверке задач обычно выводят только требуемые
            значения. Подсказки внутри{" "}
            <Notation>{'input("Введите...")'}</Notation> удобны человеку, но
            становятся лишним текстом для проверяющей системы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Площадь и периметр",
      explanation: (
        <>
          <Typography.Text>
            <strong>Площадь и периметр прямоугольника по вводу.</strong> Длина и
            ширина вводятся на двух отдельных строках, поэтому нужны два вызова{" "}
            <Notation>{"input"}</Notation>. Сначала решим для дробных значений:
          </Typography.Text>
          <CodeBlock
            code={
              "length = float(input())\nwidth = float(input())\narea = length * width\nperimeter = 2 * (length + width)\nprint(area, perimeter)"
            }
            label={"Сначала решим для дробных значений"}
            language="python"
            fileName="length.py"
            output={"⟪5⟫\n⟪3⟫\n15.0 16.0"}
          />
          <Typography.Text>
            Даже целые 5 и 3 после <Notation>{"float"}</Notation> стали
            дробными, поэтому ответ напечатан как 15.0 и 16.0. Если по условию
            данные целые и нужен точный целочисленный результат, замени{" "}
            <Notation>{"float"}</Notation> на <Notation>{"int"}</Notation>:
            тогда вывод будет 15 16.
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
                <Notation>{"input()"}</Notation> возвращает строку без перевода
                строки; число получают через <Notation>{"int"}</Notation> или{" "}
                <Notation>{"float"}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                Неверный формат даёт <Notation>{"ValueError"}</Notation>:{" "}
                <Notation>{'int("2.75")'}</Notation>,{" "}
                <Notation>{'float("2,75")'}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"print"}</Notation> разделяет значения{" "}
                <Notation>{"sep"}</Notation> и заканчивает{" "}
                <Notation>{"end"}</Notation>; по умолчанию пробел и перевод
                строки.
              </>
            ),
          },
          {
            note: (
              <>
                f-строка подставляет выражения в <Notation>{"{}"}</Notation>;{" "}
                <Notation>{":.2f"}</Notation> — две цифры после точки.
              </>
            ),
          },
          {
            note: (
              <>
                Для автоматической проверки выводят только требуемые значения,
                без подсказок.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
