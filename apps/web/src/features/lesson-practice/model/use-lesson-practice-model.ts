import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
} from "react";
import type { LessonTypes } from "~/entities/lesson";
import { useLessonProgress } from "~/features/lesson-progress";
import { enhancementState } from "~/shared/lib/enhancement-state";
import type { LessonPracticeTypes } from "../lesson-practice.types";

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

export function useLessonPracticeModel(props: LessonPracticeTypes.Props) {
  const [practiceStates, setPracticeStates] =
    useState<LessonPracticeTypes.States>({});
  const [feedback, setFeedback] = useState<LessonPracticeTypes.Feedback>({});
  const [activeTaskId, setActiveTaskId] = useState(props.tasks[0]?.id ?? "");
  const enhanced = useSyncExternalStore(
    enhancementState.subscribe,
    enhancementState.getClientSnapshot,
    enhancementState.getServerSnapshot,
  );
  const headingRefs = useRef(new Map<string, HTMLHeadingElement>());
  const focusSelectedHeading = useRef(false);
  const progress = useLessonProgress(props.progressStore);

  useEffect(
    function focusSelectedTaskFx() {
      if (!focusSelectedHeading.current) return;
      focusSelectedHeading.current = false;
      headingRefs.current.get(activeTaskId)?.focus();
    },
    [activeTaskId],
  );

  const selectTask = (taskId: string, moveFocus = false) => {
    focusSelectedHeading.current = moveFocus;
    setActiveTaskId(taskId);
  };

  const checkAnswer = async (
    task: LessonTypes.PracticeTask,
    event: Parameters<FormSubmitHandler>[0],
  ) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("answer");
    setPracticeStates((current) => ({ ...current, [task.id]: "checking" }));
    try {
      const result = await props.checkAnswer(
        task.id,
        typeof value === "string" ? value : "",
      );
      setFeedback((current) => ({ ...current, [task.id]: result.explanation }));
      setPracticeStates((current) => ({
        ...current,
        [task.id]: result.correct ? "correct" : "incorrect",
      }));
      if (result.correct) props.progressStore.markSolved(task.id);
    } catch {
      setPracticeStates((current) => ({ ...current, [task.id]: "error" }));
    }
  };

  const setHeadingRef = (
    taskId: string,
    element: HTMLHeadingElement | null,
  ) => {
    if (element) headingRefs.current.set(taskId, element);
    else headingRefs.current.delete(taskId);
  };

  return {
    activeTaskId,
    checkAnswer,
    enhanced,
    feedbackFor: (taskId: string) => feedback[taskId] ?? "",
    isSolved: (taskId: string) => progress.solvedTaskIds.includes(taskId),
    selectTask,
    setHeadingRef,
    stateFor: (taskId: string) => practiceStates[taskId] ?? "idle",
  };
}
