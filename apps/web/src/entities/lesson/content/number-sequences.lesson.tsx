import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  VariantPicker,
} from "~/shared/components/learning-content";
import { numberSequencesLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./number-sequences.media";
import { PythonTerm } from "./python-term";

export const numberSequencesLesson = defineLesson({
  ...numberSequencesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать файл в список и переводить слова условия в проверки делимости, суммы и произведения",
    "Переводить «хотя бы одно», «ровно одно», «одно…, а другое…» через количество выполненных проверок",
    "Работать с цифрами отрицательных чисел через модуль и проверять знак с учётом нуля",
    "Выводить границу перебора соседних пар и троек и копить ответ без лишнего списка",
    "Сначала находить характеристику всей последовательности, затем проверять группы",
    "Различать величину проверки и величину ответа",
    "Для редких задач — треугольники и любые пары (дополнительные уроки)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "chisla-i-proverki",
      title: "Числа файла и проверки условия",
      lead: "Элемент — число на своём месте, файл — список чисел, слова условия — буквальные проверки делимости, суммы и произведения.",
      conceptIds: [
        "kak-ustroena-tema",
        "posledovatelnost",
        "kolichestvo-i-velichina",
        "spisok",
        "fajl-v-spisok",
        "pervaya-stroka",
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
              В последовательности 8, −12, 5, 20, −3, 14 назови обычный номер и
              индекс элемента 20. Как обратиться к последнему элементу через{" "}
              <Notation>{"n = len(a)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Номер 4, индекс 3. Последний элемент —{" "}
              <Notation>{"a[n - 1]"}</Notation>, то есть{" "}
              <Notation>{"a[5]"}</Notation> = 14.
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
              положительные кратные девяти?
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
              Для пары (4, 6) ответь: кратна ли пяти сумма; кратно ли пяти хотя
              бы одно из чисел; кратно ли восьми произведение; кратно ли восьми
              хотя бы одно из чисел.
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
      ],
    },
    {
      slug: "skolko-podhodit",
      title: "Сколько элементов подходит",
      lead: "«Хотя бы одно», «ровно одно», «не более двух» и «одно…, а другое…» — через количество выполненных проверок и распределение свойств.",
      conceptIds: [
        "skolko-elementov",
        "i-ili-ne",
        "rovno-odno",
        "raznye-svojstva",
        "skobki",
        "odno-a-drugoe",
        "skolko-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Свойство — «число кратно трём». Какие из пар (12, 7), (7, 8), (3,
              30), (5, 21) подходят под «хотя бы одно», какие — под «оба», какие
              — под «ровно одно»?
            </>
          ),
          reveal: (
            <>
              «Хотя бы одно» — (12, 7), (3, 30), (5, 21); «оба» — (3, 30);
              «ровно одно» — (12, 7) и (5, 21). Пара (7, 8) не подходит никуда.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              В тройке 9, 10, 25 сколько чисел кратны трём и сколько — пяти?
              Выполнено ли условие «кратных трём больше, чем кратных пяти»?
            </>
          ),
          reveal: (
            <>
              Кратно трём одно число (9), пяти — два (10 и 25), условие не
              выполнено: 1 {">"} 2 ложно.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Пусть <Notation>{"k"}</Notation> — количество чётных чисел тройки.
              Переведи через <Notation>{"k"}</Notation>: «не менее двух чётных»,
              «есть чётные, но не все», «ни одного чётного», «не более одного
              чётного».
            </>
          ),
          reveal: (
            <>
              <Notation>{"k >= 2"}</Notation>,{" "}
              <Notation>{"0 < k < 3"}</Notation>,{" "}
              <Notation>{"k == 0"}</Notation>, <Notation>{"k <= 1"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Чему равно{" "}
              <Notation>{"x % 5 == 0 or y % 5 == 0 and x + y > 50"}</Notation>{" "}
              для пары (10, 12)? Чему равна правильная запись условия «хотя бы
              одно число кратно пяти, а сумма больше 50» для этой пары?
            </>
          ),
          reveal: (
            <>
              <Notation>{"True"}</Notation>: Python сначала вычисляет{" "}
              <Notation>{"and"}</Notation>, а 10 делится на пять. Правильная
              запись{" "}
              <Notation>
                {"(x % 5 == 0 or y % 5 == 0) and (x + y > 50)"}
              </Notation>{" "}
              даёт <Notation>{"False"}</Notation>: сумма 22.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Пара (12, 4), <Notation>{"T = 10"}</Notation>. Проверь три
              условия: «хотя бы одно делится на три и хотя бы одно меньше{" "}
              <Notation>{"T"}</Notation>», «одно делится на три, а другое меньше{" "}
              <Notation>{"T"}</Notation>», «хотя бы одно одновременно делится на
              три и меньше <Notation>{"T"}</Notation>».
            </>
          ),
          reveal: (
            <>
              Да, да, нет: 12 делится на три, 4 меньше десяти, но ни одно число
              не обладает обоими свойствами сразу.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              Подходит ли пара (6, 9) при <Notation>{"T = 10"}</Notation> под
              условие «одно число делится на три, а другое меньше{" "}
              <Notation>{"T"}</Notation>»? Объясни, какое распределение ролей
              подходит.
            </>
          ),
          reveal: (
            <>
              Подходит: 6 делится на три, а 9 меньше десяти. Подходит и второе
              распределение — 9 делится на три, а 6 меньше десяти, но пара всё
              равно считается один раз.
            </>
          ),
        },
        {
          id: "zadacha-7",
          prompt: (
            <>
              В тройке 15, 30, 7 сколько чисел кратны трём и сколько — пяти?
              Почему 15 и 30 считаются дважды?
            </>
          ),
          reveal: (
            <>
              Кратны трём 15 и 30, пяти — тоже 15 и 30: k3 = 2, k5 = 2. Каждое
              свойство считается отдельно, и одно число может обладать обоими.
            </>
          ),
        },
      ],
    },
    {
      slug: "cifry-i-znak",
      title: "Цифры и знак числа",
      lead: "Окончание отрицательного числа через модуль, цифры в разрядах, количество цифр числовыми границами и знак с учётом нуля.",
      conceptIds: [
        "cifry-i-znak",
        "poslednie-cifry",
        "gde-nuzhen-modul",
        "kolichestvo-cifr",
        "cifra-v-razryade",
        "znak-chisla",
        "cifry-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-2",
          prompt: (
            <>
              Какие из чисел 7, −17, 170, −107, 1007 оканчиваются на 7? Какие
              оканчиваются двумя символами <Notation>{"07"}</Notation>?
            </>
          ),
          reveal: (
            <>
              На 7 оканчиваются 7, −17, −107, 1007; двумя символами{" "}
              <Notation>{"07"}</Notation> — только −107 и 1007: у числа 7 нет
              второй цифры.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Для <Notation>{"x = -9"}</Notation> верно ли условие «остаток от
              деления на 4 равен 3»? Что изменится, если ошибочно взять модуль?
            </>
          ),
          reveal: (
            <>
              Верно: −9 = (−3) · 4 + 3, <Notation>{"-9 % 4"}</Notation> равно 3.
              С модулем получится <Notation>{"abs(-9) % 4"}</Notation> = 1, и
              условие станет ложным.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Какие из чисел 99, −100, 999, −1000, 450, −45 трёхзначные по
              модулю?
            </>
          ),
          reveal: <>−100, 999 и 450.</>,
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Найди последнюю, предпоследнюю и первую цифры записи −2048. У
              каких из чисел −455, 1050, 33, 5 две последние цифры одинаковы?
            </>
          ),
          reveal: (
            <>
              Последняя 8, предпоследняя 4, первая 2. Две последние цифры
              одинаковы у −455 и 33; у 5 всего одна цифра.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              Пара (−5, 0): в ней ровно одно отрицательное число? Выполнено ли
              для неё <Notation>{"x * y < 0"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Ровно одно отрицательное — да; <Notation>{"x * y < 0"}</Notation>{" "}
              — нет: произведение равно 0.
            </>
          ),
        },
        {
          id: "zadacha-7",
          prompt: (
            <>
              Тройка −4, −1, −6: все ли числа одного знака? Какой знак у их
              произведения и почему по нему нельзя судить?
            </>
          ),
          reveal: (
            <>
              Да, все отрицательные. Произведение −24 отрицательно: у трёх
              отрицательных чисел произведение отрицательно, а у −2, −3, 5
              положительно, поэтому знак произведения ничего не говорит об
              одинаковости знаков.
            </>
          ),
        },
      ],
    },
    {
      slug: "sosednie-gruppy",
      title: "Соседние пары и тройки",
      lead: "Граница перебора выводится, а не заучивается; ответ копится списком или счётчиком с лучшим значением, которое не начинается с нуля.",
      access: "paid",
      conceptIds: [
        "granica-perebora",
        "sosednie-pary",
        "sosednie-trojki",
        "pervaya-zadacha",
        "bez-spiska-summ",
        "pochemu-verno",
        "gruppy-itogo",
      ],
      paid: {
        outline: [
          { id: "granica-perebora", navLabel: "Граница перебора" },
          { id: "sosednie-pary", navLabel: "Соседние пары" },
          { id: "sosednie-trojki", navLabel: "Соседние тройки" },
          { id: "pervaya-zadacha", navLabel: "Первая задача целиком" },
          { id: "bez-spiska-summ", navLabel: "Без списка сумм" },
          { id: "pochemu-verno", navLabel: "Почему это верно" },
          { id: "gruppy-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Соседние пары и тройки перебираются по индексу начала, а граница
                перебора выводится из последнего индекса списка.
              </strong>{" "}
              Соседние группы — в 75 задачах подборки из 85 и во всех 15 задачах
              реальных экзаменов; в 37 из них это тройки и четвёрки.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./number-sequences.paid.sosednie-gruppy"),
      },
    },
    {
      slug: "vsya-posledovatelnost",
      title: "Характеристика всей последовательности",
      lead: "Порог, известный только после просмотра всего файла: отбор, минимум, максимум, количество и среднее — до перебора групп.",
      access: "paid",
      conceptIds: [
        "porog-po-vsem",
        "predvaritelnaya-harakteristika",
        "vidy-harakteristik",
        "ishodnye-chisla",
        "polnaya-zadacha",
        "trojki-s-porogom",
        "srednee",
        "srednee-bez-drobej",
        "ne-povtoryat",
        "lomayushchie-preobrazovaniya",
        "posledovatelnost-itogo",
      ],
      paid: {
        outline: [
          { id: "porog-po-vsem", navLabel: "Порог по всем числам" },
          {
            id: "predvaritelnaya-harakteristika",
            navLabel: "Сначала характеристика",
          },
          {
            id: "vidy-harakteristik",
            navLabel: "Минимум, максимум, количество",
          },
          { id: "ishodnye-chisla", navLabel: "Исходные числа" },
          { id: "polnaya-zadacha", navLabel: "Полная задача" },
          { id: "trojki-s-porogom", navLabel: "Тройки с порогом" },
          { id: "srednee", navLabel: "Среднее арифметическое" },
          { id: "srednee-bez-drobej", navLabel: "Среднее без дробей" },
          { id: "ne-povtoryat", navLabel: "Не повторять в цикле" },
          {
            id: "lomayushchie-preobrazovaniya",
            navLabel: "Что ломает соседство",
          },
          { id: "posledovatelnost-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Если условие опирается на величину всей последовательности —
                наименьший элемент с нужным окончанием, количество кратных,
                среднее, — её находят заранее, отдельным проходом.
              </strong>{" "}
              Так устроены 69 задач подборки из 85 и все 15 задач реальных
              экзаменов: «сумма тройки больше максимального элемента,
              оканчивающегося на 19», «сумма пары меньше количества чисел,
              кратных 23».
            </Typography.Text>
          </>
        ),
        selfCheck: 3,
        load: () => import("./number-sequences.paid.vsya-posledovatelnost"),
      },
    },
    {
      slug: "chto-proveryat-i-vyvodit",
      title: "Что проверять и что выводить",
      lead: "Порядок действий в формулировке, величина проверки и величина ответа, остаток минимального и порядок чисел внутри тройки.",
      access: "paid",
      conceptIds: [
        "poryadok-dejstvij",
        "dlinnye-formulirovki",
        "proverka-i-otvet",
        "ostatok-minimalnogo",
        "malenkij-spisok",
        "dva-naibolshih",
        "vyvod-itogo",
      ],
      paid: {
        outline: [
          { id: "poryadok-dejstvij", navLabel: "Порядок действий" },
          { id: "dlinnye-formulirovki", navLabel: "Длинные формулировки" },
          { id: "proverka-i-otvet", navLabel: "Проверка и ответ" },
          { id: "ostatok-minimalnogo", navLabel: "Остаток минимального" },
          { id: "malenkij-spisok", navLabel: "Сортировка тройки" },
          { id: "dva-naibolshih", navLabel: "Два наибольших" },
          { id: "vyvod-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Формулировку условия и ответа читают как последовательность
                действий: что найти, что с ним сделать и в каком порядке.
              </strong>{" "}
              Составные величины и модуль ответа нужны в 22 задачах подборки из
              85, сравнение остатка элемента с наименьшим или наибольшим
              элементом — в 12 (среди них основная волна ЕГЭ-2026 и демоверсия
              2025 года), порядок чисел внутри группы — в 7, и 5 из них — задачи
              2025–2026 годов.
            </Typography.Text>
          </>
        ),
        selfCheck: 0,
        load: () => import("./number-sequences.paid.chto-proveryat-i-vyvodit"),
      },
    },
    {
      slug: "treugolniki",
      title: "Тройка как стороны треугольника",
      lead: "Почему для существования треугольника хватает одной проверки после сортировки и как вид треугольника определяют квадраты сторон.",
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
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 17: в подборке
              две задачи на тройки — стороны треугольника, обе, по оценке, 2021
              года; на экзаменах с 2022 года такие не встречались. Задачи
              основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./number-sequences.paid.treugolniki"),
      },
    },
    {
      slug: "lyubye-pary",
      title: "Любые пары",
      lead: "Пары из любых двух позиций: вложенные циклы, n(n − 1)/2 проверок и ускорение подсчёта по остаткам.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "lyubye-pary",
        "ne-sosedi",
        "chislo-proverok",
        "po-ostatkam",
        "pary-itogo",
      ],
      paid: {
        outline: [
          { id: "lyubye-pary", navLabel: "Дополнительный урок" },
          { id: "ne-sosedi", navLabel: "Не только соседи" },
          { id: "chislo-proverok", navLabel: "Число проверок" },
          { id: "po-ostatkam", navLabel: "Подсчёт по остаткам" },
          { id: "pary-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 17: в подборке
              10 задач, где пара — любые два элемента с разными номерами, все,
              по оценке, 2021 года; на экзаменах с 2022 года пары только
              соседние. Задачи основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./number-sequences.paid.lyubye-pary"),
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
            <strong>
              Задание 17 удобно осваивать через одну общую идею: мы перебираем
              нужные элементы последовательности, проверяем условия и собираем
              из подходящих случаев ответ.
            </strong>{" "}
            Сложность обычно заключается в том, чтобы правильно понять, какие
            элементы рассматриваются и что именно нужно проверить.
          </Typography.Text>
          <Typography.Text>
            В каждой задаче файл с числами превращается в список, а слова
            условия — в проверки делимости, сумм и произведений. С 2022 года все
            15 задач реальных экзаменов — про соседние пары и тройки с порогом,
            посчитанным по всей последовательности; к этому мы придём
            постепенно.
          </Typography.Text>
          <Typography.Text>
            Главный пример подтемы — последовательность 8, −12, 5, 20, −3, 14:
            каждый ответ на ней можно проверить вручную. Отдельные правила — про
            повторы, делимость суммы, квадраты — показаны на парах маленьких
            чисел. Начнём с основ, а затем постепенно соберём из них решение.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "posledovatelnost",
      navLabel: "Последовательность",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Последовательность — это числа, расположенные в определённом
              порядке.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, в последовательности{" "}
            <Notation>{"8, -12, 5, 20, -3, 14"}</Notation> шесть элементов.
          </Typography.Text>
          <Typography.Text>
            Слово «элемент» означает число{" "}
            <strong>на определённом месте</strong>. Порядок существенен:
            последовательности <Notation>{"8, -12, 5"}</Notation> и{" "}
            <Notation>{"5, 8, -12"}</Notation> содержат одинаковые числа, но
            соседство у них разное.
          </Typography.Text>
          <Typography.Text>
            Одинаковые значения могут встречаться несколько раз: в{" "}
            <Notation>{"7, 7, 12"}</Notation> первые две семёрки — два разных
            элемента, потому что находятся на разных местах.
          </Typography.Text>
          <Typography.Text>Отсюда сразу два важных правила:</Typography.Text>
          <ul>
            <li>
              нельзя удалять повторяющиеся значения, если этого не требует
              условие;
            </li>
            <li>
              нельзя переставлять числа, если задача связана с их расположением.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "kolichestvo-i-velichina",
      navLabel: "Количество и величина",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество элементов и величина элементов — разные характеристики.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В последовательности <Notation>{"10000, -5000, 300"}</Notation> три
            элемента. Число <Notation>{"10000"}</Notation> — значение первого
            элемента, а не длина последовательности.
          </Typography.Text>
          <Typography.Text>
            Если в условии сказано «числа по модулю не превышают 100 000», это
            ограничивает их значения. Из этого не следует, что в файле ровно 100
            000 чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "spisok",
      navLabel: "Список в Python",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Python последовательность удобно хранить в списке.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Наша последовательность в программе —{" "}
            <PythonTerm term="list">список</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={"a = [8, -12, 5, 20, -3, 14]"}
            label={"Наша последовательность в программе — {{list|список}}"}
            language="python"
          />
          <Typography.Text>
            Обратиться к отдельному элементу можно по его{" "}
            <PythonTerm term="listindex">индексу</PythonTerm> — номеру позиции,
            который в Python начинается с нуля. Поэтому обычный номер элемента
            на единицу больше индекса:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqStrip_0b8aae}
            caption={
              <>
                Первый элемент 8 — это a[0], второй −12 — a[1]. У шести
                элементов индексы от 0 до 5: последний элемент 14 — это a[5], то
                есть a[n − 1].
              </>
            }
          />
          <Typography.Text>
            Количество элементов возвращает{" "}
            <PythonTerm term="len">
              <Notation>{"len"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "a = [8, -12, 5, 20, -3, 14]\nn = len(a)\nprint(n, a[0], a[1], a[n - 1])"
            }
            label={"Количество элементов возвращает {{len|len}}"}
            language="python"
            output={"6 8 -12 14"}
          />
          <Typography.Text>
            Допустимые неотрицательные индексы: 0, 1, 2, …, n − 1.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Последний индекс равен <Notation>{"n - 1"}</Notation>, а не{" "}
              <Notation>{"n"}</Notation>.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для списка из шести элементов обращение{" "}
            <Notation>{"a[6]"}</Notation> приведёт к ошибке: седьмого элемента
            нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fajl-v-spisok",
      navLabel: "Файл в список",
      explanation: (
        <>
          <Typography.Text>
            <strong>Сначала файл нужно превратить в список чисел.</strong>
          </Typography.Text>
          <Typography.Text>
            В текстовом файле числа записаны символами. Запись{" "}
            <Notation>{'"-12"'}</Notation> в тексте и число{" "}
            <Notation>{"-12"}</Notation>, с которым можно выполнять вычисления,
            — не одно и то же.
          </Typography.Text>
          <Typography.Text>
            Файл нашей последовательности <Notation>{"17.txt"}</Notation> хранит
            по числу в строке:
          </Typography.Text>
          <CodeBlock
            code={"8\n-12\n5\n20\n-3\n14"}
            label={"Строки файла 17.txt"}
            language="text"
            fileName="17.txt"
          />
          <Typography.Text>
            Файл открывается{" "}
            <PythonTerm term="file">
              <Notation>{"with open"}</Notation>
            </PythonTerm>
            , его текст целиком читает <Notation>{"f.read()"}</Notation>, а{" "}
            <PythonTerm term="split">
              <Notation>{"split"}</Notation>
            </PythonTerm>{" "}
            делит текст по пробелам, переводам строк и другим пробельным
            символам. Получаются строки — их ещё нужно превратить в числа{" "}
            <PythonTerm term="num">
              <Notation>{"int"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              'with open("17.txt") as f:\n    parts = f.read().split()\nprint(parts)\nprint([int(part) for part in parts])'
            }
            label={
              "Получаются строки — их ещё нужно превратить в числа {{num|int}}"
            }
            language="python"
            output={
              "['8', '-12', '5', '20', '-3', '14']\n[8, -12, 5, 20, -3, 14]"
            }
          />
          <Typography.Text>
            Обе операции удобно записать одной строкой —{" "}
            <PythonTerm term="comp">списковым включением</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("17.txt") as f:\n    a = [int(part) for part in f.read().split()]'
            }
            label={
              "Обе операции удобно записать одной строкой — {{comp|списковым включением}}"
            }
            language="python"
          />
          <Typography.Text>Внутри квадратных скобок записано:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Для каждой части текста получить{" "}
              <Notation>{"int(part)"}</Notation> и собрать результаты в список.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Для задания 17 такой способ чтения удобен: он работает и при одном
            числе в строке, и при нескольких числах, разделённых пробелами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pervaya-stroka",
      navLabel: "Первая строка",
      explanation: (
        <>
          <Typography.Text>
            <strong>Не удаляй первую строку автоматически.</strong>
          </Typography.Text>
          <Typography.Text>
            В некоторых задачах первая строка содержит количество последующих
            чисел. В других — это уже первый элемент последовательности. Решение
            определяется описанием файла.
          </Typography.Text>
          <Typography.Text>
            Если условие прямо говорит, что первое число — количество элементов,
            после чтения можно отделить его:
          </Typography.Text>
          <CodeBlock
            code={"n = a[0]\na = a[1:]"}
            label={"Код на Python: n = a[0]"}
            language="python"
          />
          <Typography.Text>
            Запись <Notation>{"a[1:]"}</Notation> — это{" "}
            <PythonTerm term="slice">срез</PythonTerm>: «все элементы начиная с
            индекса <Notation>{"1"}</Notation> до конца».
          </Typography.Text>
          <Typography.Text>
            Если количества в начале файла нет, эти две строки удалят настоящее
            число и испортят ответ.
          </Typography.Text>
          <Typography.Text>
            Также проверь имя и расположение файла. Относительное имя{" "}
            <Notation>{'"17.txt"'}</Notation> ищется в рабочей папке запуска
            программы. При необходимости можно указать полный путь:{" "}
            <Notation>{'open("C:/EGE/17.txt")'}</Notation>.
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
            <strong>
              Условие задачи переводится в проверки, каждая из которых даёт
              ответ «да» или «нет».
            </strong>
          </Typography.Text>
          <Typography.Text>
            Проверка <Notation>{"x > 10"}</Notation> отвечает на вопрос, больше
            ли <Notation>{"x"}</Notation> десяти: результат —{" "}
            <Notation>{"True"}</Notation> (условие выполнено) или{" "}
            <Notation>{"False"}</Notation> (не выполнено). Знаки{" "}
            <PythonTerm term="eq">сравнения</PythonTerm> в Python:{" "}
            <Notation>{"=="}</Notation> (равно), <Notation>{"!="}</Notation> (не
            равно), <Notation>{">"}</Notation>, <Notation>{"<"}</Notation>,{" "}
            <Notation>{">="}</Notation>, <Notation>{"<="}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Не путай <Notation>{"x = 10"}</Notation> и{" "}
            <Notation>{"x == 10"}</Notation>: первое{" "}
            <strong>присваивает</strong> значение, второе{" "}
            <strong>проверяет</strong> равенство.
          </Typography.Text>
          <Typography.Text>
            Слова из условия нужно переводить <strong>буквально</strong>. Выбери
            формулировку, чтобы увидеть проверку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка в условии и проверка в Python"}
            variants={[
              {
                label: "больше 100",
                value: (
                  <>
                    <Notation>{"x > 100"}</Notation>
                  </>
                ),
              },
              {
                label: "не меньше 100",
                value: (
                  <>
                    <Notation>{"x >= 100"}</Notation>
                  </>
                ),
                note: <>«не меньше» включает само 100</>,
              },
              {
                label: "меньше 100",
                value: (
                  <>
                    <Notation>{"x < 100"}</Notation>
                  </>
                ),
              },
              {
                label: "не больше 100",
                value: (
                  <>
                    <Notation>{"x <= 100"}</Notation>
                  </>
                ),
                note: <>«не больше» и «не превышает» включают 100</>,
              },
              {
                label: "от 100 до 999 включительно",
                value: (
                  <>
                    <Notation>{"100 <= x <= 999"}</Notation>
                  </>
                ),
                note: (
                  <>
                    то же, что <Notation>{"100 <= x and x <= 999"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Последняя запись означает одновременное выполнение двух сравнений,
            соединённых{" "}
            <PythonTerm term="andor">
              <Notation>{"and"}</Notation>
            </PythonTerm>
            . Чтобы выполнить действие только при истинном условии, используют{" "}
            <PythonTerm term="if">
              <Notation>{"if"}</Notation>
            </PythonTerm>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ostatok",
      navLabel: "Остаток от деления",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Остаток от деления — основной инструмент для проверки делимости и
              цифр.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Вспомним деление с остатком: 23 = 5 · 4 + 3. Это означает, что при
            делении <Notation>{"23"}</Notation> на <Notation>{"5"}</Notation>{" "}
            целая часть частного равна <Notation>{"4"}</Notation>, а остаток
            равен <Notation>{"3"}</Notation>. В Python для неотрицательных целых
            чисел{" "}
            <PythonTerm term="intdiv">
              <Notation>{"//"}</Notation> даёт целую часть частного,{" "}
              <Notation>{"%"}</Notation> — остаток
            </PythonTerm>
            , а обычное деление записывается через <Notation>{"/"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"print(23 // 5, 23 % 5, 23 / 5)"}
            label={"Код на Python: print(23 // 5, 23 % 5, 23 / 5)"}
            language="python"
            output={"4 3 4.6"}
          />
          <Typography.Text>
            <strong>
              Число делится на <Notation>{"d"}</Notation> без остатка тогда и
              только тогда, когда остаток равен нулю.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Поэтому <Notation>{"x % d == 0"}</Notation> означает «
            <Notation>{"x"}</Notation> кратно <Notation>{"d"}</Notation>». Здесь
            предполагается, что <Notation>{"d"}</Notation> не равно нулю. Отсюда
            все проверки делимости:
          </Typography.Text>
          <VariantPicker
            label={"Условие и проверка в Python"}
            variants={[
              {
                label: "число кратно 3",
                value: (
                  <>
                    <Notation>{"x % 3 == 0"}</Notation>
                  </>
                ),
              },
              {
                label: "число не кратно 3",
                value: (
                  <>
                    <Notation>{"x % 3 != 0"}</Notation>
                  </>
                ),
              },
              {
                label: "число чётное",
                value: (
                  <>
                    <Notation>{"x % 2 == 0"}</Notation>
                  </>
                ),
              },
              {
                label: "число нечётное",
                value: (
                  <>
                    <Notation>{"x % 2 != 0"}</Notation>
                  </>
                ),
              },
              {
                label: "остаток от деления на 7 равен 4",
                value: (
                  <>
                    <Notation>{"x % 7 == 4"}</Notation>
                  </>
                ),
              },
              {
                label: "остатки двух чисел при делении на 5 одинаковы",
                value: (
                  <>
                    <Notation>{"x % 5 == y % 5"}</Notation>
                  </>
                ),
              },
              {
                label: "остатки различаются",
                value: (
                  <>
                    <Notation>{"x % 5 != y % 5"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Для отрицательных чисел проверка делимости тоже работает, и ноль ей
            не мешает:
          </Typography.Text>
          <CodeBlock
            code={"print(-12 % 3 == 0, 0 % 3 == 0)"}
            label={
              "Для отрицательных чисел проверка делимости тоже работает, и ноль ей не мешает"
            }
            language="python"
            output={"True True"}
          />
          <Typography.Text>
            <strong>Ноль кратен любому ненулевому целому числу.</strong> Поэтому
            условие «кратно 3» само по себе не исключает ноль. Если нужны
            положительные кратные трём числа:{" "}
            <Notation>{"x > 0 and x % 3 == 0"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Так проверки и собирают ответ:{" "}
            <strong>
              перебираем элементы, проверяем условие и считаем подходящие
            </strong>
            . Посчитаем в нашей последовательности числа, кратные трём, и
            отдельно положительные кратные трём. Количество — это{" "}
            <PythonTerm term="augassign">
              счётчик <Notation>{"+= 1"}</Notation>
            </PythonTerm>
            , который растёт на каждом подходящем элементе:
          </Typography.Text>
          <CodeBlock
            code={
              'with open("17.txt") as f:\n    a = [int(part) for part in f.read().split()]\n\nmultiples = 0\npositive = 0\nfor x in a:\n    if x % 3 == 0:\n        multiples += 1\n    if x > 0 and x % 3 == 0:\n        positive += 1\nprint(multiples, positive)'
            }
            label={
              "Количество — это {{augassign|счётчик += 1}}, который растёт на каждом подходящем элементе"
            }
            language="python"
            output={"2 0"}
          />
          <Typography.Text>
            Трём кратны −12 и −3, но оба отрицательные, поэтому во втором
            количестве ноль. Цикл{" "}
            <PythonTerm term="for">
              <Notation>{"for"}</Notation>
            </PythonTerm>{" "}
            по очереди берёт каждый элемент списка.
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
            <strong>
              Условия на сумму или произведение нужно проверять для самой суммы
              или произведения.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, <Notation>{"(x + y) % 7 == 0"}</Notation> означает, что
            сумма кратна семи. Это <strong>не</strong> то же самое, что
            требовать делимости каждого числа на семь. Для чисел{" "}
            <Notation>{"2"}</Notation> и <Notation>{"5"}</Notation>: 2 + 5 = 7,
            хотя ни <Notation>{"2"}</Notation>, ни <Notation>{"5"}</Notation> на
            семь не делятся.
          </Typography.Text>
          <Typography.Text>
            Аналогично <Notation>{"(x * y) % 10 == 0"}</Notation> проверяет
            делимость произведения на десять. Числа <Notation>{"2"}</Notation> и{" "}
            <Notation>{"5"}</Notation> дают произведение{" "}
            <Notation>{"10"}</Notation>. Поэтому заменять эту проверку на{" "}
            <Notation>{"x % 10 == 0 or y % 10 == 0"}</Notation> нельзя:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 2\ny = 5\nprint((x + y) % 7 == 0, x % 7 == 0 and y % 7 == 0)\nprint((x * y) % 10 == 0, x % 10 == 0 or y % 10 == 0)"
            }
            label={
              "Поэтому заменять эту проверку на x % 10 == 0 or y % 10 == 0 нельзя"
            }
            language="python"
            output={"True False\nTrue False"}
          />
          <Typography.Text>
            Другие выражения, которые часто встречаются в условиях:
          </Typography.Text>
          <VariantPicker
            label={"Что требуется и выражение"}
            variants={[
              {
                label: "сумма пары",
                value: (
                  <>
                    <Notation>{"x + y"}</Notation>
                  </>
                ),
              },
              {
                label: "произведение",
                value: (
                  <>
                    <Notation>{"x * y"}</Notation>
                  </>
                ),
              },
              {
                label: "разность",
                value: (
                  <>
                    <Notation>{"x - y"}</Notation>
                  </>
                ),
              },
              {
                label: "абсолютная разность",
                value: (
                  <>
                    <Notation>{"abs(x - y)"}</Notation>
                  </>
                ),
              },
              {
                label: "квадрат числа",
                value: (
                  <>
                    <Notation>{"x ** 2"}</Notation>
                  </>
                ),
              },
              {
                label: "сумма квадратов",
                value: (
                  <>
                    <Notation>{"x ** 2 + y ** 2"}</Notation>
                  </>
                ),
              },
              {
                label: "квадрат суммы",
                value: (
                  <>
                    <Notation>{"(x + y) ** 2"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            <PythonTerm term="absval">
              <Notation>{"abs"}</Notation>
            </PythonTerm>{" "}
            возвращает <strong>модуль</strong>, то есть абсолютную величину
            числа. Например, |3 − 8| = 5:
          </Typography.Text>
          <CodeBlock
            code={"print(abs(-12), abs(12), abs(0), abs(3 - 8))"}
            label={
              "{{absval|abs}} возвращает модуль, то есть абсолютную величину числа. Например, |3 − 8| = 5"
            }
            language="python"
            output={"12 12 0 5"}
          />
          <Typography.Text>
            Модуль разности позволяет измерить, насколько числа отличаются,
            независимо от того, какое записано первым.
          </Typography.Text>
          <Typography.Text>
            <strong>Сумма квадратов и квадрат суммы — разные выражения.</strong>
          </Typography.Text>
          <Typography.Text>
            Для <Notation>{"3"}</Notation> и <Notation>{"4"}</Notation>: 3² + 4²
            = 9 + 16 = 25, а (3 + 4)² = 7² = 49.
          </Typography.Text>
          <CodeBlock
            code={"print(3 ** 2 + 4 ** 2, (3 + 4) ** 2)"}
            label={"Для 3 и 4: 3² + 4² = 9 + 16 = 25, а (3 + 4)² = 7² = 49"}
            language="python"
            output={"25 49"}
          />
          <Typography.Text>
            В Python степень обозначается <Notation>{"**"}</Notation>. Символ{" "}
            <Notation>{"^"}</Notation> для возведения в степень не подходит.
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
                    Элемент — это число на своём месте: повторы и порядок
                    сохраняются, количество элементов и их величина — разные
                    вещи.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Индексы списка идут от 0 до <Notation>{"n - 1"}</Notation>;
                    файл превращается в список одной строкой{" "}
                    <Notation>
                      {"[int(part) for part in f.read().split()]"}
                    </Notation>
                    , первое число отделяется, только если так сказано в
                    условии.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Формулировки переводятся буквально: «не меньше» —{" "}
                    <Notation>{">="}</Notation>, «кратно» —{" "}
                    <Notation>{"x % d == 0"}</Notation>, и ноль кратен любому
                    числу.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Условие на сумму или произведение проверяется для самой
                    суммы или произведения; сумма квадратов и квадрат суммы
                    различаются.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "skolko-elementov",
      navLabel: "Сколько подходит",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Слова «хотя бы одно», «ровно одно», «не более двух» переводятся в
              код через количество выполненных проверок.
            </strong>{" "}
            Такие формулировки есть в 44 задачах подборки из 85 и в половине
            задач 2025–2026 годов: «только одно число трёхзначное», «не менее
            двух четырёхзначных», «кратных трём больше, чем кратных пяти», «одно
            делится на три, а другое меньше среднего».
          </Typography.Text>
          <Typography.Text>
            Будем проверять маленькие пары и тройки на одно свойство — «делится
            на три»: пары (6, 5), (5, 9), (6, 9) и тройку 6, 10, 15.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "i-ili-ne",
      navLabel: "И, или, не",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Слова «и», «или», «не» соединяют простые проверки в более сложные.
            </strong>
          </Typography.Text>
          <Typography.Text>Пусть:</Typography.Text>
          <CodeBlock
            code={"p = x % 3 == 0\nq = y % 3 == 0"}
            label={"Пусть"}
            language="python"
          />
          <Typography.Text>
            Переменная <Notation>{"p"}</Notation> хранит ответ на вопрос
            «делится ли <Notation>{"x"}</Notation> на 3», а{" "}
            <Notation>{"q"}</Notation> — такой же ответ для{" "}
            <Notation>{"y"}</Notation>. Тогда{" "}
            <PythonTerm term="andor">составные условия</PythonTerm> означают:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"p and q"}</Notation> — выполнены <strong>обе</strong>{" "}
              проверки;
            </li>
            <li>
              <Notation>{"p or q"}</Notation> — выполнена{" "}
              <strong>хотя бы одна</strong> проверка;
            </li>
            <li>
              <Notation>{"not p"}</Notation> — проверка{" "}
              <Notation>{"p"}</Notation> <strong>не</strong> выполнена.
            </li>
          </ul>
          <Typography.Text>
            <strong>«Хотя бы одно» допускает, что подходят оба.</strong>
          </Typography.Text>
          <Typography.Text>
            Поэтому <Notation>{"x % 3 == 0 or y % 3 == 0"}</Notation> подходит
            для пар (6, 5), (5, 9) и (6, 9). Не подходит только пара, где оба
            числа не делятся на три. А условие{" "}
            <Notation>{"x % 3 == 0 and y % 3 == 0"}</Notation> из этих трёх
            примеров пропускает только (6, 9):
          </Typography.Text>
          <VariantPicker
            label={"Пара и две проверки"}
            variants={[
              {
                label: "(6, 5)",
                value: (
                  <>«хотя бы одно делится на 3» — да; «оба делятся» — нет</>
                ),
              },
              { label: "(5, 9)", value: <>«хотя бы одно» — да; «оба» — нет</> },
              { label: "(6, 9)", value: <>«хотя бы одно» — да; «оба» — да</> },
              {
                label: "(5, 7)",
                value: <>«хотя бы одно» — нет; «оба» — нет</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "rovno-odno",
      navLabel: "Ровно одно",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Ровно одно» удобно понимать как количество выполненных проверок.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для пары это означает два допустимых случая:
          </Typography.Text>
          <ol>
            <li>первое число подходит, второе не подходит;</li>
            <li>первое не подходит, второе подходит.</li>
          </ol>
          <Typography.Text>
            Подробная запись —{" "}
            <Notation>{"(p and not q) or (not p and q)"}</Notation>. Для двух
            логических значений есть короткая запись{" "}
            <Notation>{"p != q"}</Notation>: она проверяет, что ответы
            различаются. Например,{" "}
            <Notation>{"(x % 3 == 0) != (y % 3 == 0)"}</Notation> означает:
            ровно одно число делится на три.
          </Typography.Text>
          <Typography.Text>
            Но для троек и более сложных условий удобнее единый подход:{" "}
            <strong>
              посчитать, сколько элементов обладает нужным свойством
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Python позволяет преобразовать результаты проверок в числа:{" "}
            <strong>
              <Notation>{"int(True)"}</Notation> равно 1,{" "}
              <Notation>{"int(False)"}</Notation> равно 0
            </strong>
            . Такое явное преобразование делает подсчёт наглядным. Для тройки 6,
            10, 15:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 6\ny = 10\nz = 15\nk = int(x % 3 == 0) + int(y % 3 == 0) + int(z % 3 == 0)\nprint(int(True), int(False), k)"
            }
            label={"Для тройки 6, 10, 15"}
            language="python"
            output={"1 0 2"}
          />
          <Typography.Text>
            Здесь <Notation>{"k"}</Notation> — количество чисел, делящихся на
            три: k = 1 + 0 + 1 = 2.
          </Typography.Text>
          <Typography.Text>
            Теперь любые количественные формулировки переводятся одинаково:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка для тройки и проверка"}
            defaultIndex={2}
            variants={[
              {
                label: "ни одного подходящего числа",
                value: (
                  <>
                    <Notation>{"k == 0"}</Notation>
                  </>
                ),
              },
              {
                label: "ровно одно",
                value: (
                  <>
                    <Notation>{"k == 1"}</Notation>
                  </>
                ),
              },
              {
                label: "ровно два",
                value: (
                  <>
                    <Notation>{"k == 2"}</Notation>
                  </>
                ),
              },
              {
                label: "все три",
                value: (
                  <>
                    <Notation>{"k == 3"}</Notation>
                  </>
                ),
              },
              {
                label: "хотя бы одно",
                value: (
                  <>
                    <Notation>{"k >= 1"}</Notation>
                  </>
                ),
              },
              {
                label: "хотя бы два",
                value: (
                  <>
                    <Notation>{"k >= 2"}</Notation>
                  </>
                ),
              },
              {
                label: "не более одного",
                value: (
                  <>
                    <Notation>{"k <= 1"}</Notation>
                  </>
                ),
              },
              {
                label: "не более двух",
                value: (
                  <>
                    <Notation>{"k <= 2"}</Notation>
                  </>
                ),
              },
              {
                label: "есть подходящие, но не все подходят",
                value: (
                  <>
                    <Notation>{"0 < k < 3"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            «Не более двух» включает ноль, одно и два, а «не менее двух» — два и
            три. Это важно: иногда ученик видит слово «двух» и машинально пишет{" "}
            <Notation>{"k == 2"}</Notation>, хотя условие требует другое.
          </Typography.Text>
          <Typography.Text>
            В решениях также встречается запись без <Notation>{"int"}</Notation>
            :{" "}
            <Notation>
              {"k = (x % 3 == 0) + (y % 3 == 0) + (z % 3 == 0)"}
            </Notation>
            . Она работает, потому что при таком сложении{" "}
            <Notation>{"True"}</Notation> ведёт себя как единица, а{" "}
            <Notation>{"False"}</Notation> — как ноль. На этапе обучения запись
            с <Notation>{"int"}</Notation> яснее показывает смысл.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "raznye-svojstva",
      navLabel: "Разные свойства",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разные свойства одной группы нужно считать независимо.
            </strong>
          </Typography.Text>
          <Typography.Text>Допустим, требуется:</Typography.Text>
          <blockquote>
            <Typography.Text>
              В тройке чисел, кратных трём, больше, чем чисел, кратных пяти.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Сначала считаем одно, затем другое и сравниваем:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 6\ny = 10\nz = 15\nk3 = int(x % 3 == 0) + int(y % 3 == 0) + int(z % 3 == 0)\nk5 = int(x % 5 == 0) + int(y % 5 == 0) + int(z % 5 == 0)\nprint(k3, k5, k3 > k5)"
            }
            label={"Сначала считаем одно, затем другое и сравниваем"}
            language="python"
            output={"2 2 False"}
          />
          <Typography.Text>
            Число <Notation>{"15"}</Notation> попало{" "}
            <strong>в оба количества</strong>. Это правильно: оно делится и на
            три, и на пять. Не нужно насильно относить каждый элемент только к
            одной категории. Здесь кратных трём (6 и 15) столько же, сколько
            кратных пяти (10 и 15), поэтому условие не выполнено.
          </Typography.Text>
          <Typography.Text>И не путай:</Typography.Text>
          <ul>
            <li>
              количество подходящих <strong>элементов внутри тройки</strong>;
            </li>
            <li>
              количество подходящих{" "}
              <strong>троек во всей последовательности</strong>.
            </li>
          </ul>
          <Typography.Text>
            Если в тройке два числа делятся на три и этого достаточно для
            выполнения условия, сама тройка добавляет к ответу{" "}
            <strong>единицу</strong>, а не двойку.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skobki",
      navLabel: "Скобки",
      explanation: (
        <>
          <Typography.Text>
            <strong>Скобки помогают сохранить смысл длинного условия.</strong>
          </Typography.Text>
          <Typography.Text>Предположим, требуется:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Хотя бы одно число делится на три, а сумма пары больше 100.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Правильная запись:{" "}
            <Notation>
              {"(x % 3 == 0 or y % 3 == 0) and (x + y > 100)"}
            </Notation>
            . Здесь два крупных требования — хотя бы одно число делится на три и
            сумма больше ста, — соединённые через <Notation>{"and"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Без скобок,{" "}
            <Notation>{"x % 3 == 0 or y % 3 == 0 and x + y > 100"}</Notation>,{" "}
            <strong>
              Python сначала выполнит <Notation>{"and"}</Notation>
            </strong>
            . В результате делимости первого числа окажется достаточно
            независимо от суммы. Проверим на паре (9, 20) с суммой 29:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 9\ny = 20\nprint((x % 3 == 0 or y % 3 == 0) and (x + y > 100))\nprint(x % 3 == 0 or y % 3 == 0 and x + y > 100)"
            }
            label={"Проверим на паре (9, 20) с суммой 29"}
            language="python"
            output={"False\nTrue"}
          />
          <Typography.Text>
            Удобный способ избежать путаницы — дать частям условия отдельные
            имена:
          </Typography.Text>
          <CodeBlock
            code={
              "has_multiple = x % 3 == 0 or y % 3 == 0\nlarge_sum = x + y > 100\n\nif has_multiple and large_sum:\n    ..."
            }
            label={
              "Удобный способ избежать путаницы — дать частям условия отдельные имена"
            }
            language="python"
          />
          <Typography.Text>
            Здесь <Notation>{"..."}</Notation> обозначает место для дальнейших
            действий. Такие переменные хранят результаты проверок. По ним проще
            сопоставить код с текстом задачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odno-a-drugoe",
      navLabel: "Одно…, а другое…",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Фразы «хотя бы одно… и хотя бы одно…» и «одно…, а другое…» требуют
              разных проверок.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Это одна из самых содержательных тонкостей задания. Рассмотрим два
            свойства: число делится на три; число меньше{" "}
            <Notation>{"T"}</Notation>.
          </Typography.Text>
          <Typography.Text>Первое условие:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Хотя бы одно число пары делится на три, и хотя бы одно число пары
              меньше <Notation>{"T"}</Notation>.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Запись:{" "}
            <Notation>
              {"(x % 3 == 0 or y % 3 == 0) and (x < T or y < T)"}
            </Notation>
            . <strong>Один и тот же элемент</strong> может обеспечить выполнение
            обеих частей. Например, при <Notation>{"x = 3"}</Notation>,{" "}
            <Notation>{"y = 100"}</Notation>, <Notation>{"T = 10"}</Notation>{" "}
            число <Notation>{"3"}</Notation> и делится на три, и меньше десяти.
            Условие выполнено.
          </Typography.Text>
          <Typography.Text>Теперь другое условие:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Одно число пары делится на три, а другое меньше{" "}
              <Notation>{"T"}</Notation>.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Нужно распределить свойства между{" "}
            <strong>двумя разными элементами</strong>:{" "}
            <Notation>
              {"(x % 3 == 0 and y < T) or (y % 3 == 0 and x < T)"}
            </Notation>
            . Проверяются два возможных распределения ролей:
          </Typography.Text>
          <ul>
            <li>
              делимость проверяем у <Notation>{"x"}</Notation>, сравнение — у{" "}
              <Notation>{"y"}</Notation>;
            </li>
            <li>
              делимость проверяем у <Notation>{"y"}</Notation>, сравнение — у{" "}
              <Notation>{"x"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            Пара (3, 100) при <Notation>{"T = 10"}</Notation> теперь не
            подходит.
          </Typography.Text>
          <Typography.Text>Есть и третья формулировка:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Хотя бы одно число одновременно делится на три и меньше{" "}
              <Notation>{"T"}</Notation>.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Здесь два свойства должны встретиться{" "}
            <strong>у одного элемента</strong>:{" "}
            <Notation>
              {"(x % 3 == 0 and x < T) or (y % 3 == 0 and y < T)"}
            </Notation>
            . Проверим все три на паре (3, 100):
          </Typography.Text>
          <CodeBlock
            code={
              "x = 3\ny = 100\nT = 10\nfirst = (x % 3 == 0 or y % 3 == 0) and (x < T or y < T)\nsecond = (x % 3 == 0 and y < T) or (y % 3 == 0 and x < T)\nthird = (x % 3 == 0 and x < T) or (y % 3 == 0 and y < T)\nprint(first, second, third)"
            }
            label={"Проверим все три на паре (3, 100)"}
            language="python"
            output={"True False True"}
          />
          <Typography.Text>
            Удобно представить пару таблицей «число × свойство». Тогда три
            формулировки — три способа читать одну таблицу:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqRoles3_10}
            caption={
              <>
                У пары (3, 100) оба свойства есть только у числа 3. «Хотя бы
                одно… и хотя бы одно…» читает таблицу по столбцам, «одно…, а
                другое…» — по диагонали, то есть ищет два разных числа,
                «одновременно» — по строке, то есть одно число.
              </>
            }
          />
          <Typography.Text>
            Эти три условия <strong>нельзя взаимозаменять</strong>.
          </Typography.Text>
          <Typography.Text>
            Также фраза «одно…, а другое…» сама по себе не означает, что
            делиться на три обязано <strong>ровно одно</strong> число. Если оба
            элемента обладают обоими свойствами, распределить роли между ними
            всё равно можно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skolko-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    «Хотя бы одно» допускает, что подходят оба; «оба» — это{" "}
                    <Notation>{"and"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Количественные формулировки переводятся через счёт{" "}
                    <Notation>{"k = int(…) + int(…) + …"}</Notation>: «ровно
                    одно» — <Notation>{"k == 1"}</Notation>, «не более двух» —{" "}
                    <Notation>{"k <= 2"}</Notation>, «не менее двух» —{" "}
                    <Notation>{"k >= 2"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Разные свойства считаются независимо: один элемент может
                    попасть в оба количества.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Части длинного условия берутся в скобки или получают имена.
                  </>
                ),
              },
              {
                note: (
                  <>
                    «Одно…, а другое…» распределяет свойства между двумя разными
                    элементами — проверяются оба распределения ролей.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "cifry-i-znak",
      navLabel: "Цифры и знак",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Цифры записи числа берутся у его модуля, а знак проверяется
              отдельно и с учётом нуля.
            </strong>{" "}
            Окончания и цифры записи нужны в 39 задачах подборки, количество
            цифр — в 38, знак — в 10. В задачах 2025–2026 годов числа почти
            всегда бывают отрицательными: «трёхзначное по модулю», «оканчивается
            на 7» и «ровно одно отрицательное» нужно проверять с оглядкой на
            минус.
          </Typography.Text>
          <Typography.Text>
            Главный пример подтемы — число −17 и его последняя цифра; знак
            разберём на паре (−8, 0) и тройке −2, −3, 5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "poslednie-cifry",
      navLabel: "Последние цифры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для проверки последних цифр отрицательного числа сначала нужен
              модуль.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для положительного числа <Notation>{"347 % 10"}</Notation> равно 7,
            а <Notation>{"347 % 100"}</Notation> — 47. Почему это работает? 347
            = 34 · 10 + 7: при делении на десять остатком остаётся последняя
            цифра. А 347 = 3 · 100 + 47: при делении на сто остатком остаются
            последние две цифры.
          </Typography.Text>
          <Typography.Text>
            Но в Python{" "}
            <strong>
              <Notation>{"-17 % 10"}</Notation> равно 3
            </strong>
            . Причина связана с правилами деления отрицательных чисел: −17 =
            (−2) · 10 + 3. При положительном делителе Python возвращает
            неотрицательный остаток, меньший делителя, а{" "}
            <Notation>{"//"}</Notation> округляет частное вниз:{" "}
            <Notation>{"-17 // 10"}</Notation> равно −2.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqNegmod17_10}
            caption={
              <>
                Остаток отсчитывается от ближайшего кратного 10 слева: для −17
                это −20, до −17 от него 3 шага, поэтому −17 % 10 = 3. Последняя
                цифра записи 7 — остаток модуля 17.
              </>
            }
          />
          <CodeBlock
            code={
              "print(347 % 10, 347 % 100)\nprint(-17 % 10, -17 // 10, abs(-17) % 10)"
            }
            label={"Код на Python: print(347 % 10, 347 % 100)"}
            language="python"
            output={"7 47\n3 -2 7"}
          />
          <Typography.Text>
            Поэтому <Notation>{"% 10"}</Notation> для отрицательного числа{" "}
            <strong>нельзя</strong> напрямую трактовать как последнюю цифру его
            записи. Чтобы проверить окончание записи, берут{" "}
            <PythonTerm term="absval">модуль</PythonTerm>:{" "}
            <Notation>{"abs(x) % 10 == 7"}</Notation>. Так подойдут 7, 17, 127,
            −7, −17, −127.
          </Typography.Text>
          <VariantPicker
            label={"Свойство записи числа и проверка"}
            variants={[
              {
                label: "оканчивается на 3",
                value: (
                  <>
                    <Notation>{"abs(x) % 10 == 3"}</Notation>
                  </>
                ),
              },
              {
                label: "оканчивается на 17",
                value: (
                  <>
                    <Notation>{"abs(x) % 100 == 17"}</Notation>
                  </>
                ),
              },
              {
                label: "оканчивается на 123",
                value: (
                  <>
                    <Notation>{"abs(x) % 1000 == 123"}</Notation>
                  </>
                ),
              },
              {
                label: "последние цифры двух чисел одинаковы",
                value: (
                  <>
                    <Notation>{"abs(x) % 10 == abs(y) % 10"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "gde-nuzhen-modul",
      navLabel: "Где нужен модуль",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Модуль нужен для работы с цифрами, но не должен добавляться во все
              проверки подряд.
            </strong>
          </Typography.Text>
          <Typography.Text>Если условие говорит:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Остаток от деления числа на пять равен двум,
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            то проверяется <Notation>{"x % 5 == 2"}</Notation>. Для{" "}
            <Notation>{"x = -8"}</Notation> это истинно: −8 = (−2) · 5 + 2. Но{" "}
            <Notation>{"abs(-8) % 5"}</Notation> равно 3:
          </Typography.Text>
          <CodeBlock
            code={"print(-8 % 5, abs(-8) % 5)"}
            label={"Но abs(-8) % 5 равно 3"}
            language="python"
            output={"2 3"}
          />
          <Typography.Text>
            Замена <Notation>{"x"}</Notation> на <Notation>{"abs(x)"}</Notation>{" "}
            здесь <strong>меняет условие</strong>.
          </Typography.Text>
          <Typography.Text>
            Есть небольшая тонкость с окончаниями, начинающимися с нуля.
            Проверка <Notation>{"abs(x) % 100 == 7"}</Notation> выполнена и для
            числа <Notation>{"7"}</Notation>. Если требуется именно запись,
            заканчивающаяся двумя символами <Notation>{"07"}</Notation>, у числа
            должно быть достаточно цифр:{" "}
            <Notation>{"abs(x) >= 10 and abs(x) % 100 == 7"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kolichestvo-cifr",
      navLabel: "Количество цифр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Количество цифр надёжно проверяется через числовые границы.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Положительное трёхзначное число находится между{" "}
            <Notation>{"100"}</Notation> и <Notation>{"999"}</Notation>. Поэтому{" "}
            <Notation>{"100 <= x <= 999"}</Notation>. Если отрицательные числа
            тоже допускаются как трёхзначные,{" "}
            <strong>знак минус не считается цифрой</strong>:{" "}
            <Notation>{"100 <= abs(x) <= 999"}</Notation>.
          </Typography.Text>
          <VariantPicker
            label={"Требование и проверка"}
            defaultIndex={1}
            variants={[
              {
                label: "двузначное по модулю",
                value: (
                  <>
                    <Notation>{"10 <= abs(x) <= 99"}</Notation>
                  </>
                ),
              },
              {
                label: "трёхзначное по модулю",
                value: (
                  <>
                    <Notation>{"100 <= abs(x) <= 999"}</Notation>
                  </>
                ),
              },
              {
                label: "четырёхзначное по модулю",
                value: (
                  <>
                    <Notation>{"1000 <= abs(x) <= 9999"}</Notation>
                  </>
                ),
              },
              {
                label: "пятизначное по модулю",
                value: (
                  <>
                    <Notation>{"10000 <= abs(x) <= 99999"}</Notation>
                  </>
                ),
              },
              {
                label: "положительное трёхзначное",
                value: (
                  <>
                    <Notation>{"100 <= x <= 999"}</Notation>
                  </>
                ),
              },
              {
                label: "отрицательное трёхзначное",
                value: (
                  <>
                    <Notation>{"-999 <= x <= -100"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Можно использовать верхнюю границу без включения:{" "}
            <Notation>{"100 <= abs(x) < 1000"}</Notation>. Для целых чисел это
            то же самое, что <Notation>{"100 <= abs(x) <= 999"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Ровно два четырёхзначных числа в тройке — количество из прошлой
            подтемы:
          </Typography.Text>
          <CodeBlock
            code={
              "k4 = (\n    int(1000 <= abs(x) <= 9999)\n    + int(1000 <= abs(y) <= 9999)\n    + int(1000 <= abs(z) <= 9999)\n)\n\nif k4 == 2:\n    ..."
            }
            label={
              "Ровно два четырёхзначных числа в тройке — количество из прошлой подтемы"
            }
            language="python"
          />
          <Typography.Text>
            Переносы внутри круглых скобок позволяют записать длинное выражение
            на нескольких строках.
          </Typography.Text>
          <Typography.Text>
            Можно определять количество цифр через текст:{" "}
            <Notation>{"len(str(abs(x)))"}</Notation> — здесь{" "}
            <PythonTerm term="str">
              <Notation>{"str"}</Notation>
            </PythonTerm>{" "}
            превращает значение в строку, а <Notation>{"len"}</Notation> считает
            символы. Но <Notation>{"len(str(x))"}</Notation> для отрицательного
            числа посчитает и знак минус:
          </Typography.Text>
          <CodeBlock
            code={"print(str(-123), len(str(-123)), len(str(abs(-123))))"}
            label={
              "Но len(str(x)) для отрицательного числа посчитает и знак минус"
            }
            language="python"
            output={"-123 4 3"}
          />
          <Typography.Text>
            Проверка диапазона обычно проще для чтения и проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifra-v-razryade",
      navLabel: "Цифра в разряде",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Цифру в любом разряде дают те же два действия: отбросить младшие
              цифры и взять остаток.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Встречаются условия «две последние цифры записи одинаковы»,
            «последняя цифра одного элемента совпадает с предпоследней цифрой
            другого», «старшие разряды чисел совпадают». Для модуля числа{" "}
            <Notation>{"m = abs(x)"}</Notation>:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"m % 10"}</Notation> — последняя цифра;
            </li>
            <li>
              <Notation>{"m // 10"}</Notation> — число без последней цифры, а
              значит <Notation>{"m // 10 % 10"}</Notation> — предпоследняя
              цифра. Например, 347 // 10 = 34, а 34 % 10 = 4;
            </li>
            <li>
              первая цифра — первый символ записи модуля:{" "}
              <Notation>{"str(m)[0]"}</Notation>, это{" "}
              <PythonTerm term="slice">индекс строки</PythonTerm>.
            </li>
          </ul>
          <CodeBlock
            code={
              "x = -347\nm = abs(x)\nprint(m % 10, m // 10 % 10, str(m)[0])"
            }
            label={"Для модуля числа m = abs(x)"}
            language="python"
            output={"7 4 3"}
          />
          <Typography.Text>
            Условие «две последние цифры одинаковы» требует, чтобы этих цифр
            было хотя бы две — та же тонкость, что с окончанием{" "}
            <Notation>{"07"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "for x in [-455, 1050, 7]:\n    m = abs(x)\n    print(x, m >= 10 and m % 10 == m // 10 % 10)"
            }
            label={"Код на Python: for x in [-455, 1050, 7]:"}
            language="python"
            output={"-455 True\n1050 False\n7 False"}
          />
          <Typography.Text>
            Первую цифру иногда удобнее проверить границами: положительное
            трёхзначное число, начинающееся с цифры 5, — это{" "}
            <Notation>{"500 <= x <= 599"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "znak-chisla",
      navLabel: "Знак числа",
      explanation: (
        <>
          <Typography.Text>
            <strong>Знак числа нужно проверять с учётом нуля.</strong>
          </Typography.Text>
          <Typography.Text>
            Положительное — <Notation>{"x > 0"}</Notation>, отрицательное —{" "}
            <Notation>{"x < 0"}</Notation>, неотрицательное —{" "}
            <Notation>{"x >= 0"}</Notation>, неположительное —{" "}
            <Notation>{"x <= 0"}</Notation>.{" "}
            <strong>
              Ноль не является ни положительным, ни отрицательным числом.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Ровно одно отрицательное число в паре — количество:{" "}
            <Notation>{"int(x < 0) + int(y < 0) == 1"}</Notation> или{" "}
            <Notation>{"(x < 0) != (y < 0)"}</Notation>. Пара (−8, 0) подходит:
            отрицательное число в ней ровно одно. А проверка{" "}
            <Notation>{"x * y < 0"}</Notation> для этой пары не выполнена:
          </Typography.Text>
          <CodeBlock
            code={
              "x = -8\ny = 0\nprint(int(x < 0) + int(y < 0) == 1, x * y < 0)"
            }
            label={"А проверка x * y < 0 для этой пары не выполнена"}
            language="python"
            output={"True False"}
          />
          <Typography.Text>Она означает другое:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Одно число строго положительное, другое строго отрицательное.
            </Typography.Text>
          </blockquote>
          <Typography.Text>Поэтому:</Typography.Text>
          <ul>
            <li>
              «ровно одно отрицательное» — проверяем количество отрицательных;
            </li>
            <li>
              «числа разных знаков» в смысле положительного и отрицательного —
              можно использовать <Notation>{"x * y < 0"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            Для тройки все числа одного знака:{" "}
            <Notation>
              {"(x > 0 and y > 0 and z > 0) or (x < 0 and y < 0 and z < 0)"}
            </Notation>
            . Или через количество положительных и отрицательных.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Проверять только знак произведения трёх чисел нельзя
            </strong>
            : −2, −3, 5 имеют положительное произведение, но не одинаковые
            знаки.
          </Typography.Text>
          <CodeBlock
            code={
              "x = -2\ny = -3\nz = 5\npositive_count = int(x > 0) + int(y > 0) + int(z > 0)\nnegative_count = int(x < 0) + int(y < 0) + int(z < 0)\nsame_sign = positive_count == 3 or negative_count == 3\nprint(same_sign, x * y * z > 0)"
            }
            label={"Код на Python: x = -2"}
            language="python"
            output={"False True"}
          />
        </>
      ),
    },
    {
      id: "cifry-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Последние цифры отрицательного числа — остатки его модуля:{" "}
                    <Notation>{"abs(x) % 10"}</Notation>,{" "}
                    <Notation>{"abs(x) % 100"}</Notation>;{" "}
                    <Notation>{"-17 % 10"}</Notation> равно 3.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Условие на остаток от деления проверяется без модуля:
                    «остаток от деления на 5 равен 2» —{" "}
                    <Notation>{"x % 5 == 2"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Предпоследняя цифра —{" "}
                    <Notation>{"abs(x) // 10 % 10"}</Notation>, первая —{" "}
                    <Notation>{"str(abs(x))[0]"}</Notation>; для двух последних
                    цифр у числа должно быть хотя бы две цифры.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Количество цифр — числовыми границами модуля:{" "}
                    <Notation>{"100 <= abs(x) <= 999"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Ноль не положительный и не отрицательный: «ровно одно
                    отрицательное» — это количество, а не{" "}
                    <Notation>{"x * y < 0"}</Notation>.
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
