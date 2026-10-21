import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelRangeFunctionsLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./excel-range-functions.media";

export const excelRangeFunctionsLesson = defineCourseLesson({
  ...excelRangeFunctionsLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Посчитать сумму",
    "Количество",
    "Среднее и крайние значения диапазона",
    "Выбрать нужный диапазон",
  ],
  accessTier: "free",
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            Итог таблицы покупок в уроке 2.1 считали длинной формулой{" "}
            <Notation>{"=D2+D3+D4+D5"}</Notation>. Для четырёх строк сойдёт, для
            пятисот — нет.{" "}
            <strong>
              Функция — готовая операция с именем: она получает в скобках
              данные, чаще всего диапазон, и возвращает одно значение
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём, как записать функцию, и главные функции по диапазону:
            сумму, количество, среднее и крайние значения.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Как записать функцию",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Имя функции, скобки, в скобках аргументы через точку с запятой;
              двоеточие соединяет границы одного диапазона.
            </strong>{" "}
            Вместо <Notation>{"=D2+D3+D4+D5"}</Notation> пишут{" "}
            <Notation>{"=СУММ(D2:D5)"}</Notation>: <Notation>{"СУММ"}</Notation>{" "}
            — имя, <Notation>{"D2:D5"}</Notation> — диапазон, который нужно
            сложить.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «База»"} />
          <Typography.Text>
            Начни набирать <Notation>{"=СУ"}</Notation> — Excel покажет список
            функций с таким началом, нужную выбирают клавишей{" "}
            <KeyCombo keys={["Tab"]} />. Сумму столбца ставит и кнопка
            «Автосумма» Σ на вкладке «Главная» или клавиши{" "}
            <KeyCombo keys={["Alt", "="]} />: Excel сам предложит диапазон над
            ячейкой — проверь его, прежде чем нажать Enter.
          </Typography.Text>
          <Typography.Text>
            Данные в скобках называются аргументами. В{" "}
            <Notation>{"=ОКРУГЛ(A2;2)"}</Notation> два аргумента: округляемое
            число и количество знаков после запятой. Точка с запятой разделяет
            аргументы, двоеточие соединяет границы диапазона — это разные знаки.
          </Typography.Text>
          <Typography.Text>
            Функция возвращает обычное значение, поэтому её можно вставить в
            формулу: <Notation>{"=СУММ(A2:F2)-МАКС(A2:F2)"}</Notation> — сумма
            строки без наибольшего числа. Для строки 4, 4, 1, 2, 3, 5:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.formulaStepsA2F2441235_3b5b81}
            label={"Вычисление =СУММ(A2:F2)-МАКС(A2:F2) по шагам"}
          />
          <ProofDisclosure
            summary="Тонкости: имена функций и разделители"
            kind="nuance"
          >
            <Typography.Text>
              В курсе — русские имена функций, точка с запятой между
              аргументами и запятая в десятичных дробях: так настроен
              русскоязычный Excel. Адреса A, B, C набирают латиницей. При других
              языковых настройках (локали) разделитель аргументов — запятая,
              десятичный — точка, а имена английские:{" "}
              <Notation>{"SUM"}</Notation> вместо <Notation>{"СУММ"}</Notation>.
              Таблица соответствий — в уроке 5.2. В LibreOffice Calc идеи те же,
              но отдельные названия и клавиши могут отличаться.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "СУММ и счётчики",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"СУММ"}</Notation> складывает числа диапазона,{" "}
              <Notation>{"СЧЁТ"}</Notation> считает ячейки с числами,{" "}
              <Notation>{"СЧЁТЗ"}</Notation> — непустые,{" "}
              <Notation>{"СЧИТАТЬПУСТОТЫ"}</Notation> — пустые.
            </strong>{" "}
            В <Notation>{"A2:A5"}</Notation> лежат 10, 20, текст «нет» и
            пустая ячейка — каждая функция берёт из них свои:
          </Typography.Text>
          <LessonTabs
            label="Что берёт функция"
            tabs={[
              {
                label: "СУММ",
                content: (
                  <LessonDiagram
                    {...lessonMedia.countCells_90bd52}
                    caption={
                      <>Текст и пустота в сумму не входят: 10 + 20 = 30.</>
                    }
                  />
                ),
              },
              {
                label: "СЧЁТ",
                content: (
                  <LessonDiagram
                    {...lessonMedia.countCells_fb1bd7}
                    caption={<>Чисел два — 10 и 20.</>}
                  />
                ),
              },
              {
                label: "СЧЁТЗ",
                content: (
                  <LessonDiagram
                    {...lessonMedia.countCells_e0948f}
                    caption={<>Непустых три: текст «нет» тоже считается.</>}
                  />
                ),
              },
              {
                label: "СЧИТАТЬПУСТОТЫ",
                content: (
                  <LessonDiagram
                    {...lessonMedia.countCells_268863}
                    caption={<>Пустая одна — A5.</>}
                  />
                ),
              },
            ]}
          />
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Счёт»"} />
          <Typography.Text>
            Впиши 0 в <Notation>{"A5"}</Notation>: сумма останется 30, а{" "}
            <Notation>{"СЧЁТ"}</Notation> станет 3 и{" "}
            <Notation>{"СЧИТАТЬПУСТОТЫ"}</Notation> — 0. Одинаковая сумма не
            значит одинаковые данные: ноль — число, пустота — нет.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: пустой текст и логические значения"
            kind="nuance"
          >
            <Typography.Text>
              Формула, которая вернула пустой текст <Notation>{'""'}</Notation>,
              выглядит пустой: <Notation>{"СЧИТАТЬПУСТОТЫ"}</Notation> считает
              её пустой, а <Notation>{"СЧЁТЗ"}</Notation> — непустой, потому что
              в ней есть формула. Такая ячейка попадёт в оба счётчика.
            </Typography.Text>
            <Typography.Text>
              <Notation>{"СУММ"}</Notation> по диапазону пропускает{" "}
              <Notation>{"ИСТИНА"}</Notation> и <Notation>{"ЛОЖЬ"}</Notation>.
              Ячейки с <Notation>{"ИСТИНА"}</Notation> считает{" "}
              <Notation>{"=СЧЁТЕСЛИ(G2:G100;ИСТИНА)"}</Notation> — она будет в
              уроке 3.3.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "СРЗНАЧ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"СРЗНАЧ"}</Notation> делит сумму чисел диапазона на их
              количество: текст и пустые ячейки не участвуют, нули участвуют.
            </strong>{" "}
            Для 4, 7, 10 сумма 21, чисел три, и{" "}
            <Notation>{"=СРЗНАЧ(A2:C2)"}</Notation> даёт 7. Если чисел нет
            совсем, делить не на что — функция выдаёт{" "}
            <Notation>{"#ДЕЛ/0!"}</Notation>.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Среднее»"} />
          <Typography.Text>
            Строки 3 и 4 различаются только нулём и пустотой в{" "}
            <Notation>{"C"}</Notation> — и дают 10 и 15, как в уроке 1.3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Среднее средних",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Среднее средних не равно общему среднему, если группы разного
              размера.
            </strong>{" "}
            В 10А два ученика со средним баллом 80, в 10Б восемь со средним 60.
            Общий средний балл — сумма всех баллов на число всех учеников: (80 ×
            2 + 60 × 8) / (2 + 8) = 64. Простое (80 + 60) / 2 = 70 даёт
            маленькому и большому классу одинаковый вес.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Классы»"} />
          <Typography.Text>
            Сумма баллов класса — его средний балл, умноженный на число
            учеников; так устроена формула в <Notation>{"B5"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "МАКС, МИН, НАИБОЛЬШИЙ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"МАКС"}</Notation> и <Notation>{"МИН"}</Notation> дают
              наибольшее и наименьшее число,{" "}
              <Notation>{"НАИБОЛЬШИЙ"}</Notation> и{" "}
              <Notation>{"НАИМЕНЬШИЙ"}</Notation> — k-е по порядку с учётом
              повторений.
            </strong>{" "}
            Для 3, 8, 8, 2 максимум 8; сколько раз он встречается,{" "}
            <Notation>{"МАКС"}</Notation> не сообщает — это отдельный подсчёт.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"=НАИБОЛЬШИЙ(A2:D2;2)"}</Notation> — второе число по
            убыванию. Для 3, 8, 8, 2 это снова 8: второе место в упорядоченном
            ряду, а не второе различное значение.{" "}
            <Notation>{"НАИМЕНЬШИЙ"}</Notation> считает места по возрастанию.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.rankLine2}
            caption={
              <>
                Числа выстраиваются по порядку, и каждое занимает своё место —
                две восьмёрки занимают места 1 и 2. k — номер места.
              </>
            }
          />
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Крайние»"} />
          <Typography.Text>
            Сумма двух наибольших с учётом повторений —{" "}
            <Notation>{"НАИБОЛЬШИЙ(…;1)"}</Notation> +{" "}
            <Notation>{"НАИБОЛЬШИЙ(…;2)"}</Notation> = 16. Если условие требует
            два разных значения, этого мало — нужен отбор, который исключает
            повтор максимума.
          </Typography.Text>
          <Typography.Text>
            Ещё одна функция по диапазону — <Notation>{"СУММКВ"}</Notation>:
            складывает квадраты чисел. <Notation>{"=СУММКВ(A2:C2)"}</Notation>{" "}
            для 3, 4 и 12 даёт 9 + 16 + 144 = 169 — то же, что{" "}
            <Notation>{"=A2^2+B2^2+C2^2"}</Notation>, но короче для длинного
            диапазона.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Строка или столбец",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Одна и та же функция отвечает на разные вопросы в зависимости от
              диапазона: строка — это одна запись, столбец — все записи.
            </strong>{" "}
            <Notation>{"=СУММ(A2:F2)"}</Notation> складывает шесть чисел одной
            строки, <Notation>{"=СУММ(A2:A100)"}</Notation> — один столбец
            многих записей.
          </Typography.Text>
          <Typography.Text>
            Перед вводом формулы проговори диапазон словами: «складываю шесть
            чисел этой строки» или «складываю стоимости всех покупок». Так
            ловится самая частая ошибка — вычисление не по той оси таблицы.
          </Typography.Text>
          <Typography.Text>
            Функцию по строке копируют вниз, как любую формулу:{" "}
            <Notation>{"=СУММ(A2:F2)"}</Notation> в <Notation>{"G2"}</Notation>{" "}
            после заполнения вниз станет <Notation>{"=СУММ(A3:F3)"}</Notation> в{" "}
            <Notation>{"G3"}</Notation> — сумма своей строки.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet6} label={"Лист «Строки»"} />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            Чем отличаются знаки : и ; в{" "}
            <Notation>{"=СУММ(A2:A5;C2)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Двоеточие соединяет границы диапазона{" "}
            <Notation>{"A2:A5"}</Notation>, точка с запятой отделяет второй
            аргумент <Notation>{"C2"}</Notation>: складываются четыре ячейки и
            ещё одна.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2:A5"}</Notation> — 10, «нет», пусто и 0. Что дадут{" "}
            <Notation>{"СЧЁТ"}</Notation> и <Notation>{"СЧЁТЗ"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"СЧЁТ"}</Notation> — 2 (10 и 0 — числа),{" "}
            <Notation>{"СЧЁТЗ"}</Notation> — 3 (пустая ячейка не считается).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В одной группе 2 человека со средним баллом 80, в другой 8 человек
            со средним 60. Почему общий средний балл не 70?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            70 — среднее средних, оно даёт группам одинаковый вес. Общий: (80 ×
            2 + 60 × 8) / 10 = 64.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Чем отличается вопрос, на который отвечает{" "}
            <Notation>{"=МАКС(B2:B500)"}</Notation>, от вопроса{" "}
            <Notation>{"=МАКС(A2:F2)"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Первая — наибольшее значение столбца B по всем записям, вторая —
            наибольшее из шести чисел одной строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            В строке 6, 1, 6, 2 найди сумму после исключения одного
            максимального элемента одной формулой.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=СУММ(A1:D1)-МАКС(A1:D1)"}</Notation>, то есть 15 − 6 =
            9.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"G2"}</Notation> записано{" "}
            <Notation>{"=СРЗНАЧ(A2:F2)"}</Notation> и скопировано вниз. Какая
            формула окажется в <Notation>{"G10"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=СРЗНАЧ(A10:F10)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Функция по диапазону сводит много ячеек к одному числу — важно, какие
        ячейки она берёт. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Запись",
            note: (
              <>
                <Notation>{"=СУММ(D2:D5)"}</Notation>: имя, скобки, аргументы
                через «;», диапазон через «:».
              </>
            ),
          },
          {
            key: "Счётчики",
            note: (
              <>
                <Notation>{"СЧЁТ"}</Notation> — числа,{" "}
                <Notation>{"СЧЁТЗ"}</Notation> — непустые,{" "}
                <Notation>{"СЧИТАТЬПУСТОТЫ"}</Notation> — пустые.
              </>
            ),
          },
          {
            key: "СРЗНАЧ",
            note: (
              <>
                Сумма чисел на их количество: ноль участвует, пустота нет; нет
                чисел — <Notation>{"#ДЕЛ/0!"}</Notation>.
              </>
            ),
          },
          {
            key: "Крайние",
            note: (
              <>
                <Notation>{"МАКС"}</Notation>, <Notation>{"МИН"}</Notation>;{" "}
                <Notation>{"НАИБОЛЬШИЙ(диапазон;k)"}</Notation> — k-е место с
                повторами.
              </>
            ),
          },
          {
            key: "Диапазон",
            note: <>Строка — одна запись, столбец — все записи.</>,
          },
        ]}
      />
    </>
  ),
  status: "published",
});
