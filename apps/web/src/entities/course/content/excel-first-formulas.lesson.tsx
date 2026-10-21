import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonStepper,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelFirstFormulasLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./excel-first-formulas.media";

export const excelFirstFormulasLesson = defineCourseLesson({
  ...excelFirstFormulasLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Записать формулу со ссылками",
    "Учесть порядок действий",
    "Узнать ошибку по её коду",
    "Найти стоимость каждой покупки и итог",
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
            В таблице покупок тетрадь стоит 40 рублей, их взяли 5 штук.
            Стоимость 200 можно сосчитать в уме и вписать в ячейку — но если
            цена изменится, вписанное число останется старым.{" "}
            <strong>
              Формула считает стоимость сама и пересчитывает её, когда меняются
              данные
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Запишем формулы для стоимости каждой покупки и общей суммы,
            разберём знаки действий, порядок вычислений и ошибки, которые
            показывает Excel.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Формула и результат",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Формула начинается со знака =; ячейка показывает результат, а
              строка формул — саму формулу.
            </strong>{" "}
            Введи в пустую ячейку <Notation>{"=2+3"}</Notation> и нажми Enter:
            в ячейке появится 5. Выбери её снова — в строке формул видно{" "}
            <Notation>{"=2+3"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Вместо чисел в формулу пишут адреса.{" "}
            <Notation>{"=B2*C2"}</Notation> значит «значение{" "}
            <Notation>{"B2"}</Notation> умножить на значение{" "}
            <Notation>{"C2"}</Notation>»: при цене 40 и количестве 5 получится
            200.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «База»"} />
          <Typography.Text>
            Выбери <Notation>{"D2"}</Notation>: ячейки, из которых формула берёт
            значения, обведены тем же цветом, что их адреса в строке формул.
            Замени количество тетрадей на 6 — стоимость сама станет 240. А в{" "}
            <Notation>{"D3"}</Notation> число 60 набрано вручную: измени цену
            ручки — оно останется прежним. Поэтому результат вычисления
            записывают формулой, а не числом.
          </Typography.Text>
          <Typography.Text>
            Адрес не обязательно набирать с клавиатуры — достаточно щёлкнуть по
            ячейке. Так в формулу не попадёт опечатка:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.pointEntry}
            label={"Формула =B2*C2, набранная щелчками по ячейкам"}
          />
          <ProofDisclosure
            summary="Тонкости: результат не пересчитался"
            kind="nuance"
          >
            <Typography.Text>
              Если после правки чисел результаты формул не меняются, проверь
              режим вычислений: нужен автоматический пересчёт (в Excel —
              «Формулы → Параметры вычислений → Автоматически»). Пересчёт и
              сохранение — разные действия: первый обновляет результаты, второе
              записывает книгу на диск.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Знаки действий",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Умножение в формуле — звёздочка <Notation>{"*"}</Notation>, деление
              — косая черта <Notation>{"/"}</Notation>, степень — знак{" "}
              <Notation>{"^"}</Notation>.
            </strong>{" "}
            Сложение, вычитание и скобки — как в математике:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Действия»"} />
          <Typography.Text>
            Знак умножения не пропускают: пишут <Notation>{"=2*A2"}</Notation>,
            а запись 2A2 Excel не примет. Знак % — не остаток от деления, а
            сотые доли: <Notation>{"=10%"}</Notation> даёт 0,1. Остаток считает
            функция <Notation>{"ОСТАТ"}</Notation> — она будет в уроке 3.2.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Порядок действий",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала степень, потом умножение и деление, потом сложение и
              вычитание; скобки меняют порядок.
            </strong>{" "}
            <Notation>{"=2+3*4"}</Notation> даёт 14: сначала умножение.{" "}
            <Notation>{"=(2+3)*4"}</Notation> даёт 20. Для среднего двух ячеек
            нужна запись <Notation>{"=(A2+B2)/2"}</Notation>: в{" "}
            <Notation>{"=A2+B2/2"}</Notation> делится только второе слагаемое.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Порядок»"} />
          <Typography.Text>
            Excel сначала подставляет значения ячеек, потом выполняет действия
            по порядку. Пройди оба вычисления — каждый шаг заменяет одну часть
            формулы её значением:
          </Typography.Text>
          <LessonTabs
            label="Порядок действий"
            tabs={[
              {
                label: "Без скобок",
                content: (
                  <LessonStepper
                    {...lessonMedia.formulaStepsA212B25_377dce}
                    label={"Вычисление =A2+B2/2 по шагам"}
                  />
                ),
              },
              {
                label: "Со скобками",
                content: (
                  <LessonStepper
                    {...lessonMedia.formulaStepsA212B25_53e529}
                    label={"Вычисление =(A2+B2)/2 по шагам"}
                  />
                ),
              },
            ]}
          />
          <ProofDisclosure
            summary="Тонкости: =-2^2 в Excel равно 4"
            kind="nuance"
          >
            <Typography.Text>
              В математике −2² означает −(2²) = −4. В Excel минус перед числом
              выполняется раньше степени, поэтому{" "}
              <Notation>{"=-2^2"}</Notation> даёт 4, а{" "}
              <Notation>{"=-A2^2"}</Notation> при <Notation>{"A2"}</Notation> = 3
              — 9, а не −9. Чтобы смысл не зависел от этого правила, ставь
              скобки: <Notation>{"=-(A2^2)"}</Notation> даёт −9,{" "}
              <Notation>{"=(-A2)^2"}</Notation> — 9.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Ошибки в формуле",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если формулу нельзя вычислить, вместо результата в ячейке
              появляется код ошибки; исправляют его причину.
            </strong>{" "}
            Первыми обычно встречаются две ошибки с кодом и одна без кода:
          </Typography.Text>
          <LessonTabs
            label="Ошибки в формуле"
            tabs={[
              {
                label: "#ДЕЛ/0!",
                content: (
                  <>
                    <Typography.Text>
                      Деление на ноль не определено. В{" "}
                      <Notation>{"B3"}</Notation> количество 0, и{" "}
                      <Notation>{"=A3/B3"}</Notation> не может дать цену штуки.
                      Причина — в данных: неверный знаменатель, пропуск или
                      особый случай, который условие задачи описывает отдельно.
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheet4}
                      label={"Лист «Деление»"}
                    />
                  </>
                ),
              },
              {
                label: "#ЗНАЧ!",
                content: (
                  <>
                    <Typography.Text>
                      В <Notation>{"B2"}</Notation> набрано «40 руб.» — это
                      текст, а не число (урок 1.3), и умножить его на количество
                      нельзя. Введи в <Notation>{"B2"}</Notation> число 40 —
                      появится 200; рубли указывают в заголовке.
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheetValue}
                      label={"Лист «Текст»"}
                    />
                  </>
                ),
              },
              {
                label: "Нет знака =",
                content: (
                  <>
                    <Typography.Text>
                      В <Notation>{"D2"}</Notation> набрано B2*C2 без знака
                      равенства. Excel принял это за текст и показал как есть —
                      кода ошибки нет, но и результата нет. Допиши = в начало —
                      появится 200.
                    </Typography.Text>
                    <SheetBlock
                      {...lessonMedia.sheetNoEq}
                      label={"Лист «Без равенства»"}
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
      id: "s5",
      navLabel: "Стоимость и итог",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Стоимость всех покупок — формула в каждой строке и формула итога.
            </strong>{" "}
            В <Notation>{"D2"}</Notation> стоит <Notation>{"=B2*C2"}</Notation>,
            в <Notation>{"D3"}</Notation> — <Notation>{"=B3*C3"}</Notation>, и
            так до <Notation>{"D5"}</Notation>. Итог в{" "}
            <Notation>{"D7"}</Notation> складывает четыре стоимости: 200 + 60 +
            240 + 60 = 560.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «База»"} />
          <Typography.Text>
            Формулы в <Notation>{"D2:D5"}</Notation> одинаковы по смыслу: «цена
            этой строки умножить на количество этой строки». Здесь они набраны
            по одной; в уроке 2.2 одна формула заполнит весь столбец сама.
          </Typography.Text>
          <Typography.Text>
            Следи за единицами: рубли за штуку, умноженные на штуки, дают рубли.
            Если упаковка весит 250 г, то 8 упаковок весят 8 × 250 = 2000 г, а
            килограммы получаются отдельным действием — делением на 1000:{" "}
            <Notation>{"=8*250/1000"}</Notation> даёт 2.
          </Typography.Text>
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
            В ячейке видно 200. Как узнать, набрано это число или посчитано
            формулой?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Выбрать ячейку и посмотреть в строку формул: там будет либо число
            200, либо формула, например <Notation>{"=B2*C2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Чему равны <Notation>{"=2+3*4"}</Notation> и{" "}
            <Notation>{"=(2+3)*4"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            14 и 20: без скобок сначала умножение, скобки заставляют сначала
            сложить.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2"}</Notation> — 10, в <Notation>{"B2"}</Notation> —
            4. Что даст <Notation>{"=A2+B2/2"}</Notation> и почему это не
            среднее?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            12: делится только <Notation>{"B2"}</Notation>. Среднее —{" "}
            <Notation>{"=(A2+B2)/2"}</Notation>, то есть 7.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            Почему запись 2A2 внутри формулы не работает и как её исправить?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Умножение пишется явно: <Notation>{"=2*A2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Формула <Notation>{"=B2*C2"}</Notation> показывает{" "}
            <Notation>{"#ЗНАЧ!"}</Notation>. Где искать причину?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В данных: в <Notation>{"B2"}</Notation> или{" "}
            <Notation>{"C2"}</Notation> текст вместо числа — например, «40
            руб.».
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Формула хранит способ вычисления, а ячейка показывает результат. Вот
        что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Формула",
            note: (
              <>
                Начинается с =; адрес вписывают щелчком по ячейке; набранное
                число не пересчитывается.
              </>
            ),
          },
          {
            key: "Знаки",
            note: (
              <>
                <Notation>{"*"}</Notation> — умножение, / — деление,{" "}
                <Notation>{"^"}</Notation> — степень;{" "}
                <Notation>{"=2*A2"}</Notation>, а не 2A2;{" "}
                <Notation>{"=10%"}</Notation> — это 0,1.
              </>
            ),
          },
          {
            key: "Порядок",
            note: (
              <>
                Степень, затем * и /, затем + и −; среднее двух —{" "}
                <Notation>{"=(A2+B2)/2"}</Notation>.
              </>
            ),
          },
          {
            key: "Ошибки",
            note: (
              <>
                <Notation>{"#ДЕЛ/0!"}</Notation> — деление на ноль,{" "}
                <Notation>{"#ЗНАЧ!"}</Notation> — текст в вычислении; без = —
                просто текст.
              </>
            ),
          },
          {
            key: "Итог",
            note: (
              <>
                Формула в каждой строке и формула суммы; единицы результата
                следуют из единиц данных.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
