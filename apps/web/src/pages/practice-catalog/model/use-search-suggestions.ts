import { useEffect, useRef, useState } from "react";
import type { PracticeCatalogTypes } from "~/entities/practice-task";
import { getPracticeSuggestions } from "../api/get-practice-suggestions";

const DELAY_MS = 200;
const MIN_LENGTH = 2;

export type PracticeSuggestions = Awaited<
  ReturnType<typeof getPracticeSuggestions>
>;

/**
 * Change 191 (F2): suggestions follow the typed text after a short pause;
 * a late response for an older text never replaces a newer one.
 */
export function useSearchSuggestions(
  search: PracticeCatalogTypes.Search,
  text: string,
) {
  const [result, setResult] = useState<{
    text: string;
    value: PracticeSuggestions;
  } | null>(null);
  const latest = useRef(0);
  const query = text.trim();
  const context = JSON.stringify({ ...search, q: undefined, page: undefined });
  useEffect(
    function loadSuggestionsFx() {
      const request = ++latest.current;
      if (query.length < MIN_LENGTH) return;
      const timer = setTimeout(() => {
        void getPracticeSuggestions({
          data: { ...(JSON.parse(context) as object), q: query },
        })
          .catch((): PracticeSuggestions => ({
            status: "unavailable",
            tasks: [],
            total: 0,
          }))
          .then((value) => {
            if (request !== latest.current) return;
            setResult({ text: query, value });
          });
      }, DELAY_MS);
      return () => clearTimeout(timer);
    },
    [query, context],
  );
  const active = query.length >= MIN_LENGTH;
  return {
    active,
    loading: active && result?.text !== query,
    // The previous list stays while the next one loads, so it never flickers.
    value: active ? (result?.value ?? null) : null,
  };
}
