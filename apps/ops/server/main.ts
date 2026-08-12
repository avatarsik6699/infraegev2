import { createServer } from "node:http";
import { createOpsApp } from "./app.js";
import { loadConfig } from "./core/config.js";
import { createLiveReaders } from "./integrations/index.js";
import { createDashboardService } from "./modules/dashboard/service.js";

const host = "127.0.0.1";
const port = Number(process.env.OPS_PORT ?? 8787);
const config = await loadConfig();
const dashboardService = createDashboardService({
  readers: createLiveReaders(),
});
const clientRoot = new URL("../client/", import.meta.url).pathname;

createServer(
  createOpsApp({ config, dashboardService, clientRoot, host }),
).listen(port, host, () =>
  console.log(`ops dashboard listening on http://${host}:${port}`),
);
