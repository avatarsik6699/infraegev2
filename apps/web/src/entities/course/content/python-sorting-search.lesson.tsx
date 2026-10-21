import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTabs,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { pythonSortingSearchLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./python-sorting-search.media";

export const pythonSortingSearchLesson = defineCourseLesson({
  ...pythonSortingSearchLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: ["Ключ сортировки", "Несколько критериев", "Max с ключом"],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Таблица результатов олимпиады: сначала по убыванию балла, при равном
            балле — по алфавиту. Слова — по длине. Строки с числами — как числа,
            а не как текст.{" "}
            <strong>
              Сортировка сравнивает не сами элементы, а их ключи: любой порядок
              задаётся функцией-ключом, а несколько критериев — кортежем ключей
            </strong>
            . Ключ — это функция, которую <Notation>{"sorted"}</Notation>{" "}
            вызывает для каждого элемента, как в уроке о функции как значении.
          </Typography.Text>
          <Typography.Text>
            Сортировать будем слова{" "}
            <Notation>{'["арбуз", "кот", "дом", "окно"]'}</Notation> и баллы
            учеников: по длине, по нескольким критериям, а лучшего выберем без
            полной сортировки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "sorted и sort",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"sorted"}</Notation> возвращает новый список, а{" "}
              <Notation>{"sort"}</Notation> меняет список на месте.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              "a = [8, 2, 5]\nb = sorted(a)\nprint(a)\nprint(b)\na.sort(reverse=True)\nprint(a)"
            }
            label={
              "sorted возвращает новый список, а sort меняет список на месте"
            }
            language="python"
            fileName="main.py"
            output={"[8, 2, 5]\n[2, 5, 8]\n[8, 5, 2]"}
          />
          <Typography.Text>
            <Notation>{"sorted"}</Notation> принимает перебираемый источник и
            возвращает новый список. <Notation>{".sort()"}</Notation> доступен у
            списка, меняет его на месте и возвращает{" "}
            <Notation>{"None"}</Notation>. Параметр{" "}
            <Notation>{"reverse=True"}</Notation> задаёт обратный порядок.
          </Typography.Text>
          <Typography.Text>
            Строки из цифр сортируются как текст: <Notation>{'"100"'}</Notation>{" "}
            идёт раньше <Notation>{'"20"'}</Notation>, потому что сначала
            сравниваются первые символы. Если нужен числовой порядок, преобразуй
            данные в числа либо задай числовой ключ.
          </Typography.Text>
          <CodeBlock
            code={
              'print(sorted(["20", "100", "3"]))\nprint(sorted(["20", "100", "3"], key=int))'
            }
            label={
              "Если нужен числовой порядок, преобразуй данные в числа либо задай числовой ключ"
            }
            language="python"
            fileName="main.py"
            output={"['100', '20', '3']\n['3', '20', '100']"}
          />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Ключ сортировки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ключ сортировки — значение, по которому сравнивают элемент; сам
              элемент не меняется.
            </strong>
          </Typography.Text>
          <CodeBlock
            code={
              'words = ["арбуз", "кот", "дом", "окно"]\nprint(sorted(words, key=len))'
            }
            label={
              "Ключ сортировки — значение, по которому сравнивают элемент; сам элемент не меняется"
            }
            language="python"
            fileName="main.py"
            output={"['кот', 'дом', 'окно', 'арбуз']"}
          />
          <Typography.Text>
            Передаётся функция <Notation>{"len"}</Notation>, а не результат{" "}
            <Notation>{"len(...)"}</Notation>. При сортировке Python применяет
            функцию ключа к каждому элементу и использует полученные значения
            для упорядочивания. Посмотри по шагам, как это происходит:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.sortStepper}
            label={"sorted(words, key=len) по шагам"}
          />
          <Typography.Text>
            Ключ решает всё: меняется ключ — меняется порядок, а сами слова
            остаются теми же. Переключай правила и сравни результаты:
          </Typography.Text>
          <LessonTabs
            label="Правило сортировки"
            tabs={[
              {
                label: "key=len",
                content: (
                  <LessonDiagram
                    {...lessonMedia.sortResultLen}
                    caption={<>По длине: 3, 3, 4, 5.</>}
                  />
                ),
              },
              {
                label: "без key",
                content: (
                  <LessonDiagram
                    {...lessonMedia.sortResultPlain}
                    caption={
                      <>
                        Без ключа слова сравниваются сами — по алфавиту, буква
                        за буквой.
                      </>
                    }
                  />
                ),
              },
              {
                label: "reverse=True",
                content: (
                  <LessonDiagram
                    {...lessonMedia.sortResultLenReverse}
                    caption={
                      <>
                        Тот же ключ, обратный порядок: от длинных к коротким.
                        Равные «кот» и «дом» по-прежнему в исходном порядке.
                      </>
                    }
                  />
                ),
              },
              {
                label: "последняя буква",
                content: (
                  <LessonDiagram
                    {...lessonMedia.sortResultLast}
                    caption={
                      <>
                        Ключ <Notation>{"lambda w: w[-1]"}</Notation> —
                        последняя буква: «з» раньше «м», «о» и «т».
                      </>
                    }
                  />
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Несколько критериев",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Несколько критериев задают кортежем: кортежи сравниваются слева
              направо.
            </strong>{" "}
            Кортежи сравниваются <strong>лексикографически</strong>: сначала
            первые элементы; если они равны — вторые, и так далее. Это похоже на
            порядок слов в словаре, но применяется к любым сравнимым элементам.
          </Typography.Text>
          <CodeBlock
            code={
              'students = [("Анна", 91), ("Илья", 84), ("Марк", 91)]\nordered = sorted(\n    students, key=lambda student: (-student[1], student[0])\n)\nprint(ordered)'
            }
            label={
              "Это похоже на порядок слов в словаре, но применяется к любым сравнимым элементам"
            }
            language="python"
            fileName="main.py"
            output={"[('Анна', 91), ('Марк', 91), ('Илья', 84)]"}
          />
          <Typography.Text>
            Балл сортируется по убыванию благодаря минусу: 91 превращается в
            −91, что меньше −84. При равных баллах имя сортируется по
            возрастанию. <Notation>{"reverse=True"}</Notation> для всего кортежа
            развернул бы оба критерия, поэтому это не то же самое. Как кортежи
            ключей решают порядок — по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.tupleSortStepper}
            label={"Сортировка по кортежу ключей по шагам"}
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Устойчивость и max",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сортировка устойчива, а один лучший элемент находят без
              сортировки.
            </strong>{" "}
            Сортировка Python <strong>устойчива</strong>: элементы с одинаковым
            ключом сохраняют взаимный исходный порядок. Например, слова{" "}
            <Notation>{'"кот"'}</Notation> и <Notation>{'"дом"'}</Notation>{" "}
            имеют одинаковую длину и остались в исходной последовательности.
          </Typography.Text>
          <Typography.Text>
            Если нужен только лучший элемент, нет необходимости сортировать всё:
          </Typography.Text>
          <CodeBlock
            code={
              'words = ["арбуз", "кот", "дом", "окно"]\nlongest = max(words, key=len)\nprint(longest)\nprint(min([], default=None))'
            }
            label={
              "Если нужен только лучший элемент, нет необходимости сортировать всё"
            }
            language="python"
            fileName="main.py"
            output={"арбуз\nNone"}
          />
          <Typography.Text>
            <Notation>{"max"}</Notation> проходит элементы один раз и помнит
            лучший; при одинаковом ключе лучшим остаётся первый. Для возможно
            пустого источника можно указать{" "}
            <Notation>{"default=None"}</Notation>. Как{" "}
            <Notation>{"max"}</Notation> выбирает — по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.maxStepper}
            label={"max(words, key=len) по шагам"}
          />
          <Typography.Text>
            Сквозная задача курса получает продолжение: не одно наибольшее, а
            два. Для <Notation>{"[5, -2, 10, 7]"}</Notation> выражение{" "}
            <Notation>{"sorted(numbers, reverse=True)[:2]"}</Notation> даёт{" "}
            <Notation>{"[10, 7]"}</Notation> — сортировка по убыванию и срез
            первых двух.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Жадный выбор",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сортировка по одному показателю не доказывает, что жадный выбор
              верен.
            </strong>{" "}
            Выбор «самого выгодного сейчас» называют{" "}
            <strong>жадным алгоритмом</strong>. Иногда его правильность можно
            доказать. Например, если нужно купить максимум предметов при
            ограниченном бюджете и все цены неотрицательны, выгодно брать самые
            дешёвые: любой набор из <Notation>{"k"}</Notation> предметов стоит
            не меньше суммы <Notation>{"k"}</Notation> минимальных цен.
          </Typography.Text>
          <CodeBlock
            code={
              "prices = [50, 20, 70, 10, 40]\nbudget = 100\ncount = 0\nspent = 0\nfor price in sorted(prices):\n    if spent + price > budget:\n        break\n    spent += price\n    count += 1\nprint(count, spent)"
            }
            label={"Жадная покупка самых дешёвых"}
            language="python"
            fileName="main.py"
            output={"3 70"}
          />
          <LessonStepper
            {...lessonMedia.greedyStepper}
            label={"Жадная покупка по шагам"}
          />
          <Typography.Text>
            Самые дешёвые 10, 20 и 40 стоят 70; следующая цена 50 уже не
            помещается. Никакие четыре предмета не уложатся в 100: четыре самых
            дешёвых стоят 120.
          </Typography.Text>
          <Typography.Text>
            Но сортировка по одному показателю не решает произвольный выбор
            оптимального набора. Если у предметов разные цены и полезности,
            выбор по цене или отношению полезности к цене для неделимых
            предметов может оказаться неверным. Сначала доказательство подхода,
            затем код.
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
            Что дадут <Notation>{'sorted(["10", "9", "100"])'}</Notation> и{" "}
            <Notation>{'sorted(["10", "9", "100"], key=int)'}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            ['10', '100', '9'] и ['9', '10', '100'].
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Чему равно <Notation>{"b"}</Notation> после{" "}
            <Notation>{"a = [3, 1, 2]"}</Notation> и{" "}
            <Notation>{"b = a.sort()"}</Notation>? Чему равно{" "}
            <Notation>{"a"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>b = None, a = [1, 2, 3].</Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Отсортируй{" "}
            <Notation>{'[("Ира", 80), ("Аня", 92), ("Боря", 80)]'}</Notation> по
            убыванию балла, а при равенстве — по имени.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            [('Аня', 92), ('Боря', 80), ('Ира', 80)].
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт{" "}
            <Notation>{'max(["кот", "слон", "мышь"], key=len)'}</Notation> и
            почему?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            слон: у «слон» и «мышь» длина 4, <Notation>{"max"}</Notation>{" "}
            оставляет первый.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Чем{" "}
            <Notation>
              {"sorted(students, key=lambda s: (-s[1], s[0]))"}
            </Notation>{" "}
            отличается от{" "}
            <Notation>
              {"sorted(students, key=lambda s: (s[1], s[0]), reverse=True)"}
            </Notation>{" "}
            для учеников с равными баллами?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Во втором случае имена при равных баллах идут в обратном алфавитном
            порядке.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Любой порядок задаётся ключом, а несколько критериев — кортежем ключей.
        Вот что понадобится дальше — и в задачах ЕГЭ с сортировкой.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: <Notation>{"sorted и sort"}</Notation>,
            note: (
              <>
                <Notation>{"sorted(x)"}</Notation> создаёт новый список,{" "}
                <Notation>{"x.sort()"}</Notation> меняет{" "}
                <Notation>{"x"}</Notation> и возвращает{" "}
                <Notation>{"None"}</Notation>;{" "}
                <Notation>{"reverse=True"}</Notation> — по убыванию.
              </>
            ),
          },
          {
            key: <Notation>{"key=функция"}</Notation>,
            note: (
              <>
                <Notation>{"key=функция"}</Notation> сортирует по значению
                функции; передаётся функция без скобок.
              </>
            ),
          },
          {
            key: "Несколько критериев",
            note: (
              <>
                Несколько критериев — кортеж ключей; минус перед числом даёт
                убывание только этого критерия.
              </>
            ),
          },
          {
            key: "Лучший без сортировки",
            note: (
              <>
                Сортировка устойчива; один лучший элемент —{" "}
                <Notation>{"max(x, key=…)"}</Notation>, пустой источник —{" "}
                <Notation>{"default="}</Notation>.
              </>
            ),
          },
          {
            key: "Жадный выбор",
            note: (
              <>Жадный выбор после сортировки верен только с доказательством.</>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
