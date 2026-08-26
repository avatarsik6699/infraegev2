import { LessonSectionHeading } from "~/shared/components/learning-content";
import { createLocalPracticeChecker } from "~/features/lesson-practice";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { Typography } from "~/shared/components/typography";
import { lessonDesignLabConstants } from "../lesson-design-lab.constants";
import styles from "../lesson-design-lab.module.css";

export const LessonPracticeSection: React.FC = () => (
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
    <LessonPracticeFlow
      checkAnswer={createLocalPracticeChecker(
        lessonDesignLabConstants.practiceTasks,
      )}
      lessonId={lessonDesignLabConstants.lessonId}
      tasks={lessonDesignLabConstants.practiceTasks}
    />
  </section>
);
