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

export const pythonNumbersLessonPublication = Object.freeze({
  id: "python-numbers",
  routeSlug: "chisla-i-vyrazheniya",
  title: "Числа, типы и арифметические выражения",
  summary:
    "Разберём целые и вещественные числа, порядок вычислений и разницу между обычным, целым делением и остатком.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-numbers-precedence",
    "python-numbers-division",
    "python-numbers-remainder",
    "python-numbers-conversion",
    "python-numbers-local-run",
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

export const pythonCompoundConditionsLessonPublication = Object.freeze({
  id: "python-compound-conditions",
  routeSlug: "sostavnye-usloviya",
  title: "Несколько ветвей и составные условия",
  summary:
    "Научимся выбирать одну из нескольких ветвей и собирать проверки с помощью elif, and, or и not.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-compound-conditions-branch-order",
    "python-compound-conditions-logic-trace",
    "python-compound-conditions-boundary",
    "python-compound-conditions-fix",
    "python-compound-conditions-local-run",
  ]),
});

export const pythonForRangeLessonPublication = Object.freeze({
  id: "python-for-range",
  routeSlug: "for-i-range",
  title: "for и range: повторяем известное число раз",
  summary:
    "Разберём, какие числа создаёт range и как for последовательно обрабатывает каждое из них.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-for-range-range-values",
    "python-for-range-sum-trace",
    "python-for-range-boundary",
    "python-for-range-fix",
    "python-for-range-local-run",
  ]),
});

export const pythonWhileLessonPublication = Object.freeze({
  id: "python-while",
  routeSlug: "while",
  title: "while: повторяем, пока условие верно",
  summary:
    "Научимся связывать условие продолжения с изменением состояния и заранее видеть момент остановки.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-while-trace",
    "python-while-stop-value",
    "python-while-condition",
    "python-while-fix",
    "python-while-local-run",
  ]),
});

export const pythonLoopStateLessonPublication = Object.freeze({
  id: "python-loop-state",
  routeSlug: "schetchiki-i-nakopiteli",
  title: "Счётчики, накопители и границы цикла",
  summary:
    "Разделим счётчик и накопитель, проследим их изменения и избежим лишней итерации.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-loop-state-counter",
    "python-loop-state-accumulator",
    "python-loop-state-boundary",
    "python-loop-state-fix",
    "python-loop-state-local-run",
  ]),
});

export const pythonNumberDigitsLessonPublication = Object.freeze({
  id: "python-number-digits",
  routeSlug: "tsifry-chisla",
  title: "Цифры числа: деление нацело и остаток",
  summary:
    "Научимся отделять последнюю цифру, укорачивать число и собирать из этих шагов понятный цикл.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-number-digits-last",
    "python-number-digits-shorten",
    "python-number-digits-trace",
    "python-number-digits-sum",
    "python-number-digits-local-run",
  ]),
});

export const pythonStringsLessonPublication = Object.freeze({
  id: "python-strings",
  routeSlug: "stroki",
  title: "Строки: символы, индексы и срезы",
  summary:
    "Разберём строку как неизменяемую последовательность и научимся точно выбирать её части.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-strings-index",
    "python-strings-negative-index",
    "python-strings-slice",
    "python-strings-fix",
    "python-strings-local-run",
  ]),
});

export const pythonListsLessonPublication = Object.freeze({
  id: "python-lists",
  routeSlug: "spiski",
  title: "Списки: храним и изменяем последовательность",
  summary:
    "Научимся читать, изменять и последовательно обрабатывать набор значений в списке.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-lists-index",
    "python-lists-mutation",
    "python-lists-append",
    "python-lists-trace",
    "python-lists-local-run",
  ]),
});

export const pythonSetsLessonPublication = Object.freeze({
  id: "python-sets",
  routeSlug: "mnozhestva",
  title: "Множества: оставляем уникальные значения",
  summary:
    "Разберём, как множество удаляет повторы и быстро отвечает на вопрос о принадлежности.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-sets-unique-count",
    "python-sets-membership",
    "python-sets-add",
    "python-sets-order",
    "python-sets-local-run",
  ]),
});

