import type {
  CalloutBlockData,
  CodeExampleBlockData,
  ContentBlock,
  DiagramBlockData,
  FigureBlockData,
  TableDiagramBlockData,
  TextBlockData,
  VideoEmbedBlockData,
  WorkedExampleBlockData,
} from "~/entities/content";
import { CalloutBlock } from "./callout-block";
import { CodeExampleBlock } from "./code-example-block";
import { DiagramBlock } from "./diagram-block";
import { FigureBlock } from "./figure-block";
import { TableDiagramBlock } from "./table-diagram-block";
import { TextBlock } from "./text-block";
import { VideoEmbedBlock } from "./video-embed-block";
import { WorkedExampleBlock } from "./worked-example-block";

type Props = { block: ContentBlock };

/** Dispatches a single ContentBlock to its renderer, by `type` (docs/SPEC.md §3/§5.2). */
export const ContentBlockRenderer: React.FC<Props> = (props) => {
  switch (props.block.type) {
    case "text":
      return <TextBlock data={props.block.data as TextBlockData} />;
    case "figure":
      return <FigureBlock data={props.block.data as FigureBlockData} />;
    case "diagram": {
      const data = props.block.data as
        | DiagramBlockData
        | TableDiagramBlockData;
      return data.kind === "bit-grid" ? (
        <TableDiagramBlock data={data} />
      ) : (
        <DiagramBlock data={data} />
      );
    }
    case "code_example":
      return (
        <CodeExampleBlock data={props.block.data as CodeExampleBlockData} />
      );
    case "worked_example":
    case "completion_exercise":
    case "productive_failure_prompt":
      return (
        <WorkedExampleBlock
          type={props.block.type}
          data={props.block.data as WorkedExampleBlockData}
        />
      );
    case "callout":
      return <CalloutBlock data={props.block.data as CalloutBlockData} />;
    case "video_embed":
      return (
        <VideoEmbedBlock data={props.block.data as VideoEmbedBlockData} />
      );
    default:
      return null;
  }
};
