// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./executors.paid.hvost-i-obratnaya-zadacha.media";
import { Program, THEME_TASK, ThemeTable } from "./executors.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "hvost",
      navLabel: "Хвост",
      explanation: (
        <>
          <Typography.Text>
            Вернёмся к задаче темы: строка из 12 символов, после работы таблицы
            ровно 5 нулей. Сколько нулей могло быть до?
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <ThemeTable />
          <Typography.Text>
            <strong>
              Таблица меняет только хвост у правого края и одну цифру перед ним:
              P 1 0ᵗ → P 0 1ᵗ. Левая часть P не меняется.
            </strong>{" "}
            Здесь 0ᵗ — t нулей подряд, а не степень; 1ᵗ — t единиц. В подтеме 1
            из <Notation>{"10100"}</Notation> получилось{" "}
            <Notation>{"10011"}</Notation>: P = <Notation>{"10"}</Notation>,
            хвост из двух нулей стал двумя единицами, единица перед ним — нулём.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmRowsP10t2}
            caption={
              <>
                10100 → 10011: часть P = 10 не меняется, остановочная единица
                стала нулём, хвост из двух нулей — единицами.
              </>
            }
          />
          <Typography.Text>
            Тактов t + 2: вход в строку, t нулей хвоста и остановочная замена
            единицы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otkuda-nuli",
      navLabel: "Откуда нули",
      explanation: (
        <>
          <Typography.Text>
            Откуда в результате берутся 5 нулей?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нули результата — это нули части P и один новый ноль из
              остановочной единицы. Поэтому в P было 5 − 1 = 4 нуля, а во входе
              — 4 + t нулей.
            </strong>{" "}
            Нули хвоста в результат не попадают: все они стали единицами.
            Значит, вопрос о входе сводится к вопросу о длине хвоста t.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otvet-zadachi",
      navLabel: "Ответ задачи темы",
      explanation: (
        <>
          <Typography.Text>
            Какое наибольшее t возможно при длине 12?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Хвост длиннее всего, когда во входе одна единица: 4 нуля левее
              неё, 7 правее. Тогда нулей во входе 4 + 7 = 11 — ответ задачи
              темы.
            </strong>{" "}
            Больше нельзя: из 12 нулей единица не появится, все станут
            единицами, и нулей в результате будет 0, а не 5. Наименьшее — при
            пустом хвосте t = 0: 4 нуля, например{" "}
            <Notation>{"111111100001"}</Notation> →{" "}
            <Notation>{"111111100000"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmRows115}
            caption={
              <>
                Вход с наибольшим числом нулей: 4 нуля, единица, 7 нулей.
                Единица стала пятым нулём, семь нулей хвоста — единицами.
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
                    Граница — ещё не ответ: нужен вход, на котором она
                    достигается. <Notation>{"000010000000"}</Notation> →{" "}
                    <Notation>{"000001111111"}</Notation>: в результате ровно 5
                    нулей, во входе 11.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      При длине 12 можно перебрать все 2¹² = 4096 строк (
                      <PythonTerm term="product">product</PythonTerm>) и
                      запустить каждую функцией <Notation>{"run_tm"}</Notation>{" "}
                      из подтемы 1:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from itertools import product\nrules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', 'λ'): ('λ', 'S', 'q1'),\n    ('q1', '0'): ('1', 'L', 'q1'),\n    ('q1', '1'): ('0', 'S', 'q1'),\n}\nleast, best = 12, 0\nfor bits in product('01', repeat=12):\n    word = ''.join(bits)\n    result, pos, steps = run_tm(word, rules, 12)\n    if result.count('0') == 5:\n        least = min(least, word.count('0'))\n        best = max(best, word.count('0'))\nprint(least, best)"
                      }
                      label={"Задача темы полным перебором"}
                      language="python"
                      output={"4 11"}
                    />
                    <Typography.Text>
                      На экзамене строка из 999 символов: 2⁹⁹⁹ вариантов не
                      перебрать. Рассуждение же не зависит от длины: наибольшее
                      число исходных нулей — длина минус один.
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
      id: "osobye-sluchai",
      navLabel: "Особые случаи",
      explanation: (
        <>
          <Typography.Text>
            А если на ленте двоичная запись числа без ведущих нулей?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждое добавочное условие меняет границы: их выводят заново, а не
              подставляют в формулу общего случая.
            </strong>{" "}
            Без ведущих нулей первая цифра — единица, и она входит в P. В P
            нужны эта единица и 4 нуля — 5 ячеек, ещё одна — остановочная
            единица, на хвост остаётся 12 − 6 = 6 нулей. Наибольшее число нулей
            — 4 + 6 = 10, например <Notation>{"100001000000"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Результат без нулей бывает только из строки, в которой одни нули:
            единица не встретится, и нового нуля не появится. Тогда нулей во
            входе ровно столько, какова длина.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: зеркальная таблица">
            <Typography.Text>
              Если головка начинает слева и идёт вправо, меняя единицы на нули
              до первого нуля, хвост стоит у левого края: 1ᵗ 0 P → 0ᵗ 1 P.
              Рассуждают так же, только роли нулей и единиц меняются местами:
              единицы результата — единицы P и одна новая.
            </Typography.Text>
            <Program
              label={"Зеркальная таблица"}
              symbols={["λ", "0", "1"]}
              rows={[
                ["q0", "λ, R, q1", "—", "—"],
                ["q1", "λ, S, q1", "1, S, q1", "0, R, q1"],
              ]}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "hvost-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Хвост", note: <>P 1 0ᵗ → P 0 1ᵗ, P не меняется</> },
              { key: "Такты", note: <>t + 2</> },
              { key: "Нули результата", note: <>нули P и один новый</> },
              { key: "Наибольшее", note: <>одна единица, длина − 1 нулей</> },
              { key: "Наименьшее", note: <>пустой хвост, t = 0</> },
              {
                key: "Проверка",
                note: <>пример входа и перебор на короткой длине</>,
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
          Сколько тактов выполнит таблица задачи темы на слове{" "}
          <Notation>{"1000000"}</Notation>?
        </>
      ),
      reveal: <>8: хвост из шести нулей, t + 2.</>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Строка длины 10, после таблицы задачи темы в ней ровно один ноль.
          Какое наибольшее число нулей могло быть во входе?
        </>
      ),
      reveal: (
        <>
          9: <Notation>{"1000000000"}</Notation> →{" "}
          <Notation>{"0111111111"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: <>А наименьшее число нулей в той же задаче?</>,
      reveal: (
        <>
          0: <Notation>{"1111111111"}</Notation> →{" "}
          <Notation>{"1111111110"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Строка длины 7, после таблицы нулей нет. Сколько нулей было во входе?
        </>
      ),
      reveal: <>7: результат без нулей бывает только из одних нулей.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Строка из 1000 символов, после таблицы задачи темы ровно 343 нуля.
          Какое наибольшее число нулей могло быть во входе?
        </>
      ),
      reveal: (
        <>999: одна единица, 342 нуля левее и 657 правее — длина минус один.</>
      ),
    },
  ],
};

export default content;
