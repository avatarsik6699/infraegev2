import { CodeBlock } from "~/shared/components/code-block";
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
} from "~/shared/components/learning-content";
import { branchingAndEnumerationLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./branching-and-enumeration.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const R = "13-analiz-hoda-ispolneniya-algoritma";

const THEME_TASK = (
  <>
    «Исполнитель преобразует число на экране. У исполнителя есть две команды,
    которым присвоены номера: 1. Прибавить 1; 2. Умножить на 2. Программа для
    исполнителя — это последовательность команд. Сколько существует программ,
    для которых при исходном числе 2 результатом является число 20, и при этом
    траектория вычислений содержит число 6 и не содержит числа 9? Траектория
    вычислений программы — это последовательность результатов выполнения всех
    команд программы.»
  </>
);

export const branchingAndEnumerationLesson = defineLesson({
  ...branchingAndEnumerationLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Различать программы и траектории и считать программы деревом и рекурсией",
    "Заполнять таблицу количеств K(n) вручную и списком в цикле",
    "Разрезать программу по обязательным числам и обнулять запрещённые",
    "Находить предшественников новых команд: 2x + 1, дописывание цифры, квадрат, условная перестановка",
    "Считать при убывании и делении нацело",
    "Для редких задач — группы программ, заданная длина и память о прошлом (дополнительные уроки)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "komandy-i-derevo",
      title: "Команды, программы и дерево",
      lead: "Что такое программа и траектория, как перебрать все программы деревом и почему его можно сократить.",
      conceptIds: [
        "kak-ustroena-tema-13",
        "programma-i-traektoriya",
        "derevo-variantov",
        "povtory-v-dereve",
        "derevo-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Команды «+1» и «×2», исходное число 3. Какое число даст программа
              121?
            </>
          ),
          reveal: <>9: 3 + 1 = 4, 4 · 2 = 8, 8 + 1 = 9.</>,
        },
        {
          id: "zadacha-2",
          prompt: <>Сколько программ из команд «+1» и «×2» переводят 3 в 9?</>,
          reveal: (
            <>3: 111111, 121 (3 → 4 → 8 → 9) и 2111 (3 → 6 → 7 → 8 → 9).</>
          ),
        },
        {
          id: "zadacha-3",
          prompt: <>Сколько программ из команд «+1» и «+2» переводят 2 в 6?</>,
          reveal: <>5: 1111, 112, 121, 211, 22.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Из 1 обе команды «+1» и «×2» дают 2. Сколько программ переводят 1
              в 4?
            </>
          ),
          reveal: (
            <>
              4: 111, 21, 12 и 22 — первые команды «+1» и «×2» разные, хотя
              числа одинаковые.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему из 0 командами «+1» и «×2» в 1 ведёт бесконечно много
              программ?
            </>
          ),
          reveal: (
            <>
              0 · 2 = 0: умножение не меняет 0, его можно повторять сколько
              угодно раз перед «+1».
            </>
          ),
        },
      ],
    },
    {
      slug: "tablica-kolichestv",
      title: "Таблица количества программ",
      lead: "Как посчитать программы без дерева: таблица K от старта к цели — вручную и на Python.",
      conceptIds: [
        "summa-po-poslednej-komande",
        "tablica",
        "tri-komandy",
        "nedostizhimye-chisla",
        "tablica-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Сколько программ из команд «+1» и «×2» переводят 2 в 8?</>,
          reveal: <>5: K = 1, 1, 2, 2, 3, 3, 5 для чисел от 2 до 8.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Команды «+1», «+2», «×2». Сколько программ переводят 1 в 9?</>
          ),
          reveal: <>87: K(n) = K(n − 1) + K(n − 2) + K(n / 2) для чётного n.</>,
        },
        {
          id: "zadacha-3",
          prompt: <>Команды «+2» и «×3». Сколько программ переводят 1 в 15?</>,
          reveal: <>6: из 1 в 3 две программы, дальше по нечётным числам.</>,
        },
        {
          id: "zadacha-4",
          prompt: <>Команды «+2» и «×3». Сколько программ переводят 2 в 13?</>,
          reveal: (
            <>
              0: обе команды сохраняют чётность, из 2 получаются только чётные
              числа.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: <>Почему в старте таблицы ставят 1, а не 0?</>,
          reveal: (
            <>
              В старт ведёт одна пустая программа. С нулём все суммы дальше тоже
              были бы нулями.
            </>
          ),
        },
      ],
    },
    {
      slug: "etapy-i-zaprety",
      title: "Обязательные и запрещённые числа",
      lead: "Как учесть обязательное и запрещённое число — и ответ задачи темы.",
      access: "paid",
      conceptIds: [
        "obyazatelnoe-chislo",
        "zapreshchennoe-chislo",
        "otvet-zadachi",
        "neskolko-uslovij",
        "etapy-itogo",
      ],
      paid: {
        outline: [
          { id: "obyazatelnoe-chislo", navLabel: "Обязательное число" },
          { id: "zapreshchennoe-chislo", navLabel: "Запрещённое число" },
          { id: "otvet-zadachi", navLabel: "Ответ задачи темы" },
          { id: "neskolko-uslovij", navLabel: "Несколько условий" },
          { id: "etapy-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Сколько программ из 2 в 20 проходят через 6 и обходят 9? Здесь
              задача темы получает ответ.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./branching-and-enumeration.paid.etapy-i-zaprety"),
      },
    },
    {
      slug: "smysl-novoj-komandy",
      title: "Новые и условные команды",
      lead: "Другие команды — 2x + 1, дописать цифру, квадрат, перестановка: из какого числа они ведут в n.",
      access: "paid",
      conceptIds: [
        "novaya-komanda",
        "sostavnaya-komanda",
        "cifra-i-kvadrat",
        "perestanovka-cifr",
        "novye-itogo",
      ],
      paid: {
        outline: [
          { id: "novaya-komanda", navLabel: "Новая команда" },
          { id: "sostavnaya-komanda", navLabel: "Составная команда" },
          { id: "cifra-i-kvadrat", navLabel: "Цифра справа и квадрат" },
          { id: "perestanovka-cifr", navLabel: "Перестановка цифр" },
          { id: "novye-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Что меняется, если вместо «×2» у исполнителя другая команда —
              например, «умножь на 2 и прибавь 1»?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () =>
          import("./branching-and-enumeration.paid.smysl-novoj-komandy"),
      },
    },
    {
      slug: "ubyvanie-i-delenie",
      title: "Убывание и деление",
      lead: "Команды, которые уменьшают число, и деление: точное, нацело и с округлением вверх.",
      access: "paid",
      conceptIds: [
        "ubyvayushchie-komandy",
        "delenie-nacelo",
        "okruglenie-vverh",
        "komanda-s-vetvleniem",
        "ubyvanie-itogo",
      ],
      paid: {
        outline: [
          { id: "ubyvayushchie-komandy", navLabel: "Убывающие команды" },
          { id: "delenie-nacelo", navLabel: "Деление нацело" },
          { id: "okruglenie-vverh", navLabel: "Округление вверх" },
          { id: "komanda-s-vetvleniem", navLabel: "Команда с ветвлением" },
          { id: "ubyvanie-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Сколько программ переводят 12 в 2 командами «вычесть 1» и
              «разделить на 2, если число чётное»?
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () =>
          import("./branching-and-enumeration.paid.ubyvanie-i-delenie"),
      },
    },
    {
      slug: "gruppy-programm",
      title: "Группы программ и обратные вопросы",
      lead: "Условия на несколько чисел сразу, подсчёт без таблицы и обратный вопрос: какая цель даёт нужное число программ.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "neskolko-chisel-srazu",
        "i-ili-rovno-odno",
        "tolko-pribavleniya",
        "obratnyj-vopros",
        "ne-oba",
        "gruppy-itogo",
      ],
      paid: {
        outline: [
          { id: "neskolko-chisel-srazu", navLabel: "Несколько чисел сразу" },
          { id: "i-ili-rovno-odno", navLabel: "И, или, ровно одно" },
          { id: "tolko-pribavleniya", navLabel: "Только прибавления" },
          { id: "obratnyj-vopros", navLabel: "Обратный вопрос" },
          { id: "ne-oba", navLabel: "Не оба" },
          { id: "gruppy-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Дополнительный урок — для продвинутых: такие условия редки.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./branching-and-enumeration.paid.gruppy-programm"),
      },
    },
    {
      slug: "dlina-i-pamyat",
      title: "Длина и память программы",
      lead: "Ровно L команд, запрет повторять команду, движение в обе стороны: что запоминать, кроме числа.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "ogranichenie-na-programmu",
        "zadannaya-dlina",
        "dlina-po-uchastkam",
        "sostoyanie",
        "vozvraty",
        "zapret-povtora-podryad",
        "skolko-chisel",
        "dvizhenie-v-obe-storony",
        "pamyat-itogo",
      ],
      paid: {
        outline: [
          {
            id: "ogranichenie-na-programmu",
            navLabel: "Ограничение на программу",
          },
          { id: "zadannaya-dlina", navLabel: "Заданная длина" },
          { id: "dlina-po-uchastkam", navLabel: "Длина по участкам" },
          { id: "sostoyanie", navLabel: "Состояние" },
          { id: "vozvraty", navLabel: "Возвраты" },
          { id: "zapret-povtora-podryad", navLabel: "Запрет повтора подряд" },
          { id: "skolko-chisel", navLabel: "Сколько чисел" },
          { id: "dvizhenie-v-obe-storony", navLabel: "Движение в обе стороны" },
          { id: "pamyat-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Дополнительный урок — для продвинутых: такие условия редки.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./branching-and-enumeration.paid.dlina-i-pamyat"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-13",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 13 исполнитель меняет число своими командами, а
            спрашивают, сколько разных программ ведут от одного числа к другому.
            Вот задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Выписывать все программы долго — их много, и они длинные. Мы
              научимся считать их, не выписывая.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "команды 1 и 2",
                "1 — прибавить 1, 2 — умножить на 2; программу пишут номерами: 121 — это «прибавить, умножить, прибавить»",
              ],
              [
                "исходное число 2, результат 20",
                "начинаем с 2, после последней команды на экране 20",
              ],
              ["траектория", "числа на экране после каждой команды"],
              ["содержит 6", "6 хотя бы раз появилось на экране"],
              ["не содержит 9", "9 не появилось ни разу"],
              [
                "сколько существует программ",
                "посчитать все подходящие программы",
              ],
            ]}
          />
          <Typography.Text>
            Тема состоит из семи подтем — у каждой своя страница. Идём по ним по
            порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Команды, программы и дерево</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="tablica-kolichestv">
                Таблица количества программ
              </SubtopicLink>{" "}
              — тот же счёт без дерева для участка из 6 в 20.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="etapy-i-zaprety">
                Обязательные и запрещённые числа
              </SubtopicLink>{" "}
              — обязательное 6, запрещённое 9 и ответ задачи.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="smysl-novoj-komandy">
                Новые и условные команды
              </SubtopicLink>{" "}
              — другие команды вместо «+1» и «×2».
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="ubyvanie-i-delenie">
                Убывание и деление
              </SubtopicLink>{" "}
              — команды, которые уменьшают число.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="gruppy-programm">
                Группы программ и обратные вопросы
              </SubtopicLink>{" "}
              — дополнительный урок для редких условий.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="dlina-i-pamyat">
                Длина и память программы
              </SubtopicLink>{" "}
              — ещё один дополнительный урок.
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
      id: "programma-i-traektoriya",
      navLabel: "Программа и траектория",
      explanation: (
        <>
          <Typography.Text>
            Возьмём исходное число 3 и выполним две программы: 12 и 21.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Программа — последовательность команд, записанная их номерами.
              Команды выполняют слева направо, по одной.
            </strong>{" "}
            Программа 12: сначала команда 1 — 3 + 1 = 4, потом команда 2 — 4 · 2
            = 8. Программа 21 — те же команды в другом порядке: 3 · 2 = 6, потом
            6 + 1 = 7.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exRun3}
            caption={
              <>
                Программы 12 и 21 из числа 3: над стрелкой — номер команды и что
                она делает, под числами — траектория.
              </>
            }
          />
          <Typography.Text>
            Траектория — числа, которые появились на экране после каждой
            команды: у программы 12 это 4 и 8, у программы 21 — 6 и 7. Исходное
            число 3 в траекторию не входит: его не получала ни одна команда.
          </Typography.Text>
          <Typography.Text>
            Обрати внимание: считают программы, а не числа. Из 1 команда 1 даёт
            1 + 1 = 2 и команда 2 даёт 1 · 2 = 2. Число одно, а программы две —
            1 и 2. Поэтому из 1 в 4 ведут четыре программы: 111, 12, 21 и 22.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: длина и направление"
          >
            <Typography.Text>
              Если длина не ограничена, считают программы любой длины, а не
              только самые короткие.
            </Typography.Text>
            <Typography.Text>
              Команды «+1» и «×2» на положительных числах только увеличивают
              число: перешагнув цель, к ней уже не вернуться, поэтому программ
              конечное число. Но так бывает не всегда: из 0 умножение на 2 снова
              даёт 0, а квадрат из 1 — снова 1. Такую команду можно повторять
              сколько угодно раз, и программ становится бесконечно много.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "derevo-variantov",
      navLabel: "Дерево вариантов",
      explanation: (
        <>
          <Typography.Text>
            Сколько программ переводят 2 в 6 — первый участок задачи темы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Дерево перебирает все программы: из каждого числа выходит по ветке
              на каждую команду.
            </strong>{" "}
            Строим его от 2:
          </Typography.Text>
          <ol>
            <li>Из 2 команда 1 даёт 3, команда 2 — 4: две ветки.</li>
            <li>Из каждого нового числа снова пробуем обе команды.</li>
            <li>Получили 6 — ветка закончилась успехом: это одна программа.</li>
            <li>
              Получили больше 6 — ветку обрываем: команды только увеличивают
              число, к 6 уже не вернуться.
            </li>
          </ol>
          <LessonDiagram
            {...lessonMedia.exTree2_6}
            caption={
              <>
                Все программы из 2 в 6. Пройди от 2 до оранжевого листа и выпиши
                номера команд на ветках — получишь программу: 1111, 12, 211.
                Пунктирные листы перепрыгнули 6.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Слева идём через 3: дальше 3 → 4 → 5 → 6 — это программа
                    1111, а 3 · 2 = 6 — программа 12. Справа через 4: 4 → 5 → 6
                    — программа 211, а 4 · 2 = 8 уже больше 6. Успешных листьев
                    три — значит, и программ три.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      В коде дерево превращается в{" "}
                      <PythonTerm term="rec">рекурсию</PythonTerm> — функцию,
                      которая вызывает сама себя для каждой ветки. Функцию f(x,
                      y) задаём через <PythonTerm term="def">def</PythonTerm>,
                      она считает программы из x в y. Каждая её строка с{" "}
                      <PythonTerm term="if">if</PythonTerm> или return — одно
                      правило дерева:
                    </Typography.Text>
                    <ol>
                      <li>
                        <Notation>{"if x > y: return 0"}</Notation> — ветка
                        перепрыгнула цель, программ нет;
                      </li>
                      <li>
                        <Notation>{"if x == y: return 1"}</Notation> — дошли до
                        цели, это одна программа;
                      </li>
                      <li>
                        <Notation>{"f(x + 1, y) + f(x * 2, y)"}</Notation> — две
                        ветки, их программы складывают.
                      </li>
                    </ol>
                    <CodeBlock
                      code={
                        "def f(x, y):\n    if x > y:\n        return 0\n    if x == y:\n        return 1\n    return f(x + 1, y) + f(x * 2, y)\n\n\nprint(f(2, 6))"
                      }
                      label={"Программы из 2 в 6 рекурсией"}
                      language="python"
                      output={"3"}
                    />
                    <Typography.Text>
                      Раскрутку одной ветки дерева — из 3 в 6 — пройди по шагам:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runUnwind}
                      label={"Рекурсия из 3 в 6 по шагам"}
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "povtory-v-dereve",
      navLabel: "Повторы в дереве",
      explanation: (
        <>
          <Typography.Text>
            В дереве число 4 встретилось дважды: слева — после 2 → 3 → 4, справа
            — сразу после 2 → 4. Нужно ли продолжать его два раза?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Из одинаковых чисел дерево растёт одинаково, поэтому число
              достаточно записать один раз и отметить, сколькими программами в
              него пришли.
            </strong>{" "}
            В 4 пришли две программы (11 и 2), и каждую можно продолжить
            одинаково: 4 → 5 → 6. Значит, через 4 в 6 ведут две программы.
          </Typography.Text>
          <Typography.Text>
            Это количество обозначают K(n): сколько программ переводят старт в
            число n. Запишем числа от 2 до 6 в строку, а под каждым — K:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exLine2_6_ff6440}
            caption={
              <>
                Те же программы в таблице: K(4) = 2 — в 4 ведут 11 и 2; K(6) =
                3, как и в дереве. Соседние клетки связывает «+1», дуги — «×2».
              </>
            }
          />
          <Typography.Text>
            Такая таблица заменяет дерево, когда чисел много, — ей посвящена
            подтема 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "derevo-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Программа", note: <>последовательность команд</> },
              {
                key: "Разные программы",
                note: <>разный порядок команд, даже при одном результате</>,
              },
              { key: "Траектория", note: <>числа после команд, без старта</> },
              {
                key: "Дерево",
                note: <>ветка на команду, обрыв за целью</>,
              },
              { key: "Повторы", note: <>число один раз, под ним K(n)</> },
              {
                key: "Python",
                note: <Notation>{"f(x + 1, y) + f(x * 2, y)"}</Notation>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "summa-po-poslednej-komande",
      navLabel: "Сумма по последней команде",
      explanation: (
        <>
          <Typography.Text>
            Сколько программ переводят 6 в 20 — второй участок задачи темы?
            Дерево здесь уже слишком большое, поэтому считаем таблицей K.
          </Typography.Text>
          <Typography.Text>
            Начнём с одного числа — 12. Любая программа, которая заканчивается в
            12, сделала последнюю команду:
          </Typography.Text>
          <ul>
            <li>либо «+1» — тогда перед ней на экране было 11;</li>
            <li>либо «×2» — тогда перед ней было 6.</li>
          </ul>
          <Typography.Text>
            <strong>
              Значит, K(12) = K(11) + K(6): программ в 12 столько, сколько в 11
              и в 6 вместе.
            </strong>{" "}
            Ни одна программа не посчитается дважды — последняя команда у неё
            одна.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exLine6_12_274d46}
            caption={
              <>
                В 12 ведут «+1» из 11 и «×2» из 6 — их клетки обведены: K(12) =
                1 + 1 = 2.
              </>
            }
          />
          <Typography.Text>
            С любым числом n так же: «+1» ведёт в него из n − 1 всегда, а «×2» —
            из n / 2, только если n чётное. Нечётное число умножением на 2 не
            получить.
          </Typography.Text>
          <LessonTable
            label={"Команды «+1» и «×2»"}
            columns={[{ label: "Число n" }, { label: "Количество K(n)" }]}
            rows={[
              ["нечётное", "K(n) = K(n − 1)"],
              ["чётное", "K(n) = K(n − 1) + K(n / 2)"],
            ]}
          />
          <Typography.Text>
            Остаётся старт: K(6) = 1. Мы уже стоим в 6, и туда ведёт одна
            программа — пустая, без команд. Числа меньше 6 получить нельзя, для
            них K = 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tablica",
      navLabel: "Таблица",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Таблицу заполняют по порядку, от старта к цели, — так оба
              слагаемых для очередного числа уже готовы.
            </strong>{" "}
            Посмотри по шагам, как заполняется таблица от 6 до 20: оранжевая
            рамка — текущее число, обведены клетки, которые складывают.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <LessonStepper
                      {...lessonMedia.exFill6_20}
                      label={"Таблица из 6 в 20 по шагам"}
                    />
                    <Typography.Text>
                      От 7 до 11 в каждое число ведёт только «+1» — по одной
                      программе. В 12 приходят из 11 и из 6: 1 + 1 = 2. В 20 —
                      из 19 и из 10: 5 + 1 = 6. Ответ второго участка: 6
                      программ.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Таблица в коде —{" "}
                      <PythonTerm term="list">список</PythonTerm>: номер ячейки
                      — число на экране, значение — количество программ. Ячейки
                      ниже старта остаются нулевыми и ничего не добавляют:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "k = [0] * 21\nk[6] = 1\nfor n in range(7, 21):\n    k[n] = k[n - 1]\n    if n % 2 == 0:\n        k[n] += k[n // 2]\nprint(k[20])"
                      }
                      label={"Программы из 6 в 20 списком"}
                      language="python"
                      output={"6"}
                    />
                    <Typography.Text>
                      <Notation>{"n % 2 == 0"}</Notation> — проверка чётности: в
                      нечётное n команда «×2» не ведёт, и округлять n / 2
                      нельзя.
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "tri-komandy",
      navLabel: "Три команды",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1», «+2» и «×2». Сколько программ переводят 1 в 10?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждая команда даёт своё слагаемое — даже если две команды ведут в
              n из одного и того же числа.
            </strong>{" "}
            В n ведут «+1» из n − 1, «+2» из n − 2 и «×2» из n / 2, если n
            чётное. В 4 ведут и «+2», и «×2» — обе из 2, поэтому K(2) входит в
            сумму дважды: это разные программы.
          </Typography.Text>
          <LessonTable
            label={"Три команды: из 1 в 10"}
            columns={[
              { label: "n", numeric: true },
              { label: "Слагаемые" },
              { label: "K(n)", numeric: true },
            ]}
            rows={[
              ["1", "старт", "1"],
              ["2", "K(1) + K(1)", "2"],
              ["3", "K(2) + K(1)", "3"],
              ["4", "K(3) + K(2) + K(2)", "7"],
              ["5", "K(4) + K(3)", "10"],
              ["6", "K(5) + K(4) + K(3)", "20"],
              ["7", "K(6) + K(5)", "30"],
              ["8", "K(7) + K(6) + K(4)", "57"],
              ["9", "K(8) + K(7)", "87"],
              ["10", "K(9) + K(8) + K(5)", "154"],
            ]}
          />
          <Typography.Text>
            Ответ 154. Если в 4 взять K(2) один раз, получится 5 вместо 7 — и
            всё дальше будет занижено.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nedostizhimye-chisla",
      navLabel: "Недостижимые числа",
      explanation: (
        <>
          <Typography.Text>
            Команды «+2» и «×3», старт 2. Сколько программ ведут в 13?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Иногда ответ 0 виден сразу: если каждая команда сохраняет какое-то
              свойство числа — например, чётность.
            </strong>{" "}
            2 чётное; чётное + 2 — снова чётное, чётное · 3 — тоже. На экране
            всегда чётные числа, и 13 не появится: ответ 0.
          </Typography.Text>
          <Typography.Text>
            Из 1 те же команды дают только нечётные числа, и в 15 ведут 6
            программ.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tablica-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "K(n)", note: <>сумма по командам, ведущим в n</> },
              { key: "Старт", note: <>K = 1: одна пустая программа</> },
              { key: "Порядок", note: <>от старта к цели</> },
              { key: "×2", note: <>только для чётного n, без округления</> },
              {
                key: "Две команды из одного числа",
                note: <>два разных слагаемых</>,
              },
              {
                key: "Python",
                note: <Notation>{"k[n] = k[n - 1] + k[n // 2]"}</Notation>,
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
    load: () => import("./branching-and-enumeration.paid.praktika"),
  },
  status: "published",
});
