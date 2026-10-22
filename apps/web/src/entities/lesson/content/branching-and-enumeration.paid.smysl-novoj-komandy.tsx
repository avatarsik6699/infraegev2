// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./branching-and-enumeration.paid.smysl-novoj-komandy.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "novaya-komanda",
      navLabel: "Новая команда",
      explanation: (
        <>
          <Typography.Text>
            Что меняется, если вместо «×2» у исполнителя другая команда —
            например, «умножь на 2 и прибавь 1»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Метод тот же: K(n) — сумма по командам, которые ведут в n. Новое
              только одно: для каждой команды нужно понять, из какого числа она
              даёт n.
            </strong>{" "}
            Такое число называют предшественником.
          </Typography.Text>
          <Typography.Text>
            Спроси: «Из какого числа p команда даёт n?» — и реши это как
            уравнение. Для «2x + 1» и n = 9: 2p + 1 = 9, p = 4. Если p не целое
            или команда к нему неприменима, слагаемого нет: 2p + 1 = 10 даёт p =
            4,5 — в 10 эта команда не ведёт.
          </Typography.Text>
          <LessonTable
            label={"Предшественник p для результата n"}
            columns={[
              { label: "Команда" },
              { label: "Из какого числа" },
              { label: "Пример" },
            ]}
            rows={[
              ["+k", "n − k", "«+2»: 7 из 5"],
              ["×k", "n / k, если делится", "«×3»: 12 из 4, в 13 не ведёт"],
              ["2x + 1", "(n − 1) / 2, если n нечётное", "9 из 4"],
              [
                "дописать цифру d",
                "n без последней цифры, если она d",
                "d = 4: 154 из 15",
              ],
              ["x²", "√n, если n — точный квадрат", "16 из 4"],
            ]}
          />
        </>
      ),
    },
    {
      id: "sostavnaya-komanda",
      navLabel: "Составная команда",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «2x + 1». Сколько программ переводят 1 в 13?
          </Typography.Text>
          <Typography.Text>
            <strong>
              «2x + 1» — это одна команда, а не две: из 4 она сразу даёт 9. И
              чётное число она дать не может.
            </strong>{" "}
            Значит, в нечётное n она ведёт из (n − 1) / 2, а в чётное —
            ниоткуда. Поэтому K(n) = K(n − 1) для чётного n и K(n) = K(n − 1) +
            K((n − 1) / 2) для нечётного.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <LessonDiagram
                      {...lessonMedia.exLine1_13_7515f3}
                      caption={
                        <>
                          K от 1 до 13: у каждого чётного числа — столько же,
                          сколько у предыдущего.
                        </>
                      }
                    />
                    <Typography.Text>
                      В 7 ведут «+1» из 6 и «2x + 1» из 3: K(7) = 3 + 2 = 5. В
                      13 — из 12 и из 6: K(13) = 10 + 3 = 13. В 8 «2x + 1» не
                      ведёт, поэтому K(8) = K(7) = 5.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "def f(x, y):\n    if x > y:\n        return 0\n    if x == y:\n        return 1\n    return f(x + 1, y) + f(2 * x + 1, y)\n\n\nprint(f(1, 13))"
                    }
                    label={"Команды «+1» и «2x + 1»"}
                    language="python"
                    output={"13"}
                  />
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "cifra-i-kvadrat",
      navLabel: "Цифра справа и квадрат",
      explanation: (
        <>
          <Typography.Text>
            Из какого числа команда «дописать справа 4» могла получить 154? А
            153?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Дописать цифру d — значит получить 10x + d. Поэтому в n эта
              команда ведёт, только если n оканчивается на d.
            </strong>{" "}
            154 получено из 15, а 153 этой командой получить нельзя. Не ищи
            предшественника делением 153 // 10 = 15: команда из 15 даёт 154, а
            не 153. С командами «+1» и «дописать 4» из 1 в 40 ведут 4 программы.
          </Typography.Text>
          <Typography.Text>
            Квадрат даёт предшественника только точному квадрату: 16 — из 4, а
            18 квадратом не получить. С командами «+1» и «x²» из 2 в 20 ведут 5
            программ.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: деление и направление"
          >
            <Typography.Text>
              «Разделить на 2, если число чётное» и «разделить на 2 нацело» —
              разные команды: у результата 3 в первом случае один предшественник
              (6), во втором два (6 и 7). Подробно — в подтеме 5.
            </Typography.Text>
            <Typography.Text>
              Квадрат увеличивает число только при x ≥ 2: из 1 он снова даёт 1,
              и программ становится бесконечно много.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "perestanovka-cifr",
      navLabel: "Перестановка цифр",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «поменяй местами две младшие цифры, если цифра
            десятков меньше цифры единиц». Сколько программ переводят 10 в 24?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Условную команду сначала проверяют по текущему числу: если условие
              не выполнено, такой ветки нет вовсе.
            </strong>{" "}
            Из 12 перестановка даёт 21, а из 21 её нет: 2 не меньше 1.
            Перестановка всегда увеличивает число (12 → 21 — на 9), поэтому
            таблицу, как обычно, заполняют по возрастанию.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exLine10_24_38a4d2}
            caption={
              <>
                В 21 ведут «+1» из 20 и перестановка из 12: K(21) = 1 + 1 = 2.
                Других переходов в пределах 24 нет, поэтому в 24 тоже две
                программы.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    В 10 и 11 перестановка запрещена, из 12 даёт 21, из 13–19 —
                    числа 31 и больше, из 20–22 запрещена, из 23 — 32. Значит,
                    программ две: четырнадцать «+1» или 12 → 21 и дальше
                    прибавления.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Перестановку проще выполнить вперёд, чем искать
                      предшественника: таблица переносит количество из x в
                      каждый результат команд. Цифра единиц —{" "}
                      <Notation>{"x % 10"}</Notation>, десятков —{" "}
                      <Notation>{"x // 10 % 10"}</Notation>;{" "}
                      <PythonTerm term="augassign">+=</PythonTerm> прибавляет к
                      уже накопленному:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "k = [0] * 25\nk[10] = 1\nfor x in range(10, 25):\n    results = [x + 1]\n    t, u = x // 10 % 10, x % 10\n    if t < u:\n        results.append(x + 9 * (u - t))\n    for y in results:\n        if y <= 24:\n            k[y] += k[x]\nprint(k[24])"
                      }
                      label={"Перестановка цифр: из 10 в 24"}
                      language="python"
                      output={"2"}
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
      id: "novye-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Предшественник", note: <>из равенства команда(p) = n</> },
              { key: "2x + 1", note: <>(n − 1) / 2 для нечётного n</> },
              { key: "Цифра d", note: <>n оканчивается на d</> },
              { key: "Квадрат", note: <>только точный квадрат</> },
              { key: "Условная", note: <>не выполнена — ветки нет</> },
              { key: "Python", note: <>результаты вперёд, k[y] += k[x]</> },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: <>Из какого числа команда «2x + 1» даёт 9?</>,
      reveal: <>Из 4: (9 − 1) / 2 = 4.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>Может ли команда «2x + 1» дать 10?</>,
      reveal: <>Нет: 2x + 1 всегда нечётное.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>Команды «+1» и «2x + 1». Сколько программ переводят 1 в 13 без 8?</>
      ),
      reveal: <>8: та же таблица с нулём в 8.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Сколько предшественников у 3 при делении на 2 нацело?</>,
      reveal: <>Два: 6 и 7 — у обоих целая часть половины равна 3.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Разрешена ли перестановка младших цифр (десятков меньше единиц) для
          числа 33?
        </>
      ),
      reveal: <>Нет: цифры равны, условие «меньше» не выполнено.</>,
    },
  ],
};

export default content;
