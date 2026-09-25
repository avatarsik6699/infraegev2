import { createServerFn } from "@tanstack/react-start";
import { loadProviderAvailability } from "./provider-availability.server";

export const getProviderAvailability = createServerFn({
  method: "GET",
}).handler(() => loadProviderAvailability());
