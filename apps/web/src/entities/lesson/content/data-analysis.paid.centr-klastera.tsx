// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
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
            Какую точку кластера считать его центром?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Центр — одна из точек самого кластера: та, у которой сумма
              расстояний до остальных точек наименьшая. Найти её можно перебором
              — проверить каждую точку как кандидата.
            </strong>{" "}
            <strong>Кандидат</strong> — точка, которую сейчас проверяем: «а что,
            если центр — она?»
          </Typography.Text>
          <Typography.Text>
            Возьмём кластер из пяти точек на прямой: (0; 0), (1; 0), (2; 0), (3;
            0) и (100; 0). На одной горизонтали расстояние — модуль разности x.
            Для (0; 0) сумма до остальных 1 + 2 + 3 + 100 = 106, для (1; 0) — 1
            + 1 + 2 + 99 = 103. Пройди так всех пятерых:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.clCenterStepper3}
            label={"Кандидаты в центр точек 0, 1, 2, 3, 100: шаг за шагом"}
          />
          <Typography.Text>
            Центр — (2; 0) с суммой 102. У соседней (3; 0) сумма 103, у далёкой
            (100; 0) — 394.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Центр, центроид, медоид и среднее расстояние"
          >
            <Typography.Text>
              В условиях такую точку называют «центром» или «центроидом», в
              математике — <strong>медоидом</strong>. Решай по определению из
              условия, а не по слову.
            </Typography.Text>
            <Typography.Text>
              Если в условии минимизируется <strong>среднее</strong> расстояние
              до остальных точек, центр тот же: среднее — сумма, делённая на m −
              1, а делитель одинаков для всех кандидатов кластера. Но если
              просят вывести само среднее, деление нужно: для нашего центра 102
              / 4 = 25,5 до остальных точек и 102 / 5 = 20,4 по всем пяти,
              включая сам центр.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "programma-centra",
      navLabel: "Программа",
      explanation: (
        <>
          <Typography.Text>
            Как записать перебор кандидатов программой?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Двумя вложенными циклами: внешний перебирает кандидатов,
              внутренний складывает расстояния от кандидата до всех точек
              кластера. Лучшую сумму и её кандидата запоминают.
            </strong>
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'from math import dist\n\n\ndef center_sum(cluster):\n    best_point = cluster[0]\n    best_sum = float("inf")\n    for candidate in cluster:\n        total = 0.0\n        for point in cluster:\n            total += dist(candidate, point)\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n    return best_point\n\n\ncluster = [(0, 0), (1, 0), (2, 0), (3, 0), (100, 0)]\nprint(center_sum(cluster))'
            }
            label={"Функция center_sum"}
            language="python"
            output={"(2, 0)"}
          />
          <ul>
            <li>
              <Notation>{'float("inf")'}</Notation> — бесконечность: любая
              настоящая сумма меньше, поэтому первый кандидат сразу становится
              лучшим.
            </li>
            <li>
              <Notation>{"total = 0.0"}</Notation> стоит <strong>внутри</strong>{" "}
              внешнего цикла: у каждого кандидата своя сумма. Поставь её до
              цикла — и суммы разных кандидатов сложатся вместе.
            </li>
            <li>
              <Notation>{"total += …"}</Notation> —{" "}
              <PythonTerm term="augassign">сокращённое присваивание</PythonTerm>
              , то же, что <Notation>{"total = total + …"}</Notation>.
            </li>
            <li>
              Сравнивать с лучшей суммой можно только после внутреннего цикла,
              когда сумма кандидата посчитана целиком.
            </li>
          </ul>
          <Typography.Text>
            Функция находит центр наверняка: она проверяет <strong>всех</strong>{" "}
            кандидатов и для каждого считает ровно ту величину, что стоит в
            условии. Угадывать центр по рисунку не нужно.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Расстояние до себя, равные суммы и одинаковые точки"
          >
            <Typography.Text>
              Расстояние от кандидата до самого себя равно нулю, поэтому
              проверка <Notation>{"if point != candidate:"}</Notation> не нужна:
              сумма до всех точек равна сумме до остальных. Хуже того, она
              выбросит и другую запись с теми же координатами — а совпадающие
              точки удалять нельзя, если условие этого не просит.
            </Typography.Text>
            <Typography.Text>
              При равных суммах сравнение <Notation>{"<"}</Notation> оставляет
              первого из равных кандидатов, <Notation>{"<="}</Notation> —
              последнего. Обычно условие гарантирует, что центр единственный.
            </Typography.Text>
          </ProofDisclosure>
          <ProofDisclosure
            kind="nuance"
            summary="Сколько работы делает перебор"
          >
            <Typography.Text>
              Для каждого из m кандидатов считаются m расстояний — всего m²:
            </Typography.Text>
            <LessonTable
              label={"Вычислений расстояния в двойном цикле"}
              columns={[
                { label: "Точек в кластере", numeric: true },
                { label: "Вычислений расстояния", numeric: true },
              ]}
              rows={[
                ["100", "10 000"],
                ["1 000", "1 000 000"],
                ["5 000", "25 000 000"],
              ]}
            />
            <Typography.Text>
              Расстояния считают только внутри своего кластера: 9 000 точек в
              трёх кластерах по 3 000 — это 27 миллионов вычислений, а не 81. В
              файлах экзамена сотни или тысячи точек, и перебор занимает
              секунды.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "srednee-ne-centr",
      navLabel: "Среднее — не центр",
      explanation: (
        <>
          <Typography.Text>
            Нельзя ли вместо перебора просто взять среднюю точку кластера?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет: средняя точка обычно не совпадает ни с одной точкой кластера,
              и даже ближайшая к ней точка не обязательно центр.
            </strong>{" "}
            Средняя точка наших пяти — x̄ = (0 + 1 + 2 + 3 + 100) / 5 = 21,2, ȳ =
            0: далёкая точка (100; 0) сильно её смещает. Ближайшая к (21,2; 0)
            точка кластера — (3; 0). Проверим её сумму:
          </Typography.Text>
          <CodeBlock
            code={
              "mean = (sum(p[0] for p in cluster) / 5, 0)\nprint(mean)\n\nnearest = cluster[0]\nfor p in cluster:\n    if dist(p, mean) < dist(nearest, mean):\n        nearest = p\n\nbest = center_sum(cluster)\nprint(nearest, sum(dist(nearest, p) for p in cluster))\nprint(best, sum(dist(best, p) for p in cluster))"
            }
            label={"Ближайшая к средней точке и настоящий центр"}
            language="python"
            output={"(21.2, 0)\n(3, 0) 103.0\n(2, 0) 102.0"}
          />
          <Typography.Text>
            У (3; 0) сумма 103, у настоящего центра (2; 0) — 102. Один пример
            опровергает сразу оба соблазнительных правила: и «центр — средняя
            точка», и «центр — ближайшая к средней».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "tri-vyrazheniya",
      navLabel: "Сумма квадратов",
      explanation: (
        <>
          <Typography.Text>
            А если ради скорости убрать корень и сравнивать суммы квадратов
            расстояний?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нельзя: сумма квадратов — другая величина, и её минимум бывает у
              другой точки.
            </strong>{" "}
            Сравним кандидатов 2 и 3 из нашего кластера:
          </Typography.Text>
          <CodeBlock
            code={
              "for c in [(2, 0), (3, 0)]:\n    plain = sum(dist(c, p) for p in cluster)\n    squares = sum(dist(c, p) ** 2 for p in cluster)\n    print(c, plain, squares)"
            }
            label={"Сумма расстояний и сумма квадратов"}
            language="python"
            output={"(2, 0) 102.0 9610.0\n(3, 0) 103.0 9423.0"}
          />
          <Typography.Text>
            По сумме расстояний лучше кандидат 2, по сумме квадратов — 3: 2² +
            1² + 0² + 1² + 98² = 9610, а 3² + 2² + 1² + 0² + 97² = 9423. Квадрат
            сильнее раздувает большие расстояния, и сократить одно большое
            выгоднее, чем несколько маленьких.
          </Typography.Text>
          <Typography.Text>
            Сравнивать квадраты можно, когда сравниваешь <strong>одно</strong>{" "}
            расстояние с порогом (подтема 1), но не суммы. Центр по сумме
            квадратов встречается в редких задачах — он разобран в
            дополнительном уроке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "formula-rasstoyaniya",
      navLabel: "Своя формула расстояния",
      explanation: (
        <>
          <Typography.Text>
            Что меняется, если в условии своя формула расстояния?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Только функция расстояния — перебор кандидатов остаётся прежним.
            </strong>{" "}
            Добавим в <Notation>{"center_sum"}</Notation> параметр{" "}
            <Notation>{"d"}</Notation> — функцию расстояния; по умолчанию это
            обычная <Notation>{"dist"}</Notation>:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'def center_sum(cluster, d=dist):\n    best_point = cluster[0]\n    best_sum = float("inf")\n    for candidate in cluster:\n        total = 0.0\n        for point in cluster:\n            total += d(candidate, point)\n        if total < best_sum:\n            best_sum = total\n            best_point = candidate\n    return best_point'
            }
            label={"center_sum с функцией расстояния"}
            language="python"
          />
          <Typography.Text>
            Например, <strong>манхэттенское расстояние</strong> d(A, B) = |x₁ −
            x₂| + |y₁ − y₂| — длина пути, если ходить только по горизонтали и
            вертикали. Для (1; 2) и (4; 6) это 3 + 4 = 7, а не 5.{" "}
            <PythonTerm term="absval">
              <Notation>{"abs"}</Notation>
            </PythonTerm>{" "}
            — модуль числа:
          </Typography.Text>
          <CodeBlock
            code={
              "def manhattan(a, b):\n    return abs(a[0] - b[0]) + abs(a[1] - b[1])\n\n\ngroup = [(0, 3), (3, 0), (1, 6), (1, 0)]\nprint(center_sum(group), center_sum(group, manhattan))"
            }
            label={"Центр по манхэттенскому расстоянию"}
            language="python"
            output={"(0, 3) (1, 0)"}
          />
          <Typography.Text>
            Для одних и тех же четырёх точек евклидов центр — (0; 3), а
            манхэттенский — (1; 0): формула расстояния меняет ответ.
          </Typography.Text>
          <Typography.Text>
            Так устроена и задача темы: «расстояние» между частицами — модуль
            разности их энергий |E₁ − E₂|, а координаты в выборе центра не
            участвуют. Функции <Notation>{"read_particles"}</Notation>,{" "}
            <Notation>{"energy"}</Notation> и{" "}
            <Notation>{"energy_groups"}</Notation> — из подтем 1 и 2:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'def energy_gap(a, b):\n    return abs(energy(a) - energy(b))\n\n\nparticles = read_particles("27-4.txt")\ngroups = energy_groups(particles, [3.5, 7, 10.5])\nfor g in groups:\n    c = center_sum(g, energy_gap)\n    print(len(g), c[5], round(energy(c), 3))'
            }
            label={"Центры кластеров задачи темы"}
            language="python"
            output={"125 V 2.028\n103 IV 5.362\n93 I 8.964\n81 I 12.503"}
          />
          <Typography.Text>
            У центров четырёх кластеров энергии 2,028, 5,362, 8,964 и 12,503. Q₂
            задачи темы — наибольшая из них; ответ соберём в подтеме 5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vzveshennaya-summa",
      navLabel: "Взвешенная сумма",
      explanation: (
        <>
          <Typography.Text>
            Как найти центр, если точки неравноценны — например, деревья разной
            высоты?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждое расстояние умножают на вес той точки, до которой его
              считают; в остальном перебор прежний.
            </strong>{" "}
            Такая задача есть в подборках: деревья свозят к точке сбора,
            «сложность» доставки дерева — расстояние, умноженное на его высоту,
            а точка сбора — дерево с наименьшей суммарной сложностью.
          </Typography.Text>
          <Typography.Text>
            Пять деревьев у дороги: (0; 0) высотой 2, (1; 0), (2; 0) и (3; 0)
            высотой 1 и (8; 0) высотой 4. Сравним обычную и взвешенную суммы
            каждого кандидата:
          </Typography.Text>
          <LessonTable
            label={"Обычная и взвешенная суммы"}
            columns={[
              { label: "Кандидат" },
              { label: "Сумма расстояний", numeric: true },
              { label: "Сумма с весами", numeric: true },
            ]}
            rows={[
              ["(0; 0)", "14", "38"],
              ["(1; 0)", "11", "33"],
              ["(2; 0)", "10", "30"],
              ["(3; 0)", "11", "29"],
              ["(8; 0)", "26", "34"],
            ]}
          />
          <Typography.Text>
            Без весов центр — (2; 0), с весами — (3; 0): высокое дерево (8; 0)
            тянет точку сбора к себе. В программе меняется одна строка — к
            расстоянию добавляется множитель:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'trees = [(0, 0, 2), (1, 0, 1), (2, 0, 1), (3, 0, 1), (8, 0, 4)]\n\n\ndef center_weighted(trees):\n    best, best_sum = None, float("inf")\n    for c in trees:\n        total = 0.0\n        for t in trees:\n            total += dist(c[:2], t[:2]) * t[2]\n        if total < best_sum:\n            best, best_sum = c, total\n    return best, best_sum\n\n\nprint(center_weighted(trees))'
            }
            label={"Точка сбора по взвешенной сумме"}
            language="python"
            output={"((3, 0, 1), 29.0)"}
          />
          <Typography.Text>
            Множитель — <Notation>{"t[2]"}</Notation>, высота дерева, которое
            везут, а не кандидата <Notation>{"c"}</Notation>. Перепутать их —
            значит решить другую задачу.
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
                key: "Центр",
                note: <>одна из точек кластера, наименьшая сумма расстояний</>,
              },
              {
                key: "Перебор",
                note: <>внешний цикл — кандидаты, внутренний — сумма</>,
              },
              {
                key: "total",
                note: <>обнуляется для каждого кандидата</>,
              },
              {
                key: "Средняя точка",
                note: <>не центр; ближайшая к ней — тоже не обязательно</>,
              },
              {
                key: "Своя формула",
                note: (
                  <>
                    меняется только функция <Notation>{"d"}</Notation>, перебор
                    тот же
                  </>
                ),
              },
              {
                key: "Вес",
                note: <>расстояние × вес точки, до которой считаем</>,
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
          найди центр по наименьшей сумме расстояний. Совпадает ли он с
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
          Сумма первого и второго кандидатов вместе: она заведомо больше суммы
          первого, и второй кандидат никогда не выиграет.
        </>
      ),
    },
    {
      id: "zadacha-4",
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
      id: "zadacha-5",
      prompt: (
        <>
          Деревья <Notation>{"(0, 0)"}</Notation> высотой 1,{" "}
          <Notation>{"(2, 0)"}</Notation> высотой 1 и{" "}
          <Notation>{"(3, 0)"}</Notation> высотой 5. Где точка сбора по сумме
          «расстояние × высота дерева» и где центр без весов?
        </>
      ),
      reveal: (
        <>
          С весами — <Notation>{"(3, 0)"}</Notation>: суммы 17, 7 и 4. Без весов
          — <Notation>{"(2, 0)"}</Notation>: суммы 5, 3 и 4.
        </>
      ),
    },
  ],
};

export default content;
