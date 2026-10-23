import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
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
            Сумму и наибольшее из 5, −2, 10, 7 мы уже считали: числа вводили с
            клавиатуры или записывали списком в коде. В задачах ЕГЭ и в жизни
            чисел тысячи, и они лежат в файле — вводить их руками никто не
            будет.{" "}
            <strong>
              Программа может сама прочитать файл: открыть его по имени и
              получить текст целиком или строку за строкой
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Пусть те же числа лежат в файле <Notation>{"numbers.txt"}</Notation>
            , по одному на строке:
          </Typography.Text>
          <CodeBlock
            code={"5\n-2\n10\n7"}
            label={"Строки файла numbers.txt"}
            language="text"
            fileName="numbers.txt"
          />
          <Typography.Text>
            Посчитаем для него сумму и наибольшее, а потом разберём файлы с
            заголовком, запись в файл и готовые форматы CSV и JSON.
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
            <strong>Путь</strong> говорит, где лежит файл.{" "}
            <strong>Кодировка</strong> — правило, по которому байты на диске
            превращаются в буквы; для русского текста это{" "}
            <Notation>{'"utf-8"'}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'with open("numbers.txt", "r", encoding="utf-8") as file:\n    text = file.read()\nprint(repr(text))'
            }
            label={"Чтение файла numbers.txt целиком"}
            language="python"
            fileName="main.py"
            output={"'5\\n-2\\n10\\n7\\n'"}
          />
          <Typography.Text>
            <Notation>{"open"}</Notation> открывает файл,{" "}
            <Notation>{'"r"'}</Notation> означает чтение.{" "}
            <Notation>{"with … as file"}</Notation> даёт открытому файлу имя{" "}
            <Notation>{"file"}</Notation> и закрывает файл, когда блок кончится.{" "}
            <Notation>{"read()"}</Notation> вернул весь текст одной строкой, а{" "}
            <Notation>{"repr"}</Notation>, как в уроке о строках, показал в ней
            переводы строк <Notation>{"\\n"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Путь <Notation>{'"numbers.txt"'}</Notation> —{" "}
            <strong>относительный</strong>: Python ищет файл в{" "}
            <strong>рабочей папке</strong>, откуда запущена программа.{" "}
            <strong>Абсолютный</strong> путь начинается с диска и находит файл
            откуда угодно:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.folderPaths}
            caption={
              <>
                Два пути ведут к одному файлу: относительный отсчитывается от
                рабочей папки, абсолютный — от корня диска. В пути Python
                понимает и прямую косую черту <Notation>{"/"}</Notation>.
              </>
            }
          />
          <Typography.Text>
            Проще всего держать <Notation>{"numbers.txt"}</Notation> рядом с{" "}
            <Notation>{"main.py"}</Notation> в папке проекта: в PyCharm — правой
            кнопкой по папке проекта, New → File; в VS Code — кнопка New File
            над списком файлов. Тогда при запуске из IDE файл найдётся. При
            запуске из терминала сначала перейди в эту папку командой{" "}
            <Notation>{"cd"}</Notation>, как в первом уроке. Если файла нет по
            указанному пути, программа остановится:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("missing.txt", encoding="utf-8") as file:\n    print(file.read())'
            }
            label={"Открытие файла, которого нет"}
            language="python"
            fileName="main.py"
            error={
              "FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'"
            }
          />
          <ProofDisclosure summary="Тонкости: with и ошибки" kind="nuance">
            <Typography.Text>
              <Notation>{"with"}</Notation> закрывает файл и тогда, когда внутри
              блока возникла ошибка. Без него файл закрывают вызовом{" "}
              <Notation>{"file.close()"}</Notation>, и его легко забыть.
            </Typography.Text>
          </ProofDisclosure>
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
            Целиком: <Notation>{"read()"}</Notation> отдаёт весь текст,{" "}
            <Notation>{"split()"}</Notation> режет его по пробелам и переводам
            строк, дальше — знакомые <Notation>{"sum"}</Notation> и{" "}
            <Notation>{"max"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("numbers.txt", encoding="utf-8") as file:\n    numbers = [int(part) for part in file.read().split()]\nprint(sum(numbers), max(numbers))'
            }
            label={"Сумма и наибольшее: файл целиком"}
            language="python"
            fileName="main.py"
            output={"20 10"}
          />
          <Typography.Text>
            Так весь файл сразу оказывается в памяти — для миллиона строк это
            много. Построчно: цикл <Notation>{"for line in file"}</Notation>{" "}
            выдаёт строки файла по одной, и сумму с наибольшим можно считать по
            ходу, как в уроке о <Notation>{"while"}</Notation>.{" "}
            <Notation>{"best = None"}</Notation> — «наибольшего пока нет», как в
            уроке о <Notation>{"for"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'total = 0\nbest = None\nwith open("numbers.txt", encoding="utf-8") as file:\n    for line in file:\n        number = int(line)\n        total += number\n        if best is None or number > best:\n            best = number\nprint(total, best)'
            }
            label={"Сумма и наибольшее: файл по строкам"}
            language="python"
            fileName="main.py"
            output={"20 10"}
          />
          <Typography.Text>
            Каждая строка приходит вместе с переводом строки в конце:{" "}
            <Notation>{"'5\\n'"}</Notation>. <Notation>{"int"}</Notation>{" "}
            допускает пробелы и перевод строки по краям, поэтому{" "}
            <Notation>{".strip()"}</Notation> здесь не нужен. Пройди цикл по
            шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.fileLines}
            label={"Сумма и наибольшее по строкам файла numbers.txt"}
          />
          <Typography.Text>
            Пустая строка в файле вызовет ошибку <Notation>{"int"}</Notation> —
            и это полезно, если формат обещал число на каждой строке. Пропускать
            пустые строки стоит, только если так сказано в условии.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: когда strip() вредит"
            kind="nuance"
          >
            <Typography.Text>
              В задачах на обработку текста пробелы по краям строки бывают
              частью данных, и <Notation>{".strip()"}</Notation> их уничтожит.
              Чтобы снять только перевод строки, пиши{" "}
              <Notation>{'line.rstrip("\\n")'}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
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
            Файл может начинаться количеством записей или настройками, и их
            нельзя складывать с данными. Пусть в файле{" "}
            <Notation>{"header.txt"}</Notation> первая строка — количество
            чисел:
          </Typography.Text>
          <CodeBlock
            code={"3\n4\n-1\n6"}
            label={"Строки файла header.txt"}
            language="text"
            fileName="header.txt"
          />
          <CodeBlock
            code={
              'with open("header.txt", encoding="utf-8") as file:\n    expected_count = int(file.readline())\n    numbers = [int(line) for line in file]\n\nif len(numbers) != expected_count:\n    print("Количество записей не совпадает с заголовком")\nelse:\n    print(sum(numbers))'
            }
            label={"Сумма чисел файла с заголовком"}
            language="python"
            fileName="main.py"
            output={"9"}
          />
          <Typography.Text>
            У открытого файла есть <strong>позиция</strong> — место, с которого
            начнётся следующее чтение. <Notation>{"readline()"}</Notation>{" "}
            читает одну строку и сдвигает позицию, а цикл по файлу продолжает с
            того места, где она стоит. Поэтому 3 не попало в сумму: 4 − 1 + 6 =
            9. Пройди это чтение по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.cursor_5435aa}
            label={"Позиция чтения в файле header.txt"}
          />
          <Typography.Text>
            Прочитанное второй раз не читается: после{" "}
            <Notation>{"read()"}</Notation> или цикла до конца новое чтение
            вернёт пустую строку. Чтобы читать снова, файл открывают заново.
          </Typography.Text>
          <Typography.Text>
            Если первая строка содержит сразу два числа, сначала разбей её через{" "}
            <Notation>{"split"}</Notation>, затем преобразуй и распакуй:
          </Typography.Text>
          <CodeBlock
            code={
              'header = "100 2500"\ncount, capacity = [int(part) for part in header.split()]\nprint(count, capacity)'
            }
            label={"Заголовок из двух чисел"}
            language="python"
            fileName="main.py"
            output={"100 2500"}
          />
          <Typography.Text>
            Формат файла задаёт условие. Иногда заголовка нет вообще. Самая
            частая ошибка — правильный цикл для неверно понятого формата.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Запись в файл",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Режим открытия решает, читать, перезаписать или дописать файл.
            </strong>{" "}
            Его передают вторым аргументом <Notation>{"open"}</Notation>:
          </Typography.Text>
          <LessonTable
            label={"Режимы открытия файла"}
            columns={[
              { label: "Режим" },
              { label: "Что делает" },
              { label: "Если файла нет" },
            ]}
            rows={[
              [
                <Notation key="r">{'"r"'}</Notation>,
                "Читает; режим по умолчанию",
                "Ошибка FileNotFoundError",
              ],
              [
                <Notation key="w">{'"w"'}</Notation>,
                "Пишет заново: прежнее содержимое сразу стирается",
                "Создаёт",
              ],
              [
                <Notation key="a">{'"a"'}</Notation>,
                "Дописывает в конец, прежнее не трогает",
                "Создаёт",
              ],
            ]}
          />
          <Typography.Text>
            Запишем сумму сквозной задачи в файл{" "}
            <Notation>{"result.txt"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'total = 20\nwith open("result.txt", "w", encoding="utf-8") as file:\n    file.write("Сумма: " + str(total) + "\\n")'
            }
            label={"Запись суммы в файл result.txt"}
            language="python"
            fileName="main.py"
          />
          <Typography.Text>
            На экран программа ничего не печатает, а рядом с{" "}
            <Notation>{"main.py"}</Notation> появляется файл:
          </Typography.Text>
          <CodeBlock
            code={"Сумма: 20"}
            label={"Строки файла result.txt"}
            language="text"
            fileName="result.txt"
          />
          <Typography.Text>
            <Notation>{"write"}</Notation> принимает только строку и сам не
            добавляет перевод строки — поэтому <Notation>{"str"}</Notation> и{" "}
            <Notation>{'"\\n"'}</Notation>. Другой способ —{" "}
            <Notation>{'print("Сумма:", total, file=file)'}</Notation>: он
            ставит пробел и перевод строки сам. Не открывай входной файл в
            режиме <Notation>{'"w"'}</Notation>: он будет очищен ещё до чтения.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: режимы x и b" kind="nuance">
            <Typography.Text>
              <Notation>{'"x"'}</Notation> создаёт новый файл и останавливается
              с ошибкой, если такой уже есть. Буква <Notation>{"b"}</Notation>{" "}
              добавляется для работы с байтами, а не с текстом:{" "}
              <Notation>{'"rb"'}</Notation>, <Notation>{'"wb"'}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
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
              <Notation>{"pathlib"}</Notation> собирает путь из частей.
            </strong>{" "}
            Модуль подключается так же, как <Notation>{"math"}</Notation> в
            уроке о модулях: <Notation>{"from pathlib import Path"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'from pathlib import Path\n\npath = Path("data") / "numbers.txt"\nprint(path.resolve())'
            }
            label={"Путь к data/numbers.txt через Path"}
            language="python"
            fileName="main.py"
          />
          <Typography.Text>
            Знак <Notation>{"/"}</Notation> между <Notation>{"Path"}</Notation>{" "}
            и строкой соединяет части пути, а не делит.{" "}
            <Notation>{"resolve()"}</Notation> показывает абсолютный путь — у
            каждого компьютера он свой, поэтому вывод здесь не показан. Это
            удобно, когда файл не находится: видно, где Python его искал.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: путь рядом со скриптом"
            kind="nuance"
          >
            <Typography.Text>
              Путь к файлу рядом с самим скриптом, откуда бы его ни запустили:{" "}
              <Notation>
                {'Path(__file__).resolve().parent / "numbers.txt"'}
              </Notation>
              . Специальное имя <Notation>{"__file__"}</Notation> — путь к файлу
              модуля; в интерактивной оболочке его нет.
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
            <strong>CSV</strong> — таблица в текстовом файле: запись на строке,
            поля разделены заданным знаком. Поле может содержать в кавычках сам
            разделитель, поэтому простое <Notation>{'split(",")'}</Notation> CSV
            надёжно не разберёт. В стандартной библиотеке есть модуль{" "}
            <Notation>{"csv"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"name;score\nАнна;91\nИлья;84\nМарк;88"}
            label={"Строки файла students.csv"}
            language="text"
            fileName="students.csv"
          />
          <CodeBlock
            code={
              'import csv\n\nwith open("students.csv", encoding="utf-8", newline="") as file:\n    reader = csv.DictReader(file, delimiter=";")\n    for row in reader:\n        print(row["name"], int(row["score"]))'
            }
            label={"Чтение students.csv модулем csv"}
            language="python"
            fileName="main.py"
            output={"Анна 91\nИлья 84\nМарк 88"}
          />
          <Typography.Text>
            Первая строка файла — заголовок <Notation>{"name;score"}</Notation>.{" "}
            <Notation>{"DictReader"}</Notation> превращает каждую следующую
            строку в словарь: ключи — имена столбцов, значения — строки, поэтому
            балл переводим через <Notation>{"int"}</Notation>.{" "}
            <Notation>{'newline=""'}</Notation> оставляет переводы строк модулю{" "}
            <Notation>{"csv"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>JSON</strong> — текстовая запись словарей, списков, строк и
            чисел. Модуль <Notation>{"json"}</Notation> превращает их в текст и
            обратно:
          </Typography.Text>
          <CodeBlock
            code={
              'import json\n\ndata = {"name": "Анна", "scores": [91, 84]}\ntext = json.dumps(data, ensure_ascii=False)\nprint(text)\nrestored = json.loads(text)\nprint(restored == data)'
            }
            label={"Словарь в JSON и обратно"}
            language="python"
            fileName="main.py"
            output={'{"name": "Анна", "scores": [91, 84]}\nTrue'}
          />
          <Typography.Text>
            <Notation>{"dumps"}</Notation> создаёт текст,{" "}
            <Notation>{"loads"}</Notation> разбирает его;{" "}
            <Notation>{"dump"}</Notation> и <Notation>{"load"}</Notation> делают
            то же с открытым файлом. <Notation>{"ensure_ascii=False"}</Notation>{" "}
            оставляет кириллицу читаемой, <Notation>{"indent=2"}</Notation>{" "}
            разложил бы запись по строкам с отступами. Кортеж JSON запишет как
            список и вернёт списком, а множество не запишет вовсе.
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
              Если подходящих строк нет вовсе, <Notation>{"None"}</Notation>{" "}
              остаётся до конца.
            </strong>{" "}
            Найдём наибольшее отрицательное число файла или сообщим, что
            отрицательных нет:
          </Typography.Text>
          <CodeBlock
            code={
              'best = None\nwith open("numbers.txt", encoding="utf-8") as file:\n    for line in file:\n        value = int(line)\n        if value < 0 and (best is None or value > best):\n            best = value\n\nif best is None:\n    print("Отрицательных чисел нет")\nelse:\n    print(best)'
            }
            label={"Наибольшее отрицательное число файла"}
            language="python"
            fileName="main.py"
            output={"-2"}
          />
          <Typography.Text>
            Это тот же цикл, что для наибольшего, только с условием{" "}
            <Notation>{"value < 0"}</Notation>. Короткое вычисление{" "}
            <Notation>{"or"}</Notation> не даёт сравнить число с{" "}
            <Notation>{"None"}</Notation>: при{" "}
            <Notation>{"best is None"}</Notation> правая часть не вычисляется.
            Для файла без отрицательных чисел или пустого файла программа честно
            напишет «Отрицательных чисел нет».
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
            Напиши программу: найди в файле наименьшее положительное число или
            сообщи, что положительных нет. Что она напечатает для{" "}
            <Notation>{"numbers.txt"}</Notation>? А для файла из чисел −3, −8?
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
            Чем отличаются режимы <Notation>{'"w"'}</Notation> и{" "}
            <Notation>{'"a"'}</Notation> для существующего файла?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'"w"'}</Notation> стирает файл перед записью,{" "}
            <Notation>{'"a"'}</Notation> дописывает в конец.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Программа с <Notation>{'open("numbers.txt")'}</Notation> работает в
            PyCharm, а из терминала падает с{" "}
            <Notation>{"FileNotFoundError"}</Notation>. Почему?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Путь относительный, и Python ищет файл в рабочей папке. В терминале
            программу запустили из другой папки — перейди командой{" "}
            <Notation>{"cd"}</Notation> в папку проекта.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Файл — ещё один источник строк для знакомого цикла: открыл, прочитал по
        формату, посчитал. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"with open(…)"}</Notation>,
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
            key: "Путь",
            note: (
              <>
                Относительный — от рабочей папки, абсолютный — от корня диска;
                файл держат рядом с <Notation>{"main.py"}</Notation>.
              </>
            ),
          },
          {
            key: "Чтение",
            note: (
              <>
                <Notation>{"read()"}</Notation> — весь текст,{" "}
                <Notation>{"for line in file"}</Notation> — строка за строкой,{" "}
                <Notation>{"readline()"}</Notation> — одна строка; позиция
                движется только вперёд.
              </>
            ),
          },
          {
            key: "Заголовок",
            note: <>Заголовок читают отдельно; остальные строки — данные.</>,
          },
          {
            key: "Запись",
            note: (
              <>
                <Notation>{'"w"'}</Notation> стирает файл,{" "}
                <Notation>{'"a"'}</Notation> дописывает;{" "}
                <Notation>{"write"}</Notation> не добавляет перевод строки.
              </>
            ),
          },
          {
            key: "CSV и JSON",
            note: (
              <>
                Таблицы читают модулем <Notation>{"csv"}</Notation>, вложенные
                записи хранят в JSON.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
