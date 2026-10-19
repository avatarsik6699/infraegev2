import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  VariantPicker,
} from "~/shared/components/learning-content";
import { arrayProcessingLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./array-processing.media";
import { PythonTerm } from "./python-term";

export const arrayProcessingLesson = defineLesson({
  ...arrayProcessingLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Описывать объект, ограничения, цель и порядок критериев и читать файл по его формату",
    "Переводить правила рейтинга в ключ сортировки из нескольких полей",
    "Набирать больше всего объектов при ограниченной сумме и обосновывать жадный выбор",
    "Строить цепочки вложенных коробок и пары из двух наборов двумя указателями",
    "Собирать позиции по рядам, находить свободные места и серии, накапливать по ключу",
    "Выбирать мероприятия, объединять интервалы и считать нагрузку событиями",
    "Моделировать процесс по правилам условия: ячейки, очереди, заданные процедуры",
    "Для редких задач — все пары, окно, куча и сложные цепочки (дополнительные уроки)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "zapisi-i-rejting",
      title: "Записи, приоритеты и рейтинг",
      lead: "Объект — запись, ограничения, цель и порядок критериев, чтение файла по формату, ключ сортировки из нескольких полей, рейтинг и граница прохода.",
      conceptIds: [
        "kak-ustroena-tema-26",
        "obekt",
        "ogranicheniya-i-cel",
        "chtenie-fayla",
        "sortirovka",
        "klyuch-reytinga",
        "vychislyaemye-pokazateli",
        "granica-prohoda",
        "ocenka-raboty",
        "zapisi-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-3",
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
          id: "zadacha-4",
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
          id: "zadacha-5",
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
          id: "zadacha-8",
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
      ],
    },
    {
      slug: "zhadnyj-vybor",
      title: "Жадный выбор при ограниченной сумме",
      lead: "Больше всего объектов — самые маленькие первыми и почему; наибольший отдельный элемент при таком количестве; покупки двух типов и скидки.",
      conceptIds: [
        "samye-malenkie",
        "zhadnyy-algoritm",
        "bolshe-vsego-faylov",
        "samyy-bolshoy-fayl",
        "pokupka-partiyami",
        "dva-tipa",
        "skidki",
        "zhadnyy-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-3",
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
      ],
    },
    {
      slug: "cepochki-i-pary",
      title: "Цепочки коробок и пары из двух наборов",
      lead: "Вложенные коробки снаружи внутрь и изнутри наружу, грузы и контейнеры, детали A и B двумя указателями, обоснование обменом.",
      conceptIds: [
        "vozmozhnosti-dlya-prodolzheniya",
        "cepochka-snaruzhi",
        "pochemu-cepochka-dlinnee",
        "napravlenie-postroeniya",
        "dva-ukazatelya",
        "gruzy-i-konteynery",
        "detali-dvuh-vidov",
        "cepochki-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-3",
          prompt: (
            <>
              Размеры 5, 9, 9, 13, 20, 22, разность не меньше 4. Найди длину
              цепочки снаружи внутрь и самую маленькую коробку. Могут ли обе
              коробки 9 оказаться в одной цепочке?
            </>
          ),
          reveal: (
            <>
              <Notation>{"4 5"}</Notation>: 22, 13, 9, 5. Нет: разность 9 − 9 =
              0 меньше 4.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Массы 40, 40, 50, вместимость 130. Сколько рейсов даст алгоритм
              двух указателей? А если в рейсе может быть сколько угодно человек?
            </>
          ),
          reveal: (
            <>
              2 рейса: 50 + 40 = 90 вместе, второй 40 — один. Без ограничения
              хватит одного рейса: 40 + 40 + 50 = 130.
            </>
          ),
        },
      ],
    },
    {
      slug: "ryady-i-serii",
      title: "Ряды, серии и группы",
      lead: "Позиции по рядам и столбцам в словаре, свободные места по разности соседних, непрерывные серии и накопление по ключу.",
      access: "paid",
      conceptIds: [
        "pozicii-v-ryadah",
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
          { id: "pozicii-v-ryadah", navLabel: "Позиции в рядах" },
          { id: "mnozhestva-i-slovari", navLabel: "Множества и словари" },
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
              <strong>
                Позиции в рядах сначала собирают по рядам и сортируют, а потом
                смотрят на разности соседних позиций.
              </strong>{" "}
              Так решаются задачи о свободных местах и посадках в рядах, о
              креслах одного номера в зале, о светлых точках и линиях на экране,
              о подъездах домов и артикулах товаров. Это одна из самых частых
              моделей задания в последние годы.
            </Typography.Text>
          </>
        ),
        selfCheck: 2,
        load: () => import("./array-processing.paid.ryady-i-serii"),
      },
    },
    {
      slug: "intervaly",
      title: "Интервалы времени",
      lead: "Мероприятия по раннему окончанию и второй критерий последнего, объединение интервалов и простои, события нагрузки и окно наблюдения.",
      access: "paid",
      conceptIds: [
        "tri-zadachi-intervalov",
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
          { id: "tri-zadachi-intervalov", navLabel: "Три задачи" },
          { id: "rannee-okonchanie", navLabel: "Раннее окончание" },
          { id: "kontrprimery", navLabel: "Контрпримеры" },
          { id: "vtoroy-kriteriy", navLabel: "Второй критерий" },
          { id: "obedinenie-intervalov", navLabel: "Объединение интервалов" },
          { id: "sobytiya", navLabel: "События" },
          { id: "okno-nablyudeniya", navLabel: "Окно наблюдения" },
          { id: "intervaly-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Интервалы времени решают три разные задачи: выбрать больше всего
                непересекающихся мероприятий, измерить общее занятое время и
                найти наибольшую одновременную нагрузку.
              </strong>{" "}
              Это задачи о мероприятиях в конференц-зале, о периодах работы и
              простоя, о процессах и запросах, о людях в офисе; мероприятия были
              и на основной волне экзамена.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./array-processing.paid.intervaly"),
      },
    },
    {
      slug: "modelirovanie",
      title: "Моделирование процесса",
      lead: "Выбрать лучшее или исполнить правила: ячейки и окна во времени, очереди, заданные процедуры и журнал сервера.",
      access: "paid",
      conceptIds: [
        "ispolnit-pravila",
        "vybrat-ili-ispolnit",
        "kamera-hraneniya",
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
          { id: "ispolnit-pravila", navLabel: "Исполнить правила" },
          { id: "vybrat-ili-ispolnit", navLabel: "Выбрать или исполнить" },
          { id: "kamera-hraneniya", navLabel: "Камера хранения" },
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
              <strong>
                В задачах на моделирование ничего не выбирают: программа
                исполняет правила из условия и хранит состояние системы.
              </strong>{" "}
              Так решаются задачи о камере хранения и окнах приёма, о парковке,
              об очередях, о заданных процедурах упаковки и размещения, о
              журнале сервера. К этой модели относятся и самые свежие
              экзаменационные задачи.
            </Typography.Text>
          </>
        ),
        selfCheck: 2,
        load: () => import("./array-processing.paid.modelirovanie"),
      },
    },
    {
      slug: "pary-okno-kucha",
      title: "Все пары, скользящее окно и куча",
      lead: "Пары с проверкой по множеству, наибольший участок окном, маршрут с ограниченными особыми переходами и быстрый выбор ячейки кучей.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "dopolnitelnyy-urok-pary",
        "podschyot-i-razbienie",
        "perebor-par",
        "skolzyashchee-okno",
        "osobye-perehody",
        "kucha",
        "pary-itogo",
      ],
      paid: {
        outline: [
          { id: "dopolnitelnyy-urok-pary", navLabel: "Дополнительный урок" },
          { id: "podschyot-i-razbienie", navLabel: "Подсчёт и разбиение пар" },
          { id: "perebor-par", navLabel: "Перебор пар" },
          { id: "skolzyashchee-okno", navLabel: "Скользящее окно" },
          { id: "osobye-perehody", navLabel: "Особые переходы" },
          { id: "kucha", navLabel: "Куча" },
          { id: "pary-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 26: пары чисел
              с проверкой по множеству и маршрут альпиниста со страховкой
              встречаются в подборках, но на реальных экзаменах таких задач не
              было. Задачи основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./array-processing.paid.pary-okno-kucha"),
      },
    },
    {
      slug: "slozhnye-cepochki",
      title: "Сложные цепочки и лучший набор",
      lead: "Чередование материалов и растущий зазор, наименьшее число блоков и лучший набор по убыванию элементов.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "dopolnitelnyy-urok-cepochki",
        "chereduyushchiesya-cveta",
        "rastushchiy-zazor",
        "naimenshee-chislo-blokov",
        "bloki-s-cherodovaniem",
        "luchshiy-nabor",
        "slozhnye-itogo",
      ],
      paid: {
        outline: [
          {
            id: "dopolnitelnyy-urok-cepochki",
            navLabel: "Дополнительный урок",
          },
          { id: "chereduyushchiesya-cveta", navLabel: "Чередование цветов" },
          { id: "rastushchiy-zazor", navLabel: "Растущий зазор" },
          {
            id: "naimenshee-chislo-blokov",
            navLabel: "Наименьшее число блоков",
          },
          { id: "bloki-s-cherodovaniem", navLabel: "Блоки с чередованием" },
          { id: "luchshiy-nabor", navLabel: "Лучший набор" },
          { id: "slozhnye-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 26: наименьшее
              число блоков из вложенных коробок, чередование цветов и материалов
              в «матрёшке» и лучший набор по убыванию элементов встречаются в
              подборках, но на реальных экзаменах таких задач не было. Задачи
              основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 1,
        load: () => import("./array-processing.paid.slozhnye-cepochki"),
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
            <strong>
              Задание 26 стоит изучать через несколько общих идей: как
              упорядочить данные, как выбрать подходящие объекты, как сравнивать
              варианты и как воспроизвести процесс из условия.
            </strong>{" "}
            Тогда даже незнакомый сюжет раскладывается на понятные действия.
            Сюжеты у задания очень разные — архив файлов, закупки и скидки,
            места в рядах, расписания, камеры хранения, очереди, рейтинги,
            упаковка грузов, — и одного шаблона «отсортировать и пройти циклом»
            для них мало.
          </Typography.Text>
          <Typography.Text>
            Эта подтема — основа всех следующих: что такое объект задачи, какие
            у него ограничения и приоритеты, как прочитать файл и как правила
            сравнения превращаются в сортировку. Решения пишем на Python 3, а
            примеры берём маленькие, чтобы каждый можно было проверить вручную.
            Все шаги ведут к рейтингу, который разберём на четырёх участниках
            олимпиады с номером, баллами и штрафом.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "obekt",
      navLabel: "Один объект",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Начинать решение нужно с того, что представляет собой один объект.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В условии почти всегда описаны какие-то объекты, и у каждого объекта
            есть характеристики. Выбери объект, чтобы увидеть его
            характеристики:
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
            В программе сведения об одном объекте удобно хранить вместе. Такую
            совокупность сведений будем называть <strong>записью</strong>.
            Например, <Notation>{"meeting = (120, 180)"}</Notation> — одна
            запись о мероприятии: оно началось на 120-й минуте и закончилось на
            180-й. Здесь используется{" "}
            <PythonTerm term="tuple">кортеж</PythonTerm>: несколько значений,
            объединённых в одну последовательность. Отдельные элементы кортежа
            нельзя заменить присваиванием — для неизменяемой записи это удобно.
          </Typography.Text>
          <Typography.Text>
            Важно сохранять связь между характеристиками.{" "}
            <strong>
              Сортировать нужно целые записи, если их поля относятся к одному
              объекту.
            </strong>{" "}
            Если отдельно отсортировать начала мероприятий и отдельно окончания,
            могут получиться пары, которых в исходных данных вообще не было:
          </Typography.Text>
          <CodeBlock
            code={
              "meetings = [(10, 50), (20, 30)]\nstarts = sorted(m[0] for m in meetings)\nfinishes = sorted(m[1] for m in meetings)\nprint(*zip(starts, finishes))\nprint(*sorted(meetings))"
            }
            label={"Код на Python: meetings = [(10, 50), (20, 30)]"}
            language="python"
            output={"(10, 30) (20, 50)\n(10, 50) (20, 30)"}
          />
          <Typography.Text>
            Мероприятий (10, 30) и (20, 50) не было: раздельная сортировка их
            выдумала. Исключение — условие прямо говорит о двух независимых
            наборах. Например, массы грузов и вместимости контейнеров могут быть
            двумя отдельными списками, несмотря на то что записаны в одних
            строках; такую задачу разберём в подтеме о цепочках и парах.
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
            <strong>
              Из условия нужно выписать ограничения, цель и порядок приоритетов.
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
            label={"Пусть существуют варианты"}
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
            label={"Код на Python: variants = [(6, 30), (6, 45), (5, 100)]"}
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
            клиентов в порядке прихода. Первому виду посвящены подтемы 2–5,
            второму — подтема 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chtenie-fayla",
      navLabel: "Чтение файла",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтение файла нужно строить по его фактическому формату.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Допустим, в файле <Notation>{"26.txt"}</Notation> первая строка
            содержит два числа — вместимость диска и количество файлов, — а
            дальше по одному размеру в строке:
          </Typography.Text>
          <CodeBlock
            code={"60 6\n8\n12\n15\n19\n22\n34"}
            label={"Строки файла 26.txt"}
            language="text"
            fileName="26.txt"
          />
          <Typography.Text>Понятный вариант чтения:</Typography.Text>
          <CodeBlock
            code={
              'with open("26.txt") as f:\n    capacity, n = map(int, f.readline().split())\n    sizes = []\n    for i in range(n):\n        sizes.append(int(f.readline()))\n\nprint(capacity, n, sizes)'
            }
            label={"Понятный вариант чтения"}
            language="python"
            output={"60 6 [8, 12, 15, 19, 22, 34]"}
          />
          <Typography.Text>
            <PythonTerm term="file">
              <Notation>{"with open(...) as f"}</Notation>
            </PythonTerm>{" "}
            открывает файл и сам закроет его после блока.{" "}
            <PythonTerm term="readline">
              <Notation>{"f.readline()"}</Notation>
            </PythonTerm>{" "}
            читает одну очередную строку;{" "}
            <strong>после неё файл уже стоит на следующей строке</strong>, и
            повторное чтение продолжает с текущего места.
          </Typography.Text>
          <Typography.Text>
            <PythonTerm term="split">
              <Notation>{"split()"}</Notation>
            </PythonTerm>{" "}
            разбивает строку <Notation>{'"60 6"'}</Notation> на части{" "}
            <Notation>{'["60", "6"]'}</Notation>,{" "}
            <PythonTerm term="mapint">
              <Notation>{"map(int, ...)"}</Notation>
            </PythonTerm>{" "}
            превращает каждую часть в число, а присваивание{" "}
            <Notation>{"capacity, n = ..."}</Notation> раскладывает два значения
            по двум переменным.
          </Typography.Text>
          <Typography.Text>
            Цикл с <Notation>{"append"}</Notation> можно заменить{" "}
            <PythonTerm term="comp">списковым включением</PythonTerm>{" "}
            <Notation>{"[int(f.readline()) for i in range(n)]"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если строки содержат пары, запись читают целиком:{" "}
            <Notation>
              {"start, finish = map(int, f.readline().split())"}
            </Notation>
            , затем <Notation>{"meetings.append((start, finish))"}</Notation>.
            Если в строке число и буква, например <Notation>{"120 A"}</Notation>
            , нельзя преобразовывать обе части в <Notation>{"int"}</Notation>:{" "}
            <Notation>{"price_text, kind = f.readline().split()"}</Notation>,
            затем <Notation>{"price = int(price_text)"}</Notation>, а{" "}
            <Notation>{"kind"}</Notation> останется строкой{" "}
            <Notation>{'"A"'}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Не существует универсального заголовка файла для задания 26.
            </strong>{" "}
            Где-то в первой строке записаны <Notation>{"S N"}</Notation>, где-то{" "}
            <Notation>{"N S"}</Notation>, где-то <Notation>{"K"}</Notation> и{" "}
            <Notation>{"N"}</Notation> находятся в разных строках, а где-то
            заголовка нет вовсе. Сначала читаем описание формата:
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
            <strong>
              Сортировка полезна тем, что создаёт порядок, на который можно
              опереться в рассуждении.
            </strong>
          </Typography.Text>
          <Typography.Text>
            После{" "}
            <PythonTerm term="listsort">
              <Notation>{"a.sort()"}</Notation>
            </PythonTerm>{" "}
            список <Notation>{"[19, 8, 22, 12, 15]"}</Notation> становится{" "}
            <Notation>{"[8, 12, 15, 19, 22]"}</Notation>, и теперь известно:{" "}
            <strong>любое следующее число не меньше предыдущего</strong>.
            Поэтому, например, если очередной файл уже не помещается в
            оставшееся место, все следующие, ещё более крупные файлы тоже не
            поместятся. Для убывания пишут{" "}
            <Notation>{"a.sort(reverse=True)"}</Notation>;{" "}
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
            label={"Короче всего это записать через {{lambda|lambda}}"}
            language="python"
            output={"(1, 9) (3, 2) (3, 8)\n(3, 2) (3, 8) (1, 9)"}
          />
          <Typography.Text>
            Во второй строке записи упорядочены по второму числу: 2, 8, 9. Та же
            функция с именем выглядела бы так:{" "}
            <Notation>{"def second_value(record): return record[1]"}</Notation>{" "}
            и <Notation>{"key=second_value"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "klyuch-reytinga",
      navLabel: "Ключ рейтинга",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Рейтинговые задачи требуют буквально перевести правила сравнения в
              ключ сортировки.
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
            label={
              "Пусть записи имеют вид (student_id, score, penalty), а правила такие"
            }
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
            <strong>
              Если рейтинг строится по вычисляемым показателям, сначала
              вычисляем их.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть за каждый вопрос викторины участник получил баллы:
            положительные за верный ответ, отрицательные за неверный, ноль —
            если не отвечал. Для одного участника:
          </Typography.Text>
          <CodeBlock
            code={
              "scores = [5, -2, 0, 3, -1]\ntotal = 0\npositive = 0\nanswered = 0\nfor score in scores:\n    total += score\n    if score > 0:\n        positive += score\n    if score != 0:\n        answered += 1\nprint(total, positive, answered)"
            }
            label={"Для одного участника"}
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
            code={
              "marks = [\n    (10, 4, 4, 4, 5), (3, 5, 5, 4, 2),\n    (6, 5, 4, 4, 4), (1, 2, 2, 3, 3),\n    (8, 5, 5, 5, 4), (2, 3, 2, 4, 5),\n]\n\ndef rating_key(r):\n    twos = r[1:].count(2)\n    if twos == 0:\n        return (0, -sum(r[1:]), r[0])\n    return (twos, 0, r[0])\n\nprint(*[r[0] for r in sorted(marks, key=rating_key)])"
            }
            label={"Ключ записывает обе группы сразу"}
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
            <strong>
              Границу прохода определяет точная формулировка, а не место в
              списке.
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
            label={
              "В таблице ниже записи — пары «сумма, количество ответов», уже упорядоченные"
            }
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
      id: "ocenka-raboty",
      navLabel: "Оценка работы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              До написания алгоритма нужно оценить, сколько работы он выполнит.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Обозначим количество объектов буквой N. Один проход по всем объектам
            выполняет примерно N действий. Проход по всем парам{" "}
            <Notation>{"for i in range(n): for j in range(i + 1, n)"}</Notation>{" "}
            рассматривает N(N − 1)/2 пар. Сортировку Python выполняет примерно
            за N · log₂ N сравнений; логарифм здесь можно понимать как число
            делений размера пополам, чтобы дойти до единицы, — для 100 000 это
            около 17. Сравним числами:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import log2\n\nfor n in (1000, 100_000):\n    print(n, round(n * log2(n)), n * (n - 1) // 2)"
            }
            label={"Сравним числами"}
            language="python"
            output={"1000 9966 499500\n100000 1660964 4999950000"}
          />
          <Typography.Text>
            При N = 100 000 сортировка — около 1,7 миллиона сравнений, а все
            пары — почти пять миллиардов. Для описания роста работы используют
            обозначение <PythonTerm term="bigo">O(…)</PythonTerm>: O(N) —
            пропорционально количеству объектов, O(N log N) — типичный порядок
            затрат на сортировку, O(N²) — пропорционально квадрату. Это
            сравнение порядка величин, а не точный прогноз времени. Поэтому{" "}
            <strong>
              решения этой темы строятся на сортировке и одном-двух проходах
            </strong>
            , а не на переборе всех наборов.
          </Typography.Text>
          <Typography.Text>
            Обращай внимание и на память. Если координаты не превышают 100 000,
            это ещё не значит, что нужна таблица 100 000 × 100 000: в ней десять
            миллиардов ячеек. Если в файле несколько тысяч отмеченных точек,
            достаточно хранить только их.
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
                note: (
                  <>
                    Объект — запись из связанных полей; сортируют записи
                    целиком.
                  </>
                ),
              },
              {
                note: (
                  <>
                    До кода выписывают ограничения, цель, порядок критериев и
                    что выводить; сравнение по критериям — лексикографическое,
                    как у кортежей.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Заголовок файла читают по описанию формата; универсального
                    заголовка нет.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Правила рейтинга переводятся в ключ: минус у убывающего
                    числа, показатели вычисляются заранее, среднее сравнивают
                    через сумму.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Граница прохода — по точной формулировке: доля — целая
                    часть, «и все с теми же показателями» сдвигает границу.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сортировка — O(N log N), все пары — O(N²): решения темы
                    держатся на сортировке и проходах.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "samye-malenkie",
      navLabel: "Самые маленькие первыми",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В задачах на максимальное количество объектов при ограниченной
              сумме нужно начинать с самых маленьких.
            </strong>{" "}
            Это первая и самая частая модель задания: архив файлов, закупки
            изделий, скидки.
          </Typography.Text>
          <Typography.Text>
            Почти весь урок держится на одном примере: на диске свободно 60, а
            размеры файлов — 8, 12, 15, 19, 22 и 34. Они записаны в файл{" "}
            <Notation>{"26.txt"}</Notation> из прошлой подтемы; чтение файла
            считаем знакомым.
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
            <strong>
              Жадный алгоритм делает последовательные выборы, каждый раз
              используя локальное правило.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например: «из оставшихся подходящих файлов берём самый маленький».
            Такой алгоритм называется <strong>жадным</strong>. Слово «жадный» не
            означает «всегда берёт самое большое»: он может выбирать самый
            маленький размер, самое раннее окончание, наибольшую допустимую
            коробку, самый дешёвый подходящий объект.
          </Typography.Text>
          <Typography.Text>Главный вопрос к жадному алгоритму:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Почему этот выбор не лишит нас лучшего итогового решения?
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Одного ощущения «так выгоднее» недостаточно. Полезны два способа
            объяснения.{" "}
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
      id: "bolshe-vsego-faylov",
      navLabel: "Больше всего файлов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы сохранить больше всего файлов, их набирают от самых
              маленьких.
            </strong>
          </Typography.Text>
          <Typography.Text>
            После сортировки последовательно добавляем файлы, пока следующий
            помещается:
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
            label={"Код повторяет ручные действия. Пройди его по шагам"}
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
      id: "samyy-bolshoy-fayl",
      navLabel: "Самый большой файл",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Второе условие про самый большой файл требует отдельного шага.
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
            code={
              'with open("26.txt") as f:\n    capacity, n = map(int, f.readline().split())\n    a = [int(f.readline()) for i in range(n)]\n\na.sort()\nused = 0\ncount = 0\nfor size in a:\n    if used + size > capacity:\n        break\n    used += size\n    count += 1\n\nfixed_sum = used - a[count - 1]\nlimit = capacity - fixed_sum\nlargest = a[count - 1]\nfor size in a[count - 1:]:\n    if size > limit:\n        break\n    largest = size\n\nprint(count, largest)'
            }
            label={"Полная программа для формата S N в первой строке"}
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
      id: "pokupka-partiyami",
      navLabel: "Покупка партиями",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если покупка идёт партиями, из каждой партии берут столько
              изделий, сколько позволяют деньги.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Иногда в строке файла не одно изделие, а партия: цена одного изделия
            и их количество. Пусть на 500 рублей нужно купить как можно больше
            изделий A, а на остаток — как можно больше изделий B. Партии A: 5
            штук по 20 и 10 штук по 35; партии B: 4 штуки по 25 и 30 штук по 15.
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
            code={
              'money = 500\nlots = {"A": [(20, 5), (35, 10)], "B": [(25, 4), (15, 30)]}\nbought = {}\nfor kind in "AB":\n    count = 0\n    for price, q in sorted(lots[kind]):\n        take = min(q, money // price)\n        count += take\n        money -= take * price\n        if take < q:\n            break\n    bought[kind] = count\nprint(bought["A"], bought["B"], money)'
            }
            label={
              "Деление нацело {{intdiv|//}} отвечает на вопрос «сколько раз цена помещается в остаток»"
            }
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
            <strong>
              Если среди покупок есть разные типы, удобно отдельно рассмотреть
              количество объектов каждого типа.
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
            label={"Для B: PB = 0, 3, 8, 14, 24"}
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
            code={
              "budget = 36\na = sorted([4, 9, 14])\nb = sorted([3, 5, 6, 10])\ncount = spent = 0\nfor price in sorted(a + b):\n    if spent + price > budget:\n        break\n    spent += price\n    count += 1\n\nprefix_a = [0]\nfor price in a:\n    prefix_a.append(prefix_a[-1] + price)\nprefix_b = [0]\nfor price in b:\n    prefix_b.append(prefix_b[-1] + price)\n\nbest_a = best_cost = 0\nfor count_a in range(count + 1):\n    count_b = count - count_a\n    if count_a > len(a) or count_b > len(b):\n        continue\n    cost = prefix_a[count_a] + prefix_b[count_b]\n    if cost <= budget:\n        best_a = count_a\n        best_cost = cost\nprint(best_a, budget - best_cost)"
            }
            label={"Выбираем три A и два B. Остаток равен 1"}
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
            <strong>
              В задачах на скидки сначала нужно выяснить, какие товары могут
              получить скидку.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Фраза «каждый третий товар бесплатно» сама по себе ещё не определяет
            алгоритм. Возможны разные правила — выбери правило, чтобы увидеть,
            что влияет на решение:
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
            label={"Код на Python: prices = [70, 100, 40, 90, 50, 80, 60]"}
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
            Если товары <strong>переставляет продавец</strong> и хочет дать
            скидку поменьше, скидка достаётся самым дешёвым из подходящих
            товаров: продавец ставит их на чётные места. Например, «скидка 25 %
            на каждый второй товар дороже 50 рублей»: из k таких товаров скидку
            получат ⌊k / 2⌋ самых дешёвых.
          </Typography.Text>
          <Typography.Text>
            Отдельный вопрос — округление. Пусть скидка 25 % применяется к
            товарам с суммарной исходной ценой D, а сумма всех цен — T. Тогда
            точная итоговая стоимость T − D/4 = (4T − D)/4. Если{" "}
            <strong>всю итоговую сумму</strong> нужно округлить вверх,{" "}
            <PythonTerm term="ceil">округление вверх</PythonTerm> делают
            целочисленно: <Notation>{"(x + d - 1) // d"}</Notation> — это x/d,
            округлённое вверх, для неотрицательного целого x.
          </Typography.Text>
          <CodeBlock
            code={
              "prices = [65, 300, 45, 120, 200, 80]\nbig = sorted(p for p in prices if p > 50)\ndiscount = big[:len(big) // 2]\ntotal = sum(prices)\nnumerator = 4 * total - sum(discount)\nprint(discount, (numerator + 3) // 4)"
            }
            label={"Код на Python: prices = [65, 300, 45, 120, 200, 80]"}
            language="python"
            output={"[65, 80] 774"}
          />
          <Typography.Text>
            Товаров дороже 50 пять, скидку получают два самых дешёвых из них —
            65 и 80. Точная стоимость 810 − 145/4 = 773,75, после округления
            вверх — 774.{" "}
            <strong>Нельзя округлять стоимость каждого товара отдельно</strong>,
            если условие требует округлить только общую сумму.
          </Typography.Text>
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
                note: (
                  <>
                    Жадный выбор обосновывают: выбранное оставляет не меньше
                    возможностей или заменяет чужой выбор без ухудшения (обмен).
                  </>
                ),
              },
              {
                note: (
                  <>
                    Больше всего объектов при ограниченной сумме — самые
                    маленькие подряд; <Notation>{"break"}</Notation> разрешён
                    только после сортировки.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Наибольший отдельный объект при максимальном количестве: k −
                    1 самых маленьких закреплены, последний — наибольший из
                    помещающихся.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Партии — <Notation>{"min(q, money // p)"}</Notation>; два
                    типа — перебор числа изделий A и накопленные суммы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Скидки: сначала понять, кто выбирает тройки или порядок и
                    какие товары получают скидку; округлять только общую сумму.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "vozmozhnosti-dlya-prodolzheniya",
      navLabel: "Выбор с запасом",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В задачах на вложенные коробки и на пары из двух наборов каждый
              выбор должен оставлять больше возможностей для продолжения.
            </strong>{" "}
            Это вторая жадная модель задания: матрёшка из коробок, торт из
            коржей, грузы и контейнеры, детали двух видов. Она встречается и на
            экзаменах, и в демоверсиях.
          </Typography.Text>
          <Typography.Text>
            Главный пример урока — семь коробок со сторонами 12, 18, 21, 27, 34,
            40 и 45. Одну коробку можно вложить в другую, если её сторона меньше
            хотя бы на 6. Обоснование жадного выбора обменом знакомо по прошлой
            подтеме.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "cepochka-snaruzhi",
      navLabel: "Цепочка снаружи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строить цепочку удобно снаружи: в каждую коробку вкладывают самую
              большую из подходящих.
            </strong>
          </Typography.Text>
          <Typography.Text>Требуется:</Typography.Text>
          <ol>
            <li>Максимальное количество вложенных коробок.</li>
            <li>
              Максимальный возможный размер самой маленькой коробки при таком
              количестве.
            </li>
          </ol>
          <Typography.Text>
            Начнём снаружи. Самая большая коробка — 45. В неё можно поместить
            коробку размером не больше 45 − 6 = 39. Из подходящих выбираем{" "}
            <strong>самую большую</strong> — 34. Почему не 12? Потому что после
            выбора 12 внутри почти не останется возможностей; коробка 34
            оставляет больше места для последующих вложений.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.greedyChain6}
            label={
              "Цепочка коробок 45, 34, … с зазором 6 снаружи внутрь: шаг за шагом"
            }
          />
          <Typography.Text>
            Получилась цепочка 45 → 34 → 27 → 21 → 12 — пять коробок. Код:
            размеры по убыванию, коробка берётся, если она меньше последней
            выбранной хотя бы на зазор.
          </Typography.Text>
          <CodeBlock
            code={
              "sizes = [12, 18, 21, 27, 34, 40, 45]\ngap = 6\nsizes.sort(reverse=True)\nselected = []\nfor size in sizes:\n    if not selected or selected[-1] - size >= gap:\n        selected.append(size)\nprint(len(selected), selected[-1])"
            }
            label={"Код на Python: sizes = [12, 18, 21, 27, 34, 40, 45]"}
            language="python"
            output={"5 12"}
          />
          <Typography.Text>
            Здесь предполагается, что исходный список непустой и{" "}
            <Notation>{"gap > 0"}</Notation>. Условие{" "}
            <PythonTerm term="truthy">
              <Notation>{"not selected"}</Notation>
            </PythonTerm>{" "}
            истинно, пока цепочка пуста: первая, самая большая коробка берётся
            без проверки. Благодаря короткому вычислению{" "}
            <Notation>{"or"}</Notation> к <Notation>{"selected[-1]"}</Notation>{" "}
            пустого списка программа не обращается.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pochemu-cepochka-dlinnee",
      navLabel: "Почему цепочка самая длинная",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Жадная цепочка самая длинная, потому что на каждой глубине у неё
              самая большая возможная коробка.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Алгоритм на каждой глубине выбирает максимально возможный размер:
            первая коробка максимально большая; вторая — максимально большая
            среди помещающихся в первую; третья — максимально большая среди
            помещающихся во вторую. Значит,{" "}
            <strong>
              если любая другая цепочка может продолжиться, жадная тоже может
            </strong>
            : её коробка на той же глубине не меньше, и в неё помещается всё,
            что помещалось в чужую. А среди цепочек максимальной длины последняя
            выбранная коробка получается максимально большой — это и есть второй
            критерий.
          </Typography.Text>
          <ProofDisclosure summary="Доказательство для любых размеров">
            <Typography.Text>
              Пусть жадная цепочка g₁ {">"} g₂ {">"} …, а другая допустимая
              цепочка c₁ {">"} c₂ {">"} … {">"} cₘ. Покажем по шагам, что gᵢ ≥
              cᵢ для каждого i ≤ m. Для i = 1 это верно: g₁ — самая большая
              коробка вообще. Пусть gᵢ ≥ cᵢ. Коробка cᵢ₊₁ ≤ cᵢ − 6 ≤ gᵢ − 6,
              значит, она подходит для вложения в gᵢ, и жадный алгоритм найдёт
              подходящую коробку; он берёт наибольшую из подходящих, поэтому
              gᵢ₊₁ ≥ cᵢ₊₁. Следовательно, жадная цепочка не короче любой другой,
              а её i-я коробка не меньше i-й коробки любой другой цепочки — в
              том числе последняя.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "napravlenie-postroeniya",
      navLabel: "Направление построения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Направление построения связано и с допустимостью, и со вторым
              критерием.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если второй критерий другой —{" "}
            <strong>минимизировать размер самой большой коробки</strong>, —
            удобно строить цепочку <strong>изнутри наружу</strong>:
            отсортировать размеры по возрастанию, начать с самой маленькой и
            каждый раз брать наименьшую коробку, которая достаточно больше
            предыдущей. Рассуждение то же, только зеркальное: маленькая внешняя
            коробка на каждом шаге оставляет больше выбора для следующей.
          </Typography.Text>
          <CodeBlock
            code={
              "sizes = [12, 18, 21, 27, 34, 40, 45]\ngap = 6\nchain = []\nfor size in sorted(sizes):\n    if not chain or size - chain[-1] >= gap:\n        chain.append(size)\nprint(*chain)"
            }
            label={"Код на Python: sizes = [12, 18, 21, 27, 34, 40, 45]"}
            language="python"
            output={"12 18 27 34 40"}
          />
          <Typography.Text>
            Пять коробок, внешняя имеет размер 40, а снаружи внутрь внешней была
            45. Количество одинаковое, а второе число зависит от направления:{" "}
            <strong>
              строй от той стороны, которую оптимизирует второй критерий
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Этот разбор предполагает одинаковый минимальный зазор между
            соседними коробками и отсутствие других ограничений. Материалы и
            цвета, которые должны чередоваться, или зазор, растущий с номером
            коробки, — это усложнения из дополнительной подтемы 8: для них нужно
            новое обоснование.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-ukazatelya",
      navLabel: "Два указателя",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Два указателя помогают работать с отсортированными списками без
              перебора всех пар.
            </strong>
          </Typography.Text>
          <Typography.Text>
            <strong>Указатель</strong> здесь — обычная переменная, хранящая
            индекс текущего элемента: <Notation>{"left = 0"}</Notation> стоит в
            начале списка, <Notation>{"right = len(a) - 1"}</Notation> — в
            конце. Рассмотрим задачу:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Каждый рейс перевозит не более двух человек. Суммарная масса не
              превышает вместимость. Нужно минимизировать количество рейсов.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Предполагается, что любой человек может ехать один. Сортируем массы
            и берём самого тяжёлого из оставшихся.{" "}
            <strong>
              Если он не помещается вместе с самым лёгким, ни с кем другим он
              тоже не поместится
            </strong>{" "}
            — значит, должен ехать один. Если помещается, их можно объединить.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.greedyTrips150}
            label={
              "Рейсы по два человека при вместимости 150 двумя указателями: шаг за шагом"
            }
          />
          <CodeBlock
            code={
              "w = [80, 130, 50, 100, 70, 60]\ncapacity = 150\nw.sort()\nleft = 0\nright = len(w) - 1\ntrips = 0\nwhile left <= right:\n    if left < right and w[left] + w[right] <= capacity:\n        left += 1\n    right -= 1\n    trips += 1\nprint(trips)"
            }
            label={"Если помещается, их можно объединить"}
            language="python"
            output={"4"}
          />
          <Typography.Text>
            При совместной поездке двигаются оба индекса: использованы два
            человека. Если вместе не помещаются, используется только тяжёлый —
            двигается правый индекс. При <Notation>{"left == right"}</Notation>{" "}
            остался один человек, и условие{" "}
            <Notation>{"left < right"}</Notation> не позволяет использовать его
            дважды. Каждый указатель проходит список один раз, поэтому после
            сортировки работа — O(N).
          </Typography.Text>
          <ProofDisclosure summary="Почему самого тяжёлого можно посадить с самым лёгким">
            <Typography.Text>
              Обоснование строится обменом: самого тяжёлого можно объединить с
              самым лёгким, не ухудшая необходимое количество пар. Если в другом
              размещении они ехали с другими людьми, пары можно перестроить:
              тяжёлый поедет с лёгким, а их бывшие партнёры — вместе. Оставшиеся
              партнёры совместимы, поскольку каждый из них не тяжелее самого
              тяжёлого, а тот помещался с лёгким. Число рейсов от перестройки не
              растёт.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            <strong>Ограничение «не более двух» существенно.</strong> Для
            произвольного числа объектов в рейсе этот алгоритм уже не является
            решением общей задачи упаковки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gruzy-i-konteynery",
      navLabel: "Грузы и контейнеры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Грузы и контейнеры из двух независимых наборов сопоставляют по
              возрастанию: самый лёгкий груз — в самый маленький подходящий
              контейнер.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Иногда в строке файла два числа, которые не связаны между собой:
            масса груза и вместимость контейнера, причём каждый контейнер берёт
            один груз любой массы, не большей его вместимости. Это то самое
            исключение из правила «сортировать записи целиком»: грузы и
            контейнеры — <strong>два отдельных списка</strong>, и сортируют их
            по отдельности.
          </Typography.Text>
          <Typography.Text>
            Пусть массы грузов 15, 40, 25, 48, 30, а вместимости контейнеров 20,
            10, 50, 35, 45. Чтобы отправить больше грузов, идём по грузам от
            лёгких и для каждого берём самый маленький из оставшихся подходящих
            контейнеров: 15 → 20, 25 → 35, 30 → 45, 40 → 50, а для 48 контейнера
            уже нет. Отправлено 4 груза.
          </Typography.Text>
          <Typography.Text>
            Почему так правильно? Самому лёгкому грузу подходит любой контейнер,
            подходящий другим; отдавая ему самый маленький,{" "}
            <strong>мы сохраняем большие контейнеры для тяжёлых грузов</strong>{" "}
            — снова «оставить больше возможностей».
          </Typography.Text>
          <Typography.Text>
            Второй вопрос — наибольшая масса отправленного груза при
            максимальном количестве — решается приёмом прошлой подтемы:
            закрепляем k − 1 = 3 самых лёгких груза в их самых маленьких
            контейнерах (20, 35, 45), а последний груз берём наибольший из тех,
            что помещаются в самый большой из оставшихся контейнеров — 50. Это
            48, а не 40.
          </Typography.Text>
          <CodeBlock
            code={
              "goods = sorted([15, 40, 25, 48, 30])\nboxes = sorted([20, 10, 50, 35, 45])\ncount = j = 0\nfor g in goods:\n    while j < len(boxes) and boxes[j] < g:\n        j += 1\n    if j == len(boxes):\n        break\n    count += 1\n    j += 1\n\nused = [False] * len(boxes)\nj = 0\nfor g in goods[:count - 1]:\n    while boxes[j] < g:\n        j += 1\n    used[j] = True\n    j += 1\nroom = max(b for b, u in zip(boxes, used) if not u)\nprint(count, max(g for g in goods[count - 1:] if g <= room))"
            }
            label={"Это 48, а не 40"}
            language="python"
            output={"4 48"}
          />
          <Typography.Text>
            Первый цикл считает количество, второй закрепляет k − 1 самых лёгких
            грузов:{" "}
            <PythonTerm term="listmul">
              <Notation>{"[False] * len(boxes)"}</Notation>
            </PythonTerm>{" "}
            отмечает, какие контейнеры они заняли. Указатель{" "}
            <Notation>{"j"}</Notation> по контейнерам только растёт: контейнер,
            который мал для лёгкого груза, тем более мал для следующих, более
            тяжёлых.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "detali-dvuh-vidov",
      navLabel: "Детали двух видов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Детали двух видов соединяют, начиная с крупнейших совместимых.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Другая полезная модель — две разновидности деталей. Для изделия
            нужна одна деталь A и одна B, их размеры различаются не более чем на
            D, прибыль равна сумме размеров, все размеры положительные.
            Сортируем оба списка по убыванию. Если самая большая A больше самой
            большой B более чем на D, эта A не подойдёт ни к одной оставшейся B
            — её можно пропустить. Аналогично для слишком большой B. Если
            крупнейшие совместимы — объединяем их.
          </Typography.Text>
          <Typography.Text>
            Пусть A = 50, 42, 30, 12, B = 47, 33, 20, 18, D = 5. Пара 50 и 47
            подходит; 42 больше 33 + 5 — деталь 42 пропускаем; 30 и 33 подходят;
            20 больше 12 + 5 — пропускаем 20, затем и 18. Получаем 2 изделия с
            прибылью 97 + 63 = 160.
          </Typography.Text>
          <CodeBlock
            code={
              "a = sorted([50, 42, 30, 12], reverse=True)\nb = sorted([47, 33, 20, 18], reverse=True)\ndistance = 5\ni = j = 0\ncount = profit = 0\nwhile i < len(a) and j < len(b):\n    if a[i] > b[j] + distance:\n        i += 1\n    elif b[j] > a[i] + distance:\n        j += 1\n    else:\n        count += 1\n        profit += a[i] + b[j]\n        i += 1\n        j += 1\nprint(count, profit)"
            }
            label={"Получаем 2 изделия с прибылью 97 + 63 = 160"}
            language="python"
            output={"2 160"}
          />
          <ProofDisclosure summary="Почему можно объединить крупнейшие совместимые детали">
            <Typography.Text>
              Если в другом решении они соединены с другими партнёрами, эти две
              пары можно перестроить: крупнейшие — вместе, их бывшие партнёры —
              вместе. Меньшие оставшиеся партнёры сохранят совместимость: их
              разность ограничивается одной из уже допустимых разностей. Если
              одна из крупнейших деталей не использовалась, замена меньшей
              детали на неё не уменьшает прибыль.
            </Typography.Text>
            <Typography.Text>
              Здесь доказательство использует конкретную совместимость по
              разности размеров и конкретную формулу прибыли. При других
              правилах оно может перестать работать. Проверка перебором на
              тысячах маленьких наборов подтверждает: этот проход даёт и
              наибольшую прибыль, и наибольшее количество изделий.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "cepochki-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Цепочка снаружи внутрь: в каждую коробку — самую большую из
                    подходящих; так получается самая длинная цепочка с
                    наибольшей внутренней коробкой.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Изнутри наружу — самая короткая внешняя коробка; направление
                    выбирают по второму критерию.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Два указателя по отсортированному списку заменяют перебор
                    всех пар; самый тяжёлый едет с самым лёгким или один.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Два независимых набора сортируют отдельно; самый лёгкий груз
                    — в самый маленький подходящий контейнер; наибольший груз
                    при максимальном количестве — через k − 1 самых лёгких.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Детали A и B — крупнейшие совместимые вместе, несовместимую
                    крупнейшую пропускают.
                  </>
                ),
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
