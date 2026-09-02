import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonNumbersLessonPublication } from "./course-publication.mjs";

export const pythonNumbersLesson = defineCourseLesson({
  ...pythonNumbersLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Различать целые и вещественные числа",
    "Предсказывать порядок действий в выражении",
    "Использовать обычное и целое деление, остаток и степень",
    "Преобразовывать введённый текст в нужный числовой тип",
  ],
  practiceTaskIds: pythonNumbersLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "types",
      navLabel: "Одно число может храниться по-разному",
      explanation: (
        <>
          <Typography.Text>
            В первой программе вы уже превращали введённый текст в число, чтобы
            выполнить вычисление. Теперь разберёмся, почему числа вроде
            <Notation> 12</Notation> и <Notation>12.0</Notation> выглядят
            похоже, но Python может хранить и обрабатывать их по-разному.
          </Typography.Text>
          <Typography.Text>
            Способ, которым Python хранит значение, называется его типом.
            Знакомая функция <Notation>input()</Notation> получает текст, а
            <Notation> int()</Notation> превращает подходящий текст в целое
            число. Для числа с дробной частью используют
            <Notation> float()</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              'count = int("12")\nprice = float("79.5")\nprint(count + 3)\nprint(price * 2)'
            }
            label="Два числовых типа"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            <Notation>int</Notation> хранит целое число, а{" "}
            <Notation>float</Notation> — число с дробной частью. Для количества
            задач обычно нужен <Notation>int</Notation>; для цены или измерения
            может понадобиться <Notation>float</Notation>. Тип помогает Python
            понять, какие действия с этим значением допустимы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "operations",
      navLabel: "Три вида деления и степень",
      explanation: (
        <>
          <Typography.Text>
            Когда числа уже сохранены в подходящем типе, остаётся выбрать
            действие по смыслу задачи. Знак действия в программе называют
            оператором. Операторы <Notation>/</Notation>,
            <Notation> //</Notation> и <Notation>%</Notation> связаны с
            делением, но отвечают на разные вопросы.
          </Typography.Text>
          <Typography.Text>
            Обычное деление <Notation>/</Notation> даёт частное, целое деление
            <Notation> //</Notation> показывает, сколько полных частей
            поместилось, а <Notation>%</Notation> возвращает то, что осталось.
            Посмотрим на одну ситуацию и сравним результаты.
          </Typography.Text>
          <WorkedExample
            title="Разделим 17 конфет между пятью людьми"
            prompt="Нужно найти размер одной полной порции и число оставшихся конфет."
            steps={[
              "17 // 5 равно 3: каждому можно дать три целые конфеты.",
              "17 % 5 равно 2: две конфеты останутся.",
              "17 / 5 равно 3.4: это математическое частное, а не готовая целая порция.",
              "Оператор ** возводит в степень: 5 ** 2 равно 25.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-division",
          prompt: "Что описывает выражение 23 % 10?",
          reveal:
            "Остаток от деления на 10 — последнюю цифру числа, то есть 3.",
        },
      ],
    },
    {
      id: "precedence",
      navLabel: "Python тоже соблюдает порядок действий",
      explanation: (
        <>
          <Typography.Text>
            В одном выражении может быть несколько операторов. Как и в школьной
            математике, Python соблюдает порядок действий: сначала выполняются
            скобки и степень, затем умножение и деление, после них сложение и
            вычитание.
          </Typography.Text>
          <CodeBlock
            code={
              "without_parentheses = 2 + 3 * 4\nwith_parentheses = (2 + 3) * 4\nprint(without_parentheses)\nprint(with_parentheses)"
            }
            label="Скобки меняют порядок"
            language="python"
            showLineNumbers
          />
          <Mistake
            claim="Python обязательно вычисляет выражение слева направо."
            explanation="Слева направо выполняются только операции одного приоритета. Умножение в выражении 2 + 3 * 4 произойдёт раньше сложения."
          />
          <Typography.Text>
            Если выражение приходится перечитывать, полезнее поставить скобки и
            сделать замысел видимым, даже когда Python получил бы тот же ответ
            без них.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить числовое выражение",
      explanation: (
        <>
          <Typography.Text>
            Теперь соберём типы, операторы и порядок действий в один способ
            проверки. Он помогает сначала объяснить ожидаемый результат, а уже
            затем подтвердить его запуском.
          </Typography.Text>
          <Procedure
            title="Не угадываем результат"
            steps={[
              {
                label: "Подпишите типы.",
                detail: "Где текст, целое или вещественное число?",
              },
              {
                label: "Отметьте скобки.",
                detail: "Они задают первый шаг вычисления.",
              },
              {
                label: "Разберите операции.",
                detail: "Отдельно вычислите степень, умножение и деление.",
              },
              {
                label: "Сверьте смысл.",
                detail:
                  "Целая порция, остаток и обычное частное не взаимозаменяемы.",
              },
              {
                label: "Запустите пример.",
                detail: "Сравните вывод с прогнозом, а не вместо прогноза.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-types",
      prompt:
        "Почему результат input() нельзя сразу складывать с целым числом?",
      reveal:
        "input() возвращает строку. Сначала её нужно явно преобразовать, например через int().",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь вы можете читать числовое выражение по шагам и выбирать операцию
        по смыслу задачи, а не по знакомому знаку.
      </Typography.Text>
      <Typography.Text>
        Следующий урок об ошибках покажет, как Python сообщает о несовместимых
        типах и неверном преобразовании введённого текста.
      </Typography.Text>
    </>
  ),
});
