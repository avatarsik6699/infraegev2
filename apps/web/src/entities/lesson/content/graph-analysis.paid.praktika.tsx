// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Notation } from "~/shared/components/notation";
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./graph-analysis.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Программу проверяют на учебном графе из восьми рёбер: она должна дать
          7.5 для пути из 1 в 100 и 8.5 — из 6.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как себя проверить:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "тупик — ноль",
            value: <>Для вершины без стрелок функция возвращает 0</>,
            note: (
              <>
                0 значит «уже в цели»; в тупике —{" "}
                <Notation>{'float("inf")'}</Notation>
              </>
            ),
          },
          {
            label: "целая часть рано",
            value: <>Веса переведены в int при чтении</>,
            note: <>вес — float; int только от итоговой суммы</>,
          },
          {
            label: "round вместо int",
            value: <>Ответ округлён, а не обрезан</>,
            note: (
              <>
                <Notation>{"round(12.6)"}</Notation> — 13, а целая часть — 12
              </>
            ),
          },
          {
            label: 'split(" ")',
            value: <>Строка разбита по одному пробелу</>,
            note: (
              <>
                при двух пробелах или табуляции получатся пустые куски;{" "}
                <Notation>{"split()"}</Notation> без аргумента
              </>
            ),
          },
          {
            label: "нет @cache",
            value: <>Программа на файле экзамена не заканчивается</>,
            note: <>без запоминания она перебирает миллиарды путей</>,
          },
          {
            label: "запрет в старой функции",
            value: <>Запрет добавлен в функцию, уже вызванную без него</>,
            note: <>@cache помнит старые ответы; для запрета — своя функция</>,
          },
        ]}
      />
      <Typography.Text>
        Перед запуском на файле задачи подставь учебный файл и сравни ответы с
        посчитанными руками. Потом выведи само число, а не только целую часть:
        так видно и бесконечность, и почти целую сумму вроде 4519.999999999998.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Любая задача задания 23 решается одной функцией: длина лучшего пути от
          вершины до цели, через ответы соседей, с запоминанием. Вопрос условия
          меняет только три места в ней — или её аргументы.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 23 на одной схеме"}
        flow={[
          { name: "Граф", note: "словарь: вершина → (куда, вес)" },
          { name: "Функция", note: "f(v) через f соседей, @cache" },
          { name: "Ответ", note: "f(1), целая часть в конце" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="graf-i-put">
                Граф и путь
              </SubtopicLink>
            ),
            rows: [
              { key: <>строка «a b w»</>, note: <>ребро из a в b весом w</> },
              { key: <>длина пути</>, note: <>сумма весов</> },
              { key: <>7.5</>, note: <>кратчайший путь учебного графа</> },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="put-do-celi">
                Лучший путь до цели
              </SubtopicLink>
            ),
            rows: [
              { key: <>f(цели)</>, note: <>0</> },
              { key: <>f(v)</>, note: <>min(вес + f(конца))</> },
              { key: <>тупик</>, note: <>∞, а не 0</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="programma">
                Программа с @cache
              </SubtopicLink>
            ),
            rows: [
              {
                key: <Notation>{"graph.get(v, [])"}</Notation>,
                note: <>стрелки из v, у тупика пусто</>,
              },
              { key: <>@cache</>, note: <>каждая вершина один раз</> },
              { key: <>10211</>, note: <>ответ задачи темы</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="usloviya-na-put">
                Условия на путь
              </SubtopicLink>
            ),
            rows: [
              { key: <>через k</>, note: <>f(s, k) + f(k, t)</> },
              { key: <>в обход k</>, note: <>в k вернуть ∞</> },
              { key: <>через a → b</>, note: <>f(s, a) + вес + f(b, t)</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="drugie-voprosy">
                Другие вопросы о путях
              </SubtopicLink>
            ),
            rows: [
              { key: <>число путей</>, note: <>в цели 1, сумма</> },
              { key: <>самый длинный</>, note: <>max, в тупике −∞</> },
              { key: <>число рёбер</>, note: <>вместо веса 1</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="k-reber">
                Условие на число рёбер
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>f(v, k)</>, note: <>ровно k рёбер</> },
              { key: <>не больше k</>, note: <>min по j от 1 до k</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Три вопроса к условию",
            steps: [
              <>
                Что ищут: кратчайший путь, самый длинный, число путей, рёбер?
              </>,
              <>Есть ли условие на путь: вершина, ребро, число рёбер?</>,
              <>Что записать в ответ: целую часть или само число?</>,
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
