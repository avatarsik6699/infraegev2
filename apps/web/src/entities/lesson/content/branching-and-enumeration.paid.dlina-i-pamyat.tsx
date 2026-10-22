// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "ogranichenie-na-programmu",
      navLabel: "Ограничение на программу",
      explanation: (
        <>
          <Typography.Text>
            Дополнительный урок — для продвинутых: такие условия редки.
          </Typography.Text>
          <Typography.Text>
            Сколько программ переводят 2 в 12 командами «+1» и «×2» ровно за
            пять команд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если условие ограничивает программу целиком — длину, последнюю
              команду, число умножений, — одного текущего числа мало: в
              состояние добавляют то, что нужно помнить о прошлом.
            </strong>{" "}
            Из 6 в 12 за одну команду попасть можно, а за две — нельзя: «6, и
            осталась одна команда» и «6, и осталось две» — разные вопросы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadannaya-dlina",
      navLabel: "Заданная длина",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При заданной длине считают по паре «число, сколько команд
              осталось»; успех — когда команды кончились ровно в цели.
            </strong>{" "}
            Каждая команда уменьшает остаток на 1.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <LessonTable
                      label={"Из 2 в 12 ровно за пять команд"}
                      columns={[{ label: "Программа" }, { label: "Числа" }]}
                      rows={[
                        ["11112", "2 → 3 → 4 → 5 → 6 → 12"],
                        ["21211", "2 → 4 → 5 → 10 → 11 → 12"],
                      ]}
                    />
                    <Typography.Text>
                      Других пятикомандных программ нет: короткие, например 121
                      (2 → 3 → 6 → 12), условию не подходят.
                    </Typography.Text>
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Третий аргумент left — сколько команд осталось.{" "}
                      <PythonTerm term="cache">@cache</PythonTerm> запоминает
                      ответы для пар, чтобы не считать их повторно:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from functools import cache\n\n\n@cache\ndef f(x, y, left):\n    if left == 0:\n        return 1 if x == y else 0\n    if x >= y:\n        return 0\n    return f(x + 1, y, left - 1) + f(x * 2, y, left - 1)\n\n\nprint(f(2, 12, 5))"
                      }
                      label={"Ровно пять команд"}
                      language="python"
                      output={"2"}
                    />
                    <Typography.Text>
                      <Notation>{"1 if x == y else 0"}</Notation> — короткий
                      выбор: 1, если x равен y, иначе 0.
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: цель раньше срока">
            <Typography.Text>
              Если цель достигнута, а команды ещё остались, ветка безуспешна:
              «+1» и «×2» только увеличивают число, и вернуться к цели нельзя.
              Поэтому <Notation>{"x >= y"}</Notation> даёт 0. Если команды могут
              уменьшать число, так отсекать нельзя.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "dlina-po-uchastkam",
      navLabel: "Длина по участкам",
      explanation: (
        <>
          <Typography.Text>
            А если из 2 в 12 нужно пройти через 6 ровно за пять команд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              При общей длине участки зависят друг от друга: перебирают, сколько
              команд уходит на первый участок, и складывают произведения.
            </strong>{" "}
            Обычное произведение 3 · 2 = 6 посчитало бы программы любой длины.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Из 2 в 6 можно за 2, 3 или 4 команды — по одной программе.
                    Из 6 в 12 — только за одну команду. Сумма 5 команд выходит
                    лишь при 4 + 1: ответ 1 · 1 = 1, программа 11112.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "from functools import cache\n\n\n@cache\ndef f(x, y, left):\n    if left == 0:\n        return 1 if x == y else 0\n    if x >= y:\n        return 0\n    return f(x + 1, y, left - 1) + f(x * 2, y, left - 1)\n\n\nprint(sum(f(2, 6, k) * f(6, 12, 5 - k) for k in range(6)))"
                    }
                    label={"Через 6 ровно за пять команд"}
                    language="python"
                    output={"1"}
                  />
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "sostoyanie",
      navLabel: "Состояние",
      explanation: (
        <>
          <Typography.Text>
            Что ещё, кроме числа, бывает нужно помнить?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Состояние — всё, что нужно знать о прошлом, чтобы считать будущее.
            </strong>{" "}
            Ограничение на одно число проверяют по самому числу; ограничение на
            программу целиком добавляет в состояние ещё одну величину.
          </Typography.Text>
          <LessonTable
            label={"Что хранить в состоянии"}
            columns={[{ label: "Условие" }, { label: "Состояние" }]}
            rows={[
              ["обычное, запрет числа 9", "число"],
              ["ровно L команд", "число и сколько команд осталось"],
              ["умножение ровно один раз", "число и было ли умножение"],
              ["нельзя повторять команду подряд", "число и последняя команда"],
            ]}
          />
        </>
      ),
    },
    {
      id: "vozvraty",
      navLabel: "Возвраты",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «−1». Сколько программ переводят 2 в 4?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если число может вернуться туда, где уже было, программ бесконечно
              много — пока условие не ограничит длину или числа.
            </strong>{" "}
            Перед 2 → 3 → 4 можно пройти круг 2 → 3 → 2 один раз, два, сколько
            угодно: все эти программы разные.
          </Typography.Text>
          <Typography.Text>
            Поэтому в таких задачах всегда есть рамка: ровно L команд или числа
            в заданных пределах. Её и переносят в функцию — отсечение «x
            {" > "}y» здесь не годится, а @cache не спасает от бесконечной
            рекурсии: ответ запоминается, только когда вызов уже завершился.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapret-povtora-podryad",
      navLabel: "Запрет повтора подряд",
      explanation: (
        <>
          <Typography.Text>
            Команды «+1» и «×2». Сколько программ переводят 2 в 20, если нельзя
            умножать дважды подряд?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Запрет повтора подряд хранят в состоянии как последнюю команду.
            </strong>{" "}
            Из 8, полученного умножением, умножать нельзя, а из 8, полученного
            прибавлением, — можно.
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n\n@cache\ndef g(x, y, last):\n    if x > y:\n        return 0\n    if x == y:\n        return 1\n    result = g(x + 1, y, 1)\n    if last != 2:\n        result += g(x * 2, y, 2)\n    return result\n\n\nprint(g(2, 20, 0))"
            }
            label={"Без двух умножений подряд"}
            language="python"
            output={"22"}
          />
          <Typography.Text>
            В начале последней команды нет — передаём 0. Без запрета программ
            было бы 30.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skolko-chisel",
      navLabel: "Сколько чисел",
      explanation: (
        <>
          <Typography.Text>
            Из 1 командами «+1» и «×2» выполняют не больше четырёх команд. Какое
            наименьшее число получить нельзя?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Вопрос «сколько чисел» — не «сколько программ»: одинаковые числа
              считают один раз.
            </strong>{" "}
            Поэтому хранят не счётчик, а{" "}
            <PythonTerm term="set">множество</PythonTerm> чисел, полученных за
            0, 1, 2, 3 и 4 команды:
          </Typography.Text>
          <CodeBlock
            code={
              "current = {1}\nreached = {1}\nfor step in range(4):\n    current = {y for x in current for y in (x + 1, x * 2)}\n    reached |= current\nprint(sorted(reached))\nprint(min(n for n in range(1, 100) if n not in reached))"
            }
            label={"Числа за четыре команды"}
            language="python"
            output={"[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16]\n11"}
          />
          <Typography.Text>
            Ответ 11. В подсчёте программ множество не годится: оно склеило бы
            разные программы с одинаковым результатом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dvizhenie-v-obe-storony",
      navLabel: "Движение в обе стороны",
      explanation: (
        <>
          <Typography.Text>
            Команды «+3» и «−2», старт 1, цель 6, ровно пять команд, число на
            экране всегда положительное. Сколько программ?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если команды двигают число в обе стороны, рамку задаёт условие —
              длина и пределы чисел, а не «число больше цели».
            </strong>{" "}
            Из 7 командой «−2» можно вернуться к 5, поэтому ветку выше цели не
            обрывают.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Нужно прибавить 5 за пять команд: если «+3» выполнено a раз,
                    «−2» — b раз, то 3a − 2b = 5 и a + b = 5, откуда a = 3, b =
                    2. Расстановок двух «−2» среди пяти мест — 10, но половина
                    уводит число в ноль или ниже: например, «−2» первой даёт −1.
                    Подходят 5.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "def f(x, left):\n    if x <= 0:\n        return 0\n    if left == 0:\n        return 1 if x == 6 else 0\n    return f(x + 3, left - 1) + f(x - 2, left - 1)\n\n\nprint(f(1, 5))"
                    }
                    label={"Вверх и вниз ровно за пять команд"}
                    language="python"
                    output={"5"}
                  />
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "pamyat-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Ровно L команд",
                note: <>число и сколько команд осталось</>,
              },
              {
                key: "Длина по участкам",
                note: <>сумма произведений по длине первого участка</>,
              },
              { key: "Не подряд", note: <>число и последняя команда</> },
              { key: "Сколько чисел", note: <>множество, а не счётчик</> },
              { key: "Возвраты", note: <>нужна рамка: длина или пределы</> },
              {
                key: "Обе стороны",
                note: <>не обрывать ветку выше цели</>,
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
          Сколько программ переводят 2 в 12 командами «+1» и «×2» ровно за
          четыре команды?
        </>
      ),
      reveal: (
        <>
          1: 2 → 4 → 5 → 6 → 12. Программа 2 → 3 → 6 → 12 короче — в ней три
          команды.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Что нужно хранить в состоянии, если нельзя умножать два раза подряд?
        </>
      ),
      reveal: <>Текущее число и последнюю выполненную команду.</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Чем вопрос «сколько чисел можно получить» отличается от «сколько
          программ»?
        </>
      ),
      reveal: (
        <>Одинаковые числа считают один раз — нужно множество, а не счётчик.</>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>Команды «+1» и «×2», старт 0, цель 1. Почему конечного ответа нет?</>
      ),
      reveal: <>0 · 2 = 0: умножать можно сколько угодно раз — 1, 21, 221, …</>,
    },
  ],
};

export default content;
