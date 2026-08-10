import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectConfig } from "../../core/config.js";
import type { AvailabilitySnapshot, DashboardReaders } from "./schemas.js";
import { createDashboardService, SOURCE_TTL_MS } from "./service.js";

const project = {
  id: "x",
  name: "X",
  publicUrl: "https://x.test",
  beszel: {},
  umami: {},
  journal: {},
  fail2ban: {},
} as ProjectConfig;

function createReaders(): DashboardReaders {
  return {
    readAvailability: vi.fn(async () => ({
      availability: "up" as const,
      version: "abc",
    })),
    readBeszel: vi.fn(async () => ({
      cpu: 1,
      memory: 2,
      disk: 3,
      series: [{ time: "now", cpu: 1, memory: 2, load: 0.5 }],
      containers: [],
    })),
    readUmami: vi.fn(async () => ({
      visits: 7,
      series: [{ time: "now", pageviews: 9, sessions: 7 }],
      funnel: [],
    })),
    readUmamiRealtime: vi.fn(async () => ({
      windowMinutes: 30 as const,
      visitors: 2,
      views: 4,
      events: 1,
    })),
    readJournal: vi.fn(async () => []),
    readFail2ban: vi.fn(async () => []),
  };
}

describe("dashboard service", () => {
  let readers: DashboardReaders;
  let timestamp: number;

  beforeEach(() => {
    readers = createReaders();
    timestamp = Date.parse("2026-08-10T10:00:00.000Z");
  });

  const createService = () =>
    createDashboardService({ readers, now: () => new Date(timestamp) });

  it("keeps healthy sources when another source fails and redacts upstream details", async () => {
    readers.readBeszel = async () => {
      throw new Error("token=super-secret upstream exploded");
    };
    const result = await createService().getDashboard(project, "24h");
    expect(result.summary.availability).toBe("up");
    expect(result.summary.visits).toBe(7);
    expect(result.summary.realtime.visitors).toBe(2);
    expect(result.trafficSeries).toHaveLength(1);
    expect(result.sources.beszel).toMatchObject({
      state: "unavailable",
      message: "source request failed",
    });
    expect(JSON.stringify(result)).not.toContain("super-secret");
  });

  it("serves the last successful value as stale after a source refresh fails", async () => {
    const service = createService();
    await service.getDashboard(project, "7d");
    readers.readAvailability = async () => {
      throw new Error("offline");
    };
    timestamp += SOURCE_TTL_MS.availability;

    const result = await service.getDashboard(project, "7d");

    expect(result.summary.availability).toBe("up");
    expect(result.sources.availability.state).toBe("stale");
  });

  it("keeps range-scoped caches isolated", async () => {
    const service = createService();
    await service.getDashboard(project, "1h");
    readers.readUmami = async () => {
      throw new Error("offline");
    };

    const result = await service.getDashboard(project, "30d");

    expect(result.sources.umami.state).toBe("stale");
    expect(result.summary.visits).toBe(0);
  });

  it("refreshes each source only after its own TTL", async () => {
    const service = createService();
    await service.getDashboard(project, "24h");
    timestamp += SOURCE_TTL_MS.umamiRealtime;

    await service.getDashboard(project, "24h");

    expect(readers.readAvailability).toHaveBeenCalledTimes(2);
    expect(readers.readUmamiRealtime).toHaveBeenCalledTimes(2);
    expect(readers.readJournal).toHaveBeenCalledTimes(1);
    expect(readers.readFail2ban).toHaveBeenCalledTimes(1);
    expect(readers.readBeszel).toHaveBeenCalledTimes(1);
    expect(readers.readUmami).toHaveBeenCalledTimes(1);
  });

  it("coalesces concurrent dashboard requests into one source read", async () => {
    let release!: (value: { availability: "up"; version: string }) => void;
    readers.readAvailability = vi.fn(
      () =>
        new Promise<AvailabilitySnapshot>((resolve) => {
          release = resolve;
        }),
    );
    const service = createService();

    const first = service.getDashboard(project, "24h");
    const second = service.getDashboard(project, "24h");
    expect(readers.readAvailability).toHaveBeenCalledTimes(1);
    release({ availability: "up", version: "abc" });
    await Promise.all([first, second]);

    expect(readers.readAvailability).toHaveBeenCalledTimes(1);
    expect(readers.readBeszel).toHaveBeenCalledTimes(1);
  });
});
