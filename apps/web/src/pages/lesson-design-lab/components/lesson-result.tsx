import { LessonSectionHeading } from "~/entities/lesson";
import { Typography } from "~/shared/components/typography";
import styles from "../lesson-design-lab.module.css";

type LessonResultProps = {
  solvedCount: number;
  total: number;
  mastered: boolean;
};

export const LessonResult: React.FC<LessonResultProps> = (props) => (
  <section
    className={styles.lessonSection}
    id="result"
    data-lesson-section="result"
  >
    <LessonSectionHeading index={4}>Результат</LessonSectionHeading>
    <Typography.Title
      order={3}
      className={styles.subsectionHeading}
      id="outcome"
    >
      Что получилось
    </Typography.Title>
    <Typography.Text data-lesson-outcome>
      {props.mastered
        ? `Тема освоена: решено ${String(props.solvedCount)} из ${String(props.total)} задач. Теперь вы можете объяснить шаги алгоритма и безопасно обновлять обе границы диапазона.`
        : `Решено ${String(props.solvedCount)} из ${String(props.total)} задач. Вернитесь к практике: для освоения темы нужно правильно решить не менее четырёх задач.`}
    </Typography.Text>
    <Typography.Title
      order={3}
      className={styles.subsectionHeading}
      id="next-step"
    >
      Следующий шаг
    </Typography.Title>
    <Typography.Text>
      Следующий шаг: вручную проследить поиск отсутствующего элемента и увидеть,
      как диапазон становится пустым.
    </Typography.Text>
  </section>
);
