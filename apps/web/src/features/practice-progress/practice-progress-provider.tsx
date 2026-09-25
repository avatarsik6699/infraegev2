import { useEffect, useState } from "react";
import { apiClient } from "~/shared/api";
import {
  practiceProgress,
  PracticeProgressStoreProvider,
} from "./model/practice-progress";

export const PracticeProgressProvider: React.FC<
  React.PropsWithChildren<{ accountId?: string }>
> = (props) => {
  const [store] = useState(() => practiceProgress.create(props.accountId));
  useEffect(() => {
    if (!props.accountId) {
      store.getState().setHydrated();
      return;
    }
    let active = true;
    void apiClient
      .GET("/api/progress")
      .then(({ data, response }) => {
        if (!active) return;
        if (response.ok && data)
          store.getState().replaceFromServer(data.results);
        else store.getState().setUnavailable();
      })
      .catch(() => {
        if (active) store.getState().setUnavailable();
      });
    return () => {
      active = false;
    };
  }, [props.accountId, store]);
  return (
    <PracticeProgressStoreProvider store={store}>
      {props.children}
    </PracticeProgressStoreProvider>
  );
};
