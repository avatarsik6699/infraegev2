// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.obrazcy-i-bloki.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "povtoryayushchiysya-obrazec",
      navLabel: "Повторяющийся образец",
      explanation: (
        <>
          <Typography.Text>
            Как найти самую длинную цепочку вида DOGDOGDOGD…, если последний
            кусок может быть неполным?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Помнить, сколько символов цепочки уже набрано: следующим должен
              идти <Notation>{"pattern[current % 3]"}</Notation>. Совпал —
              цепочка растёт. Не совпал — новая цепочка может начаться, только
              если это D.
            </strong>{" "}
            После 0, 3, 6 набранных символов снова ждём D, после 1, 4, 7 — O:
            остаток от деления на длину образца повторяется.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.expectedDog}
            caption={
              <>
                Набрано current символов — следующим ожидается pattern[current %
                3]: после 0, 3 и 6 символов снова D.
              </>
            }
          />
          <Typography.Text>
            В строке ODOGDOGDORDOG цепочка DOGDOGDO обрывается на R: там ждали
            G. R не может начать новую цепочку — current = 0. Следующая D
            начинает цепочку заново.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'ODOGDOGDORDOG'\npattern = 'DOG'\ncurrent = 0\nbest = 0\nfor c in s:\n    if c == pattern[current % 3]:\n        current += 1\n    elif c == 'D':\n        current = 1\n    else:\n        current = 0\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Самая длинная цепочка DOGDOG…"}
            language="python"
            output={"8"}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: образец с повторяющейся буквой и только целые блоки"
          >
            <Typography.Text>
              Перезапуск «с первой буквы образца» верен, когда эта буква
              встречается в образце один раз, как D в DOG. Для образца AAB в
              строке AAAB при несовпадении нужно оставить две последние A, а не
              одну. Тогда проще проверить каждое возможное начало цепочки.
            </Typography.Text>
            <Typography.Text>
              Если засчитываются только целые блоки, из ответа убирают неполный
              хвост: <Notation>{"best - best % 3"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "obrazec-s-variantami",
      navLabel: "Начало с любого места",
      explanation: (
        <>
          <Typography.Text>
            А если цепочка из групп SQRP может начинаться с любой буквы группы —
            RPSQRPS тоже подходит?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Тогда хватает проверки соседей: за S должна идти Q, за Q — R, за R
              — P, за P — S. Это условие на пару, и сброс — до 1, как в подтеме
              2.
            </strong>{" "}
            Какая буква должна идти следом, удобно хранить в{" "}
            <PythonTerm term="dict">словаре</PythonTerm>:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'QRPSQRPSQXRPS'\nnxt = {'S': 'Q', 'Q': 'R', 'R': 'P', 'P': 'S'}\ncurrent = 1\nbest = 1\nfor i in range(1, len(s)):\n    if nxt.get(s[i - 1]) == s[i]:\n        current += 1\n    else:\n        current = 1\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Цепочка SQRP с любого места"}
            language="python"
            output={"9"}
          />
          <Typography.Text>
            Цепочка QRPSQRPSQ — 9 символов, X её обрывает.{" "}
            <Notation>{"nxt.get('X')"}</Notation> вернёт None — у X следующей
            буквы нет. Если условие требует хоть одну полную группу SQRP, она
            точно есть в любой цепочке из 7 и больше символов.
          </Typography.Text>
          <Typography.Text>
            Бывает, что на месте буквы допустимы два символа: в слове yandex
            вместо a можно писать 4, вместо e — 3. Тогда для каждого места
            храним набор допустимых символов и проверяем{" "}
            <Notation>{"c in pattern[current % 6]"}</Notation>:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'qyandqqyand3xy4q'\npattern = ['y', 'a4', 'n', 'd', 'e3', 'x']\ncurrent = 0\nbest = 0\nfor c in s:\n    if c in pattern[current % 6]:\n        current += 1\n    elif c == 'y':\n        current = 1\n    else:\n        current = 0\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Повторяющееся слово с заменами"}
            language="python"
            output={"8"}
          />
          <Typography.Text>
            Самая длинная цепочка — yand3xy4: 3 стоит на месте e, 4 — на месте
            a.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bloki",
      navLabel: "Цепочки пар и троек",
      explanation: (
        <>
          <Typography.Text>
            Сколько пар AB или CB идёт подряд? Например, в ABCBAB — три пары.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Пары не перекрываются, поэтому идём по строке шагом 2. Цепочка пар
              может начаться и на чётной, и на нечётной позиции — проверяем оба
              смещения.
            </strong>{" "}
            Третий аргумент <Notation>{"range"}</Notation> — шаг:{" "}
            <Notation>{"range(1, 9, 2)"}</Notation> даёт 1, 3, 5, 7.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'CABCBABAB'\nbest = 0\nfor start in (0, 1):\n    current = 0\n    for i in range(start, len(s) - 1, 2):\n        if s[i:i + 2] in ('AB', 'CB'):\n            current += 1\n        else:\n            current = 0\n        best = max(best, current)\n\nprint(best)"
            }
            label={"Пары AB и CB подряд — два смещения"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            С нулевой позиции пары CA, BC, BA, BA — ни одной подходящей. С
            первой — AB, CB, AB, AB: четыре подряд.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.offsetsAbCb}
            caption={
              <>
                Пары с позиций 0, 2, 4, 6 не подходят, а с позиций 1, 3, 5, 7 —
                AB, CB, AB, AB: четыре пары подряд.
              </>
            }
          />
          <Typography.Text>
            Для троек вроде ABA или BAB шаг 3 и смещения три: 0, 1 и 2. Если
            спрашивают число символов, а не пар, ответ умножают на длину блока.
          </Typography.Text>
          <Typography.Text>
            Бывает, что блок — любые символы набора: «RGB-цепочка — шесть
            шестнадцатеричных цифр». Тогда блоки друг от друга не отличаются, и
            число блоков подряд — это длина самой длинной цепочки таких
            символов, делённая на 6 нацело.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "korotkie-fragmenty",
      navLabel: "Короткие фрагменты",
      explanation: (
        <>
          <Typography.Text>
            Сколько в строке фрагментов длины 5, которые читаются одинаково
            слева направо и справа налево — палиндромов?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перебрать все начала: кусок <Notation>{"s[i:i + 5]"}</Notation>{" "}
              для i от 0 до len(s) − 5. Кусков около миллиона, но каждый
              короткий — это быстро.
            </strong>{" "}
            Кусок-палиндром совпадает со своим переворотом{" "}
            <Notation>{"t[::-1]"}</Notation>.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "s = 'ABCBAXABA'\ncount = 0\nfor i in range(len(s) - 4):\n    t = s[i:i + 5]\n    if t == t[::-1]:\n        count += 1\n\nprint(count)"
            }
            label={"Палиндромы длины 5"}
            language="python"
            output={"2"}
          />
          <Typography.Text>
            Подходят ABCBA и BAXAB. Последнее начало — len(s) − 5, а правая
            граница <Notation>{"range"}</Notation> не входит, поэтому{" "}
            <Notation>{"range(len(s) - 4)"}</Notation>. Так же проверяют любые
            условия на короткий кусок: «первый символ из A, B, C, второй из C,
            D, E, символы не повторяются» — это{" "}
            <Notation>{"len(set(t)) == 3"}</Notation> и проверки по позициям.
          </Typography.Text>
          <Typography.Text>
            Вхождения слова тоже ищут перебором начал. Метод{" "}
            <PythonTerm term="listcount">
              <Notation>{"count"}</Notation>
            </PythonTerm>{" "}
            здесь не годится: найдя слово, он продолжает поиск после его конца и
            пропускает перекрытия.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.overlapAba}
            caption={
              <>
                ABA в ABABA начинается с позиций 0 и 2. count находит первое
                вхождение и пропускает второе — оно перекрывается с первым.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "obrazcy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Образец",
                note: <Notation>{"c == pattern[current % m]"}</Notation>,
              },
              {
                key: "Не совпал",
                note: <>1, если это первая буква образца, иначе 0</>,
              },
              {
                key: "С любого места",
                note: <>проверка пары «за этой буквой — следующая»</>,
              },
              { key: "Пары, тройки", note: <>шаг 2 или 3, все смещения</> },
              {
                key: "Короткий кусок",
                note: <>перебор начал: s[i:i + k]</>,
              },
              {
                key: "Перекрытия",
                note: <>count их не видит — перебирай начала</>,
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
          В цепочке DOGDOG… уже набрано 7 символов. Какой символ ожидается
          следующим?
        </>
      ),
      reveal: <>O: 7 % 3 = 1, а pattern[1] — O.</>,
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Почему для цепочки SQRP, которая может начинаться с любой буквы, при
          несовпадении сбрасывают до 1, а не до 0?
        </>
      ),
      reveal: (
        <>
          Любая из букв S, Q, R, P может начать новую цепочку, а условие — на
          пару соседей. Символ, на котором цепочка оборвалась, сам начинает
          новую.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Сколько вхождений ABA в строке ABABAB с перекрытиями? Что вернёт{" "}
          <Notation>{"'ABABAB'.count('ABA')"}</Notation>?
        </>
      ),
      reveal: <>Два — с позиций 0 и 2. count вернёт 1.</>,
    },
    {
      id: "zadacha-4",
      prompt: <>Сколько пар AB или CB идёт подряд в строке CBABXAB?</>,
      reveal: (
        <>
          Две: CB и AB с нулевой позиции. С первой позиции подходит только AB в
          конце.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Сколько фрагментов длины 5 нужно проверить в строке из 1 000 000
          символов?
        </>
      ),
      reveal: <>999 996: начала с 0 по 999 995.</>,
    },
  ],
};

export default content;
