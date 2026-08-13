import { LessonSectionHeading } from "~/entities/lesson";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-design-lab.module.css";

export const LessonExamFocus: React.FC = () => (
  <section
    className={styles.lessonSection}
    id="exam-focus"
    data-lesson-section="exam-focus"
  >
    <LessonSectionHeading index={3}>Что важно для ЕГЭ</LessonSectionHeading>
    <Typography.Title
      order={3}
      className={styles.subsectionHeading}
      id="mistakes"
    >
      Типичная ошибка с границами
    </Typography.Title>
    <Typography.Text>
      Двоичный поиск работает только на отсортированных данных. Частая ошибка —
      обновить границу как <code>L = M</code> или <code>R = M</code> и оставить
      середину в диапазоне: цикл может перестать сужаться.
    </Typography.Text>
  </section>
);
