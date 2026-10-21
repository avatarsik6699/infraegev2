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
import { lessonMedia } from "./excel-conditional-count.paid.media";

const content: CourseTypes.PaidLessonContent = {
  theory: [
    {
      id: "intro",
      navLabel: "Вступление",
      lead: true,
      explanation: (
        <>
          <Typography.Text>
            В таблице сотни покупок. Сколько из них — книги и на какую сумму?
            Столбец признаков из урока 3.1 ответит, но короче так:{" "}
            <strong>
              <Notation>{"СЧЁТЕСЛИ"}</Notation> и{" "}
              <Notation>{"СУММЕСЛИ"}</Notation> проверяют условие по каждой
              ячейке диапазона сами — без столбца признаков
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Разберём подсчёт и сумму по одному и нескольким условиям, а затем
            частоты чисел в строке — основу задания 9 ЕГЭ.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "СЧЁТЕСЛИ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"СЧЁТЕСЛИ(диапазон;критерий)"}</Notation> считает
              ячейки диапазона, подходящие под критерий.
            </strong>{" "}
            Критерием бывает число, текст или сравнение:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { formula: "=СЧЁТЕСЛИ(A2:A7;5)" },
              { formula: '=СЧЁТЕСЛИ(A2:A7;">5")' },
              { formula: '=СЧЁТЕСЛИ(B2:B7;"Москва")' },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Первая формула считает пятёрки, вторая — числа больше пяти, третья —
            текст «Москва». Сравнение в критерии пишут в кавычках, как текст:{" "}
            <Notation>{'">5"'}</Notation> — особый вид аргумента этой функции.
            В обычной проверке из урока 3.1 кавычек нет:{" "}
            <Notation>{"=A2>5"}</Notation>.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Список»"} />
          <Typography.Text>
            <Notation>{"СЧЁТЕСЛИ"}</Notation> не различает регистр: «москва» в{" "}
            <Notation>{"B6"}</Notation> засчитана как «Москва». Если искомое
            значение лежит в ячейке, критерий — её адрес без кавычек:{" "}
            <Notation>{"=СЧЁТЕСЛИ(A2:A7;E9)"}</Notation> (строка 6 листа).
            Запись <Notation>{'"E9"'}</Notation> искала бы буквально текст
            «E9».
          </Typography.Text>
          <ProofDisclosure summary="Тонкости: шаблоны * и ?" kind="nuance">
            <Typography.Text>
              В текстовом критерии * означает любые символы (в том числе ни
              одного), ? — ровно один символ: <Notation>{'"К*"'}</Notation> —
              начинается с К, <Notation>{'"??7"'}</Notation> — три символа, и
              последний 7. Сами звёздочку и вопрос ищут как ~* и ~?.
            </Typography.Text>
            <SheetBlock {...lessonMedia.sheet8} label={"Лист «Шаблоны»"} />
            <Typography.Text>
              Шаблон описывает символы текста: код 127, записанный текстом,
              подходит под <Notation>{'"??7"'}</Notation>, а число 127 — нет.
              Регистр шаблон не различает.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Критерий из ячейки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Критерий «больше значения из ячейки» собирают знаком &:{" "}
              <Notation>{'">"&E9'}</Notation> превращается в{" "}
              <Notation>{'">7"'}</Notation>.
            </strong>{" "}
            На листе выше порог лежит в <Notation>{"E9"}</Notation>, и числа
            больше порога считает
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: '=СЧЁТЕСЛИ(A2:A7;">"&E9)' }]}
            label="Формула"
          />
          <Typography.Text>
            Знак & склеивает текст «{">"}» и значение{" "}
            <Notation>{"E9"}</Notation> в один критерий. В{" "}
            <Notation>{'">E9"'}</Notation> адрес спрятан внутри кавычек и не
            заменяется значением. Вот как собирается критерий:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.formulaStepsA2A75710583E97_e2b4d7}
            label={'Сборка критерия ">"&E9 по шагам'}
          />
          <Typography.Text>
            Так же пишут <Notation>{'">="&E9'}</Notation> и{" "}
            <Notation>{'"<>"&E9'}</Notation>; для равенства склейка не нужна —
            достаточно <Notation>{"E9"}</Notation>. Поменяй порог в{" "}
            <Notation>{"E9"}</Notation> на листе выше: изменятся строки 5 и 6.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "СЧЁТЕСЛИМН",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"СЧЁТЕСЛИМН"}</Notation> проверяет несколько условий
              для одной и той же строки — это <Notation>{"И"}</Notation> между
              критериями.
            </strong>{" "}
            Аргументы идут парами «диапазон; критерий»:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: '=СЧЁТЕСЛИМН(B2:B7;">=60";B2:B7;"<=80")' }]}
            label="Формула"
          />
          <Typography.Text>
            Один диапазон указан дважды — к нему два условия. Для разных
            столбцов:{" "}
            <Notation>
              {'=СЧЁТЕСЛИМН(A2:A7;"Москва";B2:B7;">=60")'}
            </Notation>{" "}
            считает строки, где и город Москва, и балл не меньше 60.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Город»"} />
          <Typography.Text>
            Диапазоны должны описывать одни и те же строки: с{" "}
            <Notation>{"A2:A7"}</Notation> и <Notation>{"B3:B8"}</Notation>{" "}
            функция сравнивала бы город одной записи с баллом соседней.
          </Typography.Text>
          <ProofDisclosure
            summary="Тонкости: сколько промежутков содержат момент"
            kind="nuance"
          >
            <Typography.Text>
              Промежуток [S; F) начинается в S и заканчивается в F, не включая
              его. Он содержит момент t, когда S {"<"}= t и t {"<"} F:
              закончившийся в 6 момент 6 уже не содержит, а начавшийся в 6 —
              содержит, и на границе ничего не считается дважды. Два условия —{" "}
              <Notation>{"СЧЁТЕСЛИМН"}</Notation> с критериями из ячейки
              момента; диапазоны закреплены, поэтому формулу можно копировать
              вниз.
            </Typography.Text>
            <SheetBlock {...lessonMedia.sheet3} label={"Лист «Промежутки»"} />
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "СУММЕСЛИ",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              <Notation>{"СУММЕСЛИ"}</Notation> складывает значения тех строк,
              где выполнено условие; у <Notation>{"СУММЕСЛИМН"}</Notation>{" "}
              диапазон суммирования стоит первым.
            </strong>{" "}
            Один диапазон проверяется, из другого берутся слагаемые:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: '=СУММЕСЛИ(A2:A100;"Книги";D2:D100)' }]}
            label="Формула"
          />
          <Typography.Text>
            A — категория, D — выручка. В каждой строке проверяется категория;
            если это «Книги», к итогу прибавляется выручка той же строки.
            Порядок аргументов: диапазон проверки, критерий, диапазон
            суммирования:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.sumifSteps_d2a3c2}
            label={"СУММЕСЛИ проходит строки по одной"}
          />
          <Typography.Text>
            У <Notation>{"СУММЕСЛИМН"}</Notation> другой порядок: сначала
            диапазон суммирования, затем пары условий:
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                formula:
                  '=СУММЕСЛИМН(D2:D100;A2:A100;"Книги";B2:B100;"Москва")',
              },
            ]}
            label="Формула"
          />
          <SheetBlock {...lessonMedia.sheet4} label={"Лист «Покупки»"} />
          <Typography.Text>
            Функция складывает выручку строк, удовлетворяющих обоим условиям.
            Названия похожи, но порядок аргументов нельзя переносить по памяти с
            одной функции на другую. Читай подсказку при вводе.
          </Typography.Text>
          <Typography.Text>
            <Notation>{"СРЗНАЧЕСЛИ"}</Notation> и{" "}
            <Notation>{"СРЗНАЧЕСЛИМН"}</Notation> вычисляют среднее подходящих
            числовых значений. Если подходящих чисел нет, среднее не определено.
            Нулевая условная сумма сама по себе не доказывает, что записи
            найдены: совпадений могло не быть вообще — как у игрушек в Москве.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "«Или» без двойного счёта",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Или» по двум условиям считают одним признаком либо вычитают общую
              часть.
            </strong>{" "}
            Если категории не пересекаются, результаты можно сложить. Количество
            строк города Москва или города Казань равно сумме двух отдельных
            подсчётов, когда в строке ровно один город.
          </Typography.Text>
          <Typography.Text>
            Если условия пересекаются, сложение удвоит общую часть. Например,
            число делится и на 2, и на 3. Для подсчёта «кратно 2 или 3» удобно
            сделать один признак через <Notation>{"ИЛИ"}</Notation>. Другой
            путь: сложить два количества и вычесть количество строк,
            удовлетворяющих обоим условиям.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet5} label={"Лист «Кратные»"} />
          <Typography.Text>
            Кратных 2 здесь два (2 и 6), кратных 3 — тоже два (3 и 6), но 6
            попало в обе группы: 2 + 2 − 1 = 3.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s6",
      navLabel: "Частоты в строке",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Одна формула со смешанной ссылкой считает, сколько раз каждое
              число встречается в своей строке.
            </strong>{" "}
            В строке <Notation>{"A2:F2"}</Notation> — 4, 4, 1, 2, 3, 5. В{" "}
            <Notation>{"G2"}</Notation> пишем
          </Typography.Text>
          <FormulaBlock
            lines={[{ cell: "G2", formula: "=СЧЁТЕСЛИ($A2:$F2;A2)" }]}
            label="Формула"
          />
          <Typography.Text>
            и копируем вправо до <Notation>{"L2"}</Notation>. Диапазон{" "}
            <Notation>{"$A2:$F2"}</Notation> закреплён по столбцам и остаётся
            всей строкой, а критерий <Notation>{"A2"}</Notation> сдвигается:{" "}
            <Notation>{"B2"}</Notation>, <Notation>{"C2"}</Notation>… Пройди
            по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.freqSteps_dae026}
            label={"Частоты строки 4, 4, 1, 2, 3, 5 по шагам"}
          />
          <Typography.Text>
            Число показывает частоту значения — сколько раз оно встречается в
            строке. Повторяющееся дважды значение даёт две ячейки с частотой 2,
            поэтому число двоек в частотах — не число разных повторяющихся
            значений.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet6} label={"Лист «Повторы»"} />
          <Typography.Text>
            При копировании всей полосы вниз диапазон переходит на следующую
            строку. Выбери <Notation>{"H2"}</Notation> и{" "}
            <Notation>{"H3"}</Notation>: рамки показывают свою строку и своё
            число.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s7",
      navLabel: "Повторы и одиночные",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              По полосе частот <Notation>{"СУММЕСЛИ"}</Notation> складывает
              отдельно повторяющиеся и одиночные числа строки.
            </strong>{" "}
            Если <Notation>{"G2:L2"}</Notation> — частоты соответствующих
            значений <Notation>{"A2:F2"}</Notation>, сумма одиночных элементов
            вычисляется так:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=СУММЕСЛИ(G2:L2;1;A2:F2)" }]}
            label="Формула"
          />
          <Typography.Text>
            Сумма всех вхождений повторяющихся элементов:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: '=СУММЕСЛИ(G2:L2;">1";A2:F2)' }]}
            label="Формула"
          />
          <SheetBlock {...lessonMedia.sheet7} label={"Лист «Суммы»"} />
          <Typography.Text>
            Для 4, 4, 1, 2, 3, 5 первая сумма равна 11, вторая — 8.
            Повторяющееся различное значение здесь одно — 4, но его вхождений
            два. «Сумма повторяющихся элементов» и «сумма разных повторяющихся
            значений» могут означать разные величины. Читай, считает ли условие
            каждое вхождение. Поменяй числа строки: например, сделай третье
            число тоже четвёркой — обе суммы и частоты пересчитаются.
          </Typography.Text>
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Почему <Notation>{'=СЧЁТЕСЛИ(A2:A7;">E9")'}</Notation> не учитывает
            порог из <Notation>{"E9"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Адрес внутри кавычек — просто текст «E9». Значение подставит
            склейка: <Notation>{'">"&E9'}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            В строке 7, 7, 2, 2, 5, 9. Какие частоты даст{" "}
            <Notation>{"=СЧЁТЕСЛИ($A2:$F2;A2)"}</Notation>, скопированная
            вправо?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            2, 2, 2, 2, 1, 1: семёрка и двойка встречаются по два раза.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t1",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2:A100"}</Notation> числа, в{" "}
            <Notation>{"D1"}</Notation> — порог. Посчитай числа строго больше
            порога. Затем измени формулу для «не меньше».
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'=СЧЁТЕСЛИ(A2:A100;">"&$D$1)'}</Notation>. Для нестрогого
            условия: <Notation>{'=СЧЁТЕСЛИ(A2:A100;">="&$D$1)'}</Notation>.
            Абсолютность <Notation>{"D1"}</Notation> полезна, если формулу
            собираются копировать; для неподвижной единственной формулы
            допустима обычная ссылка.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2:A20"}</Notation> — города, в{" "}
            <Notation>{"B2:B20"}</Notation> — баллы. Посчитай строки города
            Казань с баллом не меньше 80.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'=СЧЁТЕСЛИМН(A2:A20;"Казань";B2:B20;">=80")'}</Notation>.
            Критерии проверяются по одной и той же строке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            В <Notation>{"A2:A20"}</Notation> — категории, в{" "}
            <Notation>{"C2:C20"}</Notation> — суммы покупок. Найди сумму
            категории «Книги». Объясни разницу с подсчётом числа таких покупок.
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{'=СУММЕСЛИ(A2:A20;"Книги";C2:C20)'}</Notation>. Для
            количества записей —{" "}
            <Notation>{'=СЧЁТЕСЛИ(A2:A20;"Книги")'}</Notation>. Покупки на 100 и
            200 рублей дают сумму 300, но количество 2.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Условие можно не выносить в столбец признаков: функции «…ЕСЛИ»
        проверяют его сами. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "СЧЁТЕСЛИ",
            note: (
              <>
                Число, текст или сравнение в кавычках{" "}
                <Notation>{'">5"'}</Notation>; порог из ячейки —{" "}
                <Notation>{'">"&E9'}</Notation>.
              </>
            ),
          },
          {
            key: "…ЕСЛИМН",
            note: (
              <>
                <Notation>{"И"}</Notation> между условиями одной строки; у{" "}
                <Notation>{"СУММЕСЛИМН"}</Notation> диапазон суммы первый.
              </>
            ),
          },
          {
            key: "СУММЕСЛИ",
            note: (
              <>
                Проверяет один диапазон, складывает из другого той же строки.
              </>
            ),
          },
          {
            key: "«Или»",
            note: (
              <>
                Один признак через <Notation>{"ИЛИ"}</Notation> или сумма минус
                общая часть.
              </>
            ),
          },
          {
            key: "Частоты",
            note: (
              <>
                <Notation>{"=СЧЁТЕСЛИ($A2:$F2;A2)"}</Notation> вправо; частота 1
                — одиночные, больше 1 — повторы.
              </>
            ),
          },
        ]}
      />
    </>
  ),
};

export default content;
