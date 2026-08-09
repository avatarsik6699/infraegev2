import { Code, Paper } from "@mantine/core";
import type { CodeExampleBlockData } from "~/entities/content";

type Props = { data: CodeExampleBlockData };

export const CodeExampleBlock: React.FC<Props> = (props) => {
  return (
    <Paper component="figure" withBorder p="md" radius="sm">
      <Code block>{props.data.code}</Code>
      {props.data.caption && <figcaption>{props.data.caption}</figcaption>}
    </Paper>
  );
};
