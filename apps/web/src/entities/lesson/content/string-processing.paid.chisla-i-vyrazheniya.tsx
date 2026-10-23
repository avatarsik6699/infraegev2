// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./string-processing.paid.chisla-i-vyrazheniya.media";
import { THEME_TASK } from "./string-processing.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "chisla-v-stroke",
      navLabel: "Числа в строке",
      explanation: (
        <>
          <Typography.Text>
            В строке вперемешку буквы, цифры и знаки. Как найти наибольшее
            число, записанное цифрами?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Выделить все группы цифр одной командой{" "}
              <Notation>{"re.findall(r'[0-9]+', s)"}</Notation> и сравнить их
              как числа — через <Notation>{"int"}</Notation>, а не как строки.
            </strong>{" "}
            Модуль <Notation>{"re"}</Notation> работает с{" "}
            <PythonTerm term="regex">регулярными выражениями</PythonTerm> —
            шаблонами текста. Шаблон <Notation>{"[0-9]+"}</Notation> значит
            «одна или больше цифр подряд».
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = 'a23,45bfg24,131kirt16,1fff457.'\nnumbers = re.findall(r'[0-9]+', s)\nprint(numbers)\nprint(max(int(x) for x in numbers))\nprint(max(int(x) for x in numbers if int(x) % 2 == 0))"
            }
            label={"Наибольшее число и наибольшее чётное"}
            language="python"
            output={"['23', '45', '24', '131', '16', '1', '457']\n457\n24"}
          />
          <Typography.Text>
            Как строки, '45' больше '131': строки сравниваются по первому
            символу, и 4 больше 1. Поэтому каждую группу переводим в{" "}
            <Notation>{"int"}</Notation>. Наибольшее чётное — 24: у 457 и 131
            последняя цифра нечётная.
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
            Нужна запись наибольшего чётного 14-ричного числа, а ответ — её
            длина. Цифры такого числа — 0–9 и A, B, C, D. Как её найти?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Разбить строку на блоки 14-ричных цифр. В каждом блоке лучшее
              чётное число — от первой ненулевой цифры до последней чётной.
              Среди блоков больше то число, у которого больше цифр, а при равной
              длине — то, что больше по цифрам слева направо.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Основание 14 чётное, поэтому чётность числа видна по последней
            цифре: чётны 0, 2, 4, 6, 8, A (10) и C (12). Ведущие нули значения
            не меняют — их отбрасывают <Notation>{"lstrip('0')"}</Notation>,
            иначе 00B2 казалось бы длиннее B2.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = 'Z0A31C4F00B21D7'\nbest = ''\nfor block in re.findall(r'[0-9A-D]+', s):\n    block = block.lstrip('0')\n    end = -1\n    for i in range(len(block)):\n        if block[i] in '02468AC':\n            end = i\n    t = block[:end + 1]\n    if len(t) > len(best) or len(t) == len(best) and t > best:\n        best = t\n\nprint(best, len(best))"
            }
            label={"Наибольшее чётное 14-ричное число"}
            language="python"
            output={"A31C4 5"}
          />
          <Typography.Text>
            Блоки — 0A31C4 и 00B21D7: Z и F не 14-ричные цифры. Из первого
            получается A31C4, из второго — только B2: после 2 чётных цифр нет.
            Сравнение строк <Notation>{"t > best"}</Notation> здесь работает:
            цифры 0–9 идут раньше букв A–D, как и их значения.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "shablon-vyrazheniya",
      navLabel: "Шаблон выражения",
      explanation: (
        <>
          <Typography.Text>
            Как найти самое длинное корректное выражение — например, в строке
            03+5**7+0*12?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Описать выражение шаблоном: число, а за ним сколько угодно раз
              «знак, число». <Notation>{"re.finditer"}</Notation> найдёт все
              такие куски слева направо, остаётся взять самый длинный.
            </strong>{" "}
            Вычислять выражения не нужно — проверяется только запись.
          </Typography.Text>
          <Typography.Text>
            Число без ведущих нулей — это либо 0, либо ненулевая цифра и за ней
            любые цифры. Разберём шаблон по частям:
          </Typography.Text>
          <LessonTable
            label={"Части шаблона выражения"}
            columns={[{ label: "Часть" }, { label: "Что значит" }]}
            rows={[
              ["[1-9]", "одна цифра от 1 до 9"],
              ["[0-9]*", "любые цифры, в том числе ни одной"],
              ["0|[1-9][0-9]*", "либо 0, либо число без ведущего нуля"],
              ["(?:…)", "скобки: объединяют части, ничего не запоминая"],
              ["[+*]", "один знак: + или *"],
              ["(?:[+*]число)*", "«знак, число» — ноль или больше раз"],
            ]}
          />
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = '03+5**7+0*12'\nnumber = r'(?:0|[1-9][0-9]*)'\npattern = number + r'(?:[+*]' + number + r')*'\nfor m in re.finditer(pattern, s):\n    print(m.group())"
            }
            label={"Все корректные выражения в строке"}
            language="python"
            output={"0\n3+5\n7+0*12"}
          />
          <Typography.Text>
            Ноль не может начинать число, поэтому первое выражение — просто 0, а
            следующее начинается с 3. Два знака подряд обрывают 3+5. Самое
            длинное — 7+0*12, 6 символов.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.matchesExpression}
            caption={
              <>
                finditer находит 0, 3+5 и 7+0*12: ведущий ноль 03 обрывает
                первое совпадение на нуле, два знака ** — второе.
              </>
            }
          />
          <Typography.Text>
            Шаблон меняют по условию. Знаки − и * — это{" "}
            <Notation>{"[-*]"}</Notation>; если нуля в выражении быть не может,
            число — <Notation>{"[1-9][0-9]*"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы",
      explanation: (
        <>
          <Typography.Text>Решим задачу темы целиком:</Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Это ровно шаблон из прошлого раздела: числа без ведущих нулей,
              знаки + и *. Читаем строку из файла и берём самое длинное
              совпадение.
            </strong>{" "}
            Файл 24-6.txt приложен к задаче темы в практике этой подтемы.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "import re\n\ns = open('24-6.txt').readline().strip()\nnumber = r'(?:0|[1-9][0-9]*)'\npattern = number + r'(?:[+*]' + number + r')*'\nprint(max(len(m.group()) for m in re.finditer(pattern, s)))"
            }
            label={"Задача темы"}
            language="python"
            output={"172"}
          />
          <Typography.Text>
            Ответ — <strong>172</strong>. Программа проходит 200 000 символов
            файла за доли секунды.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Почему finditer не пропускает самое длинное выражение"
          >
            <Typography.Text>
              finditer берёт совпадения без перекрытий: найдя кусок, ищет дальше
              с его конца. Может ли лучшее выражение начинаться внутри уже
              найденного куска и выходить за его конец? Нет. Найденный кусок
              оборвался, потому что дальше запись не продолжается: два знака
              подряд, знак в конце, цифра после одиночного 0 или посторонний
              символ. Выражение, начатое внутри куска, упрётся в то же место —
              значит, оно не длиннее найденного.
            </Typography.Text>
          </ProofDisclosure>
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
                key: "Все числа",
                note: <Notation>{"re.findall(r'[0-9]+', s)"}</Notation>,
              },
              { key: "Сравнение", note: <>через int, не как строки</> },
              {
                key: "Система счисления",
                note: <>блоки цифр, без ведущих нулей, длина, потом цифры</>,
              },
              {
                key: "Число без ведущих нулей",
                note: <Notation>{"(?:0|[1-9][0-9]*)"}</Notation>,
              },
              {
                key: "Выражение",
                note: <>число + «знак, число» сколько угодно раз</>,
              },
              {
                key: "Ответ",
                note: <>max длины по re.finditer; задача темы — 172</>,
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
          Почему <Notation>{"max(['45', '131'])"}</Notation> даёт неверный ответ
          на вопрос «какое число больше»?
        </>
      ),
      reveal: (
        <>
          Строки сравниваются по символам слева: '4' больше '1', и '45' окажется
          больше '131'. Числа сравнивают после int.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Какие из записей 0, 007, 10, 05 целиком подходят под шаблон{" "}
          <Notation>{"(?:0|[1-9][0-9]*)"}</Notation>?
        </>
      ),
      reveal: <>0 и 10. В 007 и 05 ведущие нули.</>,
    },
    {
      id: "zadacha-3",
      prompt: <>Почему в строке 03+5 корректное выражение — 3+5, а не 03+5?</>,
      reveal: (
        <>
          03 — число с ведущим нулём, его нет в шаблоне. Но подстрока 3+5
          корректна, и finditer найдёт её после одиночного 0.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Какое самое длинное корректное выражение с + и * в строке
          5+*12+0*07+3?
        </>
      ),
      reveal: (
        <>
          12+0*0, 6 символов: после 0 цифра 7 продолжить число не может.
          Остальные совпадения — 5 и 7+3.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: <>Чётно ли 14-ричное число 3B? А 3C?</>,
      reveal: (
        <>
          3B нечётно: B = 11. 3C чётно: C = 12. Основание 14 чётное, поэтому
          хватает последней цифры.
        </>
      ),
    },
  ],
};

export default content;
