export namespace AccessTypes {
  /** The visitor's paid access as SSR learns it (Change 192, SPEC §6.1). */
  export type State =
    | {
        status: "ready";
        /** Off: every material is free and paid modules load for everyone. */
        paywall: boolean;
        signedIn: boolean;
        /** Paid modules may load: an active grant, or the paywall is off. */
        granted: boolean;
        until: string | null;
      }
    /** The API did not answer: paid text stays closed, never shown on a guess. */
    | { status: "unavailable" };
}
