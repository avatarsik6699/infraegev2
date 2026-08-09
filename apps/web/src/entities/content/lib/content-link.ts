export class ContentNotFoundError extends Error {}

export type ResolvedContentLink = {
  id: string;
  title: string;
  href: string;
};
