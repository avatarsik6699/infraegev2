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
import { lessonMedia } from "./branching-and-enumeration.paid.etapy-i-zaprety.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "obyazatelnoe-chislo",
      navLabel: "Обязательное число",
      explanation: (
        <>
          <Typography.Text>
            Сколько программ из 2 в 20 проходят через 6? Запрет 9 пока не
            учитываем.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Обязательное число делит программу на две части, и количества
              частей перемножают.
            </strong>{" "}
            Любая такая программа сначала переводит 2 в 6, а потом 6 в 20:
          </Typography.Text>
          <ul>
            <li>первую часть можно выбрать 3 способами — подтема 1;</li>
            <li>вторую — 6 способами — подтема 2;</li>
            <li>любая первая часть подходит к любой второй.</li>
          </ul>
          <Typography.Text>Значит, программ 3 · 6 = 18.</Typography.Text>
          <Typography.Text>
            Обрати внимание: второй участок считают заново — в 6 ставят 1. Если
            продолжить общую таблицу от 2 со значением K(6) = 3 и потом ещё
            умножить на 3, первые части посчитаются дважды.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapreshchennoe-chislo",
      navLabel: "Запрещённое число",
      explanation: (
        <>
          <Typography.Text>
            Теперь 9 запрещено. Сколько программ из 6 в 20 его обходят?
          </Typography.Text>
          <Typography.Text>
            <strong>
              В запрещённое число ставят K = 0: ни одна программа не может через
              него пройти.
            </strong>{" "}
            Остальное считают как обычно: ноль просто ничего не добавляет к
            сумме.
          </Typography.Text>
          <Typography.Text>
            В 10 и 11 из 6 можно попасть только через 9, поэтому там тоже 0. А в
            12 можно перепрыгнуть 9 умножением: 6 · 2 = 12. Значит, K(12) = 1, и
            дальше счёт продолжается.
          </Typography.Text>
          <LessonTable
            label={"Из 6 в 20 без 9"}
            columns={[
              { label: "n", numeric: true },
              { label: "Слагаемые" },
              { label: "K(n)", numeric: true },
            ]}
            rows={[
              ["6", "старт", "1"],
              ["7, 8", "только «+1»", "1"],
              ["9", "запрещено", "0"],
              ["10, 11", "только через 9", "0"],
              ["12", "K(11) + K(6)", "1"],
              ["13", "K(12)", "1"],
              ["14", "K(13) + K(7)", "2"],
              ["15", "K(14)", "2"],
              ["16", "K(15) + K(8)", "3"],
              ["17", "K(16)", "3"],
              ["18", "K(17) + K(9)", "3"],
              ["19", "K(18)", "3"],
              ["20", "K(19) + K(10)", "3"],
            ]}
          />
        </>
      ),
    },
    {
      id: "otvet-zadachi",
      navLabel: "Ответ задачи темы",
      explanation: (
        <>
          <Typography.Text>
            Итак, сколько программ в задаче темы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Запрет учитывают на каждом участке, а участки перемножают: 3 · 3 =
              9 — ответ задачи темы.
            </strong>{" "}
            На первом участке 9 не встречается: оно больше 6.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exLine2_20_2e2b22}
            caption={
              <>
                Задача темы по участкам: на 2 → 6 три программы; на 6 → 20 счёт
                заново с 1, зачёркнутое 9 получает 0, и до 20 доходят три.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <Typography.Text>
                      Три программы второго участка можно выписать:
                    </Typography.Text>
                    <ul>
                      <li>6 · 2 = 12, затем «+1» до 20;</li>
                      <li>6 + 1 = 7, 7 · 2 = 14, затем «+1» до 20;</li>
                      <li>6 → 7 → 8, 8 · 2 = 16, затем «+1» до 20.</li>
                    </ul>
                    <Typography.Text>
                      Проверка вычитанием: через 6 всего 18 программ, через 6 и
                      9 — 3 · 1 · 3 = 9 (участки 2 → 6, 6 → 9, 9 → 20), значит,
                      без 9 — 18 − 9 = 9.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Запрет — это ещё одна проверка в начале функции: если x
                      равно 9, программ нет — условия соединяем через{" "}
                      <PythonTerm term="andor">or</PythonTerm>. А обязательное
                      число — два вызова, перемноженные между собой:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "def f(x, y):\n    if x == 9 or x > y:\n        return 0\n    if x == y:\n        return 1\n    return f(x + 1, y) + f(x * 2, y)\n\n\nprint(f(2, 6) * f(6, 20))"
                      }
                      label={"Задача темы рекурсией"}
                      language="python"
                      output={"9"}
                    />
                    <Typography.Text>
                      Проверку запрета ставят перед проверкой цели: иначе
                      запрещённая цель засчиталась бы как успех.
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "neskolko-uslovij",
      navLabel: "Несколько условий",
      explanation: (
        <>
          <Typography.Text>
            Что делать, если обязательных чисел два — например, 4 и 8 на пути из
            2 в 16?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждое обязательное число — ещё один разрез пути. Участков
              становится больше, а запрет обнуляет своё число на том участке,
              где оно встречается.
            </strong>{" "}
            Команды только увеличивают число, поэтому порядок 2 → 4 → 8 → 16: 2
            · 2 · 2 = 8 программ.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: запрет по свойству числа"
          >
            <Typography.Text>
              Запрет может быть задан свойством: «траектория не содержит чисел,
              оканчивающихся на 7». На пути из 2 в 20 обнуляют и 7, и 17 —
              остаётся 6 программ из 30. Последняя цифра числа — остаток от
              деления на 10: <Notation>{"x % 10 == 7"}</Notation>.
            </Typography.Text>
            <Typography.Text>
              Если запрещённое число совпадает с обязательным или с целью,
              программ нет: ответ 0.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "etapy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Обязательное", note: <>произведение участков</> },
              { key: "Новый участок", note: <>заново с единицы</> },
              {
                key: "Запрещённое",
                note: <>0 в таблице, перепрыгнуть можно</>,
              },
              { key: "Задача темы", note: <>3 · 3 = 9</> },
              { key: "Проверка", note: <>все через 6 минус через 6 и 9</> },
              {
                key: "Python",
                note: <Notation>{"f(2, 6) * f(6, 20)"}</Notation>,
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
        <>Команды «+1» и «×2». Сколько программ переводят 2 в 12 через 6?</>
      ),
      reveal: <>6: из 2 в 6 три программы, из 6 в 12 две, 3 · 2.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>А сколько программ переводят 2 в 12 без 6?</>,
      reveal: <>4: всего 10, через 6 — 6, без 6 — 10 − 6.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>Сколько программ переводят 2 в 16, если траектория содержит 4 и 8?</>
      ),
      reveal: <>8: 2 · 2 · 2 — участки 2 → 4, 4 → 8, 8 → 16.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Почему количества участков перемножают, а не складывают?</>,
      reveal: (
        <>
          Программе нужны обе части: каждая первая часть сочетается с каждой
          второй.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>Число 9 запрещено. Можно ли выполнить «×2» из 8 и получить 16?</>
      ),
      reveal: (
        <>
          Да: запрет касается результатов команд, а 9 этот переход
          перепрыгивает.
        </>
      ),
    },
  ],
};

export default content;
