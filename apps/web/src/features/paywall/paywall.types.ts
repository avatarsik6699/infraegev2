export namespace PaywallTypes {
  /** What full access opens in the current topic or course (Change 192). */
  export type Unlocks = {
    lessons: readonly { title: string; lead?: string }[];
    /** Self-check questions of the paid parts. */
    questions: number;
    /** Paid tasks with an answer check; `undefined` when not counted here. */
    tasks?: number;
    /** «Практика и итог» is paid too. */
    practice: boolean;
  };
}
