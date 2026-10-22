// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./number-sequences.paid.chto-proveryat-i-vyvodit.media";
import { SAMPLE_LIST } from "./number-sequences.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "poryadok-dejstvij",
      navLabel: "Порядок действий",
      explanation: (
        <>
          <Typography.Text>
            Чем «квадрат минимального элемента» отличается от «минимального
            квадрата элемента»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Формулировку читают как цепочку действий: «квадрат минимума» —
              сначала минимум, потом квадрат; «минимум квадратов» — наоборот.
            </strong>{" "}
            Для чисел −20, −3, 8 получаются совсем разные числа:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqOrder_4749b0}
            caption={
              <>
                Одни и те же два действия в разном порядке. В квадрате −20
                становится самым большим числом 400, поэтому минимум квадратов —
                9.
              </>
            }
          />
          <Typography.Text>То же в программе:</Typography.Text>
          <CodeBlock
            code={
              "a = [-20, -3, 8]\nprint(min(a) ** 2, min([x ** 2 for x in a]))"
            }
            label={"Квадрат минимума и минимум квадратов"}
            language="python"
            output={"400 9"}
          />
          <Typography.Text>
            Выбери формулировку, чтобы увидеть выражение:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка и выражение"}
            variants={[
              {
                label: "квадрат минимального элемента",
                value: <Notation>{"min(a) ** 2"}</Notation>,
              },
              {
                label: "минимальный квадрат элемента",
                value: <Notation>{"min([x ** 2 for x in a])"}</Notation>,
              },
              {
                label: "модуль максимальной суммы",
                value: <Notation>{"abs(max(sums))"}</Notation>,
              },
              {
                label: "максимальный модуль суммы",
                value: <Notation>{"max([abs(s) for s in sums])"}</Notation>,
              },
              {
                label: "квадрат количества элементов",
                value: <Notation>{"len(a) ** 2"}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            Если бы в задаче темы было «сумма тройки не больше квадрата
            максимального элемента, оканчивающегося на 25», порог стал бы{" "}
            <Notation>{"max(ends) ** 2"}</Notation>, а остальное решение не
            изменилось бы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proverka-i-otvet",
      navLabel: "Проверка и ответ",
      explanation: (
        <>
          <Typography.Text>
            Что выводить, если проверяют одно, а в ответе спрашивают другое?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Группу отбирают по одной величине, а в список кладут ту, что
              спрашивают в ответе.
            </strong>{" "}
            Пусть в задаче темы просят не наибольшую сумму, а наибольшее
            произведение чисел подходящей тройки. Проверка остаётся прежней — по
            сумме, а в список идёт произведение:
          </Typography.Text>
          <CodeBlock
            code={
              "def four(x):\n    return 1000 <= abs(x) <= 9999\n\n\n" +
              SAMPLE_LIST +
              "\nresults = []\nfor i in range(len(a) - 2):\n    x, y, z = a[i], a[i + 1], a[i + 2]\n    k = int(four(x)) + int(four(y)) + int(four(z))\n    if k <= 2 and x + y + z <= 2025:\n        results.append(x * y * z)\nprint(len(results), max(results))"
            }
            label={"Отбор по сумме, ответ по произведению"}
            language="python"
            output={"4 18375000"}
          />
          <Typography.Text>
            Подходят те же четыре тройки, а наибольшее произведение даёт тройка
            −1250, −2100, 7. Перед тем как писать программу, выпиши три вещи: по
            какому условию отбирают группы, какую величину кладут в список и что
            с ней сделать в ответе — максимум, минимум или модуль.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ostatok-minimalnogo",
      navLabel: "Остаток минимального",
      explanation: (
        <>
          <Typography.Text>
            Что значит «остаток от деления хотя бы одного элемента на 111 равен
            минимальному элементу последовательности»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Остаток элемента сравнивают с самим минимумом:{" "}
              <Notation>{"x % 111 == m"}</Notation>, где{" "}
              <Notation>{"m = min(a)"}</Notation> найден до цикла.
            </strong>{" "}
            Похожие слова дают другие проверки:
          </Typography.Text>
          <LessonTable
            label={"Остаток и минимум: формулировки"}
            columns={[{ label: "Формулировка" }, { label: "Проверка" }]}
            rows={[
              [
                "остаток x равен минимальному элементу",
                <Notation key="a">{"x % d == m"}</Notation>,
              ],
              [
                "остаток x равен остатку минимального элемента",
                <Notation key="b">{"x % d == m % d"}</Notation>,
              ],
            ]}
          />
          <Typography.Text>
            «Остаток минимального» и «минимальный остаток» тоже различаются. Для
            чисел 8 и 12 минимальный элемент 8 даёт при делении на 5 остаток 3,
            а остатки чисел — 3 и 2, и наименьший из них 2:
          </Typography.Text>
          <CodeBlock
            code={"a = [8, 12]\nprint(min(a) % 5, min([x % 5 for x in a]))"}
            label={"Остаток минимального и минимальный остаток"}
            language="python"
            output={"3 2"}
          />
        </>
      ),
    },
    {
      id: "dva-naibolshih",
      navLabel: "Наибольшие в тройке",
      explanation: (
        <>
          <Typography.Text>
            Как найти сумму двух наибольших чисел тройки или её среднее по
            величине число?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сумма двух наибольших — сумма тройки без наименьшего:{" "}
              <Notation>{"sum(t) - min(t)"}</Notation>. А чтобы найти среднее по
              величине число, тройку сортируют:{" "}
              <PythonTerm term="sorted">
                <Notation>{"sorted(t)"}</Notation>
              </PythonTerm>
              .
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "t = [4, 10, 7]\ns = sorted(t)\nprint(sum(t) - min(t), s, s[1])"
            }
            label={"Два наибольших и среднее число тройки"}
            language="python"
            output={"17 [4, 7, 10] 7"}
          />
          <Typography.Text>
            <Notation>{"sorted"}</Notation> создаёт новый список из трёх чисел.
            Исходный список <Notation>{"a"}</Notation> не меняется, и соседи в
            нём остаются на своих местах.
          </Typography.Text>
          <Typography.Text>
            «Сумма квадратов двух наибольших чисел» — сначала выбрать числа,
            потом возвести в квадрат. Для −10, 3, 4 это 3² + 4² = 25, а не 100 +
            16: −10 — наименьшее число, хотя его квадрат самый большой.
          </Typography.Text>
          <VariantPicker
            label={"Требуемая величина и выражение"}
            variants={[
              {
                label: "произведение минимума и максимума тройки",
                value: <Notation>{"min(t) * max(t)"}</Notation>,
              },
              {
                label: "сумма модулей минимума и максимума",
                value: <Notation>{"abs(min(t)) + abs(max(t))"}</Notation>,
                note: <>для −9 и 5: 9 + 5 = 14</>,
              },
              {
                label: "модуль суммы минимума и максимума",
                value: <Notation>{"abs(min(t) + max(t))"}</Notation>,
                note: <>для −9 и 5: |−4| = 4</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "vyvod-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Порядок слов",
                note: (
                  <>
                    порядок действий: «квадрат минимума» —{" "}
                    <Notation>{"min(a) ** 2"}</Notation>
                  </>
                ),
              },
              {
                key: "Модуль",
                note: (
                  <>
                    только у того, у чего назван:{" "}
                    <Notation>{"abs(max(sums))"}</Notation>
                  </>
                ),
              },
              {
                key: "Проверка и ответ",
                note: <>в список кладут величину из ответа</>,
              },
              {
                key: "Остаток и минимум",
                note: (
                  <>
                    «равен минимальному» — <Notation>{"x % d == m"}</Notation>,
                    «остатку минимального» —{" "}
                    <Notation>{"x % d == m % d"}</Notation>
                  </>
                ),
              },
              {
                key: "Два наибольших",
                note: <Notation>{"sum(t) - min(t)"}</Notation>,
              },
              {
                key: "Порядок в тройке",
                note: (
                  <>
                    <Notation>{"sorted(t)"}</Notation>, исходный список не
                    меняется
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
          Для чисел 5, −7, 2 найди квадрат минимального элемента и минимальный
          квадрат элемента.
        </>
      ),
      reveal: <>49 и 4: минимум −7, его квадрат 49; квадраты 25, 49, 4.</>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Суммы подходящих троек: −15, −40, 10. Найди модуль максимальной суммы
          и максимальный модуль суммы.
        </>
      ),
      reveal: <>10 и 40: максимум сумм 10, а модули 15, 40, 10.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Для чисел 13, 22, 9 найди остаток от деления на 5 минимального
          элемента и минимальный из остатков.
        </>
      ),
      reveal: <>4 и 2: минимальный элемент 9, 9 % 5 = 4; остатки 3, 2, 4.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Для тройки 7, −2, 5 найди сумму двух наибольших чисел и среднее по
          величине число.
        </>
      ),
      reveal: <>12 и 5: два наибольших — 7 и 5; после сортировки −2, 5, 7.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          В задаче темы просят записать количество троек, затем минимальную из
          сумм. Что изменится в программе и что получится на восьми числах?
        </>
      ),
      reveal: (
        <>
          Только вывод: <Notation>{"print(len(sums), min(sums))"}</Notation>. На
          восьми числах — 4 −3343.
        </>
      ),
    },
  ],
};

export default content;
