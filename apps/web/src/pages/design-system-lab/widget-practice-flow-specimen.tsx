import { useState } from "react";
import { ApiError } from "~/shared/api";
import { createLocalPracticeChecker } from "~/features/lesson-practice";
import { useLessonProgress } from "~/features/lesson-progress";
import { Button } from "~/shared/components/button";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { LessonPracticeFlow } from "~/widgets/lesson-practice-flow";
import { practiceTasks } from "./design-system-lab.constants";
import styles from "./design-system-lab.module.css";

const specimenLessonId = "design-system-widget-practice";

export const WidgetPracticeFlowSpecimen: React.FC = () => {
  const [instanceKey, setInstanceKey] = useState(0);
  const [stale, setStale] = useState(false);
  const enhanced = useIsEnhanced();
  const progress = useLessonProgress(specimenLessonId);

  return (
    <div className={styles.widgetFlowSpecimen} data-widget-flow-specimen>
      <div className={styles.widgetFlowStatus}>
        <Typography.Text component="span" aria-live="polite">
          <span data-widget-flow-progress>
            {`Решено ${String(progress.solvedTaskIds.length)} из ${String(practiceTasks.length)}`}
          </span>
        </Typography.Text>
        {enhanced ? (
          <Button
            density="compact"
            hierarchy="secondary"
            type="button"
            onClick={() => {
              progress.clear();
              setInstanceKey((current) => current + 1);
            }}
          >
            Сбросить пример
          </Button>
        ) : null}
      </div>
      <Typography.Text id="widget-base-case">
        Базовый случай останавливает цепочку рекурсивных вызовов.
      </Typography.Text>
      <Button hierarchy="secondary" onClick={() => setStale(true)}>
        Показать устаревшую задачу при проверке
      </Button>
      <LessonPracticeFlow
        checkAnswer={async (taskId, answer) => {
          if (stale)
            throw new ApiError("http", "Stale specimen", { status: 409 });
          return createLocalPracticeChecker(practiceTasks)(taskId, answer, 1);
        }}
        onRefresh={() => {
          setStale(false);
          return Promise.resolve();
        }}
        key={instanceKey}
        lessonId={specimenLessonId}
        tasks={practiceTasks}
      />
    </div>
  );
};
