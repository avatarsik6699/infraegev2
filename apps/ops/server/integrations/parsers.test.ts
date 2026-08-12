import { describe, expect, it } from "vitest";
import { parseFail2ban } from "./fail2ban.js";
import { parseJournal } from "./journal.js";
import { parseTrafficSeries } from "./umami.js";

describe("source parsers", () => {
  it("merges Umami pageviews and sessions by timestamp", () => {
    expect(
      parseTrafficSeries({
        pageviews: [
          { x: "2026-08-10T10:00:00Z", y: 5 },
          { x: "2026-08-10T11:00:00Z", y: 8 },
        ],
        sessions: [{ x: "2026-08-10T10:00:00Z", y: 3 }],
      }),
    ).toEqual([
      {
        time: "2026-08-10T10:00:00Z",
        pageviews: 5,
        sessions: 3,
      },
      {
        time: "2026-08-10T11:00:00Z",
        pageviews: 8,
        sessions: 0,
      },
    ]);
  });

  it("converts forced-command fail2ban output into dashboard rows", () => {
    const output = `Status
|- Number of jail: 2
\`- Jail list: sshd, infraege-nginx-limit
Status for the jail: sshd
|- Filter
\`- Actions
   |- Currently banned: 2
   \`- Banned IP list: 192.0.2.1 198.51.100.2
Status for the jail: infraege-nginx-limit
\`- Actions
   |- Currently banned: 0
   \`- Banned IP list:
`;
    expect(parseFail2ban(output)).toEqual([
      { jail: "sshd", count: 2, addresses: ["192.0.2.1", "198.51.100.2"] },
      { jail: "infraege-nginx-limit", count: 0, addresses: [] },
    ]);
  });

  it("keeps only error-like journal rows and truncates messages", () => {
    const longMessage = `error ${"x".repeat(600)}`;
    const output = [
      JSON.stringify({ PRIORITY: "info", MESSAGE: "started" }),
      "not-json",
      JSON.stringify({
        PRIORITY: "error",
        MESSAGE: longMessage,
        SYSLOG_IDENTIFIER: "api",
      }),
    ].join("\n");
    expect(parseJournal(output)).toEqual([
      { time: "", service: "api", message: longMessage.slice(0, 500) },
    ]);
  });

  it("projects privacy-safe browser events into the existing incident table", () => {
    const output = JSON.stringify({
      PRIORITY: "info",
      __REALTIME_TIMESTAMP: "2026-08-12T10:00:00Z",
      MESSAGE: JSON.stringify({
        event: "client.error_reported",
        kind: "chunk_load",
        route_id: "/theory/$topicSlug",
        fingerprint: "a".repeat(64),
        asset_path: "/_build/topic.js",
      }),
    });

    expect(parseJournal(output)).toEqual([
      {
        time: "2026-08-12T10:00:00Z",
        service: "web",
        message:
          "chunk_load · /theory/$topicSlug · /_build/topic.js · aaaaaaaaaaaa",
      },
    ]);
  });
});
