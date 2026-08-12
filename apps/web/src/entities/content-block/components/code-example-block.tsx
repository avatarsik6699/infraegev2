import { Code, Paper } from "@mantine/core";
import { lazy, Suspense } from "react";
import type { CodeExampleBlockData } from "~/entities/content";

type Props = { data: CodeExampleBlockData };

const HighlightedCode = lazy(() => import("./highlighted-code"));

export const CodeExampleBlock: React.FC<Props> = (props) => {
  return (
    <Paper component="figure" withBorder p="md" radius="sm">
      <Suspense fallback={<Code block>{props.data.code}</Code>}>
        <HighlightedCode
          code={props.data.code}
          language={props.data.language}
        />
      </Suspense>
      {props.data.caption && <figcaption>{props.data.caption}</figcaption>}
    </Paper>
  );
};
