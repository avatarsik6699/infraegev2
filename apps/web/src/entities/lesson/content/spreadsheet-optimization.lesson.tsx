import { KeyCombo } from "~/shared/components/key-combo";
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  FormulaBlock,
  LessonDiagram,
  LessonStepper,
  LessonSummary,
  LessonTable,
  SheetBlock,
  VariantPicker,
} from "~/shared/components/learning-content";
import { spreadsheetOptimizationLessonPublication } from "~/shared/config/lesson-publication.mjs";
import { defineLesson } from "../lib/define-lesson";
import { lessonMedia } from "./spreadsheet-optimization.media";
import { PythonTerm } from "./python-term";

export const spreadsheetOptimizationLesson = defineLesson({
  ...spreadsheetOptimizationLessonPublication,
  masteryThreshold: 0.8,
  learningOutcomes: [
    "Находить лучшую сумму до клетки по последнему шагу, а не перебором маршрутов",
    "Строить блоки максимума и минимума в Excel четырьмя формулами и копированием",
    "Учитывать стены на входе в клетку и отличать недостижимую клетку от суммы 0",
    "Выбирать ответ среди «угловых» финишей и стартов, менять направления и считать от финиша",
    "Добавлять диагональные приходы и цену шага, отвечать на вопросы о запасе энергии",
    "Для редких задач — условия перехода, ладья и число маршрутов (дополнительные уроки)",
  ],
  accessTier: "paid",
  subtopics: [
    {
      slug: "luchshaya-summa-do-kletki",
      title: "Лучшая сумма до клетки",
      lead: "Поле и маршрут, почему не годятся жадный выбор и перебор, предшественники, почему хватает лучшей суммы до клетки, правило клетки, края поля, поле 4 × 4 руками и восстановление маршрута.",
      conceptIds: [
        "kak-ustroena-tema-18",
        "pole-i-marshruty",
        "dlina-marshruta",
        "ochevidnye-sposoby",
        "poslednij-shag",
        "luchshaya-summa",
        "pravilo-kletki",
        "pole-4x4",
        "vosstanovlenie-marshruta",
        "summa-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-5",
          prompt: (
            <>
              Почему в правиле клетки нельзя взять a(r, c) + M(r − 1, c) + M(r,
              c − 1), то есть сложить результаты сверху и слева?
            </>
          ),
          reveal: (
            <>
              Это суммы двух разных маршрутов: последний шаг в клетку один,
              поэтому выбирается один приход — лучший.
            </>
          ),
        },
        {
          id: "zadacha-7",
          prompt: (
            <>
              Восстанови для поля из задачи 6 маршрут с наибольшей и маршрут с
              наименьшей суммой.
            </>
          ),
          reveal: (
            <>
              Максимум A1 → B1 → B2 → C2 → C3: 3 + 4 + 8 + 5 + 7 = 27; минимум
              A1 → A2 → A3 → B3 → C3: 3 + 1 + 6 + 2 + 7 = 19.
            </>
          ),
        },
      ],
    },
    {
      slug: "tablica-v-excel",
      title: "Таблица максимума и минимума в Excel",
      lead: "Исходное поле и два расчётных блока, формулы старта, краёв и внутренней клетки, заполнение прямоугольника одной формулой, проверка таблицы и ответ по файлу задачи.",
      conceptIds: [
        "dva-bloka",
        "forma-bloka",
        "chetyre-formuly",
        "kopirovanie",
        "blok-minimuma",
        "pole-ekzamena",
        "excel-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-1",
          prompt: (
            <>
              Какая формула окажется в <Notation>{"I3"}</Notation> после
              заполнения <Notation>{"G2:I4"}</Notation> формулой{" "}
              <Notation>{"=B2+МАКС(F2;G1)"}</Notation>?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=D3+МАКС(H3;I2)"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-2",
          prompt: (
            <>
              Какая формула окажется в <Notation>{"C13"}</Notation> блока
              минимума <Notation>{"A11:D14"}</Notation> после заполнения?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=C3+МИН(B13;C12)"}</Notation>.
            </>
          ),
        },
        {
          id: "zadacha-3",
          prompt: (
            <>
              В <Notation>{"G2"}</Notation> по ошибке записали{" "}
              <Notation>{"=B2+F2+G1"}</Notation>. Что получится в{" "}
              <Notation>{"G2"}</Notation> для нашего поля и почему это не сумма
              маршрута?
            </>
          ),
          reveal: (
            <>
              1 + 7 + 9 = 17: сложены суммы двух разных маршрутов, а последний
              шаг в клетку один.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Поле занимает <Notation>{"A1:O15"}</Notation>, блок максимума —{" "}
              <Notation>{"A17:O31"}</Notation>. Какая формула стоит в{" "}
              <Notation>{"C19"}</Notation> после заполнения и какой клетке поля
              она соответствует?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=C3+МАКС(B19;C18)"}</Notation>; клетке{" "}
              <Notation>{"C3"}</Notation> поля — блок сдвинут на 16 строк вниз.
            </>
          ),
        },
        {
          id: "zadacha-5",
          prompt: (
            <>
              Блок <Notation>{"A6:D9"}</Notation> скопировали в{" "}
              <Notation>{"A11:D14"}</Notation> и заменили{" "}
              <Notation>{"МАКС"}</Notation> на <Notation>{"МИН"}</Notation>.
              Какая формула окажется в <Notation>{"C13"}</Notation> и что в ней
              неверно?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=C8+МИН(B13;C12)"}</Notation>: вместо монеты{" "}
              <Notation>{"C3"}</Notation> прибавляется значение{" "}
              <Notation>{"C8"}</Notation> блока максимума.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              Как, не строя второго блока, получить минимум, если блок максимума
              уже готов и ответ записан?
            </>
          ),
          reveal: (
            <>
              Заменить в выделенном блоке <Notation>{"МАКС"}</Notation> на{" "}
              <Notation>{"МИН"}</Notation> командой «Найти и заменить»: ссылки
              на монеты и соседей не сдвигаются.
            </>
          ),
        },
      ],
    },
    {
      slug: "steny",
      title: "Стены",
      lead: "Стена запрещает переход, а не клетку: какие стены видит клетка на входе, формула с одним предшественником, стены в файле задачи и в расчётном блоке.",
      conceptIds: [
        "stena-na-vhode",
        "stena-mezhdu-kletkami",
        "steny-na-vhode",
        "stena-v-formule",
        "otrezok-steny",
        "steny-itogo",
      ],
      checkpoint: [
        {
          id: "zadacha-3",
          prompt: (
            <>
              Клетка <Notation>{"C3"}</Notation> закрыта стенами справа и снизу.
              Изменится ли лучшая сумма до <Notation>{"C3"}</Notation>? А до{" "}
              <Notation>{"D3"}</Notation>?
            </>
          ),
          reveal: (
            <>
              До <Notation>{"C3"}</Notation> — нет: стены справа и снизу
              закрывают выходы. До <Notation>{"D3"}</Notation> — да, если в неё
              приходили из <Notation>{"C3"}</Notation>: теперь она получает
              сумму только сверху.
            </>
          ),
        },
        {
          id: "zadacha-4",
          prompt: (
            <>
              Блок максимума — в <Notation>{"F1:I4"}</Notation>. Какую формулу
              записать в <Notation>{"G3"}</Notation>, если у клетки{" "}
              <Notation>{"B3"}</Notation> поля стена слева?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=B3+G2"}</Notation>: приход только сверху.
            </>
          ),
        },
        {
          id: "zadacha-6",
          prompt: (
            <>
              Поле 15 × 15 занимает <Notation>{"A1:O15"}</Notation>, блок
              максимума — <Notation>{"A17:O31"}</Notation>. Над клетками{" "}
              <Notation>{"H12:K12"}</Notation> стена. Какую формулу записать в{" "}
              <Notation>{"H28"}</Notation> и до какой клетки её копировать?
            </>
          ),
          reveal: (
            <>
              <Notation>{"=H12+G28"}</Notation>: строке 12 поля соответствует
              строка 28 блока, приход только слева; формулу копируют вправо до{" "}
              <Notation>{"K28"}</Notation>.
            </>
          ),
        },
      ],
    },
    {
      slug: "nedostizhimye-i-finishi",
      title: "Недостижимые клетки и «угловые» финиши",
      lead: "Недостижимая клетка и ноль, «X» и ЕЧИСЛО вместо нуля, финиш в любой «угловой» клетке, старт внутри поля — главный тип экзамена 2023–2026 годов.",
      access: "paid",
      conceptIds: [
        "nedostizhimye-kletki",
        "dostizhimost",
        "vymyshlennyj-marshrut",
        "metka-x",
        "uglovye-finishi",
        "start-vnutri",
        "finishi-itogo",
      ],
      paid: {
        outline: [
          { id: "nedostizhimye-kletki", navLabel: "Недостижимые клетки" },
          { id: "dostizhimost", navLabel: "Достижимость" },
          { id: "vymyshlennyj-marshrut", navLabel: "Вымышленный маршрут" },
          { id: "metka-x", navLabel: "Метка «X»" },
          { id: "uglovye-finishi", navLabel: "«Угловые» финиши" },
          { id: "start-vnutri", navLabel: "Старт внутри поля" },
          { id: "finishi-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Недостижимая клетка и клетка с суммой 0 — разные вещи, а финиш
                может стоять в любой клетке, из которой робот не может уйти.
              </strong>{" "}
              Так устроен главный тип экзамена 2023–2026 годов. На поле основной
              волны 2026 года стены отрезают 12 клеток, и без их учёта минимум
              получается 369 вместо 1205.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () =>
          import("./spreadsheet-optimization.paid.nedostizhimye-i-finishi"),
      },
    },
    {
      slug: "napravleniya-i-zapuski",
      title: "Другие направления и несколько запусков",
      lead: "Предшественники и «угловые» клетки при других командах, расчёт от клетки до финиша, несколько стартов и запусков: сумма k лучших результатов.",
      access: "paid",
      conceptIds: [
        "drugie-napravleniya",
        "predshestvenniki",
        "adresa-predshestvennikov",
        "obratnyj-raschyot",
        "neskolko-zapuskov",
        "zapuski-itogo",
      ],
      paid: {
        outline: [
          { id: "drugie-napravleniya", navLabel: "Другие направления" },
          { id: "predshestvenniki", navLabel: "Предшественники" },
          { id: "adresa-predshestvennikov", navLabel: "Адреса в Excel" },
          { id: "obratnyj-raschyot", navLabel: "Обратный расчёт" },
          { id: "neskolko-zapuskov", navLabel: "Несколько запусков" },
          { id: "zapuski-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Если направления движения изменились, нужно заново определить
                предшественников: формула всегда должна соответствовать
                разрешённым командам.
              </strong>{" "}
              Во второй половине подтемы робот запускается несколько раз — из
              разных стартов или с разными финишами.
            </Typography.Text>
          </>
        ),
        selfCheck: 2,
        load: () =>
          import("./spreadsheet-optimization.paid.napravleniya-i-zapuski"),
      },
    },
    {
      slug: "diagonali-i-cena-shaga",
      title: "Диагонали, цена шага и запас энергии",
      lead: "Третий и четвёртый предшественник при диагональных шагах, вклад, зависящий от перехода, — кандидат для каждого прихода отдельно, вопросы о запасе энергии до финальных клеток.",
      access: "paid",
      conceptIds: [
        "sostav-kandidatov",
        "diagonal-vpravo-vniz",
        "diagonal-vlevo-vniz",
        "vklad-ot-prihoda",
        "zapas-energii",
        "diagonali-itogo",
      ],
      paid: {
        outline: [
          { id: "sostav-kandidatov", navLabel: "Состав кандидатов" },
          { id: "diagonal-vpravo-vniz", navLabel: "Диагональ вправо-вниз" },
          { id: "diagonal-vlevo-vniz", navLabel: "Диагональ влево-вниз" },
          { id: "vklad-ot-prihoda", navLabel: "Вклад зависит от прихода" },
          { id: "zapas-energii", navLabel: "Запас энергии" },
          { id: "diagonali-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>
                Когда меняется набор команд или цена шага, меняется только
                состав кандидатов: каждый допустимый приход даёт своего
                кандидата, а клетка берёт лучшего.
              </strong>{" "}
              Так устроены задачи с диагональными шагами, с ценой шага,
              зависящей от перехода, и с вопросами о запасе энергии.
            </Typography.Text>
          </>
        ),
        selfCheck: 4,
        load: () =>
          import("./spreadsheet-optimization.paid.diagonali-i-cena-shaga"),
      },
    },
    {
      slug: "usloviya-perehoda",
      title: "Условия перехода и вклад клетки",
      lead: "Переход по условию на числа клеток, вклад клетки по правилу, подсчёт достижимых клеток и шагов, характеристика лучшего маршрута, обязательная клетка.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "dopolnitelnyy-urok-perehody",
        "proverka-prihoda",
        "vspomogatelnye-bloki",
        "nachislenie-i-perehod",
        "ostatok-energii",
        "harakteristika-marshruta",
        "cherez-kletku",
        "perehody-itogo",
      ],
      paid: {
        outline: [
          {
            id: "dopolnitelnyy-urok-perehody",
            navLabel: "Дополнительный урок",
          },
          { id: "proverka-prihoda", navLabel: "Проверка прихода" },
          { id: "vspomogatelnye-bloki", navLabel: "Вспомогательные блоки" },
          { id: "nachislenie-i-perehod", navLabel: "Начисление и переход" },
          { id: "ostatok-energii", navLabel: "Остаток энергии" },
          {
            id: "harakteristika-marshruta",
            navLabel: "Характеристика маршрута",
          },
          { id: "cherez-kletku", navLabel: "Через заданную клетку" },
          { id: "perehody-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 18: восемь
              задач подборки 2021–2025 годов с условиями перехода, особым
              вкладом клетки и вопросом о самом лучшем маршруте; на экзаменах
              таких задач не было. Задачи основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 2,
        load: () => import("./spreadsheet-optimization.paid.usloviya-perehoda"),
      },
    },
    {
      slug: "ladya-i-chislo-marshrutov",
      title: "Ладья, число маршрутов и состояние",
      lead: "Ход на несколько клеток и расширяющийся диапазон, число маршрутов сложением, когда одной лучшей суммы мало.",
      level: "advanced",
      access: "paid",
      conceptIds: [
        "dopolnitelnyy-urok-ladya",
        "ladya",
        "rasshiryayushchijsya-diapazon",
        "chislo-marshrutov",
        "sostoyanie",
        "ladya-itogo",
      ],
      paid: {
        outline: [
          { id: "dopolnitelnyy-urok-ladya", navLabel: "Дополнительный урок" },
          { id: "ladya", navLabel: "Ладья" },
          {
            id: "rasshiryayushchijsya-diapazon",
            navLabel: "Расширяющийся диапазон",
          },
          { id: "chislo-marshrutov", navLabel: "Число маршрутов" },
          { id: "sostoyanie", navLabel: "Когда хватает одного числа" },
          { id: "ladya-itogo", navLabel: "Итого" },
        ],
        preview: (
          <>
            <Typography.Text>
              <strong>Дополнительный урок — для продвинутых.</strong> Он для
              тех, кто хочет закрыть все возможные случаи задания 18: ладья,
              которая ходит на несколько клеток, и подсчёт числа маршрутов
              встречаются в четырёх задачах подборки 2021–2025 годов, на
              экзаменах таких не было. Задачи основных подтем решаются без него.
            </Typography.Text>
          </>
        ),
        selfCheck: 2,
        load: () =>
          import("./spreadsheet-optimization.paid.ladya-i-chislo-marshrutov"),
      },
    },
  ],
  theory: [
    {
      id: "kak-ustroena-tema-18",
      navLabel: "Как устроена тема",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Главная идея задания 18 — для каждой клетки определить лучшую
              сумму, с которой робот может в неё попасть.
            </strong>{" "}
            Когда мы умеем это делать, большое поле решается постепенно: от
            начальной клетки к соседним, затем дальше, до нужного результата.
            Этому и посвящена подтема: сначала руками, на маленьком поле, а в
            следующей подтеме — формулами Excel на поле экзамена.
          </Typography.Text>
          <Typography.Text>
            Всю подтему мы будем разбирать одно учебное поле 4 × 4: на нём
            каждое рассуждение можно проверить вручную.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pole-i-marshruty",
      navLabel: "Поле и маршруты",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Сначала нужно точно понять, что изображает таблица и какие
              маршруты разрешены.
            </strong>{" "}
            В базовом варианте робот начинает движение в левой верхней клетке,
            перемещается на одну клетку вправо или вниз и должен попасть в
            правую нижнюю. Число в клетке показывает стоимость лежащей там
            монеты. Робот забирает монеты во всех посещённых клетках, включая
            начальную и конечную.
          </Typography.Text>
          <Typography.Text>Наше поле:</Typography.Text>
          <LessonTable
            label={"Наше поле"}
            columns={[
              { label: "Строка" },
              { label: "A", numeric: true },
              { label: "B", numeric: true },
              { label: "C", numeric: true },
              { label: "D", numeric: true },
            ]}
            rows={[
              ["1", "2", "7", "4", "1"],
              ["2", "5", "1", "8", "3"],
              ["3", "2", "6", "2", "9"],
              ["4", "4", "3", "7", "2"],
            ]}
          />
          <Typography.Text>
            Буквы обозначают столбцы, числа слева — строки, как{" "}
            <PythonTerm term="xl-address">адреса ячеек</PythonTerm> в
            электронной таблице: <Notation>{"A1"}</Notation> — левая верхняя
            клетка с монетой 2, <Notation>{"B2"}</Notation> — клетка во второй
            строке и втором столбце с монетой 1, <Notation>{"D4"}</Notation> —
            правая нижняя клетка с монетой 2.
          </Typography.Text>
          <Typography.Text>
            <strong>Маршрут</strong> — последовательность клеток, которые
            посетил робот. Например, A1 → B1 → B2 → C2 → C3 → D3 → D4: переходы
            вправо, вниз, вправо, вниз, вправо, вниз — все разрешены. Собранная
            сумма 2 + 7 + 1 + 8 + 2 + 9 + 2 = 31. Другой маршрут, A1 → A2 → B2 →
            B3 → B4 → C4 → D4, даёт 2 + 5 + 1 + 6 + 3 + 7 + 2 = 26.
          </Typography.Text>
          <Typography.Text>
            Задание обычно требует найти{" "}
            <strong>
              наибольшую и наименьшую сумму среди всех допустимых маршрутов
            </strong>
            . Поэтому найти один удачный маршрут недостаточно: нужно обосновать,
            что лучше или хуже уже получить невозможно.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "dlina-marshruta",
      navLabel: "Длина маршрута",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При движении только вправо и вниз робот не возвращается в
              посещённую клетку, а число шагов любого маршрута заранее известно.
            </strong>{" "}
            Чтобы вернуться, пришлось бы хотя бы раз пойти влево или вверх.
            Поэтому одну монету робот не заберёт дважды, а всё поле посетить не
            сможет: после перехода из <Notation>{"A1"}</Notation> в{" "}
            <Notation>{"B1"}</Notation> в <Notation>{"A2"}</Notation> уже не
            попасть — она левее.
          </Typography.Text>
          <Typography.Text>
            Пусть в поле h строк и w столбцов. Из левой верхней клетки в правую
            нижнюю нужно сделать h − 1 шагов вниз и w − 1 шагов вправо, всего{" "}
            <strong>h + w − 2</strong> перемещений. Посещённых клеток на одну
            больше — начальная посещена ещё до первого шага:{" "}
            <strong>h + w − 1</strong>. На нашем поле любой маршрут — это 6
            перемещений и 7 клеток; проверь на двух маршрутах выше.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "ochevidnye-sposoby",
      navLabel: "Жадность и перебор",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Два очевидных способа не годятся: выбирать самую дорогую соседнюю
              монету и перебирать все маршруты.
            </strong>{" "}
            Большая ближайшая монета может увести робота от гораздо более
            выгодной части поля. На нашем поле такой выбор случайно приводит к
            лучшему маршруту, поэтому возьмём поле, где он ошибается:
          </Typography.Text>
          <LessonTable
            label={"Строка, A, B, C"}
            columns={[
              { label: "Строка" },
              { label: "A", numeric: true },
              { label: "B", numeric: true },
              { label: "C", numeric: true },
            ]}
            rows={[
              ["1", "1", "9", "1"],
              ["2", "8", "1", "1"],
              ["3", "100", "100", "1"],
            ]}
          />
          <Typography.Text>
            Из <Notation>{"A1"}</Notation> выгоднее пойти к монете 9, но после
            этого в <Notation>{"A3"}</Notation>, где лежит 100, уже не попасть.
            Даже лучший маршрут с первым шагом вправо даст 1 + 9 + 1 + 100 + 1 =
            112, а A1 → A2 → A3 → B3 → C3 собирает 1 + 8 + 100 + 100 + 1 ={" "}
            <strong>210</strong>. Такой выбор по ближайшей выгоде называют{" "}
            <strong>жадным алгоритмом</strong>; для минимума он ошибается так
            же.
          </Typography.Text>
          <Typography.Text>
            Перебор надёжен, но маршрутов слишком много. Маршрут — это
            последовательность шагов П (вправо) и Н (вниз): на поле 3 × 3 их
            шесть (ППНН, ПНПН, ПННП, НППН, НПНП, ННПП), на нашем 4 × 4 — 20, а
            на поле 20 × 20 без стен — <strong>больше 35 миллиардов</strong>,
            хотя клеток в нём всего 400. Нужен способ, который обрабатывает
            клетки, а не маршруты.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "poslednij-shag",
      navLabel: "Последний шаг",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Чтобы найти лучшую сумму для клетки, достаточно понять, откуда
              робот мог сделать в неё последний шаг.
            </strong>{" "}
            Возьмём <Notation>{"B2"}</Notation>. При движении вправо и вниз
            последний шаг мог быть только из <Notation>{"A2"}</Notation> —
            вправо, или из <Notation>{"B1"}</Notation> — вниз. Из{" "}
            <Notation>{"C2"}</Notation> и <Notation>{"B3"}</Notation> в{" "}
            <Notation>{"B2"}</Notation> не попасть — это движения влево и вверх;
            из <Notation>{"A1"}</Notation> за один шаг тоже нельзя: диагонали в
            базовом варианте запрещены.
          </Typography.Text>
          <Typography.Text>
            Клетку, из которой можно сделать последний шаг в рассматриваемую,
            будем называть <strong>предшественником</strong>. Для обычной
            внутренней клетки предшественники — слева и сверху:
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridPreds_122f4b}
            caption={
              <>
                Робот ходит вправо и вниз, поэтому в клетку (рамка) последний
                шаг приходит слева или сверху.
              </>
            }
          />
          <Typography.Text>
            До <Notation>{"A2"}</Notation> и до <Notation>{"B1"}</Notation> путь
            единственный: 2 + 5 = 7 и 2 + 7 = 9. Если прийти в{" "}
            <Notation>{"B2"}</Notation> слева, получится 7 + 1 = 8, если сверху
            — 9 + 1 = 10. Наибольшая сумма до <Notation>{"B2"}</Notation> — 1 +
            max(7; 9) = <strong>10</strong>, наименьшая — 1 + min(7; 9) ={" "}
            <strong>8</strong>: монета клетки плюс лучшая из сумм
            предшественников. Запись max означает «выбрать наибольшее число»,
            min — «наименьшее».
          </Typography.Text>
          <Typography.Text>
            <strong>
              Сравниваются накопленные суммы за весь путь до соседних клеток
            </strong>
            , а не монеты в них. Монета текущей клетки прибавляется ровно один
            раз: суммы предшественников уже содержат все монеты своих маршрутов.
            А вот складывать суммы слева и сверху <strong>нельзя</strong> — это
            два разных маршрута, а последний шаг в клетку один.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "luchshaya-summa",
      navLabel: "Только лучшая сумма",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Хранить можно только лучшую сумму до клетки: остальные маршруты до
              неё уже не обгонят лучший.
            </strong>{" "}
            На нашем поле в клетку <Notation>{"C3"}</Notation> можно прийти,
            например, так:
          </Typography.Text>
          <ul>
            <li>A1 → B1 → C1 → C2 → C3 с суммой 2 + 7 + 4 + 8 + 2 = 23;</li>
            <li>A1 → A2 → A3 → B3 → C3 с суммой 2 + 5 + 2 + 6 + 2 = 17.</li>
          </ul>
          <Typography.Text>
            Продолжим оба пути одинаково, через <Notation>{"D3"}</Notation> в{" "}
            <Notation>{"D4"}</Notation>: это добавит 9 + 2 = 11. Итоги 23 + 11 =
            34 и 17 + 11 = 28 — первый путь по-прежнему лучше. Через{" "}
            <Notation>{"C4"}</Notation> было бы 32 и 26 — снова лучше первый.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridRoutes}
            caption={
              <>
                Два пути в C3 с суммами 23 и 17 и одно продолжение +11: 34 {">"}{" "}
                28, разница 6 никуда не делась.
              </>
            }
          />
          <Typography.Text>Причина проста:</Typography.Text>
          <blockquote>
            <Typography.Text>
              Если два маршрута уже пришли в одну и ту же клетку, то доступные
              дальнейшие действия у них одинаковы.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Они стоят в одной клетке одного поля, и дальше им доступны одни и те
            же ходы. Поэтому маршрут с меньшей накопленной суммой уже не обгонит
            маршрут с большей: для максимума в <Notation>{"C3"}</Notation>{" "}
            достаточно хранить 23, для минимума — наименьшую сумму.
          </Typography.Text>
          <Typography.Text>
            Это рассуждение работает и при отрицательных числах: если 23 {">"}{" "}
            17, то 23 + x {">"} 17 + x при любом одинаковом x.{" "}
            <strong>
              Положительность монет для этого доказательства не нужна.
            </strong>
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pravilo-kletki",
      navLabel: "Правило клетки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Общее правило: лучшая сумма клетки — её монета плюс лучшая из сумм
              предшественников; у старта и у краёв поля свои правила.
            </strong>{" "}
            Обозначим a(r, c) монету в строке r и столбце c, M(r, c) —
            наибольшую сумму от старта до этой клетки включительно, m(r, c) —
            наименьшую. Для внутренней клетки
          </Typography.Text>
          <Typography.Text>
            <strong>M(r, c) = a(r, c) + max(M(r − 1, c); M(r, c − 1)),</strong>
          </Typography.Text>
          <Typography.Text>
            <strong>m(r, c) = a(r, c) + min(m(r − 1, c); m(r, c − 1)).</strong>
          </Typography.Text>
          <Typography.Text>Края считаются отдельно:</Typography.Text>
          <ol>
            <li>
              в стартовой клетке робот ещё не ходил, но монету уже забрал: у нас
              в <Notation>{"A1"}</Notation> обе суммы равны 2;
            </li>
            <li>
              в верхнюю строку приходят только слева, поэтому там накопленные
              суммы: 2, 9, 13, 14 — это 2, затем 2 + 7, 2 + 7 + 4 и 2 + 7 + 4 +
              1;
            </li>
            <li>в левый столбец приходят только сверху: 2, 7, 9, 13.</li>
          </ol>
          <Typography.Text>
            На краях путь единственный, и максимум с минимумом совпадают.{" "}
            <strong>
              Несуществующего соседа нельзя считать приходом с суммой 0
            </strong>
            : у клетки верхней строки предшественника сверху просто нет.
          </Typography.Text>
          <Typography.Text>
            Считать нужно так, чтобы суммы предшественников уже были известны:
            по строкам сверху вниз, а в строке — слева направо. Такой подход
            называют <strong>динамическим программированием</strong>: большая
            задача разбивается на маленькие «лучшая сумма до этой клетки», а их
            ответы сохраняются в <strong>таблице динамики</strong>. Это не новое
            расположение монет и не один маршрут через всё поле: для каждой
            клетки в ней решена своя задача.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pole-4x4",
      navLabel: "Поле 4 × 4",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Разберём поле 4 × 4 полностью: сначала края, затем внутренние
              клетки строка за строкой.
            </strong>{" "}
            Пройди заполнение обеих таблиц по шагам: в каждом кадре — монета
            клетки, два готовых предшественника (пунктир) и формулы.
          </Typography.Text>
          <LessonStepper
            {...lessonMedia.gridFillStepper}
            label={
              "Заполнение таблиц максимума и минимума на поле 4 × 4: шаг за шагом"
            }
          />
          <Typography.Text>
            Полная таблица максимальных сумм и таблица минимальных:
          </Typography.Text>
          <LessonTable
            label={"Полная таблица максимальных сумм и таблица минимальных"}
            columns={[
              { label: "Строка" },
              { label: "A", numeric: true },
              { label: "B", numeric: true },
              { label: "C", numeric: true },
              { label: "D", numeric: true },
              { label: "" },
              { label: "A", numeric: true },
              { label: "B", numeric: true },
              { label: "C", numeric: true },
              { label: "D", numeric: true },
            ]}
            rows={[
              ["1", "2", "9", "13", "14", "", "2", "9", "13", "14"],
              ["2", "7", "10", "21", "24", "", "7", "8", "16", "17"],
              ["3", "9", "16", "23", "33", "", "9", "14", "16", "25"],
              [
                "4",
                "13",
                "19",
                "30",
                <>
                  <strong>35</strong>
                </>,
                "",
                "13",
                "16",
                "23",
                <>
                  <strong>25</strong>
                </>,
              ],
            ]}
          />
          <Typography.Text>
            Для этого поля <strong>максимум 35, минимум 25</strong>. Верхняя
            строка и левый столбец в двух таблицах одинаковы: для них существует
            только один путь. Но внутренние клетки пересчитываются отдельно: в{" "}
            <Notation>{"C2"}</Notation> для минимума слева используется{" "}
            <strong>минимальный результат 8</strong>, а не максимальный
            результат 10 из таблицы максимума. Маршруты из начала урока с
            суммами 31 и 26 действительно лежат между 25 и 35.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vosstanovlenie-marshruta",
      navLabel: "Восстановление маршрута",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              По готовой таблице можно восстановить маршрут, который даёт
              найденную сумму.
            </strong>{" "}
            Для этого удобно идти от финиша назад. В таблице максимума в{" "}
            <Notation>{"D4"}</Notation> стоит 35, монета в{" "}
            <Notation>{"D4"}</Notation> стоит 2. Значит, перед последним шагом
            было 35 − 2 = 33. Из предшественников в <Notation>{"C4"}</Notation>{" "}
            стоит 30, в <Notation>{"D3"}</Notation> — 33, поэтому последний шаг
            был из <Notation>{"D3"}</Notation>. Дальше аналогично:{" "}
            <Notation>{"D3"}</Notation> получена из <Notation>{"D2"}</Notation>,{" "}
            <Notation>{"D2"}</Notation> — из <Notation>{"C2"}</Notation>,{" "}
            <Notation>{"C2"}</Notation> — из <Notation>{"C1"}</Notation>,{" "}
            <Notation>{"C1"}</Notation> — из <Notation>{"B1"}</Notation>,{" "}
            <Notation>{"B1"}</Notation> — из <Notation>{"A1"}</Notation>.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridBack}
            caption={
              <>
                От финиша назад: из клетки идём в того предшественника, чья
                сумма вместе с монетой клетки дала её сумму; при равенстве
                годится любой.
              </>
            }
          />
          <Typography.Text>
            В направлении движения робота получился маршрут A1 → B1 → C1 → C2 →
            D2 → D3 → D4, и сумма исходных монет 2 + 7 + 4 + 8 + 3 + 9 + 2 = 35
            совпадает с таблицей. Один из минимальных маршрутов — A1 → A2 → B2 →
            B3 → C3 → C4 → D4 с суммой 2 + 5 + 1 + 6 + 2 + 7 + 2 = 25.
          </Typography.Text>
          <Typography.Text>
            При восстановлении нужно пользоваться той таблицей, для которой
            ищется маршрут: максимальным суммам соответствует таблица максимума,
            минимальным — таблица минимума. Если два предшественника дают
            одинаковый лучший результат, для поиска только суммы можно выбрать
            любой из них. Это означает, что оптимальных маршрутов может быть
            несколько: в <Notation>{"C4"}</Notation> минимум 7 + min(16; 16) —
            второй минимальный маршрут идёт через <Notation>{"B4"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "summa-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Лучшая сумма до клетки — монета клетки плюс лучшая из сумм
                    её предшественников; при движении вправо и вниз
                    предшественники слева и сверху.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Хранить только лучшую сумму до клетки можно: дальнейшие
                    действия не зависят от того, как робот в неё пришёл.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Старт — своя монета; верхняя строка и левый столбец —
                    накопленные суммы; несуществующий сосед — не 0.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Максимум и минимум — две отдельные таблицы; маршрут
                    восстанавливается от финиша назад.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Любой маршрут между противоположными углами посещает h + w −
                    1 клеток.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "dva-bloka",
      navLabel: "Поле и расчётные блоки",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Excel удобно сохранять исходные монеты и расчётные суммы в
              разных областях листа: одна формула, скопированная на
              прямоугольник, считает всю таблицу лучших сумм.
            </strong>{" "}
            Формулы этой подтемы — основа всех остальных задач темы.
          </Typography.Text>
          <Typography.Text>
            Опора — правило клетки и поле 4 × 4 из прошлой подтемы (максимум 35,
            минимум 25) и приём курса Excel{" "}
            <PythonTerm term="xl-neighbours">«таблица из таблицы»</PythonTerm>:
            внутренняя ячейка считается из уже вычисленных соседей, крайние —
            своими формулами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "forma-bloka",
      navLabel: "Форма блока",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Каждый расчётный блок повторяет форму исходного поля.
            </strong>{" "}
            Для учебного поля 4 × 4 расположим исходные монеты в{" "}
            <Notation>{"A1:D4"}</Notation>, а максимальные суммы — рядом, в{" "}
            <Notation>{"F1:I4"}</Notation>. Клетке <Notation>{"B2"}</Notation>{" "}
            поля соответствует <Notation>{"G2"}</Notation> блока: адрес сдвинут
            на 5 столбцов; так же <Notation>{"A1"}</Notation> соответствует{" "}
            <Notation>{"F1"}</Notation>, а <Notation>{"D4"}</Notation> —{" "}
            <Notation>{"I4"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Расчётный блок всегда стоит за пределами исходных данных — правее
            или ниже поля.
          </Typography.Text>
          <Typography.Text>
            Формулы ниже записаны для русских названий функций Excel с
            разделителем <Notation>{";"}</Notation>; английские имена — в
            справочнике курса. Нам нужны только{" "}
            <PythonTerm term="xl-range-functions">
              <Notation>{"МАКС"}</Notation> и <Notation>{"МИН"}</Notation>
            </PythonTerm>
            .
          </Typography.Text>
        </>
      ),
    },
    {
      id: "chetyre-formuly",
      navLabel: "Четыре формулы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Блок максимума строится четырьмя формулами: старт, первая строка,
              левый столбец и одна внутренняя клетка.
            </strong>
          </Typography.Text>
          <ol>
            <li>
              Начальная сумма в <Notation>{"F1"}</Notation>:{" "}
              <Notation>{"=A1"}</Notation>. В нашем примере получится 2.
            </li>
            <li>
              Первая строка, <Notation>{"G1"}</Notation>:{" "}
              <Notation>{"=B1+F1"}</Notation> — монета следующей клетки плюс
              накопленная сумма до предыдущей, 7 + 2 = 9. Скопируем формулу
              вправо до <Notation>{"I1"}</Notation>: в{" "}
              <Notation>{"H1"}</Notation> будет <Notation>{"=C1+G1"}</Notation>,
              в <Notation>{"I1"}</Notation> — <Notation>{"=D1+H1"}</Notation>.
              Верхняя строка заполнится значениями 2, 9, 13, 14.
            </li>
            <li>
              Левый столбец, <Notation>{"F2"}</Notation>:{" "}
              <Notation>{"=A2+F1"}</Notation>, скопируем вниз до{" "}
              <Notation>{"F4"}</Notation>. Это накопленные суммы при движении
              вниз по левому краю.
            </li>
            <li>
              Первая внутренняя клетка, <Notation>{"G2"}</Notation>:{" "}
              <Notation>{"=B2+МАКС(F2;G1)"}</Notation>. Здесь{" "}
              <Notation>{"B2"}</Notation> — исходная монета текущей клетки,{" "}
              <Notation>{"F2"}</Notation> — максимальная сумма для её левого
              предшественника, <Notation>{"G1"}</Notation> — для верхнего;
              результат 1 + max(7; 9) = 10.
            </li>
          </ol>
          <Typography.Text>
            Теперь <PythonTerm term="xl-fill">растянем</PythonTerm> формулу из{" "}
            <Notation>{"G2"}</Notation> вправо до <Notation>{"I2"}</Notation>,
            выделим получившийся диапазон <Notation>{"G2:I2"}</Notation> и
            растянем его вниз до четвёртой строки. В итоге формулы окажутся во
            всём диапазоне <Notation>{"G2:I4"}</Notation>, а ответ на вопрос о
            максимуме — в <Notation>{"I4"}</Notation>:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet1} label={"Лист «Максимум»"} />
          <Typography.Text>
            Выбери <Notation>{"I4"}</Notation>: рамки стоят на{" "}
            <Notation>{"D4"}</Notation> — монете финиша — и на{" "}
            <Notation>{"H4"}</Notation>, <Notation>{"I3"}</Notation> — двух уже
            посчитанных предшественниках. Значения блока совпадают с таблицей,
            которую мы считали руками. Поменяй монету в{" "}
            <Notation>{"C2"}</Notation> с 8 на 1 — пересчитается всё правее и
            ниже, и максимум станет 29: теперь лучший маршрут обходит{" "}
            <Notation>{"C2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "kopirovanie",
      navLabel: "Копирование формулы",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При копировании формула сохраняет взаимное расположение ссылок,
              поэтому одна формула подходит для всех внутренних клеток.
            </strong>{" "}
            Такие ссылки называют <strong>относительными</strong>. Копия формулы{" "}
            <Notation>{"G2"}</Notation> на одну ячейку вправо и на одну вниз:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "G2", formula: "=B2+МАКС(F2;G1)" },
              { cell: "H2", formula: "=C2+МАКС(G2;H1)" },
              { cell: "G3", formula: "=B3+МАКС(F3;G2)" },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Каждая ссылка сдвинулась на один столбец вправо или на одну строку
            вниз. В обоих случаях сохраняется смысл:
          </Typography.Text>
          <blockquote>
            <Typography.Text>
              Взять соответствующую исходную монету и сравнить расчётные
              результаты слева и сверху.
            </Typography.Text>
          </blockquote>
          <Typography.Text>
            Знак <Notation>{"$"}</Notation>{" "}
            <PythonTerm term="xl-ref">
              закрепляет столбец или строку ссылки
            </PythonTerm>
            . В обычной внутренней формуле робота ссылки должны перемещаться
            вместе с формулой, поэтому закреплять их здесь не требуется.{" "}
            <strong>
              Если закрепить исходную монету как <Notation>{"$B$2"}</Notation>,
              во всех скопированных формулах будет прибавляться одна и та же
              монета из <Notation>{"B2"}</Notation>.
            </strong>{" "}
            Это изменит смысл расчёта: в <Notation>{"I4"}</Notation> вместо 35
            получится 17 — к каждой внутренней клетке прибавлялась единица из{" "}
            <Notation>{"B2"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "blok-minimuma",
      navLabel: "Блок минимума",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Минимум считают во втором блоке той же формы, а на поле экзамена
              блоки ставят под полем.
            </strong>{" "}
            Блок минимума строят теми же четырьмя формулами, только с{" "}
            <Notation>{"МИН"}</Notation> и со ссылками на свой блок. Справа от
            большого поля места мало, поэтому удобнее ставить блоки под ним
            через пустую строку. Для нашего поля блок максимума займёт{" "}
            <Notation>{"A6:D9"}</Notation>, блок минимума —{" "}
            <Notation>{"A11:D14"}</Notation>:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "A6", formula: "=A1" },
              { cell: "B6", formula: "=A6+B1" },
              { cell: "A7", formula: "=A6+A2" },
              { cell: "B7", formula: "=B2+МАКС(A7;B6)" },
              { cell: "B12", formula: "=B2+МИН(A12;B11)" },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Монета по-прежнему берётся из поля (<Notation>{"B2"}</Notation>), а
            соседи — из своего блока: клетка левее и клетка выше. Старт, первая
            строка и левый столбец блока минимума — те же формулы, что у блока
            максимума:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet2} label={"Лист «Под-полем»"} />
          <Typography.Text>
            Ответы — в <Notation>{"D9"}</Notation> и{" "}
            <Notation>{"D14"}</Notation>, под финишем{" "}
            <Notation>{"D4"}</Notation>: 35 и 25. Выбери{" "}
            <Notation>{"C13"}</Notation>: рамки на монете{" "}
            <Notation>{"C3"}</Notation> поля и на двух соседях в блоке минимума.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Готовый блок целиком копировать нельзя: относительные ссылки на
              монеты тоже сдвинутся.
            </strong>{" "}
            Если скопировать <Notation>{"A6:D9"}</Notation> в{" "}
            <Notation>{"A11:D14"}</Notation> и заменить{" "}
            <Notation>{"МАКС"}</Notation> на <Notation>{"МИН"}</Notation>, в{" "}
            <Notation>{"B12"}</Notation> окажется{" "}
            <Notation>{"=B7+МИН(A12;B11)"}</Notation>: вместо монеты 1 из{" "}
            <Notation>{"B2"}</Notation> прибавится 10 из блока максимума.
            Поэтому блок минимума либо строят формулами заново, либо, записав
            максимум, заменяют <Notation>{"МАКС"}</Notation> на{" "}
            <Notation>{"МИН"}</Notation> прямо в блоке максимума — командой
            «Найти и заменить» (<KeyCombo keys={["Ctrl", "H"]} />) по
            выделенному блоку; тогда ссылки остаются на месте.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "pole-ekzamena",
      navLabel: "Поле экзамена",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              На поле экзамена те же формулы, только адреса больше.
            </strong>{" "}
            Пусть поле 15 × 15 занимает <Notation>{"A1:O15"}</Notation>. Оставим
            пустую строку 16, и блок максимума займёт{" "}
            <Notation>{"A17:O31"}</Notation>:
          </Typography.Text>
          <FormulaBlock
            lines={[
              { cell: "A17", formula: "=A1" },
              { cell: "B17", formula: "=A17+B1" },
              { cell: "A18", formula: "=A17+A2" },
              { cell: "B18", formula: "=B2+МАКС(A18;B17)" },
            ]}
            label="Формула"
          />
          <Typography.Text>
            <Notation>{"B17"}</Notation> растягивают вправо до{" "}
            <Notation>{"O17"}</Notation>, <Notation>{"A18"}</Notation> — вниз до{" "}
            <Notation>{"A31"}</Notation>, <Notation>{"B18"}</Notation> — на
            прямоугольник <Notation>{"B18:O31"}</Notation>. Ответ — в{" "}
            <Notation>{"O31"}</Notation>, клетке блока под финишем{" "}
            <Notation>{"O15"}</Notation>. Большой диапазон удобно выделять
            адресом в поле имени, а не мышью.
          </Typography.Text>
          <Typography.Text>
            <strong>
              В Excel полезно проверить несколько формул после растягивания
            </strong>{" "}
            (<PythonTerm term="xl-check">проверка ответа</PythonTerm>): первую
            внутреннюю клетку, клетку в середине, последнюю клетку. Так можно
            заметить ошибочную ссылку, закреплённый адрес или случайное
            обращение к другому расчётному блоку. Excel сам считает ячейки{" "}
            <PythonTerm term="xl-recalc">в порядке зависимостей</PythonTerm>:
            строки сверху вниз перебирать не нужно, достаточно, чтобы формула
            клетки ссылалась только на её предшественников.
          </Typography.Text>
          <Typography.Text>
            Ответ записывают{" "}
            <strong>в том порядке, который требует условие</strong>. Обычно это
            два числа подряд без разделителя: для нашего поля «сначала максимум,
            затем минимум» — <Notation>{"3525"}</Notation>. В части задач
            требуется сначала минимум, затем максимум, — тогда{" "}
            <Notation>{"2535"}</Notation>.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "excel-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Поле и расчётные блоки — разные области листа одной формы;
                    клетка блока соответствует клетке поля со сдвигом.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Старт <Notation>{"=A1"}</Notation>, первая строка{" "}
                    <Notation>{"=B1+F1"}</Notation> вправо, левый столбец{" "}
                    <Notation>{"=A2+F1"}</Notation> вниз, внутренняя клетка{" "}
                    <Notation>{"=B2+МАКС(F2;G1)"}</Notation> на весь
                    прямоугольник.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Ссылки относительные, <Notation>{"$"}</Notation> здесь не
                    нужен; блок минимума — с <Notation>{"МИН"}</Notation> и
                    соседями из своего блока; на экзамене блоки — под полем.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Скопированный целиком блок ссылается не на те монеты; «Найти
                    и заменить» внутри блока ссылки не сдвигает.
                  </>
                ),
              },
              {
                note: (
                  <>
                    После заполнения проверяют несколько формул и порядок двух
                    чисел в ответе.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
    {
      id: "stena-na-vhode",
      navLabel: "Стена на входе",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Стена запрещает переход между двумя клетками, поэтому у клетки со
              стеной на входе остаётся один предшественник.
            </strong>{" "}
            Сами клетки стена недоступными не делает. На экзамене поле почти
            всегда со стенами.
          </Typography.Text>
          <Typography.Text>
            Продолжим поле 4 × 4 из прошлых подтем и добавим на него две стены:
            между <Notation>{"C1"}</Notation> и <Notation>{"C2"}</Notation> и
            между <Notation>{"C4"}</Notation> и <Notation>{"D4"}</Notation>.
            Блок максимума — в <Notation>{"F1:I4"}</Notation>, как в прошлой
            подтеме.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "stena-mezhdu-kletkami",
      navLabel: "Стена между клетками",
      explanation: (
        <>
          <Typography.Text>
            <strong>Стена делит две соседние клетки, а не закрывает их.</strong>{" "}
            Например, стена между <Notation>{"C1"}</Notation> и{" "}
            <Notation>{"C2"}</Notation> означает, что робот не может перейти из{" "}
            <Notation>{"C1"}</Notation> в <Notation>{"C2"}</Notation>. Но в{" "}
            <Notation>{"C2"}</Notation> он всё ещё может попасть слева, из{" "}
            <Notation>{"B2"}</Notation>, если этот переход разрешён. Поэтому при
            наличии стен меняется список допустимых предшественников:
          </Typography.Text>
          <VariantPicker
            label={"Откуда можно прийти в клетку → правило расчёта"}
            variants={[
              {
                label: "слева и сверху",
                value: <>монета + лучший из двух результатов</>,
              },
              { label: "только слева", value: <>монета + результат слева</> },
              { label: "только сверху", value: <>монета + результат сверху</> },
            ]}
          />
          <Typography.Text>
            Стены убирают часть маршрутов, но число шагов в оставшихся маршрутах
            между противоположными углами не меняют: по-прежнему h + w − 2.
            Бывает, что стены закрывают клетку и слева, и сверху, — такие клетки
            разбирает следующая подтема; на нашем поле их нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "steny-na-vhode",
      navLabel: "Какие стены важны",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              При расчёте до текущей клетки нас интересуют стены на входе в неё.
            </strong>{" "}
            Для движения вправо и вниз стена слева от текущей клетки запрещает
            приход слева, стена сверху — приход сверху. Стены справа и снизу не
            влияют на накопленную сумму до этой клетки: они определяют, куда
            робот сможет пойти дальше.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.gridPreds_0d7f60}
            caption={
              <>
                Стена слева отнимает приход слева, стена сверху — приход сверху;
                стены справа и снизу закрывают выходы и сумму до клетки не
                меняют.
              </>
            }
          />
          <Typography.Text>
            На нашем поле монета <Notation>{"C2"}</Notation> стоит 8, лучшая
            сумма слева (в <Notation>{"B2"}</Notation>) — 10, сверху (в{" "}
            <Notation>{"C1"}</Notation>) — 13, и сверху стена. Вариант с суммой
            13 недопустим, результат 10 + 8 = <strong>18</strong>. Использовать
            8 + max(10; 13) = 21 нельзя: такая формула разрешила бы пройти
            сквозь стену. Так же <Notation>{"D4"}</Notation> получает сумму
            только сверху: 2 + 30 = 32.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "stena-v-formule",
      navLabel: "Стена в формуле",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Excel стену учитывают формулой: у клетки со стеной из формулы
              убирают запрещённого предшественника.
            </strong>{" "}
            Для расчётной клетки <Notation>{"G2"}</Notation>, соответствующей
            исходной <Notation>{"B2"}</Notation>:
          </Typography.Text>
          <VariantPicker
            label={"Ситуация → формула в G2"}
            variants={[
              {
                label: "оба прихода доступны, ищем максимум",
                value: (
                  <>
                    <Notation>{"=B2+МАКС(F2;G1)"}</Notation>
                  </>
                ),
              },
              {
                label: "оба прихода доступны, ищем минимум",
                value: (
                  <>
                    <Notation>{"=B2+МИН(F2;G1)"}</Notation>
                  </>
                ),
              },
              {
                label: "можно прийти только сверху",
                value: (
                  <>
                    <Notation>{"=B2+G1"}</Notation>
                  </>
                ),
              },
              {
                label: "можно прийти только слева",
                value: (
                  <>
                    <Notation>{"=B2+F2"}</Notation>
                  </>
                ),
              },
            ]}
          />
          <Typography.Text>
            При одном допустимом предшественнике выбор между максимумом и
            минимумом в самой формуле не нужен. Но ссылка должна вести в
            соответствующий расчётный блок: максимальный или минимальный.
          </Typography.Text>
          <Typography.Text>
            Удобный порядок: заполнить весь прямоугольник общей формулой, как в
            прошлой подтеме, а затем исправить клетки у стен. На нашем поле в{" "}
            <Notation>{"H2"}</Notation> (под ней <Notation>{"C2"}</Notation> со
            стеной сверху) остаётся <Notation>{"=C2+G2"}</Notation>, в{" "}
            <Notation>{"I4"}</Notation> (<Notation>{"D4"}</Notation> со стеной
            слева) — <Notation>{"=D4+I3"}</Notation>:
          </Typography.Text>
          <SheetBlock {...lessonMedia.sheet3} label={"Лист «Стены»"} />
          <Typography.Text>
            Выбери <Notation>{"H2"}</Notation>: рамки только на монете{" "}
            <Notation>{"C2"}</Notation> и на <Notation>{"G2"}</Notation> —
            сверху приход закрыт.{" "}
            <strong>
              Толстая линия, нарисованная между ячейками Excel, сама по себе не
              меняет формулу.
            </strong>{" "}
            Это оформление таблицы, запрет перехода нужно учесть в расчёте.
            Рисунок стен удобно перенести и на расчётный блок — командой «Формат
            по образцу» или вставкой только форматов, — тогда при правке формул
            стены видны рядом. Блок минимума строится так же; в нём{" "}
            <Notation>{"C2"}</Notation> получает 8 + 8 = 16, а{" "}
            <Notation>{"D4"}</Notation> — 2 + 25 = 27, поэтому со стенами{" "}
            <strong>максимум 32, минимум 27</strong> вместо 35 и 25.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "otrezok-steny",
      navLabel: "Отрезок стены",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              На поле экзамена стена — отрезок вдоль нескольких клеток, и
              формулу правят на всём отрезке.
            </strong>{" "}
            Если стена тянется слева от клеток <Notation>{"E5:E9"}</Notation>, у
            всех пяти клеток приход только сверху. В блоке под полем со строки
            17 это клетки <Notation>{"E21:E25"}</Notation>: в{" "}
            <Notation>{"E21"}</Notation> записывают{" "}
            <Notation>{"=E5+E20"}</Notation> и копируют вниз до{" "}
            <Notation>{"E25"}</Notation>. Стена над клетками{" "}
            <Notation>{"H12:K12"}</Notation> даёт в строке блока формулу «только
            слева», скопированную вправо по отрезку.
          </Typography.Text>
          <Typography.Text>
            При сохранении только чисел, например в текстовый файл,{" "}
            <strong>
              сведения о стенах, нарисованных границами ячеек, теряются
            </strong>
            . Их пришлось бы учитывать отдельно. Для поля со стенами Excel
            удобен именно потому, что рисунок стен остаётся перед глазами.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "steny-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Стена запрещает переход, а не клетку; клетка со стеной на
                    входе получает сумму от оставшегося предшественника.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Для движения вправо и вниз важны стены слева и сверху от
                    клетки; стены справа и снизу закрывают выходы.
                  </>
                ),
              },
              {
                note: (
                  <>
                    В Excel: общая формула на весь блок, затем у клеток со
                    стеной — <Notation>{"=B2+G1"}</Notation> или{" "}
                    <Notation>{"=B2+F2"}</Notation>; ссылка — в свой блок.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Рисунок стен переносят на блок форматом; вдоль отрезка стены
                    формулу правят и копируют по всему отрезку.
                  </>
                ),
              },
            ]}
          />
        </>
      ),
    },
  ],
  paidPractice: {
    examFocus: true,
    checkpoint: 0,
    load: () => import("./spreadsheet-optimization.paid.praktika"),
  },
  status: "published",
});
