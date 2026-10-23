import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  RemainderExplorer,
  TokenSet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { divisorsAndMasksLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./divisors-and-masks.media";
import { R, THEME_TASK } from "./divisors-and-masks.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const divisorsAndMasksLesson = defineLesson({
  ...divisorsAndMasksLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Переводить условие в проверки на Python и перебирать числа: отрезок, после границы, по убыванию",
    "Проверять запись числа: последние цифры, сумму цифр, цифры и группы цифр в записи",
    "Находить делители парами до √n, отбирать нужные и считать их",
    "Искать числа с нужным количеством делителей, наибольшим количеством и величиной M",
    "Раскладывать число на простые множители и решать задачу темы о произведении двух простых",
    "Решать задачи с масками: шаг, равный делителю, построение чисел по ? и *",
    "Для огромных диапазонов выводить вид числа по количеству делителей (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "perebor-i-proverki",
      title: "Перебор и запись числа",
      lead: "Что спрашивают в задании 25, как перевести условие в проверки, перебрать числа и проверить цифры записи.",
      conceptIds: [
        "kak-ustroena-tema",
        "delenie-s-ostatkom",
        "uslovie-v-kod",
        "perebor-diapazona",
        "chislo-i-stroka",
        "proverka-in",
        "pervye-najdennye",
        "perebor-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>Запиши на Python проверку: «число нечётное и не превышает 500».</>
          ),
          reveal: (
            <>
              <Notation>{"n % 2 != 0 and n <= 500"}</Notation>: «не превышает»
              пропускает и само 500.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Что напечатает{" "}
              <Notation>{"print(17 // 5, 17 % 5, 5 % 17)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              3 2 5: пятёрка помещается в 17 три раза с остатком 2, а 5 меньше
              17 — полной порции нет, и остаток равен всему числу.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Какой <Notation>{"range"}</Notation> перебирает числа отрезка
              [100; 200]? А числа, большие 100, но меньшие 200?
            </>
          ),
          reveal: (
            <>
              <Notation>{"range(100, 201)"}</Notation> и{" "}
              <Notation>{"range(101, 200)"}</Notation>: правая граница range не
              входит.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Есть ли в записи числа 616161 цифра 1 и цифра 6? Сколько раз в ней
              встречается группа 61?
            </>
          ),
          reveal: (
            <>
              Есть обе. Группа 61 встречается три раза — с позиций 0, 2 и 4:{" "}
              <Notation>{"'616161'.count('61')"}</Notation> даёт 3.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              В цикле <Notation>{"while found < 5"}</Notation> строку{" "}
              <Notation>{"n += 1"}</Notation> поставили внутрь{" "}
              <Notation>{"if"}</Notation>, рядом с{" "}
              <Notation>{"found += 1"}</Notation>. Что случится?
            </>
          ),
          reveal: (
            <>
              На первом неподходящем числе n перестанет меняться, и программа
              будет проверять его бесконечно. Переходить к следующему числу надо
              всегда — подошло текущее или нет.
            </>
          ),
        },
      ],
    },
    {
      slug: "deliteli-parami",
      title: "Делители парами",
      lead: "Почему делители достаточно искать до √n, как не потерять и не задвоить корень, как отобрать и посчитать нужные делители.",
      conceptIds: [
        "delitel",
        "pary-delitelej",
        "pochemu-do-kornya",
        "poisk-po-shagam",
        "funkciya-delitelej",
        "otbor-delitelej",
        "schetchik-delitelej",
        "pary-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Выпиши делители 28: все, без единицы и самого числа и только
              чётные.
            </>
          ),
          reveal: (
            <>
              Все — 1, 2, 4, 7, 14, 28; без 1 и 28 — 2, 4, 7, 14; чётные — 2, 4,
              14, 28.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              До какого d проверяет кандидатов поиск делителей числа 1000?
              Сколько делителей он найдёт?
            </>
          ),
          reveal: (
            <>
              До 31: <Notation>{"isqrt(1000)"}</Notation> = 31. Делителей 16 —
              восемь пар от 1 · 1000 до 25 · 40.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Почему поиск делителей 49 должен проверить d = 7, но добавить 7 в
              список только один раз?
            </>
          ),
          reveal: (
            <>
              Пара 7 · 7 лежит ровно на границе: если остановиться перед 7,
              делитель потеряется. Но оба числа пары одинаковые, поэтому
              делитель здесь один.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Что вернёт <Notation>{"get_divisors(30)"}</Notation> без{" "}
              <Notation>{"sorted"}</Notation>? Можно ли тогда брать наибольший
              делитель как <Notation>{"D[-1]"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"[1, 30, 2, 15, 3, 10, 5, 6]"}</Notation>. Нельзя:
              последним стоит 6, а наибольший делитель — 30.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: <>Сколько делителей у числа 100? Посчитай парами.</>,
          reveal: (
            <>
              9: пары 1 · 100, 2 · 50, 4 · 25 и 5 · 20 дают по два делителя, а
              10 · 10 — один.
            </>
          ),
        },
      ],
    },
    {
      slug: "chisla-po-delitelyam",
      title: "Числа с нужными делителями",
      lead: "Ровно k делителей, наибольшее количество делителей, величина M и наименьший делитель с его парой.",
      access: "paid",
      conceptIds: [
        "rovno-k-delitelej",
        "maksimum-delitelej",
        "velichina-m",
        "naimenshij-i-naibolshij",
        "pervye-posle-granicy",
        "chisla-itogo",
      ],
      paid: {
        outline: [
          { id: "rovno-k-delitelej", navLabel: "Ровно k делителей" },
          { id: "maksimum-delitelej", navLabel: "Больше всего делителей" },
          { id: "velichina-m", navLabel: "Величина M" },
          {
            id: "naimenshij-i-naibolshij",
            navLabel: "Наименьший и наибольший",
          },
          { id: "pervye-posle-granicy", navLabel: "Первые после границы" },
          { id: "chisla-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Как найти числа, у которых ровно два делителя, не считая единицы и
              самого числа?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Перебрать числа, у каждого найти делители, отобрать нужные и
                сравнить их количество с двумя.
              </strong>{" "}
              Функция <Notation>{"get_divisors"}</Notation> из подтемы 2 делает
              самую трудную часть, остаётся перевести условие.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./divisors-and-masks.paid.chisla-po-delitelyam"),
      },
    },
    {
      slug: "prostye-i-razlozhenie",
      title: "Простые числа и разложение",
      lead: "Проверка простоты, разложение на простые множители, простые делители и задача темы о произведении двух простых.",
      access: "paid",
      conceptIds: [
        "prostye-chisla",
        "razlozhenie",
        "prostye-deliteli",
        "mnozhiteli-i-deliteli",
        "zadacha-temy",
        "prostye-itogo",
      ],
      paid: {
        outline: [
          { id: "prostye-chisla", navLabel: "Простые числа" },
          { id: "razlozhenie", navLabel: "Разложение на множители" },
          { id: "prostye-deliteli", navLabel: "Простые делители" },
          { id: "mnozhiteli-i-deliteli", navLabel: "Множители и делители" },
          { id: "zadacha-temy", navLabel: "Задача темы" },
          { id: "prostye-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Какое число простое и как это быстро проверить?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Простое число больше 1 и делится только на 1 и на себя. Делитель
                достаточно искать от 2 до √n: не нашёлся — число простое.
              </strong>{" "}
              Это тот же поиск до корня, что в подтеме 2, только останавливаемся
              на первом найденном делителе.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./divisors-and-masks.paid.prostye-i-razlozhenie"),
      },
    },
    {
      slug: "maski",
      title: "Маски",
      lead: "Знаки ? и *, проверка fnmatch, перебор с шагом, равным делителю, и построение чисел по маске.",
      access: "paid",
      conceptIds: [
        "znaki-maski",
        "fnmatch",
        "perebor-kratnyh",
        "voprosy-po-maske",
        "zvezdochka-po-maske",
        "drugie-maski",
        "maski-itogo",
      ],
      paid: {
        outline: [
          { id: "znaki-maski", navLabel: "Знаки ? и *" },
          { id: "fnmatch", navLabel: "Проверка fnmatch" },
          { id: "perebor-kratnyh", navLabel: "Шаг, равный делителю" },
          { id: "voprosy-po-maske", navLabel: "Числа по маске с ?" },
          { id: "zvezdochka-po-maske", navLabel: "Звёздочка: product" },
          { id: "drugie-maski", navLabel: "Другие маски" },
          { id: "maski-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что означает маска <Notation>{"12*3?"}</Notation> и каким числам
              она соответствует?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Маска — образец записи числа: цифры стоят на своих местах,{" "}
                <Notation>{"?"}</Notation> — ровно одна любая цифра,{" "}
                <Notation>{"*"}</Notation> — любая последовательность цифр, даже
                пустая.
              </strong>{" "}
              Маска говорит только о записи числа, а делимость проверяют
              отдельно.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./divisors-and-masks.paid.maski"),
      },
    },
    {
      slug: "vid-chisla",
      title: "Вид числа по количеству делителей",
      lead: "Количество делителей по разложению и построение кандидатов вместо перебора огромного отрезка.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "formula-kolichestva",
        "forma-chisla",
        "nechetnoe-kolichestvo",
        "vid-vmesto-perebora",
        "vid-i-maska",
        "vid-itogo",
      ],
      paid: {
        outline: [
          {
            id: "formula-kolichestva",
            navLabel: "Количество делителей",
          },
          { id: "forma-chisla", navLabel: "Вид числа" },
          { id: "nechetnoe-kolichestvo", navLabel: "Нечётное количество" },
          { id: "vid-vmesto-perebora", navLabel: "Вид вместо перебора" },
          { id: "vid-i-maska", navLabel: "Вид числа и маска" },
          { id: "vid-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для огромных диапазонов.</strong>{" "}
              Когда чисел так много, что искать делители у каждого не успеть,
              помогает разложение: по количеству делителей видно, как выглядит
              число, и строят только таких кандидатов. Задачи основных подтем
              решаются без этого урока.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./divisors-and-masks.paid.vid-chisla"),
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
            В задании 25 программа перебирает числа и проверяет у каждого
            условие: делимость, делители, простые множители, цифры записи или
            маску. Вот задача, которую мы решим в этой теме:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Перебор пишется в пару строк, а вся работа — в проверке: она
              должна быть верной и быстрой, ведь чисел миллионы.
            </strong>{" "}
            Разберём, что значат слова условия:
          </Typography.Text>
          <LessonTable
            label={"Слова условия задания 25"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              ["делится без остатка, кратно", "остаток равен нулю: n % d == 0"],
              [
                "большие 7 000 000, не превышающие 10⁹",
                "7 000 000 не берём, 10⁹ — берём",
              ],
              [
                "делители, не считая единицы и самого числа",
                "делители d, для которых 1 < d < n",
              ],
              [
                "простое число",
                "больше 1 и делится только на 1 и на само себя",
              ],
              [
                "произведение простых множителей, не обязательно различных",
                "разложение 12 = 2 · 2 · 3: повторы тоже считаются",
              ],
              [
                "содержит в записи цифру 6",
                "проверка строки, а не арифметики: '6' in str(n)",
              ],
              [
                "маска 12?4*5",
                "? — одна любая цифра, * — любые цифры, даже ни одной",
              ],
              [
                "первые пять найденных",
                "идти от границы вверх, пока не найдено пять",
              ],
            ]}
          />
          <Typography.Text>
            Начнём с перебора и записи числа — этого уже хватит, чтобы проверить
            цифры множителей. Потом найдём делители и простые множители и решим
            задачу темы. Тема состоит из пяти подтем и дополнительного урока — у
            каждой своя страница:
          </Typography.Text>
          <ol>
            <li>
              <strong>Перебор и запись числа</strong> — ты сейчас здесь:
              проверки, перебор, цифры записи.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="deliteli-parami">
                Делители парами
              </SubtopicLink>{" "}
              — поиск делителей до √n, отбор и количество.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="chisla-po-delitelyam">
                Числа с нужными делителями
              </SubtopicLink>{" "}
              — ровно k делителей, больше всего делителей, величина M.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="prostye-i-razlozhenie">
                Простые числа и разложение
              </SubtopicLink>{" "}
              — простые множители; решим задачу темы.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="maski">
                Маски
              </SubtopicLink>{" "}
              — знаки ? и *, перебор с шагом и построение чисел по маске.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="vid-chisla">
                Вид числа по количеству делителей
              </SubtopicLink>{" "}
              — дополнительный урок для огромных диапазонов.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "delenie-s-ostatkom",
      navLabel: "Деление с остатком",
      explanation: (
        <>
          <Typography.Text>
            Что значит «делится без остатка» и как проверить это в программе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Число n делится на d, если остаток от деления равен нулю:{" "}
              <PythonTerm term="eq">
                <Notation>{"n % d == 0"}</Notation>
              </PythonTerm>
              .
            </strong>{" "}
            Разделим 17 на 5: пятёрка помещается в 17 три раза, и остаются две
            единицы — 17 = 5 · 3 + 2. В Python частное даёт{" "}
            <Notation>{"17 // 5"}</Notation>, это 3, а остаток —{" "}
            <Notation>{"17 % 5"}</Notation>, это 2.
          </Typography.Text>
          <RemainderExplorer
            n={17}
            d={5}
            caption={
              <>
                Клетки числа n разложены порциями по d: полные порции — частное{" "}
                <Notation>{"n // d"}</Notation>, клетки, которым не хватило на
                порцию, — остаток <Notation>{"n % d"}</Notation>. Меняй числа
                или выбери пример.
              </>
            }
          />
          <Typography.Text>
            Остаток всегда меньше делителя: будь он больше, из него сложилась бы
            ещё одна порция. У 20 и 5 порции заполняются ровно —{" "}
            <Notation>{"20 % 5"}</Notation> равно 0, значит, 20 делится на 5. А
            если число меньше делителя, порции нет совсем:{" "}
            <Notation>{"3 // 7"}</Notation> — это 0, а{" "}
            <Notation>{"3 % 7"}</Notation> — всё число, 3.
          </Typography.Text>
          <Typography.Text>
            Обычное деление <Notation>{"/"}</Notation> здесь не нужно:{" "}
            <Notation>{"18 / 3"}</Notation> даёт дробное{" "}
            <Notation>{"6.0"}</Notation>. Степень для больших границ пишут через{" "}
            <Notation>{"**"}</Notation>: 10⁹ — это{" "}
            <Notation>{"10 ** 9"}</Notation>, а не{" "}
            <Notation>{"10 ^ 9"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uslovie-v-kod",
      navLabel: "Условие — в код",
      explanation: (
        <>
          <Typography.Text>
            Как перевести слова условия в проверку и не ошибиться на границе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Слово за словом: «кратно» — остаток ноль, «больше» — строгое
              сравнение, «не превышает» — нестрогое, «и» —{" "}
              <PythonTerm term="andor">
                <Notation>{"and"}</Notation>
              </PythonTerm>
              , «или» — <Notation>{"or"}</Notation>.
            </strong>{" "}
            Похожие формулировки различаются одним знаком. Выбери формулировку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка условия и её проверка"}
            defaultIndex={1}
            variants={[
              {
                label: "кратно 7",
                value: <Notation>{"n % 7 == 0"}</Notation>,
                note: <>остаток равен нулю</>,
              },
              {
                label: "не кратно 7",
                value: <Notation>{"n % 7 != 0"}</Notation>,
                note: (
                  <>
                    остаток не ноль; <Notation>{"!="}</Notation> — «не равно»
                  </>
                ),
              },
              {
                label: "нечётное",
                value: <Notation>{"n % 2 != 0"}</Notation>,
                note: <>не делится на 2</>,
              },
              {
                label: "больше 100",
                value: <Notation>{"n > 100"}</Notation>,
                note: <>само 100 не подходит</>,
              },
              {
                label: "не меньше 100",
                value: <Notation>{"n >= 100"}</Notation>,
                note: <>100 подходит</>,
              },
              {
                label: "не превышает 100",
                value: <Notation>{"n <= 100"}</Notation>,
                note: <>100 подходит</>,
              },
              {
                label: "на отрезке [100; 200]",
                value: <Notation>{"100 <= n <= 200"}</Notation>,
                note: <>обе границы входят</>,
              },
            ]}
          />
          <Typography.Text>
            <Notation>{"or"}</Notation> не значит «ровно одно из двух»: число 15
            подходит под «делится на 3 или на 5», хотя делится на оба.
          </Typography.Text>
          <CodeBlock
            code={
              "n = 15\nprint(n % 3 == 0 and n % 5 == 0)\nprint(n % 3 == 0 or n % 5 == 0)"
            }
            label={"and и or"}
            language="python"
            output={"True\nTrue"}
          />
        </>
      ),
    },
    {
      id: "perebor-diapazona",
      navLabel: "Перебор отрезка",
      explanation: (
        <>
          <Typography.Text>
            Как проверить все числа отрезка подряд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Циклом{" "}
              <PythonTerm term="for">
                <Notation>{"for"}</Notation>
              </PythonTerm>{" "}
              по <Notation>{"range"}</Notation>. Правая граница range не входит,
              поэтому отрезок [L; R] — это{" "}
              <Notation>{"range(L, R + 1)"}</Notation>.
            </strong>{" "}
            Выведем числа отрезка [10; 30], кратные 3:
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(10, 31):\n    if n % 3 == 0:\n        print(n)"
            }
            label={"Числа отрезка [10; 30], кратные 3"}
            language="python"
            output={"12\n15\n18\n21\n24\n27\n30"}
          />
          <Typography.Text>
            Граница 31 — чтобы проверить и само 30. А «числа, большие 7 000 000»
            начинаются с 7 000 001: сама граница в «больше» не входит.
          </Typography.Text>
          <Typography.Text>
            Сколько чисел можно так перебрать? Десять миллионов простых проверок
            Python делает за секунду-другую, а миллиард — уже за несколько
            минут. Поэтому в масках будем перебирать умнее.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-i-stroka",
      navLabel: "Число и его запись",
      explanation: (
        <>
          <Typography.Text>
            Как узнать о числе то, что видно в его записи: сколько в нём цифр,
            какая последняя, какова сумма цифр?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Превратить число в строку:{" "}
              <PythonTerm term="str">
                <Notation>{"str(n)"}</Notation>
              </PythonTerm>{" "}
              — это его запись, у неё есть длина и отдельные символы. Последние
              цифры удобно брать остатком: <Notation>{"n % 10"}</Notation>,{" "}
              <Notation>{"n % 100"}</Notation>.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 50721\ns = str(n)\nprint(len(s), s[0], s[-1])\nprint(n % 10, n % 100, n // 100)\n\ndigit_sum = 0\nfor ch in s:\n    digit_sum += int(ch)\nprint(digit_sum)"
            }
            label={"Цифры числа 50721"}
            language="python"
            output={"5 5 1\n1 21 507\n15"}
          />
          <Typography.Text>
            Пять цифр, первая 5, последняя 1. Остаток от деления на 10 —
            последняя цифра, на 100 — две последние, а{" "}
            <Notation>{"n // 100"}</Notation> отбрасывает их. Сумму цифр считает
            цикл по символам записи: <Notation>{"int(ch)"}</Notation> превращает
            символ «7» в число 7.
          </Typography.Text>
          <Typography.Text>
            Окончание с нулём проверяй по записи: у 7 и у 107 остаток{" "}
            <Notation>{"n % 100"}</Notation> один — 7, но на «07» оканчивается
            только 107. Это проверка{" "}
            <Notation>{"str(n).endswith('07')"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proverka-in",
      navLabel: "Цифры в записи",
      explanation: (
        <>
          <Typography.Text>
            Как проверить условие задачи темы: «множитель содержит в записи
            цифру 1 и цифру 6»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Оператором{" "}
              <PythonTerm term="in">
                <Notation>{"in"}</Notation>
              </PythonTerm>{" "}
              над записью: <Notation>{"'1' in s"}</Notation> истинно, если
              символ 1 есть в строке хотя бы раз. Группу цифр ищут так же, а{" "}
              <Notation>{"s.count('53')"}</Notation> считает, сколько раз она
              встречается.
            </strong>{" "}
            Проверку двух цифр оформим{" "}
            <PythonTerm term="def">функцией</PythonTerm>: в строке с{" "}
            <Notation>{"def"}</Notation> — её имя и параметр p, а{" "}
            <Notation>{"return"}</Notation> возвращает ответ — True или False.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def has_1_and_6(p):\n    s = str(p)\n    return '1' in s and '6' in s\n\nprint(has_1_and_6(61), has_1_and_6(163), has_1_and_6(71))"
            }
            label={"Есть ли в записи цифры 1 и 6"}
            language="python"
            output={"True True False"}
          />
          <Typography.Text>
            В 61 и 163 есть обе цифры, в 71 нет шестёрки. Такую проверку мы
            применим к каждому из двух множителей в задаче темы. Другие
            формулировки про цифры числа n — выбери; везде{" "}
            <Notation>{"s = str(n)"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка про цифры записи и её проверка"}
            variants={[
              {
                label: "содержит цифру 7",
                value: <Notation>{"'7' in s"}</Notation>,
              },
              {
                label: "не содержит 0",
                value: <Notation>{"'0' not in s"}</Notation>,
              },
              {
                label: "есть 2 или 3",
                value: <Notation>{"'2' in s or '3' in s"}</Notation>,
              },
              {
                label: "«53» ровно один раз",
                value: <Notation>{"s.count('53') == 1"}</Notation>,
              },
              {
                label: "оканчивается на 37",
                value: <Notation>{"n % 100 == 37"}</Notation>,
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Когда count ошибается">
            <Typography.Text>
              <Notation>{"count"}</Notation> ищет вхождения без перекрытий:
              нашёл группу — продолжает после неё. В 7777 он найдёт 77 дважды,
              хотя начинаться 77 может с трёх мест:
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.overlap7777_77}
              caption={
                <>
                  Жирные отрезки — то, что находит{" "}
                  <Notation>{"count"}</Notation>: после 77 с позиции 0 поиск
                  идёт с позиции 2, и 77 с позиции 1 пропускается.
                </>
              }
            />
            <Typography.Text>
              У групп вроде 53 или 567 начало не совпадает с концом, им
              перекрываться не с чем, и <Notation>{"count"}</Notation> прав. Для
              77 или 121 сначала пойми, что считает условие.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "pervye-najdennye",
      navLabel: "Первые найденные",
      explanation: (
        <>
          <Typography.Text>
            В задаче темы нет верхней границы: «перебирает числа, большие 7 000
            000, … первые пять найденных». Докуда же идти?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пока не найдено пять: цикл{" "}
              <PythonTerm term="while">
                <Notation>{"while"}</Notation>
              </PythonTerm>{" "}
              со счётчиком найденных. Число увеличиваем на каждом шаге, а
              счётчик — только когда число подошло.
            </strong>{" "}
            Найдём три первых числа больше 1000, которые делятся на 13 и
            содержат цифру 7:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 1001\nfound = 0\nwhile found < 3:\n    if n % 13 == 0 and '7' in str(n):\n        print(n)\n        found += 1\n    n += 1"
            }
            label={"Первые три числа больше 1000"}
            language="python"
            output={"1027\n1079\n1157"}
          />
          <Typography.Text>
            Числа идут по возрастанию и ни одно не пропущено, поэтому первые три
            успешные проверки — это три наименьших подходящих числа.
          </Typography.Text>
          <Typography.Text>
            Если спрашивают о наибольших числах, идут вниз:{" "}
            <Notation>{"range"}</Notation> с шагом −1, а после нужного
            количества цикл прерывает{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>
            . Нижняя граница 0 не даст уйти в отрицательные числа, если
            подходящих меньше трёх:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "found = []\nfor n in range(999, 0, -1):\n    if n % 13 == 0 and '7' in str(n):\n        found.append(n)\n        if len(found) == 3:\n            break\n\nprint(found)"
            }
            label={"Три наибольших числа меньше 1000"}
            language="python"
            output={"[975, 897, 871]"}
          />
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
              { key: "Делится", note: <Notation>{"n % d == 0"}</Notation> },
              {
                key: "Отрезок [L; R]",
                note: <Notation>{"range(L, R + 1)"}</Notation>,
              },
              {
                key: "Первые k после N",
                note: (
                  <>
                    с N + 1, <Notation>{"while found < k"}</Notation>
                  </>
                ),
              },
              {
                key: "Наибольшие k",
                note: <>вниз по range и break</>,
              },
              {
                key: "Цифры записи",
                note: (
                  <>
                    <Notation>{"str(n)"}</Notation>, <Notation>{"in"}</Notation>
                    , <Notation>{"count"}</Notation>
                  </>
                ),
              },
              {
                key: "Последние цифры",
                note: (
                  <>
                    <Notation>{"n % 10"}</Notation>,{" "}
                    <Notation>{"n % 100"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "delitel",
      navLabel: "Что такое делитель",
      explanation: (
        <>
          <Typography.Text>
            Что такое делитель и о каких делителях спрашивает условие?
          </Typography.Text>
          <Typography.Text>
            <strong>
              d — делитель n, если n делится на d без остатка. Условие часто
              берёт не все делители: без единицы и самого числа, только чётные
              или только простые.
            </strong>{" "}
            Делители 12 — это 1, 2, 3, 4, 6 и 12: 12 = 1 · 12 = 2 · 6 = 3 · 4. А
            5 не делитель: 12 = 5 · 2 + 2. Выбери требование — подходящие
            делители 12 выделятся:
          </Typography.Text>
          <VariantPicker
            label={"Какие делители 12 подходят под требование"}
            variants={[
              {
                label: "все делители",
                value: (
                  <TokenSet
                    values={[1, 2, 3, 4, 6, 12]}
                    selected={[1, 2, 3, 4, 6, 12]}
                  />
                ),
              },
              {
                label: "кроме 1 и самого числа",
                value: (
                  <TokenSet
                    values={[1, 2, 3, 4, 6, 12]}
                    selected={[2, 3, 4, 6]}
                  />
                ),
              },
              {
                label: "чётные",
                value: (
                  <TokenSet
                    values={[1, 2, 3, 4, 6, 12]}
                    selected={[2, 4, 6, 12]}
                  />
                ),
              },
              {
                label: "простые",
                value: (
                  <TokenSet values={[1, 2, 3, 4, 6, 12]} selected={[2, 3]} />
                ),
                note: <>простые числа разберём в подтеме 4</>,
              },
            ]}
          />
          <Typography.Text>
            Единицу и само число исключают, только если условие говорит об этом
            прямо. Чётные делители 12 включают и само 12.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pary-delitelej",
      navLabel: "Делители парами",
      explanation: (
        <>
          <Typography.Text>
            Как найти все делители числа, не проверяя каждое число до n? Для
            числа около миллиарда это миллиард проверок, а чисел в задаче —
            миллионы.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Делители идут парами: если d делит n, то и{" "}
              <Notation>{"n // d"}</Notation> делит n. Нашёл меньший делитель
              пары — получил и больший.
            </strong>{" "}
            Это хорошо видно на клетках: из 36 одинаковых клеток прямоугольник
            без пустых мест складывается пятью способами.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.rectangles36}
            caption={
              <>
                Все прямоугольники из 36 клеток. Ширина и высота каждого — пара
                делителей 36.
              </>
            }
          />
          <Typography.Text>
            Ширина 4 подходит, потому что 36 делится на 4 — выходит ровно 9
            рядов. Ширина 5 не подходит: 36 = 5 · 7 + 1, одна клетка лишняя.
            Ширина растёт — 1, 2, 3, 4, 6, — а высота падает — 36, 18, 12, 9, 6.
            На квадрате 6 × 6 они встречаются.
          </Typography.Text>
          <Typography.Text>
            Дальше новых пар нет: ширина 9 — это тот же прямоугольник 4 × 9,
            только повёрнутый. Сторона квадрата из n клеток называется
            квадратным корнем из n, √n. Для 36 это 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pochemu-do-kornya",
      navLabel: "Почему хватает √n",
      explanation: (
        <>
          <Typography.Text>
            Почему не бывает пары, в которой оба делителя больше √n?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Прямоугольник, у которого обе стороны больше 6, целиком накрывает
              квадрат 6 × 6 и ещё выходит за него — 36 клеток ему не хватит.
              Значит, в каждой паре хотя бы один делитель не больше √n.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cover}
            caption={
              <>
                Квадрат 6 × 6 — это уже все 36 клеток. Прямоугольник 7 × 8
                содержит его и ещё клетки вокруг: в нём 56 клеток.
              </>
            }
          />
          <Typography.Text>
            Поэтому кандидатов d проверяют, только пока d · d ≤ n. Если n не
            квадрат, граница — целая часть корня: √40 между 6 и 7, и для 40
            хватает d до 6. Её точно считает <Notation>{"isqrt(n)"}</Notation>{" "}
            из модуля <Notation>{"math"}</Notation>. Выигрыш огромный:
          </Typography.Text>
          <LessonTable
            label={"Сколько кандидатов проверить"}
            columns={[
              { label: "Число n", numeric: true },
              { label: "До n", numeric: true },
              { label: "До √n", numeric: true },
            ]}
            rows={[
              ["10⁶", "1 000 000", "1 000"],
              ["10⁹", "1 000 000 000", "31 622"],
              ["10¹²", "1 000 000 000 000", "1 000 000"],
            ]}
          />
          <ProofDisclosure summary="Доказательство для любого n">
            <Typography.Text>
              Пусть n = d · q и оба множителя больше √n. Тогда d · q {">"} √n ·
              √n = n — противоречие с d · q = n. Значит, хотя бы один множитель
              пары не больше √n.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "poisk-po-shagam",
      navLabel: "Поиск по шагам",
      explanation: (
        <>
          <Typography.Text>
            Как программа находит все девять делителей 36, проверив только числа
            от 1 до 6?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Для каждого d от 1 до √n: если n делится на d, в список идут d и
              его пара n // d. Пару квадрата 6 · 6 добавляют один раз.
            </strong>{" "}
            Слева на прямой — кандидаты от 1 до 6, справа — их пары. Переключай
            шаги: у каждого делителя появляется дуга к его паре, а не делитель
            отмечается крестиком.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.searchStepper36}
            label={"Поиск делителей 36 до корня по шагам"}
          />
          <Typography.Text>
            Все дуги начинаются не правее пунктира √36. Большие делители 9, 12,
            18 и 36 программа ни разу не проверяла — она получила их как пары. А
            на d = 6 пара — само 6, и добавлять его второй раз нельзя: у 36
            девять различных делителей, а не десять.
          </Typography.Text>
          <Typography.Text>
            Сам корень проверять обязательно: если для 49 остановиться перед 7,
            пропадёт делитель 7.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "funkciya-delitelej",
      navLabel: "Функция делителей",
      explanation: (
        <>
          <Typography.Text>
            Делители понадобятся во многих задачах. Как написать поиск один раз
            и пользоваться им везде?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Оформить его <PythonTerm term="def">функцией</PythonTerm>: она
              получает n и возвращает список его делителей по возрастанию.
            </strong>{" "}
            <PythonTerm term="import">
              <Notation>{"from math import isqrt"}</Notation>
            </PythonTerm>{" "}
            подключает целый корень.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "from math import isqrt\n\ndef get_divisors(n):\n    divisors = []\n    for d in range(1, isqrt(n) + 1):\n        if n % d == 0:\n            divisors.append(d)\n            if n // d != d:\n                divisors.append(n // d)\n    return sorted(divisors)\n\nprint(get_divisors(36))"
            }
            label={"Функция get_divisors"}
            language="python"
            output={"[1, 2, 3, 4, 6, 9, 12, 18, 36]"}
          />
          <Typography.Text>
            <Notation>{"isqrt(n) + 1"}</Notation> — потому что правая граница
            range не входит, а корень проверить надо. Делители находятся парами,
            и без{" "}
            <PythonTerm term="sorted">
              <Notation>{"sorted"}</Notation>
            </PythonTerm>{" "}
            список был бы{" "}
            <Notation>{"[1, 36, 2, 18, 3, 12, 4, 9, 6]"}</Notation>. Функция
            возвращает список через <Notation>{"return"}</Notation>, а не
            печатает: дальше делители будем отбирать, считать и складывать. В
            следующих подтемах считаем, что она уже написана выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otbor-delitelej",
      navLabel: "Отбор делителей",
      explanation: (
        <>
          <Typography.Text>
            Как оставить только те делители, о которых спрашивает условие?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала найти все делители, потом отобрать нужные условием на
              делитель d.
            </strong>{" "}
            Отбор в одну строку записывает{" "}
            <PythonTerm term="comp">списковое включение</PythonTerm>: «d для
            каждого d из делителей, если 1 {"<"} d {"<"} n».
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "n = 36\nD = [d for d in get_divisors(n) if 1 < d < n]\nprint(D)\nprint(len(D), D[0], D[-1], sum(D))"
            }
            label={"Делители 36 без единицы и самого числа"}
            language="python"
            output={"[2, 3, 4, 6, 9, 12, 18]\n7 2 18 54"}
          />
          <Typography.Text>
            Список отсортирован, поэтому наименьший делитель —{" "}
            <Notation>{"D[0]"}</Notation>, наибольший —{" "}
            <Notation>{"D[-1]"}</Notation>, второй по величине —{" "}
            <Notation>{"D[-2]"}</Notation>. Для других требований меняется
            только условие — выбери:
          </Typography.Text>
          <VariantPicker
            label={"Какие делители нужны и условие для делителя d"}
            variants={[
              {
                label: "без 1 и n",
                value: <Notation>{"1 < d < n"}</Notation>,
              },
              {
                label: "без самого числа",
                value: <Notation>{"d < n"}</Notation>,
              },
              { label: "чётные", value: <Notation>{"d % 2 == 0"}</Notation> },
              {
                label: "оканчиваются на 7",
                value: <Notation>{"d % 10 == 7"}</Notation>,
              },
              {
                label: "кратные 7",
                value: <Notation>{"d % 7 == 0"}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            Условие стоит на <Notation>{"d"}</Notation>, а не на{" "}
            <Notation>{"n"}</Notation>: <Notation>{"d % 7 == 0"}</Notation> —
            «делитель кратен 7», а <Notation>{"n % 7 == 0"}</Notation> — «само
            число кратно 7». И проверяй длину: если в списке один делитель,{" "}
            <Notation>{"D[-2]"}</Notation> вызовет ошибку.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Почему чётные делители не ищут шагом 2"
          >
            <Typography.Text>
              В паре делителей один может быть нечётным, а другой чётным: 18 = 3
              · 6. Если до корня проверять только чётные d, пропадёт 3, а с ним
              и чётный 6.
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.arcs18_10e6f9}
              caption={
                <>
                  Делители 18 парами, чётные закрашены. Пунктир — √18 ≈ 4,24.
                  Чётные кандидаты 2 и 4 находят только пару (2, 9); чётные 6 и
                  18 стоят в парах с нечётными 3 и 1.
                </>
              }
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "schetchik-delitelej",
      navLabel: "Счётчик делителей",
      explanation: (
        <>
          <Typography.Text>
            Если нужно только количество делителей, зачем хранить их список?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Хватит счётчика: пара разных делителей добавляет 2, пара квадрата
              d · d = n — 1.
            </strong>{" "}
            <PythonTerm term="augassign">
              <Notation>{"count += 2"}</Notation>
            </PythonTerm>{" "}
            — это <Notation>{"count = count + 2"}</Notation>.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "def count_divisors(n):\n    count = 0\n    for d in range(1, isqrt(n) + 1):\n        if n % d == 0:\n            if d * d == n:\n                count += 1\n            else:\n                count += 2\n    return count\n\nprint(count_divisors(36), count_divisors(40))"
            }
            label={"Количество делителей"}
            language="python"
            output={"9 8"}
          />
          <Typography.Text>
            У 36 пары 1 · 36, 2 · 18, 3 · 12 и 4 · 9 дают по два делителя, а 6 ·
            6 — один: 2 + 2 + 2 + 2 + 1 = 9. У 40 квадратной пары нет — четыре
            пары, восемь делителей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pary-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Делитель", note: <Notation>{"n % d == 0"}</Notation> },
              {
                key: "Пара",
                note: (
                  <>
                    d и <Notation>{"n // d"}</Notation>
                  </>
                ),
              },
              {
                key: "Граница",
                note: (
                  <>
                    d от 1 до <Notation>{"isqrt(n)"}</Notation> включительно
                  </>
                ),
              },
              { key: "Квадрат", note: <>корень добавить один раз</> },
              {
                key: "Отбор",
                note: (
                  <>
                    условие на d, а не на n; список —{" "}
                    <Notation>{"sorted"}</Notation>
                  </>
                ),
              },
              {
                key: "Количество",
                note: <>+2 за пару, +1 за корень</>,
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
    load: () => import("./divisors-and-masks.paid.praktika"),
  },
  status: "published",
});
