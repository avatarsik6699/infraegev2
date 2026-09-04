import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTodoStartLessonPublication } from "./course-publication.mjs";

const firstTodoSnapshot = `tasks = []
next_id = 1

def show_tasks():
    if not tasks:
        print("Список пока пуст")
        return

    for task in tasks:
        print(f'{task["id"]}. {task["title"]}')

def add_task():
    global next_id
    title = input("Новое дело: ").strip()
    if not title:
        print("Название не может быть пустым")
        return

    tasks.append({"id": next_id, "title": title, "done": False})
    next_id += 1
    print("Дело добавлено")

while True:
    command = input("Команда (list, add, exit): ").strip().lower()

    if command == "list":
        show_tasks()
    elif command == "add":
        add_task()
    elif command == "exit":
        break
    else:
        print("Неизвестная команда")`;

export const pythonTodoStartLesson = defineCourseLesson({
  ...pythonTodoStartLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Хранить несколько дел как список словарей",
    "Повторять запрос команд в while",
    "Добавлять непустое дело с уникальным номером",
    "Показывать понятное состояние пустого и заполненного списка",
  ],
  practiceTaskIds: pythonTodoStartLessonPublication.practiceTaskIds,
  accessTier: "free",
  theory: [
    {
      id: "first-run",
      navLabel: "С чего начать полезную версию",
      explanation: (
        <>
          <Typography.Text>
            Начинаем итоговый проект курса — небольшой список дел в терминале.
            Его легко усложнить ещё до первого запуска, поэтому пойдём знакомым
            путём: соберём простую рабочую версию, проверим её и только потом
            добавим новые возможности. Сейчас программа должна принять новое
            дело, запомнить его и показать в списке. Для этого уже хватает
            списка, словаря, функций, условия и цикла.
          </Typography.Text>
          <CodeBlock
            code={
              'tasks = []\ntasks.append({"id": 1, "title": "Повторить циклы", "done": False})\n\nfor task in tasks:\n    print(task["id"], task["title"])'
            }
            label="Первая запись"
            language="python"
            showLineNumbers
          />
          <Typography.Text>
            Одно дело храним в словаре. В поле <Notation>title</Notation> лежит
            его текст. Поле <Notation>done</Notation> хранит ответ на вопрос
            «дело выполнено?» — пока это <Notation>False</Notation>. Поле{" "}
            <Notation>id</Notation> хранит постоянный номер, по которому позже
            можно будет выбрать нужную запись.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "command-loop",
      navLabel: "Оставляем программу открытой",
      explanation: (
        <>
          <Typography.Text>
            Если программа выполнит одну команду и сразу закроется, пользоваться
            ей будет неудобно. После добавления дела мы обычно хотим посмотреть
            список или добавить ещё одно. Поэтому оставим меню в цикле и выйдем
            из него только по команде <Notation>exit</Notation>. Каждая ветвь{" "}
            <Notation>if</Notation> и <Notation>elif</Notation> отвечает за одну
            команду, а затем цикл снова ждёт ввод.
          </Typography.Text>
          <WorkedExample
            title="Что происходит после команды add"
            prompt="Пользователь вводит add, затем «Купить тетрадь», затем list и exit."
            steps={[
              "Ветка add передаёт управление функции add_task.",
              "Функция создаёт словарь с номером 1 и добавляет его в tasks.",
              "После команды list мы видим только что добавленное дело.",
              "Команда exit доходит до break, и цикл заканчивается.",
            ]}
          />
          <CodeBlock
            code={
              'while True:\n    command = input("Команда: ").strip().lower()\n    if command == "list":\n        show_tasks()\n    elif command == "add":\n        add_task()\n    elif command == "exit":\n        break'
            }
            label="Цикл команд"
            language="python"
            showLineNumbers
          />
        </>
      ),
    },
    {
      id: "empty",
      navLabel: "Не сохраняем пустую строку",
      explanation: (
        <>
          <Typography.Text>
            Пользователь может нажать Enter или ввести несколько пробелов. Такое
            дело нам не нужно. <Notation>strip()</Notation> уберёт пробелы по
            краям, а проверка <Notation>if not title</Notation> вернёт нас в
            меню, не меняя список.
          </Typography.Text>
          <Mistake
            claim="Пока можно сохранять и пустые строки — настоящего интерфейса всё равно нет."
            explanation="Терминал уже принимает действия пользователя. Проще отклонить пустой ввод сразу, чем потом учить вывод, редактирование и сохранение работать с бесполезными записями."
          />
        </>
      ),
    },
    {
      id: "snapshot",
      navLabel: "Собираем первую версию",
      explanation: (
        <>
          <Typography.Text>
            Теперь соберём всё в файле <Notation>task_manager.py</Notation>. Это
            первая из четырёх версий одного проекта, поэтому сохраните файл: в
            следующих уроках мы продолжим именно его. Переписывать программу
            наизусть не нужно. Лучше выберите одну команду — например,{" "}
            <Notation>add</Notation> — и проследите её путь от ввода до нового
            словаря в списке.
          </Typography.Text>
          <CodeBlock
            code={firstTodoSnapshot}
            label="Список дел после первого урока"
            language="python"
            showLineNumbers
          />
          <Procedure
            title="Проверяем, что первая версия работает"
            steps={[
              {
                label: "Запустите пустой список.",
                detail: "Команда list должна объяснить, что дел пока нет.",
              },
              {
                label: "Добавьте два дела.",
                detail: "Они должны получить номера 1 и 2.",
              },
              {
                label: "Введите пробелы.",
                detail: "Пустое дело не должно появиться.",
              },
              {
                label: "Завершите программу.",
                detail: "Команда exit возвращает управление терминалу.",
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "checkpoint-state",
      prompt: "Почему next_id хранится отдельно от длины списка?",
      reveal:
        "После будущего удаления длина уменьшится, а уже использованный номер нельзя безопасно выдать снова.",
    },
    {
      id: "checkpoint-exit",
      prompt: "Почему условие цикла можно оставить True?",
      reveal:
        "У программы есть явная команда exit, которая завершает цикл через break.",
    },
  ],
  result: (
    <>
      <Typography.Text>
        Первая версия готова: программа не закрывается после одной команды,
        добавляет непустые дела и умеет показать весь список.
      </Typography.Text>
      <Typography.Text>
        В следующем уроке продолжим с этого же файла. Добавим выбор дела по
        номеру, а затем — отметку выполнения, редактирование и удаление.
      </Typography.Text>
    </>
  ),
});
