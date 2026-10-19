// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./divisors-and-masks.paid.prostye-i-razlozhenie.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "prostye-ideya",
      navLabel: "Главная идея",
      explanation: (
        <>
          <Typography.Text>
            Главная идея подтемы:{" "}
            <strong>
              каждое число больше 1 раскладывается на простые множители, и по
              этому разложению сразу видны все его простые делители
            </strong>
            . Это самый частый приём в задачах 2025–2026 годов: он нужен в 16 из
            27 задач этих лет, в том числе в задачах основной волны ЕГЭ-2026.
          </Typography.Text>
          <Typography.Text>
            Функцию <Notation>{"get_divisors"}</Notation> из подтемы 2 считаем
            определённой выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "prostye-chisla",
      navLabel: "Простые числа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Простые числа нужны тогда, когда условие говорит именно о простых
              делителях или простых множителях.
            </strong>{" "}
            Дадим точное определение.
          </Typography.Text>
          <Typography.Text>
            <strong>Простое число</strong> — натуральное число больше 1, имеющее
            ровно два натуральных делителя: 1 и само число. Например, 2, 3, 5,
            7, 11, 13, 17. <strong>Составное число</strong> — натуральное число
            больше 1, у которого есть делитель, отличный от 1 и самого числа:
            так, 12 делится на 2, 3, 4 и 6. Число 1 ни простое, ни составное — у
            него только один натуральный делитель.
          </Typography.Text>
          <Typography.Text>
            Чтобы проверить простоту, не обязательно искать все делители.
            Достаточно попытаться найти хотя бы один делитель между 2 и √n: если
            число составное, оно раскладывается в произведение двух чисел больше
            1, и хотя бы одно из них не превосходит корня — это уже доказанное
            свойство пар делителей.
          </Typography.Text>
          <CodeBlock
            code={
              "def is_prime(n):\n    if n < 2:\n        return False\n\n    for d in range(2, isqrt(n) + 1):\n        if n % d == 0:\n            return False\n\n    return True"
            }
            label={"Код на Python: def is_prime(n):"}
            language="python"
          />
          <Typography.Text>
            Числа меньше 2 не простые. Если найден хотя бы один делитель, число
            составное. А <Notation>{"return True"}</Notation> стоит после цикла:
            после одной неудачной попытки деления ещё нельзя объявлять число
            простым. Например, 25 не делится на 2, но делится на 5 — ответ
            «простое» сразу после проверки 2 был бы ошибкой.
          </Typography.Text>
          <CodeBlock
            code={"print(is_prime(1), is_prime(2), is_prime(49), is_prime(97))"}
            label={
              "Код на Python: print(is_prime(1), is_prime(2), is_prime(49), is_prime(97))"
            }
            language="python"
            output={"False True False True"}
          />
          <Typography.Text>
            У 2 цикл не выполнится ни разу: между 2 и{" "}
            <Notation>{"isqrt(2)"}</Notation> нет проверяемых чисел. После
            предварительной проверки <Notation>{"n < 2"}</Notation> это
            нормальная ситуация, и функция вернёт <Notation>{"True"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Теперь можно найти простые делители — отобрать среди всех делителей
            простые:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 84\nD = get_divisors(n)\n\nprime_divisors = []\n\nfor d in D:\n    if is_prime(d):\n        prime_divisors.append(d)\n\nprint(prime_divisors)"
            }
            label={
              "Теперь можно найти простые делители — отобрать среди всех делителей простые"
            }
            language="python"
            output={"[2, 3, 7]"}
          />
          <Typography.Text>
            Такой способ понятен, но если требуются только простые делители,
            удобнее использовать разложение на простые множители.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razlozhenie",
      navLabel: "Разложение на множители",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разложение на простые множители показывает, из каких простых чисел
              составлено исходное число.
            </strong>{" "}
            Это не то же самое, что список всех его делителей.
          </Typography.Text>
          <Typography.Text>
            Например, 72 = 2 · 2 · 2 · 3 · 3. Одинаковые множители можно
            объединить в степени: 72 = 2³ · 3² — двойка встречается три раза,
            тройка два. Для одного и того же числа легко перепутать три разных
            объекта. Выберите, о чём спрашивает условие:
          </Typography.Text>
          <VariantPicker
            label={"Три разных объекта для числа 72"}
            variants={[
              {
                label: "все натуральные делители",
                value: <>1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72</>,
                note: <>их 12</>,
              },
              {
                label: "различные простые делители",
                value: <>2, 3</>,
                note: <>их 2</>,
              },
              {
                label: "простые множители с повторениями",
                value: <>2, 2, 2, 3, 3</>,
                note: <>их 5</>,
              },
            ]}
          />
          <Typography.Text>
            Эти количества — 12, 2 и 5 — нельзя смешивать.
          </Typography.Text>
          <Typography.Text>
            Разложение получают последовательным делением. Возьмём 360 и будем
            делить на 2, пока это возможно: 360 → 180 → 90 → 45 — извлекли три
            двойки. Оставшееся 45 делим на 3: 45 → 15 → 5 — извлекли две тройки.
            Остался простой множитель 5, и 360 = 2³ · 3² · 5.
          </Typography.Text>
          <Typography.Text>
            В тетради такое разложение удобно записывать «лесенкой»: слева то,
            что осталось от числа, справа — простой множитель, на который делим.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ladder360}
            caption={
              <>
                Разложение 360 лесенкой. Каждая строка — одно деление. Правый
                столбец сверху вниз и есть все простые множители с повторениями.
              </>
            }
          />
          <Typography.Text>Программа делает то же самое:</Typography.Text>
          <CodeBlock
            code={
              "def prime_factors(n):\n    factors = []\n    m = n\n    d = 2\n\n    while d * d <= m:\n        while m % d == 0:\n            factors.append(d)\n            m //= d\n\n        d += 1\n\n    if m > 1:\n        factors.append(m)\n\n    return factors"
            }
            label={"Программа делает то же самое"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"m"}</Notation> — рабочая копия числа, её уменьшаем
            делением; <Notation>{"m //= d"}</Notation> означает{" "}
            <Notation>{"m = m // d"}</Notation>. Внутренний цикл{" "}
            <Notation>{"while m % d == 0"}</Notation> нужен, чтобы извлечь{" "}
            <strong>все повторения</strong> множителя <Notation>{"d"}</Notation>
            : с <Notation>{"if"}</Notation> удалился бы только один множитель, и
            у 72 вместо трёх двоек нашлась бы одна.
          </Typography.Text>
          <Typography.Text>
            Посмотрим, как программа работает на числе 1050. На нём видно всё
            сразу: множитель 5 повторяется, составной кандидат 4 проверяется, но
            ничего не делит, а после цикла остаётся последний множитель.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.factorStepper1050}
            label={"Разложение 1050 на простые множители по шагам"}
          />
          <Typography.Text>
            Остаются два вопроса, которые возникают при чтении кода.
          </Typography.Text>
          <Typography.Text>
            Почему перебираем не только простые <Notation>{"d"}</Notation>, а в
            список всё равно попадают только простые множители? Когда цикл
            доходит до составного <Notation>{"d"}</Notation>, его меньшие
            простые множители уже полностью удалены из{" "}
            <Notation>{"m"}</Notation>. Поэтому составное{" "}
            <Notation>{"d"}</Notation> разделить оставшееся число не может.
          </Typography.Text>
          <Typography.Text>
            Почему остаток <Notation>{"m > 1"}</Notation> после цикла можно
            дописать как простой множитель? Если бы он был составным, у него
            нашёлся бы делитель не больше его квадратного корня, и цикл нашёл бы
            этот делитель. Раз цикл закончился, оставшееся число больше 1 —
            простое.
          </Typography.Text>
          <CodeBlock
            code={"print(prime_factors(360))"}
            label={"Раз цикл закончился, оставшееся число больше 1 — простое"}
            language="python"
            output={"[2, 2, 2, 3, 3, 5]"}
          />
          <Typography.Text>
            Убрать повторения помогает{" "}
            <PythonTerm term="set">множество</PythonTerm>: в нём каждое значение
            хранится один раз, так что{" "}
            <Notation>{"set([2, 2, 2, 3, 3, 5])"}</Notation> содержит только 2,
            3 и 5. Множество само по себе не упорядочено, поэтому, чтобы брать
            первый, последний и другие элементы, сначала применяем{" "}
            <Notation>{"sorted"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "unique_factors = sorted(set(prime_factors(360)))\nprint(unique_factors)"
            }
            label={
              "Код на Python: unique_factors = sorted(set(prime_factors(360)))"
            }
            language="python"
            output={"[2, 3, 5]"}
          />
        </>
      ),
    },
    {
      id: "prostye-deliteli",
      navLabel: "Простые делители",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Простые делители числа — это различные множители его разложения.
            </strong>{" "}
            Чтобы получить их по возрастанию, достаточно убрать повторы и
            отсортировать:
          </Typography.Text>
          <CodeBlock
            code={
              "print(sorted(set(prime_factors(84))))\nprint(sorted(set(prime_factors(72))))"
            }
            label={
              "Чтобы получить их по возрастанию, достаточно убрать повторы и отсортировать"
            }
            language="python"
            output={"[2, 3, 7]\n[2, 3]"}
          />
          <Typography.Text>
            Это быстрее, чем искать все делители и проверять каждый на простоту:
            разложение делает не больше √n шагов и сразу выдаёт только простые
            числа. Любые величины из условия получаются из этого списка{" "}
            <Notation>{"P"}</Notation>. Выберите, что требуется, — значение
            показано для 84, у которого <Notation>{"P = [2, 3, 7]"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Что требуется и выражение по списку P простых делителей"}
            variants={[
              {
                label: "наименьший простой делитель",
                value: (
                  <>
                    <Notation>{"P[0]"}</Notation> → 2
                  </>
                ),
              },
              {
                label: "наибольший простой делитель",
                value: (
                  <>
                    <Notation>{"P[-1]"}</Notation> → 7
                  </>
                ),
              },
              {
                label: "сумма наименьшего и наибольшего",
                value: (
                  <>
                    <Notation>{"P[0] + P[-1]"}</Notation> → 9
                  </>
                ),
              },
              {
                label: "сумма всех различных",
                value: (
                  <>
                    <Notation>{"sum(P)"}</Notation> → 12
                  </>
                ),
              },
              {
                label: "количество различных",
                value: (
                  <>
                    <Notation>{"len(P)"}</Notation> → 3
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            <strong>
              «Не считая самого числа» меняет ответ только для простых чисел.
            </strong>{" "}
            У простого числа 97 разложение — <Notation>{"[97]"}</Notation>, и
            его единственный простой делитель — оно само. Если условие говорит
            «не считая самого числа», список становится пустым, и величину нужно
            взять такой, как велит условие (обычно 0).
          </Typography.Text>
          <CodeBlock
            code={
              "def prime_divisors(n):\n    P = sorted(set(prime_factors(n)))\n    return [p for p in P if p != n]\n\nprint(prime_divisors(84))\nprint(prime_divisors(97))\nprint(prime_divisors(49))"
            }
            label={"Код на Python: def prime_divisors(n):"}
            language="python"
            output={"[2, 3, 7]\n[]\n[7]"}
          />
          <Typography.Text>
            У 49 = 7 · 7 простой делитель 7 не совпадает с самим числом, поэтому
            он остаётся.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "mnozhiteli-i-deliteli",
      navLabel: "Множители и делители",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Произведение ровно двух простых множителей» и «ровно два
              различных простых делителя» — разные условия.
            </strong>
          </Typography.Text>
          <LessonTable
            label={
              "Число, Разложение, Множителей с повторениями, Различных простых делителей"
            }
            columns={[
              { label: "Число", numeric: true },
              { label: "Разложение" },
              { label: "Множителей с повторениями", numeric: true },
              { label: "Различных простых делителей", numeric: true },
            ]}
            rows={[
              ["15", "3 · 5", "2", "2"],
              ["9", "3 · 3", "2", "1"],
              ["12", "2 · 2 · 3", "3", "2"],
              ["30", "2 · 3 · 5", "3", "3"],
              ["8", "2 · 2 · 2", "3", "1"],
            ]}
          />
          <Typography.Text>Поэтому:</Typography.Text>
          <ul>
            <li>
              «представимо в виде произведения ровно двух простых множителей,{" "}
              <strong>не обязательно различных</strong>» —{" "}
              <Notation>{"len(prime_factors(n)) == 2"}</Notation>. Подходят 15 и
              9;
            </li>
            <li>
              «имеет ровно два <strong>различных</strong> простых делителя» —{" "}
              <Notation>{"len(set(prime_factors(n))) == 2"}</Notation>. Подходят
              15 и 12.
            </li>
          </ul>
          <Typography.Text>
            Слова «не обязательно различных» в условии важны: они разрешают
            квадраты простых чисел вроде 9 = 3 · 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cifry-mnozhitelej",
      navLabel: "Цифры множителей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие на цифры множителей проверяется у каждого множителя
              отдельно.
            </strong>
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Найти три наименьших числа, больших 100, которые представимы в
              виде произведения ровно двух простых множителей, не обязательно
              различных, и каждый из множителей содержит в записи цифру 1.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Порядок рассуждений: для n = 101, 102, … раскладываем n на простые
            множители, проверяем, что их ровно два и в записи каждого есть цифра
            1, и останавливаемся после третьего найденного числа.
          </Typography.Text>
          <CodeBlock
            code={
              'n = 101\nfound = 0\n\nwhile found < 3:\n    f = prime_factors(n)\n    if len(f) == 2 and all("1" in str(p) for p in f):\n        print(n, f)\n        found += 1\n    n += 1'
            }
            label={"Код на Python: n = 101"}
            language="python"
            output={"121 [11, 11]\n143 [11, 13]\n169 [13, 13]"}
          />
          <Typography.Text>
            <Notation>{'all("1" in str(p) for p in f)'}</Notation> читается так:
            для каждого множителя <Notation>{"p"}</Notation> из{" "}
            <Notation>{"f"}</Notation> проверить, что в его записи есть{" "}
            <Notation>{"1"}</Notation>, и ответить «да», только если это верно
            для всех. Похожая функция <Notation>{"any"}</Notation> отвечает
            «да», если условие выполнено <strong>хотя бы для одного</strong>{" "}
            элемента: она нужна в условии «хотя бы один из множителей содержит
            цифру…».
          </Typography.Text>
          <Typography.Text>
            В ответе есть 121 = 11 · 11: множители одинаковые, и слова «не
            обязательно различных» это разрешают.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skorost-razlozheniya",
      navLabel: "Скорость разложения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разложение работает быстро даже для чисел около 10¹⁰.
            </strong>{" "}
            Цикл проверяет d только пока d·d не больше оставшегося числа. В
            худшем случае, когда число простое, это около √n шагов. Для числа
            около 5·10⁹ это примерно 70 тысяч проверок, а для большинства чисел
            намного меньше: маленькие множители быстро уменьшают m.
          </Typography.Text>
          <Typography.Text>
            Поэтому задачи вида «перебирать числа больше 4 500 000 000 и найти
            первые пять подходящих» решаются прямым перебором с разложением.
            Нужные числа встречаются часто, и перебрать придётся немного.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "prostye-korotko",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Простое число имеет ровно два делителя; 1 не простое.
                    Простоту проверяем до √n.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Разложение: делим на d, пока делится (
                    <Notation>{"while"}</Notation>, не{" "}
                    <Notation>{"if"}</Notation>), потом переходим к следующему
                    d; остаток больше 1 — последний простой множитель.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Простые делители —{" "}
                    <Notation>{"sorted(set(prime_factors(n)))"}</Notation>; «не
                    считая самого числа» убирает n у простых чисел.
                  </>
                ),
              },
              {
                note: (
                  <>
                    «Ровно k простых множителей» — длина разложения с
                    повторениями; «k различных простых делителей» — длина
                    множества.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Условие на цифры каждого множителя —{" "}
                    <Notation>{"all(...)"}</Notation>, хотя бы одного —{" "}
                    <Notation>{"any(...)"}</Notation>.
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
      id: "prostoe-221",
      prompt: <>Простое ли число 221?</>,
      reveal: <>Нет: 221 = 13 · 17. Делитель 13 найдётся до √221 ≈ 14,9.</>,
    },
  ],
};

export default content;
