import type { DashboardRange, TrafficPoint } from "../../contracts/index.js";
import type { ProjectConfig } from "../core/config.js";
import type { TrafficSnapshot } from "../modules/dashboard/schemas.js";
import { resolveCredential } from "./credentials.js";
import { fetchJson } from "./http-client.js";
import { finiteNumber, record } from "./parsing.js";

const DURATION_MS: Record<DashboardRange, number> = {
  "1h": 3_600_000,
  "24h": 86_400_000,
  "7d": 604_800_000,
  "30d": 2_592_000_000,
};

const UNIT: Record<DashboardRange, "minute" | "hour" | "day"> = {
  "1h": "minute",
  "24h": "hour",
  "7d": "hour",
  "30d": "day",
};

const EVENT_NAMES = ["topic_view", "practice_start", "practice_answer"] as const;

function metricValue(stats: Record<string, unknown>, key: string): number {
  const entry = stats[key];
  return finiteNumber(
    entry && typeof entry === "object"
      ? (entry as Record<string, unknown>).value
      : entry,
  );
}

function eventCount(response: unknown): number {
  return finiteNumber(record(record(response).data).events);
}

function pointSeries(value: unknown): Map<string, number> {
  const result = new Map<string, number>();
  if (!Array.isArray(value)) return result;
  for (const candidate of value) {
    const point = record(candidate);
    if (typeof point.x === "string") result.set(point.x, finiteNumber(point.y));
  }
  return result;
}

export function parseTrafficSeries(value: unknown): TrafficPoint[] {
  const response = record(value);
  const pageviews = pointSeries(response.pageviews);
  const sessions = pointSeries(response.sessions);
  const timestamps = [...new Set([...pageviews.keys(), ...sessions.keys()])].sort();
  return timestamps.map((time) => ({
    time,
    pageviews: pageviews.get(time) ?? 0,
    sessions: sessions.get(time) ?? 0,
  }));
}

export async function readUmami(
  project: ProjectConfig,
  range: DashboardRange,
): Promise<TrafficSnapshot> {
  const auth = record(
    await fetchJson(`${project.umami.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: resolveCredential(project.umami.usernameEnv),
        password: resolveCredential(project.umami.passwordEnv),
      }),
    }),
  );
  if (typeof auth.token !== "string") {
    throw new Error("Umami authentication response is invalid");
  }

  const endAt = Date.now();
  const query = new URLSearchParams({
    startAt: String(endAt - DURATION_MS[range]),
    endAt: String(endAt),
  });
  const pageviewsQuery = new URLSearchParams(query);
  pageviewsQuery.set("unit", UNIT[range]);
  pageviewsQuery.set("timezone", project.umami.timezone);
  const headers = { Authorization: `Bearer ${auth.token}` };

  const [statsResponse, pageviewsResponse, ...eventStats] = await Promise.all([
    fetchJson(
      `${project.umami.baseUrl}/api/websites/${project.umami.websiteId}/stats?${query}`,
      { headers },
    ),
    fetchJson(
      `${project.umami.baseUrl}/api/websites/${project.umami.websiteId}/pageviews?${pageviewsQuery}`,
      { headers },
    ),
    ...EVENT_NAMES.map((eventName) => {
      const eventQuery = new URLSearchParams(query);
      eventQuery.set("event", eventName);
      return fetchJson(
        `${project.umami.baseUrl}/api/websites/${project.umami.websiteId}/events/stats?${eventQuery}`,
        { headers },
      );
    }),
  ]);
  const stats = record(statsResponse);

  return {
    visits: metricValue(stats, "visits"),
    series: parseTrafficSeries(pageviewsResponse),
    funnel: EVENT_NAMES.map((step, index) => ({
      step,
      total: eventCount(eventStats[index]),
    })),
  };
}
