// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./parallel-computing.paid.skolko-processov.media";
import { THEME_TASK } from "./parallel-computing.theme";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "na-n-j-millisekunde",
      navLabel: "На n-й миллисекунде",
      explanation: (
        <>
          <Typography.Text>
            Как понять, идёт ли процесс на 7-й миллисекунде?
          </Typography.Text>
          <Typography.Text>
            <strong>
              7-я мс — от момента 6 до момента 7. Процесс идёт на ней, если
              начался раньше 7 и закончился не раньше 7: начало {"<"} 7,
              окончание ≥ 7.
            </strong>{" "}
            Посмотрим на столбец 7-й мс в расписании учебного примера:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.prCells_ms7}
            caption={
              <>
                На 7-й мс идут три процесса: 3 (с 4 до 7), 4 (с 6 до 8) и 5 (с 6
                до 11). Процесс 2 закончился в 6 — на 7-й мс его уже нет.
              </>
            }
          />
          <Typography.Text>
            Процесс 3 заканчивается ровно в 7 — и всё равно идёт на 7-й мс: это
            его последняя миллисекунда. А процесс 4 начинается в 6 и уже идёт: 6{" "}
            {"<"} 7. Процесс, который начнётся в 7, на 7-й мс ещё не идёт — его
            первая миллисекунда 8-я.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: «на 7-й миллисекунде» и «в момент 7»"
          >
            <Typography.Text>
              Иногда спрашивают о моменте времени: «сколько процессов работает в
              момент 7». Момент 7 — граница между 7-й и 8-й мс. В нём процесс 3
              уже закончился, работают только 4 и 5 — два, а не три. Тогда
              условие другое: начало ≤ 7, окончание {">"} 7. Читай, о чём именно
              вопрос.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "scheteslimn",
      navLabel: "СЧЁТЕСЛИМН",
      explanation: (
        <>
          <Typography.Text>
            Как посчитать такие процессы в Excel, когда их двадцать?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Функцией{" "}
              <PythonTerm term="xl-countif">
                <Notation>{"СЧЁТЕСЛИМН"}</Notation>
              </PythonTerm>
              : она считает строки, где выполнены все условия сразу.
            </strong>{" "}
            Начала — в B, окончания — в C, номер миллисекунды — в F1:
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                cell: "F2",
                formula: '=СЧЁТЕСЛИМН(B2:B9;"<"&F1;C2:C9;">="&F1)',
              },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Условия идут парами: диапазон и что в нём должно быть.{" "}
            <Notation>{'"<"&F1'}</Notation> склеивает знак с числом из F1 —
            получится условие «{"<"}7». Так номер миллисекунды можно менять, не
            трогая формулу. На листе для краткости только ID, начала и
            окончания. В полной таблице из подтемы 2 начала стоят в G, окончания
            — в H: подставь их диапазоны.
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheetCount} label={"Лист «Подсчёт»"} />
          <Typography.Text>
            В F2 — 3. Поменяй F1 на 12 — получится 2: на 12-й мс идут процессы 6
            и 7.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zakonchilis-i-nachalis",
      navLabel: "Закончились и начались",
      explanation: (
        <>
          <Typography.Text>
            А если спрашивают, сколько процессов закончилось или началось?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Формула та же, меняются только условия — их берут из слов условия.
            </strong>{" "}
            Выбери формулировку:
          </Typography.Text>
          <VariantPicker
            label={"Слова условия и что проверять"}
            variants={[
              {
                label: "выполняется на n-й мс",
                value: <>начало {"<"} n и окончание ≥ n</>,
                note: <>как в задаче темы</>,
              },
              {
                label: "завершились за первые t мс",
                value: <>окончание ≤ t</>,
                note: <Notation>{'=СЧЁТЕСЛИ(C2:C9;"<="&F1)'}</Notation>,
              },
              {
                label: "начались не раньше чем через t мс",
                value: <>начало ≥ t</>,
                note: <>отсчёт от момента 0</>,
              },
              {
                label: "начались не раньше n-й мс",
                value: <>начало ≥ n − 1</>,
                note: <>n-я мс начинается в момент n − 1</>,
              },
              {
                label: "работают в момент t",
                value: <>начало ≤ t и окончание {">"} t</>,
                note: <>момент, а не миллисекунда</>,
              },
            ]}
          />
          <Typography.Text>
            В учебном примере за первые 7 мс закончились три процесса: 1 (в 4),
            2 (в 6) и 3 (в 7). Процесс 3 считается: «за первые 7 мс» включает и
            7-ю.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "k-e-okonchanie",
      navLabel: "Когда закончатся k",
      explanation: (
        <>
          <Typography.Text>
            За какое время закончатся пять процессов?
          </Typography.Text>
          <Typography.Text>
            <strong>
              За время пятого по счёту окончания, если окончания выстроить по
              возрастанию.
            </strong>{" "}
            В примере окончания 4, 6, 7, 8, 11, 12, 13, 14 — пятое равно 11. В
            Excel это <Notation>{"=НАИМЕНЬШИЙ(C2:C9;5)"}</Notation>: пятое
            наименьшее значение столбца. На листе выше оно в F4.
          </Typography.Text>
          <Typography.Text>
            Окончания могут совпадать. Если два процесса заканчиваются
            одновременно, число закончившихся растёт сразу на два — тогда
            момента, когда закончились ровно k, может и не быть. Вопрос «за
            какое время завершатся k» всё равно имеет ответ: k-е окончание.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы",
      explanation: (
        <>
          <Typography.Text>Решим задачу темы целиком:</Typography.Text>
          <Typography.Text>{THEME_TASK}</Typography.Text>
          <Typography.Text>
            <strong>
              Строим расписание, как в подтеме 2, и считаем процессы на 21-й мс
              одной формулой.
            </strong>{" "}
            Файл 22-2.xlsx приложен к задаче темы в практике этой подтемы. У
            процессов в нём до трёх поставщиков, поэтому столбцов больше:
          </Typography.Text>
          <ol>
            <li>Разложить столбец C по столбцам C:E — три поставщика.</li>
            <li>
              В F:H — их окончания:{" "}
              <Notation>{"=ЕСНД(ВПР(C2;$A$1:$J1;10;0);0)"}</Notation>; окончание
              теперь в J, десятом столбце.
            </li>
            <li>
              Начало <Notation>{"I2"}</Notation> —{" "}
              <Notation>{"=МАКС(F2:H2)"}</Notation>, окончание{" "}
              <Notation>{"J2"}</Notation> — <Notation>{"=I2+B2"}</Notation>.
            </li>
            <li>
              Ответ —{" "}
              <Notation>
                {'=СЧЁТЕСЛИМН(I2:I21;"<"&J23;J2:J21;">="&J23)'}
              </Notation>{" "}
              при 21 в J23 под таблицей.
            </li>
          </ol>
          <SheetBlock
            {...lessonMedia.sheetTheme}
            label={"Лист «Задача темы»"}
          />
          <Typography.Text>
            Ответ — <strong>3</strong>: на 21-й мс идут процессы 6 (с 15 до 27),
            7 (с 15 до 30) и 10 (с 17 до 23). Все процессы закончатся к 51 мс —
            это ответ на вопрос о минимальном общем времени, если спросят его.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "skolko-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "n-я мс",
                note: <>от момента n − 1 до n</>,
              },
              {
                key: "Идёт на n-й мс",
                note: <>начало {"<"} n, окончание ≥ n</>,
              },
              {
                key: "Формула",
                note: (
                  <Notation>
                    {'=СЧЁТЕСЛИМН(B2:B9;"<"&F1;C2:C9;">="&F1)'}
                  </Notation>
                ),
              },
              {
                key: "За первые t мс",
                note: <>окончание ≤ t</>,
              },
              {
                key: "Когда закончатся k",
                note: <Notation>{"=НАИМЕНЬШИЙ(C2:C9;k)"}</Notation>,
              },
              { key: "Задача темы", note: <>3</> },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: (
        <>
          Процесс начинается в момент 6 и заканчивается в 11. На каких
          миллисекундах он идёт? Идёт ли он на 6-й?
        </>
      ),
      reveal: <>С 7-й по 11-ю. На 6-й — нет: она кончается в момент 6.</>,
    },
    {
      id: "zadacha-2",
      prompt: <>Сколько процессов учебного примера идёт на 12-й мс?</>,
      reveal: <>Два: 6 (с 8 до 12) и 7 (с 11 до 13).</>,
    },
    {
      id: "zadacha-3",
      prompt: (
        <>Почему в формуле для начала стоит «{"<"}», а для окончания — «≥»?</>
      ),
      reveal: (
        <>
          Процесс, начавшийся в n, начнёт идти только с (n + 1)-й мс. А
          закончившийся в n идёт на n-й мс — это его последняя миллисекунда.
        </>
      ),
    },
    {
      id: "zadacha-4",
      prompt: (
        <>Сколько процессов учебного примера закончилось за первые 8 мс?</>
      ),
      reveal: <>Четыре: 1, 2, 3 и 4 — их окончания 4, 6, 7 и 8.</>,
    },
    {
      id: "zadacha-5",
      prompt: <>За какое время в учебном примере закончатся шесть процессов?</>,
      reveal: <>За 12 мс: шестое по возрастанию окончание — 12.</>,
    },
  ],
};

export default content;
