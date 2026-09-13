import type { LessonProgressTypes } from "../lesson-progress.types";

export const emptyLessonProgress: LessonProgressTypes.Snapshot = {
  solvedTaskIds: [],
  acceptedAnswers: {},
};

export function markTaskSolved(
  current: LessonProgressTypes.Snapshot,
  taskId: string,
  acceptedAnswer: string,
  solutionRevision = 1,
): LessonProgressTypes.Snapshot {
  const alreadySolved = current.solvedTaskIds.includes(taskId);
  if (
    alreadySolved &&
    current.solvedRevisions?.[taskId]?.[String(solutionRevision)] ===
      acceptedAnswer
  )
    return current;

  return {
    solvedRevisions: {
      ...current.solvedRevisions,
      [taskId]: {
        ...current.solvedRevisions?.[taskId],
        [String(solutionRevision)]: acceptedAnswer,
      },
    },
    acceptedAnswers: { ...current.acceptedAnswers, [taskId]: acceptedAnswer },
    solvedTaskIds: alreadySolved
      ? current.solvedTaskIds
      : [...current.solvedTaskIds, taskId],
  };
}

export function currentLessonProgress(
  progress: LessonProgressTypes.Snapshot,
  tasks: readonly { id: string; solutionRevision?: number }[],
): LessonProgressTypes.Snapshot {
  const solved = tasks.filter(
    (task) =>
      progress.solvedRevisions?.[task.id]?.[
        String(task.solutionRevision ?? 1)
      ] !== undefined,
  );
  return {
    outdatedTaskIds: tasks
      .filter(
        (task) =>
          progress.solvedTaskIds.includes(task.id) &&
          !solved.some((item) => item.id === task.id),
      )
      .map((task) => task.id),
    solvedTaskIds: solved.map((task) => task.id),
    acceptedAnswers: Object.fromEntries(
      solved.map((task) => [
        task.id,
        progress.solvedRevisions?.[task.id]?.[
          String(task.solutionRevision ?? 1)
        ] ?? "",
      ]),
    ),
    solvedRevisions: progress.solvedRevisions,
  };
}
