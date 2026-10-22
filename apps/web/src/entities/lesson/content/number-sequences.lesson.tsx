import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import { numberSequencesLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./number-sequences.media";
import { R, SAMPLE, SAMPLE_LIST, THEME_TASK } from "./number-sequences.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const numberSequencesLesson = defineLesson({
  ...numberSequencesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать файл в список и переводить слова условия в проверки сравнения и делимости",
    "Перебирать соседние пары и тройки и собирать ответ: количество и наибольшую сумму",
    "Проверять «хотя бы одно», «ровно одно» и «не более двух из трёх» через количество",
    "Проверять окончание, количество цифр и знак отрицательных чисел",
    "Находить порог по всей последовательности до перебора и решать задачу темы целиком",
    "Разбирать длинные формулировки: квадрат минимума, остаток минимального, два наибольших",
    "Для редких задач — тройки как стороны треугольника (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "chisla-i-proverki",
      title: "Файл и условие",
      lead: "Что спрашивают в задании 17, как прочитать файл в список и записать слова условия проверками Python.",
      conceptIds: [
        "kak-ustroena-tema",
        "spisok",
        "fajl-v-spisok",
        "proverki-usloviya",
        "ostatok",
        "summa-i-proizvedenie",
        "chisla-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              В списке <Notation>{SAMPLE_LIST}</Notation> какой индекс у числа
              −325? Как обратиться к последнему элементу через{" "}
              <Notation>{"n = len(a)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Индекс 5: счёт идёт с нуля. Последний элемент —{" "}
              <Notation>{"a[n - 1]"}</Notation>, то есть{" "}
              <Notation>{"a[7]"}</Notation> = 3000.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Переведи в проверки Python: «x не меньше 50», «x меньше −5», «x от
              −99 до 99 включительно», «x не превышает 0».
            </>
          ),
          reveal: (
            <>
              <Notation>{"x >= 50"}</Notation>, <Notation>{"x < -5"}</Notation>,{" "}
              <Notation>{"-99 <= x <= 99"}</Notation>,{" "}
              <Notation>{"x <= 0"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Какие из чисел 0, 9, −18, 27, 36, −3 кратны девяти? Какие из них
              положительные?
            </>
          ),
          reveal: (
            <>
              Кратны девяти 0, 9, −18, 27, 36; положительные из них — 9, 27, 36.
              Ноль кратен девяти, но не положителен.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Для пары (4, 6): кратна ли пяти сумма? Кратно ли пяти хотя бы одно
              из чисел? Кратно ли восьми произведение?
            </>
          ),
          reveal: (
            <>
              Сумма 10 кратна пяти, хотя ни 4, ни 6 на пять не делятся.
              Произведение 24 кратно восьми, хотя ни одно число на восемь не
              делится.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему без <Notation>{"int(x)"}</Notation> проверка{" "}
              <Notation>{"x % 25 == 0"}</Notation> для чисел из файла не
              сработает?
            </>
          ),
          reveal: (
            <>
              Строка файла — текст, например <Notation>{'"125\\n"'}</Notation>.
              Делить текст с остатком нельзя: Python остановится с ошибкой.
              Сначала строку переводят в число.
            </>
          ),
        },
      ],
    },
    {
      slug: "sosednie-gruppy",
      title: "Соседние пары и тройки",
      lead: "Как перебрать все пары и тройки идущих подряд чисел и собрать ответ: сколько групп подходит и какая у них наибольшая сумма.",
      conceptIds: [
        "sosednie-pary",
        "sosednie-trojki",
        "kolichestvo-i-maksimum",
        "gruppy-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Сколько соседних пар и сколько соседних троек в последовательности
              из 10 000 чисел?
            </>
          ),
          reveal: <>Пар 9999, троек 9998: n − 1 и n − 2.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Выпиши все соседние тройки последовательности 4, 7, 10, 3.</>
          ),
          reveal: <>(4, 7, 10) и (7, 10, 3) — у четырёх чисел две тройки.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Почему тройки перебирают{" "}
              <Notation>{"range(len(a) - 2)"}</Notation>, а не{" "}
              <Notation>{"range(len(a))"}</Notation>?
            </>
          ),
          reveal: (
            <>
              При <Notation>{"i = n - 2"}</Notation> индекс{" "}
              <Notation>{"i + 2"}</Notation> равен n, а такого элемента нет:
              программа остановится с ошибкой.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Что выведет программа из раздела «Количество и наибольшая сумма»,
              если порог 2025 заменить на 0?
            </>
          ),
          reveal: (
            <>
              <Notation>{"3 -2050"}</Notation>: подходят суммы −2050, −3343 и
              −2418, наибольшая из них −2050.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              В той же программе строку <Notation>{"sums.append(s)"}</Notation>{" "}
              сдвинули влево, на уровень <Notation>{"if"}</Notation>. Что она
              выведет?
            </>
          ),
          reveal: (
            <>
              <Notation>{"6 4700"}</Notation>: сумма каждой тройки попадёт в
              список без проверки.
            </>
          ),
        },
      ],
    },
    {
      slug: "skolko-podhodit",
      title: "Сколько чисел группы подходит",
      lead: "Как проверить «хотя бы одно», «ровно одно» и «не более двух из трёх» — часть задачи темы про четырёхзначные числа.",
      access: "paid",
      conceptIds: [
        "i-ili-ne",
        "chetyrehznachnye",
        "skolko-elementov",
        "skobki",
        "odno-a-drugoe",
        "skolko-itogo",
      ],
      paid: {
        outline: [
          { id: "i-ili-ne", navLabel: "И, или, не" },
          { id: "chetyrehznachnye", navLabel: "Четырёхзначные числа" },
          { id: "skolko-elementov", navLabel: "Сколько чисел подходит" },
          { id: "skobki", navLabel: "Скобки" },
          { id: "odno-a-drugoe", navLabel: "Одно…, а другое…" },
          { id: "skolko-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              В задаче темы в тройке должно быть не более двух четырёхзначных
              чисел. Как проверить такое условие программой?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./number-sequences.paid.skolko-podhodit"),
      },
    },
    {
      slug: "cifry-i-znak",
      title: "Цифры и знак числа",
      lead: "Как проверить окончание, количество цифр и знак отрицательного числа — «оканчивается на 25» в задаче темы.",
      access: "paid",
      conceptIds: [
        "poslednie-cifry",
        "gde-nuzhen-modul",
        "kolichestvo-cifr",
        "cifra-v-razryade",
        "znak-chisla",
        "cifry-itogo",
      ],
      paid: {
        outline: [
          { id: "poslednie-cifry", navLabel: "Окончание числа" },
          { id: "gde-nuzhen-modul", navLabel: "Где модуль не нужен" },
          { id: "kolichestvo-cifr", navLabel: "Количество цифр" },
          { id: "cifra-v-razryade", navLabel: "Цифра в разряде" },
          { id: "znak-chisla", navLabel: "Знак числа" },
          { id: "cifry-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              В задаче темы порог — максимальный элемент, оканчивающийся на 25.
              Среди восьми чисел темы так оканчиваются 125, −325 и 2025. Как
              проверить окончание программой?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./number-sequences.paid.cifry-i-znak"),
      },
    },
    {
      slug: "vsya-posledovatelnost",
      title: "Порог по всей последовательности",
      lead: "Почему порог из условия находят до перебора троек — и задача темы целиком: ответ 8358 99821.",
      access: "paid",
      conceptIds: [
        "snachala-porog",
        "otbor",
        "zadacha-temy",
        "srednee",
        "ne-menyat-spisok",
        "posledovatelnost-itogo",
      ],
      paid: {
        outline: [
          { id: "snachala-porog", navLabel: "Сначала порог" },
          { id: "otbor", navLabel: "Отбор и характеристика" },
          { id: "zadacha-temy", navLabel: "Задача темы целиком" },
          { id: "srednee", navLabel: "Среднее арифметическое" },
          { id: "ne-menyat-spisok", navLabel: "Исходный список не трогаем" },
          { id: "posledovatelnost-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Порог задачи темы — максимальный элемент, оканчивающийся на 25.
              Можно ли проверять тройки сразу, пока читаем числа по порядку?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./number-sequences.paid.vsya-posledovatelnost"),
      },
    },
    {
      slug: "chto-proveryat-i-vyvodit",
      title: "Длинные формулировки",
      lead: "Как разобрать условие, где величина собрана из нескольких действий: квадрат минимума, остаток минимального, два наибольших в тройке.",
      access: "paid",
      conceptIds: [
        "poryadok-dejstvij",
        "proverka-i-otvet",
        "ostatok-minimalnogo",
        "dva-naibolshih",
        "vyvod-itogo",
      ],
      paid: {
        outline: [
          { id: "poryadok-dejstvij", navLabel: "Порядок действий" },
          { id: "proverka-i-otvet", navLabel: "Проверка и ответ" },
          { id: "ostatok-minimalnogo", navLabel: "Остаток минимального" },
          { id: "dva-naibolshih", navLabel: "Наибольшие в тройке" },
          { id: "vyvod-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Чем «квадрат минимального элемента» отличается от «минимального
              квадрата элемента»?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./number-sequences.paid.chto-proveryat-i-vyvodit"),
      },
    },
    {
      slug: "treugolniki",
      title: "Тройка как стороны треугольника",
      lead: "Когда три числа могут быть сторонами треугольника и как узнать, прямоугольный он, остроугольный или тупоугольный.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "treugolniki",
        "sushchestvovanie",
        "vid-treugolnika",
        "pryamougolnyj",
        "treugolniki-itogo",
      ],
      paid: {
        outline: [
          { id: "treugolniki", navLabel: "Дополнительный урок" },
          { id: "sushchestvovanie", navLabel: "Существование" },
          { id: "vid-treugolnika", navLabel: "Вид треугольника" },
          { id: "pryamougolnyj", navLabel: "Прямоугольный" },
          { id: "treugolniki-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Изредка в
              задании 17 спрашивают тройки, которые могут быть сторонами
              треугольника. Задачи основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./number-sequences.paid.treugolniki"),
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
            В задании 17 дают файл с последовательностью целых чисел — обычно их
            около десяти тысяч. Нужно найти соседние пары или тройки чисел,
            которые подходят под условие, и записать в ответ два числа: сколько
            таких групп и какая у них наибольшая или наименьшая сумма. Вот
            задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Десять тысяч чисел вручную не проверить — задание решают
              программой.
            </strong>{" "}
            Но каждый её шаг мы сначала проверим руками на восьми числах:{" "}
            {SAMPLE}. Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "последовательность целых чисел",
                "числа записаны в файле по порядку, по одному в строке",
              ],
              ["от −100 000 до 100 000", "среди чисел есть отрицательные"],
              [
                "тройка — три идущих подряд элемента",
                "125, 1300, −1250; затем 1300, −1250, −2100; и так далее",
              ],
              [
                "не более двух из трёх — четырёхзначные",
                "четырёхзначных чисел в тройке 0, 1 или 2, но не 3",
              ],
              [
                "максимальный элемент, оканчивающийся на 25",
                "порог: его находят по всей последовательности",
              ],
              ["сумма тройки не больше порога", "сумма ≤ порога"],
              [
                "количество троек, затем максимальную из сумм",
                "ответ — два числа через пробел",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем и дополнительного урока — у каждой своя
            страница. Идём по ним по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Файл и условие</strong> — ты сейчас здесь: список, файл и
              первые проверки.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="sosednie-gruppy">
                Соседние пары и тройки
              </SubtopicLink>{" "}
              — перебираем тройки и собираем количество и наибольшую сумму.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="skolko-podhodit">
                Сколько чисел группы подходит
              </SubtopicLink>{" "}
              — «не более двух из трёх», «хотя бы одно», «ровно одно».
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="cifry-i-znak">
                Цифры и знак числа
              </SubtopicLink>{" "}
              — «оканчивается на 25» у отрицательных чисел.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="vsya-posledovatelnost">
                Порог по всей последовательности
              </SubtopicLink>{" "}
              — решим задачу темы целиком: ответ 8358 99821.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="chto-proveryat-i-vyvodit">
                Длинные формулировки
              </SubtopicLink>{" "}
              — квадрат минимума, остаток минимального, два наибольших.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="treugolniki">
                Тройка как стороны треугольника
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "spisok",
      navLabel: "Список и индексы",
      explanation: (
        <>
          <Typography.Text>
            Как хранить в программе восемь чисел и обратиться к любому из них?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Последовательность хранят в{" "}
              <PythonTerm term="list">списке</PythonTerm>. Номер места в списке
              называют индексом, и считают его с нуля.
            </strong>{" "}
            Вот восемь чисел темы и их индексы:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqStrip_93ecbe}
            caption={
              <>
                Первый элемент 125 — это <Notation>{"a[0]"}</Notation>,
                последний 3000 — <Notation>{"a[7]"}</Notation>: индекс на
                единицу меньше обычного номера.
              </>
            }
          />
          <Typography.Text>
            В программе список записывают в квадратных скобках через запятую:
          </Typography.Text>
          <CodeBlock
            code={SAMPLE_LIST}
            label={"Восемь чисел темы списком"}
            language="python"
          />
          <Typography.Text>
            Количество элементов даёт{" "}
            <PythonTerm term="len">
              <Notation>{"len"}</Notation>
            </PythonTerm>
            . У нас <Notation>{"n = len(a)"}</Notation> = 8, индексы идут от 0
            до n − 1 = 7, и последний элемент —{" "}
            <Notation>{"a[n - 1]"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={SAMPLE_LIST + "\nn = len(a)\nprint(n, a[0], a[1], a[n - 1])"}
            label={"Длина списка и обращение по индексу"}
            language="python"
            output={"8 125 1300 3000"}
          />
          <Typography.Text>
            Элемента <Notation>{"a[8]"}</Notation> нет: обращение к нему
            остановит программу ошибкой.
          </Typography.Text>
          <Typography.Text>
            Элемент — это число на своём месте. Если в файле дважды встречается
            7, это два разных элемента. Переставлять числа тоже нельзя: от
            порядка зависит, какие числа стоят рядом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fajl-v-spisok",
      navLabel: "Файл в список",
      explanation: (
        <>
          <Typography.Text>Как получить такой список из файла?</Typography.Text>
          <Typography.Text>
            <strong>
              Файл открывают, проходят по его строкам и каждую строку переводят
              в число.
            </strong>{" "}
            В файле 17.txt числа записаны по одному в строке. Для программы
            строка «−43867» — это текст: сравнивать или делить её как число
            нельзя. Переводит текст в число{" "}
            <PythonTerm term="num">
              <Notation>{"int"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              'with open("17.txt") as f:\n    a = [int(x) for x in f]\nprint(len(a), a[0], a[1])'
            }
            label={"Чтение файла задачи темы в список"}
            language="python"
            output={"10000 -43867 -97180"}
          />
          <Typography.Text>
            <PythonTerm term="file">
              <Notation>{'open("17.txt")'}</Notation>
            </PythonTerm>{" "}
            открывает файл, а <Notation>{"with"}</Notation> закрывает его, когда
            чтение закончено. Запись{" "}
            <Notation>{"[int(x) for x in f]"}</Notation> читай так: для каждой
            строки <Notation>{"x"}</Notation> файла взять{" "}
            <Notation>{"int(x)"}</Notation> и собрать результаты в список. Такую
            запись называют{" "}
            <PythonTerm term="comp">списковым включением</PythonTerm>.
          </Typography.Text>
          <Typography.Text>
            Файл должен лежать в той же папке, что и программа. Если он в другом
            месте, в <Notation>{"open"}</Notation> пишут полный путь, например{" "}
            <Notation>{'open("C:/ege/17.txt")'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proverki-usloviya",
      navLabel: "Условие — проверки",
      explanation: (
        <>
          <Typography.Text>
            Как записать слова условия на Python?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждое требование условия — проверка: она даёт{" "}
              <Notation>{"True"}</Notation>, если требование выполнено, и{" "}
              <Notation>{"False"}</Notation>, если нет.
            </strong>{" "}
            Например, «сумма тройки не больше 2025» — это{" "}
            <Notation>{"s <= 2025"}</Notation>. Знаки{" "}
            <PythonTerm term="eq">сравнения</PythonTerm>:{" "}
            <Notation>{"=="}</Notation> (равно), <Notation>{"!="}</Notation> (не
            равно), <Notation>{">"}</Notation>, <Notation>{"<"}</Notation>,{" "}
            <Notation>{">="}</Notation>, <Notation>{"<="}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Не путай <Notation>{"x = 10"}</Notation> и{" "}
            <Notation>{"x == 10"}</Notation>: первое присваивает значение,
            второе проверяет равенство.
          </Typography.Text>
          <Typography.Text>
            Слова условия переводят буквально. Выбери формулировку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка в условии и проверка в Python"}
            variants={[
              {
                label: "больше 100",
                value: <Notation>{"x > 100"}</Notation>,
              },
              {
                label: "не меньше 100",
                value: <Notation>{"x >= 100"}</Notation>,
                note: <>«не меньше» включает само 100</>,
              },
              {
                label: "меньше 100",
                value: <Notation>{"x < 100"}</Notation>,
              },
              {
                label: "не больше 100",
                value: <Notation>{"x <= 100"}</Notation>,
                note: <>«не больше» и «не превышает» включают 100</>,
              },
              {
                label: "от 100 до 999 включительно",
                value: <Notation>{"100 <= x <= 999"}</Notation>,
                note: (
                  <>
                    то же, что <Notation>{"100 <= x and x <= 999"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Чтобы выполнить действие только тогда, когда проверка дала{" "}
            <Notation>{"True"}</Notation>, пишут{" "}
            <PythonTerm term="if">
              <Notation>{"if"}</Notation>
            </PythonTerm>
            . Как это работает, покажет следующий раздел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ostatok",
      navLabel: "Кратность и остаток",
      explanation: (
        <>
          <Typography.Text>
            Как проверить, что число делится на другое?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Число x кратно d, когда остаток от деления x на d равен нулю:{" "}
              <Notation>{"x % d == 0"}</Notation>.
            </strong>{" "}
            Знак <Notation>{"%"}</Notation> даёт остаток, а{" "}
            <PythonTerm term="intdiv">
              <Notation>{"//"}</Notation>
            </PythonTerm>{" "}
            — целую часть частного. Например, 23 = 4 · 5 + 3:
          </Typography.Text>
          <CodeBlock
            code={"print(23 // 5, 23 % 5)"}
            label={"Целая часть и остаток от деления 23 на 5"}
            language="python"
            output={"4 3"}
          />
          <Typography.Text>
            Все проверки делимости устроены так же:
          </Typography.Text>
          <VariantPicker
            label={"Условие и проверка в Python"}
            variants={[
              {
                label: "число кратно 3",
                value: <Notation>{"x % 3 == 0"}</Notation>,
              },
              {
                label: "число не кратно 3",
                value: <Notation>{"x % 3 != 0"}</Notation>,
              },
              {
                label: "число чётное",
                value: <Notation>{"x % 2 == 0"}</Notation>,
              },
              {
                label: "число нечётное",
                value: <Notation>{"x % 2 != 0"}</Notation>,
              },
              {
                label: "остаток от деления на 7 равен 4",
                value: <Notation>{"x % 7 == 4"}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            Ноль кратен любому числу: <Notation>{"0 % 25"}</Notation> равно 0.
            Если нужны положительные кратные, добавь{" "}
            <Notation>{"x > 0"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Посчитаем, сколько из восьми чисел темы кратны 25 и сколько из них
            положительные. Цикл{" "}
            <PythonTerm term="for">
              <Notation>{"for"}</Notation>
            </PythonTerm>{" "}
            по очереди берёт каждый элемент, а{" "}
            <PythonTerm term="augassign">
              счётчик <Notation>{"count += 1"}</Notation>
            </PythonTerm>{" "}
            растёт на каждом подходящем:
          </Typography.Text>
          <CodeBlock
            code={
              SAMPLE_LIST +
              "\ncount = 0\npositive = 0\nfor x in a:\n    if x % 25 == 0:\n        count += 1\n        if x > 0:\n            positive += 1\nprint(count, positive)"
            }
            label={"Сколько чисел кратны 25"}
            language="python"
            output={"7 4"}
          />
          <Typography.Text>
            Кратны 25 все числа, кроме 7. Положительных среди них четыре: 125,
            1300, 2025, 3000.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summa-i-proizvedenie",
      navLabel: "Сумма и произведение",
      explanation: (
        <>
          <Typography.Text>
            Условие говорит про сумму тройки — что проверять?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Условие на сумму или произведение проверяют у самой суммы или
              произведения, а не у каждого числа.
            </strong>{" "}
            Сумма 2 + 5 = 7 кратна семи, хотя ни 2, ни 5 на семь не делятся.
            Произведение 2 · 5 = 10 кратно десяти, хотя ни одно из чисел не
            кратно:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 2\ny = 5\nprint((x + y) % 7 == 0, x % 7 == 0 and y % 7 == 0)\nprint((x * y) % 10 == 0, x % 10 == 0 or y % 10 == 0)"
            }
            label={"Сумма и произведение против каждого числа"}
            language="python"
            output={"True False\nTrue False"}
          />
          <Typography.Text>
            Другие выражения, которые встречаются в условиях:
          </Typography.Text>
          <VariantPicker
            label={"Что требуется и выражение"}
            variants={[
              {
                label: "сумма тройки",
                value: <Notation>{"x + y + z"}</Notation>,
              },
              {
                label: "произведение",
                value: <Notation>{"x * y"}</Notation>,
              },
              {
                label: "модуль разности",
                value: <Notation>{"abs(x - y)"}</Notation>,
                note: <>насколько числа отличаются, без знака</>,
              },
              {
                label: "квадрат числа",
                value: <Notation>{"x ** 2"}</Notation>,
                note: (
                  <>
                    степень — <Notation>{"**"}</Notation>, знак{" "}
                    <Notation>{"^"}</Notation> не подходит
                  </>
                ),
              },
              {
                label: "сумма квадратов",
                value: <Notation>{"x ** 2 + y ** 2"}</Notation>,
                note: <>для 3 и 4: 9 + 16 = 25</>,
              },
              {
                label: "квадрат суммы",
                value: <Notation>{"(x + y) ** 2"}</Notation>,
                note: <>для 3 и 4: 7² = 49</>,
              },
            ]}
          />
          <Typography.Text>
            <PythonTerm term="absval">
              <Notation>{"abs"}</Notation>
            </PythonTerm>{" "}
            возвращает модуль — число без знака:
          </Typography.Text>
          <CodeBlock
            code={"print(abs(-1250), abs(1250), abs(0), abs(3 - 8))"}
            label={"Модуль числа"}
            language="python"
            output={"1250 1250 0 5"}
          />
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
                key: "Список",
                note: (
                  <>
                    индексы от <Notation>{"a[0]"}</Notation> до{" "}
                    <Notation>{"a[n - 1]"}</Notation>,{" "}
                    <Notation>{"n = len(a)"}</Notation>
                  </>
                ),
              },
              {
                key: "Файл",
                note: <Notation>{"a = [int(x) for x in f]"}</Notation>,
              },
              {
                key: "Сравнения",
                note: (
                  <>
                    «не больше» — <Notation>{"<="}</Notation>, «не меньше» —{" "}
                    <Notation>{">="}</Notation>
                  </>
                ),
              },
              {
                key: "Кратность",
                note: (
                  <>
                    <Notation>{"x % d == 0"}</Notation>, ноль кратен любому
                    числу
                  </>
                ),
              },
              {
                key: "Счётчик",
                note: (
                  <>
                    <Notation>{"count = 0"}</Notation>, затем{" "}
                    <Notation>{"count += 1"}</Notation> на подходящем
                  </>
                ),
              },
              {
                key: "Сумма",
                note: <>условие на сумму проверяют у самой суммы</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "sosednie-pary",
      navLabel: "Соседние пары",
      explanation: (
        <>
          <Typography.Text>
            Как перебрать все пары соседних чисел?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пара с началом i — это <Notation>{"a[i]"}</Notation> и{" "}
              <Notation>{"a[i + 1]"}</Notation>, а i пробегает все начала по
              очереди.
            </strong>{" "}
            У восьми чисел темы пары такие: (125, 1300), (1300, −1250), …,
            (2025, 3000). Пары пересекаются: 1300 — второе число первой пары и
            первое число второй. Так и должно быть — брать пары через одну
            нельзя.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqWindows2}
            caption={
              <>
                Каждая скобка — соседняя пара. Последняя начинается с индекса 6:
                её второй элемент — последний элемент списка{" "}
                <Notation>{"a[7]"}</Notation>.
              </>
            }
          />
          <Typography.Text>
            Где остановить i? Второй элемент пары —{" "}
            <Notation>{"a[i + 1]"}</Notation>, а последний индекс списка n − 1.
            Значит, i + 1 ≤ n − 1, то есть i ≤ n − 2. Такие начала 0, 1, …, n −
            2 даёт <Notation>{"range(n - 1)"}</Notation>: правая граница в{" "}
            <Notation>{"range"}</Notation> не входит.
          </Typography.Text>
          <CodeBlock
            code={
              SAMPLE_LIST +
              "\nfor i in range(len(a) - 1):\n    print(i, a[i], a[i + 1])"
            }
            label={"Все соседние пары восьми чисел"}
            language="python"
            output={
              "0 125 1300\n1 1300 -1250\n2 -1250 -2100\n3 -2100 7\n4 7 -325\n5 -325 2025\n6 2025 3000"
            }
          />
        </>
      ),
    },
    {
      id: "sosednie-trojki",
      navLabel: "Соседние тройки",
      explanation: (
        <>
          <Typography.Text>А как перебрать тройки?</Typography.Text>
          <Typography.Text>
            <strong>
              Тройка с началом i — <Notation>{"a[i]"}</Notation>,{" "}
              <Notation>{"a[i + 1]"}</Notation>,{" "}
              <Notation>{"a[i + 2]"}</Notation>. Последний индекс i + 2 ≤ n − 1,
              поэтому начала перебирает <Notation>{"range(n - 2)"}</Notation>.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqWindows3}
            caption={
              <>
                Шесть соседних троек восьми чисел: каждая следующая сдвинута на
                одно число. Последняя начинается с индекса n − 3 = 5.
              </>
            }
          />
          <LessonTable
            label={"Соседние тройки восьми чисел темы"}
            columns={[
              { label: "i", numeric: true },
              { label: "Тройка" },
              { label: "Сумма", numeric: true },
            ]}
            rows={[
              ["0", "125, 1300, −1250", "175"],
              ["1", "1300, −1250, −2100", "−2050"],
              ["2", "−1250, −2100, 7", "−3343"],
              ["3", "−2100, 7, −325", "−2418"],
              ["4", "7, −325, 2025", "1707"],
              ["5", "−325, 2025, 3000", "4700"],
            ]}
          />
          <Typography.Text>
            Для групп из k соседних чисел правило то же:{" "}
            <Notation>{"range(n - k + 1)"}</Notation>. Например, четвёрки
            перебирают <Notation>{"range(n - 3)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kolichestvo-i-maksimum",
      navLabel: "Количество и наибольшая сумма",
      explanation: (
        <>
          <Typography.Text>
            Как получить ответ — количество подходящих троек и наибольшую сумму?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Суммы подходящих троек складывают в список: его длина — количество
              троек, а{" "}
              <PythonTerm term="agg">
                <Notation>{"max"}</Notation>
              </PythonTerm>{" "}
              — наибольшая сумма.
            </strong>{" "}
            Пусть порог пока известен: тройка подходит, если её сумма не больше
            2025. По таблице подходят все тройки, кроме последней с суммой 4700:
            их пять, наибольшая сумма 1707. Пройди программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runTriples}
            label={"Тройки с суммой не больше 2025 по шагам"}
          />
          <Typography.Text>
            <Notation>{"sums.append(s)"}</Notation> стоит внутри{" "}
            <Notation>{"if"}</Notation>: сумма попадает в список, только если
            тройка подошла. Каждая подходящая тройка добавляет ровно одну сумму,
            поэтому <Notation>{"len(sums)"}</Notation> — их количество. Если у
            двух троек одинаковые суммы, это всё равно две тройки: повторы из
            списка не удаляют.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: если подходящих троек нет"
          >
            <Typography.Text>
              У пустого списка нет наибольшего элемента:{" "}
              <Notation>{"max([])"}</Notation> остановит программу ошибкой. В
              файлах задания подходящие группы есть. Если же условие говорит,
              что выводить, когда их нет, проверь это перед выводом:{" "}
              <Notation>{"if len(sums) > 0:"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "gruppy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Пара",
                note: (
                  <>
                    <Notation>{"a[i], a[i + 1]"}</Notation> при{" "}
                    <Notation>{"i in range(n - 1)"}</Notation>
                  </>
                ),
              },
              {
                key: "Тройка",
                note: (
                  <>
                    <Notation>{"a[i], a[i + 1], a[i + 2]"}</Notation> при{" "}
                    <Notation>{"i in range(n - 2)"}</Notation>
                  </>
                ),
              },
              {
                key: "k соседних",
                note: <Notation>{"range(n - k + 1)"}</Notation>,
              },
              {
                key: "Пересечение",
                note: <>соседние группы делят элементы — так и надо</>,
              },
              {
                key: "Ответ",
                note: (
                  <>
                    <Notation>{"sums.append(s)"}</Notation> внутри{" "}
                    <Notation>{"if"}</Notation>, затем{" "}
                    <Notation>{"len(sums)"}</Notation> и{" "}
                    <Notation>{"max(sums)"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
  paidPractice: {
    examFocus: true,
    checkpoint: 0,
    load: () => import("./number-sequences.paid.praktika"),
  },
  status: "published",
});
