import {
  LessonPractice,
  type LessonPracticeTypes,
} from "~/features/lesson-practice";
import { useLessonProgress } from "~/features/lesson-progress";

type LessonPracticeFlowProps = Omit<
  LessonPracticeTypes.Props,
  "acceptedAnswers" | "onTaskSolved" | "solvedTaskIds"
> & {
  lessonId: string;
};

export const LessonPracticeFlow: React.FC<LessonPracticeFlowProps> = (
  props,
) => {
  const progress = useLessonProgress(props.lessonId, props.tasks);

  return (
    <LessonPractice
      {...props}
      outdatedTaskIds={progress.outdatedTaskIds}
      acceptedAnswers={progress.acceptedAnswers}
      onTaskSolved={(taskId, acceptedAnswer) =>
        progress.markSolved(
          taskId,
          acceptedAnswer,
          props.tasks.find((task) => task.id === taskId)?.solutionRevision,
        ).solvedTaskIds.length
      }
      solvedTaskIds={progress.solvedTaskIds}
    />
  );
};
