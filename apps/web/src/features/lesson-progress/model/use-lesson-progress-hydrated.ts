import { useLessonProgressRegistry } from "./lesson-progress-context";

export function useLessonProgressHydrated(): boolean {
  return useLessonProgressRegistry((state) => state.hydrated);
}
