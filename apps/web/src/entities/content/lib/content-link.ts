export class ContentNotFoundError extends Error {
  override readonly name = "ContentNotFoundError";
}

export function isContentNotFoundError(
  error: unknown,
): error is ContentNotFoundError {
  return (
    error instanceof ContentNotFoundError ||
    (error instanceof Error && error.name === "ContentNotFoundError")
  );
}

export type ResolvedContentLink = {
  id: string;
  title: string;
  href: string;
};
