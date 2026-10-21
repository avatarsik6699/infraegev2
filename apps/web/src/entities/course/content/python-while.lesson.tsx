import { CodeBlock } from "~/shared/components/code-block";
import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonWhileLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-while.media";

export const pythonWhileLesson = defineCourseLesson({
  ...pythonWhileLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Писать цикл по условию и объяснять его по проверкам"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В модуле «Условия» сумма и наибольшее четырёх чисел потребовали
            четырёх имён и трёх <Notation>{"if"}</Notation>. Для тысячи чисел
            так не напишешь.{" "}
            <strong>
              Цикл повторяет одни и те же строки, пока выполняется условие, — и
              одна короткая программа обрабатывает сколько угодно данных
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Начнём с простого счёта, научимся накапливать сумму, снимать цифры
            числа и останавливать цикл досрочно, а в конце решим сквозную задачу
            для любого количества чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Цикл while",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"while"}</Notation> повторяет блок, пока условие
              истинно.
            </strong>{" "}
            Перед каждым повторением он проверяет условие. Если оно истинно,
            выполняется <strong>тело цикла</strong> — блок с отступом, — и
            проверка начинается заново. Как только условие ложно, выполнение
            переходит к строке после цикла. Нажми «Запуск» и посмотри, как
            выполнение возвращается к строке <Notation>{"while"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runCount}
            label={"while повторяет блок, пока условие истинно"}
          />
          <Typography.Text>
            Одно выполнение тела называют <strong>итерацией</strong>. После
            четвёртой итерации <Notation>{"i"}</Notation> равно 5, проверка{" "}
            <Notation>{"5 <= 4"}</Notation> ложна, и цикл заканчивается. Если
            условие ложно с самого начала — например, при{" "}
            <Notation>{"i = 10"}</Notation>, — тело не выполнится ни разу.
          </Typography.Text>
          <Typography.Text>
            Если забыть <Notation>{"i += 1"}</Notation>, условие будет истинным
            всегда — получится <strong>бесконечный цикл</strong>. Останови его
            красной кнопкой <KeyCombo keys={["Stop"]} /> в панели{" "}
            <KeyCombo keys={["Run"]} /> PyCharm или сочетанием{" "}
            <KeyCombo keys={["Ctrl", "C"]} /> в терминале.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Счётчик и накопитель",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Счётчик считает события, накопитель собирает результат.
            </strong>{" "}
            Найдём сумму чисел от 1 до 4. Нажми «Запуск» и пройди цикл по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runSum1To4}
            label={"Найдём сумму чисел от 1 до 4"}
          />
          <Typography.Text>
            <Notation>{"i"}</Notation> — следующее число, которое нужно
            прибавить. <Notation>{"total"}</Notation> собирает сумму уже
            обработанных чисел; такая переменная называется{" "}
            <strong>накопителем</strong>. Переменную, которая считает события,
            называют <strong>счётчиком</strong>. Вот значения при каждой
            проверке условия:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.loopChecks}
            caption={
              <>
                Перед каждой проверкой в <Notation>{"total"}</Notation> лежит
                сумма чисел до <Notation>{"i - 1"}</Notation>: 0, 1, 1 + 2, 1 +
                2 + 3, 1 + 2 + 3 + 4. Четыре проверки дают{" "}
                <Notation>{"True"}</Notation> и запускают тело, пятая —{" "}
                <Notation>{"False"}</Notation>, и цикл заканчивается.
              </>
            }
          />
          <Typography.Text>
            Сумма начинается с 0: прибавление нуля не меняет результат.
            Произведение начинают с 1: если начать с нуля, оно навсегда
            останется нулём.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Как цикл заканчивается",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Цикл должен на каждой итерации приближаться к выходу.
            </strong>{" "}
            В сумме чисел <Notation>{"i"}</Notation> растёт на 1 и неизбежно
            превысит 4 — значит, цикл закончится. Прежде чем запускать свой
            цикл, ответь на два вопроса: что хранит каждая переменная перед
            проверкой — это видно по ленте проверок выше, — и почему условие
            когда-нибудь станет ложным.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: инвариант цикла" kind="nuance">
            <Typography.Text>
              Утверждение, которое верно перед каждой проверкой условия,
              называют <strong>инвариантом цикла</strong>. Для суммы это «
              <Notation>{"total"}</Notation> равен сумме чисел от 1 до{" "}
              <Notation>{"i - 1"}</Notation>». Перед первой проверкой оно верно:{" "}
              <Notation>{"i = 1"}</Notation>, сумма пустого набора — 0. Тело
              прибавляет <Notation>{"i"}</Notation> и увеличивает{" "}
              <Notation>{"i"}</Notation>, поэтому утверждение сохраняется. Когда
              цикл останавливается при <Notation>{"i = 5"}</Notation>, сложены
              ровно числа от 1 до 4. Инвариант — не команда Python, а способ
              доказать, что цикл считает верно.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Цифры числа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Цифры числа снимают по одной справа: <Notation>{"% 10"}</Notation>{" "}
              берёт последнюю, <Notation>{"// 10"}</Notation> её отбрасывает.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "number = -5072\nn = abs(number)\ndigit_sum = 0\nwhile n > 0:\n    digit = n % 10\n    digit_sum += digit\n    n //= 10\nprint(digit_sum)"
            }
            label={"Цифры числа снимают по одной справа"}
            language="python"
            fileName="main.py"
            output={"14"}
          />
          <Typography.Text>
            Это тот же накопитель, только складываются цифры. Проследи{" "}
            <Notation>{"n"}</Notation> и сумму по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.digitsStepper5072}
            label={"Сумма цифр числа 5072 по шагам"}
          />
          <Typography.Text>
            Каждая итерация снимает последнюю цифру, и следующая видит соседнюю
            слева. <Notation>{"number"}</Notation> хранит исходное число, а{" "}
            <Notation>{"n"}</Notation> — рабочая копия, которую цикл уменьшает.
            Знак — не цифра, поэтому сначала берут модуль:{" "}
            <Notation>{"abs(-5072)"}</Notation> — 5072.
          </Typography.Text>
          <Typography.Text>
            Для числа 0 цикл не выполнится ни разу. Сумма цифр 0 при этом верна,
            а вот <strong>количество</strong> цифр получится 0, хотя в записи
            одна цифра. Ноль при подсчёте цифр обрабатывают отдельно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "break и continue",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"break"}</Notation> завершает цикл досрочно,{" "}
              <Notation>{"continue"}</Notation> пропускает остаток итерации.
            </strong>{" "}
            <Notation>{"break"}</Notation> сразу завершает цикл, в котором
            стоит. Это удобно, когда признак окончания становится известен
            внутри тела. Числа вводятся по одному, 0 — признак конца ввода:
          </Typography.Text>
          <CodeBlock
            code={
              "total = 0\nwhile True:\n    n = int(input())\n    if n == 0:\n        break\n    total += n\nprint(total)"
            }
            label={"break сразу завершает цикл, в котором стоит"}
            language="python"
            fileName="main.py"
            output={"⟪5⟫\n⟪7⟫\n⟪0⟫\n12"}
          />
          <Typography.Text>
            <Notation>{"while True"}</Notation> сам по себе бесконечен: условие
            всегда истинно, а выход задаёт <Notation>{"break"}</Notation>. 0
            здесь — только признак окончания, в сумму он не входит.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"continue"}</Notation> пропускает остаток тела и сразу
            переходит к следующей проверке условия. Сложим нечётные числа от 1
            до 5 — пройди по шагам и посмотри, как чётные{" "}
            <Notation>{"i"}</Notation> перескакивают{" "}
            <Notation>{"total += i"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runOdd}
            label={"continue пропускает остаток тела"}
          />
          <Typography.Text>
            Увеличение <Notation>{"i"}</Notation> стоит первым, до{" "}
            <Notation>{"continue"}</Notation>. Если поставить{" "}
            <Notation>{"i += 1"}</Notation> в конец тела, на первом же чётном
            числе <Notation>{"continue"}</Notation> перескочит его, и цикл
            никогда не закончится.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Первая степень",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Цикл может искать первое значение, которое достигло границы.
            </strong>{" "}
            Найдём наименьшее целое <Notation>{"k >= 0"}</Notation>, для
            которого <Notation>{"2 ** k >= n"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 17\nk = 0\npower = 1\nwhile power < n:\n    power *= 2\n    k += 1\nprint(k)"
            }
            label={"Наименьшее k, для которого 2 ** k >= n"}
            language="python"
            fileName="main.py"
            output={"5"}
          />
          <Typography.Text>
            Перед каждой проверкой <Notation>{"power"}</Notation> — это 2 в
            степени <Notation>{"k"}</Notation>. Цикл прекращается при первом
            достижении границы: 2⁴ = 16 ещё меньше 17, а 2⁵ = 32 уже нет. Для{" "}
            <Notation>{"n = 1"}</Notation> ответ 0 получается без единой
            итерации.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s7",
      navLabel: "Сквозная задача",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сквозная задача курса: цикл заменяет повторяющиеся{" "}
              <Notation>{"if"}</Notation>.
            </strong>{" "}
            В уроке о ветвлении сумма и наибольшее из 5, −2, 10, 7 потребовали
            четырёх имён и трёх <Notation>{"if"}</Notation>. С{" "}
            <Notation>{"while"}</Notation> числа можно вводить по одному до
            признака окончания 0, и программа не зависит от их количества:
          </Typography.Text>
          <CodeBlock
            code={
              "n = int(input())\ntotal = 0\nbest = n\nwhile n != 0:\n    total += n\n    if n > best:\n        best = n\n    n = int(input())\nprint(total, best)"
            }
            label={"Сумма и наибольшее для любого количества чисел"}
            language="python"
            fileName="main.py"
            output={"⟪5⟫\n⟪-2⟫\n⟪10⟫\n⟪7⟫\n⟪0⟫\n20 10"}
          />
          <Typography.Text>
            Первое число читается до цикла: с него начинается{" "}
            <Notation>{"best"}</Notation>, как в уроке о ветвлении, и его же
            проверяет условие <Notation>{"n != 0"}</Notation>. Каждое следующее
            число читается в конце тела — чтобы проверка увидела его до того,
            как оно попадёт в сумму. <Notation>{"total"}</Notation> —
            накопитель, а три <Notation>{"if"}</Notation> прошлого урока стали
            одним <Notation>{"if"}</Notation> внутри цикла.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Сколько раз выполнится тело цикла{" "}
            <Notation>{"while i < 5:"}</Notation>, если перед ним{" "}
            <Notation>{"i = 10"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Ни разу: первая же проверка <Notation>{"10 < 5"}</Notation> ложна.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>Что напечатает программа?</Typography.Text>
          <CodeBlock
            code={
              "i = 1\nproduct = 1\nwhile i <= 4:\n    product *= i\n    i += 1\nprint(product)"
            }
            label={"Произведение чисел от 1 до 4"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            24 = 1 · 2 · 3 · 4. Произведение начинается с 1: с нулём ответ был
            бы 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Почему цикл <Notation>{"while n != 0: n //= 10"}</Notation> никогда
            не закончится при <Notation>{"n = -15"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"-15 // 10"}</Notation> даёт −2, затем −1, а{" "}
            <Notation>{"-1 // 10"}</Notation> снова −1: ноль не достигается.
            Поэтому сначала берут модуль.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>Чем опасен такой цикл?</Typography.Text>
          <CodeBlock
            code={
              "i = 0\nwhile i < 5:\n    if i == 2:\n        continue\n    i += 1"
            }
            label={"Цикл с continue перед увеличением"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            При <Notation>{"i == 2"}</Notation>{" "}
            <Notation>{"continue"}</Notation> перескакивает{" "}
            <Notation>{"i += 1"}</Notation>: <Notation>{"i"}</Notation> навсегда
            остаётся 2, и цикл бесконечен.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Программа из урока складывает числа до признака 0 с{" "}
            <Notation>{"break"}</Notation>. Что она напечатает, если ввести 3,
            8, 0, 5?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            11: после 0 цикл закончен, и 5 программа уже не читает.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь программа умеет повторять действия, и её длина больше не зависит
        от количества данных. Вот что из урока понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"while"}</Notation>,
            note: (
              <>
                Проверяет условие перед каждой итерацией; ложное сразу условие —
                ни одной итерации.
              </>
            ),
          },
          {
            key: "Накопитель и счётчик",
            note: <>Сумму и счётчик начинают с 0, произведение — с 1.</>,
          },
          {
            key: "Выход из цикла",
            note: (
              <>
                Каждая итерация должна приближать условие к ложному; иначе —
                бесконечный цикл (<KeyCombo keys={["Stop"]} /> в PyCharm,{" "}
                <KeyCombo keys={["Ctrl", "C"]} /> в терминале).
              </>
            ),
          },
          {
            key: "Цифры числа",
            note: (
              <>
                <Notation>{"n % 10"}</Notation> — последняя цифра,{" "}
                <Notation>{"n //= 10"}</Notation> отбрасывает её; сначала{" "}
                <Notation>{"abs"}</Notation>, ноль — отдельно.
              </>
            ),
          },
          {
            key: <Notation>{"break"}</Notation>,
            note: <>Сразу завершает цикл, в котором стоит.</>,
          },
          {
            key: <Notation>{"continue"}</Notation>,
            note: (
              <>
                Пропускает остаток тела; изменение переменной условия ставят до
                него.
              </>
            ),
          },
          {
            key: "Признак окончания",
            note: (
              <>
                Первое число читают до цикла, следующее — в конце тела; признак
                (0) в результат не входит.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
