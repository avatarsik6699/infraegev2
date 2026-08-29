import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonSortingSearchLessonPublication } from "./course-publication.mjs";

export const pythonSortingSearchLesson = defineCourseLesson({
  ...pythonSortingSearchLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Находить элемент линейным просмотром",
    "Различать sorted и list.sort",
    "Сортировать записи по выбранному полю",
    "Сохранять исходный порядок, когда он ещё нужен",
  ],
  practiceTaskIds: pythonSortingSearchLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "search",
      navLabel: "Поиск — это просмотр с условием",
      explanation: (
        <>
          <Typography.Text>
            После списков и словарей у нас уже есть всё необходимое для поиска:
            цикл перебирает записи, условие проверяет нужный признак, а
            найденное значение можно сохранить или сразу вернуть из функции.
          </Typography.Text>
          <CodeBlock
            code={
              'tasks = [{"id": 1, "title": "Повторить циклы"}, {"id": 2, "title": "Решить задачу"}]\nfound = None\n\nfor task in tasks:\n    if task["id"] == 2:\n        found = task\n        break\n\nprint(found["title"])'
            }
            label="Линейный поиск по id"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            <Notation>break</Notation> останавливает ближайший цикл: после
            совпадения дальнейший просмотр уже не нужен. Значение{" "}
            <Notation>None</Notation> помогает отличить «ничего не найдено» от
            настоящей записи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sorted",
      navLabel: "Две сортировки отвечают разным потребностям",
      explanation: (
        <>
          <WorkedExample
            title="Сохраним исходные баллы"
            prompt="Список scores равен [7, 3, 9], но дальше нужен и исходный порядок."
            steps={[
              "sorted(scores) создаёт новый список [3, 7, 9].",
              "Переменная scores по-прежнему хранит [7, 3, 9].",
              "scores.sort() изменил бы сам исходный список и вернул None.",
            ]}
          />
          <CodeBlock
            code={
              "scores = [7, 3, 9]\nordered = sorted(scores)\nprint(scores)\nprint(ordered)"
            }
            label="Новый упорядоченный список"
            language="python"
            showLineNumbers
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-copy",
          prompt: "Как получить отсортированный список, не меняя исходный?",
          reveal:
            "Передать исходную коллекцию функции sorted и сохранить возвращённый новый список.",
        },
      ],
    },
    {
      id: "key",
      navLabel: "Записям нужно назвать поле сравнения",
      explanation: (
        <>
          <Typography.Text>
            Числа Python умеет сравнивать напрямую. У записи из нескольких полей
            нужно выбрать смысл сортировки. Параметр <Notation>key</Notation>{" "}
            получает функцию, которая для каждой записи возвращает сравниваемое
            значение.
          </Typography.Text>
          <CodeBlock
            code={
              'tasks = [{"title": "Читать", "priority": 2}, {"title": "Практика", "priority": 1}]\nordered = sorted(tasks, key=lambda task: task["priority"])\nprint(ordered[0]["title"])'
            }
            label="Сортировка по приоритету"
            language="python"
            showLineNumbers
          />
          <Mistake
            claim="После tasks.sort() переменная result = tasks.sort() содержит готовый список."
            explanation="Метод sort изменяет tasks на месте и возвращает None. Либо вызовите tasks.sort() отдельно, либо используйте result = sorted(tasks)."
          />
        </>
      ),
    },
    {
      id: "choice",
      navLabel: "Сначала вопрос, потом инструмент",
      explanation: (
        <Procedure
          title="Выбираем поиск или сортировку"
          steps={[
            {
              label: "Назовите результат.",
              detail: "Нужна одна запись, все совпадения или новый порядок?",
            },
            {
              label: "Выберите признак.",
              detail: "Какое поле проверяем или сравниваем?",
            },
            {
              label: "Решите судьбу исходника.",
              detail: "Можно ли менять исходный список?",
            },
            {
              label: "Учтите отсутствие.",
              detail: "Что программа сделает, если поиск ничего не найдёт?",
            },
          ]}
        />
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-search",
      prompt:
        "Зачем после найденного единственного элемента может понадобиться break?",
      reveal: "Он прекращает ненужный дальнейший просмотр списка.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь вы умеете находить запись и осознанно выбирать между новым
        отсортированным списком и изменением существующего.
      </Typography.Text>
      <Typography.Text>
        Эти два действия скоро станут основой поиска дела по номеру и удобного
        вывода списка дел.
      </Typography.Text>
    </>
  ),
});
