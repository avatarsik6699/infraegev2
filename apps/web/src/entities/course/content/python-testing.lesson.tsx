import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import { LessonSummary } from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTestingLessonPublication } from "./course-publication.mjs";

export const pythonTestingLesson = defineCourseLesson({
  ...pythonTestingLessonPublication,
  masteryThreshold: 0.8,
  level: "advanced",
  learningOutcomes: ["Аннотации", "Unittest", "Эталон", "Свойства"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто пишет программы, которые нужно поддерживать и проверять: в темах
            ЕГЭ аннотации и тесты не нужны, но приём «быстрое решение против
            медленного эталона» полезен и на экзамене. Задачи основных уроков
            решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Код пишут так, чтобы его можно было прочитать и проверить:
              понятные имена, аннотации договорённости и автоматические проверки
              на выбранных и случайных примерах
            </strong>
            . Опора — <Notation>{"assert"}</Notation> и подбор проверочных
            примеров из урока об исключениях, разделение программы на части из
            урока о модулях.
          </Typography.Text>
          <Typography.Text>
            Работать будем с функцией поиска максимального отрицательного числа:
            аннотируем её, напишем модульные тесты и сравним быстрое решение с
            медленным эталоном.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Читаемость",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код должен объяснять задачу именами, константами и комментариями о
              причинах.
            </strong>{" "}
            Ясные имена, короткие функции и явные условия обычно полезнее
            сокращения числа строк. Имя <Notation>{"count"}</Notation> говорит о
            количестве, <Notation>{"total"}</Notation> — о сумме,{" "}
            <Notation>{"best"}</Notation> — о выбранном лучшем результате. Если
            рядом существуют максимум значения и максимум суммы пары, назови их
            по-разному.
          </Typography.Text>
          <Typography.Text>
            Избегай <strong>магических чисел</strong> — необъяснённых констант.
            Если 86400 обозначает число секунд в сутках, имя{" "}
            <Notation>{"SECONDS_PER_DAY"}</Notation> делает смысл видимым.
            Заглавные буквы — соглашение о постоянном значении; Python не
            запрещает его изменить.
          </Typography.Text>
          <Typography.Text>
            Комментарий должен объяснять решение, ограничение или причину.
            Комментарий «увеличиваем i» рядом с <Notation>{"i += 1"}</Notation>{" "}
            обычно менее полезен, чем «левая граница больше не может дать
            допустимое окно».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Аннотации типов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Аннотация типа описывает ожидаемые данные, но Python её не
              проверяет.
            </strong>{" "}
            <strong>Аннотация типа</strong> сообщает читателю и инструментам,
            какие данные ожидаются:
          </Typography.Text>
          <CodeBlock
            code={
              "def count_positive(numbers: list[int]) -> int:\n    return sum(number > 0 for number in numbers)\n\nprint(count_positive([3, -1, 0, 5]))"
            }
            label={
              "Аннотация типа сообщает читателю и инструментам, какие данные ожидаются"
            }
            language="python"
            fileName="count_positive.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"2"}
          />
          <Typography.Text>
            После параметра стоит ожидаемый тип, после{" "}
            <Notation>{"->"}</Notation> — тип результата.{" "}
            <Notation>{"list[int]"}</Notation> означает список целых. Логические
            значения в арифметике ведут себя как 0 и 1, поэтому сумма истинных
            сравнений считает их количество.
          </Typography.Text>
          <Typography.Text>
            Python не проверяет эти аннотации при вызове. Для анализа без
            запуска используют отдельные инструменты проверки типов. Они
            помогают находить несоответствия, но не доказывают математическую
            правильность алгоритма.
          </Typography.Text>
          <CodeBlock
            code={
              "def maximum_negative(numbers: list[int]) -> int | None:\n    best = None\n    for number in numbers:\n        if number < 0 and (best is None or number > best):\n            best = number\n    return best\n\nprint(maximum_negative([5, -9, -2, 0]), maximum_negative([]))"
            }
            label={"Программа на Python"}
            language="python"
            fileName="maximum_negative.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"-2 None"}
          />
          <Typography.Text>
            <Notation>{"int | None"}</Notation> в Python 3.10+ означает один из
            двух вариантов результата. Это помогает помнить про отсутствие
            ответа. Если функция принимает любой перебираемый источник, точнее
            будет <Notation>{"Iterable[int]"}</Notation> из{" "}
            <Notation>{"collections.abc"}</Notation>, а не обязательно{" "}
            <Notation>{"list[int]"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Аннотация — часть описания договорённости. Проверку диапазона,
            запрет пустого входа и изменение аргументов часто надо описать
            отдельно в документации.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Модульные тесты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Модульный тест — программа, которая сравнивает поведение функции с
              ожидаемым.
            </strong>{" "}
            <strong>Тест</strong> — программа, сравнивающая фактическое
            поведение с ожидаемым. <strong>Модульный тест</strong> проверяет
            небольшую самостоятельную часть, например функцию. Разделённые
            вычисление и ввод позволяют делать это без ручного набора данных.
          </Typography.Text>
          <CodeBlock
            code={
              'import unittest\n\ndef maximum_negative(numbers):\n    best = None\n    for number in numbers:\n        if number < 0 and (best is None or number > best):\n            best = number\n    return best\n\nclass MaximumNegativeTests(unittest.TestCase):\n    def test_mixed_values(self):\n        self.assertEqual(maximum_negative([5, -9, -2, 0]), -2)\n\n    def test_no_negative_values(self):\n        self.assertIsNone(maximum_negative([0, 4]))\n\n    def test_empty_input(self):\n        self.assertIsNone(maximum_negative([]))\n\nif __name__ == "__main__":\n    unittest.main()'
            }
            label={
              "Разделённые вычисление и ввод позволяют делать это без ручного набора данных"
            }
            language="python"
            fileName="maximum_negative.py"
            showLineNumbers={false}
          />
          <Typography.Text>
            <Notation>{"unittest.TestCase"}</Notation> предоставляет методы
            проверок. Имя метода начинается с <Notation>{"test_"}</Notation>,
            чтобы система обнаружила тест. <Notation>{"assertEqual"}</Notation>{" "}
            требует равенство, <Notation>{"assertIsNone"}</Notation> — значение{" "}
            <Notation>{"None"}</Notation>. В отличие от инструкции{" "}
            <Notation>{"assert"}</Notation>, это обычные методы тестовой
            библиотеки, они не исчезают из-за <Notation>{"-O"}</Notation>.
            Запуск печатает точки для пройденных тестов и строку{" "}
            <Notation>{"OK"}</Notation>; время прогона в отчёте каждый раз своё.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Медленный эталон",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Быстрое решение проверяют медленным, но очевидным эталоном.
            </strong>{" "}
            Оптимизированный алгоритм может быть трудно проверить глазами. Для
            маленьких данных напиши очевидный полный перебор, затем сравнивай
            результаты. Медленный вариант здесь служит независимым образцом,
            поэтому желательно, чтобы он не повторял ту же самую хитрую логику.
          </Typography.Text>
          <Typography.Text>
            Например, сумму цифр можно считать арифметикой, а эталон — прямо
            через запись числа:
          </Typography.Text>
          <CodeBlock
            code={
              'import random\n\ndef digit_sum(number):\n    number = abs(number)\n    total = 0\n    while number > 0:\n        total += number % 10\n        number //= 10\n    return total\n\ndef digit_sum_slow(number):\n    return sum(int(c) for c in str(abs(number)))\n\nrng = random.Random(42)\nfor _ in range(1000):\n    n = rng.randint(-10**6, 10**6)\n    assert digit_sum(n) == digit_sum_slow(n), n\nprint("совпадает на 1000 случайных числах")'
            }
            label={
              "Например, сумму цифр можно считать арифметикой, а эталон — прямо через запись числа"
            }
            language="python"
            fileName="digit_sum.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"совпадает на 1000 случайных числах"}
          />
          <Typography.Text>
            Договорённость — целые числа любого знака. При случайной генерации
            используй фиксированное начальное состояние генератора, например{" "}
            <Notation>{"random.Random(42)"}</Notation>, чтобы ошибку можно было
            воспроизвести. Случайные тесты дополняют, а не заменяют специально
            выбранные границы: число 0 случайно может и не выпасть.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Проверка свойств",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Иногда проверяют не ответ, а свойство, которое ему обязано
              принадлежать.
            </strong>{" "}
            Иногда полезно проверять общие свойства. После сортировки должны
            сохраниться количество и набор элементов с учётом повторов. Для
            перевода основания <Notation>{"int(запись, base)"}</Notation> от
            записи числа должно давать исходное число. Каждый найденный делитель
            обязан делить число без остатка, а список делителей должен содержать
            1 и само положительное число.
          </Typography.Text>
          <CodeBlock
            code={
              "from collections import Counter\n\ndata = [5, 3, 5, -1, 0]\nresult = sorted(data)\nordered = all(a <= b for a, b in zip(result, result[1:]))\nprint(ordered, Counter(result) == Counter(data))"
            }
            label={"Программа на Python"}
            language="python"
            fileName="data.py"
            showLineNumbers={false}
            outputLayout="lines"
            output={"True True"}
          />
          <Typography.Text>
            Однако отдельное свойство может пропустить ошибку: список{" "}
            <Notation>{"[1, n]"}</Notation> содержит только настоящие делители,
            но не все. Поэтому проверяй и допустимость найденного, и полноту
            решения.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Достаточно ли теста <Notation>{"is_prime(7) == True"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Нет: функция, всегда возвращающая <Notation>{"True"}</Notation>, его
            пройдёт. Нужны хотя бы простое 2, обычное простое, составное чётное,
            составное нечётное, точный квадрат вроде 49, а также 0, 1 и
            отрицательное число, если функция обещает их обрабатывать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Почему эталон для проверки быстрого решения не должен повторять ту
            же хитрую логику?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Иначе обе функции ошибутся одинаково и проверка ничего не покажет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Почему у генератора случайных чисел в тестах фиксируют начальное
            состояние?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Чтобы найденную ошибку можно было воспроизвести тем же набором
            чисел.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Какие свойства результата проверить у функции, которая возвращает
            список делителей числа?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Каждый элемент делит число без остатка, есть 1 и само число, нет
            повторов, и количество совпадает с полным перебором.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <LessonSummary
        items={[
          {
            note: (
              <>
                Имена, константы и комментарии объясняют смысл и причины, а не
                пересказывают код.
              </>
            ),
          },
          {
            note: (
              <>
                Аннотации <Notation>{"list[int]"}</Notation>,{" "}
                <Notation>{"int | None"}</Notation> описывают договорённость;
                Python их не проверяет.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"unittest"}</Notation>: методы{" "}
                <Notation>{"test_…"}</Notation> с{" "}
                <Notation>{"assertEqual"}</Notation>,{" "}
                <Notation>{"assertIsNone"}</Notation> и другими.
              </>
            ),
          },
          {
            note: (
              <>
                Быстрое решение сравнивают с медленным эталоном на случайных
                данных с фиксированным генератором.
              </>
            ),
          },
          {
            note: (
              <>
                Свойства результата проверяют вместе с полнотой: одно свойство
                может пропустить ошибку.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
