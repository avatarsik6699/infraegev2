import { CodeBlock } from "~/shared/components/code-block";
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
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

export const codingAndFanoLesson = defineLesson({
  ...codingAndFanoLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Проверять условие Фано в обе стороны и читать сообщение слева направо",
    "Видеть коды как пути в двоичном дереве и находить свободные ветви",
    "Находить кратчайший код буквы и наименьшую сумму длин с местом для всех букв",
    "Считать наименьшую длину закодированного слова с учётом частот",
    "Сравнивать формы дерева, когда короткий код частой букве невыгоден",
    "Для редких задач — подсчёт кодов, код по записи слова, неравенство Крафта и Хаффман (дополнительные уроки)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "kod-i-uslovie-fano",
      title: "Код и условие Фано",
      lead: "Кодовое слово и его длина, равномерный и неравномерный код, почему разных кодов мало для однозначного чтения и что запрещает условие Фано — проверка пары в обе стороны.",
      conceptIds: [
        "kak-ustroena-tema-4",
        "kod-bukvy",
        "dlina-kodovogo-slova",
        "ravnomernyj-kod",
        "chislo-posledovatelnostej",
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
              Выполняется ли условие Фано для кодов А —{" "}
              <Notation>{"00"}</Notation>, Б — <Notation>{"010"}</Notation>, В —{" "}
              <Notation>{"011"}</Notation>, Г — <Notation>{"1"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Да: <Notation>{"00"}</Notation>, <Notation>{"010"}</Notation>,{" "}
              <Notation>{"011"}</Notation> не являются началами друг друга, а{" "}
              <Notation>{"1"}</Notation> ни с одним из них не конфликтует —
              остальные начинаются с <Notation>{"0"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-4",
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
          id: "zadacha-5",
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
          id: "zadacha-6",
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
          id: "zadacha-7",
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
          id: "zadacha-8",
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
              каких наборах выполняется условие Фано? Проверь ответ функцией{" "}
              <Notation>{"fano"}</Notation>.
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
      lead: "Коды как пути в дереве, чтение сообщения от корня, занятые вершины и свободные ветви, кратчайший код буквы с наименьшим или наибольшим значением.",
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
      ],
    },
    {
      slug: "mesto-dlya-vseh-bukv",
      title: "Место для всех букв и сумма длин",
      lead: "Код нужен каждой букве алфавита; одна свободная ветвь вмещает сколько угодно букв; наименьшая сумма длин — разветвлением ближайших к корню вершин и доказательством минимума.",
      conceptIds: [
        "kod-kazhdoj-bukve",
        "mesta-ne-hvatit",
        "odnoj-vetvi-hvataet",
        "naimenshaya-summa",
        "neskolko-vetvej",
        "mesto-itogo",
      ],
    },
    {
      slug: "dlina-slova",
      title: "Длина закодированного слова",
      lead: "Какую величину уменьшаем, длина слова по частотам букв, место для букв вне слова и короткие коды частым буквам.",
      conceptIds: [
        "dlina-zakodirovannogo",
        "chto-umenshat",
        "chastoty-i-dliny",
        "bukva-ne-v-slove",
        "rezervnaya-vetv",
        "chastym-korotkie",
        "dlina-itogo",
      ],
    },
    {
      slug: "forma-dereva",
      title: "Форма дерева: когда короткий код невыгоден",
      lead: "Кратчайший код самой частой букве иногда удлиняет слово: какие свободные вершины занять, а какие разделить, перебирается по порядку и проверяется программой.",
      conceptIds: [
        "korotkij-ne-vsegda",
        "lovushka-chastoj",
        "dokazatelstvo-minimuma",
        "lovushka-vtoroj",
        "perebor-form",
        "programma-perebora",
        "forma-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-7",
          prompt: (
            <>
              Измени программу перебора для задачи 4 (заданные коды, частоты,
              число букв) и проверь свой ответ.
            </>
          ),
          reveal: (
            <>
              Программа с <Notation>{"fixed = ['001', '01']"}</Notation>,
              частотами П — 2, А, О, Р — по 1 даёт 18.
            </>
          ),
        },
      ],
    },
    {
      slug: "podschet-i-velichiny",
      title: "Подсчёт кодов и другие величины",
      lead: "Количество возможных кодов, предельная длина, произведение длин, два требования подряд, количество единиц, восьмеричная запись слова и код, нарушающий условие Фано.",
      level: "advanced",
      conceptIds: [
        "dopolnitelnyy-urok-podschet",
        "podschet-kodov",
        "maksimalnaya-dlina",
        "proizvedenie-dlin",
        "dva-trebovaniya",
        "zapis-slova",
        "chislo-edinic",
        "narushenie-fano",
        "podschet-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-4",
          prompt: (
            <>
              Заданы А — <Notation>{"1"}</Notation>, Б —{" "}
              <Notation>{"01"}</Notation>. Нужно добавить В, Г, Д, Е, Ж. Каждый
              новый код должен иметь длину не больше 5. Может ли В получить код{" "}
              <Notation>{"000"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Да: после В — <Notation>{"000"}</Notation> остаётся ветвь{" "}
              <Notation>{"001…"}</Notation>; при длине до 5 она вмещает 2⁵⁻³ = 4
              буквы — ровно Г, Д, Е, Ж.
            </>
          ),
        },
      ],
    },
    {
      slug: "kod-po-zapisi",
      title: "Код по записи слова и теория префиксных кодов",
      lead: "Коды по записи слова и по длине его кода, обратное условие Фано, неравенство Крафта и метод Хаффмана.",
      level: "advanced",
      conceptIds: [
        "dopolnitelnyy-urok-zapis",
        "kody-po-povtoram",
        "uravnenie-na-dliny",
        "dva-slova",
        "ne-tolko-fano",
        "neravenstvo-krafta",
        "metod-haffmana",
        "zapis-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-5",
          prompt: (
            <>
              Выполняются ли прямое и обратное условия Фано для кодов А —{" "}
              <Notation>{"0"}</Notation>, Б — <Notation>{"01"}</Notation>, В —{" "}
              <Notation>{"011"}</Notation>? Можно ли однозначно декодировать
              сообщения?
            </>
          ),
          reveal: (
            <>
              Прямое — нет: <Notation>{"0"}</Notation> — начало{" "}
              <Notation>{"01"}</Notation>. Обратное — да: ни один код не
              является концом другого, поэтому сообщения однозначно читаются
              справа налево.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              Существует ли префиксный двоичный код с длинами кодов 1, 2, 3, 3,
              3? А с длинами 2, 2, 2, 3, 3?
            </>
          ),
          reveal: (
            <>
              Нет: 1/2 + 1/4 + 3/8 = 9/8 {">"} 1. Да: 3/4 + 1/4 = 1, например{" "}
              <Notation>{"00"}</Notation>, <Notation>{"01"}</Notation>,{" "}
              <Notation>{"10"}</Notation>, <Notation>{"110"}</Notation>,{" "}
              <Notation>{"111"}</Notation>.
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
            <strong>
              В задании 4 нужно понять, как устроена таблица кодов и почему по
              ней можно однозначно восстановить сообщение.
            </strong>{" "}
            После этого выбор коротких кодов, учёт неиспользуемых букв и поиск
            минимальной длины превращаются в понятные задачи о размещении букв в
            дереве.
          </Typography.Text>
          <Typography.Text>
            В задачах задания встречаются разные формулировки: найти код одной
            буквы, уменьшить длину сообщения или сумму длин кодов, восстановить
            код по готовой записи, посчитать допустимые варианты. Все они
            решаются одной схемой рассуждения, и на экзамене обычно без
            программы: рисунком и коротким перебором вручную. Программы в теме
            проверяют такие рассуждения.
          </Typography.Text>
          <Typography.Text>
            Тема разбита на основные подтемы и дополнительные уроки.{" "}
            <strong>Основные подтемы 1–5</strong> решают 77 из 94 задач
            подборок, в том числе все задачи реальных экзаменов 2017–2026 годов.{" "}
            <strong>
              Подтемы 6 и 7 — дополнительные уроки для продвинутых
            </strong>
            : подсчёт вариантов, произведение длин, восстановление кода по
            записи слова и теория префиксных кодов.
          </Typography.Text>
          <Typography.Text>
            Эта подтема — фундамент для остальных:{" "}
            <strong>
              что такое код, когда его можно прочитать обратно и что запрещает
              условие Фано
            </strong>
            . На нём держатся все 94 задачи.
          </Typography.Text>
          <Typography.Text>
            Почти всё время будем кодировать четыре буквы А, Б, В, Г одной
            таблицей: А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
            <Notation>{"111"}</Notation>.
          </Typography.Text>
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
          <Typography.Text>
            В программе таблица — <PythonTerm term="dict">словарь</PythonTerm>{" "}
            «буква → код», а кодирование —{" "}
            <PythonTerm term="for">цикл</PythonTerm> по буквам слова, который
            приписывает их коды:
          </Typography.Text>
          <CodeBlock
            code={
              "code = {'А': '0', 'Б': '10', 'В': '110', 'Г': '111'}\ns = ''\nfor letter in 'БАВ':\n    s += code[letter]\nprint(s, len(s))"
            }
            label={
              "Код на Python: code = {'А': '0', 'Б': '10', 'В': '110', 'Г': '111'}"
            }
            language="python"
            output={"100110 6"}
          />
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
            Почему нельзя использовать пустое кодовое слово? Если бы буква А
            передавалась «ничем», получатель не смог бы различить сообщения Б,
            АБ, БА, ААБ и так далее.
          </Typography.Text>
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
            тем самым уменьшать длину сообщения. Позже подробно разберём, как
            это работает и какие ограничения возникают.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-posledovatelnostej",
      navLabel: "Число последовательностей",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Последовательностей длины k ровно 2ᵏ: каждый новый знак удваивает
              число вариантов.
            </strong>{" "}
            Для одного знака есть два варианта: <Notation>{"0"}</Notation>,{" "}
            <Notation>{"1"}</Notation>. Для двух — четыре:{" "}
            <Notation>{"00"}</Notation>, <Notation>{"01"}</Notation>,{" "}
            <Notation>{"10"}</Notation>, <Notation>{"11"}</Notation>. Для трёх —
            восемь. К каждой уже полученной последовательности можно приписать
            либо <Notation>{"0"}</Notation>, либо <Notation>{"1"}</Notation>,
            поэтому вариантов становится вдвое больше:
          </Typography.Text>
          <LessonTable
            label={"Длина, 1, 2, 3, 4, 5"}
            columns={[
              { label: "Длина" },
              { label: "1", numeric: true },
              { label: "2", numeric: true },
              { label: "3", numeric: true },
              { label: "4", numeric: true },
              { label: "5", numeric: true },
            ]}
            rows={[["Последовательностей", "2", "4", "8", "16", "32"]]}
          />
          <Typography.Text>
            Например, для равномерного кодирования пяти букв двух знаков
            недостаточно: различных двухзначных кодов только четыре. Трёх знаков
            достаточно: вариантов уже восемь.
          </Typography.Text>
          <Typography.Text>
            Но для неравномерного кода нельзя просто выбрать любые пять
            последовательностей разной длины. Нужно обеспечить правильное
            декодирование.
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
            Код называется <strong>однозначно декодируемым</strong>, если любая
            последовательность, полученная кодированием допустимого сообщения,
            восстанавливается единственным способом. Обрати внимание на слово{" "}
            <strong>любая</strong>: недостаточно проверить, что одно конкретное
            слово удалось прочитать. Правило должно работать для всех сообщений
            из заданного алфавита.
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
            <Notation>{"01"}</Notation>. Для начала последовательности есть
            специальный термин — <strong>префикс</strong>. Например, непустые
            начала последовательности <Notation>{"0101"}</Notation> — это{" "}
            <Notation>{"0"}</Notation>, <Notation>{"01"}</Notation>,{" "}
            <Notation>{"010"}</Notation> и <Notation>{"0101"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            При проверке двух кодовых слов нас интересует один случай:{" "}
            <strong>
              более короткое полностью совпадает с началом более длинного
            </strong>
            . Код с условием Фано также называют{" "}
            <strong>префиксным кодом</strong>.
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
          <ProofDisclosure summary="Почему два разных прочтения невозможны">
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
          <Typography.Text>
            В программе проверку «<Notation>{"a"}</Notation> — начало{" "}
            <Notation>{"b"}</Notation>» выполняет{" "}
            <PythonTerm term="startswith">
              <Notation>{"b.startswith(a)"}</Notation>
            </PythonTerm>
            . Функция <Notation>{"fano"}</Notation> перебирает номера i и j двух
            разных позиций списка, поэтому каждая пара проверяется в обе стороны
            — и как (i, j), и как (j, i). Одинаковые коды тоже ловятся: строка
            начинается сама с себя.
          </Typography.Text>
          <CodeBlock
            code={
              "def fano(codes):\n    for i in range(len(codes)):\n        for j in range(len(codes)):\n            if i != j and codes[j].startswith(codes[i]):\n                return False\n    return True"
            }
            label={
              "Одинаковые коды тоже ловятся: строка начинается сама с себя"
            }
            language="python"
          />
          <Typography.Text>
            Проверим таблицу темы и обе ошибки из примера:
          </Typography.Text>
          <CodeBlock
            code={
              "print(fano(['0', '10', '110', '111']))\nprint(fano(['010', '01']), fano(['010', '0101']))\nprint(fano(['010', '011']))"
            }
            label={"Проверим таблицу темы и обе ошибки из примера"}
            language="python"
            output={"True\nFalse False\nTrue"}
          />
          <Typography.Text>
            Во второй строке — оба неудачных кандидата из примера:{" "}
            <Notation>{"01"}</Notation> — начало <Notation>{"010"}</Notation>, а{" "}
            <Notation>{"0101"}</Notation> начинается с{" "}
            <Notation>{"010"}</Notation>.{" "}
            <strong>Функция ловит оба направления одинаково</strong>, потому что
            перебирает пары в обоих порядках.
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
                note: (
                  <>
                    Код — таблица «буква → последовательность знаков»; длина
                    кода — число знаков, ведущие нули — часть кода.
                  </>
                ),
              },
              { note: <>Последовательностей длины k ровно 2ᵏ.</> },
              {
                note: (
                  <>
                    Разных кодов мало: одна строка может разрезаться на коды
                    по-разному.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Условие Фано: ни один код не является{" "}
                    <strong>началом</strong> другого; общее начало и совпадение
                    с концом разрешены.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Новый код проверяют в обе стороны: не начало ли он чужого
                    кода и не начинается ли с чужого кода.
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
            <strong>
              Все коды таблицы удобно видеть сразу — как пути в двоичном дереве:
              буква стоит в конце своего пути, и ниже неё других букв нет.
            </strong>{" "}
            По дереву ищут кратчайший код буквы — так устроены 29 из 94 задач
            подборок, в том числе 10 задач реальных экзаменов 2017–2024 годов.
            Остальные задачи тоже начинаются с дерева.
          </Typography.Text>
          <Typography.Text>
            Сначала нарисуем дерево знакомой таблицы А —{" "}
            <Notation>{"0"}</Notation>, Б — <Notation>{"10"}</Notation>, В —{" "}
            <Notation>{"110"}</Notation>, Г — <Notation>{"111"}</Notation> и
            прочитаем по нему сообщение. Затем возьмём неполную таблицу А —{" "}
            <Notation>{"1"}</Notation>, Б — <Notation>{"000"}</Notation>, В —{" "}
            <Notation>{"011"}</Notation> и найдём в ней место для четвёртой
            буквы Г. Функцию <Notation>{"fano"}</Notation> из подтемы 1 считаем
            определённой выше в программе.
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
          <Typography.Text>
            Программа повторяет чтение по дереву и годится для проверки ответа:
            копит знаки в строке <Notation>{"buf"}</Notation> и, как только они
            совпали с кодом, записывает букву и начинает заново. Таблица
            хранится <PythonTerm term="dict">словарём</PythonTerm> наоборот —
            «код → буква», чтобы по накопленным знакам сразу найти букву:
          </Typography.Text>
          <CodeBlock
            code={
              "def decode(bits, letter):\n    word, buf = '', ''\n    for b in bits:\n        buf += b\n        if buf in letter:\n            word += letter[buf]\n            buf = ''\n    return word, buf\n\n\nletter = {'0': 'А', '10': 'Б', '110': 'В', '111': 'Г'}\nword, rest = decode('111010110', letter)\nprint(word, len(rest))\nword, rest = decode('11011', letter)\nprint(word, len(rest))"
            }
            label={"Код на Python: def decode(bits, letter):"}
            language="python"
            output={"ГАБВ 0\nВ 2"}
          />
          <Typography.Text>
            Во второй строке после В осталось два знака{" "}
            <Notation>{"11"}</Notation>, которые не составляют букву: такая
            запись неполная.
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
          <Typography.Text>
            Программа делает тот же перебор: длины по возрастанию, а внутри
            длины — числа x = 0, 1, 2, … по возрастанию. Двоичная запись{" "}
            <PythonTerm term="base">
              <Notation>{"bin(x)[2:]"}</Notation>
            </PythonTerm>
            , дополненная{" "}
            <PythonTerm term="zfill">
              <Notation>{"zfill"}</Notation>
            </PythonTerm>{" "}
            нулями слева до нужной длины, — очередной кандидат. Первый кандидат,
            с которым таблица проходит <Notation>{"fano"}</Notation>, и есть
            ответ — совпадение с занятым кодом <Notation>{"fano"}</Notation>{" "}
            тоже не пропустит:
          </Typography.Text>
          <CodeBlock
            code={
              "def shortest(codes):\n    for length in range(1, 10):\n        for x in range(2 ** length):\n            new = bin(x)[2:].zfill(length)\n            if fano(codes + [new]):\n                return new\n\n\nprint(shortest(['1', '000', '011']))"
            }
            label={"Код на Python: def shortest(codes):"}
            language="python"
            output={"001"}
          />
          <Typography.Text>
            Для наибольшего значения числа x перебирают от большего к меньшему:{" "}
            <Notation>{"range(2 ** length - 1, -1, -1)"}</Notation>.
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
                note: (
                  <>
                    Код — путь от корня, его длина — глубина вершины; буквы
                    стоят в листьях.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сообщение читают от корня до буквы и снова от корня; лишний
                    остаток значит, что запись неполная.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Свободная ветвь — вершина без букв на ней и под ней; её
                    можно занять одной буквой <strong>или</strong> разветвить.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Кратчайший код: сначала самая короткая длина, затем
                    наименьшее (или наибольшее) значение; ведущие нули — часть
                    ответа.
                  </>
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
            Из этого же правила получается наименьшая сумма длин кодов — так
            устроены 20 из 94 задач подборок, 6 из них с реальных экзаменов
            2018–2023 годов. Ещё в 7 задачах на кратчайший код ответ без учёта
            остальных букв получается неверным.
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
          <Typography.Text>
            Если же в условии ограничена максимальная длина кодов, одной
            свободной ветви может оказаться недостаточно. Этот случай разобран в
            дополнительной подтеме 6.
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
          <Typography.Text>
            Но почему это действительно минимум?{" "}
            <strong>
              Найти работающий код — ещё не значит доказать, что короче нельзя.
            </strong>
          </Typography.Text>
          <ul>
            <li>Кода длины 1 для новых букв нет.</li>
            <li>
              Единственный свободный код длины 2 — <Notation>{"11"}</Notation>.
              Его нельзя занять одной буквой, потому что нужно разместить три.
            </li>
            <li>
              На глубине 3 есть только два места: <Notation>{"110"}</Notation> и{" "}
              <Notation>{"111"}</Notation>. Если занять оба, третьей букве не
              останется места.
            </li>
          </ul>
          <Typography.Text>
            Следовательно, среди трёх новых кодов{" "}
            <strong>не больше одного может иметь длину 3</strong>, остальные
            имеют длину не меньше 4. Поэтому сумма новых длин не меньше 3 + 4 +
            4 = 11. Мы построили коды, для которых достигается именно 11.
            Значит, меньшая сумма невозможна.
          </Typography.Text>
          <Typography.Text>
            Так устроено хорошее доказательство минимума:
          </Typography.Text>
          <ol>
            <li>устанавливаем границу, ниже которой опуститься нельзя;</li>
            <li>показываем конкретный вариант, достигающий этой границы.</li>
          </ol>
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
            Правило проверки простое. Два места длин d (самое короткое) и D
            (самое длинное из нужных) дают сумму d + D; если вместо них
            разделить короткое, получится 2(d + 1) = 2d + 2.{" "}
            <strong>Деление выгодно, когда D ≥ d + 3</strong>, и ничего не
            меняет при D = d + 2.
          </Typography.Text>
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
                note: (
                  <>
                    Новый код должен не только проходить условие Фано, но и
                    оставлять место всем остальным буквам алфавита.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Одна свободная ветвь, которую не занимают целиком, вмещает
                    сколько угодно букв, если длины не ограничены.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Для наименьшей суммы длин делят самую короткую свободную
                    вершину, пока мест не хватает или пока самое длинное нужное
                    место длиннее её на 3 и больше.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Минимум доказывают двумя частями: граница снизу и пример,
                    который её достигает.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Сумма длин всех кодов включает заданные коды; сумма длин
                    оставшихся — только новые.
                  </>
                ),
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
            Наименьшую длину слова спрашивают 33 задачи из 94, и это главный тип
            последних лет: обе задачи основной волны ЕГЭ-2026 такие. Приёмов
            этой страницы хватает для 22 из них; остальные 11 требуют сравнения
            форм дерева из подтемы 5.
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
              Перед поиском минимума нужно определить, какую величину требуется
              уменьшить.
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
              ["Произведение длин", "Умножение указанных длин"],
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
          <Typography.Text>
            В программе частоту даёт{" "}
            <PythonTerm term="strmeth">
              <Notation>{"word.count(letter)"}</Notation>
            </PythonTerm>
            , а длину кода —{" "}
            <PythonTerm term="len">
              <Notation>{"len"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "code = {'А': '0', 'Б': '10', 'В': '110', 'Г': '111'}\nword = 'АААБВ'\ntotal = 0\nfor letter in code:\n    total += word.count(letter) * len(code[letter])\nprint(total)"
            }
            label={
              "В программе частоту даёт {{strmeth|word.count(letter)}}, а длину кода — {{len|len}}"
            }
            language="python"
            output={"8"}
          />
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
          <Typography.Text>
            Почему меньше нельзя? Код <Notation>{"1"}</Notation> использовать
            нельзя: он занял бы всё место для М, Л и Н. Значит, коды М и Л имеют
            длину хотя бы 2. Но дать обеим буквам двухзначные коды тоже нельзя:{" "}
            <Notation>{"10"}</Notation> и <Notation>{"11"}</Notation> заняли бы
            всю свободную ветвь, не оставив места Н.
          </Typography.Text>
          <Typography.Text>
            Следовательно, один из кодов М и Л имеет длину хотя бы 3, их сумма
            не меньше 2 + 3 = 5, а{" "}
            <strong>длина слова — не меньше 8 + 5 = 13</strong>. Полученный
            вариант достигает этой границы.
          </Typography.Text>
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
          <Typography.Text>Это допустимо, если:</Typography.Text>
          <ul>
            <li>максимальные длины не ограничены;</li>
            <li>
              от нас не требуют дополнительно минимизировать сумму длин самих
              отсутствующих кодов.
            </li>
          </ul>
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
          <ProofDisclosure summary="То же правило для любых частот и длин">
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
            <li>Доказать, что короче нельзя, как для МОЛОКО.</li>
          </ol>
          <Typography.Text>
            Так решается большинство задач. Но из правила о готовых местах{" "}
            <strong>не следует</strong>, что самой частой букве нужно немедленно
            отдать самый короткий свободный код: такой выбор может занять
            большую ветвь и заставить несколько других букв получить слишком
            длинные коды. Когда так бывает и как это заметить, разберём в
            подтеме 5.
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
                note: (
                  <>
                    Сначала назови величину: код одной буквы, сумма длин, длина
                    слова, произведение — разные ответы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Длина слова = сумма «частота × длина кода»; буква с частотой
                    0 всё равно занимает место.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Буквы вне слова и весь остальной алфавит можно держать в
                    одной резервной ветви.
                  </>
                ),
              },
              {
                note: (
                  <>
                    На готовых местах короткие коды — частым буквам; заданные
                    коды не переставляются.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "korotkij-ne-vsegda",
      navLabel: "Короткий не всегда выгоден",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Самой частой букве не всегда выгодно отдавать самый короткий
              свободный код: иногда лучше разделить эту вершину и поднять выше
              несколько других букв.
            </strong>{" "}
            Такая ловушка есть в 11 из 94 задач подборок, в том числе в
            досрочной волне ЕГЭ-2022, и 7 из них — 2025–2026 годов. Порядок
            действий подтемы 4 в них даёт неверный ответ, поэтому формы дерева
            нужно сравнивать.
          </Typography.Text>
          <Typography.Text>
            Пример страницы: алфавит из семи букв А, Б, В, Г, Д, Е, Ж, заданы Д
            — <Notation>{"01"}</Notation>, Е — <Notation>{"10"}</Notation>, Ж —{" "}
            <Notation>{"110"}</Notation>. В сообщении А встречается 4 раза, Б —
            3 раза, В и Г — по 2. Функцию <Notation>{"fano"}</Notation> из
            подтемы 1 считаем определённой выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "lovushka-chastoj",
      navLabel: "Ловушка частой буквы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Самый короткий код для частой буквы иногда ухудшает весь
              результат.
            </strong>{" "}
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
        </>
      ),
    },
    {
      id: "dokazatelstvo-minimuma",
      navLabel: "Доказательство минимума",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Минимум доказывают, перебрав, сколько коротких мест взять.
            </strong>{" "}
            Докажем, что 37 — минимум. Варианты различаются тем, используется ли
            единственный свободный код длины 2.
          </Typography.Text>
          <ul>
            <li>
              <strong>Вариант с кодом длины 2.</strong> Единственный такой
              свободный код — <Notation>{"00"}</Notation>. Выгоднее всего отдать
              его А. Как мы уже установили, тогда лучший результат равен 40.
            </li>
            <li>
              <strong>Вариант без кодов длины 2.</strong> Все новые коды имеют
              длину хотя бы 3. На глубине 3 свободны{" "}
              <Notation>{"000"}</Notation>, <Notation>{"001"}</Notation> и{" "}
              <Notation>{"111"}</Notation>. Если занять все три, для четвёртой
              буквы ничего не останется. Поэтому среди четырёх кодов не больше
              двух могут иметь длину 3, ещё хотя бы два имеют длину не меньше 4.
              Наилучшая возможная оценка: 4 · 3 + 3 · 3 + 2 · 4 + 2 · 4 = 37.
              Она достигается построенной таблицей.
            </li>
          </ul>
          <Typography.Text>
            Значит, глобальный минимум — 37.{" "}
            <strong>
              Практический вывод: нужно сравнивать варианты разветвления дерева.
            </strong>{" "}
            Правило о частотах из подтемы 4 помогает распределить буквы по
            готовым местам, но не заменяет выбор самих мест.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "lovushka-vtoroj",
      navLabel: "Ловушка второй буквы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ловушка бывает и не у самой частой буквы: кратчайший код второй по
              частоте букве тоже может удлинить слово.
            </strong>{" "}
            Пусть сообщения состоят из букв Д, М, И, Р, С, задан код Д —{" "}
            <Notation>{"101"}</Notation>, а в сообщении М встречается 4 раза, И
            и Р — по 2 раза, С — один раз. Свободны три ветви:{" "}
            <Notation>{"0…"}</Notation>, <Notation>{"100…"}</Notation> и{" "}
            <Notation>{"11…"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Самой частой букве М отдадим <Notation>{"0"}</Notation> — здесь это
            верный выбор. Следующая по частоте И берёт кратчайший из оставшихся
            код <Notation>{"11"}</Notation>, и тогда Р и С остаётся только ветвь{" "}
            <Notation>{"100…"}</Notation>: Р — <Notation>{"1000"}</Notation>, С
            — <Notation>{"1001"}</Notation>. Длина 4 · 1 + 2 · 2 + 2 · 4 + 1 · 4
            = <strong>20</strong>.
          </Typography.Text>
          <Typography.Text>
            Если же И не занимает <Notation>{"11"}</Notation>, а встаёт на{" "}
            <Notation>{"100"}</Notation>, то Р и С получают{" "}
            <Notation>{"110"}</Notation> и <Notation>{"111"}</Notation>: 4 · 1 +
            2 · 3 + 2 · 3 + 1 · 3 = <strong>19</strong>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeShapes101_4221}
            caption={
              <>
                Слева И заняла короткую вершину 11, и Р, С ушли на четвёртый
                уровень: длина 20. Справа И на третьем уровне, вершина 11
                разделена для Р и С: длина 19.
              </>
            }
          />
          <Typography.Text>
            Код И укоротился на знак и сэкономил 2 бита, но коды Р и С
            удлинились на знак каждый и добавили 2 + 1 = 3.{" "}
            <strong>
              Вывод тот же, что и для самой частой буквы: сравнивай варианты
              размещения, а не следуй правилу «частой букве — кратчайший код».
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perebor-form",
      navLabel: "Перебор форм дерева",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждую свободную ветвь можно оставить пустой, занять одной буквой
              или разделить — так перебираются все формы дерева.
            </strong>{" "}
            Здесь «перебор» означает не случайное угадывание кодов, а
            последовательное рассмотрение вариантов. После нанесения заданных
            кодов каждая полностью свободная ветвь допускает три действия:
          </Typography.Text>
          <ul>
            <li>оставить её неиспользованной;</li>
            <li>занять её одной буквой;</li>
            <li>разделить на две ветви и размещать буквы ниже.</li>
          </ul>
          <Typography.Text>
            Для новых ветвей применяется то же правило. Из одной свободной
            вершины получаются такие наборы <strong>дополнительных длин</strong>{" "}
            — сколько знаков нужно дописать к началу свободной ветви:
          </Typography.Text>
          <VariantPicker
            label={"Сколько букв разместить в одной свободной ветви"}
            defaultIndex={2}
            variants={[
              {
                label: "1",
                value: <>0</>,
                note: <>буква занимает саму вершину</>,
              },
              {
                label: "2",
                value: <>1, 1</>,
                note: <>вершина разделена один раз</>,
              },
              {
                label: "3",
                value: <>1, 2, 2</>,
                note: <>одна буква выше, две ниже</>,
              },
              {
                label: "4",
                value: <>2, 2, 2, 2 или 1, 2, 3, 3</>,
                note: <>равномерно или одна особенно короткая</>,
              },
            ]}
          />
          <Typography.Text>
            Если сама ветвь — <Notation>{"11"}</Notation>, её начальная длина
            равна 2. Поэтому дополнительные длины 1, 2, 2 превращаются в полные
            3, 4, 4, а 2, 2, 2, 2 — в 4, 4, 4, 4. Для четырёх букв два варианта
            принципиально различаются: равномерное размещение даёт одинаковые
            длины, второй вариант даёт одной букве особенно короткий код ценой
            удлинения других. <strong>Какой лучше, зависит от частот.</strong>
          </Typography.Text>
          <Typography.Text>Общий порядок работы:</Typography.Text>
          <ol>
            <li>Построить неизменяемую часть дерева.</li>
            <li>Найти полностью свободные ветви.</li>
            <li>
              Определить, сколько неизвестных букв нужно разместить; буквы вне
              слова — одно резервное место, как в подтеме 4.
            </li>
            <li>
              Рассмотреть, какие ветви занять сразу, а какие разделить, —
              сколько букв уходит в каждую ветвь и какой набор длин в ней.
            </li>
            <li>
              Для каждого полученного набора длин распределить свободные буквы:
              большие частоты — меньшим длинам.
            </li>
            <li>Посчитать требуемую величину.</li>
            <li>
              Сравнить варианты и обосновать, почему ещё более короткий вариант
              невозможен.
            </li>
          </ol>
          <Typography.Text>
            В примере страницы четыре буквы делятся между ветвями{" "}
            <Notation>{"00"}</Notation> (длина 2) и <Notation>{"111"}</Notation>{" "}
            (длина 3). Одна буква в <Notation>{"00"}</Notation> и три в{" "}
            <Notation>{"111"}</Notation> дают длины 2 и 4, 5, 5 — это 40. Две и
            две — длины 3, 3 и 4, 4 — это 37. Три и одна — 3, 4, 4 и 3 — тоже 37
            (А, Б в <Notation>{"000"}</Notation>, <Notation>{"111"}</Notation>;
            В, Г в <Notation>{"0010"}</Notation>, <Notation>{"0011"}</Notation>
            ). Все четыре буквы в одной ветви дают ещё длиннее.{" "}
            <strong>
              При других частотах лучшим может оказаться и первый вариант
            </strong>{" "}
            — поэтому сравнивают все распределения, а не запоминают правило.
          </Typography.Text>
          <ProofDisclosure summary="Почему так перебираются все решения и почему не нужны длинные пустые продолжения">
            <Typography.Text>
              Любой допустимый префиксный код — это некоторое размещение букв в
              листьях свободных ветвей. Значит, любой вариант получается
              последовательностью таких разветвлений.
            </Typography.Text>
            <Typography.Text>
              Не нужно рассматривать бесконечно длинные бесполезные продолжения.
              Если внутри полностью свободной ветви на каком-то шаге
              используется только одно из двух продолжений, а другое пустует,
              этот шаг можно убрать и сократить все расположенные ниже коды.
              Условие Фано сохранится.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "programma-perebora",
      navLabel: "Программа перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>Программа полного перебора проверяет ручной ответ.</strong>{" "}
            На экзамене формы дерева сравнивают руками, а программой удобно
            убедиться, что ничего не упущено. Сначала соберём кандидатов — все
            коды длины до 5, совместимые с заданными. Затем{" "}
            <PythonTerm term="product">
              <Notation>{"product"}</Notation>
            </PythonTerm>{" "}
            переберёт все наборы кодов для четырёх букв; набор годится, если
            вместе с заданными кодами проходит <Notation>{"fano"}</Notation>.
            Лучшую длину хранит <Notation>{"best"}</Notation>, её обновляет{" "}
            <PythonTerm term="agg">
              <Notation>{"min"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "from itertools import product\n\nfixed = ['01', '10', '110']\nfreq = [4, 3, 2, 2]\ncands = []\nfor length in range(1, 6):\n    for x in range(2 ** length):\n        new = bin(x)[2:].zfill(length)\n        if fano(fixed + [new]):\n            cands.append(new)\nbest = 1000\nfor codes in product(cands, repeat=len(freq)):\n    if fano(fixed + list(codes)):\n        total = 0\n        for i in range(len(freq)):\n            total += freq[i] * len(codes[i])\n        best = min(best, total)\nprint(len(cands), best)"
            }
            label={"Лучшую длину хранит best, её обновляет {{agg|min}}"}
            language="python"
            output={"22 37"}
          />
          <Typography.Text>
            Кандидатов 22, лучший набор даёт 37 — как в ручном разборе. Если в
            алфавите есть буквы вне слова, в перебор добавляют ещё одну «букву»
            с частотой 0: она и есть резервное место. Граница длины 5 здесь с
            запасом — более длинные коды только удлиняют сообщение.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "forma-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Кратчайший свободный код самой частой букве — не всегда
                    лучший выбор: он может загнать другие буквы глубоко.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Свободную ветвь оставляют, занимают одной буквой или делят;
                    так перебираются все формы дерева.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Для каждой формы частые буквы получают короткие места;
                    варианты сравнивают по требуемой величине.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Минимум доказывают перебором случаев по числу коротких мест;
                    программа полного перебора проверяет ответ.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dopolnitelnyy-urok-podschet",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет закрыть все возможные случаи задания 4: 11 из 94 задач
            подборок спрашивают на том же дереве другую величину. На реальных
            экзаменах таких задач не было, но 8 из них — 2025–2026 годов. Задачи
            основных подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Дерево и свободные ветви остаются прежними — меняется только то,
              что считают или сравнивают.
            </strong>{" "}
            Количество возможных кодов, предельная длина, произведение длин, два
            требования подряд, сама запись слова, количество единиц, код,
            нарушающий условие Фано, — каждая из этих величин добавляет к
            знакомой схеме один шаг.
          </Typography.Text>
          <Typography.Text>
            Первые два шага разберём на кодах А — <Notation>{"0"}</Notation>, Б
            — <Notation>{"10"}</Notation>: свободна одна ветвь{" "}
            <Notation>{"11…"}</Notation>. Функцию <Notation>{"fano"}</Notation>{" "}
            из подтемы 1 считаем определённой выше в программе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "podschet-kodov",
      navLabel: "Подсчёт кодов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При подсчёте количества возможных кодов считают альтернативы для
              одной буквы.
            </strong>{" "}
            Пусть заданы А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, и нужно выбрать код единственной
            оставшейся буквы В длиной не больше 4. Свободна ветвь{" "}
            <Notation>{"11…"}</Notation>. Перечислим варианты:
          </Typography.Text>
          <LessonTable
            label={"Перечислим варианты"}
            columns={[
              { label: "Длина", numeric: true },
              { label: "Возможные коды" },
              { label: "Количество", numeric: true },
            ]}
            rows={[
              [
                "2",
                <>
                  <Notation>{"11"}</Notation>
                </>,
                "1",
              ],
              [
                "3",
                <>
                  <Notation>{"110"}</Notation>, <Notation>{"111"}</Notation>
                </>,
                "2",
              ],
              [
                "4",
                <>
                  <Notation>{"1100"}</Notation>, <Notation>{"1101"}</Notation>,{" "}
                  <Notation>{"1110"}</Notation>, <Notation>{"1111"}</Notation>
                </>,
                "4",
              ],
            ]}
          />
          <Typography.Text>
            Итого 1 + 2 + 4 = <strong>7</strong>.
          </Typography.Text>
          <Typography.Text>
            Почему мы посчитали и <Notation>{"11"}</Notation>, и{" "}
            <Notation>{"110"}</Notation>, хотя вместе они нарушают условие Фано?
            Потому что речь идёт о{" "}
            <strong>разных вариантах кода одной буквы</strong>: в одном варианте
            В имеет код <Notation>{"11"}</Notation>, в другом —{" "}
            <Notation>{"110"}</Notation>, в третьем —{" "}
            <Notation>{"111"}</Notation> и так далее. Они не обязаны
            одновременно присутствовать в одной таблице.
          </Typography.Text>
          <Typography.Text>
            Теперь изменим условие: кроме В, есть ещё неизвестная буква Г. Код{" "}
            <Notation>{"11"}</Notation> для В использовать нельзя: он займёт всю
            свободную ветвь. Остальные шесть вариантов допустимы: если В —{" "}
            <Notation>{"110"}</Notation>, для Г можно взять{" "}
            <Notation>{"111"}</Notation>; если В — <Notation>{"1100"}</Notation>
            , для Г можно взять, например, <Notation>{"1101"}</Notation>.
            Поэтому ответ станет <strong>6</strong>.
          </Typography.Text>
          <Typography.Text>
            Если неизвестных дополнительных букв не одна, а много, ответ
            останется 6 — при условии, что длины их кодов не ограничены. После
            любого из этих шести вариантов остаётся свободная ветвь, которую
            можно разделять дальше.
          </Typography.Text>
          <Typography.Text>
            Полезная формула для одной свободной ветви: если её начало имеет
            длину d, а мы считаем коды ровно длины D ≥ d, нужно дописать D − d
            знаков, поэтому вариантов <strong>2ᴰ⁻ᵈ</strong>. Если свободных
            ветвей несколько, варианты по ветвям складываются; а если остальным
            буквам нужно место, исключаются только коды, которые занимают
            последнюю свободную ветвь целиком.
          </Typography.Text>
          <ProofDisclosure summary="Все длины от d до D сразу: 2ᴰ⁻ᵈ⁺¹ − 1">
            <Typography.Text>
              Если считаем все длины от d до D, получаем 1 + 2 + 4 + … + 2ᴰ⁻ᵈ.
              Эта сумма равна 2ᴰ⁻ᵈ⁺¹ − 1. Почему? Если обозначить сумму через S
              и умножить её на 2, то при вычитании 2S − S все промежуточные
              слагаемые сократятся. Останется последнее удвоенное слагаемое
              минус 1. Но для небольших длин часто проще посчитать по уровням,
              как в таблице.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Программа повторяет подсчёт: перебирает все коды длины до 4 и
            считает те, с которыми таблица проходит{" "}
            <Notation>{"fano"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "count = 0\nfor length in range(1, 5):\n    for x in range(2 ** length):\n        new = bin(x)[2:].zfill(length)\n        if fano(['0', '10', new]):\n            count += 1\nprint(count)"
            }
            label={"Код на Python: count = 0"}
            language="python"
            output={"7"}
          />
        </>
      ),
    },
    {
      id: "maksimalnaya-dlina",
      navLabel: "Максимальная длина",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ограничение максимальной длины меняет правило о резервной ветви.
            </strong>{" "}
            До этого мы пользовались тем, что одну свободную ветвь можно
            разделять достаточно глубоко. Теперь предположим, что длина каждого
            нового кода должна быть <strong>не больше 4</strong>. Заданы А —{" "}
            <Notation>{"0"}</Notation>, Б — <Notation>{"10"}</Notation>,
            осталось закодировать четыре буквы: В, Г, Д, Е.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree010_3d038c}
            caption={
              <>
                Свободная ветвь 11 начинается на глубине 2. До предела длины 4 в
                ней помещается 2⁴⁻² = 4 места: 1100, 1101, 1110, 1111.
              </>
            }
          />
          <Typography.Text>
            Четыре буквы можно разместить, назначив им эти четыре кода. А можно
            ли дать В код <Notation>{"110"}</Notation> длины 3? После этого
            останется только ветвь <Notation>{"111…"}</Notation>. До глубины 4 в
            ней помещаются лишь две буквы — <Notation>{"1110"}</Notation> и{" "}
            <Notation>{"1111"}</Notation>. Но разместить нужно ещё три.{" "}
            <strong>
              Значит, код <Notation>{"110"}</Notation> недопустим, хотя
              свободная ветвь после него формально остаётся.
            </strong>
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Если максимальная длина равна D, то свободная ветвь, начинающаяся
              на глубине d, вмещает не более 2ᴰ⁻ᵈ букв.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Максимум достигается, когда все эти буквы получают коды длины D.
            Например, при D = 5 ветвь <Notation>{"0"}</Notation> вмещает 2⁴ = 16
            букв, <Notation>{"10"}</Notation> — 2³ = 8,{" "}
            <Notation>{"111"}</Notation> — 2² = 4, <Notation>{"0010"}</Notation>{" "}
            — 2¹ = 2. Если независимых свободных ветвей несколько, их
            вместимости складываются. Это позволяет проверять выбор кода без
            полного дорисовывания дерева: после его назначения должно остаться
            достаточно мест на предельной глубине.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "proizvedenie-dlin",
      navLabel: "Произведение длин",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для произведения длин нужно сравнивать именно произведения.
            </strong>{" "}
            Предположим, заданные коды А — <Notation>{"01"}</Notation>, Б —{" "}
            <Notation>{"10"}</Notation>, В — <Notation>{"110"}</Notation>, Г —{" "}
            <Notation>{"1110"}</Notation> оставили свободными только ветви{" "}
            <Notation>{"00…"}</Notation> и <Notation>{"1111…"}</Notation>. Нужно
            добавить две буквы и уменьшить произведение длин их кодов.
          </Typography.Text>
          <LessonTable
            label={
              "Нужно добавить две буквы и уменьшить произведение длин их кодов"
            }
            columns={[
              { label: "Новые коды" },
              { label: "Длины" },
              { label: "Сумма", numeric: true },
              { label: "Произведение", numeric: true },
            ]}
            rows={[
              [
                <>
                  <Notation>{"00"}</Notation>, <Notation>{"1111"}</Notation>
                </>,
                "2 и 4",
                "6",
                "8",
              ],
              [
                <>
                  <Notation>{"000"}</Notation>, <Notation>{"001"}</Notation>
                </>,
                "3 и 3",
                "6",
                "9",
              ],
            ]}
          />
          <Typography.Text>
            Суммы одинаковы, но произведения различаются. Наименьшее
            произведение здесь равно 8: если используем код длины 2, второй
            имеет длину хотя бы 4; если код длины 2 не используем, оба имеют
            длину хотя бы 3, и произведение не меньше 9.
          </Typography.Text>
          <Typography.Text>
            Поэтому{" "}
            <strong>недостаточно решить привычную задачу на сумму</strong>.
            Нужно каждый раз выписывать ту величину, которая указана в вопросе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-trebovaniya",
      navLabel: "Два требования",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если в условии два требования подряд, второе применяется только к
              решениям первого.
            </strong>{" "}
            Например:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Сообщение закодировано минимально возможным количеством знаков.
              Какова при этом минимальная сумма длин кодовых слов?
            </Typography.Text>
          </blockquote>
          <Typography.Text>Порядок действий:</Typography.Text>
          <ol>
            <li>найти минимальную длину сообщения;</li>
            <li>оставить только таблицы, достигающие этого минимума;</li>
            <li>среди них минимизировать сумму длин кодовых слов.</li>
          </ol>
          <Typography.Text>
            Разберём небольшой пример. Частоты: А — 2 раза, Б, В, Г — по одному
            разу. Сравним две таблицы:
          </Typography.Text>
          <LessonTable
            label={"Сравним две таблицы"}
            columns={[
              { label: "Буква" },
              { label: "Первый вариант" },
              { label: "Второй вариант" },
            ]}
            rows={[
              [
                "А",
                <>
                  <Notation>{"0"}</Notation>
                </>,
                <>
                  <Notation>{"00"}</Notation>
                </>,
              ],
              [
                "Б",
                <>
                  <Notation>{"10"}</Notation>
                </>,
                <>
                  <Notation>{"01"}</Notation>
                </>,
              ],
              [
                "В",
                <>
                  <Notation>{"110"}</Notation>
                </>,
                <>
                  <Notation>{"10"}</Notation>
                </>,
              ],
              [
                "Г",
                <>
                  <Notation>{"111"}</Notation>
                </>,
                <>
                  <Notation>{"11"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            В первом варианте длина сообщения 2 · 1 + 1 · 2 + 1 · 3 + 1 · 3 =
            10, сумма длин кодов 1 + 2 + 3 + 3 = 9. Во втором длина сообщения 2
            · 2 + 1 · 2 + 1 · 2 + 1 · 2 = 10, сумма длин 2 + 2 + 2 + 2 = 8.{" "}
            <strong>
              Оба варианта дают минимальную длину сообщения 10, но второй лучше
              по дополнительному требованию.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Почему длина сообщения меньше 10 невозможна? Если нет однозначных
            кодов, все пять появлений букв требуют хотя бы по два бита: минимум
            10. Если есть однозначный код, выгоднее отдать его А; три другие
            буквы помещаются в оставшейся ветви с минимальными длинами 2, 3, 3,
            и получаются те же 2 + 2 + 3 + 3 = 10.
          </Typography.Text>
          <Typography.Text>
            Итак, при двух требованиях{" "}
            <strong>
              нельзя остановиться на первой найденной оптимальной таблице
            </strong>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapis-slova",
      navLabel: "Запись слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если нужна сама запись слова, её строят целиком и только потом
              сравнивают и переводят.
            </strong>{" "}
            В задачах встречается и такое: найти не длину, а саму кодовую
            последовательность наименьшей длины и записать её в восьмеричной
            системе. Правильная последовательность действий:
          </Typography.Text>
          <ol>
            <li>Найти минимальную длину закодированного сообщения.</li>
            <li>Рассмотреть допустимые таблицы, достигающие этой длины.</li>
            <li>
              Если требуется наименьшее числовое значение, сравнить полученные{" "}
              <strong>полные записи сообщения</strong>.
            </li>
            <li>Выбранную двоичную запись перевести в требуемую систему.</li>
          </ol>
          <Typography.Text>
            Почему сравниваем полные записи? Потому что значение зависит от
            того, какие знаки окажутся в начале сообщения, а не только от набора
            длин кодов. Для двоичных записей одинаковой длины сравнение
            выполняется слева направо: в первом различающемся разряде{" "}
            <Notation>{"0"}</Notation> меньше <Notation>{"1"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Перевод из двоичной системы в восьмеричную удобен благодаря
            равенству 8 = 2³: каждая группа из трёх двоичных знаков — одна
            восьмеричная цифра, от <Notation>{"000"}</Notation> — 0 до{" "}
            <Notation>{"111"}</Notation> — 7. Например, после кодирования
            получена запись <Notation>{"11010110"}</Notation>. Разбиваем её на
            тройки <strong>справа налево</strong>:{" "}
            <Notation>{"11 | 010 | 110"}</Notation>. Дополняем левую неполную
            группу нулём: <Notation>{"011 | 010 | 110"}</Notation>. Получаем
            11010110₂ = 326₈.
          </Typography.Text>
          <Typography.Text>
            Добавленный слева ноль нужен только для удобства перевода. Он не
            увеличивает исходную длину закодированного сообщения. Программой
            перевод проверяет{" "}
            <PythonTerm term="base">
              <Notation>{"oct"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={"s = '11010110'\nprint(oct(int(s, 2))[2:])"}
            label={"Программой перевод проверяет {{base|oct}}"}
            language="python"
            output={"326"}
          />
        </>
      ),
    },
    {
      id: "chislo-edinic",
      navLabel: "Число единиц",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наименьшее количество единиц считают так же, как длину, только
              каждый код весит столько, сколько в нём единиц.
            </strong>{" "}
            Шаг по ветви <Notation>{"0"}</Notation> удлиняет код, но не
            добавляет единиц. Поэтому внутри свободной ветви{" "}
            <Notation>{"0…"}</Notation> код <Notation>{"00…0"}</Notation> вообще
            без единиц, а следующей букве той же ветви нужна хотя бы одна
            единица.
          </Typography.Text>
          <Typography.Text>
            Пусть кодируется весь русский алфавит, известны А —{" "}
            <Notation>{"100"}</Notation> и Б — <Notation>{"11"}</Notation>, и
            нужно уменьшить количество единиц в записи слова ВАГА. Две буквы А
            дают 1 + 1 = 2 единицы. Свободны ветви <Notation>{"0…"}</Notation> и{" "}
            <Notation>{"101…"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Букве В отдадим <Notation>{"00"}</Notation> — без единиц. Букве Г
            лучше всего <Notation>{"010"}</Notation> с одной единицей: в ветви{" "}
            <Notation>{"101"}</Notation> любой код содержит не меньше двух.
            Ветвь <Notation>{"011…"}</Notation> остаётся резервом для остальных
            букв. <strong>Итого 0 + 2 + 1 = 3 единицы.</strong> Длина кодов при
            этом не важна.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeTree10011_b543f4}
            caption={
              <>
                В идёт от корня только по ветвям 0 — в её коде нет единиц. Г
                сворачивает на ветвь 1 один раз. Ветвь 101 не нужна: в ней любой
                код начинается с двух единиц.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "narushenie-fano",
      navLabel: "Нарушение Фано",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код, нарушающий условие Фано, ищут на путях к буквам и под
              буквами.
            </strong>{" "}
            Иногда спрашивают обратное: кратчайший код, при котором условие Фано{" "}
            <strong>не</strong> выполняется, причём длиннее одного знака и не
            совпадающий с заданными. Такой код должен быть началом заданного
            (вершина на пути к букве) или начинаться с заданного (вершина под
            буквой).
          </Typography.Text>
          <Typography.Text>
            Пусть заданы К — <Notation>{"00"}</Notation>, Л —{" "}
            <Notation>{"011"}</Notation>, М — <Notation>{"10"}</Notation>. Коды
            длины 2 по порядку значений: <Notation>{"00"}</Notation> — уже
            занят; <Notation>{"01"}</Notation> — начало{" "}
            <Notation>{"011"}</Notation>, нарушает условие.{" "}
            <strong>
              Ответ: <Notation>{"01"}</Notation>.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "podschet-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Количество вариантов кода одной буквы — альтернативы, а не
                    одновременные коды; в ветви длины d кодов длины D ровно
                    2ᴰ⁻ᵈ.
                  </>
                ),
              },
              {
                note: (
                  <>
                    При предельной длине D ветвь глубины d вмещает не больше
                    2ᴰ⁻ᵈ букв.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Произведение, сумма и длина сообщения — разные величины;
                    считай ту, что спрашивают.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Два требования выполняются по порядку: второе — только среди
                    решений первого.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Запись слова сравнивают целиком и переводят тройками справа
                    налево.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dopolnitelnyy-urok-zapis",
      navLabel: "Дополнительный урок",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> Он для тех,
            кто хочет закрыть все возможные случаи задания 4: в 6 из 94 задач
            подборок коды нужно восстановить по записи слова или по длине его
            кода. На реальных экзаменах таких задач не было. Задачи основных
            подтем решаются без него.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Запись слова — это коды его букв подряд, и повторы букв
              подсказывают, где проходят границы.
            </strong>{" "}
            Вторая половина урока — о том, что стоит за условием Фано: обратное
            условие, неравенство Крафта и метод Хаффмана. Ни одна задача
            подборок их не требует, но они объясняют, почему схема темы
            работает.
          </Typography.Text>
          <Typography.Text>
            Главный пример первой половины — слово ТОПОТ, записанное как{" "}
            <Notation>{"100110010"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kody-po-povtoram",
      navLabel: "Коды по повторам",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если известно слово и его двоичная запись, коды восстанавливают по
              повторам букв.
            </strong>{" "}
            Известно, что слово ТОПОТ закодировано как{" "}
            <Notation>{"100110010"}</Notation>, код удовлетворяет условию Фано.
            Нужно определить код П.
          </Typography.Text>
          <Typography.Text>
            Мы не знаем, где находятся границы букв, но знаем структуру слова: Т
            | О | П | О | Т.{" "}
            <strong>Первый и последний фрагменты должны совпадать</strong>,
            потому что это одна и та же буква Т. Второй и предпоследний тоже
            должны совпадать.
          </Typography.Text>
          <Typography.Text>
            Обозначим длины кодов Т, О, П через t, o, p. В записи девять знаков,
            поэтому 2t + 2o + p = 9. Все длины положительные, значит 2t + 2 · 1
            + 1 ≤ 9, откуда t ≤ 3. Проверяем возможные длины Т:
          </Typography.Text>
          <VariantPicker
            label={"Длина кода Т: начало и конец записи"}
            defaultIndex={1}
            variants={[
              {
                label: "1",
                value: (
                  <>
                    <Notation>{"1"}</Notation> и <Notation>{"0"}</Notation>
                  </>
                ),
                note: <>не совпадают</>,
              },
              {
                label: "2",
                value: (
                  <>
                    <Notation>{"10"}</Notation> и <Notation>{"10"}</Notation>
                  </>
                ),
                note: (
                  <>
                    <strong>совпадают</strong>
                  </>
                ),
              },
              {
                label: "3",
                value: (
                  <>
                    <Notation>{"100"}</Notation> и <Notation>{"010"}</Notation>
                  </>
                ),
                note: <>не совпадают</>,
              },
            ]}
          />
          <Typography.Text>
            Следовательно,{" "}
            <strong>
              Т — <Notation>{"10"}</Notation>
            </strong>
            . Убираем эти одинаковые фрагменты с начала и конца:{" "}
            <Notation>{"10 | 01100 | 10"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            В середине осталось ОПО — <Notation>{"01100"}</Notation>, и 2o + p =
            5, поэтому o может быть только 1 или 2. Если o = 1, начало и конец —{" "}
            <Notation>{"0"}</Notation> и <Notation>{"0"}</Notation>: подходит.
            Если o = 2, начало <Notation>{"01"}</Notation>, конец{" "}
            <Notation>{"00"}</Notation>: не подходит. Получаем{" "}
            <strong>
              О — <Notation>{"0"}</Notation>
            </strong>
            , остаток <Notation>{"0 | 110 | 0"}</Notation>, значит,{" "}
            <strong>
              П — <Notation>{"110"}</Notation>
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Проверяем всю таблицу: О — <Notation>{"0"}</Notation>, Т —{" "}
            <Notation>{"10"}</Notation>, П — <Notation>{"110"}</Notation>. Ни
            один код не является началом другого. Кроме того, осталась ветвь{" "}
            <Notation>{"111…"}</Notation>, поэтому при необходимости можно
            закодировать другие буквы.{" "}
            <strong>
              Ответ: <Notation>{"110"}</Notation>.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Перебор длин удобно поручить программе: для каждой длины t она
            сравнивает <PythonTerm term="slice">срезы</PythonTerm> — первые и
            последние t знаков записи:
          </Typography.Text>
          <CodeBlock
            code={
              "s = '100110010'\nfor t in range(1, 4):\n    print(t, s[:t], s[-t:], s[:t] == s[-t:])"
            }
            label={"Код на Python: s = '100110010'"}
            language="python"
            output={"1 1 0 False\n2 10 10 True\n3 100 010 False"}
          />
          <Typography.Text>Общий подход для таких задач:</Typography.Text>
          <ol>
            <li>
              Записать порядок букв как последовательность неизвестных
              фрагментов.
            </li>
            <li>Использовать совпадения кодов повторяющихся букв.</li>
            <li>Составить равенство для общей длины.</li>
            <li>Проверить возможные длины и границы.</li>
            <li>Проверить условие Фано для восстановленных кодов.</li>
            <li>
              Если алфавит шире данного слова, проверить возможность
              закодировать остальные буквы.
            </li>
          </ol>
          <Typography.Text>
            Само по себе удачное разбиение одной строки ещё не гарантирует, что
            получилась допустимая таблица.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "uravnenie-na-dliny",
      navLabel: "Уравнение на длины",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если известна только длина записи, составляют уравнение на длины и
              проверяют, хватит ли места остальным буквам.
            </strong>{" "}
            Пусть кодируется весь русский алфавит, известны О —{" "}
            <Notation>{"10"}</Notation>, К — <Notation>{"011"}</Notation>, а код
            слова КОЛОС содержит 11 знаков. Сколько знаков в коде слова ЛОЛ?
          </Typography.Text>
          <Typography.Text>
            Известные буквы дают 3 + 2 + 2 = 7 знаков, поэтому l + c = 4, где l
            и c — длины кодов Л и С. Свободны вершины{" "}
            <Notation>{"00"}</Notation>, <Notation>{"010"}</Notation> и{" "}
            <Notation>{"11"}</Notation>; свободных кодов длины 1 нет, поэтому
            обе длины не меньше 2. Значит, l = c = 2: Л и С занимают{" "}
            <Notation>{"00"}</Notation> и <Notation>{"11"}</Notation>, а ветвь{" "}
            <Notation>{"010…"}</Notation> остаётся остальным буквам.{" "}
            <strong>Код слова ЛОЛ содержит 2 + 2 + 2 = 6 знаков.</strong>
          </Typography.Text>
          <Typography.Text>
            Здесь второе условие — место для алфавита — не помешало, но в
            задачах оно часто отсекает варианты, которые подходят по длине.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dva-slova",
      navLabel: "Два слова",
      explanation: (
        <>
          <Typography.Text>
            <strong>Записи двух слов сравнивают по общим буквам.</strong> Пусть
            слово КОТ записано как <Notation>{"01011"}</Notation>, а слово ТОК —
            как <Notation>{"11100"}</Notation>, код удовлетворяет условию Фано.
            Найдём запись слова ОКО.
          </Typography.Text>
          <Typography.Text>
            К стоит в начале первой записи и в конце второй. При длине 1 это{" "}
            <Notation>{"0"}</Notation> и <Notation>{"0"}</Notation> — совпадает;
            при длине 2 — <Notation>{"01"}</Notation> и{" "}
            <Notation>{"00"}</Notation>, при длине 3 —{" "}
            <Notation>{"010"}</Notation> и <Notation>{"100"}</Notation> — не
            совпадают. Значит, К — <Notation>{"0"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Т стоит в конце первой записи и в начале второй. Длина 1 даёт{" "}
            <Notation>{"1"}</Notation> и <Notation>{"1"}</Notation>, длина 2 —{" "}
            <Notation>{"11"}</Notation> и <Notation>{"11"}</Notation>: подходят
            обе. Проверяем середину. При Т — <Notation>{"1"}</Notation> код О
            был бы <Notation>{"101"}</Notation> по первой записи и{" "}
            <Notation>{"110"}</Notation> по второй — противоречие. При Т —{" "}
            <Notation>{"11"}</Notation> обе записи дают О —{" "}
            <Notation>{"10"}</Notation>.{" "}
            <strong>
              Итак, К — <Notation>{"0"}</Notation>, О —{" "}
              <Notation>{"10"}</Notation>, Т — <Notation>{"11"}</Notation>, и
              ОКО записывается как <Notation>{"10010"}</Notation>.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ne-tolko-fano",
      navLabel: "Не только Фано",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие Фано гарантирует однозначность, но не является
              единственным способом её обеспечить.
            </strong>{" "}
            Это полезно понимать, чтобы не усвоить неверное утверждение «если
            условие Фано нарушено, сообщение обязательно неоднозначно». Так
            говорить нельзя.
          </Typography.Text>
          <Typography.Text>
            Рассмотрим всего две буквы: А — <Notation>{"0"}</Notation>, Б —{" "}
            <Notation>{"01"}</Notation>. Прямое условие Фано нарушено:{" "}
            <Notation>{"0"}</Notation> — начало <Notation>{"01"}</Notation>. Но
            код всё равно однозначно декодируется. Его удобно читать{" "}
            <strong>справа налево</strong>: если последний знак{" "}
            <Notation>{"0"}</Notation>, последняя буква — А; если последний знак{" "}
            <Notation>{"1"}</Notation>, последняя буква должна иметь код{" "}
            <Notation>{"01"}</Notation>, то есть это Б. После выделения
            последней буквы продолжаем аналогично.
          </Typography.Text>
          <Typography.Text>
            Этот код удовлетворяет другому условию:{" "}
            <strong>
              ни одно кодовое слово не является концом другого кодового слова
            </strong>
            . Конец последовательности называют <strong>суффиксом</strong>.
            Такое условие часто называют <strong>обратным условием Фано</strong>
            .
          </Typography.Text>
          <LessonTable
            label={"Такое условие часто называют обратным условием Фано"}
            columns={[
              { label: "Требование" },
              { label: "Что запрещено" },
              { label: "Удобное направление чтения" },
            ]}
            rows={[
              [
                "Прямое условие Фано",
                "Один код является началом другого",
                "Слева направо",
              ],
              [
                "Обратное условие Фано",
                "Один код является концом другого",
                "Справа налево",
              ],
            ]}
          />
          <Typography.Text>
            Для обратного условия можно развернуть все кодовые слова и применить
            обычное дерево к перевёрнутым последовательностям. После выбора
            нового кода его нужно развернуть обратно. Но если требуется ещё и
            минимальное числовое значение, сравнивать следует{" "}
            <strong>исходные коды после обратного разворота</strong>.
          </Typography.Text>
          <Typography.Text>
            Рабочее правило — читать точную формулировку:
          </Typography.Text>
          <ul>
            <li>
              если явно требуется условие Фано, проверяем запрет на начало;
            </li>
            <li>если требуется обратное условие, проверяем запрет на конец;</li>
            <li>
              если сказано только об однозначном декодировании, нельзя без
              обоснования объявлять любой непрефиксный код неправильным.
            </li>
          </ul>
          <Typography.Text>
            Одновременно удовлетворять прямому и обратному условиям обычно не
            требуется.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "neravenstvo-krafta",
      navLabel: "Неравенство Крафта",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Код длины l занимает 1/2ˡ всего пространства последовательностей —
              отсюда неравенство Крафта.
            </strong>{" "}
            Этот шаг — дополнение для понимания: основные задачи решаются
            деревом без этой формулы.
          </Typography.Text>
          <Typography.Text>
            Представим всё двоичное дерево как пространство размера 1. Код длины
            1 занимает половину пространства: <Notation>{"0"}</Notation>{" "}
            закрывает все последовательности, начинающиеся с{" "}
            <Notation>{"0"}</Notation>, а <Notation>{"1"}</Notation> — все,
            начинающиеся с <Notation>{"1"}</Notation>. Код длины 2 занимает
            четверть. Каждая следующая ступень делит ветвь пополам, поэтому код
            длины l занимает долю 1/2ˡ.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.codeSpace000110}
            caption={
              <>
                Коды 00, 01 и 10 занимают по четверти отрезка, вместе 3/4.
                Свободная четверть — ветвь 11.
              </>
            }
          />
          <Typography.Text>
            Если выполнено условие Фано, занятые разными буквами части не
            пересекаются, и их общий размер не может превышать 1:
          </Typography.Text>
          <blockquote>
            <Typography.Text>1/2ˡ¹ + 1/2ˡ² + … + 1/2ˡⁿ ≤ 1,</Typography.Text>
          </blockquote>
          <Typography.Text>
            где n — количество букв, l₁, l₂, …, lₙ — длины их кодов. Это
            называется <strong>неравенством Крафта</strong>. Оно выполняется для
            любого префиксного двоичного кода.
          </Typography.Text>
          <Typography.Text>
            Например, для кодов <Notation>{"0"}</Notation>,{" "}
            <Notation>{"10"}</Notation>, <Notation>{"110"}</Notation>,{" "}
            <Notation>{"111"}</Notation> получаем 1/2 + 1/4 + 1/8 + 1/8 = 1: всё
            пространство занято, дополнительную букву без изменения кодов
            разместить нельзя. Для <Notation>{"00"}</Notation>,{" "}
            <Notation>{"01"}</Notation>, <Notation>{"10"}</Notation> — 3/4,
            остаётся четверть пространства, ветвь <Notation>{"11"}</Notation>.
            Если сумма больше 1, префиксный код с такими длинами невозможен: три
            однозначных кода потребовали бы 1/2 + 1/2 + 1/2 = 3/2 {">"} 1.
          </Typography.Text>
          <Typography.Text>
            Сумму удобно считать точно — дробями{" "}
            <PythonTerm term="fraction">
              <Notation>{"Fraction"}</Notation>
            </PythonTerm>
            :
          </Typography.Text>
          <CodeBlock
            code={
              "from fractions import Fraction\n\ncodes = ['00', '01', '10']\nprint(sum(Fraction(1, 2 ** len(c)) for c in codes))"
            }
            label={"Сумму удобно считать точно — дробями {{fraction|Fraction}}"}
            language="python"
            output={"3/4"}
          />
          <Typography.Text>
            Однако у этой проверки есть два ограничения.
          </Typography.Text>
          <ul>
            <li>
              <strong>Сумма не проверяет конкретные последовательности.</strong>{" "}
              Коды <Notation>{"0"}</Notation> и <Notation>{"01"}</Notation> дают
              1/2 + 1/4 = 3/4 ≤ 1, но условие Фано нарушено:{" "}
              <Notation>{"0"}</Notation> — начало <Notation>{"01"}</Notation>.
              Формула проверяет возможность размещения по размерам, а не
              фактическое отсутствие пересечений.
            </li>
            <li>
              <strong>
                Уже заданные позиции кодов могут мешать выбрать нужную длину.
              </strong>{" "}
              Пусть зафиксированы А — <Notation>{"00"}</Notation>, Б —{" "}
              <Notation>{"10"}</Notation>. По длинам для третьего кода длины 1
              получается 1/4 + 1/4 + 1/2 = 1, но назначить его нельзя:{" "}
              <Notation>{"0"}</Notation> — начало <Notation>{"00"}</Notation>,{" "}
              <Notation>{"1"}</Notation> — начало <Notation>{"10"}</Notation>.
              Свободное место есть, но оно разделено между ветвями{" "}
              <Notation>{"01"}</Notation> и <Notation>{"11"}</Notation>, целой
              свободной половины нет.
            </li>
          </ul>
          <Typography.Text>
            Поэтому{" "}
            <strong>
              при заданных кодовых словах дерево остаётся главным инструментом
            </strong>
            . Полезный вывод для конечной таблицы, уже удовлетворяющей Фано:
            сумма равна 1 — новых кодов добавить нельзя; сумма меньше 1 —
            свободная ветвь существует, и при достаточно длинных кодах можно
            добавить любое конечное число букв.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "metod-haffmana",
      navLabel: "Метод Хаффмана",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Когда ни один код не зафиксирован, лучшее распределение строит
              метод Хаффмана.
            </strong>{" "}
            Это ещё одно дополнение. Оно помогает понять связь частот и формы
            дерева, но его нельзя механически применять к задачам с уже
            заданными кодовыми словами.
          </Typography.Text>
          <Typography.Text>
            <strong>Метод Хаффмана</strong> строит префиксный код с минимальной
            взвешенной суммой длин, когда известны частоты и все коды можно
            выбирать свободно. Идея: две буквы с наименьшими частотами
            объединяются в одну временную группу, частота группы равна сумме
            частот этих букв. Потом действие повторяется для оставшихся букв и
            групп. Пусть частоты А — 8, Б — 4, В — 2, Г — 1:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.codeHuffman8421}
            label={"Метод Хаффмана для частот 8, 4, 2, 1: шаг за шагом"}
          />
          <Typography.Text>
            Объединяем Г и В (1 + 2 = 3), затем полученную группу и Б (3 + 4 =
            7), затем её и А (7 + 8 = 15). Раскрывая группы обратно, при каждом
            разделении назначаем одной ветви <Notation>{"0"}</Notation>, другой{" "}
            <Notation>{"1"}</Notation>. Получается А —{" "}
            <Notation>{"0"}</Notation>, Б — <Notation>{"10"}</Notation>, В —{" "}
            <Notation>{"110"}</Notation>, Г — <Notation>{"111"}</Notation>, и
            длина сообщения 8 · 1 + 4 · 2 + 2 · 3 + 1 · 3 = 8 + 8 + 6 + 3 ={" "}
            <strong>25</strong>.
          </Typography.Text>
          <ProofDisclosure summary="Почему объединяют самые редкие буквы">
            <Typography.Text>
              В дереве самые глубокие соседние листья имеют одинаковую длину и
              отличаются последним знаком. Если на эти длинные места поставить
              две наименее частые буквы, результат не ухудшится: перенос более
              частой буквы на более короткое место выгоден.
            </Typography.Text>
            <Typography.Text>
              После объединения двух соседних листьев в одну группу задача
              становится меньше. Раскрытие этой группы впоследствии добавит по
              одному знаку обоим кодам.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Но в задании 4 часто заранее закреплены конкретные пути, например А
            — <Notation>{"001"}</Notation>. Обычный метод Хаффмана может
            построить другое соответствие и нарушить условие.{" "}
            <strong>
              В таких задачах нужно оптимизировать размещение внутри оставшихся
              свободных ветвей
            </strong>{" "}
            — как в подтемах 3–5.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zapis-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Повторы букв в записи дают равные фрагменты; длины находят
                    из равенства для общей длины и проверяют условием Фано.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Если известна только длина записи, уравнение на длины
                    дополняют проверкой места для остальных букв.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Нарушение условия Фано не всегда означает неоднозначность:
                    обратное условие запрещает совпадение с концом.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Неравенство Крафта сравнивает размеры, а не сами коды; при
                    заданных кодах главный инструмент — дерево.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Метод Хаффмана объединяет самые редкие буквы и годится,
                    когда ни один код не задан.
                  </>
                ),
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
            label: "без доказательства",
            value: <>найден один допустимый вариант и объявлен минимальным</>,
            note: <>есть ли доказательство, что меньше нельзя</>,
          },
          {
            label: "частой — кратчайший",
            value: <>самой частой букве сразу отдан кратчайший код</>,
            note: <>не выгоднее ли разделить эту ветвь</>,
          },
          {
            label: "совместимость",
            value: (
              <>при подсчёте вариантов требуется их взаимная совместимость</>
            ),
            note: (
              <>
                это альтернативы для одной буквы или одновременно назначаемые
                коды?
              </>
            ),
          },
          {
            label: "предел длины",
            value: <>оставлена одна ветвь при ограничении длины</>,
            note: <>сколько букв она вмещает до предельной глубины</>,
          },
          {
            label: "два минимума",
            value: <>перепутаны два последовательных минимума</>,
            note: (
              <>сначала выполняется основное требование, затем дополнительное</>
            ),
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
        подтему, а ниже схемы каждый шаг разобран подробнее.
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
            note: "места для неизвестных букв и резерв, доказательство минимума",
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
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="forma-dereva"
              >
                Форма дерева
              </SubtopicLink>
            ),
            rows: [
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
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="podschet-i-velichiny"
              >
                Другие величины
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>варианты кода</>, note: <>2ᴰ⁻ᵈ в ветви длины d</> },
              { key: <>предел длины D</>, note: <>ветвь вмещает 2ᴰ⁻ᵈ букв</> },
              {
                key: <>два требования</>,
                note: <>второе — среди решений первого</>,
              },
              {
                key: (
                  <>
                    <Notation>{"oct(int(s, 2))"}</Notation>
                  </>
                ),
                note: <>запись слова в восьмеричной</>,
              },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink
                routeSlug="4-kodirovanie-i-uslovie-fano"
                subtopic="kod-po-zapisi"
              >
                Код по записи и теория
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>повторы букв</>, note: <>равные фрагменты записи</> },
              {
                key: <>обратное условие</>,
                note: <>запрет на конец, чтение справа</>,
              },
              { key: <>Крафт</>, note: <>сумма 1/2ˡ ≤ 1</> },
              { key: <>Хаффман</>, note: <>объединять самые редкие</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к готовому ответу",
            steps: [
              <>Все ли буквы алфавита получили место?</>,
              <>Та ли величина: код, длина, сумма, произведение?</>,
              <>Доказано ли, что короче нельзя?</>,
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
          Для любой новой задачи можно использовать один порядок рассуждений.
        </strong>
      </Typography.Text>
      <ol>
        <li>
          <strong>Выпиши весь алфавит.</strong> Именно все разрешённые буквы, а
          не только буквы передаваемого слова.
        </li>
        <li>
          <strong>Отметь заданные коды.</strong> Их нельзя менять или
          переставлять между буквами.
        </li>
        <li>
          <strong>Уточни требование.</strong> Начало или конец другого кода?
          Есть ли ограничение длины? Требуется ли возможность закодировать
          дополнительные буквы?
        </li>
        <li>
          <strong>Запиши, что минимизируется или подсчитывается.</strong> Код
          одной буквы, сумма длин, длина сообщения, произведение, количество
          вариантов.
        </li>
        <li>
          <strong>Построй занятую часть дерева и найди свободные ветви.</strong>
        </li>
        <li>
          <strong>Если дано сообщение, подсчитай частоты букв.</strong> Отдельно
          вычисли вклад букв с фиксированными кодами.
        </li>
        <li>
          <strong>Рассмотри размещение неизвестных букв.</strong> Проверь, какие
          свободные вершины можно занять сразу, а какие придётся разделить.
        </li>
        <li>
          <strong>Проверь завершимость таблицы.</strong> Для всех оставшихся
          букв должны существовать коды.
        </li>
        <li>
          <strong>Обоснуй минимум.</strong> Объясни, почему более короткие
          варианты невозможны, или сравни все существенные формы дерева.
        </li>
        <li>
          <strong>Проверь формат ответа.</strong> Код, длина кода, общая длина
          сообщения и числовое значение — разные ответы.
        </li>
      </ol>
    </>
  ),
  status: "published",
});
