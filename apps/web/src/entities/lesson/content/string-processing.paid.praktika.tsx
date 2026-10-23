// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./string-processing.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Программу проверяют на короткой строке, где ответ виден глазами:
          прежде чем запускать её на миллионе символов, подставь строку из урока
          и сравни.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "перевод строки",
            value: <>Строка прочитана без strip()</>,
            note: <>лишний символ в конце: сравни len(s) с ожидаемым</>,
          },
          {
            label: "best при обрыве",
            value: <>Ответ обновляется только при разрыве цепочки</>,
            note: <>проверь строку, где лучшая цепочка в самом конце</>,
          },
          {
            label: "s[i − 1] при i = 0",
            value: <>Цикл по соседям начат с нуля</>,
            note: <>первый символ сравнится с последним — начинай с i = 1</>,
          },
          {
            label: "сброс до 0",
            value: <>На запретной паре цепочка обнулена</>,
            note: <>второй символ пары начинает новую цепочку — сброс до 1</>,
          },
          {
            label: "if вместо while",
            value: <>Левая граница окна сдвинута один раз</>,
            note: <>проверь строку, где лишняя буква стоит не первой</>,
          },
          {
            label: "count и перекрытия",
            value: <>Вхождения слова посчитаны методом count</>,
            note: <>в ABABA два ABA, а count даст 1</>,
          },
          {
            label: "числа как строки",
            value: <>Наибольшее число выбрано max по строкам</>,
            note: <>'45' больше '131' — переводи в int</>,
          },
        ]}
      />
      <Typography.Text>
        Для сложного условия полезно написать медленную проверку: перебрать все
        куски короткой строки и сравнить ответ с быстрой программой. Для файла
        такой перебор не годится, а для строки из 10 символов — в самый раз.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 24 решается одним проходом по строке: выбери, что
          помнить по дороге, — текущую цепочку, границы окна, позиции нужных
          символов или шаблон выражения.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 24 на одной схеме"}
        flow={[
          { name: "Строка", note: "open(…).readline().strip()" },
          { name: "Один проход", note: "что помнить по дороге" },
          { name: "Ответ", note: "длина, позиция или число" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="stroka-i-cepochka">
                Строка и цепочка
              </SubtopicLink>
            ),
            rows: [
              { key: <>current</>, note: <>цепочка до текущего символа</> },
              { key: <>best</>, note: <>после каждого символа</> },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="sosedi">
                Условия на соседей
              </SubtopicLink>
            ),
            rows: [
              { key: <>символ</>, note: <>сброс до 0</> },
              { key: <>пара</>, note: <>сброс до 1</> },
              { key: <>тройка</>, note: <>сброс до 2</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="obrazcy-i-bloki">
                Образцы и блоки
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"pattern[current % m]"}</Notation>,
                note: <>следующий ожидаемый символ</>,
              },
              { key: <>пары</>, note: <>шаг 2, два смещения</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="skolzyashchee-okno">
                Скользящее окно
              </SubtopicLink>
            ),
            rows: [
              { key: <>не более K</>, note: <>while count &gt; K</> },
              { key: <>ровно K</>, note: <>ответ при count == K</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="pozicii-i-granicy">
                Позиции и границы
              </SubtopicLink>
            ),
            rows: [
              { key: <>K подряд</>, note: <>по списку позиций</> },
              { key: <>−1 и len(s)</>, note: <>искусственные границы</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="chisla-i-vyrazheniya">
                Числа и выражения
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"(?:0|[1-9][0-9]*)"}</Notation>,
                note: <>число без ведущих нулей</>,
              },
              { key: <>172</>, note: <>ответ задачи темы</> },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink routeSlug={R} subtopic="usloviya-i-balans">
                Выражения с условиями и баланс
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>значение 0</>, note: <>произведение с нулём</> },
              { key: <>баланс</>, note: <>первые появления в словаре</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>Какие куски подходят: символы, соседи, количество, шаблон?</>,
              <>Что сравниваем: длину, количество, значение?</>,
              <>Что выводим и как выбирать при равенстве?</>,
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
