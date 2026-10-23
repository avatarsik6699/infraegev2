import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { numeralSystemsLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./numeral-systems.media";
import { PythonTerm } from "./python-term";
import { FinalMistake } from "./final-mistake";
import { SubtopicLink } from "./subtopic-link";

const THEME_TASK = (
  <>
    «Значение арифметического выражения 5²³ + 25¹² − 10 записали в системе
    счисления с основанием 5. Сколько цифр 4 содержится в этой записи?»
  </>
);

const R = "14-sistemy-schisleniya";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="14-sistemy-schisleniya" subtopic={props.slug}>
    {props.children}
  </SubtopicLink>
);

export const numeralSystemsLesson = defineLesson({
  ...numeralSystemsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать запись числа в любой системе и получать запись делением",
    "Собирать запись суммы и разности степеней из блоков цифр",
    "Считать цифры значения выражения программой: остаток и деление",
    "Перебирать параметр x и находить наибольшее или наименьшее подходящее значение",
    "Находить одну и две неизвестные цифры перебором допустимых значений",
    "Для редких задач — неизвестное основание и признаки делимости (дополнительный урок)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "zapis-i-znachenie",
      title: "Запись числа и её значение",
      lead: "Что спрашивают в задании 14, как прочитать запись в любой системе и как получить запись числа делением.",
      conceptIds: [
        "kak-ustroena-tema-14",
        "znachenie-zapisi",
        "cifry-bukvy",
        "posledovatelnoe-delenie",
        "zapis-itogo-14",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Чему равно 2103₄ в десятичной системе?</>,
          reveal: <>147: 2 · 64 + 1 · 16 + 0 · 4 + 3 = 147.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>Как записать 94 в пятеричной системе?</>,
          reveal: (
            <>
              334₅: 94 = 5 · 18 + 4, 18 = 5 · 3 + 3, 3 = 5 · 0 + 3 — остатки
              снизу вверх.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: <>В каком наименьшем основании возможна запись 3A7?</>,
          reveal: <>11: цифра A = 10, а цифра должна быть меньше основания.</>,
        },
        {
          id: "zadacha-4",
          prompt: <>Какое число означает запись 10 в системе с основанием 7?</>,
          reveal: <>Семь: одна единица разряда 7¹ и ноль единиц.</>,
        },
        {
          id: "zadacha-5",
          prompt: <>Что дают 329 % 5 и 329 // 5 для записи 2304₅?</>,
          reveal: (
            <>
              4 — её последнюю цифру и 65 = 230₅ — запись без последней цифры.
            </>
          ),
        },
      ],
    },
    {
      slug: "stepeni-blokami",
      title: "Запись суммы и разности степеней",
      lead: "Как выглядят qᵏ, qᵏ − 1 и qᵐ − qⁿ — и ответ задачи темы без программы.",
      conceptIds: [
        "stepen-osnovaniya",
        "minus-edinica",
        "raznost-stepenej",
        "otvet-zadachi-14",
        "slozhenie",
        "stepeni-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Как выглядит 7⁵ в семеричной записи?</>,
          reveal: <>100000₇: единица и пять нулей.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>А 7⁵ − 1?</>,
          reveal: (
            <>66666₇: пять цифр 6 — наибольших цифр семеричной системы.</>
          ),
        },
        {
          id: "zadacha-3",
          prompt: <>Сколько цифр 3 в четверичной записи 4²⁰ − 4⁷?</>,
          reveal: <>13: 20 − 7 = 13 троек, за ними семь нулей.</>,
        },
        {
          id: "zadacha-4",
          prompt: <>Сколько нулей в семеричной записи 7⁸ + 7³ + 1?</>,
          reveal: (
            <>6: единицы в разрядах 8, 3 и 0, всего 9 цифр, нулей 9 − 3 = 6.</>
          ),
        },
        {
          id: "zadacha-5",
          prompt: <>Сколько единиц в двоичной записи 2¹⁵ + 2¹⁵?</>,
          reveal: (
            <>Одна: 2¹⁵ + 2¹⁵ = 2¹⁶ — блоки совпали, и случился перенос.</>
          ),
        },
      ],
    },
    {
      slug: "cifry-programmoj",
      title: "Цифры значения выражения программой",
      lead: "Как посчитать цифры любой записи программой: остаток и деление в цикле, список цифр и цифры со свойством.",
      conceptIds: [
        "odin-sposob",
        "otvet-programmoj",
        "spisok-cifr",
        "cifry-so-svojstvom",
        "programma-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Какую цифру пятеричной записи числа 2024 даёт 2024 % 5?</>,
          reveal: <>4 — последнюю: 2024 = 31044₅.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>Почему в Python степень пишут 5 ** 23, а не 5 ^ 23?</>,
          reveal: (
            <>Знак ^ выполняет другую операцию; возведение в степень — **.</>
          ),
        },
        {
          id: "zadacha-3",
          prompt: <>Сколько единиц в двоичной записи 2¹⁰⁰ − 2⁵⁰ + 1?</>,
          reveal: (
            <>51: 2¹⁰⁰ − 2⁵⁰ — пятьдесят единиц и пятьдесят нулей, плюс 1.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Почему цифры записи хранят списком чисел, а не строкой?</>,
          reveal: (
            <>
              При основании больше 10 цифра вроде 24 — одна цифра; в списке это
              одно число, а в строке пришлось бы придумывать буквы.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>Чем количество цифр записи 2304 отличается от суммы цифр?</>
          ),
          reveal: <>Цифр 4, а сумма цифр 2 + 3 + 0 + 4 = 9.</>,
        },
      ],
    },
    {
      slug: "parametr-x",
      title: "Выражение с параметром x",
      lead: "Если из выражения вычитают неизвестное число x, его перебирают и для каждого заново считают цифры.",
      conceptIds: [
        "perebor-x",
        "pochemu-otvet",
        "ne-plavno",
        "naibolshee-i-naimenshee",
        "parametr-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Почему x в 5²³ + 25¹² − x перебирают до 2030, а не только от 0 до
              4?
            </>
          ),
          reveal: <>x — число в выражении, а не цифра записи.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>Сколько четвёрок в записи 5²³ + 25¹² − 1?</>,
          reveal: <>23: x − 1 = 0, из четвёрок ничего не вычитают.</>,
        },
        {
          id: "zadacha-3",
          prompt: <>А в записи 5²³ + 25¹² − 7?</>,
          reveal: (
            <>21: x − 1 = 6 = 11₅ — две ненулевые цифры, две четвёрки уходят.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Как найти наименьшее подходящее x, а не наибольшее?</>,
          reveal: (
            <>Перебирать по возрастанию и остановиться на первом подходящем.</>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Можно ли остановить перебор, когда количество четвёрок стало
              меньше нужного?
            </>
          ),
          reveal: (
            <>
              Нет: количество меняется скачками и при следующих x снова
              вырастает.
            </>
          ),
        },
      ],
    },
    {
      slug: "neizvestnaya-cifra",
      title: "Неизвестные цифры",
      lead: "Неизвестная цифра x в записи: какие значения она принимает, как её перебрать, что записать в ответ — и две неизвестные цифры.",
      conceptIds: [
        "chto-oboznachaet",
        "perebor-cifry",
        "v-otvet",
        "raznye-osnovaniya",
        "dve-cifry",
        "cifra-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Какие значения может принимать x в записи 4x213₁₈?</>,
          reveal: <>От 0 до 17: цифры 18-ричной системы.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>А в сумме 3x2₈ + 2x5₁₃?</>,
          reveal: <>От 0 до 7: цифра должна быть допустима в обеих записях.</>,
        },
        {
          id: "zadacha-3",
          prompt: <>Чему равно 2x3₇ при x = 4?</>,
          reveal: <>129: 243₇ = 2 · 49 + 4 · 7 + 3.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Перебор цифр идёт от 0 вверх. Как найти наибольшее подходящее x?
            </>
          ),
          reveal: (
            <>
              Запомнить последнее подходящее или перебирать сверху вниз и
              остановиться на первом.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему при двух цифрах первая подходящая пара не обязательно даёт
              наименьшую сумму?
            </>
          ),
          reveal: (
            <>
              Порядок перебора пар не совпадает с порядком сумм: уменьшение
              одной цифры может идти вместе с ростом другой.
            </>
          ),
        },
      ],
    },
    {
      slug: "neizvestnoe-osnovanie",
      title: "Неизвестное основание и признаки делимости",
      lead: "Основание из равенства, буквы-цифры, делимость на q − 1 и q + 1, наименьшая добавка до кратного и начало перебора, когда ответ далеко.",
      level: "advanced",
      conceptIds: [
        "dopolnitelnyy-urok-osnovanie",
        "osnovanie-po-formule",
        "osnovanie-i-cifra",
        "ravenstvo-s-bukvami",
        "delenie-na-q-1",
        "delenie-na-q-plus-1",
        "dobavka",
        "nachalo-perebora",
        "osnovanie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>В какой системе запись 124 означает число 67?</>,
          reveal: <>В семеричной: q² + 2q + 4 = 67, q = 7.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Почему в равенствах с буквами-цифрами первая цифра — не ноль?</>
          ),
          reveal: (
            <>
              Иначе число короче, чем записано, и решений становится слишком
              много.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Делится ли 2413₆ на 7? Найди остаток без перевода в десятичную
              систему.
            </>
          ),
          reveal: (
            <>Нет, остаток 4: 3 − 1 + 4 − 2 = 4; 2413₆ = 585 = 7 · 83 + 4.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>Какое наименьшее положительное A делает 100 + A кратным 12?</>
          ),
          reveal: <>8: 100 % 12 = 4, 12 − 4 = 8.</>,
        },
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-14",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 14 огромное число записывают в другой системе счисления и
            спрашивают что-то о его цифрах. Вот задача, которую мы будем решать
            всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Переводить такое число вручную не нужно: его запись можно понять
              по тому, как оно составлено, или посчитать программой.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "значение выражения 5²³ + 25¹² − 10",
                "одно огромное число — в нём 17 десятичных цифр",
              ],
              [
                "записали в системе с основанием 5",
                "это же число пишут цифрами 0, 1, 2, 3, 4",
              ],
              ["сколько цифр 4", "ответ — количество четвёрок в этой записи"],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем — у каждой своя страница. Идём по ним
            по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Запись числа и её значение</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="stepeni-blokami">
                Запись суммы и разности степеней
              </SubtopicLink>{" "}
              — как выглядят степени основания, и ответ задачи вручную: 21.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="cifry-programmoj">
                Цифры значения выражения программой
              </SubtopicLink>{" "}
              — тот же ответ программой; так решают любую задачу на подсчёт
              цифр.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="parametr-x">
                Выражение с параметром x
              </SubtopicLink>{" "}
              — вместо 10 вычитают неизвестное x.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="neizvestnaya-cifra">
                Неизвестные цифры
              </SubtopicLink>{" "}
              — неизвестная цифра x стоит в самой записи.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="neizvestnoe-osnovanie">
                Неизвестное основание и признаки делимости
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
          <Typography.Text>
            Почти везде задачу можно решить и вручную, и программой — выбирай
            вкладку «Вручную» или «Python». На экзамене подойдёт любой способ, а
            второй пригодится для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "znachenie-zapisi",
      navLabel: "Значение записи",
      explanation: (
        <>
          <Typography.Text>
            Какое число скрывается за записью 2304₅? Маленькое число снизу —
            основание системы, здесь 5.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждую цифру умножают на вес её места и всё складывают. Веса
              справа налево: 1, q, q², q³, …
            </strong>{" "}
            В десятичной системе так же: 507 = 5 · 100 + 0 · 10 + 7 · 1.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.placeValue2304_5}
            caption={
              <>
                У 2304₅ веса мест — 125, 25, 5 и 1. Ноль значит, что пятёрок
                нет, но место он всё равно занимает.
              </>
            }
          />
          <Typography.Text>
            В Python то же самое делает{" "}
            <PythonTerm term="base">
              <Notation>{"int(запись, основание)"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={"print(int('2304', 5))"}
            label={"Значение записи 2304₅"}
            language="python"
            output={"329"}
          />
          <Typography.Text>
            Цифр в системе ровно q: от 0 до q − 1. Цифры «5» в пятеричной
            системе нет — после 4 идёт уже 10₅, то есть одна пятёрка и ноль
            единиц. Поэтому запись 10 в любой системе означает её основание: 10₅
            = 5, 10₂ = 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifry-bukvy",
      navLabel: "Цифры-буквы",
      explanation: (
        <>
          <Typography.Text>
            А как записать цифру «десять», если основание больше десяти?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Цифры больше 9 обозначают латинскими буквами: A = 10, B = 11, C =
              12, … Каждая буква — это одна цифра.
            </strong>{" "}
            В шестнадцатеричной записи 1A3₁₆ три цифры: 1, десять и 3.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.placeValue1A3_16}
            caption={
              <>
                1A3₁₆: буква A стоит в разряде шестнадцати и значит десять — 1 ·
                256 + 10 · 16 + 3 = 419.
              </>
            }
          />
          <Typography.Text>
            По записи можно оценить основание: оно больше самой большой цифры. В
            записи 372 есть цифра 7 — значит, основание не меньше 8; в 2B4 есть
            B = 11 — не меньше 12.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: основания больше 36"
          >
            <Typography.Text>
              Букв латинского алфавита 26, поэтому буквами записывают цифры
              только до основания 36: <Notation>{"int(s, q)"}</Notation>{" "}
              работает при q ≤ 36. При большем основании цифры хранят числами —
              так делают в подтеме 5.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "posledovatelnoe-delenie",
      navLabel: "Запись делением",
      explanation: (
        <>
          <Typography.Text>
            Теперь наоборот: как записать число 329 в пятеричной системе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Остаток от деления на q — последняя цифра записи, а целая часть
              частного — запись без этой цифры.
            </strong>{" "}
            329 = 5 · 65 + 4: запись оканчивается на 4, а остальные её цифры —
            запись числа 65. Делим дальше, пока частное не станет нулём: каждое
            деление даёт ещё одну цифру, справа налево.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.convertStepper329_5}
            label={"Перевод 329 в пятеричную систему по шагам"}
          />
          <Typography.Text>
            Остатки 4, 0, 3, 2, прочитанные снизу вверх, — запись 2304₅. В
            Python остаток и целую часть частного дают{" "}
            <PythonTerm term="intdiv">
              <Notation>{"%"}</Notation> и <Notation>{"//"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={"print(329 % 5, 329 // 5)"}
            label={"Последняя цифра и запись без неё"}
            language="python"
            output={"4 65"}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему остаток — последняя цифра"
          >
            <Typography.Text>
              2304₅ = 2 · 5³ + 3 · 5² + 0 · 5 + 4. Все слагаемые, кроме
              последнего, делятся на 5: 2304₅ = 5 · (2 · 25 + 3 · 5 + 0) + 4.
              Значит, при делении на 5 остаток — последняя цифра 4, а частное 2
              · 25 + 3 · 5 + 0 = 230₅ — запись без неё.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "zapis-itogo-14",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Значение записи",
                note: <>сумма цифр, умноженных на веса 1, q, q², …</>,
              },
              {
                key: "Цифры",
                note: <>от 0 до q − 1; 10 в системе q — это q</>,
              },
              {
                key: "Буквы",
                note: <>A = 10, B = 11, …; буква — одна цифра</>,
              },
              {
                key: "Основание",
                note: <>больше наибольшей цифры записи</>,
              },
              {
                key: "Запись делением",
                note: <>остатки — цифры справа налево</>,
              },
              {
                key: "Python",
                note: (
                  <>
                    <Notation>{"int(s, q)"}</Notation>,{" "}
                    <Notation>{"n % q"}</Notation>,{" "}
                    <Notation>{"n // q"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "stepen-osnovaniya",
      navLabel: "Степень основания",
      explanation: (
        <>
          <Typography.Text>
            Как выглядит 5²³ в пятеричной записи — первое слагаемое задачи темы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Степень основания qᵏ записывается единицей и k нулями.
            </strong>{" "}
            Как 10³ = 1000 в десятичной системе: 5¹ = 10₅, 5² = 100₅, а 5²³ —
            единица и 23 нуля.
          </Typography.Text>
          <Typography.Text>
            Второе слагаемое — степень 25, а не 5. Но 25 = 5², поэтому 25¹² =
            (5²)¹² = 5²⁴: двенадцать множителей 5² — это 24 множителя 5. В
            записи — единица и 24 нуля.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: основания 2, 4, 8 и 16"
          >
            <Typography.Text>
              Так же 4⁵⁰ = 2¹⁰⁰ и 8¹⁵ = 2⁴⁵. Если основания степеней — степени
              одного числа, сначала приведи их к основанию системы.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "minus-edinica",
      navLabel: "Степень минус единица",
      explanation: (
        <>
          <Typography.Text>
            А что получится, если из степени вычесть 1? Например, 5⁴ − 1.
          </Typography.Text>
          <Typography.Text>
            <strong>
              qᵏ − 1 записывается k одинаковыми цифрами q − 1 — наибольшими
              цифрами системы.
            </strong>{" "}
            Как 10⁴ − 1 = 9999: 5⁴ − 1 = 4444₅. Посмотри по шагам, откуда
            берутся четвёрки:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.baseBorrow5_4}
            label={"5⁴ − 1 по шагам"}
          />
          <Typography.Text>
            Так в любой системе: 2⁵ − 1 = 11111₂, 3⁴ − 1 = 2222₃, 16³ − 1 =
            FFF₁₆.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "raznost-stepenej",
      navLabel: "Разность степеней",
      explanation: (
        <>
          <Typography.Text>
            В задаче темы вычитают не 1, а 10. Удобнее сначала вычесть круглое
            для пятеричной системы число — 25 = 5². Как выглядит 5²³ − 5²?
          </Typography.Text>
          <Typography.Text>
            <strong>qᵐ − qⁿ — это m − n цифр q − 1, а за ними n нулей.</strong>{" "}
            Вынесем 5²: 5²³ − 5² = 5² · (5²¹ − 1). Скобка — двадцать одна
            четвёрка, а умножение на 5² дописывает справа два нуля, как
            умножение на 100 в десятичной системе.
          </Typography.Text>
          <Typography.Text>
            Так 5⁷ − 5³ = 4444000₅: четыре четвёрки и три нуля. Если m = n,
            разность равна нулю, и блока нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otvet-zadachi-14",
      navLabel: "Ответ задачи темы",
      explanation: (
        <>
          <Typography.Text>
            Теперь соберём запись 5²³ + 25¹² − 10.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разложим выражение на части, которые не налезают друг на друга:
              тогда цифры записи можно сосчитать по частям.
            </strong>{" "}
            10 вычтем из 25: 5²³ − 10 = (5²³ − 5²) + (5² − 10). Получаются три
            части:
          </Typography.Text>
          <ul>
            <li>25¹² = 5²⁴ — единица в разряде 24;</li>
            <li>в разряде 23 ни один блок не стоит — там ноль;</li>
            <li>5²³ − 5² — 21 четвёрка в разрядах 22…2 и два нуля;</li>
            <li>5² − 10 = 15 = 30₅ — цифры 3 и 0 в двух младших разрядах.</li>
          </ul>
          <LessonDiagram
            {...lessonMedia.baseBlocks5_127518}
            caption={
              <>
                Три блока занимают разные разряды, переносов нет. Длинный ряд
                четвёрок свёрнут: разряды 20…4 скрыты за «…». Четвёрок 21 —
                ответ задачи темы.
              </>
            }
          />
          <Typography.Text>
            Проверка длины: в записи 1 + 1 + 21 + 2 = 25 цифр, а у числа между
            5²⁴ и 5²⁵ ровно 25 цифр. Программой этот же ответ получим в подтеме
            3.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: вычитаемое больше 25"
          >
            <Typography.Text>
              Займи степень, которая не меньше вычитаемого. Например, 5¹⁰ − 18 =
              (5¹⁰ − 5²) + (25 − 18): восемь четвёрок, затем 7 = 12₅ в двух
              младших разрядах.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "slozhenie",
      navLabel: "Когда блоки пересекаются",
      explanation: (
        <>
          <Typography.Text>
            А если части попадают в одни и те же разряды — например, 2¹⁵ + 2¹⁵?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда складывают столбиком: в разряде пишут остаток суммы от
              деления на q, а целую часть переносят в следующий разряд.
            </strong>{" "}
            2¹⁵ + 2¹⁵ = 2 · 2¹⁵ = 2¹⁶: две единицы в одном разряде дают одну
            единицу в следующем. Слагаемых два, а единица в записи одна.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.baseCarry243_134_5}
            label={"243₅ + 134₅ столбиком"}
          />
          <Typography.Text>
            243₅ + 134₅ = 432₅: проверка в десятичной системе — 73 + 44 = 117.
            Так же раскладывают коэффициент, который больше цифр системы: 7 · 5²
            = (5 + 2) · 5² = 1200₅.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "stepeni-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "qᵏ", note: <>единица и k нулей</> },
              { key: "qᵏ − 1", note: <>k цифр q − 1</> },
              { key: "qᵐ − qⁿ", note: <>m − n цифр q − 1 и n нулей</> },
              {
                key: "Блоки",
                note: <>разные разряды — цифры считают по блокам</>,
              },
              {
                key: "Пересечение",
                note: <>сложение столбиком с переносом</>,
              },
              { key: "Задача темы", note: <>21 четвёрка</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "odin-sposob",
      navLabel: "Цифра за цифрой",
      explanation: (
        <>
          <Typography.Text>
            Как посчитать четвёрки программой, не раскладывая выражение на
            блоки?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Программа повторяет одно действие: берёт последнюю цифру как{" "}
              <Notation>{"n % q"}</Notation> и отбрасывает её —{" "}
              <Notation>{"n // q"}</Notation>, пока число не станет нулём.
            </strong>{" "}
            Это перевод делением из подтемы 1, только цифры не записывают, а
            сразу проверяют.
          </Typography.Text>
          <Typography.Text>
            Посчитаем нули в записи 329 = 2304₅. Нажми «Запуск» и пройди по
            шагам: <Notation>{"n"}</Notation> теряет цифру за цифрой, а{" "}
            <Notation>{"count"}</Notation> растёт только на нуле.
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runCountDigit}
            label={"Нули в записи 2304₅ по шагам"}
          />
          <Typography.Text>
            Цикл{" "}
            <PythonTerm term="while">
              <Notation>{"while n > 0"}</Notation>
            </PythonTerm>{" "}
            проходит каждую цифру ровно один раз — справа налево, но для
            подсчёта порядок не важен.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otvet-programmoj",
      navLabel: "Задача темы программой",
      explanation: (
        <>
          <Typography.Text>Теперь возьмём число задачи темы.</Typography.Text>
          <Typography.Text>
            <strong>
              Python считает целые числа точно любой длины, поэтому выражение
              пишут как есть: степень —{" "}
              <PythonTerm term="intdiv">
                <Notation>{"**"}</Notation>
              </PythonTerm>
              , деление — только <Notation>{"//"}</Notation>.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "n = 5**23 + 25**12 - 10\ncount = 0\nwhile n > 0:\n    if n % 5 == 4:\n        count = count + 1\n    n = n // 5\nprint(count)"
            }
            label={"Четвёрки в записи 5²³ + 25¹² − 10"}
            language="python"
            output={"21"}
          />
          <Typography.Text>
            21 — как и блоками в подтеме 2. Поменяй основание, цифру и выражение
            — получится решение любой задачи на подсчёт цифр.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: ^ и деление через /"
          >
            <Typography.Text>
              Знак <Notation>{"^"}</Notation> в Python — другая операция, не
              степень. А обычное деление <Notation>{"/"}</Notation> даёт{" "}
              <PythonTerm term="floaterr">
                дробное число с ограниченной точностью
              </PythonTerm>
              : для числа из 17 цифр <Notation>{"int(n / 3)"}</Notation> уже
              ошибается (
              <ExternalLink href="https://docs.python.org/3/library/stdtypes.html">
                документация Python
              </ExternalLink>
              ):
            </Typography.Text>
            <CodeBlock
              code={"n = 5**23 + 25**12 - 10\nprint(n // 3, int(n / 3))"}
              label={"Целое деление и деление через /"}
              language="python"
              output={"23841857910156246 23841857910156248"}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "spisok-cifr",
      navLabel: "Список цифр",
      explanation: (
        <>
          <Typography.Text>
            А если спрашивают не одну цифру, а сумму цифр, их количество или
            самую частую цифру?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Удобно один раз собрать все цифры в список — дальше любой вопрос о
              записи решает одна функция Python.
            </strong>{" "}
            Оформим перевод <PythonTerm term="def">функцией</PythonTerm>{" "}
            <Notation>{"digits(n, q)"}</Notation>: она возвращает{" "}
            <PythonTerm term="list">список</PythonTerm> значений цифр слева
            направо. Пройди её по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runDigits}
            label={"Функция digits по шагам"}
          />
          <Typography.Text>
            Остатки собираются справа налево, поэтому в конце{" "}
            <Notation>{"result.reverse()"}</Notation> переворачивает список.
            Выбери вопрос о записи 2304₅ — список{" "}
            <Notation>{"[2, 3, 0, 4]"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Вопрос о записи 2304₅ и код"}
            variants={[
              {
                label: "Сколько нулей",
                value: (
                  <>
                    <Notation>{"ds.count(0)"}</Notation> → 1
                  </>
                ),
              },
              {
                label: "Сколько цифр всего",
                value: (
                  <>
                    <Notation>{"len(ds)"}</Notation> → 4
                  </>
                ),
              },
              {
                label: "Сумма цифр",
                value: (
                  <>
                    <Notation>{"sum(ds)"}</Notation> → 9
                  </>
                ),
              },
              {
                label: "Наибольшая цифра",
                value: (
                  <>
                    <Notation>{"max(ds)"}</Notation> → 4
                  </>
                ),
              },
              {
                label: "Сколько различных цифр",
                value: (
                  <>
                    <Notation>{"len(set(ds))"}</Notation> → 4
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            <PythonTerm term="listcount">
              <Notation>{"count"}</Notation>
            </PythonTerm>{" "}
            считает, сколько раз встречается значение,{" "}
            <PythonTerm term="len">
              <Notation>{"len"}</Notation>
            </PythonTerm>{" "}
            — длину списка,{" "}
            <PythonTerm term="agg">
              <Notation>{"sum"}</Notation> и <Notation>{"max"}</Notation>
            </PythonTerm>{" "}
            — сумму и наибольшее,{" "}
            <PythonTerm term="set">
              <Notation>{"set"}</Notation>
            </PythonTerm>{" "}
            оставляет только различные значения. Для задачи темы:
          </Typography.Text>
          <CodeBlock
            code={
              "ds = digits(5**23 + 25**12 - 10, 5)\nprint(ds.count(4), ds.count(0), len(ds), sum(ds))"
            }
            label={"Вопросы о записи задачи темы"}
            language="python"
            output={"21 2 25 88"}
          />
          <Typography.Text>
            21 четвёрка, 2 нуля, 25 цифр — как в блоках подтемы 2; сумма цифр 1
            + 21 · 4 + 3 = 88.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifry-so-svojstvom",
      navLabel: "Цифры со свойством",
      explanation: (
        <>
          <Typography.Text>
            Запишем то же число в системе с основанием 36. Сколько в записи цифр
            больше 9?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Цифры со свойством считают циклом по списку: каждую цифру
              проверяют условием.
            </strong>{" "}
            <PythonTerm term="for">
              <Notation>{"for d in ds:"}</Notation>
            </PythonTerm>{" "}
            по очереди берёт каждую цифру. В списке цифра 34 — одно число, букв
            для неё придумывать не нужно.
          </Typography.Text>
          <CodeBlock
            code={
              "ds = digits(5**23 + 25**12 - 10, 36)\nprint(ds)\ncount = 0\nfor d in ds:\n    if d > 9:\n        count = count + 1\nprint(count)"
            }
            label={"Цифры больше 9 в 36-ричной записи"}
            language="python"
            output={"[19, 20, 9, 25, 6, 34, 15, 19, 7, 16, 20]\n8"}
          />
          <Typography.Text>
            В задачах спрашивают о разном, но всё решается тем же циклом —
            меняется только условие:
          </Typography.Text>
          <VariantPicker
            label={"Вопрос о цифрах и условие в цикле"}
            variants={[
              {
                label: "Сколько цифр больше 9",
                value: <Notation>{"if d > 9: count = count + 1"}</Notation>,
              },
              {
                label: "Сколько чётных цифр",
                value: (
                  <Notation>{"if d % 2 == 0: count = count + 1"}</Notation>
                ),
                note: <>ноль тоже чётный</>,
              },
              {
                label: "Сумма цифр не больше 17",
                value: <Notation>{"if d <= 17: total = total + d"}</Notation>,
              },
              {
                label: "Самая частая цифра",
                value: <Notation>{"max(range(q), key=ds.count)"}</Notation>,
                note: (
                  <>
                    <PythonTerm term="sortkey">
                      <Notation>{"key="}</Notation>
                    </PythonTerm>{" "}
                    сравнивает цифры по их количеству
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: bin, oct и hex">
            <Typography.Text>
              Для оснований 2, 8 и 16 есть готовые{" "}
              <PythonTerm term="base">
                <Notation>{"bin"}</Notation>, <Notation>{"oct"}</Notation>,{" "}
                <Notation>{"hex"}</Notation>
              </PythonTerm>
              , но их строка начинается служебным префиксом:{" "}
              <Notation>{"bin(8)"}</Notation> — это{" "}
              <Notation>{"'0b1000'"}</Notation>. При подсчёте нулей префикс
              отрезают: <Notation>{"bin(n)[2:].count('0')"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "programma-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Цикл",
                note: (
                  <>
                    <Notation>{"n % q"}</Notation> — цифра,{" "}
                    <Notation>{"n // q"}</Notation> — остальное
                  </>
                ),
              },
              { key: "Большие числа", note: <>точны; степень — **, без /</> },
              {
                key: "digits(n, q)",
                note: <>список цифр для любого основания</>,
              },
              {
                key: "Вопросы",
                note: (
                  <>
                    <Notation>{"count"}</Notation>, <Notation>{"len"}</Notation>
                    , <Notation>{"sum"}</Notation>, <Notation>{"set"}</Notation>
                  </>
                ),
              },
              { key: "Свойство", note: <>цикл по списку с условием</> },
              { key: "Задача темы", note: <>21 — как блоками</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "perebor-x",
      navLabel: "x — число, а не цифра",
      explanation: (
        <>
          <Typography.Text>
            Изменим задачу темы: вместо 10 вычитают неизвестное x. «Значение 5²³
            + 25¹² − x, где x — натуральное число, не больше 2030, записали в
            пятеричной системе. Найди наибольшее x, при котором в записи ровно
            22 цифры 4.»
          </Typography.Text>
          <Typography.Text>
            <strong>
              Здесь x — обычное число в выражении, а не цифра записи. Поэтому
              проверяют все x от 1 до 2030 и для каждого заново считают
              четвёрки.
            </strong>{" "}
            Подсчёт оформим функцией <Notation>{"count4"}</Notation> — это тот
            же цикл из подтемы 3:
          </Typography.Text>
          <CodeBlock
            code={
              "def count4(n):\n    count = 0\n    while n > 0:\n        if n % 5 == 4:\n            count = count + 1\n        n = n // 5\n    return count\n\n\nanswer = None\nfor x in range(1, 2031):\n    if count4(5**23 + 25**12 - x) == 22:\n        answer = x\nprint(answer)"
            }
            label={"Наибольшее x: ровно 22 четвёрки"}
            language="python"
            output={"1876"}
          />
          <Typography.Text>
            Перебор идёт по возрастанию, поэтому последнее запомненное x и есть
            наибольшее.{" "}
            <PythonTerm term="none">
              <Notation>{"None"}</Notation>
            </PythonTerm>{" "}
            в начале значит «пока ничего не нашли».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pochemu-otvet",
      navLabel: "Почему ответ 1876",
      explanation: (
        <>
          <Typography.Text>
            Откуда взялось 1876? Это можно понять и без программы.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Четвёрка в записи остаётся там, где у числа x − 1 стоит ноль.
            </strong>{" "}
            Вычесть x — всё равно что вычесть сначала 1, а потом x − 1: 5²³ +
            25¹² − x = 5²⁴ + (5²³ − 1) − (x − 1). А 5²³ − 1 — это 23 четвёрки
            (подтема 2). Из четвёрки можно вычесть любую пятеричную цифру без
            займа, поэтому x − 1 вычитается из них поразрядно.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.baseMinus5_23_1876}
            caption={
              <>
                x = 1876: x − 1 = 1875 = 30000₅. Ненулевая цифра у x − 1 одна —
                значит, из 23 четвёрок остаются 22.
              </>
            }
          />
          <Typography.Text>
            Значит, 22 четвёрки получаются, когда у x − 1 ровно одна ненулевая
            цифра, то есть x − 1 = d · 5ᵏ. Самое большое такое число до 2029 — 3
            · 625 = 1875. Отсюда x = 1876, как и у программы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ne-plavno",
      navLabel: "Количество меняется скачками",
      explanation: (
        <>
          <Typography.Text>
            Можно ли остановить перебор, когда четвёрок стало меньше 22?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: количество цифр меняется скачками и при следующих x может
              снова вырасти.
            </strong>{" "}
            Посмотри на первые 125 значений x:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.baseCountPlot5_23_4_125_22_5642ab}
            caption={
              <>
                Четвёрок 22 при x = 2, 3, 4, 5, 6, 11, 16, 21, 26, 51, 76 и 101
                — у всех этих x − 1 одна ненулевая цифра. Между ними — 21 и 20.
              </>
            }
          />
          <Typography.Text>
            Поэтому проверяют все x из условия, а не только до первой неудачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naibolshee-i-naimenshee",
      navLabel: "Наибольшее и наименьшее x",
      explanation: (
        <>
          <Typography.Text>
            А если спрашивают наименьшее x — или верхней границы у x нет вовсе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Наименьшее x — первое подходящее при переборе по возрастанию,
              наибольшее — последнее.
            </strong>{" "}
            Выбери вопрос:
          </Typography.Text>
          <VariantPicker
            label={"Вопрос и как перебирать"}
            variants={[
              {
                label: "Наибольшее x до 2030",
                value: <>запомнить последнее подходящее</>,
                note: (
                  <>
                    или <Notation>{"range(2030, 0, -1)"}</Notation> и{" "}
                    <PythonTerm term="break">
                      <Notation>{"break"}</Notation>
                    </PythonTerm>{" "}
                    на первом
                  </>
                ),
              },
              {
                label: "Наименьшее x до 2030",
                value: (
                  <>
                    <Notation>{"break"}</Notation> на первом подходящем
                  </>
                ),
              },
              {
                label: "Наименьшее x, границы нет",
                value: (
                  <>
                    <Notation>{"while"}</Notation> до первого подходящего
                  </>
                ),
              },
              {
                label: "Наибольшее количество цифр",
                value: <>запоминать лучшее количество и его x</>,
              },
            ]}
          />
          <Typography.Text>
            Например, наименьшее x, при котором четвёрок ровно 20, ищут циклом{" "}
            <Notation>{"while"}</Notation> — он остановится на первом
            подходящем:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 1\nwhile count4(5**23 + 25**12 - x) != 20:\n    x = x + 1\nprint(x)"
            }
            label={"Наименьшее x: ровно 20 четвёрок"}
            language="python"
            output={"32"}
          />
          <Typography.Text>
            Проверка: x − 1 = 31 = 111₅ — три ненулевые цифры, 23 − 3 = 20
            четвёрок.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: когда перебор идёт слишком долго"
          >
            <Typography.Text>
              Программа проверяет порядка миллиона x в секунду. Если цикл не
              закончился за несколько секунд, ответ лежит очень далеко, и начало
              перебора находят рассуждением о блоках записи — это разобрано в
              дополнительном уроке.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "parametr-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "x в выражении", note: <>число, перебор по диапазону</> },
              { key: "Наибольшее", note: <>последнее подходящее</> },
              { key: "Наименьшее", note: <>первое и break или while</> },
              { key: "Скачки", note: <>перебирают все x, без границы</> },
              {
                key: "Проверка",
                note: <>q − 1 остаётся там, где у x − 1 ноль</>,
              },
              { key: "Пример", note: <>22 четвёрки — x = 1876</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "chto-oboznachaet",
      navLabel: "Что значит x в записи",
      explanation: (
        <>
          <Typography.Text>
            Третий вид задания: «Операнды выражения записаны в системе с
            основанием 18: 77968x11₁₈ + 4x213₁₈. x — неизвестная цифра из
            алфавита 18-ричной системы. Найди наибольшее x, при котором значение
            выражения кратно 7, и запиши в ответ частное от деления значения на
            7.»
          </Typography.Text>
          <Typography.Text>
            <strong>
              Здесь x — одна цифра записи: она одинакова во всех местах, где
              стоит, и принимает значения от 0 до q − 1.
            </strong>{" "}
            4x213₁₈ при x = 5 — это 45213₁₈, а не 4 · 5 · 213. Для основания 18
            цифра x — от 0 до 17.
          </Typography.Text>
          <Typography.Text>
            Но границы x зависят от формулировки условия — выбери вариант:
          </Typography.Text>
          <VariantPicker
            label={"Условие и допустимые значения x"}
            variants={[
              { label: "x — цифра 18-ричной системы", value: <>0, …, 17</> },
              {
                label: "x — цифра из алфавита десятичной системы",
                value: <>0, …, 9</>,
                note: <>даже если числа записаны в основании 18</>,
              },
              {
                label: "x стоит в записях с основаниями 8 и 13",
                value: <>0, …, 7</>,
                note: <>цифра должна быть допустима в обеих</>,
              },
              {
                label: "x — первая цифра числа",
                value: <>ноль исключается</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "perebor-cifry",
      navLabel: "Перебор цифры",
      explanation: (
        <>
          <Typography.Text>
            Как найти x? Значений у x всего 18 — проще всего проверить каждое.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Для каждой цифры собирают обе записи, считают их сумму и
              проверяют, делится ли она на 7.
            </strong>{" "}
            Собрать запись можно строкой или списком цифр:
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Строкой",
                content: (
                  <>
                    <Typography.Text>
                      Перебирают символы алфавита: цифры 0–9 и буквы a–h для
                      значений 10–17. Строки склеивают знаком{" "}
                      <Notation>{"+"}</Notation> и читают{" "}
                      <Notation>{"int(s, 18)"}</Notation>:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "for x in '0123456789abcdefgh':\n    a = int('77968' + x + '11', 18)\n    b = int('4' + x + '213', 18)\n    if (a + b) % 7 == 0:\n        print(x, (a + b) // 7)"
                      }
                      label={"Перебор символов алфавита"}
                      language="python"
                      output={"3 648821068\na 648827224\nh 648833380"}
                    />
                  </>
                ),
              },
              {
                label: "Списком цифр",
                content: (
                  <>
                    <Typography.Text>
                      Функция <Notation>{"value"}</Notation> читает запись слева
                      направо: дописать справа цифру d — значит заменить
                      значение v на v · q + d. Пройди по шагам:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runValue}
                      label={"Функция value по шагам"}
                    />
                    <Typography.Text>
                      Цифры — числа, на месте x стоит сама переменная цикла.
                      Перебор сверху вниз сразу даёт наибольшее x:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "for x in range(17, -1, -1):\n    a = value([7, 7, 9, 6, 8, x, 1, 1], 18)\n    b = value([4, x, 2, 1, 3], 18)\n    if (a + b) % 7 == 0:\n        print(x, (a + b) // 7)\n        break"
                      }
                      label={"Перебор значений цифры сверху вниз"}
                      language="python"
                      output={"17 648833380"}
                    />
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Подходят цифры 3, a = 10 и h = 17; наибольшая — h. Ответ: частное
            648833380.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: строки и основания больше 36"
          >
            <Typography.Text>
              В строку подставляют символ цифры, а не{" "}
              <Notation>{"str"}</Notation> её значения: при x = 10 запись{" "}
              <Notation>{"'1' + str(x) + '2'"}</Notation> даст четыре цифры 1102
              вместо трёх. При основании больше 36 букв не хватает — тогда
              только список цифр и <Notation>{"value"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "v-otvet",
      navLabel: "Что записать в ответ",
      explanation: (
        <>
          <Typography.Text>Нашли x = 17. Это ответ?</Typography.Text>
          <Typography.Text>
            <strong>
              В ответ записывают ровно ту величину, о которой спрашивают: цифру,
              значение выражения или частное.
            </strong>{" "}
            В нашей задаче это частное от деления на 7. Посмотри, что пришлось
            бы записать при других вопросах:
          </Typography.Text>
          <VariantPicker
            label={"Что спросили и что записать"}
            variants={[
              {
                label: "частное от деления на 7",
                value: <>648833380</>,
              },
              {
                label: "значение выражения",
                value: <>4541833660</>,
                note: <>в десятичной системе</>,
              },
              {
                label: "цифру x",
                value: <>17</>,
                note: <>её значение, а не символ h</>,
              },
            ]}
          />
          <Typography.Text>
            Если в условии сказано «ненулевая цифра», перебор начинают с 1. А
            если в выражении есть вычитание, так и пиши в программе:{" "}
            <Notation>{"a + b - c"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "raznye-osnovaniya",
      navLabel: "Разные основания",
      explanation: (
        <>
          <Typography.Text>
            А если записи с x в разных системах — например, 3x2₈ + 2x5₁₃, и
            сумма должна делиться на 17?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Значение цифры x одно, а вес разряда в каждой записи свой; x
              должен быть допустим во всех записях.
            </strong>{" "}
            Цифра есть в восьмеричной записи, значит, x — от 0 до 7. В 3x2₈ она
            умножается на 8, в 2x5₁₃ — на 13. Значения удобно считать функцией{" "}
            <Notation>{"value"}</Notation> из вкладки «Списком цифр»:
          </Typography.Text>
          <CodeBlock
            code={
              "for x in range(8):\n    a = value([3, x, 2], 8)\n    b = value([2, x, 5], 13)\n    if (a + b) % 17 == 0:\n        print(x, (a + b) // 17)\n        break"
            }
            label={"Цифра в основаниях 8 и 13"}
            language="python"
            output={"6 39"}
          />
          <Typography.Text>
            x = 6: 362₈ + 265₁₃ = 242 + 421 = 663 = 17 · 39.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dve-cifry",
      navLabel: "Две неизвестные цифры",
      explanation: (
        <>
          <Typography.Text>
            Бывает и две неизвестные цифры. Например: найди наименьшее значение
            1xy₅ + 2yx₇, кратное 5, и запиши частное от деления на 5.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пары перебирают двумя вложенными циклами и сравнивают все
              подходящие: первая найденная пара почти никогда не даёт наименьшее
              значение.
            </strong>{" "}
            Обе цифры есть в пятеричной записи, поэтому x и y — от 0 до 4: всего
            25 пар.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.basePairGrid1xy_5_2yx_7_5}
            caption={
              <>
                Все 25 пар: сумма 123 + 6x + 8y. Первой подходящей в переборе
                будет x = 0, y = 4 — сумма 155, а наименьшая — 135 при x = 2, y
                = 0.
              </>
            }
          />
          <CodeBlock
            code={
              "best = None\nfor x in range(5):\n    for y in range(5):\n        total = value([1, x, y], 5) + value([2, y, x], 7)\n        if total % 5 == 0:\n            if best is None or total < best:\n                best = total\nprint(best, best // 5)"
            }
            label={"Наименьшая подходящая сумма"}
            language="python"
            output={"135 27"}
          />
          <Typography.Text>
            В <Notation>{"best"}</Notation> лежит наименьшая подходящая сумма.
            Условие{" "}
            <PythonTerm term="andor">
              <Notation>{"best is None or total < best"}</Notation>
            </PythonTerm>{" "}
            верно для первой подходящей суммы и для каждой меньшей. Ответ: 135 /
            5 = 27.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: разные буквы и вопросы о паре"
          >
            <Typography.Text>
              Разные буквы могут обозначать одинаковые цифры, если условие не
              запрещает. Диапазоны букв считают отдельно: в 1x2₈ + 2yA₁₆ x — до
              7, а y — до 15. Если спрашивают о самой паре («запись yx —
              наибольшая»), сравнивают уже эту величину.{" "}
              <PythonTerm term="break">
                <Notation>{"break"}</Notation>
              </PythonTerm>{" "}
              во внутреннем цикле останавливает только его.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "cifra-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "x в записи", note: <>одна цифра, одинаковая везде</> },
              { key: "Диапазон", note: <>от 0 до наименьшего основания − 1</> },
              {
                key: "Перебор",
                note: (
                  <>
                    <Notation>{"int(s, q)"}</Notation> или{" "}
                    <Notation>{"value(ds, q)"}</Notation>
                  </>
                ),
              },
              { key: "Ответ", note: <>что спросили: частное, x, значение</> },
              {
                key: "Две цифры",
                note: <>вложенные циклы и сравнение всех пар</>,
              },
              { key: "Пример", note: <>x = 17, частное 648833380</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "dopolnitelnyy-urok-osnovanie",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            Дополнительный урок — для продвинутых: на экзаменах такие задачи не
            встречались, основные подтемы решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Неизвестное основание находят той же позиционной формулой, а
              слишком длинный перебор заменяют рассуждением о записи.
            </strong>{" "}
            Всё нужное уже есть: разложение по степеням и функция{" "}
            <Notation>{"value"}</Notation> из подтемы 5, функция{" "}
            <Notation>{"digits"}</Notation> из подтемы 3, блоки записи из
            подтемы 2. Начнём с вопроса: в какой системе запись 132 означает
            число 56?
          </Typography.Text>
        </>
      ),
    },
    {
      id: "osnovanie-po-formule",
      navLabel: "Основание по формуле",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Неизвестное основание определяется через ту же позиционную
              формулу.
            </strong>{" "}
            Пусть 132 в системе с основанием q равно 56₁₀. Цифра{" "}
            <Notation>{"3"}</Notation> требует q ≥ 4. Раскрываем запись: q² + 3q
            + 2 = 56. Можно решить уравнение, а можно проверить небольшой
            диапазон оснований.
          </Typography.Text>
          <Typography.Text>
            Откуда взять верхнюю границу? Первое слагаемое равно q², остальные
            неотрицательны. Поэтому q² ≤ 56. При q = 8 уже q² = 64 {">"} 56.
            Значит, 4 ≤ q ≤ 7:
          </Typography.Text>
          <CodeBlock
            code={"for q in range(4, 8):\n    print(q, value([1, 3, 2], q))"}
            label={"Значит, 4 ≤ q ≤ 7"}
            language="python"
            output={"4 30\n5 42\n6 56\n7 72"}
          />
          <Typography.Text>
            Получили q = 6.{" "}
            <strong>Диапазон перебора основания нужно обосновывать.</strong>{" "}
            Граница вроде <Notation>{"1000"}</Notation> сама по себе не
            доказывает, что большие основания невозможны.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "osnovanie-i-cifra",
      navLabel: "Основание и цифра",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Неизвестное основание и неизвестная цифра ищутся вместе —
              вложенным перебором с теми же границами.
            </strong>{" "}
            Пусть запись 2x1 в системе с основанием q равна 91. Раскрываем: 2q²
            + xq + 1 = 91. Ограничения: q ≥ 3 из-за цифры{" "}
            <Notation>{"2"}</Notation>, а также 0 ≤ x {"<"} q. Кроме того, 2q² ≤
            91; при q = 7 уже 2q² = 98 {">"} 91. Значит, достаточно оснований от
            3 до 6:
          </Typography.Text>
          <CodeBlock
            code={
              "for q in range(3, 7):\n    for x in range(q):\n        if value([2, x, 1], q) == 91:\n            print(q, x)"
            }
            label={"Значит, достаточно оснований от 3 до 6"}
            language="python"
            output={"6 3"}
          />
          <Typography.Text>
            Проверка: 231₆ = 2 · 36 + 3 · 6 + 1 = 91.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ravenstvo-s-bukvami",
      navLabel: "Равенство с буквами",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Равенство с несколькими буквами-цифрами решают перебором основания
              и всех букв, а первая цифра каждого числа — не ноль.
            </strong>{" "}
            В подборках встречаются равенства вроде 2x + xy = 1y5, где все числа
            записаны в одной неизвестной системе с основанием q, а x и y — её
            цифры. Цифра <Notation>{"5"}</Notation> требует q ≥ 6; буква x стоит
            первой в числе xy, поэтому x ≠ 0.
          </Typography.Text>
          <CodeBlock
            code={
              "for q in range(6, 37):\n    for x in range(1, q):\n        for y in range(q):\n            left = value([2, x], q) + value([x, y], q)\n            if left == value([1, y, 5], q):\n                print(q, x, y)"
            }
            label={
              "Цифра 5 требует q ≥ 6; буква x стоит первой в числе xy, поэтому x ≠ 0"
            }
            language="python"
            output={"7 5 0"}
          />
          <Typography.Text>
            Единственное решение: q = 7, x = 5, y = 0. Проверка: 25₇ + 50₇ = 19
            + 35 = 54 = 105₇.{" "}
            <strong>Требование «первая цифра не ноль» здесь существенно</strong>
            : в задачах подборки без него решений находятся десятки, а с ним —
            одно.
          </Typography.Text>
          <Typography.Text>
            Граница 36 в программе взята с запасом, и её нужно обосновать. Здесь
            помогает сложение столбиком из подтемы 2.
          </Typography.Text>
          <ProofDisclosure summary="Почему других оснований нет: сложение столбиком">
            <Typography.Text>
              Сумма двух двузначных чисел — трёхзначное число, которое
              начинается с 1. Значит, из разряда q в разряд q² перешёл перенос
              ровно 1. В разряде единиц x + y = 5 + c · q, где c — перенос в
              разряд q (0 или 1). В разряде q: 2 + x + c = y + q.
            </Typography.Text>
            <Typography.Text>
              Если c = 0, то x + y = 5 и x − y = q − 2. Складывая, 2x = q + 3, а
              x ≤ 5 (иначе y {"<"} 0), поэтому q ≤ 7. Вместе с q ≥ 6 и чётностью
              q + 3 остаётся q = 7, x = 5, y = 0.
            </Typography.Text>
            <Typography.Text>
              Если c = 1, то x + y = 5 + q и x − y = q − 3, откуда 2x = 2q + 2 и
              x = q + 1 — такой цифры нет.
            </Typography.Text>
            <Typography.Text>
              Значит, оснований больше 7 нет вовсе, и перебор до 36 ничего не
              теряет.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "delenie-na-q-1",
      navLabel: "Делимость на q − 1",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Число делится на q − 1 тогда и только тогда, когда на q − 1
              делится сумма его цифр.
            </strong>{" "}
            Это полезный дополнительный способ ручного решения; обычный признак
            делимости на 9 — частный случай для основания 10.
          </Typography.Text>
          <Typography.Text>
            Возьмём сумму 2Ax5₁₆ + 1xB3₁₆, которая должна делиться на 15.
            Делитель 15 = 16 − 1, поэтому достаточно сложить значения всех цифр
            обоих слагаемых: 2 + 10 + x + 5 + 1 + x + 11 + 3 = 32 + 2x. Так как
            0 ≤ x ≤ 15, то 32 ≤ 32 + 2x ≤ 62, а кратные 15 в этом диапазоне — 45
            и 60.
          </Typography.Text>
          <Typography.Text>
            Уравнение 32 + 2x = 45 даёт x = 6,5, что не является цифрой. А 32 +
            2x = 60 даёт <strong>x = 14</strong> — без перебора.
          </Typography.Text>
          <ProofDisclosure summary="Почему сумма цифр даёт тот же остаток">
            <Typography.Text>
              В основании q верно q = (q − 1) + 1, поэтому при делении q на q −
              1 остаток равен 1. То же верно для любой неотрицательной степени
              q: q⁰, q¹, q², … дают остаток 1 при делении на q − 1.
              Следовательно, число aₖqᵏ + … + a₁q + a₀ имеет тот же остаток, что
              и aₖ + … + a₁ + a₀.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "delenie-na-q-plus-1",
      navLabel: "Делимость на q + 1",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для делителя q + 1 вместо обычной суммы берут сумму с
              чередующимися знаками, начиная с плюса у крайней правой цифры.
            </strong>{" "}
            Например, 314₅ = 3 · 25 + 1 · 5 + 4. Проверка делимости на 6 = 5 +
            1: 4 − 1 + 3 = 6. Поэтому число делится на 6. Действительно, 314₅ =
            84 = 6 · 14.
          </Typography.Text>
          <Typography.Text>
            Причина чередования: при делении на q + 1 основание q ведёт себя как
            −1, его квадрат — как 1, куб — снова как −1. Поэтому
            знакочередующаяся сумма имеет <strong>тот же остаток</strong> от
            деления на q + 1, что и само число, — так находят и остаток, а не
            только делимость.
          </Typography.Text>
          <Typography.Text>
            Для программного решения эти признаки необязательны: обычное
            вычисление значения и <Notation>{"%"}</Notation> работает
            универсально.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dobavka",
      navLabel: "Добавка до кратного",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наименьшую положительную добавку до кратного вычисляют без
              перебора самой добавки: A = N − (M mod N).
            </strong>{" "}
            Пусть нужно найти наименьшее положительное целое A, при котором M +
            A делится на N, где N {">"} 0. Рассмотрим остаток r = M mod N. Если
            M = Nk + r, то M + (N − r) = N(k + 1). Следовательно, до следующего
            кратного не хватает N − r.
          </Typography.Text>
          <Typography.Text>
            Например, M = 100, N = 12: остаток 100 mod 12 = 4, нужно добавить 12
            − 4 = 8. Действительно, 100 + 8 = 108 = 12 · 9.
          </Typography.Text>
          <Typography.Text>
            <strong>Если M уже делится на N, остаток равен нулю.</strong> Тогда
            минимальная неотрицательная добавка равна 0, а минимальная
            положительная — N. Формула A = N − (M mod N) даёт именно
            положительную добавку. Если в условии используется слово
            «натуральное», внимательно соотнеси его с требованием
            положительности.
          </Typography.Text>
          <Typography.Text>
            Пример с неизвестной цифрой: M = 2x0₅, N = 1x0₅, нужна минимальная
            положительная добавка среди всех допустимых x. Здесь M = 50 + 5x, N
            = 25 + 5x, 0 ≤ x ≤ 4:
          </Typography.Text>
          <CodeBlock
            code={
              "answers = []\n\nfor x in range(5):\n    m = value([2, x, 0], 5)\n    n = value([1, x, 0], 5)\n\n    a = n - m % n\n    answers.append(a)\n\nprint(answers, min(answers))"
            }
            label={"Здесь M = 50 + 5x, N = 25 + 5x, 0 ≤ x ≤ 4"}
            language="python"
            output={"[25, 5, 10, 15, 20] 5"}
          />
          <Typography.Text>
            Мы перебрали только пять цифр, а каждую добавку вычислили сразу.
            Наименьшая добавка — 5, при x = 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nachalo-perebora",
      navLabel: "Начало перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если ответ про параметр x лежит далеко, начало перебора находят по
              блокам записи.
            </strong>{" "}
            В двух задачах подборки из суммы степеней вычитают натуральное x без
            верхней границы, а ответ — около тридцати миллионов. Перебор с
            единицы идёт около минуты. Разберём такую задачу на своих числах: N
            = 3 · 6²² + 5 · 6¹² + 4 · 6⁸ + 2 · 6⁵ + 11 − x; нужно наименьшее x,
            при котором в шестеричной записи N пятёрок больше, чем нулей.
          </Typography.Text>
          <Typography.Text>
            Без x запись состоит из блоков: 3 в разряде 22, 5 в разряде 12, а
            младший блок L = 4 · 6⁸ + 2 · 6⁵ + 11 = 6734027 занимает разряды
            8…0. Между ними нули: девять в разрядах 21…13 и три в разрядах 11…9.
          </Typography.Text>
          <ol>
            <li>
              <strong>Пока x ≤ L</strong>, вычитание затрагивает только младший
              блок: N = 3 · 6²² + 5 · 6¹² + (L − x). Двенадцать нулей в разрядах
              21…13 и 11…9 остаются, а пятёрок не больше 1 + 9 = 10. Условие
              выполниться не может.
            </li>
            <li>
              <strong>При x = L + 1</strong> получаем N = 3 · 6²² + 5 · 6¹² − 1
              = 3 · 6²² + 4 · 6¹² + (6¹² − 1): двенадцать пятёрок в разрядах
              11…0, а нулей девять. Условие выполнено.
            </li>
          </ol>
          <Typography.Text>
            Значит, ответ — L + 1, и программа проверяет его сразу, без
            миллионов шагов:
          </Typography.Text>
          <CodeBlock
            code={
              "c = 3*6**22 + 5*6**12 + 4*6**8 + 2*6**5 + 11\nx = 4*6**8 + 2*6**5 + 11 + 1\nds = digits(c - x, 6)\nprint(x, ds.count(5), ds.count(0))"
            }
            label={
              "Значит, ответ — L + 1, и программа проверяет его сразу, без миллионов шагов"
            }
            language="python"
            output={"6734028 12 9"}
          />
          <Typography.Text>
            Перебор с единицы прошёл бы 6,7 миллиона значений x; рассуждение о
            блоках сразу говорит, с какого x начинать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "osnovanie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Основание",
                note: <>перебор: снизу — наибольшая цифра, сверху — оценка</>,
              },
              { key: "Буквы-цифры", note: <>первая цифра числа — не ноль</> },
              { key: "Делимость на q − 1", note: <>по сумме цифр</> },
              {
                key: "Делимость на q + 1",
                note: <>по знакочередующейся сумме</>,
              },
              { key: "Добавка", note: <>N − (M mod N)</> },
              { key: "Ответ далеко", note: <>начало перебора — по блокам</> },
            ]}
          />
        </>
      ),
    },
  ],
  finalLead:
    "Вся тема на одной странице: как решилась задача темы, главное из подтем, порядок решения и частые ошибки.",
  finalSections: [
    {
      id: "odna-zadacha",
      navLabel: "Одна задача — вся тема",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Задача темы — сколько четвёрок в пятеричной записи 5²³ + 25¹² − 10
              — прошла через подтемы, и каждая добавляла к решению новый способ.
            </strong>{" "}
            Пролистай черновик: точками отмечены строки, которых не было после
            предыдущей подтемы.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 4"}
          />
          <Typography.Text>
            Ответ 21 получен дважды — блоками и циклом, — и каждый способ
            проверяет другой. Подтема 5 ставит неизвестную цифру в саму запись,
            а дополнительный урок ищет неизвестное основание.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "karta-temy",
      navLabel: "Карта темы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждая подтема дала один приём, и любое решение собирается из них.
            </strong>{" "}
            Сверху — путь от выражения к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 14 на одной схеме"}
            flow={[
              { name: "Буква", note: "x — число в выражении или цифра?" },
              { name: "Значение", note: "степени, int(s, q) или value" },
              { name: "Цифры", note: "% q и // q — ответ" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="zapis-i-znachenie">Запись числа и её значение</Sub>
                ),
                rows: [
                  {
                    key: <>2304₅</>,
                    note: <>2 · 125 + 3 · 25 + 0 · 5 + 4 = 329</>,
                  },
                  { key: <>A, B, …</>, note: <>одна цифра: 10, 11, …</> },
                  {
                    key: <Notation>{"n % q"}</Notation>,
                    note: <>последняя цифра записи</>,
                  },
                ],
              },
              {
                number: 2,
                title: (
                  <Sub slug="stepeni-blokami">
                    Запись суммы и разности степеней
                  </Sub>
                ),
                rows: [
                  { key: <>qᵏ</>, note: <>единица и k нулей</> },
                  { key: <>qᵏ − 1</>, note: <>k цифр q − 1</> },
                  {
                    key: <>qᵐ − qⁿ</>,
                    note: <>m − n цифр q − 1 и n нулей</>,
                  },
                ],
              },
              {
                number: 3,
                title: (
                  <Sub slug="cifry-programmoj">
                    Цифры значения выражения программой
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"while n > 0"}</Notation>,
                    note: <>цифра n % q, затем n = n // q</>,
                  },
                  {
                    key: <Notation>{"**"}</Notation>,
                    note: <>степень; ^ в Python — не степень</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="parametr-x">Выражение с параметром x</Sub>,
                rows: [
                  {
                    key: <>x — число</>,
                    note: <>весь диапазон условия, цифры заново</>,
                  },
                  {
                    key: <>наибольшее x</>,
                    note: <>последнее подходящее при переборе вверх</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="neizvestnaya-cifra">Неизвестные цифры</Sub>,
                rows: [
                  {
                    key: <>x — цифра</>,
                    note: <>от 0 до q − 1</>,
                  },
                  {
                    key: <Notation>{"int(s, q)"}</Notation>,
                    note: <>значение записи с подставленной цифрой</>,
                  },
                  { key: <>две цифры</>, note: <>сравнить все пары</> },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="neizvestnoe-osnovanie">
                    Неизвестное основание и признаки делимости
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>основание</>,
                    note: <>перебор от наибольшей цифры + 1</>,
                  },
                  {
                    key: <>q − 1</>,
                    note: <>делимость по сумме цифр</>,
                  },
                ],
              },
            ]}
            caption={
              <>
                Карта темы: путь к ответу сверху и главное из каждой подтемы.
                Номер блока — номер подтемы.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "kak-reshat",
      navLabel: "Как решать",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Любое задание 14 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — цифры записи: их дают только n % q и n // q, а не
                str(n). Если ответ программы не сошёлся с блоками на маленьком
                примере, ищи ошибку в выражении.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "chastye-oshibki",
      navLabel: "Частые ошибки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Восемь ошибок встречаются чаще других, и каждую ловит один вопрос
              к себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "десятичные цифры",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"str(n).count('4')"}</Notation>}
                    right="цифры системы q — через n % q"
                    question="в какой системе я считаю цифры?"
                  />
                ),
                note: <Sub slug="zapis-i-znachenie">подтема 1</Sub>,
              },
              {
                label: "5 ^ 23",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"5 ^ 23"}</Notation>}
                    right={<Notation>{"5 ** 23"}</Notation>}
                    question="сколько цифр у получившегося числа?"
                  />
                ),
                note: <Sub slug="cifry-programmoj">подтема 3</Sub>,
              },
              {
                label: "деление через /",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"n = n / 5"}</Notation>}
                    right={<Notation>{"n = n // 5"}</Notation>}
                    question="не стало ли число дробным?"
                  />
                ),
                note: <Sub slug="cifry-programmoj">подтема 3</Sub>,
              },
              {
                label: "блоки налезают",
                value: (
                  <FinalMistake
                    wrong="сложили блоки, которые делят разряды"
                    right="разложить на части в разных разрядах"
                    question="нет ли переносов между частями?"
                  />
                ),
                note: <Sub slug="stepeni-blokami">подтема 2</Sub>,
              },
              {
                label: "x как цифра",
                value: (
                  <FinalMistake
                    wrong="параметр x перебрали от 0 до q − 1"
                    right="x в выражении — весь диапазон условия"
                    question="x — это число или цифра записи?"
                  />
                ),
                note: <Sub slug="parametr-x">подтема 4</Sub>,
              },
              {
                label: "диапазон цифры",
                value: (
                  <FinalMistake
                    wrong="цифру x перебрали до 9 при основании 18"
                    right="от 0 до q − 1"
                    question="какие цифры есть в системе q?"
                  />
                ),
                note: <Sub slug="neizvestnaya-cifra">подтема 5</Sub>,
              },
              {
                label: "первая пара",
                value: (
                  <FinalMistake
                    wrong="при двух цифрах взяли первую пару"
                    right="сравнить все пары"
                    question="точно ли эта пара лучшая?"
                  />
                ),
                note: <Sub slug="neizvestnaya-cifra">подтема 5</Sub>,
              },
              {
                label: "x вместо частного",
                value: (
                  <FinalMistake
                    wrong="в ответ записана цифра x"
                    right="ответ — то, что спрашивают"
                    question="что просит последняя фраза?"
                  />
                ),
                note: <Sub slug="neizvestnaya-cifra">подтема 5</Sub>,
              },
            ]}
          />
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
            Как выглядит 7⁵ − 1 в семеричной записи?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>66666₇ — пять цифр 6.</Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Как выглядит 3⁸ − 3³ в троичной записи?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>22222000₃: пять двоек и три нуля.</Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему цифры записи в системе q считают через n % q, а не через
            str(n)?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            str(n) даёт десятичную запись. Остаток n % q — последняя цифра в
            системе q, а n // q отрезает её.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            В записи 3x5₁₂ неизвестна цифра x. Какие значения перебирать?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            От 0 до 11: в двенадцатеричной системе 12 цифр, A и B — это 10 и 11.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена и блоками, и программой — ответ 21.
        Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Буква, значение, цифры, перебор, ответ.</>,
          },
          {
            key: "Цифры",
            note: <>n % q — последняя, n // q — остальные.</>,
          },
          {
            key: "Блоки",
            note: <>qᵐ − qⁿ: m − n цифр q − 1 и n нулей.</>,
          },
          {
            key: "Буква x",
            note: <>Число — весь диапазон, цифра — от 0 до q − 1.</>,
          },
          {
            key: "Задача темы",
            note: <>1 0 44…44 30 — 21 четвёрка.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
