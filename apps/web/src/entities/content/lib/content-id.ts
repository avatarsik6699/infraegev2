import { ContentNotFoundError } from "./content-link";

const CONTENT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Accept only the slug contract from SPEC.md §3 before an id reaches a filesystem path. */
export function parseContentId(value: string): string {
  if (!CONTENT_ID_PATTERN.test(value)) {
    throw new ContentNotFoundError(`Invalid content id: ${value}`);
  }
  return value;
}