export const pythonDictionariesLessonPublication = Object.freeze({
  id: "python-dictionaries",
  routeSlug: "slovari",
  title: "Словари: связываем ключи и значения",
  summary:
    "Научимся хранить пары ключ–значение, безопасно читать и обновлять данные по ключу.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-dictionaries-lookup",
    "python-dictionaries-update",
    "python-dictionaries-membership",
    "python-dictionaries-get",
    "python-dictionaries-local-run",
  ]),
});

export const pythonSortingSearchLessonPublication = Object.freeze({
  id: "python-sorting-search",
  routeSlug: "sortirovka-i-poisk",
  title: "Сортировка и поиск в коллекции",
  summary:
    "Разберём линейный поиск, различие sorted и list.sort и выбор поля, по которому сравниваются записи.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-sorting-search-linear",
    "python-sorting-search-sorted",
    "python-sorting-search-in-place",
    "python-sorting-search-key",
    "python-sorting-search-local-run",
  ]),
});

export const pythonComprehensionsLessonPublication = Object.freeze({
  id: "python-comprehensions",
  routeSlug: "vklyucheniya",
  title: "Включения: собираем коллекции коротко",
  summary:
    "Перепишем знакомый цикл как читаемое списковое, множественное или словарное включение без скрытой сложности.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-comprehensions-list",
    "python-comprehensions-filter",
    "python-comprehensions-set",
    "python-comprehensions-dict",
    "python-comprehensions-local-run",
  ]),
});

export const pythonFunctionsLessonPublication = Object.freeze({
  id: "python-functions",
  routeSlug: "funktsii",
  title: "Функции: параметры и возвращаемый результат",
  summary:
    "Разберём путь данных от аргумента к параметру и от return к месту вызова функции.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-functions-call",
    "python-functions-parameters",
    "python-functions-return",
    "python-functions-fix",
    "python-functions-local-run",
  ]),
});

export const pythonProgramPartsLessonPublication = Object.freeze({
  id: "python-program-parts",
  routeSlug: "chasti-programmy",
  title: "Разбиваем программу на понятные части",
  summary:
    "Научимся разделять ввод, вычисление и вывод между небольшими функциями с ясными контрактами.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-program-parts-responsibility",
    "python-program-parts-data-flow",
    "python-program-parts-composition",
    "python-program-parts-fix",
    "python-program-parts-local-run",
  ]),
});

export const pythonIteratorsGeneratorsLessonPublication = Object.freeze({
  id: "python-iterators-generators",
  routeSlug: "iteratory-i-generatory",
  title: "Итераторы и генераторы: значения по одному",
  summary:
    "Заглянем внутрь for, увидим исчерпание итератора и напишем генератор, который выдаёт значения по мере запроса.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-iterators-generators-iterable",
    "python-iterators-generators-next",
    "python-iterators-generators-exhausted",
    "python-iterators-generators-yield",
    "python-iterators-generators-local-run",
  ]),
});

export const pythonRecursionLessonPublication = Object.freeze({
  id: "python-recursion",
  routeSlug: "rekursiya",
  title: "Рекурсия: базовый случай, шаг и трассировка",
  summary:
    "Разберём, как рекурсивный вызов приближает задачу к базовому случаю и как возвращается результат.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-recursion-base-case",
    "python-recursion-call-trace",
    "python-recursion-return-trace",
    "python-recursion-fix",
    "python-recursion-local-run",
  ]),
});

export const pythonExceptionsLessonPublication = Object.freeze({
  id: "python-exceptions",
  routeSlug: "obrabotka-isklyucheniy",
  title: "Ожидаемые ошибки: try и except",
  summary:
    "Научимся перехватывать только ожидаемую ошибку, сохранять понятный путь программы и не прятать настоящие сбои.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-exceptions-value-error",
    "python-exceptions-specific",
    "python-exceptions-else",
    "python-exceptions-loop",
    "python-exceptions-local-run",
  ]),
});

