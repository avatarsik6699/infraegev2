export class ContentNotFoundError extends Error {}

export interface ResolvedContentLink {
  id: string;
  title: string;
  href: string;
}
