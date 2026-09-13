import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { createZustandScope } from "~/shared/lib/create-zustand-scope";
import { createSafeLsPersistStorage } from "~/shared/lib/zustand-persistence";
import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";

export type PracticeHistory = Record<string, Record<string, string>>;
type Stored = { history: PracticeHistory };
type State = Stored & {
  hydrated: boolean;
  setHydrated: () => void;
  markSolved: (id: string, revision: number, answer: string) => void;
};

function isStored(value: unknown): value is Stored {
  if (
    !value ||
    typeof value !== "object" ||
    !("history" in value) ||
    !value.history ||
    typeof value.history !== "object" ||
    Array.isArray(value.history)
  )
    return false;
  return Object.values(value.history).every(
    (versions: unknown) =>
      versions !== null &&
      typeof versions === "object" &&
      !Array.isArray(versions) &&
      Object.entries(versions).every(
        ([revision, answer]) =>
          /^[1-9]\d*$/.test(revision) && typeof answer === "string",
      ),
  );
}
const definition: SafeLsKey<Stored> = {
  key: "infraege:practice-progress",
  version: 1,
  guard: isStored,
};
function record(
  history: PracticeHistory,
  id: string,
  revision: number,
  answer: string,
): PracticeHistory {
  return { ...history, [id]: { ...history[id], [revision]: answer } };
}
function create() {
  return createStore<State>()(
    persist<State, [], [], Stored>(
      (set) => ({
        history: {},
        hydrated: false,
        setHydrated: () => set({ hydrated: true }),
        markSolved: (id, revision, answer) =>
          set((state) => ({
            history: record(state.history, id, revision, answer),
          })),
      }),
      {
        name: definition.key,
        storage: createSafeLsPersistStorage(definition),
        partialize: (state) => ({ history: state.history }),
        skipHydration: true,
        merge: (stored, current) => ({
          ...current,
          history: isStored(stored) ? stored.history : {},
        }),
      },
    ),
  );
}
const scope = createZustandScope<State>("Practice progress");
export const practiceProgress = {
  create,
  record,
  isStored,
  definition,
  subscribe: (listener: () => void) => safeLs.subscribe(definition, listener),
};
export const PracticeProgressStoreProvider = scope.Provider;
export const usePracticeProgress = scope.useSelector;
