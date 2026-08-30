import { useEffect, useRef } from "react";
import { reportProductEvent } from "./events";

type AnswerCheckedEvent = {
  result: "correct" | "incorrect";
  solvedCount: number;
};

export function useLessonTelemetry(lessonId: string, taskCount: number) {
  const practiceStartedRef = useRef(false);
  const completionReportedRef = useRef(false);

  useEffect(
    function reportLessonOpenedFx() {
      reportProductEvent({
        name: "lesson_opened",
        properties: { lesson: lessonId },
      });
    },
    [lessonId],
  );

  return function handleAnswerChecked(event: AnswerCheckedEvent): void {
    if (!practiceStartedRef.current) {
      practiceStartedRef.current = true;
      reportProductEvent({
        name: "practice_started",
        properties: { lesson: lessonId },
      });
    }
    reportProductEvent({
      name: "practice_answer_checked",
      properties: { lesson: lessonId, result: event.result },
    });
    if (!completionReportedRef.current && event.solvedCount >= taskCount) {
      completionReportedRef.current = true;
      reportProductEvent({
        name: "lesson_completed",
        properties: { lesson: lessonId },
      });
    }
  };
}
