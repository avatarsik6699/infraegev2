import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { DashboardData } from "../contracts/index.js";
import { createOpsApp } from "./app.js";
import type { OpsConfig } from "./core/config.js";
import type { DashboardService } from "./modules/dashboard/service.js";

const config = {
  version: 1,
  projects: [{ id: "x", name: "X" }],
} as OpsConfig;

const dashboard: DashboardData = {
  project: { id: "x", name: "X", publicUrl: "https://x.test" },
  generatedAt: "2026-08-10T10:00:00.000Z",
  sources: {
    availability: { state: "fresh", updatedAt: "2026-08-10T10:00:00.000Z" },
    beszel: { state: "fresh", updatedAt: "2026-08-10T10:00:00.000Z" },
    umami: { state: "fresh", updatedAt: "2026-08-10T10:00:00.000Z" },
    journal: { state: "fresh", updatedAt: "2026-08-10T10:00:00.000Z" },
    fail2ban: { state: "fresh", updatedAt: "2026-08-10T10:00:00.000Z" },
  },
  summary: {
    availability: "up",
    version: "abc",
    cpu: 1,
    memory: 2,
    disk: 3,
    visits: 4,
    realtime: { windowMinutes: 30, visitors: 2, views: 4, events: 1 },
    errors: 0,
    activeBans: 0,
  },
  resourceSeries: [],
  trafficSeries: [],
  containers: [],
  funnel: [],
  errors: [],
  bans: [],
};

const dashboardService: DashboardService = {
  getDashboard: async () => dashboard,
  clearCache: () => undefined,
};

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  await Promise.all(cleanups.splice(0).map((cleanup) => cleanup()));
});

async function start(service = dashboardService) {
  const clientRoot = await mkdtemp(join(tmpdir(), "infraege-ops-client-"));
  await writeFile(join(clientRoot, "index.html"), "<h1>Operations</h1>");
  const server = createServer(createOpsApp({ config, dashboardService: service, clientRoot }));
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as AddressInfo).port;
  cleanups.push(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await rm(clientRoot, { recursive: true });
  });
  return `http://127.0.0.1:${port}`;
}

describe("ops app", () => {
  it("serves project metadata and defaults an invalid range", async () => {
    let receivedRange = "";
    const service = {
      ...dashboardService,
      getDashboard: async (_project: unknown, range: string) => {
        receivedRange = range;
        return dashboard;
      },
    } satisfies DashboardService;
    const baseUrl = await start(service);
    const projects = await fetch(`${baseUrl}/api/projects`);
    expect(await projects.json()).toEqual([{ id: "x", name: "X" }]);
    const dashboardResponse = await fetch(
      `${baseUrl}/api/dashboard?project=x&range=invalid`,
    );
    expect(dashboardResponse.status).toBe(200);
    expect(receivedRange).toBe("24h");
  });

  it("returns a safe not-found response for unknown projects", async () => {
    const baseUrl = await start();
    const response = await fetch(`${baseUrl}/api/dashboard?project=missing`);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "project not found" });
  });

  it("serves the SPA fallback outside the API namespace", async () => {
    const baseUrl = await start();
    const response = await fetch(`${baseUrl}/dashboard/deep-link`);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Operations");
  });

  it("redacts unexpected application failures", async () => {
    const service = {
      ...dashboardService,
      getDashboard: async () => {
        throw new Error("secret failure details");
      },
    } satisfies DashboardService;
    const baseUrl = await start(service);
    const response = await fetch(`${baseUrl}/api/dashboard?project=x`);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "internal dashboard error" });
  });
});
