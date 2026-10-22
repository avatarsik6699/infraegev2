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
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import { preobrazovanieZapiseyChiselLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./preobrazovanie-zapisey-chisel.media";
import { PythonTerm } from "./python-term";
import { SubtopicLink } from "./subtopic-link";

const R = "5-preobrazovanie-zapisey-chisel";

export const preobrazovanieZapiseyChiselLesson = defineLesson({
  ...preobrazovanieZapiseyChiselLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Различать число и его запись, переводить число в любую систему делением и на Python",
    "Выполнять действия с записью: дописывание, срезы и замены, инверсию, сумму цифр",
    "Решать задание программой-перебором: проверка на примере, фильтр, наименьшее N и наименьшее R",
    "Решать от результата: проверять, может ли запись R получиться у алгоритма",
  ],
  accessTier: "free",
  subtopics: [
    {
      slug: "chislo-i-zapis",
      title: "Число и его запись",
      lead: "Число и его запись, перевод в другую систему делением и на Python.",
      conceptIds: [
        "kak-ustroena-tema",
        "chislo-i-zapis",
        "mesto-cifry",
        "perevod-deleniem",
        "dlina-zapisi",
        "chislo-i-stroka",
        "gotovye-funkcii",
        "svoya-funkciya",
        "zapis-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Может ли <Notation>{"1203"}</Notation> быть троичной записью? А
              четверичной? Если может, какое число она обозначает?
            </>
          ),
          reveal: (
            <>
              Троичной — нет: цифра 3 недопустима. Четверичной — да: 1203₄ = 64
              + 2 · 16 + 0 + 3 = 99.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: <>Переведи 23 в двоичную систему делением.</>,
          reveal: (
            <>
              23 → остатки 1, 1, 1, 0, 1, справа налево:{" "}
              <Notation>{"10111"}</Notation>. Проверка: 16 + 4 + 2 + 1 = 23.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Чем отличаются <Notation>{"int('101')"}</Notation> и{" "}
              <Notation>{"int('101', 2)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Первое читает строку как десятичную запись — 101, второе как
              двоичную — 5.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Сколько чисел имеют четырёхзначную двоичную запись?</>,
          reveal: (
            <>
              8: от <Notation>{"1000"}</Notation> = 8 до{" "}
              <Notation>{"1111"}</Notation> = 15.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему в функции <Notation>{"to_base"}</Notation> цифру ставят
              слева: <Notation>{"s = str(digit) + s"}</Notation>?
            </>
          ),
          reveal: (
            <>
              Деление находит цифры с конца: первой — последнюю. Каждая
              следующая найденная цифра стоит левее уже найденных.
            </>
          ),
        },
      ],
    },
    {
      slug: "dopisyvanie",
      title: "Дописывание цифр",
      lead: "Что происходит с числом, когда к его записи дописывают цифры справа или слева.",
      conceptIds: [
        "dopisyvanie-sprava",
        "sdvig-razryadov",
        "neskolko-cifr",
        "dopisyvanie-sleva",
        "soedinenie-strok",
        "blok-po-usloviyu",
        "rezultat-vychisleniya",
        "dopisyvanie-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              К записи 11 = <Notation>{"1011"}</Notation> дописали справа 0,
              затем 1. Чему равно R?
            </>
          ),
          reveal: (
            <>
              45: <Notation>{"1011"}</Notation> → <Notation>{"10110"}</Notation>{" "}
              = 22 → <Notation>{"101101"}</Notation> = 45 — число удвоилось,
              потом удвоилось и выросло на 1.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Почему <Notation>{"s + str(2 * 4)"}</Notation> не годится, если к
              двоичной записи нужно дописать двоичную запись произведения?
            </>
          ),
          reveal: (
            <>
              <Notation>{"str(8)"}</Notation> даёт десятичное{" "}
              <Notation>{"'8'"}</Notation>, а нужна двоичная запись{" "}
              <Notation>{"1000"}</Notation>:{" "}
              <Notation>{"s + bin(2 * 4)[2:]"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              К записи 13 = <Notation>{"1101"}</Notation> дописали слева 1. Чему
              равно R?
            </>
          ),
          reveal: (
            <>
              29: <Notation>{"11101"}</Notation> — новая единица встала над
              четырьмя разрядами, её вес 16, и 16 + 13 = 29.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Блоки <Notation>{"1"}</Notation> и <Notation>{"001"}</Notation>{" "}
              имеют одно значение. Дают ли они одинаковое R?
            </>
          ),
          reveal: (
            <>
              Нет: <Notation>{"001"}</Notation> сдвигает старые цифры на три
              разряда, а <Notation>{"1"}</Notation> — на один. Для N = 11
              получится 89 и 23.
            </>
          ),
        },
      ],
    },
    {
      slug: "chasti-zapisi",
      title: "Срезы, замены и сумма цифр",
      lead: "Как брать части записи, менять и переставлять цифры, переворачивать запись и считать сумму цифр.",
      conceptIds: [
        "zamena-cifr",
        "indeksy-i-srezy",
        "sborka-iz-srezov",
        "perevernut-i-invertirovat",
        "odni-edinicy",
        "odnovremennaya-zamena",
        "vedushchie-nuli",
        "poslednyaya-cifra",
        "kakaya-zapis",
        "povtornyj-shag",
        "desyatichnaya-zapis",
        "chasti-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Для <Notation>{"s = '1101001'"}</Notation> запиши{" "}
              <Notation>{"s[2:5]"}</Notation>, <Notation>{"s[-3:]"}</Notation> и{" "}
              <Notation>{"s[::-1]"}</Notation>.
            </>
          ),
          reveal: (
            <>
              <Notation>{"'010'"}</Notation>, <Notation>{"'001'"}</Notation> и{" "}
              <Notation>{"'1001011'"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Что вернёт{" "}
              <Notation>
                {"'1100'.replace('0', '1').replace('1', '0')"}
              </Notation>{" "}
              и почему это не инверсия?
            </>
          ),
          reveal: (
            <>
              <Notation>{"'0000'"}</Notation>: первая замена делает все цифры
              единицами, вторая — все нулями.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Для N = 9 определи чётность самого числа и чётность количества
              единиц в двоичной записи.
            </>
          ),
          reveal: (
            <>
              Число нечётное, а единиц чётное количество: 9 = 1001₂, единиц две.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Инвертируй пятизначную запись <Notation>{"10011"}</Notation>.
              Какое число получится?
            </>
          ),
          reveal: (
            <>
              12: <Notation>{"01100"}</Notation> = 8 + 4. Проверка: 19 + 12 = 31
              = <Notation>{"11111"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Для N = 12 = <Notation>{"1100"}</Notation> дважды подряд допиши
              справа остаток от деления суммы цифр текущей записи на 2. Чему
              равно R?
            </>
          ),
          reveal: (
            <>
              48: единиц две — дописываем 0, <Notation>{"11000"}</Notation>;
              единиц снова две — ещё 0, <Notation>{"110000"}</Notation> = 48.
            </>
          ),
        },
      ],
    },
    {
      slug: "poisk-otveta",
      title: "Решение перебором",
      lead: "Программа перебором для задачи темы: что ищем, где остановиться и какие границы взять.",
      conceptIds: [
        "shablon-perebora",
        "vopros-poiska",
        "ostanovka-perebora",
        "granicy-perebora",
        "dve-proverki",
        "zadan-rezultat",
        "troichnyj-algoritm",
        "poisk-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Шаблон напечатал для N = 5 результат 23, а по примеру из условия
              должно быть 21. Что делать дальше?
            </>
          ),
          reveal: (
            <>
              Искать ошибку в переводе алгоритма, а не переходить к фильтру:
              пока примеры не совпали, ответу программы верить нельзя.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Почему для наименьшего N можно остановиться на первом подходящем,
              а для наименьшего R — не всегда?
            </>
          ),
          reveal: (
            <>
              Все меньшие N уже проверены. Но больший N может дать меньший R,
              если ветви дописывают блоки разной длины.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Алгоритм только дописывает цифры справа. Требуется наибольшее R ≤
              200. Докуда перебирать N?
            </>
          ),
          reveal: (
            <>
              До 200: дописывание не уменьшает число, R ≥ N, поэтому при N {">"}{" "}
              200 и R {">"} 200.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Спрашивают N, при котором R минимально среди R {">"} T. Что
              хранить в программе?
            </>
          ),
          reveal: (
            <>
              Два числа: лучший найденный <Notation>{"best_r"}</Notation> и вход{" "}
              <Notation>{"best_n"}</Notation>, на котором он получен; в ответ
              идёт N.
            </>
          ),
        },
      ],
    },
    {
      slug: "ot-rezultata",
      title: "Решение от результата",
      lead: "Как решить задачу темы без перебора N — идя от результата.",
      conceptIds: ["obratnyj-hod", "ot-rezultata", "rezultat-itogo"],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Может ли алгоритм задачи темы выдать R = 157? Если да, при каком
              N?
            </>
          ),
          reveal: (
            <>
              Да: 157 = <Notation>{"100111|01"}</Notation>, хвост 01, а 100111 =
              39 — нечётное. N = 39.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: <>А R = 156?</>,
          reveal: (
            <>
              Нет: 156 = <Notation>{"100111|00"}</Notation>, хвоста 00 алгоритм
              не дописывает.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              Может ли алгоритм, дважды дописывающий остаток суммы цифр на 2,
              выдать 100?
            </>
          ),
          reveal: (
            <>
              Нет: 100 = <Notation>{"11001|00"}</Notation>, предполагаемый вход
              25 имеет три единицы и требует хвост <Notation>{"10"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: <>Почему мало увидеть, что хвост записи R подходит?</>,
          reveal: (
            <>
              Хвост выбирается по свойству N — чётности, сумме цифр. Нужно
              проверить, что оставшаяся слева часть этим свойством обладает.
            </>
          ),
        },
      ],
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            В задании 5 алгоритм берёт число, переписывает его запись —
            дописывает, переставляет или заменяет цифры — и получает новое
            число. Нужно найти вход или результат с заданным свойством. Вот
            задача, которую мы будем решать всю тему:
          </Typography.Text>
          <Typography.Text>
            «На вход алгоритма подаётся натуральное число N. Строится его
            двоичная запись; если N чётное, к ней справа дописывается{" "}
            <Notation>{"10"}</Notation>, если нечётное —{" "}
            <Notation>{"01"}</Notation>. Полученная запись — двоичная запись
            числа R. Найди наименьшее N, для которого R больше 150».
          </Typography.Text>
          <Typography.Text>
            <strong>
              Главное — различать число и его запись: алгоритм работает с
              цифрами записи, а спрашивают о числах.
            </strong>{" "}
            Сначала разберём, что сказано в условии:
          </Typography.Text>
          <LessonTable
            label={"Условие задачи темы по частям"}
            columns={[{ label: "В условии" }, { label: "Что это значит" }]}
            rows={[
              ["натуральное число N", "вход — целое число 1, 2, 3, …"],
              ["строится его двоичная запись", "N пишут нулями и единицами"],
              [
                "чётному — справа 10, нечётному — 01",
                "к записи справа приписывают две цифры",
              ],
              [
                "полученная запись — двоичная запись числа R",
                "новую запись читают как число R",
              ],
              [
                "наименьшее N, для которого R больше 150",
                "ищем самый маленький вход с таким результатом",
              ],
            ]}
          />
          <Typography.Text>
            Почти всё время будем смотреть на число 13 и его двоичную запись{" "}
            <Notation>{"1101"}</Notation>, а для троичной системы — на число 29.
            Тема состоит из пяти подтем — у каждой своя страница. Идём по ним по
            порядку:
          </Typography.Text>
          <ol>
            <li>
              <strong>Число и его запись</strong> — ты сейчас здесь.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="dopisyvanie">
                Дописывание цифр
              </SubtopicLink>{" "}
              — что происходит с числом, когда к записи приписывают цифры.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="chasti-zapisi">
                Срезы, замены и сумма цифр
              </SubtopicLink>{" "}
              — другие действия с записью.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="poisk-otveta">
                Решение перебором
              </SubtopicLink>{" "}
              — программа для задачи темы — ответ 38.
            </li>
            <li>
              <SubtopicLink routeSlug={R} subtopic="ot-rezultata">
                Решение от результата
              </SubtopicLink>{" "}
              — та же задача без перебора N.
            </li>
          </ol>
          <Typography.Text>
            Каждое действие разобрано и вручную, и в программе на Python. На
            экзамене подойдёт любой способ, а второй пригодится для проверки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-i-zapis",
      navLabel: "Число и запись",
      explanation: (
        <>
          <Typography.Text>
            <strong>Число и его запись — разные вещи.</strong> Рассмотрим 13₁₀ =
            1101₂. Здесь записано <strong>одно и то же число</strong>, но двумя
            способами: <Notation>{"13"}</Notation> — его десятичная запись,{" "}
            <Notation>{"1101"}</Notation> — его двоичная запись. Нижний индекс
            показывает систему счисления. Запись 1101₂ нужно читать как «число,
            записанное цифрами 1101 в двоичной системе».
          </Typography.Text>
          <Typography.Text>
            При переводе между системами{" "}
            <strong>значение числа не меняется</strong>. Меняется способ его
            записи.
          </Typography.Text>
          <Typography.Text>
            Но если к двоичной записи <Notation>{"1101"}</Notation> дописать
            справа <Notation>{"0"}</Notation>, получится 11010₂ = 26₁₀. Это уже
            другое число.
          </Typography.Text>
          <Typography.Text>
            Поэтому в задании полезно мысленно разделять три объекта:
          </Typography.Text>
          <LessonTable
            label={"Поэтому в задании полезно мысленно разделять три объекта"}
            columns={[
              { label: "Обозначение" },
              { label: "Что означает" },
              { label: "Пример" },
            ]}
            rows={[
              ["N", "Исходное число", "13"],
              [
                "s",
                "Запись, над которой выполняют действия",
                <>
                  <Notation>{"1101"}</Notation>
                </>,
              ],
              ["R", "Число, соответствующее итоговой записи", "Например, 26"],
            ]}
          />
          <Typography.Text>Алгоритм может выглядеть так:</Typography.Text>
          <Typography.Text>
            N = 13 → s = <Notation>{"1101"}</Notation> → s ={" "}
            <Notation>{"11010"}</Notation> → R = 26.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "mesto-cifry",
      navLabel: "Значение цифры",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В позиционной системе значение цифры зависит от её места.
            </strong>{" "}
            Начнём с привычной десятичной записи:
          </Typography.Text>
          <Typography.Text>
            347 = 3 · 100 + 4 · 10 + 7 · 1 = 3 · 10² + 4 · 10¹ + 7 · 10⁰.
          </Typography.Text>
          <Typography.Text>
            Каждое место в записи называется <strong>разрядом</strong>. Справа
            налево идут единицы, десятки, сотни, тысячи. Каждый следующий разряд
            имеет вес в десять раз больше предыдущего.
          </Typography.Text>
          <Typography.Text>
            В двоичной системе принцип такой же, но соседние разряды отличаются
            по весу в <strong>два</strong> раза: 1, 2, 4, 8, 16, 32, … В
            троичной — в <strong>три</strong> раза: 1, 3, 9, 27, 81, …
          </Typography.Text>
          <Typography.Text>
            Число, определяющее это отношение, называют{" "}
            <strong>основанием системы счисления</strong>. Дальше обозначим его
            q, чтобы не путать с исходным числом N.
          </Typography.Text>
          <Typography.Text>
            <strong>
              В системе с основанием q значение каждой цифры меньше q.
            </strong>{" "}
            В двоичной системе цифры только <Notation>{"0"}</Notation> и{" "}
            <Notation>{"1"}</Notation>, в троичной — <Notation>{"0"}</Notation>,{" "}
            <Notation>{"1"}</Notation>, <Notation>{"2"}</Notation>, в
            восьмеричной — от <Notation>{"0"}</Notation> до{" "}
            <Notation>{"7"}</Notation>. Поэтому <Notation>{"102"}</Notation> не
            может быть двоичной записью: цифра <Notation>{"2"}</Notation> в ней
            недопустима.
          </Typography.Text>
          <Typography.Text>
            Разберём число 1101₂. Под каждой цифрой — вес её разряда, ниже —
            вклад цифры в число:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.placeValue1101_2}
            caption={
              <>
                Запись 1101₂: веса разрядов справа налево 1, 2, 4, 8. Ноль
                ничего не добавляет, поэтому 1101₂ = 8 + 4 + 0 + 1 = 13.
              </>
            }
          />
          <Typography.Text>
            Для троичной записи: 1202₃ = 1 · 3³ + 2 · 3² + 0 · 3 + 2 = 27 + 18 +
            2 = 47. Для восьмеричной: 157₈ = 1 · 64 + 5 · 8 + 7 = 111.
          </Typography.Text>
          <Typography.Text>
            <strong>Отсчёт степеней начинается справа с нуля</strong>, потому
            что крайняя правая цифра показывает количество единиц: q⁰ = 1.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perevod-deleniem",
      navLabel: "Перевод делением",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перевод в другую систему через деление работает потому, что
              остаток раскрывает последнюю цифру.
            </strong>{" "}
            Возьмём десятичное число 347: 347 = 34 · 10 + 7. При делении на 10
            целая часть частного равна 34, остаток равен 7. То есть остаток даёт
            последнюю десятичную цифру, а целая часть частного — число без неё.
          </Typography.Text>
          <Typography.Text>
            Так же в любой системе: остаток от деления на основание — последняя
            цифра записи, целая часть частного — число без неё.
          </Typography.Text>
          <Typography.Text>
            Переведём 29 в троичную систему. Листай схему по шагам: каждое
            деление даёт одну цифру, и запись растёт справа налево.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.convertStepper29_3}
            label={"Перевод 29 в троичную систему делением: шаг за шагом"}
          />
          <Typography.Text>
            Остатки получены в порядке 2, 0, 0, 1. Но сначала мы нашли{" "}
            <strong>последнюю</strong> цифру, затем предпоследнюю и так далее.
            Поэтому для обычной записи нужно прочитать остатки в обратном
            порядке: 29₁₀ = 1002₃. Проверим: 1002₃ = 27 + 2 = 29.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlina-zapisi",
      navLabel: "Длина записи",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              По длине записи видно, в каких пределах лежит число.
            </strong>{" "}
            Выпишем двоичные записи чисел от 1 до 15 и сгруппируем их по длине.
            Четырёхзначные записи идут от <Notation>{"1000"}</Notation> до{" "}
            <Notation>{"1111"}</Notation>, то есть от 8 до 15. Самая маленькая
            из них — единица и нули, <Notation>{"1000"}</Notation> = 2³.
            Следующее число, 16 = <Notation>{"10000"}</Notation>, уже
            пятизначное: 2⁴.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.lengths2_4}
            caption={
              <>
                Числа от 1 до 15 по длине двоичной записи, L — количество цифр.
                Каждая группа начинается со степени двойки (1, 2, 4, 8) и
                кончается перед следующей степенью.
              </>
            }
          />
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: длина записи для любого основания"
          >
            <Typography.Text>
              Если положительное число имеет L цифр в системе с основанием q, то
              самая маленькая запись такой длины —{" "}
              <Notation>{"100…0"}</Notation>, её значение qᴸ⁻¹, а самое
              маленькое число следующей длины равно qᴸ. Поэтому{" "}
              <strong>qᴸ⁻¹ ≤ N {"<"} qᴸ</strong>.
            </Typography.Text>
            <Typography.Text>
              Например, трёхзначные троичные записи соответствуют числам 3² ≤ N{" "}
              {"<"} 3³, то есть 9 ≤ N ≤ 26.
            </Typography.Text>
            <Typography.Text>
              Это пригодится, когда алгоритм меняет первую цифру, инвертирует
              запись, дописывает цифры слева или задаёт ограничения на
              количество разрядов.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Нули в начале записи называют <strong>ведущими нулями</strong>:
            00101₂ = 101₂ = 5. Значение одинаковое, но длина текста разная. Если
            следующий шаг зависит от длины или положения символов, это различие
            может оказаться существенным.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chislo-i-stroka",
      navLabel: "Число и строка в Python",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Python удобно хранить число и его запись в разных переменных.
            </strong>{" "}
            Число <Notation>{"n = 13"}</Notation> — целое, а запись{" "}
            <Notation>{"s = '1101'"}</Notation> —{" "}
            <PythonTerm term="str">строка</PythonTerm>, то есть
            последовательность символов. Кавычки показывают, что перед нами
            текст. Сравни:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 13\ns = '1101'\nprint(13 + 1)\nprint('13' + '1')\nprint(s + '0')"
            }
            label={"Сравни"}
            language="python"
            output={"14\n131\n11010"}
          />
          <Typography.Text>
            Для чисел <Notation>{"+"}</Notation> означает сложение, для строк —
            соединение. Соединение строк также называют{" "}
            <strong>конкатенацией</strong>. Для решения задания достаточно
            понимать его как «поставить одну запись вслед за другой».
          </Typography.Text>
          <Typography.Text>
            Команда <Notation>{"s = s + '0'"}</Notation> означает: взять текущее
            содержимое <Notation>{"s"}</Notation>, дописать к нему символ{" "}
            <Notation>{"0"}</Notation> и сохранить получившуюся строку обратно в{" "}
            <Notation>{"s"}</Notation>. Знак <Notation>{"="}</Notation> в
            программе означает присваивание: сначала вычисляется правая часть,
            затем результат сохраняется в переменной слева. Проверка равенства —
            двойной знак{" "}
            <PythonTerm term="eq">
              <Notation>{"=="}</Notation>
            </PythonTerm>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "gotovye-funkcii",
      navLabel: "Готовые функции",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Готовые функции Python переводят число в запись — строку.
            </strong>{" "}
            В Python{" "}
            <PythonTerm term="base">
              <Notation>{"bin(13)"}</Notation>
            </PythonTerm>{" "}
            возвращает строку <Notation>{"'0b1101'"}</Notation>. Первые два
            символа <Notation>{"0b"}</Notation> — служебное обозначение двоичной
            записи. Они не являются её цифрами. Чтобы получить только цифры,
            берут <Notation>{"bin(13)[2:]"}</Notation> — строку начиная с
            символа с номером 2 и до конца. Номера символов и такие{" "}
            <PythonTerm term="slice">срезы</PythonTerm> подробно разберём в
            подтеме 3.
          </Typography.Text>
          <Typography.Text>
            Для восьмеричной системы есть <Notation>{"oct"}</Notation>, для
            шестнадцатеричной — <Notation>{"hex"}</Notation>. Обратное
            преобразование делает <Notation>{"int(s, q)"}</Notation>: читает
            строку <Notation>{"s"}</Notation> как запись в системе с основанием{" "}
            <Notation>{"q"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={
              "print(bin(13)[2:], oct(13)[2:], hex(31)[2:])\nprint(int('1101', 2), int('15', 8), int('1f', 16))\nprint(int('1101'))"
            }
            label={
              "Код на Python: print(bin(13)[2:], oct(13)[2:], hex(31)[2:])"
            }
            language="python"
            output={"1101 15 1f\n13 13 31\n1101"}
          />
          <Typography.Text>
            Важная тонкость: <Notation>{"int('1101')"}</Notation> даёт{" "}
            <strong>одну тысячу сто один</strong>, потому что без второго
            аргумента используется десятичная система. А{" "}
            <Notation>{"int('1101', 2)"}</Notation> даёт 13.
          </Typography.Text>
          <Typography.Text>
            Для арифметики с цифрами нужны ещё три операции: остаток от деления{" "}
            <Notation>{"n % q"}</Notation>, целая часть частного{" "}
            <Notation>{"n // q"}</Notation> и длина строки{" "}
            <Notation>{"len(s)"}</Notation>. Обычное <Notation>{"/"}</Notation>{" "}
            даёт дробь и здесь не нужно.
          </Typography.Text>
          <Typography.Text>
            Само целое число в переменной не нужно считать «хранящимся в
            десятичной записи». Число и его текстовое представление — разные
            объекты. При обычном выводе целого числа Python показывает его
            десятичную запись.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "svoya-funkciya",
      navLabel: "Своя функция перевода",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Для троичной и других систем функцию перевода пишут сами.
            </strong>{" "}
            Готовой функции для троичной записи в Python нет. Но мы уже знаем,
            как переводить руками: делить на основание и ставить остатки справа
            налево. <PythonTerm term="def">Функция</PythonTerm>{" "}
            <Notation>{"to_base"}</Notation> повторяет ровно эти действия. Её
            вызов <Notation>{"to_base(29, 3)"}</Notation> должен давать строку{" "}
            <Notation>{"'1002'"}</Notation>. Для оснований от 2 до 10 подойдёт
            такой код:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runToBase}
            label={"Для оснований от 2 до 10 подойдёт такой код"}
          />
          <Typography.Text>
            Нажми «Запуск» в шапке блока и пройди программу по шагам: справа
            видно, как меняются <Notation>{"x"}</Notation>,{" "}
            <Notation>{"digit"}</Notation> и <Notation>{"s"}</Notation>, под
            кодом — что сделала каждая строка.
          </Typography.Text>
          <Typography.Text>
            Разберём функцию по порядку. Она принимает два значения:{" "}
            <Notation>{"n"}</Notation> — переводимое неотрицательное целое
            число, <Notation>{"q"}</Notation> — основание системы.
          </Typography.Text>
          <Typography.Text>
            Если число равно нулю, результат сразу готов:{" "}
            <Notation>{"return"}</Notation> возвращает строку{" "}
            <Notation>{"'0'"}</Notation> и завершает выполнение функции. Ноль
            обрабатывается отдельно, потому что цикл ниже для него не выполнится
            ни разу.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"s = ''"}</Notation> создаёт пустую строку — в неё будем
            собирать цифры. <Notation>{"x = n"}</Notation> создаёт рабочую
            переменную: её будем уменьшать, сохраняя исходное{" "}
            <Notation>{"n"}</Notation>. Цикл{" "}
            <PythonTerm term="while">
              <Notation>{"while x > 0"}</Notation>
            </PythonTerm>{" "}
            повторяет три действия, пока <Notation>{"x"}</Notation> больше нуля:
          </Typography.Text>
          <ul>
            <li>
              <Notation>{"digit = x % q"}</Notation> находит последнюю цифру;
            </li>
            <li>
              <Notation>{"s = str(digit) + s"}</Notation> ставит найденную цифру{" "}
              <strong>слева</strong> от уже собранного результата. Почему слева?
              Потому что цифры извлекаются с конца: каждая следующая найденная
              цифра находится левее предыдущих;
            </li>
            <li>
              <Notation>{"x = x // q"}</Notation> удаляет последнюю цифру из
              числа, с которым мы работаем.
            </li>
          </ul>
          <Typography.Text>
            Это ровно шаги схемы перевода 29 выше: остатки 2, 0, 0, 1 становятся
            строками <Notation>{"'2'"}</Notation>, <Notation>{"'02'"}</Notation>
            , <Notation>{"'002'"}</Notation>, <Notation>{"'1002'"}</Notation>.
            После этого <Notation>{"x"}</Notation> станет нулём, цикл
            завершится.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: основания больше 10"
          >
            <Typography.Text>
              Эта версия рассчитана на основания не больше 10. При большем
              основании для цифр со значениями 10 и выше нужны дополнительные
              символы, например <Notation>{"A"}</Notation>,{" "}
              <Notation>{"B"}</Notation>, <Notation>{"C"}</Notation>.
              Универсальное расширение строится так: заводят строку{" "}
              <Notation>
                {"digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'"}
              </Notation>{" "}
              и вместо <Notation>{"str(digit)"}</Notation> используют{" "}
              <Notation>{"digits[digit]"}</Notation>. Но для двоичных, троичных
              и восьмеричных задач достаточно первоначальной функции.
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
                key: "Число и запись",
                note: (
                  <>
                    перевод меняет запись, а не число; дописанная цифра меняет
                    число
                  </>
                ),
              },
              {
                key: "Разряд",
                note: <>его вес — степень основания, отсчёт справа с нуля</>,
              },
              {
                key: "Перевод делением",
                note: <>остатки — цифры справа налево</>,
              },
              {
                key: "Длина записи",
                note: (
                  <>задаёт диапазон чисел: четыре двоичные цифры — от 8 до 15</>
                ),
              },
              {
                key: "Python",
                note: (
                  <>
                    <Notation>{"bin(n)[2:]"}</Notation>,{" "}
                    <Notation>{"int(s, q)"}</Notation>, своя{" "}
                    <Notation>{"to_base(n, q)"}</Notation>
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dopisyvanie-sprava",
      navLabel: "Дописывание справа",
      explanation: (
        <>
          <Typography.Text>
            Что получится, если к двоичной записи 11 ={" "}
            <Notation>{"1011"}</Notation> дописать справа{" "}
            <Notation>{"01"}</Notation>? А если первые две цифры заменить или
            посчитать сумму цифр? Задание 5 состоит из таких действий.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждое действие с записью — это строка программы и понятное
              изменение числа: дописанная справа цифра сдвигает старые цифры.
            </strong>{" "}
            Здесь — дописывание; срезы, замены и сумма цифр — в подтеме 3.
            Функция <Notation>{"to_base"}</Notation> из подтемы 1 нам ещё
            понадобится.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sdvig-razryadov",
      navLabel: "Сдвиг разрядов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Дописанная справа цифра сдвигает все старые цифры на разряд влево.
            </strong>{" "}
            В десятичной системе 37 → 374. Что произошло с числом? 374 = 37 · 10
            + 4. Все исходные цифры сдвинулись на один разряд влево. Их вклад
            увеличился в десять раз. В освободившийся разряд единиц поставили 4.
          </Typography.Text>
          <Typography.Text>
            В двоичной системе 1011₂ → 10110₂. Поскольку 1011₂ = 11, получаем R
            = 11 · 2 + 0 = 22. Если дописать единицу, 1011₂ → 10111₂, то R = 11
            · 2 + 1 = 23.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.append1011_1_2}
            caption={
              <>
                Каждая старая цифра переехала в соседний разряд слева, её вес
                удвоился: 11 превратилось в 22. Дописанная единица встала в
                разряд единиц, поэтому R = 22 + 1 = 23.
              </>
            }
          />
          <Typography.Text>
            Дописали <Notation>{"0"}</Notation> — число удвоилось, дописали{" "}
            <Notation>{"1"}</Notation> — удвоилось и выросло на 1.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: общее правило">
            <Typography.Text>
              Общее правило: <strong>R = qN + d</strong>, где d — дописанная
              цифра. У неё обязательно должно выполняться 0 ≤ d {"<"} q.
            </Typography.Text>
            <Typography.Text>
              В двоичной системе возможны только два варианта: дописали 0 — R =
              2N, дописали 1 — R = 2N + 1. Это не отдельные формулы для
              заучивания: они следуют из весов разрядов.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "neskolko-cifr",
      navLabel: "Несколько цифр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если справа дописывают несколько цифр, важны и их значение, и их
              количество.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Например, к 1011₂ = 11 дописываем <Notation>{"01"}</Notation>: 1011₂
            → 101101₂. Дописали <strong>две цифры</strong>: старое число
            умножилось на 4, и к нему прибавилось значение блока — 44 + 1 = 45.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.append1011_01_2}
            caption={
              <>
                Блок из двух цифр сдвигает старые цифры на два разряда: вес
                каждой вырос в 4 раза, 11 стало 44. Блок 01 стоит в двух младших
                разрядах и добавляет своё значение 1.
              </>
            }
          />
          <Typography.Text>
            Особенно внимательно обращайся с нулями в начале дописываемого
            блока. У блоков <Notation>{"1"}</Notation>,{" "}
            <Notation>{"01"}</Notation>, <Notation>{"001"}</Notation> одинаковое
            числовое значение — 1. Но разная длина:
          </Typography.Text>
          <VariantPicker
            label={"Дописанный блок и итоговое число"}
            variants={[
              {
                label: "1",
                value: <>R = 2N + 1</>,
                note: <>один разряд: N · 2¹</>,
              },
              {
                label: "01",
                value: <>R = 4N + 1</>,
                note: <>два разряда: N · 2²</>,
              },
              {
                label: "001",
                value: <>R = 8N + 1</>,
                note: <>три разряда: N · 2³</>,
              },
            ]}
          />
          <Typography.Text>
            Например, для N = 11: 11 · 8 + 1 = 89. И действительно, 1011₂ →
            1011001₂ = 89.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Нули в начале отдельного блока нельзя выкидывать, если условие
              требует дописать именно этот блок.
            </strong>
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: общее правило">
            <Typography.Text>
              Если к записи N в системе с основанием q справа дописывают блок из
              k цифр со значением A, то <strong>R = N · qᵏ + A</strong>: каждый
              сдвиг на один разряд умножает число на q, сдвиг на k разрядов — на
              qᵏ.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "dopisyvanie-sleva",
      navLabel: "Дописывание слева",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если дописать цифры слева, их вес зависит от длины прежней записи.
            </strong>{" "}
            Пусть N = 11 = 1011₂. Дописали слева <Notation>{"10"}</Notation>:
            1011 → 101011. Исходные цифры остались на своих местах. Новый блок
            оказался левее четырёх исходных разрядов. Поэтому R = 10₂ · 2⁴ + 11
            = 2 · 16 + 11 = 43.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.append1011_10_2_left}
            caption={
              <>
                Слева старые цифры не двигаются и сохраняют вес: 11 остаётся 11.
                Блок 10 встал над четырьмя разрядами, его вес — 2⁴ = 16, отсюда
                2 · 16 + 11 = 43.
              </>
            }
          />
          <ProofDisclosure kind="nuance" summary="Тонкости: общее правило">
            <Typography.Text>
              Общее правило: <strong>R = A · qᴸ + N</strong>, где A — значение
              дописанного слева блока, L — длина записи, перед которой этот блок
              ставят. Сравни:
            </Typography.Text>
            <LessonTable
              label={"Сравни"}
              columns={[{ label: "Действие" }, { label: "Формула" }]}
              rows={[
                ["Справа дописать k цифр со значением A", "N · qᵏ + A"],
                ["Слева дописать блок со значением A", "A · qᴸ + N"],
              ]}
            />
            <Typography.Text>
              Например, если слева дописывается одна единица:{" "}
              <strong>R = qᴸ + N.</strong> Здесь степень зависит от длины
              исходной записи. При переходе к следующей длине она меняется.
            </Typography.Text>
            <Typography.Text>
              Если запись содержит сохранённые ведущие нули, в этой формуле
              нужна <strong>фактическая длина записи на данном шаге</strong>, а
              не длина её сокращённой формы.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "soedinenie-strok",
      navLabel: "Соединение строк",
      explanation: (
        <>
          <Typography.Text>
            <strong>В программе дописывание — это соединение строк.</strong>{" "}
            Дописать справа <Notation>{"01"}</Notation> —{" "}
            <Notation>{"s = s + '01'"}</Notation>, слева{" "}
            <Notation>{"10"}</Notation> — <Notation>{"s = '10' + s"}</Notation>.
            Скопировать в конец последние две цифры —{" "}
            <Notation>{"s = s + s[-2:]"}</Notation>:{" "}
            <PythonTerm term="slice">срез</PythonTerm>{" "}
            <Notation>{"s[-2:]"}</Notation> берёт два последних символа. Так
            любая команда условия становится одной строкой программы.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "blok-po-usloviyu",
      navLabel: "Блок по условию",
      explanation: (
        <>
          <Typography.Text>
            <strong>Чаще всего блок выбирают по условию на N.</strong> Например:
            если N чётное, слева дописать <Notation>{"1"}</Notation>, а справа{" "}
            <Notation>{"0"}</Notation>; если нечётное — слева{" "}
            <Notation>{"11"}</Notation>, а справа <Notation>{"1"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Проверим руками на двух входах. 6 = 110₂, оно чётное:{" "}
            <Notation>{"1"}</Notation> + <Notation>{"110"}</Notation> +{" "}
            <Notation>{"0"}</Notation> = <Notation>{"11100"}</Notation>. Справа
            одна цифра, поэтому старое число удвоилось: 12. Слева единица встала
            над четырьмя разрядами: 2⁴ = 16. R = 16 + 12 = 28. Число 7 = 111₂
            нечётное: <Notation>{"11"}</Notation> + <Notation>{"111"}</Notation>{" "}
            + <Notation>{"1"}</Notation> = <Notation>{"111111"}</Notation>, R =
            63.
          </Typography.Text>
          <Typography.Text>
            В программе выбор ветви —{" "}
            <PythonTerm term="if">
              <Notation>{"if"}</Notation>
            </PythonTerm>{" "}
            с <Notation>{"else"}</Notation>, а чётность — остаток{" "}
            <Notation>{"n % 2"}</Notation>. Запусти её по шагам и посмотри,
            какую ветвь проходит каждый вызов:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runTransform}
            label={
              "Запусти её по шагам и посмотри, какую ветвь проходит каждый вызов"
            }
          />
          <Typography.Text>
            Для чётного 6 выполняется строка 4 и пропускается строка 6, для
            нечётного 7 — наоборот. Посмотрим на результаты подряд:
          </Typography.Text>
          <CodeBlock
            code={"for n in range(4, 9):\n    print(n, transform(n))"}
            label={"Посмотрим на результаты подряд"}
            language="python"
            output={"4 24\n5 59\n6 28\n7 63\n8 48"}
          />
          <Typography.Text>
            Обрати внимание: при N = 8 результат меньше, чем при N = 7.
            Результат не обязан расти вместе с N, если ветви дописывают разные
            блоки. Как с этим жить при поиске ответа, разберём в подтеме 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rezultat-vychisleniya",
      navLabel: "Дописать результат",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Дописать результат вычисления — не всегда значит применить{" "}
              <Notation>{"str"}</Notation>.
            </strong>{" "}
            Предположим, алгоритм требует:
          </Typography.Text>
          <ol>
            <li>найти остаток от деления N на 3;</li>
            <li>умножить его на 7;</li>
            <li>перевести произведение в троичную систему;</li>
            <li>дописать эту запись справа.</li>
          </ol>
          <Typography.Text>
            Если остаток равен 2, то 2 · 7 = 14. Но дописывать нужно не{" "}
            <Notation>{"14"}</Notation>, а троичную запись: 14₁₀ = 112₃.
          </Typography.Text>
          <CodeBlock
            code={
              "n = 14\ns = to_base(n, 3)\nextra = n % 3 * 7\nprint(s + to_base(extra, 3))\nprint(s + str(extra))"
            }
            label={"Но дописывать нужно не 14, а троичную запись: 14₁₀ = 112₃"}
            language="python"
            output={"112112\n11214"}
          />
          <Typography.Text>
            Первая строка правильная: дописана троичная запись{" "}
            <Notation>{"112"}</Notation>. Вторая неправильная:{" "}
            <Notation>{"str(14)"}</Notation> даёт десятичную строку{" "}
            <Notation>{"'14'"}</Notation>. Более того, цифра{" "}
            <Notation>{"4"}</Notation> вообще недопустима в троичной записи.
          </Typography.Text>
          <Typography.Text>
            Применять <Notation>{"str"}</Notation> можно, когда дописывается
            одна допустимая цифра нужной системы, например{" "}
            <Notation>{"str(n % 2)"}</Notation>. Например, остаток от деления на
            2 — это 0 или 1.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Каждый раз задавай себе вопрос: я дописываю одну цифру или запись
              некоторого числа в указанной системе?
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dopisyvanie-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Дописать справа",
                note: (
                  <>
                    старые цифры сдвигаются: одна двоичная цифра — число
                    удвоилось, две — умножилось на 4
                  </>
                ),
              },
              {
                key: "Блок 01 и 001",
                note: <>длина блока важна вместе с нулями в его начале</>,
              },
              {
                key: "Дописать слева",
                note: <>старые цифры не двигаются, блок встаёт над ними</>,
              },
              {
                key: "Блок по условию",
                note: (
                  <>
                    if и else по условию на N; результат может не расти вместе с
                    N
                  </>
                ),
              },
              {
                key: "Записанное число",
                note: <>дописывают его запись в нужной системе, а не str</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "zamena-cifr",
      navLabel: "Части записи",
      explanation: (
        <>
          <Typography.Text>
            Алгоритм: в двоичной записи 46 = <Notation>{"101110"}</Notation>{" "}
            первые две цифры заменяют на <Notation>{"110"}</Notation>. Что
            получится? Такие команды берут часть записи по её месту — первые или
            последние цифры — и переставляют, удаляют, заменяют.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Все такие команды собираются из срезов строки и соединения.
            </strong>{" "}
            Здесь же — переворот и инверсия записи и сумма цифр, по которой
            многие алгоритмы выбирают дописываемую цифру.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "indeksy-i-srezy",
      navLabel: "Индексы и срезы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Нужную часть записи берут по номерам символов — индексам и срезам.
            </strong>{" "}
            Каждый символ строки имеет номер — <strong>индекс</strong>. В Python
            нумерация начинается с нуля: первая цифра записи{" "}
            <Notation>{"s = '101110'"}</Notation> — это{" "}
            <Notation>{"s[0]"}</Notation>, вторая —{" "}
            <Notation>{"s[1]"}</Notation>. Отрицательные индексы считают с
            конца: <Notation>{"s[-1]"}</Notation> — последний символ,{" "}
            <Notation>{"s[-2]"}</Notation> — предпоследний.
          </Typography.Text>
          <Typography.Text>
            Чтобы получить несколько символов, используют{" "}
            <PythonTerm term="slice">срез</PythonTerm>{" "}
            <Notation>{"s[a:b]"}</Notation>. Он берёт символы с индексами от{" "}
            <Notation>{"a"}</Notation> включительно до{" "}
            <Notation>{"b"}</Notation> <strong>не включительно</strong>.
            Например, <Notation>{"s[1:4]"}</Notation> берёт индексы 1, 2, 3 и
            даёт <Notation>{"'011'"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.slice101110_1_4}
            caption={
              <>
                Срез s[1:4] записи 101110: границы стоят перед индексами 1 и 4,
                внутрь попадают символы 1, 2 и 3 — получается '011'.
              </>
            }
          />
          <Typography.Text>
            Если граница не указана, срез идёт от начала или до конца строки.
            Выбери срез, чтобы увидеть, что он берёт:
          </Typography.Text>
          <VariantPicker
            label={"Срез и что он берёт из s = '101110'"}
            variants={[
              {
                label: "s[:2]",
                value: (
                  <>
                    <Notation>{"'10'"}</Notation>
                  </>
                ),
                note: <>первые два символа</>,
              },
              {
                label: "s[-2:]",
                value: (
                  <>
                    <Notation>{"'10'"}</Notation>
                  </>
                ),
                note: <>последние два</>,
              },
              {
                label: "s[2:]",
                value: (
                  <>
                    <Notation>{"'1110'"}</Notation>
                  </>
                ),
                note: <>всё, кроме первых двух</>,
              },
              {
                label: "s[:-2]",
                value: (
                  <>
                    <Notation>{"'1011'"}</Notation>
                  </>
                ),
                note: <>всё, кроме последних двух</>,
              },
              {
                label: "s[::-1]",
                value: (
                  <>
                    <Notation>{"'011101'"}</Notation>
                  </>
                ),
                note: <>строка в обратном порядке</>,
              },
            ]}
          />
          <Typography.Text>
            <strong>
              Если позиции в условии считают справа, нельзя без проверки
              применять срезы для позиций слева.
            </strong>{" "}
            «Вторая справа цифра» — это <Notation>{"s[-2]"}</Notation>, а не{" "}
            <Notation>{"s[1]"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sborka-iz-srezov",
      navLabel: "Сборка из срезов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Почти любое действие задания собирается из срезов и соединения
              строк.
            </strong>{" "}
            Пусть <Notation>{"s"}</Notation> — текущая запись. Каждую команду
            условия можно перевести одной строкой:
          </Typography.Text>
          <VariantPicker
            label={"Команда из условия и её перевод на Python"}
            variants={[
              {
                label: "скопировать последние две цифры в конец",
                value: (
                  <>
                    <Notation>{"s = s + s[-2:]"}</Notation>
                  </>
                ),
              },
              {
                label: "скопировать первые две цифры в конец",
                value: (
                  <>
                    <Notation>{"s = s + s[:2]"}</Notation>
                  </>
                ),
              },
              {
                label: "удалить первые две цифры",
                value: (
                  <>
                    <Notation>{"s = s[2:]"}</Notation>
                  </>
                ),
              },
              {
                label: "удалить последние две цифры",
                value: (
                  <>
                    <Notation>{"s = s[:-2]"}</Notation>
                  </>
                ),
              },
              {
                label: "первые две цифры заменить на 110",
                value: (
                  <>
                    <Notation>{"s = '110' + s[2:]"}</Notation>
                  </>
                ),
              },
              {
                label: "последние две цифры заменить на 01",
                value: (
                  <>
                    <Notation>{"s = s[:-2] + '01'"}</Notation>
                  </>
                ),
              },
              {
                label: "перевернуть запись",
                value: (
                  <>
                    <Notation>{"s = s[::-1]"}</Notation>
                  </>
                ),
              },
              {
                label: "перенести первую цифру в конец",
                value: (
                  <>
                    <Notation>{"s = s[1:] + s[0]"}</Notation>
                  </>
                ),
              },
              {
                label: "перенести последнюю цифру в начало",
                value: (
                  <>
                    <Notation>{"s = s[-1] + s[:-1]"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            В строке <Notation>{"s = s + s[-2:]"}</Notation> обе части справа
            вычисляются по старому значению <Notation>{"s"}</Notation>. После
            этого результат присваивается переменной.
          </Typography.Text>
          <Typography.Text>
            Если после нескольких изменений нужно обратиться именно к исходной
            записи, сохрани её: <Notation>{"original = s"}</Notation>. Теперь{" "}
            <Notation>{"original"}</Notation> содержит исходный текст, а{" "}
            <Notation>{"s"}</Notation> можно дальше изменять. Сравни два
            алгоритма:
          </Typography.Text>
          <CodeBlock
            code={
              "n = 46\noriginal = bin(n)[2:]\ns = original + '1'\ns = s + original[-2:]\nprint(s)\n\ns = bin(n)[2:]\ns = s + '1'\ns = s + s[-2:]\nprint(s)"
            }
            label={"Сравни два алгоритма"}
            language="python"
            output={"101110110\n101110101"}
          />
          <Typography.Text>
            В первом варианте последние две цифры взяты из исходной записи (
            <Notation>{"10"}</Notation>), во втором — уже из изменённой (
            <Notation>{"01"}</Notation>). Это два разных алгоритма, и условие
            всегда говорит, какой из них нужен.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perevernut-i-invertirovat",
      navLabel: "Переворот и инверсия",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Перевернуть запись и инвертировать её — разные действия.
            </strong>{" "}
            <strong>Перевернуть запись</strong> — прочитать её справа налево.{" "}
            <strong>Инвертировать двоичную запись</strong> — заменить каждый{" "}
            <Notation>{"0"}</Notation> на <Notation>{"1"}</Notation>, а каждый{" "}
            <Notation>{"1"}</Notation> на <Notation>{"0"}</Notation>. Например,
            для <Notation>{"1100"}</Notation> переворот даёт{" "}
            <Notation>{"0011"}</Notation>, и инверсия тоже даёт{" "}
            <Notation>{"0011"}</Notation>. На этом числе результаты случайно
            совпали. На другом уже нет: для <Notation>{"10110"}</Notation>{" "}
            переворот даёт <Notation>{"01101"}</Notation>, а инверсия —{" "}
            <Notation>{"01001"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Поэтому ориентироваться нужно на смысл команды, а не на один пример.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "odni-edinicy",
      navLabel: "Число из единиц",
      explanation: (
        <>
          <Typography.Text>
            <strong>Инверсию проще понять через число из одних единиц.</strong>{" "}
            Возьмём пятизначную двоичную запись <Notation>{"10110"}</Notation>.
            После замены каждого <Notation>{"0"}</Notation> на{" "}
            <Notation>{"1"}</Notation> и каждого <Notation>{"1"}</Notation> на{" "}
            <Notation>{"0"}</Notation> получится <Notation>{"01001"}</Notation>.
            Если сложить значения исходной и изменённой записей, в каждом
            разряде получится единица:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.invert10110_2}
            caption={
              <>
                В каждом столбце одна единица и один ноль, поэтому сумма — пять
                единиц, 11111₂ = 31. Значит, инверсия 22 равна 31 − 22 = 9.
              </>
            }
          />
          <Typography.Text>
            Длина записи здесь важна: инверсия трёх цифр{" "}
            <Notation>{"101"}</Notation> даёт <Notation>{"010"}</Notation> = 2,
            а восьми цифр <Notation>{"00000101"}</Notation> — уже{" "}
            <Notation>{"11111010"}</Notation> = 250. Сколько цифр брать, говорит
            условие.
          </Typography.Text>
          <ProofDisclosure kind="nuance" summary="Тонкости: инверсия формулой">
            <Typography.Text>
              А число из пяти единиц равно 11111₂ = 2⁵ − 1 = 31. Поэтому N + M =
              2ᴸ − 1, где L — длина записи, а M — результат инверсии. Отсюда:
            </Typography.Text>
            <Typography.Text>
              <strong>M = 2ᴸ − 1 − N.</strong>
            </Typography.Text>
            <Typography.Text>
              Для нашего примера N = 22, L = 5, M = 31 − 22 = 9. И
              действительно, 01001₂ = 9.
            </Typography.Text>
            <Typography.Text>
              Фиксированная длина имеет значение. Число 5 можно записать как{" "}
              <Notation>{"101"}</Notation>. Инверсия этих трёх цифр —{" "}
              <Notation>{"010"}</Notation>, результат равен 2. Если условие
              требует сначала представить 5 восемью двоичными цифрами,{" "}
              <Notation>{"00000101"}</Notation>, то инверсия —{" "}
              <Notation>{"11111010"}</Notation>, и результат 255 − 5 = 250.
            </Typography.Text>
            <Typography.Text>
              Поэтому нельзя автоматически представлять каждое число восемью
              разрядами. Такая длина должна быть задана условием.
            </Typography.Text>
            <Typography.Text>
              Аналогичный принцип работает в троичной системе при замене 0 ↔ 2,
              1 → 1. Каждая исходная цифра d заменяется на 2 − d. Сумма двух
              записей состоит из двоек: N + M = 222…2₃ = 3ᴸ − 1. Следовательно,{" "}
              <strong>M = 3ᴸ − 1 − N.</strong>
            </Typography.Text>
            <Typography.Text>
              В общем случае, если в системе с основанием q каждую цифру d
              заменяют на q − 1 − d, то <strong>M = qᴸ − 1 − N.</strong> Эта
              формула не относится к любой произвольной замене цифр. Она
              работает именно для указанного правила.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "odnovremennaya-zamena",
      navLabel: "Одновременная замена",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если символы меняют одновременно, уже заменённые нельзя заменять
              ещё раз.
            </strong>{" "}
            Пусть нужно поменять местами нули и единицы. Кажется, что можно
            написать{" "}
            <Notation>{"s.replace('0', '1').replace('1', '0')"}</Notation>. Но
            это ошибка.
          </Typography.Text>
          <Typography.Text>
            Метод{" "}
            <PythonTerm term="strmeth">
              <Notation>{"replace"}</Notation>
            </PythonTerm>{" "}
            создаёт строку с указанными заменами. В цепочке второй вызов
            работает с результатом первого. Для строки{" "}
            <Notation>{"'10'"}</Notation> получится{" "}
            <Notation>{"10 → 11 → 00"}</Notation>, а правильная инверсия —{" "}
            <Notation>{"10 → 01"}</Notation>.
          </Typography.Text>
          <CodeBlock
            code={"s = '10110'\nprint(s.replace('0', '1').replace('1', '0'))"}
            label={
              "Для строки '10' получится 10 → 11 → 00, а правильная инверсия — 10 → 01"
            }
            language="python"
            output={"00000"}
          />
          <Typography.Text>
            После первой замены в строке одни единицы, и вторая замена
            превращает их все в нули.
          </Typography.Text>
          <Typography.Text>
            Надёжный способ — читать исходную строку и собирать новую: на каждом
            шаге анализируется символ <strong>исходной</strong> строки, поэтому
            уже заменённые символы больше не трогаются. Запусти программу по
            шагам и следи, как растёт <Notation>{"new_s"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runInvert}
            label={"Запусти программу по шагам и следи, как растёт new_s"}
          />
        </>
      ),
    },
    {
      id: "vedushchie-nuli",
      navLabel: "Ведущие нули",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ведущие нули не меняют число, но могут изменить следующие действия
              со строкой.
            </strong>{" "}
            Python корректно прочитает <Notation>{"int('0011', 2)"}</Notation> и
            получит 3. Поэтому перед окончательным переводом специально удалять
            ведущие нули обычно не нужно.
          </Typography.Text>
          <Typography.Text>
            Но рассмотрим два последовательных шага: получить строку{" "}
            <Notation>{"0011"}</Notation>, затем дописать слева{" "}
            <Notation>{"1"}</Notation>. Если сохранить строку,{" "}
            <Notation>{"0011 → 10011"}</Notation>, то результат равен 19. Если
            самовольно убрать нули между шагами,{" "}
            <Notation>{"0011 → 11 → 111"}</Notation>, то результат равен 7.
            Алгоритмы получились разными.
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Удаляй ведущие нули в тот момент, когда этого требует условие,
              либо при окончательном переходе от записи к числу, если
              промежуточных действий больше нет.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Также помни: строка <Notation>{"'0'"}</Notation> — корректная запись
            нуля, а пустая строка <Notation>{"''"}</Notation> — не запись числа,
            и <Notation>{"int('', 2)"}</Notation> вызовет ошибку. Если операция
            удаляет все символы, нужно проверить, допускает ли условие такой
            случай и как он трактуется.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "poslednyaya-cifra",
      navLabel: "Чётность и сумма цифр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чётность самого числа видна по последней двоичной цифре, а сумма
              цифр зависит от всей записи.
            </strong>{" "}
            Чётное число делится на 2 без остатка. Для двоичной записи чётность
            самого числа определяется последней цифрой:{" "}
            <Notation>{"0"}</Notation> — число чётное,{" "}
            <Notation>{"1"}</Notation> — нечётное.
          </Typography.Text>
          <Typography.Text>
            Но сумма двоичных цифр зависит от <strong>всей записи</strong>:
          </Typography.Text>
          <LessonTable
            label={"Но сумма двоичных цифр зависит от всей записи"}
            columns={[
              { label: "N", numeric: true },
              { label: "Двоичная запись" },
              { label: "Чётность N" },
              { label: "Сумма двоичных цифр", numeric: true },
            ]}
            rows={[
              [
                "3",
                <>
                  <Notation>{"11"}</Notation>
                </>,
                "Нечётное",
                "2 — чётная",
              ],
              [
                "8",
                <>
                  <Notation>{"1000"}</Notation>
                </>,
                "Чётное",
                "1 — нечётная",
              ],
              [
                "6",
                <>
                  <Notation>{"110"}</Notation>
                </>,
                "Чётное",
                "2 — чётная",
              ],
              [
                "7",
                <>
                  <Notation>{"111"}</Notation>
                </>,
                "Нечётное",
                "3 — нечётная",
              ],
            ]}
          />
          <Typography.Text>
            Из таблицы видно: эти свойства могут совпадать, а могут различаться.
          </Typography.Text>
          <Typography.Text>
            В двоичной записи сумма цифр равна количеству единиц: 1 + 1 + 0 + 1
            = 3. Нули ничего не добавляют, каждая единица добавляет 1. Поэтому
            условия «сумма двоичных цифр чётная» и «количество единиц в двоичной
            записи чётное» равносильны. Но они не равносильны условию «N
            чётное».
          </Typography.Text>
          <Typography.Text>
            <strong>
              При чтении условия каждый раз уточняй, чётность чего проверяют:
              числа, количества единиц, суммы цифр или длины записи.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kakaya-zapis",
      navLabel: "Какая запись",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сумму цифр считают в той системе, которую называет условие.
            </strong>{" "}
            Для двоичной строки <Notation>{"s.count('1')"}</Notation> —
            одновременно количество единиц и сумма цифр. Для троичной строки —{" "}
            <Notation>{"s.count('1') + 2 * s.count('2')"}</Notation>. Более
            общий вариант для систем с цифрами <Notation>{"0"}</Notation>–
            <Notation>{"9"}</Notation> проходит по строке циклом{" "}
            <PythonTerm term="for">
              <Notation>{"for digit in s"}</Notation>
            </PythonTerm>
            : он по очереди подставляет в переменную{" "}
            <Notation>{"digit"}</Notation> каждый символ строки.
          </Typography.Text>
          <CodeBlock
            code={
              "s = to_base(23, 3)\nprint(s, s.count('1') + 2 * s.count('2'))\n\ntotal = 0\nfor digit in s:\n    total = total + int(digit)\nprint(total)"
            }
            label={"Код на Python: s = to_base(23, 3)"}
            language="python"
            output={"212 5\n5"}
          />
          <Typography.Text>
            Здесь 23 = 212₃. Цикл прибавляет 2, затем 1, затем 2. Преобразование{" "}
            <Notation>{"int(digit)"}</Notation> нужно потому, что символ{" "}
            <Notation>{"'2'"}</Notation> — текст, а для сложения требуется число
            2.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: чётность и делимость в других системах"
          >
            <Typography.Text>
              В троичной записи <Notation>{"212"}</Notation> количество единиц —
              1, количество двоек — 2, а сумма цифр 2 + 1 + 2 = 5. Поэтому
              считать только единицы уже недостаточно. Сумму троичных цифр можно
              получить так: количество единиц + 2 · количество двоек.
            </Typography.Text>
            <Typography.Text>
              Также нельзя автоматически переносить привычные признаки делимости
              из десятичной системы. Например, 3₁₀ = 10₃: само число делится на
              3, но сумма цифр его троичной записи равна 1 и на 3 не делится. И
              наоборот, 5₁₀ = 12₃: сумма троичных цифр равна 3, но число 5 на 3
              не делится.
            </Typography.Text>
            <Typography.Text>
              В системе с основанием 3 делимость самого числа на 3 определяется{" "}
              <strong>последней цифрой</strong>, поскольку N = 3Q + d.
            </Typography.Text>
            <Typography.Text>
              Для чётности в троичной системе есть другая полезная связь: все
              степени тройки нечётные. Поэтому чётность числа совпадает с
              чётностью суммы его троичных цифр. Например, 11₃ = 4: последняя
              цифра — <Notation>{"1"}</Notation>, но число чётное, поскольку
              сумма цифр 1 + 1 = 2.
            </Typography.Text>
            <Typography.Text>
              Отсюда полезное правило: в системе с чётным основанием чётность
              числа определяется последней цифрой, в системе с нечётным
              основанием — чётностью суммы цифр. Для задания чаще достаточно
              вычислить нужную величину непосредственно, но понимание этой связи
              помогает проверять себя.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "povtornyj-shag",
      navLabel: "Повторный шаг",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если шаг повторяют, второй раз его применяют уже к новой записи.
            </strong>{" "}
            Рассмотрим важный алгоритм:
          </Typography.Text>
          <ol>
            <li>строится двоичная запись N;</li>
            <li>вычисляется сумма её цифр;</li>
            <li>остаток от деления суммы на 2 дописывается справа;</li>
            <li>для получившейся записи то же действие выполняется ещё раз.</li>
          </ol>
          <Typography.Text>
            Возьмём N = 13, s = <Notation>{"1101"}</Notation>. Первая сумма 1 +
            1 + 0 + 1 = 3. Остаток от деления 3 на 2 равен 1:{" "}
            <Notation>{"1101 → 11011"}</Notation>. Теперь считаем сумму{" "}
            <strong>новой</strong> записи: 1 + 1 + 0 + 1 + 1 = 4. Остаток равен
            0: <Notation>{"11011 → 110110"}</Notation>. Получаем R = 110110₂ =
            54.
          </Typography.Text>
          <Typography.Text>
            Почему второй дописанный разряд всегда равен нулю? Возможны два
            случая. Если единиц было чётное количество, первым дописывается 0 и
            количество остаётся чётным. Если нечётное, первым дописывается 1 и
            количество становится чётным. В обоих случаях перед вторым шагом
            единиц чётное количество, и второй разряд — 0.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.parity12_13}
            caption={
              <>
                Слева у 12 две единицы: дописываем 0, их по-прежнему две. Справа
                у 13 три единицы: дописываем 1, их становится четыре. После
                первого шага единиц всегда чётное количество, поэтому второй
                дописанный разряд — 0.
              </>
            }
          />
          <Typography.Text>
            Следовательно, итоговый хвост — <Notation>{"00"}</Notation>, если
            исходное количество единиц чётное, и <Notation>{"10"}</Notation>,
            если нечётное. Отсюда:
          </Typography.Text>
          <Typography.Text>
            <strong>R = 4N</strong>, если количество единиц чётное;{" "}
            <strong>R = 4N + 2</strong>, если нечётное.
          </Typography.Text>
          <Typography.Text>
            Это свойство именно <strong>последовательного пересчёта</strong>.
            Если алгоритм говорит «найти остаток один раз и дописать его
            дважды», результаты другие: <Notation>{"00"}</Notation> или{" "}
            <Notation>{"11"}</Notation>. Различие всего в нескольких словах
            условия, а числа на выходе меняются. Запусти обе версии по шагам и
            сравни, сколько раз считается <Notation>{"count"}</Notation>:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runParity}
            label={
              "Запусти обе версии по шагам и сравни, сколько раз считается count"
            }
          />
          <Typography.Text>
            В <Notation>{"parity_twice"}</Notation> второй{" "}
            <Notation>{"count"}</Notation> считает единицы уже новой строки —
            это и есть пересчёт. В <Notation>{"parity_copied"}</Notation>{" "}
            остаток посчитан один раз, поэтому к 13 дописывается{" "}
            <Notation>{"11"}</Notation>, и R = 4 · 13 + 3 = 55.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "desyatichnaya-zapis",
      navLabel: "Десятичная запись",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Десятичную запись обрабатывают так же, как двоичную, — через
              строку.
            </strong>{" "}
            Сумма десятичных цифр числа — это сумма цифр строки{" "}
            <Notation>{"str(n)"}</Notation>. В задачах с десятичной записью
            могут рассматриваться и все соседние пары или тройки цифр.
          </Typography.Text>
          <Typography.Text>
            Пусть N = 30042. Все тройки соседних цифр:{" "}
            <Notation>{"300"}</Notation>, <Notation>{"004"}</Notation>,{" "}
            <Notation>{"042"}</Notation>. Они перекрываются: после каждой тройки
            начало сдвигается на одну позицию. Как числа это 300, 4, 42. Если
            результат — разность максимального и минимального значения, R = 300
            − 4 = 296. В программе по шагам видно, как{" "}
            <Notation>{"i"}</Notation> пробегает начала троек, а список{" "}
            <Notation>{"values"}</Notation> пополняется:
          </Typography.Text>
          <CodeRunner
            {...lessonMedia.runWindows}
            label={
              "В программе по шагам видно, как i пробегает начала троек, а список values пополняется"
            }
          />
          <Typography.Text>
            Здесь <Notation>{"values = []"}</Notation> создаёт пустой{" "}
            <PythonTerm term="list">список</PythonTerm>,{" "}
            <Notation>{"append"}</Notation> добавляет в его конец новое
            значение, а{" "}
            <PythonTerm term="agg">
              <Notation>{"max"}</Notation> и <Notation>{"min"}</Notation>
            </PythonTerm>{" "}
            находят наибольшее и наименьшее. Функция предполагает, что в записи
            не меньше трёх цифр.
          </Typography.Text>
          <Typography.Text>
            Почему <Notation>{"range(len(s) - 2)"}</Notation>? При длине 5
            тройка может начинаться с индекса 0, 1 или 2. Начать с индекса 3
            нельзя: останется только два символа. В общем случае для фрагментов
            длины k число возможных начал равно L − k + 1. Поэтому используют{" "}
            <Notation>{"range(len(s) - k + 1)"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Перед числовым сравнением фрагменты нужно превратить в числа.
            </strong>{" "}
            Например, строки <Notation>{"'11'"}</Notation> и{" "}
            <Notation>{"'100'"}</Notation> сравниваются посимвольно. Это не то
            же самое, что сравнение чисел 11 и 100 или двоичных чисел 11₂ и
            100₂.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chasti-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Срез",
                note: (
                  <>
                    <Notation>{"s[a:b]"}</Notation> — от a до b − 1;{" "}
                    <Notation>{"s[-2:]"}</Notation> — две последние
                  </>
                ),
              },
              {
                key: "Замена",
                note: <>срез без старых цифр плюс новый блок</>,
              },
              {
                key: "Переворот и инверсия",
                note: (
                  <>разные действия; длину записи для инверсии задаёт условие</>
                ),
              },
              {
                key: "Одновременная замена",
                note: <>по исходной строке, а не цепочкой replace</>,
              },
              {
                key: "Сумма цифр",
                note: (
                  <>
                    по той записи, которую называет условие; при повторном шаге
                    — по новой
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "shablon-perebora",
      navLabel: "Шаблон программы",
      explanation: (
        <>
          <Typography.Text>
            Вернёмся к задаче темы: чётному N справа дописывается{" "}
            <Notation>{"10"}</Notation>, нечётному — <Notation>{"01"}</Notation>
            , нужно наименьшее N, для которого R {">"} 150.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Программа перебирает N по порядку, для каждого буквально выполняет
              алгоритм и проверяет результат.
            </strong>{" "}
            Сначала убедимся, что алгоритм записан правильно: напечатаем
            результаты для маленьких N и сверим с примером из условия или с
            ручным счётом.
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(1, 9):\n    s = bin(n)[2:]\n    if n % 2 == 0:\n        s = s + '10'\n    else:\n        s = s + '01'\n    r = int(s, 2)\n    print(n, r)"
            }
            label={"Шаблон: результаты для маленьких N"}
            language="python"
            output={"1 5\n2 10\n3 13\n4 18\n5 21\n6 26\n7 29\n8 34"}
          />
          <Typography.Text>
            Проверка руками: 5 = <Notation>{"101"}</Notation>, нечётное,
            дописываем <Notation>{"01"}</Notation> —{" "}
            <Notation>{"10101"}</Notation> = 21. Совпало. Теперь фильтруем по
            вопросу: печатаем первое N, для которого R {">"} 150, и
            останавливаем цикл.
          </Typography.Text>
          <CodeBlock
            code={
              "for n in range(1, 200):\n    s = bin(n)[2:]\n    if n % 2 == 0:\n        s = s + '10'\n    else:\n        s = s + '01'\n    r = int(s, 2)\n    if r > 150:\n        print(n, r)\n        break"
            }
            label={"Шаблон: первое N с R больше 150"}
            language="python"
            output={"38 154"}
          />
          <Typography.Text>
            Ответ — 38. Первое найденное N действительно наименьшее: все меньшие
            уже проверены. Дальше разберём, когда так остановиться нельзя и как
            выбрать границу перебора.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vopros-poiska",
      navLabel: "Вопрос поиска",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала пойми, что именно ищут: наименьшее N, наименьшее R или
              что-то ещё.
            </strong>{" "}
            В задании могут попросить разные вещи. Проверка во всех случаях —
            буквальный перевод условия, а выбирают и выводят разное. Выбери
            формулировку:
          </Typography.Text>
          <VariantPicker
            label={"Формулировка вопроса и что выбираем"}
            variants={[
              {
                label: "наименьшее N, для которого R > T",
                value: <>проверяем R {">"} T</>,
                note: <>выбираем минимальное N</>,
              },
              {
                label: "наибольшее N, для которого R ≤ T",
                value: <>проверяем R ≤ T</>,
                note: <>выбираем максимальное N</>,
              },
              {
                label: "наименьшее возможное R > T",
                value: <>проверяем R {">"} T</>,
                note: <>выбираем минимальное R</>,
              },
              {
                label: "наибольшее возможное R ≤ T",
                value: <>проверяем R ≤ T</>,
                note: <>выбираем максимальное R</>,
              },
              {
                label: "N, при котором R минимально среди R > T",
                value: <>проверяем R {">"} T</>,
                note: (
                  <>сначала минимизируем R, затем выводим соответствующее N</>
                ),
              },
            ]}
          />
          <Typography.Text>
            Последний вариант особенно важен. Рассмотрим учебный алгоритм: если
            N чётное, справа дописать <Notation>{"111"}</Notation>; если
            нечётное — дописать <Notation>{"0"}</Notation>. Чётные N дают
            большие результаты, нечётные — маленькие.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.rnPloteven111odd0_1_12_8}
            caption={
              <>
                Результаты для N от 1 до 12. Чётные N дают точки высоко,
                нечётные — низко. Первое N с R {">"} 8 — это 2 (R = 23), а
                наименьший результат больше 8 — это 10 при N = 5.
              </>
            }
          />
          <Typography.Text>
            Пусть требуется R {">"} 8. Тогда минимальное подходящее N равно{" "}
            <strong>2</strong>, поскольку оно даёт R = 23; минимальное
            подходящее R равно <strong>10</strong>, оно получается при N = 5.
          </Typography.Text>
          <Typography.Text>
            Почему минимальный результат именно 10? Число 9 получить нельзя:
            нечётные N дают чётные результаты, а чётные N ≥ 2 дают результаты не
            меньше 23.
          </Typography.Text>
          <Typography.Text>
            Это пример того, что при увеличении N результат может уменьшаться.
          </Typography.Text>
          <Typography.Text>
            Поэтому для наименьшего R программа не останавливается на первом
            подходящем N, а проверяет все входы и запоминает лучший результат и
            вход, на котором он получен. Запусти программу по шагам:{" "}
            <Notation>{"best_r"}</Notation> сначала станет 23 при N = 2, а потом
            уменьшится до 10 при N = 5.
          </Typography.Text>
          <CodeRunner {...lessonMedia.runBest} label={"Программа на Python"} />
          <Typography.Text>
            Начальное значение 1000 заведомо больше любого результата здесь,
            поэтому первый подходящий R его заменит. Перебор начат с 2, потому
            что N = 1 даёт R = 2 — оно не больше 8. Граница 6 в{" "}
            <Notation>{"range"}</Notation> пока взята для примера; как выбирать
            её честно, разберём ниже.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ostanovka-perebora",
      navLabel: "Остановка перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Остановить перебор на первом подходящем числе можно, только если
              понятно, почему оно лучшее.
            </strong>{" "}
            Команда{" "}
            <PythonTerm term="break">
              <Notation>{"break"}</Notation>
            </PythonTerm>{" "}
            завершает ближайший цикл. Если мы перебираем N = 1, 2, 3, … и ищем{" "}
            <strong>минимальное N</strong>, то первый подходящий вариант
            действительно минимален: все меньшие уже проверены. Зависимость R от
            N при этом может быть любой.
          </Typography.Text>
          <Typography.Text>
            Но если ищем <strong>минимальное R</strong>, первый подходящий вход
            не обязательно даст лучший результат. Это показал предыдущий пример.
          </Typography.Text>
          <Typography.Text>
            Остановиться на первом подходящем N и для наименьшего R можно, когда
            справа всегда дописывается одинаковое число цифр, а исходная запись
            сохраняется: тогда больший вход всегда даёт больший результат.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему результат растёт"
          >
            <Typography.Text>
              Есть важный случай, когда остановка допустима и для минимального
              результата. Пусть исходная запись N полностью сохраняется, справа
              всегда дописывается одно и то же количество k цифр, основание q
              фиксировано. Тогда R = N · qᵏ + A, где 0 ≤ A ≤ qᵏ − 1. Посмотрим,
              где лежат результаты соседних N при k = 2 в двоичной системе:
            </Typography.Text>
            <LessonDiagram
              {...lessonMedia.blocks2_2}
              caption={
                <>
                  При дописывании двух двоичных цифр результат для N лежит в
                  блоке от 4N до 4N + 3. Блок N = 5 — числа 20…23, блок N = 6
                  начинается с 24. Блоки не перекрываются, поэтому больший вход
                  всегда даёт больший результат.
                </>
              }
            />
            <Typography.Text>
              Для N результаты находятся в блоке 4N, 4N + 1, 4N + 2, 4N + 3. Для
              следующего числа начинается следующий блок: 4N + 4, … Они не
              перекрываются. Следовательно,{" "}
              <strong>
                при таком преобразовании результат строго растёт вместе с N
              </strong>{" "}
              — даже если дописываемые цифры выбираются по сложному условию.
            </Typography.Text>

            <Typography.Text>
              Для данного N: N · qᵏ ≤ R ≤ N · qᵏ + qᵏ − 1.
            </Typography.Text>
            <Typography.Text>
              А для следующего числа N + 1 результат не меньше (N + 1) · qᵏ = N
              · qᵏ + qᵏ. Это уже больше максимума для предыдущего N. Значит,
              любой результат входа N + 1 больше любого результата входа N.
            </Typography.Text>
            <Typography.Text>
              Если длина дописываемого блока меняется или исходные цифры
              заменяются, это рассуждение уже неприменимо.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "granicy-perebora",
      navLabel: "Границы перебора",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Где остановить перебор, подсказывает сама задача, а не привычка
              писать <Notation>{"range(1, 1000)"}</Notation>.
            </strong>{" "}
            Перебор — это проверка всех кандидатов подряд. Он даёт обоснованный
            ответ, если выполнены два условия:
          </Typography.Text>
          <ol>
            <li>каждый кандидат обрабатывается точно по алгоритму;</li>
            <li>
              все кандидаты, способные повлиять на ответ, входят в диапазон.
            </li>
          </ol>
          <Typography.Text>
            Главный случай: алгоритм только дописывает цифры, сохраняя исходную
            запись. Тогда R ≥ N. Пусть ищем минимальное подходящее R и уже нашли
            какой-то результат R₀. Любой результат лучше него будет не больше
            R₀. Значит, для такого результата N ≤ R ≤ R₀. Поэтому все входы N{" "}
            {">"} R₀ можно исключить. Это даёт строгую границу даже без знания
            окончательного ответа.
          </Typography.Text>
          <Typography.Text>
            При удалении цифр, инверсии или замене начала записи неравенство R ≥
            N может быть неверным. Его нельзя использовать автоматически.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: граница через число дописанных цифр"
          >
            <Typography.Text>
              Пусть справа всегда дописывают k цифр в системе с основанием q.
              Тогда R = N · qᵏ + A ≥ N · qᵏ. Если требуется R ≤ T, то
              обязательно N · qᵏ ≤ T. Следовательно:
            </Typography.Text>
            <Typography.Text>
              <strong>N ≤ ⌊T / qᵏ⌋.</strong>
            </Typography.Text>
            <Typography.Text>
              Например, справа дописывают две троичные цифры и требуют R ≤ 300:
              9N ≤ 300, N ≤ 33. Больше 33 проверять не требуется.
            </Typography.Text>
            <Typography.Text>
              Если количество дописываемых цифр меняется, но их всегда{" "}
              <strong>не меньше двух</strong>, то оценка R ≥ 9N по-прежнему
              верна.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "dve-proverki",
      navLabel: "Две проверки суммы цифр",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Теперь полностью решим задачу с двумя последовательными проверками
              суммы цифр.
            </strong>{" "}
            Учебное условие:
          </Typography.Text>
          <ol>
            <li>получить двоичную запись N;</li>
            <li>справа дописать остаток от деления суммы её цифр на 2;</li>
            <li>повторить действие для новой записи;</li>
            <li>найти минимальное N, для которого R {">"} 100.</li>
          </ol>
          <Typography.Text>
            Хвост здесь всегда 00 или 10, то есть R = 4N или R = 4N + 2 (подтема
            3). Следовательно, R ≤ 4N + 2. Если N ≤ 24, то R ≤ 4 · 24 + 2 = 98.
            Поэтому все N ≤ 24 точно не подходят.
          </Typography.Text>
          <Typography.Text>
            Проверим 25: 25₁₀ = 11001₂. В записи три единицы — нечётное
            количество. Значит, дописывается <Notation>{"10"}</Notation>: 11001
            → 1100110, R = 4 · 25 + 2 = 102. Условие выполнено: 102 {">"} 100.
            Следовательно, <strong>N_min = 25</strong>. Здесь мы не просто нашли
            подходящее число, но и доказали, что меньших нет.
          </Typography.Text>
          <Typography.Text>
            Программа, буквально повторяющая условие:
          </Typography.Text>
          <CodeBlock
            code={
              "def transform_binary(n):\n    s = bin(n)[2:]\n\n    remainder = s.count('1') % 2\n    s = s + str(remainder)\n\n    remainder = s.count('1') % 2\n    s = s + str(remainder)\n\n    return int(s, 2)\n\n\nfor n in range(1, 27):\n    r = transform_binary(n)\n\n    if r > 100:\n        print(n)\n        break"
            }
            label={"Программа, буквально повторяющая условие"}
            language="python"
            output={"25"}
          />
          <Typography.Text>
            <Notation>{"range(1, 27)"}</Notation> задаёт числа от 1 до 26
            включительно: правая граница в{" "}
            <PythonTerm term="for">
              <Notation>{"range"}</Notation>
            </PythonTerm>{" "}
            не входит. Почему диапазона достаточно? При N = 26: R ≥ 4 · 26 = 104{" "}
            {">"} 100. То есть хотя бы один подходящий вход гарантированно
            встретится не позднее 26.
          </Typography.Text>
          <Typography.Text>
            Если бы вопрос был о минимальном R {">"} 100, ответом было бы 102.
            Здесь это следует и из доказанного роста R вместе с N: справа всегда
            дописываются ровно две цифры.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadan-rezultat",
      navLabel: "Задан результат",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если результат задан, программа ищет вход, при котором он
              получается; разные результаты удобно собирать в множество.
            </strong>{" "}
            Обратный ход удобен руками, но программе проще пройти по входам и
            сравнить результат с заданным. Граница перебора берётся из того же
            рассуждения: алгоритм только дописывает цифры, значит R ≥ N, и входы
            больше R проверять не нужно.
          </Typography.Text>
          <Typography.Text>
            Когда спрашивают количество <strong>различных результатов</strong>,
            одинаковые значения R, полученные от разных входов, учитывают один
            раз. Их удобно складывать в{" "}
            <PythonTerm term="set">множество</PythonTerm>: оно хранит значения
            без повторов.
          </Typography.Text>
          <CodeBlock
            code={
              "results = set()\nfor n in range(1, 103):\n    r = transform_binary(n)\n    results.add(r)\n    if r == 102:\n        print(n)\n\nprint(100 in results, len(results))"
            }
            label={
              "Их удобно складывать в {{set|множество}}: оно хранит значения без повторов"
            }
            language="python"
            output={"25\nFalse 102"}
          />
          <Typography.Text>
            Вход для 102 — это 25; число 100 не получается ни из одного входа.
            Различных результатов 102 — столько же, сколько входов: при
            дописывании ровно двух цифр разные N дают разные R. Для алгоритма,
            который отбрасывает цифры, это уже не так.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "troichnyj-algoritm",
      navLabel: "Троичный алгоритм",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разберём троичный алгоритм, в котором длина дописываемого блока
              меняется.
            </strong>{" "}
            Учебное условие:
          </Typography.Text>
          <ol>
            <li>построить троичную запись N;</li>
            <li>
              если N делится на 3, дописать справа две последние цифры этой
              записи;
            </li>
            <li>
              иначе остаток от деления N на 3 умножить на 7, перевести
              произведение в троичную систему и дописать справа;
            </li>
            <li>найти максимальное R, не превышающее 300.</li>
          </ol>
          <Typography.Text>
            Разделим все входы по остатку от деления на 3. Если остаток равен 0,
            дописываются две последние цифры: R = 9N + (N mod 9). Если остаток
            равен 1: 1 · 7 = 7 = 21₃, дописали две цифры, R = 9N + 7. Если
            остаток равен 2: 2 · 7 = 14 = 112₃, дописали уже три цифры, R = 27N
            + 14.
          </Typography.Text>
          <Typography.Text>
            Например, N = 2 даёт R = 68, а N = 3 — R = 30. Результат уменьшился
            при увеличении входа. Поэтому нельзя остановиться, впервые получив
            значение больше 300, и считать дальнейший поиск бесполезным.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.rnPlottern7_1_33_300_False}
            caption={
              <>
                Результаты для N от 1 до 33. Точки с остатком 2 уходят далеко
                вверх (27N + 14), остальные растут медленнее (около 9N). Среди R
                ≤ 300 наибольший — 286 при N = 31.
              </>
            }
          />
          <Typography.Text>
            Но можно строго ограничить входы. Во всех ветвях дописывается не
            меньше двух троичных цифр: R ≥ 9N. При R ≤ 300 получаем N ≤ 33.
          </Typography.Text>
          <Typography.Text>
            Программа перебирает N от 1 до 33 и запоминает наибольший подходящий
            результат; она использует функцию <Notation>{"to_base"}</Notation>:
          </Typography.Text>
          <CodeBlock
            code={
              "def transform_ternary(n):\n    s = to_base(n, 3)\n\n    if n % 3 == 0:\n        s = s + s[-2:]\n    else:\n        extra = (n % 3) * 7\n        s = s + to_base(extra, 3)\n\n    return int(s, 3)\n\n\nbest_r = -1\n\nfor n in range(1, 34):\n    r = transform_ternary(n)\n\n    if r <= 300:\n        if r > best_r:\n            best_r = r\n\nprint(best_r)"
            }
            label={"Код на Python: def transform_ternary(n):"}
            language="python"
            output={"286"}
          />
          <Typography.Text>
            <Notation>{"best_r"}</Notation> хранит лучший результат среди уже
            проверенных. Начальное значение <Notation>{"-1"}</Notation> выбрано
            потому, что все возможные результаты неотрицательны. Поэтому первый
            подходящий результат окажется больше него. Мы сравниваем именно{" "}
            <Notation>{"r"}</Notation>, поскольку вопрос требует максимальное{" "}
            <strong>выходное число</strong>.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: тот же ответ без программы"
          >
            <Typography.Text>
              Найдём лучший вариант в каждой ветви и сравним их. Для остатка 0
              кандидаты около верхней границы — 30 и 33: N = 33 даёт R = 9 · 33
              + 6 = 303 — не подходит; N = 30 даёт R = 9 · 30 + 3 = 273. При
              меньших положительных кратных 3, то есть N ≤ 27, R ≤ 9 · 27 + 6 =
              249. Значит, лучший результат этой ветви — 273.
            </Typography.Text>
            <Typography.Text>
              Для остатка 1: 9N + 7 ≤ 300, N ≤ 32,55… Наибольшее целое с
              остатком 1 при делении на 3 — это 31: R = 9 · 31 + 7 = 286.
            </Typography.Text>
            <Typography.Text>
              Для остатка 2: 27N + 14 ≤ 300, N ≤ 10,59… Наибольшее подходящее N
              с остатком 2 — это 8: R = 27 · 8 + 14 = 230.
            </Typography.Text>
            <Typography.Text>
              Сравниваем: max(273, 286, 230) = 286. Ответ: <strong>286</strong>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "poisk-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Шаблон",
                note: (
                  <>
                    цикл по N, алгоритм буквально, сверка с примером, фильтр по
                    вопросу
                  </>
                ),
              },
              {
                key: "Наименьшее N",
                note: <>первое подходящее при переборе по возрастанию</>,
              },
              {
                key: "Наименьшее R",
                note: <>перебрать всё и хранить лучший R и его N</>,
              },
              {
                key: "Граница",
                note: <>алгоритм только дописывает цифры — R ≥ N</>,
              },
              {
                key: "Задан R",
                note: <>проверка равенства; различные результаты — множество</>,
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "obratnyj-hod",
      navLabel: "От результата к N",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Вместо перебора N можно перебирать результаты: брать R от границы
              вверх, записывать в двоичной системе и проверять, мог ли алгоритм
              его выдать.
            </strong>{" "}
            Так решают задачу темы без программы — нужен только перевод чисел.
          </Typography.Text>
          <Typography.Text>
            Алгоритм дописывает <Notation>{"10"}</Notation> к чётному N и{" "}
            <Notation>{"01"}</Notation> к нечётному. Значит, у подходящего R
            запись оканчивается на <Notation>{"10"}</Notation> или{" "}
            <Notation>{"01"}</Notation>, а оставшаяся слева часть — запись N
            нужной чётности.
          </Typography.Text>
          <LessonTable
            label={"Проверка результатов больше 150"}
            columns={[
              { label: "R" },
              { label: "Двоичная запись" },
              { label: "Можно получить?" },
            ]}
            rows={[
              ["151", "100101 | 11", "нет: хвост 11"],
              ["152", "100110 | 00", "нет: хвост 00"],
              [
                "153",
                "100110 | 01",
                "нет: 100110 = 38 — чётное, а 01 дописывают к нечётным",
              ],
              ["154", "100110 | 10", "да: 38 чётное, дописано 10"],
            ]}
          />
          <Typography.Text>
            Наименьший результат больше 150 — 154 при N = 38. Здесь справа
            всегда дописываются две цифры, поэтому больший N даёт больший R, и
            наименьшему R соответствует наименьшее N: ответ 38, как и в подтеме
            4.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: по ветвям формулами"
          >
            <Typography.Text>Тот же ответ дают формулы ветвей.</Typography.Text>
            <Typography.Text>
              Переводим действия в формулы: R = 4N + 2 для чётного N, R = 4N + 1
              для нечётного.
            </Typography.Text>
            <Typography.Text>
              Рассмотрим чётные N: 4N + 2 {">"} 150, 4N {">"} 148, N {">"} 37.
              Минимальное чётное число, большее 37, — это 38. Проверка: R = 4 ·
              38 + 2 = 154.
            </Typography.Text>
            <Typography.Text>
              Теперь нечётные N: 4N + 1 {">"} 150, 4N {">"} 149, N {">"} 37,25.
              Первое целое число после 37,25 — это 38.{" "}
              <strong>Но оно чётное и к этой ветви не относится.</strong> Первое
              подходящее нечётное число — 39. Проверка: R = 4 · 39 + 1 = 157.
            </Typography.Text>
            <Typography.Text>
              Сравниваем найденные входы: min(38, 39) = 38. Ответ:{" "}
              <strong>38</strong>.
            </Typography.Text>
            <Typography.Text>
              Так же нужно поступать с ветвями вида «N кратно 3», «остаток от
              деления N на 5 равен 2», «в записи чётное количество единиц»,
              «сумма цифр делится на 3». Полученное из неравенства число
              обязательно проверяется на принадлежность рассматриваемой ветви.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "ot-rezultata",
      navLabel: "Проверка хвоста",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Иногда удобнее идти от результата обратно к исходному числу.
            </strong>{" "}
            Если алгоритм сохраняет запись N и дописывает справа две цифры, то
            запись R без двух последних цифр — это запись N, а две последние
            цифры — дописанный блок.
          </Typography.Text>
          <Typography.Text>
            Возьмём алгоритм с двумя последовательными проверками суммы цифр и
            проверим, может ли он выдать R = 100. 100 = 1100100₂. Разделяем
            запись: <Notation>{"11001 | 00"}</Notation>. Предполагаемый вход
            11001₂ = 25. У числа 25 три единицы. Значит, по алгоритму нужно
            дописать <Notation>{"10"}</Notation>, а не{" "}
            <Notation>{"00"}</Notation>. Следовательно, 100 получить нельзя.
          </Typography.Text>
          <Typography.Text>
            Проверим 102 = 1100110₂. Разделяем:{" "}
            <Notation>{"11001 | 10"}</Notation>. Вход снова равен 25, хвост
            правильный. Значит, 102 получить можно.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Удаление хвоста находит предполагаемый вход. Затем всё равно нужно
              проверить, что алгоритм действительно создаёт именно такой хвост.
            </strong>{" "}
            Одного подходящего окончания результата недостаточно: оно должно
            согласовываться с исходной частью.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rezultat-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Обратный ход",
                note: (
                  <>перебираем R от границы и проверяем, мог ли он получиться</>
                ),
              },
              {
                key: "Хвост записи",
                note: <>должен совпасть с тем, что алгоритм дописывает</>,
              },
              {
                key: "Остаток слева",
                note: <>это N; его свойство (чётность, сумма цифр) проверяют</>,
              },
              {
                key: "R растёт с N",
                note: <>тогда наименьшему R соответствует наименьшее N</>,
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
          Большинство ошибок возникает в нескольких конкретных местах.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "чётность не того",
            value: <>проверили чётность N вместо чётности суммы цифр</>,
            note: <>назвать словами величину, которую проверяет условие</>,
          },
          {
            label: "старая сумма",
            value: <>при повторном шаге использовали старую сумму</>,
            note: <>уточнить, к какой версии записи относится шаг</>,
          },
          {
            label: "str вместо перевода",
            value: (
              <>
                вместо перевода в систему применили <Notation>{"str"}</Notation>
              </>
            ),
            note: <>проверить, в какой системе должен быть дописываемый блок</>,
          },
          {
            label: "блок 01",
            value: (
              <>
                считали <Notation>{"01"}</Notation> блоком длины 1
              </>
            ),
            note: <>отдельно определить длину блока и его значение</>,
          },
          {
            label: "замена без удаления",
            value: <>при замене забыли удалить старые цифры</>,
            note: <>разделить операцию на удаление и вставку</>,
          },
          {
            label: "два replace",
            value: (
              <>
                поменяли <Notation>{"0"}</Notation> и <Notation>{"1"}</Notation>{" "}
                двумя последовательными <Notation>{"replace"}</Notation>
              </>
            ),
            note: <>убедиться, что новые символы не заменяются повторно</>,
          },
          {
            label: "ведущие нули",
            value: <>убрали ведущие нули слишком рано</>,
            note: <>проверить, будут ли ещё действия со строкой</>,
          },
          {
            label: "первый R",
            value: <>выбрали первый подходящий R без доказательства</>,
            note: <>установить, растёт ли результат вместе с входом</>,
          },
          {
            label: "маленький диапазон",
            value: <>взяли необоснованно маленький диапазон</>,
            note: <>вывести границу из свойств преобразования</>,
          },
          {
            label: "> и >=",
            value: (
              <>
                перепутали <Notation>{">"}</Notation> и{" "}
                <Notation>{">="}</Notation>
              </>
            ),
            note: <>перевести формулировку буквально</>,
          },
          {
            label: "r вместо n",
            value: (
              <>
                вывели <Notation>{"r"}</Notation>, хотя спрашивали{" "}
                <Notation>{"n"}</Notation>
              </>
            ),
            note: <>ещё раз прочитать последнюю строку условия</>,
          },
        ]}
      />
      <Typography.Text>
        Формулировки порога переводятся буквально:
      </Typography.Text>
      <VariantPicker
        label={"Формулировка в условии и проверка в Python"}
        variants={[
          {
            label: "больше T",
            value: (
              <>
                <Notation>{"r > T"}</Notation>
              </>
            ),
          },
          {
            label: "не меньше T",
            value: (
              <>
                <Notation>{"r >= T"}</Notation>
              </>
            ),
          },
          {
            label: "меньше T",
            value: (
              <>
                <Notation>{"r < T"}</Notation>
              </>
            ),
          },
          {
            label: "не превышает T",
            value: (
              <>
                <Notation>{"r <= T"}</Notation>
              </>
            ),
          },
          {
            label: "равно T",
            value: (
              <>
                <Notation>{"r == T"}</Notation>
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
          Задание 5 решается в три шага: построить запись числа, буквально
          выполнить каждое действие алгоритма и найти ответ перебором или от
          результата.
        </strong>{" "}
        Ошибки удобнее ловить на маленьких числах: сверь программу с примером из
        условия, прежде чем доверять ответу.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 5 на одной схеме"}
        flow={[
          { name: "Запись", note: "N → строка цифр в нужной системе" },
          {
            name: "Действия",
            note: "каждая команда условия — одна строка кода",
          },
          {
            name: "Ответ",
            note: "перебор с проверкой на примере или от результата",
          },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="5-preobrazovanie-zapisey-chisel"
                subtopic="chislo-i-zapis"
              >
                Число и его запись
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"bin(n)[2:]"}</Notation>,
                note: <>двоичная запись</>,
              },
              {
                key: <Notation>{"int(s, q)"}</Notation>,
                note: <>запись → число</>,
              },
              {
                key: <Notation>{"to_base(n, q)"}</Notation>,
                note: <>троичная и другие системы</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="5-preobrazovanie-zapisey-chisel"
                subtopic="dopisyvanie"
              >
                Дописывание цифр
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"s + '01'"}</Notation>,
                note: <>дописать справа</>,
              },
              {
                key: <Notation>{"'10' + s"}</Notation>,
                note: <>дописать слева</>,
              },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="5-preobrazovanie-zapisey-chisel"
                subtopic="chasti-zapisi"
              >
                Срезы, замены и сумма цифр
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"s[-2:]"}</Notation>,
                note: <>две последние цифры</>,
              },
              { key: <Notation>{"s[::-1]"}</Notation>, note: <>переворот</> },
              {
                key: <Notation>{"s.count('1')"}</Notation>,
                note: <>сумма двоичных цифр</>,
              },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="5-preobrazovanie-zapisey-chisel"
                subtopic="poisk-otveta"
              >
                Решение перебором
              </SubtopicLink>
            ),
            rows: [
              { key: <>наименьшее N</>, note: <>первое подходящее</> },
              {
                key: <>наименьшее R</>,
                note: <>перебрать всё, хранить R и N</>,
              },
              {
                key: <>граница</>,
                note: <>R ≥ N, если цифры только дописывают</>,
              },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="5-preobrazovanie-zapisey-chisel"
                subtopic="ot-rezultata"
              >
                Решение от результата
              </SubtopicLink>
            ),
            rows: [
              { key: <>хвост R</>, note: <>совпадает с дописанным блоком</> },
              {
                key: <>остаток слева</>,
                note: <>это N, его свойство проверяют</>,
              },
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
