import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import {
  loadPracticeSuggestions,
  practiceCatalog,
} from "~/entities/practice-task";

/** Change 191 (F2): search suggestions for the catalog's current filters. */
export const getPracticeSuggestions = createServerFn({ method: "GET" })
  .validator((data: Record<string, unknown>) => practiceCatalog.search(data))
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    return loadPracticeSuggestions(data);
  });
