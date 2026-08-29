import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonFilesLessonPublication } from "./course-publication.mjs";

export const pythonFilesLesson = defineCourseLesson({
  ...pythonFilesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать файл построчно",
    "Записывать вычисленный результат в текстовый файл",
    "Удалять служебные символы по краям строки",
    "Преобразовывать текст в числа в явном месте",
    "Закрывать файл через контекстный менеджер",
  ],
  practiceTaskIds: pythonFilesLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Файл передаёт программе текстовые строки",
      explanation: (
        <>
          <Typography.Text>
            {
              "При чтении текстового файла программа получает строки, даже если внутри записаны цифры. Перевод строки обычно остаётся в прочитанном значении, поэтому данные сначала очищают и только затем преобразуют."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Контекстный менеджер with открывает файл на время блока и закрывает его после выхода, включая случай ошибки. Код явно показывает границы работы с внешним ресурсом."
            }
          </Typography.Text>
          <CodeBlock
            code={
              'with open("numbers.txt", encoding="utf-8") as source:\n    for line in source:\n        number = int(line.strip())\n        print(number)'
            }
            label={"Чтение и преобразование строк"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "write",
      navLabel: "Запись сохраняет результат после завершения программы",
      explanation: (
        <>
          <Typography.Text>
            Режим w открывает файл для записи и заменяет прежнее содержимое.
            Метод write принимает строку, поэтому число сначала превращают в
            текст. Перевод строки добавляют явно — Python не дописывает его
            автоматически.
          </Typography.Text>
          <CodeBlock
            code={
              'total = 17\n\nwith open("result.txt", "w", encoding="utf-8") as target:\n    target.write(f"Сумма: {total}\\n")'
            }
            label={"Записываем понятный итог"}
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Для списка структурированных записей позже используем JSON, но
            принцип останется тем же: программа явно выбирает момент, когда
            текущее состояние нужно сохранить.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Путь одной строки",
      explanation: (
        <>
          <Typography.Text>
            {
              "Полезно проследить одну строку через все состояния: исходный текст с переводом строки, очищенный текст и числовое значение. Ошибка на каждом этапе имеет разную причину."
            }
          </Typography.Text>
          <Typography.Text>
            {
              "Преобразование лучше держать рядом с чтением или в отдельной функции подготовки данных, а дальнейшие вычисления выполнять уже с числами."
            }
          </Typography.Text>
          <WorkedExample
            title={"Проследим строку с числом"}
            prompt={
              "Из файла получено значение, содержащее символы 1, 2 и перевод строки."
            }
            steps={[
              "strip удаляет перевод строки и оставляет текст 12.",
              "int проверяет цифровую запись и создаёт число 12.",
              "Только после этого значение безопасно участвует в арифметике.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-trace",
          prompt:
            "Почему полезно отдельно видеть исходную строку, очищенный текст и число?",
          reveal:
            "Так можно точно определить этап ошибки: чтение, очистку формата или преобразование типа.",
        },
      ],
    },
    {
      id: "pitfall",
      navLabel: "Цифры в файле ещё не являются числами",
      explanation: (
        <>
          <Typography.Text>
            {
              "Сложение прочитанных строк соединяет текст: строки 2 и 5 могут дать 25 вместо 7. Внешний вид значения не определяет его тип."
            }
          </Typography.Text>
          <Mistake
            claim={
              "Если строка состоит из цифр, Python автоматически использует её как число."
            }
            explanation={
              "Чтение текста не выполняет скрытого преобразования. Для арифметики нужен явный вызов int или float."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить обработку файла",
      explanation: (
        <>
          <Typography.Text>
            {
              "Создайте крошечный файл из двух-трёх строк, заранее вычислите ожидаемый результат и проследите преобразование одной строки. Затем добавьте граничный пример, например пробелы вокруг числа."
            }
          </Typography.Text>
          <Procedure
            title={"Работаем с данными по этапам"}
            steps={[
              {
                label: "Зафиксируйте формат.",
                detail:
                  "Что означает одна строка и какой разделитель используется?",
              },
              {
                label: "Очистите текст.",
                detail: "Удалите только служебные символы по краям.",
              },
              {
                label: "Преобразуйте тип.",
                detail: "Сделайте это до арифметики и обработки.",
              },
              {
                label: "Сверьте маленький файл.",
                detail: "Результат должен совпасть с ручным вычислением.",
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
          "Теперь вы можете прочитать небольшой текстовый файл, превратить строки в данные и записать вычисленный результат."
        }
      </Typography.Text>
      <Typography.Text>
        {
          "Создайте файл из трёх чисел, предскажите сумму вручную и проверьте программу, которая читает его через with."
        }
      </Typography.Text>
    </>
  ),
});
