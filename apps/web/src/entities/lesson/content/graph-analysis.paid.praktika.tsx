// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { FinalMistake } from "./final-mistake";
import { lessonMedia } from "./graph-analysis.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="23-analiz-grafov" subtopic={props.slug}>
    {props.children}
  </SubtopicLink>
);

const content: LessonContent.PaidPracticeContent = {
  sections: [
    {
      id: "odna-zadacha",
      navLabel: "Одна задача — вся тема",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Задача темы — кратчайший путь из 1 в 100 в графе из файла 23-5.txt
              — прошла через подтемы, и каждая добавляла к решению новый шаг.
            </strong>{" "}
            Пролистай черновик: точками отмечены строки, которых не было после
            предыдущей подтемы.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 4"}
          />
          <Typography.Text>
            Функция f остаётся той же — вопрос меняет только три места в ней или
            её аргументы. Подтема 5 считает число путей, самый длинный путь и
            число рёбер, а дополнительный урок — пути ровно из k рёбер.
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
              Каждая подтема дала одно правило функции, и любое решение
              собирается из них.
            </strong>{" "}
            Сверху — путь от файла к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 23 на одной схеме"}
            flow={[
              { name: "Граф", note: "словарь: вершина → (куда, вес)" },
              { name: "Функция", note: "f(v) через f соседей, @cache" },
              { name: "Ответ", note: "f(1), целая часть в конце" },
            ]}
            groups={[
              {
                number: 1,
                title: <Sub slug="graf-i-put">Граф и путь</Sub>,
                rows: [
                  {
                    key: <>строка «a b w»</>,
                    note: <>ребро из a в b весом w, только в одну сторону</>,
                  },
                  {
                    key: <>длина пути</>,
                    note: <>сумма весов, а не число рёбер</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="put-do-celi">Лучший путь до цели</Sub>,
                rows: [
                  { key: <>f(цели)</>, note: <>0 — уже на месте</> },
                  {
                    key: <>f(v)</>,
                    note: <>min(вес + f(конца)) по стрелкам из v</>,
                  },
                  { key: <>тупик</>, note: <>∞, а не 0</> },
                ],
              },
              {
                number: 3,
                title: <Sub slug="programma">Программа с @cache</Sub>,
                rows: [
                  {
                    key: <Notation>{"line.split()"}</Notation>,
                    note: <>без аргумента — любые пробелы и табуляции</>,
                  },
                  {
                    key: <Notation>{"graph.get(v, [])"}</Notation>,
                    note: <>стрелки из v; у тупика пусто</>,
                  },
                  {
                    key: <Notation>{"@cache"}</Notation>,
                    note: <>каждая вершина считается один раз</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="usloviya-na-put">Условия на путь</Sub>,
                rows: [
                  { key: <>через k</>, note: <>f(s, k) + f(k, t)</> },
                  { key: <>в обход k</>, note: <>в k вернуть ∞</> },
                  {
                    key: <>через ребро a → b</>,
                    note: <>f(s, a) + вес + f(b, t)</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="drugie-voprosy">Другие вопросы о путях</Sub>,
                rows: [
                  {
                    key: <>число путей</>,
                    note: <>в цели 1, сумма вместо min</>,
                  },
                  { key: <>самый длинный</>, note: <>max, в тупике −∞</> },
                  { key: <>число рёбер</>, note: <>вместо веса 1</> },
                ],
              },
              {
                number: 6,
                title: <Sub slug="k-reber">Условие на число рёбер</Sub>,
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>f(v, k)</>,
                    note: <>путь ровно из k рёбер</>,
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
              Любое задание 23 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — правило f: длина лучшего пути от вершины до цели
                через ответы соседей. Проверка — учебный граф из восьми рёбер:
                f(1) = 7.5 и f(6) = 8.5.
              </>
            }
          />
          <Typography.Text>
            Перед ответом выведи само число, а не только целую часть: так видно
            и бесконечность, и почти целую сумму вроде 4519.999999999998.
          </Typography.Text>
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
              Шесть ошибок встречаются чаще других, и каждую ловит один вопрос к
              себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "тупик — ноль",
                value: (
                  <FinalMistake
                    wrong="в тупике f = 0"
                    right={<Notation>{'float("inf")'}</Notation>}
                    question="можно ли из этой вершины дойти до цели?"
                  />
                ),
                note: <Sub slug="put-do-celi">подтема 2</Sub>,
              },
              {
                label: "целая часть рано",
                value: (
                  <FinalMistake
                    wrong="веса переведены в int при чтении"
                    right="вес — float, int только от итоговой суммы"
                    question="не потерялись ли дробные части весов?"
                  />
                ),
                note: <Sub slug="programma">подтема 3</Sub>,
              },
              {
                label: "round вместо int",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"round(12.6)"}</Notation>}
                    right={<Notation>{"int(12.6)"}</Notation>}
                    question="просят целую часть или округление?"
                  />
                ),
                note: <Sub slug="programma">подтема 3</Sub>,
              },
              {
                label: 'split(" ")',
                value: (
                  <FinalMistake
                    wrong={<Notation>{'line.split(" ")'}</Notation>}
                    right={<Notation>{"line.split()"}</Notation>}
                    question="нет ли в строке двух пробелов или табуляции?"
                  />
                ),
                note: <Sub slug="programma">подтема 3</Sub>,
              },
              {
                label: "нет @cache",
                value: (
                  <FinalMistake
                    wrong="программа на файле не заканчивается"
                    right="@cache над функцией"
                    question="не считается ли одна вершина много раз?"
                  />
                ),
                note: <Sub slug="programma">подтема 3</Sub>,
              },
              {
                label: "запрет в старой функции",
                value: (
                  <FinalMistake
                    wrong="запрет добавили в уже вызванную f"
                    right="для запрета — своя функция"
                    question="не вернёт ли @cache старые ответы?"
                  />
                ),
                note: <Sub slug="usloviya-na-put">подтема 4</Sub>,
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
            Из вершины 5 выходят рёбра в 9 весом 2 и в 12 весом 7; f(9) = 10,
            f(12) = 4. Чему равно f(5)?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>min(2 + 10, 7 + 4) = 11.</Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>Почему в тупике f = ∞, а не 0?</Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            0 значит «уже в цели». Из тупика до цели не дойти, и такой путь не
            должен победить в min.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Как найти кратчайший путь из 1 в 100 через вершину 4?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            f(1, 4) + f(4, 100): путь делится вершиной 4 на два независимых
            участка.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Нужно не длину пути, а число путей. Что меняется в функции?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В цели 1 вместо 0, в тупике 0, а вместо min — сумма ответов соседей
            без весов.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от ребра в строке до ответа 10211. Вот
        что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Граф, правило, края, вопрос, ответ.</>,
          },
          {
            key: "Правило",
            note: <>f(v) = min(вес + f(конца)), @cache.</>,
          },
          {
            key: "Края",
            note: <>В цели 0, в тупике ∞.</>,
          },
          {
            key: "Условия",
            note: <>Через вершину — сумма двух f, в обход — ∞ в ней.</>,
          },
          {
            key: "Задача темы",
            note: <>int(f(1)) = 10211; учебный граф — 7.5.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
