import { LessonSectionHeading } from "~/shared/components/learning-content";
import { CodeBlock } from "~/shared/components/code-block";
import { Typography } from "~/shared/components/typography";
import { lessonDesignLabConstants } from "../lesson-design-lab.constants";
import styles from "../lesson-design-lab.module.css";
import { BinarySearchProof } from "./binary-search-proof";

export const LessonTheory: React.FC = () => (
  <>
    <section
      className={`${styles.lessonSection} ${styles.firstLessonSection}`}
      id="theory"
      data-lesson-section="theory"
    >
      <LessonSectionHeading index={1}>Теория</LessonSectionHeading>
      <Typography.Title
        order={3}
        className={styles.subsectionHeading}
        id="range"
      >
        Середина превращает неизвестность в выбор
      </Typography.Title>
      <Typography.Text>
        Предположим, массив <code>a</code> отсортирован по возрастанию. Ищем
        значение <code>x</code> и рассматриваем текущий диапазон{" "}
        <code>[L, R]</code> включительно.
      </Typography.Text>
    </section>
    <BinarySearchProof />
    <section className={styles.theorySubsection} id="speed">
      <Typography.Title order={3} className={styles.subsectionHeading}>
        Почему это быстро
      </Typography.Title>
      <Typography.Text>
        На каждом шаге длина диапазона не превышает половины предыдущей. После{" "}
        <var>k</var> шагов остаётся не больше <code>n / 2ᵏ</code> элементов,
        поэтому достаточно порядка <code>log₂ n</code> сравнений.
      </Typography.Text>
      <CodeBlock
        className={styles.codeBlock}
        code={lessonDesignLabConstants.code}
        language="python"
        label="Пример двоичного поиска на Python"
      />
    </section>
  </>
);
