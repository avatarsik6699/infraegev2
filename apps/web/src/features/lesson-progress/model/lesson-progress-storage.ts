import firstImport from "./first-import.json";
import type { PersistStorage } from "zustand/middleware";
import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";
import { createSafeLsPersistStorage } from "~/shared/lib/zustand-persistence";
import type { LessonProgressTypes } from "../lesson-progress.types";

type StoredLessonProgress = {
  solvedRevisions?: Readonly<
    Record<string, Readonly<Record<string, string | true>>>
  >;
  solvedTaskIds: readonly string[];
};

export type PersistedLessonProgress = {
  lessons: Readonly<Record<string, LessonProgressTypes.Snapshot>>;
};

const registryKey = "infraege:lesson-progress:v2";
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

const transform = {
  read: (stored: {
    lessons: Readonly<Record<string, StoredLessonProgress>>;
  }): PersistedLessonProgress => ({
    lessons: Object.fromEntries(
      Object.entries(stored.lessons).map(([lessonId, progress]) => [
        lessonId,
        normalizeProgress(progress, lessonId),
      ]),
    ),
  }),
  write: (state: PersistedLessonProgress) => state,
};
const currentStorage = createSafeLsPersistStorage(
  registryDefinition,
  transform,
);
const oldRegistryDefinition = {
  ...registryDefinition,
  key: "infraege:lesson-progress",
};
const persistStorage: PersistStorage<PersistedLessonProgress> = {
  ...currentStorage,
  getItem: () => {
    const current = safeLs.get(registryDefinition);
    if (current) return { state: transform.read(current) };
    const legacy = safeLs.get(oldRegistryDefinition);
    if (!legacy) return null;
    const migrated = transform.read(legacy);
    safeLs.set(registryDefinition, migrated);
    return { state: migrated };
  },
};

function legacyDefinition(lessonId: string): SafeLsKey<StoredLessonProgress> {
  return {
    key: `infraege:lesson:${lessonId}:progress`,
    version: 1,
    guard: isStoredProgress,
  };
}

function readLegacy(lessonId: string): LessonProgressTypes.Snapshot | null {
  const stored = safeLs.get(legacyDefinition(lessonId));
  return stored ? normalizeProgress(stored, lessonId) : null;
}

function removeLegacy(lessonId: string): void {
  safeLs.remove(legacyDefinition(lessonId));
}

function subscribe(listener: () => void): () => void {
  return safeLs.subscribe(registryDefinition, listener);
}

function normalizeProgress(
  progress: StoredLessonProgress,
  lessonId: string,
): LessonProgressTypes.Snapshot {
  const solvedTaskIds = [...new Set(progress.solvedTaskIds)];
  const mapping =
    (firstImport as Record<string, Record<string, number>>)[lessonId] ?? {};
  const solvedRevisions =
    (progress.solvedRevisions
      ? Object.fromEntries(
          Object.entries(progress.solvedRevisions).map(
            ([taskId, revisions]) => [
              taskId,
              Object.fromEntries(
                Object.keys(revisions).map((revision) => [
                  revision,
                  true as const,
                ]),
              ),
            ],
          ),
        )
      : undefined) ??
    Object.fromEntries(
      solvedTaskIds
        .filter((id) => mapping[id] === 1)
        .map((id) => [id, { "1": true }]),
    );
  return { solvedTaskIds, solvedRevisions };
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
    (!("solvedRevisions" in value) ||
      (typeof value.solvedRevisions === "object" &&
        value.solvedRevisions !== null &&
        !Array.isArray(value.solvedRevisions) &&
        Object.values(value.solvedRevisions).every(isStoredRevisions))) &&
    "solvedTaskIds" in value &&
    Array.isArray(value.solvedTaskIds) &&
    value.solvedTaskIds.every((id) => typeof id === "string")
  );
}

function isStoredRevisions(
  value: unknown,
): value is Readonly<Record<string, string | true>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (answer) => typeof answer === "string" || answer === true,
    )
  );
}

export const lessonProgressStorage = {
  persistStorage,
  readLegacy,
  removeLegacy,
  subscribe,
};
