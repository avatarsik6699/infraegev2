// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import {
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "neskolko-chisel-srazu",
      navLabel: "Несколько чисел сразу",
      explanation: (
        <>
          <Typography.Text>
            Дополнительный урок — для продвинутых: такие условия редки.
          </Typography.Text>
          <Typography.Text>
            Сколько программ из 2 в 6 командами «+1» и «×2» проходят через 3 и
            4? Через хотя бы одно из них? Через ровно одно?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Когда условие говорит о нескольких числах сразу, программы делят
              на группы и следят, какие из них посчитаны дважды.
            </strong>{" "}
            Из 2 в 6 ведут три программы из подтемы 1: 1111 проходит через 3 и
            4, 12 — только через 3, 211 — только через 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "i-ili-rovno-odno",
      navLabel: "И, или, ровно одно",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «И» — программы через оба числа, «или» — хотя бы через одно,
              «ровно одно» — через одно, но не через оба.
            </strong>
          </Typography.Text>
          <LessonTable
            label={"Три программы из 2 в 6 по группам"}
            columns={[
              { label: "Условие" },
              { label: "Программы" },
              { label: "Всего", numeric: true },
            ]}
            rows={[
              ["через 3 и 4", "1111", "1"],
              ["через 3 или 4", "1111, 12, 211", "3"],
              ["ровно через одно", "12, 211", "2"],
            ]}
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Через 3 — две программы, через 4 — две, через оба — одна.
                    Сумма 2 + 2 учитывает 1111 дважды, поэтому «или» — 2 + 2 − 1
                    = 3. Для «ровно одно» 1111 убирают из обеих групп: 2 + 2 − 2
                    · 1 = 2.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "def f(x, y):\n    if x > y:\n        return 0\n    if x == y:\n        return 1\n    return f(x + 1, y) + f(x * 2, y)\n\n\na = f(2, 3) * f(3, 6)\nb = f(2, 4) * f(4, 6)\nboth = f(2, 3) * f(3, 4) * f(4, 6)\nprint(a + b - both, a + b - 2 * both)"
                    }
                    label={"«Или» и «ровно одно» через группы"}
                    language="python"
                    output={"3 2"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: «или» и общий запрет"
          >
            <Typography.Text>
              Если к «или» добавлен общий запрет — «через 6 или через 8, но не
              через 15», — запрет ставят в каждое из трёх слагаемых: считают
              через 6, через 8 и через оба с нулём в 15. Вычесть программы через
              15 один раз из готовой суммы нельзя: часть из них уже учтена
              дважды.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "tolko-pribavleniya",
      navLabel: "Только прибавления",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «+3». Сколько программ переводят 2 в 11?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если все команды — прибавления, программу задают число команд
              каждого вида и их места: перебирают количества и считают
              расстановки.
            </strong>{" "}
            Прибавить нужно 9: если «+3» выполнено b раз, то «+1» — 9 − 3b раз.
          </Typography.Text>
          <LessonTable
            label={"Из 2 в 11 командами «+1» и «+3»"}
            columns={[
              { label: "«+3»", numeric: true },
              { label: "«+1»", numeric: true },
              { label: "Команд", numeric: true },
              { label: "Расстановок", numeric: true },
            ]}
            rows={[
              ["0", "9", "9", "1"],
              ["1", "6", "7", "7"],
              ["2", "3", "5", "10"],
              ["3", "0", "3", "1"],
            ]}
          />
          <Typography.Text>
            Одну «+3» среди семи команд можно поставить на любое из 7 мест. Две
            «+3» среди пяти — на пару мест: 5 · 4 = 20 упорядоченных выборов, но
            каждая пара посчитана дважды, остаётся 10. Итого 1 + 7 + 10 + 1 =
            19. Проверка таблицей K(n) = K(n − 1) + K(n − 3) от 2 до 11: 1, 1,
            1, 2, 3, 4, 6, 9, 13, 19.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: когда способ не работает"
          >
            <Typography.Text>
              Число способов выбрать k мест из n — число сочетаний n! / (k! · (n
              − k)!), где n! — произведение чисел от 1 до n. Для пары мест из
              пяти: 5! / (2! · 3!) = 10.
            </Typography.Text>
            <Typography.Text>
              Расстановки годятся, только пока порядок команд не меняет
              допустимость: при запрещённом числе или с умножением («+1», затем
              «×2» и наоборот дают разные числа) считают таблицей.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "obratnyj-vopros",
      navLabel: "Обратный вопрос",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «×2», старт 2. Какое наименьшее число получается
            ровно 18 программами?
          </Typography.Text>
          <Typography.Text>
            <strong>
              В обратном вопросе таблицу считают по всему диапазону и только
              потом выбирают цели с нужным количеством.
            </strong>{" "}
            Нечётное число получает столько же программ, сколько предыдущее, —
            поэтому значения идут парами.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <LessonTable
                      label={"Старт 2, команды «+1» и «×2»"}
                      columns={[
                        { label: "n", numeric: true },
                        { label: "K(n)", numeric: true },
                      ]}
                      rows={[
                        ["12, 13", "10"],
                        ["14, 15", "13"],
                        ["16, 17", "18"],
                        ["18, 19", "23"],
                        ["20, 21", "30"],
                      ]}
                    />
                    <Typography.Text>
                      18 программ — у 16 и 17. Наименьшая цель — 16, а если
                      спрашивают все цели, ответ — оба числа.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "k = [0] * 22\nk[2] = 1\nfor n in range(3, 22):\n    k[n] = k[n - 1]\n    if n % 2 == 0:\n        k[n] += k[n // 2]\nprint([n for n in range(2, 22) if k[n] == 18])"
                    }
                    label={"Все цели с 18 программами"}
                    language="python"
                    output={"[16, 17]"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: останавливаться рано"
          >
            <Typography.Text>
              С командой «+1» и без запретов количества не убывают, и первое
              совпадение — наименьшая цель. С запретом или без «+1» количество
              может упасть до нуля и снова вырасти, поэтому таблицу досчитывают
              до конца диапазона.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "ne-oba",
      navLabel: "Не оба",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «×2». Сколько программ из 2 в 12 не проходят через 4
            и 8 одновременно?
          </Typography.Text>
          <Typography.Text>
            <strong>
              «Не оба» — все программы минус программы через оба числа.
            </strong>{" "}
            Всего программ 10, через 4 и 8 — 2 · 2 · 1 = 4 (участки 2 → 4, 4 →
            8, 8 → 12). Ответ 10 − 4 = 6.
          </Typography.Text>
          <LessonTable
            label={
              "Из 2 в 12: через 4 — 8 программ, через 8 — 5, через оба — 4"
            }
            columns={[
              { label: "Условие" },
              { label: "Как считать" },
              { label: "Программ", numeric: true },
            ]}
            rows={[
              ["через 4 и 8", "участки 2 → 4 → 8 → 12", "4"],
              ["хотя бы через одно", "8 + 5 − 4", "9"],
              ["ровно через одно", "8 + 5 − 2 · 4", "5"],
              ["не через оба", "10 − 4", "6"],
            ]}
          />
          <Typography.Text>
            Четыре условия — четыре разные группы, и ответы у них разные. Перед
            счётом переведи условие в одну из этих строк.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gruppy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "И", note: <>произведение участков через оба числа</> },
              { key: "Или", note: <>сумма групп минус пересечение</> },
              { key: "Ровно одно", note: <>сумма минус два пересечения</> },
              { key: "Не оба", note: <>все минус пересечение</> },
              {
                key: "Только прибавления",
                note: <>количества команд и их расстановки</>,
              },
              {
                key: "Обратный вопрос",
                note: <>таблица по всему диапазону, потом выбор</>,
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
          Команды «+1» и «×2», путь 2 → 6. Сколько программ проходят через оба
          числа 3 и 4?
        </>
      ),
      reveal: <>1: только 1111.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>А через ровно одно из чисел 3 и 4?</>,
      reveal: (
        <>
          2: через 3 — две программы, через 4 — две, общая одна: 2 + 2 − 2 · 1.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: <>Команды «+1» и «+3». Сколько программ переводят 2 в 11?</>,
      reveal: <>19: 1 + 7 + 10 + 1 по числу команд «+3» — от 0 до 3.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Команды «+1» и «×2», старт 2. Какая наименьшая цель, до которой ведут
          ровно 18 программ?
        </>
      ),
      reveal: <>16: таблица до 21 даёт 18 программ в 16 и 17.</>,
    },
  ],
};

export default content;
