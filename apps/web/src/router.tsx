import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { QueryClient } from "@tanstack/react-query";
import { createAppQueryClient, RouteError, RouteNotFound } from "~/app";
import { routeTree } from "./routeTree.gen";

export type AppRouterContext = { queryClient: QueryClient };

export function getRouter() {
  const queryClient = createAppQueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: RouteNotFound,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}
