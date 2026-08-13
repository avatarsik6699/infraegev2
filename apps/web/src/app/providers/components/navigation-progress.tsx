import {
  completeNavigationProgress,
  NavigationProgress,
  startNavigationProgress,
} from "@mantine/nprogress";
import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

const PROGRESS_DELAY_MS = 150;

export const AppNavigationProgress: React.FC = () => {
  const loading = useRouterState().isLoading;

  useEffect(
    function synchronizeNavigationProgressFx() {
      if (!loading) {
        completeNavigationProgress();
        return;
      }

      const timer = setTimeout(startNavigationProgress, PROGRESS_DELAY_MS);
      return () => clearTimeout(timer);
    },
    [loading],
  );

  return (
    <NavigationProgress aria-label="Загрузка страницы" color="ember" size={3} />
  );
};
