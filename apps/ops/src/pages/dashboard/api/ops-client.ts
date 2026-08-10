import type {
  DashboardData,
  DashboardRange,
  ProjectSummary,
} from "../../../../contracts/index";

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`ops API HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

export function fetchProjects(signal: AbortSignal): Promise<ProjectSummary[]> {
  return getJson("/api/projects", signal);
}

export function fetchDashboard(
  projectId: string,
  range: DashboardRange,
  signal: AbortSignal,
): Promise<DashboardData> {
  const query = new URLSearchParams({ project: projectId, range });
  return getJson(`/api/dashboard?${query}`, signal);
}
