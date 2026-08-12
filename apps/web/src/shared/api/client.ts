import createClient from "openapi-fetch";
import { clientEnv } from "~/shared/config/client-env";
import type { paths } from "./schema";

/** The only runtime HTTP transport. Domain operations remain in their owning slice's `api/`. */
export const apiClient = createClient<paths>({
  baseUrl: clientEnv.apiBasePath,
  fetch: (request) => fetch(request),
});
