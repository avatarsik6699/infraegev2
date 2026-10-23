// Paid content (Change 192): served only after an access check; never
// import it statically.
import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./data-analysis.paid.praktika.media";
import { R } from "./data-analysis.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          После каждого шага выводи то, что можно проверить глазами: число
          точек, размеры кластеров, центры. Ошибка видна сразу, а не в ответе.
        </strong>{" "}
        После чтения — <Notation>{"len(points)"}</Notation> и{" "}
        <Notation>{"points[:5]"}</Notation>, после разделения — размеры групп и
        аномалии:
      </Typography.Text>
      <CodeBlock
        code={
          'print("Кластеров:", len(clusters))\nfor cluster in clusters:\n    print("Размер:", len(cluster))\nprint(sum(len(c) for c in clusters) + len(noise), len(points))'
        }
        label={"Проверка разделения"}
        language="python"
      />
      <Typography.Text>
        Сумма размеров с аномалиями должна совпасть с числом точек. Совпадение
        ещё не доказательство — одну точку можно потерять, а другую учесть
        дважды, — поэтому нарисуй кластеры разными маркерами и центры поверх:
      </Typography.Text>
      <CodeBlock
        code={
          'import matplotlib.pyplot as plt\n\nfor cluster in clusters:\n    plt.scatter([p[0] for p in cluster], [p[1] for p in cluster], s=3)\nplt.scatter([c[0] for c in centers], [c[1] for c in centers],\n            s=100, marker="x", color="black")\nplt.axis("equal")\nplt.show()'
        }
        label={"Проверочный рисунок"}
        language="python"
      />
      <LessonDiagram
        {...lessonMedia.clScatterexample27txt_x5_5f1241}
        caption={
          <>
            Проверочный рисунок файла example27.txt: кластеры разными маркерами,
            граница x = 5, центры (1; 1) и (11; 1) обведены.
          </>
        }
      />
      <Typography.Text>
        Каждая граница должна проходить по пустому месту, а центр — лежать в
        своём кластере. Выбери ошибку, чтобы увидеть, как её поймать:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "первая строка",
            value: <>Первую строку пропустили, хотя заголовка нет</>,
            note: <>сравни число точек с числом строк файла</>,
          },
          {
            label: "запятая",
            value: <>Десятичную запятую не заменили точкой</>,
            note: (
              <>
                <Notation>{"float"}</Notation> остановится с{" "}
                <Notation>{"ValueError"}</Notation> — посмотри первые строки
              </>
            ),
          },
          {
            label: "градусы",
            value: (
              <>
                Полярный угол передан в <Notation>{"cos"}</Notation> без{" "}
                <Notation>{"radians"}</Notation>
              </>
            ),
            note: <>переведи (90; 2) вручную: должно выйти (0; 2)</>,
          },
          {
            label: "последний else",
            value: <>Аномалии попали в последний кластер</>,
            note: <>число в noise должно совпасть с условием</>,
          },
          {
            label: "чужие границы",
            value: <>Границы взяты из другого файла</>,
            note: <>построй рисунок своего файла</>,
          },
          {
            label: "сумма кандидата",
            value: (
              <>
                <Notation>{"total = 0.0"}</Notation> стоит до внешнего цикла
              </>
            ),
            note: <>на пяти точках на прямой центр должен выйти средним</>,
          },
          {
            label: "среднее",
            value: <>Средняя точка принята за центр</>,
            note: <>центр обязан быть одной из точек кластера</>,
          },
          {
            label: "формула",
            value: <>Центр искали по dist, а в условии разность энергий</>,
            note: <>сверь, какое «расстояние» названо в определении центра</>,
          },
          {
            label: "сортировка",
            value: <>Кластеры переставили, а центры нет</>,
            note: <>ищи центры после sorted, а не до</>,
          },
          {
            label: "пары вне кластера",
            value: <>Пары нужного вида собраны по всему файлу</>,
            note: <>список отобранных собирай заново в каждом кластере</>,
          },
          {
            label: "модуль и round",
            value: (
              <>
                Модуль взят не на том шаге или <Notation>{"round"}</Notation>{" "}
                вместо целой части
              </>
            ),
            note: <>перечитай последнее предложение условия по словам</>,
          },
          {
            label: "имя файла",
            value: (
              <>
                Латинская <Notation>{"A"}</Notation> вместо кириллической{" "}
                <Notation>{"А"}</Notation>
              </>
            ),
            note: <>скопируй имя файла, а не набирай его</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любое задание 27 решается в четыре шага: прочитать записи, разделить
          на кластеры, найти центры по определению из условия и собрать ответ.
        </strong>{" "}
        До кода запиши словами три вещи: какие точки объединяются, какую
        величину сравниваем для кандидатов и из каких объектов собираем ответ.
        Всё главное из подтем — на одной схеме; номер раздела ведёт на подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 27 на одной схеме"}
        flow={[
          { name: "Записи", note: "прочитать файл и построить рисунок" },
          {
            name: "Кластеры",
            note: "правило: каждая точка — ровно в одну группу",
          },
          { name: "Центры", note: "перебор кандидатов по величине из условия" },
          { name: "Ответ", note: "из каких объектов и в каком виде" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="tochki-i-rasstoyaniya">
                Точки, расстояния и файл
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"dist(a, b)"}</Notation>,
                note: <>√(Δx² + Δy²); с порогом — квадраты</>,
              },
              {
                key: <Notation>{'replace(",", ".").split()'}</Notation>,
                note: <>запятая, пробелы, табуляция</>,
              },
              {
                key: <Notation>{'code[0] in "OBAFGKM"'}</Notation>,
                note: (
                  <>
                    класс есть не у всех: <Notation>{"VII"}</Notation>
                  </>
                ),
              },
              {
                key: <>E = m(vx² + vy²) / 2</>,
                note: <>x = r · cos φ, y = r · sin φ</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="razdelenie-na-klastery">
                Разделение на кластеры
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"if / elif / else"}</Notation>,
                note: <>одна группа на точку, порядок важен</>,
              },
              {
                key: (
                  <>
                    явные области + <Notation>{"noise"}</Notation>
                  </>
                ),
                note: <>аномалии не в последний кластер</>,
              },
              {
                key: <Notation>{"y < 10 - x"}</Notation>,
                note: <>сторона наклонной прямой</>,
              },
              {
                key: <>границы в пустых промежутках</>,
                note: <>по координате, углу или энергии</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="centr-klastera">
                Центр кластера
              </SubtopicLink>
            ),
            rows: [
              {
                key: (
                  <>
                    <Notation>{"total = 0.0"}</Notation> внутри цикла
                  </>
                ),
                note: <>новая сумма для каждого кандидата</>,
              },
              {
                key: <>средняя точка ≠ центр</>,
                note: <>и ближайшая к ней — тоже</>,
              },
              {
                key: <Notation>{"center_sum(g, energy_gap)"}</Notation>,
                note: <>своя формула расстояния</>,
              },
              {
                key: <>расстояние × вес</>,
                note: <>вес той точки, до которой считаем</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="otvet-po-centram">
                Ответ по центрам
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"sum(c[0] for c in centers)"}</Notation>,
                note: <>каждый центр один раз</>,
              },
              {
                key: <Notation>{"sorted(clusters, key=len)"}</Notation>,
                note: <>центры — после сортировки</>,
              },
              {
                key: (
                  <>
                    <Notation>{"key="}</Notation> своя функция
                  </>
                ),
                note: <>кластер по числу объектов вида</>,
              },
              {
                key: <Notation>{"int(v * 10000)"}</Notation>,
                note: (
                  <>
                    не <Notation>{"round"}</Notation>; модуль — на своём шаге
                  </>
                ),
              },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="rasstoyaniya-i-pary">
                Расстояния и пары
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>центр до цикла</>,
                note: <>радиус без повторного поиска</>,
              },
              {
                key: (
                  <>
                    <Notation>{"j"}</Notation> от <Notation>{"i + 1"}</Notation>
                  </>
                ),
                note: <>пары точек, диаметр ≤ 2R</>,
              },
              {
                key: <>по точке из двух кластеров</>,
                note: <>межкластерный диаметр и его концы</>,
              },
              {
                key: <>отбор вида внутри кластера</>,
                note: <>задача темы: Q₁ и Q₂</>,
              },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="sosedi-centry-statistika">
                Соседи, другие центры и статистика
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              {
                key: <Notation>{"split_clusters(points, eps)"}</Notation>,
                note: <>цепочки соседей вместо границ</>,
              },
              {
                key: <>минимакс, антицентр, квадраты</>,
                note: <>другие определения центра</>,
              },
              {
                key: <Notation>{"(-видимых, до начала)"}</Notation>,
                note: <>точка наведения</>,
              },
              {
                key: <>r Пирсона, Q1 − 1,5 · IQR</>,
                note: <>корреляция и выбросы</>,
              },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вещи, которые записывают словами до кода",
            steps: [
              <>Какие точки объединяются в кластеры?</>,
              <>Какую величину сравниваем для кандидатов?</>,
              <>Из каких объектов собираем окончательный ответ?</>,
            ],
          },
        ]}
        caption={
          <>
            Шпаргалка темы: порядок решения и главное из каждой подтемы. Номер
            раздела ведёт на подтему.
          </>
        }
      />
      <Typography.Text>
        <strong>Файлы А и Б читай как два отдельных задания.</strong> Иногда для
        них различаются и запрашиваемые величины: в демоверсии 2026 года для
        файла А нужны минимальные координаты центров, а для Б — расстояния. Не
        переноси формулу ответа с А на Б автоматически.
      </Typography.Text>
      <Typography.Text>
        <strong>Что дальше.</strong> Если задачи этой страницы получаются,
        основные подтемы освоены. Дополнительный урок разбирает редкие задачи:
        цепочки соседей, минимакс и антицентр, точку наведения, корреляцию и
        выбросы.
      </Typography.Text>
    </>
  ),
};

export default content;
