import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  createAppQueryClient,
  RouteError,
  RouteNotFound,
  routerSearch,
} from "~/app";
import { routeTree } from "./routeTree.gen";

export type AppRouterContext = { queryClient: QueryClient };

export function getRouter() {
  const queryClient = createAppQueryClient();
  const router = createRouter({
    routeTree,
    parseSearch: (search) => routerSearch.parse(search),
    stringifySearch: (search) => routerSearch.stringify(search),
    context: { queryClient },
    scrollRestoration: true,
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: RouteNotFound,
  });
  setupRouterSsrQueryIntegration({ router, queryClient });
  return router;
}
