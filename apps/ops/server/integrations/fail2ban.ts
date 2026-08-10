import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ProjectConfig } from "../core/config.js";
import type { Fail2banSnapshot } from "../modules/dashboard/schemas.js";
import { resolveCredential } from "./credentials.js";
import { INTEGRATION_TIMEOUT_MS } from "./http-client.js";

const execFileAsync = promisify(execFile);

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
  const { stdout } = await execFileAsync(
    "ssh",
    [
      "-o",
      "BatchMode=yes",
      "-o",
      "ConnectTimeout=8",
      "-i",
      keyPath,
      project.fail2ban.sshTarget,
      "fail2ban-status",
    ],
    { timeout: INTEGRATION_TIMEOUT_MS, maxBuffer: 128_000 },
  );
  const rows = parseFail2ban(stdout);
  if (rows.length === 0) throw new Error("fail2ban adapter returned no jail status");
  return rows;
}
