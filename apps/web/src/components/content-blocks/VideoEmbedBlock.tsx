import type { VideoEmbedBlockData } from "~/content/types";

export function VideoEmbedBlock({ data }: { data: VideoEmbedBlockData }) {
  return (
    <figure>
      <iframe src={data.url} title={data.title} allowFullScreen />
      <figcaption>{data.title}</figcaption>
    </figure>
  );
}
