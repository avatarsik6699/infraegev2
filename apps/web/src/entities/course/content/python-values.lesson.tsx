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
import { pythonValuesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-values.media";

export const pythonValuesLesson = defineCourseLesson({
  ...pythonValuesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Различать типы", "Прослеживать присваивания"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В прошлом уроке ты считал стоимость трёх тетрадей:{" "}
            <Notation>{"print(3 * 40)"}</Notation>. Числа в этой записи
            безымянные: по коду не видно, где цена, а где количество.{" "}
            <strong>
              В этом уроке у значений появятся имена, а заодно выяснится, почему{" "}
              <Notation>{"40"}</Notation> и <Notation>{'"40"'}</Notation> для
              Python — разные данные
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Сначала разберём, какими бывают значения, затем — как дать значению
            имя и что происходит, когда то же имя связывают с новым значением.
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
            <Notation>{"27"}</Notation> — число. <Notation>{'"27"'}</Notation> —
            текст: ты помнишь из прошлого урока, что кавычки делают запись
            текстом. С числами выполняют арифметику, а текст можно соединить с
            другим текстом:
          </Typography.Text>
          <CodeBlock
            code={'print(27 + 3)\nprint("27" + "3")'}
            label={
              "С числами выполняют арифметику, а текст можно соединить с другим текстом"
            }
            language="python"
            fileName="main.py"
            output={"30\n273"}
          />
          <Typography.Text>
            Текст в кавычках в Python называют <strong>строкой</strong> — это
            строка символов. Не путай её со строкой программы: в одной строке
            программы <Notation>{'print("27" + "3")'}</Notation> записаны две
            строки — <Notation>{'"27"'}</Notation> и{" "}
            <Notation>{'"3"'}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Знак <Notation>{"+"}</Notation> один и тот же, но числа он
            складывает, а строки склеивает:
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
            <strong>Тип</strong> значения — его вид: <Notation>{"27"}</Notation>{" "}
            — целое число, <Notation>{'"27"'}</Notation> — строка. От типа
            зависит, что Python делает со значением: ты только что видел, что{" "}
            <Notation>{"+"}</Notation> у чисел и у строк работает по-разному.
            Тип значения сообщает <Notation>{"type(...)"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={'print(type(27))\nprint(type("27"))\nprint(type(2.5))'}
            label={"Тип значения сообщает type(...)"}
            language="python"
            fileName="main.py"
            output={"<class 'int'>\n<class 'str'>\n<class 'float'>"}
          />
          <Typography.Text>
            В выводе важно короткое имя типа в кавычках:{" "}
            <Notation>{"int"}</Notation>, <Notation>{"str"}</Notation>,{" "}
            <Notation>{"float"}</Notation>. Для первых программ этих трёх типов
            хватит:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.typeCards}
            caption={
              <>
                Целые числа <Notation>{"int"}</Notation> — для счёта и точных
                вычислений, дробные <Notation>{"float"}</Notation> (их ещё
                называют числами с плавающей точкой) — для измерений и долей.
                Строка <Notation>{"str"}</Notation> — любой текст, даже из одних
                цифр или пустой: <Notation>{'""'}</Notation>.
              </>
            }
          />
          <Typography.Text>
            Дробную часть в Python отделяют точкой, а не запятой. Запятая в коде
            разделяет значения, поэтому <Notation>{"print(2,5)"}</Notation>{" "}
            напечатает не дробь, а два числа:
          </Typography.Text>
          <CodeBlock
            code={"print(2.5)\nprint(2,5)"}
            label={"Дробную часть в Python отделяют точкой, а не запятой"}
            language="python"
            fileName="main.py"
            output={"2.5\n2 5"}
          />
          <Typography.Text>
            Ещё два типа — <Notation>{"bool"}</Notation> (ответ «да» или «нет»)
            и <Notation>{"None"}</Notation> («значения нет») — понадобятся в
            уроках об условиях и функциях. Остальные типы появятся вместе с
            задачами, для которых они нужны.
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
              Чтобы дать значению имя, пишут имя, знак{" "}
              <Notation>{"="}</Notation> и значение.
            </strong>{" "}
            Так записывается покупка из прошлого урока:
          </Typography.Text>
          <CodeBlock
            code={
              "price = 40\nquantity = 3\ncost = price * quantity\nprint(cost)"
            }
            label={"Так записывается покупка из прошлого урока"}
            language="python"
            fileName="main.py"
            output={"120"}
          />
          <Typography.Text>
            Первые две строки связывают имя <Notation>{"price"}</Notation> с
            числом 40, а <Notation>{"quantity"}</Notation> — с числом 3. В
            третьей справа от <Notation>{"="}</Notation> стоит выражение: Python
            сначала вычисляет его из текущих значений и только потом связывает
            имя <Notation>{"cost"}</Notation> с результатом 120. Такая
            инструкция называется <strong>присваиванием</strong>, а имя,
            связанное со значением, — <strong>переменной</strong>. Говорят и
            короче: «переменная <Notation>{"cost"}</Notation> получила значение
            120».
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.assign}
            caption={
              <>
                Сначала вычисляется правая часть: <Notation>{"price"}</Notation>{" "}
                и <Notation>{"quantity"}</Notation> дают 40 и 3, выражение —
                120. Только потом имя <Notation>{"cost"}</Notation> слева
                связывается с готовым числом.
              </>
            }
          />
          <Typography.Text>
            Имя появляется только после присваивания. Если напечатать{" "}
            <Notation>{"cost"}</Notation> раньше, программа остановится с{" "}
            <Notation>{"NameError"}</Notation> — той же ошибкой, что у{" "}
            <Notation>{"pritn"}</Notation> в прошлом уроке:
          </Typography.Text>
          <CodeBlock
            code={"print(cost)\ncost = 120"}
            label={"Имя появляется только после присваивания"}
            language="python"
            fileName="main.py"
            error={"NameError: name 'cost' is not defined"}
          />
          <Typography.Text>
            Знак <Notation>{"="}</Notation> в Python — не равенство из
            математики, а действие: связать имя со значением в тот момент, когда
            выполняется строка. Нажми «Запуск» в шапке примера и пройди
            программу по шагам: рядом с кодом видно, с каким значением связано
            каждое имя.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runAssignment}
            label={"Знак = в Python — не равенство из математики, а действие"}
          />
          <Typography.Text>
            Во второй строке <Notation>{"x + 2"}</Notation> вычисляется сразу:
            имя <Notation>{"y"}</Notation> связывается с числом 7, а не с
            формулой. Третья строка связывает с новым значением только{" "}
            <Notation>{"x"}</Notation>, поэтому программа печатает 7. Вот
            значения после каждой строки:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.bindStrip}
            caption={
              <>
                Выделено имя, которое связала строка. Третья строка связала
                заново только <Notation>{"x"}</Notation>: у{" "}
                <Notation>{"y"}</Notation> осталось 7.
              </>
            }
          />
          <Typography.Text>
            Так же и с покупкой: если после вычисления{" "}
            <Notation>{"cost"}</Notation> присвоить{" "}
            <Notation>{"price = 50"}</Notation>, стоимость останется 120, пока
            её не вычислят заново.
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
            fileName="main.py"
            output={"5"}
          />
          <Typography.Text>
            Сначала вычисляется правая часть с прежним значением{" "}
            <Notation>{"count"}</Notation>: 4 + 1 = 5. Потом имя{" "}
            <Notation>{"count"}</Notation> связывается с результатом:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.countStrip}
            caption={
              <>
                После второй строки <Notation>{"count"}</Notation> связано с 5:
                справа от <Notation>{"="}</Notation> взяли прежнее значение 4 и
                прибавили 1.
              </>
            }
          />
          <Typography.Text>
            Сокращённая запись для этого случая —{" "}
            <Notation>{"count += 1"}</Notation>. Так же работают{" "}
            <Notation>{"-="}</Notation>, <Notation>{"*="}</Notation> и другие:{" "}
            <Notation>{"x *= 2"}</Notation> означает{" "}
            <Notation>{"x = x * 2"}</Notation>.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: запись count++" kind="nuance">
            <Typography.Text>
              Если ты встречал другие языки программирования: записи{" "}
              <Notation>{"count++"}</Notation> в Python нет. Увеличение на
              единицу пишут <Notation>{"count += 1"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Тип у значения",
      explanation: (
        <>
          <Typography.Text>
            <strong>Тип принадлежит значению, а не имени.</strong> Одно имя
            можно связать сначала с целым числом, а затем со строкой:
          </Typography.Text>
          <CodeBlock
            code={
              'value = 10\nprint(type(value))\nvalue = "десять"\nprint(type(value))'
            }
            label={"Тип принадлежит значению, а не имени"}
            language="python"
            fileName="main.py"
            output={"<class 'int'>\n<class 'str'>"}
          />
          <Typography.Text>
            <Notation>{"type(value)"}</Notation> сообщает тип того значения, с
            которым имя связано сейчас.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: имена и объекты" kind="nuance">
            <Typography.Text>
              Строже говоря, в памяти Python хранятся <strong>объекты</strong> —
              значения вместе с их типом, а имя только ссылается на объект.
              Поэтому «переменная хранит значение» — упрощение, а возможность
              связывать одно имя со значениями разных типов называют
              динамической типизацией. Разница между «хранит» и «ссылается»
              станет важна в уроке о списках: там два имени могут ссылаться на
              один список, и изменение через одно имя видно через другое.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Но смешивать типы в одной операции Python сам не станет:
          </Typography.Text>
          <CodeBlock
            code={'print(10 + "5")'}
            label={"Но смешивать типы в одной операции Python сам не станет"}
            language="python"
            fileName="main.py"
            error={
              "TypeError: unsupported operand type(s) for +: 'int' and 'str'"
            }
          />
          <Typography.Text>
            <Notation>{"TypeError"}</Notation> — ошибка неподходящего типа:
            число и строку нельзя сложить. Это исключение, как деление на ноль в
            прошлом уроке: запись верная, но выполнить её нельзя. Python не
            угадывает, нужно ли 15 или <Notation>{'"105"'}</Notation>. Как
            превратить строку в число и обратно, разберём в уроке «Ввод,
            преобразование и вывод».
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
            <strong>Хорошее имя объясняет смысл значения.</strong>{" "}
            <Notation>{"price"}</Notation> и <Notation>{"quantity"}</Notation>{" "}
            понятнее, чем <Notation>{"a"}</Notation> и{" "}
            <Notation>{"b"}</Notation>: через неделю ты сразу вспомнишь, что они
            значат. Слова в имени разделяют подчёркиванием:{" "}
            <Notation>{"max_value"}</Notation>,{" "}
            <Notation>{"student_name"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Имя состоит из букв, цифр и знака <Notation>{"_"}</Notation> и не
            начинается с цифры: <Notation>{"price2"}</Notation> подходит,{" "}
            <Notation>{"2price"}</Notation> — нет. Пробелов в имени не бывает:{" "}
            <Notation>{"student name"}</Notation> — это уже два имени подряд.
            Регистр различается: <Notation>{"count"}</Notation> и{" "}
            <Notation>{"Count"}</Notation> — разные имена, как{" "}
            <Notation>{"print"}</Notation> и <Notation>{"Print"}</Notation> в
            прошлом уроке. Служебные слова языка именами быть не могут — среди
            них уже знакомые <Notation>{"True"}</Notation>,{" "}
            <Notation>{"False"}</Notation> и <Notation>{"None"}</Notation>.
            Русские буквы Python в именах допускает, но так не принято: имена
            пишут английскими словами.
          </Typography.Text>
          <Typography.Text>
            Не занимай имена, которые уже что-то значат в Python:{" "}
            <Notation>{"print"}</Notation>, <Notation>{"type"}</Notation>,{" "}
            <Notation>{"int"}</Notation>, <Notation>{"str"}</Notation>. Python
            разрешит такое присваивание, но имя потеряет прежний смысл:
          </Typography.Text>
          <CodeBlock
            code={'print = 5\nprint("Привет")'}
            label={
              "Python разрешит такое присваивание, но имя потеряет прежний смысл"
            }
            language="python"
            fileName="main.py"
            error={"TypeError: 'int' object is not callable"}
          />
          <Typography.Text>
            После первой строки имя <Notation>{"print"}</Notation> связано с
            числом 5, и печатать им уже нельзя.
          </Typography.Text>
          <Typography.Text>
            В прошлом уроке в коде встречались пояснения после{" "}
            <Notation>{"#"}</Notation>. Их называют{" "}
            <strong>комментариями</strong>: Python пропускает всё от{" "}
            <Notation>{"#"}</Notation> до конца строки. Комментарий пишут, когда
            смысл значения не виден из кода:
          </Typography.Text>
          <CodeBlock
            code={"discount = 10  # Скидка в процентах, а не в рублях"}
            label={"Комментарий пишут, когда смысл значения не виден из кода"}
            language="python"
            fileName="main.py"
          />
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
            Какой тип у значений <Notation>{"40"}</Notation>,{" "}
            <Notation>{'"40"'}</Notation> и <Notation>{"4.0"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"int"}</Notation>, <Notation>{"str"}</Notation> и{" "}
            <Notation>{"float"}</Notation>: кавычки делают значение строкой, а
            запись с точкой — дробным числом, даже если дробная часть нулевая.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            С какими значениями связаны имена <Notation>{"a"}</Notation> и{" "}
            <Notation>{"b"}</Notation> после каждой строки программы?
          </Typography.Text>
          <CodeBlock
            code={"a = 1\nb = a + 1\na = b * 3\nb = a - b"}
            label={"Программа из четырёх присваиваний"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            После строки 1: <Notation>{"a"}</Notation> = 1,{" "}
            <Notation>{"b"}</Notation> ещё нет. После строки 2: a = 1, b = 2.
            После строки 3: a = 6, b = 2. После строки 4: a = 6, b = 4 — правая
            часть берёт текущие значения 6 и 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Программа из двух строк <Notation>{"print(total)"}</Notation> и{" "}
            <Notation>{"total = 150"}</Notation> остановилась. Какая это ошибка
            и как исправить программу?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"NameError: name 'total' is not defined"}</Notation>:
            первая строка обращается к имени, которое появится только во второй.
            Строки нужно поменять местами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Программа <Notation>{'print(10 + "5")'}</Notation> остановилась.
            Какой тип ошибки в последней строке сообщения и как исправить
            запись, чтобы напечаталось 15?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"TypeError"}</Notation>: число нельзя сложить со строкой.
            Чтобы получить 15, убери кавычки:{" "}
            <Notation>{"print(10 + 5)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Какие из имён не подойдут для переменной и почему:{" "}
            <Notation>{"total_price"}</Notation>, <Notation>{"3d"}</Notation>,{" "}
            <Notation>{"None"}</Notation>, <Notation>{"print"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"3d"}</Notation> начинается с цифры, а{" "}
            <Notation>{"None"}</Notation> — служебное слово: оба вызовут ошибку.{" "}
            <Notation>{"print"}</Notation> Python примет, но после такого
            присваивания печатать через <Notation>{"print"}</Notation> будет
            нельзя. Подходит только <Notation>{"total_price"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        За урок числа из задачи о тетрадях получили типы и имена. Вот что из
        этого понадобится в каждом следующем уроке.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Тип",
            note: (
              <>
                Вид значения: <Notation>{"int"}</Notation> — целое число,{" "}
                <Notation>{"float"}</Notation> — дробное (через точку),{" "}
                <Notation>{"str"}</Notation> — строка, текст в кавычках. Тип
                сообщает <Notation>{"type(...)"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{'"27" + "3"'}</Notation>,
            note: (
              <>
                От типа зависит действие: числа складываются, строки склеиваются
                — <Notation>{'"273"'}</Notation>, а не 30.
              </>
            ),
          },
          {
            key: "Присваивание",
            note: (
              <>
                Сначала вычисляется правая часть, затем имя слева связывается с
                результатом. Формула не запоминается.
              </>
            ),
          },
          {
            key: "Переменная",
            note: (
              <>
                Имя, связанное со значением. До присваивания имени нет:
                обращение к нему даёт <Notation>{"NameError"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"count += 1"}</Notation>,
            note: (
              <>
                То же, что <Notation>{"count = count + 1"}</Notation>: к
                прежнему значению прибавляется 1, имя связывается с новым.
              </>
            ),
          },
          {
            key: <Notation>{'10 + "5"'}</Notation>,
            note: (
              <>
                <Notation>{"TypeError"}</Notation>: Python не смешивает типы в
                одной операции и не угадывает, что имелось в виду.
              </>
            ),
          },
          {
            key: "Имена",
            note: (
              <>
                Буквы, цифры и <Notation>{"_"}</Notation>, не с цифры, без
                пробелов, не служебное слово. Имя называет смысл значения и не
                занимает <Notation>{"print"}</Notation>,{" "}
                <Notation>{"type"}</Notation>, <Notation>{"str"}</Notation>.
              </>
            ),
          },
          {
            key: "Комментарий",
            note: (
              <>
                Пояснение после <Notation>{"#"}</Notation>: Python его
                пропускает.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
