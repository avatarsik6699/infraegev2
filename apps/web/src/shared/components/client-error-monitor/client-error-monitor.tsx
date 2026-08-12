import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { installGlobalErrorReporter } from "~/shared/lib/client-errors";

export const ClientErrorMonitor: React.FC = () => {
  const routeId = useRouterState({
    select: (state) => state.matches.at(-1)?.routeId ?? "/",
  });
  const routeIdRef = useRef(routeId);

  useEffect(() => {
    routeIdRef.current = routeId;
  }, [routeId]);

  useEffect(() => installGlobalErrorReporter(() => routeIdRef.current), []);

  return null;
};
