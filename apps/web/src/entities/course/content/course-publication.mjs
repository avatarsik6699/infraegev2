export const pythonFirstProgramLessonPublication = Object.freeze({
  id: "python-first-program",
  routeSlug: "pervaya-programma",
  title: "Первая программа: ввод, вычисление и вывод",
  summary:
    "Разберём, как Python выполняет команды, где хранит значения, как получает ввод и выводит результат.",
  status: "review",
  practiceTaskIds: Object.freeze([
    "python-first-program-output-order",
    "python-first-program-variable-trace",
    "python-first-program-input-conversion",
    "python-first-program-expression",
    "python-first-program-local-run",
  ]),
});

export const pythonCoursePublication = Object.freeze({
  id: "python",
  routeSlug: "python",
  title: "Python с нуля для ЕГЭ",
  summary:
    "От первой программы — к задачам и алгоритмам, которые пригодятся на ЕГЭ.",
  audience:
    "Подойдёт, если вы раньше не программировали: начнём с самого начала и будем двигаться небольшими шагами.",
  learningOutcomes: Object.freeze([
    "Понимать, что делает небольшая программа и как меняются значения",
    "Писать и проверять простые программы на Python",
    "Разбираться в сообщениях об ошибках и находить причину",
    "Собирать знакомые команды и конструкции в готовое решение",
  ]),
  status: "review",
  stage: "early_access",
  modules: Object.freeze([
    Object.freeze({
      id: "start",
      title: "Старт и отладка",
      summary: "Команды, значения, ввод, вычисления, вывод и первые ошибки.",
      lessonIds: Object.freeze(["python-first-program"]),
    }),
    Object.freeze({
      id: "conditions",
      title: "Условия",
      summary: "Сравнения, логические выражения и выбор ветви программы.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "loops",
      title: "Циклы",
      summary: "Повторение действий, счётчики, накопители и границы перебора.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "data",
      title: "Строки и коллекции",
      summary:
        "Последовательности, индексы, срезы, списки, множества и словари.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "functions",
      title: "Функции",
      summary: "Параметры, результат и разбиение программы на понятные части.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "recursion",
      title: "Рекурсия",
      summary: "Базовый случай, рекурсивный шаг и трассировка вызовов.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "files",
      title: "Файлы и таблицы",
      summary: "Чтение наборов данных и последовательная обработка строк.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "algorithms",
      title: "Перебор и алгоритмические приёмы",
      summary: "Поиск вариантов, проверка ограничений и оценка результата.",
      lessonIds: Object.freeze([]),
    }),
    Object.freeze({
      id: "final-program",
      title: "Самостоятельная программа",
      summary: "Постановка задачи, реализация, проверка и разбор результата.",
      lessonIds: Object.freeze([]),
    }),
  ]),
});

export const coursePublications = Object.freeze([pythonCoursePublication]);
export const courseLessonPublications = Object.freeze([
  pythonFirstProgramLessonPublication,
]);
