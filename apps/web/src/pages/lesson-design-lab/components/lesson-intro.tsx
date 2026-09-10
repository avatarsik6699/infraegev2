import { LessonIntro as SharedLessonIntro } from "~/shared/components/learning-content";
import { lessonDesignLabConstants } from "../lesson-design-lab.constants";
import styles from "../lesson-design-lab.module.css";

export const LessonIntro: React.FC = () => (
  <SharedLessonIntro
    className={styles.intro}
    presentation="study"
    accessTier="free"
    eyebrow="Демонстрационный урок"
    technology="Python"
    taskCount={lessonDesignLabConstants.practiceTasks.length}
    title="Почему двоичный поиск отбрасывает половину вариантов"
    summary="Двоичный поиск каждый шаг делит текущий диапазон на две части и гарантированно исключает одну из них из дальнейшего рассмотрения."
  />
);
