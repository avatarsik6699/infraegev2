import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonListsLessonPublication } from "./course-publication.mjs";

export const pythonListsLesson = defineCourseLesson({
  ...pythonListsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать и заменять элементы списка",
    "Добавлять, извлекать и удалять значения",
    "Перебирать список без потери состояния",
    "Отличать изменение списка от создания нового",
  ],
  practiceTaskIds: pythonListsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Список хранит изменяемую последовательность",
      explanation: (
        <>
          <Typography.Text>
            {
              "Список подходит, когда нужно сохранить несколько значений в определённом порядке и затем обновлять набор. Элементы читаются по индексам так же, как символы строки."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "В отличие от строки список изменяем: присваивание по индексу заменяет элемент, а append добавляет новый элемент в конец существующего списка."
            }
          </Typography.Text>
          <CodeBlock
            code={
              "scores = [3, 5, 4]\nscores[0] = 4\nscores.append(5)\nprint(scores)"
            }
            label={"Замена и добавление элементов"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как меняется один объект",
      explanation: (
        <>
          <Typography.Text>
            {
              "Команды выполняются последовательно над одним списком. После замены по индексу остальные позиции не сдвигаются. После append длина увеличивается на один, а новый элемент получает последний индекс."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Для трассировки переписывайте весь список после каждой изменяющей команды. Так видно не только новое значение, но и его позицию."
            }
          </Typography.Text>
          <WorkedExample
            title={"Проследим список оценок"}
            prompt={"Начальный список равен [3, 5, 4]."}
            steps={[
              "После замены нулевого элемента получается [4, 5, 4].",
              "append добавляет 5 в конец: [4, 5, 4, 5].",
              "Длина итогового списка равна четырём.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Почему после append не нужно присваивать результат метода обратно списку?",
          reveal:
            "append изменяет исходный список и возвращает None. Повторное присваивание заменило бы переменную этим значением.",
        },
      ],
    },
    {
      id: "remove",
      navLabel: "Удаление выбирают по известным данным",
      explanation: (
        <>
          <Typography.Text>
            Если известна позиция, pop удаляет элемент и возвращает его. Если
            уже найден сам объект, remove удаляет первое равное ему значение.
            Перед удалением важно убедиться, что индекс или объект существует.
          </Typography.Text>
          <CodeBlock
            code={
              'tasks = ["письмо", "прогулка", "задачи"]\nfinished = tasks.pop(0)\ntasks.remove("прогулка")\nprint(finished)\nprint(tasks)'
            }
            label={"Два способа удалить элемент"}
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            В будущем у дела появится постоянный номер. Тогда сначала найдём
            нужную запись циклом, а затем удалим именно найденный объект —
            позиции соседей могут меняться.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pitfall",
      navLabel: "Изменяющий метод не возвращает список",
      explanation: (
        <>
          <Typography.Text>
            {
              "Метод append изменяет список на месте и возвращает None. Поэтому присваивание values = values.append(3) теряет ссылку на список и записывает в values значение None."
            }
          </Typography.Text>
          <Mistake
            claim={
              "append создаёт новый список, поэтому его результат нужно обязательно присвоить переменной."
            }
            explanation={
              "append уже изменяет существующий список. Его вызывают отдельной командой без повторного присваивания."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверять обработку списка",
      explanation: (
        <>
          <Typography.Text>
            {
              "Сначала отделите команды изменения набора от вычисления результата. Затем проверьте индексы на маленьком списке и проследите один полный проход цикла."
            }
          </Typography.Text>
          <Procedure
            title={"Работаем с набором по шагам"}
            steps={[
              {
                label: "Запишите начальный список.",
                detail: "Сохраните порядок и индексы элементов.",
              },
              {
                label: "Выполните изменения.",
                detail: "После каждой команды перепишите состояние.",
              },
              {
                label: "Проследите перебор.",
                detail: "Каждый элемент должен учитываться ровно один раз.",
              },
              {
                label: "Проверьте итог.",
                detail: "Сравните длину, порядок и вычисленный результат.",
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
        {
          "Теперь вы умеете читать и изменять список, добавлять элементы и прослеживать его обработку."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Составьте список из четырёх чисел, замените одно значение, добавьте ещё одно и заранее вычислите итоговую длину и сумму."
        }
      </Typography.Text>
    </>
  ),
});
