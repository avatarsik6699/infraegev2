import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { installGlobalErrorReporter } from "~/shared/lib/client-errors";

export const ClientErrorMonitor: React.FC = () => {
  const routeId = useRouterState().matches.at(-1)?.routeId ?? "/";
  const routeIdRef = useRef(routeId);

  useEffect(
    function updateRouteIdFx() {
      routeIdRef.current = routeId;
    },
    [routeId],
  );

  useEffect(function installReporterFx() {
    return installGlobalErrorReporter(() => routeIdRef.current);
  }, []);

  return null;
};
