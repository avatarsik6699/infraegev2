import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

const rhythmRoles = [
  {
    label: "Поток текста",
    token: "--space-1-5",
    value: "0.75rem",
  },
  {
    label: "Разделение понятий",
    token: "--space-4",
    value: "2rem",
  },
  {
    label: "Новый крупный раздел",
    token: "--space-6",
    value: "4rem",
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
      aria-label="Пример трёх уровней вертикального ритма"
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
