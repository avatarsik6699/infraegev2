import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTablesLessonPublication } from "./course-publication.mjs";

export const pythonTablesLesson = defineCourseLesson({
  ...pythonTablesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Разделять табличную строку на поля",
    "Выбирать столбец по стабильному индексу",
    "Фильтровать строки до агрегации",
    "Проверять формат на маленьком наборе",
    "Собирать разобранные строки в записи для дальнейшей обработки",
  ],
  practiceTaskIds: pythonTablesLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Таблица — последовательность однотипных строк",
      explanation: (
        <>
          <Typography.Text>
            {
              "В прошлом уроке одна строка файла содержала одно число. В таблице строка описывает целую запись, например ученика, его возраст и балл. Отдельные значения записи называют полями, а знак между ними — разделителем."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Метод split делит строку по известному разделителю и создаёт список полей. Нужные столбцы выбирают по индексам и преобразуют. Смысл каждого индекса задаётся форматом файла: если балл записан третьим, это должно быть известно до цикла, а не угадано по одному примеру."
            }
          </Typography.Text>
          <CodeBlock
            code={
              'row = "Ира;15;5"\nfields = row.split(";")\nname = fields[0]\nage = int(fields[1])\nscore = int(fields[2])'
            }
            label={"Разделение строки на поля"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "От строки к общему результату",
      explanation: (
        <>
          <Typography.Text>
            {
              "Для каждой строки повторяется один и тот же путь: разделить, преобразовать, проверить условие и обновить результат. Такой последовательный путь данных называют конвейером обработки. Каждая операция занимает своё место и не применяется ко всей строке сразу."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Для отладки выведите или запишите поля одной строки и убедитесь, что индексы соответствуют заголовкам."
            }
          </Typography.Text>
          <WorkedExample
            title={"Разберём строку Ира;15;5"}
            prompt={"Разделителем служит точка с запятой."}
            steps={[
              "split создаёт три поля с индексами 0, 1 и 2.",
              "Имя остаётся строкой, возраст и балл явно преобразуются в int.",
              "После преобразования балл можно сравнивать и складывать как число.",
            ]}
          />
        </>
      ),
    },
    {
      id: "records",
      navLabel: "Разобранные строки становятся записями",
      explanation: (
        <>
          <Typography.Text>
            Если к данным нужно вернуться после чтения, каждую строку можно
            превратить в знакомый словарь и добавить в список. Так текстовые
            поля становятся записями программы. После этого сортировка, поиск и
            фильтрация работают с понятными именами, а не с загадочными
            индексами.
          </Typography.Text>
          <CodeBlock
            code={
              'records = []\nfor row in rows:\n    name, age_text, score_text = row.split(";")\n    records.append({\n        "name": name,\n        "age": int(age_text),\n        "score": int(score_text),\n    })\n\nbest_first = sorted(records, key=lambda item: item["score"], reverse=True)'
            }
            label={"От текста к списку записей"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "pitfall",
      navLabel: "Разделитель является частью контракта",
      explanation: (
        <>
          <Typography.Text>
            {
              "Если файл использует точку с запятой, разделение по запятой оставит всю строку одним полем. Ошибка индекса ниже лишь следствие неверно выбранного формата."
            }
          </Typography.Text>
          <Mistake
            claim={
              "split сам определит подходящий разделитель по содержимому строки."
            }
            explanation={
              "Методу нужно явно передать разделитель. Программа должна знать формат входных данных."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверять табличную обработку",
      explanation: (
        <>
          <Typography.Text>
            {
              "Начните с одной строки и подпишите поля. Затем добавьте строку, которая проходит фильтр, и строку, которая его не проходит. Только после этого обновляйте общий результат — сумму, количество или максимум."
            }
          </Typography.Text>
          <Procedure
            title={"Проверяем конвейер"}
            steps={[
              {
                label: "Разделите одну строку.",
                detail: "Сверьте число и порядок полей.",
              },
              {
                label: "Преобразуйте столбцы.",
                detail: "Числовые сравнения выполняйте с числами.",
              },
              {
                label: "Примените фильтр.",
                detail: "Неподходящая строка не должна менять результат.",
              },
              {
                label: "Обновите агрегат.",
                detail:
                  "Проверьте сумму, количество или лучший элемент вручную.",
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
          "Теперь вы можете превратить строки простой таблицы в поля, отобрать нужные записи и вычислить итог."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Составьте таблицу из трёх строк и двух числовых столбцов, затем вручную и программой найдите сумму одного столбца после фильтра."
        }
      </Typography.Text>
    </>
  ),
  checkpoint: [
    {
      id: "checkpoint-trace",
      prompt:
        "Почему фильтр лучше применять до обновления суммы или максимума?",
      reveal:
        "Тогда неподходящие строки вообще не влияют на агрегат, и смысл каждой итерации остаётся ясным.",
    },
  ],
});
