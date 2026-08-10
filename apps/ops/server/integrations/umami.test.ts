import { afterEach, describe, expect, it, vi } from "vitest";
import type { ProjectConfig } from "../core/config.js";
import { readUmami } from "./umami.js";

const project = {
  id: "x",
  name: "X",
  publicUrl: "https://x.test",
  beszel: {},
  umami: {
    baseUrl: "http://umami.test",
    websiteId: "website-id",
    usernameEnv: "TEST_UMAMI_USER",
    passwordEnv: "TEST_UMAMI_PASSWORD",
    timezone: "Europe/Moscow",
  },
  journal: {},
  fail2ban: {},
} as ProjectConfig;

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.TEST_UMAMI_USER;
  delete process.env.TEST_UMAMI_PASSWORD;
});

describe("readUmami", () => {
  it("requests and maps summary, traffic series and allowlisted funnel events", async () => {
    process.env.TEST_UMAMI_USER = "reader";
    process.env.TEST_UMAMI_PASSWORD = "password";
    const requestedUrls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(async (input) => {
        const url = String(input);
        requestedUrls.push(url);
        if (url.endsWith("/api/auth/login")) return Response.json({ token: "token" });
        if (url.includes("/pageviews?")) {
          return Response.json({
            pageviews: [{ x: "2026-08-10T10:00:00Z", y: 8 }],
            sessions: [{ x: "2026-08-10T10:00:00Z", y: 5 }],
          });
        }
        if (url.includes("/events/stats?")) {
          return Response.json({ data: { events: 3 } });
        }
        return Response.json({ visits: 5 });
      }),
    );

    const result = await readUmami(project, "1h");
    expect(result).toEqual({
      visits: 5,
      series: [
        {
          time: "2026-08-10T10:00:00Z",
          pageviews: 8,
          sessions: 5,
        },
      ],
      funnel: [
        { step: "topic_view", total: 3 },
        { step: "practice_start", total: 3 },
        { step: "practice_answer", total: 3 },
      ],
    });
    const pageviewsUrl = requestedUrls.find((url) => url.includes("/pageviews?"));
    expect(pageviewsUrl).toContain("unit=minute");
    expect(pageviewsUrl).toContain("timezone=Europe%2FMoscow");
  });
});
