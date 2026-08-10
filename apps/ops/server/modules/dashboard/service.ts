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
  ResourceSnapshot,
  TrafficSnapshot,
} from "./schemas.js";

type Values = {
  availability: AvailabilitySnapshot;
  beszel: ResourceSnapshot;
  umami: TrafficSnapshot;
  journal: JournalSnapshot;
  fail2ban: Fail2banSnapshot;
};

type CacheEntry = {
  values: Partial<Values>;
  updatedAt: Partial<Record<SourceName, string>>;
};

export type DashboardService = {
  getDashboard(project: ProjectConfig, range: DashboardRange): Promise<DashboardData>;
  clearCache(): void;
};

type DashboardServiceOptions = {
  readers: DashboardReaders;
  now?: () => Date;
};

const safeMessage = (reason: unknown): string =>
  reason instanceof Error && /missing credential environment variable/.test(reason.message)
    ? reason.message
    : "source request failed";

export function createDashboardService({
  readers,
  now = () => new Date(),
}: DashboardServiceOptions): DashboardService {
  const cache = new Map<string, CacheEntry>();

  async function getDashboard(
    project: ProjectConfig,
    range: DashboardRange,
  ): Promise<DashboardData> {
    const results = await Promise.allSettled([
      readers.readAvailability(project),
      readers.readBeszel(project, range),
      readers.readUmami(project, range),
      readers.readJournal(project),
      readers.readFail2ban(project),
    ]);
    const [availability, beszel, umami, journal, fail2ban] = results;
    const key = `${project.id}:${range}`;
    const previous = cache.get(key) ?? { values: {}, updatedAt: {} };
    const next: CacheEntry = {
      values: { ...previous.values },
      updatedAt: { ...previous.updatedAt },
    };
    const sources = {} as Record<SourceName, SourceStatus>;

    function retain<K extends keyof Values>(
      name: K,
      result: PromiseSettledResult<Values[K]>,
    ): Values[K] | undefined {
      if (result.status === "fulfilled") {
        const updatedAt = now().toISOString();
        next.values[name] = result.value;
        next.updatedAt[name] = updatedAt;
        sources[name] = { state: "fresh", updatedAt };
        return result.value;
      }

      const cached = previous.values[name];
      sources[name] = cached === undefined
        ? {
            state: "unavailable",
            updatedAt: now().toISOString(),
            message: safeMessage(result.reason),
          }
        : {
            state: "stale",
            updatedAt: previous.updatedAt[name] ?? new Date(0).toISOString(),
            message: "showing the last successful snapshot",
          };
      return cached;
    }

    const availabilityValue = retain("availability", availability) ?? {
      availability: "unknown" as const,
      version: "",
    };
    const resourceValue = retain("beszel", beszel) ?? {
      cpu: 0,
      memory: 0,
      disk: 0,
      series: [],
      containers: [],
    };
    const trafficValue = retain("umami", umami) ?? {
      visits: 0,
      series: [],
      funnel: [],
    };
    const errors = retain("journal", journal) ?? [];
    const bans = retain("fail2ban", fail2ban) ?? [];
    cache.set(key, next);

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
