import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
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
import { PythonTerm } from "./python-term";

export const divisorsAndMasksLesson = defineLesson({
  ...divisorsAndMasksLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Разбивать условие на четыре действия и буквально переводить каждую проверку в код",
    "Находить делители парами до √n, не теряя и не задваивая корень у квадратов",
    "Отбирать нужные делители, считать их и находить числа с заданными делителями",
    "Раскладывать число на простые множители и различать простые делители и множители",
    "Проверять числа по маске со знаками ? и * и строить числа по маске с учётом нулей",
    "Оценивать размер поиска и проверять решение на маленьких числах",
    "Для редких задач выводить вид числа по количеству делителей (дополнительные уроки)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "perebor-i-proverki",
      title: "Перебор чисел и проверка условий",
      lead: "Деление с остатком, буквальный перевод условия в проверки, перебор отрезка и проверки записи числа.",
      conceptIds: [
        "kak-ustroena-tema",
        "chetyre-dejstviya",
        "delenie-s-ostatkom",
        "uslovie-v-kod",
        "perebor-diapazona",
        "chislo-i-stroka",
        "operacii-s-ciframi",
        "proverka-in",
        "perebor-po-ubyvaniyu",
        "perebor-korotko",
      ],
      checkpoint: [
        {
          id: "proverka-nechetnoe",
          prompt: (
            <>Запиши на Python проверку: «число нечётное и не превышает 500».</>
          ),
          reveal: (
            <>
              <Notation>{"n % 2 != 0 and n <= 500"}</Notation>
            </>
          ),
        },
      ],
    },
    {
      slug: "deliteli-parami",
      title: "Делители: поиск парами",
      lead: "Почему делители достаточно искать до √n, как не потерять и не задвоить корень и как отобрать нужные делители.",
      conceptIds: [
        "pary-ideya",
        "delitel",
        "perebor-do-n",
        "pary-delitelej",
        "kvadrat-granica",
        "pochemu-do-kornya",
        "poisk-po-shagam",
        "celaya-chast-kornya",
        "koren-odin-raz",
        "funkciya-delitelej",
        "otbor-delitelej",
        "harakteristiki-spiska",
        "chetnye-deliteli",
        "schetchik-delitelej",
        "pary-korotko",
      ],
      checkpoint: [
        {
          id: "deliteli-28",
          prompt: (
            <>
              Для числа 28 выпиши все натуральные делители, делители без единицы
              и самого числа и чётные делители.
            </>
          ),
          reveal: (
            <>
              Для 28: все — 1, 2, 4, 7, 14, 28; без 1 и 28 — 2, 4, 7, 14; чётные
              — 2, 4, 14, 28.
            </>
          ),
        },
        {
          id: "koren-49",
          prompt: (
            <>
              Объясни, почему проверка делителей числа 49 должна включать 7, но
              число 7 нельзя добавлять в ответ дважды.
            </>
          ),
          reveal: (
            <>
              Пара 7·7 = 49 лежит ровно на границе перебора. Если её не
              проверить, делитель потеряется. Но оба множителя пары равны,
              поэтому различный делитель здесь один.
            </>
          ),
        },
        {
          id: "bez-sortirovki",
          prompt: (
            <>
              Что вернёт <Notation>{"get_divisors(30)"}</Notation>, если убрать
              из неё <Notation>{"sorted"}</Notation>? Почему без сортировки
              нельзя брать наибольший делитель как{" "}
              <Notation>{"D[-1]"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"[1, 30, 2, 15, 3, 10, 5, 6]"}</Notation>. Последним в
              таком списке стоит 6, а наибольший делитель — 30.
            </>
          ),
        },
        {
          id: "rano-vernut-true",
          prompt: (
            <>
              Почему условие <Notation>{"if count == k: return True"}</Notation>{" "}
              внутри незавершённого поиска делителей может быть неверным?
            </>
          ),
          reveal: (
            <>
              Найденные k делителей могут оказаться только частью полного
              списка. Например, у 12 первая обнаруженная пара — 1 и 12, но после
              неё находятся ещё четыре делителя.
            </>
          ),
        },
      ],
    },
    {
      slug: "chisla-po-delitelyam",
      title: "Числа с нужными делителями",
      lead: "Ровно k делителей, максимум делителей, величины M(N) и поиск первых подходящих чисел после границы.",
      access: "paid",
      conceptIds: [
        "chisla-ideya",
        "rovno-k-delitelej",
        "maksimum-delitelej",
        "velichina-m",
        "naimenshij-i-naibolshij",
        "pervye-posle-granicy",
        "chisla-korotko",
      ],
      paid: {
        outline: [
          { id: "chisla-ideya", navLabel: "Главная идея" },
          { id: "rovno-k-delitelej", navLabel: "Ровно k делителей" },
          { id: "maksimum-delitelej", navLabel: "Максимум делителей" },
          { id: "velichina-m", navLabel: "Величина M" },
          {
            id: "naimenshij-i-naibolshij",
            navLabel: "Наименьший и наибольший",
          },
          { id: "pervye-posle-granicy", navLabel: "Первые после границы" },
          { id: "chisla-korotko", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Главная идея подтемы:{" "}
              <strong>
                задача «найти числа с нужными делителями» — это перебор чисел из
                подтемы 1, внутри которого работает поиск делителей из подтемы 2
              </strong>
              . Меняется только то, что мы вычисляем по найденным делителям и
              как выбираем ответ.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./divisors-and-masks.paid.chisla-po-delitelyam"),
      },
    },
    {
      slug: "prostye-i-razlozhenie",
      title: "Простые числа и разложение",
      lead: "Простота, разложение на множители, простые делители и произведения простых множителей с условием на цифры.",
      access: "paid",
      conceptIds: [
        "prostye-ideya",
        "prostye-chisla",
        "razlozhenie",
        "prostye-deliteli",
        "mnozhiteli-i-deliteli",
        "cifry-mnozhitelej",
        "skorost-razlozheniya",
        "prostye-korotko",
      ],
      paid: {
        outline: [
          { id: "prostye-ideya", navLabel: "Главная идея" },
          { id: "prostye-chisla", navLabel: "Простые числа" },
          { id: "razlozhenie", navLabel: "Разложение на множители" },
          { id: "prostye-deliteli", navLabel: "Простые делители" },
          { id: "mnozhiteli-i-deliteli", navLabel: "Множители и делители" },
          { id: "cifry-mnozhitelej", navLabel: "Цифры множителей" },
          { id: "skorost-razlozheniya", navLabel: "Скорость разложения" },
          { id: "prostye-korotko", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Главная идея подтемы:{" "}
              <strong>
                каждое число больше 1 раскладывается на простые множители, и по
                этому разложению сразу видны все его простые делители
              </strong>
              . Это самый частый приём в задачах 2025–2026 годов: он нужен в 16
              из 27 задач этих лет, в том числе в задачах основной волны
              ЕГЭ-2026.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./divisors-and-masks.paid.prostye-i-razlozhenie"),
      },
    },
    {
      slug: "maski",
      title: "Маски чисел",
      lead: "Знаки ? и *, проверка fnmatch, перебор кратных и построение чисел по маске.",
      access: "paid",
      conceptIds: [
        "maski-ideya",
        "znaki-maski",
        "dlina-zvezdochki",
        "fnmatch",
        "perebor-kratnyh",
        "pervoe-kratnoe",
        "generaciya-po-maske",
        "ocenka-kandidatov",
        "nuli-v-zvezdochke",
        "neskolko-zvezdochek",
        "maska-i-deliteli",
        "opredelenie-znakov",
        "maski-korotko",
      ],
      paid: {
        outline: [
          { id: "maski-ideya", navLabel: "Главная идея" },
          { id: "znaki-maski", navLabel: "Знаки ? и *" },
          { id: "dlina-zvezdochki", navLabel: "Длина звёздочки" },
          { id: "fnmatch", navLabel: "Проверка fnmatch" },
          { id: "perebor-kratnyh", navLabel: "Перебор кратных" },
          { id: "pervoe-kratnoe", navLabel: "Первое кратное" },
          { id: "generaciya-po-maske", navLabel: "Генерация по маске" },
          { id: "ocenka-kandidatov", navLabel: "Оценка кандидатов" },
          { id: "nuli-v-zvezdochke", navLabel: "Нули в звёздочке" },
          {
            id: "neskolko-zvezdochek",
            navLabel: "Начальные нули и несколько *",
          },
          { id: "maska-i-deliteli", navLabel: "Маска и делители" },
          { id: "opredelenie-znakov", navLabel: "Определение знаков" },
          { id: "maski-korotko", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Главная идея подтемы:{" "}
              <strong>
                маска описывает запись числа, а не его арифметические свойства,
                поэтому кандидатов можно либо проверять по маске, либо сразу
                строить по ней
              </strong>
              . Маски с делимостью стабильно встречаются на экзамене с 2022
              года: это больше трети задач задания 25.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./divisors-and-masks.paid.maski"),
      },
    },
    {
      slug: "vid-chisla",
      title: "Вид числа по количеству делителей",
      lead: "Формула количества делителей и построение кандидатов вместо перебора огромных диапазонов.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "vid-zachem",
        "formula-kolichestva",
        "forma-chisla",
        "nechetnoe-kolichestvo",
        "summa-delitelej",
        "vid-vmesto-perebora",
        "vid-i-maska",
        "vid-korotko",
      ],
      paid: {
        outline: [
          { id: "vid-zachem", navLabel: "Когда нужна подтема" },
          {
            id: "formula-kolichestva",
            navLabel: "Формула количества делителей",
          },
          { id: "forma-chisla", navLabel: "Форма числа" },
          { id: "nechetnoe-kolichestvo", navLabel: "Нечётное количество" },
          { id: "summa-delitelej", navLabel: "Сумма делителей" },
          { id: "vid-vmesto-perebora", navLabel: "Вид вместо перебора" },
          { id: "vid-i-maska", navLabel: "Вид числа и маска" },
          { id: "vid-korotko", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 25: такие
              задачи редки, и на реальных экзаменах 2022–2026 годов они не
              встречались. Задачи основных подтем 1–5 решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 0,
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
            В задании 25 важно понимать две вещи:{" "}
            <strong>как проверить свойства отдельного числа</strong> и{" "}
            <strong>как организовать поиск, чтобы не перебирать лишнее</strong>.
            Если освоить обе, многие внешне разные задачи окажутся небольшими
            изменениями одного алгоритма.
          </Typography.Text>
          <Typography.Text>
            Ниже — подробный разбор на Python: от смысла деления с остатком до
            поиска делителей, работы с простыми множителями и генерации чисел по
            маске. Новые конструкции Python буду объяснять перед использованием
            или сразу рядом с первым примером.
          </Typography.Text>
          <Typography.Text>
            В задании 25 встречаются задачи на количество и свойства делителей,
            поиск числа с максимальным количеством делителей, а также числа,
            одновременно удовлетворяющие маске и условию делимости. Поэтому
            разберём не только отдельные шаблоны, но и то, как их объединять.
          </Typography.Text>
          <Typography.Text>
            Тема разбита на основные подтемы и дополнительный урок.{" "}
            <strong>Основные подтемы 1–5</strong> покрывают большинство задач
            экзамена, в том числе все задачи реальных экзаменов 2022–2026 годов.{" "}
            <strong>Подтема 6 — дополнительный урок для продвинутых</strong>:
            она нужна для редких задач с очень большими диапазонами, где без
            теории перебор не успевает.
          </Typography.Text>
          <Typography.Text>
            Эта подтема — фундамент для остальных. Главная идея:{" "}
            <strong>
              любое условие задания 25 состоит из простых проверок, а каждую
              проверку можно буквально перевести в код
            </strong>{" "}
            — делимость, сравнение, цифры записи числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetyre-dejstviya",
      navLabel: "Четыре действия решения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Любую такую задачу сначала полезно разделить на четыре действия.
            </strong>{" "}
            Это позволит понимать назначение каждой части программы.
          </Typography.Text>
          <ol>
            <li>
              <strong>Получить числа, среди которых будем искать.</strong>{" "}
              Например, все числа от 100 до 200 или только числа, кратные 23.
            </li>
            <li>
              <strong>Проверить условие для очередного числа.</strong> Например,
              найти его делители и посчитать их.
            </li>
            <li>
              <strong>Вычислить величину, которую требует условие.</strong> Это
              может быть само число, сумма делителей, наибольший делитель или
              частное от деления.
            </li>
            <li>
              <strong>Вывести результаты в нужном порядке.</strong>
            </li>
          </ol>
          <Typography.Text>
            Число, которое мы сейчас рассматриваем, будем называть{" "}
            <strong>кандидатом</strong>: оно потенциально подходит, но ещё
            должно пройти проверку.
          </Typography.Text>
          <Typography.Text>Например, задача:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти числа от 10 до 30, имеющие ровно четыре натуральных
              делителя.
            </Typography.Text>
          </blockquote>
          <Typography.Text>Рассуждение:</Typography.Text>
          <ul>
            <li>кандидаты — числа 10, 11, 12, …, 30;</li>
            <li>для каждого кандидата находим все делители;</li>
            <li>считаем их;</li>
            <li>если получилось ровно четыре, число подходит.</li>
          </ul>
          <Typography.Text>
            Пока здесь не требуется никакой сложной математики. Но если
            проверять каждое число неудачным способом, программа может работать
            слишком долго. Поэтому дальше мы отдельно разберём правильность и
            скорость поиска.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "delenie-s-ostatkom",
      navLabel: "Деление с остатком",
      explanation: (
        <>
          <Typography.Text>
            <strong>Основа задания — деление с остатком.</strong> Если разделить
            17 на 5, пятёрка помещается в 17 три раза и ещё две единицы
            остаются: 17 = 5 · 3 + 2. Число 3 — целая часть частного, 2 —
            остаток.
          </Typography.Text>
          <RemainderExplorer
            n={17}
            d={5}
            caption={
              <>
                Клетки числа n разложены порциями по d: полные порции — частное{" "}
                <Notation>{"n // d"}</Notation>, клетки, которым не хватило на
                порцию, — остаток <Notation>{"n % d"}</Notation>. Меняйте числа
                или выберите пример.
              </>
            }
          />
          <Typography.Text>
            В общем виде для натурального n и делителя d всегда можно записать n
            = d · q + r, где 0 ≤ r {"<"} d. Остаток меньше делителя: будь он
            хотя бы d, из него выделилась бы ещё одна полная порция. В Python
            целую часть частного даёт <Notation>{"n // d"}</Notation>, а остаток
            — <Notation>{"n % d"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Посмотрите на схеме два крайних случая. Если разделить 20 на 5,
            порции заполнятся без остатка: <Notation>{"20 % 5"}</Notation> равно
            0. Если число меньше делителя, полной порции не набирается:{" "}
            <Notation>{"3 // 7"}</Notation> равно 0, а{" "}
            <Notation>{"3 % 7"}</Notation> — всё число, 3.
          </Typography.Text>
          <Typography.Text>
            Отсюда главная проверка задания:{" "}
            <strong>
              число делится на другое без остатка тогда и только тогда, когда
              остаток равен нулю
            </strong>
            , то есть{" "}
            <PythonTerm term="eq">
              <Notation>{"n % d == 0"}</Notation>
            </PythonTerm>
            . Так, <Notation>{"18 % 3 == 0"}</Notation> даёт{" "}
            <Notation>{"True"}</Notation>, а{" "}
            <Notation>{"18 % 5 == 0"}</Notation> —{" "}
            <Notation>{"False"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Обычное деление <Notation>{"/"}</Notation> здесь почти не нужно:{" "}
            <Notation>{"18 / 3"}</Notation> даёт дробное{" "}
            <Notation>{"6.0"}</Notation>, а <Notation>{"18 // 3"}</Notation> —
            целое <Notation>{"6"}</Notation>. Для отрицательных чисел{" "}
            <Notation>{"//"}</Notation> округляет вниз, но в задании числа
            натуральные, и это не мешает. Понадобится ещё степень — для больших
            границ вроде 10⁹. В Python её записывают через{" "}
            <Notation>{"**"}</Notation>: <Notation>{"10 ** 9"}</Notation>, а не
            через <Notation>{"^"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uslovie-v-kod",
      navLabel: "Условие — буквально в код",
      explanation: (
        <>
          <Typography.Text>
            <strong>Условие задачи переводим в код буквально.</strong> Похожие
            формулировки часто отличаются одним словом, а проверки — одним
            знаком. «Кратно» значит, что остаток равен нулю, «не кратно» — что
            не равен. «Больше 100» не пропускает само 100, а «не меньше 100» —
            пропускает. Выберите формулировку, чтобы увидеть её проверку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка условия и её проверка"}
            defaultIndex={1}
            variants={[
              {
                label: "кратно 7",
                value: (
                  <>
                    <Notation>{"n % 7 == 0"}</Notation>
                  </>
                ),
                note: <>остаток равен нулю</>,
              },
              {
                label: "не кратно 7",
                value: (
                  <>
                    <Notation>{"n % 7 != 0"}</Notation>
                  </>
                ),
                note: (
                  <>
                    остаток не ноль; <Notation>{"!="}</Notation> — «не равно»
                  </>
                ),
              },
              {
                label: "чётное",
                value: (
                  <>
                    <Notation>{"n % 2 == 0"}</Notation>
                  </>
                ),
                note: <>кратно 2</>,
              },
              {
                label: "нечётное",
                value: (
                  <>
                    <Notation>{"n % 2 != 0"}</Notation>
                  </>
                ),
                note: <>не кратно 2</>,
              },
              {
                label: "больше 100",
                value: (
                  <>
                    <Notation>{"n > 100"}</Notation>
                  </>
                ),
                note: <>само 100 не подходит</>,
              },
              {
                label: "не меньше 100",
                value: (
                  <>
                    <Notation>{"n >= 100"}</Notation>
                  </>
                ),
                note: <>100 подходит</>,
              },
              {
                label: "меньше 100",
                value: (
                  <>
                    <Notation>{"n < 100"}</Notation>
                  </>
                ),
                note: <>само 100 не подходит</>,
              },
              {
                label: "не превышает 100",
                value: (
                  <>
                    <Notation>{"n <= 100"}</Notation>
                  </>
                ),
                note: <>100 подходит</>,
              },
              {
                label: "на отрезке [100; 200]",
                value: (
                  <>
                    <Notation>{"100 <= n <= 200"}</Notation>
                  </>
                ),
                note: <>обе границы входят</>,
              },
            ]}
          />
          <Typography.Text>
            Если должны выполняться оба условия сразу, их соединяют{" "}
            <PythonTerm term="andor">
              <Notation>{"and"}</Notation>
            </PythonTerm>
            , если достаточно одного — <Notation>{"or"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "n % 3 == 0 and n % 5 == 0  # и на 3, и на 5\nn % 3 == 0 or n % 5 == 0   # хотя бы на одно"
            }
            label={"Код на Python: n % 3 == 0 and n % 5 == 0  # и на 3, и на 5"}
            language="python"
          />
          <Typography.Text>
            Второе условие выполнено в трёх случаях: число делится только на 3,
            только на 5 или на оба сразу. То есть <Notation>{"or"}</Notation> не
            означает «строго одно из двух».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-diapazona",
      navLabel: "Перебор диапазона",
      explanation: (
        <>
          <Typography.Text>
            <strong>Чтобы проверить много чисел подряд, нужен цикл.</strong>{" "}
            Запись{" "}
            <PythonTerm term="for">
              <Notation>{"for n in range(10, 15)"}</Notation>
            </PythonTerm>{" "}
            по очереди даёт переменной <Notation>{"n"}</Notation> значения от 10
            до 14:
          </Typography.Text>
          <CodeBlock
            code={"for n in range(10, 15):\n    print(n)"}
            label={
              "Запись {{for|for n in range(10, 15)}} по очереди даёт переменной n значения от 10 до 14"
            }
            language="python"
            output={"10\n11\n12\n13\n14"}
          />
          <Typography.Text>
            Числа 15 в выводе нет:{" "}
            <strong>
              правая граница <Notation>{"range"}</Notation> не включается
            </strong>
            . Поэтому для отрезка [L; R], где обе границы входят, пишут{" "}
            <Notation>{"range(L, R + 1)"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Проверку внутри цикла делает{" "}
            <PythonTerm term="if">
              <Notation>{"if"}</Notation>
            </PythonTerm>
            , а отступы показывают, какие команды к нему относятся. Выведем
            числа отрезка [10; 30], кратные 3:
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(10, 31):\n    if n % 3 == 0:\n        print(n)"
            }
            label={"Выведем числа отрезка [10; 30], кратные 3"}
            language="python"
            output={"12\n15\n18\n21\n24\n27\n30"}
          />
          <Typography.Text>
            Программа берёт очередное число от 10 до 30, проверяет делимость на
            3 и, если проверка прошла, выводит число. Граница 31 — чтобы
            проверить и само 30.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-i-stroka",
      navLabel: "Число и строка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для работы с масками нужно различать число и строку.
            </strong>{" "}
            <Notation>{"1234"}</Notation> — число, а{" "}
            <Notation>{'"1234"'}</Notation> —{" "}
            <PythonTerm term="str">строка</PythonTerm> из четырёх символов. С
            числами выполняются арифметические действия, а строки при сложении
            склеиваются:
          </Typography.Text>
          <CodeBlock
            code={'print(12 + 34)\nprint("12" + "34")'}
            label={
              "С числами выполняются арифметические действия, а строки при сложении склеиваются"
            }
            language="python"
            output={"46\n1234"}
          />
          <Typography.Text>
            Переходить между ними помогают <Notation>{"str"}</Notation> и{" "}
            <Notation>{"int"}</Notation>. Поэтому запись числа можно собрать из
            частей как строку, а затем превратить в число. Количество цифр
            натурального числа — это{" "}
            <PythonTerm term="len">
              <Notation>{"len(str(n))"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={'s = "12" + "7" + "34"\nn = int(s)\nprint(n, len(str(n)))'}
            label={
              "Количество цифр натурального числа — это {{len|len(str(n))}}"
            }
            language="python"
            output={"12734 5"}
          />
        </>
      ),
    },
    {
      id: "operacii-s-ciframi",
      navLabel: "Операции с цифрами",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Операции с цифрами позволяют проверять дополнительные требования к
              числу.
            </strong>{" "}
            Некоторые условия удобнее проверять арифметически, другие — через
            строку.
          </Typography.Text>
          <Typography.Text>
            Арифметически цифры достаются делением на 10, 100, 1000: остаток{" "}
            <Notation>{"n % 100"}</Notation> — это последние две цифры, а{" "}
            <Notation>{"n // 100"}</Notation> — число без них. Выберите
            операцию, чтобы увидеть её результат для n = 50721:
          </Typography.Text>
          <VariantPicker
            label={"Операции с цифрами числа 50721"}
            variants={[
              {
                label: "последняя цифра",
                value: (
                  <>
                    <Notation>{"n % 10"}</Notation> → 1
                  </>
                ),
              },
              {
                label: "без последней цифры",
                value: (
                  <>
                    <Notation>{"n // 10"}</Notation> → 5072
                  </>
                ),
              },
              {
                label: "последние две цифры",
                value: (
                  <>
                    <Notation>{"n % 100"}</Notation> → 21
                  </>
                ),
              },
              {
                label: "без последних двух цифр",
                value: (
                  <>
                    <Notation>{"n // 100"}</Notation> → 507
                  </>
                ),
              },
              {
                label: "цифра сотен",
                value: (
                  <>
                    <Notation>{"(n // 100) % 10"}</Notation> → 7
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Почему остаток от деления на 10 даёт последнюю цифру? Любое
            неотрицательное целое число можно записать как n = 10q + r, где 0 ≤
            r {"<"} 10. Часть 10q — все полные десятки, а остаток r — единицы,
            то есть последняя цифра. Так же n = 100q + r с 0 ≤ r {"<"} 100
            оставляет в остатке последние два разряда. Поэтому{" "}
            <Notation>{"n % 100 == 37"}</Notation> проверяет окончание на 37.
          </Typography.Text>
          <Typography.Text>
            Если окончание начинается с нулей, остаток не различает, например,
            число 7 и число, оканчивающееся на <Notation>{"07"}</Notation>.
            Через строку такое окончание проверяется явно:{" "}
            <Notation>{'str(n).endswith("07")'}</Notation> — «запись
            заканчивается на 07».
          </Typography.Text>
          <Typography.Text>
            Сумму цифр считает цикл по символам записи:{" "}
            <Notation>{"int(ch)"}</Notation> превращает символ цифры в число.
          </Typography.Text>
          <CodeBlock
            code={
              "n = 50721\ndigit_sum = 0\nfor ch in str(n):\n    digit_sum += int(ch)\nprint(digit_sum)"
            }
            label={
              "Сумму цифр считает цикл по символам записи: int(ch) превращает символ цифры в число"
            }
            language="python"
            output={"15"}
          />
          <Typography.Text>
            Повторы цифр удобно искать через{" "}
            <PythonTerm term="set">множество</PythonTerm>{" "}
            <Notation>{"set(s)"}</Notation>: в нём остаются только различные
            символы. Если их столько же, сколько всех цифр, повторов нет:
          </Typography.Text>
          <CodeBlock
            code={"s = str(50721)\nprint(len(set(s)) == len(s))"}
            label={"Если их столько же, сколько всех цифр, повторов нет"}
            language="python"
            output={"True"}
          />
        </>
      ),
    },
    {
      id: "proverka-in",
      navLabel: "Цифра в записи: in",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Проверить, встречается ли в записи числа цифра или группа цифр,
              можно через <Notation>{"in"}</Notation>.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В задачах последних лет часто встречаются условия вроде «в записи
            числа есть цифра 1 и цифра 6» или «запись содержит
            последовательность цифр 53». Это проверки <strong>строки</strong>, а
            не арифметики:{" "}
            <PythonTerm term="in">
              <Notation>{'"1" in s'}</Notation>
            </PythonTerm>{" "}
            истинно, если символ <Notation>{"1"}</Notation> встречается в записи
            хотя бы раз, а <Notation>{'s.count("16")'}</Notation> считает,
            сколько раз в ней встречается группа <Notation>{"16"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              's = str(1677016)\n\nprint("1" in s and "6" in s)\nprint(s.count("16"))'
            }
            label={"Код на Python: s = str(1677016)"}
            language="python"
            output={"True\n2"}
          />
          <Typography.Text>
            Выберите формулировку, чтобы увидеть её проверку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка про цифры записи и её проверка"}
            variants={[
              {
                label: "содержит цифру 7",
                value: (
                  <>
                    <Notation>{'"7" in str(n)'}</Notation>
                  </>
                ),
              },
              {
                label: "не содержит цифру 0",
                value: (
                  <>
                    <Notation>{'"0" not in str(n)'}</Notation>
                  </>
                ),
              },
              {
                label: "есть и 1, и 6",
                value: (
                  <>
                    <Notation>{'"1" in s and "6" in s'}</Notation>
                  </>
                ),
              },
              {
                label: "есть 2 или 3",
                value: (
                  <>
                    <Notation>{'"2" in s or "3" in s'}</Notation>
                  </>
                ),
              },
              {
                label: "«53» ровно один раз",
                value: (
                  <>
                    <Notation>{'s.count("53") == 1'}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            <strong>
              «Встречается ровно один раз» и <Notation>{"count"}</Notation>{" "}
              совпадают не всегда.
            </strong>{" "}
            <Notation>{"count"}</Notation> считает непересекающиеся вхождения:
            найдя группу, продолжает поиск после неё.
          </Typography.Text>
          <CodeBlock
            code={'s = "7777"\nprint(s.count("77"))'}
            label={
              "count считает непересекающиеся вхождения: найдя группу, продолжает поиск после неё"
            }
            language="python"
            output={"2"}
          />
          <Typography.Text>
            Но если считать все места, где начинается{" "}
            <Notation>{"77"}</Notation>, их три: позиции 0, 1 и 2. Сравните на
            схеме:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.overlap7777_77}
            caption={
              <>
                Жирные отрезки — то, что находит <Notation>{"count"}</Notation>:
                после вхождения с позиции 0 поиск продолжается с позиции 2.
                Вхождение с позиции 1 перекрывается с уже найденным и
                пропускается.
              </>
            }
          />
          <Typography.Text>
            Для групп вроде <Notation>{"53"}</Notation> или{" "}
            <Notation>{"567"}</Notation> перекрытие невозможно — у них начало не
            совпадает с концом, и <Notation>{"count"}</Notation> даёт верный
            ответ. Для групп вроде <Notation>{"77"}</Notation> или{" "}
            <Notation>{"121"}</Notation> нужно уточнить, что считает условие.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-po-ubyvaniyu",
      navLabel: "Перебор по убыванию",
      explanation: (
        <>
          <Typography.Text>
            <strong>Иногда числа нужно перебирать по убыванию.</strong>{" "}
            Например, когда спрашивают о наибольших подходящих числах. Третий
            аргумент <Notation>{"range"}</Notation> — шаг, отрицательный шаг
            ведёт вниз, а правая граница по-прежнему не включается:
          </Typography.Text>
          <CodeBlock
            code={"for n in range(10, 4, -2):\n    print(n)"}
            label={"Код на Python: for n in range(10, 4, -2):"}
            language="python"
            output={"10\n8\n6"}
          />
          <Typography.Text>
            Найдём три наибольших числа меньше 1000, которые делятся на 7 и
            оканчиваются цифрой 3. Как только найдено третье,{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>{" "}
            завершает цикл:
          </Typography.Text>
          <CodeBlock
            code={
              "found = []\n\nfor n in range(999, 0, -1):\n    if n % 7 == 0 and n % 10 == 3:\n        found.append(n)\n        if len(found) == 3:\n            break\n\nprint(found)"
            }
            label={"Как только найдено третье, {{break|break}} завершает цикл"}
            language="python"
            output={"[973, 903, 833]"}
          />
          <Typography.Text>
            <strong>Нижняя граница в таком поиске обязательна.</strong> Если
            искать те же три числа меньше 200 циклом{" "}
            <Notation>{"while"}</Notation>, который просто уменьшает{" "}
            <Notation>{"n"}</Notation>, найдутся 133 и 63, а третьим окажется
            −7: подходящих положительных чисел всего два, и цикл ушёл в
            отрицательные числа. <Notation>{"range(199, 0, -1)"}</Notation>{" "}
            остановится на 1 и честно вернёт только два числа.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-korotko",
      navLabel: "Итого",
      explanation: (
        <>
          <Typography.Text>
            Решение любой задачи этой темы собирается из одних и тех же частей:
          </Typography.Text>
          <ol>
            <li>
              перебрать нужные числа — <Notation>{"range(L, R + 1)"}</Notation>,
              по убыванию или с шагом;
            </li>
            <li>
              перевести каждую часть условия в проверку —{" "}
              <Notation>{"%"}</Notation>, сравнения,{" "}
              <Notation>{"and"}</Notation>, <Notation>{"or"}</Notation>,
              проверки строки;
            </li>
            <li>вывести то, что просит условие, в нужном порядке.</li>
          </ol>
          <Typography.Text>
            Делители, простые числа и маски в следующих подтемах — это новые
            проверки, которые встраиваются в ту же схему.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pary-ideya",
      navLabel: "Главная идея",
      explanation: (
        <>
          <Typography.Text>
            Главная идея подтемы:{" "}
            <strong>
              делители числа образуют пары, поэтому все делители можно найти,
              проверив кандидатов только до √n
            </strong>
            . На этом приёме держатся почти все задачи о делителях: он нужен
            примерно в каждой третьей задаче задания 25.
          </Typography.Text>
          <Typography.Text>
            Сквозной пример подтемы — число 36. Вспомогательные — 12 и 49.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "delitel",
      navLabel: "Что такое делитель",
      explanation: (
        <>
          <Typography.Text>
            <strong>Теперь определим, что такое делитель.</strong> Натуральное
            число d называется делителем натурального числа n, если n делится на
            d без остатка. Делители 12 — это 1, 2, 3, 4, 6 и 12: 12 = 1 · 12 = 2
            · 6 = 3 · 4. А 5 делителем 12 не является: 12 = 5 · 2 + 2. Ноль
            делителем быть не может — на ноль делить нельзя.
          </Typography.Text>
          <Typography.Text>
            Условие задачи может требовать не все делители, а только часть.
            Выберите требование — подходящие делители 12 выделятся:
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
                label: "нечётные",
                value: (
                  <TokenSet values={[1, 2, 3, 4, 6, 12]} selected={[1, 3]} />
                ),
              },
              {
                label: "простые",
                value: (
                  <TokenSet values={[1, 2, 3, 4, 6, 12]} selected={[2, 3]} />
                ),
                note: <>простые числа подробно разберём в подтеме 4</>,
              },
            ]}
          />
          <Typography.Text>
            «Делители» и «простые делители» — разные требования. Единицу и само
            число исключают, только если условие говорит об этом прямо. А у
            числа 1 делитель один — 1, и записывается он один раз, хотя это
            одновременно и единица, и само число.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-do-n",
      navLabel: "Перебор до n",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Самый понятный способ найти делители — проверить все числа от 1 до
              n.
            </strong>{" "}
            Начнём с него, чтобы затем осознанно улучшить алгоритм. Найденные
            делители будем складывать в{" "}
            <PythonTerm term="list">список</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 12\ndivisors = []\n\nfor d in range(1, n + 1):\n    if n % d == 0:\n        divisors.append(d)\n\nprint(divisors)"
            }
            label={"Найденные делители будем складывать в {{list|список}}"}
            language="python"
            output={"[1, 2, 3, 4, 6, 12]"}
          />
          <Typography.Text>
            Здесь <Notation>{"n"}</Notation> — число, делители которого ищем,{" "}
            <Notation>{"d"}</Notation> — очередной возможный делитель,{" "}
            <Notation>{"divisors"}</Notation> — уже найденные. Дальше n идти
            незачем: положительный делитель не больше самого числа.
          </Typography.Text>
          <Typography.Text>
            Но для одного числа порядка миллиарда понадобится около миллиарда
            проверок, а таких чисел в задаче может быть много. Переход к
            перебору до n / 2 выигрывает лишь вдвое — нужен выигрыш
            существеннее.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pary-delitelej",
      navLabel: "Делители образуют пары",
      explanation: (
        <>
          <Typography.Text>
            <strong>Главное наблюдение: делители образуют пары.</strong> Удобнее
            всего увидеть это на клетках. Возьмём 36 одинаковых клеток и
            попробуем сложить из них прямоугольник без пустых мест. Это можно
            сделать пятью способами:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.rectangles36}
            caption={
              <>
                Все прямоугольники, которые складываются из 36 клеток. Ширина и
                высота каждого — пара делителей 36.
              </>
            }
          />
          <Typography.Text>
            Прямоугольник шириной 4 клетки получился, потому что 36 делится на 4
            без остатка: выходит ровно 9 рядов. А шириной 5 не получится: 36 = 5
            · 7 + 1, одна клетка лишняя.
          </Typography.Text>
          <Typography.Text>
            Значит,{" "}
            <strong>
              каждый делитель — это ширина прямоугольника, а его высота — второй
              делитель пары
            </strong>
            . Если найден делитель d, вторую сторону даёт{" "}
            <Notation>{"n // d"}</Notation>: проверив 2, мы одновременно узнаём
            о делителе 18, проверив 3 — о делителе 12.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kvadrat-granica",
      navLabel: "Квадрат — граница",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чем шире прямоугольник, тем он ниже — и на квадрате стороны
              встречаются.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Посмотрите на рисунок сверху вниз. Ширина растёт: 1, 2, 3, 4, 6.
            Высота падает: 36, 18, 12, 9, 6. На прямоугольнике 6 × 6 они
            сравнялись — получился квадрат.
          </Typography.Text>
          <Typography.Text>
            Что было бы дальше? Следующие делители 36 — это 9, 12, 18 и 36. Но
            прямоугольник шириной 9 — это уже знакомый прямоугольник 4 × 9,
            просто повёрнутый. Ширина 12 — это повёрнутый 3 × 12, и так далее.{" "}
            <strong>
              Новых пар после квадрата не появляется: все они уже встретились,
              пока ширина росла до 6.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Сторона квадрата, сложенного из n клеток, называется{" "}
            <strong>квадратным корнем</strong> из n и обозначается √n. Для 36
            это 6, потому что 6 · 6 = 36.
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
            <strong>Почему после √n новых пар не бывает — на примерах.</strong>
          </Typography.Text>
          <Typography.Text>
            Попробуем найти пару делителей 36, в которой оба числа больше 6:
          </Typography.Text>
          <LessonTable
            label={
              "Попробуем найти пару делителей 36, в которой оба числа больше 6"
            }
            columns={[
              { label: "Стороны" },
              { label: "Сколько клеток", numeric: true },
              { label: "Подходит для 36?" },
            ]}
            rows={[
              ["7 × 7", "49", "Нет: уже больше 36"],
              ["7 × 8", "56", "Нет"],
              ["8 × 9", "72", "Нет"],
              ["9 × 4", "36", "Да, но 4 меньше 6 — это повёрнутый 4 × 9"],
            ]}
          />
          <Typography.Text>
            Ни одна такая попытка не удалась. Причина видна на рисунке. Если обе
            стороны больше 6, то есть хотя бы 7, прямоугольник целиком накрывает
            квадрат 6 × 6 и ещё выходит за него:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.cover}
            caption={
              <>
                Квадрат 6 × 6 — это уже все 36 клеток. Прямоугольник 7 × 8
                содержит его целиком и ещё клетки вокруг, поэтому в нём больше
                36 клеток.
              </>
            }
          />
          <Typography.Text>
            Квадрат 6 × 6 уже израсходовал все 36 клеток. Любой прямоугольник с
            обеими сторонами больше 6 требует больше клеток, чем у нас есть.
            Отсюда главное правило:{" "}
            <strong>
              в каждой паре делителей хотя бы один делитель не больше √n.
            </strong>{" "}
            Поэтому достаточно проверять кандидатов d = 1, 2, 3, … только пока d
            · d ≤ n — каждый найденный делитель сразу даёт свою пару.
          </Typography.Text>
          <ProofDisclosure summary="Доказательство для любого числа n">
            <Typography.Text>
              Пусть n = d · q и оба множителя больше √n: d {">"} √n, q {">"} √n.
              Тогда d · q {">"} √n · √n = n. Но мы исходили из того, что d · q =
              n, — противоречие. Следовательно, в каждой паре хотя бы один
              делитель не превосходит √n.
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
            <strong>
              Посмотрим, как программа находит все девять делителей 36, проверив
              только числа от 1 до 6.
            </strong>
          </Typography.Text>
          <Typography.Text>
            На каждом шаге программа проверяет очередного кандидата d. Если он
            делитель, на прямой появляется дуга к его паре 36 // d. Переключайте
            шаги кнопками или запустите показ:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.searchStepper36}
            label={"Поиск делителей 36 до корня по шагам"}
          />
          <Typography.Text>
            Все дуги начинаются левее пунктира или на нём. Большие делители 9,
            12, 18 и 36 программа ни разу не проверяла — она получила их как
            пары.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "celaya-chast-kornya",
      navLabel: "Граница ⌊√n⌋",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если n не квадрат, граница поиска — целая часть корня.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Из 40 клеток квадрат не сложить: 6 · 6 = 36 меньше 40, а 7 · 7 = 49
            уже больше. Значит, √40 лежит между 6 и 7, и проверять достаточно до
            6: пары 1 · 40, 2 · 20, 4 · 10 и 5 · 8 находятся при ширине не
            больше 6. Такую границу записывают как ⌊√n⌋ — корень, округлённый
            вниз: ⌊√40⌋ = 6, поскольку 6² ≤ 40 {"<"} 7².
          </Typography.Text>
          <Typography.Text>
            При этом <strong>делители больше корня не исчезают</strong>:
            делимость проверяем только на небольшие числа, а в список добавляем
            и небольшие, и большие — их даёт <Notation>{"n // d"}</Notation>.
            Выигрыш огромный:
          </Typography.Text>
          <LessonTable
            label={"Выигрыш огромный"}
            columns={[
              { label: "Число n", numeric: true },
              { label: "Перебор до n", numeric: true },
              { label: "Перебор до √n", numeric: true },
            ]}
            rows={[
              ["10⁶", "1 000 000", "1 000"],
              ["10⁹", "1 000 000 000", "31 622"],
              ["10¹²", "1 000 000 000 000", "1 000 000"],
            ]}
          />
        </>
      ),
    },
    {
      id: "koren-odin-raz",
      navLabel: "Корень один раз",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              У квадратов один делитель является парой самому себе.
            </strong>{" "}
            Этот случай нужно обработать отдельно.
          </Typography.Text>
          <Typography.Text>
            Для 36 последняя пара — 6 · 6 = 36, но в списке различных делителей
            число 6 должно быть один раз. Если безусловно добавлять оба числа
            пары, при <Notation>{"d == n // d"}</Notation> получится повтор:
          </Typography.Text>
          <CodeBlock
            code={"divisors.append(d)\ndivisors.append(n // d)"}
            label={
              "Если безусловно добавлять оба числа пары, при d == n // d получится повтор"
            }
            language="python"
          />
          <Typography.Text>
            Поэтому первый делитель добавляем всегда, а второй — только если он
            отличается от первого:
          </Typography.Text>
          <CodeBlock
            code={
              "divisors.append(d)\n\nq = n // d\n\nif q != d:\n    divisors.append(q)"
            }
            label={
              "Поэтому первый делитель добавляем всегда, а второй — только если он отличается от первого"
            }
            language="python"
          />
          <Typography.Text>
            И сам корень нужно проверять: если для 49 остановиться перед 7,
            пропадёт пара 7 · 7 = 49.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "funkciya-delitelej",
      navLabel: "Функция поиска делителей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Оформим поиск делителей как отдельную функцию, чтобы использовать
              его в разных задачах.
            </strong>{" "}
            <PythonTerm term="def">Функция</PythonTerm> — именованный фрагмент
            программы: ей передают число, а она возвращает результат. Вызов{" "}
            <Notation>{"get_divisors(36)"}</Notation> будет означать «найти
            делители 36 и вернуть их списком».
          </Typography.Text>
          <Typography.Text>
            Границу ⌊√n⌋ точно вычисляет <Notation>{"isqrt"}</Notation> из
            стандартного модуля <Notation>{"math"}</Notation> — наибольшее целое
            a, для которого a² ≤ n. Подключает её строка{" "}
            <PythonTerm term="import">
              <Notation>{"from math import isqrt"}</Notation>
            </PythonTerm>
            .{" "}
            <ExternalLink href="https://docs.python.org/3/library/math.html">
              Python 3.14.8 documentation
            </ExternalLink>
          </Typography.Text>
          <CodeBlock
            code={
              "from math import isqrt\n\nprint(isqrt(36), isqrt(40), isqrt(49))"
            }
            label={"Python 3.14.8 documentation"}
            language="python"
            output={"6 6 7"}
          />
          <Typography.Text>Полная функция:</Typography.Text>
          <CodeBlock
            code={
              "from math import isqrt\n\ndef get_divisors(n):\n    divisors = []\n\n    for d in range(1, isqrt(n) + 1):\n        if n % d == 0:\n            divisors.append(d)\n\n            q = n // d\n\n            if q != d:\n                divisors.append(q)\n\n    return sorted(divisors)"
            }
            label={"Полная функция"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"range(1, isqrt(n) + 1)"}</Notation> перебирает числа от
            1 до целой части корня включительно: единица прибавлена из-за
            невключённой правой границы. Делители находятся парами, поэтому без
            сортировки для 36 получился бы список{" "}
            <Notation>{"[1, 36, 2, 18, 3, 12, 4, 9, 6]"}</Notation>.{" "}
            <PythonTerm term="sorted">
              <Notation>{"sorted"}</Notation>
            </PythonTerm>{" "}
            упорядочивает его по возрастанию:
          </Typography.Text>
          <CodeBlock
            code={"D = get_divisors(36)\nprint(D)"}
            label={"{{sorted|sorted}} упорядочивает его по возрастанию"}
            language="python"
            output={"[1, 2, 3, 4, 6, 9, 12, 18, 36]"}
          />
          <Typography.Text>
            Функция <strong>возвращает</strong> список через{" "}
            <Notation>{"return"}</Notation>, а не печатает его: дальше делители
            нужно будет считать, выбирать среди них наибольшие и складывать. Она
            рассчитана на натуральные <Notation>{"n >= 1"}</Notation>. В
            следующих примерах, где вызывается{" "}
            <Notation>{"get_divisors"}</Notation>, подразумевается, что её
            определение находится выше в программе.
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
            <strong>
              После поиска делителей нужно оставить именно те, о которых
              спрашивает задача.
            </strong>{" "}
            Такое выделение подходящих элементов называют фильтрацией. Найдём
            делители 36 без единицы и самого числа:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 36\nselected = []\n\nfor d in get_divisors(n):\n    if 1 < d < n:\n        selected.append(d)\n\nprint(selected)"
            }
            label={"Найдём делители 36 без единицы и самого числа"}
            language="python"
            output={"[2, 3, 4, 6, 9, 12, 18]"}
          />
          <Typography.Text>
            Цикл перебирает уже найденные делители, а двойное сравнение{" "}
            <Notation>{"1 < d < n"}</Notation> означает{" "}
            <Notation>{"d > 1 and d < n"}</Notation>. Для других требований
            меняется только проверка — выберите требование:
          </Typography.Text>
          <VariantPicker
            label={"Какие делители нужны и условие для делителя d"}
            defaultIndex={1}
            variants={[
              { label: "все", value: <>дополнительная проверка не нужна</> },
              {
                label: "без 1 и самого числа",
                value: (
                  <>
                    <Notation>{"1 < d < n"}</Notation>
                  </>
                ),
              },
              {
                label: "без самого числа, но с единицей",
                value: (
                  <>
                    <Notation>{"d < n"}</Notation>
                  </>
                ),
              },
              {
                label: "чётные",
                value: (
                  <>
                    <Notation>{"d % 2 == 0"}</Notation>
                  </>
                ),
              },
              {
                label: "нечётные",
                value: (
                  <>
                    <Notation>{"d % 2 != 0"}</Notation>
                  </>
                ),
              },
              {
                label: "кратные 7",
                value: (
                  <>
                    <Notation>{"d % 7 == 0"}</Notation>
                  </>
                ),
              },
              {
                label: "не кратные 7",
                value: (
                  <>
                    <Notation>{"d % 7 != 0"}</Notation>
                  </>
                ),
              },
              {
                label: "оканчиваются на 7",
                value: (
                  <>
                    <Notation>{"d % 10 == 7"}</Notation>
                  </>
                ),
              },
              {
                label: "больше 100",
                value: (
                  <>
                    <Notation>{"d > 100"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Условие относится к <strong>делителю</strong>, поэтому в проверке
            стоит <Notation>{"d"}</Notation>:{" "}
            <Notation>{"d % 7 == 0"}</Notation> значит «делитель кратен 7», а{" "}
            <Notation>{"n % 7 == 0"}</Notation> — «исходное число кратно 7». Это
            разные проверки.
          </Typography.Text>
          <Typography.Text>
            Тот же отбор короче записывает{" "}
            <PythonTerm term="comp">списковое включение</PythonTerm> — оно
            делает то же, что цикл с <Notation>{"append"}</Notation>, и дальше
            иногда будет встречаться:
          </Typography.Text>
          <CodeBlock
            code={"selected = [d for d in get_divisors(n) if 1 < d < n]"}
            label={
              "Код на Python: selected = [d for d in get_divisors(n) if 1 < d < n]"
            }
            language="python"
          />
        </>
      ),
    },
    {
      id: "harakteristiki-spiska",
      navLabel: "Характеристики списка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Список делителей позволяет сразу получать разные характеристики
              числа.
            </strong>{" "}
            Для этого нужны длина списка и{" "}
            <PythonTerm term="slice">номера элементов</PythonTerm>: нумерация
            начинается с нуля, а отрицательные номера отсчитываются с конца.
          </Typography.Text>
          <CodeBlock
            code={
              "D = [2, 3, 4, 6, 9, 12, 18]\nprint(len(D), D[0], D[1], D[-1], D[-2])"
            }
            label={"Код на Python: D = [2, 3, 4, 6, 9, 12, 18]"}
            language="python"
            output={"7 2 3 18 12"}
          />
          <Typography.Text>
            Список отсортирован, поэтому наименьший делитель —{" "}
            <Notation>{"D[0]"}</Notation>, а наибольший —{" "}
            <Notation>{"D[-1]"}</Notation>. Выберите характеристику, чтобы
            увидеть её выражение и значение для этого списка:
          </Typography.Text>
          <VariantPicker
            label={"Характеристика и выражение для отсортированного списка D"}
            variants={[
              {
                label: "количество",
                value: (
                  <>
                    <Notation>{"len(D)"}</Notation> → 7
                  </>
                ),
              },
              {
                label: "наименьший",
                value: (
                  <>
                    <Notation>{"D[0]"}</Notation> → 2
                  </>
                ),
              },
              {
                label: "наибольший",
                value: (
                  <>
                    <Notation>{"D[-1]"}</Notation> → 18
                  </>
                ),
              },
              {
                label: "второй по величине",
                value: (
                  <>
                    <Notation>{"D[-2]"}</Notation> → 12
                  </>
                ),
              },
              {
                label: "сумма всех",
                value: (
                  <>
                    <Notation>{"sum(D)"}</Notation> → 54
                  </>
                ),
              },
              {
                label: "наименьший и наибольший",
                value: (
                  <>
                    <Notation>{"D[0] + D[-1]"}</Notation> → 20
                  </>
                ),
              },
              {
                label: "сумма двух наибольших",
                value: (
                  <>
                    <Notation>{"D[-1] + D[-2]"}</Notation> → 30
                  </>
                ),
              },
              {
                label: "произведение двух наименьших",
                value: (
                  <>
                    <Notation>{"D[0] * D[1]"}</Notation> → 6
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Но длину списка нужно проверять. Если в нём один элемент, второго по
            величине нет, и обращение к <Notation>{"D[-2]"}</Notation> вызовет
            ошибку. Блок <Notation>{"else"}</Notation> выполняется, когда
            условие после <Notation>{"if"}</Notation> ложно:
          </Typography.Text>
          <CodeBlock
            code={"if len(D) >= 2:\n    M = D[-1] + D[-2]\nelse:\n    M = 0"}
            label={"Блок else выполняется, когда условие после if ложно"}
            language="python"
          />
          <Typography.Text>
            Последние три элемента даёт срез <Notation>{"D[-3:]"}</Notation>. С
            ним проверка длины тоже нужна, хотя срез и не вызывает ошибку: при
            двух элементах он вернёт оба, и программа посчитает сумму двух
            делителей вместо требуемых трёх.
          </Typography.Text>
          <CodeBlock
            code={"if len(D) >= 3:\n    M = sum(D[-3:])\nelse:\n    M = 0"}
            label={"Код на Python: if len(D) >= 3:"}
            language="python"
          />
        </>
      ),
    },
    {
      id: "chetnye-deliteli",
      navLabel: "Чётные делители",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Нельзя искать только чётные делители простым переходом к шагу 2 в
              переборе до корня.
            </strong>{" "}
            У парных делителей свойства могут различаться.
          </Typography.Text>
          <Typography.Text>
            Например, 18 = 3 · 6: небольшой делитель 3 нечётный, а парный ему 6
            — чётный. Если при поиске до корня проверять только чётные{" "}
            <Notation>{"d"}</Notation>, мы пропустим 3, а вместе с ним и нужный
            делитель 6. Так же 18 = 1 · 18: исключив 1 из кандидатов, мы
            потеряем и само число 18.
          </Typography.Text>
          <Typography.Text>
            На схеме пар 18 это видно сразу. Чётные делители закрашены, нечётные
            — пустые:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.arcs18_10e6f9}
            caption={
              <>
                Делители 18 парами. Пунктир — √18 ≈ 4,24: до него проверяются
                кандидаты. Если брать только чётные кандидаты (2 и 4), найдётся
                лишь пара (2, 9). Чётные 6 и 18 стоят в парах с нечётными 3 и 1
                и будут потеряны.
              </>
            }
          />
          <Typography.Text>
            Надёжный подход для начала — сначала найти все делители, а потом
            отобрать среди них подходящие. Если позже захочется объединить поиск
            и отбор в одном цикле, проверять свойства нужно{" "}
            <strong>у каждого члена пары отдельно</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "schetchik-delitelej",
      navLabel: "Счётчик вместо списка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если нужны только количество делителей или проверка количества,
              список можно не хранить.
            </strong>{" "}
            Достаточно счётчика — переменной, в которой накапливается число
            найденных делителей. Запись <Notation>{"count += 1"}</Notation>{" "}
            означает то же, что <Notation>{"count = count + 1"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "def count_divisors(n):\n    count = 0\n\n    for d in range(1, isqrt(n) + 1):\n        if n % d == 0:\n            if d * d == n:\n                count += 1\n            else:\n                count += 2\n\n    return count"
            }
            label={"Запись count += 1 означает то же, что count = count + 1"}
            language="python"
          />
          <Typography.Text>
            Если <Notation>{"d"}</Notation> не делитель, счётчик не меняется.
            Обычная пара разных делителей добавляет 2, а пара вида d · d = n —
            1. Для 36 пары 1 · 36, 2 · 18, 3 · 12 и 4 · 9 дают по два делителя,
            а 6 · 6 — один: всего 2 + 2 + 2 + 2 + 1 = 9.
          </Typography.Text>
          <Typography.Text>
            Если требуется ровно <Notation>{"k"}</Notation> делителей, проверку
            можно закончить, как только их стало больше{" "}
            <Notation>{"k"}</Notation>: количество найденных делителей дальше
            только растёт и вернуться к <Notation>{"k"}</Notation> не сможет.
          </Typography.Text>
          <CodeBlock
            code={
              "def has_k_divisors(n, k):\n    count = 0\n\n    for d in range(1, isqrt(n) + 1):\n        if n % d == 0:\n            if d * d == n:\n                count += 1\n            else:\n                count += 2\n\n            if count > k:\n                return False\n\n    return count == k"
            }
            label={"Код на Python: def has_k_divisors(n, k):"}
            language="python"
          />
          <Typography.Text>
            Но{" "}
            <strong>
              нельзя отвечать «да» сразу, как только найдено ровно{" "}
              <Notation>{"k"}</Notation> делителей
            </strong>
            . У 12 первая пара — 1 и 12: два делителя уже найдены, но дальше
            найдутся 2, 6, 3 и 4. Ответ на вопрос «ровно ли{" "}
            <Notation>{"k"}</Notation>?» можно дать только после завершения
            перебора.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pary-korotko",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Делители ищем парами: проверяем d от 1 до{" "}
                    <Notation>{"isqrt(n)"}</Notation>, а парный делитель
                    получаем как <Notation>{"n // d"}</Notation>.
                  </>
                ),
              },
              { note: <>У квадрата средний делитель добавляем один раз.</> },
              {
                note: (
                  <>
                    Сначала находим все делители, потом отбираем нужные. Условие
                    проверяем у <strong>делителя</strong>{" "}
                    <Notation>{"d"}</Notation>, а не у числа{" "}
                    <Notation>{"n"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Если нужно только количество, достаточно счётчика. Ответ
                    «ровно k» можно дать только после полного перебора.
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
    checkpoint: 2,
    load: () => import("./divisors-and-masks.paid.praktika"),
  },
  status: "published",
});
