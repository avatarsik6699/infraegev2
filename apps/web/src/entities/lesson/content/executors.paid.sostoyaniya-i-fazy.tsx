// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  LessonTabs,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./executors.paid.sostoyaniya-i-fazy.media";
import { Program } from "./executors.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "fazy-raboty",
      navLabel: "Фазы работы",
      explanation: (
        <>
          <Typography.Text>
            Что сделает таблица из четырёх состояний со словом{" "}
            <Notation>{"101"}</Notation>?
          </Typography.Text>
          <Typography.Text>
            Головка начинает в ближайшей пустой ячейке слева, в{" "}
            <Notation>{"q0"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Когда состояний несколько, каждое из них — отдельная фаза работы.
              Назови, что машина делает в каждой фазе и чем фаза заканчивается,
              — и длинную трассу писать не придётся.
            </strong>
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.tmTrace101_q0Rq1q10Lq21Rq11Rq1q20Lq31Lq2q31Sq3_48273b}
            label={"Таблица из четырёх состояний на слове 101"}
          />
          <LessonTable
            label={"Фазы таблицы"}
            columns={[
              { label: "Состояние" },
              { label: "Что делает" },
              { label: "Чем заканчивается" },
            ]}
            rows={[
              [
                <Notation key="q">{"q0"}</Notation>,
                "входит в слово",
                "первый сдвиг вправо",
              ],
              [
                <Notation key="q">{"q1"}</Notation>,
                "идёт вправо, все цифры → 1",
                "на λ справа пишет 0",
              ],
              [
                <Notation key="q">{"q2"}</Notation>,
                "идёт влево по единицам",
                "на λ слева пишет 0",
              ],
              [
                <Notation key="q">{"q3"}</Notation>,
                "пишет 1 ещё левее",
                "остановка",
              ],
            ]}
          />
          <Typography.Text>
            <Notation>{"q1"}</Notation> повторяется много тактов подряд, но
            цикла нет: головка каждый раз в новой ячейке, и до края слова всё
            ближе. Каждая фаза конечна, машина остановится.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rezultat-dlya-lyuboj-dliny",
      navLabel: "Результат для любой длины",
      explanation: (
        <>
          <Typography.Text>
            Какое наибольшее число не больше 500 может получиться у этой
            таблицы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Когда фазы названы, результат записывают для любой длины: здесь из
              слова длины k всегда получается 10, затем k единиц, затем 0.
            </strong>{" "}
            Цифры входа в первой фазе всё равно становятся единицами, поэтому
            результат зависит только от длины.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmRows10k0}
            caption={
              <>
                Вход длины 3 и результат: слева дописано 10, три цифры стали
                единицами, справа дописан 0.
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
                    k = 1 — <Notation>{"1010"}</Notation> = 10, k = 2 — 22, k =
                    3 — 46, …, k = 6 — <Notation>{"101111110"}</Notation> = 382,
                    k = 7 — уже 766. Ответ 382. Тактов 2k + 4: вход, k цифр,
                    запись справа, k единиц обратно, запись слева, остановка.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Раз важна только длина, достаточно запустить по одному
                      слову каждой длины (<Notation>{"'1' * k"}</Notation> — k
                      единиц подряд) функцией <Notation>{"run_tm"}</Notation> из
                      подтемы 1:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "rules = {\n    ('q0', 'λ'): ('λ', 'R', 'q1'),\n    ('q1', 'λ'): ('0', 'L', 'q2'),\n    ('q1', '0'): ('1', 'R', 'q1'),\n    ('q1', '1'): ('1', 'R', 'q1'),\n    ('q2', 'λ'): ('0', 'L', 'q3'),\n    ('q2', '1'): ('1', 'L', 'q2'),\n    ('q3', 'λ'): ('1', 'S', 'q3'),\n}\nfor k in range(1, 8):\n    result, pos, steps = run_tm('1' * k, rules, -1)\n    print(k, result, int(result, 2), steps)"
                      }
                      label={"Результат для длин 1–7"}
                      language="python"
                      output={
                        "1 1010 10 6\n2 10110 22 8\n3 101110 46 10\n4 1011110 94 12\n5 10111110 190 14\n6 101111110 382 16\n7 1011111110 766 18"
                      }
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
      id: "razryady-na-krayah",
      navLabel: "Цифры на краях",
      explanation: (
        <>
          <Typography.Text>
            Таблица проходит число вправо, не меняя цифр, пишет 1 справа,
            возвращается и пишет 1 слева. Что станет с числом 13?
          </Typography.Text>
          <Program
            label={"Таблица: единица справа и слева"}
            symbols={["λ", "0", "1"]}
            rows={[
              ["q0", "λ, R, q1", "—", "—"],
              ["q1", "1, L, q2", "0, R, q1", "1, R, q1"],
              ["q2", "1, S, q2", "0, L, q2", "1, L, q2"],
            ]}
          />
          <Typography.Text>
            <strong>
              Если цифры слова сохраняются, а на краях дописываются разряды,
              результат выражают через N и длину k, как в подтеме 3.
            </strong>{" "}
            Единица справа даёт 2N + 1, единица слева от слова длины k + 1
            добавляет 2ᵏ⁺¹. Итог 2ᵏ⁺¹ + 2N + 1: 13 ={" "}
            <Notation>{"1101"}</Notation>, k = 4, 32 + 27 = 59.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyanie-kak-pamyat",
      navLabel: "Состояние как память",
      explanation: (
        <>
          <Typography.Text>
            Таблица ниже дописывает к слову одну цифру. Какую — для слова{" "}
            <Notation>{"1011"}</Notation>? Головка начинает на первой цифре, в{" "}
            <Notation>{"q0"}</Notation>.
          </Typography.Text>
          <Program
            label={"Таблица чётности"}
            symbols={["λ", "0", "1"]}
            rows={[
              ["q0", "0, S, q0", "0, R, q0", "1, R, q1"],
              ["q1", "1, S, q1", "0, R, q1", "1, R, q0"],
            ]}
          />
          <Typography.Text>
            <strong>
              Состояние может хранить свойство уже просмотренной части: здесь{" "}
              <Notation>{"q0"}</Notation> — «единиц пока чётное число»,{" "}
              <Notation>{"q1"}</Notation> — «нечётное».
            </strong>{" "}
            Ноль состояние не меняет, единица переключает. На пустой ячейке
            машина пишет 0 при чётном числе единиц и 1 при нечётном. В{" "}
            <Notation>{"1011"}</Notation> три единицы:{" "}
            <Notation>{"10111"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Смысл состояния проверяют по командам, а не по названию: каждый ноль
            должен сохранять смысл, каждая единица — менять его на
            противоположный. Перебором слов (
            <PythonTerm term="product">product</PythonTerm>) и функцией{" "}
            <Notation>{"run_tm"}</Notation> это легко проверить на коротких
            строках.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fazy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Фаза",
                note: <>что делает состояние и чем заканчивается</>,
              },
              { key: "Не цикл", note: <>то же состояние, но новая ячейка</> },
              {
                key: "Любая длина",
                note: <>10, k единиц, 0: важна только k</>,
              },
              { key: "Такты", note: <>сумма тактов всех фаз: 2k + 4</> },
              { key: "Края", note: <>2ᵏ⁺¹ + 2N + 1 для 1 слева и справа</> },
              {
                key: "Память",
                note: <>состояние хранит чётность и подобное</>,
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
          Таблица из четырёх состояний получает слово длины 5. Какое число
          получится?
        </>
      ),
      reveal: (
        <>
          190: <Notation>{"10111110"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Сколько тактов она выполнит на слове длины 5?</>,
      reveal: <>14: 2k + 4.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Таблица чётности получает слово <Notation>{"110"}</Notation>. Что
          будет на ленте?
        </>
      ),
      reveal: (
        <>
          <Notation>{"1100"}</Notation>: две единицы — чётно, дописан 0.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Таблица «единица справа и слева» получает число 21 ={" "}
          <Notation>{"10101"}</Notation>. Какое число получится?
        </>
      ),
      reveal: <>107: 2⁶ + 2 · 21 + 1 = 64 + 43.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Почему 10 тактов подряд в одном состоянии ещё не значат, что машина
          зациклилась?
        </>
      ),
      reveal: (
        <>
          Цикл — повтор всей картины: ленты, ячейки и состояния. При проходе
          головка каждый раз в новой ячейке.
        </>
      ),
    },
  ],
};

export default content;
