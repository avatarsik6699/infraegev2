import { createStore } from "zustand/vanilla";
import { createZustandScope } from "~/shared/lib/create-zustand-scope";

export type PracticeHistory = Record<string, Record<string, true>>;
export type PracticeProgressStatus = "guest" | "loading" | "ready" | "error";
type State = {
  history: PracticeHistory;
  hydrated: boolean;
  status: PracticeProgressStatus;
  setHydrated: () => void;
  setUnavailable: () => void;
  clear: () => void;
  markSolved: (id: string, revision: number) => void;
  replaceFromServer: (
    results: readonly {
      context_kind: string;
      task_id: string;
      solution_revision: number;
    }[],
  ) => void;
};

function record(
  history: PracticeHistory,
  id: string,
  revision: number,
): PracticeHistory {
  return { ...history, [id]: { ...history[id], [revision]: true } };
}
function create(accountId?: string) {
  return createStore<State>()((set) => ({
    history: {},
    hydrated: false,
    status: accountId ? "loading" : "guest",
    setHydrated: () => set({ hydrated: true, status: "ready" }),
    setUnavailable: () => set({ hydrated: false, status: "error" }),
    clear: () => set({ history: {} }),
    markSolved: (id, revision) => {
      if (!accountId) return;
      set((state) => ({
        history: record(state.history, id, revision),
      }));
    },
    replaceFromServer: (results) => {
      let history: PracticeHistory = {};
      for (const result of results) {
        if (result.context_kind === "standalone")
          history = record(history, result.task_id, result.solution_revision);
      }
      set({ history, hydrated: true, status: "ready" });
    },
  }));
}
const scope = createZustandScope<State>("Practice progress");
export const practiceProgress = {
  create,
  record,
};
export const PracticeProgressStoreProvider = scope.Provider;
export const usePracticeProgress = scope.useSelector;
