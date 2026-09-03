import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTodoActionsLessonPublication } from "./course-publication.mjs";

const actionsSnapshot = `tasks = []
next_id = 1

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
    if title:
        tasks.append({"id": next_id, "title": title, "done": False})
        next_id += 1

def complete_task():
    task = find_task(int(input("Номер дела: ")))
    if task is None:
        print("Дело не найдено")
        return
    task["done"] = True

def edit_task():
    task = find_task(int(input("Номер дела: ")))
    if task is None:
        print("Дело не найдено")
        return
    title = input("Новый текст: ").strip()
    if title:
        task["title"] = title

def delete_task():
    task = find_task(int(input("Номер дела: ")))
    if task is None:
        print("Дело не найдено")
        return
    tasks.remove(task)

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

export const pythonTodoActionsLesson = defineCourseLesson({
  ...pythonTodoActionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Находить дело по сохранённому номеру",
    "Изменять отдельные поля найденной записи",
    "Удалять выбранное дело без перенумерации остальных",
    "Выделять повторяющийся поиск в функцию",
  ],
  practiceTaskIds: pythonTodoActionsLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "continue",
      navLabel: "Как выбрать нужное дело",
      explanation: (
        <>
          <Typography.Text>
            Добавлять дела мы уже умеем. Теперь пользователь вводит номер и
            ждёт, что программа изменит именно выбранную запись. Индекс списка —
            то есть текущая позиция записи — для этого не подходит: после
            удаления он может поменяться. Поэтому ищем дело по постоянному полю{" "}
            <Notation>id</Notation>, которое добавили в первой версии.
          </Typography.Text>
          <CodeBlock
            code={
              'def find_task(task_id):\n    for task in tasks:\n        if task["id"] == task_id:\n            return task\n    return None'
            }
            label="Один поиск для всех действий"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Если номер найден, функция возвращает словарь из списка. Поэтому
            переменная <Notation>task</Notation> указывает на тот же изменяемый
            словарь, который хранится внутри <Notation>tasks</Notation>, а не на
            отдельную копию. Присваивание вроде{" "}
            <Notation>task["done"] = True</Notation> меняет именно то дело,
            которое затем покажет команда <Notation>list</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "change",
      navLabel: "Один поиск — три действия",
      explanation: (
        <>
          <Typography.Text>
            Отметка выполнения, редактирование и удаление начинаются одинаково:
            пользователь вводит номер, а программа ищет дело. Поэтому поиск
            остаётся в одной функции <Notation>find_task</Notation>, а каждое
            действие отвечает только за своё изменение.
          </Typography.Text>
          <WorkedExample
            title="Отмечаем дело номер 2"
            prompt="В tasks есть словарь с id 2 и done равным False."
            steps={[
              "find_task(2) перебирает tasks и находит словарь с номером 2.",
              "Поскольку дело найдено, проверка task is None не завершает функцию.",
              'Строка task["done"] = True ставит отметку выполнения.',
              "При следующей команде list рядом с делом появляется x.",
            ]}
          />
          <CodeBlock
            code={
              'def complete_task():\n    task_id = int(input("Номер дела: "))\n    task = find_task(task_id)\n    if task is None:\n        print("Дело не найдено")\n        return\n    task["done"] = True'
            }
            label="Отметка выполнения"
            language="python"
            showLineNumbers
          />
        </>
      ),
      checkpoint: [
        {
          id: "checkpoint-none",
          prompt: "Зачем проверять task is None до изменения словаря?",
          reveal:
            "Поиск может ничего не вернуть; у None нет полей title или done.",
        },
      ],
    },
    {
      id: "delete",
      navLabel: "Почему номера не меняются после удаления",
      explanation: (
        <>
          <Typography.Text>
            Удалённое дело исчезает, но номера остальных записей не трогаем.
            Иначе команда, которая ещё минуту назад относилась к делу 3,
            внезапно выберет другое дело. Новый номер по-прежнему берём из{" "}
            <Notation>next_id</Notation>, а не из длины списка.
          </Typography.Text>
          <Mistake
            claim="После удаления лучше снова пронумеровать список от единицы — так аккуратнее."
            explanation="Пользователь мог запомнить прежний номер. Если номера начнут перескакивать, легко изменить не то дело. Пусть у каждой записи сохраняется один id до самого удаления."
          />
        </>
      ),
    },
    {
      id: "snapshot",
      navLabel: "Собираем вторую версию",
      explanation: (
        <>
          <Typography.Text>
            Это вторая версия того же <Notation>task_manager.py</Notation>.
            Добавьте новые функции в предыдущий файл или сравните свою версию с
            кодом ниже. Пока оставим одну известную слабость: слово вместо
            номера вызовет <Notation>ValueError</Notation>. В последнем уроке
            вернёмся к вводу и применим <Notation>try</Notation>, а сейчас
            проверим сами действия со списком.
          </Typography.Text>
          <CodeBlock
            code={actionsSnapshot}
            label="Список дел после второго урока"
            language="python"
            showLineNumbers
          />
          <Procedure
            title="Проверяем каждое действие"
            steps={[
              {
                label: "Добавьте три дела.",
                detail: "Убедитесь, что номера различаются.",
              },
              {
                label: "Отметьте второе.",
                detail: "В списке должна появиться отметка x.",
              },
              {
                label: "Измените первое.",
                detail: "Номер остаётся прежним, меняется только title.",
              },
              {
                label: "Удалите второе.",
                detail: "Третье дело не должно получить новый номер.",
              },
              {
                label: "Запросите неизвестный id.",
                detail: "Программа сообщает, что дело не найдено.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-reference",
      prompt:
        'Почему изменение task["title"] видно при следующем обходе списка tasks?',
      reveal:
        "find_task возвращает ссылку на тот же изменяемый словарь, который хранится внутри списка.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Теперь список можно не только пополнять. Программа находит дело по
        номеру, отмечает его выполненным, меняет текст и удаляет запись.
      </Typography.Text>
      <Typography.Text>
        Пока данные живут только до закрытия программы. Следующий шаг — записать
        именно этот список в файл и восстановить его при новом запуске.
      </Typography.Text>
    </>
  ),
});
