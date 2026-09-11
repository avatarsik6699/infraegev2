import { useState } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { Button } from "~/shared/components/button";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { LessonSectionHeading } from "~/shared/components/learning-content";
import { createLocalPracticeChecker } from "~/features/lesson-practice";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { Typography } from "~/shared/components/typography";
import { lessonDesignLabConstants } from "../lesson-design-lab.constants";
import styles from "../lesson-design-lab.module.css";

const localChecker = createLocalPracticeChecker(
  lessonDesignLabConstants.practiceTasks,
);

export const LessonPracticeSection: React.FC = () => {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const enhanced = useIsEnhanced();
  const checkAnswer: PracticeTaskTypes.Checker = (taskId, answer) => {
    if (simulateFailure)
      return Promise.reject(new Error("Lab checker unavailable"));
    return localChecker(taskId, answer);
  };
  return (
    <section
      className={styles.lessonSection}
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
        Решите пять коротких задач по порядку. Правильный ответ с подсказкой
        тоже учитывается: важно понять правило и применить его без ошибки.
      </Typography.Text>
      {enhanced ? (
        <div className={styles.labControls}>
          <Typography.Text tone="muted">Состояния стенда</Typography.Text>
          <Button
            hierarchy="quiet"
            aria-pressed={simulateFailure}
            onClick={() => setSimulateFailure((current) => !current)}
          >
            {simulateFailure ? "Восстановить проверку" : "Смоделировать сбой"}
          </Button>
        </div>
      ) : null}
      <LessonPracticeFlow
        checkAnswer={checkAnswer}
        lessonId={lessonDesignLabConstants.lessonId}
        tasks={lessonDesignLabConstants.practiceTasks}
      />
    </section>
  );
};
