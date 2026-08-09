import type {
  CalloutBlockData,
  CodeExampleBlockData,
  ContentBlock,
  DiagramBlockData,
  TableDiagramBlockData,
  TextBlockData,
  VideoEmbedBlockData,
  WorkedExampleBlockData,
} from "~/content/types";
import { CalloutBlock } from "~/components/content-blocks/CalloutBlock";
import { CodeExampleBlock } from "~/components/content-blocks/CodeExampleBlock";
import { DiagramBlock } from "~/components/content-blocks/DiagramBlock";
import { TableDiagramBlock } from "~/components/content-blocks/TableDiagramBlock";
import { TextBlock } from "~/components/content-blocks/TextBlock";
import { VideoEmbedBlock } from "~/components/content-blocks/VideoEmbedBlock";
import { WorkedExampleBlock } from "~/components/content-blocks/WorkedExampleBlock";

/** Dispatches a single ContentBlock to its renderer, by `type` (docs/SPEC.md §3/§5.2). */
export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return <TextBlock data={block.data as TextBlockData} />;
    case "diagram": {
      const data = block.data as DiagramBlockData | TableDiagramBlockData;
      return data.kind === "bit-grid" ? (
        <TableDiagramBlock data={data} />
      ) : (
        <DiagramBlock data={data} />
      );
    }
    case "code_example":
      return <CodeExampleBlock data={block.data as CodeExampleBlockData} />;
    case "worked_example":
    case "completion_exercise":
    case "productive_failure_prompt":
      return (
        <WorkedExampleBlock
          type={block.type}
          data={block.data as WorkedExampleBlockData}
        />
      );
    case "callout":
      return <CalloutBlock data={block.data as CalloutBlockData} />;
    case "video_embed":
      return <VideoEmbedBlock data={block.data as VideoEmbedBlockData} />;
    default:
      return null;
  }
}

export function ContentBlockList({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <ContentBlockRenderer key={i} block={block} />
      ))}
    </>
  );
}
