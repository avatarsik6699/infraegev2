import { createContext, useContext, type PropsWithChildren } from "react";
import { useStore, type StoreApi } from "zustand";

export function createZustandScope<TState>(displayName: string) {
  const StoreContext = createContext<StoreApi<TState> | null>(null);
  StoreContext.displayName = `${displayName}Context`;

  const Provider: React.FC<PropsWithChildren<{ store: StoreApi<TState> }>> = (
    props: PropsWithChildren<{ store: StoreApi<TState> }>,
  ) => {
    return (
      <StoreContext.Provider value={props.store}>
        {props.children}
      </StoreContext.Provider>
    );
  };

  function useStoreApi(): StoreApi<TState> {
    const store = useContext(StoreContext);
    if (!store)
      throw new Error(`${displayName} must be used inside its provider`);
    return store;
  }

  function useSelector<T>(selector: (state: TState) => T): T {
    return useStore(useStoreApi(), selector);
  }

  return { Provider, useSelector, useStoreApi } as const;
}
