export const DASHBOARD_RANGES = ["1h", "24h", "7d", "30d"] as const;

export type DashboardRange = (typeof DASHBOARD_RANGES)[number];
export type SourceName =
  | "availability"
  | "beszel"
  | "umami"
  | "journal"
  | "fail2ban";
export type SourceState = "fresh" | "stale" | "unavailable";

export type SourceStatus = {
  state: SourceState;
  updatedAt: string;
  message?: string;
};

export type ResourcePoint = {
  time: string;
  cpu: number;
  memory: number;
  load: number;
};

export type TrafficPoint = {
  time: string;
  pageviews: number;
  sessions: number;
};

export type DashboardData = {
  project: { id: string; name: string; publicUrl: string };
  generatedAt: string;
  sources: Record<SourceName, SourceStatus>;
  summary: {
    availability: "up" | "down" | "unknown";
    version: string;
    cpu: number;
    memory: number;
    disk: number;
    visits: number;
    errors: number;
    activeBans: number;
  };
  resourceSeries: ResourcePoint[];
  trafficSeries: TrafficPoint[];
  containers: Array<{
    name: string;
    status: string;
    cpu: number;
    memory: number;
  }>;
  funnel: Array<{ step: string; total: number }>;
  errors: Array<{ time: string; service: string; message: string }>;
  bans: Array<{ jail: string; count: number; addresses: string[] }>;
};

export function isDashboardRange(value: string | null): value is DashboardRange {
  return DASHBOARD_RANGES.some((range) => range === value);
}
