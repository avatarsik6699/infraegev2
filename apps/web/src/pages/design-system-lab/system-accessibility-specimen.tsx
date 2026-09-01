import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

const accessibilityRules = [
  "Минимальная интерактивная область — 40 × 40 px.",
  "Смысл состояния не передаётся только цветом.",
  "Обязательный контент остаётся в SSR и без JavaScript.",
  "Motion получает спокойную альтернативу при reduced motion.",
] as const;

export const SystemAccessibilitySpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-accessibility"
    aria-labelledby="system-accessibility-heading"
  >
    <Typography.Title
      order={3}
      id="system-accessibility-heading"
      className={styles.patternHeading}
    >
      Доступность и браузерные состояния
    </Typography.Title>
    <Typography.Text className={styles.paletteDescription}>
      Это общие свойства среды: они работают до выбора конкретной кнопки, поля
      или виджета и поэтому проверяются отдельно от каталога компонентов.
    </Typography.Text>
    <div className={styles.browserStateGrid}>
      <article className={styles.browserState} data-browser-state="focus">
        <code>focus-visible</code>
        <button className={styles.browserFocusDemo} type="button">
          Сфокусируйте с клавиатуры
        </button>
        <Typography.Text>
          Контрастный контур не меняет геометрию элемента.
        </Typography.Text>
      </article>
      <article className={styles.browserState} data-browser-state="target">
        <code>target · 40 × 40</code>
        <span className={styles.browserTargetDemo} aria-hidden="true">
          40
        </span>
        <Typography.Text>
          Плотный интерфейс не уменьшает доступную область действия.
        </Typography.Text>
      </article>
      <article className={styles.browserState} data-browser-state="selection">
        <code>::selection</code>
        <Typography.Text className={styles.browserSelectionDemo}>
          Выделите эту строку: текст остаётся читаемым.
        </Typography.Text>
        <Typography.Text>
          Выделение использует системные фон и чернила.
        </Typography.Text>
      </article>
      <article className={styles.browserState} data-browser-state="scrollbar">
        <code>scrollbar</code>
        <div
          className={styles.browserScrollDemo}
          tabIndex={0}
          aria-label="Пример системной полосы прокрутки"
        >
          <span>Начало области</span>
          <span>Прокручиваемый контент</span>
          <span>Конец области</span>
        </div>
        <Typography.Text>
          Вложенная прокрутка появляется только при реальной необходимости.
        </Typography.Text>
      </article>
      <article className={styles.browserState} data-browser-state="motion">
        <code>prefers-reduced-motion</code>
        <button
          className={styles.browserMotionDemo}
          type="button"
          aria-label="Проверить системную реакцию на reduced motion"
        >
          <span aria-hidden="true" />
          Наведите или сфокусируйте
        </button>
        <Typography.Text>
          Состояние сохраняется, даже если движение отключено.
        </Typography.Text>
      </article>
    </div>
    <ul className={styles.accessibilityRuleList}>
      {accessibilityRules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
  </section>
);
