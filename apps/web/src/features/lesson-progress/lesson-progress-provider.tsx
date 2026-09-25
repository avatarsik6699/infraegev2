import { useEffect, useState } from "react";
import { apiClient } from "~/shared/api";
import type { LessonProgressTypes } from "./lesson-progress.types";
import { LessonProgressStoreProvider } from "./model/lesson-progress-context";
import { createLessonProgressRegistry } from "./model/lesson-progress-registry";

export const LessonProgressProvider: React.FC<
  LessonProgressTypes.ProviderProps
> = (props) => {
  const [store] = useState(() => createLessonProgressRegistry(props.accountId));

  useEffect(() => {
    if (!props.accountId) return;
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
    <LessonProgressStoreProvider store={store}>
      {props.children}
    </LessonProgressStoreProvider>
  );
};
