import type { TextBlockData } from "~/entities/content/model/types";

/** Renders theory prose. Plain paragraphs for M0 — Markdown rendering can be added later without
 * a schema change, since `markdown` is already a plain string field. */
export function TextBlock({ data }: { data: TextBlockData }) {
  return (
    <>
      {data.markdown.split("\n\n").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </>
  );
}