export const pythonFilesLessonPublication = Object.freeze({
  id: "python-files",
  routeSlug: "fayly",
  title: "Читаем данные из файла",
  summary:
    "Научимся читать текстовый файл построчно, очищать переносы и преобразовывать данные осознанно.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-files-read-line",
    "python-files-strip",
    "python-files-parse",
    "python-files-aggregate",
    "python-files-local-run",
  ]),
});

export const pythonTablesLessonPublication = Object.freeze({
  id: "python-tables",
  routeSlug: "tablitsy",
  title: "Обрабатываем строки и таблицы",
  summary:
    "Разберём путь табличной строки от разделения на поля до отбора и итогового вычисления.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-tables-split",
    "python-tables-columns",
    "python-tables-filter",
    "python-tables-aggregate",
    "python-tables-local-run",
  ]),
});

export const pythonBruteforceLessonPublication = Object.freeze({
  id: "python-bruteforce",
  routeSlug: "polnyy-perebor",
  title: "Полный перебор: строим и проверяем варианты",
  summary:
    "Научимся задавать конечное пространство вариантов и проверять каждый вариант по условию.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-bruteforce-range",
    "python-bruteforce-condition",
    "python-bruteforce-count",
    "python-bruteforce-nested",
    "python-bruteforce-local-run",
  ]),
});

export const pythonSelectResultLessonPublication = Object.freeze({
  id: "python-select-result",
  routeSlug: "otbor-rezultata",
  title: "Отбор результата: ограничения, минимум и максимум",
  summary:
    "Разделим проверку допустимости и выбор лучшего результата, не теряя подходящие варианты.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-select-result-filter",
    "python-select-result-minimum",
    "python-select-result-maximum",
    "python-select-result-initial-value",
    "python-select-result-local-run",
  ]),
});

export const pythonIndependentProgramLessonPublication = Object.freeze({
  id: "python-independent-program",
  routeSlug: "gotovaya-programma",
  title: "Проверяем весь сценарий и наводим порядок в коде",
  summary:
    "Проверим обычные и ошибочные сценарии, а затем приведём выросший код в порядок.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-independent-program-contract",
    "python-independent-program-decomposition",
    "python-independent-program-test-cases",
    "python-independent-program-fix",
    "python-independent-program-local-run",
  ]),
});

export const pythonTodoStartLessonPublication = Object.freeze({
  id: "python-todo-start",
  routeSlug: "spisok-del",
  title: "Добавляем дела и выводим список",
  summary:
    "Начнём с простого: добавим командное меню, ввод нового дела и понятный вывод списка.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-todo-start-storage",
    "python-todo-start-command",
    "python-todo-start-add",
    "python-todo-start-show",
    "python-todo-start-local-run",
  ]),
});

export const pythonTodoActionsLessonPublication = Object.freeze({
  id: "python-todo-actions",
  routeSlug: "deystviya-so-spiskom",
  title: "Отмечаем выполненное, редактируем и удаляем",
  summary:
    "Добавим выбор дела по номеру, отметку выполнения, редактирование и удаление.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-todo-actions-find",
    "python-todo-actions-complete",
    "python-todo-actions-edit",
    "python-todo-actions-delete",
    "python-todo-actions-local-run",
  ]),
});

