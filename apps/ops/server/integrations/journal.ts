import type { ProjectConfig } from "../core/config.js";
import type { JournalSnapshot } from "../modules/dashboard/schemas.js";
import { fetchText } from "./http-client.js";

export function parseJournal(body: string): JournalSnapshot {
  const rows = body
    .trim()
    .split("\n")
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as Record<string, unknown>];
      } catch {
        return [];
      }
    });
  return rows
    .filter(
      (row) =>
        ["err", "error", "critical"].includes(
          String(row.PRIORITY ?? row.level ?? "").toLowerCase(),
        ) || /error|exception/i.test(String(row.MESSAGE ?? "")),
    )
    .slice(-25)
    .reverse()
    .map((row) => ({
      time: String(row.__REALTIME_TIMESTAMP ?? row.timestamp ?? ""),
      service: String(row.CONTAINER_NAME ?? row.SYSLOG_IDENTIFIER ?? "system"),
      message: String(row.MESSAGE ?? "unknown error").slice(0, 500),
    }));
}

export async function readJournal(project: ProjectConfig): Promise<JournalSnapshot> {
  const body = await fetchText(`${project.journal.baseUrl}/entries?follow=false`, {
    headers: { Accept: "application/json", Range: "entries=-200" },
  });
  return parseJournal(body);
}
