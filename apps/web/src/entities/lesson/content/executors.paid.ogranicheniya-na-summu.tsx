// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTabs,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./executors.paid.ogranicheniya-na-summu.media";
import { Program } from "./executors.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "summa-pri-ogranicheniyah",
      navLabel: "Сумма через количества",
      explanation: (
        <>
          <Typography.Text>
            Дополнительный урок — для продвинутых: такие вопросы редки.
          </Typography.Text>
          <Typography.Text>
            Таблица ниже один раз проходит строку из цифр 3, 6, 9 и заменяет 3 →
            7, 6 → 8, 9 → 3. Как связаны длина входа и сумма цифр результата?
          </Typography.Text>
          <Program
            label={"Таблица замены 3 → 7, 6 → 8, 9 → 3"}
            symbols={["λ", "3", "6", "9"]}
            rows={[
              ["q0", "λ, L, q1", "—", "—", "—"],
              ["q1", "λ, S, q1", "7, L, q1", "8, L, q1", "3, L, q1"],
            ]}
          />
          <LessonDiagram
            {...lessonMedia.tmMap39669_376893}
            caption={
              <>
                Каждая цифра меняется по своей стрелке, как в подтеме 2: 3 → 7,
                6 → 8, 9 → 3.
              </>
            }
          />
          <Typography.Text>
            <strong>
              При однократной замене сумму результата выражают через количества
              входа — порядок цифр на неё не влияет.
            </strong>{" "}
            Пусть во входе a троек, b шестёрок и c девяток. Длина N = a + b + c,
            сумма результата S = 7a + 8b + 3c, и S + N = 8a + 9b + 4c. Дальше
            перебирают количества, а не строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naimenshaya-summa",
      navLabel: "Наименьшая сумма",
      explanation: (
        <>
          <Typography.Text>
            Во входе есть все три цифры, а нечётных (3 и 9) не меньше пяти.
            Каково наименьшее S + N?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Чтобы сумма была наименьшей, берут ровно столько цифр, сколько
              требует условие, и самые дешёвые из них.
            </strong>{" "}
            Шестёрка нужна одна (b = 1): она ничего не даёт для условия о
            нечётных. Из нечётных девятка дешевле тройки (4 против 8), но одна
            тройка обязательна: a = 1, c = 4. S + N = 8 + 9 + 16 = 33, например{" "}
            <Notation>{"369999"}</Notation> → <Notation>{"783333"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naibolshaya-summa",
      navLabel: "Наибольшая сумма",
      explanation: (
        <>
          <Typography.Text>
            Длина входа не больше 10, нечётных цифр не меньше четырёх. Каково
            наибольшее S + N?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Чтобы сумма была наибольшей, всю длину заполняют самыми дорогими
              цифрами — кроме мест, которые требует условие.
            </strong>{" "}
            Дороже всех шестёрка (9), но она чётная. Ровно четыре места —
            нечётным, из них дороже тройка (8): a = 4, b = 6. S + N = 32 + 54 =
            86, например <Notation>{"3333666666"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "prostaya-summa",
      navLabel: "Простая сумма",
      explanation: (
        <>
          <Typography.Text>
            Какова наименьшая длина входа, в котором есть все три цифры,
            шестёрок чётное число, а сумма результата — простое число?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Простоту проверяют для каждой допустимой суммы: простое число
              больше 1 и делится только на 1 и на себя, а делители достаточно
              искать до √x.
            </strong>{" "}
            При N = 3 шестёрка одна — нечётно. При N = 4 шестёрок две: S = 7 +
            16 + 3 = 26 — составное. При N = 5 шестёрок две, а троек и девяток 1
            и 2: S = 7 + 16 + 6 = 29 — простое. Ответ 5, например{" "}
            <Notation>{"36699"}</Notation>.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Перебирай длины по возрастанию и для каждой — допустимые
                    количества. Числа 0 и 1 не простые; 29 проверяется
                    делителями 2, 3, 4, 5, потому что 6 · 6 = 36 {">"} 29.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Функция <PythonTerm term="def">is_prime</PythonTerm>{" "}
                      проверяет делители, пока d · d ≤ x:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "def is_prime(x):\n    if x < 2:\n        return False\n    d = 2\n    while d * d <= x:\n        if x % d == 0:\n            return False\n        d += 1\n    return True"
                      }
                      label={"Проверка простоты"}
                      language="python"
                    />
                    <Typography.Text>
                      Перебор количеств, а не строк; внутренний диапазон
                      оставляет хотя бы одну девятку:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "for n in range(3, 20):\n    found = []\n    for a in range(1, n):\n        for b in range(1, n - a):\n            c = n - a - b\n            s = 7 * a + 8 * b + 3 * c\n            if b % 2 == 0 and is_prime(s):\n                found.append((a, b, c, s))\n    if found:\n        print(n, found)\n        break"
                      }
                      label={"Наименьшая длина с простой суммой"}
                      language="python"
                      output={"5 [(1, 2, 2, 29)]"}
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "summa-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Сумма", note: <>через количества: S = 7a + 8b + 3c</> },
              { key: "Наименьшее", note: <>граница + самые дешёвые цифры</> },
              { key: "Наибольшее", note: <>длина — самыми дорогими цифрами</> },
              { key: "Простое", note: <>больше 1, делители до √x</> },
              {
                key: "Пример",
                note: <>строка, на которой ответ достигается</>,
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
          Таблица замены 3 → 7, 6 → 8, 9 → 3 выдала{" "}
          <Notation>{"7738"}</Notation>. Какой был вход?
        </>
      ),
      reveal: (
        <>
          <Notation>{"3396"}</Notation>: замена обратима, 7 ← 3, 3 ← 9, 8 ← 6.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Есть все три цифры, нечётных не меньше шести. Каково наименьшее S + N?
        </>
      ),
      reveal: <>37: a = 1, b = 1, c = 5, 8 + 9 + 20.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Длина не больше 12, нечётных не меньше четырёх. Каково наибольшее S +
          N?
        </>
      ),
      reveal: <>104: a = 4, b = 8, 32 + 72.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Простое ли число 1?</>,
      reveal: <>Нет: простое число больше 1 и имеет ровно два делителя.</>,
    },
  ],
};

export default content;
