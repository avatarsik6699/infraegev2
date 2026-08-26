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
  const progress = useLessonProgress(props.lessonId);

  return (
    <LessonPractice
      {...props}
      acceptedAnswers={progress.acceptedAnswers}
      onTaskSolved={(taskId, acceptedAnswer) =>
        progress.markSolved(taskId, acceptedAnswer).solvedTaskIds.length
      }
      solvedTaskIds={progress.solvedTaskIds}
    />
  );
};
