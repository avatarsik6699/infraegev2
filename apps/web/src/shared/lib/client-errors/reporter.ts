import type { components } from "~/shared/api/schema";
import { apiClient } from "~/shared/api/client";
import {
  createClientErrorReport,
  isChunkLoadError,
  listenForGlobalErrors,
} from "./browser-adapter";

type ClientErrorKind = components["schemas"]["ClientErrorReport"]["kind"];

const ROUTE_ID = /^\/[A-Za-z0-9_.$/-]+$/;
const MAX_REPORTS_PER_PAGE = 10;
const sentFingerprints = new Set<string>();

function safeRouteId(routeId: string) {
  return routeId.length <= 100 && ROUTE_ID.test(routeId) ? routeId : "/";
}

export async function reportClientError(
  kind: ClientErrorKind,
  routeId: string,
  error: unknown,
) {
  try {
    if (sentFingerprints.size >= MAX_REPORTS_PER_PAGE) {
      return;
    }

    const report = await createClientErrorReport(
      kind,
      safeRouteId(routeId),
      error,
    );
    if (sentFingerprints.has(report.fingerprint)) {
      return;
    }

    sentFingerprints.add(report.fingerprint);
    await apiClient.POST("/api/client-errors", { body: report });
  } catch {
    // Diagnostics must never create another user-visible error or rejection.
  }
}

export function installGlobalErrorReporter(getRouteId: () => string) {
  return listenForGlobalErrors({
    onError: (error) => {
      void reportClientError(
        isChunkLoadError(error) ? "chunk_load" : "unhandled_error",
        getRouteId(),
        error,
      );
    },
    onRejection: (reason) => {
      void reportClientError(
        isChunkLoadError(reason) ? "chunk_load" : "unhandled_rejection",
        getRouteId(),
        reason,
      );
    },
  });
}

export function resetClientErrorReporterForTests() {
  sentFingerprints.clear();
}
