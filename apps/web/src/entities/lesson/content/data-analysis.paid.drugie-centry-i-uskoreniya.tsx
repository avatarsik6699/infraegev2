// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./data-analysis.paid.drugie-centry-i-uskoreniya.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "dopolnitelnyy-urok-centry",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет закрыть все возможные случаи задания 27: 6 задач подборок
            2024–2025 годов определяют центр иначе — минимаксом, наибольшей
            суммой или суммой квадратов, — а на экзаменах и в демоверсиях таких
            задач не было. Здесь же точные ускорения поиска центра; ни одна
            задача подборок их не требует. Задачи основных подтем решаются без
            него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Любое определение центра переводится в тот же перебор кандидатов —
              меняется только величина, которую считают для кандидата, и правило
              выбора.
            </strong>{" "}
            Перебор из подтемы 4 остаётся каркасом, а условие подсказывает, что
            в нём заменить.
          </Typography.Text>
          <Typography.Text>
            Будем сравнивать центры на точках прямой: (0; 0), (1; 0), (2; 0),
            (5; 0), (10; 0), а затем вернёмся к знакомым 0, 1, 2, 3, 100.
            Функции <Notation>{"read_points"}</Notation>,{" "}
            <Notation>{"center_sum"}</Notation> и разделение файлов из основных
            подтем считаем определёнными выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "samaya-dalyokaya-tochka",
      navLabel: "Самая далёкая точка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Другое определение центра использует расстояние до самой далёкой
              точки.
            </strong>{" "}
            В нём для каждого кандидата сначала ищут максимальное расстояние, а
            затем выбирают кандидата с наименьшим таким максимумом.
          </Typography.Text>
          <Typography.Text>
            Развернём фразу «минимально максимальное расстояние»:
          </Typography.Text>
          <ol>
            <li>
              Представили, что точка <Notation>{"P"}</Notation> — центр.
            </li>
            <li>Нашли самую далёкую от неё точку кластера.</li>
            <li>Запомнили, насколько далеко она находится.</li>
            <li>Повторили для других кандидатов.</li>
            <li>Выбрали того, у кого самое далёкое расстояние меньше всего.</li>
          </ol>
          <Typography.Text>
            Это можно понимать как поиск точки, из которой{" "}
            <strong>
              хуже всего расположенный объект всё равно находится как можно
              ближе
            </strong>
            . Такой принцип называют <strong>минимаксом</strong>: минимум среди
            вычисленных максимумов.
          </Typography.Text>
          <LessonTable
            label={
              "Такой принцип называют минимаксом: минимум среди вычисленных максимумов"
            }
            columns={[
              { label: "Кандидат" },
              { label: "Сумма расстояний", numeric: true },
              { label: "Самое большое расстояние", numeric: true },
            ]}
            rows={[
              [
                <>
                  <Notation>{"(0, 0)"}</Notation>
                </>,
                "18",
                "10",
              ],
              [
                <>
                  <Notation>{"(1, 0)"}</Notation>
                </>,
                "15",
                "9",
              ],
              [
                <>
                  <Notation>{"(2, 0)"}</Notation>
                </>,
                <>
                  <strong>14</strong>
                </>,
                "8",
              ],
              [
                <>
                  <Notation>{"(5, 0)"}</Notation>
                </>,
                "17",
                <>
                  <strong>5</strong>
                </>,
              ],
              [
                <>
                  <Notation>{"(10, 0)"}</Notation>
                </>,
                "32",
                "10",
              ],
            ]}
          />
          <Typography.Text>
            По сумме расстояний центр — <Notation>{"(2, 0)"}</Notation>. По
            минимальному максимальному расстоянию —{" "}
            <Notation>{"(5, 0)"}</Notation>. Это{" "}
            <strong>разные задачи с разными ответами</strong>.
          </Typography.Text>
          <Typography.Text>Код для второго определения:</Typography.Text>
          <CodeBlock
            code={
              'from math import dist\n\n\ndef center_minimax(cluster):\n    best_point = cluster[0]\n    best_radius = float("inf")\n\n    for candidate in cluster:\n        radius = 0.0\n\n        for point in cluster:\n            d = dist(candidate, point)\n\n            if d > radius:\n                radius = d\n\n        if radius < best_radius:\n            best_radius = radius\n            best_point = candidate\n\n    return best_point, best_radius'
            }
            label={"Код для второго определения"}
            language="python"
          />
          <CodeBlock
            code={
              "line = [(0, 0), (1, 0), (2, 0), (5, 0), (10, 0)]\n\ncenter, radius = center_minimax(line)\nprint(center, radius)\nprint(center_sum(line))"
            }
            label={"Код для второго определения"}
            language="python"
            output={"(5, 0) 5.0\n(2, 0)"}
          />
          <Typography.Text>
            Функция возвращает два значения: <Notation>{"center"}</Notation> —
            выбранную точку, <Notation>{"radius"}</Notation> — расстояние от неё
            до самой далёкой точки. Такое определение встречается в задачах
            подборки, где кластеры — круги, а ответ — средний радиус.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если центр по условию обязан быть точкой кластера, нельзя свободно
              поставить его между точками.
            </strong>{" "}
            Например, для двух точек <Notation>{"(0, 0)"}</Notation> и{" "}
            <Notation>{"(10, 0)"}</Notation> геометрическая середина{" "}
            <Notation>{"(5, 0)"}</Notation> покрывает их кругом радиуса 5. Но
            если разрешено выбирать центр только из этих двух точек, минимальное
            максимальное расстояние равно 10. Ограничение на допустимые центры
            принципиально меняет задачу.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "antipod",
      navLabel: "Антицентр и антипод",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Антицентр», «антипод» и «самая далёкая точка» нужно переводить в
              точное правило из условия.
            </strong>{" "}
            По одному названию угадывать алгоритм нельзя. Возможны, например,
            такие определения — выбери, чтобы увидеть, что вычислять для
            кандидата и как выбирать:
          </Typography.Text>
          <VariantPicker
            label={"Что требуется → что вычисляем для кандидата → как выбираем"}
            variants={[
              {
                label: "минимум суммы расстояний",
                value: <>сумму расстояний до точек кластера</>,
                note: <>наименьшую сумму</>,
              },
              {
                label: "максимум суммы расстояний",
                value: <>ту же сумму</>,
                note: <>наибольшую сумму</>,
              },
              {
                label: "минимум максимального расстояния",
                value: <>самое большое расстояние до точки кластера</>,
                note: <>наименьший максимум</>,
              },
              {
                label: "самая далёкая точка от уже найденного центра",
                value: <>одно расстояние до этого центра</>,
                note: <>наибольшее расстояние</>,
              },
            ]}
          />
          <Typography.Text>
            Последние две части каждой строки помогают буквально перевести
            предложение на язык циклов.
          </Typography.Text>
          <Typography.Text>
            Если «антицентр» определён как точка с{" "}
            <strong>максимальной суммой</strong> расстояний, в функции{" "}
            <Notation>{"center_sum"}</Notation> меняются начальное значение{" "}
            <Notation>{'best_sum = -float("inf")'}</Notation> и сравнение{" "}
            <Notation>{"if total > best_sum:"}</Notation>. Всё остальное
            устройство сохраняется.
          </Typography.Text>
          <Typography.Text>
            Но найти точку с максимальной суммой расстояний и найти точку, самую
            далёкую от центра, — это не одно и то же вычисление. Для самой
            далёкой от уже известного центра:
          </Typography.Text>
          <CodeBlock
            code={
              "center = (2, 0)\nfarthest_point = line[0]\nmax_distance = -1.0\n\nfor point in line:\n    d = dist(center, point)\n\n    if d > max_distance:\n        max_distance = d\n        farthest_point = point\n\nprint(farthest_point, max_distance)"
            }
            label={"Для самой далёкой от уже известного центра"}
            language="python"
            output={"(10, 0) 8.0"}
          />
          <Typography.Text>
            Здесь нет суммирования: каждой точке соответствует только одно
            расстояние.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summa-kvadratov",
      navLabel: "Сумма квадратов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              На точках 0, 1, 2, 3, 100 сумму квадратов выиграл кандидат 3 —
              ближайший к средней точке 21,2, и это не совпадение.
            </strong>{" "}
            В подтеме 4 по сумме расстояний лучше был кандидат 2, а по сумме
            квадратов — 3. Нарисуем сумму квадратов T(x) для любого кандидата на
            прямой:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clParabola_ba6fc2}
            caption={
              <>
                Сумма квадратов расстояний от точки x до точек 0, 1, 2, 3, 100 —
                парабола с вершиной в средней точке 21,2. Кандидаты лежат на
                ней; ниже всех тот, что ближе к вершине, — (3; 0).
              </>
            }
          />
          <Typography.Text>Получаем:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Минимизировать сумму квадратов расстояний — значит выбрать
              допустимую точку, ближайшую к средней точке кластера.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Если разрешена любая точка плоскости, минимум достигается в самой
            средней точке. Если разрешены только точки исходного кластера, нужно
            выбрать ближайшую из них.
          </Typography.Text>
          <ProofDisclosure summary="Почему сумма квадратов зависит только от расстояния до средней точки">
            <Typography.Text>
              Пусть в кластере m точек: (x₁; y₁), …, (xₘ; yₘ). Проверяем
              кандидата P = (x; y). Нужная сумма:
            </Typography.Text>
            <Typography.Text>
              T(P) = Σᵢ ((x − xᵢ)² + (y − yᵢ)²).
            </Typography.Text>
            <Typography.Text>
              Знак Σ означает суммирование. Индекс i последовательно принимает
              значения от 1 до m. То есть формула — сокращённая запись ((x −
              x₁)² + (y − y₁)²) + … + ((x − xₘ)² + (y − yₘ)²).
            </Typography.Text>
            <Typography.Text>
              Обозначим средние координаты: x̄ = (x₁ + … + xₘ) / m, ȳ = (y₁ + … +
              yₘ) / m.
            </Typography.Text>
            <Typography.Text>
              После раскрытия скобок и группировки слагаемых получается:
            </Typography.Text>
            <Typography.Text>
              T(P) = m · ((x − x̄)² + (y − ȳ)²) + Σᵢ ((xᵢ − x̄)² + (yᵢ − ȳ)²).
            </Typography.Text>
            <Typography.Text>
              Посмотрим на смысл двух частей. Первая, m · ((x − x̄)² + (y − ȳ)²),
              — количество точек, умноженное на квадрат расстояния от кандидата
              до средней точки. Вторая часть зависит только от исходных точек.
              При смене кандидата она <strong>не изменяется</strong>.
            </Typography.Text>
            <Typography.Text>
              Поэтому при сравнении кандидатов достаточно сравнивать первую
              часть. А множитель m одинаков для всех.
            </Typography.Text>
            <Typography.Text>
              Чтобы увидеть источник преобразования, достаточно раскрыть одну
              часть:
            </Typography.Text>
            <Typography.Text>
              Σᵢ (x − xᵢ)² = m · x² − 2x · Σᵢ xᵢ + Σᵢ xᵢ².
            </Typography.Text>
            <Typography.Text>
              Поскольку Σᵢ xᵢ = m · x̄, получаем квадрат m · (x − x̄)² и остаток,
              не зависящий от <Notation>{"x"}</Notation>. С координатой{" "}
              <Notation>{"y"}</Notation> происходит то же самое.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>Код:</Typography.Text>
          <CodeBlock
            code={
              'def center_squared(cluster):\n    sum_x = 0.0\n    sum_y = 0.0\n\n    for x, y in cluster:\n        sum_x += x\n        sum_y += y\n\n    mean_x = sum_x / len(cluster)\n    mean_y = sum_y / len(cluster)\n\n    best_point = cluster[0]\n    best_value = float("inf")\n\n    for point in cluster:\n        x, y = point\n\n        value = (x - mean_x) ** 2 + (y - mean_y) ** 2\n\n        if value < best_value:\n            best_value = value\n            best_point = point\n\n    return best_point'
            }
            label={"Код на Python: def center_squared(cluster):"}
            language="python"
          />
          <CodeBlock
            code={
              "cluster = [(0, 0), (1, 0), (2, 0), (3, 0), (100, 0)]\nprint(center_squared(cluster), center_sum(cluster))"
            }
            label={
              "Код на Python: cluster = [(0, 0), (1, 0), (2, 0), (3, 0), (100, 0)]"
            }
            language="python"
            output={"(3, 0) (2, 0)"}
          />
          <Typography.Text>
            Мы дважды прошли по точкам, а не сравнивали каждую с каждой. Это
            ускорение следует из формулы, поэтому сохраняет правильность. Но оно
            относится именно к{" "}
            <strong>сумме квадратов евклидовых расстояний</strong>. Доказанное
            выше ускорение через ближайшую к среднему точку нельзя переносить на
            другую формулу расстояния — например, на манхэттенскую —
            автоматически.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "simmetriya",
      navLabel: "Симметрия расстояния",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Первое точное ускорение поиска центра использует симметрию
              расстояния.
            </strong>{" "}
            В исходном алгоритме расстояние между <Notation>{"A"}</Notation> и{" "}
            <Notation>{"B"}</Notation> вычисляется дважды: когда кандидатом
            является <Notation>{"A"}</Notation> и когда кандидатом является{" "}
            <Notation>{"B"}</Notation>. Но d(A, B) = d(B, A). Можно вычислить
            его один раз и добавить одновременно в обе суммы.
          </Typography.Text>
          <Typography.Text>
            Для этого создаём отдельную сумму для каждой точки:{" "}
            <Notation>{"totals = [0.0] * len(cluster)"}</Notation>. Если точек
            четыре, получится <Notation>{"[0.0, 0.0, 0.0, 0.0]"}</Notation>.
            Полная функция:
          </Typography.Text>
          <CodeBlock
            code={
              "def center_sum_pairs(cluster):\n    n = len(cluster)\n    totals = [0.0] * n\n\n    for i in range(n):\n        for j in range(i + 1, n):\n            d = dist(cluster[i], cluster[j])\n\n            totals[i] += d\n            totals[j] += d\n\n    best_index = totals.index(min(totals))\n\n    return cluster[best_index]"
            }
            label={"Полная функция"}
            language="python"
          />
          <Typography.Text>
            <Notation>{"range(n)"}</Notation> создаёт последовательность номеров
            0, 1, 2, …, n − 1. Внутренний цикл начинается с{" "}
            <Notation>{"i + 1"}</Notation>, поэтому перебираются только пары, в
            которых второй номер больше первого. Для четырёх точек это (0, 1),
            (0, 2), (0, 3), (1, 2), (1, 3), (2, 3).
          </Typography.Text>
          <Typography.Text>
            Пара <Notation>{"(1, 0)"}</Notation> не нужна: она уже учтена как{" "}
            <Notation>{"(0, 1)"}</Notation>. Расстояние от точки до самой себя
            тоже не вычисляется.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.clPairsGrid4}
            caption={
              <>
                Все пары номеров четырёх точек: нужны только 6 клеток над
                диагональю. Диагональ — расстояние до себя, под ней — те же пары
                в обратном порядке.
              </>
            }
          />
          <Typography.Text>
            Число различных пар — m(m − 1) / 2, примерно вдвое меньше исходных
            m². После завершения циклов <Notation>{"min(totals)"}</Notation>{" "}
            находит наименьшую сумму,{" "}
            <PythonTerm term="listops">
              <Notation>{"totals.index(...)"}</Notation>
            </PythonTerm>{" "}
            — номер её первого появления, и по этому номеру возвращаем исходную
            точку <Notation>{"cluster[best_index]"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={"print(center_sum_pairs(cluster), center_sum_pairs(line))"}
            label={
              "Код на Python: print(center_sum_pairs(cluster), center_sum_pairs(line))"
            }
            language="python"
            output={"(2, 0) (2, 0)"}
          />
          <Typography.Text>
            Порядок роста остаётся квадратичным, но вычислений расстояния
            становится меньше. При этом нам не нужна таблица всех попарных
            расстояний: достаточно списка сумм длины m. Хранить огромную матрицу
            расстояний ради единственного поиска центра обычно излишне.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dosrochnaya-ostanovka",
      navLabel: "Досрочная остановка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Второе точное ускорение — досрочно прекращать проверку заведомо
              проигравшего кандидата.
            </strong>{" "}
            Допустим, для уже проверенной точки сумма равна 500. Для нового
            кандидата посчитана только часть расстояний, а сумма уже равна 520.
          </Typography.Text>
          <Typography.Text>
            Оставшиеся расстояния неотрицательны. Следовательно, итоговая сумма{" "}
            <strong>не станет меньше 520</strong> и не сможет улучшить результат
            500. Можно остановить внутренний цикл —{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>{" "}
            завершает ближайший цикл, внутри которого находится, здесь —
            внутренний. Запусти по шагам на двух точках и посмотри, на каком
            кандидате срабатывает <Notation>{"break"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runCenterSumEarly}
            label={
              "Запусти по шагам на двух точках и посмотри, на каком кандидате срабатывает break"
            }
          />
          <Typography.Text>
            Первый кандидат (0; 0) даёт сумму 0 + 5 = 5. У второго, (5; 0), уже
            первое слагаемое 5 не меньше лучшей суммы 5 — внутренний цикл
            прерывается, второе слагаемое не считается. Равный результат не
            заменяет найденную точку.
          </Typography.Text>
          <Typography.Text>
            Условие <Notation>{">="}</Notation> безопасно, если нас интересует
            любое улучшение строгого минимума, а равный результат не должен
            заменять уже найденную точку.
          </Typography.Text>
          <Typography.Text>
            Почему ускорение точное? Потому что мы отбрасываем кандидата только
            после доказательства, что он уже не может улучшить ответ. Это
            отличается от предположения «точка выглядит слишком далёкой, поэтому
            проверять её не будем».
          </Typography.Text>
          <Typography.Text>
            Такое ускорение не меняет худший квадратичный порядок работы и не
            обязано давать одинаковый выигрыш на любых данных. Парный подсчёт и
            досрочное прекращение — два разных способа организации вычислений.
            Не нужно пытаться механически вставить один в другой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bez-garantii",
      navLabel: "Сокращения без гарантии",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Некоторые популярные сокращения поиска не дают гарантии
              правильного ответа.
            </strong>{" "}
            Например:
          </Typography.Text>
          <ul>
            <li>проверить только несколько ближайших к среднему точек;</li>
            <li>взять случайную часть данных;</li>
            <li>округлить координаты перед поиском центра;</li>
            <li>проверять каждую десятую строку;</li>
            <li>
              найти приблизительный центр на рисунке и взять ближайшую точку.
            </li>
          </ul>
          <Typography.Text>
            Такие способы могут оказаться полезными для предварительного
            анализа, но как окончательное решение требуют отдельного
            доказательства. Если правильный центр не попал в рассмотренную часть
            точек, программа его уже не найдёт.
          </Typography.Text>
          <Typography.Text>
            Для построения чернового рисунка иногда можно показать часть очень
            большого набора. Для окончательного поиска центра по условию обычно
            нужны все соответствующие точки.
          </Typography.Text>
          <Typography.Text>
            Метод <Notation>{"k-means"}</Notation>, который тоже встречается в
            материалах о кластеризации, работает с другой постановкой и
            использует средние координаты. Его результат нельзя автоматически
            считать ответом на задачу о точке кластера с минимальной суммой
            обычных расстояний.
          </Typography.Text>
          <Typography.Text>
            Тебе важнее научиться переводить определение из условия в
            вычисление, чем запоминать названия методов.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "centry-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Минимакс: для кандидата — наибольшее расстояние, выбираем
                    наименьшее; радиус — это и есть найденный максимум.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Антицентр по наибольшей сумме — тот же перебор с{" "}
                    <Notation>{'-float("inf")'}</Notation> и{" "}
                    <Notation>{">"}</Notation>; самая далёкая от центра точка —
                    одно расстояние без суммы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Центр по сумме квадратов — ближайшая к средней точке
                    исходная точка; только для квадратов евклидовых расстояний.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Парный подсчёт и досрочный <Notation>{"break"}</Notation>{" "}
                    ускоряют перебор, не меняя ответ; выборки и округления —
                    меняют.
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
          <Notation>{"(2, 0)"}</Notation>, <Notation>{"(3, 0)"}</Notation>,{" "}
          <Notation>{"(7, 0)"}</Notation>, <Notation>{"(12, 0)"}</Notation>{" "}
          найди центр по минимальному максимальному расстоянию и центр по
          минимальной сумме расстояний.
        </>
      ),
      reveal: (
        <>
          По минимаксу — <Notation>{"(7, 0)"}</Notation>: самая далёкая точка на
          расстоянии 7. По сумме — <Notation>{"(3, 0)"}</Notation>: сумма 17.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Для точек <Notation>{"(0, 0)"}</Notation>,{" "}
          <Notation>{"(1, 0)"}</Notation>, <Notation>{"(4, 0)"}</Notation>,{" "}
          <Notation>{"(5, 0)"}</Notation>, <Notation>{"(30, 0)"}</Notation>{" "}
          найди центр по минимальной сумме квадратов расстояний, не считая сами
          суммы квадратов. Совпадает ли он с центром по сумме расстояний?
        </>
      ),
      reveal: (
        <>
          <Notation>{"(5, 0)"}</Notation>: средняя точка 8, ближе всех к ней 5.
          По сумме расстояний центр другой — <Notation>{"(4, 0)"}</Notation>.
        </>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          Найди антицентр — точку с наибольшей суммой расстояний — среди{" "}
          <Notation>{"(0, 0)"}</Notation>, <Notation>{"(1, 0)"}</Notation>,{" "}
          <Notation>{"(2, 0)"}</Notation>, <Notation>{"(10, 0)"}</Notation>.
        </>
      ),
      reveal: (
        <>
          <Notation>{"(10, 0)"}</Notation>: сумма 10 + 9 + 8 = 27.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Сколько расстояний вычислит <Notation>{"center_sum_pairs"}</Notation>{" "}
          для кластера из 5 точек? Из 1000 точек?
        </>
      ),
      reveal: <>5 · 4 / 2 = 10; 1000 · 999 / 2 = 499 500.</>,
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          Почему в <Notation>{"center_sum_early"}</Notation> нельзя прерывать
          внутренний цикл условием <Notation>{"total > best_sum / 2"}</Notation>
          ?
        </>
      ),
      reveal: (
        <>
          Сумма, которая уже больше половины лучшей, в итоге ещё может оказаться
          меньше лучшей: оставшиеся слагаемые бывают малы. Например, при лучшей
          сумме 10 кандидат с частичной суммой 6 и оставшимися расстояниями 1 и
          1 даёт 8 — он лучше. Отбрасывать можно, только когда{" "}
          <Notation>{"total"}</Notation> уже не меньше всей лучшей суммы.
        </>
      ),
    },
  ],
};

export default content;
