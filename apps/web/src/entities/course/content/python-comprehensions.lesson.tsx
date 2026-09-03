import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonComprehensionsLessonPublication } from "./course-publication.mjs";

export const pythonComprehensionsLesson = defineCourseLesson({
  ...pythonComprehensionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать включение в том же порядке, что обычный цикл",
    "Преобразовывать и фильтровать элементы",
    "Создавать списки, множества и словари",
    "Оставлять сложную логику в обычном цикле",
  ],
  practiceTaskIds: pythonComprehensionsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "from-loop",
      navLabel: "Включение сжимает знакомый цикл",
      explanation: (
        <>
          <Typography.Text>
            Мы уже умеем создать пустой список, пройти исходные значения циклом
            и добавить результат через append. Когда этот путь состоит из одного
            понятного преобразования, Python позволяет записать его короче.
            Такую запись называют включением.
          </Typography.Text>
          <CodeBlock
            code={
              "squares = []\nfor number in range(1, 5):\n    squares.append(number ** 2)\n\nshort_squares = [number ** 2 for number in range(1, 5)]"
            }
            label="Один результат двумя записями"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Короткую запись удобно мысленно разворачивать обратно в цикл: берём
            <Notation>number</Notation> из <Notation>range</Notation>, вычисляем
            его квадрат и помещаем результат в новый список. Если это объяснение
            перестаёт быть простым, обычный цикл будет лучше.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "filter",
      navLabel: "Условие оставляет только подходящие элементы",
      explanation: (
        <>
          <Typography.Text>
            Фильтр добавляют в конец включения после части for. Он решает, для
            каких исходных элементов вычислять выражение результата, а какие
            пропустить.
          </Typography.Text>
          <WorkedExample
            title="Выберем квадраты чётных чисел"
            prompt="Исходные числа равны 1, 2, 3, 4 и 5."
            steps={[
              "for последовательно получает каждое число.",
              "Условие number % 2 == 0 пропускает 1, 3 и 5.",
              "Для 2 и 4 вычисляется квадрат.",
              "Новый список равен [4, 16].",
            ]}
          />
          <CodeBlock
            code={
              "even_squares = [\n    number ** 2\n    for number in range(1, 6)\n    if number % 2 == 0\n]\nprint(even_squares)"
            }
            label="Преобразование с фильтром"
            language="python"
            showLineNumbers
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-filter",
          prompt:
            "Что произойдёт раньше: проверка чётности или возведение выбранного числа в квадрат?",
          reveal:
            "Сначала условие решает, подходит ли число; выражение результата вычисляется только для подходящих значений.",
        },
      ],
    },
    {
      id: "kinds",
      navLabel: "Форма скобок определяет коллекцию",
      explanation: (
        <>
          <Typography.Text>
            Один и тот же знакомый проход может собирать разные коллекции.
            Квадратные скобки создают список, фигурные с одним выражением —
            множество, а фигурные с парой <Notation>ключ: значение</Notation> —
            словарь. Форму выбирают по требуемому результату, а не ради
            краткости.
          </Typography.Text>
          <CodeBlock
            code={
              'words = ["мир", "код", "мир"]\nlengths = {word: len(word) for word in words}\nunique_lengths = {len(word) for word in words}\nprint(lengths)\nprint(unique_lengths)'
            }
            label="Словарь и множество"
            language="python"
            showLineNumbers
          />
          <Mistake
            claim="Любой цикл лучше переписать как включение: так код будет профессиональнее."
            explanation="Включение полезно для одного понятного преобразования и, возможно, одного фильтра. Несколько ветвей, побочные эффекты и вложенная логика яснее остаются обычным циклом."
          />
        </>
      ),
    },
    {
      id: "decision",
      navLabel: "Краткость не должна прятать ход решения",
      explanation: (
        <Procedure
          title="Проверяем, подходит ли включение"
          steps={[
            {
              label: "Назовите новую коллекцию.",
              detail: "Список, множество или словарь?",
            },
            {
              label: "Найдите один источник.",
              detail: "Какие элементы перебираются?",
            },
            {
              label: "Запишите одно преобразование.",
              detail: "Что попадёт в результат?",
            },
            {
              label: "Добавьте простой фильтр.",
              detail: "Только если часть элементов нужно пропустить.",
            },
            {
              label: "Разверните при сомнении.",
              detail: "Если запись трудно объяснить как цикл, оставьте цикл.",
            },
          ]}
        />
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-result",
      prompt:
        "Чем множество-включение отличается от спискового при повторяющихся результатах?",
      reveal:
        "Множество оставляет только уникальные значения, список сохраняет все результаты и их порядок.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Вы умеете узнавать во включении обычный цикл и использовать короткую
        запись только там, где она остаётся прозрачной.
      </Typography.Text>
      <Typography.Text>
        Дальше функции помогут дать вычислениям имена, а затем мы разберём,
        откуда цикл вообще получает очередной элемент.
      </Typography.Text>
    </>
  ),
});
