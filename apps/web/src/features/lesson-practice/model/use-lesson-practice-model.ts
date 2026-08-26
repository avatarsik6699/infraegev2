import { useState, type ComponentProps } from "react";
import type { PracticeTaskTypes } from "~/entities/practice-task";
import { useIsEnhanced } from "~/shared/lib/use-is-enhanced";
import type { LessonPracticeTypes } from "../lesson-practice.types";

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

export function useLessonPracticeModel(props: LessonPracticeTypes.Props) {
  const [practiceStates, setPracticeStates] =
    useState<LessonPracticeTypes.States>({});
  const [feedback, setFeedback] = useState<LessonPracticeTypes.Feedback>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [selectedTaskId, setSelectedTaskId] = useState(
    props.tasks[0]?.id ?? "",
  );
  const activeTaskId = props.tasks.some((task) => task.id === selectedTaskId)
    ? selectedTaskId
    : (props.tasks[0]?.id ?? "");
  const enhanced = useIsEnhanced();

  const checkAnswer = async (
    task: PracticeTaskTypes.Task,
    event: Parameters<FormSubmitHandler>[0],
  ) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("answer");
    const answer = typeof value === "string" ? value : "";
    setPracticeStates((current) => ({ ...current, [task.id]: "checking" }));
    try {
      const result = await props.checkAnswer(task.id, answer);
      setFeedback((current) => ({ ...current, [task.id]: result.explanation }));
      setPracticeStates((current) => ({
        ...current,
        [task.id]: result.correct ? "correct" : "incorrect",
      }));
      const solvedCount = result.correct
        ? props.onTaskSolved(task.id, answer)
        : props.solvedTaskIds.length;
      props.onAnswerChecked?.({
        result: result.correct ? "correct" : "incorrect",
        solvedCount,
      });
    } catch {
      setPracticeStates((current) => ({ ...current, [task.id]: "error" }));
    }
  };

  return {
    activeTaskId,
    answerFor: (taskId: string) =>
      draftAnswers[taskId] ?? props.acceptedAnswers[taskId] ?? "",
    checkAnswer,
    enhanced,
    feedbackFor: (taskId: string) => feedback[taskId] ?? "",
    isSolved: (taskId: string) => props.solvedTaskIds.includes(taskId),
    selectTask: setSelectedTaskId,
    stateFor: (taskId: string) => practiceStates[taskId] ?? "idle",
    updateAnswer: (taskId: string, value: string) =>
      setDraftAnswers((current) => ({ ...current, [taskId]: value })),
  };
}