export const pythonTodoStorageLessonPublication = Object.freeze({
  id: "python-todo-storage",
  routeSlug: "sohranenie-spiska-del",
  title: "Сохраняем дела между запусками",
  summary:
    "Запишем дела в JSON и вернём их после нового запуска, даже если файла пока нет.",
  status: "published",
  practiceTaskIds: Object.freeze([
    "python-todo-storage-import",
    "python-todo-storage-write",
    "python-todo-storage-read",
    "python-todo-storage-missing",
    "python-todo-storage-local-run",
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
    "Собирать знакомые команды и конструкции в терминальное приложение с сохранением данных",
  ]),
  status: "published",
  stage: "complete",
  modules: Object.freeze([
    Object.freeze({
      id: "start",
      title: "Старт и отладка",
      summary:
        "Команды, значения, числовые выражения, ввод, вывод и первые ошибки.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-first-program",
          title: "Первая программа: ввод, вычисление и вывод",
          outcome: "Собрать и запустить линейную программу.",
        }),
        Object.freeze({
          id: "python-numbers",
          title: "Числа, типы и арифметические выражения",
          outcome: "Осознанно вычислять выражения и преобразовывать числа.",
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
        Object.freeze({
          id: "python-number-digits",
          title: "Цифры числа: деление нацело и остаток",
          outcome: "Обработать цифры числа в цикле.",
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
        Object.freeze({
          id: "python-sorting-search",
          title: "Сортировка и поиск в коллекции",
          outcome: "Найти запись и упорядочить данные по нужному признаку.",
        }),
        Object.freeze({
          id: "python-comprehensions",
          title: "Включения: собираем коллекции коротко",
          outcome: "Заменить простой цикл читаемым включением.",
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
        Object.freeze({
          id: "python-iterators-generators",
          title: "Итераторы и генераторы: значения по одному",
          outcome: "Понять работу for и создать ленивую последовательность.",
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
        Object.freeze({
          id: "python-exceptions",
          title: "Ожидаемые ошибки: try и except",
          outcome: "Обработать ожидаемую ошибку, не скрывая остальные.",
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
      title: "Финальный проект: список дел",
      summary:
        "Шаг за шагом соберём программу, которой можно пользоваться: добавим работу со списком, сохраним данные и разберёмся с ошибками.",
      lessonPlan: Object.freeze([
        Object.freeze({
          id: "python-todo-start",
          title: "Добавляем дела и выводим список",
          outcome: "Собрать первую рабочую версию с циклом команд.",
        }),
        Object.freeze({
          id: "python-todo-actions",
          title: "Отмечаем выполненное, редактируем и удаляем",
          outcome: "Изменять и удалять дела по выбранному номеру.",
        }),
        Object.freeze({
          id: "python-todo-storage",
          title: "Сохраняем дела между запусками",
          outcome: "Сохранить дела в JSON и вернуть их после запуска.",
        }),
        Object.freeze({
          id: "python-independent-program",
          title: "Проверяем весь сценарий и наводим порядок в коде",
          outcome: "Защитить программу от неверного ввода и проверить целиком.",
        }),
      ]),
    }),
  ]),
});

export const coursePublications = Object.freeze([pythonCoursePublication]);
export const courseLessonPublications = Object.freeze([
  pythonFirstProgramLessonPublication,
  pythonNumbersLessonPublication,
  pythonErrorsLessonPublication,
  pythonConditionsLessonPublication,
  pythonCompoundConditionsLessonPublication,
  pythonForRangeLessonPublication,
  pythonWhileLessonPublication,
  pythonLoopStateLessonPublication,
  pythonNumberDigitsLessonPublication,
  pythonStringsLessonPublication,
  pythonListsLessonPublication,
  pythonSetsLessonPublication,
  pythonDictionariesLessonPublication,
  pythonSortingSearchLessonPublication,
  pythonComprehensionsLessonPublication,
  pythonFunctionsLessonPublication,
  pythonProgramPartsLessonPublication,
  pythonIteratorsGeneratorsLessonPublication,
  pythonRecursionLessonPublication,
  pythonExceptionsLessonPublication,
  pythonFilesLessonPublication,
  pythonTablesLessonPublication,
  pythonBruteforceLessonPublication,
  pythonSelectResultLessonPublication,
  pythonTodoStartLessonPublication,
  pythonTodoActionsLessonPublication,
  pythonTodoStorageLessonPublication,
  pythonIndependentProgramLessonPublication,
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
