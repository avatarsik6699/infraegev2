import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import styles from "./navigation-progress.module.css";

const PROGRESS_DELAY_MS = 150;

export const AppNavigationProgress: React.FC = () => {
  const loading = useRouterState().isLoading;
  const [visible, setVisible] = useState(false);

  useEffect(
    function synchronizeNavigationProgressFx() {
      const timer = setTimeout(
        () => setVisible(loading),
        loading ? PROGRESS_DELAY_MS : 0,
      );

      return () => clearTimeout(timer);
    },
    [loading],
  );

  return visible ? (
    <div
      className={styles.root}
      data-visible="true"
      role="progressbar"
      aria-label="Загрузка страницы"
      aria-valuetext="Загрузка"
    >
      <span className={styles.indicator} />
    </div>
  ) : null;
};
