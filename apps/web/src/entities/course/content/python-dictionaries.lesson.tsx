import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonDictionariesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-dictionaries.media";

export const pythonDictionariesLesson = defineCourseLesson({
  ...pythonDictionariesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Доступ по ключу", "Частотная таблица"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В списке значение ищут по номеру позиции. Но часто нужен ответ на
            другой вопрос: какой балл у Анны, сколько раз встретилась буква A.{" "}
            <strong>
              Словарь находит значение по смысловому ключу — имени, слову, букве
              — и поэтому естественно хранит частоты
            </strong>
            . Частотная таблица — это много счётчиков из урока о{" "}
            <Notation>{"while"}</Notation> сразу, по одному на каждое значение.
          </Typography.Text>
          <Typography.Text>
            Работать будем с баллами учеников{" "}
            <Notation>{'{"Анна": 91, "Илья": 84}'}</Notation> и словом{" "}
            <Notation>{'"BANANA"'}</Notation>, в котором посчитаем буквы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Словарь",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Словарь хранит пары «ключ — значение» и ищет значение по ключу.
            </strong>{" "}
            В списке элемент ищут по позиции. Иногда нужен доступ по имени:
            «балл Анны», «количество буквы A». <strong>Словарь</strong> (
            <Notation>{"dict"}</Notation>) хранит соответствия между ключами и
            значениями.
          </Typography.Text>
          <CodeBlock
            code={
              'scores = {"Анна": 91, "Илья": 84}\nprint(scores["Анна"])\nscores["Марк"] = 88\nscores["Анна"] = 95\nprint(scores)'
            }
            label={
              "Словарь (dict) хранит соответствия между ключами и значениями"
            }
            language="python"
            fileName="main.py"
            output={"91\n{'Анна': 95, 'Илья': 84, 'Марк': 88}"}
          />
          <Typography.Text>
            Ключ уникален: новое присваивание тому же ключу заменяет его
            значение. Значения могут повторяться. Чтение отсутствующего ключа
            через квадратные скобки вызывает ошибку:
          </Typography.Text>
          <CodeBlock
            code={'scores = {"Анна": 91, "Илья": 84}\nprint(scores["Ольга"])'}
            label={
              "Чтение отсутствующего ключа через квадратные скобки вызывает ошибку"
            }
            language="python"
            fileName="main.py"
            error={"KeyError: 'Ольга'"}
          />
          <Typography.Text>Безопасное чтение и проверка ключа:</Typography.Text>
          <CodeBlock
            code={
              'scores = {"Анна": 91, "Илья": 84}\nprint(scores.get("Ольга", 0))\nprint("Анна" in scores)\nprint(91 in scores)'
            }
            label={"Безопасное чтение и проверка ключа"}
            language="python"
            fileName="main.py"
            output={"0\nTrue\nFalse"}
          />
          <Typography.Text>
            <Notation>{"get(key, default)"}</Notation> возвращает значение либо
            указанное значение по умолчанию; ключ от этого не добавляется. Без
            второго аргумента значение по умолчанию —{" "}
            <Notation>{"None"}</Notation>. Операция <Notation>{"in"}</Notation>{" "}
            для словаря проверяет ключи, а не значения: 91 есть среди значений,
            но ключом не является.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Какие бывают ключи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ключом может быть число, строка или кортеж из них; список —
              нельзя.
            </strong>{" "}
            Ключ не должен меняться, пока лежит в словаре, поэтому изменяемые
            значения — список, словарь, множество — ключами быть не могут:
          </Typography.Text>
          <CodeBlock
            code={"d = {[1, 2]: 3}"}
            label={
              "Список, словарь и обычное множество изменяемы и ключами быть не могут"
            }
            language="python"
            fileName="main.py"
            error={
              "TypeError: cannot use 'list' as a dict key (unhashable type: 'list')"
            }
          />
          <ProofDisclosure
            summary="Тонкости: хеш и хешируемые значения"
            kind="nuance"
          >
            <Typography.Text>
              Для быстрого поиска словарь вычисляет по ключу число —{" "}
              <strong>хеш</strong> — и по нему сразу находит место хранения, не
              перебирая все пары. Если бы ключ изменился, изменился бы и хеш, и
              пара потерялась бы. Значения, у которых есть хеш, называют
              хешируемыми: числа, строки, кортежи из таких значений. Кортеж,
              содержащий список, не годится: список внутри него может
              измениться.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Значения словаря такими ограничениями не связаны: можно хранить под
            именем пользователя целый список его результатов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Обход словаря",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Словарь обходят по ключам или по парам; порядок — порядок
              добавления.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'scores = {"Анна": 91, "Илья": 84}\nfor name in scores:\n    print(name)\n\ntotal = 0\nfor name, score in scores.items():\n    print(name, score)\n    total += score\nprint(total)'
            }
            label={
              "Словарь обходят по ключам или по парам; порядок — порядок добавления"
            }
            language="python"
            fileName="main.py"
            output={"Анна\nИлья\nАнна 91\nИлья 84\n175"}
          />
          <Typography.Text>
            <Notation>{".items()"}</Notation> позволяет получать пары,{" "}
            <Notation>{".keys()"}</Notation> — ключи,{" "}
            <Notation>{".values()"}</Notation> — значения;{" "}
            <Notation>{"list(scores)"}</Notation> создаёт список ключей.
          </Typography.Text>
          <Typography.Text>
            Ключи идут в порядке добавления. Это не сортировка: по алфавиту или
            величине они сами не выстраиваются, а замена значения не переносит
            ключ в конец. Не добавляй и не удаляй ключи во время обхода того же
            словаря.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Частотная таблица",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Частотная таблица — словарь «значение → сколько раз встретилось».
            </strong>{" "}
            <strong>Частота</strong> — число появлений значения. Пройдём по
            буквам и увеличим соответствующий счётчик. Нажми «Запуск» и пройди
            подсчёт по шагам: на каждой итерации <Notation>{"for"}</Notation>{" "}
            берёт очередную букву, а следующая строка увеличивает её счётчик:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runLetterCounts}
            label={"Пройдём по буквам и увеличим соответствующий счётчик"}
          />
          <Typography.Text>
            Если буква встретилась впервые, <Notation>{"get"}</Notation> даёт 0.
            После прибавления записывается 1. При следующих появлениях читается
            накопленное значение: для первой A <Notation>{"get"}</Notation> даёт
            0, и в словаре появляется <Notation>{"'A': 1"}</Notation>, а для
            второй A — уже 1, и запись становится{" "}
            <Notation>{"'A': 2"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.freqTable}
            caption={
              <>
                Каждая буква прибавляет 1 к своему ключу. Ключи стоят в порядке
                первого появления: B, затем A, затем N. После любой буквы в
                словаре лежат точные частоты уже пройденной части слова.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Самое частое значение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Самое частое значение находят вторым проходом по парам словаря.
            </strong>{" "}
            По списку <Notation>{"['a', 'b', 'a', 'c', 'b', 'a']"}</Notation>{" "}
            найдём значение с наибольшей частотой; при равенстве выберем то,
            которое впервые встретилось раньше:
          </Typography.Text>
          <CodeBlock
            code={
              "items = ['a', 'b', 'a', 'c', 'b', 'a']\ncounts = {}\nfor item in items:\n    counts[item] = counts.get(item, 0) + 1\n\nbest_item = None\nbest_count = 0\nfor item, count in counts.items():\n    if count > best_count:\n        best_item = item\n        best_count = count\nprint(best_item, best_count)"
            }
            label={"Самое частое значение"}
            language="python"
            fileName="main.py"
            output={"a 3"}
          />
          <Typography.Text>
            Строгое <Notation>{">"}</Notation> оставляет прежнего победителя при
            равенстве. Порядок словаря совпадает с порядком первых появлений.
            Для пустого входа ответ остаётся <Notation>{"None, 0"}</Notation> —
            это выбранное обозначение отсутствия результата.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: равные ключи разных типов"
            kind="nuance"
          >
            <Typography.Text>
              Ключи <Notation>{"1"}</Notation>, <Notation>{"1.0"}</Notation> и{" "}
              <Notation>{"True"}</Notation> сравниваются равными и используются
              как один ключ. Поэтому в смысловых идентификаторах лучше не
              смешивать числа и логические значения без необходимости.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Начни с <Notation>{'d = {"a": 1}'}</Notation> и выполни{" "}
            <Notation>{'d["b"] = 2'}</Notation>,{" "}
            <Notation>{'d["a"] += 5'}</Notation>. Чему равен{" "}
            <Notation>{"d"}</Notation> и его длина?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}'a': 6, 'b': 2{"}"}, длина 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Какие значения могут быть ключами словаря:{" "}
            <Notation>{"(1, 2)"}</Notation>, <Notation>{"[1, 2]"}</Notation>,{" "}
            <Notation>{'"ab"'}</Notation>, <Notation>{"3.5"}</Notation>,{" "}
            <Notation>{"([1],)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"(1, 2)"}</Notation>, <Notation>{'"ab"'}</Notation> и{" "}
            <Notation>{"3.5"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Построй частотную таблицу букв слова{" "}
            <Notation>{'"MISSISSIPPI"'}</Notation>.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}'M': 1, 'I': 4, 'S': 4, 'P': 2{"}"}.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Что выведет{" "}
            <Notation>{'print({1: "a", 1.0: "b", True: "c"})'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}1: 'c'{"}"}: три равных ключа — один ключ, значение последнее.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Напиши программу: посчитай частоты слов в строке{" "}
            <Notation>{'"кот дом кот сад дом кот"'}</Notation> и выведи каждое
            слово с частотой.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>кот 3, дом 2, сад 1.</Typography.Text>
        </>
      ),
    },
    {
      id: "t9",
      prompt: (
        <>
          <Typography.Text>
            Напиши программу, которая «переворачивает» словарь{" "}
            <Notation>{'{"a": 1, "b": 2}'}</Notation>: ключи становятся
            значениями и наоборот.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}1: 'a', 2: 'b'{"}"}.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Словарь отвечает на вопрос «что лежит под этим ключом», а частотная
        таблица считает все значения за один проход. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{'{"Анна": 91}'}</Notation>,
            note: (
              <>
                Пары «ключ — значение»; ключ уникален, новое присваивание
                заменяет значение.
              </>
            ),
          },
          {
            key: "Чтение",
            note: (
              <>
                <Notation>{"d[key]"}</Notation> без ключа —{" "}
                <Notation>{"KeyError"}</Notation>;{" "}
                <Notation>{"d.get(key, 0)"}</Notation> — значение или запасное.
              </>
            ),
          },
          {
            key: <Notation>{"in"}</Notation>,
            note: <>Проверяет ключи, а не значения.</>,
          },
          {
            key: "Ключи",
            note: (
              <>
                Число, строка, кортеж из них; список и другие изменяемые
                значения — нельзя.
              </>
            ),
          },
          {
            key: "Обход",
            note: (
              <>
                <Notation>{"for key in d"}</Notation> — ключи;{" "}
                <Notation>{"for key, value in d.items()"}</Notation> — пары;
                порядок — порядок добавления.
              </>
            ),
          },
          {
            key: "Частоты",
            note: (
              <>
                <Notation>{"counts[x] = counts.get(x, 0) + 1"}</Notation> для
                каждого значения.
              </>
            ),
          },
          {
            key: "Самое частое",
            note: (
              <>
                Второй проход по парам; строгое <Notation>{">"}</Notation>{" "}
                оставляет при равенстве того, кто встретился раньше.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
