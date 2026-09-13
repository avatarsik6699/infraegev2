import { createApiClient } from "~/shared/api";
import { practiceServerConfig } from "~/shared/config/practice.server";

export const practiceServerClient = createApiClient(
  practiceServerConfig.apiUrl,
);
