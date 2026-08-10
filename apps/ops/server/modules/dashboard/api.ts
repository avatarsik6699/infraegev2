import type { ServerResponse } from "node:http";
import { isDashboardRange } from "../../../contracts/index.js";
import type { OpsConfig } from "../../core/config.js";
import { sendJson } from "../../core/http.js";
import type { DashboardService } from "./service.js";

export async function sendDashboard(
  response: ServerResponse,
  url: URL,
  config: OpsConfig,
  service: DashboardService,
): Promise<void> {
  const project = config.projects.find(
    (item) => item.id === url.searchParams.get("project"),
  );
  if (!project) {
    sendJson(response, 404, { error: "project not found" });
    return;
  }
  const requestedRange = url.searchParams.get("range");
  const range = isDashboardRange(requestedRange) ? requestedRange : "24h";
  sendJson(response, 200, await service.getDashboard(project, range));
}
