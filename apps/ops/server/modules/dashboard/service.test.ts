import { beforeEach, describe, expect, it } from "vitest";
import type { ProjectConfig } from "../../core/config.js";
import type { DashboardReaders } from "./schemas.js";
import { createDashboardService } from "./service.js";

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
    readAvailability: async () => ({ availability: "up", version: "abc" }),
    readBeszel: async () => ({
      cpu: 1,
      memory: 2,
      disk: 3,
      series: [{ time: "now", cpu: 1, memory: 2, load: 0.5 }],
      containers: [],
    }),
    readUmami: async () => ({
      visits: 7,
      series: [{ time: "now", pageviews: 9, sessions: 7 }],
      funnel: [],
    }),
    readJournal: async () => [],
    readFail2ban: async () => [],
  };
}

describe("dashboard service", () => {
  let readers: DashboardReaders;

  beforeEach(() => {
    readers = createReaders();
  });

  it("keeps healthy sources when another source fails and redacts upstream details", async () => {
    readers.readBeszel = async () => {
      throw new Error("token=super-secret upstream exploded");
    };
    const service = createDashboardService({ readers });
    const result = await service.getDashboard(project, "24h");
    expect(result.summary.availability).toBe("up");
    expect(result.summary.visits).toBe(7);
    expect(result.trafficSeries).toHaveLength(1);
    expect(result.sources.beszel).toMatchObject({
      state: "unavailable",
      message: "source request failed",
    });
    expect(JSON.stringify(result)).not.toContain("super-secret");
  });

  it("serves the last successful value as stale after a source failure", async () => {
    let availabilityFails = false;
    readers.readAvailability = async () => {
      if (availabilityFails) throw new Error("offline");
      return { availability: "up", version: "abc" };
    };
    const service = createDashboardService({ readers });
    await service.getDashboard(project, "7d");
    availabilityFails = true;
    const result = await service.getDashboard(project, "7d");
    expect(result.summary.availability).toBe("up");
    expect(result.sources.availability.state).toBe("stale");
  });

  it("keeps caches isolated by range and project", async () => {
    const service = createDashboardService({ readers });
    await service.getDashboard(project, "1h");
    readers.readUmami = async () => {
      throw new Error("offline");
    };
    const result = await service.getDashboard(project, "30d");
    expect(result.sources.umami.state).toBe("unavailable");
    expect(result.summary.visits).toBe(0);
  });
});
