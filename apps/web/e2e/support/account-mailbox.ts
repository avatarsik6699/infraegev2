import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type CapturedMail = {
  recipient: string;
  subject: string;
  body: string;
};

let directory: string | undefined;

export function prepareAccountMailbox(): string {
  // Playwright reloads configuration in workers. They inherit the owner's mailbox;
  // only the original process creates/removes its directory.
  const inherited = process.env.INFRAEGE_ACCOUNT_MAILBOX;
  if (inherited) return inherited;
  if (directory) return join(directory, "mailbox.json");
  directory = mkdtempSync(join(tmpdir(), "infraege-account-e2e-"));
  process.once("exit", removeAccountMailbox);
  return join(directory, "mailbox.json");
}

export function readVerificationLink(mailbox: string): string {
  const mail = JSON.parse(readFileSync(mailbox, "utf8")) as CapturedMail;
  const match = /https?:\/\/[^\s]+\/verify-email\?token=[A-Za-z0-9_-]+/.exec(
    mail.body,
  );
  if (!match)
    throw new Error(
      "synthetic mailbox does not contain an email verification link",
    );
  return match[0];
}

export function removeAccountMailbox(): void {
  if (!directory) return;
  rmSync(directory, { force: true, recursive: true });
  directory = undefined;
}
