import type { ProjectSummary } from "../../../contracts/index.js";
import type { OpsConfig } from "../../core/config.js";

export function listProjects(config: OpsConfig): ProjectSummary[] {
  return config.projects.map(({ id, name }) => ({ id, name }));
}
