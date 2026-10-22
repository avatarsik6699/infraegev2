// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./number-sequences.paid.treugolniki.media";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "treugolniki",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Изредка в
            задании 17 спрашивают тройки, которые могут быть сторонами
            треугольника. Задачи основных подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            Например: «определите количество троек, которые могут быть сторонами
            прямоугольного треугольника, затем максимальную из сумм элементов
            таких троек». Перебор троек и ответ — те же, что в задаче темы,
            меняется только проверка. Её разберём на тройках 3, 4, 5; 2, 3, 4 и
            1, 2, 3 — стороны, которые легко нарисовать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sushchestvovanie",
      navLabel: "Существование",
      explanation: (
        <>
          <Typography.Text>
            Из любых ли трёх чисел можно сложить треугольник?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет. Упорядочим стороны: p ≤ q ≤ r. Треугольник есть, только если
              две меньшие стороны вместе длиннее большей: p + q {">"} r.
            </strong>{" "}
            Положим две меньшие стороны вдоль большей:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqTriangle_1dc124}
            caption={
              <>
                Отрезки 1 и 2 вместе ровно равны 3 — их можно только уложить на
                одну прямую. Отрезки 2 и 3 вместе длиннее 4 — их концы можно
                поднять и свести в вершину треугольника.
              </>
            }
          />
          <Typography.Text>
            Остальные две проверки — p + r {">"} q и q + r {">"} p — после
            сортировки выполняются сами: к стороне прибавляют самую длинную, и
            сумма заведомо больше. Поэтому тройку сначала сортируют, а потом
            проверяют одно неравенство.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vid-treugolnika",
      navLabel: "Вид треугольника",
      explanation: (
        <>
          <Typography.Text>
            Как узнать, прямоугольный треугольник, остроугольный или
            тупоугольный?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сравни сумму квадратов двух меньших сторон с квадратом большей.
            </strong>{" "}
            Равенство — это теорема Пифагора, прямой угол. Если сумма больше,
            все углы острые, если меньше — угол напротив большей стороны тупой:
          </Typography.Text>
          <VariantPicker
            label={"Вид треугольника и проверка"}
            variants={[
              {
                label: "прямоугольный",
                value: <>p² + q² = r²</>,
                note: <>3, 4, 5: 9 + 16 = 25</>,
              },
              {
                label: "остроугольный",
                value: <>p² + q² {">"} r²</>,
                note: <>4, 5, 6: 16 + 25 = 41 {">"} 36</>,
              },
              {
                label: "тупоугольный",
                value: <>p² + q² {"<"} r²</>,
                note: <>2, 3, 4: 4 + 9 = 13 {"<"} 16</>,
              },
            ]}
          />
          <ProofDisclosure summary="Почему острый и тупой угол различает квадрат большей стороны">
            <Typography.Text>
              Представь, что две меньшие стороны закреплены, а угол между ними
              раскрывается. Чем шире угол, тем длиннее третья сторона. При
              прямом угле её квадрат ровно равен p² + q², при остром угле
              сторона короче, при тупом — длиннее.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Проверим все случаи программой — сначала существование, потом вид:
          </Typography.Text>
          <CodeBlock
            code={
              'for t in [[3, 4, 5], [4, 5, 6], [2, 3, 4], [1, 2, 3]]:\n    p, q, r = sorted(t)\n    if not (p > 0 and p + q > r):\n        print(t, "треугольника нет")\n    elif p ** 2 + q ** 2 == r ** 2:\n        print(t, "прямоугольный")\n    elif p ** 2 + q ** 2 > r ** 2:\n        print(t, "остроугольный")\n    else:\n        print(t, "тупоугольный")'
            }
            label={"Вид треугольника для четырёх троек"}
            language="python"
            output={
              "[3, 4, 5] прямоугольный\n[4, 5, 6] остроугольный\n[2, 3, 4] тупоугольный\n[1, 2, 3] треугольника нет"
            }
          />
        </>
      ),
    },
    {
      id: "pryamougolnyj",
      navLabel: "Прямоугольный",
      explanation: (
        <>
          <Typography.Text>
            Зачем проверять существование, если равенство Пифагора уже
            выполнено?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Равенство выполняется и у троек, из которых треугольник не
              сложить.
            </strong>{" "}
            Например, 0, 5, 5: 0² + 5² = 5², но стороны длины ноль не бывает.
            Такую тройку отсекает неравенство: 0 + 5 = 5, а не больше. Пусть по
            условию, если подходящих троек нет, нужно вывести{" "}
            <Notation>{"0 0"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "a = [5, 12, 13, 0, 5, 5]\nsums = []\nfor i in range(len(a) - 2):\n    p, q, r = sorted([a[i], a[i + 1], a[i + 2]])\n    is_triangle = p > 0 and p + q > r\n    is_right = p ** 2 + q ** 2 == r ** 2\n    if is_triangle and is_right:\n        sums.append(p + q + r)\nif len(sums) == 0:\n    print(0, 0)\nelse:\n    print(len(sums), max(sums))"
            }
            label={"Прямоугольные тройки с ответом 0 0 по условию"}
            language="python"
            output={"1 30"}
          />
          <Typography.Text>
            Подходит только 5, 12, 13. У последней тройки 0, 5, 5 равенство
            выполнено, но <Notation>{"is_triangle"}</Notation> ложно — без этой
            проверки программа вывела бы <Notation>{"2 30"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "treugolniki-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Сортировка",
                note: (
                  <>
                    <Notation>{"p, q, r = sorted(t)"}</Notation>: p ≤ q ≤ r
                  </>
                ),
              },
              {
                key: "Существование",
                note: <>p + q {">"} r — две другие проверки выполняются сами</>,
              },
              {
                key: "Прямоугольный",
                note: <>p² + q² = r²</>,
              },
              {
                key: "Остроугольный",
                note: <>p² + q² {">"} r²</>,
              },
              {
                key: "Тупоугольный",
                note: <>p² + q² {"<"} r²</>,
              },
              {
                key: "0, 5, 5",
                note: (
                  <>равенство Пифагора без проверки существования ошибается</>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Образуют ли треугольник тройки 5, 5, 10 и 2, 2, 3? Если да, то какой?
        </>
      ),
      reveal: (
        <>
          5, 5, 10 — нет: 5 + 5 = 10. 2, 2, 3 — да, тупоугольный: 2 + 2 {">"} 3,
          но 4 + 4 = 8 {"<"} 9.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Определи вид треугольника: 6, 8, 10; 5, 6, 7; 4, 6, 9.</>,
      reveal: (
        <>
          Прямоугольный (36 + 64 = 100), остроугольный (25 + 36 = 61 {">"} 49),
          тупоугольный (4 + 6 {">"} 9, но 16 + 36 = 52 {"<"} 81).
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: <>Какое условие существования не выполнено для тройки 0, 3, 3?</>,
      reveal: (
        <>p + q {">"} r: 0 + 3 = 3. Сторона длины ноль тоже недопустима.</>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Объясни, почему для 7, 2, 4 достаточно проверить одно неравенство
          после сортировки. Образуют ли эти числа треугольник?
        </>
      ),
      reveal: (
        <>
          После сортировки 2, 4, 7: если две меньшие стороны вместе не длиннее
          большей, треугольника нет, а остальные неравенства выполнены всегда.
          Здесь 2 + 4 = 6 {"<"} 7 — треугольника нет.
        </>
      ),
    },
  ],
};

export default content;
