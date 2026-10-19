// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { ExternalLink } from "~/shared/components/external-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonSummary,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./branching-and-enumeration.paid.vychislenie-i-proverka.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "podschet-programmoj",
      navLabel: "Подсчёт программой",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Программа на Python записывает уже понятный подсчёт: рекурсия —
              дерево из подтемы 1 с запоминанием повторов, цикл — таблица из
              подтемы 2; вывод должен совпасть с ручным ответом.
            </strong>{" "}
            Нового типа задач здесь нет: это проверка и вычисление для всех 82
            основных задач, когда таблица становится длинной.
          </Typography.Text>
          <Typography.Text>
            Главный пример — снова путь 2 → 12 командами «+1» и «×2» (ответ 10)
            и та же задача с обязательным 6 и запретом 9. Сначала читаем код на
            знакомых числах, потом используем его там, где таблица руками была
            бы долгой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-raznyh-chisla",
      navLabel: "Два разных числа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В программе есть два разных числа: число на экране исполнителя и
              количество программ — их нельзя смешивать.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Чтобы описать изменение числа в программе, используется{" "}
            <PythonTerm term="eq">присваивание</PythonTerm>: вычислить новое
            значение и записать его вместо старого. Запись{" "}
            <Notation>{"x = x + 1"}</Notation> — «взять старое значение x,
            прибавить 1 и сохранить результат в x»; это не уравнение.{" "}
            <Notation>{"x = x * 2"}</Notation> — взять старое x, умножить на 2 и
            сохранить.
          </Typography.Text>
          <Typography.Text>
            В решении задачи часто есть ещё одна переменная — количество
            способов. Например, <Notation>{"ways = ways + 3"}</Notation>{" "}
            увеличивает ранее подсчитанное количество способов на 3. Нужно
            всегда различать число на экране исполнителя и число программ,
            которые привели к нему.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rekursiya-f-x-y",
      navLabel: "Рекурсия f(x, y)",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рекурсия считает продолжения: f(x, y) — сколько программ ведёт из
              текущего x в цель y; она равна сумме по первой команде.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Мы уже научились считать программы до каждого числа. Можно задать
            другой вопрос: сколько подходящих продолжений существует из текущего
            числа x до цели y?
          </Typography.Text>
          <Typography.Text>
            Обозначим это количество f(x, y). Если из x можно перейти в x + 1
            или 2x, то каждую программу-продолжение можно разделить по первой
            команде. Получаем:
          </Typography.Text>
          <Typography.Text>
            <strong>f(x, y) = f(x + 1, y) + f(2x, y).</strong>
          </Typography.Text>
          <Typography.Text>
            Функция справа обращается к самой себе, но уже для новых текущих
            чисел. Такой способ определения и вычисления функции называется{" "}
            <PythonTerm term="rec">рекурсией</PythonTerm>. В нашем случае это
            буквально подсчёт дерева: чтобы узнать число успешных продолжений
            вершины, узнаём количества для её ветвей и складываем.
          </Typography.Text>
          <Typography.Text>
            Если x {">"} y, цель перепрыгнута и возвращаться вниз нельзя:
            продолжений ноль. Если x == y, мы уже на цели: один вариант
            закончить прямо сейчас. Эти ситуации называются базовыми случаями: в
            них ответ известен сразу, и они останавливают раскрытие дерева.
          </Typography.Text>
          <CodeBlock
            code={
              "def f(x, y):\n    if x > y:\n        return 0\n    if x == y:\n        return 1\n    return f(x + 1, y) + f(x * 2, y)\n\nprint(f(2, 12))"
            }
            label={"Код на Python: def f(x, y):"}
            language="python"
            output={"10"}
          />
          <Typography.Text>
            <PythonTerm term="def">
              <Notation>{"def"}</Notation>
            </PythonTerm>{" "}
            задаёт функцию, <Notation>{"return"}</Notation> возвращает результат
            и завершает текущий вызов;{" "}
            <PythonTerm term="if">
              <Notation>{"if"}</Notation>
            </PythonTerm>{" "}
            проверяет условие, <Notation>{"=="}</Notation> сравнивает, а
            одиночный <Notation>{"="}</Notation> присваивает.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "svoi-x-i-y-u-vyzova",
      navLabel: "Свои x и y у вызова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              У каждого вызова свои x и y: вызов f(2, 6) ждёт ответа f(3, 6), а
              потом отдельно вызывает f(4, 6).
            </strong>{" "}
            Пройди раскрутку маленького примера по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runUnwind}
            label={"Пройди раскрутку маленького примера по шагам"}
          />
          <Typography.Text>
            Это удобно представлять как листки с одинаковым вопросом. На первом
            записано «сколько из 3 в 6?», на втором «сколько из 4 в 6?». Ответы
            на меньшие вопросы возвращаются на листок, где их запросили.
            Полностью для f(2, 6):
          </Typography.Text>
          <ol>
            <li>f(5, 6) = f(6, 6) + f(10, 6) = 1 + 0 = 1.</li>
            <li>f(4, 6) = f(5, 6) + f(8, 6) = 1 + 0 = 1.</li>
            <li>f(3, 6) = f(4, 6) + f(6, 6) = 1 + 1 = 2.</li>
            <li>f(2, 6) = f(3, 6) + f(4, 6) = 2 + 1 = 3.</li>
          </ol>
          <Typography.Text>
            Обрати внимание: f(4, 6) встретилась дважды. Это повторный подсчёт
            одинакового вопроса, а не лишняя программа. Программы, которые
            пришли в 4 разными путями, должны обе учитываться. Но значение
            одинакового вопроса можно вычислить один раз и использовать
            повторно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obyazatelnye-i-zapreshchennye-v-kode",
      navLabel: "Обязательные и запрещённые в коде",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Обязательные и запрещённые числа в коде — те же произведение и
              ноль, что в таблице.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для обязательного числа 6 и для обязательных 4 и 8 (функция f — та
            же, что выше):
          </Typography.Text>
          <CodeBlock
            code={
              "print(f(2, 6) * f(6, 12))\nprint(f(2, 4) * f(4, 8) * f(8, 12))"
            }
            label={
              "Для обязательного числа 6 и для обязательных 4 и 8 (функция f — та же, что выше)"
            }
            language="python"
            output={"6\n4"}
          />
          <Typography.Text>
            Для запрета на 6 добавляем базовый случай, который возвращает 0 для
            запрещённого состояния:
          </Typography.Text>
          <CodeBlock
            code={
              "def g(x, y):\n    if x == 6 or x > y:\n        return 0\n    if x == y:\n        return 1\n    return g(x + 1, y) + g(x * 2, y)\n\nprint(g(2, 12))"
            }
            label={
              "Для запрета на 6 добавляем базовый случай, который возвращает 0 для запрещённого состояния"
            }
            language="python"
            output={"4"}
          />
          <Typography.Text>
            <PythonTerm term="andor">
              <Notation>{"or"}</Notation>
            </PythonTerm>{" "}
            — «или»: ноль возвращается, если выполнено хотя бы одно из двух
            условий. Проверку запрета ставим перед проверкой достижения цели.
            Тогда запрещённая цель даст 0. Если первой проверить{" "}
            <Notation>{"x == y"}</Notation>, запрещённая цель ошибочно будет
            принята как успешный конец.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapominanie-rezultatov",
      navLabel: "Запоминание результатов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Запоминание результатов избавляет от повторного подсчёта
              одинаковых вопросов, но не убирает программы.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Рекурсия раскрывает дерево и может многократно считать один и тот же
            вопрос. Чем больше цель, тем больше повторов. Мы можем сохранить
            ответ для каждой пары x и y: при следующем таком же вопросе Python
            возьмёт готовый результат. В Python для этого есть{" "}
            <PythonTerm term="cache">
              <Notation>{"@cache"}</Notation>
            </PythonTerm>{" "}
            из модуля{" "}
            <ExternalLink href="https://docs.python.org/3/library/functools.html#functools.cache">
              functools
            </ExternalLink>
            .
          </Typography.Text>
          <Typography.Text>
            Для задачи 2 → 20 через 6 без 9 полный код выглядит так:
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n@cache\ndef h(x, y):\n    if x == 9 or x > y:\n        return 0\n    if x == y:\n        return 1\n    return h(x + 1, y) + h(x * 2, y)\n\nprint(h(2, 6) * h(6, 20))"
            }
            label={"Для задачи 2 → 20 через 6 без 9 полный код выглядит так"}
            language="python"
            output={"9"}
          />
          <Typography.Text>
            Можно использовать одну функцию для двух участков, потому что цель y
            является аргументом. Вопрос h(6, 6) отличается от вопроса h(6, 20),
            и ответы сохраняются отдельно.
          </Typography.Text>
          <Typography.Text>
            Предположим, из 4 в 6 одна программа. Если в 4 можно прийти двумя
            разными путями, эта одна программа-продолжение нужна для обоих
            путей. Кэш возвращает число 1 дважды в двух местах суммы. Он
            устраняет повторное вычисление, но не устраняет повторное
            использование результата.
          </Typography.Text>
          <Typography.Text>
            Если функция использует внешний запрет, а затем ты меняешь запрет
            без изменения аргументов и без очистки сохранённых ответов, ранее
            вычисленные значения станут неверными для новых условий. Либо
            определяй новую функцию для новой задачи, либо очищай сохранённые
            результаты командой <Notation>{"h.cache_clear()"}</Notation>, либо
            передавай ограничения аргументами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ubyvanie-v-kode",
      navLabel: "Убывание в коде",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Убывающий исполнитель в коде отличается только направлением: ветка
              безуспешна, когда x {"<"} y.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "from functools import cache\n\n@cache\ndef down(x, y):\n    if x < y:\n        return 0\n    if x == y:\n        return 1\n    result = down(x - 1, y)\n    if x % 2 == 0:\n        result += down(x // 2, y)\n    return result\n\nprint(down(12, 2))"
            }
            label={
              "Убывающий исполнитель в коде отличается только направлением: ветка безуспешна, когда x < y"
            }
            language="python"
            output={"10"}
          />
          <Typography.Text>
            Точное деление добавляется только для чётного числа:{" "}
            <Notation>{"x % 2 == 0"}</Notation> —{" "}
            <PythonTerm term="intdiv">остаток</PythonTerm> от деления на 2 равен
            нулю, после этой проверки <Notation>{"x // 2"}</Notation> даёт
            точный результат. Если команда делит нацело любое число, условие
            чётности убирают — получится другой исполнитель (19 программ,
            подтема 5).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tablichnyj-cikl",
      navLabel: "Табличный цикл",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Табличный цикл — та же таблица, что на бумаге: список, где номер
              ячейки совпадает с числом исполнителя.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Даже с запоминанием цепочка вызовов при команде «+1» может быть
            очень длинной. Python ограничивает глубину вложенных вызовов, и при
            большой цели рекурсия завершится ошибкой{" "}
            <Notation>{"RecursionError"}</Notation> (
            <ExternalLink href="https://docs.python.org/3/library/sys.html#sys.setrecursionlimit">
              ограничение глубины
            </ExternalLink>
            ). Табличный вариант идёт циклом и такой цепочки не создаёт.
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="list">Список</PythonTerm>{" "}
            <Notation>{"[0] * (finish + 1)"}</Notation> создаёт finish + 1
            нулевых ячеек с индексами от 0 до finish;{" "}
            <Notation>{"dp[6]"}</Notation> хранит количество программ, которые
            привели в число 6.
          </Typography.Text>
          <CodeBlock
            code={
              "def count_programs(start, finish, forbidden=()):\n    if start > finish:\n        return 0\n    if start in forbidden or finish in forbidden:\n        return 0\n\n    dp = [0] * (finish + 1)\n    dp[start] = 1\n\n    for x in range(start, finish + 1):\n        if x in forbidden:\n            continue\n        for next_x in (x + 1, x * 2):\n            if next_x <= finish and next_x not in forbidden:\n                dp[next_x] += dp[x]\n\n    return dp[finish]\n\nprint(count_programs(2, 12))\nprint(count_programs(2, 12, (6,)))\nprint(count_programs(2, 6) * count_programs(6, 12))\nprint(count_programs(2, 6, (9,)) *\n      count_programs(6, 20, (9,)))"
            }
            label={
              "Код на Python: def count_programs(start, finish, forbidden=()):"
            }
            language="python"
            output={"10\n4\n6\n9"}
          />
          <Typography.Text>
            Цикл переносит количество вперёд — по исходящим переходам, как во
            втором способе подтемы 2.{" "}
            <Notation>{"for next_x in (x + 1, x * 2)"}</Notation> по очереди
            берёт результаты первой и второй команд;{" "}
            <PythonTerm term="tuple">кортеж</PythonTerm> сохраняет повторения, и
            если обе команды дали одинаковое число, оно будет обработано дважды
            — что правильно. Кортеж из одного элемента записывается{" "}
            <Notation>{"(6,)"}</Notation> с запятой.{" "}
            <PythonTerm term="continue">
              <Notation>{"continue"}</Notation>
            </PythonTerm>{" "}
            пропускает запрещённое x: способы из него дальше не
            распространяются.
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="augassign">
              <Notation>{"dp[next_x] += dp[x]"}</Notation>
            </PythonTerm>{" "}
            прибавляет новые способы к старым. Простое присваивание{" "}
            <Notation>{"dp[next_x] = dp[x]"}</Notation> уничтожило бы способы,
            пришедшие ранее по другим переходам.
          </Typography.Text>
          <Typography.Text>
            Все команды увеличивают число. Значит, все способы, которые могли
            привести к x, пришли из меньших чисел, и к моменту обработки x они
            уже обработаны. Если начать с больших чисел, часть способов до x ещё
            не будет подсчитана.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vhodyashchie-perehody",
      navLabel: "Входящие переходы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Таблицу можно заполнять и по входящим переходам — это прямой
              перенос ручной формулы.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "start = 2\nfinish = 12\ndp = [0] * (finish + 1)\ndp[start] = 1\n\nfor n in range(start + 1, finish + 1):\n    dp[n] = dp[n - 1]\n    if n % 2 == 0:\n        dp[n] += dp[n // 2]\n\nprint(dp[finish])"
            }
            label={
              "Таблицу можно заполнять и по входящим переходам — это прямой перенос ручной формулы"
            }
            language="python"
            output={"10"}
          />
          <Typography.Text>
            Ячейки ниже start остаются нулевыми и автоматически дают нулевой
            вклад. Нельзя заменить условие делимости безусловным{" "}
            <Notation>{"dp[n // 2]"}</Notation>: для нечётного n это добавило бы
            переход от округлённого вниз числа, которое умножением на 2 не даёт
            n.
          </Typography.Text>
          <Typography.Text>
            В Python отрицательный индекс допустим и означает обращение с конца
            списка: <Notation>{"dp[-1]"}</Notation> — последняя ячейка. Поэтому
            при формуле с n − 2 или n − 3 нужно защищаться от отрицательных
            индексов, если они возможны. Математическое соглашение «значения
            ниже старта равны нулю» язык сам не применяет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uslovnaya-komanda-v-cikle",
      navLabel: "Условная команда в цикле",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для условной команды в цикле сначала собирают список разрешённых
              результатов, потом переносят количество по каждому.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Цифра единиц числа — <Notation>{"x % 10"}</Notation>, цифра десятков
            — <Notation>{"(x // 10) % 10"}</Notation>. Перестановка разрешена
            только при t {"<"} u и даёт <Notation>{"x + 9 * (u - t)"}</Notation>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "start, finish = 10, 24\ndp = [0] * (finish + 1)\ndp[start] = 1\nfor x in range(start, finish + 1):\n    results = [x + 1]\n    t, u = (x // 10) % 10, x % 10\n    if t < u:\n        results.append(x + 9 * (u - t))\n    for y in results:\n        if y <= finish:\n            dp[y] += dp[x]\nprint(dp[finish])"
            }
            label={
              "Перестановка разрешена только при t < u и даёт x + 9 * (u - t)"
            }
            language="python"
            output={"2"}
          />
          <Typography.Text>
            Столько же, сколько в ручном разборе подтемы 4: 14 команд «+1» или
            программа через 12 → 21.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "w-n-i-f-x-y",
      navLabel: "W(n) и f(x, y)",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              W(n) из таблицы и f(x, y) из рекурсии отвечают на разные вопросы —
              от старта до n и от x до цели.
            </strong>
          </Typography.Text>
          <Typography.Text>
            W(n) в ручной таблице отвечает на вопрос «сколько программ от
            фиксированного старта до n?». Рекурсивная f(x, y) отвечает на вопрос
            «сколько продолжений из x до фиксированной цели y?».
          </Typography.Text>
          <Typography.Text>
            Первая формула смотрит на последнюю команду и предшественников.
            Вторая — на первую команду продолжения и следующие числа. Оба
            способа считают одни и те же полные программы, но значения
            промежуточных функций имеют разный смысл.
          </Typography.Text>
          <Typography.Text>
            Для пути 2 → 6 мы получали W(4) = 2: из 2 в 4 две программы. При
            этом f(4, 6) = 1: из 4 в 6 одно продолжение. Противоречия нет, это
            разные участки пути. Нельзя подставлять W(4) вместо f(4, 6) просто
            потому, что в записи появилось одно и то же число 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vychislenie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Число на экране и количество программ — разные переменные.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Рекурсия: f(x, y) — сумма по первой команде; базовые случаи
                    — перепрыгнули цель (0) и достигли (1); запрет проверяют до
                    достижения.
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"@cache"}</Notation> убирает повторное
                    вычисление, но не повторное использование; при смене условий
                    кэш очищают.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Табличный цикл: список по номерам чисел, порядок обработки —
                    по направлению команд, вклады прибавляют{" "}
                    <Notation>{"+="}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Условная команда: список разрешённых результатов для каждого
                    x.
                  </>
                ),
              },
              {
                note: (
                  <>
                    W(n) — от старта, f(x, y) — до цели; программа проверяет
                    ручной ответ.
                  </>
                ),
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
          Что вернёт <Notation>{"f(4, 4)"}</Notation> и почему это не ноль?
        </>
      ),
      reveal: <>1: x == y — одна пустая программа-продолжение.</>,
    },
  ],
};

export default content;
