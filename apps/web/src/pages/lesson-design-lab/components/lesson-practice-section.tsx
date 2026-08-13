import { LessonSectionHeading } from "~/entities/lesson";
import { LessonPractice } from "~/features/lesson-practice";
import type { LessonProgressTypes } from "~/features/lesson-progress";
import { Typography } from "~/shared/components/typography";
import { lessonDesignLabConstants } from "../lesson-design-lab.constants";
import styles from "../lesson-design-lab.module.css";

type LessonPracticeSectionProps = {
  progressStore: LessonProgressTypes.Store;
};

export const LessonPracticeSection: React.FC<LessonPracticeSectionProps> = (
  props,
) => (
  <section
    className={`${styles.lessonSection} ${styles.practiceSection}`}
    id="practice"
    data-lesson-section="practice"
  >
    <LessonSectionHeading index={2}>Практика</LessonSectionHeading>
    <Typography.Title
      order={3}
      className={styles.subsectionHeading}
      id="try-it"
    >
      Попробуйте сами
    </Typography.Title>
    <Typography.Text>
      Решите пять коротких задач по порядку. Правильный ответ с подсказкой тоже
      учитывается: важно понять правило и применить его без ошибки.
    </Typography.Text>
    <LessonPractice
      progressStore={props.progressStore}
      tasks={lessonDesignLabConstants.practiceTasks}
    />
  </section>
);
