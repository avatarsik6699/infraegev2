import type { PersistStorage } from "zustand/middleware";
import type { SafeLsKey } from "./safe-ls";
import { safeLs } from "./safe-ls";

export function createSafeLsPersistStorage<TStored, TState = TStored>(
  definition: SafeLsKey<TStored>,
  transform: {
    read: (stored: TStored) => TState;
    write: (state: TState) => TStored;
  } = {
    read: (stored) => stored as unknown as TState,
    write: (state) => state as unknown as TStored,
  },
): PersistStorage<TState> {
  return {
    getItem: () => {
      const state = safeLs.get(definition);
      return state === null ? null : { state: transform.read(state) };
    },
    setItem: (_name, value) =>
      safeLs.set(definition, transform.write(value.state)),
    removeItem: () => safeLs.remove(definition),
  };
}
