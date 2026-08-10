import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const viteCli = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));

const commands = [
  spawn(process.execPath, ["--watch", "--experimental-strip-types", "server/main.ts"], {
    stdio: "inherit",
  }),
  spawn(process.execPath, [viteCli], { stdio: "inherit" }),
];

function stop() {
  for (const child of commands) child.kill("SIGTERM");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of commands) child.on("exit", (code) => code && process.exit(code));
