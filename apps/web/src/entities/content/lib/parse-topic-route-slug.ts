import { ContentNotFoundError } from "~/entities/content/lib/content-link";

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
