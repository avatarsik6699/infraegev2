import type { components } from "~/shared/api/schema";

type ClientErrorKind = components["schemas"]["ClientErrorReport"]["kind"];
type ClientErrorReport = components["schemas"]["ClientErrorReport"];

const OWNED_ASSET_PATH = /^\/(?:_build|assets)\/[A-Za-z0-9._/-]+$/;
const STACK_FRAME = /(https?:\/\/[^\s)]+):(\d+):(\d+)\)?$/;

function ownedStackFrame(error: unknown) {
  if (!(error instanceof Error) || !error.stack) {
    return {};
  }

  for (const line of error.stack.split("\n")) {
    const match = STACK_FRAME.exec(line.trim());
    if (!match) {
      continue;
    }

    try {
      const frameUrl = new URL(match[1]);
      if (
        frameUrl.origin === window.location.origin &&
        OWNED_ASSET_PATH.test(frameUrl.pathname)
      ) {
        return {
          asset_path: frameUrl.pathname,
          line: Number(match[2]),
          column: Number(match[3]),
        };
      }
    } catch {
      // Malformed and cross-origin stack frames are intentionally discarded.
    }
  }

  return {};
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function createClientErrorReport(
  kind: ClientErrorKind,
  routeId: string,
  error: unknown,
): Promise<ClientErrorReport> {
  const frame = ownedStackFrame(error);
  const fingerprint = await sha256(
    [
      kind,
      frame.asset_path ?? "unknown",
      frame.line ?? 0,
      frame.column ?? 0,
    ].join(":"),
  );

  return { kind, route_id: routeId, fingerprint, ...frame };
}

export function isChunkLoadError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === "ChunkLoadError" ||
    /(?:dynamically imported module|loading chunk|failed to fetch)/i.test(
      error.message,
    )
  );
}

type GlobalErrorHandlers = {
  onError: (error: unknown) => void;
  onRejection: (reason: unknown) => void;
};

export function listenForGlobalErrors(handlers: GlobalErrorHandlers) {
  const handleError = (event: ErrorEvent) => handlers.onError(event.error);
  const handleRejection = (event: PromiseRejectionEvent) =>
    handlers.onRejection(event.reason);

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
  };
}
