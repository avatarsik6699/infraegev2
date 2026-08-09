import type { TextBlockData } from "~/entities/content";
import { Typography } from "~/shared/components/typography";

type Props = { data: TextBlockData };

/** Renders theory prose. Plain paragraphs for M0 — Markdown rendering can be added later without
 * a schema change, since `markdown` is already a plain string field. */
export const TextBlock: React.FC<Props> = (props) => {
  return (
    <Typography.Prose>
      {props.data.markdown.split("\n\n").map((paragraph, index) => (
        <Typography.Text key={index}>{paragraph}</Typography.Text>
      ))}
    </Typography.Prose>
  );
};
