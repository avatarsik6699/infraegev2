import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonFilesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-files.media";

export const pythonFilesLesson = defineCourseLesson({
  ...pythonFilesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать файл целиком",
    "По строкам",
    "С заголовком; CSV",
    "JSON",
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
            <strong>
              Файл — это внешние данные со своим форматом, и программа читает их
              по этому формату: целиком или по строкам, с заголовком или без
            </strong>
            . Опора — <Notation>{"for"}</Notation> по источнику,{" "}
            <Notation>{"split"}</Notation> и <Notation>{"int"}</Notation> для
            разбора строк, <Notation>{"None"}</Notation> как «ответа нет»: файл
            — ещё один источник строк для того же цикла.
          </Typography.Text>
          <Typography.Text>
            Читать будем файл <Notation>{"numbers.txt"}</Notation> с одним целым
            числом на строке:
          </Typography.Text>
          <CodeBlock
            code={"5\n-2\n10\n7"}
            label={"Строки файла numbers.txt"}
            language="text"
            fileName="numbers.txt"
            showLineNumbers={false}
          />
          <Typography.Text>
            Найдём сумму, количество, отрицательный максимум и разберём, что
            меняется, если у файла есть заголовок.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Открыть файл",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы прочитать файл, программа открывает его по пути и в
              кодировке.
            </strong>{" "}
            Переменные обычного запуска исчезают после завершения процесса.{" "}
            <strong>Файл</strong> сохраняет байты на носителе. Чтобы прочитать
            текст, программа должна знать путь к файлу и способ преобразовать
            байты в символы — <strong>кодировку</strong>.
          </Typography.Text>
          <Typography.Text>
            <strong>Путь</strong> указывает расположение файла. Абсолютный путь
            задаётся от корня файловой системы. Относительный отсчитывается от
            текущей рабочей папки процесса. Она может не совпадать с папкой
            исходного <Notation>{".py"}</Notation>-файла, особенно в IDE.
          </Typography.Text>
          <CodeBlock
            code={
              'with open("numbers.txt", "r", encoding="utf-8") as file:\n    text = file.read()\nprint(repr(text))'
            }
            label={
              "Она может не совпадать с папкой исходного .py-файла, особенно в IDE"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"'5\\n-2\\n10\\n7\\n'"}
          />
          <Typography.Text>
            Этот пример требует существующего{" "}
            <Notation>{"numbers.txt"}</Notation>. <Notation>{"open"}</Notation>{" "}
            открывает файл. <Notation>{'"r"'}</Notation> означает чтение.{" "}
            <Notation>{"with"}</Notation> организует работу с ресурсом так,
            чтобы файл закрылся при выходе из блока, в том числе при обычной
            ошибке внутри. <Notation>{"as file"}</Notation> даёт имя открытому
            объекту. <Notation>{"read()"}</Notation> вернул весь текст одной
            строкой — <Notation>{"repr"}</Notation> показывает в ней переводы
            строк <Notation>{"\\n"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если файла нет по указанному пути, программа остановится:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("missing.txt", encoding="utf-8") as file:\n    print(file.read())'
            }
            label={"Если файла нет по указанному пути, программа остановится"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            error={
              "FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'"
            }
          />
          <Typography.Text>
            У открытого файла есть <strong>позиция</strong> — место, с которого
            начнётся следующее чтение. Каждое чтение сдвигает её вперёд. Если
            вызвать <Notation>{"file.read()"}</Notation> второй раз, получится
            пустая строка: всё уже прочитано. Можно открыть файл заново либо
            вернуть позицию к началу: <Notation>{"file.seek(0)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Целиком или построчно",
      explanation: (
        <>
          <Typography.Text>
            <strong>Небольшой файл читают целиком, большой — построчно.</strong>{" "}
            Если файл небольшой и содержит целые числа, разделённые пробельными
            символами:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("numbers.txt", encoding="utf-8") as file:\n    numbers = [int(part) for part in file.read().split()]\nprint(sum(numbers))'
            }
            label={
              "Если файл небольшой и содержит целые числа, разделённые пробельными символами"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"20"}
          />
          <Typography.Text>
            <Notation>{"read()"}</Notation> загружает весь текст в память. Если
            файл большой и одна строка содержит одно число, можно обрабатывать
            постепенно:
          </Typography.Text>
          <CodeBlock
            code={
              'total = 0\ncount = 0\nwith open("numbers.txt", encoding="utf-8") as file:\n    for line in file:\n        number = int(line)\n        total += number\n        count += 1\nprint(count, total)'
            }
            label={
              "Если файл большой и одна строка содержит одно число, можно обрабатывать постепенно"
            }
            language="python"
            fileName="total.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"4 20"}
          />
          <Typography.Text>
            Цикл <Notation>{"for line in file"}</Notation> выдаёт строки файла
            по одной, вместе с переводом строки в конце.{" "}
            <Notation>{"int"}</Notation> допускает окружающие пробельные
            символы, включая перевод строки, поэтому{" "}
            <Notation>{".strip()"}</Notation> здесь не требуется. Пустая строка
            вызовет ошибку — и это полезно, если формат обещал число на каждой
            строке. Пропускать пустые или повреждённые данные следует только при
            явно выбранном правиле.
          </Typography.Text>
          <Typography.Text>
            В <Notation>{"numbers.txt"}</Notation> лежат те же 5, −2, 10, 7 из
            сквозной задачи курса. Цикл по файлу устроен так же, как цикл по
            списку в уроке о списках, — меняется только источник строк.
          </Typography.Text>
          <Typography.Text>
            Для задач обработки текста не удаляй все пробелы через{" "}
            <Notation>{".strip()"}</Notation> автоматически: крайние пробелы
            могут быть частью данных. Если нужно снять только окончание строки,
            подходит <Notation>{'.rstrip("\\r\\n")'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Заголовок файла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Заголовок файла — часть формата, а не очередное значение.
            </strong>{" "}
            Файл может начинаться количеством записей или настройками. Нельзя
            автоматически считать каждое число полезным измерением. Пусть в
            файле <Notation>{"header.txt"}</Notation> первая строка — количество
            чисел:
          </Typography.Text>
          <CodeBlock
            code={"3\n4\n-1\n6"}
            label={"Строки файла header.txt"}
            language="text"
            fileName="header.txt"
            showLineNumbers={false}
          />
          <CodeBlock
            code={
              'with open("header.txt", encoding="utf-8") as file:\n    expected_count = int(file.readline())\n    numbers = [int(line) for line in file]\n\nif len(numbers) != expected_count:\n    print("Количество записей не совпадает с заголовком")\nelse:\n    print(sum(numbers))'
            }
            label={"Пусть в файле header.txt первая строка — количество чисел"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"9"}
          />
          <Typography.Text>
            <Notation>{"readline()"}</Notation> читает одну строку, дальнейший
            обход продолжает с текущей позиции. Поэтому 3 не попало в сумму: 4 −
            1 + 6 = 9. Пройди это чтение по шагам — стрелка показывает позицию:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.cursor_5435aa}
            label={
              "readline() читает одну строку, дальнейший обход продолжает с текущей позиции. Поэтому 3 не попало в сумму: 4 − 1 + 6 = 9. Пройди это чтение по шагам — стрелка показывает позицию:"
            }
          />
          <Typography.Text>
            Если первая строка содержит сразу два числа, сначала разбей её через{" "}
            <Notation>{"split"}</Notation>, затем преобразуй и распакуй:
          </Typography.Text>
          <CodeBlock
            code={
              'header = "100 2500"\ncount, capacity = [int(part) for part in header.split()]\nprint(count, capacity)'
            }
            label={"Программа на Python"}
            language="python"
            fileName="header.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"100 2500"}
          />
          <Typography.Text>
            Реальный формат диктует условие. Иногда заголовка нет вообще. Самая
            частая ошибка работы с файлами — правильно написать цикл для неверно
            понятой структуры входа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Режимы открытия",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Режим открытия решает, читать, перезаписать или дописать файл.
            </strong>{" "}
            <Notation>{"r"}</Notation> — читать существующий файл, это режим по
            умолчанию. <Notation>{"w"}</Notation> — писать заново: файл
            создаётся, а если он был, его содержимое сразу стирается.{" "}
            <Notation>{"a"}</Notation> — дописывать в конец, не трогая прежнее.{" "}
            <Notation>{"x"}</Notation> — создать новый файл и остановиться с
            ошибкой, если такой уже есть. Буква <Notation>{"b"}</Notation>{" "}
            добавляется к режиму для работы с байтами, например{" "}
            <Notation>{"rb"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'with open("result.txt", "w", encoding="utf-8") as file:\n    file.write("Готово\\n")\n    file.write(str(42) + "\\n")'
            }
            label={
              "Буква b добавляется к режиму для работы с байтами, например rb"
            }
            language="python"
            fileName="main.py"
            showLineNumbers={false}
          />
          <Typography.Text>
            <Notation>{"write"}</Notation> принимает строку и сам не добавляет
            перевод строки. Другой способ —{" "}
            <Notation>{"print(42, file=file)"}</Notation>. Не открывай входной
            файл в режиме <Notation>{"w"}</Notation>: он будет очищен ещё до
            записи новых данных.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "pathlib",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"pathlib"}</Notation> строит пути предсказуемо.
            </strong>{" "}
            Модуль <Notation>{"pathlib"}</Notation> подключается так же, как{" "}
            <Notation>{"math"}</Notation> в уроке о модулях:{" "}
            <Notation>{"from pathlib import Path"}</Notation> делает доступным
            готовое средство работы с путями.
          </Typography.Text>
          <CodeBlock
            code={
              'from pathlib import Path\n\npath = Path("data") / "numbers.txt"\nprint(path.resolve())'
            }
            label={"Программа на Python"}
            language="python"
            fileName="path.py"
            showLineNumbers={false}
          />
          <Typography.Text>
            Знак <Notation>{"/"}</Notation> между объектом{" "}
            <Notation>{"Path"}</Notation> и строкой соединяет части пути; он не
            выполняет арифметическое деление. <Notation>{"resolve()"}</Notation>{" "}
            помогает увидеть абсолютное расположение — у каждого компьютера оно
            своё, поэтому вывод здесь не показан.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: путь рядом со скриптом"
            kind="nuance"
          >
            <Typography.Text>
              В обычном скрипте путь рядом с ним можно построить как{" "}
              <Notation>
                {'Path(__file__).resolve().parent / "numbers.txt"'}
              </Notation>
              . Специальное имя <Notation>{"__file__"}</Notation> задаётся для
              файла модуля; в интерактивной оболочке или ноутбуке его может не
              быть.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "CSV и JSON",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для таблиц и вложенных записей есть готовые форматы CSV и JSON.
            </strong>{" "}
            <strong>CSV</strong> — текстовая таблица, где записи занимают
            строки, а поля разделяются заданным разделителем. Некоторые поля
            содержат кавычки, разделители и даже переводы строк. Поэтому простое{" "}
            <Notation>{'split(",")'}</Notation> не является универсальным
            чтением CSV. В стандартной библиотеке есть модуль{" "}
            <Notation>{"csv"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"name;score\nАнна;91\nИлья;84\nМарк;88"}
            label={"Строки файла students.csv"}
            language="text"
            fileName="students.csv"
            showLineNumbers={false}
          />
          <CodeBlock
            code={
              'import csv\n\nwith open("students.csv", encoding="utf-8", newline="") as file:\n    reader = csv.DictReader(file, delimiter=";")\n    for row in reader:\n        print(row["name"], int(row["score"]))'
            }
            label={"В стандартной библиотеке есть модуль csv"}
            language="python"
            fileName="main.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"Анна 91\nИлья 84\nМарк 88"}
          />
          <Typography.Text>
            Первая строка файла — заголовок <Notation>{"name;score"}</Notation>.{" "}
            <Notation>{"DictReader"}</Notation> сопоставляет имена столбцов со
            строковыми значениями: каждая <Notation>{"row"}</Notation> —
            словарь. Параметр <Notation>{'newline=""'}</Notation> передаёт
            обработку переводов строк CSV-модулю.
          </Typography.Text>
          <Typography.Text>
            <strong>JSON</strong> — формат записи вложенных объектов из
            словарей, списков, строк, чисел и нескольких специальных значений. В
            JSON нет произвольных объектов Python; например, множества напрямую
            не сохраняются.
          </Typography.Text>
          <CodeBlock
            code={
              'import json\n\ndata = {"name": "Анна", "scores": [91, 84]}\ntext = json.dumps(data, ensure_ascii=False, indent=2)\nrestored = json.loads(text)\nprint(restored == data)'
            }
            label={
              "В JSON нет произвольных объектов Python; например, множества напрямую не сохраняются"
            }
            language="python"
            fileName="data.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"True"}
          />
          <Typography.Text>
            <Notation>{"dumps"}</Notation> создаёт текст,{" "}
            <Notation>{"loads"}</Notation> разбирает текст.{" "}
            <Notation>{"dump"}</Notation> и <Notation>{"load"}</Notation>{" "}
            работают с файловым объектом. У JSON строковые ключи; JSON-массив
            восстанавливается как список, даже если перед сохранением
            использовался кортеж. <Notation>{"ensure_ascii=False"}</Notation>{" "}
            сохраняет читаемую кириллицу, <Notation>{"indent=2"}</Notation>{" "}
            добавляет отступы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s7",
      navLabel: "Нет подходящего элемента",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Отсутствие подходящего элемента обозначают{" "}
              <Notation>{"None"}</Notation>.
            </strong>{" "}
            Найдём максимальное отрицательное число файла или сообщим, что
            отрицательных нет:
          </Typography.Text>
          <CodeBlock
            code={
              'best = None\nwith open("numbers.txt", encoding="utf-8") as file:\n    for line in file:\n        value = int(line)\n        if value < 0 and (best is None or value > best):\n            best = value\n\nif best is None:\n    print("Отрицательных чисел нет")\nelse:\n    print(best)'
            }
            label={
              "Найдём максимальное отрицательное число файла или сообщим, что отрицательных нет"
            }
            language="python"
            fileName="best.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"-2"}
          />
          <Typography.Text>
            <Notation>{"None"}</Notation> явно обозначает отсутствие подходящего
            элемента. Короткое вычисление <Notation>{"or"}</Notation> не
            допускает сравнения числа с <Notation>{"None"}</Notation>: при{" "}
            <Notation>{"best is None"}</Notation> правая часть не вычисляется.
            При пустом файле программа также даёт осмысленный результат.
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
            Файл содержит по одному целому числу на строке, без заголовка. Найди
            наименьшее положительное число или сообщи, что положительных нет.
            Что выведет программа для <Notation>{"numbers.txt"}</Notation>? А
            для файла из чисел −3, −8?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            5; для −3, −8 — «Положительных чисел нет».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт <Notation>{"file.readline()"}</Notation>, если перед ним
            в том же блоке <Notation>{"with"}</Notation> уже выполнили{" "}
            <Notation>{"file.read()"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Пустую строку <Notation>{"''"}</Notation>:{" "}
            <Notation>{"read()"}</Notation> уже передвинул позицию в конец
            файла.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Файл <Notation>{"header.txt"}</Notation> сложили, забыв о заголовке:{" "}
            <Notation>{"sum([int(line) for line in file])"}</Notation>. Какая
            получится сумма и почему она неверна?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            12: в сумму попал заголовок 3, а сумма самих данных 4, −1, 6 — это
            9.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Чем отличаются режимы <Notation>{"w"}</Notation> и{" "}
            <Notation>{"a"}</Notation> для существующего файла?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"w"}</Notation> очищает файл перед записью,{" "}
            <Notation>{"a"}</Notation> дописывает в конец.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Почему строку <Notation>{'"Петров, Иван";90'}</Notation> нельзя
            надёжно разобрать через <Notation>{'split(",")'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Запятая внутри кавычек — часть поля, а{" "}
            <Notation>{"split"}</Notation> разрежет по ней; модуль{" "}
            <Notation>{"csv"}</Notation> учитывает кавычки.
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
                <Notation>
                  {'with open(путь, encoding="utf-8") as file:'}
                </Notation>{" "}
                открывает файл и закрывает его после блока.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"read()"}</Notation> — весь текст сразу,{" "}
                <Notation>{"for line in file"}</Notation> — по строке,{" "}
                <Notation>{"readline()"}</Notation> — одна строка.
              </>
            ),
          },
          { note: <>Заголовок читают отдельно; остальные строки — данные.</> },
          {
            note: (
              <>
                <Notation>{"w"}</Notation> очищает файл,{" "}
                <Notation>{"a"}</Notation> дописывает;{" "}
                <Notation>{"write"}</Notation> не добавляет перевод строки.
              </>
            ),
          },
          {
            note: (
              <>
                CSV читают модулем <Notation>{"csv"}</Notation>, вложенные
                записи сохраняют в JSON.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
