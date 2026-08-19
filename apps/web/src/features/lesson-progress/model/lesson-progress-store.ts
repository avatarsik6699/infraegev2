import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";
import type { LessonProgressTypes } from "../lesson-progress.types";

type StoredProgress = {
  solvedTaskIds: readonly string[];
  acceptedAnswers?: Readonly<Record<string, string>>;
};

const emptyProgress: LessonProgressTypes.Snapshot = {
  solvedTaskIds: [],
  acceptedAnswers: {},
};
const stores = new Map<string, LessonProgressTypes.Store>();

export function createLessonProgressStore(
  options: LessonProgressTypes.StoreOptions,
): LessonProgressTypes.Store {
  const existingStore = stores.get(options.lessonId);
  if (existingStore) return existingStore;
  const progressKey: SafeLsKey<StoredProgress> = {
    key: `infraege:lesson:${options.lessonId}:progress`,
    version: 1,
    guard: (value): value is StoredProgress =>
      typeof value === "object" &&
      value !== null &&
      "solvedTaskIds" in value &&
      Array.isArray(value.solvedTaskIds) &&
      value.solvedTaskIds.every((id) => typeof id === "string") &&
      (!("acceptedAnswers" in value) ||
        isAcceptedAnswers(value.acceptedAnswers)),
  };
  const listeners = new Set<() => void>();
  let currentSnapshot = emptyProgress;
  let initialized = false;

  function readStoredProgress(): LessonProgressTypes.Snapshot {
    const stored = safeLs.get(progressKey);
    if (!stored) return emptyProgress;
    const solvedTaskIds = [...new Set(stored.solvedTaskIds)];
    const solvedTaskIdSet = new Set(solvedTaskIds);
    const acceptedAnswers = Object.fromEntries(
      Object.entries(stored.acceptedAnswers ?? {}).filter(([taskId]) =>
        solvedTaskIdSet.has(taskId),
      ),
    );
    return { acceptedAnswers, solvedTaskIds };
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

  function markSolved(taskId: string, acceptedAnswer: string): void {
    const current = getSnapshot();
    const alreadySolved = current.solvedTaskIds.includes(taskId);
    if (alreadySolved && current.acceptedAnswers[taskId] === acceptedAnswer) {
      return;
    }
    currentSnapshot = {
      acceptedAnswers: {
        ...current.acceptedAnswers,
        [taskId]: acceptedAnswer,
      },
      solvedTaskIds: alreadySolved
        ? current.solvedTaskIds
        : [...current.solvedTaskIds, taskId],
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

function isAcceptedAnswers(
  value: unknown,
): value is Readonly<Record<string, string>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((answer) => typeof answer === "string")
  );
}
