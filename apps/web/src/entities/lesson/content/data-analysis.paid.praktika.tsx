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
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Проверять нужно не только напечатанные числа, но и промежуточный смысл
          результата.
        </strong>{" "}
        После чтения — <Notation>{'print("Точек:", len(points))'}</Notation> и{" "}
        <Notation>{"print(points[:5])"}</Notation>. После разделения —
        количество кластеров и размер каждого:
      </Typography.Text>
      <CodeBlock
        code={
          'print("Кластеров:", len(clusters))\n\nfor cluster in clusters:\n    print("Размер:", len(cluster))'
        }
        label={"После разделения — количество кластеров и размер каждого"}
        language="python"
      />
      <Typography.Text>
        После нахождения центров —{" "}
        <Notation>{'print("Центр:", center)'}</Notation> для каждого. Если все
        точки должны быть распределены и аномалий нет, сравни{" "}
        <Notation>{"sum(len(cluster) for cluster in clusters)"}</Notation> с{" "}
        <Notation>{"len(points)"}</Notation>; если есть{" "}
        <Notation>{"noise"}</Notation> — сумму размеров плюс{" "}
        <Notation>{"len(noise)"}</Notation>.
      </Typography.Text>
      <Typography.Text>
        Совпадение количества — необходимая проверка, но само по себе не
        доказывает правильность: одну точку можно потерять, а другую случайно
        учесть дважды. Нужно также проверить сам способ распределения.
      </Typography.Text>
      <Typography.Text>Для выбранного центра:</Typography.Text>
      <ul>
        <li>
          он должен принадлежать своему кластеру, если это требуется условием;
        </li>
        <li>его координаты должны соответствовать области кластера;</li>
        <li>он должен вычисляться по правильному критерию.</li>
      </ul>
      <Typography.Text>
        Удобно нарисовать выделенные кластеры разными цветами, а найденные
        центры — более крупными маркерами:
      </Typography.Text>
      <CodeBlock
        code={
          'import matplotlib.pyplot as plt\n\nfor cluster in clusters:\n    xs = [point[0] for point in cluster]\n    ys = [point[1] for point in cluster]\n\n    plt.scatter(xs, ys, s=3)\n\ncx = [point[0] for point in centers]\ncy = [point[1] for point in centers]\n\nplt.scatter(cx, cy, s=100, marker="x", color="black")\n\nplt.axis("equal")\nplt.grid()\nplt.show()'
        }
        label={"Код на Python: import matplotlib.pyplot as plt"}
        language="python"
      />
      <Typography.Text>
        Такой рисунок должна построить программа:
      </Typography.Text>
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
        Рисунок помогает заметить ошибку, но не заменяет вычисление критерия.
        Необычно расположенный центр не обязательно неправильный, особенно у
        вытянутой или несимметричной группы.
      </Typography.Text>
      <Typography.Text>
        <strong>
          Частые ошибки можно связать с тем этапом, на котором они возникают.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, почему получается неверно:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка → почему получается неверно"}
        variants={[
          {
            label: "первая строка",
            value: <>Пропустить первую строку без проверки</>,
            note: <>можно потерять первую точку</>,
          },
          {
            label: "int вместо float",
            value: (
              <>
                Читать дробные координаты как <Notation>{"int"}</Notation>
              </>
            ),
            note: (
              <>
                формат не подходит или теряется нужная точность при
                дополнительном преобразовании
              </>
            ),
          },
          {
            label: "запятая",
            value: <>Не заменить десятичную запятую</>,
            note: (
              <>
                <Notation>{"float"}</Notation> не сможет прочитать число
              </>
            ),
          },
          {
            label: "чужие границы",
            value: <>Взять границы из чужого решения</>,
            note: <>они относятся к другому файлу</>,
          },
          {
            label: "последний else",
            value: <>Включить всё оставшееся в последний кластер</>,
            note: <>туда могут попасть аномалии</>,
          },
          {
            label: "соседи первой",
            value: <>Найти соседей только первой точки</>,
            note: <>не будет пройдена вся цепочка</>,
          },
          {
            label: "большой порог",
            value: <>Использовать слишком большой порог</>,
            note: <>разные группы могут соединиться</>,
          },
          {
            label: "среднее",
            value: <>Принять среднее за центр по сумме расстояний</>,
            note: <>это разные задачи</>,
          },
          {
            label: "без корней",
            value: <>Убрать корни в сумме расстояний</>,
            note: <>получится сумма квадратов</>,
          },
          {
            label: "сумма кандидата",
            value: <>Не обнулять сумму для нового кандидата</>,
            note: <>суммы кандидатов смешаются</>,
          },
          {
            label: "весь файл",
            value: <>Считать расстояния до всего файла</>,
            note: <>вместо своего кластера учитываются чужие точки</>,
          },
          {
            label: "сортировка",
            value: <>Переставить кластеры, но не центры</>,
            note: <>нарушится соответствие</>,
          },
          {
            label: "центр в цикле",
            value: <>Искать центр внутри цикла по точкам повторно</>,
            note: <>время работы резко увеличится</>,
          },
          {
            label: "число групп",
            value: <>Забыть изменить число групп после исключения</>,
            note: <>среднее делится на неправильное число</>,
          },
          {
            label: "модуль",
            value: <>Взять модуль до усреднения или до минимума</>,
            note: <>изменится математическое выражение</>,
          },
          {
            label: "round",
            value: (
              <>
                Использовать <Notation>{"round"}</Notation> вместо требуемой
                целой части
              </>
            ),
            note: <>получится другое целое</>,
          },
          {
            label: "set",
            value: (
              <>
                Удалить повторы через <Notation>{"set"}</Notation>
              </>
            ),
            note: <>может измениться смысл исходных наблюдений</>,
          },
          {
            label: "имя файла",
            value: (
              <>
                Латинская <Notation>{"A"}</Notation> и кириллическая{" "}
                <Notation>{"А"}</Notation> в имени файла
              </>
            ),
            note: <>для компьютера это разные символы</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любое задание 27 решается одним порядком: прочитать точки, разделить
          их на кластеры, найти центры по определению из условия и собрать ответ
          из нужных объектов.
        </strong>{" "}
        Ошибки удобнее ловить по шагам — после каждого шага проверяя
        промежуточный смысл, а не только напечатанные числа.
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему, а ниже схемы каждый шаг разобран подробнее.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 27 на одной схеме"}
        flow={[
          { name: "Точки", note: "прочитать файл и посмотреть на рисунок" },
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
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="tochki-i-rasstoyaniya"
              >
                Точки и расстояния
              </SubtopicLink>
            ),
            rows: [
              {
                key: (
                  <>
                    <Notation>{"(x, y)"}</Notation>,{" "}
                    <Notation>{"[[…], […]]"}</Notation>
                  </>
                ),
                note: <>точка, кластер, все кластеры</>,
              },
              {
                key: (
                  <>
                    <Notation>{"dist(a, b)"}</Notation>
                  </>
                ),
                note: <>√(Δx² + Δy²)</>,
              },
              {
                key: (
                  <>
                    <Notation>{"dx*dx + dy*dy <= r*r"}</Notation>
                  </>
                ),
                note: <>сравнение с порогом без корня</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="fajl-s-tochkami"
              >
                Файл
              </SubtopicLink>
            ),
            rows: [
              {
                key: (
                  <>
                    <Notation>{'replace(",", ".").split()'}</Notation>
                  </>
                ),
                note: <>запятая, пробелы, табуляция</>,
              },
              {
                key: (
                  <>
                    <Notation>{"has_header=True"}</Notation>
                  </>
                ),
                note: <>только если есть заголовок</>,
              },
              {
                key: (
                  <>
                    <Notation>{'code[0] in "OBAFGKM"'}</Notation>
                  </>
                ),
                note: (
                  <>
                    класс есть не у всех: <Notation>{"VII"}</Notation>
                  </>
                ),
              },
              { key: <>E = m(vx² + vy²) / 2</>, note: <>энергия частицы</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="razdelenie-na-klastery"
              >
                Разделение
              </SubtopicLink>
            ),
            rows: [
              {
                key: (
                  <>
                    <Notation>{"if / elif / else"}</Notation>
                  </>
                ),
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
                key: (
                  <>
                    <Notation>{"(angle - start) % 360 <= width"}</Notation>
                  </>
                ),
                note: <>сектор через 0°</>,
              },
              {
                key: <>границы в пустых промежутках</>,
                note: <>по координате или по энергии</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="centr-klastera"
              >
                Центр
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
                key: <>расстояние из условия</>,
                note: (
                  <>
                    |E₁ − E₂| вместо <Notation>{"dist"}</Notation>
                  </>
                ),
              },
              { key: <>m² в своём кластере</>, note: <>не по всему файлу</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="otvet-po-centram"
              >
                Ответ по центрам
              </SubtopicLink>
            ),
            rows: [
              {
                key: (
                  <>
                    <Notation>{"sum(c[0] for c in centers)"}</Notation>
                  </>
                ),
                note: <>каждый центр один раз</>,
              },
              {
                key: (
                  <>
                    <Notation>{"sorted(clusters, key=len)"}</Notation>
                  </>
                ),
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
                key: (
                  <>
                    <Notation>{"int(v * 10000)"}</Notation>
                  </>
                ),
                note: (
                  <>
                    не <Notation>{"round"}</Notation>; модуль — на своём шаге
                  </>
                ),
              },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="rasstoyaniya-i-pary"
              >
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
                key: (
                  <>
                    <Notation>{"<"}</Notation> или <Notation>{"<="}</Notation>,
                    чьи точки
                  </>
                ),
                note: <>подсчёт в радиусе</>,
              },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="cepochki-sosedej"
              >
                Цепочки соседей
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              {
                key: (
                  <>
                    <Notation>{"split_clusters(points, eps)"}</Notation>
                  </>
                ),
                note: <>компоненты связности</>,
              },
              { key: <>несколько порогов</>, note: <>устойчивое разделение</> },
              {
                key: <>маленькие группы</>,
                note: <>аномалии — только по условию</>,
              },
            ],
          },
          {
            number: 8,
            title: (
              <SubtopicLink
                routeSlug="27-analiz-dannyh-i-klasterizatsiya"
                subtopic="drugie-centry-i-uskoreniya"
              >
                Другие центры
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>минимакс</>, note: <>наименьший наибольший радиус</> },
              {
                key: <>антицентр</>,
                note: (
                  <>
                    <Notation>{"-inf"}</Notation> и <Notation>{">"}</Notation>
                  </>
                ),
              },
              {
                key: <>сумма квадратов</>,
                note: <>ближайшая к средней точке</>,
              },
              {
                key: (
                  <>
                    пары и <Notation>{"break"}</Notation>
                  </>
                ),
                note: <>точные ускорения</>,
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
        <strong>
          Для реального задания удобно сначала составить короткое описание
          вычислений обычными словами.
        </strong>{" "}
        Например:
      </Typography.Text>
      <ol>
        <li>Прочитать точки файла Б.</li>
        <li>Выделить три кластера. Исключить три аномальные точки.</li>
        <li>Найти центры по минимуму суммы обычных расстояний.</li>
        <li>
          Определить самый маленький и самый большой кластеры. Посчитать
          расстояние между их центрами.
        </li>
        <li>
          Отдельно найти максимальное расстояние от центра до точки своего
          кластера.
        </li>
        <li>Преобразовать оба результата по условию.</li>
      </ol>
      <Typography.Text>
        Такое описание <strong>сразу выявляет места</strong>, в которых нельзя
        использовать старый шаблон без изменений.
      </Typography.Text>
      <Typography.Text>
        Перед написанием кода полезно ответить себе на такие вопросы. Выбери
        вопрос, чтобы увидеть, какой ответ нужен:
      </Typography.Text>
      <VariantPicker
        label={"Что выяснить → какой ответ нужен"}
        variants={[
          {
            label: "строка файла",
            value: <>Что находится в строке файла?</>,
            note: <>две координаты или ещё дополнительные данные</>,
          },
          {
            label: "служебные строки",
            value: <>Есть ли служебные строки?</>,
            note: <>заголовок, количество записей</>,
          },
          {
            label: "кластеры",
            value: <>Как определены кластеры?</>,
            note: <>области, соседство, другая геометрия</>,
          },
          {
            label: "сколько кластеров",
            value: <>Сколько кластеров должно остаться?</>,
            note: <>число из условия</>,
          },
          {
            label: "аномалии",
            value: <>Есть ли аномалии?</>,
            note: <>какие записи и сколько исключаются</>,
          },
          {
            label: "центры",
            value: <>Какие центры допустимы?</>,
            note: <>только исходные точки или любые точки плоскости</>,
          },
          {
            label: "величина",
            value: <>Что оптимизируется?</>,
            note: <>сумма, сумма квадратов, максимум, другая величина</>,
          },
          {
            label: "расстояние",
            value: <>Как определяется расстояние?</>,
            note: <>конкретная формула</>,
          },
          {
            label: "после центров",
            value: <>Что вычисляется после центров?</>,
            note: <>среднее, минимум координат, расстояния, количество</>,
          },
          {
            label: "результат",
            value: <>Как оформляется результат?</>,
            note: <>модуль, множитель, целая часть, порядок чисел</>,
          },
        ]}
      />
      <Typography.Text>
        <strong>
          Файлы А и Б нужно читать как два отдельных набора требований.
        </strong>{" "}
        В некоторых задачах для них различается не только объём данных, но и
        сами запрашиваемые величины. Например, в демоверсии 2026 года для А
        нужны минимальные координаты центров, а для Б — характеристики
        расстояний. Не переноси формулу ответа для А на Б автоматически.
      </Typography.Text>
      <Typography.Text>
        <strong>Что дальше.</strong> Если задачи этой страницы получаются,
        основные подтемы освоены. Дополнительный урок 7 показывает второй способ
        разделения — цепочки соседей, урок 8 — редкие определения центра
        (минимакс, антицентр, сумма квадратов) и точные ускорения поиска.
      </Typography.Text>
      <Typography.Text>
        При решении каждого файла сначала запиши словами три вещи:{" "}
        <strong>
          какие точки объединяются, какую величину сравниваем для кандидатов и
          из каких объектов собираем окончательный ответ
        </strong>
        . Затем переводи каждое из этих правил в свой небольшой фрагмент
        программы.
      </Typography.Text>
    </>
  ),
};

export default content;
