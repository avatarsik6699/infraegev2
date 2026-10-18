import { createApiClient } from "~/shared/api";
import { practiceServerConfig } from "~/shared/config/practice.server";
import type { BillingTypes } from "../billing.types";
import { toOffer } from "./billing-mapping";

const client = createApiClient(practiceServerConfig.apiUrl);
const TTL_MS = 60_000;
let cached: { at: number; offer: BillingTypes.Offer } | undefined;

/** Plans and the current offer version; the same for every visitor, so the
 *  process keeps them for a minute. `undefined` when the API does not answer. */
export async function loadOffer(): Promise<BillingTypes.Offer | undefined> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.offer;
  try {
    const result = await client.GET("/api/billing/offer", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!result.data || !result.response.ok) return cached?.offer;
    cached = { at: Date.now(), offer: toOffer(result.data) };
    return cached.offer;
  } catch {
    return cached?.offer;
  }
}
