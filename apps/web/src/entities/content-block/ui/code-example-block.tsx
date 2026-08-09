import type { CodeExampleBlockData } from "~/entities/content/model/types";

export function CodeExampleBlock({ data }: { data: CodeExampleBlockData }) {
  return (
    <figure>
      <pre>
        <code>{data.code}</code>
      </pre>
      {data.caption && <figcaption>{data.caption}</figcaption>}
    </figure>
  );
}
