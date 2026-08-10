import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ProjectConfig } from "../core/config.js";
import type { Fail2banSnapshot } from "../modules/dashboard/schemas.js";
import { resolveCredential } from "./credentials.js";
import { INTEGRATION_TIMEOUT_MS } from "./http-client.js";

const execFileAsync = promisify(execFile);

export function buildFail2banSshArgs(
  project: ProjectConfig,
  keyPath: string,
  knownHostsPath: string,
): string[] {
  return [
    "-F",
    "/dev/null",
    "-n",
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=8",
    "-o",
    "IdentitiesOnly=yes",
    "-o",
    "IdentityAgent=none",
    "-o",
    "PasswordAuthentication=no",
    "-o",
    "KbdInteractiveAuthentication=no",
    "-o",
    "StrictHostKeyChecking=yes",
    "-o",
    `UserKnownHostsFile=${knownHostsPath}`,
    "-o",
    "GlobalKnownHostsFile=/dev/null",
    "-o",
    `HostKeyAlias=${project.fail2ban.hostKeyAlias}`,
    "-i",
    keyPath,
    project.fail2ban.sshTarget,
    "fail2ban-status",
  ];
}

export function parseFail2ban(output: string): Fail2banSnapshot {
  return output
    .split(/Status for the jail:\s*/)
    .slice(1)
    .map((block) => {
      const [jail = "unknown"] = block.trim().split(/\r?\n/, 1);
      const count = Number(block.match(/Currently banned:\s*(\d+)/)?.[1] ?? 0);
      const addresses = (block.match(/Banned IP list:\s*([^\r\n]*)/)?.[1] ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      return { jail: jail.trim(), count, addresses };
    });
}

export async function readFail2ban(
  project: ProjectConfig,
): Promise<Fail2banSnapshot> {
  const keyPath = resolveCredential(project.fail2ban.keyPathEnv);
  const knownHostsPath = resolveCredential(
    project.fail2ban.knownHostsPathEnv,
  );
  const { stdout } = await execFileAsync(
    "ssh",
    buildFail2banSshArgs(project, keyPath, knownHostsPath),
    { timeout: INTEGRATION_TIMEOUT_MS, maxBuffer: 128_000 },
  );
  const rows = parseFail2ban(stdout);
  if (rows.length === 0) throw new Error("fail2ban adapter returned no jail status");
  return rows;
}
