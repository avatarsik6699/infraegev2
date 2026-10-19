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
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет закрыть все возможные случаи задания 17: в подборке две
            задачи на тройки — стороны треугольника, обе, по оценке, 2021 года;
            на экзаменах с 2022 года такие не встречались. Задачи основных
            подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              После сортировки тройки p ≤ q ≤ r треугольник существует, когда p
              + q {">"} r, а его вид определяет сравнение p² + q² с r².
            </strong>{" "}
            Здесь всё держится на одном неравенстве и одном сравнении — их легко
            проверить на рисунке.
          </Typography.Text>
          <Typography.Text>
            Будем проверять тройки 3, 4, 5; 2, 3, 4 и 1, 2, 3 — стороны, которые
            легко нарисовать. Сортировку тройки <Notation>{"sorted"}</Notation>{" "}
            из подтемы 6 считаем знакомой.
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
            <strong>
              В задачах на треугольники сначала нужно проверить, могут ли числа
              быть длинами сторон.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть три числа после упорядочивания: p ≤ q ≤ r. Для существования
            обычного, невырожденного треугольника нужно p {">"} 0 и{" "}
            <strong>p + q {">"} r</strong>.
          </Typography.Text>
          <Typography.Text>
            Почему достаточно проверить сумму двух меньших сторон? Положим две
            меньшие стороны вдоль большей:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqTriangle_1dc124}
            caption={
              <>
                Отрезки 1 и 2 вместе ровно равны 3 — их можно только уложить на
                одну прямую. Отрезки 2 и 3 вместе длиннее 4 — их концы можно
                приподнять и соединить вершиной треугольника.
              </>
            }
          />
          <Typography.Text>
            Другие неравенства выполняются автоматически:
          </Typography.Text>
          <ul>
            <li>
              p + r {">"} q, потому что r ≥ q и p {">"} 0;
            </li>
            <li>
              q + r {">"} p, потому что q ≥ p и r {">"} 0.
            </li>
          </ul>
          <Typography.Text>
            А вот{" "}
            <strong>
              две меньшие стороны могут оказаться слишком короткими
            </strong>
            . Например, 1, 2, 3 не образуют треугольник: 1 + 2 = 3. Получается
            вырожденный случай: стороны можно расположить на одной прямой, а
            треугольника с ненулевой площадью нет.
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
            <strong>
              После проверки существования вид треугольника определяет квадрат
              наибольшей стороны.
            </strong>
          </Typography.Text>
          <VariantPicker
            label={"Вид треугольника и критерий"}
            variants={[
              {
                label: "прямоугольный: один угол равен 90°",
                value: <>p² + q² = r²</>,
              },
              {
                label: "остроугольный: все углы меньше 90°",
                value: <>p² + q² {">"} r²</>,
              },
              {
                label: "тупоугольный: один угол больше 90°",
                value: <>p² + q² {"<"} r²</>,
              },
            ]}
          />
          <Typography.Text>
            Сравниваем именно с квадратом <strong>наибольшей стороны</strong>.
          </Typography.Text>
          <Typography.Text>
            Прямоугольный случай — теорема Пифагора.
          </Typography.Text>
          <ProofDisclosure summary="Почему острый и тупой угол различает квадрат наибольшей стороны">
            <Typography.Text>
              Остальные критерии можно понять через угол напротив наибольшей
              стороны: увеличение этого угла при фиксированных двух других
              сторонах увеличивает противоположную сторону. При угле меньше
              прямого её квадрат меньше суммы квадратов двух других сторон, при
              угле больше прямого — больше.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Проверим примеры: 3, 4, 5 — 9 + 16 = 25; 4, 5, 6 — 16 + 25 {">"} 36;
            2, 3, 4 — 4 + 9 {"<"} 16, при этом 2 + 3 {">"} 4; 1, 2, 3 — 1 + 2 =
            3:
          </Typography.Text>
          <CodeBlock
            code={
              'for triple in [[3, 4, 5], [4, 5, 6], [2, 3, 4], [1, 2, 3]]:\n    ordered = sorted(triple)\n    p = ordered[0]\n    q = ordered[1]\n    r = ordered[2]\n    if not (p > 0 and p + q > r):\n        print(triple, "треугольника нет")\n    elif p ** 2 + q ** 2 == r ** 2:\n        print(triple, "прямоугольный")\n    elif p ** 2 + q ** 2 > r ** 2:\n        print(triple, "остроугольный")\n    else:\n        print(triple, "тупоугольный")'
            }
            label={
              "Код на Python: for triple in [[3, 4, 5], [4, 5, 6], [2, 3, 4], [1, 2, 3]]:"
            }
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
            <strong>
              Проверка существования нужна и для прямоугольного треугольника.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Иначе тройка 0, 5, 5 удовлетворит равенству 0² + 5² = 5², но
            стороной длины ноль обычный треугольник обладать не может.{" "}
            <strong>Её отсекает уже неравенство</strong>: 0 + 5 = 5, а не
            больше. После сортировки отдельная проверка p {">"} 0 следует из p +
            q {">"} r — при p ≤ 0 сумма p + q не больше q, а q ≤ r. Но записать
            её явно не вредно: так проверка совпадает со словами «стороны
            положительны».
          </Typography.Text>
          <Typography.Text>
            Если по условию при отсутствии подходящих троек требуется{" "}
            <Notation>{"0 0"}</Notation>, полный фрагмент обработки выглядит
            так:
          </Typography.Text>
          <CodeBlock
            code={
              "a = [5, 12, 13, 0, 5, 5]\n\nresults = []\n\nfor i in range(len(a) - 2):\n    ordered = sorted([a[i], a[i + 1], a[i + 2]])\n\n    p = ordered[0]\n    q = ordered[1]\n    r = ordered[2]\n\n    is_triangle = p > 0 and p + q > r\n    is_right = p ** 2 + q ** 2 == r ** 2\n\n    if is_triangle and is_right:\n        results.append(p + q + r)\n\nif len(results) == 0:\n    print(0, 0)\nelse:\n    print(len(results), max(results))"
            }
            label={"Код на Python: a = [5, 12, 13, 0, 5, 5]"}
            language="python"
            output={"1 30"}
          />
          <Typography.Text>
            Подходит только тройка 5, 12, 13. Последняя тройка 0, 5, 5
            удовлетворяет равенству Пифагора, но{" "}
            <Notation>{"is_triangle"}</Notation> для неё ложно; без этой
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
                note: (
                  <>
                    Тройку сортируют: p ≤ q ≤ r. Треугольник существует, когда p
                    + q {">"} r; две другие проверки выполняются сами.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Вид определяет квадрат наибольшей стороны: равно —
                    прямоугольный, меньше суммы квадратов — остроугольный,
                    больше — тупоугольный.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Без проверки существования равенство Пифагора пропускает
                    вырожденные тройки вроде 0, 5, 5.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Если подходящих троек нет, выводится то, что требует
                    условие, например <Notation>{"0 0"}</Notation>.
                  </>
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
