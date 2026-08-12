import type {
  DashboardData,
  DashboardRange,
  SourceName,
  SourceStatus,
} from "../../../contracts/index.js";
import type { ProjectConfig } from "../../core/config.js";
import type {
  AvailabilitySnapshot,
  DashboardReaders,
  Fail2banSnapshot,
  JournalSnapshot,
  RealtimeTrafficSnapshot,
  ResourceSnapshot,
  TrafficSnapshot,
} from "./schemas.js";

export const SOURCE_TTL_MS = {
  availability: 10_000,
  umamiRealtime: 15_000,
  journal: 30_000,
  fail2ban: 30_000,
  beszel: 60_000,
  umami: 60_000,
} as const;

type CacheEntry<T> = {
  hasValue: boolean;
  value?: T;
  valueUpdatedAt?: string;
  checkedAt?: number;
  checkedAtIso?: string;
  lastError?: unknown;
  inFlight?: Promise<void>;
};

type CachedResult<T> = {
  value?: T;
  status: SourceStatus;
};

export type DashboardService = {
  getDashboard(
    project: ProjectConfig,
    range: DashboardRange,
  ): Promise<DashboardData>;
  clearCache(): void;
};

type DashboardServiceOptions = {
  readers: DashboardReaders;
  now?: () => Date;
};

const safeMessage = (reason: unknown): string =>
  reason instanceof Error &&
  /missing credential environment variable/.test(reason.message)
    ? reason.message
    : "source request failed";

function statusFor<T>(entry: CacheEntry<T>): SourceStatus {
  if (entry.lastError === undefined) {
    return {
      state: "fresh",
      updatedAt:
        entry.valueUpdatedAt ?? entry.checkedAtIso ?? new Date(0).toISOString(),
    };
  }
  if (entry.hasValue) {
    return {
      state: "stale",
      updatedAt: entry.valueUpdatedAt ?? new Date(0).toISOString(),
      message: "showing the last successful snapshot",
    };
  }
  return {
    state: "unavailable",
    updatedAt: entry.checkedAtIso ?? new Date(0).toISOString(),
    message: safeMessage(entry.lastError),
  };
}

function combineUmamiStatus(
  history: CachedResult<TrafficSnapshot>,
  realtime: CachedResult<RealtimeTrafficSnapshot>,
): SourceStatus {
  const timestamps = [
    history.status.updatedAt,
    realtime.status.updatedAt,
  ].sort();
  if (history.status.state === "fresh" && realtime.status.state === "fresh") {
    return { state: "fresh", updatedAt: timestamps[0] };
  }
  if (history.value !== undefined || realtime.value !== undefined) {
    return {
      state: "stale",
      updatedAt: timestamps[0],
      message: "showing a partial or cached analytics snapshot",
    };
  }
  return {
    state: "unavailable",
    updatedAt: timestamps[0],
    message: "source request failed",
  };
}

export function createDashboardService({
  readers,
  now = () => new Date(),
}: DashboardServiceOptions): DashboardService {
  const cache = new Map<string, CacheEntry<unknown>>();

  function entryFor<T>(key: string): CacheEntry<T> {
    const existing = cache.get(key) as CacheEntry<T> | undefined;
    if (existing) return existing;
    const created: CacheEntry<T> = { hasValue: false };
    cache.set(key, created as CacheEntry<unknown>);
    return created;
  }

  async function readCached<T>(
    key: string,
    ttlMs: number,
    read: () => Promise<T>,
  ): Promise<CachedResult<T>> {
    const entry = entryFor<T>(key);
    const currentTime = now();
    const cacheIsCurrent =
      entry.checkedAt !== undefined &&
      currentTime.getTime() - entry.checkedAt < ttlMs;

    if (!cacheIsCurrent && !entry.inFlight) {
      entry.checkedAt = currentTime.getTime();
      entry.checkedAtIso = currentTime.toISOString();
      entry.inFlight = read()
        .then((value) => {
          const completedAt = now();
          entry.hasValue = true;
          entry.value = value;
          entry.valueUpdatedAt = completedAt.toISOString();
          entry.lastError = undefined;
        })
        .catch((reason: unknown) => {
          entry.lastError = reason;
        })
        .finally(() => {
          entry.inFlight = undefined;
        });
    }

    await entry.inFlight;
    return {
      value: entry.hasValue ? entry.value : undefined,
      status: statusFor(entry),
    };
  }

  async function getDashboard(
    project: ProjectConfig,
    range: DashboardRange,
  ): Promise<DashboardData> {
    const projectKey = project.id;
    const [availability, beszel, umami, umamiRealtime, journal, fail2ban] =
      await Promise.all([
        readCached<AvailabilitySnapshot>(
          `${projectKey}:availability`,
          SOURCE_TTL_MS.availability,
          () => readers.readAvailability(project),
        ),
        readCached<ResourceSnapshot>(
          `${projectKey}:beszel:${range}`,
          SOURCE_TTL_MS.beszel,
          () => readers.readBeszel(project, range),
        ),
        readCached<TrafficSnapshot>(
          `${projectKey}:umami:${range}`,
          SOURCE_TTL_MS.umami,
          () => readers.readUmami(project, range),
        ),
        readCached<RealtimeTrafficSnapshot>(
          `${projectKey}:umami-realtime`,
          SOURCE_TTL_MS.umamiRealtime,
          () => readers.readUmamiRealtime(project),
        ),
        readCached<JournalSnapshot>(
          `${projectKey}:journal`,
          SOURCE_TTL_MS.journal,
          () => readers.readJournal(project),
        ),
        readCached<Fail2banSnapshot>(
          `${projectKey}:fail2ban`,
          SOURCE_TTL_MS.fail2ban,
          () => readers.readFail2ban(project),
        ),
      ]);

    const availabilityValue = availability.value ?? {
      availability: "unknown" as const,
      version: "",
    };
    const resourceValue = beszel.value ?? {
      cpu: 0,
      memory: 0,
      disk: 0,
      series: [],
      containers: [],
    };
    const trafficValue = umami.value ?? { visits: 0, series: [], funnel: [] };
    const realtimeValue = umamiRealtime.value ?? {
      windowMinutes: 30 as const,
      visitors: 0,
      views: 0,
      events: 0,
    };
    const errors = journal.value ?? [];
    const bans = fail2ban.value ?? [];
    const sources: Record<SourceName, SourceStatus> = {
      availability: availability.status,
      beszel: beszel.status,
      umami: combineUmamiStatus(umami, umamiRealtime),
      journal: journal.status,
      fail2ban: fail2ban.status,
    };

    return {
      project: {
        id: project.id,
        name: project.name,
        publicUrl: project.publicUrl,
      },
      generatedAt: now().toISOString(),
      sources,
      summary: {
        ...availabilityValue,
        cpu: resourceValue.cpu,
        memory: resourceValue.memory,
        disk: resourceValue.disk,
        visits: trafficValue.visits,
        realtime: realtimeValue,
        errors: errors.length,
        activeBans: bans.reduce((total, item) => total + item.count, 0),
      },
      resourceSeries: resourceValue.series,
      trafficSeries: trafficValue.series,
      containers: resourceValue.containers,
      funnel: trafficValue.funnel,
      errors,
      bans,
    };
  }

  return { getDashboard, clearCache: () => cache.clear() };
}
