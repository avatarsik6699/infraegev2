import { useCallback, useState } from "react";
import { usePersistedStoreHydration } from "~/shared/lib/use-persisted-store-hydration";
import type { LessonProgressTypes } from "./lesson-progress.types";
import { LessonProgressStoreProvider } from "./model/lesson-progress-context";
import { createLessonProgressRegistry } from "./model/lesson-progress-registry";
import { lessonProgressStorage } from "./model/lesson-progress-storage";

export const LessonProgressProvider: React.FC<
  LessonProgressTypes.ProviderProps
> = (props) => {
  const [store] = useState(createLessonProgressRegistry);

  const setHydrated = useCallback(
    () => store.getState().setHydrated(),
    [store],
  );
  usePersistedStoreHydration(
    store,
    lessonProgressStorage.subscribe,
    setHydrated,
  );

  return (
    <LessonProgressStoreProvider store={store}>
      {props.children}
    </LessonProgressStoreProvider>
  );
};
