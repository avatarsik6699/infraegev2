import type { ServerResponse } from "node:http";
import type { OpsConfig } from "../core/config.js";
import { sendDashboard } from "../modules/dashboard/api.js";
import type { DashboardService } from "../modules/dashboard/service.js";
import { sendProjects } from "../modules/projects/api.js";

type ApiRouterOptions = {
  config: OpsConfig;
  dashboardService: DashboardService;
};

export function createApiRouter({
  config,
  dashboardService,
}: ApiRouterOptions) {
  return async function routeApi(
    response: ServerResponse,
    url: URL,
  ): Promise<boolean> {
    if (url.pathname === "/api/projects") {
      sendProjects(response, config);
      return true;
    }
    if (url.pathname === "/api/dashboard") {
      await sendDashboard(response, url, config, dashboardService);
      return true;
    }
    if (url.pathname.startsWith("/api/")) {
      response.writeHead(404, { "cache-control": "no-store" });
      response.end();
      return true;
    }
    return false;
  };
}
