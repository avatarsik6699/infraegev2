// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./executors.paid.sostoyaniya-i-fazy.media";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "fazy-raboty",
      navLabel: "Фазы работы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В таблице из нескольких состояний каждое состояние — это фаза
              работы или запомненное свойство уже просмотренной части; назвав
              смысл каждого, находят вид результата без трассы на длинном слове.
            </strong>{" "}
            Многофазные таблицы встречаются в 7 задачах из 22; часто в них
            результат зависит только от длины слова, а не от его цифр.
          </Typography.Text>
          <Typography.Text>
            Главный пример — таблица из четырёх состояний, которая из любого
            слова длины k делает <Notation>{"10"}</Notation>, затем k единиц,
            затем <Notation>{"0"}</Notation>. Сначала проследим её на k = 3 такт
            за тактом, потом назовём фазы и выведем результат для любого k.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "perehody-mezhdu-sostoyaniyami",
      navLabel: "Переходы между состояниями",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В сложной таблице сначала проследи, где машина меняет состояние:
              переходы делят работу на этапы.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Иногда вся работа естественно делится на этапы: войти в данные,
            пройти вправо, вернуться влево, дописать начало, остановиться. Для
            каждого этапа выясни направление, изменение цифр и событие перехода
            к следующему состоянию.
          </Typography.Text>
          <Typography.Text>
            Рассмотрим таблицу. Вход — непустая двоичная строка, головка
            начинает на ближайшем <Notation>{"λ"}</Notation> слева в состоянии{" "}
            <Notation>{"q0"}</Notation>.
          </Typography.Text>
          <LessonTable
            label={
              "Вход — непустая двоичная строка, головка начинает на ближайшем λ слева в состоянии q0"
            }
            columns={[
              { label: "Состояние" },
              {
                label: (
                  <>
                    <Notation>{"λ"}</Notation>
                  </>
                ),
              },
              {
                label: (
                  <>
                    <Notation>{"0"}</Notation>
                  </>
                ),
              },
              {
                label: (
                  <>
                    <Notation>{"1"}</Notation>
                  </>
                ),
              },
            ]}
            rows={[
              [
                <>
                  <Notation>{"q0"}</Notation>
                </>,
                <>
                  <Notation>{"λ, R, q1"}</Notation>
                </>,
                "—",
                "—",
              ],
              [
                <>
                  <Notation>{"q1"}</Notation>
                </>,
                <>
                  <Notation>{"0, L, q2"}</Notation>
                </>,
                <>
                  <Notation>{"1, R, q1"}</Notation>
                </>,
                <>
                  <Notation>{"1, R, q1"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"q2"}</Notation>
                </>,
                <>
                  <Notation>{"0, L, q3"}</Notation>
                </>,
                "—",
                <>
                  <Notation>{"1, L, q2"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"q3"}</Notation>
                </>,
                <>
                  <Notation>{"1, S, q3"}</Notation>
                </>,
                "—",
                "—",
              ],
            ]}
          />
          <Typography.Text>
            Пройдём её на слове <Notation>{"101"}</Notation>:
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.tmTrace101_q0Rq1q10Lq21Rq11Rq1q20Lq31Lq2q31Sq3_48273b}
            label={"Работа машины Тьюринга: такт за тактом"}
          />
        </>
      ),
    },
    {
      id: "fazy-po-dejstviyam",
      navLabel: "Фазы по действиям",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Назовём фазы по действиям, а не по номерам состояний.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В <Notation>{"q1"}</Notation> все исходные цифры превращаются в
            единицы, головка идёт вправо. На правой пустой ячейке она пишет ноль
            и возвращается влево в <Notation>{"q2"}</Notation>. В{" "}
            <Notation>{"q2"}</Notation> проходит полученные единицы без
            изменений. На пустой ячейке слева пишет ноль, сдвигается ещё левее и
            переходит в <Notation>{"q3"}</Notation>. Там пишет единицу и
            останавливается.
          </Typography.Text>
          <LessonTable
            label={"Там пишет единицу и останавливается"}
            columns={[
              { label: "Состояние" },
              { label: "Фаза" },
              { label: "Чем заканчивается" },
            ]}
            rows={[
              [
                <>
                  <Notation>{"q0"}</Notation>
                </>,
                "вход в слово",
                "первый сдвиг вправо",
              ],
              [
                <>
                  <Notation>{"q1"}</Notation>
                </>,
                "проход вправо, все цифры → 1",
                <>
                  <Notation>{"λ"}</Notation> справа: записать 0
                </>,
              ],
              [
                <>
                  <Notation>{"q2"}</Notation>
                </>,
                "возврат влево по единицам",
                <>
                  <Notation>{"λ"}</Notation> слева: записать 0
                </>,
              ],
              [
                <>
                  <Notation>{"q3"}</Notation>
                </>,
                "запись в начало",
                "записать 1 и остановиться",
              ],
            ]}
          />
          <Typography.Text>
            <Notation>{"q1"}</Notation> повторяется много тактов подряд, но
            цикла нет: головка каждый раз в новой ячейке, а до правого края
            остаётся всё меньше клеток. Поэтому каждая фаза конечна, и машина
            остановится.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "rezultat-dlya-lyuboj-dliny",
      navLabel: "Результат для любой длины",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Когда фазы названы, результат записывают для любой длины: здесь он
              зависит только от k.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если исходная длина равна <Notation>{"k"}</Notation>, итог имеет вид{" "}
            <Notation>{"10"}</Notation>, затем <Notation>{"k"}</Notation>{" "}
            единиц, затем <Notation>{"0"}</Notation>. Порядок выполнения команд
            слева — сначала записать 0, затем ещё левее 1 — даёт префикс{" "}
            <Notation>{"10"}</Notation> при чтении ленты слева направо.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.tmRows10k0}
            caption={
              <>
                Три исходные цифры (серые) стали единицами; ячейки в рамке
                записаны на краях: ноль справа в фазе q1, ноль и единица слева в
                фазах q2 и q3.
              </>
            }
          />
          <LessonTable
            label={"k, Итоговая двоичная строка, Значение"}
            columns={[
              { label: "k" },
              { label: "Итоговая двоичная строка" },
              { label: "Значение" },
            ]}
            rows={[
              [
                "1",
                <>
                  <Notation>{"1010"}</Notation>
                </>,
                "10",
              ],
              [
                "2",
                <>
                  <Notation>{"10110"}</Notation>
                </>,
                "22",
              ],
              [
                "3",
                <>
                  <Notation>{"101110"}</Notation>
                </>,
                "46",
              ],
              [
                "4",
                <>
                  <Notation>{"1011110"}</Notation>
                </>,
                "94",
              ],
              [
                "5",
                <>
                  <Notation>{"10111110"}</Notation>
                </>,
                "190",
              ],
              [
                "6",
                <>
                  <Notation>{"101111110"}</Notation>
                </>,
                "382",
              ],
              [
                "7",
                <>
                  <Notation>{"1011111110"}</Notation>
                </>,
                "766",
              ],
            ]}
          />
          <Typography.Text>
            Если спрашивают максимальный возможный результат не больше 500,
            ответ 382. При <Notation>{"k = 7"}</Notation> уже получается 766, и
            дальше значение только растёт. Перебирать все исходные числа не
            нужно: их цифры в первом проходе всё равно становятся единицами,
            влияет только длина.
          </Typography.Text>
          <Typography.Text>
            Формула этого результата: <Notation>{"R = 3 · 2ᵏ⁺¹ − 2"}</Notation>.
            Она получается из значения префикса <Notation>{"10"}</Notation>,
            равного 2: после приписывания <Notation>{"k"}</Notation> единиц
            будет <Notation>{"2 · 2ᵏ + (2ᵏ − 1)"}</Notation>, затем конечный
            ноль удваивает число. Можно пользоваться и таблицей: формула не
            обязательна, если смысл этапов понятен.
          </Typography.Text>
          <Typography.Text>
            Число тактов тоже следует из фаз: вход 1, проход по k цифрам k,
            запись справа 1, возврат по k единицам k, запись слева 1, остановка
            1 — всего 2k + 4.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "razryady-na-krayah",
      navLabel: "Разряды на краях",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если цифры слова сохраняются, а на краях дописываются разряды,
              результат выражают через N и длину k.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Пусть таблица проходит слово вправо без изменений, справа пишет 1,
            возвращается влево без изменений и пишет 1 слева от слова:
          </Typography.Text>
          <LessonTable
            label={"Состояние, λ, 0, 1"}
            columns={[
              { label: "Состояние" },
              {
                label: (
                  <>
                    <Notation>{"λ"}</Notation>
                  </>
                ),
              },
              {
                label: (
                  <>
                    <Notation>{"0"}</Notation>
                  </>
                ),
              },
              {
                label: (
                  <>
                    <Notation>{"1"}</Notation>
                  </>
                ),
              },
            ]}
            rows={[
              [
                <>
                  <Notation>{"q0"}</Notation>
                </>,
                <>
                  <Notation>{"λ, R, q1"}</Notation>
                </>,
                "—",
                "—",
              ],
              [
                <>
                  <Notation>{"q1"}</Notation>
                </>,
                <>
                  <Notation>{"1, L, q2"}</Notation>
                </>,
                <>
                  <Notation>{"0, R, q1"}</Notation>
                </>,
                <>
                  <Notation>{"1, R, q1"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"q2"}</Notation>
                </>,
                <>
                  <Notation>{"1, S, q2"}</Notation>
                </>,
                <>
                  <Notation>{"0, L, q2"}</Notation>
                </>,
                <>
                  <Notation>{"1, L, q2"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            Головка начинает в ближайшей пустой ячейке слева. Фазы: проход
            вправо (цифры те же), запись справа, возврат влево (цифры те же),
            запись слева. Получается <Notation>{"1 N 1"}</Notation>: из подтемы
            3 единица справа даёт 2N + 1, а единица слева от слова длины k + 1
            добавляет 2ᵏ⁺¹. Итог 2ᵏ⁺¹ + 2N + 1; для 21 ={" "}
            <Notation>{"10101"}</Notation> — <Notation>{"1101011"}</Notation>,
            то есть 64 + 43 = 107.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostoyanie-kak-pamyat",
      navLabel: "Состояние как память",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Состояние может хранить не фазу, а небольшое свойство уже
              просмотренной части — например, чётность числа единиц.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Состояние иногда хранит одно небольшое свойство уже просмотренной
            части. Например, <Notation>{"q0"}</Notation> может означать, что
            просмотрено чётное количество единиц, а <Notation>{"q1"}</Notation>{" "}
            — нечётное. При чтении нуля состояние не меняется; при чтении
            единицы переключается на другое.
          </Typography.Text>
          <LessonTable
            label={
              "При чтении нуля состояние не меняется; при чтении единицы переключается на другое"
            }
            columns={[
              { label: "Состояние" },
              {
                label: (
                  <>
                    <Notation>{"λ"}</Notation>
                  </>
                ),
              },
              {
                label: (
                  <>
                    <Notation>{"0"}</Notation>
                  </>
                ),
              },
              {
                label: (
                  <>
                    <Notation>{"1"}</Notation>
                  </>
                ),
              },
            ]}
            rows={[
              [
                <>
                  <Notation>{"q0"}</Notation> (чётно)
                </>,
                <>
                  <Notation>{"0, S, q0"}</Notation>
                </>,
                <>
                  <Notation>{"0, R, q0"}</Notation>
                </>,
                <>
                  <Notation>{"1, R, q1"}</Notation>
                </>,
              ],
              [
                <>
                  <Notation>{"q1"}</Notation> (нечётно)
                </>,
                <>
                  <Notation>{"1, S, q1"}</Notation>
                </>,
                <>
                  <Notation>{"0, R, q1"}</Notation>
                </>,
                <>
                  <Notation>{"1, R, q0"}</Notation>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            Если головка начинает на первой цифре в <Notation>{"q0"}</Notation>,
            а машина идёт вправо, после просмотра всего слова состояние
            показывает чётность числа единиц. На пустой ячейке можно записать{" "}
            <Notation>{"0"}</Notation> в чётном состоянии и{" "}
            <Notation>{"1"}</Notation> в нечётном и остановиться. Для{" "}
            <Notation>{"1011"}</Notation> единиц три, поэтому будет дописана
            единица: <Notation>{"10111"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Это объяснение становится доказательством, когда проверены обе
            строки таблицы: каждый ноль сохраняет правильный смысл состояния, а
            каждая единица меняет чётность и переводит в нужную строку. Названия
            состояний сами по себе ничего не гарантируют: смысл устанавливается
            по командам.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "fazy-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Переходы между состояниями делят работу на фазы; каждую фазу
                    описывают направлением, изменением цифр и событием выхода.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Повторение одного состояния — не цикл, если головка идёт к
                    краю конечного слова.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Когда первый проход стирает различия цифр, результат зависит
                    только от длины: перебирают k, а не числа.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Записи у краёв читают в порядке ленты слева направо; при
                    сохранённом слове результат выражают через N и k.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Состояние может хранить свойство просмотренной части
                    (чётность), и это доказывают по обеим строкам таблицы.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
};

export default content;
