// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./executors.paid.slovo-i-chislo.media";
import { Program, ThemeTable } from "./executors.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "minus-odin",
      navLabel: "Минус один",
      explanation: (
        <>
          <Typography.Text>
            Что таблица задачи темы делает с числом, если на ленте его двоичная
            запись?
          </Typography.Text>
          <ThemeTable />
          <Typography.Text>
            <strong>
              Если на ленте двоичная запись числа, действие таблицы читают как
              арифметику: таблица задачи темы вычитает единицу.
            </strong>{" "}
            В подтеме 1 из <Notation>{"10100"}</Notation> = 20 получилось{" "}
            <Notation>{"10011"}</Notation> = 19. Так и вычитают единицу
            столбиком: нули справа занимают у ближайшей единицы и становятся
            единицами, сама единица становится нулём.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    37 = <Notation>{"100101"}</Notation>: справа сразу единица,
                    она становится нулём — <Notation>{"100100"}</Notation> = 36,
                    два такта. 40 = <Notation>{"101000"}</Notation>: три нуля
                    хвоста стали единицами, единица — нулём:{" "}
                    <Notation>{"100111"}</Notation> = 39, пять тактов.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Проверим вывод на всех числах от 1 до 500:{" "}
                      <PythonTerm term="base">
                        <Notation>{"bin(n)[2:]"}</Notation>
                      </PythonTerm>{" "}
                      — двоичная запись без приставки 0b,{" "}
                      <Notation>{"int(result, 2)"}</Notation> — число по
                      двоичной записи. Функция <Notation>{"run_tm"}</Notation> —
                      из подтемы 1.
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "rules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', 'λ'): ('λ', 'S', 'q1'),\n    ('q1', '0'): ('1', 'L', 'q1'),\n    ('q1', '1'): ('0', 'S', 'q1'),\n}\nbad = 0\nfor n in range(1, 501):\n    word = bin(n)[2:]\n    result, pos, steps = run_tm(word, rules, len(word))\n    if int(result, 2) != n - 1:\n        bad += 1\nprint('расхождений:', bad)"
                      }
                      label={"Таблица задачи темы вычитает единицу"}
                      language="python"
                      output={"расхождений: 0"}
                    />
                    <Typography.Text>
                      Совпадение на 500 числах — проверка, а не доказательство:
                      доказывает рассуждение о разрядах выше.
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: строка из нулей">
            <Typography.Text>
              «Минус один» верно только для ненулевого числа. Из{" "}
              <Notation>{"000"}</Notation> таблица сделает{" "}
              <Notation>{"111"}</Notation>: единицы не встретится, все нули
              станут единицами, и машина остановится на пустой ячейке. Запись
              отрицательного числа таблицей не предусмотрена.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "slovo-i-chislo",
      navLabel: "Слово и число",
      explanation: (
        <>
          <Typography.Text>
            Из <Notation>{"1000"}</Notation> таблица задачи темы делает{" "}
            <Notation>{"0111"}</Notation>. Это 7 или четыре символа?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Слово на ленте хранит каждую ячейку, в том числе ведущие нули, а
              число — только значение.
            </strong>{" "}
            <Notation>{"0111"}</Notation> — четыре символа, один ноль, значение
            7. Если вопрос о длине, числе нулей или тактов, работают со словом;
            если о десятичном результате — с числом.
          </Typography.Text>
          <Typography.Text>
            Веса разрядов от правого края — 1, 2, 4, 8, …; значение — сумма
            весов там, где стоят единицы: <Notation>{"10101"}</Notation> = 16 +
            4 + 1 = 21.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pripisyvanie",
      navLabel: "Цифра слева и справа",
      explanation: (
        <>
          <Typography.Text>
            Таблица ниже проходит число 21 = <Notation>{"10101"}</Notation> и
            пишет единицу слева. Какое число получится? Головка начинает в
            ближайшей пустой ячейке справа, в <Notation>{"q0"}</Notation>.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.tmTrace10101_q0Lq1q11Lq20Lq11Lq1q2Sq2}
            label={"Единица слева к слову 10101 такт за тактом"}
          />
          <Typography.Text>
            <strong>
              Единица слева от слова длины k добавляет 2ᵏ: получается N + 2ᵏ.
              Цифра справа сдвигает прежние на разряд: ноль даёт 2N, единица —
              2N + 1.
            </strong>{" "}
            Слово <Notation>{"10101"}</Notation> длины 5: 21 + 32 = 53 ={" "}
            <Notation>{"110101"}</Notation>. Тактов k + 3 = 8: вход, пять цифр,
            запись слева, остановка.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmBits10101_ca8e3f}
            caption={
              <>
                Единица слева получает вес 32, веса прежних цифр не меняются: 21
                + 32 = 53.
              </>
            }
          />
          <LessonDiagram
            {...lessonMedia.tmBits10101_a3136d}
            caption={
              <>
                Единица справа сдвигает прежние цифры на разряд: каждый вес
                удваивается, и прибавляется 1 — 2 · 21 + 1 = 43.
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
                    Длину k бери из самой записи: 100 ={" "}
                    <Notation>{"1100100"}</Notation> — семь цифр, единица слева
                    даёт 100 + 128 = 228. Справа: 37 ={" "}
                    <Notation>{"100101"}</Notation>, единица справа — 2 · 37 + 1
                    = 75, блок <Notation>{"10"}</Notation> справа — 4 · 37 + 2 =
                    150.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "rules = {\n    ('q0', 'λ'): ('λ', 'L', 'q1'),\n    ('q1', '0'): ('0', 'L', 'q1'),\n    ('q1', '1'): ('1', 'L', 'q1'),\n    ('q1', 'λ'): ('1', 'L', 'q2'),\n    ('q2', 'λ'): ('λ', 'S', 'q2'),\n}\nbad = 0\nfor n in range(1, 501):\n    word = bin(n)[2:]\n    result, pos, steps = run_tm(word, rules, len(word))\n    if int(result, 2) != n + 2 ** len(word):\n        bad += 1\nprint(run_tm('10101', rules, 5), 'расхождений:', bad)"
                    }
                    label={"Единица слева: N + 2ᵏ"}
                    language="python"
                    output={"('110101', -2, 8) расхождений: 0"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: смена старшего разряда"
          >
            <Typography.Text>
              Пусть таблица, дойдя до левого края, сначала меняет старшую
              единицу на ноль и только потом пишет единицу левее. Тогда старая
              единица теряет вес 2ᵏ⁻¹, новая получает 2ᵏ: результат N + 2ᵏ⁻¹.
              Для 21 — <Notation>{"100101"}</Notation> = 37, а не 53.
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.tmRows21163237}
              caption={
                <>
                  Старшая единица слова 10101 стала нулём, левее записана новая
                  единица: 21 − 16 + 32 = 37.
                </>
              }
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "inversiya",
      navLabel: "Инверсия",
      explanation: (
        <>
          <Typography.Text>
            Таблица проходит слово и меняет каждую цифру на противоположную. Что
            станет с числом 21?
          </Typography.Text>
          <Program
            label={"Таблица: инверсия"}
            symbols={["λ", "0", "1"]}
            rows={[
              ["q0", "λ, L, q1", "—", "—"],
              ["q1", "λ, S, q1", "1, L, q1", "0, L, q1"],
            ]}
          />
          <Typography.Text>
            <strong>
              Инверсия сохраняет длину слова, а значение становится 2ᵏ − 1 − N.
            </strong>{" "}
            В каждом разряде цифра и её противоположность вместе дают единицу,
            поэтому N и результат вместе дают k единиц, то есть 2ᵏ − 1.{" "}
            <Notation>{"10101"}</Notation> → <Notation>{"01010"}</Notation>: 31
            − 21 = 10, а на ленте по-прежнему пять символов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pribavlenie-edinicy",
      navLabel: "Плюс один",
      explanation: (
        <>
          <Typography.Text>
            А если в таблице задачи темы поменять ролями 0 и 1 — что она будет
            делать с числом <Notation>{"1011"}</Notation>?
          </Typography.Text>
          <Program
            label={"Таблица: прибавление единицы"}
            symbols={["λ", "0", "1"]}
            rows={[
              ["q0", "λ, L, q1", "—", "—"],
              ["q1", "1, S, q1", "1, S, q1", "0, L, q1"],
            ]}
          />
          <Typography.Text>
            <strong>
              Такая таблица прибавляет единицу: единицы хвоста становятся
              нулями, ближайший ноль или пустая ячейка слева — единицей.
            </strong>{" "}
            <Notation>{"1011"}</Notation> = 11 → <Notation>{"1100"}</Notation> =
            12, четыре такта. Если единицы везде, слово удлиняется:{" "}
            <Notation>{"111"}</Notation> → <Notation>{"1000"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmRows11112}
            caption={
              <>
                Перенос: две единицы хвоста стали нулями, ноль перед ними —
                единицей. 11 + 1 = 12.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "slovo-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Задача темы", note: <>вычитает единицу: 20 → 19</> },
              { key: "Слово и число", note: <>ведущие нули — тоже ячейки</> },
              { key: "1 слева", note: <>N + 2ᵏ, k — длина записи</> },
              { key: "Справа", note: <>0 — 2N, 1 — 2N + 1</> },
              { key: "Инверсия", note: <>2ᵏ − 1 − N, длина та же</> },
              { key: "Плюс один", note: <>единицы хвоста → 0, ноль → 1</> },
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
          Таблица задачи темы получает двоичную запись числа 40. Какое число
          получится?
        </>
      ),
      reveal: (
        <>
          39: <Notation>{"101000"}</Notation> → <Notation>{"100111"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Сколько тактов при этом выполнит машина?</>,
      reveal: <>5: вход, три нуля хвоста, остановочная замена единицы.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Таблица «единица слева» получает слово <Notation>{"101"}</Notation>.
          Какое число получится?
        </>
      ),
      reveal: (
        <>
          13: 5 + 2³ = 13, <Notation>{"1101"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Инверсия получает <Notation>{"1000"}</Notation>. Сколько символов
          будет на ленте и какое значение?
        </>
      ),
      reveal: (
        <>
          Четыре символа, <Notation>{"0111"}</Notation>, значение 7 = 2⁴ − 1 −
          8.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          К двоичной записи числа 37 справа дописали единицу. Какое число
          получилось?
        </>
      ),
      reveal: <>75: 2 · 37 + 1.</>,
    },
  ],
};

export default content;
