import { useRef } from "react";
import { LessonProgress, useLessonProgress } from "~/features/lesson-progress";
import { ConfirmationDialog } from "~/shared/components/confirmation-dialog";
import { Typography } from "~/shared/components/typography";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import { PublicFooter } from "~/widgets/public-footer";
import { ReadingPositionIndicator } from "~/features/reading-position";
import { LessonOutline } from "~/widgets/lesson-outline";
import { LessonExamFocus } from "./components/lesson-exam-focus";
import { LessonHeader } from "./components/lesson-header";
import { LessonIntro } from "./components/lesson-intro";
import { LessonPracticeSection } from "./components/lesson-practice-section";
import { LessonResult } from "./components/lesson-result";
import { LessonTheory } from "./components/lesson-theory";
import { lessonDesignLabConstants } from "./lesson-design-lab.constants";
import styles from "./lesson-design-lab.module.css";

export const LessonDesignLab: React.FC = () => {
  const enhanced = useIsEnhanced();
  const articleRef = useRef<HTMLElement>(null);
  const progress = useLessonProgress(lessonDesignLabConstants.lessonId);
  const solvedCount = progress.solvedTaskIds.filter((id) =>
    lessonDesignLabConstants.practiceTasks.some((task) => task.id === id),
  ).length;
  const mastered =
    solvedCount >=
    lessonDesignLabConstants.practiceTasks.length *
      lessonDesignLabConstants.masteryThreshold;

  return (
    <div className={styles.page} data-study-lesson>
      <ReadingPositionIndicator targetRef={articleRef} />
      <LessonHeader />
      <main className={styles.lesson} data-lesson-frame>
        <LessonIntro />
        <aside className={styles.outlineRail} data-outline-rail>
          <div className={styles.railContents}>
            <LessonOutline
              presentation="study"
              groups={lessonDesignLabConstants.outline}
            />
            <div className={styles.railProgress} data-study-progress>
              {enhanced ? (
                <>
                  <LessonProgress
                    hideEmptyStatus
                    solved={solvedCount}
                    total={lessonDesignLabConstants.practiceTasks.length}
                    masteryThreshold={lessonDesignLabConstants.masteryThreshold}
                  />
                  <ConfirmationDialog
                    triggerLabel="Сбросить прогресс"
                    triggerAriaLabel="Сбросить прогресс урока"
                    title="Сбросить прогресс?"
                    description="Будут удалены решённые задачи и принятые ответы только этого урока."
                    confirmLabel="Сбросить"
                    onConfirm={progress.clear}
                  />
                </>
              ) : (
                <Typography.Text tone="muted">
                  Прогресс хранится только в этом браузере и появится после
                  загрузки страницы.
                </Typography.Text>
              )}
            </div>
          </div>
        </aside>
        <article className={styles.article} data-article-frame ref={articleRef}>
          <LessonTheory />
          <LessonPracticeSection />
          <LessonExamFocus />
          <LessonResult
            mastered={mastered}
            solvedCount={solvedCount}
            total={lessonDesignLabConstants.practiceTasks.length}
          />
        </article>
        <aside className={styles.marginRail} aria-hidden="true" />
      </main>
      <div className={styles.footer} data-lesson-footer>
        <PublicFooter />
      </div>
    </div>
  );
};
