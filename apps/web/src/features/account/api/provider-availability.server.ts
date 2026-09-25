import { createServerOnlyFn } from "@tanstack/react-start";
import { createApiClient } from "~/shared/api";
import { accountServerConfig } from "~/shared/config/account.server";

const providers = ["vk", "yandex", "telegram"] as const;
export type Provider = (typeof providers)[number];

export const loadProviderAvailability = createServerOnlyFn(
  async (): Promise<Provider[]> => {
    const response = await createApiClient(accountServerConfig.apiUrl).GET(
      "/api/auth/providers",
    );
    if (!response.response.ok || !response.data) return [];
    const enabled = response.data.enabled;
    return providers.filter((provider) => enabled.includes(provider));
  },
);
