import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonConditionsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-conditions.media";

export const pythonConditionsLesson = defineCourseLesson({
  ...pythonConditionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Выбирать порядок проверок", "Искать максимум"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В прошлом уроке условия давали ответ <Notation>{"True"}</Notation>{" "}
            или <Notation>{"False"}</Notation>.{" "}
            <strong>
              Теперь программа будет по этому ответу выбирать, какие строки
              выполнять: это делает инструкция <Notation>{"if"}</Notation>
            </strong>
            . Начнём с одной проверки, соберём цепочку из нескольких, а в конце
            начнём новую сквозную задачу курса — сумму и наибольшее из
            нескольких чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "if и else",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"if"}</Notation> выполняет блок строк, только если
              условие истинно.
            </strong>{" "}
            Пусть доставка стоит 300 рублей, но при заказе от 2000 рублей она
            бесплатна:
          </Typography.Text>
          <CodeBlock
            code={
              "order_total = 2400\ndelivery = 300\nif order_total >= 2000:\n    delivery = 0\nprint(delivery)"
            }
            label={"if выполняет блок строк, только если условие истинно"}
            language="python"
            fileName="main.py"
            output={"0"}
          />
          <Typography.Text>
            Строка с <Notation>{"if"}</Notation> заканчивается двоеточием.
            Строки под ней с отступом в четыре пробела — это{" "}
            <strong>блок</strong>: они выполняются, только если условие истинно.
            Строка без отступа после блока — уже не часть{" "}
            <Notation>{"if"}</Notation>:{" "}
            <Notation>{"print(delivery)"}</Notation> выполняется всегда. При
            сумме 1500 блок пропускается, и программа напечатает 300.
          </Typography.Text>
          <Typography.Text>
            Когда нужно выбрать одно из двух действий, добавляют{" "}
            <Notation>{"else"}</Notation> — «иначе»:
          </Typography.Text>
          <CodeBlock
            code={
              "order_total = 1500\nif order_total >= 2000:\n    delivery = 0\nelse:\n    delivery = 300\nprint(delivery)"
            }
            label={"Когда нужно выбрать одно из двух действий, добавляют else"}
            language="python"
            fileName="main.py"
            output={"300"}
          />
          <Typography.Text>
            Блок <Notation>{"else"}</Notation> выполняется, когда условие{" "}
            <Notation>{"if"}</Notation> ложно. Из двух блоков выполняется ровно
            один:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codePathsElse}
            caption={
              <>
                Точкой отмечены выполненные строки. При сумме 2400 условие
                истинно: выполнен блок <Notation>{"if"}</Notation>, блок{" "}
                <Notation>{"else"}</Notation> пропущен. При 1500 — наоборот.
                Строка <Notation>{"print"}</Notation> без отступа выполняется в
                обоих случаях.
              </>
            }
          />
          <Typography.Text>
            <strong>Отступ — часть смысла программы.</strong> По нему Python
            понимает, где кончается блок. В PyCharm после двоеточия нажми Enter
            — отступ появится сам; клавиша Tab вставляет те же четыре пробела.
            Если отступ пропустить, Python остановится ещё до запуска — это
            синтаксическая ошибка из первого урока:
          </Typography.Text>
          <CodeBlock
            code={'if 5 > 3:\nprint("да")'}
            label={"Если отступ пропустить, Python остановится ещё до запуска"}
            language="python"
            fileName="main.py"
            error={
              "IndentationError: expected an indented block after 'if' statement on line 1"
            }
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Цепочка elif",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"elif"}</Notation> проверяет следующий случай, только
              если предыдущие не подошли.
            </strong>{" "}
            Уровень ученика по баллу: от 85 — высокий, от 60 — средний, ниже —
            начальный. Нажми «Запуск» в шапке примера и пройди программу по
            шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runLevel}
            label={
              "elif проверяет следующий случай, только если предыдущие не подошли"
            }
          />
          <Typography.Text>
            <Notation>{"elif"}</Notation> — «иначе если»: следующая проверка,
            если предыдущие не подошли. Проверка{" "}
            <Notation>{"score >= 85"}</Notation> дала{" "}
            <Notation>{"False"}</Notation>, <Notation>{"score >= 60"}</Notation>{" "}
            — <Notation>{"True"}</Notation>, и до <Notation>{"else"}</Notation>{" "}
            дело уже не дошло. Цепочка выбирает ровно одну ветку. Во вторую
            ветку попадают баллы от 60 до 84: верхняя граница следует из того,
            что первая проверка не прошла. Проверим границы:
          </Typography.Text>
          <LessonTable
            label="Уровень на границах"
            columns={[
              { label: "Балл", numeric: true },
              { label: "Уровень" },
              { label: "Почему" },
            ]}
            rows={[
              [
                "85",
                "высокий",
                <>
                  <Notation>{">="}</Notation> включает саму границу
                </>,
              ],
              ["84", "средний", "первая проверка не прошла, вторая прошла"],
              ["60", "средний", "граница второй проверки"],
              ["59", "начальный", "не прошла ни одна проверка"],
            ]}
          />
          <Typography.Text>
            Если сначала проверить <Notation>{"score >= 60"}</Notation>, а потом{" "}
            <Notation>{"score >= 85"}</Notation>, высокий балл захватит первая
            ветка: для 90 получится «средний», а ветка «высокий» не выполнится
            никогда. Поэтому порядок проверок выводят из условий: от самой
            строгой к самой мягкой.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.branch73_90}
            caption={
              <>
                Слева балл 73 проходит проверки сверху вниз: первая даёт «нет»,
                вторая — «да», остальное не рассматривается. Справа проверки
                переставлены: балл 90 уходит в «средний» на первой же проверке,
                и до «высокий» не доходит никакой балл.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Отдельные if",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если у значения может быть несколько признаков сразу, нужны
              отдельные <Notation>{"if"}</Notation>.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'n = 12\nif n % 2 == 0:\n    print("чётное")\nif n % 3 == 0:\n    print("делится на 3")'
            }
            label={
              "Если у значения может быть несколько признаков сразу, нужны отдельные if"
            }
            language="python"
            fileName="main.py"
            output={"чётное\nделится на 3"}
          />
          <Typography.Text>
            Будут напечатаны обе строки: каждая проверка независима. Если
            заменить второй <Notation>{"if"}</Notation> на{" "}
            <Notation>{"elif"}</Notation>, после успешной первой проверки вторая
            даже не выполнится: цепочка <Notation>{"if"}</Notation>–
            <Notation>{"elif"}</Notation> выбирает не больше одной ветки.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codePathsElif}
            caption={
              <>
                Одна и та же проверка для <Notation>{"n = 12"}</Notation>. Слева
                два отдельных <Notation>{"if"}</Notation>: выполнены обе ветки.
                Справа <Notation>{"elif"}</Notation>: первая ветка сработала, и
                вторая проверка пропущена.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Значение на каждом пути",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Имя должно получить значение на каждом пути, где оно понадобится.
            </strong>{" "}
            Здесь <Notation>{"result"}</Notation> получает значение и в ветке{" "}
            <Notation>{"if"}</Notation>, и в ветке <Notation>{"else"}</Notation>
            :
          </Typography.Text>
          <CodeBlock
            code={
              'x = -2\nif x > 0:\n    result = "положительное"\nelse:\n    result = "неположительное"\nprint(result)'
            }
            label={
              "Здесь result получает значение и в ветке if, и в ветке else"
            }
            language="python"
            fileName="main.py"
            output={"неположительное"}
          />
          <Typography.Text>
            Если убрать <Notation>{"else"}</Notation>, при{" "}
            <Notation>{"x = -2"}</Notation> присваивание не выполнится, и имени{" "}
            <Notation>{"result"}</Notation> не будет:
          </Typography.Text>
          <CodeBlock
            code={
              'x = -2\nif x > 0:\n    result = "положительное"\nprint(result)'
            }
            label={"Если убрать else, имени result не будет"}
            language="python"
            fileName="main.py"
            error={"NameError: name 'result' is not defined"}
          />
          <Typography.Text>
            Для простого выбора одного из двух значений есть{" "}
            <strong>условное выражение</strong>{" "}
            <Notation>{"значение if условие else другое"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"x = -2\nabsolute = x if x >= 0 else -x\nprint(absolute)"}
            label={"Для простого выбора значения есть условное выражение"}
            language="python"
            fileName="main.py"
            output={"2"}
          />
          <Typography.Text>
            Сначала проверяется условие, затем вычисляется только выбранная
            часть. Для действий из нескольких строк обычный{" "}
            <Notation>{"if"}</Notation> читается лучше.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Сквозная задача",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Новая сквозная задача курса: сумма и наибольшее из нескольких
              чисел.
            </strong>{" "}
            Модуль 1 шёл на тетрадях. С этого урока через весь курс пройдёт
            другая задача: найти сумму и наибольшее из чисел 5, −2, 10, 7. С
            каждым модулем решение будет короче, а данных — больше. Сейчас у нас
            есть только переменные и <Notation>{"if"}</Notation>, поэтому каждое
            число получает своё имя.
          </Typography.Text>
          <Typography.Text>
            Сумма — просто выражение. Наибольшее ищут так: первое число
            запоминают как лучшее, а каждое следующее сравнивают с лучшим и,
            если оно больше, делают лучшим его. Пройди программу по шагам и
            следи за <Notation>{"best"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runTotal}
            label={"Сумма и наибольшее из чисел 5, −2, 10, 7"}
          />
          <Typography.Text>
            Здесь нужны отдельные <Notation>{"if"}</Notation>, а не{" "}
            <Notation>{"elif"}</Notation>: каждое число сравнивается с лучшим на
            данный момент, и проверить нужно все. Для тысячи чисел так писать
            нельзя: понадобилась бы тысяча имён и тысяча{" "}
            <Notation>{"if"}</Notation>. Это решат циклы следующего модуля.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Начало — из данных",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Лучшее начинают с первого числа данных, а не с нуля.
            </strong>{" "}
            Проверим на отрицательных числах:
          </Typography.Text>
          <CodeBlock
            code={
              "a = -5\nb = -2\nc = -9\nbest = a\nif b > best:\n    best = b\nif c > best:\n    best = c\nprint(best)"
            }
            label={"Лучшее начинают с первого числа данных, а не с нуля"}
            language="python"
            fileName="main.py"
            output={"-2"}
          />
          <Typography.Text>
            Если начать с <Notation>{"best = 0"}</Notation>, все отрицательные
            числа проиграют нулю, которого среди данных нет: программа
            напечатала бы 0. Равные числа тоже не мешают: при равенстве{" "}
            <Notation>{">"}</Notation> не срабатывает, и лучшим остаётся
            прежнее.
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
          <Typography.Text>Что напечатает программа?</Typography.Text>
          <CodeBlock
            code={'x = 5\nif x > 10:\n    print("много")\nprint("готово")'}
            label={"Программа с одним if"}
            language="python"
            fileName="main.py"
          />
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Только «готово»: условие ложно, блок пропущен, а{" "}
            <Notation>{'print("готово")'}</Notation> без отступа выполняется
            всегда.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Найди наибольшее из чисел 4, 4 и −1 программой из урока. Что
            изменится, если начать <Notation>{"best"}</Notation> с нуля, а числа
            будут −5, −2 и −9?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            4. С нулевым началом для −5, −2, −9 получится 0 вместо −2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            При <Notation>{"n = 30"}</Notation> что напечатает программа с двумя
            отдельными <Notation>{"if"}</Notation> из урока? А если второй{" "}
            <Notation>{"if"}</Notation> заменить на{" "}
            <Notation>{"elif"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Обе строки: «чётное» и «делится на 3». С{" "}
            <Notation>{"elif"}</Notation> — только «чётное».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            В цепочке переставили проверки: сначала{" "}
            <Notation>{"score >= 60"}</Notation>, потом{" "}
            <Notation>{"score >= 85"}</Notation>. Какой уровень получат баллы 59
            и 100? При каком балле получится «высокий»?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Начальный и средний. «Высокий» не получится ни при каком балле: до
            проверки <Notation>{"score >= 85"}</Notation> доходят только баллы
            меньше 60.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Запиши условным выражением строку <Notation>{'"чётное"'}</Notation>{" "}
            или <Notation>{'"нечётное"'}</Notation> для числа{" "}
            <Notation>{"n"}</Notation> и вычисли её для 15.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'"чётное" if n % 2 == 0 else "нечётное"'}</Notation>; для
            15 — «нечётное».
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь программа умеет выбирать, какие строки выполнять. Вот что из
        этого понадобится в каждом следующем уроке.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"if"}</Notation>,
            note: (
              <>
                Выполняет блок с отступом, только если условие истинно; строка
                без отступа — уже после ветвления.
              </>
            ),
          },
          {
            key: <Notation>{"else"}</Notation>,
            note: <>Блок «иначе»: из двух блоков выполняется ровно один.</>,
          },
          {
            key: <Notation>{"elif"}</Notation>,
            note: (
              <>
                Следующая проверка, если предыдущие не подошли. Цепочка выбирает
                ровно одну ветку; проверки — от самой строгой.
              </>
            ),
          },
          {
            key: "Отдельные if",
            note: (
              <>
                Независимые признаки проверяют отдельными if: могут сработать
                оба.
              </>
            ),
          },
          {
            key: "Отступ",
            note: (
              <>
                Четыре пробела после двоеточия; пропуск —{" "}
                <Notation>{"IndentationError"}</Notation>.
              </>
            ),
          },
          {
            key: "Каждый путь",
            note: (
              <>
                Имя должно получить значение на каждом пути, иначе{" "}
                <Notation>{"NameError"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"a if c else b"}</Notation>,
            note: <>Условное выражение: выбор одного из двух значений.</>,
          },
          {
            key: "Наибольшее",
            note: (
              <>
                Лучшее — первое число данных; каждое следующее сравнивают с
                лучшим отдельным <Notation>{"if"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
