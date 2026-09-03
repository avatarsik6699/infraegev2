import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTodoStorageLessonPublication } from "./course-publication.mjs";

const storageSnapshot = `import json

FILE_NAME = "tasks.json"

def load_tasks():
    try:
        with open(FILE_NAME, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_tasks(tasks):
    with open(FILE_NAME, "w", encoding="utf-8") as file:
        json.dump(tasks, file, ensure_ascii=False, indent=2)

tasks = load_tasks()
next_id = max((task["id"] for task in tasks), default=0) + 1

def find_task(task_id):
    for task in tasks:
        if task["id"] == task_id:
            return task
    return None

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
    task = find_task(int(input("Номер дела: ")))
    if task is None:
        print("Дело не найдено")
        return
    task["done"] = True
    save_tasks(tasks)

def edit_task():
    task = find_task(int(input("Номер дела: ")))
    if task is None:
        print("Дело не найдено")
        return
    title = input("Новый текст: ").strip()
    if title:
        task["title"] = title
        save_tasks(tasks)

def delete_task():
    task = find_task(int(input("Номер дела: ")))
    if task is None:
        print("Дело не найдено")
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

export const pythonTodoStorageLesson = defineCourseLesson({
  ...pythonTodoStorageLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Сохранять список словарей в JSON",
    "Загружать дела при старте программы",
    "Спокойно обрабатывать первый запуск без файла",
    "Продолжать выдавать уникальные номера после загрузки",
  ],
  practiceTaskIds: pythonTodoStorageLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "why-file",
      navLabel: "Почему без файла не обойтись",
      explanation: (
        <>
          <Typography.Text>
            Пока программа запущена, список хранится в памяти. Закроем терминал
            — и все дела исчезнут. В третьей версии проекта добавим постоянное
            хранение: после каждого изменения будем записывать список в файл, а
            при новом запуске — читать его обратно.
          </Typography.Text>
          <Typography.Text>
            Для файла выберем JSON — текстовый формат, который умеет
            представлять списки, словари, строки, числа и логические значения.
            Стандартный модуль <Notation>json</Notation> превратит наши объекты
            Python в такой текст, а при загрузке восстановит их.
          </Typography.Text>
          <CodeBlock
            code={
              'import json\n\nwith open("tasks.json", "w", encoding="utf-8") as file:\n    json.dump(tasks, file, ensure_ascii=False, indent=2)'
            }
            label="Сохраняем текущее состояние"
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "load",
      navLabel: "Что делать, если файла ещё нет",
      explanation: (
        <>
          <Typography.Text>
            При самом первом запуске файла <Notation>tasks.json</Notation> ещё
            нет — и это нормально. Перехватим только{" "}
            <Notation>FileNotFoundError</Notation> и начнём с пустого списка.
            Другие ошибки не прячем: если проблема не в отсутствующем файле,
            Python должен показать traceback — знакомое сообщение с местом и
            причиной ошибки.
          </Typography.Text>
          <CodeBlock
            code={
              'def load_tasks():\n    try:\n        with open("tasks.json", "r", encoding="utf-8") as file:\n            return json.load(file)\n    except FileNotFoundError:\n        return []'
            }
            label="Загрузка или чистый старт"
            language="python"
            showLineNumbers
          />
          <WorkedExample
            title="Что меняется между двумя запусками"
            prompt="Сначала файла нет, затем пользователь добавляет дело и запускает программу снова."
            steps={[
              "В первый раз load_tasks не находит файл и возвращает пустой список.",
              "После добавления дела save_tasks создаёт tasks.json.",
              "При следующем запуске json.load читает сохранённый список.",
              "Команда list показывает прежнее дело — вводить его заново не нужно.",
            ]}
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-first-run",
          prompt:
            "Почему отсутствие tasks.json можно безопасно превратить в пустой список?",
          reveal:
            "Это известное состояние первого запуска; программа умеет начать работу без прежних дел.",
        },
      ],
    },
    {
      id: "identity",
      navLabel: "Не выдаём уже занятый номер",
      explanation: (
        <>
          <Typography.Text>
            После перезапуска нельзя снова ставить{" "}
            <Notation>next_id = 1</Notation>: такой номер уже может быть в
            файле. Найдём самый большой сохранённый <Notation>id</Notation> и
            прибавим единицу. Для пустого списка зададим{" "}
            <Notation>default=0</Notation>, поэтому первым номером снова станет
            1.
          </Typography.Text>
          <CodeBlock
            code={
              'next_id = max((task["id"] for task in tasks), default=0) + 1'
            }
            label="Продолжаем последовательность id"
            language="python"
          />
          <Mistake
            claim="Можно сохранить только названия, а id и done восстановить при запуске."
            explanation="Тогда пропадут отметки выполнения, а номера могут измениться после удаления. В файл должны попасть все данные, от которых зависит дальнейшая работа программы."
          />
        </>
      ),
    },
    {
      id: "snapshot",
      navLabel: "Собираем версию с сохранением",
      explanation: (
        <>
          <Typography.Text>
            Это третья версия <Notation>task_manager.py</Notation>. Теперь{" "}
            <Notation>save_tasks</Notation> вызывается после успешного
            добавления, отметки, редактирования или удаления. Команда{" "}
            <Notation>list</Notation> только читает список, поэтому записывать
            файл после неё незачем.
          </Typography.Text>
          <CodeBlock
            code={storageSnapshot}
            label="Список дел после третьего урока"
            language="python"
            showLineNumbers
          />
          <Procedure
            title="Проверяем работу после перезапуска"
            steps={[
              {
                label: "Удалите старый тестовый файл.",
                detail: "Первый запуск должен начаться с пустого списка.",
              },
              {
                label: "Добавьте и отметьте дело.",
                detail: "Откройте tasks.json и найдите оба значения.",
              },
              {
                label: "Запустите программу снова.",
                detail: "Список и отметка должны восстановиться.",
              },
              {
                label: "Добавьте новое дело.",
                detail: "Его id должен быть больше всех сохранённых.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-save",
      prompt: "После каких команд нужно сохранять файл?",
      reveal:
        "После успешного добавления, отметки, редактирования или удаления — то есть после реального изменения tasks.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь программу можно закрыть и открыть снова: дела, отметки и номера
        восстановятся из файла.
      </Typography.Text>
      <Typography.Text>
        В последнем уроке проверим неприятные случаи: слово вместо номера,
        неизвестный id и повреждённый JSON. Затем пройдём весь сценарий так, как
        его проходит обычный пользователь.
      </Typography.Text>
    </>
  ),
});
