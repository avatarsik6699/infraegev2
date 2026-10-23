// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./divisors-and-masks.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Прежде чем запускать программу на миллионах чисел, проверь её на
          маленьких, где ответ виден в уме: так мы проверили задачу темы на
          границе 3000.
        </strong>{" "}
        Функции проверяют на числах, где ошибиться проще всего:
      </Typography.Text>
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
        У 1 единица и само число совпадают, 2 — простое, у 16 и 49 корень должен
        встретиться ровно один раз. Выбери ошибку, чтобы увидеть, как её
        поймать:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "range(L, R)",
            value: <>Отрезок [L; R] перебран без правой границы</>,
            note: <>сравни последнее проверенное число с R</>,
          },
          {
            label: "корень дважды",
            value: <>Пара 7 · 7 добавлена двумя делителями</>,
            note: <>у 49 должно быть три делителя, а не четыре</>,
          },
          {
            label: "D[-1] без sorted",
            value: <>Наибольший делитель взят из несортированного списка</>,
            note: <>у 30 получится 6 вместо 30</>,
          },
          {
            label: "M = 0",
            value: <>«M оканчивается на 0» пропускает простые числа</>,
            note: <>проверь, не попало ли в ответ простое число</>,
          },
          {
            label: "if вместо while",
            value: <>В разложении каждый множитель вынут один раз</>,
            note: <>prime_factors(72) должно дать пять множителей</>,
          },
          {
            label: "пустая звёздочка",
            value: <>Длина вставки начата с 1</>,
            note: <>проверь число маски без вставки, например 123678</>,
          },
          {
            label: "ноль впереди",
            value: <>Первый ? маски получил цифру 0</>,
            note: <>число станет короче маски — проверь длину записи</>,
          },
        ]}
      />
      <Typography.Text>
        И оцени размер перебора до запуска: сколько чисел и сколько работы с
        каждым. Десять миллионов простых проверок — секунды. Миллион чисел около
        10⁹ с поиском делителей до √n — это 3 · 10¹⁰ шагов, слишком долго. Тогда
        ищи шаг, построение по маске или вид числа.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Задание 25 — перебор чисел с проверкой. Вся работа в том, чтобы
          проверка была верной, а кандидатов — как можно меньше: шаг, построение
          по маске, поиск делителей до √n.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
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
              <SubtopicLink routeSlug={R} subtopic="perebor-i-proverki">
                Перебор и запись числа
              </SubtopicLink>
            ),
            rows: [
              { key: <>первые k</>, note: <>while found &lt; k</> },
              {
                key: <Notation>{"'6' in str(n)"}</Notation>,
                note: <>цифра в записи</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="deliteli-parami">
                Делители парами
              </SubtopicLink>
            ),
            rows: [
              { key: <>d и n // d</>, note: <>d до isqrt(n)</> },
              { key: <>корень</>, note: <>один раз</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="chisla-po-delitelyam">
                Числа с нужными делителями
              </SubtopicLink>
            ),
            rows: [
              { key: <>ровно k</>, note: <>len(D) == k</> },
              { key: <>M</>, note: <>M = 0 — отдельно</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="prostye-i-razlozhenie">
                Простые числа и разложение
              </SubtopicLink>
            ),
            rows: [
              { key: <>len(f)</>, note: <>множители с повторами</> },
              { key: <>len(set(f))</>, note: <>различные простые делители</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="maski">
                Маски
              </SubtopicLink>
            ),
            rows: [
              { key: <>кратные k</>, note: <>range(0, limit + 1, k)</> },
              { key: <>? и *</>, note: <>построить через product</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="vid-chisla">
                Вид числа по количеству делителей
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>3 делителя</>, note: <>p²</> },
              { key: <>огромный отрезок</>, note: <>перебирать p</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к программе",
            steps: [
              <>
                Не пропустит ли она подходящее число: границы, корень, пустая *?
              </>,
              <>
                Не примет ли лишнее: 1 и само число, M = 0, «ровно» и «не
                менее»?
              </>,
              <>Выводит ли то, что просят, и в нужном порядке?</>,
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
