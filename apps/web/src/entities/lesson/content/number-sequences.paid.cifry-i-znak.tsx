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
import { lessonMedia } from "./number-sequences.paid.cifry-i-znak.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "poslednie-cifry",
      navLabel: "Окончание числа",
      explanation: (
        <>
          <Typography.Text>
            В задаче темы порог — максимальный элемент, оканчивающийся на 25.
            Среди восьми чисел темы так оканчиваются 125, −325 и 2025. Как
            проверить окончание программой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Две последние цифры числа — остаток от деления его модуля на 100:{" "}
              <Notation>{"abs(x) % 100 == 25"}</Notation>.
            </strong>{" "}
            У положительного числа модуль не нужен: 2025 = 20 · 100 + 25, и при
            делении на 100 в остатке остаются две последние цифры. Но у −325
            остаток без модуля другой:
          </Typography.Text>
          <CodeBlock
            code={"print(2025 % 100, -325 % 100, abs(-325) % 100)"}
            label={"Две последние цифры с модулем и без"}
            language="python"
            output={"25 75 25"}
          />
          <Typography.Text>
            Почему −325 % 100 = 75? Python отсчитывает остаток от ближайшего
            кратного 100 слева, а для −325 это −400:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.seqNegmod325_100}
            caption={
              <>
                Остаток — это расстояние от −400 до −325. Две последние цифры
                записи, 25, даёт только модуль: 325 % 100.
              </>
            }
          />
          <Typography.Text>
            Поэтому окончание всегда проверяют у{" "}
            <PythonTerm term="absval">модуля</PythonTerm>. Другие окончания
            проверяют так же — меняется только делитель:
          </Typography.Text>
          <VariantPicker
            label={"Окончание записи и проверка"}
            defaultIndex={1}
            variants={[
              {
                label: "оканчивается на 3",
                value: <Notation>{"abs(x) % 10 == 3"}</Notation>,
              },
              {
                label: "оканчивается на 25",
                value: <Notation>{"abs(x) % 100 == 25"}</Notation>,
              },
              {
                label: "оканчивается на 123",
                value: <Notation>{"abs(x) % 1000 == 123"}</Notation>,
              },
              {
                label: "последние цифры двух чисел совпадают",
                value: <Notation>{"abs(x) % 10 == abs(y) % 10"}</Notation>,
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: окончание 07">
            <Typography.Text>
              Проверка <Notation>{"abs(x) % 100 == 7"}</Notation> выполнена и
              для числа 7. Если нужна запись, которая кончается двумя символами
              07, у числа должно быть хотя бы две цифры:{" "}
              <Notation>{"abs(x) >= 10 and abs(x) % 100 == 7"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "gde-nuzhen-modul",
      navLabel: "Где модуль не нужен",
      explanation: (
        <>
          <Typography.Text>Значит, модуль нужен везде?</Typography.Text>
          <Typography.Text>
            <strong>
              Нет: модуль нужен для цифр записи. Условие про остаток от деления
              проверяют у самого числа.
            </strong>{" "}
            «Остаток от деления числа на 5 равен 2» — это{" "}
            <Notation>{"x % 5 == 2"}</Notation>. Для −8 условие выполнено: −8 =
            (−2) · 5 + 2. А с модулем получится другой остаток:
          </Typography.Text>
          <CodeBlock
            code={"print(-8 % 5, abs(-8) % 5)"}
            label={"Остаток от деления −8 на 5 с модулем и без"}
            language="python"
            output={"2 3"}
          />
          <Typography.Text>
            Проверка делимости тоже обходится без модуля:{" "}
            <Notation>{"-1250 % 25"}</Notation> равно 0, и −1250 кратно 25.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kolichestvo-cifr",
      navLabel: "Количество цифр",
      explanation: (
        <>
          <Typography.Text>
            Как проверить, что число трёхзначное, пятизначное или двузначное?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Количество цифр проверяют границами модуля — так же, как
              четырёхзначные числа в задаче темы.
            </strong>{" "}
            Трёхзначное число по модулю лежит от 100 до 999, и −325 тоже
            трёхзначное:
          </Typography.Text>
          <VariantPicker
            label={"Требование и проверка"}
            defaultIndex={1}
            variants={[
              {
                label: "двузначное",
                value: <Notation>{"10 <= abs(x) <= 99"}</Notation>,
              },
              {
                label: "трёхзначное",
                value: <Notation>{"100 <= abs(x) <= 999"}</Notation>,
              },
              {
                label: "пятизначное",
                value: <Notation>{"10000 <= abs(x) <= 99999"}</Notation>,
              },
              {
                label: "положительное трёхзначное",
                value: <Notation>{"100 <= x <= 999"}</Notation>,
              },
              {
                label: "отрицательное трёхзначное",
                value: <Notation>{"-999 <= x <= -100"}</Notation>,
              },
            ]}
          />
          <Typography.Text>
            Цифры можно посчитать и через текст:{" "}
            <PythonTerm term="str">
              <Notation>{"str"}</Notation>
            </PythonTerm>{" "}
            превращает число в строку, а <Notation>{"len"}</Notation> считает её
            символы. Но у отрицательного числа в строке есть минус:
          </Typography.Text>
          <CodeBlock
            code={"print(len(str(-325)), len(str(abs(-325))))"}
            label={"Количество символов в записи −325"}
            language="python"
            output={"4 3"}
          />
          <Typography.Text>
            Границы короче и не ошибаются на минусе, поэтому в решениях берут
            их.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifra-v-razryade",
      navLabel: "Цифра в разряде",
      explanation: (
        <>
          <Typography.Text>
            А если нужна не последняя цифра, а предпоследняя или первая?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала отбрасывают младшие цифры делением{" "}
              <Notation>{"//"}</Notation>, потом берут последнюю цифру того, что
              осталось.
            </strong>{" "}
            Для −325: модуль 325, 325 // 10 = 32, и последняя цифра 32 — 2. Это
            предпоследняя цифра −325. Первую цифру удобно взять из записи:{" "}
            <Notation>{"str(m)[0]"}</Notation> — первый символ строки.
          </Typography.Text>
          <CodeBlock
            code={"m = abs(-325)\nprint(m % 10, m // 10 % 10, str(m)[0])"}
            label={"Последняя, предпоследняя и первая цифры −325"}
            language="python"
            output={"5 2 3"}
          />
          <Typography.Text>
            Условие «две последние цифры одинаковы» требует, чтобы цифр было
            хотя бы две:{" "}
            <Notation>{"m >= 10 and m % 10 == m // 10 % 10"}</Notation>. Без
            первой проверки подошло бы и число 5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "znak-chisla",
      navLabel: "Знак числа",
      explanation: (
        <>
          <Typography.Text>
            Как проверить «ровно одно число пары отрицательное»?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Ноль не положительный и не отрицательный, поэтому знак проверяют
              сравнением с нулём: <Notation>{"x > 0"}</Notation>,{" "}
              <Notation>{"x < 0"}</Notation>.
            </strong>{" "}
            «Ровно одно отрицательное» — количество из подтемы 3:{" "}
            <Notation>{"int(x < 0) + int(y < 0) == 1"}</Notation>. Пара (−8, 0)
            подходит: отрицательное в ней одно. А проверка{" "}
            <Notation>{"x * y < 0"}</Notation> на ней не выполнена —
            произведение равно нулю:
          </Typography.Text>
          <CodeBlock
            code={
              "x = -8\ny = 0\nprint(int(x < 0) + int(y < 0) == 1, x * y < 0)"
            }
            label={"Ровно одно отрицательное и знак произведения"}
            language="python"
            output={"True False"}
          />
          <Typography.Text>
            <Notation>{"x * y < 0"}</Notation> проверяет другое: одно число
            строго положительное, а другое строго отрицательное.
          </Typography.Text>
          <Typography.Text>
            По знаку произведения трёх чисел нельзя судить и о том, одного ли
            они знака: у −2, −3, 5 произведение положительное. «Все одного
            знака» проверяют так: все три положительные или все три
            отрицательные —{" "}
            <Notation>{"min(x, y, z) > 0 or max(x, y, z) < 0"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifry-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Окончание",
                note: (
                  <>
                    <Notation>{"abs(x) % 100 == 25"}</Notation>;{" "}
                    <Notation>{"-325 % 100"}</Notation> равно 75
                  </>
                ),
              },
              {
                key: "Остаток",
                note: (
                  <>
                    без модуля: «остаток от деления на 5 равен 2» —{" "}
                    <Notation>{"x % 5 == 2"}</Notation>
                  </>
                ),
              },
              {
                key: "Количество цифр",
                note: <Notation>{"100 <= abs(x) <= 999"}</Notation>,
              },
              {
                key: "Цифра в разряде",
                note: (
                  <>
                    предпоследняя — <Notation>{"m // 10 % 10"}</Notation>,
                    первая — <Notation>{"str(m)[0]"}</Notation>
                  </>
                ),
              },
              {
                key: "Знак",
                note: (
                  <>
                    ноль ни положительный, ни отрицательный;{" "}
                    <Notation>{"x * y < 0"}</Notation> — разные знаки
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
          Какие из чисел 25, −125, 250, −1025, 3525 оканчиваются на 25? Что даст
          для них проверка <Notation>{"x % 100 == 25"}</Notation> без модуля?
        </>
      ),
      reveal: (
        <>
          На 25 оканчиваются 25, −125, −1025 и 3525. Без модуля подойдут только
          25 и 3525: <Notation>{"-125 % 100"}</Notation> = 75,{" "}
          <Notation>{"-1025 % 100"}</Notation> = 75.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Для <Notation>{"x = -9"}</Notation> верно ли условие «остаток от
          деления на 4 равен 3»? Что изменится, если ошибочно взять модуль?
        </>
      ),
      reveal: (
        <>
          Верно: −9 = (−3) · 4 + 3, <Notation>{"-9 % 4"}</Notation> равно 3. С
          модулем получится <Notation>{"abs(-9) % 4"}</Notation> = 1, и условие
          станет ложным.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: <>Какие из чисел 99, −100, 999, −1000, 450, −45 трёхзначные?</>,
      reveal: <>−100, 999 и 450.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Найди последнюю, предпоследнюю и первую цифры записи −2048. У каких из
          чисел −455, 1050, 33, 5 две последние цифры одинаковы?
        </>
      ),
      reveal: (
        <>
          Последняя 8, предпоследняя 4, первая 2. Две последние цифры одинаковы
          у −455 и 33; у 5 всего одна цифра.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Пара (−5, 0): в ней ровно одно отрицательное число? Выполнено ли для
          неё <Notation>{"x * y < 0"}</Notation>?
        </>
      ),
      reveal: (
        <>
          Ровно одно отрицательное — да; <Notation>{"x * y < 0"}</Notation> —
          нет: произведение равно 0.
        </>
      ),
    },
  ],
};

export default content;
