import { useSyncExternalStore } from "react";
import type { LessonProgressTypes } from "../lesson-progress.types";

export function useLessonProgress(
  store: LessonProgressTypes.Store,
): LessonProgressTypes.Snapshot {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
