import { CodeBlock } from "~/shared/components/code-block";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  CodeRunner,
  LessonDiagram,
  LessonSummary,
  LessonTable,
  LessonTabs,
  ProofDisclosure,
  TokenSet,
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { networksLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./networks.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const THEME_TASK = (
  <>
    «Сеть задана IP-адресом одного из входящих в неё узлов 172.20.77.140 и
    маской сети 255.255.252.0. Найди наибольший IP-адрес этой сети, который
    может быть назначен компьютеру. В ответе запиши сумму значений его октетов.»
  </>
);

export const networksLesson = defineLesson({
  ...networksLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Записывать IP-адрес и маску 32 битами и переводить маску в длину префикса и обратно",
    "Находить адрес сети, широковещательный адрес и адреса компьютеров вручную и модулем ipaddress",
    "Считать количество адресов, номер узла и подбирать маску под число компьютеров",
    "Находить все подходящие маски по адресу сети или по двум узлам",
    "Считать адреса сети с условием на двоичную запись",
    "Для редких задач — маска по условию на биты и подсчёт сочетаниями (дополнительный урок)",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "adres-i-maska",
      title: "IP-адрес и маска",
      lead: "Задача темы, IP-адрес как 32 бита, октет в двоичной записи, маска и длина префикса, допустимые маски.",
      conceptIds: [
        "kak-ustroena-tema-10",
        "32-bita",
        "maska",
        "dopustimye-maski",
        "adres-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Запиши октет 20 восемью битами.</>,
          reveal: (
            <>
              <Notation>{"00010100"}</Notation>: 20 = 16 + 4, нули слева
              сохраняют позиции.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Переведи октет <Notation>{"11001000"}</Notation> в число.
            </>
          ),
          reveal: <>200 = 128 + 64 + 8.</>,
        },
        {
          id: "zadacha-3",
          prompt: <>Запиши маску /20 четырьмя октетами.</>,
          reveal: (
            <>
              <Notation>{"255.255.240.0"}</Notation>: 16 единиц — два октета
              255, ещё 4 единицы — 11110000 = 240.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Может ли октет маски быть равен 250?</>,
          reveal: (
            <>
              Нет: 250 = <Notation>{"11111010"}</Notation>, после нуля снова
              единица.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Сколько битов части узла у маски{" "}
              <Notation>{"255.255.255.224"}</Notation>?
            </>
          ),
          reveal: (
            <>5: 224 = 11100000, единиц 8 + 8 + 8 + 3 = 27, нулей 32 − 27.</>
          ),
        },
      ],
    },
    {
      slug: "adres-seti",
      title: "Адрес сети и границы сети",
      lead: "Поразрядное «И», размер блока, адрес сети и широковещательный адрес, адреса компьютеров и форма ответа — ответ задачи темы.",
      conceptIds: [
        "adres-seti-i",
        "razmer-bloka",
        "granicy-seti",
        "forma-otveta",
        "seti-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Чему равно 173 И 192 (поразрядное «И»)?</>,
          reveal: (
            <>
              128: 10101101 И 11000000 = 10000000 — сохраняются только два
              старших бита.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Найди адрес сети для узла 10.8.45.200 и маски 255.255.255.224.</>
          ),
          reveal: (
            <>
              10.8.45.192: блок 256 − 224 = 32, ближайшее кратное 32, не большее
              200, — 192.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Найди широковещательный адрес сети узла 192.168.5.77 с маской /27.
            </>
          ),
          reveal: (
            <>
              192.168.5.95: блок 32, сеть начинается с 64, последний адрес — 64
              + 32 − 1 = 95.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Может ли адрес 172.20.77.0 быть адресом компьютера в сети задачи
              темы?
            </>
          ),
          reveal: (
            <>
              Да: часть узла — десять битов, и у 172.20.77.0 они не все нули.
              Адрес сети — только 172.20.76.0.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>Запиши наименьший адрес компьютера сети задачи темы без точек.</>
          ),
          reveal: <>17220761 — это адрес 172.20.76.1.</>,
        },
      ],
    },
    {
      slug: "kolichestvo-i-nomer-uzla",
      title: "Количество адресов и номер узла",
      lead: "2ʰ адресов и 2ʰ − 2 адресов компьютеров, сеть под число компьютеров, номер узла I − N и адрес по номеру.",
      conceptIds: [
        "kolichestvo",
        "set-pod-kompyutery",
        "nomer-uzla",
        "kolichestvo-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Сколько всего адресов в сети с маской /19?</>,
          reveal: <>8192: свободных битов 32 − 19 = 13, 2¹³ = 8192.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Сколько адресов можно назначить компьютерам в сети с маской
              255.255.255.240?
            </>
          ),
          reveal: <>14: свободных битов 4, 2⁴ − 2 = 14.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Какая самая маленькая сеть вместит 200 компьютеров? Назови длину
              префикса.
            </>
          ),
          reveal: (
            <>/24: 2⁷ − 2 = 126 мало, 2⁸ − 2 = 254 достаточно, p = 32 − 8.</>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Какой номер у узла 192.168.10.173 в сети с маской /26?</>,
          reveal: (
            <>
              45: адрес сети 192.168.10.128, номер — расстояние от него: 173 −
              128.
            </>
          ),
        },
      ],
    },
    {
      slug: "maska-po-adresu-seti",
      title: "Неизвестная маска",
      lead: "Маска по адресу узла и адресу сети — все длины L ≤ p ≤ C; два узла в одной или в разных сетях; узел на краю сети.",
      conceptIds: ["maska-po-bitam", "vse-maski", "dva-uzla", "maska-itogo"],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Бит узла равен 1, а тот же бит адреса сети — 0. Каким должен быть
              бит маски?
            </>
          ),
          reveal: <>0: единицу адреса нужно обнулить.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              И бит узла, и бит адреса сети равны 0. Что можно сказать о бите
              маски?
            </>
          ),
          reveal: <>Ничего: «И» с нулём даёт ноль при любом бите маски.</>,
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Для узла 74.219.187.66 адрес сети 74.219.176.0. Чему равен третий
              байт маски?
            </>
          ),
          reveal: (
            <>
              240: 187 = 10111011, 176 = 10110000 — четвёртый бит сохранил
              единицу, пятый её потерял, поэтому маска 11110000.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Узлы 10.30.52.1 и 10.30.55.250 при общей маске. При какой самой
              длинной маске они ещё в одной сети?
            </>
          ),
          reveal: (
            <>
              /22: 52 = 00110100 и 55 = 00110111 совпадают в шести битах, 16 + 6
              = 22.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему узлы 172.20.72.0 и 172.20.79.200 не могут быть в общей сети
              /21, хотя их первые 21 бит совпадают?
            </>
          ),
          reveal: (
            <>
              При /21 адрес 172.20.72.0 — сам адрес сети, а его компьютеру не
              назначают. Самая длинная общая маска — /20.
            </>
          ),
        },
      ],
    },
    {
      slug: "dvoichnaya-zapis-adresov",
      title: "Адреса с условием на двоичную запись",
      lead: "Фиксированные и свободные биты, число единиц, чётность и кратность, специальные адреса, часть адреса, наименьший и наибольший подходящий адрес.",
      conceptIds: [
        "fiksirovannye-bity",
        "chetnost-i-kratnost",
        "chast-adresa",
        "krajnij-adres",
        "zapis-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>Сколько единиц в сетевой части каждого адреса сети 10.0.0.0/28?</>
          ),
          reveal: (
            <>2: в 10 = 00001010 две единицы, остальные сетевые биты — нули.</>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Какое наибольшее число единиц может быть в адресе компьютера сети
              10.0.0.0/24?
            </>
          ),
          reveal: (
            <>
              9: сетевая часть даёт 2 единицы, свободных битов 8, но адрес из
              всех единиц — широковещательный: 2 + 8 − 1.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              В сети 16 адресов. Сколько из них имеют чётное число единиц в
              двоичной записи?
            </>
          ),
          reveal: (
            <>
              8 — ровно половина: варианты свободных битов разбиваются на пары,
              отличающиеся последним битом.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Число 3 нечётное. А число единиц в его двоичной записи?</>,
          reveal: (
            <>
              Чётное: 3 = 11₂, две единицы. Чётность числа и чётность числа
              единиц — разные свойства.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Какие символы строки <Notation>{"bits"}</Notation> из 32 битов
              адреса берёт срез <Notation>{"bits[16:24]"}</Notation>?
            </>
          ),
          reveal: <>Третий октет: символы с индексами 16–23.</>,
        },
      ],
    },
    {
      slug: "maska-po-usloviyu",
      title: "Маска по условию и сочетания",
      lead: "Для продвинутых: число адресов как выбор позиций единиц, подсчёт формулой вместо перебора, маска по условию на биты адреса сети или номера узла.",
      level: "advanced",
      conceptIds: [
        "vybor-pozicij",
        "podschet-formuloj",
        "maska-po-usloviyu-bit",
        "usloviya-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: <>Сколькими способами можно выбрать 2 позиции из 5?</>,
          reveal: <>10: 5 · 4 / 2.</>,
        },
        {
          id: "zadacha-2",
          prompt: (
            <>Сколько адресов сети 10.0.0.0/27 содержат ровно 4 единицы?</>
          ),
          reveal: (
            <>
              10: в сетевой части 2 единицы, в 5 свободных битах нужно ещё 2 —
              C(5, 2) = 10.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              В сетевой части 9 единиц, свободных битов 10. Сколько адресов
              содержат ровно 8 единиц?
            </>
          ),
          reveal: <>0: единиц уже больше, чем нужно.</>,
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Почему адреса сети /8 с условием на число единиц считают формулой,
              а не перебором?
            </>
          ),
          reveal: (
            <>
              В ней 2²⁴ = 16 777 216 адресов: перебор займёт заметное время, а
              формула C(h, k − c) считается сразу.
            </>
          ),
        },
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-10",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            Типичное условие задания 10: {THEME_TASK}
          </Typography.Text>
          <Typography.Text>
            <strong>
              Задание 10 решают так: адрес и маску записывают битами, маска
              делит адрес на часть сети и часть узла, а дальше отвечают на
              вопрос — адрес сети, края сети, количество адресов или сама маска.
            </strong>{" "}
            Вручную считают только нужный октет, программа на Python делает то
            же стандартным модулем <Notation>{"ipaddress"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Через всю тему проходит одна сеть — узел 172.20.77.140 с маской
            255.255.252.0. В этой подтеме — биты и маска, в подтеме 2 — адрес
            сети, края сети и ответ задачи: 525, в подтеме 3 — количество
            адресов и номер узла, в подтеме 4 — как найти маску, если её не
            дали, в подтеме 5 — адреса с условием на двоичную запись.
          </Typography.Text>
          <Typography.Text>
            Каждый приём показан двумя способами — вручную и программой. Выбирай
            способ во вкладках: на экзамене годится любой, а ручной удобно
            использовать для проверки программы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "32-bita",
      navLabel: "32 бита",
      explanation: (
        <>
          <Typography.Text>
            Что на самом деле записано в 172.20.77.140?
          </Typography.Text>
          <Typography.Text>
            <strong>
              IP-адрес — 32 бита: четыре октета по восемь битов, каждый октет
              записан десятичным числом от 0 до 255.
            </strong>{" "}
            Бит — одна двоичная цифра, 0 или 1; октет (байт) — восемь битов.
            Точки только разделяют октеты.
          </Typography.Text>
          <Typography.Text>
            Позиции октета справа налево стоят 1, 2, 4, 8, 16, 32, 64, 128.
            Единица в позиции добавляет её значение к числу:
          </Typography.Text>
          <LessonTable
            label={"Октет 140 по позициям"}
            columns={[
              { label: "Позиция" },
              { label: "128", numeric: true },
              { label: "64", numeric: true },
              { label: "32", numeric: true },
              { label: "16", numeric: true },
              { label: "8", numeric: true },
              { label: "4", numeric: true },
              { label: "2", numeric: true },
              { label: "1", numeric: true },
            ]}
            rows={[["Бит", "1", "0", "0", "0", "1", "1", "0", "0"]]}
          />
          <Typography.Text>
            10001100₂ = 128 + 8 + 4 = 140. Октет всегда записывают ровно восемью
            битами: 20 = 10100₂, но внутри адреса это{" "}
            <Notation>{"00010100"}</Notation> — нули слева сохраняют позиции.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <>
                    <Typography.Text>
                      Значения позиций проверяют от большего к меньшему: в 140
                      помещается 128 — пишем 1, остаётся 12; 64, 32 и 16 не
                      помещаются — три нуля; 8 помещается — 1, остаётся 4; 4
                      помещается — 1, остаётся 0; дальше нули. Получаем{" "}
                      <Notation>{"10001100"}</Notation>.
                    </Typography.Text>
                    <LessonTable
                      label={"Адрес 172.20.77.140 по октетам"}
                      columns={[
                        { label: "Октет", numeric: true },
                        { label: "Биты" },
                      ]}
                      rows={[
                        ["172", <Notation key="a">{"10101100"}</Notation>],
                        ["20", <Notation key="b">{"00010100"}</Notation>],
                        ["77", <Notation key="c">{"01001101"}</Notation>],
                        ["140", <Notation key="d">{"10001100"}</Notation>],
                      ]}
                    />
                  </>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Тот же перебор позиций делают{" "}
                      <PythonTerm term="intdiv">// и %</PythonTerm>: частное —
                      очередной бит, остаток — что осталось. Пройди по шагам:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runOctet}
                      label={"Октет 140 в двоичную запись по шагам"}
                    />
                    <Typography.Text>
                      Весь адрес сразу даёт стандартный модуль{" "}
                      <PythonTerm term="import">
                        <Notation>{"ipaddress"}</Notation>
                      </PythonTerm>
                      : <Notation>{"ip_address"}</Notation> превращает строку в
                      адрес, запись <Notation>{"f'{address:b}'"}</Notation> (
                      <PythonTerm term="fstring">f-строка</PythonTerm>) — в 32
                      бита с нулями слева, а{" "}
                      <Notation>{"int(address)"}</Notation> — в одно целое
                      число:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from ipaddress import ip_address\naddress = ip_address('172.20.77.140')\nprint(f'{address:b}')\nprint(int(address))"
                      }
                      label={"Адрес как 32 бита"}
                      language="python"
                      output={"10101100000101000100110110001100\n2887011724"}
                    />
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: 255 и 256, bin">
            <Typography.Text>
              Наибольший октет — 11111111₂ = 255, а значений у октета 256: от 0
              до 255, 2⁸ вариантов. Не путай наибольшее значение с количеством.
            </Typography.Text>
            <Typography.Text>
              Функция <PythonTerm term="base">bin</PythonTerm> возвращает{" "}
              <Notation>{"'0b10100'"}</Notation> — с приставкой и без нулей
              слева. Считать по ней нули адреса нельзя: их часть потеряна.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "maska",
      navLabel: "Маска",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Маска — тоже 32 бита: сначала единицы, потом нули. Единицы
              отмечают часть сети, нули — часть узла.
            </strong>{" "}
            Часть сети одинакова у всех адресов сети, часть узла различает
            компьютеры внутри неё.
          </Typography.Text>
          <Typography.Text>
            В маске 255.255.252.0 два октета 255 — 16 единиц, 252 ={" "}
            <Notation>{"11111100"}</Notation> — ещё 6 единиц и 2 нуля, в
            последнем октете 8 нулей. Всего 22 единицы: первые 22 бита адреса —
            сеть, последние 10 — узел. Граница проходит внутри третьего октета,
            а не по точке:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipBits1722077140_22}
            caption={
              <>
                Адрес 172.20.77.140 и маска /22 по битам: граница проходит после
                шестого бита третьего октета. Часть узла — два последних бита
                третьего октета и весь четвёртый, 10 бит.
              </>
            }
          />
          <Typography.Text>
            Маску коротко записывают числом единиц: 255.255.252.0 — это{" "}
            <Notation>{"/22"}</Notation>. Обозначим p — длину префикса (число
            единиц маски), h — число битов части узла: p + h = 32, у{" "}
            <Notation>{"/22"}</Notation> h = 10.
          </Typography.Text>
          <Typography.Text>
            Единица маски не требует единицы в адресе: она говорит только, что
            этот бит — сетевой и одинаков у всех адресов сети. Сам бит может
            быть и нулём, и единицей — у 77 сетевые биты третьего октета{" "}
            <Notation>{"010011"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dopustimye-maski",
      navLabel: "Допустимые маски",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              У маски единицы идут подряд слева, поэтому октет маски бывает
              только девяти видов, и смешанный октет в маске один.
            </strong>{" "}
            Перед ним — октеты 255, после него — октеты 0.
          </Typography.Text>
          <LessonTable
            label={"Возможные октеты маски"}
            columns={[
              { label: "Единиц", numeric: true },
              { label: "Биты" },
              { label: "Октет", numeric: true },
            ]}
            rows={[
              ["0", <Notation key="0">{"00000000"}</Notation>, "0"],
              ["1", <Notation key="1">{"10000000"}</Notation>, "128"],
              ["2", <Notation key="2">{"11000000"}</Notation>, "192"],
              ["3", <Notation key="3">{"11100000"}</Notation>, "224"],
              ["4", <Notation key="4">{"11110000"}</Notation>, "240"],
              ["5", <Notation key="5">{"11111000"}</Notation>, "248"],
              ["6", <Notation key="6">{"11111100"}</Notation>, "252"],
              ["7", <Notation key="7">{"11111110"}</Notation>, "254"],
              ["8", <Notation key="8">{"11111111"}</Notation>, "255"],
            ]}
          />
          <Typography.Text>
            Таблицу легко восстановить: 128, 128 + 64 = 192, 192 + 32 = 224 и
            так далее. Число 250 = <Notation>{"11111010"}</Notation> в маске
            невозможно — после нуля снова единица. Маска{" "}
            <Notation>{"255.0.255.0"}</Notation> тоже невозможна.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Маску <Notation>{"/20"}</Notation> строят слева: 16 единиц —
                    два октета 255, оставшиеся 4 единицы —{" "}
                    <Notation>{"11110000"}</Notation> = 240, последний октет 0.
                    Получаем 255.255.240.0. Обратно: 255.255.252.0 — 8 + 8 + 6 =
                    22 единицы.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      <Notation>{"ip_network"}</Notation> строит сеть по записи
                      «адрес/маска», свойство <Notation>{"netmask"}</Notation> —
                      её маска четырьмя октетами. Адрес 0.0.0.0 здесь только
                      заготовка:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from ipaddress import ip_network\nfor p in [20, 22, 24, 26]:\n    print(p, ip_network(f'0.0.0.0/{p}').netmask)"
                      }
                      label={"Маски по длине префикса"}
                      language="python"
                      output={
                        "20 255.255.240.0\n22 255.255.252.0\n24 255.255.255.0\n26 255.255.255.192"
                      }
                    />
                    <Typography.Text>
                      Допустимость маски проверяют по 32 битам: «после нуля
                      снова единица» — это{" "}
                      <PythonTerm term="in">
                        <Notation>{"'01' in bits"}</Notation>
                      </PythonTerm>
                      :
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from ipaddress import ip_address\nfor mask in ['255.255.252.0', '255.255.250.0']:\n    bits = f'{ip_address(mask):b}'\n    print(mask, '01' not in bits)"
                      }
                      label={"Допустима ли маска"}
                      language="python"
                      output={"255.255.252.0 True\n255.255.250.0 False"}
                    />
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "adres-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "IP-адрес",
                note: <>32 бита, четыре октета от 0 до 255</>,
              },
              {
                key: "Октет",
                note: <>ровно 8 битов, нули слева сохраняют позиции</>,
              },
              {
                key: "Маска",
                note: <>единицы — сеть, нули — узел; сначала единицы</>,
              },
              { key: "/p", note: <>p единиц маски, h = 32 − p битов узла</> },
              {
                key: "Python",
                note: (
                  <>
                    <Notation>{"f'{address:b}'"}</Notation>,{" "}
                    <Notation>{"ip_network(…).netmask"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "adres-seti-i",
      navLabel: "Адрес сети",
      explanation: (
        <>
          <Typography.Text>
            Какой адрес сети у узла 172.20.77.140 с маской 255.255.252.0?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Адрес сети — поразрядное «И» адреса и маски: под единицами маски
              биты адреса сохраняются, под нулями становятся нулями.
            </strong>{" "}
            «Поразрядное» — отдельно в каждой позиции, «И» (конъюнкция) даёт 1,
            только если оба бита — единицы.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipAnd1722077140_22}
            caption={
              <>
                Поразрядное «И» адреса 172.20.77.140 и маски /22: под единицами
                маски биты адреса сохраняются, под нулями становятся нулями.
                Получается адрес сети 172.20.76.0.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Октеты маски 255 сохраняют октеты адреса: 172 и 20. Октет 0
                    обнуляет: четвёртый октет сети — 0. Считать нужно только
                    смешанный октет: 77 = <Notation>{"01001101"}</Notation>, 252
                    = <Notation>{"11111100"}</Notation>, «И» —{" "}
                    <Notation>{"01001100"}</Notation> = 76. Адрес сети —
                    172.20.76.0.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Поразрядное «И» в Python —{" "}
                      <PythonTerm term="bitand">
                        <Notation>{"&"}</Notation>
                      </PythonTerm>
                      . Октет за октетом:
                    </Typography.Text>
                    <CodeBlock
                      code={"print(172 & 255, 20 & 255, 77 & 252, 140 & 0)"}
                      label={"«И» по октетам"}
                      language="python"
                      output={"172 20 76 0"}
                    />
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Адрес сети не обязан заканчиваться на <Notation>{".0"}</Notation>: у
            узла 192.168.10.173 с маской /26 адрес сети 192.168.10.128. Нулями
            заполнена вся часть узла, а сколько её битов — решает маска.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razmer-bloka",
      navLabel: "Размер блока",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Быстрая ручная проверка: смешанный октет маски m делит значения
              этого октета адреса на блоки по 256 − m.
            </strong>{" "}
            Октет сети — начало блока, в котором лежит октет адреса.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipBlocks252_77}
            caption={
              <>
                Октет маски 252 делит значения третьего октета на блоки по 4.
                Число 77 лежит в блоке 76–79: начало блока — ближайшее кратное
                4, не большее 77.
              </>
            }
          />
          <ol>
            <li>Найди первый слева октет маски, меньший 255: здесь 252.</li>
            <li>Размер блока d = 256 − 252 = 4.</li>
            <li>
              Начало блока — ближайшее кратное d, не большее октета адреса: 77 =
              19 · 4 + 1, начало 76, конец 79.
            </li>
            <li>
              Октеты правее в адресе сети — 0, в широковещательном адресе — 255.
            </li>
          </ol>
          <ProofDisclosure summary="Почему размер блока равен 256 − m">
            <Typography.Text>
              Если в октете маски r нулей, то m = 256 − 2ʳ: например, 252 = 256
              − 4. Значит, 256 − m = 2ʳ — ровно столько значений у свободной
              части этого октета.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "granicy-seti",
      navLabel: "Границы сети",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сеть — все адреса от адреса сети (часть узла — нули) до
              широковещательного адреса (часть узла — единицы). Эти два адреса
              компьютерам не назначают.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В нашей сети часть узла — десять битов. Все нули — 172.20.76.0, все
            единицы — 172.20.79.255. Компьютерам достаются адреса между ними:
            наименьший 172.20.76.1, наибольший 172.20.79.254. Ответ задачи темы
            — сумма октетов: 172 + 20 + 79 + 254 = <strong>525</strong>.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Блок третьего октета — 76–79. Широковещательный адрес: конец
                    блока 79 и 255 в последнем октете. Наибольший адрес
                    компьютера — на единицу меньше: 172.20.79.254.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      <Notation>{"ip_network"}</Notation> со{" "}
                      <Notation>{"strict=False"}</Notation> строит сеть по
                      адресу узла: адрес узла не обязан быть адресом сети.
                      Свойства <Notation>{"network_address"}</Notation> и{" "}
                      <Notation>{"broadcast_address"}</Notation> — края сети, к
                      адресу можно прибавить или вычесть число. Сумму октетов
                      даёт <PythonTerm term="split">split('.')</PythonTerm>,
                      адрес без точек —{" "}
                      <PythonTerm term="strmeth">replace</PythonTerm>:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from ipaddress import ip_network\nnet = ip_network('172.20.77.140/255.255.252.0', strict=False)\nprint(net.network_address, net.broadcast_address)\nlast = net.broadcast_address - 1\nprint(last, sum(int(x) for x in str(last).split('.')))\nprint(str(last).replace('.', ''))"
                      }
                      label={"Решение задачи темы"}
                      language="python"
                      output={
                        "172.20.76.0 172.20.79.255\n172.20.79.254 525\n1722079254"
                      }
                    />
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Адреса на <Notation>{".0"}</Notation> и{" "}
            <Notation>{".255"}</Notation> не обязательно особые: в нашей сети
            172.20.77.0 и 172.20.76.255 — обычные адреса компьютеров. Особый
            адрес — тот, у которого вся часть узла из нулей или из единиц, а не
            только последний октет.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: strict и сети /31, /32"
          >
            <Typography.Text>
              Без <Notation>{"strict=False"}</Notation> функция{" "}
              <Notation>{"ip_network"}</Notation> требует, чтобы ей дали именно
              адрес сети, и для 172.20.77.140 остановится с ошибкой. Но если по
              условию нужно проверить, что запись — адрес сети, ошибка как раз
              полезна: <Notation>{"strict=False"}</Notation> молча исправил бы
              запись.
            </Typography.Text>
            <Typography.Text>
              Правило «два адреса не назначают» относится к обычным сетям: в
              сети /31 оба адреса — узлы, в /32 адрес один.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "forma-otveta",
      navLabel: "Форма ответа",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Найденный адрес записывают в той форме, которую требует условие.
            </strong>{" "}
            Выбери форму, чтобы увидеть ответ для адреса 172.20.79.254:
          </Typography.Text>
          <VariantPicker
            label={"Форма ответа"}
            variants={[
              { label: "сумма октетов", value: <>525</> },
              {
                label: "без точек",
                value: <Notation>{"1722079254"}</Notation>,
              },
              {
                label: "буквы по таблице",
                value: <>буква каждого октета слева направо</>,
                note: <>сначала найди числовой адрес, потом замени октеты</>,
              },
              { label: "один октет", value: <>третий октет — 79</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "seti-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Адрес сети",
                note: <>адрес И маска; считать только смешанный октет</>,
              },
              { key: "Блок", note: <>d = 256 − m; начало — кратное d</> },
              {
                key: "Края сети",
                note: <>часть узла из нулей и из единиц</>,
              },
              {
                key: "Компьютеры",
                note: (
                  <>
                    <Notation>{"network_address + 1"}</Notation> …{" "}
                    <Notation>{"broadcast_address - 1"}</Notation>
                  </>
                ),
              },
              { key: "Ответ", note: <>сумма октетов, без точек или буквами</> },
            ]}
          />
        </>
      ),
    },
    {
      id: "kolichestvo",
      navLabel: "Количество адресов",
      explanation: (
        <>
          <Typography.Text>
            Сколько адресов в сети задачи темы и сколько из них можно назначить
            компьютерам?
          </Typography.Text>
          <Typography.Text>
            <strong>
              h свободных битов дают 2ʰ адресов; без адреса сети и
              широковещательного — 2ʰ − 2.
            </strong>{" "}
            Каждый свободный бит — 0 или 1, и каждый новый бит удваивает число
            вариантов. В нашей сети h = 10: 2¹⁰ = 1024 адреса, компьютерам —
            1022.
          </Typography.Text>
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Проверка через октеты: третий октет пробегает четыре
                    значения 76–79, при каждом последний октет — 256 значений: 4
                    · 256 = 1024. Каждая лишняя единица маски уменьшает сеть
                    вдвое: /23 — 512 адресов, /24 — 256.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "from ipaddress import ip_network\nfor p in [22, 23, 24]:\n    net = ip_network(f'172.20.77.140/{p}', strict=False)\n    print(p, 32 - p, net.num_addresses, net.num_addresses - 2)"
                    }
                    label={"Количество адресов по длине префикса"}
                    language="python"
                    output={"22 10 1024 1022\n23 9 512 510\n24 8 256 254"}
                  />
                ),
              },
            ]}
          />
          <Typography.Text>
            Вычитать два можно только из всех адресов сети. Если адреса считают
            по дополнительному условию, специальные адреса проверяют отдельно
            (подтема 5).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "set-pod-kompyutery",
      navLabel: "Сеть под компьютеры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Маску под число компьютеров подбирают по наименьшему h, при
              котором 2ʰ − 2 не меньше нужного.
            </strong>{" "}
            Для 1000 компьютеров: 2⁹ − 2 = 510 мало, 2¹⁰ − 2 = 1022 хватает.
            Значит, h = 10, p = 22 — маска нашей сети. В сети ровно 1000 адресов
            быть не может: размер сети — всегда степень двойки.
          </Typography.Text>
          <Typography.Text>
            Программа увеличивает h, пока адресов ещё мало (
            <PythonTerm term="while">цикл while</PythonTerm>):
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runHosts}
            label={"Подбор сети на 1000 компьютеров по шагам"}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: деление на подсети">
            <Typography.Text>
              Сеть /24 делят на подсети /26: граница сдвигается на 2 бита, 2² =
              4 подсети по 2⁶ = 64 адреса, 4 · 64 = 256. Из числа подсетей два
              не вычитают — «минус два» относится к адресам внутри сети.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "nomer-uzla",
      navLabel: "Номер узла",
      explanation: (
        <>
          <Typography.Text>
            Какой порядковый номер у компьютера 172.20.77.140 в его сети?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Номер узла — его расстояние от адреса сети: номер = I − N.
            </strong>{" "}
            У адреса сети номер 0, у следующего — 1 и так далее. I и N — адреса
            узла и сети как целые числа.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipGrid1722077140_22}
            caption={
              <>
                Сеть 172.20.76.0/22 — четыре строки по 256 адресов. Адрес
                172.20.77.140 стоит во второй строке: перед ним одна полная
                строка и ещё 140 адресов, поэтому его номер 256 + 140 = 396.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    (77 − 76) · 256 + 140 = 396: между соседними значениями
                    третьего октета последний проходит все 256 значений.
                    Обратно: узел с номером 650 = 2 · 256 + 138 — это
                    172.20.78.138.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <CodeBlock
                    code={
                      "from ipaddress import ip_address, ip_network\naddress = ip_address('172.20.77.140')\nnet = ip_network('172.20.77.140/22', strict=False)\nprint(int(address) - int(net.network_address))\nprint(net.network_address + 650)"
                    }
                    label={"Номер узла и адрес по номеру"}
                    language="python"
                    output={"396\n172.20.78.138"}
                  />
                ),
              },
            ]}
          />
          <Typography.Text>
            Единицу здесь не добавляют: номер — расстояние, а не количество
            адресов от начала до узла.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kolichestvo-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Все адреса", note: <>2ʰ, h = 32 − p</> },
              {
                key: "Компьютеры",
                note: <>2ʰ − 2: без адреса сети и широковещательного</>,
              },
              {
                key: "Под N компьютеров",
                note: <>наименьшее h с 2ʰ − 2 ≥ N</>,
              },
              {
                key: "Номер узла",
                note: (
                  <>
                    I − N;{" "}
                    <Notation>
                      {"int(address) - int(net.network_address)"}
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
      id: "maska-po-bitam",
      navLabel: "Маска по адресу сети",
      explanation: (
        <>
          <Typography.Text>
            Обратная задача: известны узел 172.20.77.140 и адрес его сети
            172.20.76.0, а маска — нет. Какой она может быть?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Маску восстанавливают по битам: где единица адреса сохранилась, в
              маске 1, где пропала — 0, а совпавшие нули маску не определяют.
            </strong>{" "}
            Это то же равенство «адрес сети = адрес И маска», только неизвестна
            маска:
          </Typography.Text>
          <LessonTable
            label={"Бит адреса, бит адреса сети и бит маски"}
            columns={[
              { label: "Адрес", numeric: true },
              { label: "Сеть", numeric: true },
              { label: "Бит маски" },
            ]}
            rows={[
              ["1", "1", "только 1 — единицу надо сохранить"],
              ["1", "0", "только 0 — единицу надо обнулить"],
              ["0", "0", "0 или 1 — «И» с нулём всегда 0"],
              ["0", "1", "невозможно — «И» не делает из нуля единицу"],
            ]}
          />
          <Typography.Text>
            Первые два октета совпадают, сравниваем третий: 77 ={" "}
            <Notation>{"01001101"}</Notation>, 76 ={" "}
            <Notation>{"01001100"}</Notation>. Шестой бит — единица в обоих:
            маска должна дойти хотя бы до него, это 16 + 6 = 22 единицы. Восьмой
            бит — 1 у адреса и 0 у сети: здесь в маске ноль. Седьмой бит — ноль
            в обоих, он может быть и сетевым, и узловым.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipPair1722077140_17220760}
            caption={
              <>
                Адрес 172.20.77.140 и адрес сети 172.20.76.0 по битам. Бит в
                рамке — ноль и там, и там, поэтому граница маски может стоять до
                него или после: подходят /22 и /23.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "vse-maski",
      navLabel: "Все подходящие маски",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Подходящие длины маски образуют отрезок L ≤ p ≤ C: L — позиция
              последней единицы адреса сети, C — сколько первых битов адреса и
              адреса сети совпадают.
            </strong>{" "}
            У нас L = 22, C = 23: маски /22 (третий байт 252) и /23 (254). Какую
            из них назвать, решает вопрос задачи. Выбери вопрос:
          </Typography.Text>
          <VariantPicker
            label={"Вопрос о маске и ответ для 172.20.77.140 и 172.20.76.0"}
            variants={[
              {
                label: "наименьший третий байт",
                value: <>252</>,
                note: <>самая короткая маска /22</>,
              },
              {
                label: "наибольший третий байт",
                value: <>254</>,
                note: <>самая длинная маска /23</>,
              },
              { label: "больше всего единиц", value: <>23</> },
              { label: "меньше всего нулей", value: <>9</> },
              {
                label: "больше всего адресов",
                value: <>1024</>,
                note: (
                  <>самая короткая маска оставляет больше свободных битов</>
                ),
              },
              { label: "сколько масок", value: <>2</> },
            ]}
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Найди первый октет, где адрес и сеть различаются, запиши оба
                    октета битами. L — до последней единицы сети включительно, C
                    — до первого различия. Совпадение целых октетов ещё не
                    значит 255 в маске: 192 И 192 = 192 при октете маски 192.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Длин маски всего 33 — от 0 до 32, поэтому программа
                      перебирает их все (<PythonTerm term="for">for</PythonTerm>
                      ) и оставляет те, где адрес сети совпал с заданным (
                      <PythonTerm term="eq">==</PythonTerm>). Пройди по шагам
                      длины от 21 до 24:
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runMasks}
                      label={"Подходящие длины маски по шагам"}
                    />
                    <CodeBlock
                      code={
                        "from ipaddress import ip_address, ip_network\nexpected = ip_address('172.20.76.0')\nfound = []\nfor p in range(33):\n    net = ip_network(f'172.20.77.140/{p}', strict=False)\n    if net.network_address == expected:\n        found.append(p)\nprint(found)\nprint(ip_network(f'0.0.0.0/{min(found)}').netmask)"
                      }
                      label={"Все подходящие маски"}
                      language="python"
                      output={"[22, 23]\n255.255.252.0"}
                    />
                    <Typography.Text>
                      Ответ берут из списка:{" "}
                      <PythonTerm term="agg">
                        <Notation>{"min"}</Notation> и{" "}
                        <Notation>{"max"}</Notation>
                      </PythonTerm>{" "}
                      — длины, <Notation>{"32 - p"}</Notation> — нули,{" "}
                      <Notation>{"len"}</Notation> — сколько масок. Октет маски
                      — <Notation>{"str(mask).split('.')[2]"}</Notation> (
                      <PythonTerm term="listindex">индекс</PythonTerm> 2 —
                      третья часть).
                    </Typography.Text>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dva-uzla",
      navLabel: "Два узла",
      explanation: (
        <>
          <Typography.Text>
            Узлы 172.20.77.140 и 172.20.79.200 находятся в одной сети. Какая у
            неё самая длинная маска?
          </Typography.Text>
          <Typography.Text>
            <strong>
              При общей маске два адреса в одной сети, пока граница маски не
              заходит дальше их совпадающих начальных битов.
            </strong>{" "}
            Третьи октеты: 77 = <Notation>{"01001101"}</Notation>, 79 ={" "}
            <Notation>{"01001111"}</Notation> — совпадают первые шесть битов,
            всего C = 16 + 6 = 22. При p ≤ 22 сети одинаковы, при p ≥ 23 —
            разные.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipPair1722077140_1722079200_two}
            caption={
              <>
                Адреса 172.20.77.140 и 172.20.79.200 по битам: первые 22 бита
                одинаковы, 23-й различается. Пока граница маски левее черты,
                сетевые части совпадают.
              </>
            }
          />
          <LessonTabs
            label={"Способ"}
            tabs={[
              {
                label: "Вручную",
                content: (
                  <Typography.Text>
                    Самая длинная общая маска — /22, это и есть маска задачи
                    темы. Самая короткая маска, при которой узлы уже в разных
                    сетях, — /23. Дальше первого различия сравнивать не нужно:
                    сетевая часть уже разная.
                  </Typography.Text>
                ),
              },
              {
                label: "Python",
                content: (
                  <>
                    <Typography.Text>
                      Строим обе сети для каждой длины и сравниваем их:
                    </Typography.Text>
                    <CodeBlock
                      code={
                        "from ipaddress import ip_network\nsame = []\nfor p in range(33):\n    a = ip_network(f'172.20.77.140/{p}', strict=False)\n    b = ip_network(f'172.20.79.200/{p}', strict=False)\n    if a == b:\n        same.append(p)\nprint(max(same))"
                      }
                      label={"Самая длинная общая маска"}
                      language="python"
                      output={"22"}
                    />
                    <Typography.Text>
                      Для разных сетей ищут первую длину, где сети различаются,
                      и останавливают цикл (
                      <PythonTerm term="break">break</PythonTerm>):
                    </Typography.Text>
                    <CodeRunner
                      {...lessonMedia.runDiffer}
                      label={"Первая маска разных сетей по шагам"}
                    />
                  </>
                ),
              },
            ]}
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: узел на краю сети">
            <Typography.Text>
              Узел не может совпадать с адресом сети или широковещательным
              адресом, поэтому самая длинная маска иногда на бит короче C. У
              узлов 172.20.72.0 и 172.20.79.200 совпадают 21 бит, но при /21
              адрес 172.20.72.0 — сам адрес сети:
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.ipBits17220720_21}
              caption={
                <>
                  Узел 172.20.72.0 и маска /21: все 11 битов его части узла —
                  нули. При такой маске он и есть адрес сети, поэтому компьютеру
                  этот адрес не назначают.
                </>
              }
            />
            <Typography.Text>
              Поэтому программа проверяет и края сети (
              <PythonTerm term="tuple">кортеж</PythonTerm>{" "}
              <Notation>{"ends"}</Notation>,{" "}
              <PythonTerm term="in">
                <Notation>{"in"}</Notation>
              </PythonTerm>
              ):
            </Typography.Text>
            <CodeBlock
              code={
                "from ipaddress import ip_address, ip_network\na = ip_address('172.20.72.0')\nb = ip_address('172.20.79.200')\nbest = 0\nfor p in range(33):\n    net = ip_network(f'{a}/{p}', strict=False)\n    ends = (net.network_address, net.broadcast_address)\n    if b in net and a not in ends and b not in ends:\n        best = p\nprint(best)"
              }
              label={"Самая длинная маска с проверкой краёв"}
              language="python"
              output={"20"}
            />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "maska-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "По битам",
                note: <>1 сохранилась — 1; пропала — 0; два нуля — любой</>,
              },
              {
                key: "L ≤ p ≤ C",
                note: <>от последней единицы сети до первого различия</>,
              },
              {
                key: "Перебор",
                note: (
                  <>
                    33 длины;{" "}
                    <Notation>
                      {"ip_network(f'{ip}/{p}', strict=False)"}
                    </Notation>
                  </>
                ),
              },
              {
                key: "Два узла",
                note: <>одна сеть при p ≤ C, разные — при p {">"} C</>,
              },
              {
                key: "Края",
                note: (
                  <>узел не может быть адресом сети или широковещательным</>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "fiksirovannye-bity",
      navLabel: "Фиксированные биты",
      explanation: (
        <>
          <Typography.Text>
            Сколько адресов сети задачи темы содержат в двоичной записи ровно 12
            единиц?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сетевые биты одинаковы у всех адресов сети: их единицы считают
              один раз, а меняются только свободные биты.
            </strong>{" "}
            В сетевой части нашей сети 172 = <Notation>{"10101100"}</Notation> —
            4 единицы, 20 = <Notation>{"00010100"}</Notation> — 2, сетевые биты
            третьего октета <Notation>{"010011"}</Notation> — 3. Всего 9 единиц
            у каждого адреса.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.ipBits17220760_22_False_True}
            caption={
              <>
                Сеть 172.20.76.0/22: 22 фиксированных бита дают каждому адресу
                одни и те же 9 единиц, а десять свободных битов (знаки вопроса)
                меняются от адреса к адресу.
              </>
            }
          />
          <Typography.Text>
            Значит, для 12 единиц в десяти свободных битах нужно ровно 3
            единицы. Посчитать такие адреса проще всего перебором сети: цикл{" "}
            <Notation>{"for address in net"}</Notation> выдаёт все её адреса по
            порядку, включая оба края, а <Notation>{"count('1')"}</Notation> (
            <PythonTerm term="strmeth">метод строки</PythonTerm>) считает
            единицы:
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_network\nnet = ip_network('172.20.77.140/22', strict=False)\ncount = 0\nfor address in net:\n    if f'{address:b}'.count('1') == 12:\n        count += 1\nprint(count)"
            }
            label={"Адреса с 12 единицами"}
            language="python"
            output={"120"}
          />
          <Typography.Text>
            Число 120 — это число способов выбрать 3 позиции из 10; как его
            посчитать без перебора, разбирает дополнительный урок. Важно: 22
            сетевых бита не значат 22 единицы — среди фиксированных битов есть и
            нули.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetnost-i-kratnost",
      navLabel: "Чётность и кратность",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если считают только адреса компьютеров, каждый из двух специальных
              адресов проверяют по условию — вычитать два автоматически нельзя.
            </strong>{" "}
            В нашей сети адрес сети содержит 9 единиц — число, кратное 3, а
            широковещательный — 9 + 10 = 19, не кратное. Адресов с числом
            единиц, кратным 3, всего 341; среди адресов компьютеров — на один
            меньше, а не на два. Перебор только адресов компьютеров даёт{" "}
            <Notation>{"net.hosts()"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_network\nnet = ip_network('172.20.77.140/22', strict=False)\nevery = [a for a in net if f'{a:b}'.count('1') % 3 == 0]\nhosts = [a for a in net.hosts() if f'{a:b}'.count('1') % 3 == 0]\nprint(len(every), len(hosts))\nprint(f'{net.network_address:b}'.count('1'))"
            }
            label={"Кратно 3: все адреса и адреса компьютеров"}
            language="python"
            output={"341 340\n9"}
          />
          <Typography.Text>
            Кратность проверяют остатком (
            <PythonTerm term="intdiv">%</PythonTerm>): «кратно 3» —{" "}
            <Notation>{"% 3 == 0"}</Notation>, «чётно» —{" "}
            <Notation>{"% 2 == 0"}</Notation>. Для чётности есть короткое
            рассуждение: при хотя бы одном свободном бите ровно половина адресов
            имеет чётное число единиц — в нашей сети 512 из 1024.
          </Typography.Text>
          <ProofDisclosure summary="Почему ровно половина">
            <Typography.Text>
              Разобьём варианты свободных битов на пары, отличающиеся только
              последним битом: в паре число единиц k и k + 1, одно чётное,
              другое нет. На маленькой сети с четырьмя свободными битами и семью
              единицами в сетевой части:
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.ipPairs4_7}
              caption={
                <>
                  Все 16 вариантов четырёх свободных битов парами, отличающимися
                  последним битом. Рядом — число единиц всего адреса (7
                  фиксированных плюс свободные): в каждой паре одно чётное и
                  одно нечётное, всего 8 чётных.
                </>
              }
            />
          </ProofDisclosure>
          <Typography.Text>
            Не путай чётность адреса и чётность числа единиц: 3 = 11₂ — число
            нечётное, а единиц в нём две.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chast-adresa",
      navLabel: "Часть адреса",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие на часть адреса проверяют на части строки из 32 битов —
              срезе.
            </strong>{" "}
            <PythonTerm term="slice">Срез</PythonTerm>{" "}
            <Notation>{"bits[:16]"}</Notation> — первые два октета,{" "}
            <Notation>{"bits[16:]"}</Notation> — последние два,{" "}
            <Notation>{"bits[16:24]"}</Notation> — третий октет. Выбери условие,
            чтобы увидеть проверку:
          </Typography.Text>
          <VariantPicker
            label={"Условие и проверка строки bits"}
            variants={[
              {
                label: "ровно 12 единиц",
                value: <Notation>{"bits.count('1') == 12"}</Notation>,
              },
              {
                label: "число единиц кратно 3",
                value: <Notation>{"bits.count('1') % 3 == 0"}</Notation>,
              },
              {
                label: "нулей больше, чем единиц",
                value: (
                  <Notation>{"bits.count('0') > bits.count('1')"}</Notation>
                ),
              },
              {
                label: "две последние цифры 11",
                value: <Notation>{"bits[-2:] == '11'"}</Notation>,
              },
              {
                label: "в третьем октете единиц столько же, сколько нулей",
                value: (
                  <Notation>
                    {"bits[16:24].count('1') == bits[16:24].count('0')"}
                  </Notation>
                ),
              },
            ]}
          />
          <Typography.Text>
            Например, в скольких адресах нашей сети в первых двух октетах единиц
            больше, чем в последних двух?
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_network\nnet = ip_network('172.20.77.140/22', strict=False)\ncount = 0\nfor address in net:\n    bits = f'{address:b}'\n    if bits[:16].count('1') > bits[16:].count('1'):\n        count += 1\nprint(count)"
            }
            label={"Единицы слева и справа"}
            language="python"
            output={"56"}
          />
          <Typography.Text>
            Проверка рассуждением: слева у всех 6 единиц, справа 3 фиксированные
            плюс s свободных. Нужно 3 + s {"<"} 6, то есть в десяти свободных
            битах не больше двух единиц: 1 + 10 + 45 = 56.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "krajnij-adres",
      navLabel: "Наименьший и наибольший",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Наименьший подходящий адрес — первый в переборе по порядку, после
              него цикл останавливают; для наибольшего значения перебор идёт до
              конца и обновляет лучший результат.
            </strong>{" "}
            Найдём наименьший адрес компьютера нашей сети с 12 единицами:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runFirst}
            label={"Наименьший адрес с 12 единицами по шагам"}
          />
          <Typography.Text>
            Наибольшая сумма октетов среди таких адресов ищется до конца сети (
            <PythonTerm term="agg">max</PythonTerm>):
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_network\nnet = ip_network('172.20.77.140/22', strict=False)\nbest = 0\nfor address in net.hosts():\n    if f'{address:b}'.count('1') == 12:\n        octets = str(address).split('.')\n        best = max(best, sum(int(x) for x in octets))\nprint(best)"
            }
            label={"Наибольшая сумма октетов"}
            language="python"
            output={"492"}
          />
          <Typography.Text>
            Это 172.20.76.224, а не адрес из конца сети: у 79 в третьем октете
            уже 5 единиц, и на последний октет остаётся одна. Самый большой
            адрес и самая большая сумма октетов — разные вопросы.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: размер перебора и неизвестная маска"
          >
            <Typography.Text>
              Перебор сети /22 — 1024 адреса, /16 — 65 536, /12 — около
              миллиона: это ещё секунды. Сеть /8 — 16 миллионов адресов, её
              считают формулой (дополнительный урок).
            </Typography.Text>
            <Typography.Text>
              Если маска не дана, сначала выбирают крайнюю допустимую маску
              (подтема 4). Наименьшее количество подходящих адресов — в самой
              маленькой сети (наибольшее p), наибольшее — в самой большой
              (наименьшее p): меньшая сеть целиком лежит внутри большей.
            </Typography.Text>
          </ProofDisclosure>
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
                key: "Фиксированные",
                note: <>единицы сетевой части — у всех адресов одни</>,
              },
              {
                key: "Перебор",
                note: (
                  <>
                    <Notation>{"for address in net"}</Notation>,{" "}
                    <Notation>{"f'{address:b}'.count('1')"}</Notation>
                  </>
                ),
              },
              {
                key: "Компьютеры",
                note: (
                  <>
                    <Notation>{"net.hosts()"}</Notation>; края проверить, а не
                    вычесть два
                  </>
                ),
              },
              { key: "Часть адреса", note: <>срезы bits[:16], bits[16:24]</> },
              {
                key: "Крайний адрес",
                note: <>наименьший — break, наибольший — max до конца</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "vybor-pozicij",
      navLabel: "Выбор позиций",
      explanation: (
        <>
          <Typography.Text>
            <strong>Дополнительный урок — для продвинутых.</strong> В нём
            задачи, где маску задаёт условие на биты, а сеть так велика, что
            адреса считают формулой; на экзаменах такие задачи пока не
            встречались.
          </Typography.Text>
          <Typography.Text>
            Почему в сети задачи темы ровно 120 адресов с 12 единицами?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Адресов с нужным числом единиц столько, сколько способов выбрать
              позиции для единиц среди свободных битов.
            </strong>{" "}
            Это число сочетаний C(h, r): выбрать r позиций из h. Небольшой
            пример — 2 единицы в 4 свободных битах: первую позицию выбирают
            четырьмя способами, вторую — тремя, и каждая пара посчитана дважды:
            4 · 3 / 2 = 6. Выбери набор:
          </Typography.Text>
          <VariantPicker
            label={"Две позиции единиц из четырёх"}
            variants={[
              {
                label: "0011",
                value: <TokenSet values={[1, 2, 3, 4]} selected={[3, 4]} />,
              },
              {
                label: "0101",
                value: <TokenSet values={[1, 2, 3, 4]} selected={[2, 4]} />,
              },
              {
                label: "0110",
                value: <TokenSet values={[1, 2, 3, 4]} selected={[2, 3]} />,
              },
              {
                label: "1001",
                value: <TokenSet values={[1, 2, 3, 4]} selected={[1, 4]} />,
              },
              {
                label: "1010",
                value: <TokenSet values={[1, 2, 3, 4]} selected={[1, 3]} />,
              },
              {
                label: "1100",
                value: <TokenSet values={[1, 2, 3, 4]} selected={[1, 2]} />,
              },
            ]}
          />
          <Typography.Text>
            В нашей сети 3 позиции из 10: 10 · 9 · 8 / (3 · 2 · 1) = 120. В
            Python число сочетаний считает{" "}
            <PythonTerm term="comb">
              <Notation>{"comb"}</Notation>
            </PythonTerm>{" "}
            из модуля <Notation>{"math"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "from math import comb\nprint(comb(10, 3), 10 * 9 * 8 // 6)\nprint(comb(4, 0), comb(4, 5))"
            }
            label={"Число сочетаний"}
            language="python"
            output={"120 120\n1 0"}
          />
          <ProofDisclosure summary="Формула числа сочетаний">
            <Typography.Text>
              C(h, r) = h! / (r! · (h − r)!), где n! = 1 · 2 · … · n, а 0! = 1:
              выбрать ни одной позиции можно одним способом. Если нужно r
              позиций, а их больше, чем h, способов нет — 0.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "podschet-formuloj",
      navLabel: "Подсчёт формулой",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если в сетевой части c единиц, а свободных битов h, адресов с k
              единицами — C(h, k − c), а при k {"<"} c — ноль.
            </strong>{" "}
            Функция (<PythonTerm term="def">def</PythonTerm>) заменяет перебор
            адресов сети:
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_network\nfrom math import comb\n\ndef count_ones(net, k):\n    c = f'{net.network_address:b}'.count('1')\n    h = 32 - net.prefixlen\n    if k < c:\n        return 0\n    return comb(h, k - c)\n\nprint(count_ones(ip_network('172.20.76.0/22'), 12))\nprint(count_ones(ip_network('10.0.0.0/8'), 20))"
            }
            label={"Подсчёт без перебора"}
            language="python"
            output={"120\n134596"}
          />
          <Typography.Text>
            В сети 10.0.0.0/8 — 16 777 216 адресов, а ответ C(24, 18) = 134 596
            получается сразу: в сетевой части две единицы, в 24 свободных битах
            нужно 18.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "maska-po-usloviyu-bit",
      navLabel: "Маска по условию",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если маску задаёт условие на биты, программа проверяет его для
              каждой из 33 длин префикса.
            </strong>{" "}
            Пусть в адресе сети узла 25.140.77.201 единиц столько же, сколько
            нулей в маске. Сколько адресов этой сети содержат ровно 12 единиц?
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_network\nfor p in range(33):\n    net = ip_network(f'25.140.77.201/{p}', strict=False)\n    c = f'{net.network_address:b}'.count('1')\n    if c == 32 - p:\n        print(net, c, count_ones(net, 12))"
            }
            label={"Маска по условию на единицы"}
            language="python"
            output={"25.140.76.0/23 9 84"}
          />
          <Typography.Text>
            Подходит одна маска /23: в адресе сети девять единиц, в маске девять
            нулей; нужно ещё 3 единицы в 9 свободных битах — C(9, 3) = 84. Если
            подходят несколько масок, ответ выбирают среди них, как в подтеме 4.
          </Typography.Text>
          <Typography.Text>
            Условие бывает и на номер узла (подтема 3): номер с c единицами
            среди h битов можно выбрать C(h, c) способами.
          </Typography.Text>
          <CodeBlock
            code={
              "from ipaddress import ip_address, ip_network\nfrom math import comb\na = ip_address('129.0.5.96')\nbest = 0\nfor p in range(33):\n    net = ip_network(f'{a}/{p}', strict=False)\n    c = f'{net.network_address:b}'.count('1')\n    number = int(a) - int(net.network_address)\n    if c == f'{number:b}'.count('1'):\n        print(p, c, comb(32 - p, c))\n        best = max(best, comb(32 - p, c))\nprint(best)"
            }
            label={"Условие на номер узла"}
            language="python"
            output={"22 3 120\n23 3 84\n120"}
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: второй узел по описанию"
          >
            <Typography.Text>
              «В сети узла 61.200.37.5 есть узел, у которого первый байт
              совпадает с четвёртым, а второй — с третьим». При маске длиннее 15
              битов первые два байта у всех адресов сети — 61 и 200, значит, это
              узел 61.200.200.61. Дальше — задача о двух узлах: 37 и 200
              различаются уже в первом бите третьего байта, C = 16.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "usloviya-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              { key: "Сочетания", note: <>C(h, r) — r позиций из h</> },
              { key: "Подсчёт", note: <>C(h, k − c); при k {"<"} c — 0</> },
              {
                key: "comb",
                note: (
                  <>
                    <Notation>{"from math import comb"}</Notation>
                  </>
                ),
              },
              {
                key: "Маска по условию",
                note: <>проверить все 33 длины, ответ выбрать среди них</>,
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
        <strong>
          Найденный ответ подставляют обратно: адрес сети должен получиться из
          адреса узла и маски, узел — лежать между краями сети, маска — не иметь
          единиц после нуля.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "три октета",
            value: <>считают, что сеть — всегда первые три октета</>,
            note: <>число сетевых битов задаёт маска</>,
          },
          {
            label: "/22",
            value: <>в /22 свободны 22 бита</>,
            note: <>свободны 32 − 22 = 10</>,
          },
          {
            label: ".0 и .255",
            value: <>любой адрес на .0 — адрес сети</>,
            note: <>нулями должна быть вся часть узла</>,
          },
          {
            label: "минус два",
            value: <>после любого подсчёта вычли два</>,
            note: <>проверь, подходят ли края сети под условие</>,
          },
          {
            label: "совпавшие нули",
            value: <>совпали биты — поставили в маске 1</>,
            note: <>два нуля маску не определяют: L ≤ p ≤ C</>,
          },
          {
            label: "первая маска",
            value: <>ответили первой найденной маской</>,
            note: <>вопрос решает: min, max или количество</>,
          },
          {
            label: "узел — край сети",
            value: <>взяли маску, при которой узел стал адресом сети</>,
            note: <>проверь края сети при самой длинной маске</>,
          },
          {
            label: "номер узла",
            value: <>прибавили единицу к номеру</>,
            note: <>номер — расстояние I − N, у адреса сети номер 0</>,
          },
          {
            label: "bin",
            value: <>считали нули по bin(x)</>,
            note: (
              <>
                нужны все 32 бита: <Notation>{"f'{address:b}'"}</Notation>
              </>
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
          Любая задача задания 10 сводится к одной границе — длине маски p: её
          дают в условии или ищут, а дальше сеть строится вручную по нужному
          октету или программой с модулем ipaddress.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 10 на одной схеме"}
        flow={[
          { name: "Граница", note: "длина маски p: дана или её ищут" },
          { name: "Сеть", note: "ip_network(f'{ip}/{p}', strict=False)" },
          { name: "Вопрос", note: "края, количество, маска или биты адресов" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="10-ip-adresa-i-maski"
                subtopic="adres-i-maska"
              >
                IP-адрес и маска
              </SubtopicLink>
            ),
            rows: [
              { key: <>32 бита</>, note: <>4 октета по 8 битов</> },
              { key: <>/p</>, note: <>p единиц маски, h = 32 − p</> },
              {
                key: <>октеты маски</>,
                note: <>0, 128, 192, …, 252, 254, 255</>,
              },
              {
                key: <Notation>{"f'{address:b}'"}</Notation>,
                note: <>32 бита адреса</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="10-ip-adresa-i-maski"
                subtopic="adres-seti"
              >
                Адрес сети и границы
              </SubtopicLink>
            ),
            rows: [
              { key: <>адрес И маска</>, note: <>адрес сети</> },
              { key: <>256 − m</>, note: <>размер блока</> },
              {
                key: <Notation>{"broadcast_address - 1"}</Notation>,
                note: <>наибольший адрес компьютера</>,
              },
              { key: <>форма</>, note: <>сумма октетов, без точек, буквы</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="10-ip-adresa-i-maski"
                subtopic="kolichestvo-i-nomer-uzla"
              >
                Количество и номер
              </SubtopicLink>
            ),
            rows: [
              { key: <>2ʰ и 2ʰ − 2</>, note: <>все адреса и компьютеры</> },
              { key: <>I − N</>, note: <>номер узла</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="10-ip-adresa-i-maski"
                subtopic="maska-po-adresu-seti"
              >
                Неизвестная маска
              </SubtopicLink>
            ),
            rows: [
              { key: <>L ≤ p ≤ C</>, note: <>маски по адресу сети</> },
              { key: <>p ≤ C</>, note: <>два узла в одной сети</> },
              { key: <>края</>, note: <>узел не адрес сети</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="10-ip-adresa-i-maski"
                subtopic="dvoichnaya-zapis-adresov"
              >
                Двоичная запись
              </SubtopicLink>
            ),
            rows: [
              { key: <>фиксированные</>, note: <>единицы сети — у всех</> },
              {
                key: <Notation>{"net.hosts()"}</Notation>,
                note: <>только компьютеры</>,
              },
              { key: <>срезы</>, note: <>часть адреса</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="10-ip-adresa-i-maski"
                subtopic="maska-po-usloviyu"
              >
                Маска по условию
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>C(h, k − c)</>, note: <>адреса с k единицами</> },
              { key: <>33 длины</>, note: <>проверить условие на каждой</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к ответу",
            steps: [
              <>Что спрашивают: адрес, количество, маску или биты?</>,
              <>Нужны все адреса сети или только адреса компьютеров?</>,
              <>В какой форме записать ответ?</>,
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
    </>
  ),
  status: "published",
});
