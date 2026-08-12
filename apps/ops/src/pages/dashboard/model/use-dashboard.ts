import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DashboardData,
  DashboardRange,
} from "../../../../contracts/index";
import { fetchDashboard } from "../api/ops-client";

export const DASHBOARD_REFRESH_OPTIONS = [15_000, 30_000, 60_000, 0] as const;
export type DashboardRefreshMs = (typeof DASHBOARD_REFRESH_OPTIONS)[number];
export const DEFAULT_DASHBOARD_REFRESH_MS: DashboardRefreshMs = 15_000;

export type DashboardState = {
  data: DashboardData | null;
  error: boolean;
  loading: boolean;
  refreshing: boolean;
  refresh(): void;
};

type InternalDashboardState = Omit<DashboardState, "refresh"> & { key: string };

const emptyState = (loading: boolean): Omit<DashboardState, "refresh"> => ({
  data: null,
  error: false,
  loading,
  refreshing: false,
});

export function useDashboard(
  projectId: string,
  range: DashboardRange,
  refreshMs: DashboardRefreshMs,
): DashboardState {
  const key = projectId ? `${projectId}:${range}` : "";
  const refreshRef = useRef<((background: boolean) => Promise<void>) | null>(
    null,
  );
  const [state, setState] = useState<InternalDashboardState>({
    ...emptyState(false),
    key: "",
  });
  const refresh = useCallback(() => {
    void refreshRef.current?.(true);
  }, []);

  useEffect(() => {
    if (!projectId) {
      refreshRef.current = null;
      return;
    }

    const controller = new AbortController();
    let inFlight = false;

    async function performRefresh(background: boolean): Promise<void> {
      if (inFlight) return;
      inFlight = true;
      if (background) {
        setState((current) =>
          current.key === key ? { ...current, refreshing: true } : current,
        );
      }
      try {
        const data = await fetchDashboard(projectId, range, controller.signal);
        if (!controller.signal.aborted) {
          setState({
            data,
            error: false,
            loading: false,
            refreshing: false,
            key,
          });
        }
      } catch (reason) {
        if (
          !controller.signal.aborted &&
          (reason as Error).name !== "AbortError"
        ) {
          setState((current) => ({
            ...(current.key === key ? current : emptyState(false)),
            error: true,
            loading: false,
            refreshing: false,
            key,
          }));
        }
      } finally {
        inFlight = false;
      }
    }

    refreshRef.current = performRefresh;
    void performRefresh(false);
    return () => {
      controller.abort();
      if (refreshRef.current === performRefresh) refreshRef.current = null;
    };
  }, [key, projectId, range]);

  useEffect(() => {
    if (refreshMs === 0) return;

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const interval = window.setInterval(refreshWhenVisible, refreshMs);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refresh, refreshMs]);

  const visibleState =
    state.key === key ? state : emptyState(Boolean(projectId));
  return { ...visibleState, refresh };
}
