import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { QueryClient } from "@tanstack/react-query";
import { createAppQueryClient } from "~/shared/lib/query-client";
import {
  RouteError,
  RouteNotFound,
  RoutePending,
} from "~/shared/components/route-state";
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
    defaultPendingComponent: RoutePending,
    defaultPendingMs: 250,
    defaultPendingMinMs: 300,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}
