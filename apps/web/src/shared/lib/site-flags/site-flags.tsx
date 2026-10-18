import { createContext, useContext } from "react";

/** Runtime switches the root route reads once per visit (Change 192). */
export type SiteFlags = {
  /** Selling is on: the footer links plans, the offer and refunds. */
  billing: boolean;
};

const SiteFlagsContext = createContext<SiteFlags>({ billing: false });

export const SiteFlagsProvider = SiteFlagsContext.Provider;

/** Off by default: without the root route nothing paid is linked. */
export const useSiteFlags = (): SiteFlags => useContext(SiteFlagsContext);
