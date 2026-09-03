import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

const rhythmRoles = [
  {
    label: "Поток текста",
    token: "--rhythm-content-flow",
    value: "0.75rem · 12px",
  },
  {
    label: "Связанный учебный блок",
    token: "--rhythm-related-block",
    value: "1.5rem · 24px",
  },
  {
    label: "Разделение понятий",
    token: "--rhythm-concept-separation",
    value: "3rem / 2rem · 48px / 32px",
  },
  {
    label: "Новый крупный раздел",
    token: "--rhythm-section-separation",
    value: "4rem / 3rem · 64px / 48px",
  },
] as const;

export const RhythmSpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-rhythm"
    aria-labelledby="system-rhythm-heading"
  >
    <Typography.Title
      order={3}
      id="system-rhythm-heading"
      className={styles.patternHeading}
    >
      Вертикальный ритм
    </Typography.Title>
    <Typography.Text className={styles.paletteDescription}>
      Чем дальше друг от друга находятся мысли, тем больше расстояние между
      ними. Так близкие абзацы читаются как один поток, а новый раздел не
      слипается с предыдущим.
    </Typography.Text>

    <dl className={styles.rhythmLegend} aria-label="Роли вертикального ритма">
      {rhythmRoles.map((role) => (
        <div key={role.token}>
          <dt>{role.label}</dt>
          <dd>
            <code>{role.token}</code>
            <span>{role.value}</span>
          </dd>
        </div>
      ))}
    </dl>

    <article
      className={styles.rhythmSpecimen}
      data-rhythm-role="section"
      aria-label="Пример четырёх уровней вертикального ритма"
    >
      <section className={styles.rhythmMajorGroup}>
        <Typography.Title order={4} className={styles.rhythmMajorHeading}>
          Вводная часть
        </Typography.Title>
        <div className={styles.rhythmConcepts} data-rhythm-role="concept">
          <div className={styles.rhythmConcept}>
            <Typography.Title order={5} className={styles.rhythmConceptHeading}>
              Одна мысль
            </Typography.Title>
            <div className={styles.rhythmContent} data-rhythm-role="content">
              <Typography.Text>
                Первый абзац называет идею и даёт ученику точку опоры.
              </Typography.Text>
              <Typography.Text>
                Следующий абзац продолжает ту же мысль, поэтому остаётся рядом.
              </Typography.Text>
            </div>
            <div className={styles.rhythmRelated} data-rhythm-role="related">
              <Typography.Text>
                Связанный учебный блок получает достаточно воздуха, чтобы не
                сливаться с соседним абзацем.
              </Typography.Text>
              <Typography.Text tone="muted">
                Он остаётся частью той же мысли и не выглядит началом новой
                подтемы.
              </Typography.Text>
            </div>
          </div>
          <div className={styles.rhythmConcept}>
            <Typography.Title order={5} className={styles.rhythmConceptHeading}>
              Следующее понятие
            </Typography.Title>
            <Typography.Text>
              Новая идея отделена заметнее, но всё ещё принадлежит общей теме.
            </Typography.Text>
          </div>
        </div>
      </section>

      <section className={styles.rhythmMajorGroup}>
        <Typography.Title order={4} className={styles.rhythmMajorHeading}>
          Новый раздел
        </Typography.Title>
        <Typography.Text>
          Самый широкий интервал сообщает о смене крупной смысловой части ещё до
          чтения заголовка.
        </Typography.Text>
      </section>
    </article>
  </section>
);
