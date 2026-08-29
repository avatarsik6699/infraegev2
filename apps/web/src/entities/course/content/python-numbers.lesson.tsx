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
            После первой программы у нас уже есть знакомый путь:{" "}
            <Notation>input()</Notation>
            получает текст, а <Notation>int()</Notation> превращает его в целое
            число. Это важно: Python выбирает допустимые операции не по внешнему
            виду значения, а по его типу.
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
            может понадобиться <Notation>float</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "operations",
      navLabel: "Четыре вида деления и степень",
      explanation: (
        <>
          <Typography.Text>
            Операторы <Notation>/</Notation>, <Notation>//</Notation> и{" "}
            <Notation>%</Notation>
            отвечают на разные вопросы. Обычное деление даёт частное, целое
            деление показывает, сколько полных частей поместилось, а остаток —
            что осталось.
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
            Сначала выполняются скобки и степень, затем умножение и деление,
            после них сложение и вычитание. Если выражение приходится
            перечитывать, полезнее поставить скобки и сделать замысел видимым,
            даже когда Python получил бы тот же ответ без них.
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
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить числовое выражение",
      explanation: (
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
