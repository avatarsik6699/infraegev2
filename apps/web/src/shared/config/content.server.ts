import path from "node:path";

export const contentServerConfig = {
  root: process.env.CONTENT_DIR ?? path.resolve(process.cwd(), "../../content"),
} as const;
