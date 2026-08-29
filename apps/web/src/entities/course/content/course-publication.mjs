export const pythonFirstProgramLessonPublication = Object.freeze({
  id: "python-first-program",
  routeSlug: "pervaya-programma",
  title: "Первая программа: ввод, вычисление и вывод",
  summary:
    "Разберём, как Python выполняет команды, где хранит значения, как получает ввод и выводит результат.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-first-program-output-order",
    "python-first-program-variable-trace",
    "python-first-program-input-conversion",
    "python-first-program-expression",
    "python-first-program-local-run",
  ]),
});

export const pythonConditionsLessonPublication = Object.freeze({
  id: "python-conditions",
  routeSlug: "usloviya",
  title: "Условия: сравнения и выбор из двух вариантов",
  summary:
    "Разберём, как сравнения помогают программе выбрать одну из двух ветвей и почему граничные значения нужно проверять отдельно.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-conditions-comparison-result",
    "python-conditions-branch-trace",
    "python-conditions-boundary",
    "python-conditions-operator",
    "python-conditions-local-run",
  ]),
});

export const pythonErrorsLessonPublication = Object.freeze({
  id: "python-errors",
  routeSlug: "oshibki",
  title: "Ошибки: читаем сообщение и находим причину",
  summary:
    "Разберём, как читать сообщение Python снизу вверх, находить строку остановки и отличать несколько частых причин ошибки.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-errors-final-line",
    "python-errors-source-line",
    "python-errors-syntax-fix",
    "python-errors-value-error",
    "python-errors-local-fix",
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
  status: "published",
  stage: "early_access",
  modules: Object.freeze([
    Object.freeze({
      id: "start",
      title: "Старт и отладка",
      summary: "Команды, значения, ввод, вычисления, вывод и первые ошибки.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-first-program",
          title: "Первая программа: ввод, вычисление и вывод",
          outcome: "Собрать и запустить линейную программу.",
        }),
        Object.freeze({
          id: "python-errors",
          title: "Ошибки: читаем сообщение и находим причину",
          outcome: "Найти строку и причину базовой ошибки.",
        }),
      ]),
    }),
    Object.freeze({
      id: "conditions",
      title: "Условия",
      summary: "Сравнения, логические выражения и выбор ветви программы.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-conditions",
          title: "Условия: сравнения и выбор из двух вариантов",
          outcome: "Написать программу с if/else.",
        }),
        Object.freeze({
          id: "python-compound-conditions",
          title: "Несколько ветвей и составные условия",
          outcome: "Использовать elif, and, or и not.",
        }),
      ]),
    }),
    Object.freeze({
      id: "loops",
      title: "Циклы",
      summary: "Повторение действий, счётчики, накопители и границы перебора.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-for-range",
          title: "for и range: повторяем известное число раз",
          outcome: "Выполнить действие заданное число раз.",
        }),
        Object.freeze({
          id: "python-while",
          title: "while: повторяем, пока условие верно",
          outcome: "Управлять циклом через условие.",
        }),
        Object.freeze({
          id: "python-loop-state",
          title: "Счётчики, накопители и границы цикла",
          outcome: "Посчитать количество, сумму и избежать лишней итерации.",
        }),
      ]),
    }),
    Object.freeze({
      id: "data",
      title: "Строки и коллекции",
      summary:
        "Последовательности, индексы, срезы, списки, множества и словари.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-strings",
          title: "Строки: символы, индексы и срезы",
          outcome: "Читать и преобразовывать части строки.",
        }),
        Object.freeze({
          id: "python-lists",
          title: "Списки: храним и изменяем последовательность",
          outcome: "Обрабатывать изменяемый набор значений.",
        }),
        Object.freeze({
          id: "python-sets",
          title: "Множества: оставляем уникальные значения",
          outcome: "Удалять повторы и проверять принадлежность.",
        }),
        Object.freeze({
          id: "python-dictionaries",
          title: "Словари: связываем ключи и значения",
          outcome: "Находить и обновлять значение по ключу.",
        }),
      ]),
    }),
    Object.freeze({
      id: "functions",
      title: "Функции",
      summary: "Параметры, результат и разбиение программы на понятные части.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-functions",
          title: "Функции: параметры и возвращаемый результат",
          outcome: "Оформить вычисление как функцию.",
        }),
        Object.freeze({
          id: "python-program-parts",
          title: "Разбиваем программу на понятные части",
          outcome: "Собрать решение из нескольких функций.",
        }),
      ]),
    }),
    Object.freeze({
      id: "recursion",
      title: "Рекурсия",
      summary: "Базовый случай, рекурсивный шаг и трассировка вызовов.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-recursion",
          title: "Рекурсия: базовый случай, шаг и трассировка",
          outcome: "Проследить и написать простой рекурсивный вызов.",
        }),
      ]),
    }),
    Object.freeze({
      id: "files",
      title: "Файлы и таблицы",
      summary: "Чтение наборов данных и последовательная обработка строк.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-files",
          title: "Читаем данные из файла",
          outcome: "Безопасно получить строки и числа из файла.",
        }),
        Object.freeze({
          id: "python-tables",
          title: "Обрабатываем строки и таблицы",
          outcome: "Преобразовать табличные данные в результат.",
        }),
      ]),
    }),
    Object.freeze({
      id: "algorithms",
      title: "Перебор и алгоритмические приёмы",
      summary: "Поиск вариантов, проверка ограничений и оценка результата.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-bruteforce",
          title: "Полный перебор: строим и проверяем варианты",
          outcome: "Перечислить допустимые варианты программой.",
        }),
        Object.freeze({
          id: "python-select-result",
          title: "Отбор результата: ограничения, минимум и максимум",
          outcome: "Выбрать лучший подходящий результат.",
        }),
      ]),
    }),
    Object.freeze({
      id: "final-program",
      title: "Самостоятельная программа",
      summary: "Постановка задачи, реализация, проверка и разбор результата.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-independent-program",
          title: "От условия к готовой программе",
          outcome:
            "Спроектировать, реализовать и проверить самостоятельное решение.",
        }),
      ]),
    }),
  ]),
});

export const coursePublications = Object.freeze([pythonCoursePublication]);
export const courseLessonPublications = Object.freeze([
  pythonFirstProgramLessonPublication,
  pythonErrorsLessonPublication,
  pythonConditionsLessonPublication,
]);

export const findCoursePublicationByRouteSlug = (routeSlug) =>
  coursePublications.find((course) => course.routeSlug === routeSlug);

export const findCourseLessonPublicationByRouteSlugs = (
  courseRouteSlug,
  lessonRouteSlug,
) => {
  const course = findCoursePublicationByRouteSlug(courseRouteSlug);
  if (!course) return undefined;
  const memberIds = new Set(
    course.modules.flatMap((courseModule) =>
      courseModule.lessonPlan.map((lesson) => lesson.id),
    ),
  );
  return courseLessonPublications.find(
    (lesson) =>
      memberIds.has(lesson.id) && lesson.routeSlug === lessonRouteSlug,
  );
};
