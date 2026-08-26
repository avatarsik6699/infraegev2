import type { PersistStorage } from "zustand/middleware";
import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";
import { createSafeLsPersistStorage } from "~/shared/lib/zustand-persistence";
import type { LessonProgressTypes } from "../lesson-progress.types";

type StoredLessonProgress = {
  solvedTaskIds: readonly string[];
  acceptedAnswers?: Readonly<Record<string, string>>;
};

export type PersistedLessonProgress = {
  lessons: Readonly<Record<string, LessonProgressTypes.Snapshot>>;
};

const registryKey = "infraege:lesson-progress";
const registryDefinition: SafeLsKey<{
  lessons: Readonly<Record<string, StoredLessonProgress>>;
}> = {
  key: registryKey,
  version: 1,
  guard: (
    value,
  ): value is {
    lessons: Readonly<Record<string, StoredLessonProgress>>;
  } =>
    typeof value === "object" &&
    value !== null &&
    "lessons" in value &&
    isStoredLessons(value.lessons),
};

const persistStorage: PersistStorage<PersistedLessonProgress> =
  createSafeLsPersistStorage(registryDefinition, {
    read: (stored) => ({
      lessons: Object.fromEntries(
        Object.entries(stored.lessons).map(([lessonId, progress]) => [
          lessonId,
          normalizeProgress(progress),
        ]),
      ),
    }),
    write: (state) => state,
  });

function legacyDefinition(lessonId: string): SafeLsKey<StoredLessonProgress> {
  return {
    key: `infraege:lesson:${lessonId}:progress`,
    version: 1,
    guard: isStoredProgress,
  };
}

function readLegacy(lessonId: string): LessonProgressTypes.Snapshot | null {
  const stored = safeLs.get(legacyDefinition(lessonId));
  return stored ? normalizeProgress(stored) : null;
}

function removeLegacy(lessonId: string): void {
  safeLs.remove(legacyDefinition(lessonId));
}

function subscribe(listener: () => void): () => void {
  return safeLs.subscribe(registryDefinition, listener);
}

function normalizeProgress(
  progress: StoredLessonProgress,
): LessonProgressTypes.Snapshot {
  const solvedTaskIds = [...new Set(progress.solvedTaskIds)];
  const solvedTaskIdSet = new Set(solvedTaskIds);
  const acceptedAnswers = Object.fromEntries(
    Object.entries(progress.acceptedAnswers ?? {}).filter(([taskId]) =>
      solvedTaskIdSet.has(taskId),
    ),
  );
  return { acceptedAnswers, solvedTaskIds };
}

function isStoredLessons(
  value: unknown,
): value is Readonly<Record<string, StoredLessonProgress>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(isStoredProgress)
  );
}

function isStoredProgress(value: unknown): value is StoredLessonProgress {
  return (
    typeof value === "object" &&
    value !== null &&
    "solvedTaskIds" in value &&
    Array.isArray(value.solvedTaskIds) &&
    value.solvedTaskIds.every((id) => typeof id === "string") &&
    (!("acceptedAnswers" in value) || isAcceptedAnswers(value.acceptedAnswers))
  );
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

export const lessonProgressStorage = {
  persistStorage,
  readLegacy,
  removeLegacy,
  subscribe,
};
