import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  RangeSandbox,
  VariantPicker,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonStringsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-strings.media";

export const pythonStringsLesson = defineCourseLesson({
  ...pythonStringsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Индексы", "Срезы", "Методы", "Подсчёт с перекрытием"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Программы постоянно работают с текстом: имя, слово, запись числа,
            строка из файла. В задачах ЕГЭ часто нужно найти в длинной строке
            символ, кусок или повтор.{" "}
            <strong>
              Python берёт из строки символ по номеру, кусок по срезу и строит
              из старой строки новую
            </strong>
            . Срезы устроены как <Notation>{"range"}</Notation> из прошлого
            урока: начало включено, граница нет.
          </Typography.Text>
          <Typography.Text>
            Индексы и срезы покажем на строках <Notation>{'"PYTHON"'}</Notation>{" "}
            и <Notation>{'"ABCDEFG"'}</Notation>, а потом соберём новую строку
            из символов старой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Длина и индексы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              У строки есть длина и элементы, пронумерованные с нуля.
            </strong>{" "}
            Порядок символов важен: <Notation>{'"кот"'}</Notation> и{" "}
            <Notation>{'"ток"'}</Notation> состоят из одинаковых букв, но
            являются разными строками.
          </Typography.Text>
          <CodeBlock
            code={
              'word = "PYTHON"\nprint(len(word))\nprint(word[0])\nprint(word[2])\nprint(word[-1])'
            }
            label={"Длина и индексы строки"}
            language="python"
            fileName="main.py"
            output={"6\nP\nT\nN"}
          />
          <Typography.Text>
            <Notation>{"len"}</Notation> получает количество элементов.{" "}
            <strong>Индекс</strong> — номер позиции. Положительные индексы
            начинаются с 0: это удобно понимать как число шагов от начала. Для
            строки длины <Notation>{"n"}</Notation> допустимы индексы от 0 до{" "}
            <Notation>{"n - 1"}</Notation>. Отрицательные индексы считают с
            конца: −1 — последний элемент, −2 — предпоследний.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.slicePYTHON_0_0}
            caption={
              <>
                Над буквой — индекс от начала, под ней — с конца. У последней
                буквы N индексы 5 и −1.
              </>
            }
          />
          <Typography.Text>
            Обращение к <Notation>{"word[6]"}</Notation> вызывает ошибку: такой
            позиции нет.
          </Typography.Text>
          <CodeBlock
            code={'word = "PYTHON"\nprint(word[6])'}
            label={"Обращение к word[6] вызывает ошибку: такой позиции нет"}
            language="python"
            fileName="main.py"
            error={"IndexError: string index out of range"}
          />
          <Typography.Text>
            У пустой строки <Notation>{'""'}</Notation> длина 0, поэтому в ней
            нет даже элемента с индексом 0. Отдельного встроенного типа «символ»
            в Python нет: <Notation>{"word[0]"}</Notation> тоже строка, просто
            длины 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Срезы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Срез берёт элементы от начала до остановки, не включая её.
            </strong>{" "}
            <strong>Срез</strong> получает последовательность элементов по
            правилу <Notation>{"s[start:stop:step]"}</Notation>. Остановка не
            включается, как в <Notation>{"range"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              's = "ABCDEFG"\nprint(s[1:4])\nprint(s[:3])\nprint(s[4:])\nprint(s[::2])\nprint(s[::-1])\nprint(s[5:1:-1])'
            }
            label={"Остановка не включается, как в range"}
            language="python"
            fileName="main.py"
            output={"BCD\nABC\nEFG\nACEG\nGFEDCBA\nFEDC"}
          />
          <LessonDiagram
            {...lessonMedia.sliceABCDEFG_1_4}
            caption={
              <>
                Границы среза стоят между символами: start = 1 перед B, stop = 4
                перед E. Поэтому E в срез не входит, а длина среза 4 − 1 = 3.
              </>
            }
          />
          <Typography.Text>
            <Notation>{"s[1:4]"}</Notation> берёт индексы 1, 2, 3 — ровно как{" "}
            <Notation>{"range(1, 4)"}</Notation>. Для положительного шага
            пропущенное начало означает начало строки, пропущенная остановка —
            её конец. Для отрицательного шага значения по умолчанию меняются:
            движение начинается с конца и идёт до начала. Поэтому{" "}
            <Notation>{"s[::-1]"}</Notation> разворачивает всю строку, а{" "}
            <Notation>{"s[5:1:-1]"}</Notation> идёт от индекса 5 вниз до 2.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.sliceABCDEFG_5_1_1}
            caption={
              <>
                При шаге −1 срез идёт справа налево: от индекса 5 к индексу 2; F
                берётся первой, C — последней, индекс 1 уже не входит.
              </>
            }
          />
          <ProofDisclosure
            summary="Тонкости: пропущенная граница и −1"
            kind="nuance"
          >
            <Typography.Text>
              Пропущенная граница и явно написанное <Notation>{"-1"}</Notation>{" "}
              — не одно и то же. В <Notation>{"s[5:-1:-1]"}</Notation> явное{" "}
              <Notation>{"-1"}</Notation> означает последний индекс, то есть 6:
              движение от 5 назад к 6 не даёт ни одного символа, срез пуст.
              Пропущенная граница при отрицательном шаге означает «до самого
              начала».
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Срез за пределами длины обрезается: <Notation>{"s[:100]"}</Notation>{" "}
            вернёт всю строку. Одиночный неверный индекс вызывает ошибку. Срез
            может быть пустым; это нормальный результат. Шаг 0 недопустим.
          </Typography.Text>
          <Typography.Text>
            Проверь срезы сам. Песочница начинается с{" "}
            <Notation>{"s[::2]"}</Notation> — каждый второй символ. Поле start
            или stop можно оставить пустым, шаг — сделать отрицательным. Номер
            под буквой — очередь, в которой срез её берёт.
          </Typography.Text>
          <RangeSandbox
            mode="slice"
            start={null}
            stop={null}
            step={2}
            text="ABCDEFG"
          />
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Неизменяемость",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строку нельзя изменить на месте — можно только построить новую.
            </strong>{" "}
            <strong>Неизменяемость</strong> означает, что нельзя заменить
            элемент внутри существующей строки:
          </Typography.Text>
          <CodeBlock
            code={'s = "кот"\ns[0] = "р"'}
            label={
              "Неизменяемость означает, что нельзя заменить элемент внутри существующей строки"
            }
            language="python"
            fileName="main.py"
            error={"TypeError: 'str' object does not support item assignment"}
          />
          <Typography.Text>
            Можно построить новую строку и связать с ней имя:
          </Typography.Text>
          <CodeBlock
            code={'s = "кот"\ns = "р" + s[1:]\nprint(s)'}
            label={"Можно построить новую строку и связать с ней имя"}
            language="python"
            fileName="main.py"
            output={"рот"}
          />
          <Typography.Text>
            <Notation>{"+"}</Notation> соединяет строки. Это действие называют{" "}
            <strong>конкатенацией</strong>. <Notation>{'"ab" * 3'}</Notation>{" "}
            повторяет текст и создаёт <Notation>{'"ababab"'}</Notation>. Старая
            строка при этом не меняется: имя просто связывается с новой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3-perebor",
      navLabel: "Перебор и сборка строки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Новую строку собирают по символам: перебирают старую и добавляют
              нужные символы к накопителю.
            </strong>{" "}
            Строку нельзя изменить, но можно построить новую. Уберём из слова
            все буквы «а» — пройди программу по шагам и следи за{" "}
            <Notation>{"result"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runBuild}
            label={"Новую строку собирают по символам"}
          />
          <Typography.Text>
            <Notation>{"for ch in word"}</Notation> берёт символы по одному, как
            в уроке о <Notation>{"for"}</Notation>. Накопитель-строка начинается
            с пустой строки <Notation>{'""'}</Notation> — как сумма с 0, а{" "}
            <Notation>{"result += ch"}</Notation> дописывает символ в конец.
          </Typography.Text>
          <Typography.Text>
            Когда нужны соседние символы, перебирают индексы. Посчитаем пары
            одинаковых соседних букв — такие задачи встречаются в ЕГЭ:
          </Typography.Text>
          <CodeBlock
            code={
              's = "AABBBC"\ncount = 0\nfor i in range(len(s) - 1):\n    if s[i] == s[i + 1]:\n        count += 1\nprint(count)'
            }
            label={"Когда нужны соседние символы, перебирают индексы"}
            language="python"
            fileName="main.py"
            output={"3"}
          />
          <Typography.Text>
            У последнего символа соседа справа нет, поэтому индекс{" "}
            <Notation>{"i"}</Notation> идёт до{" "}
            <Notation>{"len(s) - 2"}</Notation> включительно — это{" "}
            <Notation>{"range(len(s) - 1)"}</Notation>. Пары AA, BB и ещё одна
            BB дают 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Методы строк",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Метод — действие, которое вызывают у объекта через точку.
            </strong>{" "}
            Запись <Notation>{"s.lower()"}</Notation> означает «вызвать действие{" "}
            <Notation>{"lower"}</Notation> для строки <Notation>{"s"}</Notation>
            ». Точка связывает действие с объектом, скобки запускают его.
          </Typography.Text>
          <Typography.Text>
            Частые методы строки на примере{" "}
            <Notation>{'s = "Banana"'}</Notation> — выбери метод, чтобы увидеть
            результат:
          </Typography.Text>
          <VariantPicker
            label={'Методы строки `s = "Banana"`'}
            variants={[
              {
                label: "lower / upper",
                value: (
                  <>
                    <Notation>{"s.lower()"}</Notation> →{" "}
                    <Notation>{"'banana'"}</Notation>
                  </>
                ),
                note: (
                  <>
                    новая строка в нижнем регистре;{" "}
                    <Notation>{"s.upper()"}</Notation> — в верхнем
                  </>
                ),
              },
              {
                label: "strip",
                value: (
                  <>
                    <Notation>{'"  Banana  ".strip()'}</Notation> →{" "}
                    <Notation>{"'Banana'"}</Notation>
                  </>
                ),
                note: (
                  <>
                    пробелы и переводы строки по краям;{" "}
                    <Notation>{"rstrip"}</Notation> — только справа
                  </>
                ),
              },
              {
                label: "replace",
                value: (
                  <>
                    <Notation>{'s.replace("a", "o")'}</Notation> →{" "}
                    <Notation>{"'Bonono'"}</Notation>
                  </>
                ),
                note: (
                  <>
                    все вхождения; с третьим аргументом{" "}
                    <Notation>{"1"}</Notation> — только первое
                  </>
                ),
              },
              {
                label: "find",
                value: (
                  <>
                    <Notation>{'s.find("an")'}</Notation> →{" "}
                    <Notation>{"1"}</Notation>
                  </>
                ),
                note: <>индекс первого вхождения, −1 если нет</>,
              },
              {
                label: "count",
                value: (
                  <>
                    <Notation>{'s.count("an")'}</Notation> →{" "}
                    <Notation>{"2"}</Notation>
                  </>
                ),
                note: <>неперекрывающиеся вхождения</>,
              },
              {
                label: "startswith",
                value: (
                  <>
                    <Notation>{'s.startswith("Ba")'}</Notation> →{" "}
                    <Notation>{"True"}</Notation>
                  </>
                ),
                note: (
                  <>
                    <Notation>{"endswith"}</Notation> — проверка конца
                  </>
                ),
              },
              {
                label: "zfill",
                value: (
                  <>
                    <Notation>{'"101".zfill(8)'}</Notation> →{" "}
                    <Notation>{"'00000101'"}</Notation>
                  </>
                ),
                note: <>нули слева до длины 8</>,
              },
              {
                label: "in",
                value: (
                  <>
                    <Notation>{'"nan" in s'}</Notation> →{" "}
                    <Notation>{"True"}</Notation>
                  </>
                ),
                note: <>есть ли фрагмент внутри строки</>,
              },
            ]}
          />
          <Typography.Text>
            Методы не меняют исходную строку. Вызов{" "}
            <Notation>{'s.replace("a", "b")'}</Notation> с проигнорированным
            результатом не обновляет <Notation>{"s"}</Notation>; для этого нужно
            присваивание.
          </Typography.Text>
          <CodeBlock
            code={
              's = "  Python  "\nclean = s.strip().lower()\nprint(clean)\nprint("th" in clean, clean.find("th"))\nprint("101".zfill(8))'
            }
            label={"strip, lower, in, find и zfill"}
            language="python"
            fileName="main.py"
            output={"python\nTrue 2\n00000101"}
          />
          <Typography.Text>
            Сначала <Notation>{"strip"}</Notation> создаёт промежуточную строку
            без крайних пробелов; затем <Notation>{"lower"}</Notation>{" "}
            вызывается уже для неё. Это два последовательных действия.{" "}
            <Notation>{"zfill"}</Notation> удобен, когда запись числа нужно
            выровнять по длине, например двоичную запись до восьми знаков.
          </Typography.Text>
          <Typography.Text>
            Не проверяй поиск как <Notation>{"if s.find(part):"}</Notation>:
            индекс 0 ложен, а отсутствие с индексом −1 истинно. Используй{" "}
            <Notation>{"part in s"}</Notation> или явное сравнение с −1.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: что именно убирает strip"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{'strip("ab")'}</Notation> убирает по краям любой набор
              символов <Notation>{"a"}</Notation> и <Notation>{"b"}</Notation>,
              а не обязательно целую подстроку <Notation>{'"ab"'}</Notation>.
              Для удаления ровно одного известного префикса существует{" "}
              <Notation>{"removeprefix"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "count без перекрытий",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"count"}</Notation> не считает перекрывающиеся
              вхождения.
            </strong>{" "}
            В <Notation>{'"AAAA"'}</Notation> фрагмент{" "}
            <Notation>{'"AA"'}</Notation> начинается на позициях 0, 1 и 2. Но{" "}
            <Notation>{'"AAAA".count("AA")'}</Notation> возвращает 2: после
            найденного совпадения поиск продолжится за ним.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.overlapAAAA_AA}
            caption={
              <>
                «AA» начинается в «AAAA» с позиций 0, 1 и 2.{" "}
                <Notation>{"count"}</Notation> находит начала 0 и 2, а начало 1
                пропускает: оно перекрывается с найденным.
              </>
            }
          />
          <Typography.Text>
            Для подсчёта всех начал можно проверить каждую позицию:
          </Typography.Text>
          <CodeBlock
            code={
              's = "AAAA"\npart = "AA"\ncount = 0\nfor i in range(len(s) - len(part) + 1):\n    if s[i:i + len(part)] == part:\n        count += 1\nprint(count, s.count(part))'
            }
            label={"Для подсчёта всех начал можно проверить каждую позицию"}
            language="python"
            fileName="main.py"
            output={"3 2"}
          />
          <Typography.Text>
            Последнее допустимое начало —{" "}
            <Notation>{"len(s) - len(part)"}</Notation>. Именно поэтому верхняя
            граница <Notation>{"range"}</Notation> на 1 больше. Если шаблон
            длиннее текста, диапазон пуст. С пустым шаблоном{" "}
            <Notation>{"count"}</Notation> ведёт себя неожиданно:{" "}
            <Notation>{'"abc".count("")'}</Notation> равно 4 — пустая строка
            «находится» перед каждым символом и в конце. Если шаблон может
            оказаться пустым, обработай этот случай отдельно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Спецсимволы и Unicode",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Некоторые символы записывают через обратный слеш, а сами символы —
              это коды Unicode.
            </strong>{" "}
            <Notation>{"\\n"}</Notation> внутри обычной строки означает перевод
            строки, <Notation>{"\\t"}</Notation> — табуляцию,{" "}
            <Notation>{"\\\\"}</Notation> — один обратный слеш. Чтобы увидеть
            представление со специальными символами, используй{" "}
            <Notation>{"repr"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              's = "A\\nB"\nprint(len(s))\nprint(repr(s))\nprint(ord("A"), chr(66))'
            }
            label={
              "Чтобы увидеть представление со специальными символами, используй repr"
            }
            language="python"
            fileName="main.py"
            output={"3\n'A\\nB'\n65 B"}
          />
          <Typography.Text>
            Длина 3: A, перевод строки, B. Python хранит строки как
            Unicode-текст. <Notation>{'ord("A")'}</Notation> возвращает код
            символа, <Notation>{"chr(66)"}</Notation> — символ по коду. Обычная
            сортировка строк основана на кодах, а не на словарных правилах
            русского языка.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: Unicode, эмодзи и isdigit"
            kind="nuance"
          >
            <Typography.Text>
              Некоторые визуально единые знаки, особенно эмодзи с
              модификаторами, состоят из нескольких кодовых точек:{" "}
              <Notation>{"len"}</Notation> считает именно кодовые точки, а не
              всегда видимые «картинки».
            </Typography.Text>
            <Typography.Text>
              Строковые методы <Notation>{"isdigit()"}</Notation> и{" "}
              <Notation>{"isalpha()"}</Notation> работают шире набора английских
              букв и цифр ASCII. Если условие разрешает строго цифры{" "}
              <Notation>{"0"}</Notation>–<Notation>{"9"}</Notation>, проверяй
              соответствующий набор. Пустая строка для{" "}
              <Notation>{"isdigit()"}</Notation> даёт{" "}
              <Notation>{"False"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
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
            Для <Notation>{'s = "PYTHON"'}</Notation> что дадут{" "}
            <Notation>{"s[1]"}</Notation>, <Notation>{"s[-2]"}</Notation> и{" "}
            <Notation>{"s[2:4]"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Y, O и TH: индекс 4 в срез <Notation>{"s[2:4]"}</Notation> не
            входит.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Как одной записью развернуть строку? Что даст{" "}
            <Notation>{'"ABCDEFG"[::3]'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"s[::-1]"}</Notation>; <Notation>{"[::3]"}</Notation>{" "}
            берёт каждый третий символ — ADG.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{'s[0] = "X"'}</Notation> для{" "}
            <Notation>{'s = "PYTHON"'}</Notation> останавливает программу? Как
            получить строку «XYTHON»?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Строка неизменяема — <Notation>{"TypeError"}</Notation>. Новая
            строка: <Notation>{'s = "X" + s[1:]'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>Что напечатает программа?</Typography.Text>
          <CodeBlock
            code={
              'result = ""\nfor ch in "abc":\n    result = ch + result\nprint(result)'
            }
            label={"Сборка строки с добавлением в начало"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            cba: каждый символ ставится перед уже собранной частью, поэтому
            строка разворачивается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что вернут <Notation>{'"Python".find("th")'}</Notation> и{" "}
            <Notation>{'"Python".find("x")'}</Notation>? Почему проверка{" "}
            <Notation>{'if s.find("P"):'}</Notation> для{" "}
            <Notation>{'s = "Python"'}</Notation> сработает неверно?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2 и −1. <Notation>{'s.find("P")'}</Notation> вернёт 0 — это
            найденное начало, но 0 в условии ложен. Проверяй{" "}
            <Notation>{'"P" in s'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь ты умеешь доставать из строки символы и куски и собирать из неё
        новые строки. Вот что понадобится дальше — и в задачах ЕГЭ на строки.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Индексы",
            note: (
              <>
                От 0 до <Notation>{"len(s) - 1"}</Notation>, отрицательные — с
                конца; неверный индекс — <Notation>{"IndexError"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"s[start:stop:step]"}</Notation>,
            note: (
              <>
                Граница не входит, как в <Notation>{"range"}</Notation>;{" "}
                <Notation>{"s[::-1]"}</Notation> разворачивает строку.
              </>
            ),
          },
          {
            key: "Неизменяемость",
            note: (
              <>
                Символ заменить нельзя; <Notation>{"+"}</Notation> и методы
                строят новую строку.
              </>
            ),
          },
          {
            key: "Сборка строки",
            note: (
              <>
                <Notation>{'result = ""'}</Notation> и{" "}
                <Notation>{"result += ch"}</Notation> в цикле{" "}
                <Notation>{"for ch in s"}</Notation>; соседние символы — через{" "}
                <Notation>{"range(len(s) - 1)"}</Notation>.
              </>
            ),
          },
          {
            key: "Методы",
            note: (
              <>
                <Notation>{"lower"}</Notation>, <Notation>{"strip"}</Notation>,{" "}
                <Notation>{"replace"}</Notation>, <Notation>{"find"}</Notation>,{" "}
                <Notation>{"count"}</Notation> возвращают новый результат,
                строку не меняют.
              </>
            ),
          },
          {
            key: <Notation>{"in"}</Notation>,
            note: (
              <>
                Есть ли фрагмент; <Notation>{"find"}</Notation> даёт −1 при
                отсутствии, а 0 — это найденное начало.
              </>
            ),
          },
          {
            key: <Notation>{"count"}</Notation>,
            note: (
              <>
                Считает без перекрытий; с перекрытиями — проверка каждой позиции
                срезом.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
