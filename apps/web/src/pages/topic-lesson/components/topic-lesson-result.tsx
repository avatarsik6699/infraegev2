import type { LessonContent } from "~/entities/lesson";
import { Typography } from "~/shared/components/typography";
import styles from "../topic-lesson-page.module.css";

type Props = {
  lesson: LessonContent.Definition;
};

export const TopicLessonResult: React.FC<Props> = (props) => (
  <div className={styles.resultGrid}>
    <div className={styles.resultSummary}>
      <Typography.Title order={3}>Что получилось</Typography.Title>
      <Typography.Prose>{props.lesson.result}</Typography.Prose>
    </div>

    <section className={styles.resultSkills} aria-labelledby="result-skills">
      <Typography.Title order={3} id="result-skills">
        Теперь вы умеете
      </Typography.Title>
      <ul>
        {props.lesson.learningOutcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>
    </section>
  </div>
);
