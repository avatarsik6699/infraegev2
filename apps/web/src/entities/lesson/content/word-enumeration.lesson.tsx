import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { wordEnumerationLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./word-enumeration.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const wordEnumerationLesson = defineLesson({
  ...wordEnumerationLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Считать слова правилом умножения и сложением непересекающихся случаев",
    "Выбирать места для одинаковых букв и считать «хотя бы» через дополнение",
    "Учитывать ограничения на соседние буквы промежутками, блоками и схемами",
    "Считать записи чисел с начальной цифрой, чётностью и порядком цифр",
    "Находить номер слова и слово по номеру через систему счисления",
    "Искать в нумерованном списке, храня номер и количество раздельно",
    "Для редких задач — состояния, схемы типов и счёт до границы без перебора (дополнительный урок)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "slova-i-umnozhenie",
      title: "Слова и правило умножения",
      lead: "Алфавит и запас букв, правило умножения и сложения, слова без повторов и n!, перебор product и permutations, оценка числа вариантов.",
      conceptIds: [
        "kak-ustroena-tema-8",
        "slovo",
        "alfavit-i-zapas",
        "umnozhenie",
        "ogranicheniya-mest",
        "raznye-nabory",
        "slozhenie",
        "bez-povtorenij",
        "perebor-product",
        "schyotchik",
        "permutations",
        "ocenka-perebora",
        "slova-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-7",
          prompt: (
            <>
              Объясни словами, почему пятибуквенных слов из{" "}
              <Notation>{"АОБВГ"}</Notation> 5⁵, а не 5 · 5 = 25.
            </>
          ),
          reveal: (
            <>
              Для каждого выбора первых букв есть все пять вариантов следующей,
              поэтому варианты умножаются, а не складываются: 5 · 5 · 5 · 5 · 5.
            </>
          ),
        },
      ],
    },
    {
      slug: "skolko-raz-bukva",
      title: "Сколько раз встречается буква",
      lead: "Выбор мест для буквы, «ровно», «хотя бы» и «не более», подсчёт через дополнение и разбор случаев, перестановки букв слова с повторами.",
      conceptIds: [
        "vybor-mest",
        "mesta-bez-poryadka",
        "ostalnye-pozicii",
        "neskolko-glasnyh",
        "hotya-by-ne-bolee",
        "dopolnenie",
        "peresecheniya",
        "razbor-sluchaev",
        "programma-frazy",
        "glasnye-ciklom",
        "odinakovye-bukvy",
        "bukva-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-7",
          prompt: (
            <>
              Почему проверка <Notation>{"word.count('АБ') == 1"}</Notation> не
              подходит для условия «в слове одна <Notation>{"А"}</Notation> и
              одна <Notation>{"Б"}</Notation>»?
            </>
          ),
          reveal: (
            <>
              <Notation>{"count('АБ')"}</Notation> ищет непрерывный фрагмент{" "}
              <Notation>{"АБ"}</Notation>: в слове <Notation>{"БГА"}</Notation>{" "}
              одна <Notation>{"А"}</Notation> и одна <Notation>{"Б"}</Notation>,
              но фрагментов <Notation>{"АБ"}</Notation> нет. Нужно{" "}
              <Notation>
                {"word.count('А') == 1 and word.count('Б') == 1"}
              </Notation>
              .
            </>
          ),
        },
      ],
    },
    {
      slug: "sosednie-bukvy",
      title: "Соседние буквы",
      lead: "Запреты для соседей, промежутки и блоки, чередование, фрагмент против двух букв где угодно, проверка всех соседних пар.",
      conceptIds: [
        "sosedi-i-umnozhenie",
        "sosednie-pozicii",
        "proverka-sosedej",
        "odinakovye-sosedi",
        "promezhutki",
        "podstroka",
        "glasnye-ne-ryadom",
        "blok",
        "chereduyutsya",
        "nalozheniya",
        "sosedi-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему число четырёхбуквенных слов из <Notation>{"АБ"}</Notation>,
              содержащих <Notation>{"ББ"}</Notation>, нельзя найти как «три
              места для фрагмента, умноженные на 2² способа заполнить
              остальное»?
            </>
          ),
          reveal: (
            <>
              Слова с двумя фрагментами <Notation>{"ББ"}</Notation> посчитаются
              несколько раз: <Notation>{"ББББ"}</Notation> — трижды,{" "}
              <Notation>{"БББА"}</Notation> и <Notation>{"АБББ"}</Notation> —
              дважды. Верный ответ — 8.
            </>
          ),
        },
        {
          id: "zadacha-7",
          prompt: (
            <>
              Что выведет <Notation>{"print('АБАБА'.count('АБА'))"}</Notation>?
              Сколько раз фрагмент <Notation>{"АБА"}</Notation> начинается в
              строке <Notation>{"АБАБА"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"1"}</Notation>: count не находит перекрывающееся
              вхождение; начал фрагмента 2 — с индексов 0 и 2.
            </>
          ),
        },
      ],
    },
    {
      slug: "zapis-chisla",
      title: "Числа в системе счисления",
      lead: "Запись числа как слово из цифр: ведущий ноль, цифры как значения, чётность цифры и числа, строгий порядок цифр, числа любой длины.",
      conceptIds: [
        "chislo-kak-slovo",
        "nachalnyj-nol",
        "cifry-chislami",
        "bez-povtora-cifr",
        "vozrastanie",
        "chetnost",
        "ryadom-s-5",
        "chetnost-chereduetsya",
        "dlina-ne-zadana",
        "chisla-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-5",
          prompt: (
            <>
              Чётно ли число 2111₃? Ответь по цифрам, затем проверь переводом.
            </>
          ),
          reveal: (
            <>
              Нечётно: сумма цифр 2 + 1 + 1 + 1 = 5 нечётна, и действительно
              2111₃ = 67.
            </>
          ),
        },
      ],
    },
    {
      slug: "nomer-slova",
      title: "Номер слова и запись в системе счисления",
      lead: "Полный список как счётчик: номер слова и слово по номеру, ведущие нули, блоки по началу слова, алфавит по порядку.",
      conceptIds: [
        "spisok-kak-schyotchik",
        "sravnenie-slov",
        "schyotchik-sistemy",
        "plyus-odin",
        "nomer-slova",
        "nomer-programmoj",
        "slovo-po-nomeru",
        "nachalnye-nuli",
        "obshchee-nachalo",
        "mezhdu-nomerami",
        "poryadok-alfavita",
        "raznaya-dlina",
        "nomer-itogo",
      ],
    },
    {
      slug: "poisk-v-spiske",
      title: "Поиск в нумерованном списке",
      lead: "Номер и счётчик подходящих, первое и последнее подходящее слово, чётность номера, полный и перенумерованный список.",
      conceptIds: [
        "nomer-i-kolichestvo",
        "pervoe-i-poslednee",
        "razdelnye-schyotchiki",
        "ostanovka",
        "polnyj-spisok",
        "chetnost-nomera",
        "odin-cikl",
        "ne-sokrashchat",
        "poisk-itogo",
      ],
    },
    {
      slug: "kogda-perebor-ne-uspevaet",
      title: "Когда перебор не успевает",
      lead: "Подсчёт по состояниям, схема типов цифр, выбор набора и счёт до границы — когда вариантов миллиарды.",
      level: "advanced",
      conceptIds: [
        "dopolnitelnyy-urok-perebor",
        "dlina-20",
        "sostoyaniya",
        "shemy-tipov",
        "strogij-poryadok",
        "do-granicy",
        "perebor-itogo",
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-8",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Главная идея задания 8 — описать все допустимые последовательности
              символов и правильно учесть ограничения.
            </strong>{" "}
            После этого варианты можно либо посчитать рассуждением, либо
            перебрать программой. А если требуется найти номер слова в
            упорядоченном списке, появляется связь с системами счисления.
          </Typography.Text>
          <Typography.Text>
            В задачах задания встречаются три направления: подсчёт слов с
            ограничениями, подсчёт чисел, записанных в разных системах
            счисления, и нумерация слов по алфавиту. Материал построен
            последовательно: сначала смысл подсчёта, затем ограничения, затем
            системы счисления и номера. Формулы будем получать из рассуждений, а
            программа каждый раз переводит уже понятный подсчёт.
          </Typography.Text>
          <Typography.Text>
            Тема разбита на основные подтемы и дополнительный урок.{" "}
            <strong>Основные подтемы 1–6</strong> решают 125 из 133 задач
            подборок, в том числе все задачи реальных экзаменов 2014–2026 годов.{" "}
            <strong>Подтема 7 — дополнительный урок для продвинутых</strong>:
            она нужна для редких задач, где вариантов миллиарды и перебор не
            успевает.
          </Typography.Text>
          <Typography.Text>
            Эта подтема — фундамент для остальных:{" "}
            <strong>
              количество слов считают умножением по позициям, а программа
              перебирает те же позиции
            </strong>
            . Каждая из 133 задач начинается с вопроса, из каких символов и
            какой длины составляется слово.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем составлять слова из пяти букв{" "}
            <Notation>{"А"}</Notation>, <Notation>{"О"}</Notation>,{" "}
            <Notation>{"Б"}</Notation>, <Notation>{"В"}</Notation>,{" "}
            <Notation>{"Г"}</Notation>: две гласные и три согласные.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "slovo",
      navLabel: "Слово",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В этих задачах слово — любая последовательность символов, смысл не
              важен.
            </strong>{" "}
            В обычной речи слово должно иметь смысл, а в информатике{" "}
            <strong>слово</strong> — это просто последовательность символов. Из
            букв <Notation>{"А"}</Notation>, <Notation>{"Б"}</Notation>,{" "}
            <Notation>{"В"}</Notation> можно составить слова{" "}
            <Notation>{"АБВ"}</Notation>, <Notation>{"ББА"}</Notation>,{" "}
            <Notation>{"ВВВ"}</Notation>, <Notation>{"ААБАВ"}</Notation>; то,
            что <Notation>{"ББА"}</Notation> не является осмысленным русским
            словом, не имеет значения.
          </Typography.Text>
          <Typography.Text>
            Набор разрешённых символов называют <strong>алфавитом</strong>.
            Количество <strong>различных</strong> символов в нём —{" "}
            <strong>мощностью алфавита</strong>: у алфавита{" "}
            <Notation>{"АБ"}</Notation> она равна 2, у{" "}
            <Notation>{"АБВГ"}</Notation> — 4, у{" "}
            <Notation>{"01234567"}</Notation> — 8.
          </Typography.Text>
          <Typography.Text>
            <strong>Длина слова</strong> — количество символов в нём:{" "}
            <Notation>{"АБВ"}</Notation> имеет длину 3,{" "}
            <Notation>{"ААААА"}</Notation> — длину 5.
          </Typography.Text>
          <Typography.Text>
            В дальнейшем m — количество символов алфавита, n — длина слова. Для
            пятибуквенных слов из алфавита <Notation>{"АОБВГ"}</Notation> m = 5,
            n = 5.
          </Typography.Text>
          <Typography.Text>
            <strong>Порядок символов важен.</strong> Слова{" "}
            <Notation>{"АБВ"}</Notation> и <Notation>{"ВАБ"}</Notation>{" "}
            различны, хотя набор букв у них одинаковый. Два слова одинаковой
            длины считаются одинаковыми, только если на каждой позиции стоят
            одинаковые символы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "alfavit-i-zapas",
      navLabel: "Алфавит и запас букв",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разрешённые буквы и имеющийся запас букв — разные условия.
            </strong>{" "}
            Сравним три ситуации:
          </Typography.Text>
          <ol>
            <li>
              Можно использовать буквы <Notation>{"А"}</Notation>,{" "}
              <Notation>{"Б"}</Notation>, <Notation>{"В"}</Notation>, повторения
              разрешены. Подходят <Notation>{"ААА"}</Notation>,{" "}
              <Notation>{"АБА"}</Notation>, <Notation>{"ВВБ"}</Notation>.
            </li>
            <li>
              Можно использовать буквы <Notation>{"А"}</Notation>,{" "}
              <Notation>{"Б"}</Notation>, <Notation>{"В"}</Notation>, повторения
              запрещены. Подходят <Notation>{"АБВ"}</Notation>,{" "}
              <Notation>{"ВАБ"}</Notation>, но не <Notation>{"ААВ"}</Notation>.
            </li>
            <li>
              Нужно переставить все буквы слова <Notation>{"МАМА"}</Notation>. В
              каждом результате должно быть ровно две <Notation>{"М"}</Notation>{" "}
              и две <Notation>{"А"}</Notation>.
            </li>
          </ol>
          <Typography.Text>
            В третьем случае мы распоряжаемся конкретным{" "}
            <strong>запасом букв</strong>. Нельзя получить{" "}
            <Notation>{"АААМ"}</Notation>, потому что третьей буквы{" "}
            <Notation>{"А"}</Notation> у нас нет.
          </Typography.Text>
          <Typography.Text>
            Особенно внимательно читай формулировки:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              «Слова составляются из букв слова ТОПОТ. Буквы могут повторяться».
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Здесь разрешены три различных символа: Т, О, П. Алфавит состоит из
            трёх букв, а не из пяти. А если требуется
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              «Переставить все буквы слова ТОПОТ»,
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            то нужно использовать две <Notation>{"Т"}</Notation>, две{" "}
            <Notation>{"О"}</Notation> и одну <Notation>{"П"}</Notation>. Такие
            перестановки посчитаем в подтеме 2.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала установи, что именно дано: алфавит, запрет повторений или
              запас букв.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "umnozhenie",
      navLabel: "Правило умножения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество вариантов находится умножением, потому что каждый выбор
              разветвляется.
            </strong>{" "}
            Представим двухсимвольный код: на первом месте можно поставить{" "}
            <Notation>{"А"}</Notation> или <Notation>{"Б"}</Notation>, на втором
            — <Notation>{"0"}</Notation>, <Notation>{"1"}</Notation> или{" "}
            <Notation>{"2"}</Notation>. Выпишем все варианты деревом:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbTree012}
            caption={
              <>
                Из каждого первого символа выходят три ветви — по одной на
                второй символ. Каждому концу ветви соответствует свой код.
              </>
            }
          />
          <Typography.Text>
            Для каждого из двух первых символов есть три продолжения: 3 + 3 = 2
            · 3 = 6. Отсюда получается <strong>правило умножения</strong>:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Если первый шаг можно выполнить a способами, а после каждого
              первого шага второй можно выполнить b способами, то оба шага
              вместе можно выполнить a · b способами.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Для нескольких шагов рассуждение продолжается: a₁ · a₂ · … · aₙ, где
            aᵢ — число вариантов на i-м шаге.
          </Typography.Text>
          <Typography.Text>
            Составим пятибуквенное слово из <Notation>{"АОБВГ"}</Notation>,
            повторения разрешены. На каждое из пяти мест можно поставить любую
            из пяти букв: 5 · 5 · 5 · 5 · 5 = 5⁵ = 3125.
          </Typography.Text>
          <Typography.Text>
            В общем случае <strong>mⁿ</strong> — количество слов длины n из
            алфавита мощности m, если на каждом месте разрешена любая буква и
            повторения допускаются.
          </Typography.Text>
          <Typography.Text>
            <strong>Почему не m · n?</strong> Потому что для каждого выбора
            первой буквы появляются все варианты второй, для каждой получившейся
            пары — все варианты третьей и так далее. Количество вариантов{" "}
            <strong>разветвляется</strong> на каждом шаге.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ogranicheniya-mest",
      navLabel: "Ограничения мест",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ограничения на конкретные места часто просто меняют отдельные
              множители.
            </strong>{" "}
            В алфавите <Notation>{"АОБВГ"}</Notation> две гласные и три
            согласные. Нужно составить пятибуквенное слово, которое начинается с
            гласной и заканчивается согласной; повторения разрешены. Первое
            место — 2 варианта, второе, третье и четвёртое — по 5, пятое — 3:
          </Typography.Text>
          <Typography.Text>2 · 5 · 5 · 5 · 3 = 750.</Typography.Text>
          <Typography.Text>
            Здесь каждое ограничение относится к своей позиции.{" "}
            <strong>Но умножать числа вариантов без проверки нельзя.</strong>{" "}
            Если буква должна встретиться <strong>ровно один раз</strong>, выбор
            одной позиции влияет на остальные: на них эта буква уже запрещена.
            Такую зависимость учитывают отдельно — этому посвящена подтема 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "raznye-nabory",
      navLabel: "Разные наборы букв",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для умножения необязательно, чтобы набор разрешённых букв
              оставался одинаковым. Важно, чтобы число продолжений было
              одинаковым.
            </strong>{" "}
            Составим из <Notation>{"АОБВГ"}</Notation> трёхбуквенные слова без
            повторений. На первом месте — 5 вариантов, после любого первого
            выбора на втором — 4, после любых двух различных букв на третьем —
            3. Поэтому 5 · 4 · 3 = 60.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbShrink_b80ea4}
            caption={
              <>
                После первой А остаются О, Б, В, Г, после первой Г — А, О, Б, В.
                Буквы разные, но их всегда четыре, а после двух выбранных букв —
                три.
              </>
            }
          />
          <Typography.Text>
            А если после одних выборов остаётся два продолжения, а после других
            пять, один общий множитель уже не описывает ситуацию. Тогда удобно
            разделить варианты на случаи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "slozhenie",
      navLabel: "Сложение случаев",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сложение используется для разных, не пересекающихся случаев.
            </strong>{" "}
            Пусть разрешены слова длины 2 или длины 3 из{" "}
            <Notation>{"АОБВГ"}</Notation>. Двухбуквенных слов 5² = 25,
            трёхбуквенных 5³ = 125. Ни одно слово не может одновременно иметь
            длину 2 и 3, поэтому всего 25 + 125 = 150.
          </Typography.Text>
          <Typography.Text>
            Это <strong>правило сложения</strong>:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Если подходящие объекты разбиты на непересекающиеся группы, общее
              количество равно сумме размеров этих групп.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Ключевое слово — <strong>непересекающиеся</strong>. Рассмотрим
            другое условие:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Трёхбуквенное слово из <Notation>{"АОБВГ"}</Notation> начинается с{" "}
              <Notation>{"А"}</Notation> или заканчивается на{" "}
              <Notation>{"А"}</Notation>.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Начинаются с <Notation>{"А"}</Notation> 1 · 5 · 5 = 25 слов,
            заканчиваются на <Notation>{"А"}</Notation> 5 · 5 · 1 = 25 слов. Но
            ответ <strong>не равен</strong> 25 + 25 = 50: слова{" "}
            <Notation>{"ААА"}</Notation>, <Notation>{"АОА"}</Notation>,{" "}
            <Notation>{"АБА"}</Notation>, <Notation>{"АВА"}</Notation>,{" "}
            <Notation>{"АГА"}</Notation> посчитаны дважды.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbOrGrid_fa18af}
            caption={
              <>
                Клетка — первая и последняя буквы трёхбуквенного слова, в каждой
                клетке 5 слов: средняя буква любая. Строка А и столбец А — по 25
                слов, а клетка на их пересечении входит в обе.
              </>
            }
          />
          <Typography.Text>
            Эти пять слов удовлетворяют обоим условиям, поэтому 25 + 25 − 5 =
            45. Общее правило:
          </Typography.Text>
          <Typography.Text>
            <strong>
              первое условие или второе = первое + второе − оба сразу.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Здесь «или» допускает выполнение обоих условий. Если требуется{" "}
            <strong>ровно одно</strong> из них, это должно быть отдельно
            сказано.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bez-povtorenij",
      navLabel: "Без повторений",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если каждую букву нужно использовать ровно один раз, множители
              уменьшаются до единицы.
            </strong>{" "}
            Расставим все пять букв <Notation>{"АОБВГ"}</Notation>, используя
            каждую ровно один раз. На первое место можно поставить любую из
            пяти, на второе — любую из четырёх оставшихся, затем из трёх, из
            двух и последнюю: 5 · 4 · 3 · 2 · 1 = 120.
          </Typography.Text>
          <Typography.Text>
            Такое произведение записывают короче: 5! = 120. Знак{" "}
            <Notation>{"!"}</Notation> здесь называется{" "}
            <strong>факториалом</strong>: n! = n · (n − 1) · … · 2 · 1.
            Например, 3! = 6. Количество способов переставить n различных
            объектов равно n!, а сами такие расстановки называют{" "}
            <strong>перестановками</strong>.
          </Typography.Text>
          <Typography.Text>
            Если букв в алфавите m, а слово имеет длину n ≤ m, без повторений
            получаем m · (m − 1) · … · (m − n + 1): ровно n множителей, по
            одному на каждое место. Так получились 5 · 4 · 3 = 60 трёхбуквенных
            слов выше.{" "}
            <strong>Не нужно продолжать произведение до единицы</strong>:
            оставшиеся две буквы в слово не входят.
          </Typography.Text>
          <Typography.Text>
            Если n {">"} m, составить слово без повторений невозможно: различных
            букв недостаточно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-product",
      navLabel: "Перебор product",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Программа перебирает те же позиции, что и рассуждение.
            </strong>{" "}
            Перебрать слова означает последовательно получить каждый возможный
            вариант. Двухсимвольный код из дерева выше перебирают двумя{" "}
            <PythonTerm term="nested">вложенными циклами</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              "for first in 'АБ':\n    for second in '012':\n        print(first + second)"
            }
            label={
              "Двухсимвольный код из дерева выше перебирают двумя {{nested|вложенными циклами}}"
            }
            language="python"
            output={"А0\nА1\nА2\nБ0\nБ1\nБ2"}
          />
          <Typography.Text>
            Сначала первая буква фиксирована, а вторая перебирает все варианты;
            затем меняется первая. Это ветви дерева сверху вниз, а{" "}
            <Notation>{"+"}</Notation> склеивает две{" "}
            <PythonTerm term="str">строки</PythonTerm>.
          </Typography.Text>
          <Typography.Text>
            Для пяти позиций пришлось бы писать пять вложенных циклов. Вместо
            этого используют функцию{" "}
            <PythonTerm term="product">
              <Notation>{"product"}</Notation>
            </PythonTerm>{" "}
            из модуля <Notation>{"itertools"}</Notation>: она перебирает все
            наборы по позициям сразу.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nwords = []\nfor letters in product('АОБВГ', repeat=5):\n    words.append(''.join(letters))\n\nprint(len(words))\nprint(words[0], words[1], words[2], words[5])\nprint(words[-1])"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"3125\nААААА ААААО ААААБ АААОА\nГГГГГ"}
          />
          <Typography.Text>
            <Notation>{"product"}</Notation> выдаёт{" "}
            <PythonTerm term="tuple">кортеж</PythonTerm> букв, например{" "}
            <Notation>{"('А', 'О', 'Б', 'В', 'Г')"}</Notation>, а{" "}
            <Notation>{"''.join(letters)"}</Notation> склеивает его в строку:
            пустая строка перед <Notation>{".join"}</Notation> — разделитель,
            между буквами ничего не вставляется. Слова собраны в{" "}
            <PythonTerm term="list">список</PythonTerm> только для того, чтобы
            посмотреть на их порядок.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"repeat=5"}</Notation> задаёт{" "}
            <strong>длину слова</strong>, а не то, что каждая буква должна
            встретиться пять раз. И <Notation>{"product"}</Notation> не требует
            использовать все буквы алфавита: слово{" "}
            <Notation>{"ААААА"}</Notation> тоже создаётся.
          </Typography.Text>
          <Typography.Text>
            <strong>
              <Notation>{"product"}</Notation> меняет правую позицию быстрее
              левых и идёт в порядке символов входной строки.
            </strong>{" "}
            После <Notation>{"ААААА"}</Notation> идёт{" "}
            <Notation>{"ААААО"}</Notation>, а не <Notation>{"ААААБ"}</Notation>:
            в строке <Notation>{"'АОБВГ'"}</Notation> буква{" "}
            <Notation>{"О"}</Notation> стоит раньше <Notation>{"Б"}</Notation>.
            Этот порядок понадобится, когда слова будут нумеровать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "schyotchik",
      navLabel: "Счётчик",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для подсчёта слов достаточно счётчика: хранить все слова не
              требуется.
            </strong>{" "}
            Посчитаем слова, которые начинаются с гласной и заканчиваются
            согласной. Каждую фразу условия переводим в отдельную проверку.
            Первая буква —{" "}
            <PythonTerm term="slice">
              <Notation>{"word[0]"}</Notation>
            </PythonTerm>
            , последняя — <Notation>{"word[-1]"}</Notation>, а{" "}
            <PythonTerm term="in">
              <Notation>{"word[0] in 'АО'"}</Notation>
            </PythonTerm>{" "}
            проверяет, что первая буква — одна из букв строки{" "}
            <Notation>{"'АО'"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АОБВГ', repeat=5):\n    word = ''.join(letters)\n    if word[0] in 'АО' and word[-1] in 'БВГ':\n        count += 1\n\nprint(count)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"750"}
          />
          <Typography.Text>
            Программа дала <strong>то же 750</strong>, что и правило умножения.{" "}
            <Notation>{"count = 0"}</Notation> — сначала подходящих слов ноль,{" "}
            <PythonTerm term="augassign">
              <Notation>{"count += 1"}</Notation>
            </PythonTerm>{" "}
            добавляет единицу за каждое подходящее слово,{" "}
            <PythonTerm term="andor">
              <Notation>{"and"}</Notation>
            </PythonTerm>{" "}
            требует обоих условий сразу.
          </Typography.Text>
          <Typography.Text>
            Позиции в Python нумеруются с нуля: первая буква —{" "}
            <Notation>{"word[0]"}</Notation>, вторая —{" "}
            <Notation>{"word[1]"}</Notation>, последняя —{" "}
            <Notation>{"word[-1]"}</Notation>. Выбери ограничение, чтобы увидеть
            его проверку:
          </Typography.Text>
          <VariantPicker
            label={"Ограничение на позицию и проверка"}
            variants={[
              {
                label: "первая не А",
                value: (
                  <>
                    <Notation>{"word[0] != 'А'"}</Notation>
                  </>
                ),
              },
              {
                label: "последняя Б",
                value: (
                  <>
                    <Notation>{"word[-1] == 'Б'"}</Notation>
                  </>
                ),
              },
              {
                label: "первая А или О",
                value: (
                  <>
                    <Notation>{"word[0] in 'АО'"}</Notation>
                  </>
                ),
              },
              {
                label: "последняя не гласная",
                value: (
                  <>
                    <Notation>{"word[-1] not in 'АО'"}</Notation>
                  </>
                ),
              },
              {
                label: "на втором месте не Г",
                value: (
                  <>
                    <Notation>{"word[1] != 'Г'"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "permutations",
      navLabel: "Перебор permutations",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Слова без повторений перебирает{" "}
              <Notation>{"permutations"}</Notation>.
            </strong>{" "}
            Функция{" "}
            <PythonTerm term="permutations">
              <Notation>{"permutations"}</Notation>
            </PythonTerm>{" "}
            из того же модуля строит последовательности, в которых каждая буква
            входа использована не больше одного раза. Разницу видно на парах из
            трёх букв:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.comboGrids_23b46d}
            caption={
              <>
                Пары из букв А, О, Б. Перебор product берёт все 9 клеток;
                permutations убирает диагональ — повтор буквы; combinations
                оставляет одну пару из АО и ОА — порядок не важен; последняя
                сетка — выбор с повторами без учёта порядка.
              </>
            }
          />
          <Typography.Text>
            Посчитаем трёхбуквенные слова без повторений двумя способами:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations, product\n\nprint(len(list(permutations('АОБВГ', 3))))\n\ncount = 0\nfor letters in product('АОБВГ', repeat=3):\n    if len(set(letters)) == 3:\n        count += 1\nprint(count)"
            }
            label={
              "Посчитаем трёхбуквенные слова без повторений двумя способами"
            }
            language="python"
            output={"60\n60"}
          />
          <Typography.Text>
            Второй способ проверяет повторы{" "}
            <PythonTerm term="set">множеством</PythonTerm>:{" "}
            <Notation>{"set(letters)"}</Notation> оставляет только различные
            буквы, поэтому{" "}
            <PythonTerm term="len">
              <Notation>{"len(set(letters)) == 3"}</Notation>
            </PythonTerm>{" "}
            значит, что все три буквы разные. Если хотя бы одна буква
            повторяется, различных букв меньше длины слова. Множество удобно для
            проверки уникальности, но не для задания порядка: алфавит храни
            строкой.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"combinations"}</Notation> выбирает наборы без учёта
            порядка, а слова <Notation>{"АО"}</Notation> и{" "}
            <Notation>{"ОА"}</Notation> разные. Поэтому{" "}
            <strong>
              для подсчёта слов <Notation>{"permutations"}</Notation> нельзя
              заменять на <Notation>{"combinations"}</Notation>
            </strong>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ocenka-perebora",
      navLabel: "Оценка перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>Перед перебором оцени, сколько вариантов получится.</strong>{" "}
            <Notation>{"product"}</Notation> из m символов длины n создаёт mⁿ
            вариантов. Например, 5⁶ = 15 625 и 7⁷ = 823 543 программа перебирает
            за доли секунды, десятки миллионов — за секунды, а 8¹⁰ = 1 073 741
            824 — уже слишком долго. Фактическое время зависит от программы и
            компьютера.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"product"}</Notation> выдаёт варианты по одному, но{" "}
            <strong>не уменьшает их количество</strong>. Поэтому решение
            строится так же, как подсчёт: описать позиции, перевести каждое
            ограничение в проверку, оценить объём. Задачи с миллиардами
            вариантов разобраны в дополнительном уроке 7.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "slova-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Слово — последовательность символов; алфавит — различные
                    разрешённые символы, запас букв — другое условие.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Правило умножения: mⁿ слов длины n, ограничение на позицию
                    меняет свой множитель.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Без повторений: m · (m − 1) · … — n множителей; перестановки
                    n разных букв — n!.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Непересекающиеся случаи складываются; при «или» пересечение
                    вычитают.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"product(алфавит, repeat=n)"}</Notation>{" "}
                    перебирает слова,{" "}
                    <Notation>{"permutations(алфавит, n)"}</Notation> — слова
                    без повторов; перед перебором оцени mⁿ.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "vybor-mest",
      navLabel: "Выбор мест",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие «ровно k одинаковых букв» состоит из двух действий:
              выбрать места для этой буквы и заполнить остальные.
            </strong>{" "}
            Это самое частое ограничение задания: в 58 задачах из 133
            спрашивают, сколько раз встречается буква, — «ровно», «не менее»,
            «не более», «хотя бы одна». Из 25 задач 2025–2026 годов таких 20.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем считать пятибуквенные слова из букв{" "}
            <Notation>{"А"}</Notation>, <Notation>{"Б"}</Notation>,{" "}
            <Notation>{"В"}</Notation>, <Notation>{"Г"}</Notation>; повторения
            разрешены, всего таких слов 4⁵ = 1024.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "mesta-bez-poryadka",
      navLabel: "Места без порядка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Места для одинаковых букв выбирают без учёта порядка.
            </strong>{" "}
            Пусть в пятибуквенном слове буква <Notation>{"А"}</Notation> должна
            встретиться ровно два раза. Прежде всего нужно выбрать два места для{" "}
            <Notation>{"А"}</Notation>. На первый взгляд вариантов 5 · 4 = 20.
          </Typography.Text>
          <Typography.Text>
            Но так мы различаем «сначала место 1, потом место 3» и «сначала
            место 3, потом место 1». Для итогового слова это одно и то же: буквы{" "}
            <Notation>{"А"}</Notation> стоят на местах 1 и 3.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbPlaces5_2}
            caption={
              <>
                Все способы поставить две А на пять мест: их 5 · 4 / 2 = 10.
                Пара мест 1 и 3 — это одна строка, хотя выбрать её по очереди
                можно двумя порядками.
              </>
            }
          />
          <Typography.Text>
            Каждая пара посчитана дважды: 20 / 2 = 10. Такой выбор называется{" "}
            <strong>сочетанием</strong>: мы выбираем объекты, но порядок их
            выбора не имеет значения. Количество способов выбрать k позиций из n
            обозначают Cₙᵏ, здесь C₅² = 10.
          </Typography.Text>
          <Typography.Text>
            В общем случае Cₙᵏ считают так же, как C₅²: выбирают k разных
            позиций по очереди, n · (n − 1) · … · (n − k + 1) способами, и делят
            на k! — столько порядков выбора у каждого набора. Например, C₆² = 6
            · 5 / 2 = 15, C₆³ = 6 · 5 · 4 / (3 · 2 · 1) = 20.
          </Typography.Text>
          <ProofDisclosure summary="Формула Cₙᵏ через факториалы и крайние случаи">
            <Typography.Text>
              Выберем k разных позиций последовательно: n(n − 1)…(n − k + 1)
              способов. Каждый окончательный набор из k позиций посчитан k! раз
              — по числу возможных порядков его выбора. Поэтому
            </Typography.Text>
            <Typography.Text>
              Cₙᵏ = n(n − 1)…(n − k + 1) / k! = n! / (k! · (n − k)!).
            </Typography.Text>
            <Typography.Text>
              Полезны и крайние случаи: Cₙ⁰ = 1, Cₙⁿ = 1. Выбрать ни одной
              позиции можно одним способом: ничего не выбирать. Выбрать все
              позиции тоже можно одним способом. Для согласованности этих формул
              принимают 0! = 1.
            </Typography.Text>
            <Typography.Text>
              В других учебниках то же число обозначают (n k) с числами одно над
              другим; оба обозначения означают одно и то же.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <strong>Как понять, нужен ли порядок?</strong> Выбираем места, где
            будут стоять одинаковые буквы, — порядок выбора мест не важен.
            Расставляем разные буквы по местам — порядок важен.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ostalnye-pozicii",
      navLabel: "Остальные позиции",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              После выбора мест остальные позиции заполняют другими буквами.
            </strong>{" "}
            Первое действие — выбрать места двух <Notation>{"А"}</Notation>: C₅²
            = 10. Второе — заполнить оставшиеся три позиции. На каждой из них
            доступны только <Notation>{"Б"}</Notation>,{" "}
            <Notation>{"В"}</Notation>, <Notation>{"Г"}</Notation>: букву{" "}
            <Notation>{"А"}</Notation> использовать больше нельзя, иначе их
            станет больше двух. Получаем
          </Typography.Text>
          <Typography.Text>C₅² · 3³ = 10 · 27 = 270.</Typography.Text>
          <Typography.Text>
            Общая формула при отсутствии других ограничений —{" "}
            <strong>Cₙᵏ · (m − 1)ⁿ⁻ᵏ</strong>. Множитель Cₙᵏ выбирает места
            данной буквы, на этих местах выбора уже нет, а (m − 1)ⁿ⁻ᵏ заполняет
            остальные места другими буквами.
          </Typography.Text>
          <Typography.Text>
            Частая ошибка — Cₙᵏ · mⁿ⁻ᵏ. Так мы{" "}
            <strong>снова разрешаем данную букву</strong> на остальных местах и
            нарушаем слово «ровно».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-glasnyh",
      navLabel: "Несколько гласных",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если требуется ровно несколько гласных, нужно учитывать и выбор
              самих гласных.
            </strong>{" "}
            В алфавите <Notation>{"АБВГ"}</Notation> гласная одна, поэтому здесь
            вернёмся к алфавиту <Notation>{"АОБВГ"}</Notation> из подтемы 1.
            Нужно составить шестибуквенное слово с ровно двумя гласными,
            повторения разрешены.
          </Typography.Text>
          <ol>
            <li>Выбрать два места для гласных: C₆² = 15.</li>
            <li>
              На каждом выбранном месте поставить <Notation>{"А"}</Notation> или{" "}
              <Notation>{"О"}</Notation>: 2².
            </li>
            <li>
              На остальных четырёх местах поставить одну из трёх согласных: 3⁴.
            </li>
          </ol>
          <Typography.Text>
            Итого C₆² · 2² · 3⁴ = 15 · 4 · 81 = 4860. В общем случае, если есть
            v гласных и c согласных, <strong>Cₙᵏ · vᵏ · cⁿ⁻ᵏ</strong> —
            количество слов с ровно k гласными, если повторения разрешены и
            других ограничений нет.
          </Typography.Text>
          <Typography.Text>
            <strong>
              «Ровно две гласные» и «ровно две различные гласные» — разные
              условия.
            </strong>{" "}
            Первое значит, что две позиции заняты гласными. Второе — что в слове
            встречаются два разных вида гласных, возможно многократно. В{" "}
            <Notation>{"ААББ"}</Notation> две гласные буквы, но только одна
            различная гласная — <Notation>{"А"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "hotya-by-ne-bolee",
      navLabel: "«Хотя бы» и «не более»",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Слова «хотя бы» и «не более» нужно переводить в точные количества.
            </strong>{" "}
            Выбери формулировку, чтобы увидеть, сколько раз буква может
            встретиться:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка и допустимое число появлений"}
            variants={[
              { label: "ровно 2", value: <>2</> },
              { label: "не более 2", value: <>0, 1, 2</> },
              { label: "не менее 2", value: <>2, 3, 4, …</> },
              { label: "более 2", value: <>3, 4, 5, …</> },
              { label: "хотя бы одна", value: <>1, 2, 3, …</> },
              { label: "ни одной", value: <>0</> },
            ]}
          />
          <Typography.Text>
            В частности,{" "}
            <strong>«не более двух» допускает отсутствие буквы</strong>. Если в
            пятибуквенном слове из <Notation>{"АБВГ"}</Notation> должно быть не
            более двух <Notation>{"А"}</Notation>, можно отдельно посчитать
            слова без <Notation>{"А"}</Notation> — 3⁵, с одной{" "}
            <Notation>{"А"}</Notation> — C₅¹ · 3⁴, с двумя — C₅² · 3³. Эти
            случаи не пересекаются: 243 + 405 + 270 = 918.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dopolnenie",
      navLabel: "Подсчёт через дополнение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Иногда проще посчитать неподходящие слова и вычесть их из всех.
            </strong>{" "}
            Пусть требуется хотя бы одна <Notation>{"А"}</Notation>. Можно
            складывать случаи с одной, двумя, тремя, четырьмя и пятью{" "}
            <Notation>{"А"}</Notation>, но есть рассуждение короче.
          </Typography.Text>
          <Typography.Text>
            Всего слов 4⁵ = 1024. Не подходят только слова, где{" "}
            <Notation>{"А"}</Notation> нет вообще; они составляются из трёх
            остальных букв, их 3⁵ = 243. Значит, подходящих 4⁵ − 3⁵ = 781.
          </Typography.Text>
          <Typography.Text>
            Это <strong>подсчёт через дополнение</strong>: из всех объектов
            вычитают те, которые не удовлетворяют условию. Важно вычесть{" "}
            <strong>именно противоположное</strong> условие:
          </Typography.Text>
          <ul>
            <li>
              противоположность «хотя бы одна <Notation>{"А"}</Notation>» — «ни
              одной <Notation>{"А"}</Notation>»;
            </li>
            <li>
              противоположность «не менее двух <Notation>{"А"}</Notation>» —
              «ноль или одна <Notation>{"А"}</Notation>»;
            </li>
            <li>
              противоположность «ровно две <Notation>{"А"}</Notation>» — все
              количества, кроме двух.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "peresecheniya",
      navLabel: "Пересечения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если обязательных букв несколько, при вычитании тоже возникают
              пересечения.
            </strong>{" "}
            Пусть слово должно содержать и <Notation>{"А"}</Notation>, и{" "}
            <Notation>{"Б"}</Notation>. Начнём со всех 4⁵ слов и вычтем слова
            без <Notation>{"А"}</Notation> (3⁵) и слова без{" "}
            <Notation>{"Б"}</Notation> (ещё 3⁵). Но слова только из{" "}
            <Notation>{"В"}</Notation> и <Notation>{"Г"}</Notation> попали в оба
            вычитаемых набора: их вычли дважды, хотя следовало исключить один
            раз. Поэтому один раз возвращаем их:
          </Typography.Text>
          <Typography.Text>
            4⁵ − 3⁵ − 3⁵ + 2⁵ = 1024 − 243 − 243 + 32 = 570.
          </Typography.Text>
          <Typography.Text>
            Это тот же учёт пересечения, что и в условии «начинается с{" "}
            <Notation>{"А"}</Notation> или заканчивается на{" "}
            <Notation>{"А"}</Notation>» из подтемы 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razbor-sluchaev",
      navLabel: "Разбор случаев",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Несколько ограничений удобно совмещать через разбор случаев.
            </strong>{" "}
            Рассмотрим задачу:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Пятибуквенные слова составляются из <Notation>{"АБВГ"}</Notation>.
              В слове ровно две <Notation>{"А"}</Notation>, и оно не начинается
              с <Notation>{"Б"}</Notation>. Повторения разрешены.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Ограничение на первую позицию мешает сразу применить одну формулу.
            Разделим слова по первой букве:
          </Typography.Text>
          <ul>
            <li>
              <strong>
                первая буква — <Notation>{"А"}</Notation>
              </strong>
              : одну <Notation>{"А"}</Notation> уже использовали, место второй
              выбираем среди четырёх оставшихся, остальные три места заполняем
              буквами <Notation>{"Б"}</Notation>, <Notation>{"В"}</Notation>,{" "}
              <Notation>{"Г"}</Notation> — 4 · 3³ = 108;
            </li>
            <li>
              <strong>
                первая буква — <Notation>{"В"}</Notation> или{" "}
                <Notation>{"Г"}</Notation>
              </strong>
              : первая позиция — 2 варианта, места двух{" "}
              <Notation>{"А"}</Notation> выбираем среди четырёх оставшихся, ещё
              две позиции заполняем любыми буквами, кроме{" "}
              <Notation>{"А"}</Notation>, — 2 · C₄² · 3² = 2 · 6 · 9 = 108.
            </li>
          </ul>
          <Typography.Text>
            Всего 108 + 108 = 216. Можно решить и вычитанием: всех слов с двумя{" "}
            <Notation>{"А"}</Notation> — 270, из них начинаются с{" "}
            <Notation>{"Б"}</Notation> C₄² · 3² = 54, ответ 270 − 54 = 216.{" "}
            <strong>Два разных рассуждения дали один результат</strong> — такая
            проверка особенно полезна при подготовке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "programma-frazy",
      navLabel: "Программа по фразам",
      explanation: (
        <>
          <Typography.Text>
            <strong>Программа проверяет каждую фразу условия отдельно.</strong>{" "}
            Решим ту же задачу перебором:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АБВГ', repeat=5):\n    word = ''.join(letters)\n    if word.count('А') == 2 and word[0] != 'Б':\n        count += 1\n\nprint(count)"
            }
            label={
              "Программа проверяет каждую фразу условия отдельно. Решим ту же задачу перебором"
            }
            language="python"
            output={"216"}
          />
          <Typography.Text>
            <PythonTerm term="strmeth">
              <Notation>{"word.count('А')"}</Notation>
            </PythonTerm>{" "}
            — число букв <Notation>{"А"}</Notation> в строке,{" "}
            <PythonTerm term="eq">
              <Notation>{"=="}</Notation>
            </PythonTerm>{" "}
            — проверка равенства, а <Notation>{"!="}</Notation> — «не равно».
            Выбери требование, чтобы увидеть его проверку:
          </Typography.Text>
          <VariantPicker
            label={"Требование и проверка"}
            variants={[
              {
                label: "ровно две А",
                value: (
                  <>
                    <Notation>{"word.count('А') == 2"}</Notation>
                  </>
                ),
              },
              {
                label: "не более двух А",
                value: (
                  <>
                    <Notation>{"word.count('А') <= 2"}</Notation>
                  </>
                ),
              },
              {
                label: "хотя бы одна А",
                value: (
                  <>
                    <Notation>{"'А' in word"}</Notation>
                  </>
                ),
              },
              {
                label: "буквы А нет",
                value: (
                  <>
                    <Notation>{"'А' not in word"}</Notation>
                  </>
                ),
              },
              {
                label: "есть и А, и Б",
                value: (
                  <>
                    <Notation>{"'А' in word and 'Б' in word"}</Notation>
                  </>
                ),
              },
              {
                label: "есть А или Б",
                value: (
                  <>
                    <Notation>{"'А' in word or 'Б' in word"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            <Notation>{"in"}</Notation> проверяет присутствие,{" "}
            <Notation>{"not in"}</Notation> — отсутствие. С этими проверками
            перебор подтверждает остальные числа страницы:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nexact = 0\nat_most = 0\nat_least = 0\nboth = 0\nfor letters in product('АБВГ', repeat=5):\n    word = ''.join(letters)\n    if word.count('А') == 2:\n        exact += 1\n    if word.count('А') <= 2:\n        at_most += 1\n    if 'А' in word:\n        at_least += 1\n    if 'А' in word and 'Б' in word:\n        both += 1\n\nprint(exact, at_most, at_least, both)"
            }
            label={
              "С этими проверками перебор подтверждает остальные числа страницы"
            }
            language="python"
            output={"270 918 781 570"}
          />
        </>
      ),
    },
    {
      id: "glasnye-ciklom",
      navLabel: "Гласные циклом",
      explanation: (
        <>
          <Typography.Text>
            <strong>Несколько гласных удобно считать циклом.</strong> Чтобы
            узнать число гласных позиций, складывают количества каждой гласной:
          </Typography.Text>
          <CodeBlock
            code={
              "word = 'ОБАВО'\nvowel_count = 0\nfor vowel in 'АО':\n    vowel_count += word.count(vowel)\n\nprint(vowel_count, word.count('АО'))"
            }
            label={
              "Чтобы узнать число гласных позиций, складывают количества каждой гласной"
            }
            language="python"
            output={"3 0"}
          />
          <Typography.Text>
            Сначала прибавляем число <Notation>{"А"}</Notation>, затем число{" "}
            <Notation>{"О"}</Notation>: в <Notation>{"ОБАВО"}</Notation> гласных
            позиций три. А <Notation>{"word.count('АО')"}</Notation> считает
            непрерывные фрагменты <Notation>{"АО"}</Notation> —{" "}
            <strong>
              она не считает отдельно <Notation>{"А"}</Notation> и{" "}
              <Notation>{"О"}</Notation>
            </strong>
            . С правильной проверкой перебор подтверждает 4860 шестибуквенных
            слов с ровно двумя гласными:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АОБВГ', repeat=6):\n    word = ''.join(letters)\n    vowel_count = 0\n    for vowel in 'АО':\n        vowel_count += word.count(vowel)\n    if vowel_count == 2:\n        count += 1\n\nprint(count)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"4860"}
          />
        </>
      ),
    },
    {
      id: "odinakovye-bukvy",
      navLabel: "Одинаковые буквы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При перестановке одинаковых букв нельзя считать их различными.
            </strong>{" "}
            Вернёмся к запасу букв из подтемы 1 и переставим все буквы слова{" "}
            <Notation>{"ТОПОТ"}</Notation>. Всего букв пять, но две{" "}
            <Notation>{"Т"}</Notation> одинаковы, две <Notation>{"О"}</Notation>{" "}
            одинаковы, а <Notation>{"П"}</Notation> одна. Если бы все буквы
            различались, получилось бы 5! = 120.
          </Typography.Text>
          <Typography.Text>
            Представим, что мы временно подписали одинаковые буквы: Т₁, Т₂, О₁,
            О₂, П. Перестановка Т₁ и Т₂ меняет подписанный вариант, но не меняет
            обычное слово. То же верно для двух <Notation>{"О"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbLabels_dadd31}
            caption={
              <>
                Слово ТОПОТ с подписанными буквами: Т₁ и Т₂ можно поменять
                местами, О₁ и О₂ тоже. 2! · 2! = 4 подписанных варианта дают
                одно обычное слово.
              </>
            }
          />
          <Typography.Text>
            Каждое обычное слово посчитано 2! · 2! = 4 раза, поэтому
            перестановок <strong>5! / (2! · 2!) = 30</strong>. В общем случае,
            если всего n букв, а отдельные буквы повторяются a, b, c, … раз,
            получаем n! / (a! · b! · c! · …).
          </Typography.Text>
          <Typography.Text>
            Те же 30 вариантов получаются выбором мест: два места для{" "}
            <Notation>{"Т"}</Notation> — C₅² = 10, из трёх оставшихся два для{" "}
            <Notation>{"О"}</Notation> — C₃² = 3, последнее место займёт{" "}
            <Notation>{"П"}</Notation>. Итого 10 · 3 = 30.
          </Typography.Text>
          <Typography.Text>
            У <Notation>{"permutations"}</Notation> здесь есть тонкость:
            одинаковые буквы на разных позициях входа она считает{" "}
            <strong>разными</strong>, поэтому одинаковые слова появляются
            несколько раз. Для небольшого слова дубликаты убирает множество:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\nprint(len(list(permutations('ТОПОТ'))))\nprint(len(set(permutations('ТОПОТ'))))"
            }
            label={"Для небольшого слова дубликаты убирает множество"}
            language="python"
            output={"120\n30"}
          />
          <Typography.Text>
            Но здесь создаются и хранятся все перестановки. Для длинных слов
            выгоднее формула с факториалами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bukva-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    «Ровно k» — выбрать места Cₙᵏ, затем заполнить остальные
                    места <strong>другими</strong> буквами: Cₙᵏ · (m − 1)ⁿ⁻ᵏ.
                  </>
                ),
              },
              {
                note: (
                  <>
                    «Не более» и «хотя бы» переводятся в точные количества;
                    иногда короче вычесть противоположное условие.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Несколько обязательных букв — вычитание с возвратом
                    пересечения; несколько ограничений — разбор случаев и
                    проверка вторым способом.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Перестановки букв с повторами: n! / (a! · b! · …), в
                    программе — <Notation>{"set(permutations(...))"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Проверки: <Notation>{"word.count('А') == 2"}</Notation>,{" "}
                    <Notation>{"'А' in word"}</Notation>, гласные — суммой{" "}
                    <Notation>{"count"}</Notation> по каждой гласной.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "sosedi-i-umnozhenie",
      navLabel: "Соседи и умножение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ограничение на соседние буквы проверяют по всем парам соседних
              позиций, а считают умножением с промежутками или блоками.
            </strong>{" "}
            Соседство встречается в 37 задачах из 133: одинаковые буквы не
            рядом, гласные не рядом, гласные и согласные чередуются, запрещено
            сочетание, «рядом с данной цифрой нет нечётных». Из 25 задач
            2025–2026 годов таких 11.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем считать слова из букв{" "}
            <Notation>{"А"}</Notation>, <Notation>{"Б"}</Notation>,{" "}
            <Notation>{"В"}</Notation>, <Notation>{"Г"}</Notation>, а для
            гласных — снова из <Notation>{"АОБВГ"}</Notation>. Счётчик
            подходящих слов и проверки <Notation>{"word.count(...)"}</Notation>{" "}
            и <Notation>{"in"}</Notation> из подтем 1 и 2 считаем знакомыми.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sosednie-pozicii",
      navLabel: "Соседние позиции",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Соседними называются символы на позициях 1 и 2, 2 и 3, …, n − 1 и
              n.
            </strong>{" "}
            В слове длины n имеется n − 1 соседних пар. Первая и последняя буквы
            обычного слова соседними не считаются: для этого в условии должно
            быть сказано, что последовательность замкнута в кольцо.
          </Typography.Text>
          <Typography.Text>
            Запреты «нет двух одинаковых букв подряд», «нет двух{" "}
            <Notation>{"А"}</Notation> подряд», «нет двух гласных подряд» и «
            <Notation>{"А"}</Notation> и <Notation>{"Б"}</Notation> не стоят
            рядом» — <strong>четыре разных ограничения</strong>. Выбери запрет,
            чтобы увидеть, нарушает ли его слово <Notation>{"АООБ"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Запрет и слово АООБ"}
            variants={[
              {
                label: "одинаковые подряд",
                value: (
                  <>
                    нарушает: <Notation>{"О"}</Notation> и{" "}
                    <Notation>{"О"}</Notation> стоят рядом
                  </>
                ),
              },
              {
                label: "две А подряд",
                value: (
                  <>
                    не нарушает: <Notation>{"А"}</Notation> в слове одна
                  </>
                ),
              },
              {
                label: "две гласные подряд",
                value: (
                  <>
                    нарушает: рядом <Notation>{"А"}</Notation> и{" "}
                    <Notation>{"О"}</Notation>, <Notation>{"О"}</Notation> и{" "}
                    <Notation>{"О"}</Notation>
                  </>
                ),
              },
              {
                label: "А и Б рядом",
                value: (
                  <>
                    не нарушает: между <Notation>{"А"}</Notation> и{" "}
                    <Notation>{"Б"}</Notation> две буквы
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "proverka-sosedej",
      navLabel: "Проверка соседей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Проверку соседних символов можно написать буквально по
              определению.
            </strong>{" "}
            Пусть запрещены любые две гласные подряд. Нажми «Запуск» и пройди
            программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runNeighbours}
            label={"Нажми «Запуск» и пройди программу по шагам"}
          />
          <Typography.Text>
            Переменная <Notation>{"good"}</Notation> хранит, подходит ли слово:
            сначала считаем, что подходит, а если нашли запрещённую пару, меняем
            значение на <Notation>{"False"}</Notation>. Такую переменную часто
            называют <strong>флагом</strong>: она хранит ответ «да или нет» о
            некотором свойстве.{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>{" "}
            прекращает цикл — одной запрещённой пары достаточно.
          </Typography.Text>
          <Typography.Text>
            Почему{" "}
            <PythonTerm term="for">
              <Notation>{"range(len(word) - 1)"}</Notation>
            </PythonTerm>
            ? Если длина слова 5, нужно проверить пары индексов (0, 1), (1, 2),
            (2, 3), (3, 4). Левый индекс принимает значения 0, 1, 2, 3 — именно
            их даёт <Notation>{"range(4)"}</Notation>. Если пройти до индекса 4
            включительно, обращение к <Notation>{"word[5]"}</Notation> выйдет за
            границы строки.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Флаг нужно заново устанавливать в <Notation>{"True"}</Notation>{" "}
              для каждого нового слова
            </strong>
            , иначе одна неудачная пара «испортит» все следующие слова.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odinakovye-sosedi",
      navLabel: "Одинаковые соседи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если запрещены любые одинаковые соседние буквы, количество легко
              получить умножением.
            </strong>{" "}
            Пусть алфавит содержит m букв, слово имеет длину n ≥ 1, повторения
            на несоседних местах разрешены. На первую позицию можно поставить
            любую букву — m вариантов. На каждую следующую — любую, кроме
            предыдущей: m − 1. Поэтому слов <strong>m · (m − 1)ⁿ⁻¹</strong>. Для
            пятибуквенных слов из <Notation>{"АБВГ"}</Notation> это 4 · 3⁴ =
            324.
          </Typography.Text>
          <Typography.Text>
            Это <strong>не</strong> запрет повторений вообще: слово{" "}
            <Notation>{"АБАБА"}</Notation> разрешено, буква{" "}
            <Notation>{"А"}</Notation> повторяется, но не стоит рядом с другой{" "}
            <Notation>{"А"}</Notation>. При полном запрете повторений
            пятибуквенных слов из четырёх букв не было бы вовсе.
          </Typography.Text>
          <Typography.Text>
            Перебор с флагом подтверждает подсчёт:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АБВГ', repeat=5):\n    word = ''.join(letters)\n    good = True\n    for i in range(len(word) - 1):\n        if word[i] == word[i + 1]:\n            good = False\n            break\n    if good:\n        count += 1\n\nprint(count)"
            }
            label={"Перебор с флагом подтверждает подсчёт"}
            language="python"
            output={"324"}
          />
        </>
      ),
    },
    {
      id: "promezhutki",
      navLabel: "Промежутки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если ровно k одинаковых букв не должны стоять рядом, удобно
              использовать промежутки.
            </strong>{" "}
            Пусть в шестибуквенном слове из <Notation>{"АБВГ"}</Notation> должны
            быть ровно две <Notation>{"А"}</Notation>, причём не рядом. Сначала
            составим последовательность из четырёх остальных букв; каждая
            выбирается из <Notation>{"БВГ"}</Notation>, вариантов 3⁴ = 81.
            Вокруг четырёх букв есть пять промежутков: перед первой, между
            соседними и после последней.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbGaps14}
            caption={
              <>
                Четыре буквы без А и пять промежутков вокруг них. Две А в разных
                промежутках никогда не окажутся рядом: между ними стоит хотя бы
                одна буква. Выбрать два промежутка из пяти можно C₅² = 10
                способами.
              </>
            }
          />
          <Typography.Text>
            Остаётся выбрать два промежутка из пяти для двух{" "}
            <Notation>{"А"}</Notation>: C₅² = 10. Получаем{" "}
            <strong>C₅² · 3⁴ = 10 · 81 = 810</strong>.
          </Typography.Text>
          <Typography.Text>
            Почему каждое слово учитывается ровно один раз? Из готового слова
            можно удалить все <Notation>{"А"}</Notation>. Получатся однозначно
            определённые остальные буквы и однозначно определённые промежутки,
            куда были вставлены <Notation>{"А"}</Notation>.
          </Typography.Text>
          <ProofDisclosure summary="Общая формула для k букв, которые не стоят рядом">
            <Typography.Text>
              Остальных букв n − k, промежутков вокруг них n − k + 1. Для данных
              букв выбираем k разных промежутков, остальные места заполняем
              любой из m − 1 других букв:
            </Typography.Text>
            <Typography.Text>C₍ₙ₋ₖ₊₁₎ᵏ · (m − 1)ⁿ⁻ᵏ.</Typography.Text>
            <Typography.Text>
              Если промежутков меньше, чем данных букв, то есть k {">"} n − k +
              1, вариантов нет. Например, невозможно расположить четыре{" "}
              <Notation>{"А"}</Notation> и две другие буквы так, чтобы никакие
              две <Notation>{"А"}</Notation> не соседствовали.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "podstroka",
      navLabel: "Фрагмент in",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Фрагмент <Notation>{"'АА' in word"}</Notation> — это две буквы
              подряд, а не две буквы где угодно.
            </strong>{" "}
            Поэтому «две <Notation>{"А"}</Notation> не рядом» проверяется так:
            ровно две <Notation>{"А"}</Notation> и нет фрагмента{" "}
            <Notation>{"АА"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АБВГ', repeat=6):\n    word = ''.join(letters)\n    if word.count('А') == 2 and 'АА' not in word:\n        count += 1\n\nprint(count)\nprint('АБ' in 'АВБ', 'АБ' in 'ВАБ')"
            }
            label={
              "Поэтому «две А не рядом» проверяется так: ровно две А и нет фрагмента АА"
            }
            language="python"
            output={"810\nFalse True"}
          />
          <Typography.Text>
            Выражение <Notation>{"'АБ' in word"}</Notation> проверяет{" "}
            <strong>непрерывный фрагмент</strong> <Notation>{"АБ"}</Notation>: в{" "}
            <Notation>{"АВБ"}</Notation> обе буквы есть, но не подряд. Если{" "}
            <Notation>{"А"}</Notation> и <Notation>{"Б"}</Notation> не должны
            соседствовать ни в каком порядке, нужно запретить{" "}
            <strong>оба направления</strong>:{" "}
            <Notation>{"'АБ' not in word and 'БА' not in word"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Так же проверяют условие «рядом с буквой <Notation>{"Б"}</Notation>{" "}
            нет буквы <Notation>{"А"}</Notation>». Посчитаем пятибуквенные слова
            из <Notation>{"АБВГ"}</Notation> с ровно одной{" "}
            <Notation>{"Б"}</Notation>, рядом с которой нет{" "}
            <Notation>{"А"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если <Notation>{"Б"}</Notation> стоит с краю, у неё один сосед —{" "}
            <Notation>{"В"}</Notation> или <Notation>{"Г"}</Notation>, а
            остальные три места заполняются из <Notation>{"А"}</Notation>,{" "}
            <Notation>{"В"}</Notation>, <Notation>{"Г"}</Notation>: 2 · 2 · 3³ =
            108. Если <Notation>{"Б"}</Notation> на одном из трёх средних мест,
            оба соседа из <Notation>{"В"}</Notation>, <Notation>{"Г"}</Notation>
            , ещё два места — из трёх букв: 3 · 2² · 3² = 108. Всего 216.
            Программа проверяет оба запрещённых фрагмента:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АБВГ', repeat=5):\n    word = ''.join(letters)\n    if (\n        word.count('Б') == 1\n        and 'АБ' not in word\n        and 'БА' not in word\n    ):\n        count += 1\n\nprint(count)"
            }
            label={"Программа проверяет оба запрещённых фрагмента"}
            language="python"
            output={"216"}
          />
          <Typography.Text>
            Если запрещённых соседей несколько, например любые гласные рядом с{" "}
            <Notation>{"Б"}</Notation>, удобнее проверить все соседние пары
            циклом, как в программе с флагом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "glasnye-ne-ryadom",
      navLabel: "Гласные не рядом",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Тот же способ промежутков работает для гласных, если любые две
              гласные запрещено ставить рядом.
            </strong>{" "}
            Вернёмся к шестибуквенным словам из <Notation>{"АОБВГ"}</Notation> с
            ровно двумя гласными: в подтеме 2 их получилось 4860. Чтобы гласные
            не соседствовали, выбираем четыре согласные — 3⁴, два промежутка из
            пяти — C₅², сами гласные — 2². Получаем C₅² · 2² · 3⁴ = 10 · 4 · 81
            = 3240.
          </Typography.Text>
          <Typography.Text>
            А если эти две гласные должны стоять рядом? Двухбуквенный фрагмент
            может начинаться с позиции 1, 2, 3, 4 или 5 — 5 вариантов. Сами
            гласные выбираются 2² способами, согласные — 3⁴: 5 · 2² · 3⁴ = 1620.
          </Typography.Text>
          <Typography.Text>
            Проверка: 3240 + 1620 = 4860. Для ровно двух гласных других случаев
            нет: они <strong>либо соседствуют, либо нет</strong>. Перебор с
            флагом считает обе группы:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\napart = 0\ntogether = 0\nfor letters in product('АОБВГ', repeat=6):\n    word = ''.join(letters)\n    if word.count('А') + word.count('О') != 2:\n        continue\n    good = True\n    for i in range(len(word) - 1):\n        if word[i] in 'АО' and word[i + 1] in 'АО':\n            good = False\n            break\n    if good:\n        apart += 1\n    else:\n        together += 1\n\nprint(apart, together)"
            }
            label={"Перебор с флагом считает обе группы"}
            language="python"
            output={"3240 1620"}
          />
          <Typography.Text>
            <PythonTerm term="continue">
              <Notation>{"continue"}</Notation>
            </PythonTerm>{" "}
            сразу переходит к следующему слову, если гласных не две.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "blok",
      navLabel: "Блок букв",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Несколько соседних букв иногда можно считать одним блоком.
            </strong>{" "}
            Нужно переставить четыре различные буквы{" "}
            <Notation>{"АБВГ"}</Notation> так, чтобы <Notation>{"А"}</Notation>{" "}
            и <Notation>{"Б"}</Notation> находились рядом. Объединим их в один
            блок. Тогда расставляются три объекта — блок,{" "}
            <Notation>{"В"}</Notation> и <Notation>{"Г"}</Notation> — 3! = 6
            способами. Внутри блока возможны два порядка,{" "}
            <Notation>{"АБ"}</Notation> и <Notation>{"БА"}</Notation>, поэтому
            всего 3! · 2 = 12. Если требуется именно последовательность{" "}
            <Notation>{"АБ"}</Notation>, внутренний порядок уже задан: 3! = 6.
          </Typography.Text>
          <Typography.Text>
            Но с повторяющимися буквами этот способ нужно применять{" "}
            <strong>осторожно</strong>. Посчитаем трёхбуквенные слова из{" "}
            <Notation>{"АБ"}</Notation>, содержащие <Notation>{"АА"}</Notation>.
            Если выбрать начало фрагмента <Notation>{"АА"}</Notation> двумя
            способами и оставшуюся букву двумя способами, получится 4. Однако
            подходят только три слова:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nfor letters in product('АБ', repeat=3):\n    word = ''.join(letters)\n    if 'АА' in word:\n        print(word)"
            }
            label={"Однако подходят только три слова"}
            language="python"
            output={"ААА\nААБ\nБАА"}
          />
          <Typography.Text>
            Слово <Notation>{"ААА"}</Notation> посчиталось бы дважды: фрагмент{" "}
            <Notation>{"АА"}</Notation> есть и на позициях 1–2, и на позициях
            2–3.{" "}
            <strong>
              Количество появлений фрагмента и количество слов, содержащих
              фрагмент, — разные величины.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chereduyutsya",
      navLabel: "Чередование",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если гласные и согласные чередуются, сначала удобно выбрать схему
              типов букв.
            </strong>{" "}
            В пятибуквенном слове возможны две схемы: «гласная — согласная —
            гласная — согласная — гласная» или «согласная — гласная — согласная
            — гласная — согласная». При двух гласных и трёх согласных, с
            разрешёнными повторениями:
          </Typography.Text>
          <Typography.Text>2³ · 3² + 3³ · 2² = 72 + 108 = 180.</Typography.Text>
          <Typography.Text>
            Если дополнительно запрещены повторения букв, степени применять
            нельзя: при каждом использовании буквы запас уменьшается.{" "}
            <strong>
              Сначала определяй схему расположения типов, затем считай способы
              её заполнения.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В программе «соседи разного типа» — это сравнение двух проверок:{" "}
            <Notation>{"word[i] in 'АО'"}</Notation> и{" "}
            <Notation>{"word[i + 1] in 'АО'"}</Notation> дают{" "}
            <Notation>{"True"}</Notation> или <Notation>{"False"}</Notation>, и
            если результаты равны, рядом стоят буквы одного типа.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АОБВГ', repeat=5):\n    word = ''.join(letters)\n    good = True\n    for i in range(len(word) - 1):\n        if (word[i] in 'АО') == (word[i + 1] in 'АО'):\n            good = False\n            break\n    if good:\n        count += 1\n\nprint(count)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"180"}
          />
        </>
      ),
    },
    {
      id: "nalozheniya",
      navLabel: "Наложения фрагмента",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если требуется количество появлений фрагмента, учитывай возможные
              наложения.
            </strong>{" "}
            В строке <Notation>{"АААА"}</Notation> фрагмент{" "}
            <Notation>{"АА"}</Notation> начинается на трёх позициях: 1–2, 2–3 и
            3–4. Но строковый метод <Notation>{"count"}</Notation> считает
            только неперекрывающиеся появления:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.overlap_b52f2a}
            caption={
              <>
                Фрагмент АА в строке АААА начинается с индексов 0, 1 и 2. Метод
                count находит вхождения с 0 и с 2, а вхождение с 1 пропускает:
                оно перекрывается с уже найденным.
              </>
            }
          />
          <Typography.Text>
            Чтобы учесть все начала фрагмента, проверяют каждый{" "}
            <PythonTerm term="slice">срез</PythonTerm> нужной длины:
          </Typography.Text>
          <CodeBlock
            code={
              "word = 'АААА'\nfragment = 'АА'\noccurrences = 0\nfor i in range(len(word) - len(fragment) + 1):\n    if word[i:i + len(fragment)] == fragment:\n        occurrences += 1\n\nprint(word.count(fragment), occurrences)"
            }
            label={
              "Чтобы учесть все начала фрагмента, проверяют каждый {{slice|срез}} нужной длины"
            }
            language="python"
            output={"2 3"}
          />
          <Typography.Text>
            Срез <Notation>{"word[a:b]"}</Notation> берёт символы с индекса{" "}
            <Notation>{"a"}</Notation> до индекса <Notation>{"b"}</Notation>, не
            включая <Notation>{"b"}</Notation>. Если длина слова n, а фрагмента
            k, то возможны n − k + 1 начальных позиций фрагмента. Для проверки
            простого наличия фрагмента достаточно <Notation>{"in"}</Notation>:
            вопрос о наложениях там не возникает.
          </Typography.Text>
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
                note: (
                  <>
                    Соседних пар n − 1; разные запреты соседства — разные
                    задачи.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Одинаковые не рядом: m · (m − 1)ⁿ⁻¹; данные буквы не рядом —
                    промежутки; буквы рядом — блок, но без двойного счёта.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Чередование типов — сначала схема типов, потом заполнение.
                  </>
                ),
              },
              {
                note: (
                  <>
                    В программе: флаг и цикл по{" "}
                    <Notation>{"range(len(word) - 1)"}</Notation>, фрагмент{" "}
                    <Notation>{"'АБ' in word"}</Notation> в обоих направлениях,
                    наложения — проверкой каждого среза.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "chislo-kak-slovo",
      navLabel: "Число как слово",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Запись числа можно рассматривать как слово из цифр, но у числа
              есть ограничение на первую позицию.
            </strong>{" "}
            Так устроены 34 задачи из 133: числа в системах с основанием от 4 до
            16, у которых цифры различны, чередуется чётность или рядом с данной
            цифрой нет нечётных. Из 25 задач 2025–2026 годов таких 15.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем считать четырёхзначные числа в шестеричной
            системе. Как устроена запись числа в системе с основанием q,
            разобрано в теме 5; здесь важно одно: цифры такой записи — значения
            0, 1, …, q − 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nachalnyj-nol",
      navLabel: "Начальный ноль",
      explanation: (
        <>
          <Typography.Text>
            <strong>Код может начинаться с нуля, а запись числа — нет.</strong>{" "}
            В системе счисления с основанием q используются цифры со значениями
            0, 1, 2, …, q − 1: в двоичной — <Notation>{"0"}</Notation> и{" "}
            <Notation>{"1"}</Notation>, в пятеричной — от{" "}
            <Notation>{"0"}</Notation> до <Notation>{"4"}</Notation>, в
            восьмеричной — от <Notation>{"0"}</Notation> до{" "}
            <Notation>{"7"}</Notation>. Пятисимвольный код может начинаться с
            нуля, например <Notation>{"00127"}</Notation>. Но обычная запись
            пятизначного числа с нуля не начинается: начальные нули не
            увеличивают число разрядов.
          </Typography.Text>
          <Typography.Text>
            Поэтому количество положительных n-значных чисел в системе с
            основанием q равно <strong>(q − 1) · qⁿ⁻¹</strong>: на первую
            позицию доступны q − 1 ненулевых цифр, на остальные — все q.
            Четырёхзначных шестеричных чисел 5 · 6³ = 1080.
          </Typography.Text>
          <Typography.Text>
            Формулировка решает всё. Выбери её, чтобы увидеть, разрешён ли
            начальный ноль:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка и начальный ноль"}
            variants={[
              {
                label: "код длины 3",
                value: (
                  <>
                    обычно разрешён: <Notation>{"007"}</Notation> — код
                  </>
                ),
              },
              {
                label: "трёхзначное число",
                value: <>запрещён: первая цифра не 0</>,
              },
              {
                label: "запись дополнена нулями до длины 3",
                value: (
                  <>
                    снова разрешён: <Notation>{"007"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Для одноразрядных чисел отдельно учитывай, входит ли в
            рассматриваемый диапазон сам ноль.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifry-chislami",
      navLabel: "Цифры числами",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Числовые последовательности удобнее перебирать как числа-цифры, а
              не как строки.
            </strong>{" "}
            <PythonTerm term="product">
              <Notation>{"product(range(6), repeat=4)"}</Notation>
            </PythonTerm>{" "}
            выдаёт наборы из четырёх целых чисел от 0 до 5 — цифры шестеричной
            записи:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor digits in product(range(6), repeat=4):\n    if digits[0] != 0:\n        count += 1\n\nprint(count)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"1080"}
          />
          <Typography.Text>
            <Notation>{"digits[0] != 0"}</Notation> проверяет начальный ноль,{" "}
            <Notation>{"sum(digits)"}</Notation> складывает значения цифр,{" "}
            <Notation>{"digits[0] < digits[1]"}</Notation> сравнивает их
            численно. Это особенно удобно для оснований больше 10, где значения
            цифр нельзя обозначить одним обычным десятичным символом.
          </Typography.Text>
          <Typography.Text>
            Если цифры записаны символами, помни:{" "}
            <Notation>{"'2' + '3'"}</Notation> даёт строку{" "}
            <Notation>{"'23'"}</Notation>, а{" "}
            <Notation>{"int('2') + int('3')"}</Notation> — число 5.{" "}
            <PythonTerm term="base">
              <Notation>{"int"}</Notation>
            </PythonTerm>{" "}
            преобразует строковую запись в целое число, а основание при
            необходимости указывают вторым аргументом:
          </Typography.Text>
          <CodeBlock
            code={
              "print('2' + '3', int('2') + int('3'))\nprint(int('1032', 6), int('D', 16), int('A0', 16))"
            }
            label={"Код на Python: print('2' + '3', int('2') + int('3'))"}
            language="python"
            output={"23 5\n236 13 160"}
          />
          <Typography.Text>
            Здесь 1032₆ = 1 · 6³ + 0 · 6² + 3 · 6 + 2 = 236. В системах с
            основанием больше 10 цифры со значениями 10, 11, … записывают
            буквами: в шестнадцатеричной <Notation>{"A"}</Notation> = 10, …,{" "}
            <Notation>{"D"}</Notation> = 13, <Notation>{"F"}</Notation> = 15.{" "}
            <strong>В переборе такие цифры — просто числа</strong>: «цифра
            больше 12» — это <Notation>{"d > 12"}</Notation>, «цифра D» —
            значение 13.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bez-povtora-cifr",
      navLabel: "Цифры без повторов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если цифры числа не повторяются, начальный ноль всё равно
              учитывается отдельно.
            </strong>{" "}
            Четырёхзначные шестеричные числа без повторений:
          </Typography.Text>
          <ul>
            <li>
              первая цифра — одна из <Notation>{"1"}</Notation>,{" "}
              <Notation>{"2"}</Notation>, <Notation>{"3"}</Notation>,{" "}
              <Notation>{"4"}</Notation>, <Notation>{"5"}</Notation>: 5
              вариантов;
            </li>
            <li>
              вторая — любая из пяти оставшихся цифр, включая возможный ноль: 5;
            </li>
            <li>третья — 4, четвёртая — 3.</li>
          </ul>
          <Typography.Text>
            Получаем 5 · 5 · 4 · 3 = 300. Первый и второй множители совпали, но{" "}
            <strong>по разным причинам</strong>: сначала исключили ноль, затем —
            уже использованную цифру.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\ncount = 0\nfor digits in permutations(range(6), 4):\n    if digits[0] != 0:\n        count += 1\n\nprint(count)"
            }
            label={"Код на Python: from itertools import permutations"}
            language="python"
            output={"300"}
          />
        </>
      ),
    },
    {
      id: "vozrastanie",
      navLabel: "Возрастание цифр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строгое возрастание или убывание цифр позволяет заменить
              расстановку выбором.
            </strong>{" "}
            Пусть нужно составить четырёхзначные шестеричные числа со строго
            убывающими цифрами, например 5320₆. Строгое убывание означает d₁{" "}
            {">"} d₂ {">"} d₃ {">"} d₄: все цифры различны. Как только мы
            выбрали четыре цифры, их порядок уже определён — от большей к
            меньшей.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbOneOrder5320}
            caption={
              <>
                Цифры 5, 3, 2, 0 можно расставить 4! = 24 способами, но строго
                убывают они только в одном — 5320. Поэтому каждый выбранный
                набор из четырёх цифр даёт ровно одно число.
              </>
            }
          />
          <Typography.Text>
            Поэтому таких чисел столько же, сколько наборов из четырёх цифр: C₆⁴
            = 15. Ноль выбирать можно: он окажется последним, а первая цифра
            строго убывающей записи будет ненулевой.
          </Typography.Text>
          <Typography.Text>
            Для строго возрастающих цифр ситуация другая. Если выбрать ноль, он
            окажется первым, и число перестанет быть четырёхзначным. Значит,
            четыре цифры выбираем только из <Notation>{"1"}</Notation>–
            <Notation>{"5"}</Notation>: C₅⁴ = 5.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ndown = 0\nup = 0\nfor d in product(range(6), repeat=4):\n    if d[0] != 0 and d[0] > d[1] > d[2] > d[3]:\n        down += 1\n    if d[0] != 0 and d[0] < d[1] < d[2] < d[3]:\n        up += 1\n\nprint(down, up)"
            }
            label={"Значит, четыре цифры выбираем только из 1–5: C₅⁴ = 5"}
            language="python"
            output={"15 5"}
          />
          <Typography.Text>
            Важно различать d₁ {"<"} d₂ {"<"} d₃ и d₁ ≤ d₂ ≤ d₃.{" "}
            <strong>Во втором случае равные цифры разрешены</strong>: это другое
            ограничение и другой подсчёт, в программе —{" "}
            <Notation>{"<="}</Notation> вместо <Notation>{"<"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetnost",
      navLabel: "Чётность",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чётность цифры и чётность всего числа нужно различать.
            </strong>{" "}
            Чётные цифры имеют значения 0, 2, 4, 6, …;{" "}
            <strong>ноль — чётная цифра</strong>. Если условие говорит о
            соседних чётных цифрах, проверяются именно значения отдельных цифр,
            в программе — <Notation>{"d % 2"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            А если требуется чётность всего числа, есть дополнительная тонкость:
          </Typography.Text>
          <ul>
            <li>
              в системе с чётным основанием чётность числа определяется
              последней цифрой;
            </li>
            <li>в системе с нечётным основанием — чётностью суммы цифр.</li>
          </ul>
          <Typography.Text>
            Почему? В записи d₁ · q² + d₂ · q + d₃ при чётном q первые два
            слагаемых чётные, всё решает d₃. При нечётном q все степени
            основания нечётные, поэтому каждое слагаемое имеет ту же чётность,
            что и соответствующая цифра. Например, 12₃ = 1 · 3 + 2 = 5:{" "}
            <strong>последняя цифра чётная, но само число нечётное</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ryadom-s-5",
      navLabel: "Рядом с 5",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие «рядом с цифрой 5 нет нечётных» проверяют по соседям этой
              цифры.
            </strong>{" "}
            Сначала проверим одно число 2501₆. Позицию цифры даёт{" "}
            <Notation>{"d.index(5)"}</Notation>, а соседи — позиции{" "}
            <Notation>{"i - 1"}</Notation> и <Notation>{"i + 1"}</Notation>,
            если они есть в записи. Нажми «Запуск» и пройди проверку по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runNeighbours5}
            label={"Нажми «Запуск» и пройди проверку по шагам"}
          />
          <Typography.Text>
            Соседи пятёрки — 2 и 0, оба чётные, а единица стоит не рядом с ней.
            Проверка <Notation>{"0 <= j < 4"}</Notation> отбрасывает
            несуществующих соседей: у цифры на краю сосед один. Теперь посчитаем
            все четырёхзначные шестеричные числа, в которых ровно одна цифра 5 и
            рядом с ней стоят только чётные цифры:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor d in product(range(6), repeat=4):\n    if d[0] == 0 or d.count(5) != 1:\n        continue\n    i = d.index(5)\n    good = True\n    for j in (i - 1, i + 1):\n        if 0 <= j < 4 and d[j] % 2 == 1:\n            good = False\n    if good:\n        count += 1\n\nprint(count)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"201"}
          />
          <ProofDisclosure summary="Проверка рассуждением: 201 по месту цифры 5">
            <Typography.Text>
              Чётные цифры — 0, 2, 4, ненулевые цифры кроме 5 — 1, 2, 3, 4.
            </Typography.Text>
            <ul>
              <li>
                5 на первом месте: второе — чётное (3 варианта), третье и
                четвёртое — любые, кроме 5: 3 · 5 · 5 = 75.
              </li>
              <li>
                5 на втором месте: первое — чётное и не ноль (2), третье —
                чётное (3), четвёртое — любое, кроме 5 (5): 2 · 3 · 5 = 30.
              </li>
              <li>
                5 на третьем месте: первое — ненулевое, кроме 5 (4), второе и
                четвёртое — чётные: 4 · 3 · 3 = 36.
              </li>
              <li>
                5 на четвёртом месте: первое — 4 варианта, второе — любое, кроме
                5 (5), третье — чётное (3): 4 · 5 · 3 = 60.
              </li>
            </ul>
            <Typography.Text>Всего 75 + 30 + 36 + 60 = 201.</Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "chetnost-chereduetsya",
      navLabel: "Чередование чётности",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Числа с различными цифрами и чередованием чётности считают по двум
              схемам типов.
            </strong>{" "}
            Разберём полностью задачу:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Сколько существует четырёхзначных чисел в шестеричной системе, у
              которых все цифры различны и чётные цифры чередуются с нечётными?
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Цифры 0, 1, 2, 3, 4, 5; чётные — 0, 2, 4, нечётные — 1, 3, 5.
            Возможны две схемы.
          </Typography.Text>
          <Typography.Text>
            Для схемы «чётная, нечётная, чётная, нечётная»: первая чётная не
            может быть нулём — 2 варианта; первая нечётная — 3; вторая чётная
            отличается от первой — 2; вторая нечётная отличается от предыдущей
            нечётной — 2. Получаем 2 · 3 · 2 · 2 = 24.
          </Typography.Text>
          <Typography.Text>
            Для схемы «нечётная, чётная, нечётная, чётная»: первая нечётная — 3;
            первая чётная, включая ноль, — 3; следующая нечётная — 2; следующая
            чётная — 2. Получаем 3 · 3 · 2 · 2 = 36. Всего 24 + 36 = 60.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\ncount = 0\nfor digits in permutations(range(6), 4):\n    if digits[0] != 0:\n        good = True\n        for i in range(3):\n            if digits[i] % 2 == digits[i + 1] % 2:\n                good = False\n                break\n        if good:\n            count += 1\n\nprint(count)"
            }
            label={"Всего 24 + 36 = 60"}
            language="python"
            output={"60"}
          />
          <Typography.Text>
            Одинаковые остатки при делении на 2 означают одинаковую чётность. В
            программе каждое условие задачи отвечает за отдельную часть:{" "}
            <Notation>{"permutations"}</Notation> обеспечивает отсутствие
            повторений, проверка первой цифры исключает начальный ноль, цикл
            проверяет все соседние пары.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlina-ne-zadana",
      navLabel: "Длина не задана",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если длина числа не задана, считают по каждой длине и складывают.
            </strong>{" "}
            Сколько натуральных чисел имеют шестеричную запись, в которой все
            цифры различны? Различных цифр шесть, поэтому{" "}
            <strong>запись не длиннее шести цифр</strong>. Для каждой длины
            работает правило умножения: одна цифра — 5 чисел, две — 5 · 5 = 25,
            три — 5 · 5 · 4 = 100 и так далее. Числа разной длины не
            пересекаются, поэтому результаты складываются — это правило сложения
            из подтемы 1:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\ntotal = 0\nfor length in range(1, 7):\n    n = len([p for p in permutations(range(6), length)\n             if p[0] != 0])\n    print(length, n)\n    total += n\n\nprint(total)"
            }
            label={"Код на Python: from itertools import permutations"}
            language="python"
            output={"1 5\n2 25\n3 100\n4 300\n5 600\n6 600\n1630"}
          />
          <Typography.Text>
            Внутри цикла{" "}
            <PythonTerm term="comp">списковое включение</PythonTerm> собирает
            подходящие перестановки одной длины, а <Notation>{"len"}</Notation>{" "}
            считает их. Длина 4 дала уже знакомые 300.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chisla-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Положительных n-значных чисел с основанием q: (q − 1) ·
                    qⁿ⁻¹; код, в отличие от числа, может начинаться с нуля.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Цифры перебирают числами:{" "}
                    <Notation>{"product(range(q), repeat=n)"}</Notation> и{" "}
                    <Notation>{"permutations(range(q), n)"}</Notation> с
                    проверкой <Notation>{"d[0] != 0"}</Notation>; цифры больше 9
                    — тоже просто числа.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Строгое убывание или возрастание — выбор набора цифр вместо
                    расстановки: Cₙᵏ наборов; при возрастании ноль не выбирают.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Чётность цифры — <Notation>{"d % 2"}</Notation>; чётность
                    числа при нечётном основании — по сумме цифр.
                  </>
                ),
              },
              { note: <>Длина не задана — сумма по всем возможным длинам.</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "spisok-kak-schyotchik",
      navLabel: "Список как счётчик",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Полный список слов одинаковой длины, записанный по алфавиту,
              устроен как счётчик в системе счисления: номер слова — это
              значение его записи плюс один.
            </strong>{" "}
            На этом держатся 45 задач из 133: «какое слово стоит под данным
            номером», «под каким номером данное слово», «под каким номером
            первое слово на данную букву». Такие задачи были на экзаменах с 2014
            по 2023 год и в трёх демоверсиях.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем нумеровать четырёхбуквенные слова из букв{" "}
            <Notation>{"А"}</Notation>, <Notation>{"Б"}</Notation>,{" "}
            <Notation>{"В"}</Notation>. Перевод числа в другую систему делением
            на основание разобран в теме 5; здесь он понадобится, чтобы по
            номеру найти слово.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sravnenie-slov",
      navLabel: "Сравнение слов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Слова одинаковой длины сравнивают слева направо до первой
              различающейся буквы.
            </strong>{" "}
            Пусть А {"<"} Б {"<"} В. Тогда АВБ {"<"} БАА, потому что уже первая
            буква <Notation>{"А"}</Notation> меньше <Notation>{"Б"}</Notation>.
            У слов <Notation>{"БАВ"}</Notation> и <Notation>{"БВА"}</Notation>{" "}
            первые буквы совпадают, поэтому сравниваем вторые: А {"<"} В,
            значит, БАВ {"<"} БВА.
          </Typography.Text>
          <Typography.Text>
            Такой порядок называется <strong>лексикографическим</strong>. В
            задачах его обычно называют алфавитным. Если условие задаёт
            специальный порядок символов, используем именно его.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "schyotchik-sistemy",
      navLabel: "Счётчик в системе счисления",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Полный список слов одинаковой длины меняется как счётчик.
            </strong>{" "}
            Заменим буквы цифрами: А → 0, Б → 1, В → 2. Тогда трёхбуквенные
            слова из <Notation>{"АБВ"}</Notation> идут в том же порядке, что и
            числа 000, 001, 002, 010, … в троичной системе:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbCounter3}
            caption={
              <>
                Начало и конец списка трёхбуквенных слов из АБВ. Справа меняется
                последняя буква; когда она доходит до В, следующей становится А,
                а предпоследняя увеличивается — как в троичной записи 002 → 010.
                Значение записи на единицу меньше номера.
              </>
            }
          />
          <Typography.Text>
            Так работает и обычный десятичный счёт: 008, 009, 010, 011. Только
            здесь символов три, поэтому основание системы равно 3.{" "}
            <strong>
              Если в алфавите m букв, для нумерации полного списка используется
              система с основанием m.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "plyus-odin",
      navLabel: "Плюс один",
      explanation: (
        <>
          <Typography.Text>
            <strong>К числовому значению нужно прибавлять единицу.</strong>{" "}
            Первому слову <Notation>{"ААА"}</Notation> соответствует 000₃ = 0,
            но его номер в списке — 1. Второму слову соответствует число 1,
            третьему — 2. Поэтому:
          </Typography.Text>
          <Typography.Text>
            <strong>номер слова = числовое значение + 1</strong>, и обратно,{" "}
            <strong>числовое значение = номер слова − 1</strong>.
          </Typography.Text>
          <Typography.Text>
            Прибавление или вычитание единицы зависит от начала нумерации. Здесь
            и далее список начинается с 1, как обычно бывает в таких задачах.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nomer-slova",
      navLabel: "Номер слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Номер слова — это количество слов, стоящих раньше него, плюс один.
            </strong>{" "}
            Возьмём слово <Notation>{"БАВБ"}</Notation> из четырёхбуквенного
            списка и посчитаем, сколько слов стоит раньше него.
          </Typography.Text>
          <ul>
            <li>
              На первой позиции вместо <Notation>{"Б"}</Notation> можно
              поставить одну меньшую букву — <Notation>{"А"}</Notation>; после
              неё допустимы любые три буквы: 1 · 3³ = 27 слов.
            </li>
            <li>
              Фиксируем первую <Notation>{"Б"}</Notation>. Вторая буква —{" "}
              <Notation>{"А"}</Notation>, меньше неё ничего нет: 0 · 3² = 0.
            </li>
            <li>
              Фиксируем начало <Notation>{"БА"}</Notation>. На третьем месте{" "}
              <Notation>{"В"}</Notation>, меньше неё две буквы —{" "}
              <Notation>{"А"}</Notation> и <Notation>{"Б"}</Notation>, и после
              каждой можно поставить любую последнюю букву: 2 · 3 = 6.
            </li>
            <li>
              Фиксируем <Notation>{"БАВ"}</Notation>. Последняя буква —{" "}
              <Notation>{"Б"}</Notation>, меньше неё одна буква: 1.
            </li>
          </ul>
          <Typography.Text>
            Всего перед словом 27 + 0 + 6 + 1 = 34 слова, следовательно,{" "}
            <strong>номер 34 + 1 = 35</strong>. Именно поэтому слово кодируется
            цифрами: БАВБ ↔ 1021₃, и множители 1, 0, 2, 1 — это цифры записи.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.placeValue1021_3}
            caption={
              <>
                БАВБ как запись 1021₃: веса разрядов 27, 9, 3, 1. Каждое
                слагаемое — сколько слов стоит раньше из-за одной позиции: 27 +
                0 + 6 + 1 = 34, номер 35.
              </>
            }
          />
          <Typography.Text>
            Для слова длины n, чьи буквы заменены цифрами d₁, …, dₙ, номер равен
          </Typography.Text>
          <Typography.Text>
            <strong>R = 1 + d₁ · mⁿ⁻¹ + d₂ · mⁿ⁻² + … + dₙ · m⁰.</strong>
          </Typography.Text>
          <Typography.Text>
            Последний вес m⁰ = 1: после последней буквы нет позиций, которые
            можно свободно заполнить, есть один вариант продолжения — ничего не
            дописывать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nomer-programmoj",
      navLabel: "Номер программой",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Номер известного слова программа вычисляет без перебора.
            </strong>{" "}
            Нажми «Запуск» и пройди программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runRank}
            label={"Нажми «Запуск» и пройди программу по шагам"}
          />
          <Typography.Text>
            <Notation>{"alphabet.index(letter)"}</Notation> находит позицию
            буквы в алфавите, считая с нуля: для <Notation>{"А"}</Notation> — 0,
            для <Notation>{"Б"}</Notation> — 1, для <Notation>{"В"}</Notation> —
            2. Это и есть цифра буквы.
          </Typography.Text>
          <Typography.Text>
            Главная строка <Notation>{"value = value * base + digit"}</Notation>{" "}
            работает так же, как дописывание цифры справа в десятичной записи:
            37 → 374 = 37 · 10 + 4. В троичной системе используется умножение на
            3. Для цифр 1, 0, 2, 1 значение растёт так: 0 · 3 + 1 = 1, 1 · 3 + 0
            = 3, 3 · 3 + 2 = 11, 11 · 3 + 1 = 34. После прибавления единицы
            получаем номер 35.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "slovo-po-nomeru",
      navLabel: "Слово по номеру",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы найти слово по номеру, нужно выполнить обратное
              преобразование.
            </strong>{" "}
            Найдём 50-е четырёхбуквенное слово из <Notation>{"АБВ"}</Notation>.
            Сначала вычтем единицу: 50 − 1 = 49. Теперь переведём 49 в троичную
            систему последовательным делением:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.convertStepper49_3}
            label={"Перевод 49 в троичную систему делением: шаг за шагом"}
          />
          <Typography.Text>
            Остатки, прочитанные снизу вверх, дают 49 = 1211₃. Первый остаток —
            последняя цифра, потому что любое число можно представить как 3 ·
            остальная часть + последняя цифра; после удаления этой цифры
            действие повторяется с остальной частью.
          </Typography.Text>
          <Typography.Text>
            Заменяем цифры буквами: 1 → Б, 2 → В. Получаем{" "}
            <strong>
              <Notation>{"БВББ"}</Notation>
            </strong>
            . Проверка: 1 · 27 + 2 · 9 + 1 · 3 + 1 = 49, и 49 + 1 = 50.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nachalnye-nuli",
      navLabel: "Начальные нули",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При восстановлении слова начальные нули терять нельзя.
            </strong>{" "}
            Найдём пятое четырёхбуквенное слово из <Notation>{"АБВ"}</Notation>:
            5 − 1 = 4, а 4 = 11₃. Но слово должно иметь длину 4, поэтому запись
            дополняем слева: 0011₃. После замены получаем{" "}
            <Notation>{"ААББ"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Здесь{" "}
            <strong>начальные нули обозначают первые буквы алфавита</strong> и
            являются частью слова. Это отличается от подсчёта n-значных чисел в
            подтеме 4, где начальный ноль запрещён.
          </Typography.Text>
          <Typography.Text>
            Программа повторяет деление ровно столько раз, сколько букв в слове,
            — поэтому нули не теряются:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runWordByNumber}
            label={"Программа на Python"}
          />
          <Typography.Text>
            <PythonTerm term="intdiv">
              <Notation>{"% base"}</Notation>
            </PythonTerm>{" "}
            получает последнюю цифру записи, <Notation>{"// base"}</Notation>{" "}
            удаляет её, а найденная буква добавляется <strong>слева</strong>,
            потому что цифры получаются справа налево. Это тот же цикл, что в
            функции <Notation>{"to_base"}</Notation> из темы 5, только с
            фиксированным числом шагов: когда <Notation>{"value"}</Notation>{" "}
            станет нулём, будут добавляться первые буквы алфавита.
            Предполагается, что номер допустим: 1 ≤{" "}
            <Notation>{"number"}</Notation> ≤ <Notation>{"base"}</Notation> **{" "}
            <Notation>{"length"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obshchee-nachalo",
      navLabel: "Общее начало",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Общее начало слова позволяет считать целые блоки списка.
            </strong>{" "}
            Пусть все четырёхбуквенные слова из <Notation>{"АБВ"}</Notation>{" "}
            записаны по порядку. Сначала идут слова на{" "}
            <Notation>{"А"}</Notation>, их 3³ = 27, затем слова на{" "}
            <Notation>{"Б"}</Notation> — ещё 27, затем на{" "}
            <Notation>{"В"}</Notation> — ещё 27. Поэтому первый номер слова на{" "}
            <Notation>{"Б"}</Notation> равен 27 + 1 = 28, последний — 27 + 27 =
            54.
          </Typography.Text>
          <Typography.Text>
            Если фиксировать первые две буквы, например{" "}
            <Notation>{"БА"}</Notation>, свободными остаются две позиции: 3² = 9
            слов. Такое фиксированное начало называется{" "}
            <strong>префиксом</strong>. Префикс <Notation>{"БА"}</Notation>{" "}
            соответствует записи 10₃ = 3, перед ним три блока по девять слов: 3
            · 9 = 27. Значит, слова на <Notation>{"БА"}</Notation> занимают
            номера 28, …, 36.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbBlocks4}
            caption={
              <>
                81 слово делится на три блока по 27 по первой букве, блок на Б —
                на три блока по 9 по второй. Слова с началом БА занимают номера
                28–36.
              </>
            }
          />
          <Typography.Text>
            В общем случае, если длина слова n, длина заданного начала k, а его
            числовое значение p, то блок начинается с номера{" "}
            <strong>p · mⁿ⁻ᵏ + 1</strong> и заканчивается номером{" "}
            <strong>(p + 1) · mⁿ⁻ᵏ</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "mezhdu-nomerami",
      navLabel: "Между двумя номерами",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество слов между двумя номерами зависит от включения границ.
            </strong>{" "}
            Если известны номера L и R, причём L ≤ R, выбери, какие границы
            входят:
          </Typography.Text>
          <VariantPicker
            label={"Какие номера считаем и сколько их"}
            variants={[
              { label: "от L до R включительно", value: <>R − L + 1</> },
              { label: "строго между L и R (L < R)", value: <>R − L − 1</> },
              { label: "одна граница включена", value: <>R − L</> },
            ]}
          />
          <Typography.Text>
            Например, номера от 10 до 15 включительно — это 10, 11, 12, 13, 14,
            15, их шесть: 15 − 10 + 1 = 6. Если внутри интервала нужно ещё
            проверять ограничения на слова, одной разности номеров недостаточно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "poryadok-alfavita",
      navLabel: "Порядок алфавита",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Порядок алфавита записывай сам: <Notation>{"product"}</Notation>{" "}
              идёт в порядке входной строки.
            </strong>{" "}
            В условии буквы часто перечислены не по алфавиту, например «из букв
            М, У, Х, А». Тогда алфавит — <Notation>{"'АМУХ'"}</Notation>, и
            буква <Notation>{"А"}</Notation> получает цифру 0.{" "}
            <strong>
              <Notation>{"product"}</Notation> не исправляет порядок
              автоматически
            </strong>
            : <Notation>{"product('ВАБ', repeat=3)"}</Notation> начнёт с{" "}
            <Notation>{"ВВВ"}</Notation>, а не с <Notation>{"ААА"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Для задач на номера безопаснее явно записать алфавит в нужном
            порядке. Не стоит без проверки полагаться на автоматическую
            сортировку русских букв: компьютерный порядок символов не во всех
            случаях совпадает с привычным алфавитом, например при наличии{" "}
            <Notation>{"Ё"}</Notation>. Если условие задаёт обратный алфавитный
            порядок, алфавит записывают задом наперёд:{" "}
            <Notation>{"'ВБА'"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            С правильным алфавитом номер можно найти и полным перебором.{" "}
            <PythonTerm term="enumerate">
              <Notation>{"enumerate"}</Notation>
            </PythonTerm>{" "}
            добавляет к каждому перебираемому элементу его номер, а{" "}
            <Notation>{"start=1"}</Notation> начинает отсчёт с единицы:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nfor number, letters in enumerate(\n    product('АБВ', repeat=4),\n    start=1\n):\n    word = ''.join(letters)\n    if word == 'БАВБ' or number == 50:\n        print(number, word)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"35 БАВБ\n50 БВББ"}
          />
          <Typography.Text>
            Перебор подтвердил оба ответа, найденных переводом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "raznaya-dlina",
      navLabel: "Слова разной длины",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если в списке слова разной длины, сначала идут все короткие.
            </strong>{" "}
            Иногда список составлен так: сначала по алфавиту все однобуквенные
            коды, затем все двухбуквенные, затем трёхбуквенные. Для кодов из{" "}
            <Notation>{"АБВ"}</Notation> длины от 1 до 3 перед словом{" "}
            <Notation>{"БАВ"}</Notation> стоят 3 однобуквенных кода, 9
            двухбуквенных и 11 трёхбуквенных: БАВ ↔ 102₃ = 11. Номер равен 3 + 9
            + 11 + 1 = 24.
          </Typography.Text>
          <Typography.Text>
            Это сочетание правила сложения из подтемы 1 и номера внутри блока
            одной длины. Перебор проходит длины по очереди и ведёт общий номер
            сам:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nnumber = 0\nfor length in range(1, 4):\n    for letters in product('АБВ', repeat=length):\n        number += 1\n        if ''.join(letters) == 'БАВ':\n            print(number)"
            }
            label={"Перебор проходит длины по очереди и ведёт общий номер сам"}
            language="python"
            output={"24"}
          />
        </>
      ),
    },
    {
      id: "nomer-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Полный список слов из m букв по алфавиту — счётчик с
                    основанием m: буква → цифра, номер = значение + 1.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Номер слова — количество слов раньше него плюс один;
                    программа —{" "}
                    <Notation>{"value = value * base + digit"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Слово по номеру — перевести номер − 1 в систему с основанием
                    m, сохранив ведущие нули.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Префикс длины k с значением p занимает номера от p · mⁿ⁻ᵏ +
                    1 до (p + 1) · mⁿ⁻ᵏ.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Алфавит записывают по порядку сами; перебор с{" "}
                    <Notation>{"enumerate(..., start=1)"}</Notation> проверяет
                    ответ.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "nomer-i-kolichestvo",
      navLabel: "Номер и количество",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В нумерованном списке номер слова и количество подходящих слов —
              разные величины: номер даёт полный список, а условие только
              отбирает слова из него.
            </strong>{" "}
            Так устроен главный вид задания 2023–2026 годов: «под каким номером
            последнее слово, которое не начинается с данной буквы и содержит
            ровно две другие», «сколько слов с нечётными номерами…». Это 17
            задач из 133, среди них основная волна ЕГЭ-2026, и 10 из 25 задач
            2025–2026 годов.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем искать в списке четырёхбуквенных слов из{" "}
            <Notation>{"АБВ"}</Notation> слова с ровно одной буквой{" "}
            <Notation>{"А"}</Notation>. Номер слова и перевод из подтемы 5
            считаем знакомыми.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervoe-i-poslednee",
      navLabel: "Первое и последнее",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Первое подходящее слово имеет минимальный номер, последнее —
              максимальный.
            </strong>{" "}
            В лексикографическом порядке более ранняя позиция важнее всех
            последующих. Поэтому при поиске первого слова хочется ставить слева
            минимальные буквы, а при поиске последнего — максимальные. Но{" "}
            <strong>
              каждый выбор должен оставлять возможность выполнить все условия
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Первое слово с ровно одной <Notation>{"А"}</Notation> —{" "}
            <Notation>{"АБББ"}</Notation>: на первое место ставим минимальную{" "}
            <Notation>{"А"}</Notation>, а дальше <Notation>{"А"}</Notation> уже
            нельзя, и остаются <Notation>{"Б"}</Notation>. Его номер — 0111₃ + 1
            = 13 + 1 = 14. Последнее — <Notation>{"ВВВА"}</Notation>:
            максимальную <Notation>{"В"}</Notation> ставим на первые три места,
            но последнее место оставляем обязательной <Notation>{"А"}</Notation>
            . Номер — 2220₃ + 1 = 78 + 1 = 79.
          </Typography.Text>
          <Typography.Text>
            При дополнительных запретах соседства или условиях на номер такая
            логика требует проверки. Если трудно доказать, что выбор допустим,
            проще выполнить <strong>упорядоченный перебор</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razdelnye-schyotchiki",
      navLabel: "Раздельные счётчики",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Номер в полном списке и количество найденных слов хранят
              раздельно.
            </strong>{" "}
            Номер увеличивается для каждого слова, счётчик — только для
            подходящего:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor number, letters in enumerate(\n    product('АБВ', repeat=4),\n    start=1\n):\n    word = ''.join(letters)\n    if word.count('А') == 1:\n        count += 1\n\nprint(number, count)"
            }
            label={
              "Номер увеличивается для каждого слова, счётчик — только для подходящего"
            }
            language="python"
            output={"81 32"}
          />
          <Typography.Text>
            После цикла <Notation>{"number"}</Notation> равен 81 — это номер
            последнего слова всего списка, а подходящих слов 32: место{" "}
            <Notation>{"А"}</Notation> — 4 способа, остальные три буквы из{" "}
            <Notation>{"БВ"}</Notation> — 2³.{" "}
            <strong>
              Если задача просит номер последнего подходящего слова, ответом
              будет не <Notation>{"count"}</Notation>.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ostanovka",
      navLabel: "Остановка и запоминание",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Первое подходящее слово находят с остановкой, последнее —
              запоминая каждый новый подходящий вариант.
            </strong>{" "}
            Посмотрим на поиск последнего по шагам на маленьком списке
            двухбуквенных слов из <Notation>{"АБ"}</Notation> —{" "}
            <Notation>{"АА"}</Notation>, <Notation>{"АБ"}</Notation>,{" "}
            <Notation>{"БА"}</Notation>, <Notation>{"ББ"}</Notation>:
          </Typography.Text>
          <CodeRunner {...lessonMedia.runLast} label={"Программа на Python"} />
          <Typography.Text>
            <PythonTerm term="none">
              <Notation>{"None"}</Notation>
            </PythonTerm>{" "}
            обозначает, что подходящее слово ещё не найдено. При каждом
            подходящем слове предыдущий ответ заменяется новым, поэтому после
            цикла остаётся последний. Для первого слова цикл останавливают{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>
            : перебор упорядочен, поэтому первый найденный вариант имеет
            минимальный номер.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nfor number, letters in enumerate(\n    product('АБВ', repeat=4),\n    start=1\n):\n    word = ''.join(letters)\n    if word.count('А') == 1:\n        print(number, word)\n        break\n\nlast_number = None\nlast_word = None\nfor number, letters in enumerate(\n    product('АБВ', repeat=4),\n    start=1\n):\n    word = ''.join(letters)\n    if word.count('А') == 1:\n        last_number = number\n        last_word = word\n\nprint(last_number, last_word)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"14 АБББ\n79 ВВВА"}
          />
          <Typography.Text>
            Программа подтвердила рассуждение: 14 и 79.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "polnyj-spisok",
      navLabel: "Полный список",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Прямая связь номера с системой счисления работает только для
              полного списка.
            </strong>{" "}
            Условия могут означать два разных действия:
          </Typography.Text>
          <ol>
            <li>Все слова пронумеровали, затем ищут подходящие среди них.</li>
            <li>
              Сначала оставили только подходящие слова, затем пронумеровали
              получившийся список.
            </li>
          </ol>
          <LessonDiagram
            {...lessonMedia.cmbRenumber2_1}
            caption={
              <>
                Слева полный список двухбуквенных слов из А и Б, справа — только
                слова с одной А, пронумерованные заново. АБ было вторым, стало
                первым; БА было третьим, стало вторым.
              </>
            }
          />
          <Typography.Text>
            В первом случае номера берутся из полного списка, во втором — из
            сокращённого.{" "}
            <strong>
              После удаления слов и перенумерации формулу «значение в системе
              счисления плюс один» напрямую применять нельзя
            </strong>
            : между оставшимися словами исчезли промежутки. То же касается
            списков слов без повторений: в полном списке с повторениями есть
            дополнительные слова, которые меняют номера.
          </Typography.Text>
          <Typography.Text>
            Если список сначала отбирают, а потом нумеруют, роль нового номера
            играет{" "}
            <strong>
              счётчик внутри <Notation>{"if"}</Notation>
            </strong>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor number, letters in enumerate(\n    product('АБВ', repeat=4),\n    start=1\n):\n    word = ''.join(letters)\n    if word.count('А') == 1:\n        count += 1\n        if word == 'БВАВ':\n            print(number, count)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"48 18"}
          />
          <Typography.Text>
            В полном списке слово <Notation>{"БВАВ"}</Notation> стоит под
            номером 48, а среди слов с одной <Notation>{"А"}</Notation> — под
            номером 18.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetnost-nomera",
      navLabel: "Чётность номера",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чётность номера иногда позволяет сразу определить ограничения на
              последнюю букву.
            </strong>{" "}
            Пусть алфавит содержит четыре буквы: А → 0, Б → 1, В → 2, Г → 3.
            Номер слова R = 1 + d₁ · 4ⁿ⁻¹ + … + dₙ. Все слагаемые со степенями 4
            чётные, поэтому чётность номера определяется выражением 1 + dₙ:
          </Typography.Text>
          <ul>
            <li>чётный номер — последняя цифра кода нечётная;</li>
            <li>нечётный номер — последняя цифра кода чётная.</li>
          </ul>
          <Typography.Text>
            Значит,{" "}
            <strong>
              чётный номер имеют слова, заканчивающиеся на{" "}
              <Notation>{"Б"}</Notation> или <Notation>{"Г"}</Notation>
            </strong>
            . При этом <Notation>{"А"}</Notation> имеет код 0, а не 1: отсчёт
            букв с нуля и отсчёт номеров слов с единицы нельзя смешивать.
          </Typography.Text>
          <Typography.Text>
            Для алфавита нечётной мощности правило только по последней букве уже
            не работает: как и с числами в подтеме 4, решает сумма цифр. В
            программе об этом думать не нужно — условие на номер проверяют
            прямо: «чётный номер» — <Notation>{"number % 2 == 0"}</Notation>,
            «номер кратен 3» — <Notation>{"number % 3 == 0"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odin-cikl",
      navLabel: "Один цикл",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Несколько ограничений и условие на номер проверяют в одном цикле,
              храня номер и счётчик раздельно.
            </strong>
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Все пятибуквенные слова из <Notation>{"АБВГ"}</Notation> записаны
              по алфавиту и пронумерованы с 1. Нужно найти количество слов,
              которые не начинаются с <Notation>{"А"}</Notation>, содержат ровно
              две <Notation>{"А"}</Notation>, не содержат{" "}
              <Notation>{"ББ"}</Notation> и имеют чётный номер. Также найдём
              номер последнего такого слова.
            </Typography.Text>
          </blockquote>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nlast_number = None\nlast_word = None\n\nfor number, letters in enumerate(\n    product('АБВГ', repeat=5),\n    start=1\n):\n    word = ''.join(letters)\n\n    if (\n        word[0] != 'А'\n        and word.count('А') == 2\n        and 'ББ' not in word\n        and number % 2 == 0\n    ):\n        count += 1\n        last_number = number\n        last_word = word\n\nprint(count)\nprint(last_number, last_word)"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"49\n964 ГГААГ"}
          />
          <Typography.Text>
            Каждая фраза условия — отдельная строка проверки, а номер и счётчик
            хранятся раздельно. Последнее подходящее слово —{" "}
            <Notation>{"ГГААГ"}</Notation>, его код 33003₄, номер 3 · 4⁴ + 3 ·
            4³ + 0 · 4² + 0 · 4 + 3 + 1 = 964.
          </Typography.Text>
          <ProofDisclosure summary="Проверка количества рассуждением: 49 слов">
            <Typography.Text>
              Алфавит имеет мощность 4, поэтому чётный номер означает окончание
              на <Notation>{"Б"}</Notation> или <Notation>{"Г"}</Notation>.
              Следовательно, первая буква не <Notation>{"А"}</Notation>,
              последняя тоже не <Notation>{"А"}</Notation>, и две{" "}
              <Notation>{"А"}</Notation> находятся среди позиций 2, 3, 4. Есть
              три случая.
            </Typography.Text>
            <ul>
              <li>
                <strong>
                  <Notation>{"А"}</Notation> на позициях 2 и 3
                </strong>
                , слово вида x А А y z. Для x есть 3 варианта, для y — 3, для z
                — 2, но сочетание y = Б, z = Б запрещено: 3 · (3 · 2 − 1) = 15.
              </li>
              <li>
                <strong>
                  <Notation>{"А"}</Notation> на позициях 2 и 4
                </strong>
                , слово вида x А y А z. Все остальные буквы разделены буквами{" "}
                <Notation>{"А"}</Notation>, поэтому <Notation>{"ББ"}</Notation>{" "}
                не появится: 3 · 3 · 2 = 18.
              </li>
              <li>
                <strong>
                  <Notation>{"А"}</Notation> на позициях 3 и 4
                </strong>
                , слово вида x y А А z. Для x, y есть 3 · 3 вариантов, кроме
                пары <Notation>{"ББ"}</Notation>; для z — 2: (3 · 3 − 1) · 2 =
                16.
              </li>
            </ul>
            <Typography.Text>
              Всего 15 + 18 + 16 = 49. Здесь видно, как математическое
              рассуждение и программа проверяют друг друга.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "ne-sokrashchat",
      navLabel: "Не сокращать список",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При поиске номеров в полном списке нельзя сокращать сам список.
            </strong>{" "}
            Полезные способы сократить работу перебора:
          </Typography.Text>
          <ul>
            <li>
              если повторения запрещены, использовать{" "}
              <Notation>{"permutations"}</Notation>;
            </li>
            <li>
              если буква нигде не разрешена и номера не нужны, убрать её из
              алфавита при подсчёте;
            </li>
            <li>
              если требуется только номер известного слова, вычислить его
              напрямую;
            </li>
            <li>
              если требуется слово по номеру, выполнить перевод в систему
              счисления;
            </li>
            <li>
              не выводить каждое слово, если нужен только итог, и не сохранять
              все слова, если достаточно счётчика.
            </li>
          </ul>
          <Typography.Text>
            Однако{" "}
            <strong>
              при поиске номеров в исходном полном списке нельзя просто удалить
              запрещённую букву из алфавита
            </strong>
            : это изменит список и его нумерацию. В таком случае исходные слова
            нумеруются до проверки ограничения.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "poisk-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Номер в полном списке (
                    <Notation>{"enumerate(..., start=1)"}</Notation>) и счётчик
                    подходящих (<Notation>{"count"}</Notation>) — разные
                    переменные.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Первое подходящее — <Notation>{"break"}</Notation> на первом
                    найденном, последнее — запоминать каждое найденное.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Полный список и перенумерованный после отбора — разные
                    списки; новый номер — счётчик внутри{" "}
                    <Notation>{"if"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Чётность номера при четырёх буквах — по последней букве; в
                    программе — <Notation>{"number % 2"}</Notation>.
                  </>
                ),
              },
              { note: <>Алфавит при поиске номеров не сокращают.</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "dopolnitelnyy-urok-perebor",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет закрыть все возможные случаи задания 8: в 8 из 133 задач
            подборок вариантов миллиарды, и перебор{" "}
            <Notation>{"product"}</Notation> не успевает. На экзаменах такие
            задачи не встречались. Задачи основных подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если слов слишком много, считают не сами слова, а количество
              способов их продолжить или заполнить.
            </strong>{" "}
            Все инструменты уже есть: правило умножения из подтемы 1, выбор мест
            из подтемы 2, промежутки из подтемы 3, выбор набора цифр из подтемы
            4 и счёт слов раньше данного из подтемы 5.
          </Typography.Text>
          <Typography.Text>
            Начнём со слов из букв <Notation>{"А"}</Notation>,{" "}
            <Notation>{"Б"}</Notation>, <Notation>{"В"}</Notation>,{" "}
            <Notation>{"Г"}</Notation>, в которых нет двух{" "}
            <Notation>{"А"}</Notation> подряд; функции и проверки основных
            подтем считаем знакомыми.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlina-20",
      navLabel: "Слова длины 20",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для слов длины 20 перебор уже не успевает: вариантов больше
              триллиона.
            </strong>{" "}
            Пятибуквенных слов из <Notation>{"АБВГ"}</Notation> всего 4⁵ = 1024,
            и перебор с проверкой <Notation>{"'АА' not in word"}</Notation> даёт
            ответ мгновенно. Но если длина слова 20, вариантов 4²⁰ = 1 099 511
            627 776 — больше триллиона. Даже миллион слов в секунду — это почти
            две недели работы.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"product"}</Notation> выдаёт варианты по одному, но не
            уменьшает их количество. Значит, нужен способ, в котором{" "}
            <strong>число шагов не растёт вместе с числом слов</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyaniya",
      navLabel: "Состояния",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы понять, можно ли дописать букву, не нужно знать всё слово.
            </strong>{" "}
            Для запрета <Notation>{"АА"}</Notation> достаточно знать,
            заканчивается ли слово на <Notation>{"А"}</Notation>. Разделим
            допустимые слова текущей длины на две группы: a — заканчиваются на{" "}
            <Notation>{"А"}</Notation>, b — заканчиваются на другую букву.
          </Typography.Text>
          <Typography.Text>При дописывании новой буквы:</Typography.Text>
          <ol>
            <li>
              Новые слова на <Notation>{"А"}</Notation> получаются только из
              прежней группы b: a_новое = b.
            </li>
            <li>
              Новые слова на другую букву получаются из любой прежней группы, и
              вариантов последней буквы три: b_новое = 3 · (a + b).
            </li>
          </ol>
          <Typography.Text>
            Для длины 1 a = 1, b = 3. Листай схему по шагам: каждая длина
            получается из предыдущей по этим двум правилам.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.cmbStatesStepper5}
            label={
              "Слова без двух букв А подряд, подсчёт по состояниям: шаг за шагом"
            }
          />
          <Typography.Text>
            Для длины 5 получаем 171 + 648 = 819 — столько же даёт перебор всех
            1024 слов. Программа хранит только два количества:
          </Typography.Text>
          <CodeBlock
            code={
              "end_a = 1\nend_other = 3\n\nfor length in range(2, 6):\n    new_a = end_other\n    new_other = 3 * (end_a + end_other)\n\n    end_a = new_a\n    end_other = new_other\n\nprint(end_a + end_other)"
            }
            label={"Программа хранит только два количества"}
            language="python"
            output={"819"}
          />
          <Typography.Text>
            Такой подход относится к{" "}
            <strong>динамическому программированию</strong>: результаты для
            меньших частей задачи используются для получения результатов для
            больших. Здесь мы храним не все слова, а только два количества,
            достаточных для продолжения подсчёта. Для длины 20 меняется одно
            число в <Notation>{"range"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "end_a = 1\nend_other = 3\nfor length in range(2, 21):\n    new_a = end_other\n    new_other = 3 * (end_a + end_other)\n    end_a = new_a\n    end_other = new_other\n\nprint(end_a + end_other)"
            }
            label={"Для длины 20 меняется одно число в range"}
            language="python"
            output={"393620574951"}
          />
          <Typography.Text>
            Девятнадцать шагов вместо триллиона слов. Для сложных ограничений
            может понадобиться помнить больше — например, число использованных{" "}
            <Notation>{"А"}</Notation> или несколько последних букв. Но принцип
            остаётся тем же.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "shemy-tipov",
      navLabel: "Схемы типов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если важны только типы цифр, перебирают схемы типов, а не сами
              цифры.
            </strong>{" "}
            Посчитаем двенадцатизначные восьмеричные числа, в записи которых
            ровно четыре нечётные цифры и никакие две нечётные не стоят рядом.
            Чисел всего 7 · 8¹¹ ≈ 6 · 10¹⁰ — перебор не успеет.
          </Typography.Text>
          <Typography.Text>
            Условие говорит только о том, где стоят нечётные цифры. Поэтому
            сначала выбираем <strong>схему типов</strong>: на каждом месте «ч»
            (чётная) или «н» (нечётная) — как схемы чередования в подтеме 3.
            Схем всего 2¹² = 4096. Для подходящей схемы количество чисел даёт
            правило умножения: нечётная цифра — 4 варианта (1, 3, 5, 7), чётная
            — 4 варианта (0, 2, 4, 6), но на первом месте чётная не может быть
            нулём — 3 варианта.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ndef by_types(length, odd_count):\n    total = 0\n    for types in product('чн', repeat=length):\n        scheme = ''.join(types)\n        if scheme.count('н') != odd_count:\n            continue\n        if 'нн' in scheme:\n            continue\n        ways = 1\n        for i, kind in enumerate(scheme):\n            if kind == 'н':\n                ways *= 4\n            elif i == 0:\n                ways *= 3\n            else:\n                ways *= 4\n        total += ways\n    return total\n\nbrute = 0\nfor d in product(range(8), repeat=5):\n    odd = [x % 2 for x in d]\n    if d[0] != 0 and sum(odd) == 2:\n        if all(odd[i] + odd[i + 1] < 2 for i in range(4)):\n            brute += 1\n\nprint(by_types(5, 2), brute)\nprint(by_types(12, 4))"
            }
            label={"Код на Python: from itertools import product"}
            language="python"
            output={"5376 5376\n1820327936"}
          />
          <Typography.Text>
            Сначала способ проверен на пятизначных числах, где перебор ещё
            возможен: оба подсчёта дали 5376. Затем та же функция за доли
            секунды считает двенадцатизначные.{" "}
            <PythonTerm term="def">Функция</PythonTerm>{" "}
            <Notation>{"by_types"}</Notation> повторяет рассуждение: схема типов
            — где стоят нечётные, умножение — чем заполнить каждое место. В
            проверочном переборе <PythonTerm term="comp">список</PythonTerm>{" "}
            <Notation>{"odd"}</Notation> хранит остаток каждой цифры от деления
            на 2, а <Notation>{"all(...)"}</Notation> проверяет, что ни в одной
            соседней паре нет двух нечётных.
          </Typography.Text>
          <Typography.Text>
            Типов может быть и больше двух. Если условие говорит «ровно два нуля
            и не более четырёх цифр-букв» для 15-ричных чисел, типы — ноль (1
            цифра), цифра-буква A–E (5 цифр) и остальные ненулевые (9 цифр);
            схем 3ⁿ, вес схемы — произведение этих количеств.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "strogij-poryadok",
      navLabel: "Строгий порядок",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строгий порядок цифр любой длины считают выбором наборов.
            </strong>{" "}
            Сколько натуральных чисел имеют девятеричную запись не менее чем из
            двух цифр, причём каждая следующая цифра строго меньше предыдущей?
            Длина может быть до девяти цифр, и перебор всех записей такой длины
            — это 9⁹ ≈ 3,9 · 10⁸ вариантов только для самой длинной.
          </Typography.Text>
          <Typography.Text>
            Как в подтеме 4, каждый набор различных цифр даёт ровно одно число —
            цифры по убыванию. Первая цифра при этом — наибольшая из набора, а в
            наборе из двух и более различных цифр она не ноль. Значит, нужно
            сложить по длинам количество наборов: C₉² + C₉³ + … + C₉⁹. Наборы
            перебирает{" "}
            <PythonTerm term="permutations">
              <Notation>{"combinations"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import combinations\n\ntotal = 0\nfor k in range(2, 10):\n    total += len(list(combinations(range(9), k)))\n\nprint(total, 2 ** 9 - 1 - 9)"
            }
            label={"Наборы перебирает {{permutations|combinations}}"}
            language="python"
            output={"502 502"}
          />
          <Typography.Text>
            Второе число — проверка: всех подмножеств девяти цифр 2⁹, из них не
            подходят пустое и девять одноэлементных.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "do-granicy",
      navLabel: "До границы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Числа до границы считают разряд за разрядом — как номер слова.
            </strong>{" "}
            Сколько четырёхзначных шестеричных чисел с различными цифрами не
            превышают 3204₆? Будем считать подходящие числа, которые идут раньше
            границы, так же, как в подтеме 5 считали слова раньше данного.
            Только слагаемые теперь — числа без повторов, а не любые слова.
          </Typography.Text>
          <ol>
            <li>
              Первая цифра меньше 3 и не ноль — 1 или 2. Остальные три места —
              различные цифры из пяти оставшихся: 2 · 5 · 4 · 3 = 120.
            </li>
            <li>
              Первая цифра 3, вторая меньше 2 и не 3 — 0 или 1. Остальные два
              места — из четырёх оставшихся цифр: 2 · 4 · 3 = 24.
            </li>
            <li>Начало 32, третья цифра меньше 0 — таких нет.</li>
            <li>
              Начало 320, четвёртая цифра меньше 4 и не из 3, 2, 0 — только 1:
              одно число 3201₆.
            </li>
            <li>Сама граница 3204₆ тоже подходит: её цифры различны.</li>
          </ol>
          <Typography.Text>
            Всего 120 + 24 + 0 + 1 + 1 = 146. Функция повторяет эти шаги для
            любой границы; <Notation>{"perm(a, b)"}</Notation> из модуля{" "}
            <Notation>{"math"}</Notation> — это a · (a − 1) · … , ровно b
            множителей:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\nfrom math import perm\n\ndef count_upto(bound, q):\n    total = 0\n    used = set()\n    for i, d in enumerate(bound):\n        rest = len(bound) - i - 1\n        for x in range(d):\n            if x in used or (i == 0 and x == 0):\n                continue\n            total += perm(q - len(used) - 1, rest)\n        if d in used:\n            return total\n        used.add(d)\n    return total + 1\n\nbrute = 0\nfor p in permutations(range(6), 4):\n    if p[0] != 0 and p <= (3, 2, 0, 4):\n        brute += 1\n\nprint(count_upto([3, 2, 0, 4], 6), brute)"
            }
            label={"Код на Python: from itertools import permutations"}
            language="python"
            output={"146 146"}
          />
          <Typography.Text>
            Перебор для проверки сравнивает кортежи цифр: они сравниваются как
            слова, по первому различному элементу, поэтому{" "}
            <Notation>{"p <= (3, 2, 0, 4)"}</Notation> значит «запись не больше
            границы». Если в самой границе цифры повторяются, все подходящие
            числа уже посчитаны раньше: функция завершается без прибавления
            единицы. Для восьмизначных 15-ричных чисел перебор перестановок
            занял бы минуты, а функция делает восемь шагов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Сначала оцени число вариантов: от миллиардов перебор не
                    успевает.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Подсчёт по состояниям: храни количества слов по тому, что
                    нужно знать для продолжения, — например, на какую букву
                    слово заканчивается.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Схема типов: перебирай типы мест (чётная, нечётная, ноль,
                    цифра-буква), а заполнение считай умножением.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Строгий порядок цифр — наборы{" "}
                    <Notation>{"combinations"}</Notation>, сумма по длинам.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Числа до границы — разряд за разрядом, как номер слова;
                    проверяй способ перебором на маленьком случае.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
  examFocus: (
    <>
      <Typography.Text>
        <strong>Способ выбирают по устройству задачи.</strong> Выбери, что видно
        из условия, чтобы увидеть удобный первый подход:
      </Typography.Text>
      <VariantPicker
        label={"Устройство задачи и первый подход"}
        variants={[
          {
            label: "ограничения по позициям",
            value: <>умножение множителей по местам (подтема 1)</>,
          },
          { label: "несовместимые случаи", value: <>сложение (подтема 1)</> },
          {
            label: "мало видов неподходящих",
            value: <>вычитание из общего количества (подтема 2)</>,
          },
          {
            label: "ровно несколько данных букв",
            value: <>выбор позиций Cₙᵏ (подтема 2)</>,
          },
          {
            label: "перестановка заданных букв",
            value: <>факториалы с учётом повторений (подтема 2)</>,
          },
          {
            label: "соседство",
            value: (
              <>промежутки, блоки или перебор с проверкой пар (подтема 3)</>
            ),
          },
          {
            label: "запись числа",
            value: <>первая цифра не ноль, цифры — числа (подтема 4)</>,
          },
          {
            label: "известное слово в полном списке",
            value: <>значение в системе счисления + 1 (подтема 5)</>,
          },
          {
            label: "известный номер в полном списке",
            value: <>перевод номера − 1 (подтема 5)</>,
          },
          {
            label: "условия и номер вместе",
            value: (
              <>
                перебор с <Notation>{"enumerate"}</Notation> и счётчиком
                (подтема 6)
              </>
            ),
          },
          {
            label: "много ограничений, небольшой перебор",
            value: (
              <>
                Python: <Notation>{"product"}</Notation> или{" "}
                <Notation>{"permutations"}</Notation>
              </>
            ),
          },
          {
            label: "огромное число слов",
            value: <>подсчёт по состояниям или схеме типов (подтема 7)</>,
          },
        ]}
      />
      <Typography.Text>
        <strong>
          Проверять нужно не только код, но и модель задачи: программа может без
          ошибок посчитать совсем другой набор слов.
        </strong>{" "}
        Особенно полезны такие проверки:
      </Typography.Text>
      <ul>
        <li>
          после удаления всех ограничений должно получаться базовое число
          вариантов mⁿ;
        </li>
        <li>дополнительное ограничение не может увеличить количество;</li>
        <li>количество не может превышать число всех рассматриваемых слов;</li>
        <li>номер в полном списке должен находиться от 1 до mⁿ;</li>
        <li>
          на маленьком алфавите и короткой длине результат можно выписать
          вручную;
        </li>
        <li>
          в алфавите не должно быть случайных пробелов, запятых или повторно
          записанных символов;
        </li>
        <li>
          русские <Notation>{"А"}</Notation>, <Notation>{"В"}</Notation>,{" "}
          <Notation>{"С"}</Notation> и похожие латинские буквы — разные символы
          для Python.
        </li>
      </ul>
      <Typography.Text>
        Последний пункт — не придирка: в условиях реальных задач на сайтах
        латинские буквы иногда попадают в список русских. Если программа с таким
        алфавитом даёт странный ответ, проверь, какие символы на самом деле
        записаны.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 8 начинается с короткого описания своими словами:
          какие символы, какой длины слово, какие ограничения и что спрашивают —
          количество, слово или номер.
        </strong>{" "}
        После такого описания и формула, и программа становятся переводом уже
        понятного решения.
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему, а ниже схемы каждый шаг разобран подробнее.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 8 на одной схеме"}
        flow={[
          {
            name: "Описание",
            note: "алфавит, длина, повторы, запас букв, слово или число",
          },
          {
            name: "Подсчёт",
            note: "умножение по местам, случаи, вычитание — руками на малом",
          },
          {
            name: "Программа",
            note: "product или permutations, проверка каждой фразы, номер отдельно",
          },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="slova-i-umnozhenie"
              >
                Слова и умножение
              </SubtopicLink>
            ),
            rows: [
              { key: <>mⁿ</>, note: <>слова длины n из m букв с повторами</> },
              {
                key: <>m · (m − 1) · …</>,
                note: <>без повторов, n множителей; все n букв — n!</>,
              },
              { key: <>A или B</>, note: <>A + B − оба сразу</> },
              {
                key: (
                  <>
                    <Notation>{"product('АОБ', repeat=n)"}</Notation>
                  </>
                ),
                note: <>repeat — длина слова, порядок — как в строке</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="skolko-raz-bukva"
              >
                Сколько раз буква
              </SubtopicLink>
            ),
            rows: [
              { key: <>Cₙᵏ · (m − 1)ⁿ⁻ᵏ</>, note: <>ровно k данных букв</> },
              { key: <>mⁿ − (m − 1)ⁿ</>, note: <>хотя бы одна данная буква</> },
              {
                key: <>n! / (a! · b! · …)</>,
                note: <>перестановки букв с повторами</>,
              },
              {
                key: (
                  <>
                    <Notation>{"word.count('А') == 2"}</Notation>
                  </>
                ),
                note: <>ровно две; гласные — сумма count</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="sosednie-bukvy"
              >
                Соседи
              </SubtopicLink>
            ),
            rows: [
              { key: <>m · (m − 1)ⁿ⁻¹</>, note: <>одинаковые не рядом</> },
              {
                key: <>промежутки, блоки</>,
                note: <>данные буквы не рядом или рядом</>,
              },
              {
                key: (
                  <>
                    <Notation>{"range(len(word) - 1)"}</Notation>
                  </>
                ),
                note: <>все соседние пары, флаг для каждого слова</>,
              },
              {
                key: (
                  <>
                    <Notation>
                      {"'АБ' not in word and 'БА' not in word"}
                    </Notation>
                  </>
                ),
                note: <>оба направления</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug="8-perebor-slov" subtopic="zapis-chisla">
                Запись числа
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>(q − 1) · qⁿ⁻¹</>,
                note: <>n-значные числа: первая цифра не ноль</>,
              },
              {
                key: (
                  <>
                    <Notation>{"product(range(q), repeat=n)"}</Notation>
                  </>
                ),
                note: (
                  <>
                    цифры — числа, <Notation>{"d[0] != 0"}</Notation>
                  </>
                ),
              },
              { key: <>строгий порядок цифр</>, note: <>выбор набора, Cₙᵏ</> },
              {
                key: <>нечётное основание</>,
                note: <>чётность числа — по сумме цифр</>,
              },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug="8-perebor-slov" subtopic="nomer-slova">
                Номер слова
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>номер = значение + 1</>,
                note: <>буква → цифра, основание m</>,
              },
              {
                key: (
                  <>
                    <Notation>{"value = value * base + digit"}</Notation>
                  </>
                ),
                note: <>номер известного слова</>,
              },
              {
                key: <>номер − 1 → основание m</>,
                note: <>слово по номеру, ведущие нули</>,
              },
              {
                key: <>алфавит по порядку</>,
                note: <>записать самому, product не сортирует</>,
              },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="poisk-v-spiske"
              >
                Поиск в списке
              </SubtopicLink>
            ),
            rows: [
              {
                key: (
                  <>
                    <Notation>{"enumerate(..., start=1)"}</Notation>
                  </>
                ),
                note: <>номер в полном списке</>,
              },
              {
                key: (
                  <>
                    <Notation>{"count"}</Notation> внутри{" "}
                    <Notation>{"if"}</Notation>
                  </>
                ),
                note: <>сколько подходящих или новый номер</>,
              },
              {
                key: (
                  <>
                    первое — <Notation>{"break"}</Notation>
                  </>
                ),
                note: <>последнее — запоминать каждое</>,
              },
              {
                key: (
                  <>
                    <Notation>{"number % 2 == 0"}</Notation>
                  </>
                ),
                note: <>условие на номер проверять прямо</>,
              },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="kogda-perebor-ne-uspevaet"
              >
                Без перебора
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              {
                key: <>состояния</>,
                note: <>a, b — сколько слов на А и на другую букву</>,
              },
              {
                key: <>схема типов</>,
                note: <>перебрать типы мест, заполнение — умножением</>,
              },
              {
                key: <>разряд за разрядом</>,
                note: <>числа до границы, как номер слова</>,
              },
            ],
          },
        ]}
        sections={[
          {
            title: "Два вопроса к готовому ответу",
            steps: [
              <>Не посчитан ли один и тот же вариант дважды?</>,
              <>Не пропущен ли подходящий вариант?</>,
            ],
          },
        ]}
        caption={
          <>
            Шпаргалка темы: порядок решения и главное из каждой подтемы. Номер
            раздела ведёт на подтему.
          </>
        }
      />
      <Typography.Text>
        <strong>
          Надёжное решение начинается с ответов на десять вопросов.
        </strong>{" "}
        Перед формулой или программой ответь:
      </Typography.Text>
      <ol>
        <li>
          Какие <strong>различные</strong> символы разрешены?
        </li>
        <li>Какова длина последовательности?</li>
        <li>Допускаются ли повторения?</li>
        <li>Дан алфавит или конкретный запас букв?</li>
        <li>Это слово, код или запись числа?</li>
        <li>Какие ограничения относятся к отдельным позициям?</li>
        <li>Какие — к количеству букв?</li>
        <li>Какие — к соседству?</li>
        <li>Требуется количество, само слово или его номер?</li>
        <li>Если есть нумерация, какой список нумеруется и с какого числа?</li>
      </ol>
    </>
  ),
  status: "published",
});
