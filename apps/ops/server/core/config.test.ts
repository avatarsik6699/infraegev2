import { describe, expect, it } from "vitest";
import { parseConfig } from "./config.js";

const project = {
  id: "x",
  name: "X",
  publicUrl: "https://x.test",
  beszel: {
    baseUrl: "http://b.test",
    systemId: "1",
    emailEnv: "B_E",
    passwordEnv: "B_P",
  },
  umami: {
    baseUrl: "http://u.test",
    websiteId: "1",
    usernameEnv: "U_E",
    passwordEnv: "U_P",
  },
  journal: { baseUrl: "http://j.test" },
  fail2ban: {
    sshTarget: "reader@10.0.0.1",
    hostKeyAlias: "public-host.example",
    keyPathEnv: "SSH_KEY",
    knownHostsPathEnv: "SSH_KNOWN_HOSTS",
  },
};

describe("parseConfig", () => {
  it("accepts a versioned project and defaults the analytics timezone", () => {
    const parsed = parseConfig({ version: 1, projects: [project] });
    expect(parsed.projects[0]).toMatchObject({
      id: "x",
      umami: { timezone: "UTC" },
    });
  });

  it("rejects duplicate ids", () => {
    expect(() =>
      parseConfig({ version: 1, projects: [project, project] }),
    ).toThrow("Duplicate");
  });

  it.each([
    [{ ...project, publicUrl: "file:///tmp/x" }, "Invalid URL protocol"],
    [
      { ...project, beszel: { ...project.beszel, emailEnv: "not-valid" } },
      "Invalid environment variable name",
    ],
    [
      { ...project, umami: { ...project.umami, timezone: "Mars/Olympus" } },
      "Invalid IANA timezone",
    ],
    [
      {
        ...project,
        fail2ban: { ...project.fail2ban, knownHostsPathEnv: "not-valid" },
      },
      "Invalid environment variable name",
    ],
  ])("rejects invalid provider configuration", (candidate, message) => {
    expect(() => parseConfig({ version: 1, projects: [candidate] })).toThrow(
      message,
    );
  });
});
