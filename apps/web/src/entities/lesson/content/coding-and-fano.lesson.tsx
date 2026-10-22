import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  ProofDisclosure,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { codingAndFanoLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./coding-and-fano.media";
import { SubtopicLink } from "./subtopic-link";

const R = "4-kodirovanie-i-uslovie-fano";

export const codingAndFanoLesson = defineLesson({
  ...codingAndFanoLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Проверять условие Фано в обе стороны и читать сообщение слева направо",
    "Видеть коды как пути в двоичном дереве и находить кратчайший свободный код",
    "Находить наименьшую сумму длин кодов, оставляя место всем буквам алфавита",
    "Считать наименьшую длину слова по частотам и сравнивать два варианта дерева",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "kod-i-uslovie-fano",
      title: "Код и условие Фано",
      lead: "Что такое код буквы, почему разные коды ещё не гарантируют однозначного чтения и что запрещает условие Фано.",
      conceptIds: [
        "kak-ustroena-tema-4",
        "kod-bukvy",
        "dlina-kodovogo-slova",
        "ravnomernyj-kod",
        "neodnoznachnost",
        "uslovie-fano",
        "chtenie-sleva",
        "proverka-v-obe-storony",
        "fano-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Какие пары кодов нарушают условие Фано:{" "}
              <Notation>{"11"}</Notation> и <Notation>{"110"}</Notation>;{" "}
              <Notation>{"01"}</Notation> и <Notation>{"101"}</Notation>;{" "}
              <Notation>{"100"}</Notation> и <Notation>{"10"}</Notation>;{" "}
              <Notation>{"0110"}</Notation> и <Notation>{"011"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Нарушают первая, третья и четвёртая пары:{" "}
              <Notation>{"11"}</Notation> — начало <Notation>{"110"}</Notation>,{" "}
              <Notation>{"10"}</Notation> — начало <Notation>{"100"}</Notation>,{" "}
              <Notation>{"011"}</Notation> — начало{" "}
              <Notation>{"0110"}</Notation>. В паре <Notation>{"01"}</Notation>{" "}
              и <Notation>{"101"}</Notation> код <Notation>{"01"}</Notation>{" "}
              стоит в конце, а не в начале.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Для кодов А — <Notation>{"1"}</Notation>, Б —{" "}
              <Notation>{"10"}</Notation>, В — <Notation>{"0"}</Notation> найди
              последовательность из трёх знаков, которую можно прочитать двумя
              способами.
            </>
          ),
          reveal: (
            <>
              <Notation>{"100"}</Notation>: целиком 10 | 0 — БВ, по знакам 1 | 0
              | 0 — АВВ.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Выполняется ли условие Фано для кодов А —{" "}
              <Notation>{"01"}</Notation>, Б — <Notation>{"10"}</Notation>, В —{" "}
              <Notation>{"0"}</Notation>, Г — <Notation>{"11"}</Notation>? Если
              нет, назови пару, которая его нарушает.
            </>
          ),
          reveal: (
            <>
              Нет: <Notation>{"0"}</Notation> — начало{" "}
              <Notation>{"01"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              К кодам А — <Notation>{"01"}</Notation> и Б —{" "}
              <Notation>{"100"}</Notation> добавляют код В. Какие из кандидатов{" "}
              <Notation>{"0"}</Notation>, <Notation>{"10"}</Notation>,{" "}
              <Notation>{"011"}</Notation>, <Notation>{"1000"}</Notation>,{" "}
              <Notation>{"11"}</Notation> подходят? Для каждого неподходящего
              назови, какая из двух проверок не пройдена.
            </>
          ),
          reveal: (
            <>
              Подходит только <Notation>{"11"}</Notation>. Кандидаты{" "}
              <Notation>{"0"}</Notation> и <Notation>{"10"}</Notation> — начала
              существующих <Notation>{"01"}</Notation> и{" "}
              <Notation>{"100"}</Notation> (первая проверка); существующие{" "}
              <Notation>{"01"}</Notation> и <Notation>{"100"}</Notation> —
              начала кандидатов <Notation>{"011"}</Notation> и{" "}
              <Notation>{"1000"}</Notation> (вторая проверка).
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Для четырёх букв предложены наборы кодов: 1){" "}
              <Notation>{"0"}</Notation>, <Notation>{"10"}</Notation>,{" "}
              <Notation>{"110"}</Notation>, <Notation>{"111"}</Notation>; 2){" "}
              <Notation>{"0"}</Notation>, <Notation>{"01"}</Notation>,{" "}
              <Notation>{"11"}</Notation>, <Notation>{"101"}</Notation>; 3){" "}
              <Notation>{"00"}</Notation>, <Notation>{"01"}</Notation>,{" "}
              <Notation>{"10"}</Notation>, <Notation>{"1"}</Notation>; 4){" "}
              <Notation>{"1"}</Notation>, <Notation>{"01"}</Notation>,{" "}
              <Notation>{"001"}</Notation>, <Notation>{"000"}</Notation>. В
              каких наборах выполняется условие Фано?
            </>
          ),
          reveal: (
            <>
              В наборах 1 и 4. В наборе 2 <Notation>{"0"}</Notation> — начало{" "}
              <Notation>{"01"}</Notation>, в наборе 3 <Notation>{"1"}</Notation>{" "}
              — начало <Notation>{"10"}</Notation>.
            </>
          ),
        },
      ],
    },
    {
      slug: "kodovoe-derevo",
      title: "Кодовое дерево и кратчайший код",
      lead: "Коды как пути в дереве: как читать сообщение, где свободные ветви и какой код самый короткий.",
      conceptIds: [
        "kody-kak-puti",
        "put-ot-kornya",
        "fano-na-dereve",
        "chtenie-po-derevu",
        "svobodnaya-vetv",
        "kratchajshij-kod",
        "derevo-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-2",
          prompt: (
            <>
              Нарисуй дерево кодов А — <Notation>{"01"}</Notation>, Б —{" "}
              <Notation>{"000"}</Notation>, В — <Notation>{"11"}</Notation>.
              Какие ветви свободны?
            </>
          ),
          reveal: (
            <>
              <Notation>{"001"}</Notation> и <Notation>{"10"}</Notation>: под{" "}
              <Notation>{"0"}</Notation> заняты <Notation>{"01"}</Notation> и{" "}
              <Notation>{"000"}</Notation>, под <Notation>{"1"}</Notation> —
              только <Notation>{"11"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              По таблице А — <Notation>{"0"}</Notation>, Б —{" "}
              <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
              <Notation>{"111"}</Notation> прочитай{" "}
              <Notation>{"11010"}</Notation> и <Notation>{"1101"}</Notation>.
              Какая из записей неполная?
            </>
          ),
          reveal: (
            <>
              <Notation>{"11010"}</Notation> — ВБ: 110 | 10. Запись{" "}
              <Notation>{"1101"}</Notation> неполная: после 110 остаётся{" "}
              <Notation>{"1"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Для таблицы А — <Notation>{"1"}</Notation>, Б —{" "}
              <Notation>{"000"}</Notation>, В — <Notation>{"011"}</Notation>{" "}
              найди кратчайший код Г с наибольшим числовым значением.
            </>
          ),
          reveal: (
            <>
              <Notation>{"010"}</Notation>: свободны две вершины длины 3 —{" "}
              <Notation>{"001"}</Notation> и <Notation>{"010"}</Notation>,
              коротких свободных нет; большее значение у{" "}
              <Notation>{"010"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Кратчайший код получился <Notation>{"001"}</Notation>. Можно ли
              записать ответ как <Notation>{"1"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Нет: код — последовательность знаков, ведущие нули — её часть.{" "}
              <Notation>{"1"}</Notation> — другой код длины 1, и он здесь занят.
            </>
          ),
        },
      ],
    },
    {
      slug: "mesto-dlya-vseh-bukv",
      title: "Место для всех букв и сумма длин",
      lead: "Почему место нужно оставить каждой букве и как получить наименьшую сумму длин кодов — и ответ задачи темы.",
      conceptIds: [
        "kod-kazhdoj-bukve",
        "mesta-ne-hvatit",
        "odnoj-vetvi-hvataet",
        "naimenshaya-summa",
        "neskolko-vetvej",
        "mesto-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Алфавит — А, Б, В, Г, Д; А — <Notation>{"00"}</Notation>, Б —{" "}
              <Notation>{"01"}</Notation>, В — <Notation>{"10"}</Notation>.
              Можно ли дать Г код <Notation>{"11"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Нет: <Notation>{"11"}</Notation> — последняя свободная вершина, и
              Д не останется места. Г — <Notation>{"110"}</Notation>, Д —{" "}
              <Notation>{"111"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Кодируется весь русский алфавит, а свободной осталась одна ветвь{" "}
              <Notation>{"111…"}</Notation>. Хватит ли её остальным двадцати
              девяти буквам?
            </>
          ),
          reveal: (
            <>
              Да, если длина кодов не ограничена: ветвь делят дальше, и
              пятизначных продолжений у неё уже 32.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Заданы А — <Notation>{"1"}</Notation>, Б —{" "}
              <Notation>{"01"}</Notation>. Какова наименьшая сумма длин кодов
              ещё четырёх букв?
            </>
          ),
          reveal: (
            <>
              16: свободна ветвь <Notation>{"00"}</Notation>; делим её на{" "}
              <Notation>{"000"}</Notation> и <Notation>{"001"}</Notation>, а обе
              ещё раз — четыре кода длины 4. Вариант с длинами 3, 4, 5, 5 даёт
              17.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Заданы А — <Notation>{"0"}</Notation>, Б —{" "}
              <Notation>{"100"}</Notation>. Какова наименьшая сумма длин кодов
              ещё трёх букв?
            </>
          ),
          reveal: (
            <>
              9: свободны <Notation>{"101"}</Notation> и{" "}
              <Notation>{"11"}</Notation>. Мест нужно три — делим более короткую{" "}
              <Notation>{"11"}</Notation> на <Notation>{"110"}</Notation> и{" "}
              <Notation>{"111"}</Notation>: три кода длины 3.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Заданы А — <Notation>{"00"}</Notation>, Б —{" "}
              <Notation>{"01"}</Notation>, В — <Notation>{"10"}</Notation>,
              найдены Г — <Notation>{"110"}</Notation>, Д —{" "}
              <Notation>{"111"}</Notation>. Чему равна сумма длин всех пяти
              кодов?
            </>
          ),
          reveal: <>12: 2 + 2 + 2 + 3 + 3 — заданные коды тоже считаются.</>,
        },
      ],
    },
    {
      slug: "dlina-slova",
      title: "Длина закодированного слова",
      lead: "Как сделать закодированное слово как можно короче: частым буквам — короткие коды, но не всегда.",
      conceptIds: [
        "dlina-zakodirovannogo",
        "chto-umenshat",
        "chastoty-i-dliny",
        "bukva-ne-v-slove",
        "rezervnaya-vetv",
        "chastym-korotkie",
        "lovushka-chastoj",
        "dlina-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Коды: А — <Notation>{"0"}</Notation>, Б —{" "}
              <Notation>{"10"}</Notation>. Сколько знаков в записи слова АББА?
            </>
          ),
          reveal: <>6: 1 + 2 + 2 + 1 — каждое появление буквы считается.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Свободны места длины 2 и 3. Буква К встречается в слове 3 раза, Л
              — 2 раза. Как назначить коды?
            </>
          ),
          reveal: (
            <>
              К — короткое место: 3 · 2 + 2 · 3 = 12, а наоборот 3 · 3 + 2 · 2 =
              13.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Буквы Н нет в слове, но она есть в алфавите. Нужно ли оставлять ей
              место в дереве?
            </>
          ),
          reveal: (
            <>
              Да: код нужен каждой букве алфавита. Её частота 0, поэтому длину
              слова она не меняет, но свободную вершину занимает.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Самой частой букве можно отдать свободную вершину{" "}
              <Notation>{"00"}</Notation> или разделить её на{" "}
              <Notation>{"000"}</Notation> и <Notation>{"001"}</Notation>. Как
              решить, что выгоднее?
            </>
          ),
          reveal: (
            <>
              Нарисовать оба варианта дерева, расставить буквы по частотам и
              сравнить длины слова — иногда короче получается с разделённой
              вершиной.
            </>
          ),
        },
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-4",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 4 буквам дают коды из нулей и единиц разной длины. Часть
            кодов известна, остальные нужно подобрать — самые короткие или так,
            чтобы сообщение получилось короче. Вот задача, которую мы будем
            решать всю тему:
          </Typography.Text>
          <Typography.Text>
            «По каналу связи передаются сообщения из букв А, Б, В, Г, Д.
            Используется двоичный код, удовлетворяющий условию Фано; известны
            коды А — <Notation>{"0"}</Notation>, Б — <Notation>{"10"}</Notation>
            , В — <Notation>{"110"}</Notation>. Укажи кратчайший код буквы Г,
            если код буквы Д тоже должен существовать».
          </Typography.Text>
          <Typography.Text>
            <strong>
              Все такие задачи решаются одним рисунком — деревом кодов: на нём
              видно, какие коды заняты и где осталось место.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              [
                "сообщения из букв А, Б, В, Г, Д",
                "в алфавите пять букв, код нужен каждой",
              ],
              ["двоичный код", "коды — строки из нулей и единиц"],
              ["условие Фано", "ни один код не совпадает с началом другого"],
              ["известны коды А, Б, В", "три кода уже заняты"],
              [
                "кратчайший код Г, код Д тоже должен существовать",
                "Г — как можно короче, но так, чтобы осталось место для Д",
              ],
            ]}
          />
          <Typography.Text>
            Почти всё время будем кодировать четыре буквы А, Б, В, Г одной
            таблицей: А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
            <Notation>{"111"}</Notation>. Тема состоит из четырёх подтем — у
            каждой своя страница. Идём по ним по порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Код и условие Фано</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="kodovoe-derevo">
                Кодовое дерево и кратчайший код
              </SubtopicLink>{" "}
              — как найти самый короткий свободный код.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="mesto-dlya-vseh-bukv">
                Место для всех букв и сумма длин
              </SubtopicLink>{" "}
              — почему нужно оставить место всем буквам, и ответ задачи темы:
              1110.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="dlina-slova">
                Длина закодированного слова
              </SubtopicLink>{" "}
              — как сделать закодированное сообщение короче.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "kod-bukvy",
      navLabel: "Код буквы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код сопоставляет каждой букве алфавита последовательность знаков.
            </strong>{" "}
            Представим, что нужно передавать сообщения из четырёх букв: А, Б, В,
            Г. Этот набор разрешённых символов называется{" "}
            <strong>алфавитом сообщения</strong>. Здесь слово «алфавит» означает
            просто набор символов, которые могут встречаться: это могут быть
            буквы, цифры, цвета или условные сигналы.
          </Typography.Text>
          <Typography.Text>
            Пусть устройство передаёт только два знака:{" "}
            <Notation>{"0"}</Notation> и <Notation>{"1"}</Notation>. Тогда
            каждой букве нужно сопоставить некоторую последовательность этих
            знаков. Например:
          </Typography.Text>
          <LessonTable
            label={"Например"}
            columns={[{ label: "Буква" }, { label: "Её код" }]}
            rows={[
              [
                "А",
                <>
                  <Notation>{"0"}</Notation>
                </>,
              ],
              [
                "Б",
                <>
                  <Notation>{"10"}</Notation>
                </>,
              ],
              [
                "В",
                <>
                  <Notation>{"110"}</Notation>
                </>,
              ],
              [
                "Г",
                <>
                  <Notation>{"111"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            Такая таблица задаёт правило кодирования.{" "}
            <strong>Кодовое слово</strong> — последовательность знаков, которая
            обозначает один символ исходного алфавита. Например,{" "}
            <Notation>{"110"}</Notation> — кодовое слово буквы В.
          </Typography.Text>
          <Typography.Text>
            Здесь важно различать <strong>обычное слово</strong>, например БАВ,
            и <strong>кодовое слово одной буквы</strong>, например{" "}
            <Notation>{"110"}</Notation>. Чтобы закодировать обычное слово,
            заменяем каждую букву её кодом и соединяем результаты:
          </Typography.Text>
          <Typography.Text>
            БАВ → 10 | 0 | 110 → <Notation>{"100110"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Вертикальные черты стоят только для объяснения. Обычно в
            передаваемой последовательности разделителей между кодами нет.{" "}
            <strong>Декодирование</strong> — обратная операция: по
            последовательности <Notation>{"100110"}</Notation> нужно
            восстановить БАВ.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlina-kodovogo-slova",
      navLabel: "Длина кодового слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Длина кодового слова — количество знаков в нём, а сам код —
              последовательность, а не число.
            </strong>{" "}
            У <Notation>{"0"}</Notation> длина 1, у <Notation>{"10"}</Notation>{" "}
            — 2, у <Notation>{"110"}</Notation> — 3, у{" "}
            <Notation>{"00101"}</Notation> — 5.
          </Typography.Text>
          <Typography.Text>
            Поскольку используются два знака, код называется{" "}
            <strong>двоичным</strong>. Один двоичный знак в такой записи
            занимает один бит. Поэтому «длина 5 двоичных знаков» и «длина 5 бит»
            в этих задачах означают одно и то же.
          </Typography.Text>
          <Typography.Text>Несколько важных договорённостей:</Typography.Text>
          <ul>
            <li>
              одна и та же буква во всех местах сообщения имеет один и тот же
              код;
            </li>
            <li>разные буквы должны иметь разные коды;</li>
            <li>кодовые слова непустые;</li>
            <li>заданные в условии коды менять нельзя.</li>
          </ul>
          <Typography.Text>
            Ещё одна тонкость:{" "}
            <strong>
              кодовое слово — прежде всего последовательность знаков, а не число
            </strong>
            . Записи <Notation>{"1"}</Notation>, <Notation>{"01"}</Notation> и{" "}
            <Notation>{"001"}</Notation> как двоичные записи чисел обозначают
            одно и то же значение — единицу. Но как кодовые слова это три разные
            последовательности разной длины.{" "}
            <strong>Ведущие нули в кодах удалять нельзя.</strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ravnomernyj-kod",
      navLabel: "Равномерный и неравномерный код",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Равномерный код режут на куски одной длины, неравномерный так
              прочитать нельзя.
            </strong>{" "}
            Если все кодовые слова имеют одинаковую длину, код называется{" "}
            <strong>равномерным</strong>. Например, А —{" "}
            <Notation>{"00"}</Notation>, Б — <Notation>{"01"}</Notation>, В —{" "}
            <Notation>{"10"}</Notation>, Г — <Notation>{"11"}</Notation>.
            Получив <Notation>{"011011"}</Notation>, мы просто разбиваем его на
            группы по два знака: <Notation>{"01 | 10 | 11"}</Notation> — и
            получаем БВГ. Границы кодовых слов известны заранее: через каждые
            два знака начинается следующая буква.
          </Typography.Text>
          <Typography.Text>
            Если длины различаются, код называется{" "}
            <strong>неравномерным</strong>. Такова наша таблица А —{" "}
            <Notation>{"0"}</Notation>, Б — <Notation>{"10"}</Notation>, В —{" "}
            <Notation>{"110"}</Notation>, Г — <Notation>{"111"}</Notation>.
            Теперь разрезать сообщение на равные части нельзя: нужно другое
            правило, которое позволит находить границы букв.
          </Typography.Text>
          <Typography.Text>
            Зачем вообще использовать разные длины?{" "}
            <strong>Чтобы частые символы передавать короткими кодами</strong> и
            тем самым уменьшать длину сообщения. Это разберём в подтеме 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neodnoznachnost",
      navLabel: "Неоднозначное чтение",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разных кодов у букв ещё недостаточно: одну строку можно разрезать
              по-разному.
            </strong>{" "}
            Рассмотрим таблицу А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"01"}</Notation>, В — <Notation>{"1"}</Notation>. Все три
            кода различаются. Но что означает последовательность{" "}
            <Notation>{"01"}</Notation>?
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeParses0011_01}
            caption={
              <>
                Одна и та же полученная строка 01 режется на коды таблицы двумя
                способами: целиком это Б, а по одному знаку — АВ.
              </>
            }
          />
          <Typography.Text>
            Одному переданному сообщению соответствуют два разных исходных.
            Получатель не может определить, какое из них было отправлено.
          </Typography.Text>
          <Typography.Text>
            Код годится, только если <strong>любую</strong> запись можно
            прочитать единственным способом: одного удачно прочитанного слова
            мало.
          </Typography.Text>
          <Typography.Text>
            В задании 4 обычно используется удобное требование, которое
            гарантирует однозначность, — условие Фано.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uslovie-fano",
      navLabel: "Условие Фано",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие Фано: ни одно кодовое слово не должно быть началом другого
              кодового слова.
            </strong>{" "}
            Последовательность <Notation>{"01"}</Notation> является началом
            последовательности <Notation>{"0110"}</Notation>, потому что первые
            два знака <Notation>{"0110"}</Notation> — это именно{" "}
            <Notation>{"01"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            При проверке двух кодовых слов нас интересует один случай:{" "}
            <strong>
              более короткое полностью совпадает с началом более длинного
            </strong>
            .
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codePairs_66db56}
            caption={
              <>
                Слова выровнены по левому краю. В первых двух парах короткое
                слово целиком совпадает с началом длинного — так нельзя. Коды
                010 и 011 начинаются одинаково, но расходятся в третьем знаке.
                010 стоит в конце 0010, а не в начале.
              </>
            }
          />
          <Typography.Text>
            Последняя пара особенно важна. Последовательность{" "}
            <Notation>{"010"}</Notation> находится <strong>в конце</strong>{" "}
            <Notation>{"0010"}</Notation>, но условие Фано запрещает именно
            совпадение с началом.
          </Typography.Text>
          <Typography.Text>
            Ещё одна тонкость: <strong>общие начальные знаки разрешены</strong>.
            Коды <Notation>{"010"}</Notation> и <Notation>{"011"}</Notation> оба
            начинаются с <Notation>{"01"}</Notation>. Это не нарушает условие
            Фано, потому что <Notation>{"01"}</Notation> не является отдельным
            кодом какой-либо буквы. Запрещено не «иметь общее начало», а{" "}
            <strong>целиком совпадать с началом другого кодового слова</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chtenie-sleva",
      navLabel: "Чтение слева направо",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие Фано позволяет читать сообщение слева направо, не
              заглядывая вперёд.
            </strong>{" "}
            Вернёмся к таблице А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
            <Notation>{"111"}</Notation>. Читаем сообщение слева направо и
            накапливаем знаки.
          </Typography.Text>
          <ol>
            <li>
              Если накопилось <Notation>{"0"}</Notation>, мы сразу узнаём А.
              Ждать продолжения не нужно: никакая другая буква не имеет кода,
              начинающегося с <Notation>{"0"}</Notation>.
            </li>
            <li>
              Если накопилось <Notation>{"1"}</Notation>, буква ещё не
              определена: такого кодового слова в таблице нет. Читаем дальше.
            </li>
            <li>
              Если получилось <Notation>{"10"}</Notation>, узнаём Б.
              Продолжения, которое превратило бы <Notation>{"10"}</Notation> в
              код другой буквы, быть не может.
            </li>
          </ol>
          <Typography.Text>
            Так происходит после каждой буквы:{" "}
            <strong>первое совпавшее кодовое слово уже и есть буква</strong>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему два прочтения невозможны"
          >
            <Typography.Text>
              Предположим, что у сообщения есть два разных разбиения на кодовые
              слова. Рассмотрим первое место, где эти разбиения различаются.
              Один из выбранных кодов должен закончиться раньше другого. Тогда
              он окажется началом более длинного кода — вопреки условию Фано.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "proverka-v-obe-storony",
      navLabel: "Проверка в обе стороны",
      explanation: (
        <>
          <Typography.Text>
            <strong>Новый код проверяют в обе стороны.</strong> Пусть уже
            существует код А — <Notation>{"010"}</Notation>. Нельзя добавить код
            Б — <Notation>{"01"}</Notation>: новый код является началом
            существующего <Notation>{"010"}</Notation>. Но нельзя добавить и{" "}
            <Notation>{"0101"}</Notation>: существующий код{" "}
            <Notation>{"010"}</Notation> является началом нового.
          </Typography.Text>
          <Typography.Text>
            Поэтому для каждого нового кандидата нужно задать два вопроса:
          </Typography.Text>
          <ol>
            <li>
              Не является ли новый код началом какого-нибудь существующего?
            </li>
            <li>
              Не является ли какой-нибудь существующий код началом нового?
            </li>
          </ol>
          <Typography.Text>
            <strong>
              Проверка только одного направления — распространённая ошибка.
            </strong>{" "}
            При этом код <Notation>{"011"}</Notation> добавить можно: у{" "}
            <Notation>{"010"}</Notation> и <Notation>{"011"}</Notation> общие
            первые два знака, но затем они расходятся. А одинаковый код{" "}
            <Notation>{"010"}</Notation> второй букве назначить нельзя: две
            буквы стали бы неразличимыми.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fano-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Кодовое слово",
                note: (
                  <>
                    последовательность 0 и 1 для одной буквы; ведущие нули — её
                    часть
                  </>
                ),
              },
              {
                key: "Длина кода",
                note: <>число знаков в кодовом слове</>,
              },
              {
                key: "Неравномерный код",
                note: <>одну запись можно разрезать на коды по-разному</>,
              },
              {
                key: "Условие Фано",
                note: (
                  <>
                    ни один код не начало другого; общее начало и совпадение с
                    концом разрешены
                  </>
                ),
              },
              {
                key: "Новый код",
                note: (
                  <>
                    проверяют в обе стороны: не начало ли он чужого и не
                    начинается ли с чужого
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "kody-kak-puti",
      navLabel: "Коды как пути",
      explanation: (
        <>
          <Typography.Text>
            Задача подтемы: сообщения состоят из букв А, Б, В, Г; известны А —{" "}
            <Notation>{"1"}</Notation>, Б — <Notation>{"000"}</Notation>, В —{" "}
            <Notation>{"011"}</Notation>. Найди кратчайший код Г, а если таких
            несколько — с наименьшим числовым значением.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Все коды таблицы удобно видеть сразу — как пути в двоичном дереве:
              буква стоит в конце своего пути, и ниже неё других букв нет.
            </strong>{" "}
            Сначала нарисуем дерево знакомой таблицы А —{" "}
            <Notation>{"0"}</Notation>, Б — <Notation>{"10"}</Notation>, В —{" "}
            <Notation>{"110"}</Notation>, Г — <Notation>{"111"}</Notation> и
            прочитаем по нему сообщение, затем вернёмся к задаче.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "put-ot-kornya",
      navLabel: "Путь от корня",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждый код — путь от корня: за каждый знак делаем шаг по ветви{" "}
              <Notation>{"0"}</Notation> или <Notation>{"1"}</Notation>.
            </strong>{" "}
            Вместо постоянного сравнения строк удобно изображать все возможные
            коды в виде дерева. Начинаем с начальной точки — она называется{" "}
            <strong>корнем дерева</strong>. Из каждой точки можно сделать два
            шага: по ветви <Notation>{"0"}</Notation> или по ветви{" "}
            <Notation>{"1"}</Notation>. Пройденные знаки образуют код.
          </Typography.Text>
          <Typography.Text>
            Например, один шаг <Notation>{"0"}</Notation> даёт код{" "}
            <Notation>{"0"}</Notation>; шаги <Notation>{"1"}</Notation>, затем{" "}
            <Notation>{"0"}</Notation> дают <Notation>{"10"}</Notation>; шаги{" "}
            <Notation>{"1"}</Notation>, <Notation>{"1"}</Notation>,{" "}
            <Notation>{"0"}</Notation> дают <Notation>{"110"}</Notation>.
            Таблица А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
            <Notation>{"111"}</Notation> изображается так:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree010110111_af8086}
            caption={
              <>
                Код буквы — путь от корня до неё: к В ведут ветви 1, 1, 0. Номер
                уровня слева — длина кода: В и Г на третьем уровне, их коды из
                трёх знаков.
              </>
            }
          />
          <Typography.Text>
            Точки дерева называют <strong>вершинами</strong>. Количество шагов
            от корня до вершины называется её <strong>глубиной</strong>. В
            кодовом дереве глубина совпадает с длиной кода: до{" "}
            <Notation>{"110"}</Notation> нужно сделать три шага, поэтому его
            глубина и длина равны трём.
          </Typography.Text>
          <Typography.Text>
            Вершина, в которой заканчивается путь к букве и дальше нет
            используемых продолжений, называется <strong>листом</strong>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fano-na-dereve",
      navLabel: "Условие Фано на дереве",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              На дереве условие Фано звучит так: буквы стоят в листьях, и ниже
              буквы других букв нет.
            </strong>{" "}
            Если назначили букве код <Notation>{"10"}</Notation>, то под ней
            нельзя размещать коды <Notation>{"100"}</Notation>,{" "}
            <Notation>{"101"}</Notation>, <Notation>{"1000"}</Notation>,{" "}
            <Notation>{"1001"}</Notation> и все остальные, которые начинаются с{" "}
            <Notation>{"10"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            И наоборот: если где-то ниже уже есть код{" "}
            <Notation>{"100"}</Notation>, то вершину <Notation>{"10"}</Notation>{" "}
            нельзя назначить другой букве — она лежит на пути к существующему
            коду.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Это и есть две проверки нового кода из подтемы 1, показанные
              геометрически
            </strong>
            : «новый код — начало старого» значит, что новая буква встала на
            путь к старой; «старый код — начало нового» — что новая буква встала
            под старой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chtenie-po-derevu",
      navLabel: "Чтение по дереву",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сообщение читают по дереву: от корня до буквы, а затем снова от
              корня.
            </strong>{" "}
            Пусть получено <Notation>{"111010110"}</Notation>. Идём от корня по
            знакам: пока вершина лежит на пути к буквам, читаем дальше; как
            только пришли в букву — записываем её и возвращаемся в корень.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.codeDecode010110111_111010110}
            label={"Чтение сообщения 111010110 по дереву кодов: шаг за шагом"}
          />
          <Typography.Text>
            Получается <Notation>{"111 | 0 | 10 | 110"}</Notation> — ГАБВ.{" "}
            <strong>
              Не нужно специально выбирать «самый длинный подходящий код»
            </strong>
            : при условии Фано первое найденное кодовое слово уже определяет
            букву.
          </Typography.Text>
          <Typography.Text>
            Если сообщение закончилось, а прочитанный остаток не образует
            кодовое слово,{" "}
            <strong>
              последовательность не является полной записью сообщения
            </strong>{" "}
            по этой таблице. Например, одиночное <Notation>{"11"}</Notation>{" "}
            здесь не обозначает букву: это только начало кодов В и Г.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "svobodnaya-vetv",
      navLabel: "Свободная ветвь",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Свободная ветвь — вершина, на которой и под которой нет ни одной
              буквы.
            </strong>{" "}
            Возьмём неполную таблицу А — <Notation>{"1"}</Notation>, Б —{" "}
            <Notation>{"000"}</Notation>, В — <Notation>{"011"}</Notation> и
            разберём, где можно разместить новую букву.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree1000011}
            caption={
              <>
                Буквы занимают 1, 000 и 011. Вершины 0, 00 и 01 лежат на путях к
                ним. Свободны только две ветви — 001… и 010…: на них и под ними
                нет ни одной буквы.
              </>
            }
          />
          <ul>
            <li>
              <Notation>{"1"}</Notation> занято буквой А, все продолжения{" "}
              <Notation>{"1…"}</Notation> запрещены; так же заняты{" "}
              <Notation>{"000…"}</Notation> и <Notation>{"011…"}</Notation>.
            </li>
            <li>
              <Notation>{"0"}</Notation>, <Notation>{"00"}</Notation> и{" "}
              <Notation>{"01"}</Notation> нельзя назначить новым буквам: они
              являются началами существующих кодов.
            </li>
            <li>
              Остаются две полностью свободные ветви:{" "}
              <Notation>{"001…"}</Notation> и <Notation>{"010…"}</Notation>.
            </li>
          </ul>
          <Typography.Text>
            Что означает «ветвь <Notation>{"001…"}</Notation> свободна»? В ней
            можно использовать сам код <Notation>{"001"}</Notation> для одной
            буквы — либо не занимать <Notation>{"001"}</Notation>, а размещать
            буквы глубже: <Notation>{"0010"}</Notation>,{" "}
            <Notation>{"0011"}</Notation> и так далее. Это принципиальный выбор:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              <strong>
                Свободную вершину можно занять одной буквой или разветвить для
                нескольких букв. Одновременно сделать и то и другое нельзя.
              </strong>
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Если назначили Г — <Notation>{"001"}</Notation>, то использовать{" "}
            <Notation>{"0010"}</Notation> и <Notation>{"0011"}</Notation> для
            других букв уже нельзя. Если нужны Г — <Notation>{"0010"}</Notation>{" "}
            и Д — <Notation>{"0011"}</Notation>, то <Notation>{"001"}</Notation>{" "}
            остаётся промежуточной вершиной, а не кодом отдельной буквы.
          </Typography.Text>
          <Typography.Text>
            При поиске свободных ветвей{" "}
            <strong>записывай их у ближайших к корню свободных вершин</strong>:
            достаточно записать <Notation>{"001"}</Notation>, а не перечислять
            отдельно <Notation>{"0010"}</Notation>,{" "}
            <Notation>{"0011"}</Notation>, <Notation>{"00100"}</Notation> и все
            остальные продолжения.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kratchajshij-kod",
      navLabel: "Кратчайший код",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Кратчайший код ищут по длине, а среди кодов одной длины — по
              числовому значению.
            </strong>{" "}
            Найдём кратчайший код Г для таблицы А — <Notation>{"1"}</Notation>,
            Б — <Notation>{"000"}</Notation>, В — <Notation>{"011"}</Notation>;
            если вариантов несколько, выберем код с наименьшим числовым
            значением. Проверяем длины по порядку:
          </Typography.Text>
          <VariantPicker
            label={"Длина кандидата и почему он не подходит"}
            defaultIndex={2}
            variants={[
              {
                label: "1",
                value: (
                  <>
                    <Notation>{"0"}</Notation> — начало{" "}
                    <Notation>{"000"}</Notation> и <Notation>{"011"}</Notation>;{" "}
                    <Notation>{"1"}</Notation> уже занят
                  </>
                ),
                note: <>одного знака недостаточно</>,
              },
              {
                label: "2",
                value: (
                  <>
                    <Notation>{"00"}</Notation> — начало{" "}
                    <Notation>{"000"}</Notation>; <Notation>{"01"}</Notation> —
                    начало <Notation>{"011"}</Notation>;{" "}
                    <Notation>{"10"}</Notation> и <Notation>{"11"}</Notation>{" "}
                    начинаются с занятого <Notation>{"1"}</Notation>
                  </>
                ),
                note: <>двух знаков тоже недостаточно</>,
              },
              {
                label: "3",
                value: (
                  <>
                    <Notation>{"000"}</Notation> и <Notation>{"011"}</Notation>{" "}
                    заняты, <Notation>{"1…"}</Notation> не подходит;{" "}
                    <strong>
                      <Notation>{"001"}</Notation> и{" "}
                      <Notation>{"010"}</Notation> подходят
                    </strong>
                  </>
                ),
                note: <>кратчайшая длина — 3</>,
              },
            ]}
          />
          <Typography.Text>
            Это ровно две свободные ветви с рисунка. Они имеют одинаковую длину,
            меньшее числовое значение у <Notation>{"001"}</Notation>.{" "}
            <strong>
              Ответ: <Notation>{"001"}</Notation>.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Почему одинаковые по длине двоичные коды можно сравнивать слева
            направо? Смотрим на первый знак, в котором они различаются: код, у
            которого в этой позиции стоит <Notation>{"0"}</Notation>, меньше. У{" "}
            <Notation>{"001"}</Notation> и <Notation>{"010"}</Notation> первый
            знак одинаковый, во втором у первого кода <Notation>{"0"}</Notation>
            , у второго — <Notation>{"1"}</Notation>. Поэтому первый меньше.
          </Typography.Text>
          <Typography.Text>
            Иногда спрашивают{" "}
            <strong>код с наибольшим числовым значением</strong> — тогда среди
            кратчайших берут последний: здесь это <Notation>{"010"}</Notation>.
            Длина при этом всё равно минимальная: сначала длина, потом значение.
          </Typography.Text>
          <Typography.Text>Два правила оформления ответа:</Typography.Text>
          <ul>
            <li>
              если спрашивают код, записываем саму последовательность,{" "}
              <strong>включая ведущие нули</strong>;
            </li>
            <li>если спрашивают длину, записываем количество знаков.</li>
          </ul>
          <Typography.Text>
            Для найденного кода ответы на эти разные вопросы —{" "}
            <Notation>{"001"}</Notation> и 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "derevo-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Код",
                note: <>путь от корня; длина кода — глубина вершины</>,
              },
              {
                key: "Буква",
                note: <>стоит в листе: ниже неё других букв нет</>,
              },
              {
                key: "Чтение",
                note: <>от корня до буквы и снова от корня</>,
              },
              {
                key: "Свободная ветвь",
                note: <>ни на ней, ни под ней нет букв</>,
              },
              {
                key: "Кратчайший код",
                note: (
                  <>сначала длина, затем значение; ведущие нули сохраняются</>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "kod-kazhdoj-bukve",
      navLabel: "Код каждой букве",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код нужен каждой букве алфавита, даже если в сообщении её нет:
              выбирая код одной буквы, нельзя занимать место, нужное остальным.
            </strong>{" "}
            Из этого же правила получается наименьшая сумма длин кодов.
          </Typography.Text>
          <Typography.Text>
            Работаем с кодами А — <Notation>{"00"}</Notation>, Б —{" "}
            <Notation>{"01"}</Notation>, В — <Notation>{"10"}</Notation>: в
            дереве свободна одна ветвь <Notation>{"11…"}</Notation>. Сначала
            найдём в ней код Г, когда в алфавите есть ещё буква Д, затем —
            наименьшую сумму длин для шести букв.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "mesta-ne-hvatit",
      navLabel: "Места не хватит",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код может подходить ко всем заданным кодам и всё равно быть
              неверным, если остальным буквам не хватит места.
            </strong>{" "}
            Пусть сообщения могут содержать буквы А, Б, В, Г, Д. Известно: А —{" "}
            <Notation>{"00"}</Notation>, Б — <Notation>{"01"}</Notation>, В —{" "}
            <Notation>{"10"}</Notation>. Нужно подобрать кратчайший код Г.
          </Typography.Text>
          <Typography.Text>
            На первый взгляд подходит Г — <Notation>{"11"}</Notation>: он не
            конфликтует с <Notation>{"00"}</Notation>,{" "}
            <Notation>{"01"}</Notation> и <Notation>{"10"}</Notation>. Но тогда
            таблица займёт всё дерево: всё, что начинается с{" "}
            <Notation>{"0"}</Notation>, занято буквами А и Б, с{" "}
            <Notation>{"10"}</Notation> — буквой В, с{" "}
            <Notation>{"11"}</Notation> — буквой Г.{" "}
            <strong>Для Д не осталось ни одного возможного кода.</strong>{" "}
            Поэтому Г — <Notation>{"11"}</Notation> — недопустимый выбор для
            полного алфавита задачи.
          </Typography.Text>
          <Typography.Text>
            Нужно разделить последнюю свободную ветвь: Г —{" "}
            <Notation>{"110"}</Notation>, Д — <Notation>{"111"}</Notation>.
            Теперь всё корректно.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree000110_304fd3}
            caption={
              <>
                Последняя свободная вершина 11 разделена на 110 и 111: Г и Д
                стоят в листьях, свободных ветвей не осталось. Код 11 для Г
                оставил бы Д без места.
              </>
            }
          />
          <Typography.Text>
            <strong>
              Кратчайший код Г с учётом существования Д —{" "}
              <Notation>{"110"}</Notation>.
            </strong>
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Код может быть совместим со всеми уже заданными кодами, но при
              этом не позволять закончить таблицу для остальных букв.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Поэтому проверка нового кода состоит из двух частей:
          </Typography.Text>
          <ol>
            <li>он не нарушает условие Фано с уже назначенными кодами;</li>
            <li>
              после его выбора можно назначить коды всем оставшимся буквам.
            </li>
          </ol>
          <Typography.Text>
            В задачах, где кодируются все буквы русского алфавита, это особенно
            важно.{" "}
            <strong>
              Если в сообщении встречаются только три буквы, остальные всё равно
              нельзя вычеркнуть из алфавита.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odnoj-vetvi-hvataet",
      navLabel: "Одной ветви хватает",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если длины кодов не ограничены, одной свободной ветви хватает на
              любое число оставшихся букв.
            </strong>{" "}
            Пусть теперь кодируется весь русский алфавит, а А, Б, В и Г уже
            получили коды <Notation>{"00"}</Notation>,{" "}
            <Notation>{"01"}</Notation>, <Notation>{"10"}</Notation>,{" "}
            <Notation>{"110"}</Notation>. Двадцать девять оставшихся букв не
            нужно сразу рисовать в листьях: им хватит одной свободной ветви{" "}
            <Notation>{"111…"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree000110110_b67ed5}
            caption={
              <>
                Ветвь 111 не отдана ни одной букве — это резерв. Внутри неё
                строятся коды всех остальных букв алфавита.
              </>
            }
          />
          <Typography.Text>
            Свободную ветвь <Notation>{"111"}</Notation> можно разделить на
            сколько угодно кодов:
          </Typography.Text>
          <VariantPicker
            label={"Сколько букв разместить в ветви 111"}
            variants={[
              {
                label: "2",
                value: (
                  <>
                    <Notation>{"1110"}</Notation>, <Notation>{"1111"}</Notation>
                  </>
                ),
              },
              {
                label: "3",
                value: (
                  <>
                    <Notation>{"1110"}</Notation>,{" "}
                    <Notation>{"11110"}</Notation>,{" "}
                    <Notation>{"11111"}</Notation>
                  </>
                ),
              },
              {
                label: "4",
                value: (
                  <>
                    <Notation>{"11100"}</Notation>,{" "}
                    <Notation>{"11101"}</Notation>,{" "}
                    <Notation>{"11110"}</Notation>,{" "}
                    <Notation>{"11111"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            В общем случае можно спуститься достаточно глубоко и выбрать нужное
            количество одинаковых по длине продолжений. Если нужно разместить 20
            букв, достаточно добавить к свободному началу пять знаков: получится
            2⁵ = 32 варианта.
          </Typography.Text>
          <Typography.Text>
            Здесь нет противоречия с условием Фано: сам резервируемый префикс{" "}
            <Notation>{"111"}</Notation>{" "}
            <strong>не назначается отдельной букве</strong>. Он обозначает
            место, внутри которого будут построены коды остальных букв.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "naimenshaya-summa",
      navLabel: "Наименьшая сумма длин",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наименьшую сумму длин получают, разветвляя свободную ветвь ровно
              столько раз, сколько нужно букв.
            </strong>{" "}
            Пусть алфавит содержит шесть букв: А, Б, В, Г, Д, Е. Известно: А —{" "}
            <Notation>{"00"}</Notation>, Б — <Notation>{"01"}</Notation>, В —{" "}
            <Notation>{"10"}</Notation>. Нужно найти наименьшую сумму длин кодов
            всех шести букв.
          </Typography.Text>
          <Typography.Text>
            Для трёх оставшихся букв свободна только ветвь{" "}
            <Notation>{"11…"}</Notation>. Использовать сам код{" "}
            <Notation>{"11"}</Notation> нельзя: тогда две другие буквы останутся
            без кодов. Разделим ветвь: <Notation>{"110"}</Notation> и{" "}
            <Notation>{"111"}</Notation> — два места, а нужны три. Разделим ещё
            одно из них:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.codeSplit000110}
            label={"Место для букв Г, Д, Е при кодах 00, 01, 10: шаг за шагом"}
          />
          <Typography.Text>
            Получаем Г — <Notation>{"110"}</Notation>, Д —{" "}
            <Notation>{"1110"}</Notation>, Е — <Notation>{"1111"}</Notation>.
            Длины новых кодов 3, 4, 4, их сумма 11. Сумма длин всех шести кодов:
            2 + 2 + 2 + 3 + 4 + 4 = <strong>17</strong>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему меньше нельзя"
          >
            <ul>
              <li>Кода длины 1 для новых букв нет.</li>
              <li>
                Единственный свободный код длины 2 — <Notation>{"11"}</Notation>
                . Его нельзя занять одной буквой, потому что нужно разместить
                три.
              </li>
              <li>
                На глубине 3 есть только два места: <Notation>{"110"}</Notation>{" "}
                и <Notation>{"111"}</Notation>. Если занять оба, третьей букве
                не останется места.
              </li>
            </ul>
            <Typography.Text>
              Следовательно, среди трёх новых кодов{" "}
              <strong>не больше одного может иметь длину 3</strong>, остальные
              имеют длину не меньше 4. Поэтому сумма новых длин не меньше 3 + 4
              + 4 = 11. Мы построили коды, для которых достигается именно 11.
              Значит, меньшая сумма невозможна.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Обрати внимание, какую сумму спрашивают.{" "}
            <strong>Сумма длин всех кодов</strong> — это заданные коды плюс
            новые (здесь 6 + 11 = 17);{" "}
            <strong>сумма длин оставшихся букв</strong> — только новые (11).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neskolko-vetvej",
      navLabel: "Несколько свободных ветвей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если свободных ветвей несколько, делят самую короткую свободную
              вершину.
            </strong>{" "}
            Разделить вершину длины d — значит вместо одного места длины d
            получить два места длины d + 1. Чем короче делимая вершина, тем
            короче оба новых места.
          </Typography.Text>
          <Typography.Text>
            Изменим один код примера: пусть В — <Notation>{"100"}</Notation>{" "}
            вместо <Notation>{"10"}</Notation>. Теперь свободны две ветви разной
            длины: <Notation>{"101…"}</Notation> и <Notation>{"11…"}</Notation>.
            Для Г, Д, Е нужно три места, а их два — делим более короткую вершину{" "}
            <Notation>{"11"}</Notation>:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.codeSplit0001100}
            label={"Место для букв Г, Д, Е при кодах 00, 01, 100: шаг за шагом"}
          />
          <Typography.Text>
            Места <Notation>{"101"}</Notation>, <Notation>{"110"}</Notation>,{" "}
            <Notation>{"111"}</Notation> — длины 3, 3, 3, сумма новых длин 9.
            Если бы разделили длинную <Notation>{"101"}</Notation>, получили бы
            2 + 4 + 4 = 10 — хуже.
          </Typography.Text>
          <Typography.Text>
            Иногда выгодно разделить короткую вершину,{" "}
            <strong>даже когда мест уже хватает</strong>. Пусть заданы А —{" "}
            <Notation>{"01"}</Notation>, Б — <Notation>{"10"}</Notation>, В —{" "}
            <Notation>{"110"}</Notation>, Г — <Notation>{"1110"}</Notation>, Д —{" "}
            <Notation>{"11110"}</Notation>, а коды нужны ещё двум буквам Е и Ж.
            Свободны <Notation>{"00…"}</Notation> и{" "}
            <Notation>{"11111…"}</Notation>: два места длин 2 и 5, сумма 7. Но
            если разделить <Notation>{"00"}</Notation> на{" "}
            <Notation>{"000"}</Notation> и <Notation>{"001"}</Notation>, получим
            3 + 3 = 6.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.codeSplit0110110111011110}
            label={"Место для букв Е и Ж в глубоком дереве: шаг за шагом"}
          />
          <Typography.Text>
            Поэтому, когда свободные вершины сильно различаются по длине, сравни
            два варианта: занять каждую одной буквой или разделить короткую.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: когда делить короткую вершину"
          >
            <Typography.Text>
              Два места длин d (самое короткое) и D (самое длинное из нужных)
              дают сумму d + D; если вместо них разделить короткое, получится
              2(d + 1) = 2d + 2. Деление выгодно, когда D ≥ d + 3, и ничего не
              меняет при D = d + 2.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "mesto-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Место для всех",
                note: (
                  <>
                    новый код не занимает последнюю свободную ветвь, пока
                    остались буквы
                  </>
                ),
              },
              {
                key: "Одна свободная ветвь",
                note: (
                  <>вмещает сколько угодно букв, если длины не ограничены</>
                ),
              },
              {
                key: "Сумма длин",
                note: <>делят самую короткую свободную вершину</>,
              },
              {
                key: "Короткая вершина",
                note: <>иногда её выгодно разделить, даже когда мест хватает</>,
              },
              {
                key: "Сумма всех кодов",
                note: <>включает и заданные коды</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dlina-zakodirovannogo",
      navLabel: "Длина закодированного слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Длина закодированного слова — сумма длин кодов всех его букв с
              повторами, поэтому частым буквам выгодно давать короткие коды.
            </strong>{" "}
            Это самый частый тип задания 4 последних лет.
          </Typography.Text>
          <Typography.Text>
            Главный пример страницы — слово МОЛОКО: сообщения состоят из букв М,
            О, Л, К, Н, заданы коды О — <Notation>{"00"}</Notation> и К —{" "}
            <Notation>{"01"}</Notation>. Сначала разберёмся, что именно считать.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chto-umenshat",
      navLabel: "Что уменьшать",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала пойми, какую величину нужно сделать наименьшей.
            </strong>{" "}
            Внешне похожие задачи могут требовать разных вычислений:
          </Typography.Text>
          <LessonTable
            label={"Внешне похожие задачи могут требовать разных вычислений"}
            columns={[{ label: "Что требуется" }, { label: "Что считаем" }]}
            rows={[
              ["Длина кода одной буквы", "Количество знаков только в её коде"],
              [
                "Сумма длин нескольких кодовых слов",
                "Длину каждого указанного кода по одному разу",
              ],
              [
                "Сумма длин всех кодовых слов",
                "Длины кодов всех букв алфавита по одному разу",
              ],
              [
                "Длина закодированного сообщения",
                "Длины кодов с учётом всех повторений букв",
              ],
            ]}
          />
          <Typography.Text>
            Например, для таблицы А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
            <Notation>{"111"}</Notation> сумма длин всех кодов равна 1 + 2 + 3 +
            3 = 9, а длина сообщения АААБВ — 1 + 1 + 1 + 2 + 3 = 8.{" "}
            <strong>Это разные величины.</strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chastoty-i-dliny",
      navLabel: "Частоты и длины",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Длина сообщения — сумма произведений частот букв на длины их
              кодов.
            </strong>{" "}
            Чтобы быстро считать длину длинного сообщения, удобно сначала
            подсчитать, сколько раз встречается каждая буква. Количество
            появлений буквы будем называть её{" "}
            <strong>частотой в данном сообщении</strong>. Для АААБВ:
          </Typography.Text>
          <LessonTable
            label={"Для АААБВ"}
            columns={[
              { label: "Буква" },
              { label: "Частота", numeric: true },
              { label: "Длина кода", numeric: true },
              { label: "Вклад в длину сообщения", numeric: true },
            ]}
            rows={[
              ["А", "3", "1", "3 · 1 = 3"],
              ["Б", "1", "2", "1 · 2 = 2"],
              ["В", "1", "3", "1 · 3 = 3"],
              ["Г", "0", "3", "0 · 3 = 0"],
            ]}
          />
          <Typography.Text>Итого 3 + 2 + 3 = 8. Общее правило:</Typography.Text>
          <blockquote>
            <Typography.Text>
              <strong>
                Длина сообщения = сумма произведений частот букв на длины их
                кодов.
              </strong>
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Буква с нулевой частотой не увеличивает длину конкретного сообщения.{" "}
            <strong>Но её код по-прежнему занимает место в дереве.</strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "bukva-ne-v-slove",
      navLabel: "Буква не в слове",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Буква, которой нет в слове, всё равно требует места в дереве.
            </strong>{" "}
            Вернёмся к МОЛОКО. Алфавит М, О, Л, К, Н; заданы О —{" "}
            <Notation>{"00"}</Notation>, К — <Notation>{"01"}</Notation>. Нужно
            уменьшить длину записи слова МОЛОКО. Сначала считаем частоты: О — 3,
            К — 1, М — 1, Л — 1, Н — 0.
          </Typography.Text>
          <Typography.Text>
            Известные коды дают неизменный вклад: 3 · 2 + 1 · 2 = 8. Остаётся
            выбрать коды М, Л и Н. Ветвь <Notation>{"0…"}</Notation> полностью
            занята кодами <Notation>{"00"}</Notation> и{" "}
            <Notation>{"01"}</Notation>, поэтому все новые коды должны
            находиться в ветви <Notation>{"1…"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если забыть о Н, можно предложить М — <Notation>{"10"}</Notation>, Л
            — <Notation>{"11"}</Notation>. Тогда длина слова получилась бы 8 + 2
            + 2 = 12.{" "}
            <strong>Но это неверное решение: букве Н не осталось места.</strong>
          </Typography.Text>
          <Typography.Text>
            Правильный вариант — разделить ветвь, как в подтеме 3: М —{" "}
            <Notation>{"10"}</Notation>, Л — <Notation>{"110"}</Notation>, Н —{" "}
            <Notation>{"111"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree0001_561aa3}
            caption={
              <>
                Ветвь 0 занята кодами О и К. В ветви 1 нужны три места — для М,
                Л и для Н, которой нет в слове: 10, 110 и 111.
              </>
            }
          />
          <Typography.Text>
            Тогда длина слова 8 + 2 + 3 = <strong>13</strong>. Проверим запись
            целиком: М | О | Л | О | К | О — это{" "}
            <Notation>{"10 | 00 | 110 | 00 | 01 | 00"}</Notation>, длины 2 + 2 +
            3 + 2 + 2 + 2 = 13.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему меньше нельзя"
          >
            <Typography.Text>
              Код <Notation>{"1"}</Notation> использовать нельзя: он занял бы
              всё место для М, Л и Н. Значит, коды М и Л имеют длину хотя бы 2.
              Но дать обеим буквам двухзначные коды тоже нельзя:{" "}
              <Notation>{"10"}</Notation> и <Notation>{"11"}</Notation> заняли
              бы всю свободную ветвь, не оставив места Н.
            </Typography.Text>
            <Typography.Text>
              Следовательно, один из кодов М и Л имеет длину хотя бы 3, их сумма
              не меньше 2 + 3 = 5, а{" "}
              <strong>длина слова — не меньше 8 + 5 = 13</strong>. Полученный
              вариант достигает этой границы.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "rezervnaya-vetv",
      navLabel: "Резервная ветвь",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Все буквы, которых нет в слове, можно временно представить одной
              резервной ветвью.
            </strong>{" "}
            Если бы кодировался весь русский алфавит, решение МОЛОКО не
            изменилось бы: место <Notation>{"111"}</Notation> стало бы резервом
            для Н и всех остальных букв, а длина слова осталась бы 13. Потом
            резерв делится на нужное количество кодов, как в подтеме 3.
          </Typography.Text>
          <Typography.Text>
            Так можно, если длина кодов не ограничена — в задании 4 так почти
            всегда.
          </Typography.Text>
          <Typography.Text>
            При подсчёте суммы длин всей таблицы каждая буква учитывается
            отдельно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chastym-korotkie",
      navLabel: "Частым — короткие",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для уже выбранных мест короткие коды выгодно назначать более
              частым буквам.
            </strong>{" "}
            Предположим, мы уже выбрали два свободных кодовых слова — длины 2 и
            длины 4. Буква А встречается пять раз, буква Б — один раз.
          </Typography.Text>
          <Typography.Text>
            Если короткий код отдать А: 5 · 2 + 1 · 4 = 14. Если короткий код
            отдать Б: 5 · 4 + 1 · 2 = 22.{" "}
            <strong>Первый вариант лучше на 8 бит.</strong> Причина проста:
            сокращение кода А на два знака экономит два знака{" "}
            <strong>при каждом из пяти появлений</strong>, а увеличение кода Б
            на два знака добавляет их только один раз.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: то же правило для любых частот и длин"
          >
            <Typography.Text>
              Пусть p — большая частота, q — меньшая частота, a — меньшая длина,
              b — большая длина. Разница между невыгодным и выгодным
              назначением:
            </Typography.Text>
            <Typography.Text>
              (pb + qa) − (pa + qb) = (p − q)(b − a).
            </Typography.Text>
            <Typography.Text>
              Обе разности неотрицательны, поэтому результат тоже неотрицателен.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Это относится к буквам, коды которых можно выбирать.{" "}
            <strong>
              Заданные в условии соответствия переставлять нельзя.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Получается порядок действий для наименьшей длины слова:
          </Typography.Text>
          <ol>
            <li>
              Посчитать частоты букв слова и вклад букв с заданными кодами.
            </li>
            <li>
              Найти свободные ветви. Буквам вне слова, если они есть, нужно одно
              резервное место.
            </li>
            <li>
              Буквам слова по убыванию частоты давать самый короткий свободный
              код, после которого остаётся место всем остальным буквам и
              резерву.
            </li>
            <li>
              Проверить, не выгоднее ли разделить короткую вершину, — об этом
              следующий раздел.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: "lovushka-chastoj",
      navLabel: "Короткий не всегда выгоден",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Самый короткий код для частой буквы иногда ухудшает весь
              результат.
            </strong>{" "}
            Поэтому, когда у частой буквы есть выбор, рисуют оба варианта дерева
            и сравнивают длины слова. Пример: алфавит из семи букв А, Б, В, Г,
            Д, Е, Ж, заданы Д — <Notation>{"01"}</Notation>, Е —{" "}
            <Notation>{"10"}</Notation>, Ж — <Notation>{"110"}</Notation>. В
            сообщении А встречается 4 раза, Б — 3 раза, В и Г — по 2.
          </Typography.Text>
          <Typography.Text>
            Букв Д, Е, Ж в сообщении нет, но их заданные коды занимают место.
            Свободны две ветви: <Notation>{"00…"}</Notation> и{" "}
            <Notation>{"111…"}</Notation>. Первая начинается на глубине 2,
            вторая — на глубине 3.
          </Typography.Text>
          <Typography.Text>
            Попробуем сразу дать самой частой букве А кратчайший код{" "}
            <Notation>{"00"}</Notation>. Теперь Б, В, Г нужно разместить в{" "}
            <Notation>{"111…"}</Notation>, и лучшее размещение для них — Б —{" "}
            <Notation>{"1110"}</Notation>, В — <Notation>{"11110"}</Notation>, Г
            — <Notation>{"11111"}</Notation>. Длина сообщения 4 · 2 + 3 · 4 + 2
            · 5 + 2 · 5 = <strong>40</strong>.
          </Typography.Text>
          <Typography.Text>
            Теперь попробуем не занимать вершину <Notation>{"00"}</Notation>{" "}
            одной буквой, а разделить её: А — <Notation>{"000"}</Notation>, Б —{" "}
            <Notation>{"001"}</Notation>, В — <Notation>{"1110"}</Notation>, Г —{" "}
            <Notation>{"1111"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeShapes0110110_4322}
            caption={
              <>
                Слева А заняла вершину 00, и три буквы ушли глубоко в ветвь 111:
                длина 40. Справа вершина 00 разделена на две буквы, ветвь 111 —
                тоже: длина 37.
              </>
            }
          />
          <Typography.Text>
            <strong>
              Код самой частой буквы стал длиннее, но всё сообщение сократилось
            </strong>
            : 4 · 3 + 3 · 3 + 2 · 4 + 2 · 4 = <strong>37</strong>. Почему? Код А
            удлинился на один знак, и это добавило 4 бита — по одному на каждое
            появление. А коды Б, В, Г укоротились на один знак каждый и
            сэкономили 3 + 2 + 2 = 7 бит. Мы добавили четыре бита, а сэкономили
            семь.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Правило: если частой букве можно отдать короткую свободную
              вершину, нарисуй два варианта — буква занимает вершину целиком или
              вершина делится на две — и сравни длины слова.
            </strong>{" "}
            Разделить вершину выгодно, когда буквы, которые поднимутся выше,
            вместе встречаются чаще, чем буква, которая опустится на уровень.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlina-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Величина",
                note: (
                  <>
                    код одной буквы, сумма длин или длина слова — разные ответы
                  </>
                ),
              },
              {
                key: "Длина слова",
                note: <>сумма «частота × длина кода»</>,
              },
              {
                key: "Буква вне слова",
                note: <>частота 0, но место в дереве нужно</>,
              },
              {
                key: "Частым — короткие",
                note: <>на готовых местах; заданные коды не переставляют</>,
              },
              {
                key: "Короткая вершина",
                note: <>сравни с вариантом, где она разделена</>,
              },
            ]}
          />
        </>
      ),
    },
  ],
  examFocus: (
    <>
      <Typography.Text>
        <strong>Частые ошибки удобно связывать с конкретной проверкой.</strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и что проверить"}
        variants={[
          {
            label: "разные — значит верно",
            value: <>разные коды автоматически считаются правильными</>,
            note: <>нет ли отношения «один — начало другого»</>,
          },
          {
            label: "одно направление",
            value: <>проверяется только одно направление</>,
            note: <>новый код может быть и короче, и длиннее существующего</>,
          },
          {
            label: "общее начало",
            value: <>запрещаются любые общие начала</>,
            note: (
              <>запрещено совпадение целого кодового слова с началом другого</>
            ),
          },
          {
            label: "ведущие нули",
            value: <>из кода удаляются ведущие нули</>,
            note: <>код — последовательность знаков с определённой длиной</>,
          },
          {
            label: "последняя ветвь",
            value: <>выбрана последняя свободная вершина</>,
            note: <>не остались ли ещё незакодированные буквы</>,
          },
          {
            label: "буквы вне слова",
            value: <>забыты отсутствующие в слове буквы</>,
            note: <>они входят в алфавит и требуют места</>,
          },
          {
            label: "без повторов",
            value: <>посчитаны только разные буквы слова</>,
            note: <>для длины сообщения нужны все повторения</>,
          },
          {
            label: "частой — кратчайший",
            value: <>самой частой букве сразу отдан кратчайший код</>,
            note: <>не выгоднее ли разделить эту ветвь</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 4 решается одной схемой: нанести заданные коды на
          дерево, найти свободные ветви и разместить в них неизвестные буквы
          так, чтобы уменьшить нужную величину.
        </strong>{" "}
        Ошибки обычно возникают не в дереве, а в прочтении условия: забытые
        буквы алфавита, не та величина, не тот формат ответа.
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 4 на одной схеме"}
        flow={[
          {
            name: "Алфавит и величина",
            note: "все буквы, заданные коды, что уменьшаем",
          },
          { name: "Дерево", note: "заданные коды → свободные ветви" },
          {
            name: "Размещение",
            note: "места для неизвестных букв и резерв, два варианта дерева",
          },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="kod-i-uslovie-fano"
              >
                Код и условие Фано
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>код — последовательность</>,
                note: <>ведущие нули не удалять</>,
              },
              { key: <>2ᵏ</>, note: <>последовательностей длины k</> },
              {
                key: <>условие Фано</>,
                note: <>ни один код — не начало другого</>,
              },
              {
                key: (
                  <>
                    <Notation>{"b.startswith(a)"}</Notation>
                  </>
                ),
                note: <>проверка в обе стороны</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="kodovoe-derevo"
              >
                Дерево и кратчайший код
              </SubtopicLink>
            ),
            rows: [
              { key: <>длина кода</>, note: <>глубина вершины</> },
              {
                key: <>свободная ветвь</>,
                note: <>занять одной буквой или разделить</>,
              },
              {
                key: <>кратчайший код</>,
                note: <>сначала длина, затем значение</>,
              },
              {
                key: <>чтение</>,
                note: <>от корня до буквы и снова от корня</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="mesto-dlya-vseh-bukv"
              >
                Место и сумма длин
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>последнюю ветвь не занимать</>,
                note: <>остальным буквам нужно место</>,
              },
              { key: <>резерв</>, note: <>одна ветвь — сколько угодно букв</> },
              {
                key: <>делить короткую вершину</>,
                note: <>пока мест мало или D ≥ d + 3</>,
              },
              { key: <>минимум</>, note: <>граница снизу + пример</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="dlina-slova"
              >
                Длина слова
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>длина слова</>,
                note: <>сумма «частота × длина кода»</>,
              },
              { key: <>буквы вне слова</>, note: <>одно резервное место</> },
              { key: <>частым буквам</>, note: <>короткие места</> },
              {
                key: <>код, сумма, длина, произведение</>,
                note: <>разные ответы</>,
              },
              {
                key: <>кратчайший код частой букве</>,
                note: <>не всегда выгоден</>,
              },
              { key: <>ветвь</>, note: <>оставить, занять или разделить</> },
              {
                key: <>3 буквы</>,
                note: <>1, 2, 2; 4 буквы — 2, 2, 2, 2 или 1, 2, 3, 3</>,
              },
              {
                key: (
                  <>
                    <Notation>{"product"}</Notation>
                  </>
                ),
                note: <>полный перебор для проверки</>,
              },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к готовому ответу",
            steps: [
              <>Все ли буквы алфавита получили место?</>,
              <>Та ли величина: код, длина, сумма, произведение?</>,
              <>Сравнён ли вариант, где короткая вершина разделена?</>,
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
        <strong>Порядок решения новой задачи:</strong>
      </Typography.Text>
      <ol>
        <li>
          Выпиши весь алфавит и заданные коды — их не меняют и не переставляют.
        </li>
        <li>Нанеси заданные коды на дерево и найди свободные ветви.</li>
        <li>
          Назови величину: код одной буквы, сумма длин или длина слова; для
          слова посчитай частоты букв.
        </li>
        <li>
          Размести неизвестные буквы, оставив место всем буквам алфавита; если
          частой букве достаётся короткая вершина, сравни с вариантом, где эта
          вершина разделена.
        </li>
        <li>
          Проверь формат ответа: код с ведущими нулями, длина или число знаков
          слова.
        </li>
      </ol>
    </>
  ),
  status: "published",
});
