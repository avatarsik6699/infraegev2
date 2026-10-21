// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { CourseTypes } from "../course.types";
import { lessonMedia } from "./excel-neighbour-cells.paid.media";

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Расходы по дням нужно превратить в «сколько потрачено к этому дню»:
            итог каждого дня — итог предыдущего плюс новый расход. Формула
            здесь берёт не только исходные данные.{" "}
            <strong>
              Формула может опираться на уже вычисленные ячейки — соседние или
              далёкие; так таблица строит новый результат из предыдущего
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём накопленную сумму, соседние пары, сетку путей и порядок
            пересчёта.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Накопленная сумма",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Накопленная сумма: каждая следующая ячейка — предыдущий результат
              плюс новый элемент.
            </strong>{" "}
            Если <Notation>{"A2:A10"}</Notation> — ежедневные расходы, в{" "}
            <Notation>{"B2"}</Notation> можно записать{" "}
            <Notation>{"=A2"}</Notation>, а в <Notation>{"B3"}</Notation> —{" "}
            <Notation>{"=B2+A3"}</Notation>. После заполнения вниз B содержит
            накопленные расходы.
          </Typography.Text>
          <Typography.Text>
            Другой вариант: <Notation>{"=СУММ($A$2:A2)"}</Notation> с
            заполнением вниз. Начало диапазона закреплено, конец расширяется.
            Закреплённая и незакреплённая части одного диапазона здесь играют
            разные роли.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Расходы»"} />
          <Typography.Text>
            Выбери <Notation>{"B4"}</Notation>: рамки стоят на{" "}
            <Notation>{"B3"}</Notation> — уже вычисленной ячейке — и на{" "}
            <Notation>{"A4"}</Notation>. А у <Notation>{"C4"}</Notation> рамка
            охватывает <Notation>{"A2:A4"}</Notation>: закреплённое начало и
            сдвинувшийся конец. Поменяй расход во второй строке — пересчитается
            всё ниже.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Соседние пары",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Формула для пары соседей берёт свою строку и следующую, поэтому её
              заполняют на одну строку меньше.
            </strong>{" "}
            Если в <Notation>{"A2:A100"}</Notation> записана последовательность
            из 99 чисел, соседних пар 98: первая <Notation>{"A2"}</Notation> и{" "}
            <Notation>{"A3"}</Notation>, последняя <Notation>{"A99"}</Notation>{" "}
            и <Notation>{"A100"}</Notation>. Формулу для пары заполняют до строки
            99, а не до 100 — иначе появится лишняя пара с пустой ячейкой за
            концом данных.
          </Typography.Text>
          <Typography.Text>
            Для условия «хотя бы одно число пары делится на 3» в{" "}
            <Notation>{"B2"}</Notation> можно написать{" "}
            <Notation>{"=ЕСЛИ(ИЛИ(ОСТАТ(A2;3)=0;ОСТАТ(A3;3)=0);1;0)"}</Notation>
            , рядом — сумма пары <Notation>{"=A2+A3"}</Notation>. Пары
            перекрываются: каждое число, кроме крайних, входит в две.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.pairsArcs3_4480d9}
            caption={
              <>
                Шесть чисел — пять пар. Формула пары стоит в строке её первого
                числа; выделены пары, где есть кратное 3.
              </>
            }
          />
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Пары»"} />
          <Typography.Text>
            Шесть чисел — пять пар, формулы стоят в строках 2–6, а строка 7
            только участвует как вторая половина последней пары.
          </Typography.Text>
          <Typography.Text>
            Номер строки, где стоит формула, даёт функция{" "}
            <Notation>{"СТРОКА()"}</Notation> без аргументов. Её удобно
            возвращать вместо 1 в признаке: тогда <Notation>{"МИН"}</Notation>{" "}
            находит первую подходящую строку, <Notation>{"МАКС"}</Notation> —
            последнюю. Пустой текст <Notation>{'""'}</Notation> в неподходящих
            строках функции <Notation>{"МИН"}</Notation> и{" "}
            <Notation>{"МАКС"}</Notation> пропускают. Это ответ на вопрос «в
            какой строке», который количество подходящих строк не даёт.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Таблица из таблицы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Таблица из таблицы: внутренняя ячейка считается из уже вычисленных
              соседей слева и сверху, а крайние — отдельными формулами.
            </strong>{" "}
            Сколькими способами можно пройти из верхней левой клетки сетки в
            каждую другую, если шагать только вправо и вниз? В клетку можно
            прийти только слева или сверху, поэтому число способов — сумма
            способов для этих двух соседей. В верхней строке и левом столбце
            сосед один, туда ведёт ровно один путь.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.gridPaths4_4_df1451}
            label={"Сетка путей заполняется клетка за клеткой"}
          />
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Пути»"} />
          <Typography.Text>
            Внутренняя формула написана один раз —{" "}
            <Notation>{"=A2+B1"}</Notation> в <Notation>{"B2"}</Notation> — и
            скопирована на прямоугольник <Notation>{"B2:D4"}</Notation>. Ссылки
            относительные, поэтому в каждой клетке они указывают на её соседа
            слева и соседа сверху. Выбери <Notation>{"C3"}</Notation>: рамки на{" "}
            <Notation>{"B3"}</Notation> и <Notation>{"C2"}</Notation>. Крайние
            клетки нельзя считать той же формулой — у них нет соседа слева или
            сверху; для них отдельные формулы в первой строке и первом столбце.
          </Typography.Text>
          <Typography.Text>
            Тот же приём — новая таблица того же размера, где клетка вычисляется
            из соседних уже вычисленных клеток, — решает задачи о лучшем
            маршруте по полю: меняется только то, что в клетке хранится и как
            объединяются соседи. Эти задачи разбирает тема 18.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Порядок пересчёта",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ссылка может вести в любую строку; Excel сам считает ячейки в
              порядке зависимостей.
            </strong>{" "}
            Формулу не обязательно вычислять сверху вниз: ячейка может ссылаться
            на строку ниже, если там лежит нужное значение. Excel пересчитывает
            ячейки так, чтобы каждая вычислялась после тех, на которые она
            ссылается.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Этапы»"} />
          <Typography.Text>
            Покраска стоит первой строкой, но начинается после шпаклёвки из
            строки 4. Поменяй длительность подготовки — сдвинутся и шпаклёвка, и
            покраска. Если же формулы образуют круг (<Notation>{"C2"}</Notation>{" "}
            зависит от <Notation>{"D4"}</Notation>, а{" "}
            <Notation>{"D4"}</Notation> — от <Notation>{"C2"}</Notation>), Excel
            сообщит о циклической ссылке: такой расчёт не имеет начала.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Перебор вариантов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перебор вариантов — строки таблицы: каждый набор значений в своей
              строке, формула проверяет его.
            </strong>{" "}
            При двух логических переменных есть четыре набора 0/1: 00, 01, 10,
            11. Их можно занести в строки и вычислить выражение по каждому
            набору. При n переменных наборов 2^n, потому что каждая переменная
            имеет два независимых варианта.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Наборы»"} />
          <Typography.Text>
            Такой перебор помогает проверять логические идеи, но количество
            строк быстро растёт. Аналогично можно перечислять кандидаты на
            параметр и вычислять признак пригодности. Конечный перебор требует
            обоснованных границ: проверка первых тысячи чисел не доказывает
            утверждение обо всех натуральных числах.
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
            В <Notation>{"A2:A51"}</Notation> — 50 чисел. Сколько соседних пар
            и до какой строки заполнять формулу пары из{" "}
            <Notation>{"B2"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            49 пар; последняя — <Notation>{"A50"}</Notation> и{" "}
            <Notation>{"A51"}</Notation>, поэтому формулу заполняют до{" "}
            <Notation>{"B50"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            В сетке путей в клетку слева ведут 4 пути, в клетку сверху — 6.
            Сколько путей ведёт в эту клетку?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            10: каждый путь приходит либо слева, либо сверху, 4 + 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"B2"}</Notation> записано{" "}
            <Notation>{"=СУММ($A$2:A2)"}</Notation> и скопировано вниз. Какая
            формула окажется в <Notation>{"B7"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=СУММ($A$2:A7)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"C2"}</Notation> записано{" "}
            <Notation>{"=D4"}</Notation>, а в <Notation>{"D4"}</Notation> —{" "}
            <Notation>{"=C2+1"}</Notation>. Что сообщит Excel?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Циклическую ссылку: каждая ячейка ждёт другую, и расчёту не с чего
            начаться.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Почему в сетке путей нельзя скопировать внутреннюю формулу{" "}
            <Notation>{"=A2+B1"}</Notation> и в первую строку?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            У клеток первой строки нет соседа сверху: формула сослалась бы на
            строку выше сетки — на пустую ячейку или за край листа.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Таблица удобна, когда каждая ячейка зависит от немногих соседей, а
        промежуточные результаты полезно видеть. Длинный перебор, большие
        числа и сложные структуры проще решать программой — об этом курс
        Python. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Накопление",
            note: (
              <>
                <Notation>{"=B2+A3"}</Notation> вниз или{" "}
                <Notation>{"=СУММ($A$2:A2)"}</Notation> с закреплённым началом.
              </>
            ),
          },
          {
            key: "Пары",
            note: (
              <>
                n чисел — n − 1 пар; формулу пары заполняют на строку меньше.
              </>
            ),
          },
          {
            key: "СТРОКА()",
            note: (
              <>
                Номер строки формулы; с <Notation>{"МИН"}</Notation> и{" "}
                <Notation>{"МАКС"}</Notation> — первая и последняя подходящие.
              </>
            ),
          },
          {
            key: "Сетка",
            note: (
              <>
                Внутренняя клетка — из готовых соседей, крайние — своими
                формулами.
              </>
            ),
          },
          {
            key: "Пересчёт",
            note: (
              <>Excel идёт по зависимостям; круговая ссылка — ошибка.</>
            ),
          },
        ]}
      />
    </>
  ),
};

export default content;
