import { createServerFn } from "@tanstack/react-start";
import {
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { loadPracticeCatalog, practiceCatalog } from "~/entities/practice-task";

export const getPracticeCatalog = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => practiceCatalog.search(data))
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    const result = await loadPracticeCatalog(data);
    if (result.status !== "ready")
      setResponseStatus(result.status === "invalid" ? 400 : 503);
    return result;
  });
