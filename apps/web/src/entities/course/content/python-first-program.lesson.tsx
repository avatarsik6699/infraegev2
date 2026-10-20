import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonImage,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
  TerminalCommand,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonFirstProgramLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-first-program.media";

export const pythonFirstProgramLesson = defineCourseLesson({
  ...pythonFirstProgramLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Запустить файл",
    "Отличить выражение от инструкции",
    "Прочитать сообщение об ошибке",
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
            Этот курс рассчитан на начало с нуля. Его цель — научить читать
            программу как последовательность понятных действий, самостоятельно
            строить решения и проверять их. Подготовка к ЕГЭ — одно из
            применений этих знаний. Большая часть примеров относится к обычному
            программированию: обработке текста, чисел, файлов и записей.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Программа — это точная запись действий, и компьютер выполняет
              ровно написанное, а не задуманное
            </strong>
            . На этом держится всё остальное: и чтение чужого кода, и поиск
            ошибок по сообщению Python.
          </Typography.Text>
          <Typography.Text>
            Весь урок построен на одной задаче — стоимости трёх тетрадей по 40
            рублей. Мы запишем её кодом, разберём, из каких частей она состоит,
            а потом намеренно испортим и прочитаем, что ответит Python.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Программа и алгоритм",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Программа описывает действия, которые человек выполняет в уме.
            </strong>{" "}
            Предположим, нужно найти стоимость трёх тетрадей по 40 рублей.
            Человек может сразу получить 120. Для компьютера нужно описать
            действия: взять количество, взять цену, перемножить их, показать
            результат.
          </Typography.Text>
          <Typography.Text>
            <strong>Алгоритм</strong> — точное описание действий для решения
            задачи. <strong>Программа</strong> — запись этих действий на языке,
            который может обрабатывать компьютер. Один алгоритм можно записать
            на Python, C++, Pascal и других языках программирования или сначала
            описать всё словами на естественном языке.
          </Typography.Text>
          <Typography.Text>
            <strong>Исходный код</strong> — это текст программы, записанный на
            языке программирования. Python — это название языка
            программирования. Этим же словом часто называют и программу, которая
            читает и выполняет код на Python; точнее её называют{" "}
            <strong>интерпретатором Python</strong>. Интерпретатор — это
            программа, которая разбирает исходный код и выполняет описанные в
            нём действия. Когда ты запускаешь файл с кодом на Python, фактически
            работает интерпретатор Python: он анализирует код и организует его
            выполнение.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: как Python выполняет код"
            kind="nuance"
          >
            <Typography.Text>
              В CPython — обычном Python с python.org — исходный текст сначала
              преобразуется во внутренние инструкции. Для первых программ
              достаточно понимать наблюдаемое поведение; представление
              «компьютер буквально исполняет каждую напечатанную строку по
              очереди» позднее нужно уточнить: условия пропускают блоки, циклы
              повторяют их, функции выполняются при вызове.
            </Typography.Text>
          </ProofDisclosure>
          <LessonDiagram
            {...lessonMedia.programPath}
            caption={
              <>
                Задачу и алгоритм продумывает человек, он же записывает алгоритм
                исходным кодом в файл. Дальше работает компьютер: интерпретатор
                Python читает строки файла по одной, выполняет их и показывает
                результат.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Установка Python",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы запускать программы на своём компьютере, нужны две вещи:
              интерпретатор Python и программа, в которой пишут код.
            </strong>{" "}
            Интерпретатор ставится один раз. Писать код можно в разных
            программах:
          </Typography.Text>
          <ul>
            <li>
              <strong>Редактор кода</strong> — программа для набора и правки
              текста программы.
            </li>
            <li>
              <strong>IDE</strong> (интегрированная среда разработки) —
              редактор, в который встроены запуск программы и поиск ошибок.
            </li>
            <li>
              <strong>PyCharm</strong> — IDE для Python, с которой удобно
              работать весь курс. <strong>IDLE</strong> — простая IDE, которая
              ставится вместе с Python. <strong>VS Code</strong> — популярный
              редактор, которому Python добавляет расширение.
            </li>
          </ul>
          <Typography.Text>
            <strong>Шаг 1. Установи Python</strong> — он нужен при любом выборе
            среды. Покажем на Windows.
          </Typography.Text>
          <LessonImage
            src="/images/lessons/python-first-program/python-org-download.webp"
            width={1280}
            height={607}
            alt="Страница загрузки python.org с кнопкой Download Python install manager"
            caption={
              <>
                Страница python.org/downloads на Windows: жёлтая кнопка
                «Download Python install manager» скачивает установщик.
              </>
            }
          />
          <ol>
            <li>
              Открой{" "}
              <ExternalLink href="https://www.python.org/downloads/">
                python.org/downloads
              </ExternalLink>{" "}
              и нажми «Download Python install manager». Это установщик Python
              от его разработчиков; его же можно взять в Microsoft Store под
              названием «Python install manager».
            </li>
            <li>Запусти скачанный файл и нажми «Install».</li>
            <li>
              Открой терминал: в меню «Пуск» набери «Терминал» (или «Командная
              строка») и запусти найденную программу.
            </li>
            <li>
              Набери <Notation>{"python"}</Notation> и нажми{" "}
              <KeyCombo keys={["Enter"]} />. При первом запуске установщик сам
              скачает последнюю версию Python, затем появится приглашение{" "}
              <Notation>{">>>"}</Notation>: Python ждёт строку кода (это
              интерактивный режим, о нём — в следующем разделе). Выйти из него
              можно командой <Notation>{"exit()"}</Notation>.
            </li>
            <li>Проверь версию командой:</li>
          </ol>
          <TerminalCommand command={"python --version"} />
          <Typography.Text>
            Ответ вида <Notation>{"Python 3.15.0"}</Notation> означает, что всё
            готово; цифры зависят от версии. На python.org есть и прежний
            отдельный установщик («standalone installer»): если ставишь через
            него, в первом окне отметь «Add python.exe to PATH», иначе команда{" "}
            <Notation>{"python"}</Notation> в терминале не найдётся.
          </Typography.Text>
          <Typography.Text>
            <strong>Шаг 2. Выбери, где писать код.</strong> Мы советуем PyCharm:
            в нём удобно работать весь курс. Остальные варианты тоже подходят —
            выбери вкладку:
          </Typography.Text>
          <LessonTabs
            label="Среда разработки"
            tabs={[
              {
                label: "PyCharm",
                content: (
                  <>
                    <ol>
                      <li>
                        Скачай PyCharm для Windows с{" "}
                        <ExternalLink href="https://www.jetbrains.com/pycharm/download/">
                          jetbrains.com/pycharm
                        </ExternalLink>
                        , запусти установщик и пройди его кнопкой «Next». Для
                        курса хватит бесплатных возможностей PyCharm.
                      </li>
                      <li>
                        Открой PyCharm и выбери «New Project». В поле «Location»
                        укажи папку для программ курса. Установленный Python
                        PyCharm найдёт сам — оставь его и нажми «Create».
                      </li>
                      <li>
                        В панели «Project» слева щёлкни правой кнопкой по папке
                        проекта и выбери «New → Python File». Имя —{" "}
                        <Notation>{"main"}</Notation>, расширение{" "}
                        <Notation>{".py"}</Notation> PyCharm добавит сам.
                      </li>
                      <li>
                        Набери код в открывшемся файле и запусти его:{" "}
                        <KeyCombo keys={["Ctrl", "Shift", "F10"]} /> или правой
                        кнопкой по тексту → «Run 'main'». Вывод появится внизу,
                        в панели «Run».
                      </li>
                    </ol>
                    <LessonImage
                      src="/images/lessons/python-first-program/pycharm-new-python-file.webp"
                      width={1000}
                      height={681}
                      alt="Контекстное меню PyCharm: New, Python File"
                      caption={
                        <>
                          Новый файл в PyCharm: правая кнопка по папке проекта →
                          «New» → «Python File».
                        </>
                      }
                    />
                  </>
                ),
              },
              {
                label: "IDLE",
                content: (
                  <ol>
                    <li>
                      IDLE ставится вместе с Python. В меню «Пуск» набери «IDLE»
                      и открой найденную программу. Откроется окно «IDLE Shell»
                      с приглашением <Notation>{">>>"}</Notation> — это
                      интерактивный режим.
                    </li>
                    <li>
                      Выбери «File → New File»: откроется пустое окно редактора.
                    </li>
                    <li>
                      Набери код и сохрани файл командой «File → Save» или{" "}
                      <KeyCombo keys={["Ctrl", "S"]} />, имя —{" "}
                      <Notation>{"main.py"}</Notation>.
                    </li>
                    <li>
                      Выбери «Run → Run Module» или нажми{" "}
                      <KeyCombo keys={["F5"]} />. Вывод появится в окне «IDLE
                      Shell».
                    </li>
                  </ol>
                ),
              },
              {
                label: "VS Code",
                content: (
                  <ol>
                    <li>
                      Скачай VS Code с{" "}
                      <ExternalLink href="https://code.visualstudio.com/">
                        code.visualstudio.com
                      </ExternalLink>{" "}
                      и установи.
                    </li>
                    <li>
                      Открой раздел расширений —{" "}
                      <KeyCombo keys={["Ctrl", "Shift", "X"]} />, найди «Python»
                      от Microsoft и нажми «Install».
                    </li>
                    <li>
                      Выбери «File → Open Folder» и открой папку для программ.
                      Создай в ней файл <Notation>{"main.py"}</Notation>.
                    </li>
                    <li>
                      Набери код и нажми треугольник «Run Python File» в правом
                      верхнем углу. Вывод появится внизу, в панели «Terminal».
                    </li>
                  </ol>
                ),
              },
            ]}
          />
          <Typography.Text>
            <strong>macOS и Linux.</strong> PyCharm и VS Code ставятся так же, с
            их сайтов. На macOS установщик с python.org ставит и IDLE, а команда
            в терминале называется <Notation>{"python3"}</Notation>. В Linux
            Python обычно уже есть: проверь его командой{" "}
            <Notation>{"python3 --version"}</Notation>; IDLE в Ubuntu и Debian
            ставится пакетом <Notation>{"idle3"}</Notation>. Дальше в курсе
            вместо <Notation>{"python"}</Notation> пиши{" "}
            <Notation>{"python3"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Курс использует Python 3.10 и новее, без сторонних библиотек в
            основных примерах. Перед экзаменом проверь, какая версия стоит на
            твоём компьютере.
          </Typography.Text>
          <Typography.Text>
            <strong>Не получается?</strong> Напиши в наш Telegram-чат{" "}
            <ExternalLink href="https://t.me/kodumka">
              t.me/kodumka
            </ExternalLink>
            : опиши, что делал и что видишь на экране, — поможем разобраться.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2-zapusk",
      navLabel: "Первая программа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Первая программа — это файл с расширением{" "}
              <Notation>{".py"}</Notation>, который запускает интерпретатор.
            </strong>{" "}
            Расширение <Notation>{".py"}</Notation> обозначает исходный файл
            Python. Создай файл <Notation>{"main.py"}</Notation>, запиши в него
            две строки и запусти так, как показано во вкладке твоей среды в
            разделе «Установка Python»:
          </Typography.Text>
          <CodeBlock
            code={'print("Привет!")\nprint(3 * 40)'}
            label={"Первая программа: файл main.py"}
            language="python"
            fileName="main.py"
            output={"Привет!\n120"}
          />
          <Typography.Text>
            <strong>Запуск из терминала</strong> работает без IDE.{" "}
            <strong>Терминал</strong> — окно, принимающее команды операционной
            системы. Проще всего открыть его прямо в PyCharm: вкладка «Terminal»
            внизу окна уже открыта в папке проекта. В отдельном терминале
            сначала перейди в папку с файлом командой{" "}
            <Notation>{"cd"}</Notation> и путём к папке, например{" "}
            <Notation>{"cd C:\\Users\\Anna\\PycharmProjects\\kurs"}</Notation>.
            Затем выполни:
          </Typography.Text>
          <TerminalCommand command={"python main.py"} />
          <Typography.Text>
            Если набрать в терминале просто <Notation>{"python"}</Notation>,
            откроется <strong>интерактивный режим</strong> с приглашением{" "}
            <Notation>{">>>"}</Notation>: каждая введённая строка выполняется
            сразу, и её результат виден ниже. Это удобно, чтобы проверить одну
            строку, но программа в файле так не сохраняется. В интерактивный
            режим вводят Python-код, а не команду{" "}
            <Notation>{"python main.py"}</Notation>. Само приглашение{" "}
            <Notation>{">>>"}</Notation> в файл копировать не надо.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tools}
            caption={
              <>
                В редакторе программу пишут и сохраняют, в терминале командой
                запускают весь файл, а в интерактивном режиме вводят код по
                одной строке и сразу видят ответ.
              </>
            }
          />
          <Typography.Text>
            <Notation>{"print"}</Notation> — готовая функция вывода. Пока считай
            функцию именованным действием, которому можно передать данные.
            Скобки после имени означают <strong>вызов</strong>: просьбу
            выполнить это действие. Переданные внутри скобок данные называются{" "}
            <strong>аргументами</strong>. В первом вызове передаётся текст, во
            втором — результат умножения. Строки программы выполняются сверху
            вниз, поэтому «Привет!» напечатано раньше числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Как работать с кодом",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код в уроке мало прочитать — его запускают и меняют.
            </strong>{" "}
            У чтения кода и написания кода разные задачи. Когда читаешь, нужно
            понимать, что делает каждая строка. Когда пишешь, сначала объясни
            будущие действия по-русски. Проверяй не только совпадение ответа, но
            и своё понимание причин.
          </Typography.Text>
          <Typography.Text>
            С каждым блоком кода в уроке полезно пройти один и тот же круг из
            четырёх шагов:
          </Typography.Text>
          <ol>
            <li>
              <strong>Написать.</strong> Перепиши код в свой файл — руками, а не
              копированием: так замечаешь каждый знак.
            </li>
            <li>
              <strong>Запустить</strong> файл и посмотреть, что он напечатал.
            </li>
            <li>
              <strong>Сравнить</strong> напечатанное с выводом под кодом в
              уроке. Если не совпало, ищи, чем твой код отличается.
            </li>
            <li>
              <strong>Объяснить</strong>, почему вывод именно такой. Затем
              измени одну деталь — например, число 40 на 50 — предскажи новый
              вывод и пройди круг снова.
            </li>
          </ol>
          <LessonDiagram
            {...lessonMedia.codeLoop_3bc437}
            caption={
              <>
                Главное звено круга — сравнение: вывод сверяют с тем, что
                ожидали получить. Совпадение без объяснения ещё не понимание,
                поэтому круг замыкается на вопросе «почему».
              </>
            }
          />
          <Typography.Text>
            <strong>Как читать блок кода.</strong> В шапке блока — условное имя
            файла, ниже — сам код, под ним «Вывод»: всё, что программа покажет
            на экране, строка в строку. Сообщение об ошибке в выводе выделено
            красным. Строки после знака <Notation>{"#"}</Notation> — пояснения,
            не команды.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeBlockAnatomy_3bc437}
            caption={
              <>
                Так устроен каждый блок кода в курсе: имя файла, код с
                пояснениями после <Notation>{"#"}</Notation>, вывод программы и,
                если она остановилась, сообщение об ошибке красным. На схеме
                показана только последняя строка сообщения; полное сообщение
                разберём в разделе «Как читать traceback».
              </>
            }
          />
          <Typography.Text>
            Команды для терминала показаны отдельно — строкой со знаком{" "}
            <Notation>{">"}</Notation>, а не блоком кода: их вводят в терминале,
            а не пишут в файл <Notation>{".py"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>Критерий понимания.</strong> Недостаточно знать, что
            программа «что-то считает». Нужно уметь сказать, что делает каждая
            строка, какое значение получается на каждом шаге и почему вывод
            именно такой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Выражение и инструкция",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Выражение вычисляет значение, инструкция — целая строка программы,
              которая выполняется.
            </strong>{" "}
            <strong>Выражение</strong> — запись, у которой есть значение:{" "}
            <Notation>{"3 * 40"}</Notation> (значение 120),{" "}
            <Notation>{"2 + 5"}</Notation> (7),{" "}
            <Notation>{'"Привет!"'}</Notation> (текст).{" "}
            <strong>Инструкция</strong> — то, что Python выполняет как отдельный
            шаг программы, обычно одна строка.{" "}
            <Notation>{"print(3 * 40)"}</Notation> — инструкция: она вычисляет
            выражение <Notation>{"3 * 40"}</Notation> и выводит его значение.
            Строка <Notation>{"3 * 40"}</Notation> без{" "}
            <Notation>{"print"}</Notation> — тоже инструкция, но она только
            вычисляет значение и ничего с ним не делает. Другие виды инструкций
            — присваивание, условие, цикл — появятся в следующих уроках.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: выражение внутри инструкции"
            kind="nuance"
          >
            <Typography.Text>
              Строго говоря, вызов <Notation>{"print(3 * 40)"}</Notation> — тоже
              выражение: у него есть значение, специальное{" "}
              <Notation>{"None"}</Notation>, «ничего». Строка с одним выражением
              становится инструкцией-выражением. Для первых программ важно
              другое: значение видно на экране, только если его передали в{" "}
              <Notation>{"print"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            В интерактивном режиме результат введённого выражения обычно
            показывается автоматически. В файле строка{" "}
            <Notation>{"3 * 40"}</Notation> сама по себе ничего не напечатает.
            Чтобы увидеть результат, используй{" "}
            <Notation>{"print(3 * 40)"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={'3 * 40\nprint(3 * 40)\nprint("3 * 40")'}
            label={"Чтобы увидеть результат, используй print(3 * 40)"}
            language="python"
            fileName="main.py"
            output={"120\n3 * 40"}
          />
          <Typography.Text>
            Первая строка вычислила 120, но результат никуда не попал. Вторая
            передала то же значение в <Notation>{"print"}</Notation>. Третья
            напечатала текст: кавычки превращают запись в текстовые данные, и
            Python не вычисляет арифметику внутри обычной строки.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exprFate}
            caption={
              <>
                Оба выражения вычисляют 120, но на экран значение попадает,
                только если его передали в <Notation>{"print"}</Notation>.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Три вида ошибок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Программа не догадывается о намерениях.</strong> Python
            различает <Notation>{"print"}</Notation> и{" "}
            <Notation>{"Print"}</Notation>: для него это разные имена.
            Пропущенная кавычка или скобка, неверный знак могут изменить смысл
            либо сделать запись недопустимой. Правила допустимой записи
            называются <strong>синтаксисом</strong>. Если правила записи
            соблюдены, это ещё не доказывает, что решена нужная задача.
          </Typography.Text>
          <Typography.Text>
            Испортим программу о тетрадях тремя способами и посмотрим, что
            ответит Python. Здесь пропущена закрывающая скобка:
          </Typography.Text>
          <CodeBlock
            code={"print(3 * 40"}
            label={"Здесь пропущена закрывающая скобка"}
            language="python"
            fileName="main.py"
            error={"SyntaxError: '(' was never closed"}
          />
          <Typography.Text>
            Здесь переставлены буквы в имени функции:
          </Typography.Text>
          <CodeBlock
            code={"pritn(3 * 40)"}
            label={"Здесь переставлены буквы в имени функции"}
            language="python"
            fileName="main.py"
            error={
              "NameError: name 'pritn' is not defined. Did you mean: 'print'?"
            }
          />
          <Typography.Text>
            А здесь всё записано верно, но вместо умножения стоит сложение:
          </Typography.Text>
          <CodeBlock
            code={"print(3 + 40)"}
            label={
              "А здесь всё записано верно, но вместо умножения стоит сложение"
            }
            language="python"
            fileName="main.py"
            output={"43"}
          />
          <Typography.Text>
            Это три разные проблемы. <strong>Синтаксическая ошибка</strong>{" "}
            означает, что запись нельзя корректно разобрать: не закрыта кавычка
            или скобка. <strong>Исключение при выполнении</strong> означает, что
            очередная операция не может завершиться обычным образом: например,
            вызвать функцию с неизвестным именем или разделить на ноль.{" "}
            <strong>Логическая ошибка</strong> означает, что программа
            выполняется, но вычисляет не то, что требуется. О ней Python не
            сообщает вовсе: 43 выглядит как обычное число, и только сверка с
            ручным расчётом показывает, что ответ неверен.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.errorStages}
            caption={
              <>
                Три ошибки обнаруживаются на разных этапах. Синтаксическую
                Python находит, ещё когда разбирает запись, до выполнения.
                Исключение возникает на той строке, где выполнение споткнулось.
                Логическую ошибку видно только при сверке ответа.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Как читать traceback",
      explanation: (
        <>
          <Typography.Text>
            <strong>Сообщение об ошибке читают с последней строки.</strong>{" "}
            Когда программа останавливается, Python печатает{" "}
            <strong>traceback</strong> — сообщение с цепочкой мест, через
            которые выполнение дошло до ошибки. Начни с последней строки: там
            тип и пояснение. Над ней — строка вида{" "}
            <Notation>{'File "main.py", line 2'}</Notation>: она называет файл и
            номер строки, на которой выполнение остановилось. Открой эту строку
            своего файла и посмотри, какая её часть не может выполниться.
            Синтаксическая ошибка иногда указывает на строку ниже настоящей
            причины: если скобка не закрыта, Python замечает это только на
            следующей строке.
          </Typography.Text>
          <Typography.Text>
            Вот полное сообщение для программы, которая делит стоимость на ноль:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runZeroDivision}
            label={
              "Вот полное сообщение для программы, которая делит стоимость на ноль"
            }
          />
          <Typography.Text>
            Первая строка программы успела выполниться: 120 напечатано.
            Последняя строка сообщения называет тип ошибки{" "}
            <Notation>{"ZeroDivisionError"}</Notation> и пояснение «деление на
            ноль». Строка <Notation>{'File "main.py", line 2'}</Notation>{" "}
            указывает место: вторая строка файла. Значки{" "}
            <Notation>{"~"}</Notation> и <Notation>{"^"}</Notation> в новых
            версиях Python подчёркивают виновную часть выражения.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.traceback}
            caption={
              <>
                Сообщение читают снизу вверх: сначала тип и пояснение, затем
                файл и номер строки, затем саму строку программы.
              </>
            }
          />
          <Typography.Text>
            В шапке этого блока кода справа есть кнопка «Запуск». Она выполняет
            программу по одной строке: подсвечивает строку, которая только что
            выполнилась, объясняет её, показывает переменные и всё, что уже
            выведено. Здесь на втором шаге видно, где программа остановилась и
            что первая строка успела напечатать. Такая кнопка есть у блоков кода
            курса, где важен порядок выполнения строк.
          </Typography.Text>
          <Typography.Text>
            Тип ошибки подсказывает, где искать причину.{" "}
            <Notation>{"SyntaxError"}</Notation> и его родственник{" "}
            <Notation>{"IndentationError"}</Notation> (лишние пробелы в начале
            строки) появляются ещё при разборе записи: проверь скобки, кавычки и
            отступы. <Notation>{"NameError"}</Notation> и{" "}
            <Notation>{"ZeroDivisionError"}</Notation> появляются при
            выполнении: в первом случае имя написано с опечаткой или ещё не
            создано, во втором делитель оказался нулём. Другие типы ошибок
            появятся вместе с конструкциями, которые их вызывают: неподходящее
            значение при преобразовании текста в число, несуществующая позиция
            строки или ключ словаря, отсутствующий файл.
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
            Напиши программу, выводящую своё имя, затем результат{" "}
            <Notation>{"12 + 8"}</Notation>, затем текст{" "}
            <Notation>{"12 + 8"}</Notation>. Объясни разницу двух последних
            строк.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Например, <Notation>{'print("Анна")'}</Notation>,{" "}
            <Notation>{"print(12 + 8)"}</Notation>,{" "}
            <Notation>{'print("12 + 8")'}</Notation>; вывод: Анна, 20, 12 + 8.
            Без кавычек выражение вычисляется, в кавычках печатается как текст.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Программа <Notation>{"print(5 * 23"}</Notation> остановилась с
            ошибкой. Какой у неё тип и как исправить запись?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"SyntaxError: '(' was never closed"}</Notation> — не
            закрыта скобка; верно <Notation>{"print(5 * 23)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Какую ошибку выдаст <Notation>{"Print(5 * 23)"}</Notation> и почему,
            хотя <Notation>{"print"}</Notation> написан «почти правильно»?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"NameError"}</Notation>: имени{" "}
            <Notation>{"Print"}</Notation> нет, Python различает заглавные и
            строчные буквы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Нужно напечатать стоимость трёх тетрадей по 40 рублей и двух ручек
            по 15 рублей. Программа{" "}
            <Notation>{"print(3 * 40 + 2 + 15)"}</Notation> работает без
            сообщений об ошибке. Что она выводит и к какому виду относится её
            ошибка?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Выводит 137 — это логическая ошибка: вместо{" "}
            <Notation>{"2 * 15"}</Notation> записано{" "}
            <Notation>{"2 + 15"}</Notation>; верная стоимость 150.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Программа из двух строк <Notation>{"print(4 * 25)"}</Notation> и{" "}
            <Notation>{"print(100 / 0)"}</Notation> остановилась. Что успело
            напечататься и что будет в последней строке сообщения?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Успело напечататься 100; последняя строка —{" "}
            <Notation>{"ZeroDivisionError: division by zero"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        За урок задача о тетрадях прошла весь путь: от действий в уме до файла,
        который выполняет Python, и до сообщений, которыми Python отвечает на
        ошибки. Вот что из этого понадобится в каждом следующем уроке.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Программа",
            note: (
              <>
                Точная запись алгоритма на языке программирования. Компьютер
                выполняет ровно написанное, а не задуманное.
              </>
            ),
          },
          {
            key: "Интерпретатор Python",
            note: (
              <>
                Программа, которая читает исходный код и выполняет его строки
                сверху вниз.
              </>
            ),
          },
          {
            key: "Где писать и запускать",
            note: (
              <>
                Код пишут в IDE или редакторе (PyCharm, IDLE, VS Code) и
                сохраняют в файл <Notation>{".py"}</Notation>. Запускают кнопкой
                в IDE или командой <Notation>{"python main.py"}</Notation> в
                терминале. После <Notation>{">>>"}</Notation> строки выполняются
                по одной.
              </>
            ),
          },
          {
            key: "Как работать с кодом",
            note: (
              <>
                Запусти, сравни вывод с ожидаемым, измени одну деталь и запусти
                снова.
              </>
            ),
          },
          {
            key: <Notation>{"print(3 * 40)"}</Notation>,
            note: (
              <>
                Выражение <Notation>{"3 * 40"}</Notation> вычисляет значение, но
                в файле его видно, только если передать его в{" "}
                <Notation>{"print"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{'"3 * 40"'}</Notation>,
            note: <>Кавычки делают запись текстом: он печатается как есть.</>,
          },
          {
            key: "Три вида ошибок",
            note: (
              <>
                Синтаксическую Python находит до запуска, исключение — на
                строке, где выполнение споткнулось. Логическую видно только при
                сверке ответа: о ней Python не сообщает.
              </>
            ),
          },
          {
            key: "Traceback",
            note: (
              <>
                Читают снизу вверх: последняя строка — тип ошибки и пояснение,
                выше — файл и номер строки, ещё выше — сама строка кода.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
