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
import { lessonMedia } from "./parallel-computing.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="22-mnogoprocessornye-sistemy" subtopic={props.slug}>
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
              Задача темы — сколько процессов шло в 21-ю миллисекунду — решалась
              на восьми процессах, посчитанных руками, и каждая подтема
              добавляла к расписанию новый вопрос.
            </strong>{" "}
            Пролистай решение: в подписи каждого шага — подтема, откуда приём.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы на восьми процессах"}
          />
          <Typography.Text>
            Расписание строится один раз, а вопросы к нему — разные. Подтема 5
            разрешает сдвигать процессы позже, а дополнительный урок добавляет
            задержки и ограниченное число процессоров.
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
              Каждая подтема дала одну формулу или правило, и любое решение
              собирается из них.
            </strong>{" "}
            Сверху — путь от таблицы к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 22 на одной схеме"}
            flow={[
              {
                name: "Расписание",
                note: "начало — МАКС окончаний поставщиков",
              },
              { name: "Сдвиги", note: "можно ли запускать позже" },
              { name: "Ответ", note: "СЧЁТЕСЛИМН, МАКС или сетка" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="processy-i-raspisanie">Процессы и расписание</Sub>
                ),
                rows: [
                  {
                    key: <>начало</>,
                    note: <>самое позднее окончание поставщиков</>,
                  },
                  { key: <>окончание</>, note: <>начало + время</> },
                  {
                    key: <>итог</>,
                    note: <>наибольшее окончание всех процессов</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="raspisanie-v-excel">Расписание в Excel</Sub>,
                rows: [
                  {
                    key: <Notation>{"=ЕСНД(ВПР(C2;$A$1:$H1;8;0);0)"}</Notation>,
                    note: <>окончание поставщика; нет поставщика — 0</>,
                  },
                  {
                    key: <Notation>{"=МАКС(E2:F2)"}</Notation>,
                    note: <>начало процесса</>,
                  },
                  {
                    key: <>«Текст по столбцам»</>,
                    note: <>разложить «1;2» на числа</>,
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="skolko-processov">Сколько процессов</Sub>,
                rows: [
                  {
                    key: <>n-я мс</>,
                    note: <>начало {"<"} n и окончание ≥ n</>,
                  },
                  {
                    key: <Notation>{"СЧЁТЕСЛИМН"}</Notation>,
                    note: <>оба условия сразу</>,
                  },
                ],
              },
              {
                number: 4,
                title: <Sub slug="parallelnost">Параллельность</Sub>,
                rows: [
                  {
                    key: <>сетка</>,
                    note: <>1, если процесс идёт в эту мс</>,
                  },
                  {
                    key: <>сумма столбца</>,
                    note: <>сколько процессов идёт одновременно</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="sdvigi">Сдвиги процессов</Sub>,
                rows: [
                  {
                    key: <>позднее начало</>,
                    note: <>считают с конца, от итога</>,
                  },
                  {
                    key: <>запас</>,
                    note: <>позднее начало минус раннее</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="zaderzhki-i-resursy">
                    Задержки и ограниченные ресурсы
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>задержка</>,
                    note: <>прибавить к самому позднему окончанию</>,
                  },
                  {
                    key: <>мало процессоров</>,
                    note: <>процесс готов и есть свободное место</>,
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
              Любое задание 22 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — расписание: начало каждого процесса — наибольшее
                окончание тех, кого он ждёт. Проверка — восемь процессов темы:
                итог должен получиться 14, на 7-й мс — три процесса.
              </>
            }
          />
          <Typography.Text>
            После протягивания открой несколько формул — первой строки, из
            середины, процесса с тремя поставщиками — и проверь, что каждая ищет
            своих поставщиков в строках выше.
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
              Пять ошибок встречаются чаще других, и каждую ловит один вопрос к
              себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "сложены окончания",
                value: (
                  <FinalMistake
                    wrong="начало — сумма окончаний поставщиков"
                    right="начало — их максимум"
                    question="поставщики идут одновременно или по очереди?"
                  />
                ),
                note: <Sub slug="processy-i-raspisanie">подтема 1</Sub>,
              },
              {
                label: "ответ по последнему ID",
                value: (
                  <FinalMistake
                    wrong="общее время взято из последней строки"
                    right={<Notation>{"=МАКС(H2:H…)"}</Notation>}
                    question="точно ли последний процесс кончается последним?"
                  />
                ),
                note: <Sub slug="processy-i-raspisanie">подтема 1</Sub>,
              },
              {
                label: "поставщик-текст",
                value: (
                  <FinalMistake
                    wrong="ВПР не находит «1;2»"
                    right="«Текст по столбцам» — ID станут числами"
                    question="поставщик записан числом или текстом?"
                  />
                ),
                note: <Sub slug="raspisanie-v-excel">подтема 2</Sub>,
              },
              {
                label: "граница миллисекунды",
                value: (
                  <FinalMistake
                    wrong="для n-й мс: начало ≤ n"
                    right="начало < n и окончание ≥ n"
                    question="идёт ли процесс с 6 до 8 в 6-й мс?"
                  />
                ),
                note: <Sub slug="skolko-processov">подтема 3</Sub>,
              },
              {
                label: "сдвиги не учтены",
                value: (
                  <FinalMistake
                    wrong="ответ из раннего расписания, хотя сдвигать можно"
                    right="поздние начала и запас"
                    question="сказано ли «в самое раннее допустимое время»?"
                  />
                ),
                note: <Sub slug="sdvigi">подтема 5</Sub>,
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
            Процесс ждёт процессы, которые кончаются в 4 и в 6 мс, и работает 3
            мс. Когда он начнётся и закончится?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Начнётся в 6 — когда закончится последний из поставщиков, — и
            закончится в 9.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Процесс идёт с 6 до 8. В какие миллисекунды он выполняется?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В 7-ю и 8-ю: n-я мс — промежуток от n − 1 до n.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему общее время — МАКС окончаний, а не окончание последнего по
            номеру процесса?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Процессы идут параллельно, и последний по номеру может закончиться
            раньше других.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Как найти самый длинный отрезок, на котором шло больше всего
            процессов?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Построить сетку по миллисекундам, сложить столбцы и найти самую
            длинную серию с наибольшей суммой.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от восьми процессов до ответа 3. Вот
        что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Таблица, расписание, сдвиги, вопрос, проверка.</>,
          },
          {
            key: "Расписание",
            note: <>Начало — МАКС окончаний поставщиков.</>,
          },
          {
            key: "Миллисекунда",
            note: <>n-я мс: начало {"<"} n, окончание ≥ n.</>,
          },
          {
            key: "Параллельность",
            note: <>Сетка: сумма столбца и самый длинный пик.</>,
          },
          {
            key: "Задача темы",
            note: <>На 21-й мс шло 3 процесса.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
