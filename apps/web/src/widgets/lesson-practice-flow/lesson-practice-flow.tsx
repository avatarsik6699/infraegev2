import {
  LessonPractice,
  type LessonPracticeTypes,
} from "~/features/lesson-practice";
import { useLessonProgress } from "~/features/lesson-progress";

type LessonPracticeFlowProps = Omit<
  LessonPracticeTypes.Props,
  "onTaskSolved" | "solvedTaskIds"
> & {
  lessonId: string;
  contextKind: "topic_lesson" | "course_lesson";
};

export const LessonPracticeFlow: React.FC<LessonPracticeFlowProps> = (
  props,
) => {
  const progress = useLessonProgress(props.lessonId, props.tasks);

  return (
    <LessonPractice
      {...props}
      outdatedTaskIds={progress.outdatedTaskIds}
      onTaskSolved={(taskId) =>
        progress.markSolved(
          taskId,
          props.tasks.find((task) => task.id === taskId)?.solutionRevision,
        ).solvedTaskIds.length
      }
      solvedTaskIds={progress.solvedTaskIds}
    />
  );
};
