import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { wordEnumerationLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./word-enumeration.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const THEME_TASK = (
  <>
    «Все пятибуквенные слова, составленные из букв Т, О, Р, К, А, записаны в
    алфавитном порядке и пронумерованы, начиная с 1. Сколько слов с нечётными
    номерами не начинаются с буквы А, содержат ровно две буквы О и не содержат
    двух букв О подряд?»
  </>
);

const R = "8-perebor-slov";

export const wordEnumerationLesson = defineLesson({
  ...wordEnumerationLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Считать слова правилом умножения и перебирать их программой с product",
    "Считать слова с заданным числом букв: места для буквы, «хотя бы» через дополнение",
    "Учитывать ограничения на соседние буквы промежутками и проверкой пар",
    "Считать записи чисел с начальной цифрой, значениями и чётностью цифр",
    "Находить номер слова через систему счисления и искать в нумерованном списке, храня номер и счётчик раздельно",
    "Для редких задач — подсчёт без перебора по состояниям и схемам типов (дополнительный урок)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "slova-i-umnozhenie",
      title: "Слова и перебор",
      lead: "Что такое слово и алфавит, как считать слова умножением и сложением и как перебрать их программой.",
      conceptIds: [
        "kak-ustroena-tema-8",
        "alfavit-i-zapas",
        "umnozhenie",
        "slozhenie",
        "bez-povtorenij",
        "perebor-product",
        "slova-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Почему пятибуквенных слов из <Notation>{"АКОРТ"}</Notation> 5⁵, а
              не 5 · 5 = 25?
            </>
          ),
          reveal: (
            <>
              Для каждого выбора первых букв есть все пять вариантов следующей,
              поэтому варианты умножаются на каждом из пяти мест: 5 · 5 · 5 · 5
              · 5 = 3125.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Сколько трёхбуквенных слов из букв слова{" "}
              <Notation>{"КОЛОС"}</Notation>, если буквы могут повторяться?
            </>
          ),
          reveal: <>64: различных букв четыре — К, О, Л, С, поэтому 4³ = 64.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Сколько пятибуквенных слов из <Notation>{"АКОРТ"}</Notation> не
              начинаются и не заканчиваются на <Notation>{"А"}</Notation>?
            </>
          ),
          reveal: <>2000: 4 · 5 · 5 · 5 · 4.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сколько слов длины 2 или 3 можно составить из букв{" "}
              <Notation>{"АБВ"}</Notation>?
            </>
          ),
          reveal: (
            <>
              36: двухбуквенных 3² = 9, трёхбуквенных 3³ = 27, случаи не
              пересекаются.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Сколькими способами можно переставить все буквы слова{" "}
              <Notation>{"ПЛОТ"}</Notation>?
            </>
          ),
          reveal: <>24: 4 · 3 · 2 · 1 = 4!.</>,
        },
      ],
    },
    {
      slug: "skolko-raz-bukva",
      title: "Сколько раз встречается буква",
      lead: "Как посчитать слова, где буква встречается ровно, хотя бы или не более нужного числа раз.",
      conceptIds: [
        "vybor-mest",
        "razbor-sluchaev",
        "hotya-by-ne-bolee",
        "programma-frazy",
        "odinakovye-bukvy",
        "bukva-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Сколько пятибуквенных слов из <Notation>{"АБВГ"}</Notation>{" "}
              содержат ровно две <Notation>{"А"}</Notation>?
            </>
          ),
          reveal: (
            <>270: места для двух А — 10, остальные три места — 3³ = 27.</>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Почему для той же задачи неверно 10 · 4³, то есть остальные места
              заполнять любыми из четырёх букв?
            </>
          ),
          reveal: (
            <>
              На остальных местах снова могла бы появиться{" "}
              <Notation>{"А"}</Notation> — и в слове было бы больше двух.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Сколько четырёхбуквенных слов из <Notation>{"АБВ"}</Notation>{" "}
              содержат хотя бы одну <Notation>{"А"}</Notation>?
            </>
          ),
          reveal: <>65: всего 3⁴ = 81, без А — 2⁴ = 16, 81 − 16.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сколько раз может встретиться буква при условии «не более одной»?
            </>
          ),
          reveal: <>0 или 1: отсутствие буквы тоже подходит.</>,
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему проверка <Notation>{"word.count('АБ') == 1"}</Notation> не
              подходит для условия «в слове одна <Notation>{"А"}</Notation> и
              одна <Notation>{"Б"}</Notation>»?
            </>
          ),
          reveal: (
            <>
              <Notation>{"count('АБ')"}</Notation> ищет фрагмент{" "}
              <Notation>{"АБ"}</Notation> подряд: в слове{" "}
              <Notation>{"БГА"}</Notation> одна А и одна Б, а фрагмента нет.
              Нужно{" "}
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
      lead: "Условия на соседние буквы: «не рядом», «нет двух подряд», блок и чередование.",
      conceptIds: [
        "sosednie-pozicii",
        "promezhutki",
        "proverka-sosedej",
        "odinakovye-sosedi",
        "blok",
        "chereduyutsya",
        "sosedi-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Сколько пар соседних позиций в слове из 6 букв?</>,
          reveal: <>5: позиции 1–2, 2–3, 3–4, 4–5, 5–6.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Сколько четырёхбуквенных слов из <Notation>{"АБВ"}</Notation> без
              двух одинаковых букв подряд?
            </>
          ),
          reveal: <>24: первая — 3 варианта, каждая следующая — 2: 3 · 2³.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Что выведет <Notation>{"print('АБ' in 'АВБ')"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"False"}</Notation>: <Notation>{"in"}</Notation> ищет
              буквы подряд, а в <Notation>{"АВБ"}</Notation> между А и Б стоит
              В.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Сколькими способами можно переставить буквы{" "}
              <Notation>{"АБВГ"}</Notation> так, чтобы{" "}
              <Notation>{"А"}</Notation> и <Notation>{"Б"}</Notation> стояли
              рядом?
            </>
          ),
          reveal: (
            <>12: блок и ещё две буквы — 3! = 6, внутри блока два порядка.</>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему число четырёхбуквенных слов из <Notation>{"АБ"}</Notation>,
              содержащих <Notation>{"ББ"}</Notation>, нельзя найти как «три
              места для фрагмента, умноженные на 2²»?
            </>
          ),
          reveal: (
            <>
              Слова с несколькими фрагментами посчитаются несколько раз:{" "}
              <Notation>{"ББББ"}</Notation> — трижды,{" "}
              <Notation>{"БББА"}</Notation> и <Notation>{"АБББ"}</Notation> —
              дважды. Верный ответ — 8.
            </>
          ),
        },
      ],
    },
    {
      slug: "zapis-chisla",
      title: "Числа в системе счисления",
      lead: "Запись числа как слово из цифр: первая цифра не ноль, цифры без повторов, порядок и чётность.",
      conceptIds: [
        "chislo-kak-slovo",
        "cifry-chislami",
        "bez-povtora-cifr",
        "vozrastanie",
        "chetnost",
        "ryadom-s-5",
        "chisla-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Сколько существует четырёхзначных шестеричных чисел?</>,
          reveal: (
            <>
              1080: первая цифра — 5 вариантов (не 0), остальные — по 6: 5 · 6³.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Код длины 3 может начинаться с нуля, а трёхзначное число — нет.
              Почему?
            </>
          ),
          reveal: (
            <>
              Начальный ноль не добавляет разряд: <Notation>{"007"}</Notation> —
              это однозначное число 7, а как код — три символа.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>Какие цифры шестнадцатеричной системы имеют значение больше 12?</>
          ),
          reveal: <>D, E, F — значения 13, 14, 15.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Чётно ли число 2111₃? Ответь по цифрам, затем проверь переводом.
            </>
          ),
          reveal: (
            <>
              Нечётно: при нечётном основании решает сумма цифр, 2 + 1 + 1 + 1 =
              5. И правда, 2111₃ = 67.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Сколько трёхзначных пятеричных чисел со строго убывающими цифрами?
            </>
          ),
          reveal: (
            <>
              10: любые три разные цифры из 0–4 выстраиваются по убыванию одним
              способом, и ноль окажется последним: C₅³ = 10.
            </>
          ),
        },
      ],
    },
    {
      slug: "nomer-slova",
      title: "Нумерованный список",
      lead: "Номер слова в списке по алфавиту и слово по номеру — и ответ задачи темы.",
      conceptIds: [
        "spisok-kak-schyotchik",
        "nomer-slova-v-spiske",
        "slovo-po-nomeru",
        "poryadok-alfavita",
        "nomer-i-kolichestvo",
        "pervoe-i-poslednee",
        "polnyj-spisok",
        "nomer-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Все четырёхбуквенные слова из <Notation>{"АБВ"}</Notation>{" "}
              записаны по алфавиту с номерами от 1. Какой номер у слова{" "}
              <Notation>{"ВАБВ"}</Notation>?
            </>
          ),
          reveal: (
            <>
              60: ВАБВ ↔ 2012₃ = 54 + 0 + 3 + 2 = 59, номер на единицу больше.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: <>Какое слово в том же списке стоит под номером 20?</>,
          reveal: (
            <>
              <Notation>{"АВАБ"}</Notation>: 20 − 1 = 19 = 0201₃, начальный ноль
              — это буква А.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Слова составлены «из букв Т, О, Р, К, А». Какую строку передать в{" "}
              <Notation>{"product"}</Notation>, чтобы номера шли по алфавиту?
            </>
          ),
          reveal: (
            <>
              <Notation>{"'АКОРТ'"}</Notation>: product идёт в порядке входной
              строки, поэтому буквы записывают по алфавиту сами.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Спрашивают номер последнего подходящего слова. Почему ответ — не
              значение счётчика <Notation>{"count"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Счётчик растёт только на подходящих словах, а номер — на каждом
              слове полного списка. Нужен номер.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Из списка удалили неподходящие слова и пронумеровали заново. Можно
              ли найти номер по формуле «запись + 1»?
            </>
          ),
          reveal: (
            <>
              Нет: формула верна только для полного списка. Новый номер — это
              счётчик подходящих слов.
            </>
          ),
        },
      ],
    },
    {
      slug: "kogda-perebor-ne-uspevaet",
      title: "Когда перебор не успевает",
      lead: "Как посчитать слова длины 20 и больше, когда перебрать их программой уже не получится.",
      level: "advanced",
      conceptIds: ["dlina-20", "sostoyaniya", "shemy-tipov", "perebor-itogo"],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Сколько вариантов переберёт product для слов длины 20 из четырёх
              букв?
            </>
          ),
          reveal: <>4²⁰ — больше триллиона: перебор не успеет.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Что нужно знать о слове, чтобы понять, можно ли дописать{" "}
              <Notation>{"А"}</Notation> при запрете <Notation>{"АА"}</Notation>
              ?
            </>
          ),
          reveal: <>Только одно: заканчивается ли слово на А.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Слов длины 1 из <Notation>{"АБВГ"}</Notation>: на А — 1, на другую
              букву — 3. Сколько слов длины 2 без <Notation>{"АА"}</Notation>?
            </>
          ),
          reveal: (
            <>15: на А — 3, на другую — 3 · (1 + 3) = 12. Проверка: 16 − 1.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>Сколько схем «чётная / нечётная» у двенадцатизначного числа?</>
          ),
          reveal: (
            <>
              2¹² = 4096 — их перебрать легко, а самих чисел десятки миллиардов.
            </>
          ),
        },
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
            В задании 8 из заданных букв составляют слова и спрашивают, сколько
            из них подходят под условие, — или какой номер у слова в списке по
            алфавиту. Вот задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Каждое ограничение превращают в отдельное правило, а слова считают
              рассуждением или перебирают программой.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "пятибуквенные слова из букв Т, О, Р, К, А",
                "на каждом из пяти мест — любая из пяти букв, повторы можно",
              ],
              [
                "записаны в алфавитном порядке и пронумерованы с 1",
                "у каждого слова есть номер в общем списке",
              ],
              ["с нечётными номерами", "смотрим только на слова 1, 3, 5, …"],
              ["не начинаются с буквы А", "первая буква — не А"],
              [
                "ровно две буквы О, нет двух О подряд",
                "две О, и они не стоят рядом",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем — у каждой своя страница. Идём по ним
            по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Слова и перебор</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="skolko-raz-bukva">
                Сколько раз встречается буква
              </SubtopicLink>{" "}
              — «ровно две О», «хотя бы одна», «не более».
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="sosednie-bukvy">
                Соседние буквы
              </SubtopicLink>{" "}
              — условия вида «нет двух О подряд».
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="zapis-chisla">
                Числа в системе счисления
              </SubtopicLink>{" "}
              — когда слово — это запись числа.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="nomer-slova">
                Нумерованный список
              </SubtopicLink>{" "}
              — номер слова по алфавиту и ответ задачи темы: 168.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="kogda-perebor-ne-uspevaet">
                Когда перебор не успевает
              </SubtopicLink>{" "}
              — дополнительный урок для очень длинных слов.
            </li>
          </ol>
          <Typography.Text>
            Каждый приём показан и рассуждением, и программой. На экзамене
            подойдёт любой способ, а второй пригодится для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "alfavit-i-zapas",
      navLabel: "Алфавит и слово",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Слово здесь — любая последовательность букв, смысл не важен, а
              порядок важен.
            </strong>{" "}
            <Notation>{"КОТ"}</Notation> и <Notation>{"ТОК"}</Notation> — разные
            слова; <Notation>{"ООАКР"}</Notation> — тоже слово.
          </Typography.Text>
          <Typography.Text>
            Набор разрешённых букв называют <strong>алфавитом</strong>. В задаче
            темы алфавит — пять букв Т, О, Р, К, А, длина слова — 5. Если не
            сказано иное, буквы могут повторяться.
          </Typography.Text>
          <Typography.Text>
            «Из букв слова <Notation>{"КОЛОС"}</Notation>» значит алфавит из
            различных букв К, О, Л, С. А «переставить все буквы слова КОЛОС» —
            другое условие: каждую букву нужно использовать столько раз, сколько
            она встречается (подтема 2).
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
              Число слов находят умножением: на каждом месте выбор
              разветвляется.
            </strong>{" "}
            Двухсимвольный код, где первый символ — <Notation>{"А"}</Notation>{" "}
            или <Notation>{"Б"}</Notation>, а второй —{" "}
            <Notation>{"0"}</Notation>, <Notation>{"1"}</Notation> или{" "}
            <Notation>{"2"}</Notation>, имеет 2 · 3 = 6 вариантов:
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
            Пятибуквенных слов из Т, О, Р, К, А — 5 · 5 · 5 · 5 · 5 = 5⁵ = 3125.
            Ограничение на одно место меняет только его множитель: слов, которые
            не начинаются с <Notation>{"А"}</Notation>, 4 · 5⁴ = 2500.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "slozhenie",
      navLabel: "Сложение и «или»",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Непересекающиеся случаи складывают; если случаи пересекаются,
              общие слова вычитают один раз.
            </strong>{" "}
            Слов длины 2 или 3 из пяти букв — 5² + 5³ = 150: слово не может
            иметь сразу две длины.
          </Typography.Text>
          <Typography.Text>
            А трёхбуквенных слов из <Notation>{"АОБВГ"}</Notation>, которые
            начинаются с <Notation>{"А"}</Notation> или заканчиваются на{" "}
            <Notation>{"А"}</Notation>, не 25 + 25: пять слов вида А?А попали в
            оба случая.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbOrGrid_fa18af}
            caption={
              <>
                Клетка — первая и последняя буквы, в каждой 5 слов. Строка А и
                столбец А — по 25 слов, их пересечение входит в оба: 25 + 25 − 5
                = 45.
              </>
            }
          />
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
              Если буквы не повторяются, каждый следующий множитель на единицу
              меньше.
            </strong>{" "}
            Трёхбуквенных слов из пяти букв без повторений 5 · 4 · 3 = 60: какие
            бы буквы ни выбрали раньше, вариантов всегда на одну меньше.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbShrink_b80ea4}
            caption={
              <>
                Буквы, оставшиеся для второго и третьего места, разные, но их
                всегда четыре, а потом три.
              </>
            }
          />
          <Typography.Text>
            Переставить все пять различных букв можно 5 · 4 · 3 · 2 · 1 = 120
            способами. Такое произведение записывают как 5! («пять факториал»).
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
              Программа перебирает те же позиции, что и рассуждение, и проверяет
              каждое слово.
            </strong>{" "}
            Двухсимвольный код из дерева выше перебирают двумя{" "}
            <PythonTerm term="for">вложенными циклами</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              "for first in 'АБ':\n    for second in '012':\n        print(first + second)"
            }
            label={"Перебор кода двумя циклами"}
            language="python"
            output={"А0\nА1\nА2\nБ0\nБ1\nБ2"}
          />
          <Typography.Text>
            Для пяти мест вместо пяти вложенных циклов берут функцию{" "}
            <Notation>{"product"}</Notation> из{" "}
            <PythonTerm term="import">модуля itertools</PythonTerm>:{" "}
            <Notation>{"product('АКОРТ', repeat=5)"}</Notation> выдаёт все
            наборы из пяти букв по очереди.{" "}
            <Notation>{"''.join(letters)"}</Notation> склеивает набор в строку,
            а счётчик растёт на каждом подходящем слове:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АКОРТ', repeat=5):\n    word = ''.join(letters)\n    if word[0] != 'А':\n        count += 1\nprint(count)"
            }
            label={"Слова, которые не начинаются с А"}
            language="python"
            output={"2500"}
          />
          <Typography.Text>
            Программа дала то же 2500, что и умножение. Первая буква —{" "}
            <Notation>{"word[0]"}</Notation>, последняя —{" "}
            <Notation>{"word[-1]"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Слова без повторений перебирает{" "}
            <Notation>{"permutations"}</Notation> из того же модуля:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\nprint(len(list(permutations('АОБВГ', 3))))"
            }
            label={"Слова без повторений"}
            language="python"
            output={"60"}
          />
          <LessonDiagram
            {...lessonMedia.comboGrids_23b46d}
            caption={
              <>
                Пары из букв А, О, Б. product берёт все 9 клеток, permutations
                убирает диагональ — повторы букв. Две правые сетки — выбор без
                учёта порядка; для слов они не подходят: АО и ОА — разные слова.
              </>
            }
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: сколько успеет перебор"
          >
            <Typography.Text>
              product из m букв длины n создаёт mⁿ вариантов. Сотни тысяч и
              миллионы проходят за секунды, а 8¹⁰ ≈ 10⁹ — уже слишком долго. Как
              считать такие задачи, разобрано в дополнительном уроке.
            </Typography.Text>
          </ProofDisclosure>
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
                key: "Слово",
                note: <>последовательность букв; порядок важен</>,
              },
              { key: "Умножение", note: <>mⁿ слов длины n из m букв</> },
              {
                key: "Сложение",
                note: <>непересекающиеся случаи; общие вычесть один раз</>,
              },
              { key: "Без повторов", note: <>5 · 4 · 3; все n букв — n!</> },
              {
                key: "product",
                note: <>перебор всех слов, проверка, счётчик</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "vybor-mest",
      navLabel: "Места для буквы",
      explanation: (
        <>
          <Typography.Text>
            Сколько пятибуквенных слов из Т, О, Р, К, А содержат ровно две буквы{" "}
            <Notation>{"О"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              «Ровно k одинаковых букв» — два действия: выбрать места для этой
              буквы и заполнить остальные места другими буквами.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Два места из пяти можно выбрать 10 способами: порядок выбора мест не
            важен — «места 1 и 3» и «места 3 и 1» дают одно слово.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbPlaces5_2}
            caption={
              <>Все способы поставить две О на пять мест: их 5 · 4 / 2 = 10.</>
            }
          />
          <Typography.Text>
            Остальные три места заполняют любыми буквами, кроме{" "}
            <Notation>{"О"}</Notation>, — по 4 варианта. Всего 10 · 4³ = 640
            слов.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: число сочетаний">
            <Typography.Text>
              Число способов выбрать k мест из n обозначают Cₙᵏ: выбрать места
              по очереди n · (n − 1) · … · (n − k + 1) способами и разделить на
              k! — столько порядков у каждого набора. C₅² = 5 · 4 / 2 = 10, C₆³
              = 6 · 5 · 4 / 6 = 20. Слов с ровно k данными буквами — Cₙᵏ · (m −
              1)ⁿ⁻ᵏ.
            </Typography.Text>
          </ProofDisclosure>
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
              Если ограничение на место мешает одной формуле, слова делят на
              случаи и складывают.
            </strong>{" "}
            Добавим условие задачи темы: слово не начинается с{" "}
            <Notation>{"А"}</Notation>.
          </Typography.Text>
          <ul>
            <li>
              Первая буква — <Notation>{"О"}</Notation>: вторую О ставим на одно
              из 4 оставшихся мест, ещё три места — из К, Р, Т, А: 4 · 4³ = 256.
            </li>
            <li>
              Первая буква — К, Р или Т: 3 варианта, две О — на 2 из 4
              оставшихся мест (6 способов), ещё два места — по 4 варианта: 3 · 6
              · 4² = 288.
            </li>
          </ul>
          <Typography.Text>Всего 256 + 288 = 544 слова.</Typography.Text>
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
              «Хотя бы» и «не более» переводят в точные количества.
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
              { label: "хотя бы одна", value: <>1, 2, 3, …</> },
              { label: "ни одной", value: <>0</> },
            ]}
          />
          <Typography.Text>
            <strong>
              «Хотя бы одну» короче считать через дополнение: из всех слов
              вычесть слова совсем без этой буквы.
            </strong>{" "}
            Слов хотя бы с одной О: 5⁵ − 4⁵ = 3125 − 1024 = 2101.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: две обязательные буквы"
          >
            <Typography.Text>
              Если нужны и <Notation>{"А"}</Notation>, и{" "}
              <Notation>{"Б"}</Notation>, вычитают слова без А и слова без Б, но
              слова без обеих букв вычтены дважды — их возвращают один раз. Для
              пятибуквенных слов из АБВГ: 4⁵ − 3⁵ − 3⁵ + 2⁵ = 570.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "programma-frazy",
      navLabel: "Проверки в программе",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждая фраза условия — отдельная проверка в программе.
            </strong>
          </Typography.Text>
          <LessonTable
            label={"Фразы условия и проверки"}
            columns={[{ label: "В условии" }, { label: "Проверка" }]}
            rows={[
              [
                "ровно две О",
                <Notation key="1">{"word.count('О') == 2"}</Notation>,
              ],
              [
                "не менее двух О",
                <Notation key="2">{"word.count('О') >= 2"}</Notation>,
              ],
              ["хотя бы одна О", <Notation key="3">{"'О' in word"}</Notation>],
              ["нет буквы О", <Notation key="4">{"'О' not in word"}</Notation>],
              [
                "не начинается с А",
                <Notation key="5">{"word[0] != 'А'"}</Notation>,
              ],
              [
                "заканчивается гласной",
                <Notation key="6">{"word[-1] in 'АО'"}</Notation>,
              ],
            ]}
          />
          <Typography.Text>
            Проверки соединяют <PythonTerm term="andor">and</PythonTerm>. Для
            задачи темы на этом шаге:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АКОРТ', repeat=5):\n    word = ''.join(letters)\n    if word.count('О') == 2 and word[0] != 'А':\n        count += 1\nprint(count)"
            }
            label={"Ровно две О и не начинается с А"}
            language="python"
            output={"544"}
          />
          <Typography.Text>
            Программа подтвердила разбор случаев: 544.{" "}
            <Notation>{"word.count('АО')"}</Notation> считает фрагменты{" "}
            <Notation>{"АО"}</Notation> подряд, а не отдельные А и О: число
            гласных — это{" "}
            <Notation>{"word.count('А') + word.count('О')"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odinakovye-bukvy",
      navLabel: "Перестановки с повторами",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если переставляют все буквы слова с одинаковыми буквами,
              одинаковые буквы нельзя считать разными.
            </strong>{" "}
            У слова <Notation>{"ТОПОТ"}</Notation> пять букв, но две Т и две О
            одинаковы. Если подписать их как разные, получится 5! = 120
            расстановок, и каждое настоящее слово посчитано 2! · 2! = 4 раза.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbLabels_dadd31}
            caption={
              <>
                Четыре подписанных варианта дают одно обычное слово: 120 / 4 =
                30.
              </>
            }
          />
          <Typography.Text>
            В программе <Notation>{"permutations"}</Notation> считает одинаковые
            буквы разными, и дубликаты убирает{" "}
            <PythonTerm term="set">множество</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\nprint(len(list(permutations('ТОПОТ'))))\nprint(len(set(permutations('ТОПОТ'))))"
            }
            label={"Перестановки ТОПОТ с дубликатами и без"}
            language="python"
            output={"120\n30"}
          />
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
                key: "Ровно k",
                note: <>места для буквы, остальные — другими буквами</>,
              },
              {
                key: "Разбор случаев",
                note: <>по первой букве, затем сложить</>,
              },
              { key: "Хотя бы одна", note: <>все минус без этой буквы</> },
              {
                key: "Проверки",
                note: (
                  <>
                    <Notation>{"count"}</Notation>, <Notation>{"in"}</Notation>,{" "}
                    <Notation>{"word[0]"}</Notation>
                  </>
                ),
              },
              { key: "Повторы букв", note: <>n! / (a! · b! · …)</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "sosednie-pozicii",
      navLabel: "Соседние пары",
      explanation: (
        <>
          <Typography.Text>
            Последнее условие задачи темы о буквах: в слове нет двух{" "}
            <Notation>{"О"}</Notation> подряд.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Соседние — буквы на позициях 1 и 2, 2 и 3, …: в слове длины n их n
              − 1 пар.
            </strong>{" "}
            Первая и последняя буквы соседними не считаются.
          </Typography.Text>
          <Typography.Text>
            Запреты «нет двух одинаковых букв подряд», «нет двух А подряд», «нет
            двух гласных подряд» и «А и Б не стоят рядом» — четыре разных
            условия. Выбери запрет, чтобы увидеть, нарушает ли его слово{" "}
            <Notation>{"АООБ"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Запрет и слово АООБ"}
            variants={[
              {
                label: "одинаковые подряд",
                value: <>нарушает: О и О стоят рядом</>,
              },
              {
                label: "две А подряд",
                value: <>не нарушает: А в слове одна</>,
              },
              {
                label: "две гласные подряд",
                value: <>нарушает: рядом А и О, О и О</>,
              },
              {
                label: "А и Б рядом",
                value: <>не нарушает: между А и Б две буквы</>,
              },
            ]}
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
              Чтобы одинаковые буквы не стояли рядом, сначала ставят остальные
              буквы, а данные — в разные промежутки между ними.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В пятибуквенном слове с двумя О остальных букв три. Вокруг них
            четыре промежутка, и две О должны попасть в разные — C₄² = 6
            способов. Две О в разных промежутках никогда не окажутся рядом.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbGaps14}
            caption={
              <>
                Три буквы без О и четыре промежутка вокруг них. Между двумя О
                всегда стоит хотя бы одна другая буква.
              </>
            }
          />
          <Typography.Text>
            Посчитаем слова задачи темы. Если первая буква — О (вторая О — в
            одном из трёх несоседних промежутков), остальные три места — по 4
            варианта: 3 · 4³ = 192. Если первая — К, Р или Т (3 варианта), две О
            ставят на несоседние места из 2–5: (2, 4), (2, 5) или (3, 5) — три
            способа, и ещё два места — по 4 варианта: 3 · 3 · 4² = 144. Всего
            192 + 144 = 336.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АКОРТ', repeat=5):\n    word = ''.join(letters)\n    if (\n        word[0] != 'А'\n        and word.count('О') == 2\n        and 'ОО' not in word\n    ):\n        count += 1\nprint(count)"
            }
            label={"Все три условия на буквы задачи темы"}
            language="python"
            output={"336"}
          />
          <Typography.Text>
            <Notation>{"'ОО' not in word"}</Notation> проверяет фрагмент из двух
            О подряд. Если в слове ровно две О, этого достаточно, чтобы они не
            стояли рядом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proverka-sosedej",
      navLabel: "Проверка всех пар",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если запрещённых пар много, например любые две гласные подряд,
              проверяют все соседние пары циклом.
            </strong>{" "}
            Нажми «Запуск» и пройди программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runNeighbours}
            label={"Проверка соседних гласных по шагам"}
          />
          <Typography.Text>
            Переменная <Notation>{"good"}</Notation> — флаг: сначала считаем,
            что слово подходит, а найдя запрещённую пару, меняем на{" "}
            <Notation>{"False"}</Notation>.{" "}
            <PythonTerm term="break">break</PythonTerm> прекращает цикл: одной
            плохой пары достаточно.{" "}
            <Notation>{"range(len(word) - 1)"}</Notation> даёт левые позиции
            всех пар: у слова из 5 букв это 0, 1, 2, 3.
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
              Слов без двух одинаковых букв подряд m · (m − 1)ⁿ⁻¹: первая —
              любая, каждая следующая — любая, кроме предыдущей.
            </strong>{" "}
            Пятибуквенных слов из <Notation>{"АБВГ"}</Notation> — 4 · 3⁴ = 324.
            Это не запрет повторов вообще: <Notation>{"АБАБА"}</Notation>{" "}
            подходит.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АБВГ', repeat=5):\n    word = ''.join(letters)\n    good = True\n    for i in range(len(word) - 1):\n        if word[i] == word[i + 1]:\n            good = False\n            break\n    if good:\n        count += 1\nprint(count)"
            }
            label={"Слова без одинаковых соседей"}
            language="python"
            output={"324"}
          />
        </>
      ),
    },
    {
      id: "blok",
      navLabel: "Блок",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Буквы, которые должны стоять рядом, объединяют в один блок.
            </strong>{" "}
            Переставим <Notation>{"АБВГ"}</Notation> так, чтобы А и Б стояли
            рядом: блок, В и Г расставляются 3! = 6 способами, а внутри блока
            два порядка — АБ и БА. Всего 12.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: блок при повторах букв"
          >
            <Typography.Text>
              Если буквы повторяются, блок считают осторожно: трёхбуквенных слов
              из <Notation>{"АБ"}</Notation> с фрагментом{" "}
              <Notation>{"АА"}</Notation> три — ААА, ААБ, БАА, а не 2 · 2 = 4:
              слово ААА содержит фрагмент дважды. Метод{" "}
              <Notation>{"count"}</Notation> тоже не видит наложений:{" "}
              <Notation>{"'АААА'.count('АА')"}</Notation> даёт 2, хотя фрагмент
              начинается на трёх местах.
            </Typography.Text>
          </ProofDisclosure>
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
              Если гласные и согласные чередуются, сначала выбирают схему типов,
              потом заполняют её.
            </strong>{" "}
            У пятибуквенного слова из <Notation>{"АОБВГ"}</Notation> две схемы:
            «г‑с‑г‑с‑г» — 2³ · 3² = 72 и «с‑г‑с‑г‑с» — 3³ · 2² = 108. Всего 180.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor letters in product('АОБВГ', repeat=5):\n    word = ''.join(letters)\n    good = True\n    for i in range(len(word) - 1):\n        if (word[i] in 'АО') == (word[i + 1] in 'АО'):\n            good = False\n            break\n    if good:\n        count += 1\nprint(count)"
            }
            label={"Гласные и согласные чередуются"}
            language="python"
            output={"180"}
          />
          <Typography.Text>
            Если обе соседние буквы одного типа, проверки{" "}
            <Notation>{"word[i] in 'АО'"}</Notation> и{" "}
            <Notation>{"word[i + 1] in 'АО'"}</Notation> дают одинаковый
            результат — такая пара запрещена.
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
              { key: "Соседних пар", note: <>n − 1 в слове длины n</> },
              {
                key: "Не рядом",
                note: <>остальные буквы, данные — в разные промежутки</>,
              },
              {
                key: "Проверка",
                note: (
                  <>
                    фрагмент <Notation>{"'ОО' not in word"}</Notation> или цикл
                    по парам с флагом
                  </>
                ),
              },
              { key: "Одинаковые соседи", note: <>m · (m − 1)ⁿ⁻¹</> },
              { key: "Рядом", note: <>блок; чередование — схемы типов</> },
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
            Сколько существует четырёхзначных чисел в шестеричной системе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Запись числа — слово из цифр, но первая цифра не может быть нулём.
            </strong>{" "}
            В системе с основанием q цифры — 0, 1, …, q − 1. Код может
            начинаться с нуля (<Notation>{"007"}</Notation>), а запись
            трёхзначного числа — нет: начальный ноль не добавляет разряд.
          </Typography.Text>
          <Typography.Text>
            Поэтому четырёхзначных шестеричных чисел 5 · 6³ = 1080: на первое
            место — пять ненулевых цифр, на остальные — все шесть.
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
              Цифры удобно перебирать числами: product(range(q), repeat=n).
            </strong>{" "}
            Тогда «цифра больше 12» — это <Notation>{"d > 12"}</Notation>, а
            «цифра D» в шестнадцатеричной системе — значение 13.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor digits in product(range(6), repeat=4):\n    if digits[0] != 0:\n        count += 1\nprint(count)"
            }
            label={"Четырёхзначные шестеричные числа"}
            language="python"
            output={"1080"}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: цифры строками">
            <Typography.Text>
              Если цифры записаны символами, <Notation>{"'2' + '3'"}</Notation>{" "}
              даёт строку <Notation>{"'23'"}</Notation>, а не 5. Перевод записи
              в число — <Notation>{"int(запись, основание)"}</Notation>:
            </Typography.Text>
            <CodeBlock
              code={
                "print('2' + '3', int('2') + int('3'))\nprint(int('1032', 6), int('D', 16), int('A0', 16))"
              }
              label={"Цифры-строки и int"}
              language="python"
              output={"23 5\n236 13 160"}
            />
          </ProofDisclosure>
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
              Если цифры не повторяются, начальный ноль всё равно исключают
              отдельно.
            </strong>{" "}
            Четырёхзначных шестеричных чисел с различными цифрами 5 · 5 · 4 · 3
            = 300: первая — любая, кроме нуля; вторая — любая, кроме первой,
            ноль уже можно.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\ncount = 0\nfor digits in permutations(range(6), 4):\n    if digits[0] != 0:\n        count += 1\nprint(count)"
            }
            label={"Различные цифры"}
            language="python"
            output={"300"}
          />
        </>
      ),
    },
    {
      id: "vozrastanie",
      navLabel: "Порядок цифр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При строгом убывании набор цифр выстраивается единственным
              способом, поэтому чисел столько же, сколько наборов.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbOneOrder5320}
            caption={
              <>
                Цифры 5, 3, 2, 0 можно расставить 4! = 24 способами, но строго
                убывают они только в одном — 5320.
              </>
            }
          />
          <Typography.Text>
            Четырёхзначных шестеричных чисел со строго убывающими цифрами — C₆⁴
            = 15: ноль окажется последним. При строгом возрастании ноль встал бы
            первым, поэтому цифры берут из 1–5: C₅⁴ = 5.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ndown = 0\nup = 0\nfor d in product(range(6), repeat=4):\n    if d[0] != 0 and d[0] > d[1] > d[2] > d[3]:\n        down += 1\n    if d[0] != 0 and d[0] < d[1] < d[2] < d[3]:\n        up += 1\nprint(down, up)"
            }
            label={"Убывающие и возрастающие цифры"}
            language="python"
            output={"15 5"}
          />
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
              Ноль — чётная цифра, а чётность цифры и чётность числа — разное.
            </strong>{" "}
            Условие о чётных цифрах проверяют по каждой цифре:{" "}
            <Notation>{"d % 2 == 0"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Чётность всего числа при чётном основании решает последняя цифра, а
            при нечётном — сумма цифр. Например, 12₃ = 5: последняя цифра
            чётная, а число нечётное.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему решает сумма цифр"
          >
            <Typography.Text>
              Запись d₁ · q² + d₂ · q + d₃. При чётном q первые слагаемые
              чётные, всё решает d₃. При нечётном q все степени основания
              нечётные, и каждое слагаемое имеет ту же чётность, что его цифра.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <strong>
              Если чётные и нечётные цифры чередуются, считают по двум схемам.
            </strong>{" "}
            Четырёхзначные шестеричные числа с различными цифрами: схема
            «чётная, нечётная, …» — 2 · 3 · 2 · 2 = 24 (первая чётная не ноль),
            схема «нечётная, чётная, …» — 3 · 3 · 2 · 2 = 36. Всего 60.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import permutations\n\ncount = 0\nfor digits in permutations(range(6), 4):\n    if digits[0] != 0:\n        good = True\n        for i in range(3):\n            if digits[i] % 2 == digits[i + 1] % 2:\n                good = False\n                break\n        if good:\n            count += 1\nprint(count)"
            }
            label={"Чётность цифр чередуется"}
            language="python"
            output={"60"}
          />
        </>
      ),
    },
    {
      id: "ryadom-s-5",
      navLabel: "Рядом с цифрой",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие «рядом с цифрой 5 нет нечётных» проверяют по соседям этой
              цифры.
            </strong>{" "}
            Позицию даёт <Notation>{"d.index(5)"}</Notation>, соседи — позиции{" "}
            <Notation>{"i - 1"}</Notation> и <Notation>{"i + 1"}</Notation>,
            если они есть. Пройди проверку числа 2501₆ по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runNeighbours5}
            label={"Соседи цифры 5 по шагам"}
          />
          <Typography.Text>
            Посчитаем четырёхзначные шестеричные числа с ровно одной цифрой 5,
            рядом с которой только чётные:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor d in product(range(6), repeat=4):\n    if d[0] == 0 or d.count(5) != 1:\n        continue\n    i = d.index(5)\n    good = True\n    for j in (i - 1, i + 1):\n        if 0 <= j < 4 and d[j] % 2 == 1:\n            good = False\n    if good:\n        count += 1\nprint(count)"
            }
            label={"Рядом с пятёркой только чётные"}
            language="python"
            output={"201"}
          />
          <Typography.Text>
            <Notation>{"continue"}</Notation> сразу переходит к следующему
            числу, если первая цифра ноль или пятёрок не одна. Проверка{" "}
            <Notation>{"0 <= j < 4"}</Notation> отбрасывает несуществующих
            соседей у крайней цифры.
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
                key: "n-значных чисел",
                note: <>(q − 1) · qⁿ⁻¹: первая цифра не ноль</>,
              },
              {
                key: "Перебор",
                note: (
                  <>
                    <Notation>{"product(range(q), repeat=n)"}</Notation>, цифры
                    — числа
                  </>
                ),
              },
              {
                key: "Строгий порядок",
                note: <>чисел столько, сколько наборов цифр</>,
              },
              {
                key: "Чётность числа",
                note: <>чётное основание — последняя цифра, нечётное — сумма</>,
              },
              {
                key: "Соседи цифры",
                note: <>позиции i − 1 и i + 1, если есть</>,
              },
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
            Вернёмся к задаче темы: слова пронумерованы по алфавиту. Как связан
            номер со словом?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Полный список слов по алфавиту меняется как счётчик в системе
              счисления: заменим буквы цифрами по порядку, и номер слова — это
              значение записи плюс один.
            </strong>{" "}
            Для трёхбуквенных слов из <Notation>{"АБВ"}</Notation>: А → 0, Б →
            1, В → 2, список идёт как 000, 001, 002, 010, … в троичной системе.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbCounter3}
            caption={
              <>
                Справа меняется последняя буква; когда она доходит до В,
                следующей становится А, а предпоследняя увеличивается — как в
                записи 002 → 010. Значение записи на единицу меньше номера.
              </>
            }
          />
          <Typography.Text>
            Если в алфавите m букв, система счисления — с основанием m. Первое
            слово <Notation>{"ААА"}</Notation> — это 000 = 0, а его номер — 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nomer-slova-v-spiske",
      navLabel: "Номер слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Номер слова — это сколько слов стоит раньше него, плюс один.
            </strong>{" "}
            Для слова <Notation>{"БАВБ"}</Notation> из четырёхбуквенного списка
            АБВ: раньше идут 27 слов на А; слов на Б со второй буквой меньше А
            нет; слов БАА? и БАБ? — 6; и одно слово БАВА. Это и есть веса
            разрядов записи 1021₃.
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
            Программа вычисляет номер без перебора: дописывает цифры справа, как
            при чтении числа.
          </Typography.Text>
          <CodeRunner {...lessonMedia.runRank} label={"Номер слова по шагам"} />
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
              Слово по номеру находят обратным ходом: вычесть единицу, перевести
              в систему счисления делением, заменить цифры буквами.
            </strong>{" "}
            Пятидесятое четырёхбуквенное слово из АБВ: 50 − 1 = 49.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.convertStepper49_3}
            label={"Перевод 49 в троичную систему"}
          />
          <Typography.Text>
            49 = 1211₃ → <Notation>{"БВББ"}</Notation>.{" "}
            <strong>Начальные нули терять нельзя</strong>: пятое слово — 4 = 11₃
            = 0011₃ → <Notation>{"ААББ"}</Notation>, ведь нули — это первые
            буквы алфавита.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runWordByNumber}
            label={"Слово по номеру по шагам"}
          />
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
              Буквы записывают по алфавиту сами: product идёт в порядке входной
              строки.
            </strong>{" "}
            В задаче темы буквы перечислены как Т, О, Р, К, А, а по алфавиту это{" "}
            <Notation>{"'АКОРТ'"}</Notation>: А → 0, К → 1, О → 2, Р → 3, Т → 4.
            С <Notation>{"product('ТОРКА', repeat=5)"}</Notation> список начался
            бы с ТТТТТ, и все номера были бы другими.
          </Typography.Text>
          <Typography.Text>
            Со словами, начинающимися одинаково, удобно работать блоками: слова
            на А занимают номера 1–625, на К — 626–1250, и так далее.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbBlocks4}
            caption={
              <>
                81 слово из АБВ делится на три блока по 27 по первой букве, блок
                на Б — на три блока по 9 по второй. Слова на БА занимают номера
                28–36.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "nomer-i-kolichestvo",
      navLabel: "Номер и счётчик",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В нумерованном списке номер и количество подходящих слов — разные
              переменные: номер растёт на каждом слове полного списка, счётчик —
              только на подходящих.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Номер даёт <Notation>{"enumerate(..., start=1)"}</Notation>: он
            приписывает каждому слову его номер, начиная с 1. Условие «нечётный
            номер» — <Notation>{"number % 2 == 1"}</Notation>. Вот программа для
            задачи темы:
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ncount = 0\nfor number, letters in enumerate(\n    product('АКОРТ', repeat=5), start=1\n):\n    word = ''.join(letters)\n    if (\n        word[0] != 'А'\n        and word.count('О') == 2\n        and 'ОО' not in word\n        and number % 2 == 1\n    ):\n        count += 1\nprint(count)"
            }
            label={"Ответ задачи темы"}
            language="python"
            output={"168"}
          />
          <Typography.Text>
            Из 336 подходящих по буквам слов нечётные номера у 168. Это ответ
            задачи темы.
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
              Первое подходящее слово находят с остановкой, последнее —
              запоминая каждый новый подходящий номер.
            </strong>{" "}
            Посмотри по шагам, как запоминается последний номер в маленьком
            списке АА, АБ, БА, ББ:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runLast}
            label={"Последнее подходящее слово по шагам"}
          />
          <Typography.Text>
            Для задачи темы: первое подходящее слово — номер 683 (
            <Notation>{"КАОКО"}</Notation>), последнее — номер 3073 (
            <Notation>{"ТТОТО"}</Notation>).
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nfirst = None\nlast = None\nfor number, letters in enumerate(\n    product('АКОРТ', repeat=5), start=1\n):\n    word = ''.join(letters)\n    if (\n        word[0] != 'А'\n        and word.count('О') == 2\n        and 'ОО' not in word\n        and number % 2 == 1\n    ):\n        if first is None:\n            first = (number, word)\n        last = (number, word)\nprint(*first)\nprint(*last)"
            }
            label={"Первое и последнее подходящее слово"}
            language="python"
            output={"683 КАОКО\n3073 ТТОТО"}
          />
          <Typography.Text>
            <Notation>{"None"}</Notation> значит «пока не найдено»: первое
            запоминаем один раз, последнее перезаписываем при каждом подходящем
            слове.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "polnyj-spisok",
      navLabel: "Полный и новый список",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Формула «запись + 1» верна только для полного списка.
            </strong>{" "}
            Если неподходящие слова удалили и оставшиеся пронумеровали заново,
            новый номер — это счётчик подходящих слов.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cmbRenumber2_1}
            caption={
              <>
                Слева полный список двухбуквенных слов из А и Б, справа — только
                слова с одной А, пронумерованные заново. АБ было вторым, стало
                первым.
              </>
            }
          />
          <Typography.Text>
            Поэтому при поиске номеров в полном списке нельзя сокращать алфавит:
            удалённая буква изменит нумерацию.
          </Typography.Text>
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
                key: "Номер слова",
                note: <>буквы → цифры по алфавиту, номер = запись + 1</>,
              },
              {
                key: "Слово по номеру",
                note: <>номер − 1 в систему счисления, нули не терять</>,
              },
              { key: "Алфавит", note: <>записать буквы по порядку самому</> },
              {
                key: "Номер и счётчик",
                note: (
                  <>
                    <Notation>{"enumerate(..., start=1)"}</Notation> и отдельный{" "}
                    <Notation>{"count"}</Notation>
                  </>
                ),
              },
              {
                key: "Первое, последнее",
                note: <>запомнить один раз; перезаписывать каждый раз</>,
              },
            ]}
          />
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
            ответ мгновенно. Но для длины 20 вариантов 4²⁰ — больше триллиона.
          </Typography.Text>
          <Typography.Text>
            Нужен способ, в котором{" "}
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
            допустимые слова текущей длины на две группы: a — заканчиваются на
            А, b — на другую букву.
          </Typography.Text>
          <Typography.Text>
            При дописывании буквы новые слова на А получаются только из группы
            b: a_новое = b. Новые слова на другую букву — из любой группы, и
            последних букв три: b_новое = 3 · (a + b). Для длины 1 a = 1, b = 3.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.cmbStatesStepper5}
            label={"Слова без двух А подряд: подсчёт по состояниям"}
          />
          <Typography.Text>
            Для длины 5 получаем 171 + 648 = 819 — столько же даёт перебор. Для
            длины 20 меняется одно число в <Notation>{"range"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "end_a = 1\nend_other = 3\nfor length in range(2, 21):\n    new_a = end_other\n    new_other = 3 * (end_a + end_other)\n    end_a = new_a\n    end_other = new_other\n\nprint(end_a + end_other)"
            }
            label={"Подсчёт по состояниям для длины 20"}
            language="python"
            output={"393620574951"}
          />
          <Typography.Text>
            Девятнадцать шагов вместо триллиона слов. Такой подход называют
            динамическим программированием: результаты для коротких слов
            используются для длинных.
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
            Самих чисел около 6 · 10¹⁰ — перебор не успеет.
          </Typography.Text>
          <Typography.Text>
            Схема — на каждом месте «ч» или «н», их всего 2¹² = 4096. Для
            подходящей схемы число чисел даёт умножение: нечётная цифра — 4
            варианта, чётная — 4, но на первом месте чётная не может быть нулём
            — 3.
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\ndef by_types(length, odd_count):\n    total = 0\n    for types in product('чн', repeat=length):\n        scheme = ''.join(types)\n        if scheme.count('н') != odd_count:\n            continue\n        if 'нн' in scheme:\n            continue\n        ways = 1\n        for i, kind in enumerate(scheme):\n            if kind == 'н':\n                ways *= 4\n            elif i == 0:\n                ways *= 3\n            else:\n                ways *= 4\n        total += ways\n    return total\n\nbrute = 0\nfor d in product(range(8), repeat=5):\n    odd = [x % 2 for x in d]\n    if d[0] != 0 and sum(odd) == 2:\n        if all(odd[i] + odd[i + 1] < 2 for i in range(4)):\n            brute += 1\n\nprint(by_types(5, 2), brute)\nprint(by_types(12, 4))"
            }
            label={"Подсчёт по схемам типов с проверкой перебором"}
            language="python"
            output={"5376 5376\n1820327936"}
          />
          <Typography.Text>
            Сначала способ проверен на пятизначных числах, где перебор ещё
            возможен, затем та же <PythonTerm term="def">функция</PythonTerm>{" "}
            <Notation>{"by_types"}</Notation> считает двенадцатизначные.
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
                key: "Оценка",
                note: <>mⁿ вариантов; от миллиардов — не успеть</>,
              },
              {
                key: "Состояния",
                note: (
                  <>хранить количества по тому, что нужно для продолжения</>
                ),
              },
              {
                key: "Схемы типов",
                note: <>перебрать схемы, каждую посчитать умножением</>,
              },
              {
                key: "Проверка",
                note: <>сверить способ с перебором на малых длинах</>,
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
        <strong>
          Каждую фразу условия переводят в отдельную проверку и сверяют её с
          текстом.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "алфавит не по порядку",
            value: (
              <>передали буквы в product так, как они перечислены в условии</>
            ),
            note: <>для номеров записать алфавит по порядку самому</>,
          },
          {
            label: "номер с нуля",
            value: <>забыли, что номер на единицу больше записи</>,
            note: <>первое слово — номер 1</>,
          },
          {
            label: "номер и счётчик",
            value: <>ответили счётчиком, а спрашивали номер</>,
            note: <>номер растёт на каждом слове полного списка</>,
          },
          {
            label: "count('АО')",
            value: <>посчитали гласные как фрагмент АО</>,
            note: <>складывать count каждой буквы</>,
          },
          {
            label: "in и соседство",
            value: <>проверили «рядом» через наличие обеих букв</>,
            note: <>«рядом» — фрагмент подряд, в обоих порядках</>,
          },
          {
            label: "начальный ноль",
            value: <>посчитали числа, начинающиеся с нуля</>,
            note: <>первая цифра n-значного числа не ноль</>,
          },
          {
            label: "чётность числа",
            value: (
              <>решили чётность по последней цифре при нечётном основании</>
            ),
            note: <>при нечётном основании решает сумма цифр</>,
          },
          {
            label: "лишняя буква",
            value: <>на остальных местах снова разрешили букву «ровно k»</>,
            note: <>остальные места — из других букв</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 8 решается одним порядком: какие буквы и какая
          длина, какие ограничения, считать рассуждением или перебором — и, если
          список нумерован, хранить номер отдельно от счётчика.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 8 на одной схеме"}
        flow={[
          { name: "Слова", note: "алфавит, длина, повторы" },
          { name: "Ограничения", note: "каждая фраза — отдельная проверка" },
          { name: "Подсчёт", note: "умножение или перебор product" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="slova-i-umnozhenie"
              >
                Слова и перебор
              </SubtopicLink>
            ),
            rows: [
              { key: <>mⁿ</>, note: <>слов длины n из m букв</> },
              { key: <>без повторов</>, note: <>5 · 4 · 3, n!</> },
              { key: <>или</>, note: <>сложить, общие вычесть</> },
              {
                key: (
                  <>
                    <Notation>{"product"}</Notation>
                  </>
                ),
                note: <>перебор и счётчик</>,
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
              { key: <>ровно k</>, note: <>места, затем другие буквы</> },
              { key: <>хотя бы одна</>, note: <>все минус без неё</> },
              { key: <>случаи</>, note: <>по первой букве</> },
              {
                key: (
                  <>
                    <Notation>{"count"}</Notation>
                  </>
                ),
                note: <>по одной букве, не фрагментом</>,
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
                Соседние буквы
              </SubtopicLink>
            ),
            rows: [
              { key: <>не рядом</>, note: <>промежутки</> },
              { key: <>одинаковые соседи</>, note: <>m · (m − 1)ⁿ⁻¹</> },
              { key: <>рядом</>, note: <>блок</> },
              { key: <>проверка</>, note: <>фрагмент или пары с флагом</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug="8-perebor-slov" subtopic="zapis-chisla">
                Числа
              </SubtopicLink>
            ),
            rows: [
              { key: <>первая цифра</>, note: <>не ноль</> },
              {
                key: (
                  <>
                    <Notation>{"range(q)"}</Notation>
                  </>
                ),
                note: <>цифры числами</>,
              },
              { key: <>строгий порядок</>, note: <>наборы цифр</> },
              { key: <>чётность числа</>, note: <>основание чётное или нет</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug="8-perebor-slov" subtopic="nomer-slova">
                Нумерованный список
              </SubtopicLink>
            ),
            rows: [
              { key: <>номер</>, note: <>запись + 1</> },
              { key: <>алфавит</>, note: <>по порядку</> },
              {
                key: (
                  <>
                    <Notation>{"enumerate"}</Notation>
                  </>
                ),
                note: <>номер отдельно от счётчика</>,
              },
              { key: <>последнее</>, note: <>перезаписывать</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="8-perebor-slov"
                subtopic="kogda-perebor-ne-uspevaet"
              >
                Когда перебор не успевает
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>оценка</>, note: <>mⁿ вариантов</> },
              { key: <>состояния</>, note: <>хранить количества</> },
              { key: <>схемы типов</>, note: <>умножение по схеме</> },
              { key: <>проверка</>, note: <>перебор на малых длинах</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к ответу",
            steps: [
              <>Все ли фразы условия превратились в проверки?</>,
              <>Записан ли алфавит по порядку, если важны номера?</>,
              <>Спрашивают номер или количество?</>,
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
    </>
  ),
  status: "published",
});
