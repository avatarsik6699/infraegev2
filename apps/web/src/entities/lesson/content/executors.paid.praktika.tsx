// Paid content (Change 192): served only after an access check; never
// import it statically.
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
import { lessonMedia } from "./executors.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink
    routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
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
              Задача темы — наибольшее число нулей во входе из 12 цифр, если
              после работы машины осталось ровно 5 нулей, — решается приёмами
              подтем по очереди.
            </strong>{" "}
            Пролистай решение: в подписи каждого шага — подтема, откуда приём.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы: от тактов до ответа"}
          />
          <Typography.Text>
            Машину не прогоняли по всей ленте: хватило нескольких тактов, чтобы
            понять смысл таблицы — «минус один», — а дальше ответ получился
            рассуждением. Подтемы 5 и 6 разбирают таблицы с фазами и ограничения
            на сумму цифр.
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
              Каждая подтема дала один способ понять таблицу, и любое решение
              собирается из них.
            </strong>{" "}
            Сверху — путь от таблицы к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 12 на одной схеме"}
            flow={[
              { name: "Такты", note: "запись, сдвиг, новое состояние" },
              { name: "Смысл", note: "что таблица делает с любой строкой" },
              { name: "Ответ", note: "число, слово, количество или граница" },
            ]}
            groups={[
              {
                number: 1,
                title: <Sub slug="lenta-i-komanda">Лента, команда и такт</Sub>,
                rows: [
                  {
                    key: <>λ, L, q1</>,
                    note: <>записать → сдвинуться → сменить состояние</>,
                  },
                  {
                    key: <>S</>,
                    note: <>запись и остановка; такт считается</>,
                  },
                  {
                    key: <>λ</>,
                    note: <>пустая ячейка — свой столбец, не ноль</>,
                  },
                ],
              },
              {
                number: 2,
                title: (
                  <Sub slug="prohod-i-kolichestva">
                    Однократный проход и количества
                  </Sub>
                ),
                rows: [
                  {
                    key: <>замена</>,
                    note: <>каждая ячейка меняется сама по себе</>,
                  },
                  {
                    key: <>количества</>,
                    note: <>из результата обратно во вход</>,
                  },
                  {
                    key: <>два символа в один</>,
                    note: <>выбор — для наименьшего и наибольшего</>,
                  },
                ],
              },
              {
                number: 3,
                title: <Sub slug="slovo-i-chislo">Двоичное число на ленте</Sub>,
                rows: [
                  {
                    key: <>20 → 19</>,
                    note: <>таблица задачи темы: минус один</>,
                  },
                  { key: <>N + 2ᵏ</>, note: <>единица дописана слева</> },
                  { key: <>2N + 1</>, note: <>единица дописана справа</> },
                  { key: <>2ᵏ − 1 − N</>, note: <>инверсия всех цифр</> },
                ],
              },
              {
                number: 4,
                title: (
                  <Sub slug="hvost-i-obratnaya-zadacha">
                    Хвост и обратная задача
                  </Sub>
                ),
                rows: [
                  {
                    key: <>P 1 0ᵗ → P 0 1ᵗ</>,
                    note: <>меняется только хвост</>,
                  },
                  {
                    key: <>обратный вопрос</>,
                    note: <>от результата к входу, пример на границе</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="sostoyaniya-i-fazy">Состояния и фазы</Sub>,
                rows: [
                  {
                    key: <>фаза</>,
                    note: <>что делает и чем заканчивается</>,
                  },
                  {
                    key: <>такты</>,
                    note: <>сумма по фазам, например 2k + 4</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="ogranicheniya-na-summu">
                    Сумма, простота и ограничения
                  </Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  {
                    key: <>S = 7a + 8b + 3c</>,
                    note: <>сумма через количества цифр</>,
                  },
                  {
                    key: <>простое</>,
                    note: <>больше 1, делители до √x</>,
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
              Любое задание 12 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — смысл таблицы: замена, арифметика, хвост или фазы.
                Если короткая трасса не сошлась с ним, пересматривают смысл, а
                не прогоняют машину по всей ленте.
              </>
            }
          />
          <Typography.Text>
            Для обратного вопроса ответ подтверждают входом, на котором
            достигается граница: в задаче темы это 0000 1 0000000.
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
                label: "запись при S",
                value: (
                  <FinalMistake
                    wrong="при S запись пропустили"
                    right="сначала запись, потом остановка"
                    question="что команда пишет в ячейку при S?"
                  />
                ),
                note: <Sub slug="lenta-i-komanda">подтема 1</Sub>,
              },
              {
                label: "запись после сдвига",
                value: (
                  <FinalMistake
                    wrong="символ записали в новую ячейку"
                    right="запись — в текущую, потом сдвиг"
                    question="где стояла головка, когда читали символ?"
                  />
                ),
                note: <Sub slug="lenta-i-komanda">подтема 1</Sub>,
              },
              {
                label: "начальная ячейка",
                value: (
                  <FinalMistake
                    wrong="головка начала на последней цифре"
                    right="в пустой ячейке справа"
                    question="где головка по условию?"
                  />
                ),
                note: <Sub slug="lenta-i-komanda">подтема 1</Sub>,
              },
              {
                label: "λ — ноль",
                value: (
                  <FinalMistake
                    wrong="пустой символ λ прочитали как 0"
                    right="λ — свой столбец таблицы"
                    question="какой столбец таблицы я читаю?"
                  />
                ),
                note: <Sub slug="lenta-i-komanda">подтема 1</Sub>,
              },
              {
                label: "q0 — стоп",
                value: (
                  <FinalMistake
                    wrong="состояние q0 приняли за остановку"
                    right="остановку задаёт только S"
                    question="есть ли в команде S?"
                  />
                ),
                note: <Sub slug="lenta-i-komanda">подтема 1</Sub>,
              },
              {
                label: "слово и число",
                value: (
                  <FinalMistake
                    wrong="длину взяли по числу без ведущих нулей"
                    right="ведущие нули — тоже ячейки слова"
                    question="сколько ячеек занимает слово?"
                  />
                ),
                note: <Sub slug="slovo-i-chislo">подтема 3</Sub>,
              },
              {
                label: "выборка вместо границы",
                value: (
                  <FinalMistake
                    wrong="максимум взяли из нескольких запусков"
                    right="граница рассуждением и пример на ней"
                    question="почему больше быть не может?"
                  />
                ),
                note: <Sub slug="hvost-i-obratnaya-zadacha">подтема 4</Sub>,
              },
              {
                label: "не та величина",
                value: (
                  <FinalMistake
                    wrong="записали результат, а спрашивали такты"
                    right="ответ — то, что спрашивают"
                    question="число, слово, такты или вход?"
                  />
                ),
                note: <Sub slug="sostoyaniya-i-fazy">подтема 5</Sub>,
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
            Что таблица задачи темы сделает со словом 10111000?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            10110111: хвост из трёх нулей станет единицами, единица перед ним —
            нулём. Это 184 − 1 = 183.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Сколько тактов таблица задачи темы делает на слове с хвостом из t
            нулей?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            t + 2: вход в строку, t нулей хвоста и остановочная замена единицы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему в задаче темы во входе не может быть 12 нулей?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Без единицы машине нечего вычесть: ей нужна остановочная единица.
            Значит, нулей не больше 11.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Таблица дописывает единицу справа от двоичного числа N. Какое число
            получится?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>2N + 1: сдвиг на разряд и единица.</Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от первых тактов до ответа 11. Вот что
        взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Такты, смысл, вопрос, граница, проверка.</>,
          },
          {
            key: "Такт",
            note: <>Запись в текущую ячейку, сдвиг, новое состояние.</>,
          },
          {
            key: "Смысл",
            note: <>Замена, ±1 и цифры на краях, хвост или фазы.</>,
          },
          {
            key: "Граница",
            note: <>Рассуждение и вход, на котором она достигается.</>,
          },
          {
            key: "Задача темы",
            note: <>0000 1 0000000: 4 + 7 = 11 нулей.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
