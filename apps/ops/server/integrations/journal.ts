import type { ProjectConfig } from "../core/config.js";
import type { JournalSnapshot } from "../modules/dashboard/schemas.js";
import { fetchText } from "./http-client.js";

type BrowserErrorEvent = {
  event: "client.error_reported";
  kind: string;
  route_id: string;
  fingerprint: string;
  asset_path?: string;
};

function browserErrorEvent(message: unknown): BrowserErrorEvent | undefined {
  if (typeof message !== "string") return undefined;
  try {
    const value = JSON.parse(message) as Record<string, unknown>;
    if (
      value.event === "client.error_reported" &&
      typeof value.kind === "string" &&
      typeof value.route_id === "string" &&
      typeof value.fingerprint === "string"
    ) {
      return value as BrowserErrorEvent;
    }
  } catch {
    // Other journal messages remain on the existing text/error path.
  }
  return undefined;
}

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
    .filter((row) => {
      const clientError = browserErrorEvent(row.MESSAGE);
      return (
        clientError !== undefined ||
        ["err", "error", "critical"].includes(
          String(row.PRIORITY ?? row.level ?? "").toLowerCase(),
        ) ||
        /error|exception/i.test(String(row.MESSAGE ?? ""))
      );
    })
    .slice(-25)
    .reverse()
    .map((row) => {
      const clientError = browserErrorEvent(row.MESSAGE);
      if (clientError) {
        const asset = clientError.asset_path
          ? ` · ${clientError.asset_path}`
          : "";
        return {
          time: String(row.__REALTIME_TIMESTAMP ?? row.timestamp ?? ""),
          service: "web",
          message: `${clientError.kind} · ${clientError.route_id}${asset} · ${clientError.fingerprint.slice(0, 12)}`,
        };
      }
      return {
        time: String(row.__REALTIME_TIMESTAMP ?? row.timestamp ?? ""),
        service: String(
          row.CONTAINER_NAME ?? row.SYSLOG_IDENTIFIER ?? "system",
        ),
        message: String(row.MESSAGE ?? "unknown error").slice(0, 500),
      };
    });
}

export async function readJournal(
  project: ProjectConfig,
): Promise<JournalSnapshot> {
  const body = await fetchText(`${project.journal.baseUrl}/entries`, {
    headers: { Accept: "application/json", Range: "entries=:-200:200" },
  });
  return parseJournal(body);
}
