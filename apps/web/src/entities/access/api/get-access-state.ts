import { createServerFn } from "@tanstack/react-start";
import { loadAccessState } from "./access-state.server";

/** The visitor's access; a route loader awaits it before loading paid modules. */
export const getAccessState = createServerFn({ method: "GET" }).handler(() =>
  loadAccessState(),
);
