// Paid content (Change 192): served only after an access check; never
// import it statically.
import { Typography } from "~/shared/components/typography";
import {
  TopicCheatSheet,
  VariantPicker,
} from "~/shared/components/learning-content";
import type { LessonContent } from "../lib/define-lesson.types";
import { R } from "./array-processing.theme";
import { SubtopicLink } from "./subtopic-link";

const content: LessonContent.PaidPracticeContent = {
  examFocus: (
    <>
      <Typography.Text>
        <strong>
          Прежде чем запускать программу на файле, прогони её на пяти-шести
          объектах, где ответ виден на бумаге: так мы проверили камеру хранения
          на двух ячейках, прежде чем решать задачу темы.
        </strong>{" "}
        Выбери ошибку, чтобы увидеть, как её поймать:
      </Typography.Text>
      <VariantPicker
        label={"Ошибка и как себя проверить"}
        variants={[
          {
            label: "заголовок как данные",
            value: <>Количество объектов прочитано как ещё один объект</>,
            note: <>сравни длину списка с N из файла</>,
          },
          {
            label: "поля по отдельности",
            value: <>Начала и окончания отсортированы раздельно</>,
            note: <>проверь, что каждая запись есть в исходных данных</>,
          },
          {
            label: "break без сортировки",
            value: <>Цикл остановлен на первом неподходящем объекте</>,
            note: <>переставь маленький объект в конец списка</>,
          },
          {
            label: "второй критерий сразу",
            value: <>Наибольший объект выбран, не зафиксировав количество</>,
            note: <>сравни количество с ответом без второго критерия</>,
          },
          {
            label: "последняя серия",
            value: <>Серия в конце ряда не учтена</>,
            note: <>проверь ряд, который заканчивается серией</>,
          },
          {
            label: "та же минута",
            value: <>Ячейку заняли в минуту её освобождения</>,
            note: (
              <>в задаче темы это 877 7 вместо 859 11 — перечитай правило</>
            ),
          },
        ]}
      />
      <Typography.Text>
        Если ответ — два числа, проверь второе отдельно: оно часто считается
        другим приёмом, чем первое, — как наибольший файл при наибольшем
        количестве файлов.
      </Typography.Text>
    </>
  ),
  result: (
    <>
      <Typography.Text>
        <strong>
          Задание 26 решается сортировкой записей и одним проходом: либо ты сам
          выбираешь лучшее — жадно, обосновав выбор, — либо в точности
          исполняешь правила условия.
        </strong>
      </Typography.Text>
      <Typography.Text>
        Всё главное из подтем собрано на одной схеме. Номер раздела ведёт на его
        подтему.
      </Typography.Text>
      <TopicCheatSheet
        label={"Задание 26 на одной схеме"}
        flow={[
          { name: "Файл", note: "по описанию формата" },
          { name: "Записи", note: "сортировка по ключу" },
          { name: "Проход", note: "выбрать или исполнить" },
        ]}
        groups={[
          {
            number: 1,
            title: (
              <SubtopicLink routeSlug={R} subtopic="zapisi-i-rejting">
                Записи, сортировка и рейтинг
              </SubtopicLink>
            ),
            rows: [
              { key: <>ключ</>, note: <>минус у «больше — выше»</> },
              { key: <>граница</>, note: <>доля — целая часть</> },
            ],
          },
          {
            number: 2,
            title: (
              <SubtopicLink routeSlug={R} subtopic="zhadnyj-vybor">
                Жадный выбор
              </SubtopicLink>
            ),
            rows: [
              { key: <>больше всего</>, note: <>от самых маленьких</> },
              { key: <>наибольший</>, note: <>закрепить k − 1</> },
            ],
          },
          {
            number: 3,
            title: (
              <SubtopicLink routeSlug={R} subtopic="cepochki-i-pary">
                Цепочки коробок и пары
              </SubtopicLink>
            ),
            rows: [
              { key: <>матрёшка</>, note: <>самая большая подходящая</> },
              { key: <>пары</>, note: <>два указателя</> },
            ],
          },
          {
            number: 4,
            title: (
              <SubtopicLink routeSlug={R} subtopic="ryady-i-serii">
                Ряды, серии и группы
              </SubtopicLink>
            ),
            rows: [
              { key: <>свободно</>, note: <>b − a − 1</> },
              { key: <>серия</>, note: <>учесть после цикла</> },
            ],
          },
          {
            number: 5,
            title: (
              <SubtopicLink routeSlug={R} subtopic="intervaly">
                Интервалы и события
              </SubtopicLink>
            ),
            rows: [
              { key: <>мероприятия</>, note: <>по раннему окончанию</> },
              { key: <>нагрузка</>, note: <>события +1 и −1</> },
            ],
          },
          {
            number: 6,
            title: (
              <SubtopicLink routeSlug={R} subtopic="modelirovanie">
                Моделирование процесса
              </SubtopicLink>
            ),
            rows: [
              { key: <>free_at</>, note: <>когда освободится ячейка</> },
              { key: <>859 11</>, note: <>ответ задачи темы</> },
            ],
          },
          {
            number: 7,
            title: (
              <SubtopicLink routeSlug={R} subtopic="pary-okno-i-cepochki">
                Пары, окно и сложные цепочки
              </SubtopicLink>
            ),
            level: "дополнительный урок",
            rows: [
              { key: <>окно</>, note: <>левая граница догоняет</> },
              { key: <>куча</>, note: <>быстрый наименьший</> },
            ],
          },
        ]}
        sections={[
          {
            title: "Порядок решения",
            steps: [
              <>Что выводим и что такое один объект?</>,
              <>Выбираем лучшее или исполняем правила?</>,
              <>Какой порядок и какое состояние нужны проходу?</>,
              <>Сначала маленький пример вручную, потом файл.</>,
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
