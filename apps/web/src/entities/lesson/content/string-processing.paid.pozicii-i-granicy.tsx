// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.pozicii-i-granicy.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "pozicii-simvolov",
      navLabel: "Позиции символов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Третий основной приём — хранить позиции только тех символов,
              которые влияют на условие.
            </strong>{" "}
            Так решаются задачи о самом коротком фрагменте с K буквами или
            парами, о фрагментах с особыми началом и концом, о частях строки
            между разделителями и о блоке, где есть все символы набора.
          </Typography.Text>
          <Typography.Text>
            Позиции разберём на той же строке <Notation>{"BABAACB"}</Notation>,
            что и окно в подтеме 4, — так видно, что оба приёма дают одни
            ответы. Перекрывающиеся вхождения слова — из подтемы 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "spisok-poziciy",
      navLabel: "Список позиций",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Список позиций нужных символов собирается одним проходом.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Допустим, нас интересуют буквы <Notation>{"A"}</Notation>. Создадим{" "}
            <PythonTerm term="list">список</PythonTerm> их индексов:
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'BABAACB'\npositions = []\n\nfor i in range(len(s)):\n    if s[i] == 'A':\n        positions.append(i)\n\nprint(positions)"
            }
            label={
              "Допустим, нас интересуют буквы A. Создадим {{list|список}} их индексов"
            }
            language="python"
            output={"[1, 3, 4]"}
          />
          <Typography.Text>
            Теперь некоторые задачи удобнее решать по этому списку.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Самый короткий фрагмент с <Notation>{"K"}</Notation> буквами
              начинается на одной из них и заканчивается на{" "}
              <Notation>{"K"}</Notation>-й по счёту.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть нужен самый короткий фрагмент с <Notation>{"K"}</Notation>{" "}
            буквами <Notation>{"A"}</Notation>, например с двумя. В{" "}
            <Notation>{"BABAACB"}</Notation> две соседние по списку{" "}
            <Notation>{"A"}</Notation> — это позиции 1 и 3 (фрагмент{" "}
            <Notation>{"ABA"}</Notation>, длина 3) или 3 и 4 (фрагмент{" "}
            <Notation>{"AA"}</Notation>, длина 2). В общем случае: если выбраны{" "}
            <Notation>{"K"}</Notation> последовательных вхождений с номерами{" "}
            <Notation>{"j"}</Notation>, <Notation>{"j + 1"}</Notation>, …,{" "}
            <Notation>{"j + K − 1"}</Notation>, то самый короткий охватывающий
            их фрагмент начинается на первой <Notation>{"A"}</Notation> и
            заканчивается на последней. Его длина —{" "}
            <Notation>{"positions[j + K - 1] - positions[j] + 1"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'BABAACB'\npositions = [1, 3, 4]\nK = 2\nbest = len(s) + 1\n\nfor j in range(len(positions) - K + 1):\n    length = positions[j + K - 1] - positions[j] + 1\n    best = min(best, length)\n\nif best == len(s) + 1:\n    print('Подходящего фрагмента нет')\nelse:\n    print(best)"
            }
            label={"Его длина — positions[j + K - 1] - positions[j] + 1"}
            language="python"
            output={"2"}
          />
          <Typography.Text>
            Здесь <Notation>{"K >= 1"}</Notation>. Почему достаточно
            последовательных вхождений? Если между выбранными{" "}
            <Notation>{"A"}</Notation> есть ещё одна <Notation>{"A"}</Notation>,
            она всё равно попадёт внутрь непрерывного фрагмента. Пропустить её
            нельзя.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maksimum-s-rovno-k",
      navLabel: "Максимум с ровно K",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для максимальной длины с ровно <Notation>{"K"}</Notation> буквами
              нужно растянуть границы до соседних лишних вхождений.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В строке <Notation>{"BABAACB"}</Notation> возьмём две первые{" "}
            <Notation>{"A"}</Notation> — на позициях 1 и 3. Левее первой можно
            идти до начала строки, а правее второй — только до позиции 3:
            следующая <Notation>{"A"}</Notation> на позиции 4 уже лишняя.
            Получается <Notation>{"BABA"}</Notation>, длина 4. Для двух
            последних <Notation>{"A"}</Notation> (позиции 3 и 4) левее можно
            идти до позиции 2, правее — до конца строки:{" "}
            <Notation>{"BAACB"}</Notation>, длина 5.
          </Typography.Text>
          <Typography.Text>
            В общем случае выбираем группу из <Notation>{"K"}</Notation>{" "}
            последовательных <Notation>{"A"}</Notation>: левее первой выбранной{" "}
            <Notation>{"A"}</Notation> можно идти до предыдущей{" "}
            <Notation>{"A"}</Notation>, не включая её; правее последней — до
            следующей <Notation>{"A"}</Notation>, не включая её.
          </Typography.Text>
          <Typography.Text>
            Чтобы одинаково обрабатывать начало и конец строки, добавим две
            искусственные позиции: <Notation>{"-1"}</Notation> и{" "}
            <Notation>{"len(s)"}</Notation>. Это{" "}
            <strong>не настоящие символы</strong>, а удобные обозначения границ.
            Для нашего примера список становится{" "}
            <Notation>{"[-1, 1, 3, 4, 7]"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если первая выбранная <Notation>{"A"}</Notation> находится в{" "}
            <Notation>{"positions[j]"}</Notation>, то предыдущая лишняя{" "}
            <Notation>{"A"}</Notation> —{" "}
            <Notation>{"positions[j - 1]"}</Notation>, а следующая —{" "}
            <Notation>{"positions[j + K]"}</Notation>. Следовательно,{" "}
            <Notation>{"left = positions[j - 1] + 1"}</Notation>,{" "}
            <Notation>{"right = positions[j + K] - 1"}</Notation>, а длина right
            − left + 1 = positions[j + K] − positions[j − 1] − 1.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.stringPositionsBABAACB_A_2}
            caption={
              <>
                Пунктирные клетки −1 и 7 — искусственные границы: окно BABA
                упирается в начало строки, окно BAACB — в конец, а длина обоих
                считается одной формулой.
              </>
            }
          />
          <CodeBlock
            code={
              "s = 'BABAACB'\npositions = [-1]\n\nfor i in range(len(s)):\n    if s[i] == 'A':\n        positions.append(i)\n\npositions.append(len(s))\n\nK = 2\nbest = 0\n\nfor j in range(1, len(positions) - K):\n    length = positions[j + K] - positions[j - 1] - 1\n    best = max(best, length)\n\nprint(best)"
            }
            label={"Код на Python: s = 'BABAACB'"}
            language="python"
            output={"5"}
          />
          <Typography.Text>
            <strong>Смысл искусственных границ стоит запомнить:</strong>
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Они позволяют применить одну формулу и к середине строки, и к
              фрагментам, упирающимся в её края.
            </Typography.Text>
          </blockquote>
        </>
      ),
    },
    {
      id: "vhozhdeniya-slova",
      navLabel: "Вхождения слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Позиционный подход работает и для нескольких вхождений слова, в
              том числе перекрывающихся.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть ищем минимальный фрагмент с <Notation>{"K"}</Notation>{" "}
            вхождениями слова <Notation>{"ABA"}</Notation>. Сначала получаем
            позиции всех начал — перебором из подтемы 3. Если первое выбранное
            слово начинается на <Notation>{"positions[j]"}</Notation>, а
            последнее — на <Notation>{"positions[j + K - 1]"}</Notation>, его
            конец находится на{" "}
            <Notation>{"positions[j + K - 1] + m - 1"}</Notation>. Поэтому длина
            — <Notation>{"positions[j + K - 1] - positions[j] + m"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'ABABABA'\nword = 'ABA'\nm = len(word)\n\npositions = []\nfor i in range(len(s) - m + 1):\n    if s[i:i + m] == word:\n        positions.append(i)\n\nK = 2\nbest = len(s) + 1\nfor j in range(len(positions) - K + 1):\n    length = positions[j + K - 1] - positions[j] + m\n    best = min(best, length)\n\nprint(positions, best)"
            }
            label={"Поэтому длина — positions[j + K - 1] - positions[j] + m"}
            language="python"
            output={"[0, 2, 4] 5"}
          />
          <Typography.Text>
            Самый короткий фрагмент с двумя вхождениями —{" "}
            <Notation>{"ABABA"}</Notation>, длина <Notation>{"5"}</Notation>.
            Почему не <Notation>{"6"}</Notation>? Потому что вхождения
            перекрываются. Для одного символа <Notation>{"m = 1"}</Notation>, и
            получается уже знакомая формула. Та же формула годится для пар вроде{" "}
            <Notation>{"TT"}</Notation>: самый короткий фрагмент, где пар не
            менее <Notation>{"K"}</Notation>, содержит их ровно{" "}
            <Notation>{"K"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zameny-i-razbienie",
      navLabel: "Замены и разбиение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Замены и разбиение строки удобны, когда они сохраняют смысл
              задачи.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть запрещена буква <Notation>{"X"}</Notation>.{" "}
            <PythonTerm term="splitsep">
              <Notation>{"s.split('X')"}</Notation>
            </PythonTerm>{" "}
            разбивает строку по указанному разделителю, и самый длинный фрагмент
            без <Notation>{"X"}</Notation> — самая длинная часть:
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'ABXXCDEFXGH'\nparts = s.split('X')\nprint(parts)\n\nbest = 0\nfor part in parts:\n    best = max(best, len(part))\n\nprint(best)"
            }
            label={"Код на Python: s = 'ABXXCDEFXGH'"}
            language="python"
            output={"['AB', '', 'CDEF', 'GH']\n4"}
          />
          <Typography.Text>
            Пустые фрагменты возникают, например, между соседними разделителями.
            Здесь они не мешают.
          </Typography.Text>
          <Typography.Text>
            Если запрещены <Notation>{"X"}</Notation> и{" "}
            <Notation>{"Y"}</Notation>, можно превратить их в общий разделитель:{" "}
            <Notation>{"t = s.replace('X', ' ').replace('Y', ' ')"}</Notation>,
            а затем перебрать <Notation>{"t.split()"}</Notation>.{" "}
            <PythonTerm term="strmeth">
              <Notation>{"replace()"}</Notation>
            </PythonTerm>{" "}
            возвращает строку с заменами, исходная строка сама не изменяется.{" "}
            <Notation>{"split()"}</Notation> без аргумента разбивает по
            пробельным промежуткам и не создаёт пустых частей.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Опасная замена — удаление символа вместо создания границы.
            </strong>{" "}
            Если в <Notation>{"AAAXAAAA"}</Notation> выполнить{" "}
            <Notation>{"s.replace('X', '')"}</Notation>, получится{" "}
            <Notation>{"AAAAAAA"}</Notation>. Но такой непрерывной цепочки в
            исходной строке не было.
          </Typography.Text>
          <Typography.Text>
            Также будь осторожен с заменой длинного слова одним символом:{" "}
            <Notation>{"s.replace('ABC', '*')"}</Notation> меняет длину и
            позиции. Иногда это полезно, но тогда нужно отдельно восстанавливать
            длину исходного фрагмента.
          </Typography.Text>
          <Typography.Text>
            Прежде чем применять замену, спроси:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Не создам ли я соседство, которого раньше не было? Не потеряю ли
              перекрывающиеся вхождения? Смогу ли восстановить исходные позиции?
            </Typography.Text>
          </blockquote>
        </>
      ),
    },
    {
      id: "chasti-mezhdu-razdelitelyami",
      navLabel: "Части между разделителями",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Части между разделителями можно собирать в цепочку, если условие
              разрешает сам разделитель.
            </strong>
          </Typography.Text>
          <Typography.Text>Учебная задача:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти самый длинный фрагмент, который начинается и заканчивается
              буквой <Notation>{"F"}</Notation>, а между любыми двумя соседними
              буквами <Notation>{"F"}</Notation> содержит не более двух букв{" "}
              <Notation>{"A"}</Notation>.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            После <Notation>{"s.split('F')"}</Notation> первая и последняя части
            не лежат между двумя <Notation>{"F"}</Notation>, поэтому
            рассматриваем только <Notation>{"parts[1:-1]"}</Notation>.
            Подходящая часть продолжает цепочку: к длине добавляются сама часть
            и закрывающая <Notation>{"F"}</Notation>. Неподходящая часть
            обрывает цепочку — сброс до нуля, как в подтеме 2. Пройди программу
            по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runChain}
            label={"Пройди программу по шагам"}
          />
          <Typography.Text>
            Здесь <Notation>{"current = 1"}</Notation> — первая{" "}
            <Notation>{"F"}</Notation> новой цепочки. Лучший фрагмент —{" "}
            <Notation>{"FAAFCF"}</Notation>: часть <Notation>{"AAA"}</Notation>{" "}
            содержит три <Notation>{"A"}</Notation> и обрывает цепочку.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "peresekayushchiesya-razdeliteli",
      navLabel: "Перекрывающиеся разделители",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если разделители перекрываются и удаляются с разбиением строки,
              нужно пометить все занятые ими позиции.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Допустим, разделителем является любая тройка, содержащая по одному
            разу <Notation>{"A"}</Notation>, <Notation>{"B"}</Notation>,{" "}
            <Notation>{"C"}</Notation>. В строке{" "}
            <Notation>{"QABCABR"}</Notation> есть перекрывающиеся разделители{" "}
            <Notation>{"ABC"}</Notation>, <Notation>{"BCA"}</Notation> и{" "}
            <Notation>{"CAB"}</Notation>. Они вместе покрывают весь участок{" "}
            <Notation>{"ABCAB"}</Notation>. После удаления с разбиением остаются
            отдельные фрагменты <Notation>{"Q"}</Notation> и{" "}
            <Notation>{"R"}</Notation>. Их нельзя склеить в{" "}
            <Notation>{"QR"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Для проверки состава тройки удобно{" "}
            <PythonTerm term="set">множество</PythonTerm>: оно хранит различные
            элементы и повторения не учитывает. Поскольку в тройке ровно три
            позиции, условие{" "}
            <Notation>{"set(s[i:i + 3]) == {'A', 'B', 'C'}"}</Notation>{" "}
            означает, что каждая из этих букв встретилась ровно один раз.
          </Typography.Text>
          <Typography.Text>
            Сначала пометим все позиции разделителей в списке{" "}
            <PythonTerm term="listrepeat">
              <Notation>{"[False] * len(s)"}</Notation>
            </PythonTerm>
            , потом найдём максимальную цепочку непомеченных позиций:
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'QABCABR'\nremoved = [False] * len(s)\n\nfor i in range(len(s) - 2):\n    if set(s[i:i + 3]) == {'A', 'B', 'C'}:\n        for j in range(i, i + 3):\n            removed[j] = True\n\ncurrent = 0\nbest = 0\n\nfor i in range(len(s)):\n    if not removed[i]:\n        current += 1\n    else:\n        current = 0\n\n    best = max(best, current)\n\nprint(best)"
            }
            label={"Код на Python: s = 'QABCABR'"}
            language="python"
            output={"1"}
          />
          <Typography.Text>
            Здесь все разделители определяются{" "}
            <strong>в исходной строке</strong>. Последовательное удаление и
            повторный поиск могли бы изменить соседства и привести к другому
            результату.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nachalo-i-konec",
      navLabel: "Начало и конец фрагмента",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ограничения на начало и конец фрагмента часто позволяют резко
              сократить перебор.
            </strong>
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Фрагмент заканчивается гласной, содержит только одну гласную и
              ровно <Notation>{"K"}</Notation> букв <Notation>{"T"}</Notation>.
              Нужна минимальная длина.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Вместо перебора любых правых концов достаточно рассмотреть позиции
            гласных. Для каждой такой позиции предыдущая гласная не должна
            попасть внутрь; берём последние <Notation>{"K"}</Notation> букв{" "}
            <Notation>{"T"}</Notation>, расположенные после предыдущей гласной,
            и начало ставим на первую из этих <Notation>{"K"}</Notation> букв.
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'ATBTCTEXTYTTO'\nK = 2\nvowels = 'AEIOUY'\n\npositions_t = []\nbest = len(s) + 1\n\nfor i in range(len(s)):\n    if s[i] == 'T':\n        positions_t.append(i)\n\n    elif s[i] in vowels:\n        if len(positions_t) >= K:\n            left = positions_t[-K]\n            best = min(best, i - left + 1)\n\n        positions_t = []\n\nprint(best)"
            }
            label={"Код на Python: s = 'ATBTCTEXTYTTO'"}
            language="python"
            output={"3"}
          />
          <Typography.Text>
            <Notation>{"positions_t[-K]"}</Notation> —{" "}
            <Notation>{"K"}</Notation>-й элемент с конца. Почему после каждой
            гласной список очищается? Следующий подходящий фрагмент не может
            пересекать эту гласную: иначе гласных будет уже две. Здесь подходят{" "}
            <Notation>{"TCTE"}</Notation> и <Notation>{"TTO"}</Notation>, короче
            — <Notation>{"TTO"}</Notation>; перед <Notation>{"Y"}</Notation>{" "}
            только одна <Notation>{"T"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Набор гласных берём именно из условия задачи. Например, включение{" "}
            <Notation>{"Y"}</Notation> должно определяться формулировкой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odinakovye-koncy",
      navLabel: "Одинаковые концы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если концы фрагмента — одинаковые символы, а внутри таких символов
              быть не должно, концами служат соседние вхождения.
            </strong>
          </Typography.Text>
          <Typography.Text>Другой пример:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Начало и конец — одинаковые цифры, внутри только буквы.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Тогда концами могут быть только{" "}
            <strong>соседние цифры исходной строки</strong>. Если между
            выбранными крайними цифрами находится третья цифра, условие уже
            нарушено. Поэтому достаточно перебрать соседние позиции цифр и
            проверить равенство крайних цифр, необходимую чётность, наличие букв
            между ними и дополнительные условия на эти буквы.
          </Typography.Text>
          <Typography.Text>
            Учебная задача: фрагмент начинается и заканчивается одной и той же
            нечётной цифрой, между ними только буквы, гласных и согласных
            поровну; нужен самый длинный, при равенстве — с наибольшим номером
            начала (нумерация с нуля):
          </Typography.Text>
          <CodeBlock
            code={
              "s = '5BA57OK7TEX2KA2'\ndigits = '0123456789'\nvowels = 'AEIOUY'\n\nwhere = []\nfor i in range(len(s)):\n    if s[i] in digits:\n        where.append(i)\n\nbest_length = 0\nbest_start = -1\nfor k in range(len(where) - 1):\n    a = where[k]\n    b = where[k + 1]\n    if s[a] == s[b] and int(s[a]) % 2 == 1 and b - a > 1:\n        inside = s[a + 1:b]\n        v = 0\n        for c in inside:\n            if c in vowels:\n                v += 1\n        if 2 * v == len(inside):\n            length = b - a + 1\n            if length > best_length or (\n                length == best_length and a > best_start\n            ):\n                best_length = length\n                best_start = a\n\nprint(best_length, best_start)"
            }
            label={"Код на Python: s = '5BA57OK7TEX2KA2'"}
            language="python"
            output={"4 4"}
          />
          <Typography.Text>
            Подходят <Notation>{"5BA5"}</Notation> (начало 0) и{" "}
            <Notation>{"7OK7"}</Notation> (начало 4) — обе длины 4, выбрано
            большее начало. Фрагмент <Notation>{"2KA2"}</Notation> тоже
            сбалансирован, но цифра 2 чётная. Правило при равенстве и нумерация
            — как в подтеме 3.
          </Typography.Text>
          <Typography.Text>
            Тот же приём — для букв. «Фрагмент от <Notation>{"E"}</Notation> до{" "}
            <Notation>{"E"}</Notation>, внутри нет других{" "}
            <Notation>{"E"}</Notation>» — это часть между соседними{" "}
            <Notation>{"E"}</Notation>, то есть элемент{" "}
            <Notation>{"s.split('E')[1:-1]"}</Notation>; длина фрагмента — длина
            части плюс две буквы <Notation>{"E"}</Notation>. Посчитаем фрагменты
            длиной не меньше 4 без буквы <Notation>{"F"}</Notation> внутри:
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'EABEFEXYZE'\ncount = 0\n\nfor part in s.split('E')[1:-1]:\n    if len(part) + 2 >= 4 and 'F' not in part:\n        count += 1\n\nprint(count)"
            }
            label={"Посчитаем фрагменты длиной не меньше 4 без буквы F внутри"}
            language="python"
            output={"2"}
          />
          <Typography.Text>
            Подходят <Notation>{"EABE"}</Notation> и{" "}
            <Notation>{"EXYZE"}</Notation>; <Notation>{"EFE"}</Notation> короче
            четырёх и содержит <Notation>{"F"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Такое выделение возможных границ нередко проще общего скользящего
            окна.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vse-simvoly-nabora",
      navLabel: "Все символы набора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Требование «встречаются все символы набора» тоже нужно сочетать с
              остальными условиями.
            </strong>
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти самый длинный фрагмент только из цифр, содержащий все десять
              цифр.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Сначала последовательность разбивается буквами на цифровые блоки.
            Если некоторый цифровой блок содержит все десять цифр, для максимума
            выгодно брать его целиком: дополнительные цифры не нарушают условие.
            Можно поддерживать длину текущего цифрового блока и множество
            встреченных цифр:
          </Typography.Text>
          <CodeBlock
            code={
              "s = 'AB0123456789X98765432101C'\ndigits = '0123456789'\n\ncurrent = 0\nseen = set()\nbest = 0\n\nfor c in s:\n    if c in digits:\n        current += 1\n        seen.add(c)\n    else:\n        current = 0\n        seen = set()\n\n    if len(seen) == 10:\n        best = max(best, current)\n\nprint(best)"
            }
            label={
              "Можно поддерживать длину текущего цифрового блока и множество встреченных цифр"
            }
            language="python"
            output={"11"}
          />
          <Typography.Text>
            <Notation>{"set()"}</Notation> создаёт пустое множество.{" "}
            <Notation>{"seen.add(c)"}</Notation> добавляет символ; повторное
            добавление того же символа не увеличивает размер множества. Здесь{" "}
            <Notation>{"len(seen) == 10"}</Notation> означает, что встретились
            все десять различных цифр.
          </Typography.Text>
          <Typography.Text>
            А вот для <strong>минимального</strong> фрагмента, содержащего все
            нужные символы, потребуется сжимать окно, пока каждый нужный символ
            ещё представлен хотя бы один раз — как в подтеме 4. Снова видно, что
            слова «минимальный» и «максимальный» меняют алгоритм.
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
                note: (
                  <>
                    Позиции нужных символов — список; самый короткий фрагмент с{" "}
                    <Notation>{"K"}</Notation> вхождениями —{" "}
                    <Notation>
                      {"positions[j + K - 1] - positions[j] + m"}
                    </Notation>
                    .
                  </>
                ),
              },
              {
                note: (
                  <>
                    Самый длинный с ровно <Notation>{"K"}</Notation> — от
                    соседних лишних вхождений: искусственные границы{" "}
                    <Notation>{"-1"}</Notation> и{" "}
                    <Notation>{"len(s)"}</Notation> и{" "}
                    <Notation>
                      {"positions[j + K] - positions[j - 1] - 1"}
                    </Notation>
                    .
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"split"}</Notation> создаёт границы, а{" "}
                    <Notation>{"replace(…, '')"}</Notation> их уничтожает;
                    перекрывающиеся разделители помечают в исходной строке.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Особые концы сокращают перебор: соседние вхождения
                    граничного символа, последние <Notation>{"K"}</Notation>{" "}
                    нужных букв перед концом.
                  </>
                ),
              },
              {
                note: (
                  <>
                    «Все символы набора» в блоке — множество встреченных; для
                    максимума блок берут целиком.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
};

export default content;
