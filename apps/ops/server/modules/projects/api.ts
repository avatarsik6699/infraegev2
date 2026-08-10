import type { ServerResponse } from "node:http";
import type { OpsConfig } from "../../core/config.js";
import { sendJson } from "../../core/http.js";
import { listProjects } from "./service.js";

export function sendProjects(response: ServerResponse, config: OpsConfig): void {
  sendJson(response, 200, listProjects(config));
}
