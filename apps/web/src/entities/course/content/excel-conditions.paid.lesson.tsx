// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTabs,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { CourseTypes } from "../course.types";
import { lessonMedia } from "./excel-conditions.paid.media";

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В столбце A — числа. Нужно отметить те, что лежат от 10 до 20
            включительно, и сосчитать их. Формула должна спросить про каждую
            строку «подходит ли?» и записать ответ.{" "}
            <strong>
              Сравнение даёт <Notation>{"ИСТИНА"}</Notation> или{" "}
              <Notation>{"ЛОЖЬ"}</Notation>, а <Notation>{"ЕСЛИ"}</Notation>{" "}
              превращает такой ответ в нужное значение — например, в 1 для
              подходящей строки и 0 для остальных
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём знаки сравнения, функции <Notation>{"И"}</Notation>,{" "}
            <Notation>{"ИЛИ"}</Notation>, <Notation>{"НЕ"}</Notation> и{" "}
            <Notation>{"ЕСЛИ"}</Notation>, а затем сосчитаем подходящие строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Знаки сравнения",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Знаки сравнения: = {"<>"} {"<"} {">"} {"<"}= {">"}=, и первое «=»
              формулы — не сравнение.
            </strong>{" "}
            <Notation>{"=A2=5"}</Notation> проверяет равенство,{" "}
            <Notation>{"=A2<>5"}</Notation> — неравенство,{" "}
            <Notation>{"=A2>=5"}</Notation> — «не меньше»,{" "}
            <Notation>{"=A2<=5"}</Notation> — «не больше». Поменяй число в{" "}
            <Notation>{"A2"}</Notation> и посмотри, как меняются ответы:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Проверка»"} />
          <Typography.Text>
            В записи <Notation>{"=A2=5"}</Notation> первый знак = сообщает, что
            начинается формула. Второй выполняет сравнение. Формула возвращает{" "}
            <Notation>{"ИСТИНА"}</Notation> или <Notation>{"ЛОЖЬ"}</Notation>.
            Присваивания числа 5 ячейке <Notation>{"A2"}</Notation> здесь нет.
          </Typography.Text>
          <Typography.Text>
            Фразы «больше 10» и «не меньше 10» различаются на границе: число 10
            подходит только во втором случае. Для «от 10 до 20 включительно»
            нужно проверить обе границы — но не математической цепочкой{" "}
            <Notation>{"10<=A2<=20"}</Notation>: Excel выполнит сравнения по
            очереди, и смысл получится другой.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.formulaStepsA215_bc6ada}
            label={"Вычисление цепочки =10<=A2<=20 по шагам"}
          />
          <Typography.Text>
            Для 15 цепочка даёт <Notation>{"ЛОЖЬ"}</Notation>, хотя 15 лежит
            между 10 и 20: второе сравнение проверяет уже не{" "}
            <Notation>{"A2"}</Notation>, а результат первого.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "И, ИЛИ, НЕ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"И"}</Notation> истинна, когда истинны все проверки;{" "}
              <Notation>{"ИЛИ"}</Notation> — когда истинна хотя бы одна;{" "}
              <Notation>{"НЕ"}</Notation> переворачивает ответ.
            </strong>{" "}
            <Notation>{"=И(A2>=10;A2<=20)"}</Notation> проверяет, что число
            лежит от 10 до 20 включительно, а{" "}
            <Notation>{"=ИЛИ(A2<10;A2>20)"}</Notation> — что оно вне этого
            промежутка. На числовой прямой видно, что остаётся от двух
            проверок:
          </Typography.Text>
          <LessonTabs
            label="И, ИЛИ"
            tabs={[
              {
                label: "И",
                content: (
                  <LessonDiagram
                    {...lessonMedia.intervalLogic_0f35be}
                    caption={
                      <>
                        И оставляет общую часть двух лучей — от 10 до 20.
                        Закрашенная точка: граница входит.
                      </>
                    }
                  />
                ),
              },
              {
                label: "ИЛИ",
                content: (
                  <LessonDiagram
                    {...lessonMedia.intervalLogic_c5d661}
                    caption={
                      <>
                        ИЛИ объединяет два луча. Пустая точка: граница не
                        входит, поэтому 10 и 20 дают ЛОЖЬ.
                      </>
                    }
                  />
                ),
              },
            ]}
          />
          <Typography.Text>
            <Notation>{"НЕ"}</Notation> меняет <Notation>{"ИСТИНА"}</Notation>{" "}
            на <Notation>{"ЛОЖЬ"}</Notation> и наоборот:{" "}
            <Notation>{"=НЕ(A2=5)"}</Notation> — то же, что{" "}
            <Notation>{"=A2<>5"}</Notation>. Пригождается для сложных проверок:{" "}
            <Notation>{"=НЕ(И(A2>=10;A2<=20))"}</Notation> — «вне промежутка».
          </Typography.Text>
          <Typography.Text>
            Все четыре сочетания двух проверок — на одном листе; столбцы C, D и
            E сравнивают <Notation>{"И"}</Notation>,{" "}
            <Notation>{"ИЛИ"}</Notation> и «ровно одна»:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Сочетания»"} />
          <Typography.Text>
            <Notation>{"ИЛИ"}</Notation> истинна и тогда, когда истинны обе
            проверки (строка 5). Для «ровно одна из двух» нужна другая проверка:{" "}
            <Notation>{"=A2<>B2"}</Notation> истинна именно тогда, когда
            ответы различаются.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: «ровно одна» через И, ИЛИ, НЕ"
            kind="nuance"
          >
            <Typography.Text>
              Та же проверка без сравнения логических значений:{" "}
              <Notation>{"=И(ИЛИ(A2;B2);НЕ(И(A2;B2)))"}</Notation> — «хотя бы
              одна, но не обе».
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "ЕСЛИ и признак",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"ЕСЛИ"}</Notation> выбирает одно из двух значений по
              условию.
            </strong>
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                formula:
                  "=ЕСЛИ(условие;значение_если_истина;значение_если_ложь)",
              },
            ]}
            label="Шаблон формулы"
          />
          <Typography.Text>
            Например, <Notation>{'=ЕСЛИ(A2>=60;"зачёт";"незачёт")'}</Notation>{" "}
            возвращает текст. Кавычки показывают, что «зачёт» — буквальный
            текст, а не имя ячейки или функции. Числа и ссылки обычно не
            заключают в кавычки.
          </Typography.Text>
          <Typography.Text>
            Для подсчёта подходящих строк удобно возвращать числовой признак:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(И(A2>=10;A2<=20);1;0)" }]}
            label="Формула"
          />
          <Typography.Text>
            Вложенную формулу Excel вычисляет изнутри наружу. При{" "}
            <Notation>{"A2"}</Notation> = 15:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.formulaStepsA215_f9d69b}
            label={"Вычисление =ЕСЛИ(И(A2>=10;A2<=20);1;0) по шагам"}
          />
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Признак»"} />
          <Typography.Text>
            Подходящая строка даёт 1, неподходящая — 0, поэтому сумма признаков{" "}
            <Notation>{"=СУММ(C2:C6)"}</Notation> равна числу подходящих строк.
            Границы 10 и 20 вошли в подсчёт: проверки «не меньше» и «не
            больше».
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Условие по столбцам",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сложное условие удобнее разложить на столбцы: каждая проверка в
              своём столбце, итоговый признак — их И.
            </strong>{" "}
            Строка подходит, если сумма трёх чисел больше 10 и среди них есть
            пятёрка. Каждая проверка — в своём столбце: D — сумма, E — пятёрка, а
            в F итог <Notation>{"=ЕСЛИ(И(D2;E2);1;0)"}</Notation>. Так видно, на
            каком условии строка перестала подходить.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Столбцы»"} />
          <Typography.Text>
            В строке 3 видно сразу: сумма подходит, а пятёрки нет. Когда всё
            работает, столбцы можно объединить в одну формулу, но это не
            обязательно: несколько коротких проверок легче проверить, чем одну
            длинную.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Защита деления",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Деление защищают выбором ветви <Notation>{"ЕСЛИ"}</Notation>, а не
              скрытием ошибки.
            </strong>{" "}
            Средняя цена штуки — сумма, делённая на число штук; при нуле штук
            делить нельзя. <Notation>{'=ЕСЛИ(B2=0;"нет данных";A2/B2)'}</Notation>{" "}
            при нуле даже не начинает делить, а выбирает текст.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Деление»"} />
          <Typography.Text>
            Столбец D проверяет то же через <Notation>{"И"}</Notation> — и в
            строке 3 получает <Notation>{"#ДЕЛ/0!"}</Notation>:{" "}
            <Notation>{"И"}</Notation> вычисляет все свои аргументы, даже если
            первый уже ложен. Поэтому от деления на ноль защищает только{" "}
            <Notation>{"ЕСЛИ"}</Notation>.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: почему не ЕСЛИОШИБКА"
            kind="nuance"
          >
            <Typography.Text>
              <Notation>{"=ЕСЛИОШИБКА(A2/B2;0)"}</Notation> при любой ошибке
              возвращает 0. Ноль штук превратится в «среднюю цену 0», а заодно
              спрячутся неверная ссылка или текст вместо числа. Явная ветвь{" "}
              <Notation>{"ЕСЛИ"}</Notation> отделяет «нет данных» от настоящего
              нуля.
            </Typography.Text>
          </ProofDisclosure>
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
            В <Notation>{"A2"}</Notation> находится балл. Запиши проверку
            принадлежности диапазону от 40 до 70 включительно. Возврати 1 для
            подходящего балла и 0 для остальных.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=ЕСЛИ(И(A2>=40;A2<=70);1;0)"}</Notation>. На значениях
            40 и 70 результат равен 1, на 39 и 71 — 0.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"G2"}</Notation> и <Notation>{"H2"}</Notation>{" "}
            находятся результаты двух логических проверок. Запиши условие, что
            истинна ровно одна из них.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=G2<>H2"}</Notation>. Результаты должны различаться:
            один истинный, другой ложный. Если оба истинны, ответ ложный.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Запиши проверку «A2 лежит вне промежутка от 5 до 9 включительно»
            двумя способами: через <Notation>{"ИЛИ"}</Notation> и через{" "}
            <Notation>{"НЕ"}</Notation>.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=ИЛИ(A2<5;A2>9)"}</Notation> и{" "}
            <Notation>{"=НЕ(И(A2>=5;A2<=9))"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Что вернёт <Notation>{"=ЕСЛИ(A2>B2;A2;B2)"}</Notation> при{" "}
            <Notation>{"A2"}</Notation> = 3 и <Notation>{"B2"}</Notation> = 8?
            Какую известную функцию заменяет эта формула для двух ячеек?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            8 — большее из двух, как <Notation>{"=МАКС(A2;B2)"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{"=ЕСЛИОШИБКА(A2/B2;0)"}</Notation> опасна как
            ответ на «средний чек», когда покупок не было?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            При нуле покупок она покажет 0, будто средний чек равен нулю, и так
            же скроет ошибку в ссылке или текст вместо числа.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Проверка отвечает «да» или «нет», а <Notation>{"ЕСЛИ"}</Notation>{" "}
        превращает ответ в число, которое можно сложить. Вот что понадобится
        дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Сравнение",
            note: (
              <>
                Даёт <Notation>{"ИСТИНА"}</Notation> или{" "}
                <Notation>{"ЛОЖЬ"}</Notation>; «больше» и «не меньше»
                различаются на границе.
              </>
            ),
          },
          {
            key: "И, ИЛИ",
            note: (
              <>
                Промежуток — <Notation>{"=И(A2>=10;A2<=20)"}</Notation>, а не
                цепочка <Notation>{"10<=A2<=20"}</Notation>; «ровно одна» —{" "}
                <Notation>{"=A2<>B2"}</Notation>.
              </>
            ),
          },
          {
            key: "Признак",
            note: (
              <>
                <Notation>{"ЕСЛИ(условие;1;0)"}</Notation>; сумма признаков —
                число подходящих строк.
              </>
            ),
          },
          {
            key: "Столбцы",
            note: <>Сложное условие — по проверке в столбце, итог — их И.</>,
          },
          {
            key: "Деление",
            note: (
              <>
                Защищают ветвью <Notation>{"ЕСЛИ"}</Notation>:{" "}
                <Notation>{"И"}</Notation> вычисляет все аргументы.
              </>
            ),
          },
        ]}
      />
    </>
  ),
};

export default content;
