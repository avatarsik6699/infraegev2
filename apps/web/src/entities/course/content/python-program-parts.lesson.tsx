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
import { pythonProgramPartsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-program-parts.media";

export const pythonProgramPartsLesson = defineCourseLesson({
  ...pythonProgramPartsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Import", "Свой модуль", "Разделение программы"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Наибольший общий делитель, точный квадратный корень, округление
            вверх — писать такие функции самому каждый раз незачем: они уже
            написаны и лежат в стандартной поставке Python.{" "}
            <strong>
              Готовые функции лежат в модулях, и <Notation>{"import"}</Notation>{" "}
              делает их доступными в программе
            </strong>
            . Модуль — это файл с такими же определениями, как в двух прошлых
            уроках, и свой код тоже удобно делить на части.
          </Typography.Text>
          <Typography.Text>
            Начнём с модуля <Notation>{"math"}</Notation> и наибольшего общего
            делителя 18 и 24.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Модули и import",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Модуль — файл с готовыми определениями;{" "}
              <Notation>{"import"}</Notation> подключает его по имени.
            </strong>{" "}
            Модули, которые приходят вместе с Python, составляют{" "}
            <strong>стандартную библиотеку</strong>; другие библиотеки ставят
            отдельно.
          </Typography.Text>
          <CodeBlock
            code={
              "import math\n\nprint(math.isqrt(50))\nprint(math.gcd(18, 24))"
            }
            label={"isqrt и gcd из math"}
            language="python"
            fileName="main.py"
            output={"7\n6"}
          />
          <Typography.Text>
            <Notation>{"import math"}</Notation> делает доступным имя модуля.
            Точка выбирает средство внутри него. <Notation>{"isqrt"}</Notation>{" "}
            возвращает точную целую часть квадратного корня неотрицательного
            целого: 7² = 49 не больше 50, а 8² = 64 уже больше.{" "}
            <Notation>{"gcd"}</Notation> находит наибольший общий делитель.
          </Typography.Text>
          <Typography.Text>Другая форма импорта:</Typography.Text>
          <CodeBlock
            code={"from math import isqrt\nprint(isqrt(50))"}
            label={"Другая форма импорта"}
            language="python"
            fileName="main.py"
            output={"7"}
          />
          <Typography.Text>
            Теперь в текущую область добавлено непосредственно имя{" "}
            <Notation>{"isqrt"}</Notation>. Запись{" "}
            <Notation>{"import math as m"}</Notation> задаёт короткое имя{" "}
            <Notation>{"m"}</Notation>. Обычно избегай{" "}
            <Notation>{"from module import *"}</Notation>: становится труднее
            понимать происхождение имён и конфликты.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.importNames}
            caption={
              <>
                <Notation>{"import math"}</Notation> даёт программе одно имя —
                модуль целиком, поэтому функции зовут через точку:{" "}
                <Notation>{"math.isqrt"}</Notation>.{" "}
                <Notation>{"from math import isqrt"}</Notation> берёт из модуля
                одно имя, и его зовут напрямую.
              </>
            }
          />
          <Typography.Text>
            В <Notation>{"math"}</Notation> есть и округления, и точное сложение
            дробных чисел. <Notation>{"floor"}</Notation> округляет вниз,{" "}
            <Notation>{"ceil"}</Notation> — вверх; <Notation>{"fsum"}</Notation>{" "}
            складывает дробные числа, не накапливая погрешность:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import ceil, floor, fsum\n\nprint(floor(-2.5), ceil(-2.5))\ntotal = 0\nfor _ in range(10):\n    total += 0.1\nprint(total, fsum([0.1] * 10))"
            }
            label={"floor, ceil и fsum"}
            language="python"
            fileName="main.py"
            output={"-3 -2\n0.9999999999999999 1.0"}
          />
          <Typography.Text>
            Цикл-накопитель десять раз прибавлял приближённое 0.1, и погрешности
            сложились. <Notation>{"fsum"}</Notation> учитывает их и даёт 1.0.
          </Typography.Text>
          <Typography.Text>
            Не называй свой файл <Notation>{"math.py"}</Notation>,{" "}
            <Notation>{"random.py"}</Notation> или{" "}
            <Notation>{"json.py"}</Notation>, если собираешься импортировать
            одноимённый стандартный модуль: локальный файл может его заслонить.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Свой модуль",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Свой модуль — это обычный файл; условие{" "}
              <Notation>{'__name__ == "__main__"'}</Notation> отделяет запуск от
              импорта.
            </strong>{" "}
            Файл <Notation>{"calculations.py"}</Notation> может содержать:
          </Typography.Text>
          <CodeBlock
            code={"def square(number):\n    return number * number"}
            label={"Файл calculations.py может содержать"}
            language="python"
            fileName="main.py"
          />
          <Typography.Text>
            В соседнем <Notation>{"main.py"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              'from calculations import square\n\ndef main():\n    print(square(7))\n\nif __name__ == "__main__":\n    main()'
            }
            label={"В соседнем main.py"}
            language="python"
            fileName="main.py"
          />
          <Typography.Text>
            При обычном прямом запуске файла его специальное имя{" "}
            <Notation>{"__name__"}</Notation> равно{" "}
            <Notation>{'"__main__"'}</Notation>. При импорте оно обычно равно
            имени модуля. Поэтому условие позволяет отделить использование
            определений от запуска пользовательского сценария: запуск{" "}
            <Notation>{"main.py"}</Notation> напечатает 49, а импорт{" "}
            <Notation>{"main"}</Notation> из другого файла ничего не напечатает.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.nameMain}
            caption={
              <>
                Один и тот же файл <Notation>{"calculations.py"}</Notation>.
                Запущенный напрямую, он видит{" "}
                <Notation>{'__name__ == "__main__"'}</Notation> и выполняет блок
                под условием. Импортированный — видит своё имя модуля, и блок
                пропускается.
              </>
            }
          />
          <ProofDisclosure
            summary="Тонкости: что выполняется при импорте и что такое пакет"
            kind="nuance"
          >
            <Typography.Text>
              При первом импорте выполняется весь код модуля без отступа;
              повторный импорт берёт уже загруженный модуль. Поэтому{" "}
              <Notation>{"input()"}</Notation> на верхнем уровне модуля может
              остановить даже импорт. Связанные модули объединяют в{" "}
              <strong>пакет</strong> — папку с файлом{" "}
              <Notation>{"__init__.py"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Сторонние пакеты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сторонние пакеты ставят в виртуальную среду проекта.
            </strong>{" "}
            <strong>Зависимость</strong> — библиотека, которую использует
            проект. <strong>Виртуальная среда</strong> хранит отдельный набор
            установленных пакетов для проекта, чтобы разные проекты не мешали
            друг другу версиями. Она не является защитной песочницей для
            недоверенного кода.
          </Typography.Text>
          <Typography.Text>
            Для примеров этого курса дополнительные пакеты не нужны, поэтому
            команды — в свёрнутом блоке.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: виртуальная среда и pip"
            kind="nuance"
          >
            <Typography.Text>Команды терминала:</Typography.Text>
            <TerminalCommand command={"python -m venv .venv"} />
            <Typography.Text>
              <Notation>{"-m"}</Notation> запускает модуль как программу. Здесь
              стандартный <Notation>{"venv"}</Notation> создаёт папку окружения.
              Можно использовать интерпретатор из неё напрямую, без активации:
            </Typography.Text>
            <TerminalCommand
              system={"Windows"}
              command={".venv\\Scripts\\python -m pip --version"}
            />
            <TerminalCommand
              system={"Linux и macOS"}
              command={".venv/bin/python -m pip --version"}
            />
            <Typography.Text>
              <Notation>{"pip"}</Notation> управляет установкой пакетов. Общая
              форма установки —{" "}
              <Notation>{"python -m pip install имя_пакета"}</Notation>,
              выполненная нужным интерпретатором. Важна связь: пакет установлен
              в конкретное окружение, а не «во все Python на компьютере».
            </Typography.Text>
            <Typography.Text>
              Зависимости проекта можно перечислить с версиями в{" "}
              <Notation>{"requirements.txt"}</Notation>, а устанавливать
              командой{" "}
              <Notation>{"python -m pip install -r requirements.txt"}</Notation>
              . Для распространяемых современных проектов метаданные часто
              задаются в <Notation>{"pyproject.toml"}</Notation>; подробная
              упаковка — отдельный следующий этап.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Деление программы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Даже небольшую программу полезно делить на чтение, вычисление и
              вывод.
            </strong>{" "}
            Удобно отделять чтение данных, вычисление ответа и вывод. Тогда
            вычисляющую функцию можно проверять на обычных списках без
            подготовки файлов. Не нужно создавать десятки модулей ради десяти
            строк: разделяй по реальным самостоятельным задачам.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.programSplit}
            caption={
              <>
                Вычисление — отдельная функция: её можно вызвать с готовыми
                числами и сравнить ответ, не вводя данных и не читая вывод.
              </>
            }
          />
          <CodeBlock
            code={
              'def count_multiples(a, b, d):\n    count = 0\n    for n in range(a, b + 1):\n        if n % d == 0:\n            count += 1\n    return count\n\ndef main():\n    print(count_multiples(1, 100, 7))\n\nif __name__ == "__main__":\n    main()'
            }
            label={"Счётчик кратных функцией"}
            language="python"
            fileName="main.py"
            output={"14"}
          />
          <Typography.Text>
            <Notation>{"count_multiples"}</Notation> — тот же счётчик кратных,
            что в уроке о <Notation>{"for"}</Notation>, только оформленный
            функцией. Она ничего не знает о вводе и выводе: её можно вызвать с
            другими границами или проверить отдельно.
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
            Почему функция <Notation>{"average(numbers)"}</Notation>, которая
            только вычисляет среднее готового списка, удобнее функции, которая
            сама спрашивает путь, читает файл, вычисляет среднее и сразу
            печатает его?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Первую функцию можно использовать с файлом, вводом, готовым списком
            или в другой программе. Её можно проверить вызовом{" "}
            <Notation>{"average([2, 4])"}</Notation>. Во втором варианте
            вычисление жёстко связано с конкретным вводом и выводом, поэтому
            повторное использование и проверка требуют лишних действий.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Как вызвать <Notation>{"isqrt"}</Notation> после{" "}
            <Notation>{"import math"}</Notation> и после{" "}
            <Notation>{"from math import isqrt"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"math.isqrt(n)"}</Notation> и{" "}
            <Notation>{"isqrt(n)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что произойдёт, если назвать свой файл{" "}
            <Notation>{"math.py"}</Notation> и написать в соседнем файле{" "}
            <Notation>{"import math"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Импортируется твой файл вместо стандартного модуля, и нужных функций
            в нём не окажется.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Чему равно <Notation>{"__name__"}</Notation> в файле, который
            запустили напрямую, и в файле, который импортировали под именем{" "}
            <Notation>{"calculations"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'"__main__"'}</Notation> и{" "}
            <Notation>{'"calculations"'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Готовые модули избавляют от лишней работы, а деление на функции делает
        программу проверяемой. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "import",
            note: (
              <>
                <Notation>{"import math"}</Notation> — доступ через{" "}
                <Notation>{"math.имя"}</Notation>;{" "}
                <Notation>{"from math import isqrt"}</Notation> — имя напрямую.
              </>
            ),
          },
          {
            key: "Модуль math",
            note: (
              <>
                <Notation>{"math.isqrt"}</Notation>,{" "}
                <Notation>{"gcd"}</Notation>, <Notation>{"floor"}</Notation>,{" "}
                <Notation>{"ceil"}</Notation>, <Notation>{"fsum"}</Notation> —
                точные готовые действия с числами.
              </>
            ),
          },
          {
            key: "Имя файла",
            note: <>Свой файл не называют как стандартный модуль.</>,
          },
          {
            key: <Notation>{"__main__"}</Notation>,
            note: (
              <>
                <Notation>{'if __name__ == "__main__":'}</Notation> выполняет
                запуск только при прямом запуске файла.
              </>
            ),
          },
          {
            key: "Части программы",
            note: (
              <>
                Программу делят на чтение, вычисление и вывод; вычисление
                проверяют отдельно.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
