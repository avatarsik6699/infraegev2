// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.pozicii-i-granicy.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "spisok-poziciy",
      navLabel: "Список позиций",
      explanation: (
        <>
          <Typography.Text>
            Нужен самый короткий фрагмент, в котором буква Q встречается 50 раз.
            С чего он начинается и чем кончается?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Он начинается на одной Q и кончается на 50-й Q, считая от неё:
              лишние символы по краям только удлинили бы его. Поэтому достаточно
              знать, где стоят все Q.
            </strong>{" "}
            Номера нужных букв собирает в список одна строка —{" "}
            <PythonTerm term="comp">списковое включение</PythonTerm>. Если
            выбраны K подряд идущих букв — в списке это элементы с j по j + K −
            1, — длина фрагмента (в программе K — это k):{" "}
            <Notation>{"positions[j + k - 1] - positions[j] + 1"}</Notation>.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'CAABACAB'\nk = 3\npositions = [i for i in range(len(s)) if s[i] == 'A']\nprint(positions)\n\nbest = len(s) + 1\nfor j in range(len(positions) - k + 1):\n    best = min(best, positions[j + k - 1] - positions[j] + 1)\n\nprint(best)"
            }
            label={"Самый короткий фрагмент с тремя A"}
            language="python"
            output={"[1, 2, 4, 6]\n4"}
          />
          <Typography.Text>
            Тройки соседних A: на позициях 1, 2, 4 — фрагмент AABA длины 4, и на
            позициях 2, 4, 6 — длины 5. Брать A не подряд нет смысла: та, что
            между ними, всё равно окажется внутри. Начальное значение{" "}
            <Notation>{"len(s) + 1"}</Notation> больше любой длины — если оно не
            изменилось, подходящего фрагмента нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rovno-k-pozicii",
      navLabel: "Ровно K: до соседей",
      explanation: (
        <>
          <Typography.Text>
            А самый длинный фрагмент ровно с K буквами A? Насколько его можно
            растянуть?
          </Typography.Text>
          <Typography.Text>
            <strong>
              До соседних A, не включая их: левее первой выбранной — до
              предыдущей A, правее последней — до следующей.
            </strong>{" "}
            Чтобы та же формула работала у краёв строки, добавим в список
            искусственные позиции −1 и len(s) — как будто там стоят A. Тогда
            длина —{" "}
            <Notation>{"positions[j + k] - positions[j - 1] - 1"}</Notation>.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'BABAACB'\nk = 2\npositions = [i for i in range(len(s)) if s[i] == 'A']\npositions = [-1] + positions + [len(s)]\nbest = 0\nfor j in range(1, len(positions) - k):\n    best = max(best, positions[j + k] - positions[j - 1] - 1)\n\nprint(positions, best)"
            }
            label={"Самый длинный фрагмент ровно с двумя A"}
            language="python"
            output={"[-1, 1, 3, 4, 7] 5"}
          />
          <Typography.Text>
            Первые две A растягиваются от начала строки до позиции 3 — BABA,
            длина 4. Последние две — от позиции 2 до конца строки: BAACB, длина
            5.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.positionsBabaacb}
            caption={
              <>
                Пунктирные клетки −1 и 7 — искусственные границы: окно BABA
                упирается в начало строки, окно BAACB — в конец, а длина обоих
                считается одной формулой.
              </>
            }
          />
          <Typography.Text>
            Это тот же ответ, что дало скользящее окно в подтеме 4. Позиции
            удобнее, когда K большое, а нужные буквы редкие: цикл идёт по
            списку, а не по всей строке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vhozhdeniya-slova",
      navLabel: "Вхождения слова",
      explanation: (
        <>
          <Typography.Text>
            Самый короткий фрагмент с двумя вхождениями слова ABA — как его
            найти, если вхождения могут перекрываться?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Так же, по списку позиций, только теперь это начала слова.
              Последнее слово кончается на m − 1 символов дальше своего начала,
              поэтому длина —{" "}
              <Notation>{"starts[j + k - 1] - starts[j] + m"}</Notation>.
            </strong>{" "}
            Начала ищем перебором, как в подтеме 3, — перекрытия не теряются.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'ABACABABA'\nword = 'ABA'\nm = len(word)\nstarts = [i for i in range(len(s) - m + 1) if s[i:i + m] == word]\nbest = len(s) + 1\nfor j in range(len(starts) - 1):\n    best = min(best, starts[j + 1] - starts[j] + m)\n\nprint(starts, best)"
            }
            label={"Самый короткий фрагмент с двумя ABA"}
            language="python"
            output={"[0, 4, 6] 5"}
          />
          <Typography.Text>
            Вхождения с позиций 4 и 6 перекрываются, вместе это ABABA — 5
            символов, а не 6. Та же формула работает для пар вроде TT: m = 2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nachalo-i-konec",
      navLabel: "Начало и конец",
      explanation: (
        <>
          <Typography.Text>
            Фрагмент начинается и заканчивается одной и той же цифрой, а внутри
            только буквы. Где искать его концы?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Только среди соседних цифр строки: если между концами окажется ещё
              одна цифра, внутри будут уже не только буквы. Значит, перебираем
              пары соседних позиций цифр.
            </strong>{" "}
            <Notation>{"s[i].isdigit()"}</Notation> проверяет, что символ —
            цифра.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = '5BA57OK7TEX2KA9'\ndigits = [i for i in range(len(s)) if s[i].isdigit()]\nbest = 0\nfor j in range(len(digits) - 1):\n    a, b = digits[j], digits[j + 1]\n    if s[a] == s[b]:\n        best = max(best, b - a + 1)\n\nprint(digits, best)"
            }
            label={"Одинаковые цифры на концах, внутри буквы"}
            language="python"
            output={"[0, 3, 4, 7, 11, 14] 4"}
          />
          <Typography.Text>
            Подходят 5BA5 и 7OK7, обе длины 4. Пара 2…9 — разные цифры. Так
            решаются многие задачи с особыми концами: сначала выписать, где
            могут стоять концы, потом проверить пары — это гораздо меньше, чем
            перебор всех фрагментов.
          </Typography.Text>
          <Typography.Text>
            Похоже устроено условие «фрагмент без цифр, в котором есть все шесть
            гласных»: цифры делят строку на блоки букв, и для максимума выгодно
            брать блок целиком. Проверка —{" "}
            <Notation>{"set('AEIOUY') <= set(block)"}</Notation>: все гласные
            есть среди букв блока.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pozicii-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Самый короткий с K",
                note: (
                  <Notation>
                    {"positions[j + k - 1] - positions[j] + 1"}
                  </Notation>
                ),
              },
              {
                key: "Самый длинный ровно с K",
                note: (
                  <Notation>
                    {"positions[j + k] - positions[j - 1] - 1"}
                  </Notation>
                ),
              },
              {
                key: "Искусственные границы",
                note: <>−1 и len(s) в начале и в конце списка</>,
              },
              {
                key: "Слово длины m",
                note: <>последнее начало − первое + m</>,
              },
              {
                key: "Особые концы",
                note: <>концы — среди позиций особых символов, перебор пар</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Буквы A стоят на позициях 3, 8, 9 и 15. Какова длина самого короткого
          фрагмента с тремя A?
        </>
      ),
      reveal: (
        <>7: от 3 до 9 включительно. Вторая тройка, с 8 по 15, длиннее — 8.</>
      ),
    },
    {
      id: "zadacha-2",
      prompt: <>Зачем в список позиций добавляют −1 и len(s)?</>,
      reveal: (
        <>
          Чтобы фрагмент, упирающийся в начало или конец строки, считался той же
          формулой, что и в середине.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          В строке длины 20 буквы B стоят на позициях 2, 5, 11 и 14. Какова
          длина самого длинного фрагмента ровно с двумя B?
        </>
      ),
      reveal: (
        <>
          14: список [−1, 2, 5, 11, 14, 20], лучшая пара — B на 11 и 14,
          фрагмент от 6 до 19.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Какова длина самого короткого фрагмента с двумя вхождениями TT в
          строке ATTTA?
        </>
      ),
      reveal: <>3: TTT — пары с позиций 1 и 2 перекрываются, 2 − 1 + 2 = 3.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Фрагмент начинается и кончается цифрой, внутри только буквы. Почему
          его концы — соседние цифры строки?
        </>
      ),
      reveal: (
        <>
          Если между концами есть ещё цифра, она окажется внутри фрагмента, а
          там разрешены только буквы.
        </>
      ),
    },
  ],
};

export default content;
