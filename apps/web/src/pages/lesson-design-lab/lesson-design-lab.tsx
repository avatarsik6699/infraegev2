import { useRef } from "react";
import {
  createLessonProgressStore,
  LessonProgress,
  useLessonProgress,
} from "~/features/lesson-progress";
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

const progressStore = createLessonProgressStore({
  lessonId: lessonDesignLabConstants.lessonId,
});

export const LessonDesignLab: React.FC = () => {
  const articleRef = useRef<HTMLElement>(null);
  const progress = useLessonProgress(progressStore);
  const solvedCount = progress.solvedTaskIds.filter((id) =>
    lessonDesignLabConstants.practiceTasks.some((task) => task.id === id),
  ).length;
  const mastered =
    solvedCount >=
    lessonDesignLabConstants.practiceTasks.length *
      lessonDesignLabConstants.masteryThreshold;

  return (
    <div className={styles.page}>
      <ReadingPositionIndicator targetRef={articleRef} />
      <LessonHeader />
      <main className={styles.lesson} data-lesson-frame>
        <aside className={styles.outlineRail} data-outline-rail>
          <div className={styles.railContents}>
            <LessonOutline
              groups={lessonDesignLabConstants.outline}
              className={styles.outline}
            />
            <LessonProgress
              solved={solvedCount}
              total={lessonDesignLabConstants.practiceTasks.length}
              masteryThreshold={lessonDesignLabConstants.masteryThreshold}
            />
          </div>
        </aside>
        <article className={styles.article} data-article-frame ref={articleRef}>
          <LessonIntro />
          <LessonTheory />
          <LessonPracticeSection progressStore={progressStore} />
          <LessonExamFocus />
          <LessonResult
            mastered={mastered}
            solvedCount={solvedCount}
            total={lessonDesignLabConstants.practiceTasks.length}
          />
        </article>
      </main>
    </div>
  );
};
