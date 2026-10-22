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
import { lessonMedia } from "./number-sequences.paid.skolko-podhodit.media";
import { SAMPLE_LIST } from "./number-sequences.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "i-ili-ne",
      navLabel: "И, или, не",
      explanation: (
        <>
          <Typography.Text>Как соединить несколько проверок?</Typography.Text>
          <Typography.Text>
            <strong>
              <PythonTerm term="andor">
                <Notation>{"and"}</Notation>
              </PythonTerm>{" "}
              требует, чтобы выполнились обе проверки,{" "}
              <Notation>{"or"}</Notation> — хотя бы одна, а{" "}
              <Notation>{"not"}</Notation> меняет ответ на противоположный.
            </strong>{" "}
            Проверим пары на свойство «число делится на 3»:
          </Typography.Text>
          <LessonTable
            label={"«Хотя бы одно» и «оба» на четырёх парах"}
            columns={[
              { label: "Пара" },
              { label: "x % 3 == 0 or y % 3 == 0" },
              { label: "x % 3 == 0 and y % 3 == 0" },
            ]}
            rows={[
              ["(6, 5)", "да", "нет"],
              ["(5, 9)", "да", "нет"],
              ["(6, 9)", "да", "да"],
              ["(5, 7)", "нет", "нет"],
            ]}
          />
          <Typography.Text>
            «Хотя бы одно» допускает, что подходят оба: пара (6, 9) подходит.
            Если нужно, чтобы делилось только одно число, это «ровно одно» — его
            разберём ниже.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetyrehznachnye",
      navLabel: "Четырёхзначные числа",
      explanation: (
        <>
          <Typography.Text>
            Какие из восьми чисел темы четырёхзначные?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Минус — не цифра: −1250 тоже четырёхзначное. Поэтому проверяют
              модуль: <Notation>{"1000 <= abs(x) <= 9999"}</Notation>.
            </strong>{" "}
            Четырёхзначные у нас 1300, −1250, −2100, 2025 и 3000. Проверка без
            модуля пропустит −1250 и −2100: они меньше 1000.
          </Typography.Text>
          <CodeBlock
            code={
              "for x in [1300, -1250, 7, 3000]:\n    print(x, 1000 <= x <= 9999, 1000 <= abs(x) <= 9999)"
            }
            label={"Четырёхзначные числа с модулем и без"}
            language="python"
            output={
              "1300 True True\n-1250 False True\n7 False False\n3000 True True"
            }
          />
        </>
      ),
    },
    {
      id: "skolko-elementov",
      navLabel: "Сколько чисел подходит",
      explanation: (
        <>
          <Typography.Text>
            Как проверить «не более двух из трёх элементов — четырёхзначные»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Посчитай, сколько чисел тройки обладают свойством, и сравни это
              количество с числом из условия.
            </strong>{" "}
            Проверка даёт <Notation>{"True"}</Notation> или{" "}
            <Notation>{"False"}</Notation>, а <Notation>{"int(True)"}</Notation>{" "}
            = 1, <Notation>{"int(False)"}</Notation> = 0. Сложив три проверки,
            получим количество. Чтобы не повторять длинную проверку трижды,
            дадим ей имя — <PythonTerm term="def">функцию</PythonTerm>{" "}
            <Notation>{"four"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "def four(x):\n    return 1000 <= abs(x) <= 9999\n\n\nk = int(four(1300)) + int(four(-1250)) + int(four(-2100))\nprint(k, k <= 2)"
            }
            label={"Сколько чисел тройки четырёхзначные"}
            language="python"
            output={"3 False"}
          />
          <Typography.Text>
            <Notation>{"def"}</Notation> задаёт имя проверки,{" "}
            <Notation>{"return"}</Notation> — её ответ. В тройке 1300, −1250,
            −2100 все три числа четырёхзначные, и условие «не более двух» не
            выполнено. Любая формулировка про количество переводится так же:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка для тройки и проверка"}
            defaultIndex={7}
            variants={[
              {
                label: "ни одного подходящего числа",
                value: <Notation>{"k == 0"}</Notation>,
              },
              { label: "ровно одно", value: <Notation>{"k == 1"}</Notation> },
              { label: "ровно два", value: <Notation>{"k == 2"}</Notation> },
              { label: "все три", value: <Notation>{"k == 3"}</Notation> },
              {
                label: "хотя бы одно",
                value: <Notation>{"k >= 1"}</Notation>,
              },
              {
                label: "хотя бы два",
                value: <Notation>{"k >= 2"}</Notation>,
              },
              {
                label: "не более одного",
                value: <Notation>{"k <= 1"}</Notation>,
              },
              {
                label: "не более двух",
                value: <Notation>{"k <= 2"}</Notation>,
                note: <>подходят 0, 1 или 2 — не только 2</>,
              },
              {
                label: "есть подходящие, но не все",
                value: <Notation>{"0 < k < 3"}</Notation>,
              },
            ]}
          />
          <Typography.Text>Посчитаем k для всех троек темы:</Typography.Text>
          <LessonTable
            label={"Четырёхзначные числа в тройках темы"}
            columns={[
              { label: "Тройка" },
              { label: "Четырёхзначных", numeric: true },
              { label: "k <= 2" },
              { label: "Сумма", numeric: true },
            ]}
            rows={[
              ["125, 1300, −1250", "2", "да", "175"],
              ["1300, −1250, −2100", "3", "нет", "−2050"],
              ["−1250, −2100, 7", "2", "да", "−3343"],
              ["−2100, 7, −325", "1", "да", "−2418"],
              ["7, −325, 2025", "1", "да", "1707"],
              ["−325, 2025, 3000", "2", "да", "4700"],
            ]}
          />
          <Typography.Text>
            Вместе с условием «сумма не больше 2025» подходят четыре тройки:
            вторая не проходит по четырёхзначным, последняя — по сумме.
            Наибольшая сумма по-прежнему 1707. В программе обе проверки
            соединяет <Notation>{"and"}</Notation>, а запись{" "}
            <Notation>{"x, y, z = a[i], a[i + 1], a[i + 2]"}</Notation> даёт
            имена трём числам тройки сразу:
          </Typography.Text>
          <CodeBlock
            code={
              "def four(x):\n    return 1000 <= abs(x) <= 9999\n\n\n" +
              SAMPLE_LIST +
              "\nsums = []\nfor i in range(len(a) - 2):\n    x, y, z = a[i], a[i + 1], a[i + 2]\n    k = int(four(x)) + int(four(y)) + int(four(z))\n    if k <= 2 and x + y + z <= 2025:\n        sums.append(x + y + z)\nprint(len(sums), max(sums))"
            }
            label={"Тройки: не более двух четырёхзначных, сумма до 2025"}
            language="python"
            output={"4 1707"}
          />
        </>
      ),
    },
    {
      id: "skobki",
      navLabel: "Скобки",
      explanation: (
        <>
          <Typography.Text>
            Почему длинное условие иногда работает не так, как написано в
            задаче?
          </Typography.Text>
          <Typography.Text>
            <strong>
              <Notation>{"and"}</Notation> выполняется раньше{" "}
              <Notation>{"or"}</Notation>, поэтому часть условия с{" "}
              <Notation>{"or"}</Notation> берут в скобки.
            </strong>{" "}
            Пусть нужно: «хотя бы одно число пары делится на три, а сумма пары
            больше 100». Проверим на паре (9, 20) с суммой 29:
          </Typography.Text>
          <CodeBlock
            code={
              "x = 9\ny = 20\nprint((x % 3 == 0 or y % 3 == 0) and x + y > 100)\nprint(x % 3 == 0 or y % 3 == 0 and x + y > 100)"
            }
            label={"Условие со скобками и без"}
            language="python"
            output={"False\nTrue"}
          />
          <Typography.Text>
            Без скобок Python сначала проверил{" "}
            <Notation>{"y % 3 == 0 and x + y > 100"}</Notation>, и делимости 9
            на три хватило, хотя сумма меньше 100. Длинное условие удобно
            разбить на части с именами:{" "}
            <Notation>{"has_multiple = x % 3 == 0 or y % 3 == 0"}</Notation>,{" "}
            <Notation>{"large_sum = x + y > 100"}</Notation>, затем{" "}
            <Notation>{"if has_multiple and large_sum:"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odno-a-drugoe",
      navLabel: "Одно…, а другое…",
      explanation: (
        <>
          <Typography.Text>
            Чем «хотя бы одно делится на три, и хотя бы одно меньше 10»
            отличается от «одно делится на три, а другое меньше 10»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              «Одно…, а другое…» требует, чтобы свойства были у двух разных
              чисел пары.
            </strong>{" "}
            Возьмём пару (3, 100). Число 3 и делится на три, и меньше 10, а 100
            — ни то, ни другое. Вот три похожие формулировки:
          </Typography.Text>
          <ul>
            <li>
              «хотя бы одно делится на три, и хотя бы одно меньше 10» —{" "}
              <Notation>
                {"(x % 3 == 0 or y % 3 == 0) and (x < 10 or y < 10)"}
              </Notation>
              : оба свойства может дать одно число;
            </li>
            <li>
              «одно делится на три, а другое меньше 10» —{" "}
              <Notation>
                {"(x % 3 == 0 and y < 10) or (y % 3 == 0 and x < 10)"}
              </Notation>
              : проверяют оба распределения ролей;
            </li>
            <li>
              «хотя бы одно одновременно делится на три и меньше 10» —{" "}
              <Notation>
                {"(x % 3 == 0 and x < 10) or (y % 3 == 0 and y < 10)"}
              </Notation>
              : оба свойства у одного числа.
            </li>
          </ul>
          <LessonDiagram
            {...lessonMedia.seqRoles3_10}
            caption={
              <>
                Пара (3, 100) как таблица «число × свойство». Слева «да» есть в
                каждом столбце. В середине нужны два разных числа — одно кратно
                3, другое меньше 10, — и ни одно распределение ролей не
                подходит. Справа оба свойства у одного числа 3. Подходят первая
                и третья формулировки.
              </>
            }
          />
          <Typography.Text>
            Если оба числа обладают обоими свойствами, «одно…, а другое…» тоже
            выполнено: роли можно распределить любым способом. Пара при этом
            считается один раз — у нас одна проверка с{" "}
            <Notation>{"or"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skolko-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: (
                  <>
                    <Notation>{"and"}</Notation>, <Notation>{"or"}</Notation>
                  </>
                ),
                note: <>обе проверки — хотя бы одна</>,
              },
              {
                key: "Хотя бы одно",
                note: <>допускает, что подходят оба</>,
              },
              {
                key: "Четырёхзначное",
                note: <Notation>{"1000 <= abs(x) <= 9999"}</Notation>,
              },
              {
                key: "Количество",
                note: (
                  <>
                    <Notation>{"k = int(…) + int(…) + int(…)"}</Notation>
                  </>
                ),
              },
              {
                key: "Не более двух",
                note: (
                  <>
                    <Notation>{"k <= 2"}</Notation>; «не менее двух» —{" "}
                    <Notation>{"k >= 2"}</Notation>
                  </>
                ),
              },
              {
                key: "Скобки",
                note: <Notation>{"(… or …) and …"}</Notation>,
              },
              {
                key: "Одно…, а другое…",
                note: <>два распределения ролей через or</>,
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
          Свойство — «число кратно трём». Какие из пар (12, 7), (7, 8), (3, 30),
          (5, 21) подходят под «хотя бы одно», какие — под «оба», какие — под
          «ровно одно»?
        </>
      ),
      reveal: (
        <>
          «Хотя бы одно» — (12, 7), (3, 30), (5, 21); «оба» — (3, 30); «ровно
          одно» — (12, 7) и (5, 21). Пара (7, 8) не подходит никуда.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>Какие из чисел 999, −1000, 9999, −10000, 2025 четырёхзначные?</>
      ),
      reveal: <>−1000, 9999 и 2025: минус — не цифра.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Пусть <Notation>{"k"}</Notation> — количество чётных чисел тройки.
          Переведи через <Notation>{"k"}</Notation>: «не менее двух чётных»,
          «есть чётные, но не все», «ни одного чётного», «не более одного
          чётного».
        </>
      ),
      reveal: (
        <>
          <Notation>{"k >= 2"}</Notation>, <Notation>{"0 < k < 3"}</Notation>,{" "}
          <Notation>{"k == 0"}</Notation>, <Notation>{"k <= 1"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Чему равно{" "}
          <Notation>{"x % 5 == 0 or y % 5 == 0 and x + y > 50"}</Notation> для
          пары (10, 12)? А правильная запись условия «хотя бы одно число кратно
          пяти, а сумма больше 50»?
        </>
      ),
      reveal: (
        <>
          <Notation>{"True"}</Notation>: Python сначала вычисляет{" "}
          <Notation>{"and"}</Notation>, а 10 делится на пять. Правильная запись{" "}
          <Notation>{"(x % 5 == 0 or y % 5 == 0) and (x + y > 50)"}</Notation>{" "}
          даёт <Notation>{"False"}</Notation>: сумма 22.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Пара (12, 4), <Notation>{"T = 10"}</Notation>. Проверь три условия:
          «хотя бы одно делится на три и хотя бы одно меньше T», «одно делится
          на три, а другое меньше T», «хотя бы одно одновременно делится на три
          и меньше T».
        </>
      ),
      reveal: (
        <>
          Да, да, нет: 12 делится на три, 4 меньше десяти, но ни одно число не
          обладает обоими свойствами сразу.
        </>
      ),
    },
  ],
};

export default content;
