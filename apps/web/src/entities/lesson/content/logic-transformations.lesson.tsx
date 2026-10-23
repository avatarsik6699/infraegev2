import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { logicTransformationsLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./logic-transformations.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const THEME_TASK = (
  <>
    «Обозначим через ДЕЛ(n, m) утверждение «натуральное число n делится без
    остатка на натуральное число m». Для какого наибольшего натурального числа A
    формула ДЕЛ(x, A) ∨ ((x ∈ [50; 70]) → ¬ДЕЛ(x, 15)) тождественно истинна (то
    есть принимает значение 1 при любом натуральном значении переменной x)?»
  </>
);

const R = "15-zakony-matematicheskoj-logiki";

export const logicTransformationsLesson = defineLesson({
  ...logicTransformationsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Заменять импликацию на ¬p ∨ q и находить x, при которых всё решает A, — вручную и программой",
    "Находить отрезок A наименьшей или наибольшей длины и собирать конечное множество A",
    "Находить наибольшее или наименьшее значение выражения в области на плоскости",
    "Решать задачи с ДЕЛ через делители, НОК и НОД",
    "Собирать A по битам для формул с поразрядной конъюнкцией",
    "Для редких задач — треугольник, MAX и условия, зависящие от A (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "formula-i-parametr",
      title: "Формула с параметром A",
      lead: "Что спрашивают в задании 15, как вычислить формулу при конкретном x и как найти A — вручную и программой.",
      conceptIds: [
        "kak-ustroena-tema-15",
        "logicheskie-operacii",
        "implikaciya",
        "kogda-reshaet-a",
        "zadacha-temy-programmoj",
        "formula-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Чему равно (x ∈ [50; 70]) ∧ ДЕЛ(x, 15) при x = 45?</>,
          reveal: (
            <>0: 45 делится на 15, но лежит вне отрезка — первая часть ложна.</>
          ),
        },
        {
          id: "zadacha-2",
          prompt: <>Когда импликация p → q ложна?</>,
          reveal: <>Только при p = 1 и q = 0.</>,
        },
        {
          id: "zadacha-3",
          prompt: <>Чему равно 0 → 0?</>,
          reveal: <>1: левая часть ложна — нарушения нет.</>,
        },
        {
          id: "zadacha-4",
          prompt: <>Как записать p → q без стрелки?</>,
          reveal: <>¬p ∨ q.</>,
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              В задаче темы делитель 15 заменили на 25. Какое наибольшее A
              теперь?
            </>
          ),
          reveal: (
            <>
              50: на отрезке [50; 70] единственное кратное 25 — его левый конец
              50, а 75 уже вне отрезка.
            </>
          ),
        },
      ],
    },
    {
      slug: "otrezki-i-mnozhestva",
      title: "Отрезки и множества",
      lead: "Когда A — отрезок или набор чисел: какую часть прямой он обязан накрыть, где ему нельзя быть и какие числа в него взять.",
      conceptIds: [
        "otrezok-naimenshej-dliny",
        "otrezok-naibolshej-dliny",
        "dve-chasti",
        "lozhna-pri-lyubom-x",
        "konechnye-mnozhestva",
        "otrezki-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Какова длина отрезка [12; 30]?</>,
          reveal: <>18 = 30 − 12.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              P = [4; 16], Q = [9; 25]. Какая наименьшая длина A, при которой (x
              ∈ P) → ((x ∈ Q) → (x ∈ A)) тождественно истинна?
            </>
          ),
          reveal: <>7: A должен накрыть общую часть [9; 16].</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              P = [1; 9], Q = [12; 30]. Какая наибольшая длина A, при которой
              ((x ∈ A) → (x ∈ P)) ∨ (x ∈ Q) тождественно истинна?
            </>
          ),
          reveal: <>18: A лежит внутри P или внутри Q, а Q длиннее.</>,
        },
        {
          id: "zadacha-4",
          prompt: <>Может ли отрезок A накрыть [1; 2] и [4; 5], не накрыв 3?</>,
          reveal: <>Нет: у отрезка нет дыр, он накроет и всё между ними.</>,
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              P = {"{1, 3, 5, 7}"}, Q = {"{5, 7, 9}"}. Какое наименьшее
              количество элементов A, при котором ((x ∈ P) ∧ (x ∈ Q)) → (x ∈ A)
              тождественно истинна?
            </>
          ),
          reveal: <>2: обязаны войти 5 и 7 — они есть и в P, и в Q.</>,
        },
      ],
    },
    {
      slug: "koordinatnaya-ploskost",
      title: "Координатная плоскость",
      lead: "Формулы с x и y: в каких точках всё решает A, где выражение наибольшее, строгие знаки и A множителем.",
      access: "paid",
      conceptIds: [
        "tochki-ploskosti",
        "naibolshee-ne-v-uglu",
        "strogie-znaki",
        "naibolshee-a-ploskost",
        "a-mnozhitelem",
        "ploskost-programmoj",
        "ploskost-itogo",
      ],
      paid: {
        outline: [
          { id: "tochki-ploskosti", navLabel: "Точки, где всё решает A" },
          { id: "naibolshee-ne-v-uglu", navLabel: "Не прямоугольная область" },
          { id: "strogie-znaki", navLabel: "Строгие знаки" },
          { id: "naibolshee-a-ploskost", navLabel: "Наибольшее A" },
          { id: "a-mnozhitelem", navLabel: "A множителем" },
          { id: "ploskost-programmoj", navLabel: "Программой" },
          { id: "ploskost-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что меняется, когда в формуле две переменные — x и y? Например:
              для какого наименьшего целого A формула (x ≥ 12) ∨ (y {">"} 5) ∨
              (A {">"} x · y) истинна при любых натуральных x и y?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () =>
          import("./logic-transformations.paid.koordinatnaya-ploskost"),
      },
    },
    {
      slug: "delimost",
      title: "Делимость",
      lead: "ДЕЛ в обе стороны, общие кратные и НОК, несколько кратных на отрезке, A как граница и как набор чисел.",
      access: "paid",
      conceptIds: [
        "del-kto-na-kogo",
        "nok",
        "neskolko-kratnyh",
        "a-granica",
        "a-nabor-chisel",
        "delimost-programmoj",
        "delimost-itogo",
      ],
      paid: {
        outline: [
          { id: "del-kto-na-kogo", navLabel: "Кто на кого делится" },
          { id: "nok", navLabel: "Делится на оба" },
          { id: "neskolko-kratnyh", navLabel: "Несколько кратных" },
          { id: "a-granica", navLabel: "A — граница" },
          { id: "a-nabor-chisel", navLabel: "A — набор чисел" },
          { id: "delimost-programmoj", navLabel: "Программой" },
          { id: "delimost-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Чем ДЕЛ(x, 15) отличается от ДЕЛ(15, x) и что делать, если x
              должен делиться сразу на два числа?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./logic-transformations.paid.delimost"),
      },
    },
    {
      slug: "porazryadnaya-konyunkciya",
      title: "Поразрядная конъюнкция",
      lead: "Что делает x & M, какие биты обязаны быть в наименьшем A и какие разрешены наибольшему.",
      access: "paid",
      conceptIds: [
        "operaciya-i",
        "naimenshee-a-bity",
        "naibolshee-a-bity",
        "bity-programmoj",
        "bity-itogo",
      ],
      paid: {
        outline: [
          { id: "operaciya-i", navLabel: "Операция &" },
          { id: "naimenshee-a-bity", navLabel: "Наименьшее A" },
          { id: "naibolshee-a-bity", navLabel: "Наибольшее A" },
          { id: "bity-programmoj", navLabel: "Программой" },
          { id: "bity-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что значит x & 22 и как собрать A по двоичным разрядам, чтобы
              формула с & была истинна при любом x?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () =>
          import("./logic-transformations.paid.porazryadnaya-konyunkciya"),
      },
    },
    {
      slug: "novye-usloviya",
      title: "Треугольник, MAX и условия с A",
      lead: "Незнакомые условия в формуле: существование треугольника, большее из двух чисел, отрезок и делимость, которые зависят от самого A.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "treugolnik",
        "max-dvuh-chisel",
        "otrezok-s-a",
        "delimost-a",
        "usloviya-itogo",
      ],
      paid: {
        outline: [
          { id: "treugolnik", navLabel: "Треугольник существует" },
          { id: "max-dvuh-chisel", navLabel: "MAX" },
          { id: "otrezok-s-a", navLabel: "Отрезок с концом A" },
          { id: "delimost-a", navLabel: "Делители самого A" },
          { id: "usloviya-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что делать, если в формуле встречается незнакомое условие —
              например, «треугольник со сторонами x, 4 и 7 существует»?
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./logic-transformations.paid.novye-usloviya"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-15",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 15 дана логическая формула с неизвестным числом A. Нужно
            найти A, при котором формула истинна при любом x. Вот задача,
            которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Перебирать все x вручную не нужно: почти при любом x формула
              истинна и без A. Достаточно найти те немногие x, при которых всё
              решает A.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              ["ДЕЛ(x, A)", "x делится на A без остатка"],
              [
                "x ∈ [50; 70]",
                "x лежит на отрезке от 50 до 70, концы тоже входят",
              ],
              ["¬, ∨, →", "логические НЕ, ИЛИ и «если …, то» — разберём ниже"],
              [
                "тождественно истинна",
                "истинна при каждом натуральном x: 1, 2, 3, …",
              ],
              [
                "наибольшее натуральное A",
                "из всех подходящих A — самое большое",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из шести подтем — у каждой своя страница. Идём по ним
            по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Формула с параметром A</strong> — ты сейчас здесь. Здесь
              же решим задачу темы: ответ 60.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="otrezki-i-mnozhestva">
                Отрезки и множества
              </SubtopicLink>{" "}
              — A не число, а отрезок или набор чисел.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="koordinatnaya-ploskost">
                Координатная плоскость
              </SubtopicLink>{" "}
              — две переменные x и y; самый частый вид задачи.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="delimost">
                Делимость
              </SubtopicLink>{" "}
              — ДЕЛ и общие кратные, как в задаче темы.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="porazryadnaya-konyunkciya">
                Поразрядная конъюнкция
              </SubtopicLink>{" "}
              — операция & над двоичными записями.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="novye-usloviya">
                Треугольник, MAX и условия с A
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
          <Typography.Text>
            Почти любую задачу можно решить и вручную, и программой. На экзамене
            подойдёт любой способ, а второй пригодится для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "logicheskie-operacii",
      navLabel: "Логические операции",
      explanation: (
        <>
          <Typography.Text>
            Как узнать, истинна ли формула при конкретном x?
          </Typography.Text>
          <Typography.Text>
            <strong>
              При конкретном x каждое условие либо истинно, либо ложно. Истину
              записывают 1, ложь — 0, а логические операции соединяют эти 0 и 1
              в значение всей формулы.
            </strong>{" "}
            Возьмём x = 55: условие x ∈ [50; 70] истинно — 1, а ДЕЛ(55, 15)
            ложно — 0, ведь 55 на 15 не делится.
          </Typography.Text>
          <LessonTable
            label={"Логические операции"}
            columns={[
              { label: "Запись" },
              { label: "Истинна, когда" },
              { label: "При x = 55" },
            ]}
            rows={[
              ["¬p — «не p»", "p ложно", "¬ДЕЛ(x, 15) = ¬0 = 1"],
              [
                "p ∧ q — «p и q»",
                "истинны обе части",
                "(x ∈ [50; 70]) ∧ ДЕЛ(x, 15) = 1 ∧ 0 = 0",
              ],
              [
                "p ∨ q — «p или q»",
                "истинна хотя бы одна часть",
                "(x ∈ [50; 70]) ∨ ДЕЛ(x, 15) = 1 ∨ 0 = 1",
              ],
              [
                "p → q — «если p, то q»",
                "всегда, кроме случая 1 → 0",
                "(x ∈ [50; 70]) → ДЕЛ(x, 15) = 1 → 0 = 0",
              ],
              [
                "p ≡ q — «p равносильно q»",
                "значения частей одинаковы",
                "(x ∈ [50; 70]) ≡ ДЕЛ(x, 15) = 1 ≡ 0 = 0",
              ],
            ]}
          />
          <Typography.Text>
            С ¬, ∧ и ∨ всё как в обычной речи. На стрелке → ошибаются чаще всего
            — разберём её отдельно.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: порядок действий">
            <Typography.Text>
              Без скобок сначала выполняют ¬, затем ∧, затем ∨, и только потом →
              и ≡. Скобки меняют порядок, как в арифметике. В условиях ЕГЭ
              скобки обычно расставлены полностью — следуй им.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "implikaciya",
      navLabel: "Импликация",
      explanation: (
        <>
          <Typography.Text>Когда ложна формула «если p, то q»?</Typography.Text>
          <Typography.Text>
            <strong>
              Импликация p → q ложна только в одном случае: p истинно, а q
              ложно. Во всех остальных случаях она истинна.
            </strong>{" "}
            Это как обещание «если сдашь экзамен, получишь подарок». Оно
            нарушено, только если экзамен сдан, а подарка нет. Если экзамен не
            сдан, обещание не нарушено — будет подарок или нет.
          </Typography.Text>
          <LessonTable
            label={"Значения p → q"}
            columns={[{ label: "p" }, { label: "q" }, { label: "p → q" }]}
            rows={[
              ["0", "0", "1"],
              ["0", "1", "1"],
              ["1", "0", "0 — единственная ложь"],
              ["1", "1", "1"],
            ]}
          />
          <Typography.Text>
            Отсюда удобная замена:{" "}
            <strong>p → q — то же самое, что ¬p ∨ q.</strong> Обе формулы ложны
            только при p = 1 и q = 0. Заменим так стрелку в задаче темы:
          </Typography.Text>
          <Typography.Text>
            (x ∈ [50; 70]) → ¬ДЕЛ(x, 15) = ¬(x ∈ [50; 70]) ∨ ¬ДЕЛ(x, 15).
          </Typography.Text>
          <Typography.Text>
            Теперь вся формула задачи — три части, соединённые через ИЛИ: ДЕЛ(x,
            A) ∨ ¬(x ∈ [50; 70]) ∨ ¬ДЕЛ(x, 15).
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: отрицание скобки">
            <Typography.Text>
              Отрицание скобки меняет ∧ на ∨ и наоборот — это законы де Моргана:
              ¬(p ∧ q) = ¬p ∨ ¬q и ¬(p ∨ q) = ¬p ∧ ¬q. Например, «неверно, что x
              на отрезке и делится на 15» — это «x вне отрезка или не делится на
              15». А два отрицания подряд снимают друг друга: ¬¬p = p.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "kogda-reshaet-a",
      navLabel: "Когда всё решает A",
      explanation: (
        <>
          <Typography.Text>
            Как найти A, не проверяя все x подряд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Формула из частей через ИЛИ истинна, если истинна хоть одна часть.
              Поэтому A влияет на ответ только при тех x, где все части без A
              ложны: там часть с A обязана быть истинной.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В задаче темы части без A — ¬(x ∈ [50; 70]) и ¬ДЕЛ(x, 15). Обе
            ложны, когда x лежит на отрезке и делится на 15. Такое x одно — 60:
            соседние кратные 45 и 75 лежат вне отрезка.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfSet45_75_50x70andDELx15_6cca78}
            caption={
              <>
                Кратные 15 рядом с отрезком [50; 70]. 45 и 75 лежат вне его —
                для них формула истинна и без A. На отрезке только 60.
              </>
            }
          />
          <LessonTable
            label={"Что формула требует от A при разных x"}
            columns={[
              { label: "x" },
              { label: "Части без A" },
              { label: "Что нужно от A" },
            ]}
            rows={[
              ["7", "¬(7 ∈ [50; 70]) = 1", "ничего: формула уже истинна"],
              ["55", "¬ДЕЛ(55, 15) = 1", "ничего"],
              ["75", "¬(75 ∈ [50; 70]) = 1", "ничего"],
              ["60", "обе равны 0", "ДЕЛ(60, A) = 1: 60 делится на A"],
            ]}
          />
          <Typography.Text>
            <strong>Значит, A должно быть делителем 60.</strong> Самый большой
            делитель 60 — само 60. Ответ задачи темы — 60.
          </Typography.Text>
          <Typography.Text>
            Проверим. При A = 60 формула истинна при x = 60, а при всех
            остальных x её делают истинной части без A. А любое A больше 60 не
            делит 60 — при x = 60 формула ложна.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy-programmoj",
      navLabel: "Задача темы программой",
      explanation: (
        <>
          <Typography.Text>
            Как получить тот же ответ программой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Программа делает то, что написано в условии: для каждого кандидата
              A проверяет формулу при всех x из большого диапазона и запоминает
              подходящие A.
            </strong>{" "}
            Сначала формулу переводят на Python — каждому знаку соответствует
            своя запись:
          </Typography.Text>
          <LessonTable
            label={"Запись формулы на Python"}
            columns={[{ label: "В условии" }, { label: "На Python" }]}
            rows={[
              ["ДЕЛ(x, A)", <Notation key="del">{"x % A == 0"}</Notation>],
              [
                "¬ДЕЛ(x, 15)",
                <Notation key="notdel">{"x % 15 != 0"}</Notation>,
              ],
              [
                "x ∈ [50; 70]",
                <Notation key="seg">{"50 <= x <= 70"}</Notation>,
              ],
              ["¬p", <Notation key="not">{"not p"}</Notation>],
              ["p ∧ q", <Notation key="and">{"p and q"}</Notation>],
              ["p ∨ q", <Notation key="or">{"p or q"}</Notation>],
              ["p → q", <Notation key="imp">{"imp(p, q)"}</Notation>],
              ["p ≡ q", <Notation key="eq">{"p == q"}</Notation>],
            ]}
          />
          <Typography.Text>
            Для стрелки готового знака нет, поэтому заведём{" "}
            <PythonTerm term="def">функцию</PythonTerm>{" "}
            <Notation>{"imp(p, q)"}</Notation> — она возвращает ¬p ∨ q. Формулу
            задачи запишем функцией <Notation>{"f(x, A)"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "def imp(p, q):\n    return (not p) or q\n\n\ndef f(x, A):\n    return x % A == 0 or imp(50 <= x <= 70, x % 15 != 0)"
            }
            label={"Формула задачи темы"}
            language="python"
          />
          <Typography.Text>
            Теперь переберём кандидатов A и для каждого проверим все x:
          </Typography.Text>
          <CodeBlock
            code={
              "answer = 0\nfor A in range(1, 1000):\n    if all(f(x, A) for x in range(1, 1000)):\n        answer = A\nprint(answer)"
            }
            label={"Задача темы перебором A и x"}
            language="python"
            output={"60"}
          />
          <Typography.Text>
            <PythonTerm term="anyall">
              <Notation>{"all(...)"}</Notation>
            </PythonTerm>{" "}
            истинно, только если <Notation>{"f(x, A)"}</Notation> истинна при
            каждом x от 1 до 999. Кандидаты A идут по возрастанию, поэтому
            последнее запомненное A — наибольшее.
          </Typography.Text>
          <Typography.Text>
            Почему x до 999 хватает? Вне отрезка [50; 70] формула истинна сама —
            все x, где решает A, лежат внутри диапазона. Диапазон берут с
            запасом, чтобы он накрыл все числа условия.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: наименьшее A и запись через <="
          >
            <Typography.Text>
              Если спрашивают наименьшее A, печатают первое подходящее и
              останавливают цикл:
            </Typography.Text>
            <CodeBlock
              code={
                "for A in range(1, 1000):\n    if all(f(x, A) for x in range(1, 1000)):\n        print(A)\n        break"
              }
              label={"Первое подходящее A"}
              language="python"
            />
            <Typography.Text>
              В разборах стрелку часто пишут как <Notation>{"p <= q"}</Notation>
              : для True и False это совпадает с импликацией. Но сравнение
              выполняется раньше not, and и or, и без лишних скобок легко
              ошибиться — функция <Notation>{"imp"}</Notation> надёжнее.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "formula-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Формула при x",
                note: <>каждое условие — 1 или 0</>,
              },
              { key: "p → q", note: <>ложна только при 1 → 0; это ¬p ∨ q</> },
              {
                key: "Части через ИЛИ",
                note: <>истинна, если истинна хоть одна часть</>,
              },
              {
                key: "Когда решает A",
                note: <>все части без A ложны — часть с A обязана быть 1</>,
              },
              {
                key: "Задача темы",
                note: <>решает только x = 60 → A делит 60 → 60</>,
              },
              {
                key: "Python",
                note: (
                  <>
                    <Notation>{"imp"}</Notation>,{" "}
                    <Notation>{"f(x, A)"}</Notation>,{" "}
                    <Notation>{"all(...)"}</Notation> по всем x
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "otrezok-naimenshej-dliny",
      navLabel: "Наименьший отрезок",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если A — не число, а отрезок на числовой прямой?
            Например:
          </Typography.Text>
          <Typography.Text>
            «На числовой прямой даны отрезки P = [10; 40] и Q = [25; 55].
            Укажите наименьшую возможную длину такого отрезка A, что формула (x
            ∈ P) → ((x ∈ Q) → (x ∈ A)) тождественно истинна — при любом x».
          </Typography.Text>
          <Typography.Text>
            <strong>
              Вопрос тот же — при каких x всё решает A. Только теперь x — любое
              число на прямой, и ответ — участок прямой, который A обязан
              накрыть.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для краткости пишут P вместо x ∈ P, так же Q и A. Заменим обе
            стрелки: P → (Q → A) = ¬P ∨ ¬Q ∨ A. Части без A ложны, когда x лежит
            и в P, и в Q — на их общей части [25; 40]. Там x обязан лежать в A.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfLine1040_2555_aornotpornotq_0_60_05a39d}
            caption={
              <>
                Над осью — отрезки P и Q, под осью — что формула требует от A.
                Обязательна общая часть [25; 40]; в остальных точках A может
                быть, а может не быть.
              </>
            }
          />
          <Typography.Text>
            Наименьший отрезок, который накрывает [25; 40], — он сам.{" "}
            <strong>Длина отрезка — разность его концов</strong>: 40 − 25 = 15.
            Ответ — 15.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: длина и целые точки, концы отрезков"
          >
            <Typography.Text>
              На отрезке [25; 40] шестнадцать целых чисел, но длина у него 15 —
              в задании спрашивают именно длину. Концы входят в отрезок: точка
              25 лежит и в P, и в Q, поэтому тоже обязана быть в A.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "otrezok-naibolshej-dliny",
      navLabel: "Наибольший отрезок",
      explanation: (
        <>
          <Typography.Text>
            А если A стоит слева от стрелки и спрашивают наибольшую длину? Пусть
            P = [5; 20], Q = [30; 50], а формула ((x ∈ A) → (x ∈ P)) ∨ (x ∈ Q)
            должна быть истинна при любом x.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Когда A стоит в формуле с отрицанием, в точках, где всё решает A,
              оно должно быть ложным: такие точки в A брать нельзя. Тогда ищут,
              где A разрешено быть.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Заменим стрелку: ¬A ∨ P ∨ Q. Части без A ложны, когда x не лежит ни
            в P, ни в Q. Там нужно ¬A = 1, то есть x не лежит в A. Значит, A
            может занимать только точки из P и Q.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfLine520_3050_notaorporq_0_56_dffc43}
            caption={
              <>
                Пунктир — точки, где A быть не может. Отрезок A помещается
                целиком в P или целиком в Q; Q длиннее.
              </>
            }
          />
          <Typography.Text>
            Отрезок не может перепрыгнуть промежуток между P и Q — тогда он
            захватит запрещённые точки. Наибольший подходящий отрезок — Q = [30;
            50] длины 20. Ответ — 20.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dve-chasti",
      navLabel: "Две обязательные части",
      explanation: (
        <>
          <Typography.Text>
            Что, если обязательных участков два и они не касаются? Пусть P = [3;
            6], Q = [14; 19], и при любом x истинна формула ((x ∈ P) ∨ (x ∈ Q))
            → (x ∈ A). Найдём наименьшую длину A.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Отрезок A — один кусок без дыр. Если он обязан накрыть две части,
              он накрывает и промежуток между ними.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Стрелка: ¬(P ∨ Q) ∨ A. Часть без A ложна, когда x лежит в P или в Q.
            Значит, A должен накрыть и [3; 6], и [14; 19].
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfLine36_1419_impporqa_0_22_d6ee8f}
            caption={
              <>
                Обязательны обе части. Промежутку между ними формула ничего не
                требует, но без него A не будет отрезком.
              </>
            }
          />
          <Typography.Text>
            Одним куском это отрезок от 3 до 19, его длина 19 − 3 = 16. Ответ —
            16.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "lozhna-pri-lyubom-x",
      navLabel: "Ложна при любом x",
      explanation: (
        <>
          <Typography.Text>
            Иногда формула должна быть не истинной, а ложной при любом x.
            Например: P = [5; 22], найди наименьшую длину A, при которой формула
            (x ∈ P) ∧ ¬(x ∈ A) ложна при любом x.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда ищут x, при которых формула могла бы стать истинной, и
              выбирают A так, чтобы этого не случилось.
            </strong>
          </Typography.Text>
          <Typography.Text>
            P ∧ ¬A истинна, когда x лежит в P, но не лежит в A. Чтобы так не
            случилось ни при одном x, каждая точка P должна лежать в A.
            Наименьший A — сам P, его длина 22 − 5 = 17.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: через отрицание всей формулы"
          >
            <Typography.Text>
              Формула ложна при любом x — значит, её отрицание истинно при любом
              x: ¬(P ∧ ¬A) = ¬P ∨ A. Дальше решают как обычно: A решает всё при
              x из P, там x обязан быть в A.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "konechnye-mnozhestva",
      navLabel: "Конечные множества",
      explanation: (
        <>
          <Typography.Text>
            А если A, P и Q — не отрезки, а наборы чисел? Пусть P ={" "}
            {"{2, 4, 6, 8, 10, 12}"}, Q = {"{3, 6, 9, 12, 15, 18}"}, а A — набор
            натуральных чисел, при котором формула ((x ∈ P) ∧ (x ∈ Q)) → (x ∈ A)
            тождественно истинна. Какая наименьшая сумма чисел A?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Метод тот же, но числа делят на группы: в P и в Q сразу, только в
              P, только в Q, ни в одном. Группы удобно видеть на двух кругах —
              их называют кругами Эйлера.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Стрелка: ¬(P ∧ Q) ∨ A. Часть без A ложна для чисел, которые есть и в
            P, и в Q, — это 6 и 12. Они обязаны быть в A, остальные можно не
            брать.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pfEuler_9aba0d}
            caption={
              <>
                В пересечении кругов — числа, которые есть и в P, и в Q. Только
                они обязаны войти в A.
              </>
            }
          />
          <Typography.Text>
            Для наименьшей суммы берём только обязательные числа: A ={" "}
            {"{6, 12}"}, сумма 18.
          </Typography.Text>
          <Typography.Text>
            Если же A стоит слева — ((x ∈ A) → (x ∈ P)) ∨ (x ∈ Q) = ¬A ∨ P ∨ Q —
            то в A можно брать только числа из кругов. Тогда наибольшее
            количество чисел в A — все 10 чисел из P и Q.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: сумма и количество — разные вопросы"
          >
            <Typography.Text>
              Для наибольшего количества берут все разрешённые числа. Для
              наибольшей суммы отрицательные числа не берут, даже если они
              разрешены: каждое уменьшает сумму.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "otrezki-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Запись", note: <>P вместо x ∈ P</> },
              {
                key: "A справа от стрелки",
                note: <>точки, обязательные для A, — наименьший A</>,
              },
              {
                key: "A с отрицанием",
                note: <>точки, разрешённые для A, — наибольший A</>,
              },
              { key: "Две части", note: <>A накрывает и промежуток</> },
              { key: "Длина", note: <>правый конец минус левый</> },
              {
                key: "Ложна при любом x",
                note: <>не дать ей стать истинной</>,
              },
              { key: "Множества", note: <>группы чисел по кругам Эйлера</> },
            ]}
          />
        </>
      ),
    },
  ],
  paidPractice: {
    examFocus: true,
    checkpoint: 0,
    load: () => import("./logic-transformations.paid.praktika"),
  },
  status: "published",
});
