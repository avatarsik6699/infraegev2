import { createServerFn } from "@tanstack/react-start";
import { loadOffer } from "./offer.server";

/** Plans and the offer version for prices on the paywall, /pricing and checkout. */
export const getOffer = createServerFn({ method: "GET" }).handler(() =>
  loadOffer(),
);
