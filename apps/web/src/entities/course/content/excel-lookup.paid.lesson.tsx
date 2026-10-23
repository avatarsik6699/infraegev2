// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { CourseTypes } from "../course.types";
import { lessonMedia } from "./excel-lookup.paid.media";

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В продаже записаны только код товара и число упаковок, а категория и
            масса лежат на другом листе — в справочнике. Чтобы посчитать продажи
            напитков, к каждой продаже нужно «подтянуть» категорию.{" "}
            <strong>
              <Notation>{"ВПР"}</Notation> находит по ключу строку справочника и
              возвращает из неё нужное поле
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём ключ и справочник, функции <Notation>{"ВПР"}</Notation>,{" "}
            <Notation>{"ИНДЕКС"}</Notation> и <Notation>{"ПОИСКПОЗ"}</Notation>{" "}
            и ошибку <Notation>{"#Н/Д"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Справочник и ключ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Свойства товара хранят один раз в справочнике, а в операциях —
              только ключ.
            </strong>{" "}
            Если в каждой продаже повторять название, массу и категорию, файл
            разрастётся, а исправлять придётся в сотне мест. Поэтому в операции
            пишут только код товара и сведения о самой продаже.
          </Typography.Text>
          <Typography.Text>
            Код, позволяющий однозначно найти запись справочника, называется
            ключом. Например, код товара 101 связывает строку продажи со строкой
            «Чай» в таблице товаров. Номер строки на листе ключом не является:
            после сортировки положение записи может измениться.
          </Typography.Text>
          <Typography.Text>
            Лист «Товары» содержит четыре записи, лист «Магазины» — коды 1, 2,
            3: магазины 1 и 3 находятся в Северном районе, магазин 2 — в Южном.
            Переключай листы под сеткой:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Товары»"} />
          <Typography.Text>
            Связь имеет вид «много операций могут относиться к одному товару».
            Поэтому повторение кода в операциях нормально, а в справочнике
            товаров код должен обозначать одну определённую запись. Если в
            справочнике один код связан с разными свойствами, обычный поиск
            первой строки не разрешит противоречие.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "ВПР",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"ВПР(ключ; справочник; номер столбца; 0)"}</Notation>{" "}
              ищет ключ в первом столбце справочника и берёт значение из
              указанного столбца той же строки.
            </strong>{" "}
            Название значит «вертикальный поиск».
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ВПР(B2;Товары!$A$2:$D$5;3;0)" }]}
            label="Формула"
          />
          <Typography.Text>
            <Notation>{"B2"}</Notation> — код товара из операции. Товары!
            указывает другой лист. <Notation>{"$A$2:$D$5"}</Notation> —
            закреплённый диапазон справочника. 3 означает третий столбец внутри
            этого диапазона, то есть категорию. 0 задаёт точное совпадение;
            вместо него можно использовать <Notation>{"ЛОЖЬ"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Вот что <Notation>{"ВПР"}</Notation> делает, когда в{" "}
            <Notation>{"B2"}</Notation> код 103:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.vlookupSteps103_3}
            label={"ВПР ищет код 103 по шагам"}
          />
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Операции»"} />
          <Typography.Text>
            Выбери <Notation>{"E3"}</Notation>: формула ищет код 103, и вкладка
            «Товары» отмечена цветом — справочник лежит там. Перейди на неё:
            рамка стоит на всём диапазоне <Notation>{"A2:D5"}</Notation>.
            Поменяй код в <Notation>{"B3"}</Notation> на 102 — категория станет
            «Напитки».
          </Typography.Text>
          <Typography.Text>
            Диапазон справочника удобнее выделить мышью на другом листе — Excel
            сам впишет ссылку с именем листа. Четвёртый аргумент 0 не пропускай:
            без него поиск приближённый.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: имя листа с пробелом и приближённый поиск"
            kind="nuance"
          >
            <Typography.Text>
              Имя листа с пробелом берут в одинарные кавычки:{" "}
              <Notation>{"'Каталог товаров'!$A$2:$D$5"}</Notation>.
            </Typography.Text>
            <Typography.Text>
              Без 0 (или с <Notation>{"ИСТИНА"}</Notation>){" "}
              <Notation>{"ВПР"}</Notation> ищет приближённо: при отсутствии
              ключа берёт ближайший меньший, а первый столбец должен быть
              отсортирован. Это нужно, например, для выбора тарифа по интервалу;
              для кода товара нужен точно тот же код.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "ИНДЕКС и ПОИСКПОЗ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"ПОИСКПОЗ"}</Notation> находит номер позиции ключа,{" "}
              <Notation>{"ИНДЕКС"}</Notation> берёт элемент по номеру; вместе
              они ищут в любую сторону.
            </strong>{" "}
            ПОИСКПОЗ(<Notation>{"B2"}</Notation>;
            <Notation>{"Товары!$A$2:$A$5"}</Notation>;0) возвращает позицию кода
            внутри диапазона. Если найден третий элемент, результат равен 3,
            даже если на листе он находится в строке 4. Это относительная
            позиция в указанном списке.
          </Typography.Text>
          <Typography.Text>
            ИНДЕКС(<Notation>{"Товары!$C$2:$C$5"}</Notation>;3) возвращает
            третий элемент столбца категорий. Объединив операции, получаем:
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                formula:
                  "=ИНДЕКС(Товары!$C$2:$C$5;ПОИСКПОЗ(B2;Товары!$A$2:$A$5;0))",
              },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Внутренняя <Notation>{"ПОИСКПОЗ"}</Notation> вычисляется первой и
            отдаёт <Notation>{"ИНДЕКС"}</Notation> номер. При коде 103 в{" "}
            <Notation>{"B2"}</Notation>:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.formulaStepsB2103A2A5101102103104C2C5_af614d}
            label={"ИНДЕКС и ПОИСКПОЗ по шагам"}
          />
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Позиция»"} />
          <Typography.Text>
            Во второй строке поиск идёт по названию, а возвращается код —
            столбец левее столбца поиска. <Notation>{"ВПР"}</Notation> так не
            умеет.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"ВПР"}</Notation> требует, чтобы ключ был первым столбцом
            диапазона, а пара <Notation>{"ИНДЕКС"}</Notation> и{" "}
            <Notation>{"ПОИСКПОЗ"}</Notation> ищет в любую сторону.
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: ПРОСМОТРX" kind="nuance">
            <Typography.Text>
              В новых версиях Excel есть <Notation>{"ПРОСМОТРX"}</Notation> —
              она тоже ищет в любую сторону. Курс без неё обходится: в старых
              версиях и на экзамене её может не быть.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Ошибка #Н/Д",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"#Н/Д"}</Notation> — ключа нет в справочнике; это повод
              проверить данные, а не заменить ошибку нулём.
            </strong>{" "}
            Проверь сам код, его тип, пробелы, границы диапазона и опечатки. Не
            заменяй ошибку нулём: неизвестная масса — не масса ноль, а
            отсутствие цены — не бесплатный товар.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Нет»"} />
          <Typography.Text>
            Кода 105 в справочнике нет. А в <Notation>{"A3"}</Notation> код
            записан текстом '102: на вид тот же, но число 102 и текст «102» для
            поиска разные значения.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Поиск и условная сумма",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"ВПР"}</Notation> извлекает свойство одной записи, а
              итог по многим записям считает условная сумма.
            </strong>{" "}
            Сложить все продажи товара — задача условной суммы по операциям, а
            не поиска.
          </Typography.Text>
          <Typography.Text>
            Свойство, найденное <Notation>{"ВПР"}</Notation>, становится обычным
            столбцом — по нему можно отбирать. Сколько упаковок напитков
            продано, если категория записана только в справочнике:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Итог»"} />
          <Typography.Text>
            Упаковок 17, а операций 3: обе величины считаются по одной выборке,
            но отвечают на разные вопросы.
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
            Код 102 находится в <Notation>{"B2"}</Notation>. В справочнике{" "}
            <Notation>{"Товары!A2:D5"}</Notation> столбец D — масса упаковки.
            Напиши точный поиск массы и объясни аргумент номера столбца.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"=ВПР(B2;Товары!$A$2:$D$5;4;0)"}</Notation>. Столбец
            массы — четвёртый именно внутри <Notation>{"A:D"}</Notation>. Для
            кода 102 результат равен 250 г.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Почему при копировании формулы <Notation>{"ВПР"}</Notation> вниз
            справочник нужно закрепить знаком $?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Иначе при копировании диапазон справочника сдвинется вниз и потеряет
            первые записи.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            Код в операции записан как «102 » с пробелом в конце. Что вернёт{" "}
            <Notation>{"ВПР"}</Notation> и как это исправить?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"#Н/Д"}</Notation>: «102 » — текст с пробелом, не равный
            числу 102. Убрать пробел (<Notation>{"СЖПРОБЕЛЫ"}</Notation>) и
            превратить в число (<Notation>{"ЗНАЧЕН"}</Notation>).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Зачем нужен четвёртый аргумент 0 у <Notation>{"ВПР"}</Notation>,
            если коды в справочнике и так уникальны?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Без него <Notation>{"ВПР"}</Notation> ищет приближённо: при
            отсутствии кода вернёт свойство соседнего меньшего кода вместо
            ошибки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t8",
      prompt: (
        <>
          <Typography.Text>
            Найди название товара по массе 150, если масса стоит в столбце D, а
            название — в B. Почему здесь не подходит{" "}
            <Notation>{"ВПР"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>
              {"=ИНДЕКС(Товары!$B$2:$B$5;ПОИСКПОЗ(150;Товары!$D$2:$D$5;0))"}
            </Notation>{" "}
            — «Какао». <Notation>{"ВПР"}</Notation> ищет только в первом столбце
            диапазона и возвращает столбцы правее.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Справочник хранит свойства один раз, а поиск по ключу приносит их в
        каждую запись. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Ключ",
            note: (
              <>
                Однозначно указывает запись справочника; номер строки ключом не
                является.
              </>
            ),
          },
          {
            key: "ВПР",
            note: (
              <>
                <Notation>{"=ВПР(ключ;Лист!$A$2:$D$5;столбец;0)"}</Notation>:
                ключ в первом столбце, 0 — точное совпадение.
              </>
            ),
          },
          {
            key: "ИНДЕКС",
            note: (
              <>
                <Notation>{"ИНДЕКС(столбец;ПОИСКПОЗ(ключ;ключи;0))"}</Notation>{" "}
                ищет и влево.
              </>
            ),
          },
          {
            key: "#Н/Д",
            note: <>Ключа нет: проверь код, тип и пробелы, а не ставь 0.</>,
          },
          {
            key: "Итог",
            note: (
              <>
                Найденное свойство — обычный столбец для{" "}
                <Notation>{"СУММЕСЛИ"}</Notation> и{" "}
                <Notation>{"СЧЁТЕСЛИ"}</Notation>.
              </>
            ),
          },
        ]}
      />
    </>
  ),
};

export default content;
