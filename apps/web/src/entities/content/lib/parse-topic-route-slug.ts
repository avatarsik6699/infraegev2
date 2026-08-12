import { ContentNotFoundError } from "./content-link";
import { parseContentId } from "./content-id";

/** Parses the `/theory/zadanie-{n}-{slug}` route param into a task number + topic id. */
export function parseTopicRouteSlug(routeSlug: string): {
  taskNumber: number;
  topicId: string;
} {
  const match = /^zadanie-(\d+)-(.+)$/.exec(routeSlug);
  if (!match) {
    throw new ContentNotFoundError(`Malformed topic route slug: ${routeSlug}`);
  }
  return { taskNumber: Number(match[1]), topicId: parseContentId(match[2]) };
}
