import type { CodeExampleBlockData } from "~/entities/content/model/types";

type Props = { data: CodeExampleBlockData };

export const CodeExampleBlock: React.FC<Props> = (props) => {
  return (
    <figure>
      <pre>
        <code>{props.data.code}</code>
      </pre>
      {props.data.caption && <figcaption>{props.data.caption}</figcaption>}
    </figure>
  );
};
