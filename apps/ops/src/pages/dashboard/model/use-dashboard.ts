import { useEffect, useState } from "react";
import type { DashboardData, DashboardRange } from "../../../../contracts/index";
import { fetchDashboard } from "../api/ops-client";

export const DASHBOARD_REFRESH_MS = 60_000;

export type DashboardState = {
  data: DashboardData | null;
  error: boolean;
  loading: boolean;
  refreshing: boolean;
};

type InternalDashboardState = DashboardState & { key: string };

const emptyState = (loading: boolean): DashboardState => ({
  data: null,
  error: false,
  loading,
  refreshing: false,
});

export function useDashboard(
  projectId: string,
  range: DashboardRange,
): DashboardState {
  const key = projectId ? `${projectId}:${range}` : "";
  const [state, setState] = useState<InternalDashboardState>({
    ...emptyState(false),
    key: "",
  });

  useEffect(() => {
    if (!projectId) return;

    const controller = new AbortController();

    async function refresh(background: boolean): Promise<void> {
      if (background) {
        setState((current) =>
          current.key === key ? { ...current, refreshing: true } : current,
        );
      }
      try {
        const data = await fetchDashboard(projectId, range, controller.signal);
        if (!controller.signal.aborted) {
          setState({ data, error: false, loading: false, refreshing: false, key });
        }
      } catch (reason) {
        if (!controller.signal.aborted && (reason as Error).name !== "AbortError") {
          setState((current) => ({
            ...(current.key === key ? current : emptyState(false)),
            error: true,
            loading: false,
            refreshing: false,
            key,
          }));
        }
      }
    }

    void refresh(false);
    const interval = window.setInterval(
      () => void refresh(true),
      DASHBOARD_REFRESH_MS,
    );
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [key, projectId, range]);

  return state.key === key ? state : emptyState(Boolean(projectId));
}
