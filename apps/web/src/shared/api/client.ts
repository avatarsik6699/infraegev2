import createClient from "openapi-fetch";
import { clientEnv } from "~/shared/config/client-env";
import type { paths } from "./schema";

/** The only runtime HTTP transport. Domain operations remain in their owning slice's `api/`. */
export const createApiClient = (baseUrl: string) =>
  createClient<paths>({
    baseUrl,
    fetch: (request) => fetch(request),
  });

export const apiClient = createApiClient(clientEnv.apiBasePath);
