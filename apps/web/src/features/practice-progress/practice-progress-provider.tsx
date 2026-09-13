import { useCallback, useState } from "react";
import { usePersistedStoreHydration } from "~/shared/lib/use-persisted-store-hydration";
import {
  practiceProgress,
  PracticeProgressStoreProvider,
} from "./model/practice-progress";

export const PracticeProgressProvider: React.FC<React.PropsWithChildren> = (
  props,
) => {
  const [store] = useState(practiceProgress.create);
  const onHydrated = useCallback(() => store.getState().setHydrated(), [store]);
  usePersistedStoreHydration(store, practiceProgress.subscribe, onHydrated);
  return (
    <PracticeProgressStoreProvider store={store}>
      {props.children}
    </PracticeProgressStoreProvider>
  );
};
