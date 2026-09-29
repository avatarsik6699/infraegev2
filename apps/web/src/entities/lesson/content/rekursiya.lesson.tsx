import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { defineLesson } from "../lib/define-lesson";
import { rekursiyaLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { PythonCourseLessonLink } from "./python-course-lesson-link";

export const rekursiyaLesson = defineLesson({
  ...rekursiyaLessonPublication,
  learningOutcomes: [
    "Находить значения рекуррентно заданной функции, поднимаясь от базового случая и выбирая нужную ветвь по условию",
    "Отличать функции с одним, двумя и более предыдущими значениями, с шагом не на 1, с рекурсией «вверх» и с двумя связанными функциями",
    "Объяснять, откуда берутся ограничение глубины и повторные вычисления, и как с ними справляются кеш, прогрев кеша, лимит рекурсии и цикл",
    "Записывать условие задания 16 в виде короткой программы на Python с @lru_cache(None) и проверять её на малых значениях",
    "Считать, для скольких аргументов выполняется условие, и находить значения при огромных аргументах",
    "Сокращать отношение и разность значений функции, объясняя, когда сокращение не работает, и проверять ответ вторым способом",
  ],
  accessTier: "free",
  theory: [
    {
      id: "concrete-computation",
      navLabel: "Вычисляем F(5) по правилу",
      explanation: (
        <>
          <Typography.Text>
            Последовательность чисел не обязательно перечислять целиком. Можно
            задать первое значение и правило, по которому из уже известного
            получается следующее. Такую запись называют рекуррентным
            определением. Здесь <Notation kind="formula">F(n)</Notation> —
            значение с номером <Notation kind="formula">n</Notation>.
          </Typography.Text>
          <Typography.Text>
            Пусть первое значение равно{" "}
            <Notation kind="formula">F(1) = 1</Notation>, а каждое следующее
            получается по правилу{" "}
            <Notation kind="formula">F(n) = 2·F(n − 1) + 1</Notation> при{" "}
            <Notation kind="formula">n &gt; 1</Notation>. Формула сама по себе
            ничего не считает — чтобы найти{" "}
            <Notation kind="formula">F(n)</Notation>, сначала нужно знать{" "}
            <Notation kind="formula">F(n − 1)</Notation>. Найдём{" "}
            <Notation kind="formula">F(5)</Notation>, поднимаясь от того, что
            уже известно.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(5)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(1) = 1</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>2·F(n − 1) + 1</span>
                </Notation>
              </span>
            </>
          }
          prompt={
            <>
              Каждое следующее значение выражается через предыдущее — начнём с
              того, что уже дано, и будем подниматься вверх.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">F(1) = 1</Notation> — это значение дано,
              вычислять его не нужно.
            </>,
            <>
              <Notation kind="formula">
                F(2) = 2·F(1) + 1 = 2·1 + 1 = 3
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">
                F(3) = 2·F(2) + 1 = 2·3 + 1 = 7
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">
                F(4) = 2·F(3) + 1 = 2·7 + 1 = 15
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">
                F(5) = 2·F(4) + 1 = 2·15 + 1 = 31
              </Notation>
              .
            </>,
          ]}
        />
      ),
    },
    {
      id: "base-case-and-step",
      navLabel: "Зачем нужны база и шаг",
      explanation: (
        <>
          <Typography.Text>
            В первом примере мы использовали две части определения. Первая —
            начальное значение, от которого можно начать вычисления. Его
            называют базовым случаем:{" "}
            <Notation kind="formula">F(1) = 1</Notation> просто дано, вычислять
            его не нужно. Вторая часть — правило перехода:{" "}
            <Notation kind="formula">F(n) = 2·F(n − 1) + 1</Notation> при{" "}
            <Notation kind="formula">n &gt; 1</Notation>, которое показывает,
            как получить следующее значение из предыдущего.
          </Typography.Text>
          <Typography.Text>
            Работает это как ряд костяшек домино:{" "}
            <Notation kind="formula">F(1)</Notation> — костяшка, которую
            толкнули вручную, а правило перехода — то, что заставляет каждую
            следующую костяшку падать от предыдущей. Без первого толчка (без
            базового случая) ни одна костяшка не упадёт, и цепочка{" "}
            <Notation kind="formula">F(5) → F(4) → F(3) → …</Notation> никогда
            не остановится.
          </Typography.Text>
          <Typography.Text>
            Похоже на логический круг: чтобы найти{" "}
            <Notation kind="formula">F(5)</Notation>, нужно знать{" "}
            <Notation kind="formula">F(4)</Notation>, и так далее. Круга нет,
            потому что каждое значение опирается только на уже найденное: из{" "}
            <Notation kind="formula">F(1)</Notation> однозначно получается{" "}
            <Notation kind="formula">F(2)</Notation>, из него —{" "}
            <Notation kind="formula">F(3)</Notation>, и так для любого{" "}
            <Notation kind="formula">n</Notation>. Это тот же принцип, что у
            математической индукции: база плюс шаг, работающий для каждого{" "}
            <Notation kind="formula">n</Notation>. Важно, чтобы аргумент на
            каждом шаге приближался к базе — тогда цепочка обязательно
            закончится.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "code-and-call-stack",
      navLabel: "Рекурсивная функция и стек вызовов",
      explanation: (
        <>
          <Typography.Text>
            Пока мы поднимались от базового значения вручную. Ту же цепочку
            можно поручить Python. Функцию, которая во время вычисления вызывает
            саму себя, называют рекурсивной. Как устроены аргументы и{" "}
            <Notation>return</Notation>, разобрано в уроке курса{" "}
            <PythonCourseLessonLink lessonSlug="funktsii">
              «Функции»
            </PythonCourseLessonLink>
            , а как вызовы уходят вглубь и возвращаются — в уроке{" "}
            <PythonCourseLessonLink lessonSlug="rekursiya">
              «Рекурсия»
            </PythonCourseLessonLink>
            .
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    if n == 1:\n        return 1  # Базовый случай: значение уже известно\n    return 2 * F(n - 1) + 1  # Шаг: сначала находим F(n - 1)\n\nprint(F(5))`}
            label="Рекурсивная функция F"
            language="python"
          />
          <Typography.Text>
            Чтобы увидеть, что происходит при вызове{" "}
            <Notation kind="formula">F(4)</Notation>, добавим печать до и после
            рекурсивного вызова:
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    print("вызов", n)\n    if n == 1:\n        print("база", n)\n        return 1\n    result = 2 * F(n - 1) + 1\n    print("возврат", n, "->", result)\n    return result\n\nF(4)`}
            label="Функция F с печатью вызовов"
            language="python"
          />
          <CodeBlock
            code={`вызов 4\nвызов 3\nвызов 2\nвызов 1\nбаза 1\nвозврат 2 -> 3\nвозврат 3 -> 7\nвозврат 4 -> 15`}
            label="Что напечатает программа"
            language="text"
          />
          <Typography.Text>
            Сначала вызовы уходят вглубь — <Notation kind="formula">4</Notation>
            , <Notation kind="formula">3</Notation>,{" "}
            <Notation kind="formula">2</Notation>,{" "}
            <Notation kind="formula">1</Notation> — пока не будет достигнут
            базовый случай. Пока это не произошло, каждый вызов приостановлен и
            ждёт результата вложенного вызова: Python хранит такие ожидающие
            вызовы в стеке вызовов. После базы значения возвращаются в обратном
            порядке — <Notation kind="formula">2</Notation>,{" "}
            <Notation kind="formula">3</Notation>,{" "}
            <Notation kind="formula">4</Notation> — и каждый вызов завершается,
            получив нужное число. В строке{" "}
            <Notation>result = 2 * F(n - 1) + 1</Notation> выражение{" "}
            <Notation>F(n - 1)</Notation> — уже не запись, а конкретное число,
            которое вернул вложенный вызов.
          </Typography.Text>
          <Typography.Text>
            У стека есть предел: по умолчанию Python допускает около 1000
            вложенных вызовов. Для функции{" "}
            <Notation kind="formula">F(n) = n·F(n − 1)</Notation> вызов{" "}
            <Notation kind="formula">F(2024)</Notation> — это цепочка из двух
            тысяч ожидающих вызовов, и она не помещается:
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\nprint(F(2024))  # RecursionError: превышена глубина рекурсии`}
            label="Цепочка длиннее лимита"
            language="python"
          />
          <Typography.Text>
            Один из способов — поднять лимит на длину цепочки с небольшим
            запасом:
          </Typography.Text>
          <CodeBlock
            code={`import sys\n\nsys.setrecursionlimit(5000)  # Глубина цепочки 2024, лимит чуть больше\n\ndef F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\nprint(F(2024) // F(2022))  # 4094552`}
            label="Поднимаем лимит рекурсии"
            language="python"
          />
          <Typography.Text>
            Это только один инструмент из нескольких. Следующие разделы
            показывают другие способы — цикл, кеш, прогрев кеша — и объясняют,
            когда какой выбирать.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Достаточно поставить{" "}
              <Notation>sys.setrecursionlimit(10**9)</Notation> — и рекурсия
              справится с любым <Notation kind="formula">n</Notation>.
            </>
          }
          explanation={
            <>
              Лимит — это защита, а не ресурс. Каждый ожидающий вызов занимает
              память, и при очень глубокой цепочке программа может завершиться
              аварийно ещё до того, как упрётся в лимит. Поэтому лимит поднимают
              ненамного выше реальной длины цепочки, а если цепочка очень
              длинная, выбирают способ, который не копит вызовы: цикл или
              прогрев кеша (разделы ниже).
            </>
          }
        />
      ),
    },
    {
      id: "loop-instead-of-recursion",
      navLabel: "Цикл: одно значение вместо стека",
      explanation: (
        <>
          <Typography.Text>
            Когда каждое значение зависит только от предыдущего, стек не нужен
            вовсе: в каждый момент достаточно помнить последнее найденное
            значение. Цикл перезаписывает одну переменную и не откладывает
            вызовы:
          </Typography.Text>
          <CodeBlock
            code={`f = 1  # Начинаем с известного F(1)\n\nfor n in range(2, 2025):\n    f = n * f  # Новое значение заменяет предыдущее\n\nprint(f)`}
            label="Цикл вместо цепочки вызовов"
            language="python"
          />
          <Typography.Text>
            Общий шаблон для функции с одним предыдущим значением:
          </Typography.Text>
          <CodeBlock
            code={`f = base_value\n\nfor n in range(first_n, target + 1):\n    f = ...  # Формула через предыдущее значение f\n\nprint(f)`}
            label="Шаблон: одно предыдущее значение"
            language="python"
          />
          <Typography.Text>
            Цикл — не «более правильный» способ, а другой инструмент. Он хорошо
            подходит для линейной цепочки, где шаг всегда «предыдущее значение →
            следующее». Если аргумент перепрыгивает (
            <Notation kind="formula">n / 2</Notation>,{" "}
            <Notation kind="formula">n + 4</Notation>) или значение зависит от
            условия, цепочку проще записать рекурсией — так мы и будем делать
            дальше.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(5)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(1) = 2</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>3·F(n − 1) − 1</span>
                </Notation>
              </span>
            </>
          }
          prompt={
            <>
              Проследим, что хранит переменная <Notation>f</Notation> после
              каждого шага цикла — так проверяют цикл на малых значениях.
            </>
          }
          steps={[
            <>
              Перед циклом <Notation>f = 2</Notation> — это{" "}
              <Notation kind="formula">F(1)</Notation>.
            </>,
            <>
              <Notation>n = 2</Notation>:{" "}
              <Notation kind="formula">f = 3·2 − 1 = 5</Notation>.
            </>,
            <>
              <Notation>n = 3</Notation>:{" "}
              <Notation kind="formula">f = 3·5 − 1 = 14</Notation>.
            </>,
            <>
              <Notation>n = 4</Notation>:{" "}
              <Notation kind="formula">f = 3·14 − 1 = 41</Notation>.
            </>,
            <>
              <Notation>n = 5</Notation>:{" "}
              <Notation kind="formula">f = 3·41 − 1 = 122</Notation> — это и
              есть <Notation kind="formula">F(5)</Notation>.
            </>,
          ]}
        >
          <CodeBlock
            code={`f = 2\n\nfor n in range(2, 6):  # 6: граница range не включается\n    f = 3 * f - 1\n\nprint(f)  # 122`}
            label="Тот же расчёт циклом"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              В <Notation>range(первое_n, последнее_n + 1)</Notation> неважно,
              какую именно верхнюю границу писать — Python сам разберётся.
            </>
          }
          explanation={
            <>
              <Notation>range(a, b)</Notation> не включает{" "}
              <Notation kind="formula">b</Notation>. Чтобы дойти до значения{" "}
              <Notation kind="formula">F(target)</Notation> включительно,
              верхнюю границу нужно писать как{" "}
              <Notation kind="formula">target + 1</Notation> — иначе последний
              нужный шаг цикла просто не выполнится. Эта же граница понадобится
              снова, когда мы будем перебирать аргументы.
            </>
          }
        />
      ),
    },
    {
      id: "several-previous-values",
      navLabel: "Когда нужны два предыдущих значения",
      explanation: (
        <>
          <Typography.Text>
            До сих пор для нового значения хватало одного предыдущего. Но иногда
            формула зависит сразу от двух:{" "}
            <Notation kind="formula">F(n) = F(n − 1) + F(n − 2)</Notation>.
            Тогда одного базового значения недостаточно — уже для{" "}
            <Notation kind="formula">F(3)</Notation> нужны сразу{" "}
            <Notation kind="formula">F(2)</Notation> и{" "}
            <Notation kind="formula">F(1)</Notation>, поэтому определение
            обязано задать оба сразу:{" "}
            <Notation kind="formula">F(1) = 2</Notation>,{" "}
            <Notation kind="formula">F(2) = 3</Notation>.
          </Typography.Text>
          <Typography.Text>
            Самый известный пример — числа Фибоначчи:{" "}
            <Notation kind="formula">F(1) = F(2) = 1</Notation> и{" "}
            <Notation kind="formula">F(n) = F(n − 1) + F(n − 2)</Notation>, то
            есть 1, 1, 2, 3, 5, 8, … Если формула берёт три предыдущих значения,
            нужно три базовых. Например, при{" "}
            <Notation kind="formula">1, 1, 2</Notation> и сумме трёх предыдущих
            получается 1, 1, 2, 4, 7, 13, 24 — это числа трибоначчи. В задачах
            базовые значения могут быть другими: их всегда берут из условия, а
            не из памяти о «стандартной» последовательности.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(6)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(1) = 2</Notation>,{" "}
                <Notation kind="formula">F(2) = 3</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n − 1)</span>{" "}
                  <span data-formula-term>+ F(n − 2)</span>
                </Notation>
              </span>
            </>
          }
          prompt={
            <>
              Как и раньше, поднимаемся от известных значений вверх — только
              теперь на каждом шаге нужно держать в уме два последних числа, а
              не одно.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">F(3) = F(2) + F(1) = 3 + 2 = 5</Notation>
              .
            </>,
            <>
              <Notation kind="formula">F(4) = F(3) + F(2) = 5 + 3 = 8</Notation>
              .
            </>,
            <>
              <Notation kind="formula">
                F(5) = F(4) + F(3) = 8 + 5 = 13
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">
                F(6) = F(5) + F(4) = 13 + 8 = 21
              </Notation>
              .
            </>,
          ]}
        />
      ),
      mistake: (
        <Mistake
          claim={
            <>
              В формуле{" "}
              <Notation kind="formula">F(n) = 3·F(n − 1) − 2·F(n − 2)</Notation>{" "}
              коэффициенты можно переставить местами — какая разница, у какого
              слагаемого какой множитель.
            </>
          }
          explanation={
            <>
              Разница есть: коэффициент <Notation kind="formula">3</Notation>{" "}
              обязательно стоит при ближайшем предыдущем значении{" "}
              <Notation kind="formula">F(n − 1)</Notation>, а{" "}
              <Notation kind="formula">−2</Notation> — при значении через одно,{" "}
              <Notation kind="formula">F(n − 2)</Notation>. Перестановка
              коэффициентов даёт другую последовательность чисел, даже если
              формула выглядит похоже.
            </>
          }
        />
      ),
    },
    {
      id: "repeated-work-motivates-storage",
      navLabel: "Повторные вызовы и кеш",
      explanation: (
        <>
          <Typography.Text>
            Для зависимости от одного значения главной опасностью была глубина
            стека. У рекурсивной функции с двумя предыдущими значениями
            появляется другая проблема. Возьмём числа Фибоначчи и запишем их
            рекурсивно:
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    if n <= 2:\n        return 1\n    return F(n - 1) + F(n - 2)`}
            label="Рекурсия с двумя предыдущими значениями"
            language="python"
          />
          <Typography.Text>
            Нарисуем, какие вызовы порождает{" "}
            <Notation kind="formula">F(5)</Notation>:
          </Typography.Text>
          <CodeBlock
            code={`F(5)\n├─ F(4)\n│  ├─ F(3)\n│  │  ├─ F(2)\n│  │  └─ F(1)\n│  └─ F(2)\n└─ F(3)\n   ├─ F(2)\n   └─ F(1)`}
            label="Дерево вызовов для F(5)"
            language="text"
          />
          <Typography.Text>
            <Notation kind="formula">F(3)</Notation> вычисляется дважды, а{" "}
            <Notation kind="formula">F(2)</Notation> — трижды: одно и то же
            значение считается заново, хотя уже было найдено. Измерим, насколько
            это плохо. Будем считать, сколько раз вычисляется{" "}
            <Notation kind="formula">F(3)</Notation>:
          </Typography.Text>
          <CodeBlock
            code={`count = 0\n\ndef F(n):\n    global count\n    if n == 3:\n        count += 1  # Считаем повторы F(3)\n    if n <= 2:\n        return 1\n    return F(n - 1) + F(n - 2)\n\nfor n in (10, 15, 20, 25):\n    count = 0\n    F(n)\n    print(n, count)`}
            label="Считаем повторы F(3)"
            language="python"
          />
          <CodeBlock
            code={`10 21\n15 233\n20 2584\n25 28657`}
            label="Результат измерения"
            language="text"
          />
          <Typography.Text>
            Число повторов растёт так же быстро, как сами числа Фибоначчи. Для{" "}
            <Notation kind="formula">F(40)</Notation> такая программа делает
            больше двухсот миллионов вызовов — работа занимает минуты, хотя
            ответ можно получить за сорок шагов. Идея исправления очевидна: один
            раз вычислить значение и запомнить его. Это называют кешированием, а
            в Python его берёт на себя декоратор <Notation>lru_cache</Notation>{" "}
            из модуля <Notation>functools</Notation> — отметка перед функцией:
          </Typography.Text>
          <CodeBlock
            code={`from functools import lru_cache\n\n@lru_cache(None)\ndef F(n):\n    if n <= 2:\n        return 1\n    return F(n - 1) + F(n - 2)\n\nprint(F(40))  # 102334155 — мгновенно`}
            label="Кеш запоминает уже найденные значения"
            language="python"
          />
          <Typography.Text>
            Теперь каждое значение вычисляется один раз, а при повторном
            обращении берётся из памяти. Аргумент <Notation>None</Notation> —
            «не ограничивать размер кеша». Если написать{" "}
            <Notation>@lru_cache()</Notation> без аргумента, Python по умолчанию
            запомнит лишь 128 последних значений, а более старые забудет, и
            часть работы снова будет повторяться. (Начиная с Python 3.9 есть
            краткая запись <Notation>@cache</Notation> — то же самое, что{" "}
            <Notation>lru_cache(None)</Notation>; запись с{" "}
            <Notation>None</Notation> работает везде.)
          </Typography.Text>
          <Typography.Text>
            Есть и способы обойтись без кеша. Можно хранить значения в списке,
            где индекс — это аргумент:
          </Typography.Text>
          <CodeBlock
            code={`target = 6\nF = [0] * (target + 1)\n\n# Два базовых значения нужны до первого шага\nF[1] = 2\nF[2] = 3\n\nfor n in range(3, target + 1):\n    F[n] = F[n - 1] + F[n - 2]  # Сохраняем один раз\n\nprint(F[target])`}
            label="Список вместо повторного пересчёта"
            language="python"
          />
          <Typography.Text>
            А для следующего значения нужны только два последних, поэтому хватит
            двух переменных:
          </Typography.Text>
          <CodeBlock
            code={`f_prev2, f_prev1 = 2, 3\n\nfor n in range(3, 7):\n    # Правая часть использует оба старых значения до присваивания\n    f_prev2, f_prev1 = f_prev1, f_prev1 + f_prev2\n\nprint(f_prev1)`}
            label="Две переменные вместо списка"
            language="python"
          />
        </>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Чтобы сдвинуть два хранимых значения на шаг вперёд, можно просто
              присвоить <Notation>f_prev2 = f_prev1</Notation>, а потом{" "}
              <Notation>f_prev1 = f_prev1 + f_prev2</Notation> — порядок не
              важен.
            </>
          }
          explanation={
            <>
              Порядок важен: после первой строки <Notation>f_prev2</Notation>{" "}
              уже стало равно старому <Notation>f_prev1</Notation>, поэтому
              вторая строка складывает <Notation>f_prev1</Notation> само с
              собой, а не с настоящим предыдущим значением. Сначала нужно
              вычислить новое значение в отдельную переменную и только потом
              обновить обе хранимых:{" "}
              <Notation>
                f_current = f_prev1 + f_prev2; f_prev2 = f_prev1; f_prev1 =
                f_current
              </Notation>
              .
            </>
          }
        />
      ),
    },
    {
      id: "argument-steps",
      navLabel: "Шаг не на 1: деление аргумента",
      explanation: (
        <>
          <Typography.Text>
            До сих пор аргумент уменьшался на 1 или на 2. В заданиях часто
            встречается другой шаг: аргумент делится, например на 10 или на 2.
            Тогда даже огромное число, вроде{" "}
            <Notation kind="formula">10³⁰</Notation>, доходит до базового случая
            за несколько десятков вызовов. Для такой записи нужны две операции.
            Оператор <Notation>//</Notation> — деление нацело, оператор{" "}
            <Notation>%</Notation> — остаток. Для{" "}
            <Notation kind="formula">472</Notation>:{" "}
            <Notation>472 // 10</Notation> равно{" "}
            <Notation kind="formula">47</Notation> (число без последней цифры),
            а <Notation>472 % 10</Notation> равно{" "}
            <Notation kind="formula">2</Notation> (последняя цифра).
          </Typography.Text>
          <Typography.Text>
            Пусть <Notation kind="formula">F(n) = n</Notation> при{" "}
            <Notation kind="formula">n &lt; 10</Notation>, а при{" "}
            <Notation kind="formula">n ≥ 10</Notation> значение равно{" "}
            <Notation kind="formula">n%10 + 2·F(n//10)</Notation>: последняя
            цифра плюс удвоенное значение для числа без неё.
          </Typography.Text>
          <CodeBlock
            code={`from functools import lru_cache\n\n@lru_cache(None)\ndef F(n):\n    if n < 10:\n        return n\n    return n % 10 + 2 * F(n // 10)\n\nprint(F(472))       # 32\nprint(F(10 ** 30))  # 1073741824`}
            label="Аргумент делится на 10"
            language="python"
          />
          <Typography.Text>
            Цепочка для <Notation kind="formula">10³⁰</Notation> — это всего 31
            вызов, поэтому ни цикл «от 1 до n», ни увеличение лимита здесь не
            нужны: аргумент уменьшается в десять раз на каждом шаге.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(472)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(n) = n</Notation> при{" "}
                <Notation kind="formula">n &lt; 10</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>n%10 + 2·F(n//10)</span>
                </Notation>{" "}
                при <Notation kind="formula">n ≥ 10</Notation>
              </span>
            </>
          }
          prompt={
            <>
              Сначала спускаемся к базовому случаю, отрезая по одной цифре, а
              затем поднимаемся и подставляем найденные значения.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">472 ≥ 10</Notation>, поэтому{" "}
              <Notation kind="formula">
                F(472) = 472%10 + 2·F(47) = 2 + 2·F(47)
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">47 ≥ 10</Notation>:{" "}
              <Notation kind="formula">F(47) = 7 + 2·F(4)</Notation>.
            </>,
            <>
              <Notation kind="formula">4 &lt; 10</Notation> — базовый случай:{" "}
              <Notation kind="formula">F(4) = 4</Notation>.
            </>,
            <>
              Поднимаемся:{" "}
              <Notation kind="formula">F(47) = 7 + 2·4 = 15</Notation>, затем{" "}
              <Notation kind="formula">F(472) = 2 + 2·15 = 32</Notation>.
            </>,
          ]}
        />
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Вместо <Notation>n // 10</Notation> можно писать{" "}
              <Notation>n / 10</Notation> — в Python это одно и то же, разница
              только в записи.
            </>
          }
          explanation={
            <>
              Это разные операции. Обычное деление <Notation>/</Notation> всегда
              возвращает дробное число: <Notation>472 / 10</Notation> даёт{" "}
              <Notation kind="formula">47.2</Notation>, а даже{" "}
              <Notation>9 / 3</Notation> —{" "}
              <Notation kind="formula">3.0</Notation>. Для огромных чисел хуже:{" "}
              <Notation>10 ** 30 / 10</Notation> — это уже приближённое{" "}
              <Notation kind="formula">1e+29</Notation>, и часть цифр потеряна.
              Если в задании аргумент должен остаться целым, берут{" "}
              <Notation>//</Notation>.
            </>
          }
        />
      ),
    },
    {
      id: "branching-conditions",
      navLabel: "Разные правила для чётных и нечётных",
      explanation: (
        <>
          <Typography.Text>
            В заданиях формула часто зависит от условия на аргумент: свои
            правила для чётных и нечётных <Notation kind="formula">n</Notation>,
            для разных диапазонов. Тогда функция состоит из нескольких веток, и
            для каждого <Notation kind="formula">n</Notation> нужно сначала
            выбрать подходящую. Условие «чётное» записывают как{" "}
            <Notation>n % 2 == 0</Notation>: остаток от деления на 2 равен нулю.
          </Typography.Text>
          <Typography.Text>
            Рассмотрим функцию: <Notation kind="formula">F(1) = 1</Notation>;{" "}
            <Notation kind="formula">F(n) = F(n/2) + 3</Notation>, если{" "}
            <Notation kind="formula">n &gt; 1</Notation> и{" "}
            <Notation kind="formula">n</Notation> чётно;{" "}
            <Notation kind="formula">F(n) = F(n − 1) + 1</Notation>, если{" "}
            <Notation kind="formula">n &gt; 1</Notation> и{" "}
            <Notation kind="formula">n</Notation> нечётно. Здесь при чётном{" "}
            <Notation kind="formula">n</Notation> значение{" "}
            <Notation kind="formula">n/2</Notation> — целое, поэтому в программе
            пишут <Notation>n // 2</Notation>. Вручную такую цепочку удобнее
            разворачивать сверху вниз: записывать, какая ветка применяется на
            каждом шаге, а затем подниматься.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(21)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(1) = 1</Notation>,{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n/2) + 3</span>
                </Notation>{" "}
                при чётном <Notation kind="formula">n &gt; 1</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n − 1) + 1</span>
                </Notation>{" "}
                при нечётном <Notation kind="formula">n &gt; 1</Notation>
              </span>
            </>
          }
          prompt={
            <>
              На каждом шаге сначала определяем чётность аргумента и выбираем
              ветку. Так спускаемся до <Notation kind="formula">F(1)</Notation>,
              затем поднимаемся.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">21</Notation> нечётно:{" "}
              <Notation kind="formula">F(21) = F(20) + 1</Notation>.
            </>,
            <>
              <Notation kind="formula">20</Notation> чётно:{" "}
              <Notation kind="formula">F(20) = F(10) + 3</Notation>; затем{" "}
              <Notation kind="formula">10</Notation> чётно:{" "}
              <Notation kind="formula">F(10) = F(5) + 3</Notation>.
            </>,
            <>
              <Notation kind="formula">5</Notation> нечётно:{" "}
              <Notation kind="formula">F(5) = F(4) + 1</Notation>; затем{" "}
              <Notation kind="formula">4</Notation> чётно:{" "}
              <Notation kind="formula">F(4) = F(2) + 3</Notation>, а{" "}
              <Notation kind="formula">F(2) = F(1) + 3</Notation>.
            </>,
            <>
              <Notation kind="formula">F(1) = 1</Notation> — базовый случай.
              Поднимаемся:{" "}
              <Notation kind="formula">
                F(2) = 4, F(4) = 7, F(5) = 8, F(10) = 11, F(20) = 14
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">F(21) = F(20) + 1 = 15</Notation>.
            </>,
          ]}
        >
          <CodeBlock
            code={`from functools import lru_cache\n\n@lru_cache(None)\ndef F(n):\n    if n == 1:\n        return 1  # База проверяется первой\n    if n % 2 == 0:\n        return F(n // 2) + 3\n    return F(n - 1) + 1\n\nprint(F(21))  # 15 — совпало с ручным счётом`}
            label="Ветвление по чётности в программе"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Порядок проверок в <Notation>if</Notation> неважен: можно сначала
              разобрать чётность, а базовый случай <Notation>n == 1</Notation>{" "}
              проверить в конце.
            </>
          }
          explanation={
            <>
              Порядок важен. Число <Notation kind="formula">1</Notation>{" "}
              нечётно, поэтому оно попадёт в ветку{" "}
              <Notation kind="formula">F(0) + 1</Notation>, затем{" "}
              <Notation kind="formula">0</Notation> чётно и{" "}
              <Notation kind="formula">F(0)</Notation> вызовет{" "}
              <Notation kind="formula">F(0 // 2)</Notation> — то есть снова{" "}
              <Notation kind="formula">F(0)</Notation>, и цепочка никогда не
              достигнет базы. Базовые случаи проверяют первыми, а условия веток
              записывают в том порядке, как они даны в задаче.
            </>
          }
        />
      ),
    },
    {
      id: "upward-recursion-cache-warmup",
      navLabel: "Рекурсия «вверх» и прогрев кеша",
      explanation: (
        <>
          <Typography.Text>
            Иногда значение выражается не через меньшие аргументы, а через
            большие: <Notation kind="formula">F(n) = F(n + 4) + 2</Notation> при{" "}
            <Notation kind="formula">n &lt; 4200</Notation>, а база задана
            сверху — <Notation kind="formula">F(n) = 7</Notation> при{" "}
            <Notation kind="formula">n ≥ 4200</Notation>. Аргумент растёт до тех
            пор, пока не достигнет базы, поэтому цепочка идёт «вверх». Значит,
            считать «снизу вверх от <Notation kind="formula">F(1)</Notation>»
            здесь нельзя: считать нужно от базы вниз к запрошенному аргументу.
          </Typography.Text>
          <Typography.Text>
            Цепочка от <Notation kind="formula">F(100)</Notation> до базы —
            больше тысячи вызовов, и обычная рекурсия упрётся в лимит. Кеш здесь
            не спасает: пока не дошли до базы, ничего не посчитано и запоминать
            нечего. Выход — «прогреть кеш»: заранее вызвать функцию для
            подходящих аргументов в таком порядке, чтобы каждый вызов опирался
            на уже запомненное значение. Порядок выбирают против направления
            зависимости: раз <Notation kind="formula">F(n)</Notation> нуждается
            в <Notation kind="formula">F(n + 4)</Notation>, идём от больших{" "}
            <Notation kind="formula">n</Notation> к малым. Верхняя граница
            прогрева — первое значение, попадающее в базу. Если бы функция
            зависела от <Notation kind="formula">F(n − 1)</Notation>, порядок
            был бы обратным: от малых к большим.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(100)</Notation> и{" "}
              <Notation kind="formula">F(100) − F(96)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(n) = 7</Notation> при{" "}
                <Notation kind="formula">n ≥ 4200</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n + 4) + 2</span>
                </Notation>{" "}
                при <Notation kind="formula">n &lt; 4200</Notation>
              </span>
            </>
          }
          prompt={
            <>
              Сначала подумаем, нельзя ли обойтись без программы: разность
              соседних значений часто упрощается. Затем проверим ответ вторым
              способом — кодом с прогревом кеша.
            </>
          }
          steps={[
            <>
              Формула связывает{" "}
              <Notation kind="formula">F(96) = F(100) + 2</Notation>, поэтому{" "}
              <Notation kind="formula">F(100) − F(96) = −2</Notation> без
              вычисления самих значений.
            </>,
            <>
              Чтобы найти <Notation kind="formula">F(100)</Notation>, нужно
              подняться от <Notation kind="formula">100</Notation> до{" "}
              <Notation kind="formula">4200</Notation> с шагом{" "}
              <Notation kind="formula">4</Notation>: это{" "}
              <Notation kind="formula">(4200 − 100) / 4 = 1025</Notation> шагов,
              каждый добавляет <Notation kind="formula">2</Notation>, а в базе{" "}
              <Notation kind="formula">7</Notation>.
            </>,
            <>
              <Notation kind="formula">F(100) = 7 + 2·1025 = 2057</Notation>, а{" "}
              <Notation kind="formula">F(96) = 2059</Notation>.
            </>,
            <>
              Проверяем программой. Цепочка из 1025 вызовов длиннее стандартного
              лимита, поэтому сначала заполняем кеш от больших{" "}
              <Notation kind="formula">n</Notation> к малым — так каждый вызов
              сразу берёт результат из кеша.
            </>,
          ]}
        >
          <CodeBlock
            code={`from functools import lru_cache\n\n@lru_cache(None)\ndef F(n):\n    if n >= 4200:\n        return 7\n    return F(n + 4) + 2\n\nfor n in range(4200, 95, -1):  # F(n) требует F(n + 4): идём от больших n к малым\n    F(n)\n\nprint(F(100), F(100) - F(96))  # 2057 -2`}
            label="Прогрев кеша против направления зависимости"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Кеш можно прогревать в любом порядке — например, от малых{" "}
              <Notation kind="formula">n</Notation> к большим.
            </>
          }
          explanation={
            <>
              Порядок решает всё. Первый же вызов{" "}
              <Notation kind="formula">F(96)</Notation> потребует{" "}
              <Notation kind="formula">F(100)</Notation>, затем{" "}
              <Notation kind="formula">F(104)</Notation> и так до базы, а в кеше
              пока нет ни одного значения — получится та же длинная цепочка и{" "}
              <Notation>RecursionError</Notation>. Прогрев помогает только
              тогда, когда каждое новое значение опирается на уже сохранённое.
            </>
          }
        />
      ),
    },
    {
      id: "two-functions",
      navLabel: "Две связанные функции F и G",
      explanation: (
        <>
          <Typography.Text>
            В некоторых заданиях определены сразу две функции, и каждая может
            вызывать другую: например,{" "}
            <Notation kind="formula">F(n) = F(n − 1) + G(n − 2)</Notation> и{" "}
            <Notation kind="formula">G(n) = G(n − 1) + F(n − 1)</Notation>. Идея
            решения не меняется: ищем базовые значения обеих функций, понимаем,
            от каких значений зависит каждая, и поднимаемся. Удобно вести
            таблицу с двумя столбцами — строка для каждого{" "}
            <Notation kind="formula">n</Notation>. В программе обе функции
            получают свой <Notation>@lru_cache(None)</Notation>.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(8)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(n) = 1</Notation>,{" "}
                <Notation kind="formula">G(n) = 2</Notation> при{" "}
                <Notation kind="formula">n ≤ 2</Notation>, а при{" "}
                <Notation kind="formula">n &gt; 2</Notation>{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n − 1) + G(n − 2)</span>
                </Notation>
                ,{" "}
                <Notation kind="formula">
                  G(n) = <span data-formula-term>G(n − 1) + F(n − 1)</span>
                </Notation>
              </span>
            </>
          }
          prompt={
            <>
              Заполняем таблицу по строкам: для каждого{" "}
              <Notation kind="formula">n</Notation> сначала{" "}
              <Notation kind="formula">F(n)</Notation>, потом{" "}
              <Notation kind="formula">G(n)</Notation>, используя уже найденные
              строки выше.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">n = 1, 2</Notation>: базовые значения{" "}
              <Notation kind="formula">F = 1</Notation>,{" "}
              <Notation kind="formula">G = 2</Notation>.
            </>,
            <>
              <Notation kind="formula">n = 3</Notation>:{" "}
              <Notation kind="formula">F(3) = F(2) + G(1) = 1 + 2 = 3</Notation>
              ;{" "}
              <Notation kind="formula">G(3) = G(2) + F(2) = 2 + 1 = 3</Notation>
              .
            </>,
            <>
              <Notation kind="formula">n = 4</Notation>:{" "}
              <Notation kind="formula">F(4) = 3 + 2 = 5</Notation>,{" "}
              <Notation kind="formula">G(4) = 3 + 3 = 6</Notation>.
            </>,
            <>
              <Notation kind="formula">n = 5</Notation>:{" "}
              <Notation kind="formula">F(5) = 5 + 3 = 8</Notation>,{" "}
              <Notation kind="formula">G(5) = 6 + 5 = 11</Notation>;{" "}
              <Notation kind="formula">n = 6</Notation>:{" "}
              <Notation kind="formula">F(6) = 8 + 6 = 14</Notation>,{" "}
              <Notation kind="formula">G(6) = 11 + 8 = 19</Notation>.
            </>,
            <>
              <Notation kind="formula">n = 7</Notation>:{" "}
              <Notation kind="formula">F(7) = 14 + 11 = 25</Notation>,{" "}
              <Notation kind="formula">G(7) = 19 + 14 = 33</Notation>;{" "}
              <Notation kind="formula">n = 8</Notation>:{" "}
              <Notation kind="formula">F(8) = 25 + 19 = 44</Notation>.
            </>,
          ]}
        >
          <CodeBlock
            code={`from functools import lru_cache\n\n@lru_cache(None)\ndef F(n):\n    if n <= 2:\n        return 1\n    return F(n - 1) + G(n - 2)\n\n@lru_cache(None)\ndef G(n):\n    if n <= 2:\n        return 2\n    return G(n - 1) + F(n - 1)\n\nprint(F(8))   # 44 — совпало с таблицей\nprint(F(10))  # 135`}
            label="Две функции с кешем"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Раз <Notation>F</Notation> вызывает <Notation>G</Notation>, то
              функцию <Notation>G</Notation> обязательно нужно определить раньше{" "}
              <Notation>F</Notation>.
            </>
          }
          explanation={
            <>
              Нет: имя <Notation>G</Notation> ищется в момент вызова, а не в
              момент записи <Notation>def F</Notation>. Достаточно, чтобы к
              первому вызову обе функции уже существовали: сначала обе{" "}
              <Notation>def</Notation> (каждая со своим декоратором), потом{" "}
              <Notation>print</Notation>. Ошибка <Notation>NameError</Notation>{" "}
              появляется, если вызвать <Notation>F(...)</Notation> выше
              определения <Notation>G</Notation>.
            </>
          }
        />
      ),
    },
    {
      id: "count-arguments",
      navLabel: "Сколько n удовлетворяют условию",
      explanation: (
        <Typography.Text>
          В части заданий спрашивают не значение, а количество аргументов:
          «сколько существует <Notation kind="formula">n</Notation> от 1 до 500,
          для которых <Notation kind="formula">F(n) = 16</Notation>». Здесь
          функция вызывается для каждого <Notation kind="formula">n</Notation>{" "}
          по очереди, поэтому без кеша работа умножилась бы на число проверок, а
          с общим кешем каждое значение считается один раз. Общий шаблон: цикл
          по аргументам, условие на значение и счётчик. Перед тем как считать
          сотни значений, полезно вывести первые несколько и сверить их с ручным
          счётом — так проверяется сама функция.
        </Typography.Text>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Сколько существует <Notation kind="formula">n</Notation>, таких
              что <Notation kind="formula">1 ≤ n ≤ 500</Notation> и{" "}
              <Notation kind="formula">F(n) = 16</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F</Notation> задана как в разделе о
                чётных и нечётных значениях
              </span>
            </>
          }
          prompt={
            <>
              Функция та же: <Notation kind="formula">F(1) = 1</Notation>,{" "}
              <Notation kind="formula">F(n/2) + 3</Notation> для чётных,{" "}
              <Notation kind="formula">F(n − 1) + 1</Notation> для нечётных.
              Сначала проверим программу на малых{" "}
              <Notation kind="formula">n</Notation>, потом посчитаем количество.
            </>
          }
          steps={[
            <>
              Первые значения <Notation kind="formula">F(1), …, F(12)</Notation>
              :{" "}
              <Notation kind="formula">
                1, 4, 5, 7, 8, 8, 9, 10, 11, 11, 12, 11
              </Notation>
              . Их можно проверить вручную, так же как мы проверили{" "}
              <Notation kind="formula">F(21) = 15</Notation>.
            </>,
            <>
              Перебираем <Notation kind="formula">n</Notation> от{" "}
              <Notation kind="formula">1</Notation> до{" "}
              <Notation kind="formula">500</Notation> включительно и считаем
              случаи, где <Notation>F(n) == 16</Notation>.
            </>,
            <>
              Подходят <Notation kind="formula">23, 27, 29, 30, 32</Notation> —
              всего <Notation kind="formula">5</Notation>. Для контроля проверим{" "}
              <Notation kind="formula">n = 30</Notation> вручную:{" "}
              <Notation kind="formula">
                F(3) = 5, F(6) = 8, F(7) = 9, F(14) = 12, F(15) = 13, F(30) = 16
              </Notation>
              .
            </>,
          ]}
        >
          <CodeBlock
            code={`count = 0\nfor n in range(1, 501):  # 501: 500 должно войти в перебор\n    if F(n) == 16:\n        count += 1\n\nprint(count)  # 5\nprint([n for n in range(1, 501) if F(n) == 16])  # [23, 27, 29, 30, 32]`}
            label="Подсчёт аргументов (функция F как выше)"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              <Notation>range(1, 500)</Notation> перебирает все{" "}
              <Notation kind="formula">n</Notation> от 1 до 500 включительно.
            </>
          }
          explanation={
            <>
              Правая граница <Notation>range</Notation> не входит в перебор.
              Здесь ответ не изменится, потому что 500 не подходит, но при
              границе <Notation kind="formula">n ≤ 32</Notation> запись{" "}
              <Notation>range(1, 32)</Notation> потеряла бы подходящее{" "}
              <Notation kind="formula">n = 32</Notation> и дала бы 4 вместо 5.
              Верхняя граница перебора — это «последнее нужное значение + 1».
            </>
          }
        />
      ),
    },
    {
      id: "large-arguments-algebraic-shortcut",
      navLabel: "Большие n: сокращаем, а не считаем",
      explanation: (
        <>
          <Typography.Text>
            До этого нам было нужно само значение функции, поэтому мы шли от
            базы до нужного аргумента. Но если аргумент огромный —{" "}
            <Notation kind="formula">2024</Notation>,{" "}
            <Notation kind="formula">100 000</Notation> — а нужен не сам{" "}
            <Notation kind="formula">F(n)</Notation>, а отношение или разность
            двух соседних значений, считать всю последовательность
            необязательно. Обычно достаточно раскрыть только несколько последних
            шагов и что-то сократить. Методические рекомендации ФИПИ к заданию
            16 советуют именно это: сначала проанализировать выражение на
            предмет упрощения, а не сразу писать программу — для{" "}
            <Notation kind="formula">N!/(N − 1)!</Notation> факториалы вычислять
            не нужно. Если в выражении несколько значений функции, например{" "}
            <Notation kind="formula">(F(100) + 3·F(99)) / F(98)</Notation>, все
            они выражаются через самое «маленькое» из них,{" "}
            <Notation kind="formula">F(98)</Notation>, после чего общий
            множитель выносится и сокращается:{" "}
            <Notation kind="formula">
              (100·99·F(98) + 3·99·F(98)) / F(98) = 9900 + 297 = 10197
            </Notation>
            .
          </Typography.Text>
          <Callout tone="idea" title="Когда применим этот приём">
            Помогает, если в условии — огромный аргумент, а требуется дробь или
            разность соседних значений функции:{" "}
            <Notation kind="formula">F(2024)/F(2022)</Notation>,{" "}
            <Notation kind="formula">F(2024) − F(2021)</Notation>,{" "}
            <Notation kind="formula">(F(2024) + 5·F(2023)) / F(2022)</Notation>{" "}
            и подобные. Если же нужно просто число вроде{" "}
            <Notation kind="formula">F(20)</Notation> без сокращения, быстрее и
            надёжнее посчитать программой.
          </Callout>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(100) / F(98)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(1) = 2</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>n·F(n − 1)</span>
                </Notation>
              </span>
            </>
          }
          prompt={
            <>
              Выразим <Notation kind="formula">F(100)</Notation> и{" "}
              <Notation kind="formula">F(99)</Notation> через{" "}
              <Notation kind="formula">F(98)</Notation> — до него раскрывать не
              нужно.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">F(99) = 99·F(98)</Notation>.
            </>,
            <>
              <Notation kind="formula">
                F(100) = 100·F(99) = 100·99·F(98)
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">
                F(100) / F(98) = 100·99·F(98) / F(98) = 100·99 = 9900
              </Notation>
              .
            </>,
          ]}
        />
      ),
      mistake: (
        <Mistake
          claim={
            <>
              <Notation kind="formula">F(100) / F(98)</Notation> равно просто{" "}
              <Notation kind="formula">100 / 98</Notation>: значения функции
              сократились, остались аргументы.
            </>
          }
          explanation={
            <>
              На каждом шаге определения появляется свой множитель:{" "}
              <Notation kind="formula">F(100) = 100·F(99)</Notation>, а{" "}
              <Notation kind="formula">F(99) = 99·F(98)</Notation>. Поэтому от{" "}
              <Notation kind="formula">F(98)</Notation> до{" "}
              <Notation kind="formula">F(100)</Notation> набегает два множителя,{" "}
              <Notation kind="formula">100·99</Notation>, а не один. Число
              множителей всегда равно разности аргументов.
            </>
          }
        />
      ),
    },
    {
      id: "large-arguments-differences",
      navLabel: "Разность значений и когда сокращение не работает",
      explanation: (
        <>
          <Typography.Text>
            Если формула складывает, а не умножает, сокращается разность, а не
            отношение. Для{" "}
            <Notation kind="formula">F(n) = F(n − 1) + 2n + 3</Notation> каждое
            значение отличается от предыдущего на{" "}
            <Notation kind="formula">2n + 3</Notation>, поэтому{" "}
            <Notation kind="formula">F(n) − F(n − k)</Notation> — сумма{" "}
            <Notation kind="formula">k</Notation> таких добавок. Когда слагаемых
            много, их складывают как арифметическую прогрессию: количество
            слагаемых умножить на полусумму первого и последнего.
          </Typography.Text>
          <Typography.Text>
            Не всякая формула сокращается «нацело». Пусть{" "}
            <Notation kind="formula">F(1) = 1</Notation>,{" "}
            <Notation kind="formula">F(n) = n·F(n − 1) − 1</Notation>. Раскроем
            три шага:{" "}
            <Notation kind="formula">F(200) = 200·F(199) − 1</Notation>, затем{" "}
            <Notation kind="formula">F(199) = 199·F(198) − 1</Notation>, затем{" "}
            <Notation kind="formula">F(198) = 198·F(197) − 1</Notation>. После
            подстановки{" "}
            <Notation kind="formula">
              F(200) = 200·199·198·F(197) − 200·199 − 200 − 1 = 7 880 400·F(197)
              − 40 001
            </Notation>
            . Значит,{" "}
            <Notation kind="formula">
              F(200) / F(197) = 7 880 400 − 40 001 / F(197)
            </Notation>
            . Значение <Notation kind="formula">F(197)</Notation> огромно,
            поэтому вычитаемая дробь больше нуля, но меньше единицы, и число
            чуть меньше <Notation kind="formula">7 880 400</Notation>: его целая
            часть равна <Notation kind="formula">7 880 399</Notation>. Если
            задание просит «целую часть», оценка такого вида — законный способ,
            а если формула сокращается точно, как в предыдущем разделе, целая
            часть не нужна.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(1000) − F(997)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(1) = 5</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n − 1) + 2n + 3</span>
                </Notation>
              </span>
            </>
          }
          prompt={
            <>
              Разность через три шага — это сумма трёх добавок. Затем проверим
              результат программой: если два способа дают одно и то же число,
              ошибки в рассуждении почти нет.
            </>
          }
          steps={[
            <>
              <Notation kind="formula">
                F(1000) = F(999) + 2·1000 + 3 = F(999) + 2003
              </Notation>
              .
            </>,
            <>
              <Notation kind="formula">F(999) = F(998) + 2001</Notation> и{" "}
              <Notation kind="formula">F(998) = F(997) + 1999</Notation>.
            </>,
            <>
              <Notation kind="formula">
                F(1000) − F(997) = 2003 + 2001 + 1999 = 6003
              </Notation>
              . Базовое значение <Notation kind="formula">F(1)</Notation> в
              ответ не вошло.
            </>,
            <>
              Проверка вторым способом: программа с циклом (значение зависит от
              предыдущего) даёт то же число.
            </>,
          ]}
        >
          <CodeBlock
            code={`f = {1: 5}\nfor n in range(2, 1001):  # 1001: включаем n = 1000\n    f[n] = f[n - 1] + 2 * n + 3\n\nprint(f[1000] - f[997])  # 6003`}
            label="Проверка разности программой"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Для <Notation kind="formula">F(n) = n·F(n − 1) − 1</Notation>{" "}
              отношение <Notation kind="formula">F(200) / F(197)</Notation>{" "}
              сокращается так же, как для{" "}
              <Notation kind="formula">n·F(n − 1)</Notation>, и равно{" "}
              <Notation kind="formula">200·199·198 = 7 880 400</Notation>.
            </>
          }
          explanation={
            <>
              Слагаемое <Notation kind="formula">−1</Notation> при каждом
              умножении накапливается: в разложении остаётся{" "}
              <Notation kind="formula">− 40 001</Notation>. Точно сократить{" "}
              <Notation kind="formula">F(197)</Notation> не получится, и
              отношение не равно <Notation kind="formula">7 880 400</Notation>,
              а чуть меньше. Поэтому в таких заданиях просят целую часть, а
              рассуждение строят через оценку поправки.
            </>
          }
        />
      ),
    },
    {
      id: "exam-program-template",
      navLabel: "Шаблон программы для задания 16",
      explanation: (
        <>
          <Typography.Text>
            Соберём выученное в шаблон программы. Каждая строка отвечает на
            конкретную проблему, которую мы уже видели:
          </Typography.Text>
          <CodeBlock
            code={`import sys\nfrom functools import lru_cache\n\nsys.setrecursionlimit(10000)  # Если цепочка вызовов длиннее 1000\n\n@lru_cache(None)  # Значение считается один раз\ndef F(n):\n    if n <= 3:  # База проверяется первой\n        return ...\n    if n % 2 == 0:  # Ветви в порядке условия\n        return ...\n    return ...\n\n# for n in range(...): F(n)  # Прогрев кеша, если цепочка слишком длинная\nprint(F(...))`}
            label="Шаблон: кеш, лимит, база, ветви, прогрев"
            language="python"
          />
          <Typography.Text>
            Из шаблона не нужно брать всё сразу. Импорт <Notation>sys</Notation>{" "}
            и <Notation>setrecursionlimit</Notation> нужны только при длинной
            цепочке; прогрев кеша — при рекурсии вверх или очень длинной
            цепочке; кеш — почти всегда, когда есть два и более рекурсивных
            вызова. И перед тем как отдавать ответ, программу проверяют на малом
            значении, которое можно посчитать вручную.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title={
            <>
              Найдите <Notation kind="formula">F(60)</Notation>, если{" "}
              <span data-example-definition>
                <Notation kind="formula">F(n) = 2</Notation> при{" "}
                <Notation kind="formula">n ≤ 3</Notation>,{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n − 1) + F(n − 3)</span>
                </Notation>{" "}
                при чётном <Notation kind="formula">n &gt; 3</Notation> и{" "}
                <Notation kind="formula">
                  F(n) = <span data-formula-term>F(n − 2) + n</span>
                </Notation>{" "}
                при нечётном <Notation kind="formula">n &gt; 3</Notation>
              </span>
            </>
          }
          prompt={
            <>
              Переводим условие в программу по порядку и проверяем на малом
              значении, посчитанном руками.
            </>
          }
          steps={[
            <>
              База: <Notation kind="formula">n ≤ 3</Notation> — значение{" "}
              <Notation kind="formula">2</Notation>. Ветви: чётное{" "}
              <Notation kind="formula">n</Notation> и нечётное{" "}
              <Notation kind="formula">n</Notation>.
            </>,
            <>
              Ручная проверка:{" "}
              <Notation kind="formula">F(4) = F(3) + F(1) = 4</Notation>,{" "}
              <Notation kind="formula">F(5) = F(3) + 5 = 7</Notation>,{" "}
              <Notation kind="formula">F(6) = F(5) + F(3) = 9</Notation>,{" "}
              <Notation kind="formula">F(7) = F(5) + 7 = 14</Notation>,{" "}
              <Notation kind="formula">F(8) = F(7) + F(5) = 21</Notation>,{" "}
              <Notation kind="formula">F(9) = F(7) + 9 = 23</Notation>,{" "}
              <Notation kind="formula">F(10) = F(9) + F(7) = 37</Notation>.
            </>,
            <>
              Программа для <Notation kind="formula">F(10)</Notation> должна
              вывести <Notation kind="formula">37</Notation>; глубина цепочки
              для <Notation kind="formula">F(60)</Notation> мала, поэтому лимит
              и прогрев не нужны — достаточно кеша.
            </>,
          ]}
        >
          <CodeBlock
            code={`from functools import lru_cache\n\n@lru_cache(None)\ndef F(n):\n    if n <= 3:\n        return 2\n    if n % 2 == 0:\n        return F(n - 1) + F(n - 3)\n    return F(n - 2) + n\n\nprint(F(10))  # 37 — как при ручной проверке\nprint(F(60))  # 1737`}
            label="Программа по условию и проверка"
            language="python"
          />
        </WorkedExample>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Если программа выдала число без ошибок, ответ можно записывать
              сразу.
            </>
          }
          explanation={
            <>
              Программа выполняет то, что в ней написано, а не то, что имелось в
              виду: неверное условие ветви или граница{" "}
              <Notation>range</Notation> тоже дают «красивое» число. Поэтому
              ответ подтверждают: проверяют функцию на малых значениях, которые
              считаются вручную, и, когда возможно, вторым способом (упрощением,
              циклом).
            </>
          }
        />
      ),
    },
    {
      id: "general-method",
      navLabel: "Общий алгоритм решения",
      explanation: (
        <>
          <Typography.Text>
            Мы рассмотрели несколько разных формул и способов вычисления. Теперь
            соберём их в один алгоритм для задания 16:
          </Typography.Text>
          <Procedure
            title="Как решать задание 16"
            steps={[
              {
                label: "Определите область n и базовые значения.",
                detail: (
                  <>
                    Аргумент натуральный,{" "}
                    <Notation kind="formula">n ≥ 0</Notation> или задан
                    отдельно; базовые значения даны в условии — их не нужно
                    вычислять. Проверьте, что база находится там, куда ведёт
                    цепочка (внизу или, как{" "}
                    <Notation kind="formula">F(n + 4)</Notation>, вверху).
                  </>
                ),
              },
              {
                label: "Определите вид зависимости.",
                detail: (
                  <>
                    Одно или несколько предыдущих значений, разные формулы для
                    чётных и нечётных <Notation kind="formula">n</Notation>, шаг
                    не на 1 (<Notation>//</Notation>, <Notation>%</Notation>
                    ), рекурсия вверх или две связанные функции.
                  </>
                ),
              },
              {
                label: "Сначала попробуйте упростить.",
                detail: (
                  <>
                    Огромный аргумент и отношение или разность соседних значений
                    — повод раскрыть несколько шагов и сократить. Не сокращается
                    точно — оцените поправку.
                  </>
                ),
              },
              {
                label: "Выберите инструмент.",
                detail:
                  "Маленький аргумент — таблица вручную; рекурсия с @lru_cache(None) — если есть ветви, два и более вызова, шаг не на 1 или две функции; цикл — для линейной цепочки; лимит рекурсии — если цепочка чуть длиннее 1000; прогрев кеша — при очень длинной цепочке или рекурсии вверх.",
              },
              {
                label: "Проверьте, что аргумент приближается к базе.",
                detail: (
                  <>
                    <Notation kind="formula">
                      F(n) → F(n − 1) → F(n − 2) → …
                    </Notation>{" "}
                    должно дойти до известного значения, а базовые случаи
                    проверяются в программе первыми.
                  </>
                ),
              },
              {
                label: "Проверьте границы и малые значения.",
                detail: (
                  <>
                    <Notation>range(a, b)</Notation> не включает{" "}
                    <Notation kind="formula">b</Notation>. Программа для малых{" "}
                    <Notation kind="formula">n</Notation> должна совпасть с
                    ручным счётом.
                  </>
                ),
              },
              {
                label: "Подтвердите ответ вторым способом.",
                detail:
                  "Кеш — циклом или списком; программа — упрощением; рекурсия вверх — разностью. Если два способа расходятся, ошибка есть в одном из них.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Рекурсивное определение — это не логический круг, а последовательность:
        одно или несколько первых значений уже известны, а каждое следующее
        выражается через уже найденные. Вся задача сводится к тому, чтобы
        понять, от чего зависит формула и куда ведёт цепочка, и добраться от
        базы до нужного аргумента, ни разу не потеряв базовый случай.
      </Typography.Text>
      <Typography.Text>
        Как считать — рекурсией с кешем, циклом, списком, прогревом кеша или
        алгебраическим сокращением — решает не личный вкус, а то, что именно
        даёт формула: маленький или огромный аргумент, ветвление, шаг не на 1,
        одна функция или две, число, количество аргументов или разность соседних
        значений. И в любом случае ответ проверяют: на малых значениях и вторым
        способом.
      </Typography.Text>
    </>
  ),
  checkpoint: [
    {
      id: "checkpoint-base-case",
      prompt: (
        <>
          Дано <Notation kind="formula">F(1) = 5</Notation> и{" "}
          <Notation kind="formula">F(n) = F(n − 1) + 3</Notation> при{" "}
          <Notation kind="formula">
            <span data-formula-term>n &gt; 1</span>
          </Notation>
          . Можно ли подставить{" "}
          <Notation kind="formula">
            <span data-formula-term>n = 1</span>
          </Notation>{" "}
          в рекуррентную формулу, чтобы найти ещё одно значение?
        </>
      ),
      reveal: (
        <>
          Нет. Формула работает только при{" "}
          <Notation kind="formula">
            <span data-formula-term>n &gt; 1</span>
          </Notation>
          , а <Notation kind="formula">F(1)</Notation> — отдельно заданный
          базовый случай. Такая подстановка потребовала бы не определённое в
          условии значение <Notation kind="formula">F(0)</Notation>.
        </>
      ),
    },
    {
      id: "checkpoint-base-case-value",
      prompt: (
        <>
          Чему равно <Notation kind="formula">F(3)</Notation> для той же
          функции?
        </>
      ),
      reveal: (
        <>
          Сначала <Notation kind="formula">F(2) = 5 + 3 = 8</Notation>, затем{" "}
          <Notation kind="formula">F(3) = 8 + 3 = 11</Notation>. Двигаться нужно
          от базового случая вверх по одному шагу.
        </>
      ),
    },
    {
      id: "checkpoint-call-order",
      prompt: (
        <>
          В программе с печатью для <Notation kind="formula">F(4)</Notation> в
          каком порядке появятся строки «возврат»: от большего{" "}
          <Notation kind="formula">n</Notation> к меньшему или наоборот?
        </>
      ),
      reveal: (
        <>
          От меньшего к большему: сначала «возврат 2», потом «возврат 3», потом
          «возврат 4». Вызовы уходят вглубь до базы, а затем результаты
          возвращаются в обратном порядке.
        </>
      ),
    },
    {
      id: "checkpoint-repeated-calls",
      prompt: (
        <>
          Функция задана как <Notation kind="formula">F(1) = 1</Notation>,{" "}
          <Notation kind="formula">F(2) = 1</Notation>,{" "}
          <Notation kind="formula">F(n) = F(n − 1) + F(n − 2)</Notation>. Что
          станет главной проблемой прямой рекурсии при{" "}
          <Notation kind="formula">F(40)</Notation>: глубина стека или что-то
          другое?
        </>
      ),
      reveal: (
        <>
          Не глубина (она около сорока), а огромное количество повторных
          вычислений: одни и те же значения вызываются заново из разных ветвей
          дерева вызовов. Здесь нужен кеш, список или две переменные.
        </>
      ),
    },
    {
      id: "checkpoint-cache-size",
      prompt: (
        <>
          Чем <Notation>@lru_cache(None)</Notation> отличается от{" "}
          <Notation>@lru_cache()</Notation> без аргумента?
        </>
      ),
      reveal: (
        <>
          <Notation>None</Notation> снимает ограничение размера, и кеш
          запоминает все значения. Без аргумента Python помнит только 128
          последних, старые вытесняются и могут вычисляться снова — для длинных
          цепочек и перебора аргументов это плохо.
        </>
      ),
    },
    {
      id: "checkpoint-two-values-update",
      prompt: (
        <>
          Почему два последних значения нельзя бездумно обновлять двумя
          последовательными присваиваниями?
        </>
      ),
      reveal: (
        <>
          Первое присваивание перезапишет одно из старых значений, и второе уже
          сложит не ту пару. Нужно сначала сохранить новое значение или
          использовать параллельное присваивание Python.
        </>
      ),
    },
    {
      id: "checkpoint-floor-division",
      prompt: (
        <>
          Что вернут <Notation>9 / 3</Notation> и <Notation>9 // 3</Notation>?
          Почему это важно, когда аргумент функции должен остаться целым?
        </>
      ),
      reveal: (
        <>
          <Notation>9 / 3</Notation> даёт <Notation>3.0</Notation> — дробное
          число, а <Notation>9 // 3</Notation> даёт <Notation>3</Notation> —
          целое. Для огромных аргументов дробное деление теряет цифры, поэтому
          аргументы делят через <Notation>//</Notation>.
        </>
      ),
    },
    {
      id: "checkpoint-branch-order",
      prompt: (
        <>
          Почему в функции с ветвями по чётности базовый случай проверяют раньше
          веток?
        </>
      ),
      reveal: (
        <>
          База — единственное значение, которое задано напрямую. Если её не
          проверить первой, аргумент может попасть в ветку, которая уведёт
          цепочку мимо базы (например, <Notation kind="formula">n = 1</Notation>{" "}
          в ветку нечётных даст <Notation kind="formula">F(0)</Notation>) и
          вызовет бесконечную рекурсию.
        </>
      ),
    },
    {
      id: "checkpoint-warmup-direction",
      prompt: (
        <>
          Функция задана как{" "}
          <Notation kind="formula">F(n) = F(n + 3) + 1</Notation> при{" "}
          <Notation kind="formula">n &lt; 5000</Notation>. В каком порядке
          прогревать кеш?
        </>
      ),
      reveal: (
        <>
          От больших <Notation kind="formula">n</Notation> к малым, начиная
          примерно с базы (около <Notation kind="formula">5000</Notation>):{" "}
          <Notation kind="formula">F(n)</Notation> зависит от{" "}
          <Notation kind="formula">F(n + 3)</Notation>, поэтому это значение
          должно быть уже сохранено. Порядок выбирают против направления
          зависимости.
        </>
      ),
    },
    {
      id: "checkpoint-count-range",
      prompt: (
        <>
          Нужно посчитать <Notation kind="formula">n</Notation> от 1 до 300
          включительно. Какую строку цикла написать?
        </>
      ),
      reveal: (
        <>
          <Notation>for n in range(1, 301):</Notation> — правая граница{" "}
          <Notation>range</Notation> не входит, поэтому берётся «последнее
          нужное значение + 1».
        </>
      ),
    },
    {
      id: "checkpoint-large-ratio",
      prompt: (
        <>
          Если <Notation kind="formula">F(n) = n·F(n − 1)</Notation>, нужно ли
          вычислять всю последовательность от{" "}
          <Notation kind="formula">F(1)</Notation>, чтобы найти{" "}
          <Notation kind="formula">F(2024) / F(2022)</Notation>?
        </>
      ),
      reveal: (
        <>
          Нет. Достаточно раскрыть два последних шага:{" "}
          <Notation kind="formula">F(2024) = 2024·2023·F(2022)</Notation>, после
          чего <Notation kind="formula">F(2022)</Notation> сокращается.
        </>
      ),
    },
    {
      id: "checkpoint-choose-way",
      prompt: (
        <>
          Выберите способ вычисления для каждого условия: (а){" "}
          <Notation kind="formula">F(n) = 3·F(n − 1) + 2</Notation>, нужно{" "}
          <Notation kind="formula">F(50)</Notation>; (б) значение зависит от{" "}
          <Notation kind="formula">F(n // 2)</Notation> и чётности{" "}
          <Notation kind="formula">n</Notation>; (в) нужна разность{" "}
          <Notation kind="formula">F(3000) − F(2997)</Notation> для{" "}
          <Notation kind="formula">F(n) = F(n − 1) + n</Notation>.
        </>
      ),
      reveal: (
        <>
          (а) Линейная цепочка на 50 шагов — цикл или рекурсия с кешем. (б)
          Ветвление и шаг не на 1 — рекурсия с{" "}
          <Notation>@lru_cache(None)</Notation>. (в) Разность из трёх шагов —
          сумма <Notation kind="formula">3000 + 2999 + 2998</Notation> без
          программы; программой подтверждают ответ.
        </>
      ),
    },
  ],
});
