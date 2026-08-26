import { enhancementState } from "./enhancement-state";
import { useExternalStoreValue } from "./use-external-store-value";

export function useIsEnhanced(): boolean {
  return useExternalStoreValue({
    subscribe: enhancementState.subscribe,
    getSnapshot: enhancementState.getClientSnapshot,
    getServerSnapshot: enhancementState.getServerSnapshot,
  });
}
