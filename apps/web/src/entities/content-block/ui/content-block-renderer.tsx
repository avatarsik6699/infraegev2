import type {
  CalloutBlockData,
  CodeExampleBlockData,
  ContentBlock,
  DiagramBlockData,
  TableDiagramBlockData,
  TextBlockData,
  VideoEmbedBlockData,
  WorkedExampleBlockData,
} from "~/entities/content/model/types";
import { CalloutBlock } from "~/entities/content-block/ui/callout-block";
import { CodeExampleBlock } from "~/entities/content-block/ui/code-example-block";
import { DiagramBlock } from "~/entities/content-block/ui/diagram-block";
import { TableDiagramBlock } from "~/entities/content-block/ui/table-diagram-block";
import { TextBlock } from "~/entities/content-block/ui/text-block";
import { VideoEmbedBlock } from "~/entities/content-block/ui/video-embed-block";
import { WorkedExampleBlock } from "~/entities/content-block/ui/worked-example-block";

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
