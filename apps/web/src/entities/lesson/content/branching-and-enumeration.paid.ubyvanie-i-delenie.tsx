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
import { lessonMedia } from "./branching-and-enumeration.paid.ubyvanie-i-delenie.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "ubyvayushchie-komandy",
      navLabel: "Убывающие команды",
      explanation: (
        <>
          <Typography.Text>
            Сколько программ переводят 12 в 2 командами «вычесть 1» и «разделить
            на 2, если число чётное»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если команды уменьшают число, метод тот же, но таблицу заполняют
              от старта вниз, а ветку обрывают, когда число стало меньше цели.
            </strong>{" "}
            В n ведут «−1» из n + 1 и деление из 2n — оба числа больше n и уже
            посчитаны, потому что идём сверху вниз. Числа выше старта дают 0.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <LessonTable
                      label={"Из 12 в 2: −1 и ÷2"}
                      columns={[
                        { label: "n", numeric: true },
                        { label: "K(n)", numeric: true },
                      ]}
                      rows={[
                        ["12", "1"],
                        ["11 … 7", "1"],
                        ["6", "K(7) + K(12) = 2"],
                        ["5", "K(6) + K(10) = 3"],
                        ["4", "K(5) + K(8) = 4"],
                        ["3", "K(4) + K(6) = 6"],
                        ["2", "K(3) + K(4) = 10"],
                      ]}
                    />
                    <Typography.Text>
                      Ответ 10 — столько же, сколько из 2 в 12 командами «+1» и
                      «×2»: каждую программу можно прочитать задом наперёд.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      В рекурсии меняется только условие обрыва: ветка
                      бесполезна, когда x стал меньше цели. Деление добавляют
                      только для чётного x —{" "}
                      <PythonTerm term="intdiv">остаток</PythonTerm>{" "}
                      <Notation>{"x % 2"}</Notation> равен нулю:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "def down(x, y):\n    if x < y:\n        return 0\n    if x == y:\n        return 1\n    result = down(x - 1, y)\n    if x % 2 == 0:\n        result += down(x // 2, y)\n    return result\n\n\nprint(down(12, 2))"
                      }
                      label={"Из 12 в 2 рекурсией"}
                      language="python"
                      output={"10"}
                    />
                  </>
                ),
              },
            ]}
          />
          <LessonDiagram
            {...lessonMedia.exLine12_2_3fc157}
            caption={
              <>
                Таблица идёт от 12 к 2 — в порядке заполнения. В 5 ведут «−1» из
                6 и точное деление из 10: K(5) = 2 + 1 = 3, а в 2 — десять
                программ.
              </>
            }
          />
          <Typography.Text>
            Обязательные числа при убывании идут в порядке убывания: для 12 → 2
            через 6 перемножают 12 → 6 и 6 → 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "delenie-nacelo",
      navLabel: "Деление нацело",
      explanation: (
        <>
          <Typography.Text>
            А если вторая команда делит на 2 нацело любое число, отбрасывая
            остаток?
          </Typography.Text>
          <Typography.Text>
            <strong>
              При делении нацело у каждого числа два предшественника: n
              получается и из 2n, и из 2n + 1.
            </strong>{" "}
            Из 12 и из 13 получается 6. Для пути 12 → 2: K(6) = K(7) + K(12) = 2
            (13 выше старта), K(5) = K(6) + K(10) + K(11) = 4, и так до K(2) =
            19 — почти вдвое больше, чем при точном делении.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.exLine12_2_7faa1a}
            caption={
              <>
                То же при делении нацело: в 5 ведут 6, 10 и ещё 11 — у деления
                два предшественника. K(5) = 2 + 1 + 1 = 4, в 2 — девятнадцать
                программ.
              </>
            }
          />
          <Typography.Text>
            В программе это та же функция без проверки чётности:{" "}
            <Notation>{"result += down(x // 2, y)"}</Notation> для любого x.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "okruglenie-vverh",
      navLabel: "Округление вверх",
      explanation: (
        <>
          <Typography.Text>
            Команда «разделить на 2 с округлением вверх». Из каких чисел она
            даёт 6?
          </Typography.Text>
          <Typography.Text>
            <strong>
              При округлении вверх предшественники другие: 2n − 1 и 2n.
            </strong>{" "}
            11 / 2 = 5,5 → 6 и 12 / 2 = 6, а 13 / 2 = 6,5 → 7. Для пути 12 → 2
            получается 37 программ. Если сомневаешься, проверь подстановкой:
            раздели кандидата на 2 и округли.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "komanda-s-vetvleniem",
      navLabel: "Команда с ветвлением",
      explanation: (
        <>
          <Typography.Text>
            Команды «вычесть 1» и «если число чётное, раздели на 2, иначе вычти
            3». Сколько программ переводят 12 в 3?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Команда с ветвлением — всё равно одна команда: для текущего числа
              она выполняет одну ветвь, а не обе.
            </strong>{" "}
            Из 12 она даёт только 6 (12 чётное — делим), а не 9. Найдём, какие
            числа ведут в 6:
          </Typography.Text>
          <ul>
            <li>«−1» — из 7;</li>
            <li>ветвь «чётное — раздели на 2» — из 12: 12 / 2 = 6;</li>
            <li>ветвь «нечётное — вычти 3» — из 9: 9 − 3 = 6.</li>
          </ul>
          <Typography.Text>
            K(6) = K(7) + K(12) + K(9) = 2 + 1 + 1 = 4. Так же для остальных
            чисел; итог K(3) = 13.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: обязательное число при делении нацело"
          >
            <Typography.Text>
              Из 20 в 3 командами «−1» и «деление нацело на 2» через 10: на
              участке 20 → 10 две программы (21 выше старта, поэтому второго
              предшественника нет), на участке 10 → 3 — шесть. Ответ 2 · 6 = 12.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "ubyvanie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Убывание",
                note: <>таблица сверху вниз, обрыв ниже цели</>,
              },
              { key: "Точное ÷2", note: <>предшественник 2n</> },
              { key: "Нацело", note: <>2n и 2n + 1</> },
              { key: "Вверх", note: <>2n − 1 и 2n</> },
              { key: "Ветвление", note: <>одна команда — одна ветвь</> },
              { key: "Python", note: <>обрыв при x {"<"} y</> },
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
          Команды «−1» и «÷2, если чётное». Сколько программ переводят 12 в 6?
        </>
      ),
      reveal: <>2: одно деление или шесть вычитаний.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>Из каких чисел деление на 2 нацело даёт 5?</>,
      reveal: <>Из 10 и 11.</>,
    },
    {
      id: "zadacha-3",
      prompt: <>Из каких чисел деление на 2 с округлением вверх даёт 5?</>,
      reveal: <>Из 9 и 10.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Команда «если чётное — раздели на 2, иначе вычти 3». Что она даст из
          15?
        </>
      ),
      reveal: <>12: 15 нечётное, выполняется только ветвь «−3».</>,
    },
    {
      id: "zadacha-5",
      prompt: <>Почему при убывании таблицу заполняют сверху вниз?</>,
      reveal: (
        <>
          Предшественники числа больше него: к моменту расчёта n они должны быть
          уже посчитаны.
        </>
      ),
    },
  ],
};

export default content;
