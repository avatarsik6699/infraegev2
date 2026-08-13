import type { LessonTypes } from "~/entities/lesson";

export function isPracticeAnswerCorrect(
  task: LessonTypes.PracticeTask,
  value: string,
): boolean {
  const answer = normalizePracticeAnswer(value);
  return task.answers.some(
    (acceptedAnswer) => normalizePracticeAnswer(acceptedAnswer) === answer,
  );
}

function normalizePracticeAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е")
    .replaceAll(/\s+/g, "");
}
