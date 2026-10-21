import { ExternalLink } from "~/shared/components/external-link";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonImage,
  LessonSummary,
  LessonTabs,
  SheetBlock,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelSheetLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./excel-sheet.media";

export const excelSheetLesson = defineCourseLesson({
  ...excelSheetLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Открыть программу и найти части окна",
    "Найти ячейку по адресу",
    "Посчитать ячейки диапазона",
    "Понять, что означают строки и столбцы",
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
            Весь курс держится на маленькой таблице покупок: тетради, ручки,
            папки и карандаши, их цены и количества. Чтобы посчитать, сколько
            стоят три ручки, формуле нужно сказать, где лежат цена и количество.{" "}
            <strong>
              У каждого значения на листе есть адрес — буква столбца и номер
              строки, например <Notation>{"B3"}</Notation>; по адресам к данным
              обращаются все формулы курса
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Сначала откроем программу и найдём в её окне всё, что понадобится,
            потом разберёмся с адресами и диапазонами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s0-okno",
      navLabel: "Программа и окно",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Курс проходится в Excel или в бесплатном LibreOffice Calc —
              формулы и окно у них почти одинаковые.
            </strong>{" "}
            Всё в курсе работает в обеих. Выбери ту, что у тебя есть:
          </Typography.Text>
          <LessonTabs
            label="Программа"
            tabs={[
              {
                label: "Excel",
                content: (
                  <>
                    <Typography.Text>
                      Excel входит в пакет Microsoft 365. Если он установлен,
                      открой «Excel» в меню «Пуск» и выбери «Пустая книга». Если
                      Excel нет, возьми LibreOffice Calc — соседняя вкладка.
                    </Typography.Text>
                    <Typography.Text>
                      В окне Excel пять частей — на кадре они отмечены номерами:
                    </Typography.Text>
                    <LessonImage
                      src="/images/lessons/excel-sheet/excel-window.webp"
                      width={1280}
                      height={800}
                      alt="Окно Excel с таблицей покупок: лента, поле имени C4, строка формул со значением 2, выбранная ячейка C4, ярлычки листов База и Итоги; метки 1–5"
                      caption={
                        <>
                          Выбрана <Notation>{"C4"}</Notation>: её адрес — в поле
                          имени (2), содержимое 2 — в строке формул (3).
                        </>
                      }
                    />
                    <ol>
                      <li>
                        <strong>лента</strong> — вкладки с командами: «Главная»,
                        «Формулы», «Данные»;
                      </li>
                      <li>
                        <strong>поле имени</strong> — адрес выбранной ячейки,
                        например <Notation>{"C4"}</Notation>;
                      </li>
                      <li>
                        <strong>строка формул</strong> — то, что на самом деле
                        записано в ячейке;
                      </li>
                      <li>
                        <strong>сетка</strong> — ячейки листа;
                      </li>
                      <li>
                        <strong>ярлычки листов</strong> внизу — листы книги.
                      </li>
                    </ol>
                  </>
                ),
              },
              {
                label: "LibreOffice Calc",
                content: (
                  <>
                    <Typography.Text>
                      LibreOffice — бесплатный пакет, Calc — его таблицы. Скачай
                      установщик для Windows с сайта{" "}
                      <ExternalLink href="https://www.libreoffice.org/download/download-libreoffice/">
                        libreoffice.org
                      </ExternalLink>
                      : кнопка «WINDOWS (X86-64)».
                    </Typography.Text>
                    <LessonImage
                      src="/images/lessons/excel-sheet/libreoffice-download.webp"
                      width={1264}
                      height={760}
                      alt="Страница загрузки LibreOffice 26.8.1 с кнопками WINDOWS (X86-64) и WINDOWS (ARM64)"
                      caption={
                        <>
                          Для обычного компьютера — верхняя кнопка, X86-64.
                          ARM64 нужна только для компьютеров на процессорах ARM.
                        </>
                      }
                    />
                    <Typography.Text>
                      Запусти скачанный файл и установи с настройками по
                      умолчанию. Затем открой «LibreOffice Calc» в меню «Пуск».
                      В окне те же пять частей, что у Excel:
                    </Typography.Text>
                    <LessonImage
                      src="/images/lessons/excel-sheet/calc-window.webp"
                      width={1280}
                      height={800}
                      alt="Окно LibreOffice Calc с таблицей покупок: меню и панели инструментов, поле имени C4, строка формул со значением 2, выбранная ячейка C4, ярлычки листов База и Итоги; метки 1–5"
                      caption={
                        <>
                          Вместо ленты — меню и панели (1); поле имени (2) и
                          строка формул (3) — те же, что в Excel.
                        </>
                      }
                    />
                    <ol>
                      <li>
                        <strong>меню и панели инструментов</strong> вместо
                        ленты: «Файл», «Данные», «Сервис»;
                      </li>
                      <li>
                        <strong>поле имени</strong> — адрес выбранной ячейки;
                      </li>
                      <li>
                        <strong>строка формул</strong> — содержимое ячейки;
                      </li>
                      <li>
                        <strong>сетка</strong> — ячейки листа;
                      </li>
                      <li>
                        <strong>ярлычки листов</strong> внизу.
                      </li>
                    </ol>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            Функции в обеих программах на русском и пишутся одинаково:{" "}
            <Notation>{"СУММ"}</Notation>, <Notation>{"ЕСЛИ"}</Notation>,{" "}
            <Notation>{"ВПР"}</Notation>. Где команды в меню различаются, урок
            называет обе.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Книга, лист, ячейка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Файл Excel — книга, в книге листы, лист — сетка из строк и
              столбцов.
            </strong>{" "}
            Файл Excel называется книгой. В одной книге может быть несколько
            листов. Например, на листе «Товары» находятся названия и цены, на
            листе «Продажи» — покупки, а на листе «Итоги» — результаты
            вычислений. Вкладки листов расположены внизу окна.
          </Typography.Text>
          <Typography.Text>
            Лист разбит на строки и столбцы. Строки идут сверху вниз и обычно
            обозначаются числами 1, 2, 3. Столбцы идут слева направо и
            обозначаются латинскими буквами A, B, C. После Z идут AA, AB и так
            далее. Пересечение строки и столбца называется ячейкой.
          </Typography.Text>
          <Typography.Text>
            Вот таблица покупок на листе «База». Над сеткой — буквы столбцов,
            слева — номера строк:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «База»"} />
          <Typography.Text>
            Щёлкни любую ячейку этого листа: её адрес появится слева в строке
            над сеткой, как в поле имени Excel.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Адрес ячейки",
      explanation: (
        <>
          <Typography.Text>
            <strong>Адрес называет сначала столбец, потом строку.</strong> Адрес{" "}
            <Notation>{"B3"}</Notation> означает: столбец B, строка 3. Сначала
            всегда пишется столбец, затем строка. Если щёлкнуть ячейку, она
            станет активной: именно в неё попадёт ввод. Адрес активной ячейки
            виден в поле имени слева от строки формул.
          </Typography.Text>
          <Typography.Text>
            В таблице выше в <Notation>{"B3"}</Notation> лежит цена ручки 20, а
            количество папок хранится в <Notation>{"C4"}</Notation>: столбец C —
            «Количество», строка 4 — папка. Названия столбцов A, B, C набираются
            латиницей: кириллическая «С» выглядит так же, но адресом не
            является.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "Диапазон",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Диапазон — прямоугольник ячеек от одного угла до противоположного,
              обе границы включены.
            </strong>{" "}
            Иногда нужно обратиться сразу к нескольким ячейкам. Такой набор
            называется диапазоном. Запись <Notation>{"A2:A6"}</Notation>{" "}
            обозначает пять ячеек одного столбца. Запись{" "}
            <Notation>{"A2:D2"}</Notation> обозначает четыре ячейки одной
            строки. Запись <Notation>{"A2:D6"}</Notation> обозначает
            прямоугольник из пяти строк и четырёх столбцов.
          </Typography.Text>
          <Typography.Text>
            Двоеточие читается как «от первой указанной ячейки до второй
            включительно». В <Notation>{"A2:A6"}</Notation> входят и{" "}
            <Notation>{"A2"}</Notation>, и <Notation>{"A6"}</Notation>. Число
            строк такого диапазона равно 6 − 2 + 1 = 5. Единица появляется
            потому, что обе границы включены.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.rangeGridA2D6_6_8}
            caption={
              <>
                A2:D6 — от верхнего левого угла A2 до нижнего правого D6: строки
                2…6, столбцы A…D, 5 × 4 = 20 ячеек.
              </>
            }
          />
          <Typography.Text>
            Диапазон <Notation>{"A2:D6"}</Notation> содержит 5 × 4 = 20 ячеек.
            Это количество ячеек, а не обязательно количество чисел: часть ячеек
            может содержать текст или быть пустой.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Запись и поле",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Строка таблицы — одна запись, столбец — одно её свойство, и связь
              внутри строки — часть данных.
            </strong>{" "}
            В списке покупок одна строка обычно означает одну покупку. Столбцы
            описывают её свойства: товар, количество, цену, дату. Строку с
            данными называют записью, а отдельное свойство — полем. Эти термины
            удобны, когда записей много.
          </Typography.Text>
          <Typography.Text>
            В таблице покупок нельзя отдельно переставить цены: тогда цена
            одного товара окажется рядом с другим товаром. Связь значений внутри
            строки — часть данных.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Таблица-поле",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В таблице-поле порядок строк и столбцов и есть условие.
            </strong>{" "}
            В задании 18 ЕГЭ Робот ходит по клеткам прямоугольного поля, и в
            каждой клетке записано число — например, сколько там монет. Такое
            поле лежит на листе без заголовков: каждая ячейка — клетка поля.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Поле»"} />
          <Typography.Text>
            Здесь строка — не запись, а ряд клеток поля.{" "}
            <Notation>{"B2"}</Notation> — клетка во втором ряду и втором
            столбце; её сосед справа — <Notation>{"C2"}</Notation>, снизу —{" "}
            <Notation>{"B3"}</Notation>. Номер строки и номер столбца задают
            положение в пространстве. Сортировка такой таблицы вообще меняет
            поле и уничтожает условие задачи. Поэтому до любых действий спроси
            себя: «Что означает строка? Что означает столбец? Важен ли их
            порядок?»
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
            Какой адрес у ячейки на пересечении столбца D и строки 7?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"D7"}</Notation>: сначала буква столбца, потом номер
            строки.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Где в окне программы видно адрес выбранной ячейки, а где — что в ней
            записано?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Адрес — в поле имени слева, содержимое — в строке формул справа от
            него.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t3",
      prompt: (
        <>
          <Typography.Text>
            Сколько ячеек в диапазоне <Notation>{"B2:B9"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            8: строк 9 − 2 + 1 = 8, столбец один.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t4",
      prompt: (
        <>
          <Typography.Text>
            Чем различаются диапазоны <Notation>{"A2:D2"}</Notation> и{" "}
            <Notation>{"A2:A6"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <Notation>{"A2:D2"}</Notation> — четыре ячейки одной строки,{" "}
            <Notation>{"A2:A6"}</Notation> — пять ячеек одного столбца.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            Почему в таблице покупок нельзя отсортировать один столбец цен, а в
            поле Робота нельзя сортировать вообще ничего?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Цена — свойство своей покупки: отсортированный отдельно столбец цен
            окажется рядом с чужими товарами. В поле Робота положение ячейки —
            это клетка поля, любая перестановка меняет само поле.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        Лист — сетка ячеек с адресами, и любое значение находят по адресу. Вот
        что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Окно",
            note: (
              <>
                Лента или меню, поле имени — адрес, строка формул — содержимое,
                ярлычки листов внизу.
              </>
            ),
          },
          {
            key: "Книга и лист",
            note: (
              <>
                Файл — книга, в ней листы, лист — ячейки на пересечении строк и
                столбцов.
              </>
            ),
          },
          {
            key: <Notation>{"B3"}</Notation>,
            note: (
              <>Адрес: буква столбца, потом номер строки; буквы латинские.</>
            ),
          },
          {
            key: <Notation>{"A2:D6"}</Notation>,
            note: (
              <>
                Диапазон включает обе границы: строк 6 − 2 + 1 = 5, ячеек 5 × 4
                = 20.
              </>
            ),
          },
          {
            key: "Запись и поле",
            note: (
              <>
                В списке строка — запись, столбец — поле; в таблице-поле смысл
                несёт само положение ячейки.
              </>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
