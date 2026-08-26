import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonFirstProgramLessonPublication } from "./course-publication.mjs";

export const pythonFirstProgramLesson = defineCourseLesson({
  ...pythonFirstProgramLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать небольшую программу сверху вниз и объяснять, что делает каждая строка",
    "Хранить значения в переменных и следить, как они меняются",
    "Превращать введённый текст в число перед вычислением",
    "Собирать ввод, вычисление и вывод в одну программу",
    "Запускать файл на своём компьютере и проверять результат на разных данных",
  ],
  practiceTaskIds: pythonFirstProgramLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "program-order",
      navLabel: "Как Python выполняет команды",
      explanation: (
        <>
          <Typography.Text>
            Python выполняет программу строка за строкой: начинает с первой
            команды, затем переходит к следующей. Поэтому порядок строк важен —
            от него зависит, что и когда произойдёт.
          </Typography.Text>
          <CodeBlock
            code={'print("Старт")\nprint(2 + 3)\nprint("Готово")'}
            label="Три команды выполняются сверху вниз"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            В результате мы увидим три строки в том же порядке: слово
            <Notation> Старт</Notation>, число <Notation>5</Notation> и слово
            <Notation> Готово</Notation>. В скобках указано, что нужно передать
            команде <Notation>print</Notation>, а текст записан в кавычках.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Разберём программу по строкам"
          prompt="Идём сверху вниз и после каждой команды отмечаем, что появилось на экране."
          steps={[
            <>
              Первая команда печатает <Notation>Старт</Notation>.
            </>,
            <>
              Во второй строке сначала вычисляется
              <Notation> 2 + 3</Notation>, затем печатается
              <Notation> 5</Notation>.
            </>,
            <>
              Последняя команда печатает <Notation>Готово</Notation>.
            </>,
          ]}
        />
      ),
      checkpoint: [
        {
          id: "checkpoint-order",
          prompt: (
            <>
              Что изменится, если строку <Notation>print("Готово")</Notation>
              поставить первой?
            </>
          ),
          reveal: (
            <>
              Слово <Notation>Готово</Notation> появится первой строкой вывода.
              Остальные команды сохранят свой взаимный порядок.
            </>
          ),
        },
      ],
    },
    {
      id: "values-and-variables",
      navLabel: "Как работают переменные",
      explanation: (
        <>
          <Typography.Text>
            Переменная — это имя, под которым программа хранит значение. В
            строке с присваиванием Python сначала вычисляет выражение справа от
            знака <Notation>=</Notation>, а затем сохраняет результат в
            переменной слева.
          </Typography.Text>
          <CodeBlock
            code={"price = 120\ncount = 3\ntotal = price * count\nprint(total)"}
            label="Вычисление через переменные"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Сначала в <Notation>price</Notation> сохраняется
            <Notation> 120</Notation>, затем в <Notation>count</Notation> —
            <Notation> 3</Notation>. В третьей строке Python умножает эти
            значения и сохраняет <Notation>360</Notation> в
            <Notation> total</Notation>.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="Знак = работает как обычное равенство, поэтому части можно поменять местами."
          explanation={
            <>
              В программе слева от <Notation>=</Notation> должно стоять имя
              переменной, в которую сохраняется результат. Поэтому запись
              <Notation> total = price * count</Notation> работает, а
              <Notation> price * count = total</Notation> приводит к
              синтаксической ошибке.
            </>
          }
        />
      ),
    },
    {
      id: "input-and-conversion",
      navLabel: "Как программа получает число",
      explanation: (
        <>
          <Typography.Text>
            Команда <Notation>input()</Notation> ждёт, пока пользователь что-то
            напечатает и нажмёт Enter. Даже введённые цифры она получает как
            текст. Чтобы считать с ними, этот текст нужно превратить в целое
            число с помощью <Notation>int(...)</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'age_text = input("Сколько вам лет? ")\nage = int(age_text)\nnext_age = age + 1\nprint(next_age)'
            }
            label="Ввод текста и преобразование в число"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Если ввести <Notation>15</Notation>, переменная
            <Notation> age_text</Notation> сначала сохранит текст
            <Notation> '15'</Notation>. Следующая строка превращает его в число
            <Notation> 15</Notation>, и теперь к нему можно прибавить единицу.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="Если через input() ввели цифры, значит программа уже получила число."
          explanation={
            <>
              <Notation>input()</Notation> всегда возвращает текст. Без
              <Notation> int</Notation> выражение
              <Notation> age_text + 1</Notation> пытается сложить текст и число,
              поэтому Python останавливает программу с ошибкой
              <Notation> TypeError</Notation>.
            </>
          }
        />
      ),
      checkpoint: [
        {
          id: "checkpoint-input",
          prompt: (
            <>
              Какое значение хранит <Notation>n</Notation> после строки
              <Notation> n = int(input())</Notation>, если пользователь ввёл 8?
            </>
          ),
          reveal: (
            <>
              Целое число <Notation>8</Notation>: сначала
              <Notation> input()</Notation> возвращает текст
              <Notation> '8'</Notation>, затем <Notation>int</Notation>
              преобразует его.
            </>
          ),
        },
      ],
    },
    {
      id: "calculation-and-output",
      navLabel: "Считаем и выводим результат",
      explanation: (
        <>
          <Typography.Text>
            Для первой программы достаточно четырёх арифметических операций:
            <Notation>+</Notation>, <Notation>−</Notation>,
            <Notation>*</Notation> и <Notation>/</Notation>. Как и в математике,
            умножение и деление выполняются раньше сложения и вычитания. Если
            нужен другой порядок, используйте скобки.
          </Typography.Text>
          <CodeBlock
            code={
              "width = int(input())\nheight = int(input())\nperimeter = 2 * (width + height)\nprint(perimeter)"
            }
            label="Программа вычисляет периметр"
            language="python"
            showLineNumbers
          />
          <Procedure
            title="Собираем программу из четырёх шагов"
            steps={[
              {
                label: "Определите входные данные.",
                detail:
                  "Решите, что пользователь должен ввести и в каком порядке.",
              },
              {
                label: "Получите числа.",
                detail: "Преобразуйте каждый числовой input() через int(...).",
              },
              {
                label: "Посчитайте результат.",
                detail:
                  "Запишите выражение и сохраните результат в понятной переменной.",
              },
              {
                label: "Выведите ответ.",
                detail:
                  "Если задача ждёт число, не добавляйте к нему лишний текст.",
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "run-and-check",
      navLabel: "Запускаем и проверяем программу",
      explanation: (
        <>
          <Typography.Text>
            Сохраните программу в файле с расширением
            <Notation> .py</Notation>. В Windows проверьте установленную версию
            командой <Notation>py --version</Notation>, а в macOS или Linux —
            командой <Notation>python3 --version</Notation>. Для заданий курса
            подойдёт Python 3.12 или любая более новая версия.
          </Typography.Text>
          <CodeBlock
            code={
              "Windows:\npy first_program.py\n\nmacOS или Linux:\npython3 first_program.py"
            }
            label="Запуск сохранённого файла из терминала"
            language="text"
          />
          <Callout tone="idea" title="Лучше запускать Python на компьютере">
            <Typography.Text>
              Скачать Python можно с официальной страницы{" "}
              <ExternalLink href="https://www.python.org/downloads/" newTab>
                python.org
              </ExternalLink>
              . Если у вас установлена IDLE, первую программу можно открыть и
              запустить в ней. Если установить Python пока не получается,
              используйте как временный запасной вариант{" "}
              <ExternalLink
                href="https://www.programiz.com/python-programming/online-compiler/"
                newTab
              >
                Programiz Online Compiler
              </ExternalLink>
              . Это сторонний сайт со своими правилами обработки данных.
              infraege не отправляет туда ваш код.
            </Typography.Text>
          </Callout>
          <Typography.Text>
            Если программа завершилась с ошибкой, начните с последней строки
            сообщения. <Notation>SyntaxError</Notation> обычно означает, что
            команда записана неправильно, <Notation>NameError</Notation> — что
            Python не знает указанное имя, а <Notation>TypeError</Notation> —
            что операция не подходит для этих видов значений.
          </Typography.Text>
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-run",
          prompt:
            "Что проверить первым, если терминал не находит команду запуска Python?",
          reveal: (
            <>
              В Windows попробуйте <Notation>py --version</Notation>, а в macOS
              или Linux — <Notation>python3 --version</Notation>. Если команда
              не найдена, установите Python с официального сайта и заново
              откройте терминал.
            </>
          ),
        },
      ],
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-whole-program",
      prompt: (
        <>
          Из каких четырёх шагов состоит программа, которая получает два числа и
          печатает их сумму?
        </>
      ),
      reveal: (
        <>
          Получить два значения, преобразовать их в числа через
          <Notation> int</Notation>, вычислить сумму и вывести её командой
          <Notation> print</Notation>.
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь вы можете прочитать небольшую программу сверху вниз, объяснить,
        что хранится в каждой переменной, и проверить результат на конкретных
        входных данных.
      </Typography.Text>
      <Typography.Text>
        Следующий блок курса будет про условия — с их помощью программа сможет
        выбирать разные действия. Пока урок готовится, попробуйте запустить свою
        программу с другими числами или вернитесь к заданиям ещё раз.
      </Typography.Text>
    </>
  ),
});
