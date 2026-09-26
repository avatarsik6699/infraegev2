const { execFileSync } = require("node:child_process");
const { isAbsolute } = require("node:path");

const lighthouseProfileDir = process.env.INFRAEGE_LIGHTHOUSE_PROFILE_DIR;
const target = process.env.INFRAEGE_LIGHTHOUSE_TARGET || "local";
if (!["local", "production"].includes(target)) {
  throw new Error("Lighthouse target must be local or production");
}
const production = target === "production";
const origin = production ? "https://infraege.ru" : "http://127.0.0.2:3200";

if (!lighthouseProfileDir || !isAbsolute(lighthouseProfileDir)) {
  throw new Error(
    "Run Lighthouse through `pnpm audit:performance` so its temporary Chrome profile is cleaned safely.",
  );
}

const chromePath =
  process.env.CHROME_PATH ||
  execFileSync(
    "pnpm",
    [
      "--filter",
      "web",
      "exec",
      "node",
      "-e",
      "import('@playwright/test').then(({ chromium }) => process.stdout.write(chromium.executablePath()))",
    ],
    { encoding: "utf8" },
  ).trim();

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      ...(production
        ? {}
        : {
            startServerCommand:
              "HOST=127.0.0.2 PORT=3200 pnpm --filter web start",
          }),
      startServerReadyPattern: "Listening on",
      startServerReadyTimeout: 30000,
      url: [
        `${origin}/`,
        `${origin}/ege`,
        `${origin}/courses`,
        `${origin}/courses/python`,
        `${origin}/ege/16-rekursiya`,
      ],
      chromePath,
      settings: {
        chromeFlags: `--no-sandbox --disable-dev-shm-usage --user-data-dir=${lighthouseProfileDir}`,
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": [
          "error",
          { minScore: 1, aggregationMethod: "median" },
        ],
        "categories:seo": [
          "error",
          { minScore: 1, aggregationMethod: "median" },
        ],
        "largest-contentful-paint": [
          "error",
          { maxNumericValue: 4000, aggregationMethod: "median" },
        ],
        "cumulative-layout-shift": [
          "error",
          { maxNumericValue: 0.1, aggregationMethod: "median" },
        ],
        "total-blocking-time": [
          "error",
          { maxNumericValue: 200, aggregationMethod: "median" },
        ],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
