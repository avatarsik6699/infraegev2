// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.chisla-i-vyrazheniya.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "struktura-vyrazheniya",
      navLabel: "Структура выражения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Корректное арифметическое выражение ищут не вычислением, а
              проверкой структуры записи: число, знак, число, знак…
            </strong>{" "}
            Тот же шаблон числа описывает и запись числа в системе счисления.
          </Typography.Text>
          <Typography.Text>
            Сквозной пример — строка <Notation>{"03+5**7+0*12"}</Notation>: в
            ней есть ведущий ноль и два знака подряд. Срезы и включённые границы
            — из подтемы 1, сравнение кандидатов по длине — из подтем 2–5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "regulyarnye-vyrazheniya",
      navLabel: "Регулярные выражения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Регулярные выражения полезны, когда фрагмент описывается
              повторяющейся структурой.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например: одна или несколько цифр; число, затем несколько пар
            «операция + число»; буква, затем цифры, затем буква. Всё, что нужно
            из модуля <Notation>{"re"}</Notation>, уже знакомо по курсу Python —{" "}
            <PythonTerm term="regex">регулярное выражение</PythonTerm>: классы{" "}
            <Notation>{"[0-9]"}</Notation> и <Notation>{"[ABC]"}</Notation>,
            повторения <Notation>{"+"}</Notation>, <Notation>{"*"}</Notation>,{" "}
            <Notation>{"?"}</Notation>, выбор <Notation>{"A|B"}</Notation>,
            проверка всей строки <Notation>{"re.fullmatch"}</Notation> и поиск{" "}
            <Notation>{"re.finditer"}</Notation> с{" "}
            <Notation>{"group()"}</Notation>, <Notation>{"start()"}</Notation>,{" "}
            <Notation>{"end()"}</Notation>. Длина совпадения —{" "}
            <Notation>{"match.end() - match.start()"}</Notation>, а совпадения{" "}
            <Notation>{"finditer"}</Notation> <strong>не перекрываются</strong>:
            следующее ищется после конца предыдущего.
          </Typography.Text>
          <Typography.Text>
            Новое для нас одно — <strong>группа без сохранения</strong>{" "}
            <Notation>{"(?:...)"}</Notation>. Как и обычные скобки, она
            объединяет элементы, чтобы повторение относилось ко всей группе, но
            ничего не запоминает. Например, <Notation>{"ABC+"}</Notation>{" "}
            означает <Notation>{"AB"}</Notation>, затем одну или несколько{" "}
            <Notation>{"C"}</Notation>, а <Notation>{"(?:ABC)+"}</Notation> —
            один или несколько блоков <Notation>{"ABC"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "import re\n\nprint(re.fullmatch(r'ABC+', 'ABCCC') is not None)\nprint(re.fullmatch(r'ABC+', 'ABCABC') is not None)\nprint(re.fullmatch(r'(?:ABC)+', 'ABCABC') is not None)"
            }
            label={"Код на Python: import re"}
            language="python"
            output={"True\nFalse\nTrue"}
          />
        </>
      ),
    },
    {
      id: "dopustimoe-chislo",
      navLabel: "Допустимое число",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы составить шаблон арифметического выражения, сначала нужно
              точно определить допустимое число.
            </strong>
          </Typography.Text>
          <Typography.Text>Предположим:</Typography.Text>
          <ul>
            <li>разрешены десятичные неотрицательные целые числа;</li>
            <li>ведущие нули запрещены;</li>
            <li>
              отдельное число <Notation>{"0"}</Notation> разрешено;
            </li>
            <li>
              разрешены операции <Notation>{"+"}</Notation> и{" "}
              <Notation>{"*"}</Notation>;
            </li>
            <li>
              унарных знаков нет, то есть выражение не начинается с{" "}
              <Notation>{"+"}</Notation> или <Notation>{"-"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            Подходящие числа — <Notation>{"0"}</Notation>,{" "}
            <Notation>{"5"}</Notation>, <Notation>{"10"}</Notation>,{" "}
            <Notation>{"204"}</Notation>; неподходящие —{" "}
            <Notation>{"00"}</Notation>, <Notation>{"03"}</Notation>,{" "}
            <Notation>{"007"}</Notation>. Значит, число — это либо{" "}
            <Notation>{"0"}</Notation>, либо ненулевая цифра, после которой идёт
            любое количество цифр. Шаблон:
          </Typography.Text>
          <CodeBlock
            code={"number = r'(?:0|[1-9][0-9]*)'"}
            label={"Шаблон"}
            language="python"
          />
          <Typography.Text>
            Разберём: <Notation>{"0"}</Notation> — отдельный ноль;{" "}
            <Notation>{"|"}</Notation> — выбор другого варианта;{" "}
            <Notation>{"[1-9]"}</Notation> — первая ненулевая цифра;{" "}
            <Notation>{"[0-9]*"}</Notation> — остальные цифры, которых может не
            быть; <Notation>{"(?:...)"}</Notation> — объединение вариантов в
            одну группу. Проверим шаблон на числах из списка:
          </Typography.Text>
          <CodeBlock
            code={
              "import re\n\nnumber = r'(?:0|[1-9][0-9]*)'\nfor text in ['0', '5', '10', '204', '00', '03', '007']:\n    print(text, re.fullmatch(number, text) is not None)"
            }
            label={"Проверим шаблон на числах из списка"}
            language="python"
            output={
              "0 True\n5 True\n10 True\n204 True\n00 False\n03 False\n007 False"
            }
          />
        </>
      ),
    },
    {
      id: "shablon-vyrazheniya",
      navLabel: "Шаблон выражения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Выражение — это число, затем ноль или больше повторений «операция
              + число».
            </strong>
          </Typography.Text>
          <Typography.Text>
            Почему так? Выражение начинается числом; между числами ровно одна
            операция; выражение заканчивается числом; соседних операций нет.
            Шаблон:
          </Typography.Text>
          <CodeBlock
            code={"pattern = number + r'(?:[+*]' + number + r')*'"}
            label={"Шаблон"}
            language="python"
          />
          <Typography.Text>
            Внутри <Notation>{"[+*]"}</Notation> символы{" "}
            <Notation>{"+"}</Notation> и <Notation>{"*"}</Notation> обозначают
            сами знаки операций.
          </Typography.Text>
          <Typography.Text>Полный поиск максимальной длины:</Typography.Text>
          <CodeBlock
            code={
              "import re\n\ns = '03+5**7+0*12'\nnumber = r'(?:0|[1-9][0-9]*)'\npattern = number + r'(?:[+*]' + number + r')*'\n\nbest = 0\n\nfor match in re.finditer(pattern, s):\n    best = max(best, match.end() - match.start())\n\nprint(best)"
            }
            label={"Полный поиск максимальной длины"}
            language="python"
            output={"6"}
          />
          <Typography.Text>
            Самый длинный подходящий фрагмент — <Notation>{"7+0*12"}</Notation>,
            длина <Notation>{"6"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.stringMatches0357012_0190901909}
            caption={
              <>
                finditer находит 0, 3+5 и 7+0*12: ведущий ноль 03 обрывает
                первое совпадение на нуле, два знака ** — второе.
              </>
            }
          />
          <Typography.Text>
            Заметь: наличие <Notation>{"03"}</Notation> в исходной строке не
            запрещает начать подходящий фрагмент с символа{" "}
            <Notation>{"3"}</Notation>. Мы ищем подстроку, а не обязательно
            используем всю соседнюю группу цифр. Если по условию нужно брать
            только целые группы цифр, ограниченные другими символами, это уже
            дополнительное требование к границам.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Вычислять значение выражения для поиска его длины не нужно.
            </strong>{" "}
            Здесь проверяется структура записи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "shablon-po-usloviyu",
      navLabel: "Шаблон по условию",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Шаблон числа и знаков меняют по условию задачи, а не по привычке.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если условие разрешает только некоторые цифры или накладывает особые
            ограничения на ноль, шаблон числа нужно изменить. Например, запрет
            ведущих нулей и запрет знака операции рядом с любой цифрой{" "}
            <Notation>{"0"}</Notation> — разные условия. Выбери условие:
          </Typography.Text>
          <VariantPicker
            label={"Условие задачи и как меняется шаблон"}
            variants={[
              {
                label: "цифры 0, 6, 7, 8, 9",
                value: (
                  <>
                    <Notation>{"(?:0|[6-9][06-9]*)"}</Notation>
                  </>
                ),
                note: <>в наборах — только разрешённые цифры</>,
              },
              {
                label: "знаки − и *",
                value: (
                  <>
                    <Notation>{"[-*]"}</Notation> вместо{" "}
                    <Notation>{"[+*]"}</Notation>
                  </>
                ),
                note: (
                  <>минус ставят в наборе первым, иначе он означает диапазон</>
                ),
              },
              {
                label: "числа натуральные",
                value: (
                  <>
                    <Notation>{"[1-9][0-9]*"}</Notation>
                  </>
                ),
                note: (
                  <>отдельного числа 0 нет, ноль бывает только внутри числа</>
                ),
              },
              {
                label: "перед выражением буква A",
                value: (
                  <>
                    <Notation>{"'A' + pattern"}</Notation>
                  </>
                ),
                note: <>буква входит в длину найденного фрагмента</>,
              },
            ]}
          />
          <Typography.Text>
            Например, фрагмент «буква <Notation>{"A"}</Notation>, за которой
            следует корректное выражение со знаками <Notation>{"−"}</Notation> и{" "}
            <Notation>{"*"}</Notation>»:
          </Typography.Text>
          <CodeBlock
            code={
              "import re\n\ns = 'BA12*3-04A7-0*5'\nnumber = r'(?:0|[1-9][0-9]*)'\npattern = 'A' + number + r'(?:[-*]' + number + r')*'\n\nbest = 0\nfor match in re.finditer(pattern, s):\n    print(match.group())\n    best = max(best, match.end() - match.start())\n\nprint(best)"
            }
            label={
              "Например, фрагмент «буква A, за которой следует корректное выражение со знаками − и *»"
            }
            language="python"
            output={"A12*3-0\nA7-0*5\n7"}
          />
          <Typography.Text>
            Число <Notation>{"04"}</Notation> с ведущим нулём обрывает первое
            выражение на нуле: <Notation>{"0"}</Notation> — допустимое число, а{" "}
            <Notation>{"4"}</Notation> уже не может продолжить его.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapis-v-sisteme",
      navLabel: "Запись в системе счисления",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Число в задаче может означать либо запись в системе счисления,
              либо целую группу цифр с заданными границами.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Это разные модели. Если ищется запись числа в основании{" "}
            <Notation>{"14"}</Notation>, допустимы символы{" "}
            <Notation>{"0123456789ABCD"}</Notation>. Буквы{" "}
            <Notation>{"E"}</Notation>, <Notation>{"F"}</Notation>, … разрывают
            такую запись.
          </Typography.Text>
          <Typography.Text>
            Если ищется самая длинная запись, которая может быть числом в
            основании 24, допустимы цифры <Notation>{"0"}</Notation>–
            <Notation>{"9"}</Notation> и буквы <Notation>{"A"}</Notation>–
            <Notation>{"N"}</Notation> (24 знака), а число не может начинаться с
            нуля. Это тот же шаблон, что и для числа без ведущих нулей:
          </Typography.Text>
          <CodeBlock
            code={
              "import re\n\ns = '00A1NZ0FM3K'\nbest = 0\nfor match in re.finditer(r'[1-9A-N][0-9A-N]*', s):\n    best = max(best, match.end() - match.start())\n\nprint(best)"
            }
            label={"Это тот же шаблон, что и для числа без ведущих нулей"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            Подходят <Notation>{"A1N"}</Notation> и{" "}
            <Notation>{"FM3K"}</Notation>: <Notation>{"Z"}</Notation> — не цифра
            основания 24, а ноль перед <Notation>{"F"}</Notation> не может быть
            первым.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vedushchie-nuli",
      navLabel: "Ведущие нули",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если ищется максимальное числовое значение, сначала нужно
              разобраться с ведущими нулями.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, у записи <Notation>{"00099"}</Notation> больше символов,
            чем у <Notation>{"100"}</Notation>, но второе число больше. После
            удаления незначащих ведущих нулей:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Любое положительное число с большим количеством цифр в одной
              системе счисления больше любого числа с меньшим количеством цифр.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            При одинаковой длине сравниваются цифры слева направо. Для
            стандартной записи цифрами <Notation>{"0–9"}</Notation>, затем
            заглавными буквами <Notation>{"A–Z"}</Notation>, порядок символов
            соответствует порядку значений цифр.
          </Typography.Text>
          <ProofDisclosure summary="Почему более длинная запись всегда больше">
            <Typography.Text>
              Для основания b наименьшее положительное L-значное число — bᴸ⁻¹
              (единица и L − 1 нулей), а наибольшее число с L − 1 цифрами — bᴸ⁻¹
              − 1. Первое больше второго на единицу.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <strong>
              Чётность по последней цифре определяется только в чётном
              основании.
            </strong>{" "}
            В основании <Notation>{"14"}</Notation> число чётное, если последняя
            цифра имеет чётное значение: <Notation>{"0 2 4 6 8 A C"}</Notation>,
            потому что <Notation>{"A = 10"}</Notation>,{" "}
            <Notation>{"C = 12"}</Notation>. В нечётном основании правило
            другое: все степени основания нечётны, поэтому чётность зависит от
            суммы значений цифр.
          </Typography.Text>
          <Typography.Text>
            Если в допустимом блоке ищется максимальное чётное число в чётном
            основании, обычно выгодно:
          </Typography.Text>
          <ol>
            <li>убрать незначащие нули слева;</li>
            <li>закончить на самой правой допустимой чётной цифре;</li>
            <li>сравнить получившийся кандидат с другими.</li>
          </ol>
          <Typography.Text>
            Случай числа <Notation>{"0"}</Notation> рассматривается отдельно:
            после удаления ведущих нулей запись не должна ошибочно превратиться
            в «несуществующее число». Кандидатов удобно сравнивать парой (длина,
            запись): сначала по длине, при равной длине — по символам слева
            направо.
          </Typography.Text>
          <CodeBlock
            code={
              "import re\n\ns = 'Z0090B3X1C47DE0A5'\ndigits = '0123456789ABCD'\nbest = ''\n\nfor match in re.finditer('[0-9A-D]+', s):\n    block = match.group().lstrip('0')\n    end = -1\n    for i in range(len(block)):\n        if digits.index(block[i]) % 2 == 0:\n            end = i\n    if end >= 0:\n        candidate = block[:end + 1]\n    elif '0' in match.group():\n        candidate = '0'\n    else:\n        candidate = ''\n    if (len(candidate), candidate) > (len(best), best):\n        best = candidate\n\nprint(best, len(best))"
            }
            label={"Код на Python: import re"}
            language="python"
            output={"1C4 3"}
          />
          <Typography.Text>
            Блоки здесь — <Notation>{"0090B3"}</Notation>,{" "}
            <Notation>{"1C47D"}</Notation> и <Notation>{"0A5"}</Notation>. Из
            первого остаётся <Notation>{"90"}</Notation>: после нуля чётных цифр
            нет; из второго — <Notation>{"1C4"}</Notation>:{" "}
            <Notation>{"7"}</Notation> и <Notation>{"D"}</Notation> нечётные; из
            третьего — <Notation>{"A"}</Notation>. Наибольшее —{" "}
            <Notation>{"1C4"}</Notation>.{" "}
            <Notation>{"digits.index(c)"}</Notation> даёт значение цифры: для{" "}
            <Notation>{"C"}</Notation> это 12.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vyrazheniya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Регулярное выражение описывает структуру; группа{" "}
                    <Notation>{"(?:...)"}</Notation> нужна, чтобы повторялся
                    целый блок.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Число без ведущих нулей —{" "}
                    <Notation>{"(?:0|[1-9][0-9]*)"}</Notation>; выражение —{" "}
                    <Notation>
                      {"number + r'(?:[+*]' + number + r')*'"}
                    </Notation>
                    .
                  </>
                ),
              },
              {
                note: (
                  <>
                    <Notation>{"re.finditer"}</Notation> выдаёт совпадения без
                    перекрытий; длина — <Notation>{"end() - start()"}</Notation>
                    ; самое длинное корректное выражение — максимум по
                    совпадениям.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Цифры, знаки, ноль и буква перед выражением — из условия:
                    шаблон меняется под них.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Запись в основании b — свой набор цифр; большее число —
                    длиннее после удаления ведущих нулей; чётность в чётном
                    основании — по последней цифре.
                  </>
                ),
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
          Какие из строк <Notation>{"0"}</Notation>, <Notation>{"08"}</Notation>
          , <Notation>{"80"}</Notation>, <Notation>{"000"}</Notation>,{" "}
          <Notation>{"105"}</Notation> — записи чисел без ведущих нулей?
        </>
      ),
      reveal: (
        <>
          <Notation>{"0"}</Notation>, <Notation>{"80"}</Notation>,{" "}
          <Notation>{"105"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Что найдёт <Notation>{"re.finditer(r'[0-9]+', s)"}</Notation> в строке{" "}
          <Notation>{"X10Y2025Z3"}</Notation>? Назови совпадения и их длины.
        </>
      ),
      reveal: (
        <>
          <Notation>{"10"}</Notation> (2), <Notation>{"2025"}</Notation> (4),{" "}
          <Notation>{"3"}</Notation> (1).
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Какие из строк <Notation>{"ABBB"}</Notation>,{" "}
          <Notation>{"ABAB"}</Notation>, <Notation>{"AB"}</Notation> целиком
          подходят под шаблон <Notation>{"AB+"}</Notation>, а какие — под{" "}
          <Notation>{"(?:AB)+"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Под <Notation>{"AB+"}</Notation> — <Notation>{"ABBB"}</Notation> и{" "}
          <Notation>{"AB"}</Notation>; под <Notation>{"(?:AB)+"}</Notation> —{" "}
          <Notation>{"ABAB"}</Notation> и <Notation>{"AB"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Какие символы служат цифрами в основании 16? Чётны ли числа{" "}
          <Notation>{"1A3"}</Notation> и <Notation>{"2C"}</Notation> в этом
          основании?
        </>
      ),
      reveal: (
        <>
          <Notation>{"0"}</Notation>–<Notation>{"9"}</Notation> и{" "}
          <Notation>{"A"}</Notation>–<Notation>{"F"}</Notation>.{" "}
          <Notation>{"1A3"}</Notation> нечётно — последняя цифра 3;{" "}
          <Notation>{"2C"}</Notation> чётно — <Notation>{"C"}</Notation> = 12.
        </>
      ),
    },
  ],
};

export default content;
