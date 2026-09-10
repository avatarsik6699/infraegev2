import { ActionLink } from "~/shared/components/action-link";
import { Typography } from "~/shared/components/typography";
import { PublicHeader } from "~/widgets/public-header";
import styles from "../lesson-design-lab.module.css";

export const LessonHeader: React.FC = () => (
  <>
    <PublicHeader activeSection="topics" />
    <nav
      className={styles.subheader}
      data-lesson-subheader
      aria-label="Контекст урока"
    >
      <div className={styles.backLink}>
        <ActionLink to="/lab/design-system" hierarchy="quiet" icon="back">
          Дизайн-система
        </ActionLink>
      </div>
      <Typography.Text className={styles.lessonContext}>
        Алгоритмы поиска
      </Typography.Text>
    </nav>
  </>
);
