import type { DashboardRange } from "../../contracts/index.js";
import type { ProjectConfig } from "../core/config.js";
import type { ResourceSnapshot } from "../modules/dashboard/schemas.js";
import { resolveCredential } from "./credentials.js";
import { fetchJson } from "./http-client.js";
import { finiteNumber, record, records } from "./parsing.js";

const RESOLUTION: Record<DashboardRange, string> = {
  "1h": "1m",
  "24h": "10m",
  "7d": "120m",
  "30d": "480m",
};

export async function readBeszel(
  project: ProjectConfig,
  range: DashboardRange,
): Promise<ResourceSnapshot> {
  const auth = record(
    await fetchJson(
      `${project.beszel.baseUrl}/api/collections/users/auth-with-password`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          identity: resolveCredential(project.beszel.emailEnv),
          password: resolveCredential(project.beszel.passwordEnv),
        }),
      },
    ),
  );
  if (typeof auth.token !== "string") {
    throw new Error("Beszel authentication response is invalid");
  }

  const headers = { Authorization: auth.token };
  const params = new URLSearchParams({
    filter: `system="${project.beszel.systemId}" && type="${RESOLUTION[range]}"`,
    sort: "-created",
    perPage: "288",
  });
  const [systemResponse, containerResponse] = await Promise.all([
    fetchJson(
      `${project.beszel.baseUrl}/api/collections/system_stats/records?${params}`,
      { headers },
    ),
    fetchJson(
      `${project.beszel.baseUrl}/api/collections/container_stats/records?${params}`,
      { headers },
    ),
  ]);

  const system = records(systemResponse);
  const latest = record(system[0]?.stats);
  const series = [...system].reverse().map((item) => {
    const stats = record(item.stats);
    const load = Array.isArray(stats.la) ? finiteNumber(stats.la[0]) : 0;
    return {
      time: String(item.created ?? ""),
      cpu: finiteNumber(stats.cpu),
      memory: finiteNumber(stats.mp),
      load,
    };
  });
  const latestContainerStats = records(containerResponse)[0]?.stats;
  const containers = Array.isArray(latestContainerStats)
    ? latestContainerStats.slice(0, 20).flatMap((value) => {
        const item = record(value);
        return Object.keys(item).length
          ? [
              {
                name: String(item.n ?? "unknown"),
                status: "running",
                cpu: finiteNumber(item.c),
                memoryMiB: finiteNumber(item.m),
              },
            ]
          : [];
      })
    : [];

  return {
    cpu: finiteNumber(latest.cpu),
    memory: finiteNumber(latest.mp),
    disk: finiteNumber(latest.dp),
    series,
    containers,
  };
}
