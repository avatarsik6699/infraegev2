/**
 * Change 192: the offer and the refund rules live in `content/legal` as plain
 * Markdown (headings and paragraphs only). The API hashes the same files for
 * the acceptance journal, so the page shows exactly the text a buyer accepts.
 */
const offers = import.meta.glob<string>(
  "../../../../../../content/legal/oferta/*.md",
  { query: "?raw", import: "default", eager: true },
);
const refund = import.meta.glob<string>(
  "../../../../../../content/legal/vozvrat.md",
  { query: "?raw", import: "default", eager: true },
);

export type LegalBlock =
  | { kind: "title"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string };

export type OfferVersion = { version: string; text: string };

/** Offer versions, newest first; the file name is the version («2026-10-17»). */
export const offerVersions: readonly OfferVersion[] = Object.entries(offers)
  .map(([path, text]) => ({
    version: /(\d{4}-\d{2}-\d{2})\.md$/u.exec(path)?.[1] ?? "",
    text,
  }))
  .filter((offer) => offer.version)
  .sort((a, b) => b.version.localeCompare(a.version));

export const refundText: string = Object.values(refund)[0] ?? "";

/** The three kinds of lines the legal texts use; nothing else is rendered. */
export function legalBlocks(markdown: string): LegalBlock[] {
  return markdown
    .split(/\n{2,}/u)
    .map((chunk) => chunk.replace(/\s*\n\s*/gu, " ").trim())
    .filter(Boolean)
    .map((chunk): LegalBlock => {
      if (chunk.startsWith("## "))
        return { kind: "heading", text: chunk.slice(3) };
      if (chunk.startsWith("# "))
        return { kind: "title", text: chunk.slice(2) };
      return { kind: "paragraph", text: chunk };
    });
}
