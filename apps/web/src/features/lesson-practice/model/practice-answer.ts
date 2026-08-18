import type { LessonTypes } from "~/entities/lesson";

export function isPracticeAnswerCorrect(
  task: LessonTypes.LocalPracticeTask,
  value: string,
): boolean {
  const answer = normalizePracticeAnswer(value);
  return task.answers.some(
    (acceptedAnswer) => normalizePracticeAnswer(acceptedAnswer) === answer,
  );
}

export function createLocalPracticeChecker(
  tasks: readonly LessonTypes.LocalPracticeTask[],
): LessonTypes.PracticeChecker {
  return (taskId, answer) => {
    const task = tasks.find((candidate) => candidate.id === taskId);
    if (!task) throw new Error(`Unknown local practice task: ${taskId}`);
    return Promise.resolve({
      correct: isPracticeAnswerCorrect(task, answer),
      explanation: task.explanation,
    });
  };
}

function normalizePracticeAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е")
    .replaceAll(/\s+/g, "");
}
