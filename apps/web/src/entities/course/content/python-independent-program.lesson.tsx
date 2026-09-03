import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonIndependentProgramLessonPublication } from "./course-publication.mjs";

const finalInputHelpers = `def read_task_id():
    try:
        return int(input("Номер дела: "))
    except ValueError:
        print("Номер должен быть целым числом")
        return None

def load_tasks():
    try:
        with open(FILE_NAME, "r", encoding="utf-8") as file:
            data = json.load(file)
            return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("Файл повреждён. Начинаем с пустого списка")
        return []`;

const finalTodoSnapshot = `import json

FILE_NAME = "tasks.json"

def load_tasks():
    try:
        with open(FILE_NAME, "r", encoding="utf-8") as file:
            data = json.load(file)
            return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("Файл повреждён. Начинаем с пустого списка")
        return []

def save_tasks(tasks):
    with open(FILE_NAME, "w", encoding="utf-8") as file:
        json.dump(tasks, file, ensure_ascii=False, indent=2)

def read_task_id():
    try:
        return int(input("Номер дела: "))
    except ValueError:
        print("Номер должен быть целым числом")
        return None

tasks = load_tasks()
next_id = max((task["id"] for task in tasks), default=0) + 1

def find_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            return task
    return None

def choose_task():
    task_id = read_task_id()
    if task_id is None:
        return None
    task = find_task(task_id)
    if task is None:
        print("Дело не найдено")
    return task

def show_tasks():
    if not tasks:
        print("Список пока пуст")
        return
    for task in tasks:
        mark = "x" if task["done"] else " "
        print(f'[{mark}] {task["id"]}. {task["title"]}')

def add_task():
    global next_id
    title = input("Новое дело: ").strip()
    if not title:
        print("Название не может быть пустым")
        return
    tasks.append({"id": next_id, "title": title, "done": False})
    next_id += 1
    save_tasks(tasks)

def complete_task():
    task = choose_task()
    if task is None:
        return
    task["done"] = True
    save_tasks(tasks)

def edit_task():
    task = choose_task()
    if task is None:
        return
    title = input("Новый текст: ").strip()
    if not title:
        print("Название не изменено")
        return
    task["title"] = title
    save_tasks(tasks)

def delete_task():
    task = choose_task()
    if task is None:
        return
    tasks.remove(task)
    save_tasks(tasks)

while True:
    command = input("Команда: ").strip().lower()
    if command == "list":
        show_tasks()
    elif command == "add":
        add_task()
    elif command == "done":
        complete_task()
    elif command == "edit":
        edit_task()
    elif command == "delete":
        delete_task()
    elif command == "exit":
        break
    else:
        print("Неизвестная команда")`;

