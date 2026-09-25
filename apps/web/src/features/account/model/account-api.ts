import { apiClient, ApiError } from "~/shared/api";

function ensure(response: { response: Response }) {
  if (!response.response.ok)
    throw new ApiError("http", "Account request returned an HTTP error", {
      status: response.response.status,
    });
}

export const accountApi = {
  register: async (email: string, password: string) => {
    const response = await apiClient.POST("/api/auth/register", {
      body: {
        email,
        password,
        privacy_consent: true,
        privacy_consent_version: "2026-09-25",
      },
    });
    ensure(response);
  },
  addEmailMethod: async (
    email: string,
    password: string,
    csrfToken: string | null,
  ) => {
    const response = await apiClient.POST("/api/auth/account/email-method", {
      body: { email, password },
      headers: { "x-csrf-token": csrfToken },
    });
    ensure(response);
  },
  login: async (email: string, password: string) => {
    const response = await apiClient.POST("/api/auth/login", {
      body: { email, password },
    });
    ensure(response);
  },
  requestVerification: async (email: string) => {
    const response = await apiClient.POST("/api/auth/verification/request", {
      body: { email },
    });
    ensure(response);
  },
  verifyEmail: async (token: string) => {
    const response = await apiClient.POST("/api/auth/verify-email", {
      body: { token },
    });
    ensure(response);
  },
  requestPasswordReset: async (email: string, returnTo?: string) => {
    const response = await apiClient.POST("/api/auth/password-reset/request", {
      body: { email, return_to: returnTo === "/account" ? "/account" : null },
    });
    ensure(response);
  },
  confirmPasswordReset: async (token: string, password: string) => {
    const response = await apiClient.POST("/api/auth/password-reset/confirm", {
      body: { token, password },
    });
    ensure(response);
  },
  logout: async (csrfToken: string | null) => {
    const response = await apiClient.POST("/api/auth/logout", {
      headers: { "x-csrf-token": csrfToken },
    });
    ensure(response);
  },
  linkProvider: async (provider: string, csrfToken: string | null) => {
    const response = await apiClient.POST(
      "/api/auth/providers/{provider}/link",
      {
        params: { path: { provider } },
        headers: { "x-csrf-token": csrfToken },
      },
    );
    ensure(response);
    return response.data?.url;
  },
  reauthenticateProvider: async (
    provider: string,
    csrfToken: string | null,
  ) => {
    const response = await apiClient.POST(
      "/api/auth/providers/{provider}/reauth",
      {
        params: { path: { provider } },
        headers: { "x-csrf-token": csrfToken },
      },
    );
    ensure(response);
    return response.data?.url;
  },
  deleteAccount: async (csrfToken: string | null, password?: string) => {
    const response = await apiClient.DELETE("/api/auth/account", {
      body: { confirmation: "DELETE", password },
      headers: { "x-csrf-token": csrfToken },
    });
    ensure(response);
  },
  resetLesson: async (
    contextKind: "topic_lesson" | "course_lesson",
    contextId: string,
    csrfToken: string | null,
  ) => {
    const response = await apiClient.DELETE(
      "/api/progress/{context_kind}/{context_id}",
      {
        params: { path: { context_kind: contextKind, context_id: contextId } },
        headers: { "x-csrf-token": csrfToken },
      },
    );
    ensure(response);
  },
  unlinkProvider: async (provider: string, csrfToken: string | null) => {
    const response = await apiClient.DELETE("/api/auth/providers/{provider}", {
      params: { path: { provider } },
      headers: { "x-csrf-token": csrfToken },
    });
    ensure(response);
  },
};
