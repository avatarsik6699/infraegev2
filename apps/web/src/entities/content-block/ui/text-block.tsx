import type { TextBlockData } from "~/entities/content/model/types";

type Props = { data: TextBlockData };

/** Renders theory prose. Plain paragraphs for M0 — Markdown rendering can be added later without
 * a schema change, since `markdown` is already a plain string field. */
export const TextBlock: React.FC<Props> = (props) => {
  return (
    <>
      {props.data.markdown.split("\n\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
};
