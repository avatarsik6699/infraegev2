import { createZustandScope } from "~/shared/lib/create-zustand-scope";
import type { LessonProgressRegistry } from "./lesson-progress-registry";

const lessonProgressScope =
  createZustandScope<ReturnType<LessonProgressRegistry["getState"]>>(
    "Lesson progress",
  );

export const LessonProgressStoreProvider = lessonProgressScope.Provider;

export function useLessonProgressRegistry<T>(
  selector: (state: ReturnType<LessonProgressRegistry["getState"]>) => T,
): T {
  return lessonProgressScope.useSelector(selector);
}
