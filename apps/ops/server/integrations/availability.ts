import type { ProjectConfig } from "../core/config.js";
import type { AvailabilitySnapshot } from "../modules/dashboard/schemas.js";
import { fetchJson } from "./http-client.js";
import { record } from "./parsing.js";

export async function readAvailability(
  project: ProjectConfig,
): Promise<AvailabilitySnapshot> {
  const response = record(await fetchJson(`${project.publicUrl}/health/ready`));
  return {
    availability: response.status === "ok" ? "up" : "down",
    version: typeof response.version === "string" ? response.version : "",
  };
}
