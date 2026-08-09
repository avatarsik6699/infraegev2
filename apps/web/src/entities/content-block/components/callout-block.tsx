import { Alert } from "@mantine/core";
import type { CalloutBlockData } from "~/entities/content";
import { Typography } from "~/shared/components/typography";

type Props = { data: CalloutBlockData };

/** Author-written aside inside content_blocks (info/warning). For the auto-derived
 * prerequisite/related-topic navigation widget, see the `entities/content` public API. */
export const CalloutBlock: React.FC<Props> = (props) => {
  return (
    <Alert
      role="note"
      data-tone={props.data.tone}
      color={props.data.tone === "warning" ? "highlight" : "textbook"}
      variant="light"
    >
      <Typography.Text>{props.data.markdown}</Typography.Text>
    </Alert>
  );
};
