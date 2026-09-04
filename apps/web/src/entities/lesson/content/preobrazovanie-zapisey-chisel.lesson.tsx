import { Callout } from "~/shared/components/callout";
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  Mistake,
  Procedure,
  WorkedExample,
} from "~/shared/components/learning-content";
import { defineLesson } from "../lib/define-lesson";
import { preobrazovanieZapiseyChiselLessonPublication } from "./lesson-publication.mjs";

export const preobrazovanieZapiseyChiselLesson = defineLesson({
  ...preobrazovanieZapiseyChiselLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Различать число, его запись в системе счисления, изменённую запись и результат",
    "Переводить правила приписывания, срезов и замены цифр в точные строковые операции",
    "Повторно вычислять условие по уже изменённой записи, когда этого требует алгоритм",
    "Исполнять ветвящиеся преобразования в двоичной и троичной системах",
    "Выбирать безопасный поиск минимума или максимума и обосновывать границы перебора",
  ],
  practiceTaskIds: [
    "preobrazovanie-zapisey-appending",
    "preobrazovanie-zapisey-parity",
    "preobrazovanie-zapisey-base-three",
    "preobrazovanie-zapisey-digit-replacement",
    "preobrazovanie-zapisey-non-monotonic-maximum",
  ],
  accessTier: "free",
  theory: [
    {
      id: "four-stage-model",
      navLabel: "Четыре стадии алгоритма",
      explanation: (
        <>
          <Typography.Text>
            Этот урок разбирает один подтип задания № 5: алгоритм получает
            натуральное число <Notation kind="formula">N</Notation>, строит его
            запись в заданной системе счисления, изменяет цифры и получает число{" "}
            <Notation kind="formula">R</Notation>. Другие формы задания № 5
            могут использовать иных исполнителей — здесь мы не пытаемся охватить
            их все.
          </Typography.Text>
          <Typography.Text>
            Внутри такого алгоритма число временно становится строкой цифр.
            Правила работают именно со строкой, а затем результат снова
            интерпретируется как число. Поэтому на черновике разделяйте исходное
            число, его запись, изменённую запись и итоговое число.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Разделите преобразование 13 → 1101 → 110111 → 55 на стадии"
          prompt="Каждая стрелка означает отдельную операцию и отдельное представление данных."
          steps={[
            <>
              <Notation kind="formula">13₁₀</Notation> — исходное число
              <Notation kind="formula"> N</Notation>.
            </>,
            <>
              <Notation kind="formula">1101₂</Notation> — двоичная запись того
              же числа.
            </>,
            <>
              <Notation kind="formula">110111₂</Notation> — новая строка,
              полученная по правилу алгоритма.
            </>,
            <>
              <Notation kind="formula">55₁₀</Notation> — десятичное значение
              изменённой строки, то есть <Notation kind="formula">R</Notation>.
            </>,
          ]}
        />
      ),
    },
    {
      id: "number-and-representation",
      navLabel: "Число и его запись",
      explanation: (
        <>
          <Typography.Text>
            Одно количество можно записать по-разному:
            <Notation kind="formula"> 13₁₀ = 1101₂ = 111₃</Notation>. Нижний
            индекс сообщает основание системы.
          </Typography.Text>
          <Typography.Text>
            <Notation kind="formula">
              1101₂ = 1·2³ + 1·2² + 0·2¹ + 1·2⁰ = 13
            </Notation>
            , но
            <Notation kind="formula">
              {" "}
              1101₃ = 1·3³ + 1·3² + 0·3¹ + 1·3⁰ = 37
            </Notation>
            . Одинаковая строка в разных основаниях обозначает разные числа.
          </Typography.Text>
          <Typography.Text>
            В системе с основанием <Notation kind="formula">b</Notation>
            допустимы цифры от нуля до
            <Notation kind="formula"> b − 1</Notation>. Маленькая
            <Notation kind="formula"> b</Notation> обозначает основание, а
            большая <Notation kind="formula">N</Notation> — входное число.
          </Typography.Text>
          <Typography.Text>
            Поэтому алфавиты таковы: в двоичной системе —
            <Notation> 0, 1</Notation>; в троичной —
            <Notation> 0, 1, 2</Notation>; в четверичной —
            <Notation> 0, 1, 2, 3</Notation>; в пятеричной —
            <Notation> 0, 1, 2, 3, 4</Notation>. Механика преобразования одна,
            но основание и допустимые цифры всегда нужно читать из условия.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="Строка 1101 всегда обозначает число 13, потому что выглядит как двоичная."
          explanation={
            <>
              Без основания это только последовательность цифр.
              <Notation kind="formula"> 1101₂ = 13</Notation>, но
              <Notation kind="formula"> 1101₃ = 37</Notation>. При обратном
              переводе основание нужно передать явно:
              <Notation> int(s, base)</Notation>.
            </>
          }
        />
      ),
    },
    {
      id: "five-step-execution",
      navLabel: "Пять шагов исполнения",
      explanation: (
        <>
          <Typography.Text>
            Независимо от основания решение удобно вести по одной схеме. Она не
            заменяет чтение условия, но не даёт смешать число и строку.
          </Typography.Text>
          <Procedure
            title="Как исполнить алгоритм преобразования записи"
            steps={[
              {
                label: "Зафиксируйте N.",
                detail:
                  "Это исходное число и аргумент условий про делимость или чётность самого числа.",
              },
              {
                label: "Получите запись.",
                detail: (
                  <>
                    Переведите <Notation kind="formula">N</Notation> в систему с
                    основанием <Notation kind="formula">b</Notation> и храните
                    цифры строкой.
                  </>
                ),
              },
              {
                label: "Проверьте условие.",
                detail:
                  "Уточните, относится оно к N, к сумме цифр или к текущей записи.",
              },
              {
                label: "Измените строку.",
                detail:
                  "Выполните операции по порядку; повторный шаг видит уже изменённую строку.",
              },
              {
                label: "Получите R.",
                detail: (
                  <>
                    Интерпретируйте итоговую строку в том же основании через
                    <Notation> int(s, b)</Notation>.
                  </>
                ),
              },
            ]}
          />
          <CodeBlock
            code={
              "n = 13\ns = bin(n)[2:]  # убираем только префикс 0b\n\n# Здесь алгоритм изменяет строку s.\n\nr = int(s, 2)"
            }
            label="Граница между числом и строкой"
            language="python"
          />
          <Typography.Text>
            Для <Notation kind="formula">N = 13</Notation> вызов
            <Notation> bin(13)</Notation> возвращает строку
            <Notation> '0b1101'</Notation>. Срез <Notation>[2:]</Notation>
            удаляет только служебный префикс <Notation>0b</Notation>, а не цифры
            числа. После преобразований <Notation>int(s, 2)</Notation>
            читает текущую строку именно как двоичную запись.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "string-operations",
      navLabel: "Строковые операции",
      explanation: (
        <>
          <Typography.Text>
            Приписывание — это склеивание строк:
            <Notation> '1101' + '1' == '11011'</Notation>. Справа пишут
            <Notation> s += '1'</Notation>, слева —
            <Notation> s = '1' + s</Notation>. Порядок меняет результат.
          </Typography.Text>
          <CodeBlock
            code={
              "s = '101101'\n\nlast = s[-1]       # '1'\nlast_two = s[-2:]  # '01'\nfirst_two = s[:2]  # '10'\n\ns += s[-2:]       # дописать две последние цифры\ns = '112' + s[2:]  # заменить первые две цифры\ns = s[1:]          # удалить первую цифру\ns = s[:-1]         # удалить последнюю цифру"
            }
            label="Срезы и приписывание"
            language="python"
          />
          <Typography.Text>
            Индексы начинаются с нуля. Поэтому после первых двух символов
            остаток начинается с <Notation>s[2:]</Notation>, а отрицательные
            индексы считают позиции с конца.
          </Typography.Text>
          <Typography.Text>
            Для строки <Notation>'101101'</Notation> выражения
            <Notation> s[-1]</Notation>, <Notation>s[-2]</Notation>,
            <Notation> s[-2:]</Notation> и <Notation>s[-3:]</Notation> дают
            соответственно <Notation>'1'</Notation>, <Notation>'0'</Notation>,
            <Notation> '01'</Notation> и <Notation>'101'</Notation>. С начала
            строки <Notation>s[0]</Notation>, <Notation>s[:2]</Notation> и
            <Notation> s[:3]</Notation> дают <Notation>'1'</Notation>,
            <Notation> '10'</Notation> и <Notation>'101'</Notation>.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="s + '1' и '1' + s означают одно и то же: к записи добавляется единица."
          explanation="Первый вариант приписывает цифру справа, второй — слева, поэтому меняются разные разряды и получаются разные числа."
        />
      ),
    },
    {
      id: "appending-and-place-value",
      navLabel: "Приписывание и разрядность",
      explanation: (
        <>
          <Typography.Text>
            Приписывание справа — и строковая операция, и разрядный сдвиг. В
            десятичной системе
            <Notation kind="formula"> 375 = 37·10 + 5</Notation>; в двоичной
            <Notation kind="formula"> 11011₂ = 13·2 + 1 = 27</Notation>; в
            троичной <Notation kind="formula">1022₃ = 11·3 + 2 = 35</Notation>.
          </Typography.Text>
          <Typography.Text>
            Для одной цифры
            <Notation kind="formula"> R = N·b + d</Notation>. Для блока из
            <Notation kind="formula"> k</Notation> цифр:
            <Notation kind="formula"> R = N·bᵏ + D</Notation>, где
            <Notation kind="formula"> D</Notation> — значение блока в том же
            основании.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="К записи 102₃ припишите блок 22"
          prompt="Блок занимает два разряда, поэтому исходное значение сдвигается на две позиции."
          steps={[
            <Notation kind="formula">102₃ = 11₁₀</Notation>,
            <Notation kind="formula">22₃ = 2·3 + 2 = 8</Notation>,
            <Notation kind="formula">10222₃ = 11·3² + 8 = 107</Notation>,
          ]}
        />
      ),
    },
    {
      id: "repeated-parity",
      navLabel: "Повторный бит чётности",
      explanation: (
        <>
          <Typography.Text>
            В одном из алгоритмов к двоичной строке дважды дописывают остаток от
            деления суммы её цифр на 2. Он показывает чётность количества
            единиц: нули сумму не меняют.
          </Typography.Text>
          <CodeBlock
            code={
              "s = bin(n)[2:]\n\ns += str(sum(map(int, s)) % 2)\ns += str(sum(map(int, s)) % 2)\n\nr = int(s, 2)"
            }
            label="Два последовательных обновления"
            language="python"
          />
          <Typography.Text>
            Внутри выражения <Notation>map(int, s)</Notation> символы
            <Notation> '1', '1', '0', '1'</Notation> превращаются в числа
            <Notation> 1, 1, 0, 1</Notation>. Их сумма равна трём, а остаток
            <Notation kind="formula">3 mod 2 = 1</Notation>. Поэтому это
            выражение показывает чётность количества единиц: нули сумму не
            меняют.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Исполните алгоритм для N = 13"
          prompt="Вторую сумму считаем после первого изменения строки."
          steps={[
            <>
              <Notation kind="formula">13₁₀ = 1101₂</Notation>; сумма равна
              трём, дописываем <Notation>1</Notation> и получаем
              <Notation> 11011</Notation>.
            </>,
            <>
              У изменённой строки сумма равна четырём, дописываем
              <Notation> 0</Notation> и получаем <Notation>110110</Notation>.
            </>,
            <Notation kind="formula">110110₂ = 32 + 16 + 4 + 2 = 54</Notation>,
          ]}
        />
      ),
      mistake: (
        <Mistake
          claim="Оба дописываемых бита можно один раз вычислить по исходной строке."
          explanation="После первого добавления строка и сумма её цифр меняются. Второй шаг работает с текущей записью, поэтому бит нужно вычислить заново."
        />
      ),
    },
    {
      id: "minimum-search",
      navLabel: "Первый успех и минимум",
      explanation: (
        <>
          <Typography.Text>
            Чтобы найти минимальное <Notation kind="formula">N</Notation> при
            <Notation kind="formula"> R &gt; 100</Notation>, проверяйте
            кандидаты по возрастанию и останавливайтесь на первом успехе.
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(1, 1000):\n    s = bin(n)[2:]\n    s += str(sum(map(int, s)) % 2)\n    s += str(sum(map(int, s)) % 2)\n    r = int(s, 2)\n\n    if r > 100:\n        print(n, r, s)\n        break"
            }
            label="Минимум через упорядоченный перебор"
            language="python"
          />
          <CodeBlock
            code={
              "answers = []\n\nfor n in range(1, 351):\n    s = to_base(n, 3)\n\n    if n % 3 == 0:\n        s = '1' + s + '02'\n    else:\n        digit = str(n % 3)\n        s += digit * 2\n\n    r = int(s, 3)\n    if r <= 350:\n        answers.append(n)\n\nprint(max(answers))"
            }
            label="Полный поиск максимального N при R ≤ 350"
            language="python"
          />
          <Typography.Text>
            Программа выводит <Notation>38</Notation>. Ручная проверка:
            <Notation kind="formula"> 38₁₀ = 1102₃</Notation>, затем ветвь
            «иначе» даёт <Notation>110222₃</Notation>, а его десятичное значение
            равно <Notation kind="formula">350</Notation>.
          </Typography.Text>
          <Typography.Text>
            Вывод — <Notation>25 102 1100110</Notation>. Первое найденное
            <Notation kind="formula"> N</Notation> минимально не из-за
            обязательного роста <Notation kind="formula">R(N)</Notation>, а
            потому что сами кандидаты идут как
            <Notation kind="formula"> 1, 2, 3, …</Notation>.
          </Typography.Text>
        </>
      ),
      mistake: (
        <Mistake
          claim="Первый подходящий N минимален, потому что любое преобразование сохраняет возрастание R."
          explanation="Ветвления и замены могут сделать R(N) немонотонной. Минимум гарантирует возрастающий порядок проверки N и остановка на первом успехе."
        />
      ),
    },
    {
      id: "branched-base-three",
      navLabel: "Ветвление в троичной системе",
      explanation: (
        <>
          <Typography.Text>
            Пусть к троичной записи числа, кратного трём, приписывают слева
            <Notation> 1</Notation>, а справа <Notation>02</Notation>. Для
            остальных чисел справа дважды приписывают
            <Notation kind="formula"> N mod 3</Notation>. Условие относится к
            самому <Notation kind="formula">N</Notation>, не к сумме цифр.
          </Typography.Text>
          <CodeBlock
            code={
              "def to_base(n, base):\n    digits = ''\n\n    while n > 0:\n        digits = str(n % base) + digits\n        n //= base\n\n    return digits or '0'"
            }
            label="Перевод в произвольную систему"
            language="python"
          />
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Сравните соседние N = 11 и N = 12"
          prompt="Соседние числа попадают в разные ветви и дают результаты разного масштаба."
          steps={[
            <>
              <Notation kind="formula">11₁₀ = 102₃</Notation>, остаток равен
              двум: <Notation>102 → 10222</Notation>,
              <Notation kind="formula"> R = 107</Notation>.
            </>,
            <>
              <Notation kind="formula">12₁₀ = 110₃</Notation> и делится на три:
              <Notation> 110 → 111002</Notation>,
              <Notation kind="formula"> R = 353</Notation>.
            </>,
            <>
              Для <Notation kind="formula">N = 13</Notation> снова работает
              ветвь «иначе», и <Notation kind="formula">R = 121</Notation> —
              результат уменьшился.
            </>,
          ]}
        />
      ),
    },
    {
      id: "safe-search-bounds",
      navLabel: "Безопасный поиск максимума",
      explanation: (
        <>
          <Typography.Text>
            При поиске максимального <Notation kind="formula">N</Notation>
            первая неудача ничего не доказывает: разные ветви могут вернуть
            меньшее <Notation kind="formula">R</Notation> для следующего числа.
            Проверьте весь обоснованный диапазон и примените
            <Notation> max()</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если алгоритм только приписывает цифры, то
            <Notation kind="formula"> R ≥ N</Notation>. При условии
            <Notation kind="formula"> R ≤ 500</Notation> достаточно проверить
            <Notation kind="formula"> 1 ≤ N ≤ 500</Notation>. При удалении или
            замене цифр это обоснование может не работать.
          </Typography.Text>
          <Typography.Text>
            Конкретно здесь соседние результаты равны
            <Notation kind="formula"> R(11) = 107</Notation>,
            <Notation kind="formula"> R(12) = 353</Notation> и
            <Notation kind="formula"> R(13) = 121</Notation>. После первой
            неудачи результат снова становится допустимым. Если алгоритм удаляет
            цифры, заменяет большие цифры меньшими или отбрасывает часть записи,
            возможно <Notation kind="formula">R &lt; N</Notation>; тогда границу
            нужно выводить из других свойств условия.
          </Typography.Text>
          <CodeBlock
            code={
              "answers = []\n\nfor n in range(1, 501):\n    s = to_base(n, 3)\n\n    if n % 3 == 0:\n        s = '1' + s + '02'\n    else:\n        s += str(n % 3) * 2\n\n    r = int(s, 3)\n    if r <= 500:\n        answers.append(n)\n\nprint(max(answers))"
            }
            label="Максимум при двух ветвях"
            language="python"
          />
        </>
      ),
      mistake: (
        <Mistake
          claim="После первого R > 500 все следующие N можно не проверять."
          explanation="Это допустимо только после доказательства монотонности. Здесь соседние числа попадают в разные ветви, и R после скачка может уменьшиться."
        />
      ),
    },
    {
      id: "simultaneous-replacement",
      navLabel: "Одновременная замена",
      explanation: (
        <>
          <Typography.Text>
            Если нужно одновременно заменить <Notation>0 → 2</Notation>,
            <Notation> 2 → 0</Notation>, а <Notation>1</Notation> оставить,
            каждая новая цифра должна зависеть от одной исходной. Два
            последовательных <Notation>replace</Notation> повторно изменят уже
            полученные символы.
          </Typography.Text>
          <CodeBlock
            code={
              "# Неверно: второй replace затронет и новые двойки.\ns = s.replace('0', '2').replace('2', '0')\n\n# Верно: каждый исходный символ рассматривается один раз.\ns = ''.join(\n    '2' if digit == '0'\n    else '0' if digit == '2'\n    else '1'\n    for digit in s\n)\n\n# Вместо блока выше можно использовать таблицу соответствия:\n# s = s.translate(str.maketrans('012', '210'))\n\ns = s.lstrip('0') or '0'\nr = int(s, 3)"
            }
            label="Одновременная замена и ведущие нули"
            language="python"
          />
          <Typography.Text>
            <Notation>s.lstrip('0') or '0'</Notation> удаляет ведущие нули, но
            сохраняет корректную строку <Notation>'0'</Notation>, если других
            цифр не осталось.
          </Typography.Text>
          <Typography.Text>
            Например, одновременная замена превращает
            <Notation> 10220</Notation> в <Notation>12002</Notation>: каждая
            новая цифра получена из соответствующей исходной цифры, а не из
            промежуточной строки.
          </Typography.Text>
        </>
      ),
      workedExample: (
        <WorkedExample
          title="Преобразуйте N = 20"
          prompt="Сначала сопоставим все исходные цифры, затем удалим ведущий ноль."
          steps={[
            <Notation kind="formula">20₁₀ = 202₃</Notation>,
            <>
              Одновременная замена даёт <Notation>020</Notation>.
            </>,
            <>
              После удаления ведущего нуля остаётся
              <Notation kind="formula"> 20₃ = 6</Notation>.
            </>,
          ]}
        />
      ),
    },
    {
      id: "digit-sum-and-general-template",
      navLabel: "Универсальный шаблон",
      explanation: (
        <>
          <Typography.Text>
            Всегда уточняйте, в какой записи считается сумма цифр. Для
            <Notation kind="formula"> N = 14</Notation> сумма десятичных цифр
            равна пяти, а троичная запись
            <Notation kind="formula"> 112₃</Notation> имеет сумму четыре.
          </Typography.Text>
          <Typography.Text>
            Условия <Notation>n % 3 == 0</Notation> и
            <Notation> sum(map(int, s)) % 3 == 0</Notation> нельзя подменять:
            первое проверяет делимость самого числа, второе — делимость суммы
            цифр его текущей записи. Даже когда признак делимости связывает эти
            свойства, исполняйте буквально данное условие.
          </Typography.Text>
          <CodeBlock
            code={
              "def to_base(n, base):\n    digits = ''\n    while n > 0:\n        digits = str(n % base) + digits\n        n //= base\n    return digits or '0'\n\nanswers = []\n\nfor n in range(1, 10000):\n    s = to_base(n, 3)\n\n    if CONDITION:\n        s = TRANSFORMATION_1\n    else:\n        s = TRANSFORMATION_2\n\n    r = int(s, 3)\n\n    if RESULT_CONDITION:\n        answers.append((n, r))"
            }
            label="Каркас полного перебора"
            language="python"
          />
          <Typography.Text>
            В конце извлекайте ровно то, что спрашивают:
            <Notation> min(n for n, r in answers)</Notation>,
            <Notation> max(n for n, r in answers)</Notation>,
            <Notation> min(r for n, r in answers)</Notation> или
            <Notation> max(r for n, r in answers)</Notation>. Минимальное
            <Notation kind="formula"> N</Notation> и минимальное
            <Notation kind="formula"> R</Notation> — разные вопросы.
          </Typography.Text>
          <Callout tone="idea" title="Переводите формулировку буквально">
            <Notation>n % 2 == 0</Notation> проверяет чётность числа,
            <Notation> sum(map(int, s)) % 2 == 0</Notation> — чётность суммы
            цифр, <Notation>s.count('1') % 2 == 0</Notation> — чётность
            количества единиц. Похожие фразы задают разные операции.
          </Callout>
          <CodeBlock
            code={
              "N чётно                         n % 2 == 0\nN кратно 3                      n % 3 == 0\nсумма цифр чётна                sum(map(int, s)) % 2 == 0\nколичество единиц чётно         s.count('1') % 2 == 0\nдописать 10 справа              s += '10'\nприписать 2 слева               s = '2' + s\nдописать последнюю цифру        s += s[-1]\nдописать две последние цифры    s += s[-2:]\nудалить последнюю цифру         s = s[:-1]\nзаменить первую цифру на 12     s = '12' + s[1:]\nзаменить две первые на 112      s = '112' + s[2:]"
            }
            label="Типичные формулировки и точные операции"
            language="text"
          />
        </>
      ),
    },
    {
      id: "final-solution-algorithm",
      navLabel: "Итоговый алгоритм",
      explanation: (
        <Procedure
          title="Полная последовательность решения"
          steps={[
            {
              label: "Разведите четыре объекта.",
              detail:
                "Отдельно выпишите N, исходную запись, изменённую запись и R.",
            },
            {
              label: "Зафиксируйте систему.",
              detail: "Отметьте основание и алфавит допустимых цифр.",
            },
            {
              label: "Получите строку.",
              detail:
                "Переведите N в нужное основание и удалите только служебный префикс.",
            },
            {
              label: "Исполните правила по порядку.",
              detail: "Не переставляйте проверки и строковые операции.",
            },
            {
              label: "Используйте текущее состояние.",
              detail:
                "При повторении шага считайте условие по уже изменённой строке.",
            },
            {
              label: "Вычислите R.",
              detail: "Интерпретируйте итог через int(s, base).",
            },
            {
              label: "Прочитайте финальный запрос.",
              detail: "Различайте N и R, минимум и максимум.",
            },
            {
              label: "Не обрывайте поиск максимума.",
              detail:
                "При ветвлении первая неудача не завершает перебор без доказанной монотонности.",
            },
            {
              label: "Обоснуйте границы.",
              detail: "Свяжите диапазон N с преобразованием и условием на R.",
            },
            {
              label: "Проверьте вручную.",
              detail:
                "Исполните алгоритм для найденного кандидата и соседнего граничного значения.",
            },
          ]}
        />
      ),
    },
  ],
  examFocus: (
    <>
      <Typography.Text>
        На экзамене сначала выпишите
        <Notation kind="formula"> N → запись → изменённая запись → R</Notation>,
        затем отметьте основание системы. Это предотвращает арифметику над
        строкой, проверку не той величины и перевод в неверном основании.
      </Typography.Text>
      <Typography.Text>
        При повторе используйте текущее состояние строки. Для минимума первый
        успех в возрастающем переборе достаточен. Для максимума при ветвлении
        проверяйте весь обоснованный диапазон. Свяжите границу перебора с
        условием на <Notation kind="formula">R</Notation> и с тем, может ли
        преобразование уменьшать число.
      </Typography.Text>
    </>
  ),
  checkpoint: [
    {
      id: "checkpoint-final-algorithm",
      prompt:
        "Какие четыре значения нужно развести на черновике до написания программы?",
      reveal: (
        <>
          Исходное <Notation kind="formula">N</Notation>, запись
          <Notation kind="formula"> N</Notation> в системе с основанием
          <Notation kind="formula"> b</Notation>, изменённую запись и десятичный
          результат <Notation kind="formula">R</Notation>.
        </>
      ),
    },
    {
      id: "checkpoint-final-extremum",
      prompt:
        "Когда можно завершить перебор на первом успехе, а когда нужен полный диапазон?",
      reveal: (
        <>
          Первый успех даёт минимальное <Notation kind="formula">N</Notation>,
          если кандидаты идут по возрастанию. Для максимума при ветвлении нужен
          весь обоснованный диапазон, если монотонность
          <Notation kind="formula"> R(N)</Notation> не доказана.
        </>
      ),
    },
    {
      id: "checkpoint-same-digits",
      prompt: (
        <>
          Одинаковы ли числа <Notation kind="formula">101₂</Notation> и
          <Notation kind="formula"> 101₃</Notation>?
        </>
      ),
      reveal: (
        <>
          Нет. <Notation kind="formula">101₂ = 5</Notation>, а
          <Notation kind="formula"> 101₃ = 10</Notation>. Совпадает строка, но
          не разрядные веса.
        </>
      ),
    },
    {
      id: "checkpoint-string-slice",
      prompt: (
        <>
          Что вернёт <Notation>'101101'[-2:]</Notation> и с какой стороны блок
          окажется после <Notation>s += s[-2:]</Notation>?
        </>
      ),
      reveal: (
        <>
          Срез вернёт <Notation>'01'</Notation>; операция допишет его справа и
          даст <Notation>'10110101'</Notation>.
        </>
      ),
    },
    {
      id: "checkpoint-parity-state",
      prompt: (
        <>
          К строке <Notation>101</Notation> дописали бит чётности. По какой
          строке считать следующий бит?
        </>
      ),
      reveal: (
        <>
          Сначала получается <Notation>1010</Notation>. Следующий бит вычисляют
          уже по <Notation>1010</Notation>.
        </>
      ),
    },
    {
      id: "checkpoint-safe-bound",
      prompt: (
        <>
          Почему <Notation kind="formula">R ≤ 500</Notation> ограничивает
          <Notation kind="formula"> N</Notation> числом 500, если алгоритм
          только приписывает цифры?
        </>
      ),
      reveal: (
        <>
          Приписывание не уменьшает исходное значение:
          <Notation kind="formula"> R ≥ N</Notation>. Если
          <Notation kind="formula"> N &gt; 500</Notation>, то и
          <Notation kind="formula"> R &gt; 500</Notation>.
        </>
      ),
    },
    {
      id: "checkpoint-branch-condition",
      prompt: (
        <>
          Если сказано «<Notation kind="formula">N</Notation> делится на 3»,
          можно ли проверять сумму цифр строки <Notation>s</Notation>?
        </>
      ),
      reveal: (
        <>
          Нужно буквально <Notation>n % 3 == 0</Notation>. Условие про сумму
          цифр записывалось бы отдельно:
          <Notation> sum(map(int, s)) % 3 == 0</Notation>.
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        В этом подтипе задания № 5 главное — строгая смена представлений:
        сначала число <Notation kind="formula">N</Notation>, затем строка его
        цифр, новая строка и только после обратного перевода — число
        <Notation kind="formula"> R</Notation>.
      </Typography.Text>
      <Typography.Text>
        Надёжное решение буквально исполняет условие, пересчитывает повторные
        шаги по текущей строке, различает свойства числа и записи и связывает
        способ поиска с тем, нужен минимум или максимум. Проверяйте найденный
        ответ вручную на граничном примере.
      </Typography.Text>
    </>
  ),
});
