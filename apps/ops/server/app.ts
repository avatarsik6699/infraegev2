import type { RequestListener } from "node:http";
import type { OpsConfig } from "./core/config.js";
import { sendJson } from "./core/http.js";
import { sendStaticFile } from "./core/static-files.js";
import { createApiRouter } from "./api/router.js";
import type { DashboardService } from "./modules/dashboard/service.js";

type OpsAppOptions = {
  config: OpsConfig;
  dashboardService: DashboardService;
  clientRoot: string;
  host?: string;
};

export function createOpsApp({
  config,
  dashboardService,
  clientRoot,
  host = "127.0.0.1",
}: OpsAppOptions): RequestListener {
  const routeApi = createApiRouter({ config, dashboardService });

  return (request, response) => {
    void (async () => {
      try {
        const url = new URL(request.url ?? "/", `http://${host}`);
        if (await routeApi(response, url)) return;
        await sendStaticFile(response, clientRoot, url.pathname);
      } catch {
        if (response.headersSent) {
          response.destroy();
          return;
        }
        sendJson(response, 500, { error: "internal dashboard error" });
      }
    })();
  };
}
