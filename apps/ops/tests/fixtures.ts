import type { DashboardData } from "../contracts/index";

const updatedAt = "2026-08-10T10:00:00.000Z";

export const dashboardFixture: DashboardData = {
  project: {
    id: "infraege",
    name: "infraege.ru",
    publicUrl: "https://infraege.ru",
  },
  generatedAt: updatedAt,
  sources: {
    availability: { state: "fresh", updatedAt },
    beszel: { state: "fresh", updatedAt },
    umami: { state: "fresh", updatedAt },
    journal: { state: "fresh", updatedAt },
    fail2ban: { state: "fresh", updatedAt },
  },
  summary: {
    availability: "up",
    version: "0123456789abcdef",
    cpu: 12,
    memory: 34,
    disk: 56,
    visits: 42,
    realtime: { windowMinutes: 30, visitors: 3, views: 8, events: 2 },
    errors: 1,
    activeBans: 2,
  },
  resourceSeries: [{ time: updatedAt, cpu: 12, memory: 34, load: 0.5 }],
  trafficSeries: [{ time: updatedAt, pageviews: 50, sessions: 42 }],
  containers: [{ name: "web", status: "running", cpu: 1, memoryMiB: 208.04 }],
  funnel: [{ step: "topic_view", total: 40 }],
  errors: [{ time: updatedAt, service: "api", message: "request failed" }],
  bans: [{ jail: "sshd", count: 2, addresses: ["192.0.2.1"] }],
};
