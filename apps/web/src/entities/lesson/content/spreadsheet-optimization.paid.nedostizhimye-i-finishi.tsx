// Paid content (Change 192): served only after an access check; never
// import it statically.
import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonSummary,
  ProofDisclosure,
  SheetBlock,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./spreadsheet-optimization.paid.nedostizhimye-i-finishi.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "uglovye-finishi",
      navLabel: "«Угловые» клетки",
      explanation: (
        <>
          <Typography.Text>
            В задаче темы маршрут заканчивается в любой «угловой» клетке. Где
            тогда искать ответ?
          </Typography.Text>
          <Typography.Text>
            <strong>
              «Угловая» клетка — тупик: робот может в неё прийти, но не может
              сделать ни шага вправо, ни шага вниз. Ответ ищут среди всех
              тупиков: максимум — среди их наибольших сумм, минимум — среди
              наименьших.
            </strong>{" "}
            Тупик не обязательно стоит в углу поля: его могут образовать
            внутренние стены.
          </Typography.Text>
          <Typography.Text>
            Поставим на поле 4 × 4 пять стен: справа и снизу от B3, между C1 и
            C2, между C2 и C3 и между C4 и D4. Тупиков стало три — B3, C4 и D4:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridWallsTheme}
            caption={
              <>
                Рамки — тупики B3, C4 и D4. В C3 робот не попадает: слева и
                сверху стены, поэтому там «X».
              </>
            }
          />
          <Typography.Text>
            Наибольшие суммы в тупиках — 16, 23 и 32, наименьшие — 14, 23 и 28.
            Ответ: максимум <strong>32</strong>, минимум <strong>14</strong>.
            Если смотреть только на правую нижнюю клетку, минимум получится 28 —
            и потеряется короткий маршрут A1 → A2 → B2 → B3 с суммой 2 + 5 + 1 +
            6 = 14.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "nedostizhimye",
      navLabel: "Недостижимые клетки",
      explanation: (
        <>
          <Typography.Text>
            А что делать с клеткой C3, в которую робот попасть не может?
          </Typography.Text>
          <Typography.Text>
            <strong>
              Её клетку в блоке оставляют пустой. Если там будет число, формулы
              придумают маршрут, которого нет.
            </strong>{" "}
            Допустим, в блоке минимума в клетке C3 оставили её монету 2 — будто
            маршрут начался прямо в C3. Тогда до C4 получится 7 + 2 = 9, и ответ
            станет 9 вместо 14.
          </Typography.Text>
          <Typography.Text>
            Пустую ячейку{" "}
            <PythonTerm term="xl-range-functions">
              <Notation>{"МАКС"}</Notation> и <Notation>{"МИН"}</Notation>
            </PythonTerm>{" "}
            просто пропускают: если сверху пусто, а слева 16, то{" "}
            <Notation>{"МИН"}</Notation> вернёт 16. Поэтому соседи C3 считаются
            обычными формулами — достаточно очистить саму C3.
          </Typography.Text>
          <Typography.Text>
            Недостижимость расползается по полю. Клетка недостижима, если с
            каждой стороны входа у неё стена или недостижимая клетка. Такие
            клетки тоже очищают. Их число иногда спрашивают в задаче — это
            количество пустых клеток блока.
          </Typography.Text>
          <ProofDisclosure
            kind="nuance"
            summary="Тонкости: почему не ставить в такие клетки 0"
          >
            <Typography.Text>
              Ноль — это сумма маршрута, а не его отсутствие. Для максимума ноль
              обычно не мешает, а минимум он ломает так же, как монета: из
              клетки с нулём формулы построят несуществующий дешёвый маршрут.
            </Typography.Text>
          </ProofDisclosure>
        </>
      ),
    },
    {
      id: "zadacha-temy",
      navLabel: "Задача темы целиком",
      explanation: (
        <>
          <Typography.Text>Как решить задачу темы на файле?</Typography.Text>
          <Typography.Text>
            <strong>
              Блок со стенами, пустые недостижимые клетки и одна формула для
              ответа по тупикам.
            </strong>{" "}
            На поле 4 × 4 всё вместе выглядит так: блок максимума в{" "}
            <Notation>{"A6:D9"}</Notation>, минимума — в{" "}
            <Notation>{"A11:D14"}</Notation>, клетки под C3 пустые, а ответы — в{" "}
            <Notation>{"F6"}</Notation> и <Notation>{"F11"}</Notation>:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheetTheme} label={"Лист «Тупики»"} />
          <Typography.Text>
            В формулах ответа — только клетки блока под тупиками B3, C4 и D4. На
            файле задачи темы порядок тот же:
          </Typography.Text>
          <ol>
            <li>
              Блок <Notation>{"A22:T41"}</Notation> под полем, стены перенесены
              на него форматами.
            </li>
            <li>Общая формула на весь блок, потом формулы у стен.</li>
            <li>
              Очисти клетки блока, в которые робот не попадает. В этом файле их
              23.
            </li>
            <li>
              Найди тупики — клетки, закрытые стенами или краем поля справа и
              снизу. В файле их пять, включая правую нижнюю.
            </li>
            <li>
              <Notation>{"МАКС"}</Notation> по клеткам блока под тупиками — это
              максимум. Запиши его, замени <Notation>{"МАКС"}</Notation> на{" "}
              <Notation>{"МИН"}</Notation> во всём листе (
              <KeyCombo keys={["Ctrl", "H"]} />) — получишь минимум.
            </li>
          </ol>
          <Typography.Text>
            Для файла задачи темы получается <strong>2629 378</strong>: максимум
            2629, минимум 378 — в ответ записываем именно в этом порядке.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "finishi-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                key: "Тупик",
                note: <>закрыт справа и снизу — здесь маршрут кончается</>,
              },
              {
                key: "Ответ",
                note: (
                  <>
                    <Notation>{"МАКС"}</Notation> и <Notation>{"МИН"}</Notation>{" "}
                    по клеткам блока под тупиками
                  </>
                ),
              },
              {
                key: "Недостижимая клетка",
                note: <>на каждом входе стена или недостижимая клетка</>,
              },
              {
                key: "В блоке",
                note: <>недостижимые клетки оставляют пустыми, а не 0</>,
              },
              {
                key: "Пустая ячейка",
                note: <>МАКС и МИН её пропускают</>,
              },
              { key: "Задача темы", note: <>2629 378</> },
            ]}
          />
        </>
      ),
    },
  ],
  checkpoint: [
    {
      id: "zadacha-1",
      prompt: <>Почему для поля 4 × 4 со стенами ответ «минимум 28» неверен?</>,
      reveal: (
        <>
          28 — наименьшая сумма только до D4. Маршрут может закончиться и в
          тупике B3, а туда ведёт A1 → A2 → B2 → B3 с суммой 14.
        </>
      ),
    },
    {
      id: "zadacha-2",
      prompt: (
        <>
          Клетка закрыта стеной слева, а сверху к ней ведёт только недостижимая
          клетка. Достижима ли она?
        </>
      ),
      reveal: (
        <>Нет: с обеих сторон входа пути нет. Её тоже оставляют пустой.</>
      ),
    },
    {
      id: "zadacha-3",
      prompt: (
        <>
          В блоке максимума слева от клетки пусто, сверху — 30, монета 5. Что
          покажет <Notation>{"=B2+МАКС(A7;B6)"}</Notation>?
        </>
      ),
      reveal: <>35: МАКС пропускает пустую ячейку и берёт 30.</>,
    },
    {
      id: "zadacha-4",
      prompt: (
        <>
          Почему недостижимую клетку блока нельзя заполнить её монетой или
          нулём?
        </>
      ),
      reveal: (
        <>
          Формулы соседей возьмут это число как сумму настоящего маршрута. На
          поле 4 × 4 так минимум превращается из 14 в 9.
        </>
      ),
    },
    {
      id: "zadacha-5",
      prompt: (
        <>
          В файле тупики — E7, K15 и T20, блок начинается в строке 22. Какой
          формулой найти максимум?
        </>
      ),
      reveal: (
        <>
          <Notation>{"=МАКС(E28;K36;T41)"}</Notation>: каждая клетка блока на 21
          строку ниже своего тупика.
        </>
      ),
    },
  ],
};

export default content;
