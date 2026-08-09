import type { ContentBlock } from "~/entities/content/model/types";
import { ContentBlockRenderer } from "~/entities/content-block/ui/content-block-renderer";

type Props = { blocks: ContentBlock[] };

export const ContentBlockList: React.FC<Props> = (props) => {
  return (
    <>
      {props.blocks.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </>
  );
};
