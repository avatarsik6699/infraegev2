import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonForRangeLessonPublication } from "./course-publication.mjs";

export const pythonForRangeLesson = defineCourseLesson({
  ...pythonForRangeLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать границы и шаг range",
    "Предсказывать значения переменной цикла",
    "Повторять действие заданное число раз",
    "Проверять цикл по первой и последней итерации",
  ],
  practiceTaskIds: pythonForRangeLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "model",
      navLabel: "Что именно создаёт range",
      explanation: (
        <>
          <Typography.Text>
            В прошлых уроках программа выполняла ветвь один раз, если условие
            подходило. Теперь представьте другую задачу: вывести пять строк или
            проверить десять чисел. Повторять одну и ту же команду вручную
            неудобно — для повторения нужен цикл.
          </Typography.Text>
          <Typography.Text>
            Цикл <Notation>for</Notation> по очереди получает значения из
            готового набора. Один проход тела цикла называют итерацией, а имя
            <Notation> number</Notation> в примере ниже — переменной цикла. Для
            числового перебора значения часто задаёт <Notation>range</Notation>:
            левая граница входит, правая не входит, а необязательный третий
            аргумент задаёт шаг.
          </Typography.Text>
          <Typography.Text>
            Запись <Notation>range(2, 8, 2)</Notation> даёт
            <Notation> 2</Notation>, <Notation>4</Notation> и
            <Notation> 6</Notation>. Число <Notation>8</Notation> служит
            стоп-границей и не становится значением переменной цикла.
          </Typography.Text>
          <CodeBlock
            code={"for number in range(2, 8, 2):\n    print(number)"}
            label={"Перебор с шагом два"}
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "trace",
      navLabel: "Как читать цикл по итерациям",
      explanation: (
        <>
          <Typography.Text>
            Когда значения <Notation>range</Notation> уже выписаны, цикл можно
            читать как несколько обычных последовательных шагов. Для каждого
            значения отдельно выполните тело цикла и зафиксируйте, что
            изменилось. Так трассировка превращает повторение в понятную таблицу
            итераций.
          </Typography.Text>
          <Typography.Text>
            Переменную, в которой постепенно собирается результат, называют
            накопителем. Её создают до цикла, чтобы новая итерация получила
            результат предыдущей. Если создать накопитель внутри тела, прежнее
            значение будет теряться при каждом проходе.
          </Typography.Text>
          <WorkedExample
            title={"Сумма первых трёх чисел"}
            prompt={"Накопитель равен нулю, а цикл перебирает range(1, 4)."}
            steps={[
              "При первом значении 1 сумма становится равной 1.",
              "При втором значении 2 сумма становится равной 3.",
              "При третьем значении 3 сумма становится равной 6; следующего значения в range нет.",
            ]}
          />
        </>
      ),
    },
    {
      id: "pitfall",
      navLabel: "Правая граница не включается",
      explanation: (
        <>
          <Typography.Text>
            Теперь вернёмся к стоп-границе. Частая ошибка — ожидать, что
            <Notation> range(1, 5)</Notation> содержит число
            <Notation> 5</Notation>. На самом деле перебор остановится перед
            ним. Если нужны значения от 1 до 5 включительно, стоп-границей
            должно быть число <Notation>6</Notation>.
          </Typography.Text>
          <Mistake
            claim={
              "В range последним аргументом всегда указывают последнее нужное значение."
            }
            explanation={
              "Второй аргумент — не последнее значение, а граница остановки. При положительном шаге цикл заканчивается до неё."
            }
          />
        </>
      ),
    },
    {
      id: "workflow",
      navLabel: "Как проверить границы цикла",
      explanation: (
        <>
          <Typography.Text>
            Соберём модель цикла в одну проверку. До запуска ответьте на три
            вопроса: какое значение будет первым, какое последним и сколько
            значений получится. После этого отдельно пройдите первую и последнюю
            итерации.
          </Typography.Text>
          <Procedure
            title={"Четыре шага проверки"}
            steps={[
              {
                label: "Раскройте range.",
                detail:
                  "Запишите несколько значений последовательности вручную.",
              },
              {
                label: "Назовите первую итерацию.",
                detail: "Подставьте первое значение в тело цикла.",
              },
              {
                label: "Назовите последнюю итерацию.",
                detail: "Убедитесь, что она ещё находится до стоп-границы.",
              },
              {
                label: "Сверьте количество.",
                detail:
                  "При необходимости используйте len(range(...)) в локальной проверке.",
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
        Теперь вы можете заранее перечислить значения
        <Notation> range</Notation> и проследить, как
        <Notation> for</Notation> меняет состояние программы на каждой итерации.
      </Typography.Text>
      <Typography.Text>
        {
          "Составьте цикл для чисел от 5 до 25 с шагом 5, сначала предскажите вывод на бумаге, затем сравните его с локальным запуском."
        }
      </Typography.Text>
    </>
  ),
  checkpoint: [
    {
      id: "checkpoint-trace",
      prompt: "Какие значения создаёт range(3, 8, 2)?",
      reveal: "3, 5 и 7. Следующее значение 9 уже пересекает стоп-границу 8.",
    },
  ],
});
