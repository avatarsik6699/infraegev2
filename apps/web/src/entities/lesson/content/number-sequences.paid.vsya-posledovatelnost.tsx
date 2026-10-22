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
import { lessonMedia } from "./number-sequences.paid.vsya-posledovatelnost.media";
import { SAMPLE_LIST } from "./number-sequences.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "snachala-porog",
      navLabel: "Сначала порог",
      explanation: (
        <>
          <Typography.Text>
            Порог задачи темы — максимальный элемент, оканчивающийся на 25.
            Можно ли проверять тройки сразу, пока читаем числа по порядку?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: число в конце файла может оказаться больше всех прежних и
              поднять порог — даже для самых первых троек. Поэтому сначала
              проходят весь список и находят порог, а потом перебирают тройки.
            </strong>{" "}
            Посмотри, как меняется наибольший элемент на 25, пока читаем восемь
            чисел темы:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqThreshold7}
            caption={
              <>
                До седьмого числа порог — 125, и только 2025 поднимает его до
                окончательного. Под числами — суммы троек против окончательного
                порога: не проходит лишь последняя, 4700.
              </>
            }
          />
          <Typography.Text>
            Первая тройка 125, 1300, −1250 с суммой 175 подходит под порог 2025.
            Если сравнить её с порогом на момент чтения — 125, — она не пройдёт,
            и ответ на восьми числах получится 3 вместо 4.
          </Typography.Text>
          <Typography.Text>
            Поэтому решение проходит по списку дважды: первый проход находит
            порог, второй перебирает тройки. Два прохода по 10 000 чисел
            программа делает мгновенно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otbor",
      navLabel: "Отбор и характеристика",
      explanation: (
        <>
          <Typography.Text>
            Как найти максимальный элемент, оканчивающийся на 25?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала нужные числа отбирают в отдельный список, потом применяют
              к нему{" "}
              <PythonTerm term="agg">
                <Notation>{"max"}</Notation>, <Notation>{"min"}</Notation>,{" "}
                <Notation>{"len"}</Notation> или <Notation>{"sum"}</Notation>
              </PythonTerm>
              .
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              SAMPLE_LIST +
              "\nends = [x for x in a if abs(x) % 100 == 25]\nprint(ends, max(ends))"
            }
            label={"Числа, оканчивающиеся на 25, и их максимум"}
            language="python"
            output={"[125, -325, 2025] 2025"}
          />
          <Typography.Text>
            Это <PythonTerm term="comp">списковое включение</PythonTerm> с
            условием: перебрать <Notation>{"x"}</Notation> из{" "}
            <Notation>{"a"}</Notation> и взять <Notation>{"x"}</Notation>, если
            он оканчивается на 25. В список кладут исходные числа:{" "}
            <Notation>{"x"}</Notation>, а не <Notation>{"abs(x)"}</Notation>.
            Модуль нужен только для проверки окончания — иначе вместо −325 в
            списке окажется 325, а это другое число.
          </Typography.Text>
          <Typography.Text>
            Из отобранного списка получают любую характеристику, которую
            спрашивает условие:
          </Typography.Text>
          <VariantPicker
            label={"Что найти по всей последовательности и выражение"}
            variants={[
              {
                label: "максимальный такой элемент",
                value: <Notation>{"max(ends)"}</Notation>,
              },
              {
                label: "минимальный такой элемент",
                value: <Notation>{"min(ends)"}</Notation>,
              },
              {
                label: "количество таких элементов",
                value: <Notation>{"len(ends)"}</Notation>,
                note: <>так считают порог «количество чисел, кратных 2042»</>,
              },
              {
                label: "сумма таких элементов",
                value: <Notation>{"sum(ends)"}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            У пустого списка нет ни максимума, ни минимума:{" "}
            <Notation>{"max([])"}</Notation> — ошибка. В файлах задания нужные
            числа есть, а иногда условие прямо это гарантирует.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы целиком",
      explanation: (
        <>
          <Typography.Text>
            Теперь все части задачи на месте — как их собрать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Порог находят до цикла, тройки проверяют в цикле, ответ выводят
              после цикла.
            </strong>{" "}
            Сначала — вручную на восьми числах темы, с порогом 2025:
          </Typography.Text>
          <LessonTable
            label={"Задача темы на восьми числах"}
            columns={[
              { label: "Тройка" },
              { label: "Четырёхзначных", numeric: true },
              { label: "Сумма", numeric: true },
              { label: "Подходит?" },
            ]}
            rows={[
              ["125, 1300, −1250", "2", "175", "да"],
              ["1300, −1250, −2100", "3", "−2050", "нет: три четырёхзначных"],
              ["−1250, −2100, 7", "2", "−3343", "да"],
              ["−2100, 7, −325", "1", "−2418", "да"],
              ["7, −325, 2025", "1", "1707", "да"],
              ["−325, 2025, 3000", "2", "4700", "нет: сумма больше 2025"],
            ]}
          />
          <Typography.Text>
            На восьми числах ответ 4 1707. Программа для файла задачи темы:
          </Typography.Text>
          <CodeBlock
            code={
              'def four(x):\n    return 1000 <= abs(x) <= 9999\n\n\nwith open("17.txt") as f:\n    a = [int(x) for x in f]\nlimit = max([x for x in a if abs(x) % 100 == 25])\nsums = []\nfor i in range(len(a) - 2):\n    x, y, z = a[i], a[i + 1], a[i + 2]\n    k = int(four(x)) + int(four(y)) + int(four(z))\n    if k <= 2 and x + y + z <= limit:\n        sums.append(x + y + z)\nprint(len(sums), max(sums))'
            }
            label={"Решение задачи темы"}
            language="python"
            output={"8358 99821"}
          />
          <Typography.Text>
            Ответ задачи темы: <strong>8358 99821</strong>. Порог по файлу —
            99825. Чтобы проверить программу, замени чтение файла строкой{" "}
            <Notation>{SAMPLE_LIST}</Notation>: должно получиться 4 1707.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "srednee",
      navLabel: "Среднее арифметическое",
      explanation: (
        <>
          <Typography.Text>
            Порог бывает и средним — например, «меньше среднего арифметического
            всех чётных элементов последовательности». Как его считать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Среднее считают по той группе, что названа в условии: сумма её
              чисел, делённая на их количество. Сравнивают без деления: вместо{" "}
              <Notation>{"x < s / k"}</Notation> пишут{" "}
              <Notation>{"x * k < s"}</Notation>.
            </strong>{" "}
            В последовательности 2, 9, 4, 7, 12 чётные числа 2, 4, 12, их сумма
            18, количество 3, среднее 6:
          </Typography.Text>
          <CodeBlock
            code={
              "a = [2, 9, 4, 7, 12]\neven = [x for x in a if x % 2 == 0]\ns = sum(even)\nk = len(even)\nprint(s / k, 4 * k < s, 7 * k < s)"
            }
            label={"Среднее чётных и сравнение без деления"}
            language="python"
            output={"6.0 True False"}
          />
          <Typography.Text>
            4 меньше среднего, 7 — нет. Делить сумму чётных на длину всего
            списка нельзя: в знаменателе количество той же группы. Умножать обе
            части на k можно, потому что k положительно, а сравнение без деления
            точное — в нём нет дробей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ne-menyat-spisok",
      navLabel: "Исходный список не трогаем",
      explanation: (
        <>
          <Typography.Text>
            Можно ли упростить перебор — отсортировать числа или выбросить
            неподходящие?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: соседи есть только в исходном порядке. Сортировка и удаление
              чисел создают пары, которых в файле не было.
            </strong>
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqBroken_53f788}
            caption={
              <>
                Слева пары исходной последовательности, справа — после
                сортировки и после отбора чётных. Пар (10, 20) и (2, 4) в
                исходной последовательности не было.
              </>
            }
          />
          <Typography.Text>
            Отобрать отдельный список для порога можно — как{" "}
            <Notation>{"ends"}</Notation> выше. Но тройки перебирают в исходном
            списке <Notation>{"a"}</Notation>. И порог считают один раз, до
            цикла: если написать <Notation>{"max(...)"}</Notation> внутри цикла,
            программа будет заново проходить весь список на каждой тройке — 10
            000 раз по 10 000 чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "posledovatelnost-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Порог",
                note: <>по всему списку, до перебора троек</>,
              },
              {
                key: "Отбор",
                note: (
                  <Notation>{"[x for x in a if abs(x) % 100 == 25]"}</Notation>
                ),
              },
              {
                key: "Исходные числа",
                note: (
                  <>
                    в список — <Notation>{"x"}</Notation>, а не{" "}
                    <Notation>{"abs(x)"}</Notation>
                  </>
                ),
              },
              {
                key: "Характеристика",
                note: (
                  <>
                    <Notation>{"max"}</Notation>, <Notation>{"min"}</Notation>,{" "}
                    <Notation>{"len"}</Notation>, <Notation>{"sum"}</Notation>{" "}
                    отобранного списка
                  </>
                ),
              },
              {
                key: "Среднее",
                note: (
                  <>
                    <Notation>{"x * k < s"}</Notation> вместо{" "}
                    <Notation>{"x < s / k"}</Notation>
                  </>
                ),
              },
              {
                key: "Задача темы",
                note: <>8358 99821; на восьми числах — 4 1707</>,
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
          Числа последовательности, оканчивающиеся на 5: −35, 15, −5, 25. Какой
          у них минимальный и какой максимальный элемент? Почему максимальный —
          не 35?
        </>
      ),
      reveal: (
        <>
          Наименьшее −35, наибольшее 25. Числа 35 в последовательности нет: это
          модуль −35, а сравнивают исходные числа.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          На восьми числах темы покажи тройку, которая пройдёт проверку с
          окончательным порогом, но не пройдёт с порогом на момент чтения.
        </>
      ),
      reveal: (
        <>
          125, 1300, −1250: сумма 175 не больше 2025, но больше 125 — порога
          после первых трёх чисел.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Последовательность 3, 8, 6, 5, 4. Какие числа меньше среднего
          арифметического чётных? Запиши проверку без деления.
        </>
      ),
      reveal: (
        <>
          Чётные 8, 6, 4: сумма 18, количество 3, среднее 6. Меньше — 3, 5 и 4.
          Проверка <Notation>{"x * 3 < 18"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Что выведет{" "}
          <Notation>
            {"print(len([x for x in [10, -25, 125, 7] if abs(x) % 100 == 25]))"}
          </Notation>
          ?
        </>
      ),
      reveal: <>2: на 25 оканчиваются −25 и 125.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Почему перед перебором троек нельзя отсортировать список или выбросить
          из него числа, которые не оканчиваются на 25?
        </>
      ),
      reveal: (
        <>
          Тройки — это соседи в исходном порядке. После сортировки или удаления
          рядом окажутся числа, которые в файле соседями не были.
        </>
      ),
    },
  ],
};

export default content;
