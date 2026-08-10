import { describe, expect, it } from "vitest";
import type { ProjectConfig } from "../core/config.js";
import { buildFail2banSshArgs } from "./fail2ban.js";

const project = {
  fail2ban: {
    sshTarget: "ops-reader@10.77.0.1",
    hostKeyAlias: "2.26.8.245",
    keyPathEnv: "SSH_KEY",
    knownHostsPathEnv: "SSH_KNOWN_HOSTS",
  },
} as ProjectConfig;

describe("buildFail2banSshArgs", () => {
  it("uses only the explicit identity and pinned host-key database", () => {
    expect(
      buildFail2banSshArgs(project, "/protected/key", "/protected/known_hosts"),
    ).toEqual([
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
      "UserKnownHostsFile=/protected/known_hosts",
      "-o",
      "GlobalKnownHostsFile=/dev/null",
      "-o",
      "HostKeyAlias=2.26.8.245",
      "-i",
      "/protected/key",
      "ops-reader@10.77.0.1",
      "fail2ban-status",
    ]);
  });
});
