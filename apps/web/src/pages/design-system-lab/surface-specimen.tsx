import { Typography } from "~/shared/components/typography";
import styles from "./design-system-lab.module.css";

export const SurfaceSpecimen: React.FC = () => (
  <section
    className={styles.section}
    id="system-surfaces"
    aria-labelledby="system-surfaces-heading"
  >
    <Typography.Title
      order={3}
      id="system-surfaces-heading"
      className={styles.patternHeading}
    >
      Поверхности и границы
    </Typography.Title>
    <Typography.Text className={styles.paletteDescription}>
      Сначала разделяйте смысл расстоянием. Добавляйте поверхность или линию
      только тогда, когда без неё граница между областями остаётся неясной.
    </Typography.Text>

    <div className={styles.surfaceRoles}>
      <div className={styles.surfaceRole}>
        <div className={styles.surfaceRoleMeta}>
          <Typography.Title order={4} className={styles.surfaceRoleHeading}>
            Основной поток
          </Typography.Title>
          <code className={styles.surfaceRoleToken}>
            --lab-surface-base · без контейнера
          </code>
          <Typography.Text>
            Обычный учебный текст группируется ритмом, а не рамкой.
          </Typography.Text>
        </div>
        <div
          className={`${styles.surfacePreview} ${styles.surfaceBase}`}
          data-surface-role="base"
        >
          <Typography.Text>
            Новая мысль начинается с понятного утверждения.
          </Typography.Text>
          <Typography.Text>
            Пояснение остаётся в том же открытом потоке чтения.
          </Typography.Text>
        </div>
      </div>

      <div className={styles.surfaceRole}>
        <div className={styles.surfaceRoleMeta}>
          <Typography.Title order={4} className={styles.surfaceRoleHeading}>
            Тихая поверхность
          </Typography.Title>
          <code className={styles.surfaceRoleToken}>--lab-surface-quiet</code>
          <Typography.Text>
            Один нейтральный fill объединяет вспомогательный контент.
          </Typography.Text>
        </div>
        <div
          className={`${styles.surfacePreview} ${styles.surfaceQuiet}`}
          data-surface-role="quiet"
        >
          <Typography.Title order={5} className={styles.surfacePreviewHeading}>
            Контекст
          </Typography.Title>
          <Typography.Text>
            Этот фрагмент помогает чтению, но не становится самостоятельной
            карточкой.
          </Typography.Text>
        </div>
      </div>

      <div className={styles.surfaceRole}>
        <div className={styles.surfaceRoleMeta}>
          <Typography.Title order={4} className={styles.surfaceRoleHeading}>
            Ограниченная область
          </Typography.Title>
          <code className={styles.surfaceRoleToken}>--lab-rule · 1px</code>
          <Typography.Text>
            Одна рамка обозначает собственную область виджета или управления.
          </Typography.Text>
        </div>
        <div
          className={`${styles.surfacePreview} ${styles.surfaceBounded}`}
          data-surface-role="bounded"
        >
          <Typography.Title order={5} className={styles.surfacePreviewHeading}>
            Самостоятельный виджет
          </Typography.Title>
          <Typography.Text>
            Рамка показывает полный периметр. Дополнительный fill или тень не
            нужны.
          </Typography.Text>
        </div>
      </div>

      <div className={styles.surfaceRole}>
        <div className={styles.surfaceRoleMeta}>
          <Typography.Title order={4} className={styles.surfaceRoleHeading}>
            Разделитель
          </Typography.Title>
          <code className={styles.surfaceRoleToken}>--lab-rule · 1px</code>
          <Typography.Text>
            Одна линия отделяет соседние равноправные группы.
          </Typography.Text>
        </div>
        <div className={styles.surfaceSeparator} data-surface-role="separator">
          <div>
            <Typography.Title
              order={5}
              className={styles.surfacePreviewHeading}
            >
              Первая группа
            </Typography.Title>
            <Typography.Text>Завершённая часть одного списка.</Typography.Text>
          </div>
          <div data-surface-separator-line>
            <Typography.Title
              order={5}
              className={styles.surfacePreviewHeading}
            >
              Следующая группа
            </Typography.Title>
            <Typography.Text>
              Новая группа без внешнего контейнера.
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  </section>
);
