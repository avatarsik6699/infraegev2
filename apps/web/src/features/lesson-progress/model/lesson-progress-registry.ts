import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { LessonProgressTypes } from "../lesson-progress.types";
import {
  lessonProgressStorage,
  type PersistedLessonProgress,
} from "./lesson-progress-storage";
import { emptyLessonProgress, markTaskSolved } from "./lesson-progress-state";

type RegistryState = {
  hydrated: boolean;
  lessons: Readonly<Record<string, LessonProgressTypes.Snapshot>>;
  clear: (lessonId: string) => void;
  ensureLesson: (lessonId: string) => void;
  markSolved: (
    lessonId: string,
    taskId: string,
    acceptedAnswer: string,
  ) => LessonProgressTypes.Snapshot;
  setHydrated: () => void;
};

export function createLessonProgressRegistry() {
  return createStore<RegistryState>()(
    persist<RegistryState, [], [], PersistedLessonProgress>(
      (set, get) => ({
        hydrated: false,
        lessons: {},
        clear: (lessonId) => {
          set((state) => ({
            lessons: {
              ...state.lessons,
              [lessonId]: emptyLessonProgress,
            },
          }));
          lessonProgressStorage.removeLegacy(lessonId);
        },
        ensureLesson: (lessonId) => {
          const state = get();
          if (!state.hydrated || state.lessons[lessonId]) return;
          const legacyProgress = lessonProgressStorage.readLegacy(lessonId);
          const progress = legacyProgress ?? emptyLessonProgress;
          set({ lessons: { ...state.lessons, [lessonId]: progress } });
          if (legacyProgress) lessonProgressStorage.removeLegacy(lessonId);
        },
        markSolved: (lessonId, taskId, acceptedAnswer) => {
          const state = get();
          const legacyProgress = lessonProgressStorage.readLegacy(lessonId);
          const current =
            state.lessons[lessonId] ?? legacyProgress ?? emptyLessonProgress;
          const progress = markTaskSolved(current, taskId, acceptedAnswer);
          if (progress === current && !legacyProgress) return current;
          set({ lessons: { ...state.lessons, [lessonId]: progress } });
          if (legacyProgress) lessonProgressStorage.removeLegacy(lessonId);
          return progress;
        },
        setHydrated: () => set({ hydrated: true }),
      }),
      {
        name: "infraege:lesson-progress",
        partialize: (state) => ({ lessons: state.lessons }),
        skipHydration: true,
        storage: lessonProgressStorage.persistStorage,
        merge: (persisted, current) => ({
          ...current,
          lessons: (persisted as PersistedLessonProgress).lessons,
        }),
      },
    ),
  );
}

export type LessonProgressRegistry = ReturnType<
  typeof createLessonProgressRegistry
>;
