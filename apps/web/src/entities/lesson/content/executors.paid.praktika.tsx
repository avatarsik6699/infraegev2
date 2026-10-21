// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Ответ проверяют тем же, чем решали: короткой трассой по таблице или
          входом, на котором достигается граница.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "запись при S",
            value: (
              <>
                При <Notation>{"S"}</Notation> пропущена запись: остановочная
                ячейка осталась старой
              </>
            ),
            note: <>выполнить запись команды перед остановкой</>,
          },
          {
            label: "запись после сдвига",
            value: (
              <>Символ записан в новую ячейку: изменилась соседняя клетка</>
            ),
            note: <>запись — в старую текущую ячейку, потом сдвиг</>,
          },
          {
            label: "начальная ячейка",
            value: (
              <>
                Головка начала на последней цифре, а сказано «в пустой ячейке
                справа»
              </>
            ),
            note: <>перечитать начальное положение дословно</>,
          },
          {
            label: "перевёрнутая строка",
            value: (
              <>
                Прочитанная справа налево строка записана в ответ перевёрнутой
              </>
            ),
            note: <>итог читается по ленте слева направо</>,
          },
          {
            label: "пустая клетка — стоп",
            value: <>Пустая клетка таблицы принята за остановку</>,
            note: (
              <>
                пустая клетка — невозможное сочетание; сверить предыдущие такты
              </>
            ),
          },
          {
            label: "q0 — стоп",
            value: <>Начальное состояние q0 принято за остановку</>,
            note: <>остановку задаёт только S</>,
          },
          {
            label: "λ — ноль",
            value: <>Пустой символ λ принят за цифру 0</>,
            note: <>λ — отдельный символ со своим столбцом таблицы</>,
          },
          {
            label: "слово и число",
            value: <>Длина взята по числу без ведущих нулей</>,
            note: <>ведущие нули — тоже ячейки слова</>,
          },
          {
            label: "выборка вместо границы",
            value: <>Максимум взят из нескольких запусков</>,
            note: (
              <>вывести границу и привести вход, на котором она достигается</>
            ),
          },
          {
            label: "не та величина",
            value: (
              <>
                Записан результат, а спрашивали параметр, такты или десятичное
                значение
              </>
            ),
            note: <>перечитать вопрос</>,
          },
        ]}
      />
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 12 решается в три шага: несколько тактов по
          таблице вручную, смысл таблицы для любой строки — замена, арифметика,
          хвост или фазы, — и ответ на вопрос, для обратного вопроса — с входом,
          на котором он достигается.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 12 на одной схеме"}
        flow={[
          {
            name: "Такты",
            note: "первые такты вручную: запись, сдвиг, состояние",
          },
          {
            name: "Смысл",
            note: "замена, ±1 и цифры на краях, хвост или фазы",
          },
          {
            name: "Ответ",
            note: "число, слово, количество или граница с примером",
          },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink
                routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
                subtopic="lenta-i-komanda"
              >
                Лента и такт
              </SubtopicLink>
            ),
            rows: [
              {
                key: <>λ, L, q1</>,
                note: <>записать → сдвинуться → состояние</>,
              },
              {
                key: <>10100 → 10011</>,
                note: <>4 такта, головка на ячейке 2</>,
              },
              { key: <>S</>, note: <>запись и остановка, такт считается</> },
              {
                key: <Notation>{"run_tm"}</Notation>,
                note: <>таблица словарём</>,
              },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink
                routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
                subtopic="prohod-i-kolichestva"
              >
                Однократный проход
              </SubtopicLink>
            ),
            rows: [
              { key: <>замена</>, note: <>каждая ячейка сама по себе</> },
              { key: <>количества</>, note: <>из результата во вход</> },
              { key: <>два в один</>, note: <>выбор — для min и max</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink
                routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
                subtopic="slovo-i-chislo"
              >
                Двоичное число
              </SubtopicLink>
            ),
            rows: [
              { key: <>20 → 19</>, note: <>таблица задачи темы: минус один</> },
              { key: <>N + 2ᵏ</>, note: <>единица слева</> },
              { key: <>2N + 1</>, note: <>единица справа</> },
              { key: <>2ᵏ − 1 − N</>, note: <>инверсия</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink
                routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
                subtopic="hvost-i-obratnaya-zadacha"
              >
                Хвост и обратная задача
              </SubtopicLink>
            ),
            rows: [
              { key: <>P 1 0ᵗ → P 0 1ᵗ</>, note: <>меняется только хвост</> },
              { key: <>5 нулей</>, note: <>4 из P и 1 новый</> },
              { key: <>11</>, note: <>ответ: 4 нуля, 1, 7 нулей</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink
                routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
                subtopic="sostoyaniya-i-fazy"
              >
                Состояния и фазы
              </SubtopicLink>
            ),
            rows: [
              { key: <>фаза</>, note: <>что делает и чем заканчивается</> },
              { key: <>10, k единиц, 0</>, note: <>важна только длина</> },
              { key: <>2k + 4</>, note: <>такты — сумма по фазам</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink
                routeSlug="12-ispolnenie-algoritma-dlya-ispolnitelya"
                subtopic="ogranicheniya-na-summu"
              >
                Сумма и простота
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>S = 7a + 8b + 3c</>, note: <>сумма через количества</> },
              { key: <>простое</>, note: <>больше 1, делители до √x</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Где головка в начале и в каком состоянии?</>,
              <>Что таблица делает с любой строкой — какая модель подходит?</>,
              <>Что спрашивают: слово, число, такты, количество или границу?</>,
            ],
          },
        ]}
        caption={
          <>
            Шпаргалка темы: порядок решения и главное из каждой подтемы. Номер
            раздела ведёт на подтему.
          </>
        }
      />
    </>
  ),
};

export default content;
