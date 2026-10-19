// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonSummary,
  LessonTable,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { lessonMedia } from "./parallel-computing.paid.parallelnost.media";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "vremennaya-setka",
      navLabel: "Временная сетка",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Вопросы о параллельности решают по временной сетке: в каждой
              миллисекунде [t; t + 1) считают работающие процессы, а потом ищут
              пик, длину непрерывной серии или суммарное время.
            </strong>{" "}
            Это три разных ответа, и в задачах задания встречаются все три.
          </Typography.Text>
          <Typography.Text>
            Главный пример — восемь процессов: пик 3 только на [6; 7), ровно два
            процесса — на [0; 6) и [7; 12).
          </Typography.Text>
        </>
      ),
    },
    {
      id: "setka-v-excel",
      navLabel: "Сетка в Excel",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Временная сетка в Excel ставит 1, если процесс работает в данной
              миллисекунде; сумма по столбцу — число работающих процессов.
            </strong>
          </Typography.Text>
          <Typography.Text>Она удобна для вопросов:</Typography.Text>
          <ul>
            <li>сколько процессов работает одновременно;</li>
            <li>когда достигается максимум;</li>
            <li>
              сколько времени сохраняется определённое число работающих
              процессов.
            </li>
          </ul>
          <Typography.Text>
            В задачах задания встречаются вопросы именно о длительности отрезка
            с максимальным числом одновременно выполняемых процессов.
          </Typography.Text>
          <Typography.Text>Используем нашу таблицу A:E.</Typography.Text>
          <Typography.Text>Оставим F свободным.</Typography.Text>
          <Typography.Text>
            В строке 1 начиная с G запишем моменты:
          </Typography.Text>
          <LessonTable
            label={"В строке 1 начиная с G запишем моменты"}
            columns={[
              { label: "G1", numeric: true },
              { label: "H1", numeric: true },
              { label: "I1", numeric: true },
              { label: "J1", numeric: true },
              { label: "…" },
            ]}
            rows={[["0", "1", "2", "3", "…"]]}
          />
          <Typography.Text>
            Каждый столбец обозначает одну миллисекунду:
          </Typography.Text>
          <ul>
            <li>G — [0;1);</li>
            <li>H — [1;2);</li>
            <li>I — [2;3).</li>
          </ul>
          <Typography.Text>В G2 вводим:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(И($D2<=G$1;G$1<$E2);1;0)" }]}
            label="Формула"
          />
          <Typography.Text>Разберём её последовательно.</Typography.Text>
          <Typography.Text>Условие:</Typography.Text>
          <FormulaBlock lines={[{ formula: "$D2<=G$1" }]} label="Формула" />
          <Typography.Text>
            проверяет, успел ли процесс начаться.
          </Typography.Text>
          <Typography.Text>Условие:</Typography.Text>
          <FormulaBlock lines={[{ formula: "G$1<$E2" }]} label="Формула" />
          <Typography.Text>проверяет, не завершился ли он.</Typography.Text>
          <Typography.Text>
            Функция <Notation>{"И"}</Notation> требует, чтобы оба условия
            выполнялись.
          </Typography.Text>
          <Typography.Text>
            Функция <Notation>{"ЕСЛИ"}</Notation> возвращает:
          </Typography.Text>
          <ul>
            <li>1 — если процесс работает;</li>
            <li>0 — если не работает.</li>
          </ul>
          <Typography.Text>
            <strong>
              Здесь единица означает работу в течение соответствующей
              миллисекунды.
            </strong>
          </Typography.Text>
          <Typography.Text>
            При целочисленных началах и окончаниях процесс либо работает весь
            промежуток [t;t+1), либо не работает в нём.
          </Typography.Text>
          <Typography.Text>Теперь формулу можно скопировать:</Typography.Text>
          <ul>
            <li>вправо по шкале времени;</li>
            <li>вниз по процессам.</li>
          </ul>
          <Typography.Text>Разберём закрепления:</Typography.Text>
          <LessonTable
            label={"Разберём закрепления"}
            columns={[
              { label: "Ссылка" },
              { label: "Что закреплено" },
              { label: "Зачем" },
            ]}
            rows={[
              [
                <>
                  <Notation>{"$D2"}</Notation>
                </>,
                "Столбец D",
                "При копировании вправо начало остаётся в D",
              ],
              [
                <>
                  <Notation>{"$E2"}</Notation>
                </>,
                "Столбец E",
                "Окончание остаётся в E",
              ],
              [
                <>
                  <Notation>{"G$1"}</Notation>
                </>,
                "Строка 1",
                "Время всегда берётся из верхней строки",
              ],
            ]}
          />
          <Typography.Text>
            При копировании вниз строка процесса изменяется.
          </Typography.Text>
          <Typography.Text>
            При копировании вправо столбец времени изменяется.
          </Typography.Text>
          <Typography.Text>
            Поэтому одна формула строит всю сетку.
          </Typography.Text>
          <Typography.Text>
            <strong>Чтобы посчитать активные процессы в столбце G:</strong>
          </Typography.Text>
          <FormulaBlock lines={[{ formula: "=СУММ(G2:G9)" }]} label="Формула" />
          <Typography.Text>
            Если единицы стоят у двух процессов, сумма равна 2.
          </Typography.Text>
          <Typography.Text>Если у трёх — 3.</Typography.Text>
          <Typography.Text>
            Разместим эти суммы в строке 11 и скопируем вправо.
          </Typography.Text>
          <Typography.Text>
            Для нашего примера получатся следующие участки:
          </Typography.Text>
          <LessonTable
            label={"Для нашего примера получатся следующие участки"}
            columns={[
              { label: "Промежуток" },
              { label: "Работающие процессы" },
              { label: "Количество", numeric: true },
            ]}
            rows={[
              ["[0;4)", "1, 2", "2"],
              ["[4;6)", "2, 3", "2"],
              ["[6;7)", "3, 4, 5", "3"],
              ["[7;8)", "4, 5", "2"],
              ["[8;11)", "5, 6", "2"],
              ["[11;12)", "6, 7", "2"],
              ["[12;13)", "7", "1"],
              ["[13;14)", "8", "1"],
            ]}
          />
          <LessonDiagram
            {...lessonMedia.prLoad_9deccd}
            caption={
              <>
                Число работающих процессов в каждой миллисекунде основного
                примера: пик 3 — только на [6; 7).
              </>
            }
          />
          <Typography.Text>
            Максимальное число работающих процессов равно:
          </Typography.Text>
          <Typography.Text>3.</Typography.Text>
          <Typography.Text>
            Шкалу строят на всё время работы системы: для основного примера
            достаточно столбцов 0 … 13, они покрывают [0; 14).
          </Typography.Text>
          <Typography.Text>
            Если система работает дольше, чем покрывает шкала, сетку и формулы
            нужно продолжить вправо. Иначе она покажет только часть расписания.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pik-parallelnosti",
      navLabel: "Пик параллельности",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Число одновременно работающих процессов и длительность такого
              состояния — разные ответы.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В основном примере максимум равен 3.
          </Typography.Text>
          <Typography.Text>
            Но три процесса работают только на промежутке:
          </Typography.Text>
          <Typography.Text>[6;7).</Typography.Text>
          <Typography.Text>Его длительность:</Typography.Text>
          <Typography.Text>7-6=1 мс.</Typography.Text>
          <Typography.Text>Таким образом:</Typography.Text>
          <LessonTable
            label={"Таким образом"}
            columns={[{ label: "Вопрос" }, { label: "Ответ", numeric: true }]}
            rows={[
              [
                "Какое максимальное число процессов работает одновременно?",
                "3",
              ],
              [
                "Как долго длится самый длинный отрезок с этим максимумом?",
                "1 мс",
              ],
            ]}
          />
          <Typography.Text>
            Нельзя ответить числом 3 на второй вопрос только потому, что
            максимум равен трём процессам.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "samyj-dlinnyj-otrezok",
      navLabel: "Самый длинный отрезок",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Самый длинный непрерывный отрезок нельзя заменять суммой отдельных
              отрезков.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Предположим, три процесса одновременно работают:
          </Typography.Text>
          <ul>
            <li>с 2 до 5;</li>
            <li>с 8 до 12.</li>
          </ul>
          <Typography.Text>
            Общая длительность такого состояния:
          </Typography.Text>
          <Typography.Text>(5-2)+(12-8)=3+4=7.</Typography.Text>
          <Typography.Text>
            Но самый длинный <strong>непрерывный</strong> отрезок:
          </Typography.Text>
          <Typography.Text>max(3;4)=4.</Typography.Text>
          <Typography.Text>
            Если вопрос содержит слово «отрезок», обычно требуется один
            непрерывный промежуток.
          </Typography.Text>
          <Typography.Text>
            Чтобы найти его в Excel, можно считать длину текущей серии
            подходящих миллисекунд.
          </Typography.Text>
          <Typography.Text>Пусть:</Typography.Text>
          <ul>
            <li>числа активных процессов находятся в G11:T11;</li>
            <li>максимум записан в E14.</li>
          </ul>
          <Typography.Text>В E14:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=МАКС(G11:T11)" }]}
            label="Формула"
          />
          <Typography.Text>В первой ячейке серии, G12:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(G11=$E$14;1;0)" }]}
            label="Формула"
          />
          <Typography.Text>В следующей, H12:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(H11=$E$14;G12+1;0)" }]}
            label="Формула"
          />
          <Typography.Text>Эту формулу протягиваем вправо.</Typography.Text>
          <Typography.Text>Логика:</Typography.Text>
          <ul>
            <li>
              если сейчас выполняется нужное условие, увеличиваем длину серии;
            </li>
            <li>если условие перестало выполняться, обнуляем серию.</li>
          </ul>
          <Typography.Text>Например:</Typography.Text>
          <LessonTable
            label={"Например"}
            columns={[
              { label: "Количество активных" },
              { label: "2", numeric: true },
              { label: "3", numeric: true },
              { label: "3", numeric: true },
              { label: "3", numeric: true },
              { label: "2", numeric: true },
              { label: "3", numeric: true },
              { label: "3", numeric: true },
            ]}
            rows={[
              ["Длина текущей серии для 3", "0", "1", "2", "3", "0", "1", "2"],
            ]}
          />
          <Typography.Text>
            Максимум второй строки равен 3. Значит, самый длинный отрезок длится
            3 мс.
          </Typography.Text>
          <Typography.Text>Итог:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=МАКС(G12:T12)" }]}
            label="Формула"
          />
          <Typography.Text>
            <strong>Можно менять само условие серии.</strong>
          </Typography.Text>
          <Typography.Text>Для «ровно четыре процесса»:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(H11=4;G12+1;0)" }]}
            label="Формула"
          />
          <Typography.Text>Для «не менее четырёх»:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(H11>=4;G12+1;0)" }]}
            label="Формула"
          />
          <Typography.Text>Для «не более четырёх»:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=ЕСЛИ(H11<=4;G12+1;0)" }]}
            label="Формула"
          />
          <Typography.Text>
            В последнем случае обязательно ограничивай анализ временем работы
            системы. После завершения всех процессов активных будет 0, что тоже
            удовлетворяет условию «не более четырёх». Бесконечное время после
            завершения системы обычно не относится к искомому отрезку.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "sostav-processov",
      navLabel: "Состав процессов",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Состав работающих процессов может меняться, пока их количество
              остаётся тем же.
            </strong>
          </Typography.Text>
          <Typography.Text>В нашем примере:</Typography.Text>
          <ul>
            <li>на [0;4) работают процессы 1 и 2;</li>
            <li>на [4;6) работают процессы 2 и 3.</li>
          </ul>
          <Typography.Text>Количество всё время равно двум.</Typography.Text>
          <Typography.Text>Поэтому для условия:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Одновременно работают ровно два процесса.
            </Typography.Text>
          </blockquote>
          <Typography.Text>это один непрерывный отрезок:</Typography.Text>
          <Typography.Text>[0;6),</Typography.Text>
          <Typography.Text>длительность:</Typography.Text>
          <Typography.Text>6 мс.</Typography.Text>
          <Typography.Text>
            Замена процесса 1 процессом 3 не разрывает отрезок с количеством 2.
          </Typography.Text>
          <Typography.Text>
            Далее ровно два процесса работают на [7;12). Этот отрезок длится 5
            мс.
          </Typography.Text>
          <Typography.Text>Получаем:</Typography.Text>
          <LessonTable
            label={"Получаем"}
            columns={[
              { label: "Что считаем" },
              { label: "Значение", numeric: true },
            ]}
            rows={[
              [
                "Самый длинный отрезок с ровно двумя активными процессами",
                "6 мс",
              ],
              [
                "Суммарное время с ровно двумя активными процессами",
                "6+5=11 мс",
              ],
              [
                "Самый длинный отрезок с не менее чем двумя активными процессами",
                "12 мс",
              ],
            ]}
          />
          <Typography.Text>
            В последнем случае промежуток [6;7), где работают три процесса,
            подходит под условие «не менее двух». Поэтому весь участок [0;12)
            непрерывен.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если условие говорит о конкретных процессах, нужен другой расчёт.
            </strong>
          </Typography.Text>
          <Typography.Text>Например:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Как долго одновременно работают процессы 5 и 6?
            </Typography.Text>
          </blockquote>
          <Typography.Text>Процесс 5:</Typography.Text>
          <Typography.Text>[6;11).</Typography.Text>
          <Typography.Text>Процесс 6:</Typography.Text>
          <Typography.Text>[8;12).</Typography.Text>
          <Typography.Text>Общий участок:</Typography.Text>
          <Typography.Text>[8;11),</Typography.Text>
          <Typography.Text>длительность:</Typography.Text>
          <Typography.Text>3 мс.</Typography.Text>
          <Typography.Text>Для выбранной группы процессов:</Typography.Text>
          <Typography.Text>Начало общего участка=max(sᵢ),</Typography.Text>
          <Typography.Text>Окончание общего участка=min(fᵢ).</Typography.Text>
          <Typography.Text>Поэтому:</Typography.Text>
          <Typography.Text>L=max(0;min(fᵢ)-max(sᵢ)).</Typography.Text>
          <Typography.Text>
            Внешний максимум с нулём нужен на случай, когда общего участка нет.
          </Typography.Text>
          <Typography.Text>
            Для процессов 5 и 6 в нашей Excel-таблице:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=МАКС(0;МИН(E6;E7)-МАКС(D6;D7))" }]}
            label="Формула"
          />
          <Typography.Text>
            Этот расчёт требует, чтобы{" "}
            <strong>именно выбранные процессы</strong> работали одновременно.
            Простое постоянство количества процессов такого требования не
            содержит.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "isklyuchennyj-id",
      navLabel: "Исключённый ID",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Условие об исключённом ID обычно меняет подсчёт, но не сами
              зависимости.
            </strong>
          </Typography.Text>
          <Typography.Text>
            В задачах задания есть задачи, где нужно получить одновременную
            работу четырёх процессов, причём определённый ID не должен входить в
            выбранную четвёрку.
          </Typography.Text>
          <Typography.Text>
            Например, процесс 2 нельзя учитывать в группе.
          </Typography.Text>
          <Typography.Text>
            Это не означает, что нужно удалить процесс 2 из системы.
          </Typography.Text>
          <Typography.Text>
            Другие процессы могут использовать его результат. Его выполнение и
            окончание всё равно нужны для расчёта расписания.
          </Typography.Text>
          <Typography.Text>
            Меняется только число процессов, которые мы учитываем.
          </Typography.Text>
          <Typography.Text>Для нашего расположения столбцов:</Typography.Text>
          <FormulaBlock
            lines={[
              {
                formula:
                  '=СЧЁТЕСЛИМН($D$2:$D$9;"<="&H2;$E$2:$E$9;">"&H2;$A$2:$A$9;"<>2")',
              },
            ]}
            label="Формула"
          />
          <Typography.Text>Дополнительное условие:</Typography.Text>
          <FormulaBlock lines={[{ formula: '"<>2"' }]} label="Формула" />
          <Typography.Text>означает «ID не равен 2».</Typography.Text>
          <Typography.Text>
            При этом нужно внимательно читать вопрос:
          </Typography.Text>
          <ul>
            <li>
              должны работать <strong>ровно четыре процесса всего</strong>;
            </li>
            <li>
              или нужно, чтобы одновременно работали{" "}
              <strong>хотя бы четыре подходящих процесса</strong>;
            </li>
            <li>или речь идёт о конкретной неизменной группе.</li>
          </ul>
          <Typography.Text>Это разные требования.</Typography.Text>
        </>
      ),
    },
    {
      id: "proverka-po-strokam",
      navLabel: "Проверка по строкам",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Решение проверяют по строкам: окончание минус начало —
              длительность, а начало не раньше окончания каждого поставщика.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Для каждой строки должны выполняться два условия.
          </Typography.Text>
          <Typography.Text>Первое:</Typography.Text>
          <Typography.Text>fᵢ-sᵢ=dᵢ.</Typography.Text>
          <Typography.Text>Второе, при отсутствии задержки:</Typography.Text>
          <Typography.Text>sᵢ≥ f_j</Typography.Text>
          <Typography.Text>для каждого поставщика j.</Typography.Text>
          <Typography.Text>
            Если процесс начинается в момент 8, а один из его поставщиков
            заканчивается в 11, расписание невозможно.
          </Typography.Text>
          <Typography.Text>
            Для расписания с самым ранним запуском без ограничения ресурсов
            дополнительно должно быть:
          </Typography.Text>
          <Typography.Text>sᵢ=max(f_поставщиков).</Typography.Text>
          <Typography.Text>
            Если начало больше этого максимума, процесс зачем-то задержан. Это
            может быть разрешено условием, но требует осмысленного объяснения.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Полезная проверка для временной сетки: сумма всех единиц равна
              сумме длительностей.
            </strong>
          </Typography.Text>
          <Typography.Text>В нашем примере:</Typography.Text>
          <Typography.Text>4+6+3+2+5+4+2+1=27.</Typography.Text>
          <Typography.Text>
            Каждая единица сетки означает одну миллисекунду работы одного
            процесса.
          </Typography.Text>
          <Typography.Text>
            Поэтому сумма всех единиц должна быть 27.
          </Typography.Text>
          <Typography.Text>Из таблицы параллельности:</Typography.Text>
          <Typography.Text>
            2·4+ 2·2+ 3·1+ 2·1+ 2·3+ 2·1+ 1·1+ 1·1=27.
          </Typography.Text>
          <Typography.Text>
            Совпадение помогает обнаружить ошибку на границах.
          </Typography.Text>
          <Typography.Text>
            Но 27 — это <strong>суммарный объём работы всех процессов</strong>.
            Общее время системы равно 14, потому что часть работ идёт
            одновременно.
          </Typography.Text>
          <Typography.Text>
            Для такой проверки шкала должна покрывать всё расписание.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vmeste-s-processom",
      navLabel: "Вместе с процессом",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Сколько процессов работали вместе с процессом i» считают только
              на промежутке [sᵢ; fᵢ) и без самого i.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Во время работы процесса 5 — промежуток [6; 11) — рядом с ним
            работают: на [6; 7) процессы 3 и 4, на [7; 8) — процесс 4, на [8;
            11) — процесс 6. Наибольшее число других процессов, работавших
            одновременно с процессом 5, — 2.
          </Typography.Text>
          <Typography.Text>
            В сетке для этого берут столбцы от <Notation>{"s₅"}</Notation> до{" "}
            <Notation>{"f₅ − 1"}</Notation> и из суммы по каждому столбцу
            вычитают единицу самого процесса 5 — или считают{" "}
            <Notation>{"СЧЁТЕСЛИМН"}</Notation> с условием «ID не равен 5», как
            выше.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "parallelnost-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Сетка:{" "}
                    <Notation>{"=ЕСЛИ(И($D2<=G$1;G$1<$E2);1;0)"}</Notation>,
                    сумма по столбцу — число работающих в [t; t + 1).
                  </>
                ),
              },
              {
                note: (
                  <>
                    Пик, длина самой длинной серии и суммарное время — разные
                    ответы; серия не разрывается, если меняется состав, а число
                    то же.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Длина серии:{" "}
                    <Notation>{"=ЕСЛИ(H11=$E$14;G12+1;0)"}</Notation> и её
                    максимум; условие серии меняют под вопрос, ограничивая шкалу
                    временем работы системы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Конкретная группа процессов: общий участок max(s) … min(f),
                    длина max(0; min f − max s).
                  </>
                ),
              },
              {
                note: <>Исключённый ID убирают из подсчёта, а не из системы.</>,
              },
              {
                note: (
                  <>
                    Проверка сетки: сумма всех единиц равна сумме длительностей.
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
