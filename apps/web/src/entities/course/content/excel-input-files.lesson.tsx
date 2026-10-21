import { CodeBlock } from "~/shared/components/code-block";
import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonImage,
  LessonStepper,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import { defineCourseLesson } from "../lib/define-course-lesson";
import { excelInputFilesLessonPublication } from "./course-publication.mjs";
import { lessonMedia } from "./excel-input-files.media";

export const excelInputFilesLesson = defineCourseLesson({
  ...excelInputFilesLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Вводить и исправлять значения",
    "Выделять большой диапазон",
    "Открыть CSV с верным разделителем",
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
            Файл задачи ЕГЭ приходит готовым — тысячи строк чисел или записей. В
            нём нужно быстро добраться до конца данных, ничего не испортить и
            правильно открыть текстовый файл, если он пришёл не книгой Excel.{" "}
            <strong>
              Ввод, выделение и импорт не видны в готовой таблице, но от них
              зависит, какие данные окажутся в ячейках
            </strong>
            .
          </Typography.Text>
          <Typography.Text>
            Адреса и диапазоны из урока 1.1 здесь набирают, выделяют и
            заполняют.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s1",
      navLabel: "Ввод и исправление",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Ввод подтверждается <KeyCombo keys={["Enter"]} /> или{" "}
              <KeyCombo keys={["Tab"]} />, отменяется{" "}
              <KeyCombo keys={["Esc"]} />, а исправление части значения — это{" "}
              <KeyCombo keys={["F2"]} />.
            </strong>{" "}
            Чтобы записать значение, выдели ячейку, набери его и нажми{" "}
            <KeyCombo keys={["Enter"]} />. <KeyCombo keys={["Enter"]} /> обычно
            переводит выделение вниз, <KeyCombo keys={["Tab"]} /> — вправо.
            Чтобы исправить содержимое, дважды щёлкни ячейку или нажми{" "}
            <KeyCombo keys={["F2"]} />. Можно редактировать и в строке формул.{" "}
            <KeyCombo keys={["Esc"]} /> отменяет ещё не подтверждённый ввод.
          </Typography.Text>
          <Typography.Text>
            Один щелчок выбирает ячейку, а ввод нового текста заменяет её
            прежнее содержимое. <KeyCombo keys={["F2"]} /> позволяет исправить
            лишь часть. <KeyCombo keys={["Delete"]} /> обычно очищает содержимое
            выбранных ячеек, но не удаляет саму строку из листа. Команда
            удаления строки сдвигает остальные строки и может изменить ссылки.
          </Typography.Text>
          <Typography.Text>
            <KeyCombo keys={["Ctrl", "C"]} /> копирует,{" "}
            <KeyCombo keys={["Ctrl", "V"]} /> вставляет,{" "}
            <KeyCombo keys={["Ctrl", "Z"]} /> отменяет действие,{" "}
            <KeyCombo keys={["Ctrl", "S"]} /> сохраняет книгу. В настольном
            Excel для Windows <KeyCombo keys={["Ctrl", "1"]} /> открывает формат
            ячеек. На другой системе используй соответствующие команды меню.
          </Typography.Text>
          <Typography.Text>
            Попробуй на маленьком листе: выбери ячейку и начни набирать —
            прежнее значение заменится; <KeyCombo keys={["Enter"]} />,{" "}
            <KeyCombo keys={["F2"]} /> или двойной щелчок открывают ячейку для
            исправления, <KeyCombo keys={["Esc"]} /> отменяет набранное.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Покупки»"} />
        </>
      ),
    },
    {
      id: "s2",
      navLabel: "Большой диапазон",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Большой диапазон выделяют адресом или клавишами, а не мышью.
            </strong>{" "}
            Можно не тянуть мышь через тысячи строк. Введи адрес, например{" "}
            <Notation>{"G2:G5001"}</Notation>, в поле имени и нажми{" "}
            <KeyCombo keys={["Enter"]} />. Excel выделит ровно указанный
            диапазон. Это полезно для заполнения формул и проверки границ.
          </Typography.Text>
          <Typography.Text>
            <KeyCombo keys={["Ctrl", "стрелка"]} /> перемещает к границе области
            данных, <KeyCombo keys={["Ctrl", "Shift", "стрелка"]} />{" "}
            одновременно расширяет выделение. Пустоты внутри столбца могут
            остановить переход раньше ожидаемого — пройди по шагам:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.ctrlJump}
            label={"Ctrl+стрелка в столбце с пустой ячейкой"}
          />
          <ProofDisclosure summary="Тонкости: Ctrl+End" kind="nuance">
            <Typography.Text>
              <KeyCombo keys={["Ctrl", "End"]} /> переходит к последней
              использованной ячейке листа. Если когда-то отформатировали далёкую
              ячейку, она считается использованной, и переход окажется ниже
              настоящих данных. Последнюю запись проверяй{" "}
              <KeyCombo keys={["Ctrl", "стрелка"]} /> по заполненному столбцу.
            </Typography.Text>
          </ProofDisclosure>
          <Typography.Text>
            Чтобы не потерять заголовки при прокрутке, можно закрепить верхнюю
            строку через вкладку «Вид». Закрепление влияет только на
            отображение. Оно не меняет вычисления и не фиксирует ссылки в
            формулах.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s3",
      navLabel: "XLSX и CSV",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              XLSX хранит книгу целиком, CSV — только текст с разделителями.
            </strong>{" "}
            XLSX сохраняет листы, формулы, оформление и другие элементы книги.
            Для собственной рабочей копии это удобный основной формат. XLS —
            более старый формат. CSV — текстовый файл с разделителями между
            полями; он не сохраняет полноценную книгу с несколькими листами и
            оформлением. TXT также требует выяснить, как в нём разделены
            значения.
          </Typography.Text>
          <Typography.Text>
            Вот как выглядят три строки покупок в файле CSV: каждая строка файла
            — запись, поля разделены точкой с запятой.
          </Typography.Text>
          <CodeBlock
            code={"Товар;Цена;Количество\nТетрадь;40;5\nРучка;20;3"}
            label={"Строки файла pokupki.csv"}
            language="text"
            fileName="pokupki.csv"
          />
          <Typography.Text>
            Если при открытии CSV вся строка попала в один столбец, это ещё не
            значит, что файл испорчен. Программа могла выбрать не тот
            разделитель. Используй импорт «Из текста/CSV» либо «Текст по
            столбцам» и укажи реальный разделитель: точку с запятой, запятую,
            табуляцию или пробел. Посмотри предварительный просмотр до
            подтверждения. LibreOffice Calc при открытии CSV сам показывает окно
            «Импорт текста» с теми же настройками.
          </Typography.Text>
          <LessonImage
            src="/images/lessons/excel-sheet/excel-csv-import.webp"
            width={1280}
            height={800}
            alt="Excel, окно импорта файла pokupki.csv: разделитель Точка с запятой, предпросмотр в три столбца Товар, Цена, Количество"
            caption={
              <>
                Excel: «Данные → Из текста/CSV». В списке «Разделитель» (1)
                выбран знак из файла — и предпросмотр сразу показывает три
                столбца. Если всё слиплось в один, разделитель выбран неверно.
              </>
            }
          />
        </>
      ),
    },
    {
      id: "s4",
      navLabel: "Разделитель и запятая",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разделитель полей и десятичная запятая — разные знаки, хотя иногда
              это один и тот же символ.
            </strong>{" "}
            Разделитель столбцов не следует путать с десятичным разделителем. В
            записи 12,5 запятая может быть частью одного числа. Не разбивай
            такие данные по запятой, если формат файла этого не предполагает.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.csvSplit40125}
            caption={
              <>
                Одна строка файла, два разделителя. По «;» получаются три верных
                поля. По «,» число 12,5 разрезано пополам, а товар и цена
                слиплись в одно поле.
              </>
            }
          />
          <Typography.Text>
            Для кодов с ведущими нулями при импорте выбирай текстовый тип, если
            нули существенны.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "s5",
      navLabel: "Рабочая копия",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала рабочая копия, вычисления — рядом с исходными данными, а
              не вместо них.
            </strong>{" "}
            Получив файл задачи, сначала сохрани копию с понятным именем. Оставь
            исходные данные неизменными, а вычисления размести справа или на
            другом листе. В задаче о Роботе сохрани и границы клеток: часть
            линий может обозначать стены.
          </Typography.Text>
          <Typography.Text>
            Сохраняй рабочую копию в формате XLSX: CSV не сохранит формулы и
            второй лист.
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
            Чем отличается нажатие <KeyCombo keys={["Delete"]} /> на выделенной
            строке от команды удаления строки?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <KeyCombo keys={["Delete"]} /> очищает содержимое ячеек, а строка
            остаётся на месте. Удаление строки убирает её из листа: строки ниже
            поднимаются, ссылки на них могут измениться.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t2",
      prompt: (
        <>
          <Typography.Text>
            Как выделить диапазон <Notation>{"B2:B8001"}</Notation>, не
            прокручивая лист?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            Ввести <Notation>{"B2:B8001"}</Notation> в поле имени и нажать{" "}
            <KeyCombo keys={["Enter"]} />.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t5",
      prompt: (
        <>
          <Typography.Text>
            <KeyCombo keys={["Ctrl", "End"]} /> переводит на строку 5200, хотя
            данные заканчиваются на строке 5000. Почему так бывает и как
            проверить настоящую последнюю запись?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            <KeyCombo keys={["Ctrl", "End"]} /> показывает последнюю
            использованную ячейку, а использованной её могло сделать
            форматирование. Настоящую последнюю запись проверяют Ctrl+стрелкой
            вниз по заполненному столбцу и глазами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t6",
      prompt: (
        <>
          <Typography.Text>
            В столбце данные в строках 2–5000, но в строке 120 пусто. Куда
            перейдёт <KeyCombo keys={["Ctrl", "↓"]} /> из{" "}
            <Notation>{"A2"}</Notation>?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            В <Notation>{"A119"}</Notation> — к последней заполненной ячейке
            перед пустой. Следующее нажатие перескочит пустоту.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "t7",
      prompt: (
        <>
          <Typography.Text>
            В каком формате сохранить рабочую копию с формулами на нескольких
            листах — XLSX или CSV? Почему?
          </Typography.Text>
        </>
      ),
      reveal: (
        <>
          <Typography.Text>
            XLSX: CSV хранит только текст одного листа, без формул, листов и
            оформления.
          </Typography.Text>
        </>
      ),
    },
  ],
  result: (
    <>
      <Typography.Text>
        До формул данные нужно правильно ввести, найти и открыть — и не
        испортить исходник. Вот что понадобится дальше.
      </Typography.Text>
      <LessonSummary
        items={[
          {
            key: "Ввод",
            note: (
              <>
                <KeyCombo keys={["Enter"]} /> и <KeyCombo keys={["Tab"]} />{" "}
                подтверждают, <KeyCombo keys={["Esc"]} /> отменяет,{" "}
                <KeyCombo keys={["F2"]} /> — исправить часть; набор поверх
                заменяет значение.
              </>
            ),
          },
          {
            key: <KeyCombo keys={["Delete"]} />,
            note: (
              <>
                Очищает содержимое; удаление строки сдвигает остальные строки.
              </>
            ),
          },
          {
            key: "Большой диапазон",
            note: (
              <>
                Адрес в поле имени или{" "}
                <KeyCombo keys={["Ctrl", "Shift", "стрелка"]} />; пустая ячейка
                останавливает переход.
              </>
            ),
          },
          {
            key: "CSV",
            note: (
              <>
                Текст с разделителями: при импорте указывают настоящий
                разделитель, не путая его с десятичной запятой.
              </>
            ),
          },
          {
            key: "Рабочая копия",
            note: (
              <>XLSX рядом с исходным файлом; исходные данные не трогают.</>
            ),
          },
        ]}
      />
    </>
  ),
  status: "published",
});
