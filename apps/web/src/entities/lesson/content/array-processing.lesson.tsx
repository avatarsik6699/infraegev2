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
import { arrayProcessingLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./array-processing.media";
import { R, THEME_TASK } from "./array-processing.theme";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const arrayProcessingLesson = defineLesson({
  ...arrayProcessingLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Читать файл по описанию формата, хранить объект записью и сортировать записи по ключу",
    "Переводить правила рейтинга в ключ сортировки и находить границу прохода",
    "Набирать больше всего объектов при ограниченной сумме и находить наибольший при таком количестве",
    "Строить цепочки вложенных коробок и пары из двух наборов двумя указателями",
    "Собирать позиции по рядам, находить свободные места и серии, накапливать по ключу",
    "Выбирать мероприятия, объединять интервалы и считать нагрузку событиями",
    "Исполнять правила процесса — камера хранения, очереди, процедуры — и решать задачу темы",
    "Для редких задач — пары, окно, куча и сложные цепочки (дополнительный урок)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "zapisi-i-rejting",
      title: "Записи, сортировка и рейтинг",
      lead: "Что спрашивают в задании 26, как прочитать файл, хранить объект записью и сортировать по ключу; рейтинг и граница прохода.",
      conceptIds: [
        "kak-ustroena-tema-26",
        "obekt",
        "ogranicheniya-i-cel",
        "chtenie-fayla",
        "sortirovka",
        "klyuch-reytinga",
        "vychislyaemye-pokazateli",
        "granica-prohoda",
        "zapisi-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Что выведет{" "}
              <Notation>{"print(*sorted([(2, 5), (1, 7), (2, 3)]))"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"(1, 7) (2, 3) (2, 5)"}</Notation>: при равных первых
              числах решает второе.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Записи <Notation>{"(id, score, time)"}</Notation>. Правила: больше
              баллов — выше; при равенстве меньше время — выше; при полном
              равенстве больше ID — выше. Запиши ключ сортировки.
            </>
          ),
          reveal: (
            <>
              <Notation>{"key=lambda x: (-x[1], x[2], -x[0])"}</Notation>: минус
              у баллов и у ID — по убыванию, время — по возрастанию.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Мероприятия (5, 9), (1, 20), (7, 8). Начала и окончания
              отсортировали отдельно и собрали пары по порядку. Какие пары
              получились и каких из них не было в данных?
            </>
          ),
          reveal: (
            <>
              Получились (1, 8), (5, 9), (7, 20); мероприятий (1, 8) и (7, 20) в
              данных не было.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              В файле 20 000 чисел. Сколько всего пар разных элементов придётся
              проверить перебором всех пар и примерно сколько сравнений займёт
              сортировка (log₂ 20 000 ≈ 14,3)?
            </>
          ),
          reveal: (
            <>
              199 990 000 пар, сортировка — около 286 000 сравнений: 20 000 · 19
              999 / 2 против 20 000 · 14,3.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Ячейка освободилась в минуту 404, следующий пассажир пришёл тоже в
              404. Можно ли положить его багаж в эту ячейку по правилу задачи
              темы?
            </>
          ),
          reveal: (
            <>
              Нет: ячейку можно занять со следующей минуты, то есть с 405.
              Проверка — <Notation>{"free_at < start"}</Notation>, а 404 {"<"}{" "}
              404 — ложь.
            </>
          ),
        },
      ],
    },
    {
      slug: "zhadnyj-vybor",
      title: "Жадный выбор",
      lead: "Больше всего объектов — самые маленькие первыми; наибольший объект при таком количестве; обязательные объекты, покупки партиями и скидки.",
      conceptIds: [
        "bolshe-vsego-faylov",
        "zhadnyy-algoritm",
        "samyy-bolshoy-fayl",
        "vazhnye-pervymi",
        "pokupka-partiyami",
        "dva-tipa",
        "skidki",
        "zhadnyy-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Вместимость 15, файлы в порядке записи 9, 20, 3. Что выведет
              программа с <Notation>{"break"}</Notation> без сортировки и какой
              ответ верный?
            </>
          ),
          reveal: (
            <>
              Без сортировки — 1: цикл берёт 9 и останавливается на 20. Верно —
              2: файлы 3 и 9.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Вместимость 60, файлы 30, 9, 14, 6, 21. Сколько файлов можно
              сохранить и какой наибольший файл может оказаться среди них?
            </>
          ),
          reveal: (
            <>
              4 и 30. По возрастанию: 6 + 9 + 14 + 21 = 50, с 30 уже 80. Три
              самых маленьких занимают 29, для четвёртого свободно 31 — влезает
              30.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Почему для наибольшего файла закрепляют k − 1 самых маленьких, а
              не все k?
            </>
          ),
          reveal: (
            <>
              Последнее, k-е место отдают большому файлу. k − 1 самых маленьких
              оставляют ему наибольший возможный остаток.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Файл 34 сохранить обязательно, вместимость 60, остальные файлы 8,
              12, 15, 19, 22. Сколько файлов окажется на диске?
            </>
          ),
          reveal: (
            <>3: после 34 свободно 26, туда входят 8 и 12 (20), а 15 уже нет.</>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              «В каждой тройке бесплатен самый дешёвый товар». Цены 50, 40, 30,
              20, 10. Сколько заплатить при самом выгодном разбиении на тройки?
            </>
          ),
          reveal: (
            <>
              120: тройка 50, 40, 30 даёт бесплатно 30, а 20 и 10 тройки не
              образуют. 150 − 30 = 120.
            </>
          ),
        },
      ],
    },
    {
      slug: "cepochki-i-pary",
      title: "Цепочки коробок и пары",
      lead: "Вложенные коробки снаружи внутрь и изнутри наружу, рейсы по двое, грузы и контейнеры, детали двух видов.",
      access: "paid",
      conceptIds: [
        "cepochka-snaruzhi",
        "napravlenie-postroeniya",
        "dva-ukazatelya",
        "gruzy-i-konteynery",
        "detali-dvuh-vidov",
        "cepochki-itogo",
      ],
      paid: {
        outline: [
          { id: "cepochka-snaruzhi", navLabel: "Цепочка снаружи" },
          { id: "napravlenie-postroeniya", navLabel: "Изнутри наружу" },
          { id: "dva-ukazatelya", navLabel: "Два указателя" },
          { id: "gruzy-i-konteynery", navLabel: "Грузы и контейнеры" },
          { id: "detali-dvuh-vidov", navLabel: "Детали двух видов" },
          { id: "cepochki-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              Коробки со сторонами 12, 18, 21, 27, 34, 40 и 45; одну можно
              вложить в другую, если её сторона меньше хотя бы на 6. Как вложить
              друг в друга как можно больше коробок?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Строить цепочку снаружи: в каждую коробку класть самую большую
                из тех, что в неё помещаются.
              </strong>{" "}
              Большая коробка внутри оставляет больше места для следующих.
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./array-processing.paid.cepochki-i-pary"),
      },
    },
    {
      slug: "ryady-i-serii",
      title: "Ряды, серии и группы",
      lead: "Позиции по рядам в словаре, свободные места по разности соседних, столбцы, непрерывные серии и накопление по ключу.",
      access: "paid",
      conceptIds: [
        "mnozhestva-i-slovari",
        "svobodnye-mesta",
        "stolbcy",
        "serii",
        "liniya-s-promezhutkom",
        "izolirovannaya-tochka",
        "nakoplenie-po-klyuchu",
        "ryady-itogo",
      ],
      paid: {
        outline: [
          { id: "mnozhestva-i-slovari", navLabel: "Позиции по рядам" },
          { id: "svobodnye-mesta", navLabel: "Свободные места" },
          { id: "stolbcy", navLabel: "Столбцы" },
          { id: "serii", navLabel: "Серии" },
          { id: "liniya-s-promezhutkom", navLabel: "Линия с промежутком" },
          { id: "izolirovannaya-tochka", navLabel: "Изолированная точка" },
          { id: "nakoplenie-po-klyuchu", navLabel: "Накопление по ключу" },
          { id: "ryady-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              В строках файла — номер ряда и номер занятого места, вперемешку.
              Как узнать, что происходит в каждом ряду?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Разложить позиции по рядам в словарь «ряд → множество мест»,
                отсортировать места ряда и смотреть на соседние.
              </strong>
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./array-processing.paid.ryady-i-serii"),
      },
    },
    {
      slug: "intervaly",
      title: "Интервалы и события",
      lead: "Мероприятия по раннему окончанию и второй критерий последнего, объединение интервалов и простои, события нагрузки и окно наблюдения.",
      access: "paid",
      conceptIds: [
        "rannee-okonchanie",
        "kontrprimery",
        "vtoroy-kriteriy",
        "obedinenie-intervalov",
        "sobytiya",
        "okno-nablyudeniya",
        "intervaly-itogo",
      ],
      paid: {
        outline: [
          { id: "rannee-okonchanie", navLabel: "Раннее окончание" },
          { id: "kontrprimery", navLabel: "Почему не по началу" },
          { id: "vtoroy-kriteriy", navLabel: "Второй критерий" },
          { id: "obedinenie-intervalov", navLabel: "Объединение интервалов" },
          { id: "sobytiya", navLabel: "События" },
          { id: "okno-nablyudeniya", navLabel: "Окно наблюдения" },
          { id: "intervaly-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              В зал подали заявки на мероприятия (1, 3), (3, 5), (5, 8), (9,
              15), (12, 16). Как провести как можно больше мероприятий, чтобы
              они не пересекались?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Каждый раз брать то мероприятие, которое раньше заканчивается:
                оно раньше освобождает зал.
              </strong>
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./array-processing.paid.intervaly"),
      },
    },
    {
      slug: "modelirovanie",
      title: "Моделирование процесса",
      lead: "Выбрать или исполнить правила: камера хранения и задача темы, ячейки с ценой, очереди, заданные процедуры, журнал сервера.",
      access: "paid",
      conceptIds: [
        "vybrat-ili-ispolnit",
        "kamera-hraneniya",
        "zadacha-temy",
        "cena-i-nomer",
        "dva-vida-mest",
        "ochered",
        "upakovka-gruzov",
        "zadannaya-procedura",
        "zhurnaly-i-kopii",
        "modelirovanie-itogo",
      ],
      paid: {
        outline: [
          { id: "vybrat-ili-ispolnit", navLabel: "Выбрать или исполнить" },
          { id: "kamera-hraneniya", navLabel: "Камера хранения" },
          { id: "zadacha-temy", navLabel: "Задача темы" },
          { id: "cena-i-nomer", navLabel: "Цена и номер" },
          { id: "dva-vida-mest", navLabel: "Два вида мест" },
          { id: "ochered", navLabel: "Очередь" },
          { id: "upakovka-gruzov", navLabel: "Упаковка грузов" },
          { id: "zadannaya-procedura", navLabel: "Заданная процедура" },
          { id: "zhurnaly-i-kopii", navLabel: "Журналы и копии" },
          { id: "modelirovanie-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              «Пассажир кладёт багаж в свободную ячейку с наименьшим номером, а
              если свободных нет — уходит». Можно ли отказать раннему пассажиру,
              чтобы потом принять больше?
            </Typography.Text>
            <Typography.Text>
              <strong>
                Нет: здесь ничего не выбирают, а в точности исполняют правила
                условия. Программа хранит состояние — когда освободится каждая
                ячейка — и обрабатывает заявки по порядку.
              </strong>
            </Typography.Text>
          </>
        ),
        selfCheck: 5,
        load: () => import("./array-processing.paid.modelirovanie"),
      },
    },
    {
      slug: "pary-okno-i-cepochki",
      title: "Пары, окно и сложные цепочки",
      lead: "Подсчёт и перебор пар, скользящее окно, маршрут с особыми переходами, куча, цепочки с чередованием и растущим зазором, блоки и лучший набор.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "podschyot-i-razbienie",
        "perebor-par",
        "skolzyashchee-okno",
        "osobye-perehody",
        "kucha",
        "chereduyushchiesya-cveta",
        "rastushchiy-zazor",
        "naimenshee-chislo-blokov",
        "luchshiy-nabor",
        "dop-itogo",
      ],
      paid: {
        outline: [
          { id: "podschyot-i-razbienie", navLabel: "Подсчёт пар" },
          { id: "perebor-par", navLabel: "Перебор пар" },
          { id: "skolzyashchee-okno", navLabel: "Скользящее окно" },
          { id: "osobye-perehody", navLabel: "Особые переходы" },
          { id: "kucha", navLabel: "Куча" },
          { id: "chereduyushchiesya-cveta", navLabel: "Чередование цветов" },
          { id: "rastushchiy-zazor", navLabel: "Растущий зазор" },
          {
            id: "naimenshee-chislo-blokov",
            navLabel: "Наименьшее число блоков",
          },
          { id: "luchshiy-nabor", navLabel: "Лучший набор" },
          { id: "dop-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для редких задач.</strong> Пары
              чисел с проверкой по множеству, маршрут альпиниста, матрёшки из
              двух материалов встречаются в сборниках, но на реальных экзаменах
              их не было. Задачи основных подтем решаются без этого урока.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () => import("./array-processing.paid.pary-okno-i-cepochki"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-26",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 26 дают файл с данными о сотнях объектов — файлах,
            товарах, заявках — и правила, по которым их выбирают или
            обслуживают. Вот задача, которую мы решим в этой теме:
          </Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Почти всегда решение — сортировка записей и один проход по ним:
              либо ты сам выбираешь лучшее, либо в точности исполняешь правила
              условия.
            </strong>{" "}
            Разберём, что значат слова условия:
          </Typography.Text>
          <LessonTable
            label={"Слова условия задания 26"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "заявка, строка файла",
                "один объект — запись из нескольких чисел: (сдача, освобождение)",
              ],
              [
                "в минутах от начала суток",
                "время — целое число от 0 до 1440, его можно сравнивать и вычитать",
              ],
              [
                "свободная ячейка с наименьшим номером",
                "просматривать ячейки по порядку номеров и брать первую свободную",
              ],
              [
                "можно занять со следующей минуты",
                "ячейка свободна, если освободилась строго раньше прихода: free_at < start",
              ],
              [
                "если свободных ячеек нет, пассажир уходит",
                "заявку пропускают — ждать нельзя",
              ],
              [
                "максимальное количество, наибольший",
                "выбираем лучший вариант — помогают сортировка и жадный выбор",
              ],
              [
                "если таких несколько, …",
                "второй критерий: его применяют только среди равных по первому",
              ],
            ]}
          />
          <Typography.Text>
            Начнём с файла, записей и сортировки — на них держатся все задачи
            темы. Тема состоит из шести подтем и дополнительного урока — у
            каждой своя страница:
          </Typography.Text>
          <ol>
            <li>
              <strong>Записи, сортировка и рейтинг</strong> — ты сейчас здесь:
              чтение файла, ключ сортировки, рейтинг.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="zhadnyj-vybor">
                Жадный выбор
              </SubtopicLink>{" "}
              — больше всего файлов на диске, скидки.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="cepochki-i-pary">
                Цепочки коробок и пары
              </SubtopicLink>{" "}
              — матрёшка, грузы и контейнеры, детали двух видов.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="ryady-i-serii">
                Ряды, серии и группы
              </SubtopicLink>{" "}
              — свободные места в рядах, линии на экране.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="intervaly">
                Интервалы и события
              </SubtopicLink>{" "}
              — мероприятия в зале, простои, одновременная нагрузка.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="modelirovanie">
                Моделирование процесса
              </SubtopicLink>{" "}
              — камера хранения, очереди; решим задачу темы.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="pary-okno-i-cepochki">
                Пары, окно и сложные цепочки
              </SubtopicLink>{" "}
              — дополнительный урок для редких задач.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "obekt",
      navLabel: "Один объект",
      explanation: (
        <>
          <Typography.Text>
            Что в задаче считается одним объектом и как хранить его в программе?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Объект — то, о чём одна строка файла: файл, товар, заявка. Его
              характеристики хранят вместе, одной записью, и сортируют записи
              целиком.
            </strong>{" "}
            В задаче темы объект — заявка пассажира: время сдачи и время
            освобождения.
          </Typography.Text>
          <Typography.Text>
            Выбери объект и посмотри, из каких полей состоит его запись:
          </Typography.Text>
          <VariantPicker
            label={"Объект и его характеристики"}
            variants={[
              { label: "файл", value: <>размер</> },
              { label: "товар", value: <>цена, тип</> },
              {
                label: "мероприятие",
                value: <>время начала, время окончания</>,
              },
              { label: "участник", value: <>идентификатор, баллы, штраф</> },
              { label: "занятое место", value: <>номер ряда, номер места</> },
            ]}
          />
          <Typography.Text>
            Сведения об одном объекте будем называть <strong>записью</strong>.
            Например, <Notation>{"meeting = (120, 180)"}</Notation> — одна
            запись о мероприятии: оно началось на 120-й минуте и закончилось на
            180-й. Здесь используется{" "}
            <PythonTerm term="tuple">кортеж</PythonTerm>: несколько значений,
            объединённых в одну последовательность. Отдельные элементы кортежа
            нельзя заменить присваиванием — для неизменяемой записи это удобно.
          </Typography.Text>
          <Typography.Text>
            Почему записи сортируют целиком? Если отдельно отсортировать начала
            мероприятий и отдельно окончания, могут получиться пары, которых в
            исходных данных вообще не было:
          </Typography.Text>
          <CodeBlock
            code={
              "meetings = [(10, 50), (20, 30)]\nstarts = sorted(m[0] for m in meetings)\nfinishes = sorted(m[1] for m in meetings)\nprint(*zip(starts, finishes))\nprint(*sorted(meetings))"
            }
            label={"Раздельная сортировка выдумывает записи"}
            language="python"
            output={"(10, 30) (20, 50)\n(10, 50) (20, 30)"}
          />
          <Typography.Text>
            Мероприятий (10, 30) и (20, 50) не было: раздельная сортировка их
            выдумала. Исключение — условие прямо говорит о двух независимых
            наборах. Например, массы грузов и вместимости контейнеров могут быть
            двумя отдельными списками, несмотря на то что записаны в одних
            строках; такую задачу разберём в подтеме 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ogranicheniya-i-cel",
      navLabel: "Ограничения и цель",
      explanation: (
        <>
          <Typography.Text>
            Как понять, что именно нужно сделать лучшим и что важнее, если
            критериев несколько?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Выписать ограничения, цель и порядок критериев: сначала решает
              первый критерий, второй — только среди равных по первому.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Эти три вещи определяют алгоритм. <strong>Ограничение</strong> —
            правило, которое нельзя нарушать, например: суммарный размер файлов
            ≤ вместимость диска. <strong>Цель</strong> — величина, которую нужно
            сделать как можно больше или как можно меньше: количество
            сохранённых файлов → max. Вариант, удовлетворяющий ограничениям,
            называется <strong>допустимым</strong>. Лучший допустимый вариант по
            указанному критерию называется <strong>оптимальным</strong>.
          </Typography.Text>
          <Typography.Text>Рассмотрим условие:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Сохранить максимальное количество файлов. Среди таких вариантов
              найти максимально возможный размер самого большого сохранённого
              файла.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Здесь два последовательных требования: сначала максимизируем
            количество, затем, сохраняя это количество, максимизируем размер
            одного файла. Пусть существуют варианты:
          </Typography.Text>
          <LessonTable
            label={"Три варианта сохранения файлов"}
            columns={[
              { label: "Вариант" },
              { label: "Количество файлов", numeric: true },
              { label: "Самый большой файл", numeric: true },
            ]}
            rows={[
              ["А", "6", "30"],
              ["Б", "6", "45"],
              ["В", "5", "100"],
            ]}
          />
          <Typography.Text>
            Лучший вариант — <strong>Б</strong>. Вариант В проигрывает по
            первому, более важному критерию, и его 100 уже ничего не решает.
          </Typography.Text>
          <Typography.Text>
            Такое сравнение называют <strong>лексикографическим</strong>:
            сначала сравнивают первый показатель, при равенстве — второй, затем
            третий и так далее. Термин связан со сравнением слов в словаре:
            сначала первая буква, при равенстве — следующая. Python{" "}
            <PythonTerm term="multikey">сравнивает кортежи</PythonTerm> именно
            так, поэтому вариант можно записать парой «количество, размер»:
          </Typography.Text>
          <CodeBlock
            code={
              "variants = [(6, 30), (6, 45), (5, 100)]\nprint(max(variants))"
            }
            label={"Кортежи сравниваются по порядку полей"}
            language="python"
            output={"(6, 45)"}
          />
          <Typography.Text>
            Для любой задачи полезно заранее ответить на семь вопросов:
          </Typography.Text>
          <ol>
            <li>Что является объектом? Файл, товар, заявка…</li>
            <li>Какие у него характеристики? Размер, цена, время…</li>
            <li>Можно ли менять порядок — или порядок задан условием?</li>
            <li>Что нельзя нарушать? Вместимость, совместимость, сроки…</li>
            <li>Что оптимизируем первым? Количество, стоимость, длину…</li>
            <li>Что оптимизируем при равенстве? Размер, номер, остаток…</li>
            <li>Что именно выводим? Количество, значение, ID, позицию…</li>
          </ol>
          <Typography.Text>
            <strong>
              Порядок чисел в ответе и порядок критериев — разные вещи.
            </strong>{" "}
            В задаче могут сначала требовать максимального общего количества
            товаров, а в ответ просить количество товаров типа А и остаток
            денег.
          </Typography.Text>
          <Typography.Text>
            Задачи бывают двух видов: в одних ты сам выбираешь лучший вариант, в
            других обязан выполнить описанную процедуру — например, принять
            пассажиров в порядке прихода, как в задаче темы. Первому виду
            посвящены подтемы 2–5, второму — подтема 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chtenie-fayla",
      navLabel: "Чтение файла",
      explanation: (
        <>
          <Typography.Text>Как прочитать файл задачи темы?</Typography.Text>
          <Typography.Text>
            <strong>
              Строго по описанию формата: в 26-12.txt сначала два числа в
              отдельных строках — K и N, — потом N строк по два числа.
            </strong>{" "}
            Вот начало файла:
          </Typography.Text>
          <CodeBlock
            code={"30\n1000\n397 404\n378 408\n753 822\n…"}
            label={"Первые строки файла 26-12.txt"}
            language="text"
            fileName="26-12.txt"
          />
          <Typography.Text>
            30 ячеек, 1000 пассажиров, первый сдаёт багаж в минуту 397 и
            забирает в 404. Читаем так же, строку за строкой:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "with open('26-12.txt') as f:\n    k = int(f.readline())\n    n = int(f.readline())\n    requests = []\n    for i in range(n):\n        start, finish = map(int, f.readline().split())\n        requests.append((start, finish))\n\nprint(k, n, requests[:3])"
            }
            label={"Чтение файла задачи темы"}
            language="python"
            output={"30 1000 [(397, 404), (378, 408), (753, 822)]"}
          />
          <Typography.Text>
            <PythonTerm term="file">
              <Notation>{"with open(...) as f"}</Notation>
            </PythonTerm>{" "}
            открывает файл и сам закроет его после блока.{" "}
            <PythonTerm term="readline">
              <Notation>{"f.readline()"}</Notation>
            </PythonTerm>{" "}
            читает очередную строку, и следующее чтение продолжает со следующей.{" "}
            <PythonTerm term="split">
              <Notation>{"split()"}</Notation>
            </PythonTerm>{" "}
            делит строку <Notation>{"'397 404'"}</Notation> на части,{" "}
            <PythonTerm term="mapint">
              <Notation>{"map(int, ...)"}</Notation>
            </PythonTerm>{" "}
            превращает их в числа, а{" "}
            <Notation>{"start, finish = ..."}</Notation> раскладывает по двум
            переменным. Заявка сохраняется{" "}
            <PythonTerm term="tuple">кортежем</PythonTerm> — одной записью.
          </Typography.Text>
          <Typography.Text>
            Универсального заголовка у файлов задания 26 нет: где-то в первой
            строке два числа, где-то они в разных строках, где-то заголовка нет
            вовсе. Сначала читай описание формата — выбери вариант:
          </Typography.Text>
          <VariantPicker
            label={"Первые строки файла"}
            variants={[
              {
                label: "вместимость и количество",
                value: (
                  <>
                    <Notation>
                      {"S, n = map(int, f.readline().split())"}
                    </Notation>
                  </>
                ),
              },
              {
                label: "количество и вместимость",
                value: (
                  <>
                    <Notation>
                      {"n, S = map(int, f.readline().split())"}
                    </Notation>
                  </>
                ),
              },
              {
                label: "два числа в разных строках",
                value: (
                  <>
                    <Notation>{"k = int(f.readline())"}</Notation>, затем{" "}
                    <Notation>{"n = int(f.readline())"}</Notation>
                  </>
                ),
              },
              {
                label: "три числа в первой строке",
                value: (
                  <>
                    <Notation>
                      {"n, m, k = map(int, f.readline().split())"}
                    </Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "sortirovka",
      navLabel: "Сортировка",
      explanation: (
        <>
          <Typography.Text>
            Зачем сортировать записи и как задать, по какому полю?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сортировка даёт порядок, на который опирается рассуждение: в
              отсортированном списке каждое следующее число не меньше
              предыдущего. Записи сравниваются по первому полю, при равенстве —
              по второму; другое поле задаёт ключ.
            </strong>
          </Typography.Text>
          <Typography.Text>
            После{" "}
            <PythonTerm term="listsort">
              <Notation>{"a.sort()"}</Notation>
            </PythonTerm>{" "}
            список <Notation>{"[19, 8, 22, 12, 15]"}</Notation> становится{" "}
            <Notation>{"[8, 12, 15, 19, 22]"}</Notation>. Поэтому, например,
            если очередной файл уже не помещается в оставшееся место, все
            следующие, ещё более крупные файлы тоже не поместятся. Для убывания
            пишут <Notation>{"a.sort(reverse=True)"}</Notation>;{" "}
            <PythonTerm term="sorted">
              <Notation>{"sorted(a)"}</Notation>
            </PythonTerm>{" "}
            создаёт новый отсортированный список и не меняет{" "}
            <Notation>{"a"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Записи-кортежи обычная сортировка сравнивает по очереди: сначала
            первые числа, вторые — только при равенстве первых. Если нужно
            сортировать по второму числу, задают{" "}
            <PythonTerm term="sortkey">ключ</PythonTerm> — функцию, которая для
            каждой записи говорит, по какому значению её сравнивать. Короче
            всего это записать через{" "}
            <PythonTerm term="lambda">
              <Notation>{"lambda"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "records = [(3, 8), (1, 9), (3, 2)]\nprint(*sorted(records))\nprint(*sorted(records, key=lambda record: record[1]))"
            }
            label={"Сортировка по второму полю"}
            language="python"
            output={"(1, 9) (3, 2) (3, 8)\n(3, 2) (3, 8) (1, 9)"}
          />
          <Typography.Text>
            Во второй строке записи упорядочены по второму числу: 2, 8, 9. Та же
            функция с именем выглядела бы так:{" "}
            <Notation>{"def second_value(record): return record[1]"}</Notation>{" "}
            и <Notation>{"key=second_value"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Заявки задачи темы обрабатывают в порядке прихода — по времени
            сдачи. Это первое поле записи, поэтому хватает обычной сортировки:
          </Typography.Text>
          <CodeBlock
            code={"requests.sort()\nprint(requests[:3])"}
            label={"Заявки по времени сдачи"}
            language="python"
            output={"[(1, 64), (2, 77), (3, 42)]"}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Сколько работы делает сортировка"
          >
            <Typography.Text>
              Сортировку N записей Python делает примерно за N · log₂ N
              сравнений, а перебор всех пар — это N(N − 1)/2 пар:
            </Typography.Text>
            <CodeBlock
              code={
                "from math import log2\n\nfor n in (1000, 100_000):\n    print(n, round(n * log2(n)), n * (n - 1) // 2)"
              }
              label={"Сортировка против всех пар"}
              language="python"
              output={"1000 9966 499500\n100000 1660964 4999950000"}
            />
            <Typography.Text>
              При N = 100 000 сортировка — 1,7 миллиона сравнений, все пары —
              почти пять миллиардов. Поэтому решения темы строятся на сортировке
              и одном-двух проходах, а не на переборе всех наборов.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "klyuch-reytinga",
      navLabel: "Ключ рейтинга",
      explanation: (
        <>
          <Typography.Text>
            Как перевести правила рейтинга — «больше баллов выше, при равенстве
            меньше штраф» — в сортировку?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Записать правила ключом-кортежем по порядку важности: поле «чем
              больше, тем выше» — с минусом, «чем меньше, тем выше» — как есть.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть записи имеют вид{" "}
            <Notation>{"(student_id, score, penalty)"}</Notation>, а правила
            такие:
          </Typography.Text>
          <ol>
            <li>Больше баллов — выше.</li>
            <li>При равенстве меньше штраф — выше.</li>
            <li>При полном равенстве меньше ID — выше.</li>
          </ol>
          <CodeBlock
            code={
              "students = [\n    (31, 80, 12),\n    (7, 95, 20),\n    (19, 95, 12),\n    (4, 95, 12)\n]\nstudents.sort(key=lambda x: (-x[1], x[2], x[0]))\nprint(*[s[0] for s in students])"
            }
            label={"Рейтинг по трём правилам"}
            language="python"
            output={"4 19 7 31"}
          />
          <Typography.Text>
            Почему перед баллами минус? Потому что 95 {">"} 80, но −95 {"<"}{" "}
            −80. Обычная сортировка по возрастанию поставит{" "}
            <Notation>{"-95"}</Notation> раньше <Notation>{"-80"}</Notation>,
            значит, участник с 95 баллами окажется раньше участника с 80. Почему
            4 раньше 19? Баллы и штраф совпадают, решает третий показатель.
          </Typography.Text>
          <Typography.Text>
            <strong>
              <Notation>{"reverse=True"}</Notation> переворачивает порядок всего
              ключа.
            </strong>{" "}
            Если направления полей различаются, меняют знак у конкретных
            числовых показателей. С{" "}
            <Notation>{"key=lambda x: (x[1], -x[2], -x[0])"}</Notation> и{" "}
            <Notation>{"reverse=True"}</Notation> получился бы тот же порядок,
            но такую запись легко перепутать; ключ с минусами читается как сами
            правила.
          </Typography.Text>
          <Typography.Text>Нужно различать три числа:</Typography.Text>
          <ul>
            <li>
              <strong>ID участника</strong> — значение из файла;
            </li>
            <li>
              <strong>индекс в списке</strong> — позицию, с которой работает
              Python;
            </li>
            <li>
              <strong>место в рейтинге</strong> — обычно индекс плюс один.
            </li>
          </ul>
          <Typography.Text>
            <Notation>{"students[2][0]"}</Notation> — это ID участника на
            третьем месте, здесь 7.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vychislyaemye-pokazateli",
      navLabel: "Вычисляемые показатели",
      explanation: (
        <>
          <Typography.Text>
            А если рейтинг строится по показателям, которых нет в файле, —
            сумме, среднему, числу двоек?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала вычислить показатели для каждого участника, сложить их в
              запись вместе с ID и уже её сортировать.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть за каждый вопрос викторины участник получил баллы:
            положительные за верный ответ, отрицательные за неверный, ноль —
            если не отвечал. Для одного участника:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "scores = [5, -2, 0, 3, -1]\ntotal = 0\npositive = 0\nanswered = 0\nfor score in scores:\n    total += score\n    if score > 0:\n        positive += score\n    if score != 0:\n        answered += 1\nprint(total, positive, answered)"
            }
            label={"Показатели одного участника"}
            language="python"
            output={"5 8 4"}
          />
          <Typography.Text>
            Здесь <Notation>{"total"}</Notation> — сумма всех баллов,{" "}
            <Notation>{"positive"}</Notation> — сумма положительных баллов,{" "}
            <Notation>{"answered"}</Notation> — количество ненулевых ответов.
            После этого все показатели сохраняют вместе с ID в одну запись и
            сортируют записи.
          </Typography.Text>
          <Typography.Text>
            Иногда показатели делят участников на группы. Например, в рейтинге
            сессии сначала идут студенты без двоек по убыванию среднего балла,
            затем студенты с двойками по возрастанию числа двоек, а внутри групп
            — по возрастанию ID.{" "}
            <strong>Среднее четырёх оценок не нужно делить</strong>: при
            одинаковом числе экзаменов больше среднее — больше сумма. Ключ
            записывает обе группы сразу:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "marks = [\n    (10, 4, 4, 4, 5), (3, 5, 5, 4, 2),\n    (6, 5, 4, 4, 4), (1, 2, 2, 3, 3),\n    (8, 5, 5, 5, 4), (2, 3, 2, 4, 5),\n]\n\ndef rating_key(r):\n    twos = r[1:].count(2)\n    if twos == 0:\n        return (0, -sum(r[1:]), r[0])\n    return (twos, 0, r[0])\n\nprint(*[r[0] for r in sorted(marks, key=rating_key)])"
            }
            label={"Рейтинг сессии"}
            language="python"
            output={"8 6 10 2 3 1"}
          />
          <Typography.Text>
            Первый элемент ключа — число двоек: у сдавших он 0, поэтому они
            впереди. Второй — сумма с минусом, только для сдавших; у несдавших
            там 0, и при равном числе двоек решает ID. Студенты 6 и 10 набрали
            по 17, поэтому выше тот, у кого меньше ID.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "granica-prohoda",
      navLabel: "Граница прохода",
      explanation: (
        <>
          <Typography.Text>
            Кто проходит, если «проходят первые 30 %», а у следующего участника
            те же баллы, что у последнего прошедшего?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Решает точная формулировка: доля — это целая часть, а «и все с
              такими же показателями» сдвигает границу дальше, пока показатели
              совпадают.
            </strong>
          </Typography.Text>
          <Typography.Text>Две разные формулировки:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Проходят первые 25 участников рейтинга.
            </Typography.Text>
          </blockquote>
          <Typography.Text>и:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Проходят все, набравшие не меньше баллов, чем участник на 25-м
              месте.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Во втором случае пройти может больше 25 человек. Если граница задана
            долей — «первые 30 % мест», — её считают целой частью:{" "}
            <Notation>{"k = n * 30 // 100"}</Notation>. Затем, если условие
            добавляет «а также все с такими же показателями, как у последнего из
            них», границу сдвигают дальше, пока показатели совпадают. В таблице
            ниже записи — пары «сумма, количество ответов», уже упорядоченные:
          </Typography.Text>
          <CodeBlock
            code={
              "table = [(90, 6), (85, 7), (80, 5), (80, 5),\n         (80, 6), (75, 4), (70, 8), (70, 9),\n         (60, 5), (55, 7)]\nk = len(table) * 30 // 100\nlast = table[k - 1]\nwhile k < len(table) and table[k] == last:\n    k += 1\nprint(len(table) * 30 // 100, k)"
            }
            label={"Граница 30 % и равные последнему"}
            language="python"
            output={"3 4"}
          />
          <Typography.Text>
            Первые 30 % — это 3 участника, последний из них —{" "}
            <Notation>{"(80, 5)"}</Notation>. Четвёртый с теми же показателями
            тоже проходит, а <Notation>{"(80, 6)"}</Notation> на пятом месте —
            нет: сумма та же, но число ответов другое. Равенство для прохода
            иногда определяется только баллами, хотя сама таблица дополнительно
            упорядочена по ID.{" "}
            <strong>Какие показатели должны совпасть, решает условие</strong>, и
            смешивать эти правила нельзя.
          </Typography.Text>
          <Typography.Text>
            Похожее правило — проходной и полупроходной балл. Мест S; группы с
            одинаковой суммой баллов берут целиком сверху, пока группа
            помещается в оставшиеся места. Сумма последней целиком поместившейся
            группы — <strong>проходной балл</strong>. Следующая сумма, группа
            которой уже не помещается целиком, —{" "}
            <strong>полупроходной балл</strong>: из этой группы оставшиеся места
            делят по дополнительным показателям, например по баллу за
            математику.
          </Typography.Text>
          <Typography.Text>
            Пусть мест 4, а суммы — 250, 240, 240, 235, 235, 235: группы 250 и
            240 занимают три места, проходной балл 240; трое с 235 на одно место
            целиком не помещаются, и 235 — полупроходной балл.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapisi-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Запись",
                note: <>поля одного объекта — вместе, сортируют целиком</>,
              },
              { key: "Чтение файла", note: <>строго по описанию формата</> },
              {
                key: "Критерии",
                note: <>второй решает только среди равных по первому</>,
              },
              {
                key: "Ключ",
                note: (
                  <Notation>{"key=lambda x: (-x[1], x[2], x[0])"}</Notation>
                ),
              },
              {
                key: "Показатели",
                note: <>сначала вычислить, потом сортировать</>,
              },
              {
                key: "Граница прохода",
                note: <>доля — целая часть; равные последнему</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "bolshe-vsego-faylov",
      navLabel: "Больше всего файлов",
      explanation: (
        <>
          <Typography.Text>
            На диске свободно 60, а размеры файлов — 8, 12, 15, 19, 22 и 34. Как
            сохранить как можно больше файлов?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Брать файлы от самых маленьких, пока следующий помещается: так
              каждый выбор оставляет больше всего места остальным.
            </strong>{" "}
            Отсортируем размеры и будем добавлять файлы по одному:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyFill60}
            caption={
              <>
                Файлы 8, 12, 15 и 19 занимают 54 из 60; следующий, 22, уже не
                помещается: 54 + 22 = 76 {">"} 60. Файл 34 ещё больше.
              </>
            }
          />
          <Typography.Text>
            Получили четыре файла. Почему пять сохранить невозможно? Потому что
            пять самых маленьких файлов имеют сумму 8 + 12 + 15 + 19 + 22 = 76{" "}
            {">"} 60, а{" "}
            <strong>любые другие пять файлов имеют не меньшую сумму</strong>.
            Это видно, если выписать оба набора по возрастанию друг под другом:
            i-й файл любого набора не меньше i-го самого маленького. На рисунке
            то же сравнение для наборов из четырёх файлов.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyCompare_ffff2d}
            caption={
              <>
                Четыре самых маленьких и другой набор из четырёх, оба по
                возрастанию: каждый файл набора не меньше файла на той же
                позиции сверху, поэтому и сумма не меньше: 79 ≥ 54.
              </>
            }
          />
          <ProofDisclosure summary="Доказательство для любых размеров">
            <Typography.Text>
              Пусть отсортированные размеры a₁ ≤ a₂ ≤ … ≤ aₙ. У любого
              выбранного набора из k файлов после его собственной сортировки b₁
              ≤ b₂ ≤ … ≤ bₖ. Обязательно b₁ ≥ a₁, b₂ ≥ a₂, …, bₖ ≥ aₖ: среди
              всех файлов есть по крайней мере i файлов, не больших bᵢ, — это
              b₁, …, bᵢ, — а aᵢ — i-е наименьшее значение, поэтому bᵢ ≥ aᵢ.
              Следовательно, b₁ + … + bₖ ≥ a₁ + … + aₖ. То есть{" "}
              <strong>
                первые k элементов имеют минимальную возможную сумму среди всех
                наборов из k элементов
              </strong>
              : если не помещаются они, не поместится никакой набор из k.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Код повторяет ручные действия. Пройди его по шагам:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runCount}
            collapsible={false}
            label={"Больше всего файлов: шаг за шагом"}
          />
          <Typography.Text>
            Здесь <Notation>{"used"}</Notation> — уже занятый объём,{" "}
            <Notation>{"count"}</Notation> — количество выбранных файлов.
            Проверяем возможность добавления <strong>до</strong> изменения
            суммы.
          </Typography.Text>
          <Typography.Text>
            Почему разрешён{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>
            ? <strong>Потому что список отсортирован по возрастанию</strong>:
            если текущий файл не помещается, следующие ещё крупнее. Без
            сортировки такой выход из цикла мог бы пропустить маленький файл в
            конце списка: для <Notation>{"[19, 8, 34, ...]"}</Notation> цикл
            остановился бы на 34, не дойдя до 12 и 15.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zhadnyy-algoritm",
      navLabel: "Жадный алгоритм",
      explanation: (
        <>
          <Typography.Text>
            Брать самое маленькое — это и есть «жадный алгоритм»? И всегда ли он
            прав?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Жадный алгоритм на каждом шаге делает выбор по простому правилу и
              больше к нему не возвращается. Прав он, только если можно
              объяснить, почему такой выбор не испортит итог.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Правило «из оставшихся файлов берём самый маленький» — жадное. Слово
            «жадный» не означает «всегда берёт самое большое»: он может выбирать
            самый маленький размер, самое раннее окончание, наибольшую
            допустимую коробку, самый дешёвый подходящий объект.
          </Typography.Text>
          <Typography.Text>
            Одного ощущения «так выгоднее» мало. Объясняют двумя способами.{" "}
            <strong>
              Первый: выбранный объект оставляет не меньше возможностей.
            </strong>{" "}
            Файл поменьше оставляет больше места для следующих.{" "}
            <strong>
              Второй: можно заменить чужой выбор нашим и не ухудшить результат.
            </strong>{" "}
            Если в некотором лучшем наборе взят большой файл, а меньший не взят,
            их можно поменять: количество сохранится, занятое место не
            увеличится. Такое рассуждение называют{" "}
            <strong>доказательством обменом</strong>.
          </Typography.Text>
          <Typography.Text>
            Важно учитывать всю формулировку. При вместимости 10 и размерах 4,
            5, 6 лучший набор зависит от цели — выбери цель:
          </Typography.Text>
          <VariantPicker
            label={"Цель → лучший набор при вместимости 10"}
            variants={[
              {
                label: "больше всего объектов",
                value: <>4 + 5</>,
                note: <>два объекта, самые маленькие</>,
              },
              {
                label: "наибольшая сумма",
                value: <>4 + 6 = 10</>,
                note: <>самые маленькие дают только 9</>,
              },
              {
                label: "наибольший отдельный объект",
                value: <>6</>,
                note: <>один файл помещается целиком</>,
              },
            ]}
          />
          <Typography.Text>
            <strong>
              Максимальное количество, максимальная сумма и максимальный
              отдельный элемент — разные цели.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "samyy-bolshoy-fayl",
      navLabel: "Самый большой файл",
      explanation: (
        <>
          <Typography.Text>
            «При максимальном количестве файлов укажите наибольший файл, который
            может быть сохранён». Это просто последний из выбранных?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нет. Закрепим k − 1 самых маленьких файлов и найдём наибольший
              файл, который влезает в оставшееся место.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Максимальное количество равно четырём, и первоначально выбраны 8,
            12, 15, 19. Но наибольший файл, который может оказаться среди
            четырёх сохранённых, — <strong>22</strong>: набор 8, 12, 15, 22
            занимает 57 ≤ 60.
          </Typography.Text>
          <Typography.Text>
            Как получить это системно? Зафиксируем три самых маленьких файла —
            8, 12, 15. Они занимают 35, для четвёртого остаётся 60 − 35 = 25. Из
            оставшихся файлов выбираем максимальный размер, не превышающий 25.
            Это 22.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.greedyRoom60}
            caption={
              <>
                Три самых маленьких закреплены, свободно 25: файлы 19 и 22
                помещаются, 34 — нет. Наибольший помещающийся — 22.
              </>
            }
          />
          <Typography.Text>
            Почему можно зафиксировать именно k − 1 самых маленьких?{" "}
            <strong>
              Потому что они оставляют максимально возможное место для ещё
              одного файла.
            </strong>{" "}
            Если некоторый файл x нельзя разместить даже вместе с k − 1 самыми
            маленькими, то с любыми другими k − 1 файлами он тем более не
            поместится.
          </Typography.Text>
          <Typography.Text>
            Полная программа для формата <Notation>{"S N"}</Notation> в первой
            строке:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'with open("26.txt") as f:\n    capacity, n = map(int, f.readline().split())\n    a = [int(f.readline()) for i in range(n)]\n\na.sort()\nused = 0\ncount = 0\nfor size in a:\n    if used + size > capacity:\n        break\n    used += size\n    count += 1\n\nfixed_sum = used - a[count - 1]\nlimit = capacity - fixed_sum\nlargest = a[count - 1]\nfor size in a[count - 1:]:\n    if size > limit:\n        break\n    largest = size\n\nprint(count, largest)'
            }
            label={"Архив: количество и наибольший файл"}
            language="python"
            output={"4 22"}
          />
          <Typography.Text>
            Вторая половина программы — это рисунок выше: закрепили{" "}
            <Notation>{"count − 1"}</Notation> самых маленьких и ищем наибольший
            файл, который помещается в оставшееся место{" "}
            <Notation>{"limit"}</Notation>.
          </Typography.Text>
          <ProofDisclosure summary="Разбор второй половины программы">
            <Typography.Text>
              <Notation>{"used"}</Notation> — сумма первых{" "}
              <Notation>{"count"}</Notation> файлов,{" "}
              <Notation>{"a[count - 1]"}</Notation> — последний из них; вычитая
              его, получаем сумму первых <Notation>{"count − 1"}</Notation>{" "}
              файлов. Перебор начинается с{" "}
              <PythonTerm term="slice">
                <Notation>{"a[count - 1:]"}</Notation>
              </PythonTerm>
              , поэтому закреплённые первые <Notation>{"count − 1"}</Notation>{" "}
              файлов не используются повторно, а <Notation>{"break"}</Notation>{" "}
              снова держится на сортировке. Программа предполагает, что хотя бы
              один файл помещается; что выводить, если не помещается ни один,
              говорит условие.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <strong>
              Этот приём максимизирует один файл. Он не является способом
              максимизировать общую сумму выбранного набора.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vazhnye-pervymi",
      navLabel: "Обязательные первыми",
      explanation: (
        <>
          <Typography.Text>
            «Важные файлы перенести в первую очередь, а на оставшееся место —
            как можно больше остальных». Что меняется?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Обязательные объекты кладут сразу, без выбора, а жадный выбор идёт
              по оставшемуся месту среди остальных.
            </strong>{" "}
            Пусть файл 34 обязателен. В записи второе поле — 1 у обязательного:
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "capacity = 60\nfiles = [(8, 0), (12, 0), (15, 0), (19, 0), (22, 0), (34, 1)]\nused = sum(size for size, must in files if must)\ncount = sum(must for size, must in files)\nfor size in sorted(s for s, must in files if not must):\n    if used + size > capacity:\n        break\n    used += size\n    count += 1\nprint(count, capacity - used)"
            }
            label={"Сначала обязательные, потом самые маленькие"}
            language="python"
            output={"3 6"}
          />
          <Typography.Text>
            34 занимает своё место сразу, свободно 26: туда входят 8 и 12, а 15
            уже нет. Всего три файла, свободно 6. Так же решаются задачи о
            грузовике, где «грузы массой от 310 до 320 кг грузят в первую
            очередь»: обязательность определяет условие, а не размер.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pokupka-partiyami",
      navLabel: "Покупка партиями",
      explanation: (
        <>
          <Typography.Text>
            В строке файла не одно изделие, а партия: цена и количество. Как
            купить больше всего изделий?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Идти по партиям от дешёвых и брать из каждой сколько хватит денег:
              всю партию или <Notation>{"money // price"}</Notation> изделий.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть на 500 рублей нужно купить как можно больше изделий A, а на
            остаток — как можно больше изделий B. Партии A: 5 штук по 20 и 10
            штук по 35; партии B: 4 штуки по 25 и 30 штук по 15.
          </Typography.Text>
          <Typography.Text>
            Для каждого типа идём по партиям от дешёвых к дорогим и из партии
            берём <Notation>{"min(q, money // p)"}</Notation> изделий: либо всю
            партию, либо сколько хватит денег. Деление нацело{" "}
            <PythonTerm term="intdiv">
              <Notation>{"//"}</Notation>
            </PythonTerm>{" "}
            отвечает на вопрос «сколько раз цена помещается в остаток».
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              'money = 500\nlots = {"A": [(20, 5), (35, 10)], "B": [(25, 4), (15, 30)]}\nbought = {}\nfor kind in "AB":\n    count = 0\n    for price, q in sorted(lots[kind]):\n        take = min(q, money // price)\n        count += take\n        money -= take * price\n        if take < q:\n            break\n    bought[kind] = count\nprint(bought["A"], bought["B"], money)'
            }
            label={"Покупка партиями"}
            language="python"
            output={"15 3 5"}
          />
          <Typography.Text>
            Все изделия A стоят 5 · 20 + 10 · 35 = 450, на остаток 50 покупаем 3
            изделия B по 15 и остаётся 5. Почему после неполной партии можно
            остановиться? Денег не хватило даже на изделие этой партии, а
            следующие партии не дешевле.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-tipa",
      navLabel: "Покупки двух типов",
      explanation: (
        <>
          <Typography.Text>
            Купить больше всего изделий, а среди таких покупок — больше изделий
            типа A. Как учесть второй критерий?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Количество находим как раньше — самыми дешёвыми. Потом перебираем,
              сколько из них будет изделий A: для каждого числа самая дешёвая
              покупка однозначна.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В подборке есть задачи с тремя приоритетами: купить максимальное
            общее количество изделий, затем максимальное количество изделий типа
            A, затем потратить минимальную сумму. Возьмём бюджет 36, цены
            изделий A — 4, 9, 14, изделий B — 3, 5, 6, 10.
          </Typography.Text>
          <Typography.Text>
            Сначала определим максимальное общее количество. Все цены по
            возрастанию: 3, 4, 5, 6, 9, 10, 14. Пять самых дешёвых стоят 27,
            шесть — уже 37 {">"} 36. Значит, нужно купить ровно пять изделий —
            это рассуждение прошлого шага.
          </Typography.Text>
          <Typography.Text>
            Теперь спрашиваем: сколько из этих пяти может быть изделий A? Если
            берём x изделий A, изделий B должно быть 5 − x.{" "}
            <strong>
              Для фиксированного x самая дешёвая покупка состоит из x самых
              дешёвых A и 5 − x самых дешёвых B.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Значит, достаточно быстро находить суммы первых нескольких
            элементов. Для этого строят <strong>накопленные суммы</strong>, их
            также называют <strong>префиксными суммами</strong>: «префикс» —
            начальный участок последовательности. Для A = 4, 9, 14 получим PA =
            0, 4, 13, 27: <Notation>{"PA[0]"}</Notation> — стоимость нуля
            изделий, <Notation>{"PA[1]"}</Notation> — одного самого дешёвого,{" "}
            <Notation>{"PA[2]"}</Notation> — двух,{" "}
            <Notation>{"PA[3]"}</Notation> — трёх. Каждая следующая накопленная
            сумма равна предыдущей плюс очередная цена. Для B: PB = 0, 3, 8, 14,
            24.
          </Typography.Text>
          <LessonTable
            label={"Сколько A можно взять"}
            columns={[
              { label: "Количество A", numeric: true },
              { label: "Количество B", numeric: true },
              { label: "Минимальная стоимость", numeric: true },
              { label: "Подходит?" },
            ]}
            rows={[
              ["1", "4", "4 + 24 = 28", "Да"],
              ["2", "3", "13 + 14 = 27", "Да"],
              ["3", "2", "27 + 8 = 35", "Да"],
            ]}
          />
          <Typography.Text>
            Выбираем три A и два B. Остаток равен 1.
          </Typography.Text>
          <CodeBlock
            collapsible={false}
            code={
              "budget = 36\na = sorted([4, 9, 14])\nb = sorted([3, 5, 6, 10])\ncount = spent = 0\nfor price in sorted(a + b):\n    if spent + price > budget:\n        break\n    spent += price\n    count += 1\n\nprefix_a = [0]\nfor price in a:\n    prefix_a.append(prefix_a[-1] + price)\nprefix_b = [0]\nfor price in b:\n    prefix_b.append(prefix_b[-1] + price)\n\nbest_a = best_cost = 0\nfor count_a in range(count + 1):\n    count_b = count - count_a\n    if count_a > len(a) or count_b > len(b):\n        continue\n    cost = prefix_a[count_a] + prefix_b[count_b]\n    if cost <= budget:\n        best_a = count_a\n        best_cost = cost\nprint(best_a, budget - best_cost)"
            }
            label={"Больше всего изделий, затем больше A"}
            language="python"
            output={"3 1"}
          />
          <Typography.Text>
            Здесь нет перебора всех наборов покупок:{" "}
            <strong>перебирается только количество изделий A</strong>, а лучший
            набор с таким количеством строится однозначно.
          </Typography.Text>
          <ProofDisclosure summary="Почему программа выполняет все три условия">
            <Typography.Text>
              Первое — количество: <Notation>{"count"}</Notation> найден набором
              самых дешёвых, как в прошлом шаге. Второе — больше A:{" "}
              <Notation>{"count_a"}</Notation> перебирается по возрастанию,
              поэтому ответ можно просто перезаписывать — каждый следующий
              подходящий вариант содержит больше A. Третье — дешевле: для
              каждого состава мы уже берём самые дешёвые изделия обоих типов.{" "}
              <PythonTerm term="continue">
                <Notation>{"continue"}</Notation>
              </PythonTerm>{" "}
              пропускает составы, для которых изделий одного из типов не
              хватает.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "skidki",
      navLabel: "Скидки",
      explanation: (
        <>
          <Typography.Text>
            «Каждый третий товар бесплатно»: какой именно товар окажется
            бесплатным?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сначала понять, кто расставляет товары и кому выгодна расстановка:
              покупатель делает бесплатными самые дорогие возможные товары,
              продавец — самые дешёвые.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Одна фраза об акции ещё не определяет алгоритм. Выбери правило:
          </Typography.Text>
          <VariantPicker
            label={"Правило скидки → что влияет на решение"}
            variants={[
              {
                label: "можно выбрать любые k товаров со скидкой",
                value: <>выгодно выбирать наиболее дорогие подходящие</>,
              },
              {
                label: "в каждой паре скидка на дешёвый товар",
                value: <>нужно выгодно составить пары</>,
              },
              {
                label: "в каждой тройке бесплатно самый дешёвый",
                value: <>нужно выгодно составить тройки</>,
              },
              {
                label: "продавец сам переставляет товары",
                value: <>нужно учитывать цель продавца</>,
              },
              {
                label: "скидка действует только выше порога",
                value: <>сначала выделяются подходящие товары</>,
              },
            ]}
          />
          <Typography.Text>Рассмотрим конкретное правило:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Все товары нужно купить. Их можно разбить на тройки. В каждой
              полной тройке самый дешёвый товар бесплатный.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Цены: 100, 90, 80, 70, 60, 50, 40. Выгодные тройки — 100, 90, 80 и
            70, 60, 50: бесплатно получаем 80 и 50, а 40 покупаем отдельно.
            Сумма всех цен 490, стоимость покупки 490 − 80 − 50 = 360. После
            сортировки по убыванию бесплатны элементы с индексами 2, 5, 8, …;
            третий параметр{" "}
            <PythonTerm term="for">
              <Notation>{"range"}</Notation>
            </PythonTerm>{" "}
            — шаг:
          </Typography.Text>
          <CodeBlock
            code={
              "prices = [70, 100, 40, 90, 50, 80, 60]\nprices.sort(reverse=True)\nfree_sum = 0\nfor i in range(2, len(prices), 3):\n    free_sum += prices[i]\nprint(sum(prices) - free_sum)"
            }
            label={"Тройки с бесплатным самым дешёвым"}
            language="python"
            output={"360"}
          />
          <Typography.Text>
            <strong>
              Соседние тройки отсортированного списка дают наибольшую скидку
            </strong>
            : каждый бесплатный товар получается настолько дорогим, насколько
            это вообще возможно.
          </Typography.Text>
          <ProofDisclosure summary="Почему соседние тройки оптимальны">
            <Typography.Text>
              Чтобы получить один бесплатный товар некоторой цены, к нему нужны
              ещё два товара не дешевле. Значит, самый дорогой бесплатный товар
              не может быть дороже третьего по цене, второй по дороговизне
              бесплатный — не дороже шестого, третий — не дороже девятого.
              Разбиение отсортированного списка на соседние тройки достигает
              этих границ.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Правило может работать и в пользу покупателя: если в каждой тройке
            бесплатен <strong>самый дорогой</strong> товар, к каждому
            бесплатному нужны два более дешёвых спутника. Тогда бесплатными
            выгодно сделать ⌊n / 3⌋ самых дорогих товаров, а спутников взять из
            дешёвых: для тех же цен бесплатны 100 и 90.
          </Typography.Text>
          <Typography.Text>
            В подборках встречается и «каждый четвёртый товар в чеке за
            полцены». Покупатель ставит на 4-е, 8-е, … места самые дорогие
            товары, а касса, которая сортирует цены себе в пользу, — самые
            дешёвые. Для цен 100, 90, 80, 70, 60, 50, 40, 30 за полцены идут два
            товара: у покупателя 100 и 90 — он платит 425, у кассы 30 и 40 —
            485.
          </Typography.Text>
          <CodeBlock
            code={
              "prices = [60, 100, 30, 80, 50, 90, 40, 70]\nprices.sort(reverse=True)\nq = len(prices) // 4\nbuyer = sum(prices) - sum(prices[:q]) // 2\nshop = sum(prices) - sum(prices[-q:]) // 2\nprint(buyer, shop)"
            }
            label={"Каждый четвёртый за полцены"}
            language="python"
            output={"425 485"}
          />
          <Typography.Text>
            Если товары <strong>переставляет продавец</strong> и хочет дать
            скидку поменьше, скидка достаётся самым дешёвым из подходящих
            товаров: продавец ставит их на чётные места. Например, «скидка 25 %
            на каждый второй товар дороже 50 рублей»: из k таких товаров скидку
            получат ⌊k / 2⌋ самых дешёвых.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Скидка в процентах и округление вверх"
          >
            <Typography.Text>
              Пусть скидка 25 % применяется к товарам с суммарной исходной ценой
              D, а сумма всех цен — T. Тогда точная итоговая стоимость T − D/4 =
              (4T − D)/4. Если <strong>всю итоговую сумму</strong> нужно
              округлить вверх,{" "}
              <PythonTerm term="ceil">округление вверх</PythonTerm> делают
              целочисленно: <Notation>{"(x + d - 1) // d"}</Notation> — это x/d,
              округлённое вверх, для неотрицательного целого x.
            </Typography.Text>
            <CodeBlock
              code={
                "prices = [65, 300, 45, 120, 200, 80]\nbig = sorted(p for p in prices if p > 50)\ndiscount = big[:len(big) // 2]\ntotal = sum(prices)\nnumerator = 4 * total - sum(discount)\nprint(discount, (numerator + 3) // 4)"
              }
              label={"Скидка 25 % и округление вверх"}
              language="python"
              output={"[65, 80] 774"}
            />
            <Typography.Text>
              Товаров дороже 50 пять, скидку получают два самых дешёвых из них —
              65 и 80. Точная стоимость 810 − 145/4 = 773,75, после округления
              вверх — 774.{" "}
              <strong>
                Нельзя округлять стоимость каждого товара отдельно
              </strong>
              , если условие требует округлить только общую сумму.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "zhadnyy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Больше всего",
                note: <>от самых маленьких, break после первого лишнего</>,
              },
              {
                key: "Наибольший при k",
                note: <>закрепить k − 1 самых маленьких</>,
              },
              {
                key: "Жадный выбор",
                note: <>объяснить: оставляет не меньше возможностей</>,
              },
              {
                key: "Обязательные",
                note: <>сначала они, потом выбор по остатку</>,
              },
              {
                key: "Партии",
                note: <Notation>{"min(q, money // price)"}</Notation>,
              },
              {
                key: "Скидки",
                note: <>покупатель — дорогие, продавец — дешёвые</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  paidPractice: {
    examFocus: true,
    checkpoint: 0,
    load: () => import("./array-processing.paid.praktika"),
  },
  status: "published",
});
