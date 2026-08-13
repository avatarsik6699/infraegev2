import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type KeyboardEvent,
} from "react";
import type { LessonTypes } from "~/entities/lesson";
import { useLessonProgress } from "~/features/lesson-progress";
import type { LessonPracticeTypes } from "../lesson-practice.types";
import { isPracticeAnswerCorrect } from "./practice-answer";

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

const subscribeToEnhancement = () => () => undefined;
const getClientEnhancement = () => true;
const getServerEnhancement = () => false;

export function useLessonPracticeModel(props: LessonPracticeTypes.Props) {
  const [practiceStates, setPracticeStates] =
    useState<LessonPracticeTypes.States>({});
  const [activeTaskId, setActiveTaskId] = useState(props.tasks[0]?.id ?? "");
  const enhanced = useSyncExternalStore(
    subscribeToEnhancement,
    getClientEnhancement,
    getServerEnhancement,
  );
  const headingRefs = useRef(new Map<string, HTMLHeadingElement>());
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
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

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    const nextIndex = getNextTaskIndex(
      event.key,
      currentIndex,
      props.tasks.length,
    );
    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextTask = props.tasks[nextIndex];
    if (!nextTask) return;
    selectTask(nextTask.id);
    tabRefs.current.get(nextTask.id)?.focus();
  };

  const checkAnswer = (
    task: LessonTypes.PracticeTask,
    event: Parameters<FormSubmitHandler>[0],
  ) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("answer");
    const correct = isPracticeAnswerCorrect(
      task,
      typeof value === "string" ? value : "",
    );
    setPracticeStates((current) => ({
      ...current,
      [task.id]: correct ? "correct" : "incorrect",
    }));
    if (correct) props.progressStore.markSolved(task.id);
  };

  const setHeadingRef = (
    taskId: string,
    element: HTMLHeadingElement | null,
  ) => {
    if (element) headingRefs.current.set(taskId, element);
    else headingRefs.current.delete(taskId);
  };

  const setTabRef = (taskId: string, element: HTMLButtonElement | null) => {
    if (element) tabRefs.current.set(taskId, element);
    else tabRefs.current.delete(taskId);
  };

  return {
    activeTaskId,
    checkAnswer,
    enhanced,
    handleTabKeyDown,
    isSolved: (taskId: string) => progress.solvedTaskIds.includes(taskId),
    selectTask,
    setHeadingRef,
    setTabRef,
    stateFor: (taskId: string) => practiceStates[taskId] ?? "idle",
  };
}

function getNextTaskIndex(
  key: string,
  currentIndex: number,
  taskCount: number,
): number | undefined {
  if (key === "ArrowLeft") return (currentIndex - 1 + taskCount) % taskCount;
  if (key === "ArrowRight") return (currentIndex + 1) % taskCount;
  if (key === "Home") return 0;
  if (key === "End") return taskCount - 1;
  return undefined;
}
