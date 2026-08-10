import { readFile } from "node:fs/promises";

export type ProjectConfig = {
  id: string;
  name: string;
  publicUrl: string;
  beszel: {
    baseUrl: string;
    systemId: string;
    emailEnv: string;
    passwordEnv: string;
  };
  umami: {
    baseUrl: string;
    websiteId: string;
    usernameEnv: string;
    passwordEnv: string;
    timezone: string;
  };
  journal: { baseUrl: string };
  fail2ban: {
    sshTarget: string;
    hostKeyAlias: string;
    keyPathEnv: string;
    knownHostsPathEnv: string;
  };
};

export type OpsConfig = { version: 1; projects: ProjectConfig[] };

function record(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid config section: ${field}`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid config field: ${field}`);
  }
  return value.trim();
}

function url(value: unknown, field: string): string {
  const candidate = text(value, field);
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`Invalid URL config field: ${field}`);
  }
  if (!new Set(["http:", "https:"]).has(parsed.protocol)) {
    throw new Error(`Invalid URL protocol in config field: ${field}`);
  }
  return candidate.replace(/\/$/, "");
}

function environmentName(value: unknown, field: string): string {
  const candidate = text(value, field);
  if (!/^[A-Z_][A-Z0-9_]*$/.test(candidate)) {
    throw new Error(`Invalid environment variable name: ${field}`);
  }
  return candidate;
}

function timezone(value: unknown, field: string): string {
  const candidate = value === undefined ? "UTC" : text(value, field);
  try {
    new Intl.DateTimeFormat("en", { timeZone: candidate }).format();
  } catch {
    throw new Error(`Invalid IANA timezone in config field: ${field}`);
  }
  return candidate;
}

function parseProject(value: unknown, index: number): ProjectConfig {
  const item = record(value, `projects[${index}]`);
  const beszel = record(item.beszel, `projects[${index}].beszel`);
  const umami = record(item.umami, `projects[${index}].umami`);
  const journal = record(item.journal, `projects[${index}].journal`);
  const fail2ban = record(item.fail2ban, `projects[${index}].fail2ban`);

  return {
    id: text(item.id, `projects[${index}].id`),
    name: text(item.name, `projects[${index}].name`),
    publicUrl: url(item.publicUrl, `projects[${index}].publicUrl`),
    beszel: {
      baseUrl: url(beszel.baseUrl, `projects[${index}].beszel.baseUrl`),
      systemId: text(beszel.systemId, `projects[${index}].beszel.systemId`),
      emailEnv: environmentName(
        beszel.emailEnv,
        `projects[${index}].beszel.emailEnv`,
      ),
      passwordEnv: environmentName(
        beszel.passwordEnv,
        `projects[${index}].beszel.passwordEnv`,
      ),
    },
    umami: {
      baseUrl: url(umami.baseUrl, `projects[${index}].umami.baseUrl`),
      websiteId: text(umami.websiteId, `projects[${index}].umami.websiteId`),
      usernameEnv: environmentName(
        umami.usernameEnv,
        `projects[${index}].umami.usernameEnv`,
      ),
      passwordEnv: environmentName(
        umami.passwordEnv,
        `projects[${index}].umami.passwordEnv`,
      ),
      timezone: timezone(umami.timezone, `projects[${index}].umami.timezone`),
    },
    journal: {
      baseUrl: url(journal.baseUrl, `projects[${index}].journal.baseUrl`),
    },
    fail2ban: {
      sshTarget: text(
        fail2ban.sshTarget,
        `projects[${index}].fail2ban.sshTarget`,
      ),
      hostKeyAlias: text(
        fail2ban.hostKeyAlias,
        `projects[${index}].fail2ban.hostKeyAlias`,
      ),
      keyPathEnv: environmentName(
        fail2ban.keyPathEnv,
        `projects[${index}].fail2ban.keyPathEnv`,
      ),
      knownHostsPathEnv: environmentName(
        fail2ban.knownHostsPathEnv,
        `projects[${index}].fail2ban.knownHostsPathEnv`,
      ),
    },
  };
}

export function parseConfig(value: unknown): OpsConfig {
  const input = record(value, "root");
  if (input.version !== 1 || !Array.isArray(input.projects) || input.projects.length === 0) {
    throw new Error("Config must use version 1 and contain projects");
  }

  const projects = input.projects.map(parseProject);
  const ids = new Set<string>();
  for (const project of projects) {
    if (ids.has(project.id)) throw new Error(`Duplicate project id: ${project.id}`);
    ids.add(project.id);
  }
  return { version: 1, projects };
}

export async function loadConfig(
  path = process.env.OPS_CONFIG_PATH ?? "config/projects.json",
): Promise<OpsConfig> {
  return parseConfig(JSON.parse(await readFile(path, "utf8")));
}
