import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonTuplesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-tuples.media";

export const pythonTuplesLesson = defineCourseLesson({
  ...pythonTuplesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Распаковывать", "Обменивать", "Перебирать совместно"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Кортеж — короткая неизменяемая запись, а распаковка раздаёт
              элементы последовательности по именам за одно присваивание
            </strong>
            . Опора — список прошлого урока: кортеж — его неизменяемый
            родственник, а распаковка работает для обоих.
          </Typography.Text>
          <Typography.Text>
            Данные урока — результаты учеников парами «имя и балл»:{" "}
            <Notation>{'("Анна", 91)'}</Notation>,{" "}
            <Notation>{'("Илья", 84)'}</Notation>,{" "}
            <Notation>{'("Марк", 95)'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Кортеж",
      explanation: (
        <>
          <Typography.Text>
            <strong>Кортеж похож на список, но его нельзя изменить.</strong>{" "}
            <strong>Кортеж</strong> (<Notation>{"tuple"}</Notation>) похож на
            список, но нельзя заменить его элемент, добавить или удалить
            позицию. Он подходит для небольшой записи: координат, пары «имя и
            результат», нескольких возвращаемых значений.
          </Typography.Text>
          <CodeBlock
            code={
              "point = (3, 5)\nprint(point[0])\nsingle = (8,)\nempty = ()\nprint(type((8)), type(single), len(empty))"
            }
            label={"Программа на Python"}
            language="python"
            fileName="point.py"
            output={"3\n<class 'int'> <class 'tuple'> 0"}
          />
          <Typography.Text>
            Кортеж создаёт запятая, а не только круглые скобки.{" "}
            <Notation>{"(8)"}</Notation> — просто число в скобках,{" "}
            <Notation>{"(8,)"}</Notation> — кортеж из одного элемента. Попытка
            заменить элемент остановит программу:
          </Typography.Text>
          <CodeBlock
            code={"point = (3, 5)\npoint[0] = 4"}
            label={"Попытка заменить элемент остановит программу"}
            language="python"
            fileName="point.py"
            error={"TypeError: 'tuple' object does not support item assignment"}
          />
          <Typography.Text>
            Неизменяемость внешнего кортежа не делает неизменяемым список внутри
            него: содержимое такого списка по-прежнему можно менять.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Распаковка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Распаковка связывает несколько имён с элементами
              последовательности.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "point = (3, 5)\nx, y = point\nprint(x, y)\n\na = 10\nb = 20\na, b = b, a\nprint(a, b)"
            }
            label={
              "Распаковка связывает несколько имён с элементами последовательности"
            }
            language="python"
            fileName="point.py"
            output={"3 5\n20 10"}
          />
          <Typography.Text>
            Справа сначала вычисляются прежние значения{" "}
            <Notation>{"b"}</Notation> и <Notation>{"a"}</Notation>, затем
            выполняется присваивание. Обычные последовательные строки{" "}
            <Notation>{"a = b"}</Notation> и <Notation>{"b = a"}</Notation>{" "}
            обмена не дадут: прежнее <Notation>{"a"}</Notation> будет потеряно —
            после них оба имени будут равны 20.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.refs_a6ff88}
            caption={
              <>
                После <Notation>{"a, b = b, a"}</Notation>: правая часть уже
                вычислена как пара (20, 10), затем имена связаны с её
                элементами. Прежние связи — пунктиром; сами числа никуда не
                копировались.
              </>
            }
          />
          <Typography.Text>
            Количество значений должно совпадать с количеством имён:
          </Typography.Text>
          <CodeBlock
            code={"x, y = (1, 2, 3)"}
            label={"Количество значений должно совпадать с количеством имён"}
            language="python"
            fileName="main.py"
            error={"ValueError: too many values to unpack (expected 2, got 3)"}
          />
          <Typography.Text>
            Можно обозначить имя для остальных элементов звёздочкой:
          </Typography.Text>
          <CodeBlock
            code={
              "first, *middle, last = [10, 20, 30, 40]\nprint(first, middle, last)"
            }
            label={"Можно обозначить имя для остальных элементов звёздочкой"}
            language="python"
            fileName="main.py"
            output={"10 [20, 30] 40"}
          />
          <Typography.Text>
            <Notation>{"middle"}</Notation> получает список. Распаковка работает
            и для списков, строк и других перебираемых объектов, а не только
            кортежей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Пары в for",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Пары из списка удобно распаковывать прямо в заголовке{" "}
              <Notation>{"for"}</Notation>.
            </strong>{" "}
            Выведем имена тех, у кого результат не меньше 90:
          </Typography.Text>
          <CodeBlock
            code={
              'students = [("Анна", 91), ("Илья", 84), ("Марк", 95)]\nfor name, score in students:\n    if score >= 90:\n        print(name)'
            }
            label={"Выведем имена тех, у кого результат не меньше 90"}
            language="python"
            fileName="students.py"
            output={"Анна\nМарк"}
          />
          <Typography.Text>
            Пара из списка сразу распаковывается в <Notation>{"name"}</Notation>{" "}
            и <Notation>{"score"}</Notation>. Без распаковки пришлось бы писать{" "}
            <Notation>{"for student in students:"}</Notation> и обращаться к{" "}
            <Notation>{"student[0]"}</Notation> и{" "}
            <Notation>{"student[1]"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "enumerate и zip",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"enumerate"}</Notation> добавляет номер к каждому
              элементу, <Notation>{"zip"}</Notation> соединяет источники по
              позициям.
            </strong>{" "}
            <Notation>{"enumerate"}</Notation> выдаёт пары «номер и элемент»:
          </Typography.Text>
          <CodeBlock
            code={
              'names = ["Анна", "Илья", "Марк"]\nfor position, name in enumerate(names, start=1):\n    print(position, name)'
            }
            label={"enumerate выдаёт пары «номер и элемент»"}
            language="python"
            fileName="names.py"
            output={"1 Анна\n2 Илья\n3 Марк"}
          />
          <Typography.Text>
            <Notation>{"start=1"}</Notation> меняет выдаваемые номера, но не
            индексы исходного списка. В каждой итерации пара распаковывается в
            два имени.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"zip"}</Notation> соединяет несколько источников по
            позициям:
          </Typography.Text>
          <CodeBlock
            code={
              'names = ["Анна", "Илья"]\nscores = [91, 84]\nfor name, score in zip(names, scores):\n    print(name, score)'
            }
            label={"zip соединяет несколько источников по позициям"}
            language="python"
            fileName="names.py"
            output={"Анна 91\nИлья 84"}
          />
          <Typography.Text>
            Обычный <Notation>{"zip"}</Notation> заканчивается при исчерпании
            самого короткого источника. Если длины по смыслу обязаны совпадать,
            используй <Notation>{"zip(names, scores, strict=True)"}</Notation> в
            Python 3.10+ или отдельно проверь длины: так потеря данных не
            пройдёт незаметно.
          </Typography.Text>
          <Typography.Text>
            Звёздочка в вызове функции означает ещё одно применение распаковки:
          </Typography.Text>
          <CodeBlock
            code={
              'numbers = [10, 20, 30]\nprint(*numbers)\nprint(*numbers, sep=", ")'
            }
            label={
              "Звёздочка в вызове функции означает ещё одно применение распаковки"
            }
            language="python"
            fileName="numbers.py"
            output={"10 20 30\n10, 20, 30"}
          />
          <Typography.Text>
            Элементы передаются отдельными аргументами, как в{" "}
            <Notation>{"print(10, 20, 30)"}</Notation>. Это не умножение:
            значение знака зависит от его места в синтаксисе.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Что получат <Notation>{"first"}</Notation> и{" "}
            <Notation>{"rest"}</Notation> после{" "}
            <Notation>{'first, *rest = "PYTHON"'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"first"}</Notation> — 'P', <Notation>{"rest"}</Notation>{" "}
            — ['Y', 'T', 'H', 'O', 'N'].
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что выведет цикл по{" "}
            <Notation>{'enumerate(["a", "b", "c"], start=1)'}</Notation>? Каков
            индекс <Notation>{'"c"'}</Notation> в самом списке?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            1 a, 2 b, 3 c; в списке у <Notation>{'"c"'}</Notation> индекс 2.
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
                Кортеж создаёт запятая: <Notation>{"(8,)"}</Notation> — кортеж,{" "}
                <Notation>{"(8)"}</Notation> — число; элементы менять нельзя.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"x, y = point"}</Notation> раздаёт элементы по
                именам; число имён должно совпадать.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"a, b = b, a"}</Notation> меняет значения местами:
                правая часть вычисляется целиком до присваивания.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"for name, score in pairs"}</Notation> распаковывает
                каждую пару; <Notation>{"enumerate"}</Notation> даёт номер,{" "}
                <Notation>{"zip"}</Notation> — элементы по позициям.
              </>
            ),
          },
          {
            note: (
              <>
                <Notation>{"print(*items)"}</Notation> передаёт элементы
                отдельными аргументами.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
