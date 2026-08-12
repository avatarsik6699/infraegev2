/**
 * Browser-only progress tracking (docs/SPEC.md §5.2/§6) — no account, no server session.
 * A topic counts as "passed" only once its mastery_threshold is met in practice, not on page
 * open (docs/SPEC.md §3). Correct task ids are stored per topic so retries are idempotent and one
 * topic can never inflate another topic's progress.
 */
import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";

type ProgressState = {
  masteredIds: string[];
  correctTaskIdsByTopic: Record<string, string[]>;
};

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isProgressState(value: unknown): value is ProgressState {
  const candidate = value as ProgressState;
  return (
    typeof value === "object" &&
    value !== null &&
    isStringArray(candidate.masteredIds) &&
    typeof candidate.correctTaskIdsByTopic === "object" &&
    candidate.correctTaskIdsByTopic !== null &&
    Object.values(candidate.correctTaskIdsByTopic).every(isStringArray)
  );
}

const PROGRESS_STORAGE: SafeLsKey<ProgressState> = {
  key: "infraege:progress",
  version: 2,
  guard: isProgressState,
};

const listeners = new Set<() => void>();

function read(): ProgressState {
  return (
    safeLs.get(PROGRESS_STORAGE) ?? {
      masteredIds: [],
      correctTaskIdsByTopic: {},
    }
  );
}

function write(state: ProgressState): void {
  safeLs.set(PROGRESS_STORAGE, state);
  listeners.forEach((listener) => listener());
}

export function subscribeToProgress(listener: () => void): () => void {
  listeners.add(listener);
  const unsubscribeStorage = safeLs.subscribe(PROGRESS_STORAGE, listener);
  return () => {
    listeners.delete(listener);
    unsubscribeStorage();
  };
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

export type TopicProgress = {
  correctCount: number;
  totalCount: number;
  ratio: number;
  mastered: boolean;
};

function distinctTaskIds(taskIds: string[]): string[] {
  return [...new Set(taskIds)];
}

export function getTopicProgress(
  topicId: string,
  taskIds: string[],
): TopicProgress {
  const state = read();
  const completeTaskIds = distinctTaskIds(taskIds);
  const completeSet = new Set(completeTaskIds);
  const correctCount = new Set(
    (state.correctTaskIdsByTopic[topicId] ?? []).filter((id) =>
      completeSet.has(id),
    ),
  ).size;
  const totalCount = completeTaskIds.length;
  return {
    correctCount,
    totalCount,
    ratio: totalCount === 0 ? 0 : correctCount / totalCount,
    mastered: state.masteredIds.includes(topicId),
  };
}

/** Stable primitive snapshot for React's external-store hydration contract. */
export function getTopicProgressSnapshot(
  topicId: string,
  taskIds: string[],
): string {
  return JSON.stringify(getTopicProgress(topicId, taskIds));
}

export function recordCorrectTask(
  topicId: string,
  taskId: string,
  taskIds: string[],
  masteryThreshold: number,
): TopicProgress {
  const completeTaskIds = distinctTaskIds(taskIds);
  if (!completeTaskIds.includes(taskId)) {
    return getTopicProgress(topicId, completeTaskIds);
  }

  const state = read();
  const correctTaskIds = [
    ...new Set([
      ...(state.correctTaskIdsByTopic[topicId] ?? []).filter((id) =>
        completeTaskIds.includes(id),
      ),
      taskId,
    ]),
  ];
  const ratio = correctTaskIds.length / completeTaskIds.length;
  const masteredIds =
    ratio >= masteryThreshold && !state.masteredIds.includes(topicId)
      ? [...state.masteredIds, topicId]
      : state.masteredIds;

  write({
    masteredIds,
    correctTaskIdsByTopic: {
      ...state.correctTaskIdsByTopic,
      [topicId]: correctTaskIds,
    },
  });
  return {
    correctCount: correctTaskIds.length,
    totalCount: completeTaskIds.length,
    ratio,
    mastered: masteredIds.includes(topicId),
  };
}

/** 0..1 — fraction of the given ids already mastered, for a progress bar. */
export function progressRatio(ids: string[]): number {
  if (ids.length === 0) return 0;
  const state = read();
  const done = ids.filter((id) => state.masteredIds.includes(id)).length;
  return done / ids.length;
}
