import { createStore } from "zustand/vanilla";
import { createZustandScope } from "~/shared/lib/create-zustand-scope";

type PracticeHistory = Record<string, Record<string, true>>;
type PracticeProgressStatus = "guest" | "loading" | "ready" | "error";
type State = {
  history: PracticeHistory;
  /** F47: exam numbers of the solved catalog tasks, from the server. */
  examNumbers: Record<string, readonly number[]>;
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
      exam_numbers?: readonly number[];
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
    examNumbers: {},
    hydrated: false,
    status: accountId ? "loading" : "guest",
    setHydrated: () => set({ hydrated: true, status: "ready" }),
    setUnavailable: () => set({ hydrated: false, status: "error" }),
    clear: () => set({ history: {}, examNumbers: {} }),
    markSolved: (id, revision) => {
      if (!accountId) return;
      set((state) => ({
        history: record(state.history, id, revision),
      }));
    },
    replaceFromServer: (results) => {
      let history: PracticeHistory = {};
      const examNumbers: Record<string, readonly number[]> = {};
      for (const result of results) {
        if (result.context_kind !== "standalone") continue;
        history = record(history, result.task_id, result.solution_revision);
        examNumbers[result.task_id] = result.exam_numbers ?? [];
      }
      set({ history, examNumbers, hydrated: true, status: "ready" });
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
