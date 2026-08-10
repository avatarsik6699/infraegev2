const { execFileSync } = require("node:child_process");

const chromePath = process.env.CHROME_PATH || execFileSync(
  "pnpm",
  ["--filter", "web", "exec", "node", "-e", "import('@playwright/test').then(({ chromium }) => process.stdout.write(chromium.executablePath()))"],
  { encoding: "utf8" },
).trim();

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: "HOST=127.0.0.2 PORT=3200 pnpm --filter web start",
      startServerReadyPattern: "Listening on",
      startServerReadyTimeout: 30000,
      url: ["http://127.0.0.2:3200/", "http://127.0.0.2:3200/theory/zadanie-1-graphs-and-tables"],
      chromePath,
      settings: { chromeFlags: "--no-sandbox --disable-dev-shm-usage" },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 1, aggregationMethod: "median" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median" }],
        "total-blocking-time": ["error", { maxNumericValue: 200, aggregationMethod: "median" }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
