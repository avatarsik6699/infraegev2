import { createStore } from "zustand/vanilla";
import type { LessonProgressTypes } from "../lesson-progress.types";
import { emptyLessonProgress, markTaskSolved } from "./lesson-progress-state";

type RegistryState = {
  hydrated: boolean;
  status: "guest" | "loading" | "ready" | "error";
  lessons: Readonly<Record<string, LessonProgressTypes.Snapshot>>;
  clear: (lessonId: string) => void;
  clearAll: () => void;
  ensureLesson: (lessonId: string) => void;
  markSolved: (
    lessonId: string,
    taskId: string,
    solutionRevision?: number,
  ) => LessonProgressTypes.Snapshot;
  setHydrated: () => void;
  setUnavailable: () => void;
  replaceFromServer: (
    results: readonly {
      context_kind: string;
      context_id: string;
      task_id: string;
      solution_revision: number;
    }[],
  ) => void;
};

export function createLessonProgressRegistry(accountId?: string) {
  return createStore<RegistryState>()((set, get) => ({
    hydrated: false,
    status: accountId ? "loading" : "guest",
    lessons: {},
    clear: (lessonId) => {
      set((state) => ({
        lessons: {
          ...state.lessons,
          [lessonId]: emptyLessonProgress,
        },
      }));
    },
    clearAll: () => set({ lessons: {} }),
    ensureLesson: (lessonId) => {
      const state = get();
      if (!state.hydrated || state.lessons[lessonId]) return;
      set({ lessons: { ...state.lessons, [lessonId]: emptyLessonProgress } });
    },
    markSolved: (lessonId, taskId, solutionRevision) => {
      const state = get();
      const current = state.lessons[lessonId] ?? emptyLessonProgress;
      if (!accountId) return current;
      const progress = markTaskSolved(current, taskId, solutionRevision);
      if (progress === current) return current;
      set({ lessons: { ...state.lessons, [lessonId]: progress } });
      return progress;
    },
    setHydrated: () => set({ hydrated: true, status: "ready" }),
    setUnavailable: () => set({ hydrated: false, status: "error" }),
    replaceFromServer: (results) => {
      const lessons: Record<string, LessonProgressTypes.Snapshot> = {};
      for (const result of results) {
        if (result.context_kind === "standalone") continue;
        const lesson = lessons[result.context_id] ?? emptyLessonProgress;
        lessons[result.context_id] = {
          solvedTaskIds: [...lesson.solvedTaskIds, result.task_id],
          solvedRevisions: {
            ...lesson.solvedRevisions,
            [result.task_id]: { [String(result.solution_revision)]: true },
          },
        };
      }
      set({ lessons, hydrated: true, status: "ready" });
    },
  }));
}

export type LessonProgressRegistry = ReturnType<
  typeof createLessonProgressRegistry
>;
