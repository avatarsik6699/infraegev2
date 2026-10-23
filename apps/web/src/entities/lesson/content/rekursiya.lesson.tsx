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
import { rekursiyaLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./rekursiya.media";
import { PythonTerm } from "./python-term";
import { FinalMistake } from "./final-mistake";
import { SubtopicLink } from "./subtopic-link";

const THEME_TASK = (
  <>
    «Алгоритм вычисления значения функции F(n), где n — натуральное число, задан
    следующими соотношениями: F(n) = 1 при n = 1; F(n) = n · F(n − 1), если n{" "}
    {">"} 1. Чему равно значение выражения (F(2026) + 3 · F(2025)) / F(2024)?»
  </>
);

const R = "16-rekursiya";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="16-rekursiya" subtopic={props.slug}>
    {props.children}
  </SubtopicLink>
);

export const rekursiyaLesson = defineLesson({
  ...rekursiyaLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать определение F(n) и считать значения вручную: вниз до базы и обратно, с ветвями по условию",
    "Записывать функцию на Python по определению и решать задачу темы программой, подняв предел глубины рекурсии",
    "Ускорять программу с повторными вызовами: @cache, прогрев кеша и таблица значений",
    "Раскрывать большие значения и сокращать отношения и разности без программы",
    "Считать переходы по цепочке до базы и перебирать n, когда спрашивают аргумент",
    "Для редких задач — понимать, что функция считает по цифрам числа (дополнительный урок)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "funktsiya-cherez-sebya",
      title: "Функция, заданная через себя",
      lead: "Что спрашивают в задании 16, как читать определение функции и как посчитать её значение вручную — вниз до базы и обратно.",
      conceptIds: [
        "kak-ustroena-tema",
        "baza-i-shag",
        "vniz-i-obratno",
        "vetvi",
        "baza-sverhu",
        "opredelenie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Для функции задачи темы найди F(6).</>,
          reveal: <>720: F(5) = 120, F(6) = 6 · 120.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Для функции задачи темы чему равны F(4 − 1) и F(4) − 1? Почему
              числа разные?
            </>
          ),
          reveal: (
            <>
              F(4 − 1) = F(3) = 6 — функция от 3. F(4) − 1 = 24 − 1 = 23 —
              значение F(4) минус единица.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>F(1) = 3; F(n) = 2 · F(n − 1) + n при n {">"} 1. Найди F(4).</>
          ),
          reveal: <>42: F(2) = 8, F(3) = 19, F(4) = 2 · 19 + 4.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>Для функции с ветвями из раздела «Ветви по условию» найди F(6).</>
          ),
          reveal: (
            <>
              10: 6 чётное — F(6) = F(5) + 6; 5 нечётное — F(5) = 2 · F(3); F(3)
              = 2 · F(1) = 2. Обратно: F(5) = 4, F(6) = 10.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              F(n) = n при n ≥ 10; F(n) = n + F(n + 1) при n {"<"} 10. Найди
              F(8).
            </>
          ),
          reveal: <>27: F(8) = 8 + F(9) = 8 + 9 + F(10) = 8 + 9 + 10.</>,
        },
      ],
    },
    {
      slug: "rekursivnaya-funktsiya",
      title: "Рекурсивная функция на Python",
      lead: "Как записать определение функцией Python, проверить, что вызовы доходят до базы, и решить задачу темы программой.",
      conceptIds: [
        "po-opredeleniyu",
        "vetvi-v-programme",
        "dohodyat-do-bazy",
        "zadacha-temy-programmoj",
        "funkciya-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Что вернёт <Notation>{"F(1)"}</Notation> в программе задачи темы?
              Дойдёт ли вызов до строки{" "}
              <Notation>{"return n * F(n - 1)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              1. Не дойдёт: <Notation>{"return 1"}</Notation> сразу завершает
              вызов.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              F(2) = 3; F(n) = n · F(n − 2) при n {">"} 2, n — натуральное. Для
              какого из аргументов 8 и 9 этих правил хватит?
            </>
          ),
          reveal: (
            <>
              Для 8: аргументы 8, 6, 4, 2 доходят до базы. Для 9 цепочка 9, 7,
              5, 3, 1 пролетает мимо F(2), а F(1) не задано.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              В функции задачи темы вместо{" "}
              <Notation>{"return n * F(n - 1)"}</Notation> написали{" "}
              <Notation>{"print(n * F(n - 1))"}</Notation>. Что произойдёт при
              вызове <Notation>{"F(3)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Напечатается 2, а потом программа остановится ошибкой: F(2) ничего
              не вернёт (вернёт <Notation>{"None"}</Notation>), и{" "}
              <Notation>{"3 * None"}</Notation> не вычисляется.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Почему <Notation>{"print(F(2026))"}</Notation> без{" "}
              <Notation>{"sys.setrecursionlimit"}</Notation> останавливается
              ошибкой?
            </>
          ),
          reveal: (
            <>
              F(2026) ждёт F(2025), тот — F(2024), и так больше двух тысяч
              ждущих вызовов, а Python по умолчанию разрешает около тысячи.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              F(n) = 1 при n ≤ 1; F(n) = F(n − 2) + n при n {">"} 1. В программе
              базу записали как <Notation>{"if n == 1:"}</Notation>. Что будет
              при вызове <Notation>{"F(6)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Цепочка 6, 4, 2, 0, −2, … пролетит мимо 1 — ошибка{" "}
              <Notation>{"RecursionError"}</Notation>. По условию база — n ≤ 1:{" "}
              <Notation>{"if n <= 1:"}</Notation>.
            </>
          ),
        },
      ],
    },
    {
      slug: "povtornye-vyzovy",
      title: "Повторные вызовы и таблица",
      lead: "Почему программа с двумя вызовами себя считает долго и как её ускорить: @cache, прогрев кеша и таблица значений циклом.",
      conceptIds: [
        "povtornye-vychisleniya",
        "cache",
        "progrev-kesha",
        "tablica-ciklom",
        "dve-funkcii",
        "vyzovy-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Почему программа для чисел Фибоначчи без{" "}
              <Notation>{"@cache"}</Notation> считает F(40) так долго, хотя
              разных значений всего сорок?
            </>
          ),
          reveal: (
            <>
              Каждый вызов вызывает себя дважды, и одни и те же значения
              считаются заново: F(38) — дважды, F(37) — трижды, и дальше
              повторов всё больше.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              F(1) = 1; F(n) = F(n − 2) + n при n {">"} 1. Добавили{" "}
              <Notation>{"@cache"}</Notation> и вызвали F(6). Поможет ли это?
            </>
          ),
          reveal: (
            <>
              Нет: аргументы 6, 4, 2, 0, −2, … не доходят до базы, а кеш хранит
              только уже посчитанные значения.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              F(n) = n при n ≥ 3000; F(n) = F(n + 1) + 1 при n {"<"} 3000. С{" "}
              <Notation>{"@cache"}</Notation> вызов F(1) всё равно падает. В
              какую сторону прогревать кеш?
            </>
          ),
          reveal: (
            <>
              По убыванию, от базы:{" "}
              <Notation>{"for n in range(3000, 0, -1)"}</Notation>. Тогда к
              вызову F(n) значение F(n + 1) уже готово.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Список создали как <Notation>{"f = [0] * 2026"}</Notation>. Можно
              ли записать значение в <Notation>{"f[2026]"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Нет: номера идут от 0 до 2025. Для f[2026] нужен{" "}
              <Notation>{"[0] * 2027"}</Notation> — на один элемент больше.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              G(n) = G(n − 1) + 1, F(n) = F(n − 1) + G(n). Какую строку в цикле
              считать первой — для <Notation>{"g[n]"}</Notation> или для{" "}
              <Notation>{"f[n]"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Сначала <Notation>{"g[n]"}</Notation>: формуле F(n) нужно уже
              новое G(n).
            </>
          ),
        },
      ],
    },
    {
      slug: "bolshie-argumenty",
      title: "Раскрыть и сократить",
      lead: "Задача темы вручную: большие значения раскрывают до общего множителя или слагаемого, и оно сокращается.",
      conceptIds: [
        "otnoshenie",
        "raznost",
        "obshchee-neizvestnoe",
        "vetvi-i-sokrashchenie",
        "arifmetika",
        "bolshie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Для функции задачи темы найди F(2026) / F(2024).</>,
          reveal: <>2026 · 2025 = 4 102 650.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Для функции задачи темы найди (F(2026) − F(2025)) / F(2024).</>
          ),
          reveal: (
            <>
              4 100 625: (2026 · 2025 − 2025) · F(2024) / F(2024) = 2025 · 2025.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              F(1) = 2; F(n) = F(n − 1) + 3n при n {">"} 1. Найди F(2026) −
              F(2024).
            </>
          ),
          reveal: <>12 153: остаются прибавки 3 · 2025 + 3 · 2026.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              F(n) = 1 при n ≤ 2; F(n) = F(n − 2) + n при n {">"} 2. Найди F(30)
              − F(26).
            </>
          ),
          reveal: <>58: F(30) = F(26) + 28 + 30.</>,
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему в программе задачи темы деление записано через{" "}
              <Notation>{"//"}</Notation>, а не через <Notation>{"/"}</Notation>
              ?
            </>
          ),
          reveal: (
            <>
              Деление нацело, и <Notation>{"//"}</Notation> даёт точное целое.{" "}
              <Notation>{"/"}</Notation> даёт дробное 4108725.0, а при ответе
              больше 2⁵³ — ещё и неточное.
            </>
          ),
        },
      ],
    },
    {
      slug: "cepochki-i-perebor",
      title: "Цепочки до базы и перебор n",
      lead: "Аргумент шагает через несколько чисел или уходит в другую функцию — считаем переходы до базы. А когда спрашивают n — перебираем.",
      conceptIds: [
        "cepochki",
        "raznye-cepochki",
        "dve-funkcii-navstrechu",
        "perebor-n",
        "cepochki-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              F(n) = n при n ≤ 5; F(n) = F(n − 3) + 4 при n {">"} 5. Найди
              F(22).
            </>
          ),
          reveal: (
            <>
              28: аргументы 22, 19, 16, 13, 10, 7, 4 — шесть переходов по 4, а
              F(4) = 4.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              F(n) = n при n ≥ 50; F(n) = F(n + 5) + 1 при n {"<"} 50. Найди
              F(13).
            </>
          ),
          reveal: (
            <>
              61: аргументы 13, 18, …, 48, 53 — восемь переходов, база F(53) =
              53.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Почему в примере с F(11) − F(10) нельзя раскрыть F(11) до F(10) и
              сократить?
            </>
          ),
          reveal: (
            <>
              Аргумент растёт на 2: от 11 идут только нечётные числа, от 10 —
              чётные. Цепочки не встречаются, общего значения нет.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              F(0) = 0; F(n) = F(n // 2) + n % 2 при n {">"} 0. Сколько чисел от
              1 до 15 дают F(n) = 2?
            </>
          ),
          reveal: <>6: это 3, 5, 6, 9, 10, 12.</>,
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Для функции задачи темы найди наименьшее n, при котором F(n) {">"}{" "}
              1000.
            </>
          ),
          reveal: <>7: F(6) = 720, F(7) = 5040.</>,
        },
      ],
    },
    {
      slug: "chto-schitaet-funktsiya",
      title: "Что считает функция",
      lead: "Функции над цифрами числа: сумма цифр, двоичные единицы, вклады цифр и перенос при n + 1 — счёт без перебора огромного диапазона.",
      level: "advanced",
      conceptIds: [
        "cifry-chisla",
        "dvoichnye-cifry",
        "vklad-cifry",
        "perenos",
        "tablica-vkladov",
        "schitaet-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              F(0) = 0; F(n) = F(n // 10) + n % 10 при n {">"} 0. Найди F(2026).
            </>
          ),
          reveal: <>10: это сумма цифр, 2 + 0 + 2 + 6.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              F(0) = 0; F(n) = F(n // 3) + 1 при n {">"} 0. Что считает функция?
              Найди F(100).
            </>
          ),
          reveal: (
            <>Количество цифр троичной записи; 100 = 10201₃, F(100) = 5.</>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Сколько чисел от 1 до 31 имеют в двоичной записи ровно одну
              единицу?
            </>
          ),
          reveal: <>5: это 1, 2, 4, 8, 16.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              F(n) — сумма десятичных цифр. На какую цифру должно оканчиваться
              n, чтобы F(n + 1) было меньше F(n)?
            </>
          ),
          reveal: (
            <>
              На 9: девятка превращается в 0, и сумма падает на 9 − 1 = 8 и
              больше.
            </>
          ),
        },
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 16 функция задана через саму себя: её значение для n
            выражается через значения для других аргументов. Нужно найти
            значение функции или выражения из нескольких её значений. Вот
            задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Считать F(2026) целиком не придётся: это число из тысяч цифр, и
              почти всё в нём сократится.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              ["F(n)", "значение функции для аргумента n — какое-то число"],
              ["n — натуральное число", "аргументы 1, 2, 3, …"],
              ["F(n) = 1 при n = 1", "для n = 1 ответ известен сразу"],
              [
                "F(n) = n · F(n − 1), если n > 1",
                "остальные значения получают из значения для n − 1",
              ],
              [
                "(F(2026) + 3 · F(2025)) / F(2024)",
                "выражение из трёх значений функции — его и нужно найти",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем — у каждой своя страница. Идём по ним
            по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Функция, заданная через себя</strong> — ты сейчас здесь.
              Считаем значения вручную на маленьких n.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="rekursivnaya-funktsiya">
                Рекурсивная функция на Python
              </SubtopicLink>{" "}
              — решим задачу темы программой: ответ 4 108 725.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="povtornye-vyzovy">
                Повторные вызовы и таблица
              </SubtopicLink>{" "}
              — что делать, если программа считает слишком долго.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="bolshie-argumenty">
                Раскрыть и сократить
              </SubtopicLink>{" "}
              — задача темы вручную, без программы.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="cepochki-i-perebor">
                Цепочки до базы и перебор n
              </SubtopicLink>{" "}
              — шаг через несколько чисел, две функции, поиск n.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="chto-schitaet-funktsiya">
                Что считает функция
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач про цифры числа.
            </li>
          </ol>
          <Typography.Text>
            Почти любую задачу можно решить и программой, и вручную. На экзамене
            подойдёт любой способ, а второй пригодится для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "baza-i-shag",
      navLabel: "База и шаг",
      explanation: (
        <>
          <Typography.Text>
            Как посчитать F(5) по такому определению?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Значение для n = 1 известно сразу. Каждое следующее получается из
              предыдущего по формуле — так шаг за шагом доходим до нужного n.
            </strong>{" "}
            Возьмём функцию задачи темы:
          </Typography.Text>
          <LessonTable
            label={"Значения функции задачи темы"}
            columns={[
              { label: "n", numeric: true },
              { label: "Вычисление" },
              { label: "F(n)", numeric: true },
            ]}
            rows={[
              ["1", "дано в условии", "1"],
              ["2", "2 · F(1) = 2 · 1", "2"],
              ["3", "3 · F(2) = 3 · 2", "6"],
              ["4", "4 · F(3) = 4 · 6", "24"],
              ["5", "5 · F(4) = 5 · 24", "120"],
            ]}
          />
          <Typography.Text>
            Значение, которое задано сразу, называют <strong>базой</strong>:
            здесь это F(1) = 1. Формулу, которая выражает F(n) через другие
            значения функции, — <strong>рекуррентным соотношением</strong>: F(n)
            = n · F(n − 1).
          </Typography.Text>
          <Typography.Text>
            У нашей функции F(n) = 1 · 2 · 3 · … · n. Такое произведение
            называют факториалом и пишут n!, например 5! = 120.
          </Typography.Text>
          <Typography.Text>
            Скобки после F всегда значат одно: посчитать функцию для того числа,
            что стоит в скобках. Поэтому похожие записи дают разные числа:
          </Typography.Text>
          <LessonTable
            label={"Похожие записи при n = 3"}
            columns={[
              { label: "Запись" },
              { label: "Что сделать" },
              { label: "При n = 3" },
            ]}
            rows={[
              ["F(n − 1)", "посчитать F для аргумента n − 1", "F(2) = 2"],
              ["F(n) − 1", "посчитать F(n) и вычесть 1", "6 − 1 = 5"],
              ["2 · F(n)", "посчитать F(n) и умножить на 2", "2 · 6 = 12"],
              ["F(2n)", "посчитать F для аргумента 2n", "F(6) = 720"],
            ]}
          />
        </>
      ),
    },
    {
      id: "vniz-i-obratno",
      navLabel: "Вниз до базы и обратно",
      explanation: (
        <>
          <Typography.Text>
            А если предыдущих значений ещё нет, а нужно сразу F(5)?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда вычисление сначала спускается до базы, а потом поднимается
              обратно.
            </strong>{" "}
            F(5) = 5 · F(4), но F(4) неизвестно — F(5) ждёт. F(4) = 4 · F(3) —
            ждёт и F(4). Так до F(1) = 1. Дальше ждущие вызовы получают ответы и
            доделывают своё умножение: F(2) = 2, F(3) = 6, F(4) = 24, F(5) =
            120. Пройди этот путь по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.recUnfoldStepper5}
            label={"Вычисление F(5): вниз до базы и обратно"}
          />
          <Typography.Text>
            Заметь порядок: F(1) начался последним, а закончился первым; F(5)
            начался первым, а закончился последним. Ждущие вызовы хранятся как
            стопка — что положили последним, то снимают первым. Её называют{" "}
            <PythonTerm term="rec">стеком вызовов</PythonTerm>. У каждого вызова
            своё n: когда F(5) дождётся F(4) = 24, он умножит его именно на 5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vetvi",
      navLabel: "Ветви по условию",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если формул несколько и выбор зависит от n? Например:
          </Typography.Text>
          <Typography.Text>
            F(n) = n при n ≤ 2; F(n) = F(n − 1) + n, если n {">"} 2 и n чётно;
            F(n) = 2 · F(n − 2), если n {">"} 2 и n нечётно.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Формулу выбирают заново для каждого аргумента, который встретился
              по пути.
            </strong>{" "}
            Найдём F(8):
          </Typography.Text>
          <LessonTable
            label={"Вычисление F(8) по ветвям"}
            columns={[
              { label: "Аргумент", numeric: true },
              { label: "Какая формула" },
              { label: "Что получается" },
            ]}
            rows={[
              ["8", "чётное, больше 2", "F(8) = F(7) + 8"],
              ["7", "нечётное, больше 2", "F(7) = 2 · F(5)"],
              ["5", "нечётное, больше 2", "F(5) = 2 · F(3)"],
              ["3", "нечётное, больше 2", "F(3) = 2 · F(1)"],
              ["1", "не больше 2", "F(1) = 1"],
            ]}
          />
          <Typography.Text>
            Поднимаемся обратно: F(3) = 2, F(5) = 4, F(7) = 8, F(8) = 8 + 8 =
            16.
          </Typography.Text>
          <Typography.Text>
            Частая ошибка — выбрать формулу один раз по первому аргументу: 8
            чётное, и дальше везде брать F(n − 1) + n. Так получится 35 вместо
            16.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "baza-sverhu",
      navLabel: "База сверху",
      explanation: (
        <>
          <Typography.Text>Аргумент всегда уменьшается?</Typography.Text>
          <Typography.Text>
            <strong>
              Нет: база может стоять сверху, и тогда аргумент растёт, пока не
              дойдёт до неё.
            </strong>{" "}
            Например: F(n) = n при n ≥ 10; F(n) = n + F(n + 1) при n {"<"} 10.
          </Typography.Text>
          <Typography.Text>
            F(7) = 7 + F(8) = 7 + 8 + F(9) = 7 + 8 + 9 + F(10). При n = 10
            работает база: F(10) = 10. Значит, F(7) = 7 + 8 + 9 + 10 = 34.
          </Typography.Text>
          <Typography.Text>
            Порядок тот же: запросы идут от 7 к базе, результаты возвращаются
            обратно. Важно одно — чтобы аргументы дошли до базы. Как это
            проверять, разберём в следующей подтеме.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "opredelenie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "База", note: <>значение, известное сразу: F(1) = 1</> },
              {
                key: "Рекуррентное соотношение",
                note: <>F(n) через другие значения: F(n) = n · F(n − 1)</>,
              },
              {
                key: "Скобки",
                note: (
                  <>F(n − 1) — функция от n − 1, F(n) − 1 — значение минус 1</>
                ),
              },
              {
                key: "Вниз и обратно",
                note: (
                  <>запросы до базы, потом ждущие вызовы доделывают действия</>
                ),
              },
              {
                key: "Ветви",
                note: <>формулу выбирают для каждого аргумента</>,
              },
              {
                key: "База сверху",
                note: <>аргумент растёт, пока не дойдёт до неё</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "po-opredeleniyu",
      navLabel: "Функция по определению",
      explanation: (
        <>
          <Typography.Text>
            Как перевести определение функции на Python?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Функцию записывают прямо по определению: база — проверка и{" "}
              <Notation>{"return"}</Notation> с готовым числом, рекуррентное
              соотношение — <Notation>{"return"}</Notation> с вызовом той же
              функции.
            </strong>{" "}
            Вот функция задачи темы. Нажми «Запуск» и пройди программу по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runF}
            label={"Функция задачи темы: F(5) по шагам"}
          />
          <LessonTable
            label={"Определение и программа"}
            columns={[{ label: "В определении" }, { label: "В программе" }]}
            rows={[
              [
                "функция F от аргумента n",
                <Notation key="def">{"def F(n):"}</Notation>,
              ],
              [
                "F(n) = 1 при n = 1",
                <Notation key="base">{"if n == 1: return 1"}</Notation>,
              ],
              [
                "F(n) = n · F(n − 1)",
                <Notation key="step">{"return n * F(n - 1)"}</Notation>,
              ],
            ]}
          />
          <Typography.Text>Разберём строки по порядку:</Typography.Text>
          <ul>
            <li>
              <PythonTerm term="def">
                <Notation>{"def F(n):"}</Notation>
              </PythonTerm>{" "}
              создаёт функцию F. <Notation>{"n"}</Notation> — её параметр: при
              вызове <Notation>{"F(5)"}</Notation> в n попадает 5;
            </li>
            <li>
              <Notation>{"if n == 1:"}</Notation> — проверка. Двойной знак{" "}
              <PythonTerm term="eq">
                <Notation>{"=="}</Notation>
              </PythonTerm>{" "}
              сравнивает, а одинарный <Notation>{"="}</Notation> присваивает;
            </li>
            <li>
              <Notation>{"return 1"}</Notation> завершает вызов и отдаёт 1 туда,
              откуда функцию вызвали. Строки ниже в этом вызове уже не
              выполняются;
            </li>
            <li>
              <Notation>{"return n * F(n - 1)"}</Notation> вызывает F(n − 1),
              ждёт ответа, умножает его на n и отдаёт результат.
            </li>
          </ul>
          <Typography.Text>
            В пошаговом запуске видно то же, что мы делали вручную: вызовы F(5),
            F(4), F(3), F(2) ждут, у каждого своё n, а после базы возвращаются
            1, 2, 6, 24, 120.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: return и print">
            <Typography.Text>
              <Notation>{"print"}</Notation> только показывает число на экране,
              а <Notation>{"return"}</Notation> отдаёт его тому, кто вызвал
              функцию. Функция без <Notation>{"return"}</Notation> возвращает{" "}
              <PythonTerm term="none">
                <Notation>{"None"}</Notation>
              </PythonTerm>{" "}
              — «ничего», и выражение <Notation>{"n * F(n - 1)"}</Notation> с
              таким ответом остановится ошибкой. Строки тела функции пишут с
              отступом: по нему Python понимает, что относится к функции, а что
              — к <Notation>{"if"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "vetvi-v-programme",
      navLabel: "Ветви в программе",
      explanation: (
        <>
          <Typography.Text>Как записать формулу с ветвями?</Typography.Text>
          <Typography.Text>
            <strong>
              Каждая ветвь определения — своя проверка:{" "}
              <PythonTerm term="if">
                <Notation>{"if"}</Notation>
              </PythonTerm>
              , затем <Notation>{"elif"}</Notation> («иначе, если»), а для
              последней — <Notation>{"else"}</Notation> («иначе»).
            </strong>{" "}
            Функция с ветвями из прошлой подтемы:
          </Typography.Text>
          <CodeBlock
            code={
              "def F(n):\n    if n <= 2:\n        return n\n    elif n % 2 == 0:\n        return F(n - 1) + n\n    else:\n        return 2 * F(n - 2)\n\n\nprint(F(8))"
            }
            label={"Функция с ветвями по чётности"}
            language="python"
            output={"16"}
            collapsible={false}
          />
          <Typography.Text>
            Чётность проверяют остатком от деления на 2:{" "}
            <PythonTerm term="intdiv">
              <Notation>{"%"}</Notation>
            </PythonTerm>{" "}
            — остаток, и <Notation>{"n % 2 == 0"}</Notation> значит «n чётно».
            Ветвь Python выбирает в каждом вызове по его собственному n — как мы
            делали вручную. Программа печатает 16.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: лишние проверки">
            <Typography.Text>
              После <Notation>{"if n <= 2"}</Notation> в ветви{" "}
              <Notation>{"elif"}</Notation> и <Notation>{"else"}</Notation>{" "}
              попадают только n {">"} 2, поэтому повторять «n {">"} 2» не нужно.
              А условие «F(n − 1) чётно» проверяет уже значение функции, а не
              аргумент: <Notation>{"F(n - 1) % 2 == 0"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "dohodyat-do-bazy",
      navLabel: "Вызовы доходят до базы",
      explanation: (
        <>
          <Typography.Text>
            Всегда ли программа по определению досчитает до конца?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Только если от нужного аргумента все вызовы доходят до базы.
            </strong>{" "}
            Например: F(1) = 1; F(n) = F(n − 2) + n при n {">"} 1. Для F(7)
            аргументы 7, 5, 3, 1 — база достигнута. Для F(6) — 6, 4, 2, 0, −2, …
            База пропущена: вычитание 2 не меняет чётность.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recChains2_1_eq_4}
            caption={
              <>
                Шаг −2: цепочка от 7 попадает в базу 1 за 3 перехода, цепочка от
                6 проходит через 0 и уходит в отрицательные числа, не задев 1.
              </>
            }
          />
          <Typography.Text>
            Навечно программа на F(6) не зависнет: когда ждущих вызовов станет
            около тысячи, Python остановит её ошибкой{" "}
            <Notation>{"RecursionError"}</Notation> — превышен{" "}
            <PythonTerm term="reclimit">предел глубины рекурсии</PythonTerm>.
          </Typography.Text>
          <Typography.Text>
            Поэтому перед программой проверь по условию:
          </Typography.Text>
          <ul>
            <li>
              какие аргументы допустимы: «натуральное» — 1, 2, 3, …, «целое
              неотрицательное» — 0, 1, 2, …;
            </li>
            <li>куда ведут переходы — вниз или вверх и через сколько чисел;</li>
            <li>попадает ли каждая нужная цепочка в базу.</li>
          </ul>
          <Typography.Text>
            В задачах экзамена база подобрана так, что нужные вызовы до неё
            доходят. Проверка спасает от ошибки при переписывании: если в
            условии база «n ≤ 1», а в программе{" "}
            <Notation>{"if n == 1"}</Notation>, чётная цепочка пролетит мимо.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy-programmoj",
      navLabel: "Задача темы программой",
      explanation: (
        <>
          <Typography.Text>Как решить задачу темы программой?</Typography.Text>
          <Typography.Text>
            <strong>
              Функция уже есть — осталось напечатать выражение из условия.
            </strong>{" "}
            Но прямой запуск остановится ошибкой:
          </Typography.Text>
          <CodeBlock
            code={"print((F(2026) + 3 * F(2025)) // F(2024))"}
            label={"Задача темы без поднятого предела"}
            language="python"
            error={"RecursionError: maximum recursion depth exceeded"}
          />
          <Typography.Text>
            F(2026) ждёт F(2025), тот — F(2024), и так до F(1): больше двух
            тысяч ждущих вызовов. А Python по умолчанию разрешает около тысячи.
            Предел поднимают в начале программы:
          </Typography.Text>
          <CodeBlock
            code={
              "import sys\n\nsys.setrecursionlimit(5000)\n\n\ndef F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\n\nprint((F(2026) + 3 * F(2025)) // F(2024))"
            }
            label={"Задача темы программой"}
            language="python"
            output={"4108725"}
            collapsible={false}
          />
          <Typography.Text>
            <PythonTerm term="import">
              <Notation>{"import sys"}</Notation>
            </PythonTerm>{" "}
            подключает модуль с настройками Python, а{" "}
            <Notation>{"sys.setrecursionlimit(5000)"}</Notation> разрешает до
            5000 ждущих вызовов — с запасом для 2026.{" "}
            <strong>Ответ задачи темы — 4 108 725.</strong>
          </Typography.Text>
          <Typography.Text>
            Деление записано через <Notation>{"//"}</Notation>: выражение
            делится нацело (почему — увидим в подтеме 4), а{" "}
            <Notation>{"//"}</Notation> делит целые числа точно. Обычное{" "}
            <Notation>{"/"}</Notation> напечатало бы дробное 4108725.0.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: если поднятого предела мало"
          >
            <Typography.Text>
              Предел в десятки тысяч ставить рискованно: память под ждущие
              вызовы может кончиться, и программа закроется без сообщения. Для
              аргументов в десятки тысяч надёжнее прогрев кеша или таблица — они
              в следующей подтеме.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "funkciya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: <Notation>{"def F(n):"}</Notation>,
                note: <>функция с параметром n</>,
              },
              {
                key: <Notation>{"if n == 1: return 1"}</Notation>,
                note: <>база — ответ без нового вызова</>,
              },
              {
                key: <Notation>{"return n * F(n - 1)"}</Notation>,
                note: <>рекуррентное соотношение — вызов себя</>,
              },
              {
                key: "if / elif / else",
                note: <>ветви, Python выбирает их в каждом вызове</>,
              },
              {
                key: "До базы",
                note: <>каждая нужная цепочка аргументов попадает в базу</>,
              },
              {
                key: <Notation>{"sys.setrecursionlimit"}</Notation>,
                note: <>больше ждущих вызовов — для аргументов в тысячи</>,
              },
              {
                key: <Notation>{"//"}</Notation>,
                note: <>точное деление нацело</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "povtornye-vychisleniya",
      navLabel: "Повторные вызовы",
      explanation: (
        <>
          <Typography.Text>
            Почему программа может считать минуты, хотя аргумент небольшой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если функция вызывает себя дважды, одни и те же значения считаются
              снова и снова.
            </strong>{" "}
            Возьмём F(n) = 1 при n ≤ 2; F(n) = F(n − 1) + F(n − 2) при n {">"} 2
            — это числа Фибоначчи: 1, 1, 2, 3, 5, 8, … Программа по определению:
          </Typography.Text>
          <CodeBlock
            code={
              "def F(n):\n    if n <= 2:\n        return 1\n    return F(n - 1) + F(n - 2)\n\n\nprint(F(5))"
            }
            label={"Числа Фибоначчи по определению"}
            language="python"
            output={"5"}
          />
          <Typography.Text>
            Какие вызовы она делает для F(5), показывает левое дерево:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recFibTree5}
            caption={
              <>
                Без запоминания F(5) требует 9 вызовов: F(3) вычисляется дважды,
                F(2) — трижды. С запоминанием 7 вызовов, из них вычисляют только
                5, а повторные берут готовый ответ.
              </>
            }
          />
          <Typography.Text>
            С ростом n повторов становится лавина: для F(30) программа делает
            больше полутора миллионов вызовов, для F(40) — больше двухсот
            миллионов. А разных значений среди них всего сорок.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cache",
      navLabel: "@cache",
      explanation: (
        <>
          <Typography.Text>Как убрать повторы?</Typography.Text>
          <Typography.Text>
            <strong>
              Запоминать каждое найденное значение и при повторном вызове брать
              готовый ответ. Это делает{" "}
              <PythonTerm term="cache">
                <Notation>{"@cache"}</Notation>
              </PythonTerm>
              .
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n@cache\ndef F(n):\n    if n <= 2:\n        return 1\n    return F(n - 1) + F(n - 2)\n\n\nprint(F(50))"
            }
            label={"Числа Фибоначчи с запоминанием"}
            language="python"
            output={"12586269025"}
            collapsible={false}
          />
          <Typography.Text>
            Строка <Notation>{"from functools import cache"}</Notation>{" "}
            подключает готовое запоминание, а <Notation>{"@cache"}</Notation>{" "}
            над <Notation>{"def"}</Notation> включает его для F. Формула
            остаётся прежней. Правое дерево на схеме — та же F(5) с{" "}
            <Notation>{"@cache"}</Notation>: повторные вызовы сразу получают
            ответ из памяти. Поэтому F(50) считается мгновенно.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: lru_cache и как устроено запоминание"
          >
            <Typography.Text>
              В разборах часто пишут <Notation>{"@lru_cache(None)"}</Notation>{" "}
              из того же модуля — это то же запоминание. У{" "}
              <Notation>{"@lru_cache()"}</Notation> без{" "}
              <Notation>{"None"}</Notation> память ограничена 128 значениями.
              Внутри это словарь «аргумент → значение»: перед вычислением
              функция смотрит, нет ли там ответа, а после кладёт его туда.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "progrev-kesha",
      navLabel: "Прогрев кеша",
      explanation: (
        <>
          <Typography.Text>
            А если программа с <Notation>{"@cache"}</Notation> всё равно падает
            с <Notation>{"RecursionError"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Кеш не уменьшает глубину: первый вызов F(2026) всё равно
              спускается до базы через две тысячи ждущих вызовов. Глубину
              убирает прогрев — вызвать функцию по очереди, начиная от базы.
            </strong>{" "}
            Задача темы с прогревом:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n@cache\ndef F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\n\nfor n in range(1, 2027):\n    F(n)\n\nprint((F(2026) + 3 * F(2025)) // F(2024))"
            }
            label={"Задача темы с прогревом кеша"}
            language="python"
            output={"4108725"}
            collapsible={false}
          />
          <Typography.Text>
            Цикл считает F(1), F(2), F(3), … по очереди. Когда доходит очередь
            до F(100), значение F(99) уже лежит в кеше — вызов делает один шаг
            вниз, а не сто. Ждущих вызовов всё время мало, и предел поднимать не
            нужно. Результат <Notation>{"F(n)"}</Notation> в цикле никуда не
            записываем: вызов нужен только ради кеша.
          </Typography.Text>
          <Typography.Text>
            Прогревают всегда от базы. Если база сверху — например, F(n) = n при
            n ≥ 5000 и F(n) = F(n + 3) + 5 при n {"<"} 5000, — цикл идёт по
            убыванию: <Notation>{"for n in range(5002, 0, -1)"}</Notation>.
            Тогда к вызову F(n) значение F(n + 3) уже готово.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tablica-ciklom",
      navLabel: "Таблица циклом",
      explanation: (
        <>
          <Typography.Text>
            Можно ли обойтись совсем без рекурсии?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Да: завести список, где f[n] хранит F(n), и заполнить его циклом
              по формуле.
            </strong>{" "}
            Задача темы таблицей:
          </Typography.Text>
          <CodeBlock
            code={
              "f = [0] * 2027\nf[1] = 1\nfor n in range(2, 2027):\n    f[n] = n * f[n - 1]\n\nprint((f[2026] + 3 * f[2025]) // f[2024])"
            }
            label={"Задача темы таблицей"}
            language="python"
            output={"4108725"}
          />
          <Typography.Text>
            <Notation>{"[0] * 2027"}</Notation> создаёт{" "}
            <PythonTerm term="list">список</PythonTerm> из 2027 нулей с номерами
            от 0 до 2026 — так появляется место для f[2026]. Элемент f[0] не
            используется, а остальные нули — заготовки, их заменит цикл. Когда
            цикл считает f[n], значение f[n − 1] уже готово.
          </Typography.Text>
          <Typography.Text>
            Порядок заполнения задают зависимости. Если формула берёт значения
            слева — F(n − 1), F(n − 2), — список заполняют слева направо. Если
            справа — F(n + 1), — справа налево, от верхней базы:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recFillOrder6_10_7}
            caption={
              <>
                Стрелки ведут от уже готовых ячеек к вычисляемой. Для F(n − 1) и
                F(n − 2) готовы ячейки слева — таблицу заполняют слева направо;
                для F(n + 1) готова ячейка справа — справа налево, от базы{" "}
                {"F(10)\u00a0=\u00a010"}.
              </>
            }
          />
          <Typography.Text>
            Такой способ — сохранять ответы маленьких задач и строить из них
            следующие — называют <strong>динамическим программированием</strong>
            . Прогрев кеша делает то же самое, только значения хранит{" "}
            <Notation>{"@cache"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: заполнение справа налево"
          >
            <Typography.Text>
              Функция из подтемы 1: F(n) = n при n ≥ 10 и F(n) = n + F(n + 1)
              при n {"<"} 10.
            </Typography.Text>
            <CodeBlock
              code={
                "f = [0] * 11\nf[10] = 10\nfor n in range(9, 0, -1):\n    f[n] = n + f[n + 1]\n\nprint(f[7])"
              }
              label={"Таблица справа налево"}
              language="python"
              output={"34"}
            />
            <Typography.Text>
              <Notation>{"range(9, 0, -1)"}</Notation> даёт 9, 8, …, 1: третье
              число — шаг −1, а 0 не входит.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "dve-funkcii",
      navLabel: "Две функции",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если в условии две функции и они вызывают друг друга?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Записать обе по определению — каждую своей{" "}
              <Notation>{"def"}</Notation> — и вызывать их после того, как
              описаны обе.
            </strong>{" "}
            Например: F(1) = 1, G(1) = 2; при n {">"} 1 F(n) = F(n − 1) + G(n −
            1), G(n) = 2 · F(n − 1) + G(n − 1). Найдём F(5) + G(5). Вручную —
            таблицей по строкам:
          </Typography.Text>
          <LessonTable
            label={"Значения F и G"}
            columns={[
              { label: "n", numeric: true },
              { label: "F(n)", numeric: true },
              { label: "G(n)", numeric: true },
            ]}
            rows={[
              ["1", "1", "2"],
              ["2", "1 + 2 = 3", "2 · 1 + 2 = 4"],
              ["3", "3 + 4 = 7", "2 · 3 + 4 = 10"],
              ["4", "7 + 10 = 17", "2 · 7 + 10 = 24"],
              ["5", "17 + 24 = 41", "2 · 17 + 24 = 58"],
            ]}
          />
          <Typography.Text>
            Обе функции берут значения из предыдущей строки. Ответ: 41 + 58 =
            99. Программой:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n@cache\ndef F(n):\n    if n == 1:\n        return 1\n    return F(n - 1) + G(n - 1)\n\n\n@cache\ndef G(n):\n    if n == 1:\n        return 2\n    return 2 * F(n - 1) + G(n - 1)\n\n\nprint(F(5) + G(5))"
            }
            label={"Две функции"}
            language="python"
            output={"99"}
            collapsible={false}
          />
          <Typography.Text>
            F ссылается на G, описанную ниже, — это нормально: Python ищет G
            только в момент вызова. Главное, чтобы{" "}
            <Notation>{"print"}</Notation> стоял после обеих{" "}
            <Notation>{"def"}</Notation>. <Notation>{"@cache"}</Notation> нужен
            каждой функции: обе вызывают по две функции, и без запоминания при
            больших n повторы разрастаются, как у Фибоначчи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vyzovy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Два вызова себя",
                note: <>без запоминания значения считаются много раз</>,
              },
              {
                key: <Notation>{"@cache"}</Notation>,
                note: <>каждое значение считается один раз</>,
              },
              {
                key: "Глубина",
                note: <>кеш её не уменьшает: поднять предел или прогреть кеш</>,
              },
              {
                key: "Прогрев",
                note: <>вызвать F(n) по очереди, начиная от базы</>,
              },
              {
                key: "Таблица",
                note: (
                  <>f[n] = F(n), цикл идёт от базы; список на N + 1 элемент</>
                ),
              },
              { key: "Две функции", note: <>две def, вызов после обеих</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "otnoshenie",
      navLabel: "Отношение сокращается",
      explanation: (
        <>
          <Typography.Text>
            Как найти ответ задачи темы без программы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Расписать большие значения через самое маленькое из выражения —
              F(2024) — и сократить его.
            </strong>{" "}
            Раскроем формулу F(n) = n · F(n − 1) несколько раз:
          </Typography.Text>
          <ul>
            <li>F(2026) = 2026 · F(2025) = 2026 · 2025 · F(2024);</li>
            <li>F(2025) = 2025 · F(2024).</li>
          </ul>
          <LessonDiagram
            {...lessonMedia.recRatio2026_2024_3}
            caption={
              <>
                Оба слагаемых числителя содержат множитель F(2024). Он общий,
                поэтому знаменатель сокращается, и остаётся (2026 + 3) · 2025.
              </>
            }
          />
          <Typography.Text>
            Подставим в выражение и вынесем общий множитель:
          </Typography.Text>
          <Typography.Text>
            (2026 · 2025 · F(2024) + 3 · 2025 · F(2024)) / F(2024) = (2026 + 3)
            · 2025 = 2029 · 2025 = 4 108 725.
          </Typography.Text>
          <Typography.Text>
            Ответ совпал с программой из подтемы 2. Само F(2024) — число почти
            из шести тысяч цифр — считать не пришлось.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: что можно сокращать"
          >
            <Typography.Text>
              Сокращать можно только на число, не равное нулю. У нашей функции
              все значения положительные: F(1) = 1, а дальше умножаем на
              натуральные числа. Последнее умножение удобно сделать в Python:{" "}
              <Notation>{"print(2029 * 2025)"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "raznost",
      navLabel: "Разность сокращается",
      explanation: (
        <>
          <Typography.Text>
            А если в выражении не отношение, а разность?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Раскрыть большее значение до меньшего: меньшее вычтется целиком, и
              останутся только прибавки последних шагов.
            </strong>{" "}
            Пусть F(1) = 2; F(n) = F(n − 1) + 3n при n {">"} 1. Найдём F(2026) −
            F(2023):
          </Typography.Text>
          <Typography.Text>
            F(2026) = F(2025) + 3 · 2026 = F(2024) + 3 · 2025 + 3 · 2026 =
            F(2023) + 3 · 2024 + 3 · 2025 + 3 · 2026.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recDiff2026_2023}
            caption={
              <>
                F(2026) — это всё значение F(2023) плюс три прибавки 6072, 6075
                и 6078. Общая часть в разности сокращается, остаётся 18 225.
                Длины полос не в масштабе.
              </>
            }
          />
          <Typography.Text>
            F(2026) − F(2023) = 3 · 2024 + 3 · 2025 + 3 · 2026 = 3 · 6075 = 18
            225.
          </Typography.Text>
          <Typography.Text>
            Так работает любая функция вида F(n) = F(n − 1) + a(n), где a(n) —
            прибавка на шаге: разность F(N) − F(M) равна сумме прибавок a(M + 1)
            + … + a(N). Сумма начинается с M + 1 — всё, что накоплено до F(M),
            вычитается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obshchee-neizvestnoe",
      navLabel: "Общее неизвестное",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если значений несколько и они вычитаются с множителями?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Обозначить самое маленькое значение буквой, выразить через неё
              остальные и проверить, что буква сократится.
            </strong>{" "}
            Пусть F(n) = 1 при n ≤ 2; F(n) = F(n − 2) + n при n {">"} 2. Найдём
            3 · F(30) − F(28) − F(26) − F(24).
          </Typography.Text>
          <Typography.Text>
            Обозначим X = F(24). Тогда F(26) = X + 26, F(28) = X + 26 + 28 = X +
            54, F(30) = X + 26 + 28 + 30 = X + 84. Подставляем:
          </Typography.Text>
          <Typography.Text>
            3(X + 84) − (X + 54) − (X + 26) − X = 3X + 252 − X − 54 − X − 26 − X
            = 172.
          </Typography.Text>
          <Typography.Text>
            Все X сократились: три со знаком плюс и три со знаком минус. Значит,
            ответ не зависит от F(24) — его и не нужно считать.
          </Typography.Text>
          <Typography.Text>
            Если бы X не сократился, пришлось бы считать F(24) по-настоящему.
            Заменять неизвестное значение нулём или единицей «для удобства»
            нельзя.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vetvi-i-sokrashchenie",
      navLabel: "Ветви и сокращение",
      explanation: (
        <>
          <Typography.Text>А если у функции ветви по чётности?</Typography.Text>
          <Typography.Text>
            <strong>
              Раскрывать так же, но формулу выбирать для каждого аргумента — и
              только для тех аргументов, что встретились по пути.
            </strong>{" "}
            Пусть F(1) = F(2) = 1, а при n {">"} 2: F(n) = 3 · F(n − 2), если n
            нечётно; F(n) = 2n · F(n − 1) + F(n − 3), если n чётно. Найдём F(12)
            / F(7):
          </Typography.Text>
          <ol>
            <li>12 чётное: F(12) = 24 · F(11) + F(9).</li>
            <li>
              11 и 9 нечётные: F(11) = 3 · F(9) = 9 · F(7), F(9) = 3 · F(7).
            </li>
            <li>Подставляем: F(12) = 24 · 9 · F(7) + 3 · F(7) = 219 · F(7).</li>
          </ol>
          <Typography.Text>
            Значит, F(12) / F(7) = 219. Понадобились только аргументы 12, 11, 9
            и 7 — считать все значения от 1 до 12 не пришлось.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "arifmetika",
      navLabel: "Точная арифметика",
      explanation: (
        <>
          <Typography.Text>
            Когда деление в Python может подвести?
          </Typography.Text>
          <Typography.Text>
            <strong>
              <Notation>{"/"}</Notation> всегда даёт дробное число с
              ограниченной точностью, а <Notation>{"//"}</Notation> — целую
              часть частного. Поэтому <Notation>{"//"}</Notation> ставят там,
              где деление нацело, а дробные промежуточные значения считают
              точно.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В задаче темы деление нацело, и <Notation>{"//"}</Notation> даёт
            точный ответ. Если в условии спрашивают целую часть частного, это
            тоже <Notation>{"//"}</Notation>. А вот пример, где промежуточное
            значение дробное: G(n) = n / 2 при n ≥ 10; G(n) = 1 + G(n + 3) при n{" "}
            {"<"} 10. Найдём 2 · G(2).
          </Typography.Text>
          <Typography.Text>
            G(2) = 1 + G(5) = 2 + G(8) = 3 + G(11), а G(11) = 11 / 2 = 5,5.
            Значит, G(2) = 8,5 и 2 · G(2) = 17.
          </Typography.Text>
          <Typography.Text>
            Если в базе заменить / на <Notation>{"//"}</Notation>, получится 11
            // 2 = 5, G(2) = 8 и ответ 16 — неверный. Целый ответ задачи не
            значит, что все деления по пути — нацело. Точно дроби считает{" "}
            <PythonTerm term="fraction">
              <Notation>{"Fraction"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "from fractions import Fraction\n\n\ndef G(n):\n    if n >= 10:\n        return Fraction(n, 2)\n    return 1 + G(n + 3)\n\n\nprint(2 * G(2))"
            }
            label={"Дробь в базе — через Fraction"}
            language="python"
            output={"17"}
            collapsible={false}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: степень и ^">
            <Typography.Text>
              Если в условии n², в Python это <Notation>{"n ** 2"}</Notation>.
              Запись <Notation>{"n ^ 2"}</Notation> — совсем другая операция над
              двоичными разрядами, и ошибки Python не покажет.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "bolshie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Отношение",
                note: <>расписать до самого маленького значения и сократить</>,
              },
              { key: "Задача темы", note: <>(2026 + 3) · 2025 = 4 108 725</> },
              {
                key: "Разность",
                note: <>остаются прибавки a(M + 1) + … + a(N)</>,
              },
              {
                key: "Несколько значений",
                note: <>общее неизвестное X должно сократиться</>,
              },
              {
                key: "Ветви",
                note: (
                  <>раскрывать только нужные аргументы, ветвь — по каждому</>
                ),
              },
              {
                key: "Деление",
                note: (
                  <>
                    <Notation>{"//"}</Notation> — нацело и целая часть,{" "}
                    <Notation>{"Fraction"}</Notation> — для дробей
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "cepochki",
      navLabel: "Цепочки с шагом",
      explanation: (
        <>
          <Typography.Text>
            Что если аргумент уменьшается не на 1, а сразу на 3?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда от каждого n идёт своя цепочка аргументов. Считаем, сколько
              в ней переходов до базы и на каком числе она в базу попадёт.
            </strong>{" "}
            Пусть F(n) = n при n ≤ 5; F(n) = F(n − 3) + 4 при n {">"} 5.
          </Typography.Text>
          <Typography.Text>
            F(20): аргументы 20, 17, 14, 11, 8, 5 — пять переходов по 4. F(20) =
            F(5) + 5 · 4 = 25. А у F(21) цепочка другая: 21, 18, 15, 12, 9, 6, 3
            — шесть переходов, и попадает она в 3. F(21) = 3 + 6 · 4 = 27.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recChains3_5_le}
            caption={
              <>
                Шаг −3: цепочка от 20 входит в базу n ≤ 5 ровно в 5 после 5
                переходов, цепочка от 21 — в 3 после 6 переходов. Конец цепочки
                зависит от остатка при делении на 3.
              </>
            }
          />
          <Typography.Text>
            Поэтому нельзя считать, что цепочка всегда закончится на границе
            базы: у каждого остатка от деления на шаг — свой конец.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: число переходов формулой"
          >
            <Typography.Text>
              После k переходов аргумент равен n − 3k. Нужно наименьшее k, при
              котором n − 3k ≤ 5, то есть k ≥ (n − 5) / 3 с округлением вверх. В
              Python: <Notation>{"k = (n - 5 + 2) // 3"}</Notation> — прибавка 2
              перед делением на 3 и даёт округление вверх. Но сначала уверенно
              считай переходы по цепочке: формула только сокращает понятное
              рассуждение.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "raznye-cepochki",
      navLabel: "Разность разных цепочек",
      explanation: (
        <>
          <Typography.Text>
            Что делать с разностью, если аргументы лежат на разных цепочках?
            Например: F(n) = n при n ≥ 1000; F(n) = n + F(n + 2) при n {"<"}{" "}
            1000. Найдём F(11) − F(10).
          </Typography.Text>
          <Typography.Text>
            <strong>
              От 11 аргумент идёт по нечётным числам, от 10 — по чётным, и
              общего значения у них нет. Тогда обе суммы расписывают целиком и
              вычитают слагаемые парами.
            </strong>
          </Typography.Text>
          <Typography.Text>
            F(11) = 11 + 13 + … + 999 + F(1001) = 11 + 13 + … + 999 + 1001.
            F(10) = 10 + 12 + … + 998 + F(1000) = 10 + 12 + … + 998 + 1000.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recPairs10_1000}
            caption={
              <>
                Под каждым слагаемым F(11) стоит слагаемое F(10), меньшее на 1.
                Пар 495, и базы тоже отличаются на 1.
              </>
            }
          />
          <Typography.Text>
            Пар столько, сколько чисел 10, 12, …, 998: (998 − 10) / 2 + 1 = 495.
            Каждая пара даёт 1, и базы 1001 и 1000 — ещё 1. Ответ: 495 + 1 =
            496.
          </Typography.Text>
          <Typography.Text>
            Программой такую задачу решают так же, как задачу темы: поднять
            предел глубины или прогреть кеш — здесь по убыванию, от базы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dve-funkcii-navstrechu",
      navLabel: "Две функции в разные стороны",
      explanation: (
        <>
          <Typography.Text>
            А если одна функция переходит в другую и их аргументы движутся в
            разные стороны?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пройти цепочку первой функции до места, где она передаёт работу
              второй, и дальше идти по цепочке второй.
            </strong>{" "}
            Пусть F(n) = F(n − 4) + 20 при n ≥ 12; F(n) = 3 · (G(n − 2) − 1) при
            n {"<"} 12; G(n) = n при n ≥ 30; G(n) = G(n + 7) + 2 при n {"<"} 30.
            Найдём F(39).
          </Typography.Text>
          <ol>
            <li>
              F идёт вниз: 39, 35, 31, 27, 23, 19, 15, 11 — семь переходов по
              20, F(39) = F(11) + 140.
            </li>
            <li>При n = 11 правило другое: F(11) = 3 · (G(9) − 1).</li>
            <li>
              G идёт вверх: 9, 16, 23, 30 — три перехода по 2, G(9) = G(30) + 6
              = 36.
            </li>
            <li>F(11) = 3 · (36 − 1) = 105, F(39) = 105 + 140 = 245.</li>
          </ol>
          <Typography.Text>
            Заметь: 140, накопленные на шагах F, не попадают под умножение на 3
            — оно действует только внутри F(11).
          </Typography.Text>
          <CodeBlock
            code={
              "def G(n):\n    if n >= 30:\n        return n\n    return G(n + 7) + 2\n\n\ndef F(n):\n    if n >= 12:\n        return F(n - 4) + 20\n    return 3 * (G(n - 2) - 1)\n\n\nprint(F(39))"
            }
            label={"Две функции в разные стороны"}
            language="python"
            output={"245"}
            collapsible={false}
          />
        </>
      ),
    },
    {
      id: "perebor-n",
      navLabel: "Перебор n",
      explanation: (
        <>
          <Typography.Text>
            Что если спрашивают не значение, а аргумент — сколько n подходит или
            какое n наименьшее?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда функцию вызывают для каждого n по очереди: считают
              подходящие или останавливаются на первом.
            </strong>{" "}
            Пусть F(0) = 0; F(n) = F(n // 2) + n % 2 при n {">"} 0. Сколько
            чисел от 1 до 63 дают F(n) = 2?
          </Typography.Text>
          <CodeBlock
            code={
              "def F(n):\n    if n == 0:\n        return 0\n    return F(n // 2) + n % 2\n\n\ncount = 0\nfor n in range(1, 64):\n    if F(n) == 2:\n        count += 1\nprint(count)"
            }
            label={"Сколько n подходит"}
            language="python"
            output={"15"}
            collapsible={false}
          />
          <Typography.Text>
            Аргумент здесь каждый раз делится пополам, поэтому вызовы короткие.
            Почему ответ 15, можно понять и без программы — это в{" "}
            <SubtopicLink routeSlug={R} subtopic="chto-schitaet-funktsiya">
              дополнительном уроке
            </SubtopicLink>
            .
          </Typography.Text>
          <Typography.Text>
            Наименьшее n ищут циклом{" "}
            <PythonTerm term="while">
              <Notation>{"while"}</Notation>
            </PythonTerm>
            : он увеличивает n, пока условие не выполнено. Для функции задачи
            темы найдём наименьшее n, при котором F(n) {">"} 1 000 000 000:
          </Typography.Text>
          <CodeBlock
            code={
              "def F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\n\nn = 1\nwhile F(n) <= 10**9:\n    n += 1\nprint(n)"
            }
            label={"Наименьшее n"}
            language="python"
            output={"13"}
            collapsible={false}
          />
          <Typography.Text>
            Цикл остановился на первом подходящем n — оно и наименьшее: F(12) =
            479 001 600, а F(13) = 6 227 020 800.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: когда можно остановиться"
          >
            <Typography.Text>
              Останавливаться на первом n с F(n) {">"} K можно, только если
              функция не убывает. У функции с ветвями из подтемы 1 F(4) = 6, а
              F(5) = 4: после большого значения может прийти меньшее. Если
              спрашивают F(n) = K, ищут первое точное совпадение, а границу
              перебора берут из условия, а не придумывают.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "cepochki-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Шаг больше 1",
                note: <>у каждого остатка своя цепочка, считаем переходы</>,
              },
              {
                key: "Конец цепочки",
                note: <>не обязательно на границе базы</>,
              },
              {
                key: "Разные цепочки",
                note: <>расписать обе суммы и вычесть слагаемые парами</>,
              },
              {
                key: "Две функции",
                note: (
                  <>
                    цепочка одной, потом другой; прибавки внешних шагов — вне
                    скобок
                  </>
                ),
              },
              { key: "Сколько n", note: <>цикл со счётчиком</> },
              { key: "Наименьшее n", note: <>while до первого подходящего</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "cifry-chisla",
      navLabel: "Цифры числа",
      explanation: (
        <>
          <Typography.Text>
            Что считает функция, в которой аргумент делится на 10? Это
            дополнительный урок: такие задачи встречаются в сборниках, но на
            экзаменах их пока не было.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Деление на основание системы счисления снимает с числа последнюю
              цифру, а остаток — это и есть эта цифра.
            </strong>{" "}
            Для 472: <Notation>{"472 // 10"}</Notation> = 47 — число без
            последней цифры, <Notation>{"472 % 10"}</Notation> = 2 — последняя
            цифра (<PythonTerm term="intdiv">целая часть и остаток</PythonTerm>
            ).
          </Typography.Text>
          <Typography.Text>
            Теперь функция: F(0) = 0; F(n) = F(n // 10) + n % 10 при n {">"} 0.
            Для 472: F(472) = F(47) + 2, F(47) = F(4) + 7, F(4) = F(0) + 4.
            Итого F(472) = 4 + 7 + 2 = 13 — это <strong>сумма цифр</strong>.
          </Typography.Text>
          <Typography.Text>
            То же для любого основания b: <Notation>{"n // b"}</Notation>{" "}
            снимает последнюю цифру записи в системе b,{" "}
            <Notation>{"n % b"}</Notation> — эта цифра. Частые случаи при базе
            F(0) = 0:
          </Typography.Text>
          <VariantPicker
            label={"Правило для n > 0 и что считает функция"}
            variants={[
              {
                label: "F(n // 10) + n % 10",
                value: <>Сумма десятичных цифр</>,
              },
              {
                label: "F(n // 2) + n % 2",
                value: <>Количество единиц в двоичной записи</>,
              },
              {
                label: "1 + F(n // 10)",
                value: <>Количество десятичных цифр положительного числа</>,
              },
              {
                label: "1 + F(n // b)",
                value: <>Количество цифр в системе с основанием b</>,
              },
            ]}
          />
          <Typography.Text>
            В условии вместо <Notation>{"n // 10"}</Notation> и{" "}
            <Notation>{"n % 10"}</Notation> могут написать n div 10 и n mod 10 —
            смысл тот же.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dvoichnye-cifry",
      navLabel: "Двоичные единицы",
      explanation: (
        <>
          <Typography.Text>
            Как без перебора посчитать, сколько чисел дают F(n) = 2 для F(n) =
            F(n // 2) + n % 2?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Функция считает единицы в двоичной записи. Значит, нужно сосчитать
              записи с двумя единицами — выбрать для них две позиции.
            </strong>{" "}
            Например, 27 = 11011₂, и F(27) = 4.
          </Typography.Text>
          <Typography.Text>
            В подтеме 5 перебор дал 15 чисел от 1 до 63. Все эти числа
            записываются шестью двоичными цифрами, если дописать нули слева: 63
            = 111111₂. Первую позицию для единицы можно выбрать шестью
            способами, вторую — пятью. Но так каждая пара посчитана дважды — в
            одном порядке и в другом. Поэтому 6 · 5 / 2 = 15.
          </Typography.Text>
          <Typography.Text>
            Иногда ту же функцию задают по-другому: F(n) = F(n / 2) при чётном n{" "}
            {">"} 0 и F(n) = 1 + F(n − 1) при нечётном n. Нечётное число
            оканчивается единицей: её отнимают и считают, а чётное делят на 2 —
            снимают ноль. Смысл тот же: количество двоичных единиц.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vklad-cifry",
      navLabel: "Вклад цифры",
      explanation: (
        <>
          <Typography.Text>
            А если функция учитывает не все цифры? Например: F(0) = 0; при n{" "}
            {">"} 0 F(n) = F(n // 10) + n % 10, если n чётно, и F(n) = F(n //
            10), если n нечётно.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разбери, что каждая цифра добавляет к ответу, — её вклад.
            </strong>{" "}
            Чётность числа определяет последняя цифра. Чётная цифра
            прибавляется, нечётная пропускается, затем цифра снимается. Значит,
            функция считает <strong>сумму чётных цифр</strong>.
          </Typography.Text>
          <Typography.Text>
            Когда F(n) = 0? Когда в записи нет ни одной положительной чётной
            цифры: разрешены 0, 1, 3, 5, 7, 9. Ноль разрешён — он ничего не
            добавляет. Посчитаем трёхзначные числа с такой записью:
          </Typography.Text>
          <ul>
            <li>первая цифра — 1, 3, 5, 7 или 9: пять вариантов;</li>
            <li>вторая — любая из шести разрешённых;</li>
            <li>третья — тоже любая из шести.</li>
          </ul>
          <Typography.Text>
            Всего 5 · 6 · 6 = 180: каждый выбор первой цифры сочетается с каждым
            выбором второй и третьей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perenos",
      navLabel: "Перенос при n + 1",
      explanation: (
        <>
          <Typography.Text>
            Как сравнить сумму цифр n и n + 1, не считая их?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если последняя цифра меньше 9, сумма цифр растёт на 1. Если n
              оканчивается девятками, они превращаются в нули, и сумма падает.
            </strong>{" "}
            Например, 243 → 244: сумма 9 → 10. А 2399 → 2400:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.recCarry2399}
            caption={
              <>
                2399 → 2400: две девятки в конце стали нулями (по −9), тройка
                перед ними стала четвёркой (+1). Сумма цифр 23 → 6, изменение 1
                − 9 · 2 = −17.
              </>
            }
          />
          <Typography.Text>
            Если в конце n стоят t девяток, F(n + 1) = F(n) + 1 − 9t. Значит,
            F(n) {">"} F(n + 1) ровно тогда, когда n оканчивается на 9.
          </Typography.Text>
          <Typography.Text>
            Теперь вместо перебора огромного диапазона достаточно сосчитать
            числа 9, 19, 29, … На отрезке [L, R] при L ≥ 1 их{" "}
            <Notation>{"(R + 1) // 10 - L // 10"}</Notation>. Для 123 ≤ n ≤ 987
            это 98 − 12 = 86. Сверим с перебором:
          </Typography.Text>
          <CodeBlock
            code={
              "def F(n):\n    if n == 0:\n        return 0\n    return F(n // 10) + n % 10\n\n\ncount = 0\nfor n in range(123, 988):\n    if F(n) > F(n + 1):\n        count += 1\nprint(count, 988 // 10 - 123 // 10)"
            }
            label={"Сверка с перебором"}
            language="python"
            output={"86 86"}
            collapsible={false}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: откуда формула">
            <Typography.Text>
              Чисел, оканчивающихся на 9 и не больших R, ровно (R + 1) // 10:
              каждый полный десяток содержит одно такое. Из них вычитаем те, что
              меньше L, — их L // 10.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "tablica-vkladov",
      navLabel: "Таблица вкладов",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если вклад цифры не равен самой цифре?
          </Typography.Text>
          <Typography.Text>
            <strong>Составь таблицу вкладов и рассуждай по ней.</strong>{" "}
            Например, функция делит аргумент на 4 и по остатку добавляет: 0 → 0,
            1 → 1, 2 → 1, 3 → 2. Это сумма вкладов четверичных цифр:
          </Typography.Text>
          <LessonTable
            label={"Вклады четверичных цифр"}
            columns={[
              { label: "Цифра" },
              { label: "0", numeric: true },
              { label: "1", numeric: true },
              { label: "2", numeric: true },
              { label: "3", numeric: true },
            ]}
            rows={[["Вклад", "0", "1", "1", "2"]]}
          />
          <Typography.Text>
            При n + 1 тройки в конце превращаются в нули — каждая такая замена
            уменьшает F на 2. Цифра перед ними растёт на 1: 0 → 1 даёт +1, 1 → 2
            — ничего, 2 → 3 — снова +1.
          </Typography.Text>
          <Typography.Text>
            Найдём наименьшее n, для которого F(n) = 7, а F(n + 1) = 4. F должно
            упасть на 3: две тройки в конце дадут −4, а рост цифры перед ними 2
            → 3 добавит 1. Окончание 233₄ даёт вклад 1 + 2 + 2 = 5, до 7 не
            хватает 2 — это одна цифра 3 впереди. Получаем n = 3233₄.
          </Typography.Text>
          <Typography.Text>
            Проверка: F(n) = 2 + 1 + 2 + 2 = 7; n + 1 = 3300₄, F(n + 1) = 2 + 2
            = 4. В десятичной записи 3233₄ = 3 · 64 + 2 · 16 + 3 · 4 + 3 = 239.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: почему не 033₄">
            <Typography.Text>
              Окончание 033₄ тоже даёт падение на 3, но его вклад 0 + 2 + 2 = 4,
              и до 7 не хватает 3. Одной цифрой вклад 3 не набрать — число
              выйдет длиннее, а значит, больше 239.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "schitaet-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: (
                  <>
                    <Notation>{"n // b"}</Notation>,{" "}
                    <Notation>{"n % b"}</Notation>
                  </>
                ),
                note: <>снять последнюю цифру записи в системе b и взять её</>,
              },
              {
                key: "F(n // 2) + n % 2",
                note: <>количество двоичных единиц</>,
              },
              {
                key: "Две единицы из k позиций",
                note: <>k · (k − 1) / 2 чисел</>,
              },
              {
                key: "Разрешённые цифры",
                note: <>количество — произведение вариантов по позициям</>,
              },
              {
                key: "Сумма цифр n + 1",
                note: <>F(n) + 1 − 9t, где t — девятки в конце</>,
              },
              { key: "Вклады", note: <>таблица «цифра → сколько добавляет»</> },
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
              Задача темы — (F(2026) + 3 · F(2025)) / F(2024) для F(n) = n · F(n
              − 1) — прошла через подтемы, и каждая решала её новым способом.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 4"}
          />
          <Typography.Text>
            Три способа — рекурсия, таблица и сокращение — дали одно число и
            проверяют друг друга. Подтема 5 добавляет цепочки с шагом больше
            единицы и поиск n, а дополнительный урок — функции, которые что-то
            считают, например сумму цифр.
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
            Сверху — путь от определения к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 16 на одной схеме"}
            flow={[
              { name: "Правила", note: "база, шаг, ветви" },
              { name: "Способ", note: "программа или раскрыть и сократить" },
              { name: "Ответ", note: "значение, выражение или n" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="funktsiya-cherez-sebya">
                    Функция, заданная через себя
                  </Sub>
                ),
                rows: [
                  { key: <>база</>, note: <>значение, известное сразу</> },
                  {
                    key: <>F(n − 1)</>,
                    note: <>значение для аргумента n − 1, не F(n) − 1</>,
                  },
                  { key: <>ветви</>, note: <>выбирают в каждом вызове</> },
                ],
              },
              {
                number: 2,
                title: (
                  <Sub slug="rekursivnaya-funktsiya">
                    Рекурсивная функция на Python
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"return n * F(n - 1)"}</Notation>,
                    note: <>определение как есть</>,
                  },
                  {
                    key: <Notation>{"sys.setrecursionlimit"}</Notation>,
                    note: <>для аргументов в тысячи</>,
                  },
                  {
                    key: <Notation>{"//"}</Notation>,
                    note: <>деление нацело — ответ целым числом</>,
                  },
                ],
              },
              {
                number: 3,
                title: (
                  <Sub slug="povtornye-vyzovy">Повторные вызовы и таблица</Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"@cache"}</Notation>,
                    note: <>каждое значение считается один раз</>,
                  },
                  {
                    key: <>таблица</>,
                    note: <>f[n] = F(n) циклом от базы</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="bolshie-argumenty">Раскрыть и сократить</Sub>,
                rows: [
                  {
                    key: <>отношение</>,
                    note: <>раскрыть до общего множителя</>,
                  },
                  { key: <>разность</>, note: <>остаются прибавки</> },
                ],
              },
              {
                number: 5,
                title: (
                  <Sub slug="cepochki-i-perebor">
                    Цепочки до базы и перебор n
                  </Sub>
                ),
                rows: [
                  {
                    key: <>шаг k</>,
                    note: <>своя цепочка и свой конец по остатку</>,
                  },
                  {
                    key: <>поиск n</>,
                    note: <>перебор со счётчиком или while</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="chto-schitaet-funktsiya">Что считает функция</Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <Notation>{"F(n // b) + n % b"}</Notation>,
                    note: <>сумма цифр в системе b</>,
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
              Любое задание 16 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — способ: аргументы в тысячи с отношением или
                разностью удобнее раскрыть и сократить, остальное — программой
                по определению. Проверка — вторым способом на маленьких n.
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
                label: "F(n) − 1",
                value: (
                  <FinalMistake
                    wrong="вместо F(n − 1) посчитали F(n) − 1"
                    right="скобки после F — аргумент"
                    question="что стоит в скобках?"
                  />
                ),
                note: <Sub slug="funktsiya-cherez-sebya">подтема 1</Sub>,
              },
              {
                label: "одна ветвь",
                value: (
                  <FinalMistake
                    wrong="ветвь выбрали один раз по первому аргументу"
                    right="ветвь — в каждом вызове"
                    question="какой аргумент у этого вызова?"
                  />
                ),
                note: <Sub slug="funktsiya-cherez-sebya">подтема 1</Sub>,
              },
              {
                label: "n == 1 в базе",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"if n == 1"}</Notation>}
                    right={<Notation>{"if n <= 1"}</Notation>}
                    question="база в условии — равенство или неравенство?"
                  />
                ),
                note: <Sub slug="rekursivnaya-funktsiya">подтема 2</Sub>,
              },
              {
                label: "RecursionError",
                value: (
                  <FinalMistake
                    wrong="F(2026) без поднятого предела"
                    right="sys.setrecursionlimit или прогрев кеша"
                    question="сколько вызовов в цепочке до базы?"
                  />
                ),
                note: <Sub slug="rekursivnaya-funktsiya">подтема 2</Sub>,
              },
              {
                label: "4108725.0",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"… / F(2024)"}</Notation>}
                    right={<Notation>{"… // F(2024)"}</Notation>}
                    question="ответ должен быть целым?"
                  />
                ),
                note: <Sub slug="rekursivnaya-funktsiya">подтема 2</Sub>,
              },
              {
                label: "считает минуты",
                value: (
                  <FinalMistake
                    wrong="функция с двумя вызовами себя без кеша"
                    right="@cache над функцией"
                    question="не считается ли одно значение много раз?"
                  />
                ),
                note: <Sub slug="povtornye-vyzovy">подтема 3</Sub>,
              },
              {
                label: "IndexError",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"f = [0] * 2026"}</Notation>}
                    right={<Notation>{"f = [0] * 2027"}</Notation>}
                    question="есть ли в списке элемент f[2026]?"
                  />
                ),
                note: <Sub slug="povtornye-vyzovy">подтема 3</Sub>,
              },
              {
                label: "конец цепочки",
                value: (
                  <FinalMistake
                    wrong="цепочку с шагом 3 довели до той же базы"
                    right="конец зависит от остатка — пройти цепочку"
                    question="в какое число упрётся эта цепочка?"
                  />
                ),
                note: <Sub slug="cepochki-i-perebor">подтема 5</Sub>,
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
            Для функции задачи темы найди F(2026) / F(2024).
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2026 · 2025 = 4 102 650: F(2024) сокращается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Почему программа с вызовами F(n − 1) и F(n − 2) считает F(40) долго?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Одни и те же значения считаются снова и снова — вызовов
            экспоненциально много. @cache считает каждое один раз.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Функцию с @cache сразу вызвали для n = 10 000 — и получили
            RecursionError. Что сделать?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Поднять предел глубины или прогреть кеш: вызвать F(n) по очереди от
            маленьких n, тогда каждый вызов уходит вглубь на один шаг.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            F(n) = F(n − 3) + 2 при n {">"} 3, F(n) = n при n ≤ 3. Чему равно
            F(10)?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Цепочка 10 → 7 → 4 → 1: F(1) = 1, плюс три прибавки по 2 — F(10) =
            7.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена тремя способами — ответ 4 108 725. Вот
        что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Правила, способ, программа или сокращение, проверка.</>,
          },
          {
            key: "Программа",
            note: <>Определение как есть, // и предел глубины.</>,
          },
          {
            key: "Скорость",
            note: <>@cache, прогрев или таблица циклом от базы.</>,
          },
          {
            key: "Сокращение",
            note: <>Раскрыть до общего множителя или прибавок.</>,
          },
          {
            key: "Задача темы",
            note: <>(2026 + 3) · 2025 = 4 108 725.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
