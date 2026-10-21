import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  TerminalCommand,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTestingLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-testing.media";

export const pythonTestingLesson = defineCourseLesson({
  ...pythonTestingLessonPublication,
  masteryThreshold: 0.8,
  level: "advanced",
  learningOutcomes: ["Аннотации", "unittest", "Эталон", "Свойства"],
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
            Программу из урока 7.1 ты проверял руками: запускал на обычном,
            пустом и испорченном файле и сверял вывод. После каждой правки всё
            это пришлось бы повторять.{" "}
            <strong>
              Код пишут так, чтобы его было легко прочитать и проверить:
              понятные имена, аннотации договорённости и тесты, которые
              проверяют программу за тебя
            </strong>
            .
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
            Её пишут после имени параметра и после <Notation>{"->"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "def count_positive(numbers: list[int]) -> int:\n    return sum(number > 0 for number in numbers)\n\nprint(count_positive([3, -1, 0, 5]))"
            }
            label={"Аннотации у count_positive"}
            language="python"
            fileName="main.py"
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
            label={"Результат int или None"}
            language="python"
            fileName="main.py"
            output={"-2 None"}
          />
          <Typography.Text>
            <Notation>{"int | None"}</Notation> в Python 3.10+ означает один из
            двух вариантов результата. Это помогает помнить про отсутствие
            ответа.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: не только список" kind="nuance">
            <Typography.Text>
              Если функция принимает любой перебираемый источник — список,
              кортеж, генератор, — точнее аннотация{" "}
              <Notation>{"Iterable[int]"}</Notation> из модуля{" "}
              <Notation>{"collections.abc"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
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
              Модульный тест — программа, которая вызывает функцию и сравнивает
              результат с ожидаемым.
            </strong>{" "}
            Проверим <Notation>{"summarize"}</Notation> из урока 7.1. Тесты
            лежат в отдельном файле рядом с{" "}
            <Notation>{"analyze_numbers.py"}</Notation> и импортируют функцию,
            как <Notation>{"check.py"}</Notation> в том уроке:
          </Typography.Text>
          <CodeBlock
            code={
              'import unittest\n\nfrom analyze_numbers import summarize\n\n\nclass SummarizeTests(unittest.TestCase):\n    def test_usual_numbers(self):\n        report = summarize([5, -2, 10, 7])\n        self.assertEqual(report["total"], 20)\n        self.assertEqual(report["maximum"], 10)\n\n    def test_one_number(self):\n        self.assertEqual(summarize([-5])["average"], -5.0)\n\n    def test_empty_list(self):\n        self.assertIsNone(summarize([])["maximum"])\n\n    def test_fractional_average(self):\n        self.assertEqual(summarize([1, 2])["average"], 1.5)\n\n\nif __name__ == "__main__":\n    unittest.main()'
            }
            label={"Тесты для summarize"}
            collapsible={false}
            language="python"
            fileName="test_summary.py"
            output={
              "....\n----------------------------------------------------------------------\nRan 4 tests in 0.000s\n\nOK"
            }
          />
          <Typography.Text>
            Класс тестов наследует <Notation>{"unittest.TestCase"}</Notation>,
            как <Notation>{"Task"}</Notation> наследовал{" "}
            <Notation>{"NamedItem"}</Notation> в уроке о классах. Каждый метод с
            именем на <Notation>{"test_"}</Notation> — отдельный тест.{" "}
            <Notation>{"assertEqual(a, b)"}</Notation> требует равенства,{" "}
            <Notation>{"assertIsNone"}</Notation> — значения{" "}
            <Notation>{"None"}</Notation>. Точка в выводе — пройденный тест,{" "}
            <Notation>{"OK"}</Notation> — все прошли; время прогона у тебя может
            быть другим. Запуск из терминала:
          </Typography.Text>
          <TerminalCommand command={"python test_summary.py"} />
          <Typography.Text>
            Тесты нужны ради момента, когда что-то сломалось. Допустим, при
            правке в <Notation>{"summarize"}</Notation> написали{" "}
            <Notation>{"//"}</Notation> вместо <Notation>{"/"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={'        "average": total // len(numbers),'}
            label={"Ошибка в summarize и вывод тестов"}
            collapsible={false}
            language="python"
            fileName="analyze_numbers.py"
            output={
              '.F..\n======================================================================\nFAIL: test_fractional_average (__main__.SummarizeTests.test_fractional_average)\n----------------------------------------------------------------------\nTraceback (most recent call last):\n  File "test_summary.py", line 19, in test_fractional_average\n    self.assertEqual(summarize([1, 2])["average"], 1.5)\nAssertionError: 1 != 1.5\n\n----------------------------------------------------------------------\nRan 4 tests in 0.000s\n\nFAILED (failures=1)'
            }
          />
          <Typography.Text>
            Вторая точка стала <Notation>{"F"}</Notation>: тест{" "}
            <Notation>{"test_fractional_average"}</Notation> упал. Ниже — строка
            теста и что не совпало: получили 1, ждали 1.5. Остальные три теста
            прошли — для них целое деление случайно дало верный ответ. Поэтому
            тесты подбирают так, чтобы каждый ловил свою ошибку, как в уроке об
            исключениях.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: assertEqual и assert"
            kind="nuance"
          >
            <Typography.Text>
              Методы <Notation>{"assertEqual"}</Notation> и другие — обычные
              методы библиотеки: в отличие от инструкции{" "}
              <Notation>{"assert"}</Notation>, они не отключаются при запуске{" "}
              <Notation>{"python -O"}</Notation> и показывают оба значения при
              расхождении.
            </Typography.Text>
          </ProofDisclosure>
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
            label={"digit_sum против эталона на 1000 случайных числах"}
            language="python"
            fileName="main.py"
            output={"совпадает на 1000 случайных числах"}
          />
          <Typography.Text>
            Договорённость — целые числа любого знака.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.oracleCheck}
            caption={
              <>
                Одно и то же <Notation>{"n"}</Notation> идёт в обе функции. Пока
                ответы равны — следующее число; при расхождении{" "}
                <Notation>{"assert"}</Notation> останавливает программу и
                показывает <Notation>{"n"}</Notation>.
              </>
            }
          />
          <Typography.Text>
            При случайной генерации используй фиксированное начальное состояние
            генератора, например <Notation>{"random.Random(42)"}</Notation>,
            чтобы ошибку можно было воспроизвести. Случайные тесты дополняют, а
            не заменяют специально выбранные границы: число 0 случайно может и
            не выпасть.
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
            После сортировки должны сохраниться количество и набор элементов с
            учётом повторов. Для перевода основания{" "}
            <Notation>{"int(запись, base)"}</Notation> от записи числа должно
            давать исходное число. Каждый найденный делитель обязан делить число
            без остатка, а список делителей должен содержать 1 и само
            положительное число.
          </Typography.Text>
          <CodeBlock
            code={
              "from collections import Counter\n\ndata = [5, 3, 5, -1, 0]\nresult = sorted(data)\nordered = all(a <= b for a, b in zip(result, result[1:]))\nprint(ordered, Counter(result) == Counter(data))"
            }
            label={"Свойства результата sorted"}
            language="python"
            fileName="main.py"
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
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Прогон четырёх тестов начался строкой <Notation>{".F.."}</Notation>.
            Что это значит?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Второй тест упал, остальные три прошли. Ниже в отчёте — имя упавшего
            теста и какие значения не совпали.
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
      <Typography.Text>
        Читаемый код объясняет себя, а тесты проверяют его после каждой правки —
        быстрее и надёжнее ручных запусков. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Читаемость",
            note: (
              <>Имена и константы говорят о смысле, комментарии — о причинах.</>
            ),
          },
          {
            key: "Аннотации",
            note: (
              <>
                <Notation>{"list[int]"}</Notation>,{" "}
                <Notation>{"int | None"}</Notation> описывают договорённость;
                Python их не проверяет.
              </>
            ),
          },
          {
            key: <Notation>{"unittest"}</Notation>,
            note: (
              <>
                Методы <Notation>{"test_…"}</Notation> с{" "}
                <Notation>{"assertEqual"}</Notation>; точка — прошёл,{" "}
                <Notation>{"F"}</Notation> — упал.
              </>
            ),
          },
          {
            key: "Эталон",
            note: (
              <>
                Быстрое решение сверяют с медленным на случайных данных с
                фиксированным генератором.
              </>
            ),
          },
          {
            key: "Свойства",
            note: (
              <>
                Проверяют и допустимость ответа, и полноту: одно свойство может
                пропустить ошибку.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
