import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

const learningBridge = [
  [
    "01",
    "Знакомое",
    "Начните с ситуации, которую ученик уже может представить.",
  ],
  ["02", "Термин", "Назовите новое понятие там, где оно впервые понадобилось."],
  ["03", "Пример", "Покажите конкретное действие и промежуточный результат."],
  ["04", "Правило", "Обобщите наблюдение только после разобранного примера."],
  [
    "05",
    "Проверка",
    "Попросите коротко воспроизвести идею и назовите результат.",
  ],
] as const;

const copyPairs = [
  {
    title: "Новый термин",
    unclear: "Рекурсивный переход уменьшает аргумент.",
    clear:
      "Каждый следующий вызов получает число на единицу меньше. Это действие называется рекурсивным переходом.",
  },
  {
    title: "Инструкция",
    unclear: "Введите ваш ответ в поле ниже.",
    clear: "Запишите количество вызовов функции.",
  },
  {
    title: "Ошибка",
    unclear: "Неверно. Попробуйте ещё раз.",
    clear:
      "Получилось 3, потому что исходный вызов countdown(3) не был посчитан. Добавьте его к цепочке.",
  },
  {
    title: "Результат",
    unclear: "Тема изучена.",
    clear:
      "Теперь вы можете найти базовый случай и посчитать цепочку рекурсивных вызовов.",
  },
] as const;

export const SystemContentLanguageSpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-content-language"
    aria-labelledby="system-content-language-heading"
  >
    <Typography.Title
      order={3}
      id="system-content-language-heading"
      className={styles.patternHeading}
    >
      Язык контента
    </Typography.Title>
    <Typography.Text className={styles.paletteDescription}>
      Спокойный русский текст ведёт ученика от знакомого действия к новому
      понятию. Один абзац решает одну задачу, а ошибка объясняет причину без
      обвинения и пустого ободрения.
    </Typography.Text>
    <ol className={styles.learningBridge} aria-label="Порядок введения идеи">
      {learningBridge.map(([number, title, description]) => (
        <li key={number}>
          <code>{number}</code>
          <strong>{title}</strong>
          <span>{description}</span>
        </li>
      ))}
    </ol>
    <div className={styles.copyPairList}>
      {copyPairs.map((pair) => (
        <article
          key={pair.title}
          className={styles.copyPair}
          data-copy-contract={pair.title}
        >
          <Typography.Title order={4}>{pair.title}</Typography.Title>
          <div className={styles.copyPairExamples}>
            <div>
              <span>Неясно</span>
              <Typography.Text>{pair.unclear}</Typography.Text>
            </div>
            <div>
              <span>Ясно</span>
              <Typography.Text>{pair.clear}</Typography.Text>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
