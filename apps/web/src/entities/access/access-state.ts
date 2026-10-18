import type { AccessTypes } from "./access.types";

export const accessState = {
  /** Paid parts show locks and the paywall: the paywall is on and access is not granted.
   *  An unknown state shows no locks — the API is down, nothing is sold then. */
  locks(state: AccessTypes.State | undefined): boolean {
    return state?.status === "ready" && state.paywall && !state.granted;
  },
  /** Paid modules may load: the API granted access or the paywall is off. */
  opens(state: AccessTypes.State | undefined): boolean {
    return state?.status === "ready" && state.granted;
  },
};
