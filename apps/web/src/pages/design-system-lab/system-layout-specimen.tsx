import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

const layoutRules = [
  ["Читаемая мера", "Основной текст не растягивается шире 68 знаков."],
  [
    "Гибкие поля",
    "Внешние отступы растут плавно, а не скачком между устройствами.",
  ],
  [
    "Один поток",
    "На узком экране обязательный контент выстраивается последовательно.",
  ],
  ["Без потерь", "Zoom до 150% и reflow не скрывают содержание и действия."],
] as const;

export const SystemLayoutSpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-layout"
    aria-labelledby="system-layout-heading"
  >
    <Typography.Title
      order={3}
      id="system-layout-heading"
      className={styles.patternHeading}
    >
      Layout и адаптивность
    </Typography.Title>
    <Typography.Text className={styles.paletteDescription}>
      Система задаёт ограничения контента, а не фиксирует страницу под одно
      устройство. Ширина чтения, внешние поля и порядок блоков сохраняют
      иерархию при сужении.
    </Typography.Text>
    <div className={styles.layoutFoundationGrid}>
      <figure
        className={styles.layoutFoundationSpecimen}
        data-layout-specimen="wide"
      >
        <figcaption>
          <span>Широкий экран</span>
          <code>--measure-reading · --max-content-width</code>
        </figcaption>
        <div className={styles.layoutWideViewport} aria-hidden="true">
          <span className={styles.layoutGutter}>поле</span>
          <span className={styles.layoutReadingColumn}>читаемый поток</span>
          <span className={styles.layoutGutter}>поле</span>
        </div>
      </figure>
      <figure
        className={styles.layoutFoundationSpecimen}
        data-layout-specimen="narrow"
      >
        <figcaption>
          <span>Узкий экран</span>
          <code>linear reflow</code>
        </figcaption>
        <div className={styles.layoutNarrowViewport} aria-hidden="true">
          <span>контекст</span>
          <span>основной материал</span>
          <span>следующее действие</span>
        </div>
      </figure>
    </div>
    <dl className={styles.layoutRuleList}>
      {layoutRules.map(([name, description]) => (
        <div key={name}>
          <dt>{name}</dt>
          <dd>{description}</dd>
        </div>
      ))}
    </dl>
  </section>
);
