import { safeLs, type SafeLsKey } from "~/shared/lib/safe-ls";

export type MailPurpose = "verification" | "recovery";

const cooldownKeys: Record<MailPurpose, SafeLsKey<number>> = {
  verification: {
    key: "auth-verification-cooldown-v1",
    version: 1,
    guard: (value): value is number =>
      typeof value === "number" && Number.isFinite(value),
  },
  recovery: {
    key: "auth-recovery-cooldown-v1",
    version: 1,
    guard: (value): value is number =>
      typeof value === "number" && Number.isFinite(value),
  },
};

export const mailCooldown = {
  remaining(purpose: MailPurpose): number {
    const lastSentAt = safeLs.get(cooldownKeys[purpose]);
    if (lastSentAt === null) return 0;
    return Math.max(0, Math.ceil((lastSentAt + 60_000 - Date.now()) / 1_000));
  },
  markSent(purpose: MailPurpose): void {
    safeLs.set(cooldownKeys[purpose], Date.now());
  },
};
