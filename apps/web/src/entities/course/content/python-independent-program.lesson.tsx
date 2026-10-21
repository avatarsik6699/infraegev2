import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  TerminalCommand,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonIndependentProgramLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-independent-program.media";

export const pythonIndependentProgramLesson = defineCourseLesson({
  ...pythonIndependentProgramLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Собрать программу по договорённости и проверить её"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Сумму и наибольшее из 5, −2, 10, 7 мы считали весь курс: тремя{" "}
            <Notation>{"if"}</Notation>, циклом, списком, функцией, по файлу.
            Последний шаг — программа, которую можно отдать другому человеку:
            она читает любой файл с числами, печатает отчёт, а на испорченном
            файле объясняет, что не так.{" "}
            <strong>
              Законченная программа начинается с договорённости о входе и выходе
              и собирается из знакомых частей: чтение, вычисление, вывод и
              обработка ожидаемых ошибок
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Читать она будет знакомый <Notation>{"numbers.txt"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"5\n-2\n10\n7"}
            label={"Строки файла numbers.txt"}
            language="text"
            fileName="numbers.txt"
          />
          <Typography.Text>
            В отчёте — количество, сумма, минимум, максимум и среднее. Так же
            устроено решение задачи экзамена с файлом: прочитать, посчитать,
            вывести.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Договорённость",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала договариваются, что программа принимает и что делает в
              спорных случаях.
            </strong>{" "}
            Код пишут потом — по этим пунктам:
          </Typography.Text>
          <ul>
            <li>
              вход — текстовый файл, по одному целому числу на строке, без
              заголовка; числа могут быть отрицательными;
            </li>
            <li>
              путь к файлу передают при запуске; если его не передали, читается{" "}
              <Notation>{"numbers.txt"}</Notation> в рабочей папке;
            </li>
            <li>
              выход — количество, сумма, минимум, максимум и среднее с тремя
              знаками после точки;
            </li>
            <li>
              пустой файл разрешён: минимум, максимум и среднее для него не
              определены, и программа так и пишет;
            </li>
            <li>
              строка, которая не число, — ошибка формата: программа называет её
              номер и не считает ничего.
            </li>
          </ul>
          <Typography.Text>
            Каждый пункт потом станет проверочным случаем: обычный файл, пустой,
            без файла, с испорченной строкой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Чтение файла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Программа делится на три функции, и данные идут через них по
              очереди.
            </strong>{" "}
            <Notation>{"read_numbers"}</Notation> отвечает за формат файла,{" "}
            <Notation>{"summarize"}</Notation> — за вычисление,{" "}
            <Notation>{"main"}</Notation> — за запуск и вывод, как в уроке о
            частях программы:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.programFlow}
            caption={
              <>
                Каждая функция получает готовое от предыдущей. Если файл не
                прочитан, данные до <Notation>{"summarize"}</Notation> не
                доходят: сообщение уходит в поток ошибок, программа завершается
                с кодом 1.
              </>
            }
          />
          <Typography.Text>
            Первая функция читает файл и превращает строки в список чисел:
          </Typography.Text>
          <CodeBlock
            code={
              'def read_numbers(path):\n    numbers = []\n    with open(path, encoding="utf-8") as file:\n        for line_number, line in enumerate(file, start=1):\n            try:\n                number = int(line)\n            except ValueError as error:\n                raise ValueError(\n                    f"Строка {line_number}: ожидалось целое число"\n                ) from error\n            numbers.append(number)\n    return numbers'
            }
            label={"Функция read_numbers"}
            collapsible={false}
            language="python"
            fileName="analyze_numbers.py"
          />
          <Typography.Text>
            Цикл по файлу и <Notation>{"enumerate(…, start=1)"}</Notation> — из
            уроков о файлах и кортежах: <Notation>{"line_number"}</Notation>{" "}
            считает строки с единицы, как их видит человек. Новое здесь — две
            записи в обработке ошибки.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"except ValueError as error"}</Notation> даёт пойманному
            исключению имя <Notation>{"error"}</Notation>, чтобы с ним можно
            было работать дальше. <Notation>{"raise … from error"}</Notation>{" "}
            создаёт новое исключение с понятным текстом — номером строки — и
            сохраняет исходное как причину. Вместо{" "}
            <Notation>
              {"invalid literal for int() with base 10: 'abc\\n'"}
            </Notation>{" "}
            пользователь увидит «Строка 2: ожидалось целое число».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Вычисление и запуск",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"summarize"}</Notation> считает отчёт по готовому
              списку, <Notation>{"main"}</Notation> связывает части и печатает.
            </strong>{" "}
            Отчёт — словарь из урока о словарях: у каждого числа своё имя.
          </Typography.Text>
          <CodeBlock
            code={
              'def summarize(numbers):\n    if not numbers:\n        return {\n            "count": 0,\n            "total": 0,\n            "minimum": None,\n            "maximum": None,\n            "average": None,\n        }\n    total = sum(numbers)\n    return {\n        "count": len(numbers),\n        "total": total,\n        "minimum": min(numbers),\n        "maximum": max(numbers),\n        "average": total / len(numbers),\n    }'
            }
            label={"Функция summarize"}
            collapsible={false}
            language="python"
            fileName="analyze_numbers.py"
          />
          <Typography.Text>
            Для пустого списка <Notation>{"min"}</Notation> и{" "}
            <Notation>{"max"}</Notation> упали бы с ошибкой, поэтому функция
            заранее возвращает <Notation>{"None"}</Notation> там, где ответа
            нет, — так записано в договорённости. Функция не знает о файле: её
            можно проверить на любом списке.
          </Typography.Text>
          <CodeBlock
            code={
              'def main():\n    if len(sys.argv) > 2:\n        print(\n            "Использование: python analyze_numbers.py [путь]",\n            file=sys.stderr,\n        )\n        return 2\n    if len(sys.argv) == 2:\n        path = Path(sys.argv[1])\n    else:\n        path = Path("numbers.txt")\n    try:\n        numbers = read_numbers(path)\n    except (OSError, ValueError) as error:\n        print(\n            f"Не удалось прочитать данные: {error}",\n            file=sys.stderr,\n        )\n        return 1\n\n    report = summarize(numbers)\n    print("Количество:", report["count"])\n    print("Сумма:", report["total"])\n    if report["count"] == 0:\n        print(\n            "Файл пуст: минимум, максимум "\n            "и среднее не определены"\n        )\n    else:\n        print("Минимум:", report["minimum"])\n        print("Максимум:", report["maximum"])\n        print(f"Среднее: {report[\'average\']:.3f}")\n    return 0\n\n\nif __name__ == "__main__":\n    raise SystemExit(main())'
            }
            label={"Функция main и запуск"}
            collapsible={false}
            language="python"
            fileName="analyze_numbers.py"
          />
          <Typography.Text>
            В <Notation>{"main"}</Notation> три новые детали запуска из
            терминала.
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"sys.argv"}</Notation> — список строк запуска: первый
              элемент — имя программы, дальше — то, что написали после него. Для{" "}
              <Notation>{"python analyze_numbers.py data.txt"}</Notation> это{" "}
              <Notation>{"['analyze_numbers.py', 'data.txt']"}</Notation>.
            </li>
            <li>
              <Notation>{"file=sys.stderr"}</Notation> печатает сообщение в{" "}
              <strong>поток ошибок</strong> — отдельный от обычного вывода, как
              красный текст ошибки в первом уроке.
            </li>
            <li>
              <Notation>{"return 0"}</Notation>, <Notation>{"1"}</Notation> или{" "}
              <Notation>{"2"}</Notation> — <strong>код завершения</strong>:{" "}
              <Notation>{"raise SystemExit(main())"}</Notation> передаёт его
              системе. 0 значит «успех», другие числа — «что-то не так»; это
              читают программы, которые запускают нашу.
            </li>
          </ul>
          <Typography.Text>
            <Notation>{"OSError"}</Notation> в{" "}
            <Notation>{"except (OSError, ValueError)"}</Notation> — общее имя
            ошибок доступа к файлу, среди них{" "}
            <Notation>{"FileNotFoundError"}</Notation>. Ошибку внутри{" "}
            <Notation>{"summarize"}</Notation> мы не перехватываем: такая ошибка
            — ошибка автора, её надо увидеть, а не спрятать.
          </Typography.Text>
          <Typography.Text>
            Вся программа целиком — сохрани её в{" "}
            <Notation>{"analyze_numbers.py"}</Notation> рядом с{" "}
            <Notation>{"numbers.txt"}</Notation> и запусти:
          </Typography.Text>
          <CodeBlock
            code={
              'import sys\nfrom pathlib import Path\n\n\ndef read_numbers(path):\n    numbers = []\n    with open(path, encoding="utf-8") as file:\n        for line_number, line in enumerate(file, start=1):\n            try:\n                number = int(line)\n            except ValueError as error:\n                raise ValueError(\n                    f"Строка {line_number}: ожидалось целое число"\n                ) from error\n            numbers.append(number)\n    return numbers\n\n\ndef summarize(numbers):\n    if not numbers:\n        return {\n            "count": 0,\n            "total": 0,\n            "minimum": None,\n            "maximum": None,\n            "average": None,\n        }\n    total = sum(numbers)\n    return {\n        "count": len(numbers),\n        "total": total,\n        "minimum": min(numbers),\n        "maximum": max(numbers),\n        "average": total / len(numbers),\n    }\n\n\ndef main():\n    if len(sys.argv) > 2:\n        print(\n            "Использование: python analyze_numbers.py [путь]",\n            file=sys.stderr,\n        )\n        return 2\n    if len(sys.argv) == 2:\n        path = Path(sys.argv[1])\n    else:\n        path = Path("numbers.txt")\n    try:\n        numbers = read_numbers(path)\n    except (OSError, ValueError) as error:\n        print(\n            f"Не удалось прочитать данные: {error}",\n            file=sys.stderr,\n        )\n        return 1\n\n    report = summarize(numbers)\n    print("Количество:", report["count"])\n    print("Сумма:", report["total"])\n    if report["count"] == 0:\n        print(\n            "Файл пуст: минимум, максимум "\n            "и среднее не определены"\n        )\n    else:\n        print("Минимум:", report["minimum"])\n        print("Максимум:", report["maximum"])\n        print(f"Среднее: {report[\'average\']:.3f}")\n    return 0\n\n\nif __name__ == "__main__":\n    raise SystemExit(main())'
            }
            label={"Программа analyze_numbers.py целиком"}
            language="python"
            fileName="analyze_numbers.py"
            output={
              "Количество: 4\nСумма: 20\nМинимум: -2\nМаксимум: 10\nСреднее: 5.000"
            }
          />
          <ProofDisclosure
            summary="Тонкости: неверная кодировка файла"
            kind="nuance"
          >
            <Typography.Text>
              Если файл записан не в UTF-8, чтение вызовет{" "}
              <Notation>{"UnicodeDecodeError"}</Notation>. Это разновидность{" "}
              <Notation>{"ValueError"}</Notation>, поэтому{" "}
              <Notation>{"main"}</Notation> обработает и её.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Проверка программы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Программу проверяют не только на обычном файле, но и на пустом,
              отсутствующем и испорченном.
            </strong>{" "}
            Запуск из терминала с путём к файлу:
          </Typography.Text>
          <TerminalCommand command={"python analyze_numbers.py numbers.txt"} />
          <Typography.Text>
            Повтори его для пустого файла, для файла из одной строки{" "}
            <Notation>{"-5"}</Notation>, для несуществующего{" "}
            <Notation>{"missing.txt"}</Notation> и для{" "}
            <Notation>{"bad.txt"}</Notation> со строками 5,{" "}
            <Notation>{"abc"}</Notation>, 7. Для испорченного файла программа
            должна назвать номер строки, а не пропустить её молча.
          </Typography.Text>
          <Typography.Text>
            Функции можно проверить и без терминала: импортировать их в другой
            файл, как в уроке о частях программы. При импорте{" "}
            <Notation>{"main"}</Notation> не запускается — его защищает{" "}
            <Notation>{'if __name__ == "__main__"'}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'from analyze_numbers import read_numbers, summarize\n\nfor name in ["bad.txt", "missing.txt"]:\n    try:\n        read_numbers(name)\n    except (OSError, ValueError) as error:\n        print(type(error).__name__, error)\nprint(summarize([]))\nprint(summarize([-5])["average"])'
            }
            label={"Проверка функций на испорченном и отсутствующем файлах"}
            language="python"
            fileName="check.py"
            output={
              "ValueError Строка 2: ожидалось целое число\nFileNotFoundError [Errno 2] No such file or directory: 'missing.txt'\n{'count': 0, 'total': 0, 'minimum': None, 'maximum': None, 'average': None}\n-5.0"
            }
          />
          <Typography.Text>
            <Notation>{"type(error).__name__"}</Notation> — имя типа исключения.
            Пустой список даёт отчёт с <Notation>{"None"}</Notation>, а не
            ошибку — так записано в договорённости.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Развитие программы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Программу развивают через новую договорённость, а не случайными
              правками.
            </strong>{" "}
            Каждое изменение сначала записывают пунктом договорённости, затем
            меняют одну функцию и проверяют старые и новые случаи.
          </Typography.Text>
          <ul>
            <li>
              подсчёт чётных чисел — новая строка в{" "}
              <Notation>{"summarize"}</Notation>;
            </li>
            <li>
              заголовок с количеством чисел — правка{" "}
              <Notation>{"read_numbers"}</Notation> и новая ошибка формата;
            </li>
            <li>
              огромный файл — один проход без списка, как в уроке о скорости и
              памяти;
            </li>
            <li>
              отчёт в JSON — новый вывод в <Notation>{"main"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            Список здесь оставлен нарочно: так{" "}
            <Notation>{"summarize"}</Notation> принимает готовые данные и её
            легко проверить. Три из этих улучшений — задачи практики урока.
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
            Что выведет программа для пустого файла?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «Количество: 0», «Сумма: 0» и «Файл пуст: минимум, максимум и
            среднее не определены»; код завершения 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Что выведет программа для файла из одной строки{" "}
            <Notation>{"-5"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Количество 1, сумма −5, минимум и максимум −5, среднее −5.000.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Какое сообщение получит пользователь, если первая строка файла —{" "}
            <Notation>{"abc"}</Notation>? В какой поток оно попадёт?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            «Не удалось прочитать данные: Строка 1: ожидалось целое число» — в
            поток ошибок <Notation>{"sys.stderr"}</Notation>, код завершения 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что содержит <Notation>{"sys.argv"}</Notation> при запуске{" "}
            <Notation>{"python analyze_numbers.py data.txt"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"['analyze_numbers.py', 'data.txt']"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Зачем <Notation>{"summarize"}</Notation> принимает список, а не путь
            к файлу?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Так вычисление проверяется на готовых списках и работает с любым
            источником данных — файлом, вводом, списком в коде.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Сквозная задача стала программой: договорённость, три функции и проверка
        на разных файлах. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Договорённость",
            note: (
              <>
                Вход, выход и спорные случаи — до кода; каждый пункт — будущая
                проверка.
              </>
            ),
          },
          {
            key: "Три функции",
            note: (
              <>
                <Notation>{"read_numbers"}</Notation> — формат,{" "}
                <Notation>{"summarize"}</Notation> — вычисление,{" "}
                <Notation>{"main"}</Notation> — запуск и вывод.
              </>
            ),
          },
          {
            key: <Notation>{"raise … from"}</Notation>,
            note: (
              <>
                Понятное сообщение с номером строки, исходная ошибка — причиной;{" "}
                <Notation>{"as error"}</Notation> даёт ей имя.
              </>
            ),
          },
          {
            key: "Запуск",
            note: (
              <>
                <Notation>{"sys.argv"}</Notation> — аргументы,{" "}
                <Notation>{"sys.stderr"}</Notation> — ошибки, код завершения 0 —
                успех.
              </>
            ),
          },
          {
            key: "Проверка",
            note: (
              <>Обычный, пустой, одна строка, нет файла, испорченная строка.</>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
