// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./parallel-computing.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Таблицу проверяют на восьми процессах, посчитанных руками: те же
          формулы должны дать итог 14 и три процесса на 7-й мс.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "сложены окончания",
            value: <>Начало посчитано как сумма окончаний поставщиков</>,
            note: <>начало — их максимум: поставщики идут одновременно</>,
          },
          {
            label: "ответ по последнему ID",
            value: <>Общее время взято из последней строки</>,
            note: (
              <>
                общее время — <Notation>{"=МАКС(H2:H…)"}</Notation> по всем
                окончаниям
              </>
            ),
          },
          {
            label: "поставщик-текст",
            value: <>ВПР не находит поставщика, записанного текстом</>,
            note: (
              <>
                разложить столбец командой «Текст по столбцам» — ID станут
                числами
              </>
            ),
          },
          {
            label: "граница миллисекунды",
            value: <>Для n-й мс взято «начало ≤ n» или «окончание {">"} n»</>,
            note: <>n-я мс: начало {"<"} n, окончание ≥ n</>,
          },
          {
            label: "сдвиги не учтены",
            value: <>Ответ взят из раннего расписания, хотя сдвигать можно</>,
            note: <>есть ли в условии «в самое раннее допустимое время»?</>,
          },
        ]}
      />
      <Typography.Text>
        После протягивания открой несколько формул — первой строки, середины,
        процесса с тремя поставщиками — и проверь, что каждая ищет своих
        поставщиков в строках выше.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 22 решается в три шага: расписание — начала и
          окончания всех процессов, проверка, можно ли их сдвигать, и ответ —
          одна формула по расписанию.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 22 на одной схеме"}
        flow={[
          { name: "Расписание", note: "начало — МАКС окончаний поставщиков" },
          { name: "Сдвиги", note: "можно ли запускать позже" },
          { name: "Ответ", note: "СЧЁТЕСЛИМН, МАКС или сетка" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="processy-i-raspisanie">
                Процессы и расписание
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>начало</>,
                note: <>самое позднее окончание поставщиков</>,
              },
              { key: <>окончание</>, note: <>начало + время</> },
              { key: <>14</>, note: <>итог учебного примера</> },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="raspisanie-v-excel">
                Расписание в Excel
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"=ЕСНД(ВПР(C2;$A$1:$H1;8;0);0)"}</Notation>,
                note: <>окончание поставщика</>,
              },
              { key: <Notation>{"=МАКС(E2:F2)"}</Notation>, note: <>начало</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="skolko-processov">
                Сколько процессов
              </SubtopicLink>
            ),
            rows: [
              { key: <>n-я мс</>, note: <>начало {"<"} n, окончание ≥ n</> },
              { key: <>СЧЁТЕСЛИМН</>, note: <>два условия сразу</> },
              { key: <>3</>, note: <>ответ задачи темы</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="parallelnost">
                Параллельность
              </SubtopicLink>
            ),
            rows: [
              { key: <>сетка</>, note: <>1, если процесс идёт в эту мс</> },
              { key: <>сумма столбца</>, note: <>сколько идёт одновременно</> },
              { key: <>счётчик</>, note: <>самый длинный отрезок</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="sdvigi">
                Сдвиги процессов
              </SubtopicLink>
            ),
            rows: [
              { key: <>позднее начало</>, note: <>считают с конца</> },
              { key: <>запас</>, note: <>позднее − раннее начало</> },
              { key: <>не раньше порога</>, note: <>по поздним началам</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="zaderzhki-i-resursy">
                Задержки и ограниченные ресурсы
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>задержка</>, note: <>+ к самому позднему окончанию</> },
              { key: <>мест мало</>, note: <>готов и есть место</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Сказано ли, что процессы начинаются в самое раннее время?</>,
              <>О чём вопрос: о миллисекунде, моменте или отрезке?</>,
              <>Что считать: процессы, время или длину отрезка?</>,
            ],
          },
        ]}
        caption={
          <>
            Шпаргалка темы: порядок решения и главное из каждой подтемы. Номер
            раздела ведёт на подтему.
          </>
        }
      />
    </>
  ),
};

export default content;
