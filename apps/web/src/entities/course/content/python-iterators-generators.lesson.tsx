import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonIteratorsGeneratorsLessonPublication } from "./course-publication.mjs";

export const pythonIteratorsGeneratorsLesson = defineCourseLesson({
  ...pythonIteratorsGeneratorsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Различать итерируемый объект и итератор",
    "Объяснять, откуда for получает следующее значение",
    "Понимать одноразовое исчерпание итератора",
    "Создавать простой генератор с yield",
  ],
  practiceTaskIds: pythonIteratorsGeneratorsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "inside-for",
      navLabel: "for запрашивает значения по одному",
      explanation: (
        <>
          <Typography.Text>
            До сих пор цикл <Notation>for</Notation> сам получал очередной
            символ, число или элемент списка. Теперь разберём один внутренний
            шаг этого процесса. Строки, списки и <Notation>range</Notation>{" "}
            называют итерируемыми объектами: у каждого можно попросить итератор.
          </Typography.Text>
          <Typography.Text>
            Итератор — отдельный помощник, который помнит текущую позицию и
            отдаёт следующее значение по запросу. Функция{" "}
            <Notation>iter</Notation>
            создаёт его, а <Notation>next</Notation> выполняет один такой
            запрос.
          </Typography.Text>
          <CodeBlock
            code={
              'words = ["первое", "второе"]\niterator = iter(words)\nprint(next(iterator))\nprint(next(iterator))'
            }
            label="Два ручных шага"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Цикл <Notation>for</Notation> делает эти запросы сам и
            останавливается, когда значения закончились. Поэтому обычно ручные{" "}
            <Notation>iter</Notation> и <Notation>next</Notation> не нужны, но
            эта модель объясняет поведение генераторов и файлов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "exhaustion",
      navLabel: "Итератор хранит уже пройденный путь",
      explanation: (
        <>
          <WorkedExample
            title="Прочитаем один итератор дважды"
            prompt="Итератор создан для списка [10, 20]."
            steps={[
              "Первый next возвращает 10 и сдвигает позицию.",
              "Второй next возвращает 20.",
              "Третий запрос сообщает StopIteration: значений больше нет.",
              "Новый iter([10, 20]) создаст новый путь с начала.",
            ]}
          />
          <Mistake
            claim="Итератор — это ещё один список, который можно сколько угодно читать сначала."
            explanation="Итератор хранит текущую позицию и исчерпывается. Чтобы пройти обычную коллекцию заново, for получает от неё новый итератор."
          />
        </>
      ),
    },
    {
      id: "generator",
      navLabel: "Генератор вычисляет значение только к запросу",
      explanation: (
        <>
          <Typography.Text>
            Иногда последовательность удобнее создавать постепенно, не собирая
            все значения в список заранее. Функцию с <Notation>yield</Notation>
            называют генератором. При каждом запросе она выполняется до
            следующего <Notation>yield</Notation>, отдаёт одно значение и
            сохраняет место остановки.
          </Typography.Text>
          <CodeBlock
            code={
              "def even_numbers(limit):\n    number = 0\n    while number <= limit:\n        yield number\n        number += 2\n\nfor number in even_numbers(6):\n    print(number)"
            }
            label="Чётные числа по одному"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Такой ленивый способ вычисляет значение только тогда, когда его
            запросили. Он полезен, если значений много или они появляются
            постепенно. Для небольшого готового набора обычный список часто
            проще.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "choice",
      navLabel: "Не каждая последовательность должна быть ленивой",
      explanation: (
        <Procedure
          title="Выбираем представление"
          steps={[
            {
              label: "Нужен повторный проход?",
              detail: "Готовая коллекция легко перебирается снова.",
            },
            {
              label: "Нужны все значения сразу?",
              detail: "Список удобен для индексов, длины и сортировки.",
            },
            {
              label: "Значений много?",
              detail: "Генератор может выдавать их постепенно.",
            },
            {
              label: "Назовите момент вычисления.",
              detail: "yield откладывает работу до очередного запроса.",
            },
          ]}
        />
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-yield",
      prompt: "Чем yield отличается от return в этом уроке?",
      reveal:
        "return завершает обычный вызов, а yield отдаёт одно значение и сохраняет состояние для продолжения.",
    },
    {
      id: "checkpoint-position",
      prompt: "Что помнит итератор после одного вызова next?",
      reveal:
        "Он помнит, что первое значение уже выдано, и следующий запрос должен продолжить с новой позиции.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь <Notation>for</Notation> не выглядит магией: он получает итератор
        и запрашивает значения, пока они не закончатся.
      </Typography.Text>
      <Typography.Text>
        Генераторы остаются дополнительным инструментом. В следующих уроках
        важнее будет выбирать ясное решение, а не обязательно самое ленивое или
        короткое.
      </Typography.Text>
    </>
  ),
});
