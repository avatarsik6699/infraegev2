/**
 * Browser-only progress tracking (docs/SPEC.md §5.2/§6) — no account, no server session.
 * A topic/lesson counts as "passed" only once its mastery_threshold is met in practice, not on
 * page open (docs/SPEC.md §3) — callers decide when to call `markMastered`, this module only
 * stores the result.
 */
import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";

interface ProgressState {
  masteredIds: string[];
}

function isProgressState(value: unknown): value is ProgressState {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as ProgressState).masteredIds)
  );
}

const PROGRESS_STORAGE: SafeLsKey<ProgressState> = {
  key: "infraege:progress",
  version: 1,
  guard: isProgressState,
};

function read(): ProgressState {
  return safeLs.get(PROGRESS_STORAGE) ?? { masteredIds: [] };
}

function write(state: ProgressState): void {
  safeLs.set(PROGRESS_STORAGE, state);
}

export function isMastered(id: string): boolean {
  return read().masteredIds.includes(id);
}

export function markMastered(id: string): void {
  const state = read();
  if (!state.masteredIds.includes(id)) {
    state.masteredIds.push(id);
    write(state);
  }
}

/** 0..1 — fraction of the given ids already mastered, for a progress bar. */
export function progressRatio(ids: string[]): number {
  if (ids.length === 0) return 0;
  const state = read();
  const done = ids.filter((id) => state.masteredIds.includes(id)).length;
  return done / ids.length;
}
