import type { VideoEmbedBlockData } from "~/entities/content/model/types";

type Props = { data: VideoEmbedBlockData };

export const VideoEmbedBlock: React.FC<Props> = (props) => {
  return (
    <figure>
      <iframe src={props.data.url} title={props.data.title} allowFullScreen />
      <figcaption>{props.data.title}</figcaption>
    </figure>
  );
};
