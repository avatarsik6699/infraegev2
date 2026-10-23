// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.skolzyashchee-okno.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "dve-granicy",
      navLabel: "Две границы",
      explanation: (
        <>
          <Typography.Text>
            Как найти самый длинный фрагмент, в котором не больше двух букв A?
            Цепочка здесь не поможет: одна лишняя A не обнуляет всё, что было до
            неё.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Хранить две границы фрагмента — окна. Правая идёт по строке по
              одному символу. Когда букв A стало больше двух, левая сдвигается
              вправо, пока лишняя A не уйдёт из окна.
            </strong>{" "}
            Количество A в окне хранится в счётчике: правая граница добавляет
            символ, левая убирает.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'BABAACB'\nleft = 0\ncount = 0\nbest = 0\nfor right in range(len(s)):\n    if s[right] == 'A':\n        count += 1\n    while count > 2:\n        if s[left] == 'A':\n            count -= 1\n        left += 1\n    best = max(best, right - left + 1)\n\nprint(best)"
            }
            label={"Не больше двух A — скользящее окно"}
            language="python"
            output={"5"}
          />
          <Typography.Text>
            Пройди строку BABAACB по шагам. Самый важный момент — третья A на
            позиции 4: окно BABAA плохое. Убираем B — в ABAA всё ещё три A.
            Убираем A — в BAA их две. Поэтому нужен{" "}
            <PythonTerm term="while">
              <Notation>{"while"}</Notation>
            </PythonTerm>
            , а не <Notation>{"if"}</Notation>: иногда убрать надо несколько
            символов.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.windowStepperA}
            label={"Окно с не более чем двумя A в строке BABAACB: шаг за шагом"}
          />
          <Typography.Text>
            Ответ — 5, окно BAACB. Вложенный цикл не делает программу медленной:
            left никогда не идёт назад, поэтому за весь проход он сдвинется не
            больше len(s) раз. Миллион символов — около двух миллионов шагов.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Почему окно ничего не теряет">
            <Typography.Text>
              Если в окне уже три A, расширение вправо их не уберёт: такое
              начало больше не пригодится, и его можно отбросить. После сдвига
              left стоит так далеко слева, как только можно для текущего правого
              конца. Значит, для каждого right найдено самое длинное подходящее
              окно, а среди них — и ответ.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "rovno-k",
      navLabel: "Ровно K",
      explanation: (
        <>
          <Typography.Text>
            В условии: «буква T встречается ровно 100 раз». Что поменять в окне?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Окно то же — левая граница двигается, пока букв больше K. А ответ
              обновляется, только когда их ровно K.
            </strong>{" "}
            Меньше K — фрагмент ещё не подходит, а сужение окна букв не
            прибавит.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'BABAACB'\nleft = 0\ncount = 0\nbest = 0\nfor right in range(len(s)):\n    if s[right] == 'A':\n        count += 1\n    while count > 2:\n        if s[left] == 'A':\n            count -= 1\n        left += 1\n    if count == 2:\n        best = max(best, right - left + 1)\n\nprint(best)"
            }
            label={"Ровно две A"}
            language="python"
            output={"5"}
          />
          <Typography.Text>
            На экзамене K = 100, а файл — миллион символов: программа та же,
            меняется только число. Если в строке меньше K нужных букв, best
            останется 0 — подходящего фрагмента нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-usloviy",
      navLabel: "Несколько условий",
      explanation: (
        <>
          <Typography.Text>
            Нужен самый длинный фрагмент, где буквы идут в алфавитном порядке и
            гласных не больше одной. Как совместить два условия?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждое условие — своим приёмом. Нарушение порядка — условие на
              соседей: окно начинается заново с текущей буквы. Лишняя гласная —
              ограничение на количество: левая граница догоняет.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'AEKZIOPSW'\nvowels = 'AEIOUY'\nleft = 0\ncount = 0\nbest = 0\nfor right in range(len(s)):\n    if right > 0 and s[right] < s[right - 1]:\n        left = right\n        count = 0\n    if s[right] in vowels:\n        count += 1\n    while count > 1:\n        if s[left] in vowels:\n            count -= 1\n        left += 1\n    best = max(best, right - left + 1)\n\nprint(best)"
            }
            label={"По алфавиту и не больше одной гласной"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Ответ — 4, фрагмент OPSW. EKZ тоже по алфавиту, но короче, а после Z
            порядок рушится: I меньше Z.
          </Typography.Text>
          <Typography.Text>
            Если ограничение на каждую из нескольких букв — «J, K, X и Z не
            больше 6 раз каждая», — счётчики держат в{" "}
            <PythonTerm term="dict">словаре</PythonTerm>, а окно сжимают, пока
            превышен счётчик только что добавленной буквы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pary-v-okne",
      navLabel: "Пары в окне",
      explanation: (
        <>
          <Typography.Text>
            Ограничение бывает на пары: «пара гласная + согласная встречается не
            больше 130 раз». Когда пара входит в окно и когда уходит?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пара считается, только когда лежит в окне целиком. Она входит,
              когда правая граница добавляет её второй символ, и уходит, когда
              левая проходит её первый.
            </strong>{" "}
            Пары могут перекрываться: в TTT две пары TT. Пара, которая кончается
            на right, — это срез <Notation>{"s[right - 1:right + 1]"}</Notation>
            , а пара, которая начинается на left, —{" "}
            <Notation>{"s[left:left + 2]"}</Notation>.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'TTATTTB'\nleft = 0\npairs = 0\nbest = 0\nfor right in range(len(s)):\n    if right > 0 and s[right - 1:right + 1] == 'TT':\n        pairs += 1\n    while pairs > 1:\n        if s[left:left + 2] == 'TT':\n            pairs -= 1\n        left += 1\n    best = max(best, right - left + 1)\n\nprint(best)"
            }
            label={"Не больше одной пары TT"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Пройди по шагам: на позиции 5 появляется пара TT, которая
            перекрывается с парой 3–4. Пар стало две, и левая граница уходит за
            T на позиции 3.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.windowStepperTt}
            label={"Окно с не более чем одной парой TT: шаг за шагом"}
          />
          <Typography.Text>
            Окна TTAT и TATT содержат по одной целой паре — ответ 4. Для пары
            «гласная + согласная» меняется только проверка:{" "}
            <Notation>
              {"s[right - 1] in vowels and s[right] not in vowels"}
            </Notation>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "okno-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Окно",
                note: <>right идёт вперёд, left догоняет по while</>,
              },
              { key: "Не более K", note: <>сжимать, пока count &gt; K</> },
              { key: "Ровно K", note: <>ответ — только при count == K</> },
              {
                key: "Порядок и количество",
                note: <>нарушен порядок — left = right; лишняя буква — while</>,
              },
              {
                key: "Пары",
                note: <>входит со вторым символом, уходит с первым</>,
              },
              { key: "Скорость", note: <>left не идёт назад: O(n)</> },
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
          Почему для сдвига левой границы нужен <Notation>{"while"}</Notation>,
          а не <Notation>{"if"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Иногда, чтобы убрать одну лишнюю A, приходится выкинуть несколько
          символов перед ней: в BABAA сначала уходит B, потом A.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          В строке 300 000 символов. Сколько раз всего может сдвинуться left?
          Почему программа не делает 300 000² действий?
        </>
      ),
      reveal: (
        <>
          Не больше 300 000 раз: left не возвращается назад. Вместе с right —
          около 600 000 шагов.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Найди самый длинный фрагмент строки AABAB, в котором не больше одной
          A.
        </>
      ),
      reveal: <>3: BAB. Окна AB и AB короче.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Чем программа для «ровно K букв» отличается от программы для «не более
          K»?
        </>
      ),
      reveal: (
        <>
          Только условием перед обновлением ответа:{" "}
          <Notation>{"if count == K"}</Notation>. Сжатие окна то же.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: <>Сколько пар TT в окне TTTT? Пары могут перекрываться.</>,
      reveal: <>Три: с позиций 0, 1 и 2.</>,
    },
  ],
};

export default content;
