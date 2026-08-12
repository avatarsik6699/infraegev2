import { useEffect, useState } from "react";
import type { ProjectSummary } from "../../../../contracts/index";
import { fetchProjects } from "../api/ops-client";

type ProjectsState =
  | { status: "loading"; projects: ProjectSummary[] }
  | { status: "ready"; projects: ProjectSummary[] }
  | { status: "error"; projects: ProjectSummary[] };

export function useProjects(): ProjectsState {
  const [state, setState] = useState<ProjectsState>({
    status: "loading",
    projects: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    void fetchProjects(controller.signal)
      .then((projects) => {
        if (!controller.signal.aborted) setState({ status: "ready", projects });
      })
      .catch((reason: unknown) => {
        if (
          !controller.signal.aborted &&
          (reason as Error).name !== "AbortError"
        ) {
          setState({ status: "error", projects: [] });
        }
      });
    return () => controller.abort();
  }, []);

  return state;
}
