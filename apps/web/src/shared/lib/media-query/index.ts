import { useMemo } from "react";
import { useExternalStoreValue } from "../use-external-store-value";
import { mediaQuery } from "./browser-adapter";

export const useMediaQuery = (query: string): boolean => {
  const store = useMemo(() => mediaQuery.createStore(query), [query]);
  return useExternalStoreValue(store);
};
