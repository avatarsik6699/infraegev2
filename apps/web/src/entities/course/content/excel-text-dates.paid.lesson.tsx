// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { CourseTypes } from "../course.types";
import { lessonMedia } from "./excel-text-dates.paid.media";

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            После импорта в одной таблице код «007» — текст, а в другой 7 —
            число; у имени лишние пробелы; дата записана текстом. Для Excel это
            разные значения, и поиск их не сопоставит.{" "}
            <strong>
              Перед поиском и подсчётом данные приводят к одному виду: текст
              очищают и режут функциями, даты строят функцией{" "}
              <Notation>{"ДАТА"}</Notation>, а период задают началом и следующей
              за концом границей
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём проверку типа, части текста и склейку, даты и период с 1 по
            15 октября.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Одинаковые на вид значения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Одинаковые на вид значения могут различаться пробелами, типом или
              записью даты.
            </strong>{" "}
            Перед поиском проверь несколько ячеек в строке формул: тип и
            пробелы видны там, а не в ячейке.
          </Typography.Text>
          <Typography.Text>
            Тип проверяют функции: <Notation>{"ЕЧИСЛО(A2)"}</Notation> — число
            ли это, <Notation>{"ЕТЕКСТ(A2)"}</Notation> — текст ли.{" "}
            <Notation>{"ЗНАЧЕН(A2)"}</Notation> превращает текст вида «007» или
            «12,5» в число; формат «Числовой» этого не делает — он меняет только
            вид.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Типы»"} />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Части текста",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Текстовые функции считают символы с первого:{" "}
              <Notation>{"ЛЕВСИМВ"}</Notation> и{" "}
              <Notation>{"ПРАВСИМВ"}</Notation> берут края,{" "}
              <Notation>{"ПСТР"}</Notation> — середину,{" "}
              <Notation>{"ДЛСТР"}</Notation> — длину.
            </strong>{" "}
            Каждая функция — на слове ABCDE; поменяй слово в{" "}
            <Notation>{"A2"}</Notation>:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Текст»"} />
          <Typography.Text>
            В <Notation>{"ПСТР"}</Notation> позиции начинаются с 1. Для текста
            ABCDE формула <Notation>{"=ПСТР(A2;2;3)"}</Notation> даёт BCD:
            начать со второй позиции и взять три символа. Третий аргумент —
            количество, а не номер последнего символа.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.textSlotsABCDE}
            caption={
              <>
                Символы пронумерованы с 1. ЛЕВСИМВ берёт символы от начала,
                ПРАВСИМВ — от конца, ПСТР — с указанной позиции, и у всех трёх
                последнее число — сколько символов взять.
              </>
            }
          />
          <Typography.Text>
            Строки 6 и 7 листа чистят текст.{" "}
            <Notation>{"ПОДСТАВИТЬ(текст;что;чем)"}</Notation> заменяет каждое
            вхождение: <Notation>{'=ПОДСТАВИТЬ(A6;"-";"")'}</Notation> убирает
            дефисы из 12-34-5. <Notation>{"СЖПРОБЕЛЫ"}</Notation> убирает
            пробелы по краям и оставляет по одному между словами.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: пробел, который не убирается"
            kind="nuance"
          >
            <Typography.Text>
              В тексте, скопированном с сайта, бывает неразрывный пробел —{" "}
              <Notation>{"СЖПРОБЕЛЫ"}</Notation> его не трогает. Сначала замени
              его обычным: <Notation>{'ПОДСТАВИТЬ(A2;СИМВОЛ(160);" ")'}</Notation>,
              потом применяй <Notation>{"СЖПРОБЕЛЫ"}</Notation>.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Склейка текста",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Знак & склеивает текст; результат текстовой функции — текст, даже
              если в нём цифры.
            </strong>{" "}
            <Notation>{'=A2&" "&B2'}</Notation> соединяет имя и фамилию через
            пробел; без <Notation>{'" "'}</Notation> части склеятся вплотную.
            В строке 4 <Notation>{"ПРАВСИМВ"}</Notation> вернула «34» — текст,
            поэтому <Notation>{"ЕЧИСЛО"}</Notation> даёт{" "}
            <Notation>{"ЛОЖЬ"}</Notation>; для арифметики его превращают в число:{" "}
            <Notation>{"=ЗНАЧЕН(C4)+1"}</Notation>.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Склейка»"} />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "ДАТА и её части",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Дату строят функцией{" "}
              <Notation>{"ДАТА(год; месяц; день)"}</Notation>, а части даты
              достают <Notation>{"ДЕНЬ"}</Notation>,{" "}
              <Notation>{"МЕСЯЦ"}</Notation> и <Notation>{"ГОД"}</Notation>.
            </strong>{" "}
            <Notation>{"ДАТА(2026;10;5)"}</Notation> создаёт дату 5 октября 2026
            года из отдельных чисел: год, месяц, день.{" "}
            <Notation>{"ДЕНЬ"}</Notation>, <Notation>{"МЕСЯЦ"}</Notation> и{" "}
            <Notation>{"ГОД"}</Notation> извлекают соответствующую часть уже
            распознанной даты.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Даты»"} />
          <Typography.Text>
            Месяц или день за пределами обычных значений{" "}
            <Notation>{"ДАТА"}</Notation> переносит дальше:{" "}
            <Notation>{"=ДАТА(2026;13;1)"}</Notation> — это 1 января 2027 года.
            Так удобно получить «первое число следующего месяца».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Период",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Период надёжнее задавать как «не раньше начала и строго раньше
              следующей границы».
            </strong>{" "}
            Если в A находятся только даты без времени, для периода с 1 по 15
            октября включительно можно проверить{" "}
            <Notation>{"A2>=ДАТА(2026;10;1)"}</Notation> и{" "}
            <Notation>{"A2<=ДАТА(2026;10;15)"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Если значения содержат и время, безопаснее задать верхнюю границу
            как «строго раньше следующего дня»:{" "}
            <Notation>{"A2<ДАТА(2026;10;16)"}</Notation>. Дата 15 октября без
            времени означает начало этого дня; сравнение «не позже 15 октября
            00:00» не включит 15 октября 12:30.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.periodLine01102026_16102026_151020261230}
            caption={
              <>
                Период с 1 по 15 октября включительно: 1 октября входит, 16
                октября 00:00 уже нет. Момент 15.10 12:30 внутри, хотя «не позже
                15.10» его отрезала бы.
              </>
            }
          />
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Период»"} />
          <Typography.Text>
            В <Notation>{"A4"}</Notation> — 15 октября 12:30: к дате прибавлено
            12,5 часа, то есть 12,5/24 суток; формат даты показывает только
            день. Проверка «≤ 15 октября» отбросила этот момент, «{"<"} 16
            октября» — нет.
          </Typography.Text>
          <Typography.Text>
            Общий удобный вид периода: начало включено, следующая граница не
            включена. Для всего октября — не раньше 1 октября и раньше 1 ноября.
            Этот приём предотвращает ошибки с последним днём.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2"}</Notation> — текст «2026-10-05». Как одной
            формулой убрать дефисы? Будет ли результат числом?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'=ПОДСТАВИТЬ(A2;"-";"")'}</Notation> даёт 20261005 — это
            текст; числом его делает <Notation>{"ЗНАЧЕН"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2"}</Notation> — «Иванов», в{" "}
            <Notation>{"B2"}</Notation> — «И.». Запиши формулу, которая даст
            «Иванов И.».
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'=A2&" "&B2'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Запиши проверку «дата в <Notation>{"A2"}</Notation> относится к
            ноябрю 2026 года» в виде «не раньше начала и строго раньше следующей
            границы».
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=И(A2>=ДАТА(2026;11;1);A2<ДАТА(2026;12;1))"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Сколько дней от <Notation>{"=ДАТА(2026;2;27)"}</Notation> до{" "}
            <Notation>{"=ДАТА(2026;3;2)"}</Notation>? Какой датой окажется{" "}
            <Notation>{"=ДАТА(2026;2;30)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            3 дня; 2 марта 2026 года: февраль 2026 года — 28 дней.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{"=ЕЧИСЛО(ПРАВСИМВ(A2;2))"}</Notation> возвращает{" "}
            <Notation>{"ЛОЖЬ"}</Notation>, даже если в{" "}
            <Notation>{"A2"}</Notation> число 1234?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Результат <Notation>{"ПРАВСИМВ"}</Notation> — текст «34», а не
            число.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Из кода «AB-12-345» получи последние три цифры числом и прибавь к
            ним 1.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=ЗНАЧЕН(ПРАВСИМВ(A2;3))+1"}</Notation> — 346.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Прежде чем искать и считать, приведи данные к одному виду. Вот что
        понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Тип",
            note: (
              <>
                <Notation>{"ЕЧИСЛО"}</Notation> и{" "}
                <Notation>{"ЕТЕКСТ"}</Notation> проверяют,{" "}
                <Notation>{"ЗНАЧЕН"}</Notation> переводит числовой текст в
                число.
              </>
            ),
          },
          {
            key: "Части текста",
            note: (
              <>
                <Notation>{"ЛЕВСИМВ"}</Notation>,{" "}
                <Notation>{"ПРАВСИМВ"}</Notation>, <Notation>{"ПСТР"}</Notation>{" "}
                считают позиции с 1; у <Notation>{"ПСТР"}</Notation> третий
                аргумент — количество.
              </>
            ),
          },
          {
            key: "Чистка",
            note: (
              <>
                <Notation>{"ПОДСТАВИТЬ"}</Notation> заменяет,{" "}
                <Notation>{"СЖПРОБЕЛЫ"}</Notation> убирает лишние пробелы, &
                склеивает; результат — текст.
              </>
            ),
          },
          {
            key: "Даты",
            note: (
              <>
                <Notation>{"ДАТА"}</Notation> строит из чисел,{" "}
                <Notation>{"ДЕНЬ"}</Notation>, <Notation>{"МЕСЯЦ"}</Notation>,{" "}
                <Notation>{"ГОД"}</Notation> разбирают.
              </>
            ),
          },
          {
            key: "Период",
            note: <>Не раньше начала и строго раньше следующей границы.</>,
          },
        ]}
      />
    </>
  ),
};

export default content;
