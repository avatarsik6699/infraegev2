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
import { rekursiyaLessonPublication } from "./lesson-publication.mjs";

export const rekursiyaLesson = defineLesson({
  ...rekursiyaLessonPublication,
  learningOutcomes: [
    "Находить значения рекуррентно заданной функции, поднимаясь от базового случая к нужному аргументу",
    "Отличать функции с одним предыдущим значением от функций с двумя и более",
    "Переводить рекуррентное определение в рекурсивную функцию, цикл, список или пару переменных",
    "Замечать, когда простая рекурсия упирается в ограничение глубины или пересчитывает одно и то же значение много раз",
    "Сокращать выражения с огромными аргументами, не вычисляя всю последовательность",
  ],
  practiceTaskIds: [
    "rekursiya-base-sequence",
    "rekursiya-call-stack-trace",
    "rekursiya-two-values",
    "rekursiya-repeated-calls",
    "rekursiya-large-ratio",
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
          title="Найдите F(5), если F(1) = 1 и F(n) = 2·F(n − 1) + 1"
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
      navLabel: "Зачем нужны два условия",
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
        </>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              Если в формуле{" "}
              <Notation kind="formula">F(n) = F(n − 1) + n</Notation> сказано{" "}
              <Notation kind="formula">n &gt; 3</Notation>, её можно применить и
              для <Notation kind="formula">F(2)</Notation> — раз число
              маленькое, разница небольшая.
            </>
          }
          explanation={
            <>
              Нельзя: условие <Notation kind="formula">n &gt; 3</Notation> —
              часть определения, а не подсказка для удобства. Для{" "}
              <Notation kind="formula">n ≤ 3</Notation> функция должна быть
              задана отдельно — своим базовым значением. Применение формулы за
              пределами её условия даёт какое-то число, но не значение{" "}
              <Notation kind="formula">F(n)</Notation>.
            </>
          }
        />
      ),
    },
    {
      id: "why-it-works",
      navLabel: "Почему это вообще определяет функцию",
      explanation: (
        <>
          <Typography.Text>
            Теперь проверим, почему двух частей действительно достаточно. На
            первый взгляд определение через предыдущие значения похоже на
            логический круг: чтобы найти{" "}
            <Notation kind="formula">F(5)</Notation>, нужно знать{" "}
            <Notation kind="formula">F(4)</Notation>, а чтобы найти{" "}
            <Notation kind="formula">F(4)</Notation> — знать{" "}
            <Notation kind="formula">F(3)</Notation>, и так далее. Круга здесь
            на самом деле нет.
          </Typography.Text>
          <Typography.Text>
            Раз <Notation kind="formula">F(1)</Notation> известно без всяких
            вычислений, из него однозначно находится{" "}
            <Notation kind="formula">F(2)</Notation>. Раз известно{" "}
            <Notation kind="formula">F(2)</Notation>, точно так же находится{" "}
            <Notation kind="formula">F(3)</Notation>. Раз известно{" "}
            <Notation kind="formula">F(3)</Notation> — находится{" "}
            <Notation kind="formula">F(4)</Notation>, и так далее для любого{" "}
            <Notation kind="formula">n</Notation>. Каждое следующее значение
            опирается только на уже найденное, поэтому вся последовательность{" "}
            <Notation kind="formula">F(1), F(2), F(3), …</Notation> определена
            целиком, без пропусков и без противоречий — тот же принцип, что и
            математическая индукция: база плюс шаг, работающий для любого{" "}
            <Notation kind="formula">n</Notation>, задают значение сразу для
            всех <Notation kind="formula">n</Notation>.
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
              <Notation kind="formula">n &gt; 1</Notation>. Можно ли подставить{" "}
              <Notation kind="formula">n = 1</Notation> в рекуррентную формулу,
              чтобы найти ещё одно значение?
            </>
          ),
          reveal: (
            <>
              Нет. Формула работает только при{" "}
              <Notation kind="formula">n &gt; 1</Notation>, а{" "}
              <Notation kind="formula">F(1)</Notation> — отдельно заданный
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
              Сначала <Notation kind="formula">F(2) = 5 + 3 = 8</Notation>,
              затем <Notation kind="formula">F(3) = 8 + 3 = 11</Notation>.
              Двигаться нужно от базового случая вверх по одному шагу.
            </>
          ),
        },
      ],
    },
    {
      id: "code-and-call-stack",
      navLabel: "Рекурсивная функция в коде",
      explanation: (
        <>
          <Typography.Text>
            Пока мы поднимались от базового значения вручную. Ту же цепочку
            можно поручить Python. Функцию, которая во время вычисления вызывает
            саму себя, называют рекурсивной:
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    if n == 1:\n        return 1  # Базовый случай: значение уже известно\n    return 2 * F(n - 1) + 1  # Шаг: сначала находим F(n - 1)\n\nprint(F(5))`}
            label="Рекурсивная функция F"
            language="python"
          />
          <Typography.Text>
            Вызов функции — это её запуск с конкретным аргументом. Вызов
            <Notation kind="formula"> F(5)</Notation> не может сразу вернуть
            число — сначала нужно узнать{" "}
            <Notation kind="formula">F(4)</Notation>, для которого нужно{" "}
            <Notation kind="formula">F(3)</Notation>, и так далее, пока не будет
            достигнут базовый случай <Notation kind="formula">F(1)</Notation>.
            После этого каждый вызов возвращает своё значение туда, откуда был
            вызван, и подъём происходит в обратном порядке.
          </Typography.Text>
          <Typography.Text>
            <Notation>return</Notation> делает две вещи одновременно: завершает
            текущий вызов и передаёт вычисленное число туда, откуда функция была
            вызвана. В строке <Notation>return 2 * F(n - 1) + 1</Notation>{" "}
            выражение <Notation kind="formula">F(n - 1)</Notation> — это не
            текст и не номер, а конкретное число, которое вернул вложенный
            вызов.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim={
            <>
              <Notation kind="formula">F(n - 1)</Notation> и{" "}
              <Notation kind="formula">F(n) - 1</Notation> — примерно одно и то
              же, в обоих случаях просто «минус один».
            </>
          }
          explanation={
            <>
              Это разные выражения. <Notation kind="formula">F(n - 1)</Notation>{" "}
              — значение функции для аргумента{" "}
              <Notation kind="formula">n − 1</Notation> (нужно снова вызывать{" "}
              <Notation kind="formula">F</Notation>
              ). <Notation kind="formula">F(n) - 1</Notation> — значение{" "}
              <Notation kind="formula">F(n)</Notation>, из которого потом вычли
              единицу. Перепутав их, можно получить синтаксически похожую, но
              математически совсем другую формулу.
            </>
          }
        />
      ),
    },
    {
      id: "loop-instead-of-recursion",
      navLabel: "Когда рекурсию заменяет цикл",
      explanation: (
        <>
          <Typography.Text>
            Рекурсивная запись близка к формуле, но у неё есть практическая
            цена. Python хранит каждый приостановленный вызов в стеке вызовов —
            списке функций, которые ещё ждут результат. Для{" "}
            <Notation kind="formula">F(2024)</Notation> это значит две тысячи с
            лишним вложенных вызовов одновременно — на Python это упирается в
            ограничение глубины рекурсии и завершается ошибкой ещё до того, как
            будет достигнут базовый случай:
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    if n == 1:\n        return 1\n    return n * F(n - 1)\n\nprint(F(2024))  # RecursionError: превышена глубина рекурсии`}
            label="Простая рекурсия падает на большом n"
            language="python"
          />
          <Typography.Text>
            В каждый момент нужно только последнее найденное значение, поэтому
            тот же результат надёжнее получить циклом, который перезаписывает
            одну переменную, ничего не откладывая в стек:
          </Typography.Text>
          <CodeBlock
            code={`f = 1  # Начинаем с известного F(1)\n\nfor n in range(2, 2025):\n    f = n * f  # Новое значение заменяет предыдущее\n\nprint(f)`}
            label="Тот же результат циклом"
            language="python"
          />
          <Typography.Text>
            Общий шаблон для функции с одним предыдущим значением:
          </Typography.Text>
          <CodeBlock
            code={`f = base_value\n\nfor n in range(first_n, target + 1):\n    f = ...  # Формула через предыдущее значение f\n\nprint(f)`}
            label="Универсальный шаблон: одно предыдущее значение"
            language="python"
          />
        </>
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
              нужный шаг цикла просто не выполнится.
            </>
          }
        />
      ),
      checkpoint: [
        {
          id: "checkpoint-loop-choice",
          prompt: (
            <>
              Для вычисления <Notation kind="formula">F(2024)</Notation> каждое
              следующее значение зависит только от предыдущего. Что надёжнее в
              Python: прямая рекурсия или цикл с одной переменной?
            </>
          ),
          reveal: (
            <>
              Цикл с одной переменной: ему не нужен глубокий стек вызовов, и он
              хранит ровно то значение, которое понадобится на следующем шаге.
            </>
          ),
        },
        {
          id: "checkpoint-loop-range",
          prompt: (
            <>
              Если переменная <Notation>f</Notation> уже хранит{" "}
              <Notation kind="formula">F(1)</Notation>, с какого значения{" "}
              <Notation kind="formula">n</Notation> должен начинаться цикл для
              вычисления <Notation kind="formula">F(target)</Notation>?
            </>
          ),
          reveal: (
            <>
              С <Notation kind="formula">n = 2</Notation>: первое значение уже
              известно. Чтобы обработать <Notation>target</Notation>{" "}
              включительно, граница Python-цикла будет{" "}
              <Notation>range(2, target + 1)</Notation>.
            </>
          ),
        },
      ],
    },
    {
      id: "several-previous-values",
      navLabel: "Когда нужны два предыдущих значения",
      explanation: (
        <Typography.Text>
          До сих пор для нового значения хватало одного предыдущего. Но иногда
          формула зависит сразу от двух:{" "}
          <Notation kind="formula">F(n) = F(n − 1) + F(n − 2)</Notation>. Тогда
          одного базового значения недостаточно — уже для{" "}
          <Notation kind="formula">F(3)</Notation> нужны сразу{" "}
          <Notation kind="formula">F(2)</Notation> и{" "}
          <Notation kind="formula">F(1)</Notation>, поэтому определение обязано
          задать оба сразу: <Notation kind="formula">F(1) = 2</Notation>,{" "}
          <Notation kind="formula">F(2) = 3</Notation>.
        </Typography.Text>
      ),
      workedExample: (
        <WorkedExample
          title="Найдите F(6), если F(1) = 2, F(2) = 3 и F(n) = F(n − 1) + F(n − 2)"
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
      navLabel: "Зачем хранить значения, а не считать заново",
      explanation: (
        <>
          <Typography.Text>
            Для зависимости от одного значения главной опасностью была глубина
            стека. У рекурсивной функции с двумя предыдущими значениями
            появляется другая проблема — повторные вычисления:
          </Typography.Text>
          <CodeBlock
            code={`def F(n):\n    if n == 1:\n        return 2\n    if n == 2:\n        return 3\n    return F(n - 1) + F(n - 2)`}
            label="Рекурсия с двумя предыдущими значениями"
            language="python"
          />
          <Typography.Text>
            Вызов <Notation kind="formula">F(6)</Notation> запускает{" "}
            <Notation kind="formula">F(5)</Notation> и{" "}
            <Notation kind="formula">F(4)</Notation>. Но{" "}
            <Notation kind="formula">F(5)</Notation>, в свою очередь, снова
            запускает <Notation kind="formula">F(4)</Notation> — то же самое
            значение считается заново, хотя уже вычислялось. При больших{" "}
            <Notation kind="formula">n</Notation> количество повторных
            вычислений растёт очень быстро. Решение — не пересчитывать, а один
            раз сохранить каждое найденное значение, например списком:
          </Typography.Text>
          <CodeBlock
            code={`target = 6\nF = [0] * (target + 1)\n\n# Два базовых значения нужны до первого шага\nF[1] = 2\nF[2] = 3\n\nfor n in range(3, target + 1):\n    F[n] = F[n - 1] + F[n - 2]  # Сохраняем один раз\n\nprint(F[target])`}
            label="Список вместо повторного пересчёта"
            language="python"
          />
          <Typography.Text>
            Хранить весь список не обязательно — для следующего значения нужны
            только два последних:
          </Typography.Text>
          <CodeBlock
            code={`f_prev2, f_prev1 = 2, 3\n\nfor n in range(3, 7):\n    # Правая часть использует оба старых значения до присваивания\n    f_prev2, f_prev1 = f_prev1, f_prev1 + f_prev2\n\nprint(f_prev1)`}
            label="Две переменные вместо списка"
            language="python"
          />
          <Typography.Text>
            Сохранение уже найденного результата называют кешированием. Если
            оставить функцию рекурсивной, в Python эту работу может взять на
            себя декоратор <Notation>@cache</Notation> из модуля
            <Notation> functools</Notation>: специальная отметка над функцией.
            Тогда каждое значение вычисляется только один раз, а при повторном
            обращении берётся из памяти. Для задач такого масштаба, впрочем,
            обычно проще и надёжнее цикл.
          </Typography.Text>
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
      checkpoint: [
        {
          id: "checkpoint-two-values",
          prompt: (
            <>
              Функция задана как <Notation kind="formula">F(1) = 1</Notation>,{" "}
              <Notation kind="formula">F(2) = 1</Notation>,{" "}
              <Notation kind="formula">F(n) = F(n − 1) + F(n − 2)</Notation>.
              Что станет главной проблемой прямой рекурсии при{" "}
              <Notation kind="formula">F(40)</Notation>?
            </>
          ),
          reveal: (
            <>
              Не глубина, а огромное количество повторных вычислений: одни и те
              же значения вызываются заново из разных ветвей. Здесь лучше цикл,
              список, пара переменных или кеширование.
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
              Первое присваивание перезапишет одно из старых значений, и второе
              уже сложит не ту пару. Нужно сначала сохранить новое значение или
              использовать параллельное присваивание Python.
            </>
          ),
        },
      ],
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
            шагов и что-то сократить.
          </Typography.Text>
          <Callout tone="idea" title="Когда применим этот приём">
            Помогает, если в условии — огромный аргумент, а требуется дробь или
            разность соседних значений функции:{" "}
            <Notation kind="formula">F(2024)/F(2022)</Notation>,{" "}
            <Notation kind="formula">F(2024) − 2024·F(2023)</Notation> и
            подобные. Если же нужно просто число вроде{" "}
            <Notation kind="formula">F(20)</Notation> без сокращения, быстрее и
            надёжнее посчитать циклом от начала.
          </Callout>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Найдите F(100) / F(98), если F(1) = 2 и F(n) = n·F(n − 1)"
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
      checkpoint: [
        {
          id: "checkpoint-large-ratio",
          prompt: (
            <>
              Если <Notation kind="formula">F(n) = n·F(n − 1)</Notation>, нужно
              ли вычислять всю последовательность от{" "}
              <Notation kind="formula">F(1)</Notation>, чтобы найти{" "}
              <Notation kind="formula">F(2024) / F(2022)</Notation>?
            </>
          ),
          reveal: (
            <>
              Нет. Достаточно раскрыть два последних шага:{" "}
              <Notation kind="formula">F(2024) = 2024·2023·F(2022)</Notation>,
              после чего <Notation kind="formula">F(2022)</Notation>{" "}
              сокращается.
            </>
          ),
        },
      ],
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
                label: "Определите область n.",
                detail: (
                  <>
                    Область здесь означает допустимые значения аргумента:{" "}
                    <Notation kind="formula">n</Notation> натуральное,{" "}
                    <Notation kind="formula">n ≥ 0</Notation>, или задано
                    отдельно — от этого зависит, с какого числа начинать.
                  </>
                ),
              },
              {
                label: "Найдите базовые значения.",
                detail: "Их не нужно вычислять — они даны в условии напрямую.",
              },
              {
                label: "Определите зависимость.",
                detail: (
                  <>
                    Одно предыдущее значение, два предыдущих, разные формулы для
                    чётных/нечётных <Notation kind="formula">n</Notation> или
                    две связанные функции сразу.
                  </>
                ),
              },
              {
                label: "Проверьте, что аргумент приближается к базе.",
                detail: (
                  <>
                    <Notation kind="formula">
                      F(n) → F(n − 1) → F(n − 2) → …
                    </Notation>{" "}
                    должно дойти до уже известного значения.
                  </>
                ),
              },
              {
                label: "Выберите способ вычисления.",
                detail:
                  "Маленький аргумент — таблица вручную; обычный аргумент — цикл; несколько предыдущих значений — список или пара переменных; огромный аргумент с дробью или разностью — алгебраическое сокращение.",
              },
              {
                label: "Считайте снизу вверх и проверьте границы цикла.",
                detail: (
                  <>
                    <Notation>range(a, b)</Notation> не включает{" "}
                    <Notation kind="formula">b</Notation> — если нужно значение{" "}
                    <Notation kind="formula">F(target)</Notation>, верхняя
                    граница должна быть{" "}
                    <Notation kind="formula">target + 1</Notation>.
                  </>
                ),
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
        понять, сколько предыдущих значений нужно формуле, и подняться от базы
        до нужного аргумента, ни разу не забежав вперёд.
      </Typography.Text>
      <Typography.Text>
        Как считать — рекурсией, циклом, списком, парой переменных или
        алгебраическим сокращением — решает не личный вкус, а то, что именно
        даёт формула: маленький аргумент или огромный, одно предыдущее значение
        или два, число или дробь из соседних значений.
      </Typography.Text>
    </>
  ),
});
