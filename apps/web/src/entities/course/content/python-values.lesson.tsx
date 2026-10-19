import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonValuesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-values.media";

export const pythonValuesLesson = defineCourseLesson({
  ...pythonValuesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Различать типы", "Трассировать присваивания"],
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
              У каждого значения есть тип, а имя — это ярлык, который
              присваивание связывает со значением в конкретный момент
            </strong>
            . Без этой модели непонятно, почему <Notation>{'"27"'}</Notation> и{" "}
            <Notation>{"27"}</Notation> ведут себя по-разному и почему изменение
            одной переменной не меняет другую. Урок продолжает первый: там{" "}
            <Notation>{"print"}</Notation> показывал значения, теперь у значений
            появятся типы и имена.
          </Typography.Text>
          <Typography.Text>
            Продолжим с той же покупкой, что в прошлом уроке: цена тетради 40
            рублей, количество 3, стоимость 120. Теперь у каждого числа появится
            имя.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Число и текст",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Число и текст — разные данные, даже если выглядят одинаково.
            </strong>{" "}
            <Notation>{"27"}</Notation> и <Notation>{'"27"'}</Notation> выглядят
            похоже, но решают разные задачи. Первое — число, второе —
            последовательность символов. С числом выполняют арифметику; текст
            можно соединять с другим текстом:
          </Typography.Text>
          <CodeBlock
            code={'print(27 + 3)\nprint("27" + "3")'}
            label={
              "С числом выполняют арифметику; текст можно соединять с другим текстом"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"30\n273"}
          />
          <Typography.Text>
            Знак <Notation>{"+"}</Notation> один и тот же, но для чисел он
            складывает, а для строк склеивает:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.plusTypes}
            caption={
              <>
                Число 27 — одно значение, строка <Notation>{'"27"'}</Notation> —
                два символа подряд. Поэтому <Notation>{"+"}</Notation> у чисел
                даёт 30, а у строк — три символа «273».
              </>
            }
          />
          <Typography.Text>
            <strong>Тип</strong> определяет, как устроено значение и какие
            операции для него имеют смысл. Для начала хватит пяти типов:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.typeCards}
            caption={
              <>
                Целые числа <Notation>{"int"}</Notation> — для счёта и точных
                вычислений, дробные <Notation>{"float"}</Notation> (их называют
                числами с плавающей точкой) — для измерений. Строка{" "}
                <Notation>{"str"}</Notation> — любой текст, даже из цифр или
                пустой. <Notation>{"bool"}</Notation> — ответ на вопрос
                «выполнено ли условие». <Notation>{"None"}</Notation> —
                единственное значение своего типа: «результата нет».
              </>
            }
          />
          <Typography.Text>
            Названия других типов появятся вместе с задачами, для которых они
            нужны. <Notation>{"None"}</Notation> — специальное значение, а не
            строка <Notation>{'"None"'}</Notation>, не число 0 и не пустой
            текст.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Присваивание",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Присваивание сначала вычисляет правую часть, потом связывает с ней
              имя.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "price = 40\nquantity = 3\ncost = price * quantity\nprint(cost)"
            }
            label={
              "Присваивание сначала вычисляет правую часть, потом связывает с ней имя"
            }
            language="python"
            fileName="price.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"120"}
          />
          <Typography.Text>
            В строке <Notation>{"cost = price * quantity"}</Notation> сначала
            вычисляется выражение справа. Затем имя{" "}
            <Notation>{"cost"}</Notation> связывается с полученным значением.
            Такая операция называется <strong>присваиванием</strong>, а имя для
            обращения к значению — <strong>переменной</strong>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.assign}
            caption={
              <>
                Присваивание выполняется справа налево: сначала из текущих
                значений <Notation>{"price"}</Notation> и{" "}
                <Notation>{"quantity"}</Notation> вычисляется 120, и только
                потом имя <Notation>{"cost"}</Notation> связывается с готовым
                числом.
              </>
            }
          />
          <Typography.Text>
            Знак <Notation>{"="}</Notation> здесь не утверждает математическое
            равенство навсегда. Он задаёт действие в конкретный момент:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runAssignment}
            label={"Он задаёт действие в конкретный момент"}
          />
          <Typography.Text>
            При создании <Notation>{"y"}</Notation> выражение{" "}
            <Notation>{"x + 2"}</Notation> уже вычислено. В{" "}
            <Notation>{"y"}</Notation> не сохраняется формула, которая
            автоматически пересчитывается при изменении{" "}
            <Notation>{"x"}</Notation>. Проследим значения после каждой строки:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.bindStrip}
            caption={
              <>
                Выделено имя, которое изменила строка. Третья строка меняет
                только <Notation>{"x"}</Notation>: у <Notation>{"y"}</Notation>{" "}
                осталось 7.
              </>
            }
          />
          <Typography.Text>
            Так же и с покупкой: если после вычисления{" "}
            <Notation>{"cost"}</Notation> изменить{" "}
            <Notation>{"price"}</Notation>, стоимость останется 120, пока её не
            вычислят заново.
          </Typography.Text>
          <Typography.Text>
            Нажми «Запуск» в шапке примера: после каждой строки видно, какое
            значение у каждой переменной. Изменившееся значение выделено.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "x = x + 1",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Запись <Notation>{"x = x + 1"}</Notation> не противоречие, а шаг
              вычисления.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={"count = 4\ncount = count + 1\nprint(count)"}
            label={"Запись x = x + 1 не противоречие, а шаг вычисления"}
            language="python"
            fileName="count.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"5"}
          />
          <Typography.Text>
            Сначала читается прежнее значение <Notation>{"count"}</Notation>, к
            нему прибавляется 1, и имя связывается с результатом:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.refs_cd0bbe}
            caption={
              <>
                Справа вычислено <Notation>{"4 + 1"}</Notation>, и{" "}
                <Notation>{"count"}</Notation> теперь связано с 5; прежняя связь
                с 4 — пунктиром.
              </>
            }
          />
          <Typography.Text>
            Сокращённая запись для этого случая —{" "}
            <Notation>{"count += 1"}</Notation>. Так же работают{" "}
            <Notation>{"-="}</Notation>, <Notation>{"*="}</Notation> и другие:{" "}
            <Notation>{"x *= 2"}</Notation> означает{" "}
            <Notation>{"x = x * 2"}</Notation>. У Python нет операции увеличения{" "}
            <Notation>{"count++"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Имя и объект",
      explanation: (
        <>
          <Typography.Text>
            <strong>Имя ссылается на объект, а тип принадлежит объекту.</strong>{" "}
            Удобная первая метафора — «переменная хранит значение». Более точная
            модель Python: в памяти существуют <strong>объекты</strong>, а имена
            ссылаются на них. Объект — конкретные данные с типом и состоянием.
            Если два имени относятся к одному изменяемому списку, изменение
            через одно имя будет видно через второе. Эту важную ситуацию
            подробно разберём в уроке о списках.
          </Typography.Text>
          <Typography.Text>
            Вернёмся к <Notation>{"x"}</Notation> и <Notation>{"y"}</Notation>.
            В этой модели присваивание не кладёт число в коробку, а проводит
            связь от имени к объекту:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.refs_22251f}
            caption={
              <>
                После <Notation>{"x = 100"}</Notation> имя x связано с новым
                объектом, а прежняя связь с 5 разорвана (пунктир). y по-прежнему
                ссылается на 7: формула <Notation>{"x + 2"}</Notation> не
                запоминалась.
              </>
            }
          />
          <Typography.Text>
            Тип принадлежит объекту. Одно имя разрешено сначала связать с целым
            числом, затем со строкой:
          </Typography.Text>
          <CodeBlock
            code={
              'value = 10\nprint(type(value))\nvalue = "десять"\nprint(type(value))'
            }
            label={
              "Одно имя разрешено сначала связать с целым числом, затем со строкой"
            }
            language="python"
            fileName="value.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"<class 'int'>\n<class 'str'>"}
          />
          <Typography.Text>
            <Notation>{"type(...)"}</Notation> сообщает тип. Возможность менять
            тип значения у имени называют динамической типизацией. Это не
            означает, что Python автоматически складывает любые данные:
          </Typography.Text>
          <CodeBlock
            code={'print(10 + "5")'}
            label={
              "Это не означает, что Python автоматически складывает любые данные"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            error={
              "TypeError: unsupported operand type(s) for +: 'int' and 'str'"
            }
          />
          <Typography.Text>
            <Notation>{"TypeError"}</Notation> — ошибка неподходящего типа:
            число и строку нельзя сложить, Python не угадывает, нужно ли 15 или{" "}
            <Notation>{'"105"'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Хорошие имена",
      explanation: (
        <>
          <Typography.Text>
            <strong>Хорошее имя объясняет смысл значения.</strong> Используй
            понятные имена: <Notation>{"total"}</Notation>,{" "}
            <Notation>{"count"}</Notation>, <Notation>{"max_value"}</Notation>,{" "}
            <Notation>{"student_name"}</Notation>. Слова обычно разделяют
            подчёркиваниями. Имя не начинается с цифры, не содержит пробелов и
            не совпадает со служебным словом языка, например{" "}
            <Notation>{"if"}</Notation> или <Notation>{"for"}</Notation>.
            Регистр различается.
          </Typography.Text>
          <Typography.Text>
            Не называй переменные <Notation>{"list"}</Notation>,{" "}
            <Notation>{"str"}</Notation>, <Notation>{"sum"}</Notation>,{" "}
            <Notation>{"max"}</Notation>: это имена полезных встроенных средств.
            Такое присваивание разрешено, но закрывает доступ к прежнему
            значению имени в этой области программы. Для короткого номера
            позиции обычно уместно <Notation>{"i"}</Notation>, а для суммы —{" "}
            <Notation>{"total"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Комментарий объясняет причину, условие или назначение, которое
            неочевидно из кода:
          </Typography.Text>
          <CodeBlock
            code={"discount = 10  # Скидка в процентах, а не в рублях"}
            label={
              "Комментарий объясняет причину, условие или назначение, которое неочевидно из кода"
            }
            language="python"
            fileName="discount.py"
            showLineNumbers={false}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Проследи таблицей значения <Notation>{"a"}</Notation> и{" "}
            <Notation>{"b"}</Notation> после каждой строки:{" "}
            <Notation>{"a = 1"}</Notation>, <Notation>{"b = a + 1"}</Notation>,{" "}
            <Notation>{"a = b * 3"}</Notation>,{" "}
            <Notation>{"b = a - b"}</Notation>.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>a = 1; b = 2; a = 6; b = 4.</Typography.Text>
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
                Тип определяет, какие операции имеют смысл:{" "}
                <Notation>{"27 + 3"}</Notation> — 30,{" "}
                <Notation>{'"27" + "3"'}</Notation> —{" "}
                <Notation>{'"273"'}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                Присваивание вычисляет правую часть и связывает имя с
                результатом; формула не запоминается.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"x = x + 1"}</Notation> и{" "}
                <Notation>{"x += 1"}</Notation> берут прежнее значение и
                заменяют его новым.
              </>
            ),
          },
          {
            note: (
              <>
                Имя ссылается на объект, тип принадлежит объекту; Python не
                угадывает смысл: <Notation>{'10 + "5"'}</Notation> —{" "}
                <Notation>{"TypeError"}</Notation>.
              </>
            ),
          },
          {
            note: (
              <>
                Имена выбирают по смыслу и не занимают имена встроенных средств.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
