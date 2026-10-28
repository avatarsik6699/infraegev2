import type { LaunchOptions } from "@playwright/test";

/**
 * Change 234: Playwright starts Chromium with --disable-dev-shm-usage, so its shared memory
 * lives in unlinked files under /tmp. On the WSL disk that is gigabytes per run, invisible to
 * `du`, and ends in ENOSPC, ERR_INSUFFICIENT_RESOURCES and failed dynamic imports.
 * /dev/shm is large here and on GitHub runners, so Chromium keeps its own default.
 */
export const chromiumLaunch: LaunchOptions = {
  ignoreDefaultArgs: ["--disable-dev-shm-usage"],
};
