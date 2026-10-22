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
import { R, SAMPLE_LIST } from "./number-sequences.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Программу проверяют на коротком списке, где ответ известен заранее:
          одни тройки подходят, другие нет.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "порог по ходу чтения",
            value: <>Порог считается в том же цикле, что и тройки</>,
            note: <>найти порог до цикла по всему списку</>,
          },
          {
            label: "окончание без модуля",
            value: (
              <>
                <Notation>{"x % 100 == 25"}</Notation> не видит −325
              </>
            ),
            note: (
              <>
                окончание — <Notation>{"abs(x) % 100"}</Notation>
              </>
            ),
          },
          {
            label: "цифры без модуля",
            value: <>−1250 не считается четырёхзначным</>,
            note: <Notation>{"1000 <= abs(x) <= 9999"}</Notation>,
          },
          {
            label: "«не более двух» как «ровно два»",
            value: (
              <>
                Написано <Notation>{"k == 2"}</Notation>
              </>
            ),
            note: (
              <>
                «не более двух» — <Notation>{"k <= 2"}</Notation>
              </>
            ),
          },
          {
            label: "граница range",
            value: (
              <>
                Тройки перебираются <Notation>{"range(len(a))"}</Notation>
              </>
            ),
            note: (
              <>
                тройки — <Notation>{"range(len(a) - 2)"}</Notation>
              </>
            ),
          },
          {
            label: "строгое и нестрогое",
            value: <>«Не больше» записано как {"<"}</>,
            note: <>проверить тройку, чья сумма равна порогу</>,
          },
          {
            label: "модуль в списке",
            value: <>В список для порога попал abs(x), а не x</>,
            note: <>отбирать по модулю, класть исходное число</>,
          },
          {
            label: "что выводить",
            value: <>Выведена наибольшая сумма, а спросили наименьшую</>,
            note: <>перечитать последнюю фразу условия</>,
          },
        ]}
      />
      <Typography.Text>
        Удобнее всего проверять на восьми числах темы: ответ на них — 4 1707.
        Замени чтение файла списком и выведи каждую тройку с проверками:
      </Typography.Text>
      <CodeBlock
        code={
          "def four(x):\n    return 1000 <= abs(x) <= 9999\n\n\n" +
          SAMPLE_LIST +
          "\nfor i in range(len(a) - 2):\n    x, y, z = a[i], a[i + 1], a[i + 2]\n    k = int(four(x)) + int(four(y)) + int(four(z))\n    print(i, x, y, z, k, x + y + z)"
        }
        label={"Отладочный вывод троек"}
        language="python"
        output={
          "0 125 1300 -1250 2 175\n1 1300 -1250 -2100 3 -2050\n2 -1250 -2100 7 2 -3343\n3 -2100 7 -325 1 -2418\n4 7 -325 2025 1 1707\n5 -325 2025 3000 2 4700"
        }
      />
      <Typography.Text>
        Строки совпадают с таблицей из подтемы «Порог по всей
        последовательности» — значит, перебор и подсчёт верны. После проверки
        отладочный вывод убирают.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 17 решается в три шага: найти порог по всей
          последовательности, перебрать соседние группы с проверками условия и
          вывести количество и нужную величину.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 17 на одной схеме"}
        flow={[
          {
            name: "Порог",
            note: "до цикла: отбор и max, min, len, sum",
          },
          { name: "Перебор", note: "соседние группы: range(len(a) - k + 1)" },
          {
            name: "Ответ",
            note: "len(sums) и max или min списка",
          },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="chisla-i-proverki">
                Файл и условие
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"[int(x) for x in f]"}</Notation>,
                note: <>файл → список чисел</>,
              },
              {
                key: (
                  <>
                    <Notation>{"a[0]"}</Notation> …{" "}
                    <Notation>{"a[n - 1]"}</Notation>
                  </>
                ),
                note: <>индексы с нуля</>,
              },
              {
                key: <Notation>{"x % d == 0"}</Notation>,
                note: <>кратно d; ноль кратен любому числу</>,
              },
              {
                key: <Notation>{"(x + y) % 7 == 0"}</Notation>,
                note: <>условие на саму сумму</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="sosednie-gruppy">
                Соседние пары и тройки
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"range(len(a) - 1)"}</Notation>,
                note: <>пары</>,
              },
              {
                key: <Notation>{"range(len(a) - 2)"}</Notation>,
                note: <>тройки</>,
              },
              {
                key: <Notation>{"sums.append(s)"}</Notation>,
                note: <>внутри if; ответ — len и max</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="skolko-podhodit">
                Сколько чисел подходит
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"k = int(…) + int(…) + int(…)"}</Notation>,
                note: <>количество выполненных проверок</>,
              },
              {
                key: (
                  <>
                    <Notation>{"k == 1"}</Notation>,{" "}
                    <Notation>{"k <= 2"}</Notation>
                  </>
                ),
                note: <>ровно одно, не более двух</>,
              },
              {
                key: <Notation>{"1000 <= abs(x) <= 9999"}</Notation>,
                note: <>четырёхзначное</>,
              },
              {
                key: <>одно…, а другое…</>,
                note: <>два распределения ролей</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="cifry-i-znak">
                Цифры и знак
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"abs(x) % 100 == 25"}</Notation>,
                note: (
                  <>
                    окончание; <Notation>{"-325 % 100"}</Notation> = 75
                  </>
                ),
              },
              {
                key: <Notation>{"x % 5 == 2"}</Notation>,
                note: <>остаток — без модуля</>,
              },
              {
                key: <Notation>{"int(x < 0) + int(y < 0) == 1"}</Notation>,
                note: <>ровно одно отрицательное; ноль не отрицателен</>,
              },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="vsya-posledovatelnost">
                Порог по всей последовательности
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"[x for x in a if …]"}</Notation>,
                note: <>отбор; в список — исходные числа</>,
              },
              { key: <>до цикла</>, note: <>порог считают один раз</> },
              {
                key: <Notation>{"x * k < s"}</Notation>,
                note: <>сравнение со средним без деления</>,
              },
              { key: <>8358 99821</>, note: <>ответ задачи темы</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="chto-proveryat-i-vyvodit">
                Длинные формулировки
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"min(a) ** 2"}</Notation>,
                note: <>квадрат минимума, а не минимум квадратов</>,
              },
              {
                key: <Notation>{"x % d == m % d"}</Notation>,
                note: <>остаток минимального</>,
              },
              {
                key: <Notation>{"sum(t) - min(t)"}</Notation>,
                note: <>два наибольших в тройке</>,
              },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink routeSlug={R} subtopic="treugolniki">
                Тройка как стороны треугольника
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              {
                key: <Notation>{"p, q, r = sorted(t)"}</Notation>,
                note: <>треугольник, если p + q {">"} r</>,
              },
              {
                key: <>p² + q² и r²</>,
                note: (
                  <>
                    =, {">"}, {"<"} — прямоугольный, острый, тупой
                  </>
                ),
              },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Какой порог нужен заранее и по каким числам его искать?</>,
              <>
                Что проверяют у группы: «хотя бы», «ровно», «не более», «не
                больше»?
              </>,
              <>Какую величину выводят: сумму, минимум, модуль?</>,
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
