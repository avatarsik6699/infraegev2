/**
 * Browser-only progress tracking (docs/SPEC.md §5.2/§6) — no account, no server session.
 * A topic/lesson counts as "passed" only once its mastery_threshold is met in practice, not on
 * page open (docs/SPEC.md §3) — callers decide when to call `markMastered`, this module only
 * stores the result.
 */

const STORAGE_KEY = "infraege:progress:v1";

interface ProgressState {
  masteredIds: string[];
}

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function read(): ProgressState {
  if (!isBrowser()) return { masteredIds: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { masteredIds: [] };
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      masteredIds: Array.isArray(parsed.masteredIds) ? parsed.masteredIds : [],
    };
  } catch {
    return { masteredIds: [] };
  }
}

function write(state: ProgressState): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
