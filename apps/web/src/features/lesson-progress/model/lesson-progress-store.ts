import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";
import type { LessonProgressTypes } from "../lesson-progress.types";

const emptyProgress: LessonProgressTypes.Snapshot = { solvedTaskIds: [] };
const stores = new Map<string, LessonProgressTypes.Store>();

export function createLessonProgressStore(
  options: LessonProgressTypes.StoreOptions,
): LessonProgressTypes.Store {
  const existingStore = stores.get(options.lessonId);
  if (existingStore) return existingStore;
  const progressKey: SafeLsKey<LessonProgressTypes.Snapshot> = {
    key: `infraege:lesson:${options.lessonId}:progress`,
    version: 1,
    guard: (value): value is LessonProgressTypes.Snapshot =>
      typeof value === "object" &&
      value !== null &&
      "solvedTaskIds" in value &&
      Array.isArray(value.solvedTaskIds) &&
      value.solvedTaskIds.every((id) => typeof id === "string"),
  };
  const listeners = new Set<() => void>();
  let currentSnapshot = emptyProgress;
  let initialized = false;

  function readStoredProgress(): LessonProgressTypes.Snapshot {
    const stored = safeLs.get(progressKey);
    if (!stored) return emptyProgress;
    return { solvedTaskIds: [...new Set(stored.solvedTaskIds)] };
  }

  function getSnapshot(): LessonProgressTypes.Snapshot {
    if (!initialized) {
      currentSnapshot = readStoredProgress();
      initialized = true;
    }
    return currentSnapshot;
  }

  function getServerSnapshot(): LessonProgressTypes.Snapshot {
    return emptyProgress;
  }

  function emit(): void {
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    const unsubscribeStorage = safeLs.subscribe(progressKey, () => {
      currentSnapshot = readStoredProgress();
      initialized = true;
      emit();
    });
    return () => {
      listeners.delete(listener);
      unsubscribeStorage();
    };
  }

  function markSolved(taskId: string): void {
    const current = getSnapshot();
    if (current.solvedTaskIds.includes(taskId)) return;
    currentSnapshot = {
      solvedTaskIds: [...current.solvedTaskIds, taskId],
    };
    safeLs.set(progressKey, currentSnapshot);
    emit();
  }

  function clear(): void {
    currentSnapshot = emptyProgress;
    initialized = true;
    safeLs.remove(progressKey);
    emit();
  }

  const store = {
    clear,
    getServerSnapshot,
    getSnapshot,
    markSolved,
    subscribe,
  };
  stores.set(options.lessonId, store);
  return store;
}
