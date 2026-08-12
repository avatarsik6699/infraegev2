import { Stack } from "@mantine/core";
import { ContentBlockRenderer } from "./components/content-block-renderer";
import type { ContentBlockListTypes } from "./content-block-list.types";

export const ContentBlockList: React.FC<ContentBlockListTypes.Props> = (
  props,
) => {
  return (
    <Stack gap="md">
      {props.blocks.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </Stack>
  );
};