export const pythonIndependentProgramLesson = defineCourseLesson({
  ...pythonIndependentProgramLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Сохранять командный цикл после неверного ввода",
    "Различать пустой список, неизвестный id и повреждённый файл",
    "Проверять приложение целыми пользовательскими сценариями",
    "Объяснять назначение каждой функции итоговой программы",
  ],
  practiceTaskIds: pythonIndependentProgramLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "grown-program",
      navLabel: "Как четыре урока сложились в одну программу",
      explanation: (
        <>
          <Typography.Text>
            Перед нами четвёртая, итоговая версия одного проекта. Мы не писали
            её целиком за один раз: сначала программа научилась добавлять и
            показывать дела, потом — изменять записи, а затем — сохранять список
            в файл. На каждом шаге появлялась одна новая задача, а знакомые
            конструкции продолжали работать.
          </Typography.Text>
          <WorkedExample
            title="Что происходит с одним делом"
            prompt="Пользователь добавляет дело, закрывает программу, запускает её снова, отмечает дело и удаляет его."
            steps={[
              "add_task создаёт словарь, а save_tasks записывает обновлённый список.",
              "После перезапуска load_tasks восстанавливает этот словарь из JSON.",
              "complete_task находит дело по id, меняет done и сохраняет результат.",
              "delete_task удаляет запись и записывает в файл уже пустой список.",
            ]}
          />
        </>
      ),
    },
    {
      id: "bad-input",
      navLabel: "Слово вместо номера не должно ломать программу",
      explanation: (
        <>
          <Typography.Text>
            Сейчас случайное «два» вместо цифры 2 завершит программу на{" "}
            <Notation>int(input())</Notation>. Это ожидаемая ошибка ввода:
            пользователь может ошибиться, а меню должно продолжить работу.
            Исправим её в одном месте. Функция чтения либо вернёт целое число,
            либо объяснит проблему и отдаст <Notation>None</Notation>, после
            чего меню продолжит работу.
          </Typography.Text>
          <CodeBlock
            code={finalInputHelpers}
            label="Две ожидаемые проблемы"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Здесь важно не смешать две ситуации. <Notation>None</Notation> от
            read_task_id означает, что номер вообще не удалось прочитать. А
            целое число может быть корректным, но не принадлежать ни одному
            делу. Для него покажем отдельное сообщение «Дело не найдено».
          </Typography.Text>
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-cases",
          prompt:
            "Чем ввод «abc» отличается от ввода номера 99, которого нет в списке?",
          reveal:
            "Первый ввод нельзя преобразовать в целое число; второй корректен по формату, но поиск не находит запись.",
        },
      ],
    },
    {
      id: "file-recovery",
      navLabel: "Не путаем новый и повреждённый файл",
      explanation: (
        <>
          <Typography.Text>
            Отсутствующий файл означает, что программу запустили впервые.
            Повреждённый JSON — уже проблема с данными, и молчать о ней нельзя.
            Это два разных состояния, поэтому и сообщения у них разные. О
            повреждении сообщим прямо и начнём с пустого списка. При этом не
            используем голый <Notation>except</Notation>: настоящие ошибки в
            коде по-прежнему должны показать traceback.
          </Typography.Text>
          <Mistake
            claim="Если JSON не читается, можно молча вернуть пустой список — программа ведь продолжит работу."
            explanation="Для пользователя это будет выглядеть так, будто все дела исчезли. Нужно прямо сказать, что файл повреждён и программа временно начинает с пустого списка."
          />
        </>
      ),
    },
    {
      id: "whole-test",
      navLabel: "Проверяем программу как пользователь",
      explanation: (
        <>
          <Typography.Text>
            Одна успешная команда ещё не доказывает, что приложение готово.
            Пройдём несколько обычных и проблемных сценариев подряд. Перед
            каждым шагом попробуйте предсказать, что останется в списке и в
            tasks.json, а затем сравните ожидание с результатом.
          </Typography.Text>
          <Procedure
            title="Шесть сценариев для финальной проверки"
            steps={[
              {
                label: "Чистый старт.",
                detail: "Без файла list показывает пустое состояние.",
              },
              {
                label: "Обычная работа.",
                detail: "Добавьте два дела, измените одно и отметьте другое.",
              },
              {
                label: "Перезапуск.",
                detail: "Проверьте текст, отметку и продолжение id.",
              },
              {
                label: "Ошибочный ввод.",
                detail:
                  "Введите слово и неизвестный номер; меню должно продолжить работу.",
              },
              {
                label: "Повреждённый JSON.",
                detail:
                  "Программа называет проблему и запускает пустой список.",
              },
              {
                label: "Чтение кода.",
                detail:
                  "Объясните одним предложением ответственность каждой функции.",
              },
            ]}
          />
          <CodeBlock
            code={finalTodoSnapshot}
            label="Готовая программа"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Большая часть кода осталась прежней. Мы добавили только безопасное
            чтение номера и общую функцию выбора дела. Именно так удобнее
            развивать программу: не переписывать рабочие части, а аккуратно
            исправлять только те места, где обнаружилась проблема.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "refactor",
      navLabel: "Наводим порядок без большой переписи",
      explanation: (
        <>
          <Typography.Text>
            Когда все сценарии проходят, прочитайте файл сверху вниз. По имени
            каждой функции должно быть понятно, за что она отвечает. Повторное
            чтение номера лучше оставить в одном месте, а сохранение вызывать
            только тогда, когда список действительно изменился.
          </Typography.Text>
          <Typography.Text>
            Улучшение внутреннего устройства кода без изменения поведения
            называют рефакторингом. Не переписывайте всю программу ради красоты:
            измените одну небольшую часть и снова пройдите тот же сценарий. Если
            результат не изменился, рефакторинг был безопасным.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-ready",
      prompt:
        "Что доказывает готовность итоговой программы лучше одного успешного запуска?",
      reveal:
        "Набор повторяемых сценариев: чистый старт, обычные изменения, перезапуск, неверный ввод, неизвестный id и повреждённый файл.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Готово: у вас есть небольшое приложение, а не набор разрозненных
        упражнений. В нём вместе работают ввод, условия, циклы, строки,
        коллекции, функции, поиск, исключения и файлы.
      </Typography.Text>
      <Typography.Text>
        Сохраните <Notation>task_manager.py</Notation> и придумайте для него
        одну собственную команду — например, показ только незавершённых дел.
        Сначала запишите, что должен ввести и увидеть пользователь. Затем
        меняйте код и ещё раз пройдите финальные сценарии.
      </Typography.Text>
    </>
  ),
});
