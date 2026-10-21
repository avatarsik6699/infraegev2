import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonSetsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-sets.media";

export const pythonSetsLesson = defineCourseLesson({
  ...pythonSetsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Различные значения", "Операции над множествами"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Сколько разных слов в тексте? Кто есть в обоих списках участников?
            На такие вопросы неважны порядок и повторы — важно только, какие
            значения встречаются.{" "}
            <strong>
              Множество хранит только различные значения и быстро отвечает «есть
              ли элемент»
            </strong>
            . Это как ключи словаря без значений, с теми же требованиями к
            элементам.
          </Typography.Text>
          <Typography.Text>
            Возьмём список <Notation>{"[3, 1, 3, 2, 1]"}</Notation> и два списка
            участников, в которых найдём общих людей.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Множество",
      explanation: (
        <>
          <Typography.Text>
            <strong>Множество оставляет только различные значения.</strong>{" "}
            Множество (<Notation>{"set"}</Notation>) хранит каждое значение один
            раз и быстро проверяет, есть ли оно. Элементами, как и ключами
            словаря, могут быть числа, строки и кортежи из них.
          </Typography.Text>
          <CodeBlock
            code={
              "values = [3, 1, 3, 2, 1]\nunique = set(values)\nprint(len(unique))\nprint(2 in unique)"
            }
            label={"Множество хранит каждое значение один раз"}
            language="python"
            fileName="main.py"
            output={"3\nTrue"}
          />
          <Typography.Text>
            Из пяти чисел различных три: 1, 2 и 3. Множество не сохраняет
            смыслового порядка и не поддерживает обращение по индексу. То, что в
            отдельном запуске вывод выглядит упорядоченным, не даёт права на это
            рассчитывать. Как получить упорядоченный результат, покажет урок о
            сортировке.
          </Typography.Text>
          <Typography.Text>
            Пустое множество — <Notation>{"set()"}</Notation>. Запись{" "}
            <Notation>{"{}"}</Notation> создаёт пустой словарь. Непустое
            множество можно записать <Notation>{"{1, 2, 3}"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={"print(type({}), type(set()), type({1, 2}))"}
            label={"Непустое множество можно записать {1, 2, 3}"}
            language="python"
            fileName="main.py"
            output={"<class 'dict'> <class 'set'> <class 'set'>"}
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Операции над множествами",
      explanation: (
        <>
          <Typography.Text>
            <strong>Множества объединяют, пересекают и вычитают.</strong>
          </Typography.Text>
          <CodeBlock
            code={
              "a = {1, 2, 3}\nb = {3, 4}\nprint(a | b)\nprint(a & b)\nprint(a - b)\nprint(a ^ b)\nprint({1, 2} <= a)"
            }
            label={"Множества объединяют, пересекают и вычитают"}
            language="python"
            fileName="main.py"
            output={"{1, 2, 3, 4}\n{3}\n{1, 2}\n{1, 2, 4}\nTrue"}
          />
          <Typography.Text>
            <Notation>{"a | b"}</Notation> — объединение: элементы из любого
            множества. <Notation>{"a & b"}</Notation> — пересечение: элементы
            одновременно в обоих. <Notation>{"a - b"}</Notation> — разность:
            элементы <Notation>{"a"}</Notation>, отсутствующие в{" "}
            <Notation>{"b"}</Notation>. <Notation>{"a ^ b"}</Notation> —
            элементы ровно одного из двух множеств. <Notation>{"<="}</Notation>{" "}
            проверяет, что первое множество — подмножество второго.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.venn_aa6208}
            caption={
              <>
                Одни и те же множества: 1 и 2 только в a, 3 в обоих, 4 только в
                b. Цветом выделен результат каждой операции.
              </>
            }
          />
          <Typography.Text>
            <Notation>{"add(x)"}</Notation> добавляет элемент,{" "}
            <Notation>{"update(items)"}</Notation> — все элементы источника,{" "}
            <Notation>{"discard(x)"}</Notation> удаляет, если он присутствует.{" "}
            <Notation>{"remove(x)"}</Notation> тоже удаляет, но отсутствие
            вызывает ошибку:
          </Typography.Text>
          <CodeBlock
            code={
              "s = {1, 2}\ns.add(2)\ns.update([3, 4])\ns.discard(9)\nprint(s)\ns.remove(9)"
            }
            label={"remove(x) тоже удаляет, но отсутствие вызывает ошибку"}
            language="python"
            fileName="main.py"
            output={"{1, 2, 3, 4}"}
            error={"KeyError: 9"}
          />
          <Typography.Text>
            Повторное <Notation>{"add(2)"}</Notation> ничего не изменило:
            элемент уже есть.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: & для чисел и frozenset"
            kind="nuance"
          >
            <Typography.Text>
              Один и тот же знак означает разное для разных типов: для множеств{" "}
              <Notation>{"&"}</Notation> — пересечение, для целых чисел —
              операция над битами (урок о записи чисел), а логическое «и» — это{" "}
              <Notation>{"and"}</Notation>. <Notation>{"frozenset"}</Notation> —
              неизменяемое множество; его можно сделать ключом словаря.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Выбор структуры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Структуру данных выбирают по тому, какие действия нужны.
            </strong>{" "}
            Список — когда важны порядок и повторы, а элементы меняются. Кортеж
            — короткая неизменяемая запись. Словарь — когда значение ищут по
            ключу. Множество — когда важны только различные значения и вопрос
            «есть ли такое». Сводка всех пяти — в конце модуля, в уроке о
            включениях.
          </Typography.Text>
          <Typography.Text>
            Выбор зависит от нужных действий, а не только от вида исходных
            данных. Чтобы посчитать <strong>количество разных</strong> слов,
            достаточно множества. Чтобы посчитать{" "}
            <strong>частоту каждого</strong>, нужен словарь.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Общие элементы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Общие элементы двух списков — пересечение их множеств.
            </strong>{" "}
            Есть два списка участников; найдём людей, присутствующих в обоих.
            Пока порядок результата не важен.
          </Typography.Text>
          <CodeBlock
            code={
              'first = ["Анна", "Илья", "Анна"]\nsecond = ["Илья", "Марк"]\ncommon = set(first) & set(second)\nprint(common)'
            }
            label={"Пока порядок результата не важен"}
            language="python"
            fileName="main.py"
            output={"{'Илья'}"}
          />
          <Typography.Text>
            Повторяющаяся Анна в первом списке не создаёт вторую копию человека
            во множестве. Если повторы означают отдельные события и должны
            учитываться, множество теряет нужную информацию.
          </Typography.Text>
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
            Что напечатает{" "}
            <Notation>{"print(len(set([3, 1, 3, 2, 1])))"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>3: различные значения — 1, 2 и 3.</Typography.Text>
        </>
      ),
    },
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Есть два списка участников. Найди людей, присутствующих в обоих, для{" "}
            <Notation>{'["Оля", "Петя", "Вера"]'}</Notation> и{" "}
            <Notation>{'["Вера", "Оля", "Оля"]'}</Notation>.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}'Оля', 'Вера'{"}"} — порядок вывода может быть любым.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Для <Notation>{"a = {1, 2, 3, 4}"}</Notation> и{" "}
            <Notation>{"b = {3, 4, 5}"}</Notation> найди{" "}
            <Notation>{"a | b"}</Notation>, <Notation>{"a & b"}</Notation>,{" "}
            <Notation>{"a - b"}</Notation> и <Notation>{"a ^ b"}</Notation>.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}1, 2, 3, 4, 5{"}"}, {"{"}3, 4{"}"}, {"{"}1, 2{"}"} и {"{"}1, 2,
            5{"}"}.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Какой тип у <Notation>{"{}"}</Notation>? Как создать пустое
            множество?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"dict"}</Notation>; пустое множество —{" "}
            <Notation>{"set()"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Начни с <Notation>{"s = {1, 2}"}</Notation> и выполни{" "}
            <Notation>{"s.add(2)"}</Notation>,{" "}
            <Notation>{"s.update([3, 4])"}</Notation>,{" "}
            <Notation>{"s.discard(9)"}</Notation>. Чему равно{" "}
            <Notation>{"s"}</Notation>? Что сделает{" "}
            <Notation>{"s.remove(9)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            {"{"}1, 2, 3, 4{"}"}; <Notation>{"remove(9)"}</Notation> —{" "}
            <Notation>{"KeyError"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Множество отвечает на вопросы «есть ли» и «сколько разных», а структуру
        данных выбирают по нужным действиям. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"set(items)"}</Notation>,
            note: (
              <>
                <Notation>{"set(items)"}</Notation> оставляет различные
                значения; порядка и индексов нет.
              </>
            ),
          },
          {
            key: "Пустое множество",
            note: (
              <>
                <Notation>{"{}"}</Notation> — пустой словарь, пустое множество —{" "}
                <Notation>{"set()"}</Notation>.
              </>
            ),
          },
          {
            key: "Операции",
            note: (
              <>
                <Notation>{"|"}</Notation>, <Notation>{"&"}</Notation>,{" "}
                <Notation>{"-"}</Notation>, <Notation>{"^"}</Notation> —
                объединение, пересечение, разность, «ровно в одном».
              </>
            ),
          },
          {
            key: "Изменение",
            note: (
              <>
                <Notation>{"add"}</Notation>, <Notation>{"update"}</Notation>,{" "}
                <Notation>{"discard"}</Notation> меняют множество;{" "}
                <Notation>{"remove"}</Notation> отсутствующего даёт{" "}
                <Notation>{"KeyError"}</Notation>.
              </>
            ),
          },
          {
            key: "Выбор",
            note: (
              <>Количество разных — множество, частота каждого — словарь.</>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
