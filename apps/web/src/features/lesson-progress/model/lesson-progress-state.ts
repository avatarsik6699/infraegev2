import type { LessonProgressTypes } from "../lesson-progress.types";

export const emptyLessonProgress: LessonProgressTypes.Snapshot = {
  solvedTaskIds: [],
  acceptedAnswers: {},
};

export function markTaskSolved(
  current: LessonProgressTypes.Snapshot,
  taskId: string,
  acceptedAnswer: string,
): LessonProgressTypes.Snapshot {
  const alreadySolved = current.solvedTaskIds.includes(taskId);
  if (alreadySolved && current.acceptedAnswers[taskId] === acceptedAnswer)
    return current;

  return {
    acceptedAnswers: { ...current.acceptedAnswers, [taskId]: acceptedAnswer },
    solvedTaskIds: alreadySolved
      ? current.solvedTaskIds
      : [...current.solvedTaskIds, taskId],
  };
}
