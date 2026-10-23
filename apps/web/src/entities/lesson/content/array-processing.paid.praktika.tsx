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
import { lessonMedia } from "./array-processing.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="26-sortirovka-i-otbor" subtopic={props.slug}>
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
              Задача темы — камера хранения: сколько пассажиров сдадут багаж и в
              какую ячейку положит последний — читается как в подтеме 1, а
              решается в подтеме 6 исполнением правил.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы: от файла до ответа"}
          />
          <Typography.Text>
            Записи и сортировка нужны всем задачам темы. Где выбирают лучшее —
            работает жадный выбор (подтема 2), цепочки и пары (3), серии в рядах
            (4) и интервалы (5); где правила заданы — их исполняют дословно, как
            здесь. Дополнительный урок добавляет окно, кучу и сложные цепочки.
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
              Каждая подтема дала свой приём для одного прохода по записям, и
              любое решение собирается из них.
            </strong>{" "}
            Сверху — путь от файла к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 26 на одной схеме"}
            flow={[
              { name: "Файл", note: "по описанию формата" },
              { name: "Записи", note: "сортировка по ключу" },
              { name: "Проход", note: "выбрать лучшее или исполнить правила" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="zapisi-i-rejting">
                    Записи, сортировка и рейтинг
                  </Sub>
                ),
                rows: [
                  {
                    key: <>запись</>,
                    note: <>кортеж полей одного объекта</>,
                  },
                  {
                    key: <Notation>{"key=lambda r: (-r[1], r[0])"}</Notation>,
                    note: (
                      <>минус — «больше выше», второе поле — при равенстве</>
                    ),
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="zhadnyj-vybor">Жадный выбор</Sub>,
                rows: [
                  {
                    key: <>больше всего</>,
                    note: <>брать от самых маленьких</>,
                  },
                  {
                    key: <>второй критерий</>,
                    note: <>закрепить количество, потом улучшать</>,
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="cepochki-i-pary">Цепочки коробок и пары</Sub>,
                rows: [
                  {
                    key: <>матрёшка</>,
                    note: <>брать самую большую подходящую</>,
                  },
                  { key: <>пары</>, note: <>два указателя с концов</> },
                ],
              },
              {
                number: 4,
                title: <Sub slug="ryady-i-serii">Ряды, серии и группы</Sub>,
                rows: [
                  {
                    key: <>свободно между</>,
                    note: <>b − a − 1 мест</>,
                  },
                  {
                    key: <>последняя серия</>,
                    note: <>учесть после цикла</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="intervaly">Интервалы и события</Sub>,
                rows: [
                  {
                    key: <>мероприятия</>,
                    note: <>брать по раннему окончанию</>,
                  },
                  {
                    key: <>нагрузка</>,
                    note: <>события +1 и −1 по времени</>,
                  },
                ],
              },
              {
                number: 6,
                title: <Sub slug="modelirovanie">Моделирование процесса</Sub>,
                rows: [
                  {
                    key: <Notation>{"free_at"}</Notation>,
                    note: <>когда освободится каждая ячейка</>,
                  },
                  {
                    key: <>правило</>,
                    note: <>дословно: «со следующей минуты» — строго {"<"}</>,
                  },
                ],
              },
              {
                number: 7,
                title: (
                  <Sub slug="pary-okno-i-cepochki">
                    Пары, окно и сложные цепочки
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  { key: <>окно</>, note: <>левая граница догоняет правую</> },
                  { key: <>куча</>, note: <>быстро достаёт наименьшее</> },
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
              Любое задание 26 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — понять, выбирать ли лучшее самому или исполнять
                правила условия. Проверка — пять-шесть объектов на бумаге: так
                камеру хранения проверили на двух ячейках.
              </>
            }
          />
          <Typography.Text>
            Если ответ — два числа, проверь второе отдельно: оно часто считается
            другим приёмом, чем первое.
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
                label: "заголовок как данные",
                value: (
                  <FinalMistake
                    wrong="количество объектов прочитано как объект"
                    right="первые строки — заголовок"
                    question="совпадает ли длина списка с N из файла?"
                  />
                ),
                note: <Sub slug="zapisi-i-rejting">подтема 1</Sub>,
              },
              {
                label: "поля по отдельности",
                value: (
                  <FinalMistake
                    wrong="начала и окончания отсортированы раздельно"
                    right="сортируют записи целиком"
                    question="есть ли каждая запись в исходных данных?"
                  />
                ),
                note: <Sub slug="zapisi-i-rejting">подтема 1</Sub>,
              },
              {
                label: "break без сортировки",
                value: (
                  <FinalMistake
                    wrong="цикл остановлен на первом неподходящем"
                    right="сначала сортировка, потом break"
                    question="а если маленький объект стоит в конце?"
                  />
                ),
                note: <Sub slug="zhadnyj-vybor">подтема 2</Sub>,
              },
              {
                label: "второй критерий сразу",
                value: (
                  <FinalMistake
                    wrong="сразу выбран наибольший объект"
                    right="закрепить количество, потом улучшать"
                    question="не стало ли объектов меньше?"
                  />
                ),
                note: <Sub slug="zhadnyj-vybor">подтема 2</Sub>,
              },
              {
                label: "последняя серия",
                value: (
                  <FinalMistake
                    wrong="серия в конце ряда не учтена"
                    right="проверка ещё раз после цикла"
                    question="что, если ряд кончается серией?"
                  />
                ),
                note: <Sub slug="ryady-i-serii">подтема 4</Sub>,
              },
              {
                label: "та же минута",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"free_at[i] <= start"}</Notation>}
                    right={<Notation>{"free_at[i] < start"}</Notation>}
                    question="можно ли занять ячейку в минуту освобождения?"
                  />
                ),
                note: <Sub slug="modelirovanie">подтема 6</Sub>,
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
            Нужно сохранить на диск как можно больше файлов. В каком порядке их
            брать?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            От самых маленьких: каждый маленький оставляет больше места
            остальным.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Ячейка освободилась в минуту 404. Можно ли положить в неё багаж в
            404? А в 405?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В 404 нельзя — только со следующей минуты, поэтому в программе
            free_at[i] {"<"} start. В 405 можно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему заявки задачи темы сортируют перед проходом?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Пассажиров обслуживают в порядке прихода, а в файле заявки
            перемешаны: requests.sort() упорядочивает их по времени сдачи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Места в ряду заняты под номерами 3 и 8. Сколько свободных мест между
            ними?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>8 − 3 − 1 = 4: места 4, 5, 6 и 7.</Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от чтения файла до ответа 859 11. Вот
        что взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Записи, порядок, способ, проход, проверка.</>,
          },
          {
            key: "Записи",
            note: <>Кортежи и сортировка по ключу.</>,
          },
          {
            key: "Выбор",
            note: <>Жадно: от маленьких, по раннему окончанию, указатели.</>,
          },
          {
            key: "Правила",
            note: <>Исполняются дословно — «со следующей минуты» строго.</>,
          },
          {
            key: "Задача темы",
            note: <>859 пассажиров, последний — в ячейке 11.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
