import { useEffect } from "react";

type HydratableStore = {
  persist: { rehydrate: () => Promise<void> | void };
};

export function usePersistedStoreHydration(
  store: HydratableStore,
  subscribe: (listener: () => void) => () => void,
  onHydrated: () => void,
): void {
  useEffect(
    function hydratePersistedStoreFx() {
      let active = true;
      const hydrate = async () => {
        await store.persist.rehydrate();
        if (active) onHydrated();
      };
      const unsubscribe = subscribe(() => void hydrate());
      void hydrate();
      return () => {
        active = false;
        unsubscribe();
      };
    },
    [onHydrated, store, subscribe],
  );
}
