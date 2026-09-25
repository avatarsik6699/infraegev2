import { ApiError } from "~/shared/api";
import { useState, useRef, type ComponentProps } from "react";
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
  const pending = useRef(new Set<string>());
  const enhanced = useIsEnhanced();

  const checkAnswer = async (
    task: PracticeTaskTypes.Task,
    event: Parameters<FormSubmitHandler>[0],
  ) => {
    event.preventDefault();
    if (pending.current.has(task.id) || props.solvedTaskIds.includes(task.id))
      return;
    pending.current.add(task.id);
    const value = new FormData(event.currentTarget).get("answer");
    const answer = typeof value === "string" ? value : "";
    setPracticeStates((current) => ({ ...current, [task.id]: "checking" }));
    try {
      const result = await props.checkAnswer(
        task.id,
        answer,
        task.solutionRevision,
      );
      setFeedback((current) => ({ ...current, [task.id]: result.explanation }));
      setPracticeStates((current) => ({
        ...current,
        [task.id]: result.correct ? "correct" : "incorrect",
      }));
      if (result.correct && result.saved === true) props.onTaskSolved(task.id);
    } catch (error) {
      let state: LessonPracticeTypes.State = "error";
      if (error instanceof ApiError && error.status === 409) state = "stale";
      if (error instanceof ApiError && error.status === 404)
        state = "unavailable";
      setPracticeStates((current) => ({ ...current, [task.id]: state }));
    } finally {
      pending.current.delete(task.id);
    }
  };

  return {
    activeTaskId,
    refresh: async () => {
      try {
        await props.onRefresh?.();
        setPracticeStates({});
        setFeedback({});
      } catch {
        setPracticeStates((current) => ({
          ...current,
          [activeTaskId]: "error",
        }));
      }
    },
    answerFor: (taskId: string) => draftAnswers[taskId] ?? "",
    checkAnswer,
    enhanced,
    feedbackFor: (taskId: string) => feedback[taskId] ?? "",
    isSolved: (taskId: string) => props.solvedTaskIds.includes(taskId),
    selectTask: setSelectedTaskId,
    stateFor: (taskId: string) => practiceStates[taskId] ?? "idle",
    updateAnswer: (taskId: string, value: string) => {
      setDraftAnswers((current) => ({ ...current, [taskId]: value }));
    },
  };
}
