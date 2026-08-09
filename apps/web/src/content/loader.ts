// Pure helpers — no filesystem access, safe to import from client-rendered code.
// Filesystem-touching content loading lives in `~/content/server-loaders` (createServerFn-wrapped,
// docs/SPEC.md §3/§5.1) since only the server can read content/.

export class ContentNotFoundError extends Error {}

export interface ResolvedContentLink {
  id: string;
  title: string;
  href: string;
}

/** Parses the `/theory/zadanie-{n}-{slug}` route param into a task number + topic id. */
export function parseTopicRouteSlug(routeSlug: string): {
  taskNumber: number;
  topicId: string;
} {
  const match = /^zadanie-(\d+)-(.+)$/.exec(routeSlug);
  if (!match) {
    throw new ContentNotFoundError(`Malformed topic route slug: ${routeSlug}`);
  }
  return { taskNumber: Number(match[1]), topicId: match[2] };
}
