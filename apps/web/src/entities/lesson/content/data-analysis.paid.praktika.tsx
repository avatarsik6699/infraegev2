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
import { lessonMedia } from "./data-analysis.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink
    routeSlug="27-analiz-dannyh-i-klasterizatsiya"
    subtopic={props.slug}
  >
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
              Задача темы — частицы из файла 27-4.txt: Q₁ по парам с признаком
              II и Q₂ по центрам — собиралась из функций всех пяти основных
              подтем.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы от подтемы 1 до подтемы 5"}
          />
          <Typography.Text>
            Четыре шага одни и те же в любом задании 27: прочитать записи,
            разделить на кластеры, найти центры по определению из условия и
            собрать ответ. Дополнительный урок добавляет соседей, другие
            определения центра и статистику.
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
              Каждая подтема дала один шаг решения, и любое решение собирается
              из них.
            </strong>{" "}
            Сверху — путь от файла к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 27 на одной схеме"}
            flow={[
              { name: "Записи", note: "прочитать файл и построить рисунок" },
              { name: "Кластеры", note: "каждая точка — ровно в одну группу" },
              { name: "Ответ", note: "центры и величины из условия" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="tochki-i-rasstoyaniya">
                    Точки, расстояния и файл
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"dist(a, b)"}</Notation>,
                    note: <>√(Δx² + Δy²); с порогом — квадраты</>,
                  },
                  {
                    key: <Notation>{'replace(",", ".").split()'}</Notation>,
                    note: <>запятая, пробелы и табуляция</>,
                  },
                  {
                    key: <>x = r · cos φ</>,
                    note: <>угол — через radians</>,
                  },
                ],
              },
              {
                number: 2,
                title: (
                  <Sub slug="razdelenie-na-klastery">
                    Разделение на кластеры
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"if / elif / else"}</Notation>,
                    note: <>одна группа на точку, порядок важен</>,
                  },
                  {
                    key: <Notation>{"noise"}</Notation>,
                    note: <>аномалии — отдельно, не в последний кластер</>,
                  },
                  {
                    key: <>границы</>,
                    note: (
                      <>в пустых промежутках: по координате, углу, энергии</>
                    ),
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="centr-klastera">Центр кластера</Sub>,
                rows: [
                  {
                    key: <Notation>{"total = 0.0"}</Notation>,
                    note: <>внутри цикла: новая сумма для каждого кандидата</>,
                  },
                  {
                    key: <>средняя точка</>,
                    note: <>не центр: центр — одна из точек</>,
                  },
                  {
                    key: <Notation>{"center_sum(g, energy_gap)"}</Notation>,
                    note: <>своя формула расстояния из условия</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="otvet-po-centram">Ответ по центрам</Sub>,
                rows: [
                  {
                    key: <>Pₓ, P_y</>,
                    note: <>средние координат центров</>,
                  },
                  {
                    key: <>× 10000, int</>,
                    note: <>целая часть, а не round</>,
                  },
                ],
              },
              {
                number: 5,
                title: (
                  <Sub slug="rasstoyaniya-i-pary">Расстояния и пары точек</Sub>
                ),
                rows: [
                  {
                    key: <>пары i {"<"} j</>,
                    note: <>каждая пара один раз</>,
                  },
                  {
                    key: <>внутри кластера</>,
                    note: <>список отобранных — заново в каждом</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="sosedi-centry-statistika">
                    Соседи, другие центры и статистика
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>другой центр</>,
                    note: <>минимакс, сумма квадратов, точка наведения</>,
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
              Любое задание 27 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — кластеры: каждая точка должна попасть ровно в одну
                группу, аномалии — отдельно. После каждого шага выводи то, что
                можно проверить глазами: число точек, размеры кластеров, центры.
              </>
            }
          />
          <Typography.Text>
            Проверочный рисунок: кластеры разными маркерами и центры поверх.
            Каждая граница должна проходить по пустому месту, а центр — лежать в
            своём кластере:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clScatterexample27txt_x5_5f1241}
            caption={
              <>
                Файл example27.txt: кластеры разными маркерами, граница x = 5,
                центры (1; 1) и (11; 1) обведены.
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
                label: "запятая",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"float('1,5')"}</Notation>}
                    right={
                      <Notation>{"float('1,5'.replace(',', '.'))"}</Notation>
                    }
                    question="какой разделитель дробной части в файле?"
                  />
                ),
                note: <Sub slug="tochki-i-rasstoyaniya">подтема 1</Sub>,
              },
              {
                label: "градусы",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"cos(phi)"}</Notation>}
                    right={<Notation>{"cos(radians(phi))"}</Notation>}
                    question="получится ли из (90; 2) точка (0; 2)?"
                  />
                ),
                note: <Sub slug="tochki-i-rasstoyaniya">подтема 1</Sub>,
              },
              {
                label: "последний else",
                value: (
                  <FinalMistake
                    wrong="аномалии попали в последний кластер"
                    right="явные области и отдельный noise"
                    question="сколько точек в noise по условию?"
                  />
                ),
                note: <Sub slug="razdelenie-na-klastery">подтема 2</Sub>,
              },
              {
                label: "сумма кандидата",
                value: (
                  <FinalMistake
                    wrong="total = 0.0 стоит до внешнего цикла"
                    right="новая сумма для каждого кандидата"
                    question="на пяти точках прямой центр — средняя?"
                  />
                ),
                note: <Sub slug="centr-klastera">подтема 3</Sub>,
              },
              {
                label: "среднее",
                value: (
                  <FinalMistake
                    wrong="средняя точка принята за центр"
                    right="центр — одна из точек кластера"
                    question="есть ли такая точка в файле?"
                  />
                ),
                note: <Sub slug="centr-klastera">подтема 3</Sub>,
              },
              {
                label: "формула",
                value: (
                  <FinalMistake
                    wrong="центр по dist, а в условии разность энергий"
                    right="center_sum(g, energy_gap)"
                    question="какое «расстояние» в определении центра?"
                  />
                ),
                note: <Sub slug="centr-klastera">подтема 3</Sub>,
              },
              {
                label: "модуль и round",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"round(q * 10000)"}</Notation>}
                    right={<Notation>{"int(q * 10000)"}</Notation>}
                    question="просят целую часть или округление?"
                  />
                ),
                note: <Sub slug="otvet-po-centram">подтема 4</Sub>,
              },
              {
                label: "пары вне кластера",
                value: (
                  <FinalMistake
                    wrong="пары собраны по всему файлу"
                    right="список отобранных — заново в каждом кластере"
                    question="могут ли точки пары быть из разных кластеров?"
                  />
                ),
                note: <Sub slug="rasstoyaniya-i-pary">подтема 5</Sub>,
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
            Почему центр кластера ищут перебором точек, а не берут среднее
            координат?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            По определению центр — одна из точек кластера с наименьшей суммой
            расстояний. Средняя точка в файле может и не встретиться.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Сумма размеров кластеров и аномалий совпала с числом точек. Значит,
            разделение верно?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Не обязательно: одну точку можно потерять, а другую учесть дважды.
            Нужен проверочный рисунок.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Как в задаче темы частица попадает в свою группу?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Номер группы — сколько границ 3.5, 7, 10.5 её энергия превысила:
            sum(energy(p) {">"} b for b in bounds).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Получилось Q₁ = 3.14159. Что записать в ответ при «целая часть
            произведения на 10 000»?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            31415: int(3.14159 * 10000) — дробную часть отбрасывают, а не
            округляют.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от чтения файла до ответа 772010
        125026. Вот что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Записи, кластеры, центры, ответ, проверка.</>,
          },
          {
            key: "Кластеры",
            note: <>Каждая точка — в одну группу, аномалии отдельно.</>,
          },
          {
            key: "Центр",
            note: <>Перебор точек по формуле из условия.</>,
          },
          {
            key: "Ответ",
            note: <>Пары — внутри кластера, int, а не round.</>,
          },
          {
            key: "Задача темы",
            note: <>Q₁ · 10000 = 772010, Q₂ · 10000 = 125026.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
