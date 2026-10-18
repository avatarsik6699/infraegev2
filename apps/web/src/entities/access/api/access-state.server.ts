import { setResponseHeader } from "@tanstack/react-start/server";
import { createApiClient } from "~/shared/api";
import { sessionCookie } from "~/shared/api/session-cookie.server";
import { practiceServerConfig } from "~/shared/config/practice.server";
import type { AccessTypes } from "../access.types";

const client = createApiClient(practiceServerConfig.apiUrl);

export async function loadAccessState(): Promise<AccessTypes.State> {
  const cookie = sessionCookie.header();
  // A page rendered for a session may carry its paid text: never cache it shared.
  if (cookie) setResponseHeader("Cache-Control", "private, no-store");
  try {
    const result = await client.GET("/api/access", {
      headers: cookie ? { cookie } : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!result.data || !result.response.ok) return { status: "unavailable" };
    return {
      status: "ready",
      paywall: result.data.paywall,
      signedIn: result.data.signed_in,
      granted: result.data.granted,
      until: result.data.until ?? null,
    };
  } catch {
    return { status: "unavailable" };
  }
}
