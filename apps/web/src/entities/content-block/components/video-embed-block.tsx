import { AspectRatio, Paper } from "@mantine/core";
import type { VideoEmbedBlockData } from "~/entities/content";

type Props = { data: VideoEmbedBlockData };

export const VideoEmbedBlock: React.FC<Props> = (props) => {
  return (
    <Paper component="figure" withBorder p="sm" radius="sm">
      <AspectRatio ratio={16 / 9}>
        <iframe src={props.data.url} title={props.data.title} allowFullScreen />
      </AspectRatio>
      <figcaption>{props.data.title}</figcaption>
    </Paper>
  );
};
