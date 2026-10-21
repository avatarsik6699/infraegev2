import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
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
            Результат ученика — это пара «имя и балл», точка на плоскости — пара
            координат. Такие короткие записи не должны случайно меняться.{" "}
            <strong>
              Для них есть кортеж — неизменяемая последовательность, а
              распаковка раздаёт его элементы по именам одним присваиванием
            </strong>
            . Распаковка работает и для списков из прошлого урока.
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
            <strong>Кортеж похож на список, но его нельзя изменить.</strong> У
            кортежа (<Notation>{"tuple"}</Notation>) нельзя заменить элемент,
            добавить или удалить позицию. Он подходит для небольшой записи:
            координат, пары «имя и результат», нескольких возвращаемых значений.
          </Typography.Text>
          <CodeBlock
            code={
              "point = (3, 5)\nprint(point[0])\nsingle = (8,)\nempty = ()\nprint(type((8)), type(single), len(empty))"
            }
            label={"Кортеж из одного элемента и пустой кортеж"}
            language="python"
            fileName="main.py"
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
            fileName="main.py"
            error={"TypeError: 'tuple' object does not support item assignment"}
          />
          <ProofDisclosure
            summary="Тонкости: список внутри кортежа"
            kind="nuance"
          >
            <Typography.Text>
              Неизменяемость кортежа не делает неизменяемым список внутри него:
              в <Notation>{"([1, 2], 3)"}</Notation> заменить список нельзя, а
              добавить в него элемент можно.
            </Typography.Text>
          </ProofDisclosure>
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
            fileName="main.py"
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
            fileName="main.py"
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
            fileName="main.py"
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
              'names = ["Анна", "Илья", "Марк"]\nscores = [91, 84]\nfor name, score in zip(names, scores):\n    print(name, score)'
            }
            label={"zip соединяет несколько источников по позициям"}
            language="python"
            fileName="main.py"
            output={"Анна 91\nИлья 84"}
          />
          <Typography.Text>
            Балла Марка в списке нет, и <Notation>{"zip"}</Notation> закончился
            на коротком списке: третьей пары не будет, а программа не сообщит об
            этом.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.zipPairs}
            caption={
              <>
                Слева <Notation>{"enumerate"}</Notation> ставит перед каждым
                именем номер. Справа <Notation>{"zip"}</Notation> собирает пары
                по позициям: первое имя с первым баллом, второе со вторым; Марку
                пары не досталось.
              </>
            }
          />
          <ProofDisclosure summary="Тонкости: zip без потерь" kind="nuance">
            <Typography.Text>
              Если длины по смыслу обязаны совпадать, пиши{" "}
              <Notation>{"zip(names, scores, strict=True)"}</Notation>: при
              разной длине программа остановится с{" "}
              <Notation>{"ValueError"}</Notation>, и потеря данных не пройдёт
              незаметно.
            </Typography.Text>
          </ProofDisclosure>
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
            fileName="main.py"
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
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Чем <Notation>{"(8)"}</Notation> отличается от{" "}
            <Notation>{"(8,)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"(8)"}</Notation> — просто число 8 в скобках,{" "}
            <Notation>{"(8,)"}</Notation> — кортеж из одного элемента: кортеж
            создаёт запятая.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Почему строки <Notation>{"a = b"}</Notation> и{" "}
            <Notation>{"b = a"}</Notation> не меняют значения местами, а{" "}
            <Notation>{"a, b = b, a"}</Notation> меняет?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            После <Notation>{"a = b"}</Notation> прежнее значение{" "}
            <Notation>{"a"}</Notation> потеряно. В{" "}
            <Notation>{"a, b = b, a"}</Notation> правая часть сначала целиком
            вычисляется в пару старых значений, и только потом имена связываются
            с её элементами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Что напечатает цикл{" "}
            <Notation>
              {'for a, b in zip([1, 2, 3], "xy"): print(a, b)'}
            </Notation>
            ?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Две строки: «1 x» и «2 y». <Notation>{"zip"}</Notation> закончился
            на короткой строке, тройке пары не досталось.
          </Typography.Text>
        </>
      ),
    },
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
      <Typography.Text>
        Кортежи держат короткие записи, а распаковка,{" "}
        <Notation>{"enumerate"}</Notation> и <Notation>{"zip"}</Notation> делают
        перебор пар коротким и понятным. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Кортеж",
            note: (
              <>
                <Notation>{"(3, 5)"}</Notation> — неизменяемая запись; из одного
                элемента — <Notation>{"(8,)"}</Notation>: кортеж создаёт
                запятая.
              </>
            ),
          },
          {
            key: "Распаковка",
            note: (
              <>
                <Notation>{"x, y = point"}</Notation>: имён столько же, сколько
                элементов; остаток — <Notation>{"*rest"}</Notation>.
              </>
            ),
          },
          {
            key: <Notation>{"a, b = b, a"}</Notation>,
            note: <>Обмен: правая часть вычисляется целиком до присваивания.</>,
          },
          {
            key: <Notation>{"for name, score in pairs"}</Notation>,
            note: <>Пары распаковываются прямо в заголовке цикла.</>,
          },
          {
            key: <Notation>{"enumerate"}</Notation>,
            note: (
              <>
                Пары «номер, элемент»; <Notation>{"start=1"}</Notation> меняет
                номера, но не индексы.
              </>
            ),
          },
          {
            key: <Notation>{"zip"}</Notation>,
            note: <>Пары по позициям; останавливается на коротком источнике.</>,
          },
          {
            key: <Notation>{"print(*numbers)"}</Notation>,
            note: <>Элементы списка передаются в print по отдельности.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
