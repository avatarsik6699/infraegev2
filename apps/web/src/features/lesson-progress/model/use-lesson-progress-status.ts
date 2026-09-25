import { useLessonProgressRegistry } from "./lesson-progress-context";

export function useLessonProgressStatus():
  "guest" | "loading" | "ready" | "error" {
  return useLessonProgressRegistry((state) => state.status);
}
