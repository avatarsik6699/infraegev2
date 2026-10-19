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
import { lessonMedia } from "./parallel-computing.paid.kogo-schitat.media";
import { PythonTerm } from "./python-term";

const content: LessonContent.PaidSubtopicContent = {
  theory: [
    {
      id: "vopros-v-neravenstva",
      navLabel: "Вопрос в неравенства",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Вопрос «сколько процессов…» переводят в неравенства для начал и
              окончаний: процесс работает в момент t, если s ≤ t {"<"} f,
              завершён к моменту t, если f ≤ t.
            </strong>{" "}
            Такие вопросы — в задачах задания с подсчётом процессов, в том числе
            в задаче ЕГЭ-2026 и в задании 22 проекта демоверсии 2027 года.
          </Typography.Text>
          <Typography.Text>
            Главный пример — снова восемь процессов: на седьмой миллисекунде [6;
            7) работают три, в момент 7 — два, пятое окончание — 11.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "process-rabotaet",
      navLabel: "Процесс работает",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Процесс, который начинается в момент s и заканчивается в момент f,
              работает на полуинтервале [s; f): начало включено, окончание —
              нет.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Процесс, начинающийся в момент 4 и заканчивающийся в момент 7,
            работает:
          </Typography.Text>
          <ul>
            <li>от 4 до 5;</li>
            <li>от 5 до 6;</li>
            <li>от 6 до 7.</li>
          </ul>
          <Typography.Text>Всего:</Typography.Text>
          <Typography.Text>7-4=3 мс.</Typography.Text>
          <Typography.Text>
            В момент 7 его работа уже завершена.
          </Typography.Text>
          <Typography.Text>
            Поэтому удобно обозначать время его работы так:
          </Typography.Text>
          <Typography.Text>[4;7).</Typography.Text>
          <Typography.Text>
            Квадратная скобка слева означает, что начало включено.
          </Typography.Text>
          <Typography.Text>
            Круглая скобка справа означает, что окончание не включено.
          </Typography.Text>
          <Typography.Text>
            Такой промежуток называют <strong>полуинтервалом</strong>.
          </Typography.Text>
          <Typography.Text>
            Это помогает точно записать условие активности процесса:
          </Typography.Text>
          <Typography.Text>sᵢ≤ t{"<"}fᵢ.</Typography.Text>
          <Typography.Text>В момент t процесс работает, если:</Typography.Text>
          <ul>
            <li>он уже начался;</li>
            <li>он ещё не закончился.</li>
          </ul>
          <Typography.Text>
            Например, процесс с началом 4 и окончанием 7:
          </Typography.Text>
          <LessonTable
            label={"Например, процесс с началом 4 и окончанием 7"}
            columns={[
              { label: "Момент t", numeric: true },
              { label: "Работает?" },
            ]}
            rows={[
              ["3", "Нет"],
              ["4", "Да"],
              ["6", "Да"],
              ["7", "Нет"],
              ["8", "Нет"],
            ]}
          />
          <Typography.Text>
            <strong>
              При завершении поставщика следующий процесс может начаться в тот
              же момент.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Если A заканчивается в 7, а B запускается сразу после A, начало B
            равно 7.
          </Typography.Text>
          <Typography.Text>Не нужно добавлять единицу:</Typography.Text>
          <Typography.Text>s_B=7, а не 8.</Typography.Text>
          <Typography.Text>
            Дополнительное время появляется только тогда, когда оно прямо задано
            условием.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "moment-i-millisekunda",
      navLabel: "Момент и миллисекунда",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Момент времени и номер миллисекунды — разные вещи: n-я
              миллисекунда — это промежуток [n − 1; n).
            </strong>
          </Typography.Text>
          <Typography.Text>
            Между моментами 4 и 7 проходят три миллисекунды.
          </Typography.Text>
          <Typography.Text>Поэтому длина промежутка:</Typography.Text>
          <Typography.Text>7-4=3.</Typography.Text>
          <Typography.Text>
            Но если кто-то подписал отдельные миллисекунды номерами 5, 6, 7,
            количество этих подписей равно:
          </Typography.Text>
          <Typography.Text>7-5+1=3.</Typography.Text>
          <Typography.Text>
            Формула с <Notation>{"+1"}</Notation> относится к подсчёту
            целочисленных номеров включительно.
          </Typography.Text>
          <Typography.Text>
            Формула без <Notation>{"+1"}</Notation> относится к разности
            моментов времени.
          </Typography.Text>
          <Typography.Text>
            Чтобы не смешивать способы, в своих таблицах будем всегда
            использовать моменты:
          </Typography.Text>
          <Typography.Text>0, 1, 2, 3,…</Typography.Text>
          <Typography.Text>
            А столбец с подписью t будет обозначать промежуток:
          </Typography.Text>
          <Typography.Text>[t;t+1).</Typography.Text>
          <Typography.Text>
            Столбец <Notation>{"0"}</Notation> — это первая миллисекунда работы,
            от момента 0 до момента 1.
          </Typography.Text>
          <Typography.Text>
            Столбец <Notation>{"4"}</Notation> — промежуток от 4 до 5.
          </Typography.Text>
          <Typography.Text>
            <strong>
              Если миллисекунды нумеруются с 1, то n-я миллисекунда — это
              промежуток [n-1;n).
            </strong>{" "}
            Например, седьмая миллисекунда занимает [6;7), а не [7;8). При
            целочисленных началах и окончаниях для ответа «кто работает на
            седьмой миллисекунде» проверяем активность при t=6.
          </Typography.Text>
          <LessonDiagram
            {...lessonMedia.prGantt_f1e67a}
            caption={
              <>
                Серая полоса — седьмая миллисекунда [6; 7): на ней работают
                процессы 3, 4 и 5. Пунктир — момент 7: процесс 3 уже завершён,
                работают только 4 и 5.
              </>
            }
          />
          <Typography.Text>
            В нашем примере на [6;7) работают процессы 3, 4 и 5 — всего три.
            Ровно в момент 7 процесс 3 уже завершён, поэтому работают только 4 и
            5 — два. Это разные вопросы, а не два способа записать один ответ.
          </Typography.Text>
          <Typography.Text>
            Если номер миллисекунды находится в H2, для подсчёта используй
            момент <Notation>{"H2-1"}</Notation>: начало должно быть не больше{" "}
            <Notation>{"H2-1"}</Notation>, а окончание — строго больше{" "}
            <Notation>{"H2-1"}</Notation>. Когда условие спрашивает именно
            момент времени, вычитать единицу не нужно. Так перевод формулировки
            сохраняет нашу единую шкалу моментов и правило sᵢ≤ t{"<"}fᵢ.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "scheteslimn",
      navLabel: "СЧЁТЕСЛИМН",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              В Excel работающие в момент t процессы считает{" "}
              <Notation>{"СЧЁТЕСЛИМН"}</Notation> с двумя условиями: начало не
              позже t, окончание позже t.
            </strong>
          </Typography.Text>
          <Typography.Text>Используем нашу основную таблицу:</Typography.Text>
          <ul>
            <li>D2:D9 — начала;</li>
            <li>E2:E9 — окончания.</li>
          </ul>
          <Typography.Text>
            Пусть интересующий момент времени записан в H2.
          </Typography.Text>
          <Typography.Text>Тогда число активных процессов:</Typography.Text>
          <FormulaBlock
            lines={[
              { formula: '=СЧЁТЕСЛИМН($D$2:$D$9;"<="&H2;$E$2:$E$9;">"&H2)' },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Функция <Notation>{"СЧЁТЕСЛИМН"}</Notation> считает строки, которые
            одновременно удовлетворяют всем указанным условиям. Диапазоны
            условий должны иметь одинаковый размер.
          </Typography.Text>
          <Typography.Text>Первое условие:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: '$D$2:$D$9;"<="&H2' }]}
            label="Формула"
          />
          <Typography.Text>
            означает: начало не позже выбранного момента.
          </Typography.Text>
          <Typography.Text>Второе:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: '$E$2:$E$9;">"&H2' }]}
            label="Формула"
          />
          <Typography.Text>
            означает: окончание позже выбранного момента.
          </Typography.Text>
          <Typography.Text>
            Знак <Notation>{"&"}</Notation> соединяет текст условия с числом.
          </Typography.Text>
          <Typography.Text>Если H2 содержит 7:</Typography.Text>
          <FormulaBlock lines={[{ formula: '"<="&H2' }]} label="Формула" />
          <Typography.Text>
            превратится в условие <Notation>{"<=7"}</Notation>.
          </Typography.Text>
          <Typography.Text>А:</Typography.Text>
          <FormulaBlock lines={[{ formula: '">"&H2' }]} label="Формула" />
          <Typography.Text>
            — в условие <Notation>{">7"}</Notation>.
          </Typography.Text>
          <Typography.Text>
            Для нашего примера в момент 7 работают:
          </Typography.Text>
          <ul>
            <li>процесс 4: [6;8);</li>
            <li>процесс 5: [6;11).</li>
          </ul>
          <Typography.Text>
            Процесс 3 уже завершился в момент 7.
          </Typography.Text>
          <Typography.Text>Ответ:</Typography.Text>
          <Typography.Text>2 процесса.</Typography.Text>
          <Typography.Text>
            Если вместо строгого <Notation>{">"}</Notation> поставить{" "}
            <Notation>{">="}</Notation>, процесс 3 ошибочно окажется среди
            работающих в момент своего завершения.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "zavershivshiesya-i-nachavshiesya",
      navLabel: "Завершившиеся и начавшиеся",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              По той же таблице считают завершившиеся, начавшиеся и ещё не
              начавшие процессы — меняются только условия.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Число процессов, завершившихся к моменту H2:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: '=СЧЁТЕСЛИМН($E$2:$E$9;"<="&H2)' }]}
            label="Формула"
          />
          <Typography.Text>
            Здесь окончание включаем: если процесс закончился ровно в выбранный
            момент, он уже завершён.
          </Typography.Text>
          <Typography.Text>
            Число процессов, которые к этому моменту уже начали работу:
          </Typography.Text>
          <FormulaBlock
            lines={[{ formula: '=СЧЁТЕСЛИМН($D$2:$D$9;"<="&H2)' }]}
            label="Формула"
          />
          <Typography.Text>
            Среди начавшихся будут и работающие, и уже завершившиеся.
          </Typography.Text>
          <Typography.Text>Для момента 8 в нашем примере:</Typography.Text>
          <LessonTable
            label={"Для момента 8 в нашем примере"}
            columns={[
              { label: "Состояние" },
              { label: "Процессы" },
              { label: "Количество", numeric: true },
            ]}
            rows={[
              ["Завершены", "1, 2, 3, 4", "4"],
              ["Работают", "5, 6", "2"],
              ["Ещё не начали", "7, 8", "2"],
            ]}
          />
          <Typography.Text>Проверка:</Typography.Text>
          <Typography.Text>4+2+2=8.</Typography.Text>
          <Typography.Text>
            <strong>
              Если спрашивают, когда завершится определённое количество
              процессов, важен порядок окончаний, а не ID.
            </strong>
          </Typography.Text>
          <Typography.Text>Наши окончания:</Typography.Text>
          <Typography.Text>4, 6, 7, 8, 11, 12, 13, 14.</Typography.Text>
          <Typography.Text>
            Хотим узнать, когда завершатся хотя бы пять процессов.
          </Typography.Text>
          <Typography.Text>
            Пятое по величине снизу окончание равно 11.
          </Typography.Text>
          <Typography.Text>В Excel:</Typography.Text>
          <FormulaBlock
            lines={[{ formula: "=НАИМЕНЬШИЙ(E2:E9;5)" }]}
            label="Формула"
          />
          <Typography.Text>
            Функция выбирает пятый элемент в упорядоченном по возрастанию наборе
            значений.
          </Typography.Text>
          <Typography.Text>
            Если несколько процессов заканчиваются одновременно, количество
            завершённых может увеличиться сразу на несколько.
          </Typography.Text>
          <Typography.Text>
            Например, оно может перейти с 4 сразу на 6. Тогда:
          </Typography.Text>
          <ul>
            <li>
              момент, когда завершились <strong>хотя бы 5</strong>, существует;
            </li>
            <li>
              момент, когда завершились <strong>ровно 5</strong>, может не
              существовать.
            </li>
          </ul>
          <Typography.Text>
            Поэтому слова «ровно», «не менее», «не более» нельзя считать
            взаимозаменяемыми.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "vnutri-okna",
      navLabel: "Внутри окна",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              Если вопрос — «начался и закончился внутри окна», границы задают
              оба условия: начало не раньше a, окончание не позже b.
            </strong>
          </Typography.Text>
          <Typography.Text>
            Сколько процессов основного примера целиком уложились в промежуток
            [4; 12] — начались не раньше 4 и закончились не позже 12? Подходят 3
            (4–7), 4 (6–8), 5 (6–11) и 6 (8–12): четыре процесса.
          </Typography.Text>
          <FormulaBlock
            lines={[
              { formula: '=СЧЁТЕСЛИМН($D$2:$D$9;">="&4;$E$2:$E$9;"<="&12)' },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Если спрашивают сумму их ID, тот же отбор делает{" "}
            <PythonTerm term="xl-countif">
              <Notation>{"СУММЕСЛИМН"}</Notation>
            </PythonTerm>{" "}
            по столбцу ID: 3 + 4 + 5 + 6 = 18.
          </Typography.Text>
          <FormulaBlock
            lines={[
              {
                formula:
                  '=СУММЕСЛИМН($A$2:$A$9;$D$2:$D$9;">="&4;$E$2:$E$9;"<="&12)',
              },
            ]}
            label="Формула"
          />
          <Typography.Text>
            Знаки в условиях берут из формулировки: «не раньше» —{" "}
            <Notation>{">="}</Notation>, «раньше» — <Notation>{"<"}</Notation>,
            «не позже» — <Notation>{"<="}</Notation>. Одна неверная строгость
            меняет ответ, если какой-то процесс начинается или заканчивается
            ровно на границе окна.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "k-e-okonchanie",
      navLabel: "k-е окончание",
      explanation: (
        <>
          <Typography.Text>
            <strong>
              «Через какое время завершатся k процессов» — это k-е по величине
              окончание, и «ровно k» может не существовать.
            </strong>
          </Typography.Text>
          <LessonTable
            label={"Вопрос, Как считать, Пример (основная таблица)"}
            columns={[
              { label: "Вопрос" },
              { label: "Как считать" },
              { label: "Пример (основная таблица)" },
            ]}
            rows={[
              [
                "Когда завершатся хотя бы 5 процессов?",
                "5-е окончание по возрастанию",
                "11",
              ],
              [
                "Сколько процессов завершено к моменту 8?",
                "окончания ≤ 8",
                "4",
              ],
              [
                "Есть ли момент, когда завершены ровно 5?",
                "между 5-м и 6-м окончанием есть место",
                "да, [11; 12)",
              ],
              ["Когда завершены все?", "наибольшее окончание", "14"],
            ]}
          />
          <Typography.Text>
            Если два процесса заканчиваются одновременно, количество завершённых
            перескакивает сразу на 2 — и момента «ровно k» для промежуточного k
            нет.
          </Typography.Text>
        </>
      ),
    },
    {
      id: "schitat-itogo",
      navLabel: "Итого",
      explanation: (
        <>
          <LessonSummary
            items={[
              {
                note: (
                  <>
                    Процесс работает на [s; f): в момент s уже работает, в
                    момент f — уже нет; следующий процесс может стартовать в тот
                    же момент f.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Длина промежутка — разность моментов, без +1; n-я
                    миллисекунда — [n − 1; n).
                  </>
                ),
              },
              {
                note: (
                  <>
                    Работают в момент t:{" "}
                    <Notation>
                      {'СЧЁТЕСЛИМН(начала;"<="&t;окончания;">"&t)'}
                    </Notation>
                    ; завершены: окончания <Notation>{'"<="&t'}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    Окно [a; b]: начало <Notation>{">=a"}</Notation> и окончание{" "}
                    <Notation>{"<=b"}</Notation>; сумма ID —{" "}
                    <Notation>{"СУММЕСЛИМН"}</Notation>.
                  </>
                ),
              },
              {
                note: (
                  <>
                    k-е окончание —{" "}
                    <Notation>{"НАИМЕНЬШИЙ(окончания;k)"}</Notation>; «хотя бы
                    k» и «ровно k» — разные вопросы.
                  </>
                ),
              },
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
          Процесс работает на [5; 9). Работает ли он в момент 5? В момент 9?
          Какова его длительность?
        </>
      ),
      reveal: (
        <>В момент 5 работает, в момент 9 уже завершён; длительность 4 мс.</>
      ),
    },
  ],
};

export default content;
