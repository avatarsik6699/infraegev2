import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import { stringProcessingLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./string-processing.media";
import { R, THEME_TASK } from "./string-processing.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const stringProcessingLesson = defineLesson({
  ...stringProcessingLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать строку из файла и находить самую длинную цепочку одним проходом: текущая длина и лучшая",
    "Сбрасывать цепочку до 0, 1 или 2 по условию на символ, на соседей или на тройку",
    "Находить повторяющийся образец, цепочки пар и троек, короткие фрагменты вроде палиндромов",
    "Двигать границы скользящего окна для условий «не более K» и «ровно K»",
    "Решать задачи через список позиций: K подряд идущих вхождений, особые начало и конец",
    "Находить числа и корректные выражения регулярным выражением; решать задачу темы",
    "Для сложных вариаций — значение выражения, не более K чисел и баланс (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "stroka-i-cepochka",
      title: "Строка и цепочка",
      lead: "Что спрашивают в задании 24, как прочитать строку из файла и найти самую длинную цепочку за один проход.",
      conceptIds: [
        "kak-ustroena-tema",
        "podryad",
        "chtenie-fayla",
        "tekushchaya-dlina",
        "chto-vyvodit",
        "cepochka-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Для <Notation>{"s = 'QWERTY'"}</Notation> чему равны{" "}
              <Notation>{"s[1]"}</Notation>, <Notation>{"s[-1]"}</Notation>,{" "}
              <Notation>{"s[2:5]"}</Notation> и <Notation>{"len(s)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              W, Y, ERT и 6: срез <Notation>{"s[2:5]"}</Notation> берёт символы
              с номерами 2, 3 и 4.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              В строке <Notation>{"BBBABBBBAB"}</Notation> найди самую длинную
              цепочку букв B, идущих подряд. Почему ответ не 7?
            </>
          ),
          reveal: (
            <>
              4: цепочка BBBB с 4-го по 7-й символ. Семь букв B получились бы
              только с пропуском A, а «подряд» пропусков не допускает.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Файл — одна строка <Notation>{"XYZX"}</Notation> с переводом
              строки в конце. Сколько символов, отличных от X, насчитает
              программа, если забыть <Notation>{"strip()"}</Notation>?
            </>
          ),
          reveal: <>3 вместо 2: перевод строки — тоже символ, и он не X.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Программа обновляет <Notation>{"best"}</Notation> только тогда,
              когда цепочка обрывается. Что она напечатает для{" "}
              <Notation>{"XXAXXX"}</Notation>, если ищем цепочку X?
            </>
          ),
          reveal: (
            <>
              2 вместо 3: последняя цепочка XXX не попала в ответ — после неё
              обрыва уже не было.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              «Найдите самый длинный фрагмент без буквы Q; если таких несколько,
              укажите номер первого символа последнего из них». Что здесь
              сравниваем и что выводим?
            </>
          ),
          reveal: (
            <>
              Сравниваем длину, при равной длине берём фрагмент правее, а
              выводим номер его первого символа, а не длину.
            </>
          ),
        },
      ],
    },
    {
      slug: "sosedi",
      title: "Условия на соседей",
      lead: "Одинаковые подряд, соседи различны, запретные пары, тройки: после нарушения цепочка начинается заново с 1 или 2 символов.",
      conceptIds: [
        "odinakovye-podryad",
        "sosedi-razlichny",
        "zapretnye-pary",
        "trojki",
        "sosedi-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Найди самую длинную цепочку одинаковых символов в{" "}
              <Notation>{"ZZYYYZYYYYZ"}</Notation>.
            </>
          ),
          reveal: <>4: YYYY ближе к концу строки.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Почему при разрыве цепочки одинаковых символов{" "}
              <Notation>{"current"}</Notation> становится 1, а не 0?
            </>
          ),
          reveal: (
            <>
              Символ, на котором цепочка оборвалась, сам начинает новую цепочку
              длины 1: условие связывает пару, а один символ ему не мешает.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Что напечатает <Notation>{"print(s[i - 1])"}</Notation> при{" "}
              <Notation>{"i = 0"}</Notation> для{" "}
              <Notation>{"s = 'KLMN'"}</Notation>?
            </>
          ),
          reveal: (
            <>
              N: <Notation>{"s[-1]"}</Notation> — последний символ. Поэтому цикл
              по соседям начинают с <Notation>{"i = 1"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              В строке <Notation>{"KLAKKLB"}</Notation> найди самый длинный
              фрагмент, где буквы K и L не стоят рядом (KK можно).
            </>
          ),
          reveal: (
            <>
              4: LAKK. Пары KL на позициях 0–1 и 4–5 обрывают цепочку, но L
              после разрыва начинает новую.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Условие задано для каждых трёх соседних цифр. До скольких символов
              сбрасывается цепочка на плохой тройке и почему?
            </>
          ),
          reveal: (
            <>
              До 2: две последние цифры плохой тройки ещё не образуют ни одной
              тройки, поэтому фрагмент из них допустим.
            </>
          ),
        },
      ],
    },
    {
      slug: "obrazcy-i-bloki",
      title: "Образцы и блоки",
      lead: "Повторяющийся образец вроде DOGDOG…, цепочки пар и троек со смещением, короткие фрагменты и палиндромы.",
      access: "paid",
      conceptIds: [
        "povtoryayushchiysya-obrazec",
        "obrazec-s-variantami",
        "bloki",
        "korotkie-fragmenty",
        "obrazcy-itogo",
      ],
      paid: {
        outline: [
          {
            id: "povtoryayushchiysya-obrazec",
            navLabel: "Повторяющийся образец",
          },
          { id: "obrazec-s-variantami", navLabel: "Начало с любого места" },
          { id: "bloki", navLabel: "Цепочки пар и троек" },
          { id: "korotkie-fragmenty", navLabel: "Короткие фрагменты" },
          { id: "obrazcy-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Если фрагмент повторяет образец, на каждом шаге известно, какой
                символ должен идти следующим.
              </strong>{" "}
              Так ищут цепочки DOGDOG…, цепочки пар и троек и считают короткие
              фрагменты вроде палиндромов.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./string-processing.paid.obrazcy-i-bloki"),
      },
    },
    {
      slug: "skolzyashchee-okno",
      title: "Скользящее окно",
      lead: "Две границы фрагмента: не более K и ровно K букв, несколько условий сразу, пары букв внутри окна.",
      access: "paid",
      conceptIds: [
        "dve-granicy",
        "rovno-k",
        "neskolko-usloviy",
        "pary-v-okne",
        "okno-itogo",
      ],
      paid: {
        outline: [
          { id: "dve-granicy", navLabel: "Две границы" },
          { id: "rovno-k", navLabel: "Ровно K" },
          { id: "neskolko-usloviy", navLabel: "Несколько условий" },
          { id: "pary-v-okne", navLabel: "Пары в окне" },
          { id: "okno-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Если условие ограничивает количество букв во фрагменте, храни
                две границы: правая идёт вперёд, левая догоняет, когда букв
                стало слишком много.
              </strong>{" "}
              Так решаются задачи вида «не более 130 пар» и «буква T ровно 100
              раз».
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./string-processing.paid.skolzyashchee-okno"),
      },
    },
    {
      slug: "pozicii-i-granicy",
      title: "Позиции и границы",
      lead: "Список позиций нужных символов: K подряд идущих вхождений, самый короткий и самый длинный фрагмент, особые начало и конец.",
      access: "paid",
      conceptIds: [
        "spisok-poziciy",
        "rovno-k-pozicii",
        "vhozhdeniya-slova",
        "nachalo-i-konec",
        "pozicii-itogo",
      ],
      paid: {
        outline: [
          { id: "spisok-poziciy", navLabel: "Список позиций" },
          { id: "rovno-k-pozicii", navLabel: "Ровно K: до соседей" },
          { id: "vhozhdeniya-slova", navLabel: "Вхождения слова" },
          { id: "nachalo-i-konec", navLabel: "Начало и конец" },
          { id: "pozicii-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Часто достаточно запомнить, где стоят нужные символы: фрагмент с
                K такими символами начинается и кончается рядом с ними.
              </strong>{" "}
              Так решают задачи о K подряд идущих вхождениях и об особых начале
              и конце — они часто встречаются в вариантах последних лет.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./string-processing.paid.pozicii-i-granicy"),
      },
    },
    {
      slug: "chisla-i-vyrazheniya",
      title: "Числа и выражения",
      lead: "Наибольшее число в строке, запись числа в системе счисления, корректное выражение регулярным выражением; решаем задачу темы.",
      access: "paid",
      conceptIds: [
        "chisla-v-stroke",
        "zapis-v-sisteme",
        "shablon-vyrazheniya",
        "zadacha-temy",
        "vyrazheniya-itogo",
      ],
      paid: {
        outline: [
          { id: "chisla-v-stroke", navLabel: "Числа в строке" },
          { id: "zapis-v-sisteme", navLabel: "Запись в системе счисления" },
          { id: "shablon-vyrazheniya", navLabel: "Шаблон выражения" },
          { id: "zadacha-temy", navLabel: "Задача темы" },
          { id: "vyrazheniya-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Число и корректное выражение описывают шаблоном — регулярным
                выражением, а Python сам находит все подходящие фрагменты.
              </strong>{" "}
              Так устроено задание 24 в демоверсии 2025 года и на ЕГЭ-2026.
              Здесь решаем задачу темы целиком.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./string-processing.paid.chisla-i-vyrazheniya"),
      },
    },
    {
      slug: "usloviya-i-balans",
      title: "Выражения с условиями и баланс",
      lead: "Выражение со значением 0, не более K чисел, порядок действий, сумма после буквы и «букв вдвое больше цифр».",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "znachenie-nol",
        "ne-bolee-k-chisel",
        "poryadok-dejstvij",
        "summa-posle-bukvy",
        "balans",
        "usloviya-itogo",
      ],
      paid: {
        outline: [
          { id: "znachenie-nol", navLabel: "Значение равно нулю" },
          { id: "ne-bolee-k-chisel", navLabel: "Не более K чисел" },
          { id: "poryadok-dejstvij", navLabel: "Порядок действий" },
          { id: "summa-posle-bukvy", navLabel: "Сумма после буквы" },
          { id: "balans", navLabel: "Баланс" },
          { id: "usloviya-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для сложных вариаций.</strong> Здесь
              от выражения требуют больше, чем корректность, а количества букв и
              цифр сравнивают через баланс. Такие задачи есть в сборниках и
              пробниках; задачи основных подтем решаются без этого урока.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./string-processing.paid.usloviya-i-balans"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 24 дают файл — одну длинную строку примерно из миллиона
            символов. Нужно найти в ней самый длинный (иногда самый короткий)
            кусок, идущий подряд, с заданным свойством. Вот задача, которую мы
            решим в этой теме:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все куски строки не получится — их сотни миллиардов.
              Поэтому строку проходят один раз и по дороге помнят только то, что
              нужно для ответа.
            </strong>{" "}
            Разберём, что значат слова условия:
          </Typography.Text>
          <LessonTable
            label={"Слова условия задания 24"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "текстовый файл из 10⁶ символов",
                "одна строка; кусков в ней около 5 · 10¹¹ — перебор не успеет",
              ],
              [
                "идущие подряд, непрерывная последовательность, подстрока",
                "кусок строки без пропусков: символы пропускать и переставлять нельзя",
              ],
              [
                "максимальное количество символов",
                "длина самого длинного подходящего куска",
              ],
              [
                "корректное арифметическое выражение",
                "число, знак, число, знак, …, число — ни двух знаков рядом, ни знака на краю",
              ],
              [
                "нет незначащих (ведущих) нулей",
                "число не начинается с 0, кроме самого числа 0",
              ],
              [
                "если таких несколько, …",
                "правило выбора при равной длине — его выполняют дословно",
              ],
            ]}
          />
          <Typography.Text>
            Начнём с простых цепочек — на них видна главная идея одного прохода,
            — потом дойдём до окон, позиций и выражений. Тема состоит из шести
            подтем и дополнительного урока — у каждой своя страница:
          </Typography.Text>
          <ol>
            <li>
              <strong>Строка и цепочка</strong> — ты сейчас здесь: чтение файла
              и самая длинная цепочка.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="sosedi">
                Условия на соседей
              </SubtopicLink>{" "}
              — одинаковые подряд, соседи различны, запретные пары.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="obrazcy-i-bloki">
                Образцы и блоки
              </SubtopicLink>{" "}
              — DOGDOG…, цепочки пар, палиндромы.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="skolzyashchee-okno">
                Скользящее окно
              </SubtopicLink>{" "}
              — не более K и ровно K букв во фрагменте.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="pozicii-i-granicy">
                Позиции и границы
              </SubtopicLink>{" "}
              — K подряд идущих вхождений, особые начало и конец.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="chisla-i-vyrazheniya">
                Числа и выражения
              </SubtopicLink>{" "}
              — регулярные выражения; решим задачу темы: ответ 172.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="usloviya-i-balans">
                Выражения с условиями и баланс
              </SubtopicLink>{" "}
              — дополнительный урок для сложных вариаций.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "podryad",
      navLabel: "Подряд — без пропусков",
      explanation: (
        <>
          <Typography.Text>Что значит «идущие подряд символы»?</Typography.Text>
          <Typography.Text>
            <strong>
              Кусок строки без пропусков: символы берут один за другим, ничего
              не выкидывая из середины.
            </strong>{" "}
            В строке <Notation>{"AAAXAAAA"}</Notation> самая длинная цепочка
            букв A — четыре, а не семь: чтобы получить семь, пришлось бы
            выкинуть X. Такой кусок ещё называют подстрокой или фрагментом.
          </Typography.Text>
          <Typography.Text>
            В Python к символу обращаются по номеру — индексу. Счёт идёт с нуля:{" "}
            <Notation>{"s[0]"}</Notation> — первый символ,{" "}
            <Notation>{"s[-1]"}</Notation> — последний,{" "}
            <Notation>{"len(s)"}</Notation> — длина. Кусок вырезают{" "}
            <PythonTerm term="slice">срезом</PythonTerm>{" "}
            <Notation>{"s[a:b]"}</Notation>: от a включительно до b не
            включительно.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'CABAC'\nprint(s[0], s[4], s[-1], len(s))\nprint(s[1:4])"
            }
            label={"Индексы и срез"}
            language="python"
            output={"C C C 5\nABA"}
          />
          <Typography.Text>
            Срез <Notation>{"s[1:4]"}</Notation> взял символы с номерами 1, 2 и
            3 — правая граница не входит:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.sliceCabac}
            caption={
              <>
                Срез s[1:4] — символы 1, 2, 3; длина 4 − 1 = 3. Под строкой —
                отрицательные индексы: s[-1] — последний символ.
              </>
            }
          />
          <Typography.Text>
            Если кусок задан двумя включёнными концами left и right, его длина —{" "}
            <Notation>{"right - left + 1"}</Notation>: символы с номерами 3, 4,
            5 и 6 — это четыре символа, хотя 6 − 3 = 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chtenie-fayla",
      navLabel: "Чтение файла",
      explanation: (
        <>
          <Typography.Text>Как прочитать строку из файла?</Typography.Text>
          <Typography.Text>
            <strong>
              Одной строкой:{" "}
              <Notation>{"s = open('24.txt').readline().strip()"}</Notation>.
              Без <Notation>{"strip()"}</Notation> в конце останется перевод
              строки — лишний символ.
            </strong>{" "}
            <PythonTerm term="readline">
              <Notation>{"readline()"}</Notation>
            </PythonTerm>{" "}
            читает первую строку файла вместе с невидимым символом перевода
            строки,{" "}
            <PythonTerm term="strip">
              <Notation>{"strip()"}</Notation>
            </PythonTerm>{" "}
            убирает его. В учебном файле 24.txt одна строка — XXAXXXXBXX:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = open('24.txt').readline().strip()\nprint(s, len(s))\n\nline = open('24.txt').readline()\nprint(len(line), len(line.strip()))"
            }
            label={"Строка из файла"}
            language="python"
            output={"XXAXXXXBXX 10\n11 10"}
          />
          <Typography.Text>
            С переводом строки символов 11, без него — 10. Если ищем «символы,
            отличные от A», перевод строки тоже посчитается — и ответ станет на
            единицу больше. Поэтому <Notation>{"strip()"}</Notation> пишем
            всегда.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: [:-1] и файлы из многих строк"
          >
            <Typography.Text>
              <Notation>{"readline()[:-1]"}</Notation> отрезает последний
              символ, даже если перевода строки в файле нет, — тогда пропадёт
              настоящий символ данных. <Notation>{"strip()"}</Notation> убирает
              только пробелы и переводы строк, а в файлах задания 24 их внутри
              строки не бывает.
            </Typography.Text>
            <Typography.Text>
              Если в файле много независимых строк, их перебирают циклом{" "}
              <Notation>{"for line in open('24.txt')"}</Notation> и каждую
              очищают <Notation>{"strip()"}</Notation> отдельно.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "tekushchaya-dlina",
      navLabel: "Текущая и лучшая длина",
      explanation: (
        <>
          <Typography.Text>
            Как найти самую длинную цепочку букв X, не перебирая все куски
            строки?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Идти по строке и помнить два числа: current — длину цепочки,
              которая кончается на текущем символе, и best — лучшую длину из уже
              виденных.
            </strong>{" "}
            Подходящий символ продлевает цепочку на единицу, неподходящий
            обрывает её: current = 0. После каждого символа best сравнивается с
            current.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = open('24.txt').readline().strip()\n\ncurrent = 0\nbest = 0\nfor c in s:\n    if c == 'X':\n        current += 1\n    else:\n        current = 0\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Самая длинная цепочка X"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Пройди строку XXAXXXXBXX по шагам: заливка — текущая цепочка, скобка
            — лучшая из найденных.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.runStepperX}
            label={"Самая длинная цепочка X в строке XXAXXXXBXX: шаг за шагом"}
          />
          <Typography.Text>
            Сравнивать best с current нужно на каждом шаге, а не только при
            обрыве. Иначе цепочка в самом конце строки в ответ не попадёт: после
            неё обрыва уже не будет. Строка проходится один раз — миллион
            символов программа обработает за доли секунды.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chto-vyvodit",
      navLabel: "Что выводить",
      explanation: (
        <>
          <Typography.Text>
            В условии просят не длину самой длинной цепочки X, а номер её
            первого символа, а если таких цепочек несколько — последней из них.
            Что меняется?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Меняется только то, что запоминаем: вместе с длиной храним начало
              лучшей цепочки, а правило «при равенстве» записываем явно.
            </strong>{" "}
            Перед кодом ответь на три вопроса: какие куски подходят, что
            сравниваем, что выводим.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'XXAXXBXXAX'\ncurrent = 0\nbest_length = 0\nbest_start = 0\nfor i in range(len(s)):\n    if s[i] == 'X':\n        current += 1\n    else:\n        current = 0\n    if current > 0 and current >= best_length:\n        best_length = current\n        best_start = i - current + 1\n\nprint(best_length, best_start)"
            }
            label={"Длина и начало последней из самых длинных"}
            language="python"
            output={"2 6"}
          />
          <Typography.Text>
            Цепочка, которая кончается на символе i, начинается на{" "}
            <Notation>{"i - current + 1"}</Notation>. Проверка{" "}
            <Notation>{"current > 0"}</Notation> не даёт «цепочке» нулевой длины
            на символе A занять место ответа. Три цепочки длины 2 начинаются с
            0-го, 3-го и 6-го символа. Знак <Notation>{">="}</Notation> пускает
            более позднюю цепочку при равенстве, поэтому выбрана последняя. Для
            первой из равных нужен строгий <Notation>{">"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Нумерацию берут из условия: если символы считают с единицы, к
            индексу Python прибавляют 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cepochka-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Подряд", note: <>кусок без пропусков — подстрока</> },
              {
                key: "Чтение файла",
                note: (
                  <Notation>{"s = open('24.txt').readline().strip()"}</Notation>
                ),
              },
              {
                key: "Длина куска",
                note: <>right − left + 1 при включённых концах</>,
              },
              {
                key: "current",
                note: <>длина цепочки, которая кончается на текущем символе</>,
              },
              { key: "best", note: <>обновлять после каждого символа</> },
              {
                key: "При равенстве",
                note: <>«&gt;=» — последний из равных, «&gt;» — первый</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "odinakovye-podryad",
      navLabel: "Одинаковые подряд",
      explanation: (
        <>
          <Typography.Text>
            Как найти самую длинную цепочку одинаковых символов, если буква
            заранее не известна?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сравнивать каждый символ с предыдущим. Совпал — цепочка растёт. Не
              совпал — новая цепочка начинается с этого символа: current = 1, а
              не 0.
            </strong>{" "}
            Условие здесь на пару соседей, а один символ сам по себе ему не
            мешает.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'AABBBBCCAAA'\ncurrent = 1\nbest = 1\nfor i in range(1, len(s)):\n    if s[i] == s[i - 1]:\n        current += 1\n    else:\n        current = 1\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Самая длинная цепочка одинаковых"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Цикл начинается с <Notation>{"i = 1"}</Notation>: у первого символа
            соседа слева нет. Если начать с нуля,{" "}
            <Notation>{"s[i - 1]"}</Notation> при <Notation>{"i = 0"}</Notation>{" "}
            — это <Notation>{"s[-1]"}</Notation>, последний символ строки, и
            первый символ сравнится с последним.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sosedi-razlichny",
      navLabel: "Соседи различны",
      explanation: (
        <>
          <Typography.Text>
            А если каждые два соседних символа должны быть разными?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тот же цикл, только проверка обратная:{" "}
              <Notation>{"s[i] != s[i - 1]"}</Notation>. Два одинаковых символа
              рядом обрывают цепочку, второй из них начинает новую.
            </strong>{" "}
            Подходит, например, ABACA: буква A повторяется, но не рядом.
          </Typography.Text>
          <Typography.Text>
            Пройди по шагам строку ABBACAB: пара BB обрывает цепочку AB, и
            вторая B начинает цепочку BACAB.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.runStepperDiff}
            label={"Цепочка различных соседей в строке ABBACAB: шаг за шагом"}
          />
          <Typography.Text>
            Ответ — 5. Не путай с условием «все символы фрагмента различны»: в
            ABACA соседи различны, а все символы — нет. Это другая задача, она
            решается окном.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapretnye-pary",
      navLabel: "Запретные пары",
      explanation: (
        <>
          <Typography.Text>
            Условие запрещает некоторые пары рядом: «никакие две буквы из A, B,
            C не стоят подряд». Как это проверить?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Так же, как соседей: меняется только проверка пары. Запретная пара
              обрывает цепочку, а её второй символ начинает новую.
            </strong>{" "}
            Выбери условие из подборок, чтобы увидеть проверку:
          </Typography.Text>
          <VariantPicker
            label={"Условие и когда пара запретна"}
            variants={[
              {
                label: "две из A, B, C",
                value: (
                  <Notation>{"s[i - 1] in 'ABC' and s[i] in 'ABC'"}</Notation>
                ),
                note: <>пара плохая — сброс до 1</>,
              },
              {
                label: "I не рядом с T",
                value: <Notation>{"s[i - 1] + s[i] in ('IT', 'TI')"}</Notation>,
                note: <>обе пары, IT и TI</>,
              },
              {
                label: "нет XX и YY",
                value: <Notation>{"s[i - 1] + s[i] in ('XX', 'YY')"}</Notation>,
                note: <>XY, YX и ZZ разрешены</>,
              },
              {
                label: "по алфавиту",
                value: <Notation>{"s[i - 1] > s[i]"}</Notation>,
                note: <>буквы сравниваются по алфавиту, как строки</>,
              },
            ]}
          />
          <Typography.Text>
            Посмотрим на условие про A, B, C в строке DXABYCZ. Пара AB запретна:
            цепочка DXA обрывается, B начинает новую — BYCZ:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'DXABYCZ'\ncurrent = 1\nbest = 1\nfor i in range(1, len(s)):\n    if s[i - 1] in 'ABC' and s[i] in 'ABC':\n        current = 1\n    else:\n        current += 1\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Никакие две из A, B, C не подряд"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Обнулить длину на B было бы ошибкой: сама B не запрещена, запрещена
            только пара. Ответ — 4, фрагмент BYCZ.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "trojki",
      navLabel: "Тройки: сброс до 2",
      explanation: (
        <>
          <Typography.Text>
            Условие задано для каждых трёх соседних цифр: «сумма первых двух
            больше третьей». До скольких символов сбрасывать цепочку?
          </Typography.Text>
          <Typography.Text>
            <strong>
              До двух: после плохой тройки две её последние цифры ещё не
              образуют ни одной тройки, поэтому фрагмент из них допустим.
            </strong>{" "}
            Общее правило: после нарушения оставляем самый длинный конец
            цепочки, который ещё подходит.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = '2451246'\ncurrent = 2\nbest = 2\nfor i in range(2, len(s)):\n    if int(s[i - 2]) + int(s[i - 1]) > int(s[i]):\n        current += 1\n    else:\n        current = 2\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Каждая тройка: сумма первых двух больше третьей"}
            language="python"
            output={"5"}
          />
          <Typography.Text>
            Тройки 245, 451 и 512 подходят — цепочка 24512 длины 5. Тройка 124
            плохая: 1 + 2 не больше 4, и с цифр 24 начинается новая цепочка.
          </Typography.Text>
          <LessonTable
            label={"До скольких символов сбрасывать цепочку"}
            columns={[
              { label: "Условие на" },
              { label: "Сброс до", numeric: true },
              { label: "Что остаётся" },
            ]}
            rows={[
              [
                "один символ",
                "0",
                "ничего: плохой символ не входит ни в какую цепочку",
              ],
              ["пару соседей", "1", "второй символ плохой пары"],
              ["тройку соседей", "2", "два последних символа плохой тройки"],
            ]}
          />
        </>
      ),
    },
    {
      id: "sosedi-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Одинаковые подряд",
                note: <Notation>{"s[i] == s[i - 1]"}</Notation>,
              },
              {
                key: "Соседи различны",
                note: <Notation>{"s[i] != s[i - 1]"}</Notation>,
              },
              {
                key: "Запретная пара",
                note: <>сброс до 1: второй символ начинает новую цепочку</>,
              },
              { key: "Тройки", note: <>сброс до 2</> },
              {
                key: "Начало цикла",
                note: <>с i = 1 (для троек — с 2): s[-1] — последний символ</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  finalLead:
    "Вся тема на одной странице: как решилась задача темы, главное из подтем, порядок решения и частые ошибки.",
  paidPractice: {
    sections: [
      { id: "odna-zadacha", navLabel: "Одна задача — вся тема" },
      { id: "karta-temy", navLabel: "Карта темы" },
      { id: "kak-reshat", navLabel: "Как решать" },
      { id: "chastye-oshibki", navLabel: "Частые ошибки" },
    ],
    checkpoint: 4,
    load: () => import("./string-processing.paid.praktika"),
  },
  status: "published",
});
