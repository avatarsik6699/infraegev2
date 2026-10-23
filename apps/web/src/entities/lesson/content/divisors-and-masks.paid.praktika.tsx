// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
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
import { lessonMedia } from "./divisors-and-masks.paid.praktika.media";
import { SubtopicLink } from "./subtopic-link";

/** A subtopic of this topic, linked from the final page. */
const Sub: React.FC<{ slug: string; children: React.ReactNode }> = (props) => (
  <SubtopicLink routeSlug="25-deliteli-i-maski" subtopic={props.slug}>
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
              Задача темы — первые пять чисел больше 7 000 000, равных
              произведению двух простых с цифрами 1 и 6, — собиралась из функций
              нескольких подтем.
            </strong>{" "}
            Пролистай версии: точками отмечены строки, которых не было в
            предыдущей.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.finalTask}
            label={"Задача темы: функции подтем и ответ"}
          />
          <Typography.Text>
            Перебор везде один — меняется проверка числа. Подтема 3 считает
            делители и величину M, подтема 5 перебирает по маске с шагом, равным
            делителю, а дополнительный урок по числу делителей узнаёт вид числа,
            когда отрезок слишком большой для перебора.
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
              Каждая подтема дала одну проверку или способ перебора, и любое
              решение собирается из них.
            </strong>{" "}
            Сверху — путь от кандидатов к ответу, ниже — по блоку на подтему.
            Заголовок блока ведёт на подтему.
          </Typography.Text>
          <TopicCheatSheet
            label={"Задание 25 на одной схеме"}
            flow={[
              { name: "Кандидаты", note: "отрезок, шаг или маска" },
              { name: "Проверка", note: "делители, множители, запись" },
              { name: "Вывод", note: "что и в каком порядке" },
            ]}
            groups={[
              {
                number: 1,
                title: (
                  <Sub slug="perebor-i-proverki">Перебор и запись числа</Sub>
                ),
                rows: [
                  {
                    key: <>первые k</>,
                    note: <>while found {"<"} k, n растёт от границы</>,
                  },
                  {
                    key: <Notation>{"'6' in str(n)"}</Notation>,
                    note: <>цифра в записи числа</>,
                  },
                ],
              },
              {
                number: 2,
                title: <Sub slug="deliteli-parami">Делители парами</Sub>,
                rows: [
                  {
                    key: <>d и n // d</>,
                    note: <>d только до isqrt(n)</>,
                  },
                  { key: <>корень</>, note: <>добавить один раз</> },
                ],
              },
              {
                number: 3,
                title: (
                  <Sub slug="chisla-po-delitelyam">
                    Числа с нужными делителями
                  </Sub>
                ),
                rows: [
                  { key: <>ровно k</>, note: <>len(D) == k</> },
                  {
                    key: <>M</>,
                    note: <>M = 0 — отдельный случай, проверь простые</>,
                  },
                ],
              },
              {
                number: 4,
                title: (
                  <Sub slug="prostye-i-razlozhenie">
                    Простые числа и разложение
                  </Sub>
                ),
                rows: [
                  {
                    key: <Notation>{"len(f)"}</Notation>,
                    note: <>множители с повторами</>,
                  },
                  {
                    key: <Notation>{"len(set(f))"}</Notation>,
                    note: <>различные простые делители</>,
                  },
                ],
              },
              {
                number: 5,
                title: <Sub slug="maski">Маски</Sub>,
                rows: [
                  {
                    key: <>кратные k</>,
                    note: <>range(0, limit + 1, k)</>,
                  },
                  {
                    key: <>? и *</>,
                    note: <>fnmatch или построить через product</>,
                  },
                ],
              },
              {
                number: 6,
                title: (
                  <Sub slug="vid-chisla">Вид числа по количеству делителей</Sub>
                ),
                level: "дополнительный урок",
                rows: [
                  { key: <>3 делителя</>, note: <>это p²</> },
                  {
                    key: <>огромный отрезок</>,
                    note: <>перебирать p, а не числа</>,
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
              Любое задание 25 решается одним порядком из пяти шагов.
            </strong>{" "}
            Каждому шагу ты уже учился — под ним номера подтем:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.finalCycle}
            caption={
              <>
                Главный шаг — проверка числа: она должна быть верной и быстрой.
                Прежде чем запускать её на миллионах чисел, проверь на
                маленьких, где ответ виден в уме.
              </>
            }
          />
          <CodeBlock
            collapsible={false}
            code={
              "for n in [1, 2, 12, 16, 49]:\n    print(n, get_divisors(n), prime_factors(n))"
            }
            label={"Проверка функций на маленьких числах"}
            language="python"
            output={
              "1 [1] []\n2 [1, 2] [2]\n12 [1, 2, 3, 4, 6, 12] [2, 2, 3]\n16 [1, 2, 4, 8, 16] [2, 2, 2, 2]\n49 [1, 7, 49] [7, 7]"
            }
          />
          <Typography.Text>
            И оцени размер перебора до запуска: десять миллионов простых
            проверок — секунды, а миллион чисел около 10⁹ с поиском делителей до
            √n — 3 · 10¹⁰ шагов, слишком долго. Тогда ищи шаг, построение по
            маске или вид числа.
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
              Семь ошибок встречаются чаще других, и каждую ловит один вопрос к
              себе.
            </strong>{" "}
            Выбери ошибку — увидишь, как её исправить, и вопрос, который её
            ловит:
          </Typography.Text>
          <VariantPicker
            label={"Частые ошибки и вопросы, которые их ловят"}
            variants={[
              {
                label: "range(L, R)",
                value: (
                  <FinalMistake
                    wrong={<Notation>{"range(L, R)"}</Notation>}
                    right={<Notation>{"range(L, R + 1)"}</Notation>}
                    question="проверено ли само число R?"
                  />
                ),
                note: <Sub slug="perebor-i-proverki">подтема 1</Sub>,
              },
              {
                label: "корень дважды",
                value: (
                  <FinalMistake
                    wrong="у 49 делители 1, 7, 7, 49"
                    right="корень добавляют один раз"
                    question="сколько делителей у 49?"
                  />
                ),
                note: <Sub slug="deliteli-parami">подтема 2</Sub>,
              },
              {
                label: "D[-1] без sorted",
                value: (
                  <FinalMistake
                    wrong="наибольший делитель — последний добавленный"
                    right="список сортируют"
                    question="что получится у 30?"
                  />
                ),
                note: <Sub slug="deliteli-parami">подтема 2</Sub>,
              },
              {
                label: "M = 0",
                value: (
                  <FinalMistake
                    wrong="«M оканчивается на 0» пропускает простые"
                    right="у простых M = 0 — тоже подходит"
                    question="не попало ли в ответ простое число?"
                  />
                ),
                note: <Sub slug="chisla-po-delitelyam">подтема 3</Sub>,
              },
              {
                label: "if вместо while",
                value: (
                  <FinalMistake
                    wrong="каждый множитель вынут один раз"
                    right="while m % d == 0"
                    question="сколько множителей у 72?"
                  />
                ),
                note: <Sub slug="prostye-i-razlozhenie">подтема 4</Sub>,
              },
              {
                label: "пустая звёздочка",
                value: (
                  <FinalMistake
                    wrong="вставка вместо * начата с длины 1"
                    right="* — любые цифры, даже ни одной"
                    question="проверено ли число без вставки?"
                  />
                ),
                note: <Sub slug="maski">подтема 5</Sub>,
              },
              {
                label: "ноль впереди",
                value: (
                  <FinalMistake
                    wrong="первый ? маски получил 0"
                    right="число не начинается с нуля"
                    question="не стала ли запись короче маски?"
                  />
                ),
                note: <Sub slug="maski">подтема 5</Sub>,
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
          <Typography.Text>Почему делители ищут только до √n?</Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Делители идут парами d и n // d, и в каждой паре меньший не больше
            √n: найдя его, сразу получаем и второй.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            prime_factors(3721) = [61, 61]. Подходит ли 3721 под «произведение
            ровно двух простых, не обязательно различных»?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Да: len(f) == 2, повторы считаются. «Различных» было бы len(set(f)).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Числа до 10⁸, делящиеся на 1301 и подходящие под маску. Как
            перебирать?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Шагом 1301: range(0, 10**8 + 1, 1301) — в 1301 раз меньше
            кандидатов, а маску проверяет fnmatch.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>У каких чисел ровно три делителя?</Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            У квадратов простых: p² делится на 1, p и p².
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Тема пройдена: задача темы решена от перебора до пяти ответов. Вот что
        взять с собой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Порядок",
            note: <>Кандидаты, проверка, малые числа, размер, вывод.</>,
          },
          {
            key: "Делители",
            note: <>Парами до √n, корень один раз.</>,
          },
          {
            key: "Множители",
            note: <>while m % d == 0; len(f) и len(set(f)).</>,
          },
          {
            key: "Маски",
            note: <>Шаг, равный делителю, и fnmatch.</>,
          },
          {
            key: "Задача темы",
            note: <>Первое число — 7 000 421 = 61 · 114 761.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
