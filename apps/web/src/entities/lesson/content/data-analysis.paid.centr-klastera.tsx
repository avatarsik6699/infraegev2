// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./data-analysis.paid.centr-klastera.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "centr-tochka-klastera",
      navLabel: "Центр — точка кластера",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Центр кластера в задании 27 — одна из точек самого кластера, и
              выбирают её по величине, которую задаёт условие.
            </strong>{" "}
            Чаще всего это сумма расстояний до остальных точек: так определён
            центр в 40 задачах из 50, во всех задачах экзаменов и демоверсий.
            Демоверсия 2027 года меняет только «расстояние»: вместо длины
            отрезка — разность энергий.
          </Typography.Text>
          <Typography.Text>
            Пусть кластеры уже выделены правильно. Будем искать центр одного
            кластера из пяти точек на горизонтальной прямой: (0; 0), (1; 0), (2;
            0), (3; 0) и (100; 0).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summa-rasstoyaniy",
      navLabel: "Сумма расстояний",
      explanation: (
        <>
          <Typography.Text>
            <strong>Начнём с распространённого определения:</strong> среди точек
            кластера нужно выбрать ту, от которой сумма расстояний до остальных
            точек минимальна.
          </Typography.Text>
          <Typography.Text>
            В этой фразе важны обе части: выбираем{" "}
            <strong>одну из имеющихся точек</strong>; сравниваем{" "}
            <strong>суммы расстояний</strong>.
          </Typography.Text>
          <Typography.Text>
            Такую точку в математической терминологии часто называют{" "}
            <strong>медоидом</strong>. В условиях ЕГЭ для неё могут использовать
            слово «центр» или «центроид». При решении следует руководствоваться
            данным в условии определением.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-kandidatov",
      navLabel: "Перебор кандидатов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Центр находят перебором: каждую точку проверяют как кандидата.
            </strong>{" "}
            Слово <strong>кандидат</strong> означает точку, которую мы сейчас
            проверяем: «А что, если именно она будет центром?»
          </Typography.Text>
          <Typography.Text>
            На одной горизонтали расстояние равно{" "}
            <strong>модулю разности координат</strong>{" "}
            <Notation>{"x"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Для точки (0; 0) сумма расстояний до остальных: 1 + 2 + 3 + 100 =
            106. Для (1; 0): 1 + 1 + 2 + 99 = 103. Для (2; 0): 2 + 1 + 1 + 98 =
            102. Пройдём так всех пятерых:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.clCenterStepper3}
            label={
              "Поиск центра точек 0, 1, 2, 3, 100 перебором кандидатов: шаг за шагом"
            }
          />
          <Typography.Text>
            Следовательно, искомый центр — (2; 0) с суммой 102. У (3; 0) сумма
            103, у далёкой (100; 0) — 394.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "programma-centra",
      navLabel: "Программа",
      explanation: (
        <>
          <Typography.Text>
            <strong>Программа повторяет ручные действия.</strong> Общий
            алгоритм:
          </Typography.Text>
          <ol>
            <li>Выбрать очередного кандидата.</li>
            <li>Посчитать расстояния от него до всех точек кластера.</li>
            <li>Сложить расстояния.</li>
            <li>Сравнить сумму с лучшей найденной.</li>
            <li>При улучшении запомнить и сумму, и самого кандидата.</li>
          </ol>
          <CodeBlock
            code={
              'from math import dist\n\n\ndef center_sum(cluster):\n    best_point = cluster[0]\n    best_sum = float("inf")\n\n    for candidate in cluster:\n        total = 0.0\n\n        for point in cluster:\n            total += dist(candidate, point)\n\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n\n    return best_point'
            }
            label={"Программа повторяет ручные действия. Общий алгоритм"}
            language="python"
          />
          <CodeBlock
            code={
              "cluster = [(0, 0), (1, 0), (2, 0), (3, 0), (100, 0)]\nprint(center_sum(cluster))"
            }
            label={"Программа повторяет ручные действия. Общий алгоритм"}
            language="python"
            output={"(2, 0)"}
          />
          <Typography.Text>
            Функция рассчитана на непустой кластер.
          </Typography.Text>
          <Typography.Text>
            <Notation>{'float("inf")'}</Notation> — положительная бесконечность.
            Любая конечная сумма окажется меньше неё. Это позволяет первому
            кандидату автоматически стать начальным лучшим результатом.
          </Typography.Text>
          <Typography.Text>
            Это <PythonTerm term="nested">вложенные циклы</PythonTerm>. Внешний
            цикл <Notation>{"for candidate in cluster:"}</Notation> перебирает
            возможные центры. Внутренний цикл{" "}
            <Notation>{"for point in cluster:"}</Notation> перебирает точки, до
            которых мы считаем расстояния.
          </Typography.Text>
          <Typography.Text>
            Строка <Notation>{"total = 0.0"}</Notation> стоит внутри внешнего
            цикла, потому что{" "}
            <strong>для каждого нового кандидата нужна новая сумма</strong>.
            Если поставить её до внешнего цикла, расстояния разных кандидатов
            начнут накапливаться вместе, и смысл вычисления потеряется. Строка{" "}
            <Notation>{"total += dist(candidate, point)"}</Notation> —{" "}
            <PythonTerm term="augassign">сокращённое присваивание</PythonTerm>,
            она равносильна{" "}
            <Notation>{"total = total + dist(candidate, point)"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            После окончания внутреннего цикла сумма полностью посчитана. Только
            теперь можно сравнивать её с лучшим результатом.
          </Typography.Text>
          <Typography.Text>
            <strong>Почему функция гарантированно найдёт нужную точку?</strong>{" "}
            Потому что она рассматривает всех допустимых кандидатов и точно
            вычисляет для каждого именно ту величину, которую требуется
            минимизировать.
          </Typography.Text>
          <Typography.Text>
            Мы не пытаемся угадать центр по рисунку и не ограничиваем поиск
            несколькими «подходящими на вид» точками.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rasstoyanie-do-sebya",
      navLabel: "Расстояние до себя",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Расстояние от кандидата до самого себя можно оставить в сумме.
            </strong>{" "}
            Оно равно нулю: d(P, P) = 0. Поэтому сумма до всех остальных точек
            равна сумме до всех точек, включая себя. Специальная проверка{" "}
            <Notation>{"if point != candidate:"}</Notation> для этой задачи не
            нужна.
          </Typography.Text>
          <Typography.Text>
            Более того, она может мешать в других вычислениях, если разные
            записи файла имеют одинаковые координаты.
          </Typography.Text>
          <Typography.Text>
            <strong>Не удаляй совпадающие точки без указания в условии.</strong>{" "}
            Если две строки описывают два наблюдения с одинаковыми координатами,
            их повторение влияет на количество точек и на суммы расстояний от
            других точек.
          </Typography.Text>
          <Typography.Text>
            Для кластера из одной точки наша функция тоже работает: сумма равна
            нулю, центром становится эта точка. Для пустого списка центр не
            определён. Если после разделения возник пустой кластер, это повод
            проверить границы или сам способ создания групп.
          </Typography.Text>
          <Typography.Text>
            Если несколько точек дают одну и ту же минимальную сумму, код с{" "}
            <Notation>{"<"}</Notation> сохраняет <strong>первую</strong>{" "}
            встретившуюся. Код с <Notation>{"<="}</Notation> сохранял бы{" "}
            <strong>последнюю</strong>.
          </Typography.Text>
          <Typography.Text>
            Когда условие гарантирует единственность центра, математической
            неоднозначности нет. Если такой гарантии нет, нужно посмотреть,
            предусмотрено ли дополнительное правило выбора.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "srednee-ne-centr",
      navLabel: "Среднее — не центр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Среднее арифметическое координат обычно не является ответом на
              задачу о минимуме суммы расстояний.
            </strong>{" "}
            Среднее арифметическое — это сумма чисел, разделённая на их
            количество. Для наших пяти точек x̄ = (0 + 1 + 2 + 3 + 100) / 5 =
            21,2 и ȳ = 0. Средняя точка — (21,2; 0).
          </Typography.Text>
          <Typography.Text>
            Но такой точки вообще нет среди исходных, а правильный центр по
            сумме расстояний — <Notation>{"(2, 0)"}</Notation>. Интуитивная
            причина: далёкая точка сильно смещает среднее арифметическое, а
            минимум суммы обычных расстояний определяется иначе.
          </Typography.Text>
          <Typography.Text>
            Возникает следующая идея: «Тогда найдём среднюю точку и выберем
            ближайшую к ней исходную». Проверим её:
          </Typography.Text>
          <CodeBlock
            code={
              "mean = (sum(p[0] for p in cluster) / 5, 0)\nprint(mean)\n\nnearest = cluster[0]\nfor p in cluster:\n    if dist(p, mean) < dist(nearest, mean):\n        nearest = p\n\nbest = center_sum(cluster)\nprint(nearest, sum(dist(nearest, p) for p in cluster))\nprint(best, sum(dist(best, p) for p in cluster))"
            }
            label={"Проверим её"}
            language="python"
            output={"(21.2, 0)\n(3, 0) 103.0\n(2, 0) 102.0"}
          />
          <Typography.Text>
            Ближайшая исходная точка к (21,2; 0) — (3; 0). Но её сумма
            расстояний равна 103, тогда как у (2; 0) — 102. Значит,{" "}
            <strong>
              даже ближайшая к среднему точка не обязана быть правильным центром
              по сумме обычных расстояний
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Это важный пример: он опровергает сразу два привлекательных, но
            неверных общих правила.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tri-vyrazheniya",
      navLabel: "Три разных выражения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сумма расстояний, сумма их квадратов и квадрат суммы — три разных
              выражения.
            </strong>{" "}
            Сумма обычных расстояний — d₁ + d₂ + … + dₘ. Сумма квадратов
            расстояний — d₁² + d₂² + … + dₘ². Квадрат всей суммы — (d₁ + d₂ + …
            + dₘ)².
          </Typography.Text>
          <Typography.Text>
            Возьмём снова наши точки. Для кандидата 2 сумма обычных расстояний
            равна 102, для кандидата 3 — 103. Первый кандидат лучше. Но суммы
            квадратов:
          </Typography.Text>
          <CodeBlock
            code={
              "for c in [(2, 0), (3, 0)]:\n    plain = sum(dist(c, p) for p in cluster)\n    squares = sum(dist(c, p) ** 2 for p in cluster)\n    print(c, plain, squares)"
            }
            label={"Но суммы квадратов"}
            language="python"
            output={"(2, 0) 102.0 9610.0\n(3, 0) 103.0 9423.0"}
          />
          <Typography.Text>
            2² + 1² + 0² + 1² + 98² = 9610, а 3² + 2² + 1² + 0² + 97² = 9423.
            Теперь лучше кандидат 3.
          </Typography.Text>
          <Typography.Text>
            Причина в том, что возведение в квадрат сильнее увеличивает большие
            расстояния. Сокращение очень большого расстояния может перевесить
            увеличение нескольких маленьких.
          </Typography.Text>
          <Typography.Text>
            Поэтому <strong>«убрать корень» в сумме расстояний нельзя</strong>:
            получится другая задача с другим ответом. Центр по сумме квадратов —
            в дополнительной подтеме 8.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "srednee-rasstoyanie",
      navLabel: "Среднее расстояние",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если в условии минимизируется среднее расстояние, выбор центра
              часто остаётся тем же.
            </strong>{" "}
            Пусть в кластере m точек, где m {">"} 1. Для кандидата P обозначим
            сумму расстояний до остальных точек через S(P). Тогда среднее
            расстояние до остальных — S(P) / (m − 1).
          </Typography.Text>
          <Typography.Text>
            Число m − 1 одинаково для всех кандидатов одного кластера. Если две
            суммы удовлетворяют условию S(A) {"<"} S(B), то после деления на
            одно и то же положительное число порядок сохранится: S(A) / (m − 1){" "}
            {"<"} S(B) / (m − 1).
          </Typography.Text>
          <Typography.Text>
            Поэтому для <strong>выбора точки</strong> достаточно минимизировать
            сумму. Но если требуется вывести само среднее расстояние, деление
            выполнить нужно.
          </Typography.Text>
          <Typography.Text>
            Также нужно различать: среднее до <strong>остальных</strong> точек —
            деление на m − 1; среднее по всем точкам, включая саму точку с
            расстоянием 0, — деление на m. Для нашего центра это 102 / 4 = 25,5
            и 102 / 5 = 20,4. Выбранный центр будет одинаковым, а числовое
            значение среднего — разным.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "formula-rasstoyaniya",
      navLabel: "Формула расстояния",
      explanation: (
        <>
          <Typography.Text>
            <strong>Формулу расстояния тоже нужно читать в условии.</strong>{" "}
            Пока мы рассматривали обычное евклидово расстояние. Если задана
            другая формула, её нужно использовать во всех соответствующих
            вычислениях.
          </Typography.Text>
          <Typography.Text>
            Например, d(A, B) = |x₁ − x₂| + |y₁ − y₂|. Это{" "}
            <strong>манхэттенское расстояние</strong>. Его можно представить как
            длину пути, когда разрешено двигаться только по горизонтали и
            вертикали. Для точек (1; 2) и (4; 6) это |1 − 4| + |2 − 6| = 3 + 4 =
            7, а евклидово расстояние между ними равно 5.
          </Typography.Text>
          <Typography.Text>
            В Python{" "}
            <PythonTerm term="absval">
              <Notation>{"abs"}</Notation>
            </PythonTerm>{" "}
            вычисляет модуль числа — его неотрицательную величину:
          </Typography.Text>
          <CodeBlock
            code={
              "def manhattan(a, b):\n    return abs(a[0] - b[0]) + abs(a[1] - b[1])"
            }
            label={
              "В Python {{absval|abs}} вычисляет модуль числа — его неотрицательную величину"
            }
            language="python"
          />
          <Typography.Text>
            Перебор кандидатов по сумме расстояний можно оставить прежним,
            заменив используемую функцию расстояния.
          </Typography.Text>
          <Typography.Text>
            Так устроена и демоверсия 2027 года: центр кластера — частица, у
            которой{" "}
            <strong>сумма модулей разностей кинетических энергий</strong> с
            остальными частицами минимальна. «Расстояние» между частицами здесь
            — |E₁ − E₂|, а перебор тот же. Функции{" "}
            <Notation>{"read_particles"}</Notation>,{" "}
            <Notation>{"energy"}</Notation> и{" "}
            <Notation>{"energy_groups"}</Notation> — из подтем 2 и 3:
          </Typography.Text>
          <CodeBlock
            code={
              'def center_energy(group):\n    best_p = group[0]\n    best_sum = float("inf")\n\n    for c in group:\n        total = 0.0\n        for p in group:\n            total += abs(energy(c) - energy(p))\n\n        if total < best_sum:\n            best_sum = total\n            best_p = c\n\n    return best_p'
            }
            label={
              "Функции read_particles, energy и energy_groups — из подтем 2 и 3"
            }
            language="python"
          />
          <CodeBlock
            code={
              'particles = read_particles("27-4.txt")\ngroups = energy_groups(particles, [3.5, 7, 10.5])\n\nc = center_energy(groups[1])\nprint(len(groups[1]), c[5], round(energy(c), 3))'
            }
            label={
              "Функции read_particles, energy и energy_groups — из подтем 2 и 3"
            }
            language="python"
            output={"103 IV 5.362"}
          />
          <Typography.Text>
            Во второй группе 103 частицы, центр — частица с признаком{" "}
            <Notation>{"IV"}</Notation> и энергией около 5,362.{" "}
            <strong>
              Координаты частицы-центра в этом определении не участвуют
            </strong>
            : важна только её энергия.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vremya-poiska",
      navLabel: "Время поиска",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разберём, почему поиск центра может занимать много времени.
            </strong>{" "}
            Пусть в кластере m точек. Для каждого кандидата мы проверяем все m
            точек: m · m = m² вычислений расстояния.
          </Typography.Text>
          <LessonTable
            label={
              "Для каждого кандидата мы проверяем все m точек: m · m = m² вычислений расстояния"
            }
            columns={[
              { label: "Точек в кластере", numeric: true },
              {
                label: "Вычислений расстояния в прямом двойном цикле",
                numeric: true,
              },
            ]}
            rows={[
              ["100", "10 000"],
              ["1 000", "1 000 000"],
              ["5 000", "25 000 000"],
              ["10 000", "100 000 000"],
            ]}
          />
          <Typography.Text>
            Такой рост называют <strong>квадратичным</strong> и обозначают{" "}
            <PythonTerm term="bigo">O(m²)</PythonTerm>. Эта запись описывает
            порядок роста работы, а не конкретное количество секунд. Если точек
            стало в два раза больше, вычислений в таком алгоритме станет
            примерно в четыре раза больше.
          </Typography.Text>
          <Typography.Text>
            Если кластеров несколько, объём работы — m₁² + m₂² + … + mₖ², где mᵢ
            — размер очередного кластера, а k — количество кластеров.
          </Typography.Text>
          <Typography.Text>
            То есть после разделения мы не считаем расстояния от кандидата до
            всех точек файла. Только до точек{" "}
            <strong>его собственного кластера</strong>. Например, для 10 000
            точек, примерно поровну распределённых по трём кластерам, получится
            около 33 миллионов вычислений расстояния, а не 100 миллионов.
          </Typography.Text>
          <Typography.Text>
            Не стоит заранее обещать себе, что определённое число миллионов
            операций выполнится за фиксированное количество секунд. На время
            влияют компьютер, версия Python и устройство кода.
          </Typography.Text>
          <Typography.Text>
            Полезно заранее запускать свои решения на файлах сопоставимого
            размера. В файлах экзамена 2026 года — сотни точек, и перебор
            занимает доли секунды.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "centr-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Центр — одна из точек кластера с наименьшей суммой
                    расстояний; находят его перебором всех кандидатов.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сумма <Notation>{"total"}</Notation> обнуляется для каждого
                    кандидата; расстояние до себя можно оставить — оно равно
                    нулю.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Средняя точка и ближайшая к ней исходная точка — не центр по
                    сумме расстояний.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сумма расстояний и сумма квадратов — разные величины;
                    убирать корень нельзя.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Расстояние берут из условия: евклидово, манхэттенское,
                    разность энергий; перебор от этого не меняется.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Двойной цикл — m² вычислений, но только внутри своего
                    кластера.
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
          Среди точек <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(4, 0)"}</Notation>, <Notation>{"(5, 0)"}</Notation>,{" "}
          <Notation>{"(6, 0)"}</Notation>, <Notation>{"(20, 0)"}</Notation>{" "}
          найди центр по минимальной сумме расстояний. Совпадает ли он с
          ближайшей к средней точке?
        </>
      ),
      reveal: (
        <>
          <Notation>{"(5, 0)"}</Notation>: сумма 22 (у{" "}
          <Notation>{"(4, 0)"}</Notation> и <Notation>{"(6, 0)"}</Notation> — по
          23). Средняя точка 7, ближайшая к ней <Notation>{"(6, 0)"}</Notation>{" "}
          — не центр.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Найди центр кластера <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(4, 0)"}</Notation>, <Notation>{"(4, 3)"}</Notation>,{" "}
          <Notation>{"(0, 3)"}</Notation>, <Notation>{"(1, 1)"}</Notation> и его
          сумму расстояний.
        </>
      ),
      reveal: (
        <>
          <Notation>{"(1, 1)"}</Notation>: сумма ≈ 10,418; у углов суммы от
          13,414 до 15,606.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Строку <Notation>{"total = 0.0"}</Notation> поставили до внешнего
          цикла. Что тогда сравнивается с <Notation>{"best_sum"}</Notation> для
          второго кандидата?
        </>
      ),
      reveal: (
        <>
          Накопленная сумма первого и второго кандидатов вместе: она заведомо
          больше суммы первого, и второй кандидат никогда не выиграет.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Для точек <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(1, 0)"}</Notation>, <Notation>{"(2, 0)"}</Notation>,{" "}
          <Notation>{"(6, 0)"}</Notation>, <Notation>{"(20, 0)"}</Notation>{" "}
          найди центр по сумме расстояний и точку с наименьшей суммой квадратов
          расстояний.
        </>
      ),
      reveal: (
        <>
          По сумме расстояний — <Notation>{"(2, 0)"}</Notation> (25), по сумме
          квадратов — <Notation>{"(6, 0)"}</Notation>: средняя точка 5,8, а у
          далёкой 20 вклад в квадратах огромен.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Для кластера задачи 1 найди среднее расстояние от центра до остальных
          точек и среднее по всем точкам кластера.
        </>
      ),
      reveal: (
        <>
          22 / 4 = 5,5 до остальных и 22 / 5 = 4,4 по всем точкам; центр от
          этого не меняется.
        </>
      ),
    },
    {
      id: "zadacha-6",
      prompt: (
        <>
          Найди центр кластера <Notation>{"(2, 6)"}</Notation>,{" "}
          <Notation>{"(3, 6)"}</Notation>, <Notation>{"(3, 1)"}</Notation>,{" "}
          <Notation>{"(4, 2)"}</Notation> по евклидову и по манхэттенскому
          расстоянию.
        </>
      ),
      reveal: (
        <>
          Евклидово — <Notation>{"(4, 2)"}</Notation> (≈ 10,01), манхэттенское —{" "}
          <Notation>{"(3, 6)"}</Notation> (сумма 11, у остальных по 13).
        </>
      ),
    },
    {
      id: "zadacha-7",
      prompt: (
        <>
          Сколько вычислений расстояния потребует прямой перебор центра в
          кластере из 6000 точек? А в трёх кластерах по 2000 точек?
        </>
      ),
      reveal: <>6000² = 36 000 000; 3 · 2000² = 12 000 000.</>,
    },
  ],
};

export default content;
