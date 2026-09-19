import {
  defaultParseSearch,
  defaultStringifySearch,
} from "@tanstack/react-router";

// Native GET and enhanced navigation share literal search text and repeated topic keys.
export const routerSearch = {
  parse: (search: string) => {
    const parsed: Record<string, unknown> = { ...defaultParseSearch(search) };
    const params = new URLSearchParams(search);
    if (params.has("q")) parsed.q = params.get("q");
    return parsed;
  },
  stringify: (value: Record<string, unknown>) => {
    const { topics, q, ...rest } = value;
    const params = new URLSearchParams(defaultStringifySearch(rest));
    if (typeof q === "string" || typeof q === "number")
      params.set("q", String(q));
    if (Array.isArray(topics)) {
      for (const topic of topics)
        if (typeof topic === "string") params.append("topics", topic);
    } else if (typeof topics === "string") params.set("topics", topics);
    return params.size ? `?${params.toString()}` : "";
  },
};
