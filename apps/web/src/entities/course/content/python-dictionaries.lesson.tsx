import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonDictionariesLessonPublication } from "./course-publication.mjs";

export const pythonDictionariesLesson = defineCourseLesson({
  ...pythonDictionariesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Связывать уникальные ключи со значениями",
    "Читать и обновлять значение по ключу",
    "Проверять наличие ключа до обращения",
    "Использовать get для безопасного значения по умолчанию",
    "Перебирать пары и хранить несколько записей в списке",
  ],
  practiceTaskIds: pythonDictionariesLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Словарь связывает ключ и значение",
      explanation: (
        <>
          <Typography.Text>
            {
              "В списке значение находят по позиции. Это неудобно, если мы знаем имя ученика, но не знаем, под каким индексом лежит его балл. Словарь позволяет искать не по позиции, а по осмысленному ключу."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Словарь хранит пары «ключ — значение»: ключ уникален и называет то, что мы ищем, а значение содержит связанные данные. Присваивание по существующему ключу обновляет значение, по новому — добавляет новую пару."
            }
          </Typography.Text>
          <CodeBlock
            code={
              'scores = {"Ира": 4, "Олег": 5}\nscores["Ира"] += 1\nscores["Лена"] = 4\nprint(scores["Ира"])'
            }
            label={"Чтение, обновление и добавление"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как проходит обращение по ключу",
      explanation: (
        <>
          <Typography.Text>
            {
              "Прямое обращение data[key] подходит, когда ключ точно существует. Если он может отсутствовать, сначала используют проверку in или метод get: он позволяет сразу указать безопасное значение по умолчанию."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Оператор in без уточнений проверяет именно ключи словаря. Метод values даёт сохранённые значения, а items — пары ключей и значений."
            }
          </Typography.Text>
          <WorkedExample
            title={"Посчитаем повторения"}
            prompt={"Словарь frequencies пока не содержит очередное слово."}
            steps={[
              "Метод get со значением 0 возвращает ноль для отсутствующего ключа.",
              "К этому числу прибавляется единица.",
              "Результат записывается по ключу; при следующей встрече чтение начнётся уже с сохранённого количества.",
            ]}
          />
        </>
      ),
    },
    {
      id: "records",
      navLabel: "Список словарей хранит несколько похожих записей",
      explanation: (
        <>
          <Typography.Text>
            Один словарь удобно читать как одну запись с именованными полями.
            Несколько дел можно хранить в списке словарей: у каждого есть id,
            текст и отметка выполнения. Список сохраняет порядок, а ключи
            объясняют смысл каждого значения.
          </Typography.Text>
          <CodeBlock
            code={
              'tasks = [\n    {"id": 1, "title": "Повторить циклы", "done": False},\n    {"id": 2, "title": "Решить задачу", "done": True},\n]\n\nfor task in tasks:\n    print(task["id"], task["title"])'
            }
            label={"Две записи с одинаковой структурой"}
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Метод items пригодится, когда нужны одновременно ключ и значение
            одного словаря. Но для прикладного кода чаще понятнее обращаться к
            известным полям по имени: task["title"] и task["done"].
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pitfall",
      navLabel: "Отсутствующий ключ — отдельный случай",
      explanation: (
        <>
          <Typography.Text>
            {
              "Прямое обращение по отсутствующему ключу вызывает ошибку KeyError. Словарь не сломан: программа просто потребовала значение, которого в нём нет, и не описала запасной вариант."
            }
          </Typography.Text>
          <Mistake
            claim={"Любой неизвестный ключ автоматически возвращает ноль."}
            explanation={
              "Ноль возвращается только если программа явно использовала get с таким значением по умолчанию или заранее создала ключ."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверять словарь",
      explanation: (
        <>
          <Typography.Text>
            {
              "Назовите допустимые ключи, решите, может ли ключ отсутствовать, и только затем выбирайте прямое обращение или get. После обновления проверьте одну существующую и одну новую пару."
            }
          </Typography.Text>
          <Procedure
            title={"Работаем с парами осознанно"}
            steps={[
              {
                label: "Определите смысл ключа.",
                detail: "Он должен однозначно находить нужную запись.",
              },
              {
                label: "Учтите отсутствие.",
                detail: "Выберите проверку in или get, если ключ необязателен.",
              },
              {
                label: "Обновите значение.",
                detail:
                  "Используйте прежнее значение только после безопасного чтения.",
              },
              {
                label: "Проверьте пары.",
                detail: "Сверьте ключи и связанные с ними результаты отдельно.",
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
          "Теперь вы можете хранить пары ключ–значение, безопасно читать и обновлять словарь."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Составьте словарь частот для короткого списка слов и вручную предскажите значение по одному существующему и одному отсутствующему ключу."
        }
      </Typography.Text>
    </>
  ),
  checkpoint: [
    {
      id: "checkpoint-trace",
      prompt:
        "Чем проверка key in data отличается от проверки value in data.values()?",
      reveal:
        "Первая ищет ключ среди ключей словаря, вторая — конкретное значение среди сохранённых значений.",
    },
  ],
});
